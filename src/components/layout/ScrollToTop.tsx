import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const id = hash.slice(1);

    // Reproduced live: loading straight into a deep link (e.g. /#pilot) with
    // a *smooth* scroll left VirgoPilotCTA's headline permanently invisible —
    // stuck at opacity: 0 while its sibling form card revealed normally.
    // Every reveal-on-scroll element checks "am I in the viewport" once, on
    // mount, while the page is still at the top; a smooth scroll then takes
    // over a second to glide down, and IntersectionObserver visibly coalesces
    // callbacks during that continuous motion — some elements never get a
    // clean "entered" notification and never recover. An instant jump causes
    // one discrete layout settle instead of a multi-second window, which
    // observers reliably report against (this is also what browsers do
    // natively for hash navigation on load — smooth was the deviation).
    //
    // `performance.now()` (wall-clock time since navigation start) rather
    // than a mount-count ref: a ref-based "is this the first run" flag gets
    // corrupted by React StrictMode's dev-only double-invoked effects — the
    // throwaway first invocation flips the flag before the real one reads it,
    // so every dev-mode load falls through to 'smooth' and the bug ships
    // right back. Time since navigation start is unaffected by how many
    // times React chooses to call the effect.
    const freshLoad = performance.now() < 1500;
    const behavior: ScrollBehavior = freshLoad ? 'instant' : 'smooth';
    const delay = freshLoad ? 0 : 100;
    const t = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior });
    }, delay);
    return () => clearTimeout(t);
  }, [pathname, hash]);

  return null;
}
