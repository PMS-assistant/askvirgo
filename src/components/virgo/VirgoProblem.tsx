import { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { Building2, Wallet, MessageSquare, Globe, FileSpreadsheet } from 'lucide-react';
import { useReveal, useStaggerReveal, prefersReducedMotion } from '../../lib/motion';

/* Icons rather than emoji, to match the icon language used everywhere else. */
const systems = [
  { name: 'PMS', icon: Building2, desc: 'Arrivals, availability' },
  { name: 'Accounting', icon: Wallet, desc: 'Revenue, invoices' },
  { name: 'WhatsApp', icon: MessageSquare, desc: 'Guest messages' },
  { name: 'OTAs', icon: Globe, desc: 'Rates, reviews' },
  { name: 'Spreadsheet', icon: FileSpreadsheet, desc: 'Manual reports' },
];

/* Deterministic "scatter" per card, index-matched to `systems` — how far off
   true each icon starts before snapping into its row position. Fixed values,
   not Math.random(), so the effect replays identically every time. */
const SCATTER = [
  { rotate: -11, x: -16, y: 20 },
  { rotate: 8, x: 12, y: -18 },
  { rotate: -7, x: -10, y: -14 },
  { rotate: 10, x: 16, y: 16 },
  { rotate: -9, x: -13, y: 12 },
];

/* Faint icons drifting behind the section — standing in for photography the
   site doesn't have. The visual argument is the clutter of apps itself, not
   a stock photo of someone stressed at a desk. Purely decorative: skipped
   entirely under reduced motion rather than collapsed to a static frame. */
const DRIFT = [
  { Icon: Building2, top: '10%', left: '5%', size: 46, rotate: -14 },
  { Icon: Wallet, top: '70%', left: '9%', size: 36, rotate: 11 },
  { Icon: MessageSquare, top: '16%', left: '89%', size: 42, rotate: 9 },
  { Icon: Globe, top: '74%', left: '91%', size: 32, rotate: -10 },
  { Icon: FileSpreadsheet, top: '44%', left: '2.5%', size: 28, rotate: 15 },
];

function isInViewport(el: Element) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
}

/* Types a line in, character by character, the first time it scrolls into
   view — a different motion signature from the fade/stagger used everywhere
   else on the page, reserved for the one line the section is building to. */
