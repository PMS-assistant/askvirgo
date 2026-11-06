import { useEffect, useRef, type ReactNode } from 'react';
import { BedDouble, ClipboardList, MessageCircle, Network, Star, Users, CloudSun, TrendingUp, Package } from 'lucide-react';
import { prefersReducedMotion } from '../../lib/motion';

/* The section after the hero: what Virgo is, then what it does.

   A data constellation plays when the section comes into view, every time the
   page is opened or refreshed (about 9 seconds). Hundreds of points drift
   loose, gather into nine clusters (one per kind of system Virgo reads), pour into the centre, then burst out into a ring
   that leaves Virgo glowing in the middle; the data then fades onto four thin
   rings and the nine systems fly back in as chips, orbiting Virgo on them.
   Below, one slim line of the four things that are always true.

   Sources are named by category, never by vendor. Under reduced motion the
   scene shows its final frame and nothing animates. */

const SYSTEMS = ['PMS', 'Operations', 'Guest messaging', 'Channel manager', 'Reviews', 'Staff rota', 'Outside conditions', 'RMS', 'Inventory'];
const SYSTEM_ICONS = [BedDouble, ClipboardList, MessageCircle, Network, Star, Users, CloudSun, TrendingUp, Package];
const ORBIT_AT = 7.2; // when the systems settle onto the rings
// Three concentric rings (as fractions of the outer radius), each turning at
// its own speed and direction, like the first orbit mockup.
const RINGS = [0.58, 0.72, 0.86, 1]; // inner ring kept wide enough to clear the Virgo name
const RING_SPEED = [0.1, -0.08, 0.06, -0.045]; // radians per second, alternating direction
// Four rings, two or three systems each, so the names have room:
// 1 PMS, Operations · 2 Guest messaging, Channel manager · 3 Reviews, RMS ·
// 4 Staff rota, Outside conditions, Inventory.
const SYSTEM_RING = [0, 0, 1, 1, 2, 3, 3, 2, 3];
// Start angles keep chips on neighbouring rings at least 45° apart.
const SYSTEM_ANGLE = [-90, 90, 0, 180, 225, 315, 135, 45, 270].map(d => (d * Math.PI) / 180);

const STATEMENT: [string, '' | 'b' | 'i'][] = [
  ['Virgo is the decision layer for your hotel.', 'b'],
  ['It reads every system you run, tells you what changed,', ''],
  ['why,', 'i'],
  ['and what needs you next. The decision stays yours.', ''],
];
// Class names written out in full so Tailwind keeps them in the build.
const WORD_CLASS = { '': 'vi-w', b: 'vi-w vi-b', i: 'vi-w vi-i' } as const;
const WORDS = STATEMENT.flatMap(([text, cls]) => text.split(' ').map(w => ({ w, className: WORD_CLASS[cls] })));

const TRUST_ICON: Record<string, ReactNode> = {
  'Read-only': <path d="M8 11V7a4 4 0 0 1 8 0v4M6 11h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z" />,
  'Every figure sourced': <path d="M14 3h7v7M10 14 21 3M21 14v7H3V3h7" />,
  'Your data isn’t kept': <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M3 3l18 18" /></>,
  'One switch stops guest messages': <path d="M7 4h3v16H7zM14 4h3v16h-3z" />,
};

const ALWAYS = ['Read-only', 'Every figure sourced', 'Your data isn’t kept', 'One switch stops guest messages'];

