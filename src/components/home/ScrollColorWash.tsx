import { useEffect } from 'react';
import { prefersReducedMotion } from '../../lib/motion';

/* Shifts the page's ground colour as you scroll, so moving down the homepage
   feels like moving through rooms rather than reading one long white page.

   Renders nothing. It writes a single CSS custom property (--wash) on the
   root element; every section that opts in uses `background: var(--wash)`
   rather than a hard-coded colour, which keeps the whole effect inside the
   token system exactly like the rest of src/index.css.

   Deliberately restrained: these stops are all within a few percent of the
   original porcelain. Anything stronger and the violet accents stop reading
   as accents, and body text contrast starts moving around underneath you. */

/* Stops are [scrollProgress 0..1, r, g, b]. The first is the site's real
   --ground, so the top of the page is unchanged from the static design. */
const STOPS: [number, [number, number, number]][] = [
  [0.00, [244, 242, 251]], // --ground, porcelain
  [0.30, [243, 240, 250]], // barely cooler through the problem section
  [0.55, [246, 243, 248]], // warms very slightly at the capability tour
  [0.80, [242, 241, 251]], // back toward violet before the dark band
  [1.00, [240, 238, 250]],
];

function mix(a: [number, number, number], b: [number, number, number], t: number) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function colorAt(progress: number) {
  const p = Math.min(Math.max(progress, 0), 1);
  for (let i = 0; i < STOPS.length - 1; i += 1) {
    const [p0, c0] = STOPS[i];
    const [p1, c1] = STOPS[i + 1];
    if (p >= p0 && p <= p1) {
      const span = p1 - p0;
      const t = span === 0 ? 0 : (p - p0) / span;
      const [r, g, b] = mix(c0, c1, t);
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
  const last = STOPS[STOPS.length - 1][1];
  return `rgb(${last[0]}, ${last[1]}, ${last[2]})`;
}

export default function ScrollColorWash() {
  useEffect(() => {
    // A colour that shifts under the reader is motion; honour the setting and
    // leave --wash at its CSS default (which is exactly --ground).
    if (prefersReducedMotion()) return;

    const root = document.documentElement;
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollable = document.body.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      root.style.setProperty('--wash', colorAt(progress));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      // Hand the token back to the stylesheet so other routes are unaffected.
      root.style.removeProperty('--wash');
    };
  }, []);

  return null;
}