function useTypeOnReveal<T extends HTMLElement>(text: string) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return; // leave the server-rendered text as-is

    let tick: ReturnType<typeof setInterval>;
    const start = () => {
      el.textContent = '';
      let i = 0;
      tick = setInterval(() => {
        i += 1;
        el.textContent = text.slice(0, i);
        if (i >= text.length) clearInterval(tick);
      }, 30);
    };

    if (isInViewport(el)) {
      start();
      return () => clearInterval(tick);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        start();
        observer.disconnect();
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearInterval(tick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

export default function VirgoProblem() {
  const headingRef = useStaggerReveal<HTMLDivElement>({ y: 30, duration: 650, staggerDelay: 100 });
  const calloutRef = useReveal<HTMLDivElement>({ y: 30, duration: 700 });
  const quoteRef = useTypeOnReveal<HTMLSpanElement>('How is my hotel doing right now?');

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const driftRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Cards arrive scattered and snap into their row position, rather than a
  // plain fade — the disorder settling is the point of a "problem" section.
  useEffect(() => {
    const els = cardRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (!els.length) return;

    if (prefersReducedMotion()) {
      els.forEach(el => { el.style.opacity = '1'; });
      return;
    }

    const trigger = () => {
      els.forEach((el, i) => {
        const s = SCATTER[i % SCATTER.length];
        animate(el, {
          opacity: [0, 1],
          translateX: [s.x * 2.4, 0],
          translateY: [s.y * 2.4, 0],
          rotate: [s.rotate, 0],
          scale: [0.86, 1],
          duration: 800,
          delay: i * 90,
          ease: 'outElastic(1, 0.7)',
        });
      });
    };

    if (isInViewport(els[0])) {
      trigger();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        trigger();
        observer.disconnect();
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(els[0]);
    return () => observer.disconnect();
  }, []);

  // Background icons drift slowly, forever — decorative only, so it's
  // skipped outright under reduced motion rather than left static.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const anims = driftRefs.current.map((el, i) => {
      if (!el) return null;
      return animate(el, {
        translateY: [0, -16, 0],
        translateX: [0, 7, 0],
        duration: 5200 + i * 480,
        delay: i * 260,
        loop: true,
        ease: 'inOutSine',
      });
    });
    return () => { anims.forEach(a => a?.revert()); };
  }, []);

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--surface)',
        borderTop: '1px solid var(--line-soft)',
        padding: 'clamp(70px, 9vw, 120px) 0',
      }}
    >
      {/* A warm, tense wash — deliberately not the violet used everywhere
          else, so this section reads as the "before" mood Virgo resolves. */}
      <div
        aria-hidden
        style={{
          position: 'absolute', top: '-16%', left: '50%', transform: 'translateX(-50%)',
          width: 'min(1000px, 110vw)', height: '520px', pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, rgba(245,166,35,0.10) 0%, rgba(220,38,38,0.05) 45%, transparent 72%)',
          filter: 'blur(6px)',
        }}
      />

      {/* The five systems, scattered faintly behind the content — the "mess"
          made visible instead of illustrated with a stock photo. */}
      {DRIFT.map((d, i) => (
        <div
          key={d.top + d.left}
          ref={el => { driftRefs.current[i] = el; }}
          aria-hidden
          className="hidden md:block"
          style={{
            position: 'absolute', top: d.top, left: d.left,
            color: 'var(--ink)', opacity: 0.05, pointerEvents: 'none',
            transform: `rotate(${d.rotate}deg)`,
          }}
        >
          <d.Icon size={d.size} strokeWidth={1.4} />
        </div>
      ))}

      <div className="relative max-w-[1180px] mx-auto px-6 lg:px-10">
        <div ref={headingRef} style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p
            className="font-mono"
            style={{ opacity: 0, fontSize: '11px', color: 'var(--faint)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}
          >
            The problem
          </p>
          <h2
            className="font-display"
            style={{ opacity: 0, fontWeight: 800, fontSize: 'clamp(28px, 4.4vw, 52px)', color: 'var(--ink)', lineHeight: 1.05, marginBottom: '18px' }}
          >
            You open five apps
            <br />
            to make <span style={{ color: 'var(--primary)' }}>one decision</span>.
          </h2>
          <p
            className="font-body"
            style={{ opacity: 0, fontSize: 'clamp(15px, 1.7vw, 18px)', color: 'var(--muted)', maxWidth: '540px', margin: '0 auto', lineHeight: 1.7 }}
          >
            Every morning, hotel managers routinely lose an hour or more just collecting
            data across disconnected systems, before any real work begins.
          </p>
        </div>

        <div
          style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '56px' }}
        >
          {systems.map((sys, i) => {
            const Icon = sys.icon;
            return (
            <div
              key={sys.name}
              ref={el => { cardRefs.current[i] = el; }}
              style={{
                opacity: 0,
                background: 'var(--ground)',
                border: '1px solid var(--line-soft)',
                borderRadius: '18px',
                padding: '26px 20px',
                width: 'clamp(132px, 14vw, 168px)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '9px',
                transition: 'transform 0.3s, border-color 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--primary-line)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--line-soft)'; }}
            >
              <div
                style={{
                  width: '44px', height: '44px', borderRadius: '13px',
                  background: 'var(--primary-wash)', border: '1px solid var(--primary-line)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Icon size={20} style={{ color: 'var(--primary)' }} />
              </div>
              <span className="font-display" style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>
                {sys.name}
              </span>
              <span className="font-body" style={{ fontSize: '11.5px', color: 'var(--faint)', textAlign: 'center' }}>
                {sys.desc}
              </span>
            </div>
            );
          })}
        </div>

        <div
          ref={calloutRef}
          style={{
            opacity: 0,
            background: 'var(--primary-wash)',
            border: '1px solid var(--primary-line)',
            borderRadius: 'var(--radius-card)',
            padding: 'clamp(30px, 4vw, 50px) clamp(24px, 4vw, 54px)',
            maxWidth: '760px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <div
            className="font-display"
            style={{ fontWeight: 800, fontSize: 'clamp(20px, 3vw, 30px)', color: 'var(--ink)', marginBottom: '14px', lineHeight: 1.25 }}
          >
            That's well over an hour every morning
            {/* The forced break gives a deliberate two-line rhythm on wider
                screens. On a phone the first line alone measures ~361px inside
                a ~294px card, so holding the break would wrap it raggedly —
                below `sm` it's dropped and the sentence wraps on its own. */}
            <br className="hidden sm:inline" />{' '}
            just to answer one question:
          </div>
          <div
            className="font-body"
            style={{ fontSize: 'clamp(15px, 1.8vw, 19px)', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '22px', minHeight: '1.6em' }}
          >
            "<span ref={quoteRef}>How is my hotel doing right now?</span>"
          </div>
          <div className="font-body" style={{ fontSize: '15px', color: 'var(--ink-soft)' }}>
            Virgo answers that, and every question like it, in{' '}
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>seconds</span>.
          </div>
        </div>
      </div>
    </section>
  );
}
