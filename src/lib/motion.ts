import { useEffect, useRef, useState } from 'react';
import { animate, stagger, onScroll } from 'animejs';

type RevealOptions = {
  y?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  /** Final opacity to reveal to (default 1) — set lower for elements that rest dimmed. */
  opacity?: number;
};

/**
 * Fades + slides an element in the first time it scrolls into view.
 * Replaces: motion.div initial="hidden" whileInView="visible" variants={fadeUp}
 *
 * Uses a native IntersectionObserver rather than anime.js's own onScroll —
 * onScroll only re-evaluates on an actual scroll *event*, so content already
 * inside the viewport at page load (e.g. the hero) never fires it.
 * IntersectionObserver reports the initial state immediately, so it doesn't
 * have that gap. anime.js still drives the actual tween.
 */
function isInViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
}

/**
 * Visitors who ask for reduced motion still need to *see* the content, so
 * reveals collapse to ~instant rather than being skipped — the end state
 * always lands, it just doesn't travel to get there.
 */
export function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}

function motionDuration(ms: number) {
  return prefersReducedMotion() ? 1 : ms;
}

function motionDelay(ms: number) {
  return prefersReducedMotion() ? 0 : ms;
}

export function useReveal<T extends HTMLElement = HTMLDivElement>(options: RevealOptions = {}) {
  const ref = useRef<T>(null);
  const optsRef = useRef(options);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { y = 24, duration = 700, delay = 0, ease = 'outQuad', opacity = 1 } = optsRef.current;
    // eslint-disable-next-line prefer-const -- assigned after `reveal` closes over it
    let fallback: ReturnType<typeof setTimeout> | undefined;
    const reveal = () => {
      if (fallback) clearTimeout(fallback);
      animate(el, {
        opacity: [0, opacity],
        translateY: [y, 0],
        duration: motionDuration(duration),
        delay: motionDelay(delay),
        ease,
      });
    };

    // Above-the-fold content shouldn't depend on observer scheduling at all.
    if (isInViewport(el)) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        reveal();
        observer.disconnect();
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);

    // Safety net — reproduced live: landing directly on a deep link (a
    // fresh page load already scrolled to a hash) left one of these stuck
    // at opacity: 0 forever, while an identical sibling hook a few hundred
    // pixels away revealed normally. Whatever the exact trigger an observer
    // can miss, content that appears a little late beats content that never
    // appears at all — this guarantees the latter can't happen.
    fallback = setTimeout(() => { reveal(); observer.disconnect(); }, 2500);

    return () => {
      observer.disconnect();
      if (fallback) clearTimeout(fallback);
    };
  }, []);

  return ref;
}

type StaggerRevealOptions = RevealOptions & { staggerDelay?: number };

/**
 * Fades + slides every direct child of the returned ref's element in,
 * cascaded with a stagger, the first time the container scrolls into view.
 * Replaces: parent variants={stagger} + child variants={fadeUp} composition.
 */
export function useStaggerReveal<T extends HTMLElement = HTMLDivElement>(options: StaggerRevealOptions = {}) {
  const ref = useRef<T>(null);
  const optsRef = useRef(options);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { y = 24, duration = 600, ease = 'outQuad', staggerDelay = 80, opacity = 1 } = optsRef.current;
    // eslint-disable-next-line prefer-const -- assigned after `reveal` closes over it
    let fallback: ReturnType<typeof setTimeout> | undefined;
    const reveal = () => {
      if (fallback) clearTimeout(fallback);
      const children = Array.from(el.children) as HTMLElement[];
      if (children.length) {
        animate(children, {
          opacity: [0, opacity],
          translateY: [y, 0],
          duration: motionDuration(duration),
          delay: prefersReducedMotion() ? 0 : stagger(staggerDelay),
          ease,
        });
      }
    };

    if (isInViewport(el)) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        reveal();
        observer.disconnect();
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);

    // Same safety net as useReveal — see the comment there.
    fallback = setTimeout(() => { reveal(); observer.disconnect(); }, 2500);

    return () => {
      observer.disconnect();
      if (fallback) clearTimeout(fallback);
    };
  }, []);

  return ref;
}

