/* A GPU fluid simulation — Stam's "Stable Fluids" solved on the GPU with
   ping-ponged framebuffers.

   Written from scratch for this project: the 21st.dev component this replaces
   shipped only a thin canvas wrapper and imported its `createRenderer` from a
   file that wasn't included, so there was nothing to copy. The maths here is
   the standard textbook pipeline — advect, add vorticity, compute divergence,
   solve pressure with Jacobi iterations, subtract the gradient — which is
   public domain; only this implementation is ours.

   Kept deliberately dependency-free (no three.js, no ogl) because the whole
   site currently ships zero WebGL, and adding a 3D library to render two
   triangles would be a poor trade.

   Every colour comes from the site's own tokens (see PALETTE below), so the
   effect reads as Virgo rather than as a generic rainbow demo. */

type GL = WebGLRenderingContext | WebGL2RenderingContext;

export type FluidRendererOptions = {
  canvas: HTMLCanvasElement;
  /** Simulation grid resolution. Lower is cheaper; 128 is plenty behind text. */
  simResolution?: number;
  /** Dye (colour) resolution. Drives visual sharpness, not physics. */
  dyeResolution?: number;
  /** How quickly colour fades. Higher = shorter trails. */
  densityDissipation?: number;
  /** How quickly motion fades. */
  velocityDissipation?: number;
  /** Swirl strength. */
  curl?: number;
  /** Splat size. */
  splatRadius?: number;
  /** Emit occasional splats on its own, so the effect is alive before any
      pointer interaction (important: most visitors never move over it). */
  autoSplats?: boolean;
};

export type FluidRenderer = {
  /** Resolves once the first frame has been drawn, or rejects if WebGL is
      unavailable. Callers can ignore it; it exists so a wrapper can fall back. */
  ready: Promise<void>;
  /** Stops/starts the render loop. Callers should pause whenever the canvas
      is off-screen — a fluid sim left running below the fold is pure battery
      drain on a page this tall. */
  setPaused: (paused: boolean) => void;
  dispose: () => void;
};

/* The site's accent tokens, as linear-ish 0..1 RGB. Kept in sync with
   :root in src/index.css — --primary, --pop, --mint, --primary-deep. */
const PALETTE: [number, number, number][] = [
  [0.486, 0.227, 0.929], // --primary  #7C3AED
  [0.784, 0.941, 0.294], // --pop      #C8F04B
  [0.369, 0.918, 0.831], // --mint     #5EEAD4
  [0.392, 0.157, 0.851], // --primary-deep #6428D9
];

const VERT = `
precision highp float;
attribute vec2 aPosition;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform vec2 texelSize;
void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAG_COPY = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
uniform sampler2D uTexture;
void main () { gl_FragColor = texture2D(uTexture, vUv); }`;

const FRAG_SPLAT = `
precision highp float;
precision highp sampler2D;
varying vec2 vUv;
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;
void main () {
  vec2 p = vUv - point.xy;
  p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  vec3 base = texture2D(uTarget, vUv).xyz;
  gl_FragColor = vec4(base + splat, 1.0);
}`;

const FRAG_ADVECTION = `
precision highp float;
precision highp sampler2D;
varying vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;
void main () {
  vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
  vec4 result = texture2D(uSource, coord);
  float decay = 1.0 + dissipation * dt;
  gl_FragColor = result / decay;
}`;

const FRAG_DIVERGENCE = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).x;
  float R = texture2D(uVelocity, vR).x;
  float T = texture2D(uVelocity, vT).y;
  float B = texture2D(uVelocity, vB).y;
  vec2 C = texture2D(uVelocity, vUv).xy;
  if (vL.x < 0.0) { L = -C.x; }
  if (vR.x > 1.0) { R = -C.x; }
  if (vT.y > 1.0) { T = -C.y; }
  if (vB.y < 0.0) { B = -C.y; }
  float div = 0.5 * (R - L + T - B);
  gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
}`;

const FRAG_CURL = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).y;
  float R = texture2D(uVelocity, vR).y;
  float T = texture2D(uVelocity, vT).x;
  float B = texture2D(uVelocity, vB).x;
  float vorticity = R - L - T + B;
  gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}`;