const DURATION = 9;
const TEXT_AT = 0.6;
const MARK_AT = 6.2;
const N = 720;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const ease = (x: number) => 1 - Math.pow(1 - x, 3);
const easeIO = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function seeded(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const caption = (t: number) =>
  t < 1.6 ? 'Scattered data' : t < 3.6 ? 'Nine kinds of system' : t < 6.2 ? 'Virgo joins them up' : 'Read-only, every figure sourced';

type Particle = {
  sx: number; sy: number; ph: number; sp: number; c: number; gx: number; gy: number;
  oa: number; orr: number; ra: number; rj: number; d: number; sz: number;
};

export default function VirgoIntro() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLSpanElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const orbitRefs = useRef<(HTMLSpanElement | null)[]>([]);

  /* ---------- the constellation ---------- */
  useEffect(() => {
    const root = sceneRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!root || !canvas || !ctx) return;

    const reduce = prefersReducedMotion();
    const rand = seeded(42);
    let w = 0, h = 0, dpr = 1, cx = 0, cy = 0, R = 0;
    let clusters: { x: number; y: number }[] = [];
    let P: Particle[] = [];
    let start = 0;
    let raf = 0;
    let seen = false;
    let visible = false;

    const layout = () => {
      w = root.clientWidth; h = root.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr; canvas.height = h * dpr;
      const wide = w > 760;
      cx = wide ? w * 0.72 : w * 0.5; cy = wide ? h * 0.5 : h * 0.63;
      R = wide ? Math.min(h * 0.44, w * 0.24) : Math.min(w * 0.44, h * 0.28);
      clusters = SYSTEMS.map((_, i) => {
        const a = -Math.PI / 2 + (i / SYSTEMS.length) * Math.PI * 2;
        return { x: cx + Math.cos(a) * R * 0.9, y: cy + Math.sin(a) * R * 0.9 };
      });
      if (markRef.current) {
        markRef.current.style.left = cx + 'px';
        markRef.current.style.top = cy + 'px';
      }
      if (!P.length) {
        P = Array.from({ length: N }, (_, i) => ({
          sx: rand(), sy: rand(), ph: rand() * 6.28, sp: 0.4 + rand() * 0.8, c: i % SYSTEMS.length,
          gx: (rand() + rand() + rand() - 1.5) * 34, gy: (rand() + rand() + rand() - 1.5) * 26,
          oa: rand() * Math.PI * 2, orr: Math.sqrt(rand()),
          ra: rand() * Math.PI * 2, rj: (rand() - 0.5) * 18, d: rand() * 0.7, sz: 0.8 + rand() * 1.6,
        }));
      }
    };

    const draw = (t: number, clock: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      // Fades out fully inside the canvas, so no edge shows now that the scene has no frame.
      const vg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.5);
      vg.addColorStop(0, 'rgba(207, 227, 247, 0.45)');
      vg.addColorStop(1, 'rgba(251, 250, 248, 0)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

      const coreGlow = ease(seg(t, 4.2, 6));
      if (coreGlow > 0) {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 160);
        g.addColorStop(0, `rgba(226, 96, 63, ${0.35 * coreGlow})`);
        g.addColorStop(1, 'rgba(226, 96, 63, 0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // The data spreads onto the three rings, then fades, leaving clean rings.
      const fade = 1 - seg(t, 8.0, 9.4);
      const coreR = Math.min(w, h) * 0.05;
      for (const p of P) {
        if (fade <= 0) break;
        const dx = p.sx * w + Math.sin(clock * p.sp + p.ph) * 18;
        const dy = p.sy * h + Math.cos(clock * p.sp * 0.8 + p.ph) * 14;
        const cl = clusters[p.c];
        const kx = cl.x + p.gx + Math.sin(clock + p.ph) * 3;
        const ky = cl.y + p.gy + Math.cos(clock + p.ph) * 3;
        const sw = p.oa + clock * 1.4;
        const ox = cx + Math.cos(sw) * p.orr * coreR, oy = cy + Math.sin(sw) * p.orr * coreR;
        const ra = p.ra + clock * 0.12;
        const pr = R * RINGS[p.c % RINGS.length] + p.rj * 0.5;
        const fx = cx + Math.cos(ra) * pr, fy = cy + Math.sin(ra) * pr;

        const a1 = easeIO(seg(t, 1.2 + p.d * 0.6, 2.8 + p.d * 0.6));
        const a2 = easeIO(seg(t, 3.4 + p.d * 0.8, 4.8 + p.d * 0.8));
        const a3 = easeIO(seg(t, 6.0 + p.d * 0.6, 7.6 + p.d * 0.6));
        let x = dx + (kx - dx) * a1, y = dy + (ky - dy) * a1;
        // Spiral in: bend the path sideways while travelling to the core.
        const bend = Math.sin(Math.PI * a2) * 60;
        const vx = ox - x, vy = oy - y, L = Math.hypot(vx, vy) || 1;
        x = x + vx * a2 + (-vy / L) * bend;
        y = y + vy * a2 + (vx / L) * bend;
        x = x + (fx - x) * a3;
        y = y + (fy - y) * a3;

        // Ink when loose, coral while being joined up, a warm tint in the ring.
        const warm = Math.max(Math.sin(Math.PI * a2), a3 * 0.6);
        const r = Math.round(15 + 211 * warm), g = Math.round(27 + 69 * warm), b = Math.round(51 + 12 * warm);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(0.55 + 0.35 * warm) * fade})`;
        ctx.beginPath();
        ctx.arc(x, y, p.sz * (1 + 0.4 * Math.sin(Math.PI * a2)), 0, Math.PI * 2);
        ctx.fill();
      }

      const ringA = seg(t, 7.4, 8.8);
      if (ringA > 0) {
        ctx.strokeStyle = `rgba(15, 27, 51, ${0.14 * ringA})`;
        ctx.lineWidth = 1;
        RINGS.forEach(f => {
          ctx.beginPath();
          ctx.arc(cx, cy, R * f, 0, Math.PI * 2);
          ctx.stroke();
        });
      }
    };

    // DOM pieces that follow the timeline (statement, labels, Virgo mark, caption).
    const ui = (t: number, clock: number) => {
      statementRef.current?.classList.toggle('show', t >= TEXT_AT);
      markRef.current?.classList.toggle('show', t >= MARK_AT);
      const cap = caption(t);
      if (captionRef.current && captionRef.current.textContent !== cap) captionRef.current.textContent = cap;
      labelRefs.current.forEach((l, i) => {
        if (!l) return;
        l.style.left = clusters[i].x + 'px';
        l.style.top = clusters[i].y - 30 + 'px';
        l.classList.toggle('show', t > 2.2 + i * 0.12 && t < 3.9);
      });
      // The systems come back as chips and orbit Virgo, each on its ring.
      orbitRefs.current.forEach((chip, i) => {
        if (!chip) return;
        const ring = SYSTEM_RING[i];
        const k = ease(seg(t, ORBIT_AT + i * 0.12, ORBIT_AT + 1 + i * 0.12));
        const ang = SYSTEM_ANGLE[i] + clock * RING_SPEED[ring];
        const out = 1 + (1 - k) * 0.6; // fly in from outside the rings
        const x = cx + Math.cos(ang) * R * RINGS[ring] * out;
        const y = cy + Math.sin(ang) * R * RINGS[ring] * out;
        chip.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${0.8 + 0.2 * k})`;
        chip.style.opacity = String(k);
      });
    };

    // Keeps running after the sequence (the orbit never stops), but only
    // while the section is on screen.
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      draw(t, now / 1000);
      ui(t, now / 1000);
      raf = visible ? requestAnimationFrame(tick) : 0;
    };

    const play = () => {
      start = performance.now();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    layout();

    if (reduce) {
      draw(DURATION, 0);
      ui(DURATION, 0);
      const onResize = () => { layout(); draw(DURATION, 0); ui(DURATION, 0); };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    // First still frame before it plays.
    draw(0, performance.now() / 1000);
    ui(0, performance.now() / 1000);

    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    // Plays once per page load, the first time the scene is mostly on screen.
    const playIo = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !seen) {
          seen = true;
          visible = true;
          play();
        }
      });
    }, { threshold: 0.45 });
    playIo.observe(root);

    // After that, pause the drawing loop whenever the scene is off screen.
    const visIo = new IntersectionObserver(entries => {
      entries.forEach(e => {
        visible = e.isIntersecting;
        if (visible && seen && !raf) raf = requestAnimationFrame(tick);
      });
    });
    visIo.observe(root);

    return () => {
      cancelAnimationFrame(raf);
      playIo.disconnect();
      visIo.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section id="virgo" className="vi">
      <div className="vi-inner">
        <div ref={sceneRef} className="vi-scene">
          <canvas ref={canvasRef} aria-hidden />

          <div className="vi-overlay">
            <span className="vi-eyebrow">What Virgo is</span>
            <p ref={statementRef} className="vi-statement">
              {WORDS.map((word, i) => (
                <span key={i}>
                  <span className={word.className} style={{ transitionDelay: `${i * 0.045}s` }}>
                    {word.w}
                  </span>{' '}
                </span>
              ))}
            </p>
          </div>

          {SYSTEMS.map((name, i) => (
            <span key={name} ref={el => { labelRefs.current[i] = el; }} className="vi-label" aria-hidden>
              {name}
            </span>
          ))}

          <div ref={markRef} className="vi-mark" aria-hidden>
            <span className="vi-mark-orb" />
            <span className="vi-mark-name">Virgo</span>
          </div>

          <span className="vi-caption" aria-hidden>
            <i />
            <span ref={captionRef}>Scattered data</span>
          </span>
          {SYSTEMS.map((name, i) => {
            const Icon = SYSTEM_ICONS[i];
            return (
              <span key={name} ref={el => { orbitRefs.current[i] = el; }} className="vi-orbit-chip" aria-hidden>
                <Icon size={15} aria-hidden />
                <span className="vi-orbit-name">{name}</span>
              </span>
            );
          })}
        </div>

        <div className="vi-trust" aria-label="Always true">
          {ALWAYS.map(a => (
            <span key={a}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>{TRUST_ICON[a]}</svg>
              {a}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