/**
 * Reports which of `count` steps a tall scroll container is currently passing
 * through, for sections that pin and advance a list as you scroll.
 *
 * useScrollScrub is the wrong tool for this: it seeks a continuous animation to
 * a 0→1 progress value, and can't hand back a discrete index. This computes the
 * index from how far the container's top has travelled past the viewport top.
 *
 * `enabled` lets the caller switch pinning off — the callers drop to a plain
 * stacked list below the `lg` breakpoint and under reduced motion, where
 * scroll-driven state changes are hostile rather than helpful.
 */
export function useScrollIndex(
  ref: { current: HTMLElement | null },
  count: number,
  enabled = true
) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || count <= 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      // Scrollable distance is the container's height minus the one viewport
      // the sticky child occupies while pinned.
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) return;
      const progress = Math.min(Math.max(-rect.top / travel, 0), 1);
      // Clamp to count-1 so the final step holds while the container releases.
      setIndex(Math.min(Math.floor(progress * count), count - 1));
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
    };
  }, [ref, count, enabled]);

  return index;
}

/**
 * A glow element that eases toward the mouse position within a container.
 * Replaces: useMotionValue + useSpring cursor-follow pattern.
 */
export function useCursorGlow<T extends HTMLElement = HTMLDivElement>() {
  const containerRef = useRef<T>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const glow = glowRef.current;
    if (!container || !glow) return;
    // Purely decorative — skip entirely rather than collapse to instant.
    if (prefersReducedMotion()) return;

    const handleMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      animate(glow, {
        translateX: e.clientX - rect.left,
        translateY: e.clientY - rect.top,
        duration: 600,
        ease: 'out(3)',
      });
    };

    container.addEventListener('mousemove', handleMove);
    return () => container.removeEventListener('mousemove', handleMove);
  }, []);

  return { containerRef, glowRef };
}

type MountAnimationOptions = {
  duration?: number;
  ease?: string;
};

/**
 * Keeps an element mounted through an exit animation before removing it.
 * Replaces: <AnimatePresence><motion.div exit={...} /></AnimatePresence>
 */
export function useMountAnimation<T extends HTMLElement = HTMLDivElement>(
  active: boolean,
  options: MountAnimationOptions = {}
) {
  const ref = useRef<T>(null);
  const [shouldRender, setShouldRender] = useState(active);
  const { duration = 220, ease = 'outQuad' } = options;

  useEffect(() => {
    if (active) {
      setShouldRender(true);
      return;
    }
    const el = ref.current;
    if (!el) {
      setShouldRender(false);
      return;
    }
    const anim = animate(el, {
      opacity: [1, 0],
      translateY: [0, 12],
      scale: [1, 0.96],
      duration,
      ease,
      onComplete: () => setShouldRender(false),
    });
    return () => { anim.revert(); };
  }, [active, duration, ease]);

  useEffect(() => {
    const el = ref.current;
    if (!active || !shouldRender || !el) return;
    const anim = animate(el, {
      opacity: [0, 1],
      translateY: [12, 0],
      scale: [0.96, 1],
      duration,
      ease,
    });
    return () => { anim.revert(); };
  }, [active, shouldRender, duration, ease]);

  return { ref, shouldRender };
}

/**
 * Binds an element's animated properties directly to scroll progress through
 * its container — scrolling forward/back scrubs the animation, rather than
 * just triggering a play-once reveal. This is the technique animejs.com's
 * own hero uses (a custom illustration rotating/assembling as you scroll).
 *
 * `properties` are standard anime.js animatable properties (e.g. rotate,
 * scale, translateY as keyframe arrays) — anime.js's ScrollObserver computes
 * the container's 0→1 progress through the viewport and seeks the animation
 * to match, so no manual scroll-position math is needed here.
 *
 * `container` lets the scrub track a taller wrapper than the animated
 * element itself, so there's real scroll distance to scrub through.
 */
export function useScrollScrub<T extends HTMLElement = HTMLDivElement>(
  properties: Record<string, unknown>,
  options: { ease?: string; container?: { current: HTMLElement | null } } = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Scrubbing is motion tied to scrolling — exactly what reduced-motion asks
    // us to drop. Elements must therefore be legible in their untouched state.
    if (prefersReducedMotion()) return;
    const scrollTarget = options.container?.current ?? el;

    const anim = animate(el, {
      ...properties,
      ease: options.ease ?? 'linear',
      autoplay: onScroll({
        target: scrollTarget,
        sync: true,
      }),
    });
    return () => { anim.revert(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
