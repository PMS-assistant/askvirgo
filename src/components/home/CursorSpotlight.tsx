import { useEffect, useRef, useState, type ReactNode } from 'react';
import { animate } from 'animejs';
import { prefersReducedMotion } from '../../lib/motion';

/* Wraps a section so a soft accent glow eases along behind the cursor.

   Built on the same idea as `useCursorGlow` in lib/motion.ts, but that hook
   positions the glow from the element's top-left and has no enter/leave
   handling, which makes it snap in at the corner on first move. This does the
   two things it was missing: the glow is centred on the pointer, and it fades
   in and out rather than appearing fully formed.

   Pointer-driven decoration only. Skipped entirely under reduced motion, and
   never shown on touch (there is no hover, so it would either sit dead in a
   corner or flash on tap). */

type Props = {
  children: ReactNode;
  /** Glow diameter in px. */
  size?: number;
  /** Any CSS colour — defaults to the site's violet glow token. */
  color?: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function CursorSpotlight({
  children,
  size = 520,
  color = 'var(--primary-glow)',
  className,
  style,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const glow = glowRef.current;
    if (!container || !glow) return;
    if (prefersReducedMotion()) return;

    // Hover-capable pointers only.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    setEnabled(true);

    let current: ReturnType<typeof animate> | null = null;

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      current?.revert();
      current = animate(glow, {
        translateX: e.clientX - rect.left,
        translateY: e.clientY - rect.top,
        duration: 620,
        ease: 'out(3)',
      });
    };

    const onEnter = (e: MouseEvent) => {
      // Jump to the entry point without a trailing sweep across the section.
      const rect = container.getBoundingClientRect();
      glow.style.transform = `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px)`;
      glow.style.opacity = '1';
    };

    const onLeave = () => { glow.style.opacity = '0'; };

    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);

    return () => {
      current?.revert();
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
    >
      <div
        ref={glowRef}
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
          // Anime drives translate, so centre the box on the pointer with
          // margins rather than a competing translate(-50%,-50%).
          marginLeft: -size / 2,
          marginTop: -size / 2,
          borderRadius: '50%',
          pointerEvents: 'none',
          background: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
          filter: 'blur(28px)',
          opacity: 0,
          transition: 'opacity 420ms ease',
          display: enabled ? 'block' : 'none',
        }}
      />
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
}
