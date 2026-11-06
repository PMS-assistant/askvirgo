import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Drop "#section" from the address bar without a navigation, so a refresh
// opens on the first screen. history.state is kept: react-router keeps its
// own key and index there.
function clearHash() {
  const { pathname, search } = window.location;
  window.history.replaceState(window.history.state, '', pathname + search);
}

export default function ScrollToTop() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    // The page always opens on its first screen, even when the address has a
    // hash in it (from an earlier menu click, or a shared /#pilot link), and
    // the browser does not restore an old scroll position on refresh.
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

    // `performance.now()` (time since navigation start) rather than a
    // mount-count ref, because React StrictMode double-runs effects in dev and
    // would flip a ref before the real run reads it.
    const freshLoad = performance.now() < 1500;

    // Instant, because html has scroll-behavior: smooth, and a smooth reset
    // gets interrupted part-way by the browser's own jump to the hash.
    const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (!hash || freshLoad) {
      toTop();
      if (!hash) return;
      clearHash();
      // The browser makes its own jump to the old hash once the page has
      // loaded, after this effect, so reset again at that point.
      const raf = requestAnimationFrame(toTop);
      window.addEventListener('load', toTop, { once: true });
      const t = setTimeout(toTop, 300);
      return () => { cancelAnimationFrame(raf); window.removeEventListener('load', toTop); clearTimeout(t); };
    }

    // An in-page link (Product, How it works, Book a demo): glide to the
    // section, then clear the hash. `key` is in the deps so pressing the same
    // link twice still scrolls.
    const t = setTimeout(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      clearHash();
    }, 100);
    return () => clearTimeout(t);
  }, [pathname, hash, key]);

  return null;
}
