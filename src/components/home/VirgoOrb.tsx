import { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { prefersReducedMotion } from '../../lib/motion';

/* The glowing core of the hero constellation — Virgo's brightest star, and the
   point every connected source feeds into.

   Built from stacked radial gradients rather than SVG: CSS gradients plus
   `filter: blur()` give a far softer sphere falloff than an SVG <radialGradient>,
   and the two counter-rotating blobs inside read as living caustics rather than
   a flat disc. Every colour comes from a token, so a re-theme still only touches
   src/index.css. */

type Props = {
  /** Diameter of the sphere itself, in px. The bloom extends beyond it. */
  size?: number;
};

export default function VirgoOrb({ size = 58 }: Props) {
  const bloomRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const blobARef = useRef<HTMLDivElement>(null);
  const blobBRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Decorative motion only — the orb is fully legible standing still.
    if (prefersReducedMotion()) return;

    const anims = [
      animate(bloomRef.current!, {
        opacity: [0.45, 0.85, 0.45],
        scale: [0.94, 1.12, 0.94],
        duration: 4200,
        loop: true,
        ease: 'inOutSine',
      }),
      animate(sphereRef.current!, {
        scale: [1, 1.045, 1],
        duration: 4200,
        loop: true,
        ease: 'inOutSine',
      }),
      // Slow organic wobble on the sphere's own shape — the "liquid" cue,
      // done as a border-radius morph rather than a WebGL shader.
      animate(sphereRef.current!, {
        borderRadius: [
          '50% 50% 50% 50% / 50% 50% 50% 50%',
          '58% 42% 47% 53% / 46% 55% 45% 54%',
          '44% 56% 55% 45% / 55% 44% 56% 44%',
          '50% 50% 50% 50% / 50% 50% 50% 50%',
        ],
        duration: 9000,
        loop: true,
        ease: 'inOutSine',
      }),
      // Counter-rotation keeps the interior from reading as one spinning texture.
      animate(blobARef.current!, { rotate: [0, 360], duration: 14000, loop: true, ease: 'linear' }),
      animate(blobBRef.current!, { rotate: [360, 0], duration: 19000, loop: true, ease: 'linear' }),
    ];

    return () => { anims.forEach(a => a.revert()); };
  }, []);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {/* Outer bloom — sits behind the sphere and breathes with it. */}
      <div
        ref={bloomRef}
        aria-hidden
        style={{
          position: 'absolute', inset: `${-size * 0.62}px`, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 68%)',
          filter: 'blur(10px)', opacity: 0.55, pointerEvents: 'none',
        }}
      />

      {/* The sphere. overflow:hidden clips the caustic blobs to the ball. */}
      <div
        ref={sphereRef}
        style={{
          position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden',
          background: 'radial-gradient(circle at 32% 28%, var(--primary) 0%, var(--primary-deep) 58%, var(--ink) 130%)',
          boxShadow: '0 10px 26px var(--primary-glow), inset 0 -6px 14px rgba(20,18,26,0.45)',
        }}
      >
        <div
          ref={blobARef}
          aria-hidden
          style={{
            position: 'absolute', inset: '-32%',
            background: 'radial-gradient(ellipse 46% 34% at 38% 40%, var(--mint) 0%, transparent 62%)',
            opacity: 0.48, filter: 'blur(6px)',
          }}
        />
        <div
          ref={blobBRef}
          aria-hidden
          style={{
            position: 'absolute', inset: '-28%',
            background: 'radial-gradient(ellipse 40% 48% at 64% 58%, var(--pop) 0%, transparent 58%)',
            opacity: 0.2, filter: 'blur(9px)',
          }}
        />

        {/* Specular highlight, offset from centre so the ball reads as 3D. */}
        <div
          aria-hidden
          style={{
            position: 'absolute', top: '13%', left: '22%', width: '36%', height: '28%',
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 70%)',
            filter: 'blur(3px)',
          }}
        />
      </div>
    </div>
  );
}
