import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { prefersReducedMotion } from '../../lib/motion';

/* Three trial ways of making the homepage feel like one continuous page
   rather than a stack of boxes (owner, 2026-11-06, on the develop branch).
   Every version keeps normal scrolling: nothing pins, slides or hijacks.

   0  Off: the site as it is today.
   1  Seamless: no lines between sections; one background colour that drifts
      gently as you scroll; each block fades up softly as it arrives.
   2  Glide: Seamless, plus inertia smooth scrolling (the wheel eases to a
      stop instead of jumping).
   3  Depth: Seamless, plus a gentle parallax: visuals move a little slower
      than the text, and the hero photo eases back as you leave it.

   The version is chosen with ?flow=0..3 and remembered for the session. A
   switcher appears only in local development, never on the deployed site.
   Class names toggled here (fl-r, fl-in, fl-px) are plain CSS outside
   @layer, so Tailwind keeps them. Reduced motion turns every effect off. */

export type Flow = 0 | 1 | 2 | 3;

const REVEAL = '.vi-scene, .vi-trust, .pt-head, .pt-row, .lr, .bn-head, .fq-head, .fq-list, .ct-head, .ct-card';
const PARALLAX: [string, number][] = [['.vi-scene', 0.05], ['.pt-row', 0.04], ['.bn-grid', 0.035], ['.ct-card', 0.035]];
const MAX_SHIFT = 28; // px: parallax stays a hint, never a slide

function readFlow(search: string): Flow {
  const q = new URLSearchParams(search).get('flow');
  const fromUrl = q !== null ? Number(q) : NaN;
  if ([0, 1, 2, 3].includes(fromUrl)) {
    try { sessionStorage.setItem('virgo-flow', String(fromUrl)); } catch { /* storage blocked */ }
    return fromUrl as Flow;
  }
  try {
    const saved = Number(sessionStorage.getItem('virgo-flow'));
    if ([1, 2, 3].includes(saved)) return saved as Flow;
  } catch { /* storage blocked */ }
  return 0;
}

export default function ScrollFlow() {
  const location = useLocation();
  const [flow, setFlow] = useState<Flow>(() => readFlow(window.location.search));

  useEffect(() => { setFlow(readFlow(location.search)); }, [location.search]);

  // Mark the page so the CSS for the chosen version applies.
  useEffect(() => {
    const root = document.documentElement;
    if (flow === 0 || prefersReducedMotion()) delete root.dataset.flow;
    else root.dataset.flow = String(flow);
  }, [flow]);

  // Soft reveal: each block fades up the first time it enters the screen.
  useEffect(() => {
    if (flow === 0 || prefersReducedMotion() || !('IntersectionObserver' in window)) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(REVEAL));
    els.forEach(el => el.classList.add('fl-r'));
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('fl-in'); io.unobserve(e.target); }
    }), { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    els.forEach(el => io.observe(el));
    return () => { io.disconnect(); els.forEach(el => el.classList.remove('fl-r', 'fl-in')); };
  }, [flow, location.pathname]);

  // Version 2: inertia smooth scrolling.
  useEffect(() => {
    if (flow !== 2 || prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.9 });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, [flow]);

  // Version 3: gentle parallax, driven by each element's distance from the
  // middle of the screen, plus the hero photo easing back as you leave it.
  useEffect(() => {
    if (flow !== 3 || prefersReducedMotion()) return;
    const items = PARALLAX.flatMap(([sel, k]) =>
      Array.from(document.querySelectorAll<HTMLElement>(sel)).map(el => ({ el, k })));
    items.forEach(({ el }) => el.classList.add('fl-px'));
    const hero = document.querySelector<HTMLElement>('.hv');
    let frame = 0;
    const update = () => {
      frame = 0;
      const mid = window.innerHeight / 2;
      items.forEach(({ el, k }) => {
        const r = el.getBoundingClientRect();
        const d = r.top + r.height / 2 - mid;
        const y = Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, d * k));
        el.style.setProperty('--fl-y', `${y.toFixed(1)}px`);
      });
      if (hero) {
        const p = Math.min(1, Math.max(0, window.scrollY / hero.offsetHeight));
        hero.style.setProperty('--fl-hero', p.toFixed(3));
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      items.forEach(({ el }) => { el.classList.remove('fl-px'); el.style.removeProperty('--fl-y'); });
      hero?.style.removeProperty('--fl-hero');
    };
  }, [flow, location.pathname]);

  if (!import.meta.env.DEV) return null;

  // Local-only switcher for comparing the versions.
  const NAMES = ['Off', 'Seamless', 'Glide', 'Depth'];
  return (
    <div className="fl-switch" role="group" aria-label="Scroll version (local preview only)">
      <span>Scroll</span>
      {NAMES.map((n, i) => (
        <a key={n} href={`?flow=${i}`} className={flow === i ? 'fl-on' : undefined}>{i} · {n}</a>
      ))}
    </div>
  );
}
