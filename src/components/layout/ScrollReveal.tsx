import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { prefersReducedMotion } from '../../lib/motion';

/* Seamless page (owner's choice, 2026-11-06): each main block fades up softly
   the first time it scrolls into view, so the page reads as one continuous
   surface rather than a stack of boxes. The lines between sections are gone
   and one background colour drifts underneath (ScrollColorWash); see the
   "Seamless page" block in index.css. Normal scrolling is untouched.

   The fl-r / fl-in classes are plain CSS outside @layer, so Tailwind keeps
   them. Under reduced motion nothing is hidden or moved. */

const REVEAL = '.vi-scene, .vi-trust, .pt-head, .pt-row, .lr, .bn-head, .fq-head, .fq-list, .ct-head, .ct-card, .ab-block, .ab-cta';

export default function ScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(REVEAL));
    els.forEach(el => el.classList.add('fl-r'));
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('fl-in'); io.unobserve(e.target); }
    }), { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    els.forEach(el => io.observe(el));
    return () => { io.disconnect(); els.forEach(el => el.classList.remove('fl-r', 'fl-in')); };
  }, [location.pathname]);

  return null;
}
