import { useEffect, useRef, useState } from 'react';
import { createRenderer, type FluidRenderer } from '../../lib/fluid/renderer';
import { prefersReducedMotion } from '../../lib/motion';

/* An interactive fluid simulation used as a dark-band backdrop.

   Three things this wrapper is responsible for, none of which the original
   21st.dev snippet handled:

   1. Reduced motion — a continuously churning backdrop is exactly what that
      setting exists to switch off, so we never even create the GL context.
   2. Off-screen pausing — the homepage is ~9000px tall. Left running, this
      would burn GPU the whole time the visitor is reading anything else.
   3. Failure — old GPUs, blocklisted drivers and headless browsers have no
      usable WebGL. In every one of those cases the section still needs to
      look finished, so a CSS gradient sits underneath permanently and the
      canvas simply fades in on top if (and only if) it actually renders.

   The canvas is decorative: it carries no information, so it's aria-hidden
   and nothing here is keyboard-reachable. */

type Props = {
  /** Rendered above the canvas. */
  children?: React.ReactNode;
  className?: string;
};

export default function FluidBackdrop({ children, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const [canvasVisible, setCanvasVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    if (prefersReducedMotion()) return;

    // Phones don't get the simulation. It's a continuously-running GPU loop
    // for a purely decorative backdrop — on a handheld that's battery and
    // heat for no information. The CSS gradient underneath is the same
    // palette and already looks finished, so nothing is lost visually.
    const isSmall = window.matchMedia('(max-width: 767px)').matches;
    const isCoarse = window.matchMedia('(hover: none)').matches;
    if (isSmall || isCoarse) return;

    let renderer: FluidRenderer | null = null;
    let pauseObserver: IntersectionObserver | null = null;
    let cancelled = false;

    // Only build the GL context once the band is actually near the viewport —
    // no reason to compile nine shader programs for a section most visitors
    // scroll to seconds later, if at all.
    const startObserver = new IntersectionObserver(
      entries => {
        if (!entries.some(e => e.isIntersecting) || renderer || cancelled) return;
        startObserver.disconnect();

        try {
          renderer = createRenderer({ canvas });
        } catch {
          return; // keep the gradient fallback
        }

        renderer.ready
          .then(() => { if (!cancelled) setCanvasVisible(true); })
          .catch(() => { /* unsupported — gradient stays */ });

        // Once running, pause whenever it leaves the viewport.
        const activeRenderer = renderer;
        pauseObserver = new IntersectionObserver(
          pauseEntries => {
            const onScreen = pauseEntries.some(e => e.isIntersecting);
            activeRenderer.setPaused(!onScreen);
          },
          { threshold: 0 }
        );
        pauseObserver.observe(host);
      },
      { rootMargin: '200px 0px' }
    );

    startObserver.observe(host);

    // A backgrounded tab already throttles rAF, but stopping outright means a
    // hidden tab costs nothing at all.
    const onVisibility = () => renderer?.setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      startObserver.disconnect();
      pauseObserver?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      renderer?.dispose();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', background: 'var(--ink)' }}
    >
      {/* Permanent fallback: a still version of the same palette. Always
          painted, so there is never a black hole while the sim spins up and
          never an empty band if WebGL is unavailable. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 70% at 22% 30%, rgba(124,58,237,0.42) 0%, transparent 62%),' +
            'radial-gradient(ellipse 50% 60% at 78% 68%, rgba(94,234,212,0.20) 0%, transparent 60%),' +
            'radial-gradient(ellipse 45% 55% at 60% 20%, rgba(200,240,75,0.12) 0%, transparent 58%)',
        }}
      />

      <canvas
        ref={canvasRef}
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          display: 'block',
          width: '100%',
          height: '100%',
          touchAction: 'none',
          opacity: canvasVisible ? 1 : 0,
          transition: 'opacity 900ms ease',
        }}
      />

      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
}