const FRAG_VORTICITY = `
precision highp float;
precision highp sampler2D;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
void main () {
  float L = texture2D(uCurl, vL).x;
  float R = texture2D(uCurl, vR).x;
  float T = texture2D(uCurl, vT).x;
  float B = texture2D(uCurl, vB).x;
  float C = texture2D(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity += force * dt;
  velocity = min(max(velocity, -1000.0), 1000.0);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}`;

const FRAG_PRESSURE = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main () {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  float divergence = texture2D(uDivergence, vUv).x;
  float pressure = (L + R + B + T - divergence) * 0.25;
  gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
}`;

const FRAG_GRADIENT_SUBTRACT = `
precision mediump float;
precision mediump sampler2D;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}`;

/* Final pass. Slight tone shaping so the dye reads as a glow on black rather
   than flat colour, and so the darkest areas stay genuinely black (this sits
   behind white text — contrast matters more than fidelity). */
const FRAG_DISPLAY = `
precision highp float;
precision highp sampler2D;
varying vec2 vUv;
uniform sampler2D uTexture;
void main () {
  vec3 c = texture2D(uTexture, vUv).rgb;
  c = c / (1.0 + c);          // reinhard-ish rolloff, keeps highlights sane
  c = pow(c, vec3(0.85));      // lift midtones a little
  gl_FragColor = vec4(c, 1.0);
}`;

type FBO = {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (id: number) => number;
};

type DoubleFBO = {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap: () => void;
};

type Program = {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
};

function compileShader(gl: GL, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('createShader failed');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`shader compile failed: ${log ?? 'unknown'}`);
  }
  return shader;
}

function createProgram(gl: GL, vertSource: string, fragSource: string): Program {
  const vert = compileShader(gl, gl.VERTEX_SHADER, vertSource);
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSource);
  const program = gl.createProgram();
  if (!program) throw new Error('createProgram failed');
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  // Shaders are reference-counted by the program; detach so they free on delete.
  gl.detachShader(program, vert);
  gl.detachShader(program, frag);
  gl.deleteShader(vert);
  gl.deleteShader(frag);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`program link failed: ${log ?? 'unknown'}`);
  }

  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
  for (let i = 0; i < count; i += 1) {
    const info = gl.getActiveUniform(program, i);
    if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
  }
  return { program, uniforms };
}

export function createRenderer(options: FluidRendererOptions): FluidRenderer {
  const {
    canvas,
    simResolution = 128,
    dyeResolution = 512,
    densityDissipation = 1.4,
    velocityDissipation = 0.25,
    curl: curlStrength = 26,
    splatRadius = 0.0022,
    autoSplats = true,
  } = options;

  let disposed = false;
  let rafId = 0;
  let resolveReady: () => void;
  let rejectReady: (e: Error) => void;
  const ready = new Promise<void>((res, rej) => {
    resolveReady = res;
    rejectReady = rej;
  });

  const contextAttribs: WebGLContextAttributes = {
    alpha: false,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false,
    powerPreference: 'low-power',
  };

  const gl2 = canvas.getContext('webgl2', contextAttribs) as WebGL2RenderingContext | null;
  const gl: GL | null =
    gl2 ?? (canvas.getContext('webgl', contextAttribs) as WebGLRenderingContext | null);

  if (!gl) {
    // No WebGL at all — the wrapper keeps its CSS gradient fallback.
    rejectReady!(new Error('WebGL unavailable'));
    return { ready, setPaused: () => {}, dispose: () => {} };
  }

  const isWebGL2 = gl2 !== null;

  // Half-float render targets. Without these the sim can't hold signed
  // velocity properly, so bail to the CSS fallback rather than look wrong.
  let halfFloatType: number;
  let linearFiltering: boolean;
  if (isWebGL2) {
    gl.getExtension('EXT_color_buffer_float');
    linearFiltering = gl.getExtension('OES_texture_float_linear') !== null;
    halfFloatType = (gl as WebGL2RenderingContext).HALF_FLOAT;
  } else {
    const ext = gl.getExtension('OES_texture_half_float');
    linearFiltering = gl.getExtension('OES_texture_half_float_linear') !== null;
    if (!ext) {
      rejectReady!(new Error('half-float textures unsupported'));
      return { ready, setPaused: () => {}, dispose: () => {} };
    }
    halfFloatType = (ext as { HALF_FLOAT_OES: number }).HALF_FLOAT_OES;
  }

  function supportedFormat(internal: number, format: number, type: number) {
    const g = gl as GL;
    const tex = g.createTexture();
    g.bindTexture(g.TEXTURE_2D, tex);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.NEAREST);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.NEAREST);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
    g.texImage2D(g.TEXTURE_2D, 0, internal, 4, 4, 0, format, type, null);
    const fb = g.createFramebuffer();
    g.bindFramebuffer(g.FRAMEBUFFER, fb);
    g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, tex, 0);
    const ok = g.checkFramebufferStatus(g.FRAMEBUFFER) === g.FRAMEBUFFER_COMPLETE;
    g.bindFramebuffer(g.FRAMEBUFFER, null);
    g.deleteFramebuffer(fb);
    g.deleteTexture(tex);
    return ok;
  }

  // WebGL2 has dedicated single/two-channel float formats; WebGL1 uses RGBA
  // for everything.
  const g2 = gl as WebGL2RenderingContext;
  let rgbaInternal: number = gl.RGBA;
  let rgInternal: number = gl.RGBA;
  let rInternal: number = gl.RGBA;
  let rgFormat: number = gl.RGBA;
  let rFormat: number = gl.RGBA;

  if (isWebGL2) {
    if (supportedFormat(g2.RGBA16F, gl.RGBA, halfFloatType)) rgbaInternal = g2.RGBA16F;
    if (supportedFormat(g2.RG16F, g2.RG, halfFloatType)) {
      rgInternal = g2.RG16F;
      rgFormat = g2.RG;
    }
    if (supportedFormat(g2.R16F, g2.RED, halfFloatType)) {
      rInternal = g2.R16F;
      rFormat = g2.RED;
    }
  } else if (!supportedFormat(gl.RGBA, gl.RGBA, halfFloatType)) {
    rejectReady!(new Error('half-float render targets unsupported'));
    return { ready, setPaused: () => {}, dispose: () => {} };
  }

  const filter = linearFiltering ? gl.LINEAR : gl.NEAREST;

  // Fullscreen triangle pair.
  const quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  const programs: Program[] = [];
  function makeProgram(frag: string) {
    const p = createProgram(gl as GL, VERT, frag);
    // Attribute 0 is bound by convention across all these programs.
    programs.push(p);
    return p;
  }

  let copyProgram: Program;
  let splatProgram: Program;
  let advectionProgram: Program;
  let divergenceProgram: Program;
  let curlProgram: Program;
  let vorticityProgram: Program;
  let pressureProgram: Program;
  let gradientProgram: Program;
  let displayProgram: Program;

  try {
    copyProgram = makeProgram(FRAG_COPY);
    splatProgram = makeProgram(FRAG_SPLAT);
    advectionProgram = makeProgram(FRAG_ADVECTION);
    divergenceProgram = makeProgram(FRAG_DIVERGENCE);
    curlProgram = makeProgram(FRAG_CURL);
    vorticityProgram = makeProgram(FRAG_VORTICITY);
    pressureProgram = makeProgram(FRAG_PRESSURE);
    gradientProgram = makeProgram(FRAG_GRADIENT_SUBTRACT);
    displayProgram = makeProgram(FRAG_DISPLAY);
  } catch (err) {
    rejectReady!(err instanceof Error ? err : new Error('shader setup failed'));
    return { ready, setPaused: () => {}, dispose: () => {} };
  }

  // `copyProgram` is kept for completeness of the pipeline (resize blits);
  // referenced here so the binding isn't flagged as unused.
  void copyProgram;

  const textures: WebGLTexture[] = [];
  const framebuffers: WebGLFramebuffer[] = [];

  function createFBO(w: number, h: number, internal: number, format: number, type: number, param: number): FBO {
    const g = gl as GL;
    g.activeTexture(g.TEXTURE0);
    const texture = g.createTexture()!;
    textures.push(texture);
    g.bindTexture(g.TEXTURE_2D, texture);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, param);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, param);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
    g.texImage2D(g.TEXTURE_2D, 0, internal, w, h, 0, format, type, null);

    const fbo = g.createFramebuffer()!;
    framebuffers.push(fbo);
    g.bindFramebuffer(g.FRAMEBUFFER, fbo);
    g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, texture, 0);
    g.viewport(0, 0, w, h);
    g.clear(g.COLOR_BUFFER_BIT);

    return {
      texture,
      fbo,
      width: w,
      height: h,
      texelSizeX: 1 / w,
      texelSizeY: 1 / h,
      attach(id: number) {
        g.activeTexture(g.TEXTURE0 + id);
        g.bindTexture(g.TEXTURE_2D, texture);
        return id;
      },
    };
  }

  function createDoubleFBO(w: number, h: number, internal: number, format: number, type: number, param: number): DoubleFBO {
    let fbo1 = createFBO(w, h, internal, format, type, param);
    let fbo2 = createFBO(w, h, internal, format, type, param);
    return {
      width: w,
      height: h,
      texelSizeX: 1 / w,
      texelSizeY: 1 / h,
      get read() { return fbo1; },
      set read(v: FBO) { fbo1 = v; },
      get write() { return fbo2; },
      set write(v: FBO) { fbo2 = v; },
      swap() {
        const tmp = fbo1;
        fbo1 = fbo2;
        fbo2 = tmp;
      },
    };
  }

  function resolution(target: number) {
    const g = gl as GL;
    const aspect = g.drawingBufferWidth / g.drawingBufferHeight || 1;
    const ratio = aspect < 1 ? 1 / aspect : aspect;
    const min = Math.round(target);
    const max = Math.round(target * ratio);
    return aspect > 1 ? { width: max, height: min } : { width: min, height: max };
  }

  const dyeRes = resolution(dyeResolution);
  const simRes = resolution(simResolution);

  const dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgbaInternal, gl.RGBA, halfFloatType, filter);
  const velocity = createDoubleFBO(simRes.width, simRes.height, rgInternal, rgFormat, halfFloatType, filter);
  const divergence = createFBO(simRes.width, simRes.height, rInternal, rFormat, halfFloatType, gl.NEAREST);
  const curlFBO = createFBO(simRes.width, simRes.height, rInternal, rFormat, halfFloatType, gl.NEAREST);
  const pressure = createDoubleFBO(simRes.width, simRes.height, rInternal, rFormat, halfFloatType, gl.NEAREST);

  function blit(target: FBO | null) {
    const g = gl as GL;
    if (target === null) {
      g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight);
      g.bindFramebuffer(g.FRAMEBUFFER, null);
    } else {
      g.viewport(0, 0, target.width, target.height);
      g.bindFramebuffer(g.FRAMEBUFFER, target.fbo);
    }
    g.drawElements(g.TRIANGLES, 6, g.UNSIGNED_SHORT, 0);
  }

  /* ---- pointer state ---- */
  type Pointer = { x: number; y: number; dx: number; dy: number; moved: boolean; colorIndex: number };
  const pointer: Pointer = { x: 0, y: 0, dx: 0, dy: 0, moved: false, colorIndex: 0 };

  function splat(x: number, y: number, dx: number, dy: number, color: [number, number, number]) {
    const g = gl as GL;
    g.useProgram(splatProgram.program);
    g.uniform1i(splatProgram.uniforms.uTarget!, velocity.read.attach(0));
    g.uniform1f(splatProgram.uniforms.aspectRatio!, canvas.width / canvas.height);
    g.uniform2f(splatProgram.uniforms.point!, x, y);
    g.uniform3f(splatProgram.uniforms.color!, dx, dy, 0);
    g.uniform1f(splatProgram.uniforms.radius!, splatRadius);
    blit(velocity.write);
    velocity.swap();

    g.uniform1i(splatProgram.uniforms.uTarget!, dye.read.attach(0));
    g.uniform3f(splatProgram.uniforms.color!, color[0], color[1], color[2]);
    blit(dye.write);
    dye.swap();
  }

  function pickColor(index: number): [number, number, number] {
    const base = PALETTE[index % PALETTE.length];
    // Slight per-splat jitter so repeated splats don't band into flat colour.
    const j = 0.85 + Math.random() * 0.3;
    return [base[0] * j * 0.28, base[1] * j * 0.28, base[2] * j * 0.28];
  }

  function step(dt: number) {
    const g = gl as GL;
    g.disable(g.BLEND);

    // curl
    g.useProgram(curlProgram.program);
    g.uniform2f(curlProgram.uniforms.texelSize!, velocity.texelSizeX, velocity.texelSizeY);
    g.uniform1i(curlProgram.uniforms.uVelocity!, velocity.read.attach(0));
    blit(curlFBO);

    // vorticity confinement
    g.useProgram(vorticityProgram.program);
    g.uniform2f(vorticityProgram.uniforms.texelSize!, velocity.texelSizeX, velocity.texelSizeY);
    g.uniform1i(vorticityProgram.uniforms.uVelocity!, velocity.read.attach(0));
    g.uniform1i(vorticityProgram.uniforms.uCurl!, curlFBO.attach(1));
    g.uniform1f(vorticityProgram.uniforms.curl!, curlStrength);
    g.uniform1f(vorticityProgram.uniforms.dt!, dt);
    blit(velocity.write);
    velocity.swap();

    // divergence
    g.useProgram(divergenceProgram.program);
    g.uniform2f(divergenceProgram.uniforms.texelSize!, velocity.texelSizeX, velocity.texelSizeY);
    g.uniform1i(divergenceProgram.uniforms.uVelocity!, velocity.read.attach(0));
    blit(divergence);

    // pressure solve (Jacobi)
    g.useProgram(pressureProgram.program);
    g.uniform2f(pressureProgram.uniforms.texelSize!, velocity.texelSizeX, velocity.texelSizeY);
    g.uniform1i(pressureProgram.uniforms.uDivergence!, divergence.attach(0));
    for (let i = 0; i < 20; i += 1) {
      g.uniform1i(pressureProgram.uniforms.uPressure!, pressure.read.attach(1));
      blit(pressure.write);
      pressure.swap();
    }

    // subtract pressure gradient
    g.useProgram(gradientProgram.program);
    g.uniform2f(gradientProgram.uniforms.texelSize!, velocity.texelSizeX, velocity.texelSizeY);
    g.uniform1i(gradientProgram.uniforms.uPressure!, pressure.read.attach(0));
    g.uniform1i(gradientProgram.uniforms.uVelocity!, velocity.read.attach(1));
    blit(velocity.write);
    velocity.swap();

    // advect velocity, then dye
    g.useProgram(advectionProgram.program);
    g.uniform2f(advectionProgram.uniforms.texelSize!, velocity.texelSizeX, velocity.texelSizeY);
    g.uniform1i(advectionProgram.uniforms.uVelocity!, velocity.read.attach(0));
    g.uniform1i(advectionProgram.uniforms.uSource!, velocity.read.attach(0));
    g.uniform1f(advectionProgram.uniforms.dt!, dt);
    g.uniform1f(advectionProgram.uniforms.dissipation!, velocityDissipation);
    blit(velocity.write);
    velocity.swap();

    g.uniform1i(advectionProgram.uniforms.uVelocity!, velocity.read.attach(0));
    g.uniform1i(advectionProgram.uniforms.uSource!, dye.read.attach(1));
    g.uniform1f(advectionProgram.uniforms.dissipation!, densityDissipation);
    blit(dye.write);
    dye.swap();
  }

  function render() {
    const g = gl as GL;
    g.useProgram(displayProgram.program);
    g.uniform1i(displayProgram.uniforms.uTexture!, dye.read.attach(0));
    blit(null);
  }

  /* ---- sizing ---- */
  function resize() {
    // Cap DPR: this is a decorative backdrop, not a photograph, and a 3x
    // buffer on a retina display costs far more than it shows.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }

  /* ---- input ---- */
  function updatePointer(clientX: number, clientY: number) {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const x = (clientX - rect.left) / rect.width;
    const y = 1 - (clientY - rect.top) / rect.height;
    pointer.dx = (x - pointer.x) * 5500;
    pointer.dy = (y - pointer.y) * 5500;
    pointer.x = x;
    pointer.y = y;
    pointer.moved = Math.abs(pointer.dx) > 0 || Math.abs(pointer.dy) > 0;
  }

  const onMouseMove = (e: MouseEvent) => updatePointer(e.clientX, e.clientY);
  const onTouchMove = (e: TouchEvent) => {
    const t = e.targetTouches[0];
    if (t) updatePointer(t.clientX, t.clientY);
  };
  const onMouseEnter = (e: MouseEvent) => {
    // Seed position without a huge delta, so entering doesn't fire a jet.
    const rect = canvas.getBoundingClientRect();
    pointer.x = (e.clientX - rect.left) / rect.width;
    pointer.y = 1 - (e.clientY - rect.top) / rect.height;
    pointer.dx = 0;
    pointer.dy = 0;
  };

  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseenter', onMouseEnter);
  canvas.addEventListener('touchmove', onTouchMove, { passive: true });

  /* ---- loop ---- */
  let lastTime = performance.now();
  let autoTimer = 0;
  let firstFrameDone = false;
  let paused = false;

  // Seed a few splats so the panel is never an empty black box on first paint.
  function seed() {
    for (let i = 0; i < 5; i += 1) {
      const x = 0.15 + Math.random() * 0.7;
      const y = 0.2 + Math.random() * 0.6;
      splat(x, y, (Math.random() - 0.5) * 900, (Math.random() - 0.5) * 900, pickColor(i));
    }
  }

  function frame() {
    if (disposed || paused) return;
    const now = performance.now();
    // Clamp dt so a backgrounded tab doesn't resume with one giant timestep.
    const dt = Math.min((now - lastTime) / 1000, 0.0166);
    lastTime = now;

    resize();

    if (pointer.moved) {
      pointer.moved = false;
      pointer.colorIndex += 1;
      splat(pointer.x, pointer.y, pointer.dx, pointer.dy, pickColor(pointer.colorIndex));
    }

    if (autoSplats) {
      autoTimer += dt;
      if (autoTimer > 2.2) {
        autoTimer = 0;
        pointer.colorIndex += 1;
        const x = 0.15 + Math.random() * 0.7;
        const y = 0.2 + Math.random() * 0.6;
        splat(x, y, (Math.random() - 0.5) * 1100, (Math.random() - 0.5) * 1100, pickColor(pointer.colorIndex));
      }
    }

    step(dt);
    render();

    if (!firstFrameDone) {
      firstFrameDone = true;
      resolveReady();
    }
    rafId = requestAnimationFrame(frame);
  }

  resize();
  seed();
  rafId = requestAnimationFrame(frame);

  function setPaused(next: boolean) {
    if (disposed || next === paused) return;
    paused = next;
    if (paused) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    } else {
      // Reset the clock, or the first frame back gets the whole paused
      // duration as its dt and the sim explodes.
      lastTime = performance.now();
      rafId = requestAnimationFrame(frame);
    }
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(rafId);
    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('mouseenter', onMouseEnter);
    canvas.removeEventListener('touchmove', onTouchMove);

    const g = gl as GL;
    programs.forEach(p => g.deleteProgram(p.program));
    textures.forEach(t => g.deleteTexture(t));
    framebuffers.forEach(f => g.deleteFramebuffer(f));
    if (quadBuffer) g.deleteBuffer(quadBuffer);
    if (indexBuffer) g.deleteBuffer(indexBuffer);
    // Free the GPU context immediately rather than waiting for GC — this
    // component unmounts on route changes and browsers cap live contexts.
    g.getExtension('WEBGL_lose_context')?.loseContext();
  }

  return { ready, setPaused, dispose };
}
