import { ArrowRight } from 'lucide-react';
import { useReveal } from '../../lib/motion';
import HeroAskDemo from './HeroAskDemo';

/* Structure borrowed from the OmniRoute-style hero: a plain colour eyebrow,
   a big left-aligned headline, a proof row under the CTAs, and a visual
   sitting beside the text rather than under it — all still on the site's
   own "Electric Violet on Porcelain" tokens, not a dark theme. */

/* Inline system tag, dropped straight into the subcopy sentence — the "what
   it connects to" list reads as distinct chips instead of more prose, which
   is both shorter and the "different, unique" treatment that was asked for. */
function Tag({ children }: { children: string }) {
  return (
    <span
      className="font-mono"
      style={{
        display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap',
        fontSize: '0.72em', fontWeight: 700, letterSpacing: '0.2px',
        color: 'var(--primary)', background: 'var(--primary-wash)',
        border: '1px solid var(--primary-line)', borderRadius: '6px',
        padding: '1px 7px', margin: '0 1px',
      }}
    >
      {children}
    </span>
  );
}

export default function Hero() {
  const eyebrowRef = useReveal<HTMLParagraphElement>({ y: 14, duration: 600, delay: 0 });
  const headlineRef = useReveal<HTMLHeadingElement>({ y: 28, duration: 800, delay: 120 });
  const subRef = useReveal<HTMLParagraphElement>({ y: 20, duration: 700, delay: 260 });
  const ctaRef = useReveal<HTMLDivElement>({ y: 18, duration: 650, delay: 380 });

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--wash)',
        padding: 'clamp(64px, 10vw, 120px) 0 clamp(56px, 7vw, 88px)',
      }}
    >
      {/* Graph-paper grid, faded out toward the edges — the "colour effects" texture. */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(var(--line-soft) 1px, transparent 1px), linear-gradient(90deg, var(--line-soft) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(ellipse 75% 65% at 38% 25%, #000 40%, transparent 88%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 38% 25%, #000 40%, transparent 88%)',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute', top: '-22%', left: '18%',
          width: 'min(900px, 100vw)', height: '560px', pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.18) 0%, rgba(200,240,75,0.07) 42%, transparent 70%)',
          filter: 'blur(8px)',
        }}
      />

      <div className="relative max-w-[1240px] mx-auto px-6 grid lg:grid-cols-2 gap-x-16 gap-y-14 items-center">
        <div className="flex flex-col">
          {/* Parent-brand lockup: the product is named first, the company
              endorses it. Virgo has no customers yet, so A.R.M's name carries
              the credibility — the track record itself lives on /company. */}
          <p
            ref={eyebrowRef}
            className="font-mono"
            style={{
              opacity: 0,
              fontSize: '13px', letterSpacing: '1.8px', textTransform: 'uppercase',
              marginBottom: '18px',
            }}
          >
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Virgo</span>
            <span style={{ color: 'var(--faint)' }}> · by A.R.M Technologies</span>
          </p>

          <h1
            ref={headlineRef}
            className="font-display"
            style={{
              opacity: 0,
              fontWeight: 800,
              fontSize: 'clamp(42px, 5.6vw, 80px)',
              lineHeight: 0.98,
              color: 'var(--ink)',
              marginBottom: '22px',
            }}
          >
            {/* Below md this breaks after "system" so the CTA (reordered
                right after the heading on mobile, see below) has a short
                last line to sit near. At md+ the br is display:none and
                the {' '} keeps the words apart, so it reads exactly like
                the original single-line-wrapping headline. */}
            Run every system{' '}
            <br className="md:hidden" />
            with one question.
          </h1>

          {/* One action, not two — a single, unambiguous next step. Placeholder
              target: scrolls to the existing pilot form at #pilot until a real
              booking link (Calendly or similar) is supplied to swap in here.
              Ordered right after the heading on mobile, back to its original
              spot after the subcopy from md up. */}
          <div
            ref={ctaRef}
            className="order-3 md:order-4 mb-8 md:mb-0"
            style={{ opacity: 0, display: 'flex', gap: '12px', flexWrap: 'wrap' }}
          >
            <a href="#pilot" className="pill pill-glass">
              Book a demo <ArrowRight size={15} />
            </a>
          </div>

          <p
            ref={subRef}
            className="font-body order-4 md:order-3"
            style={{
              opacity: 0,
              fontSize: 'clamp(16px, 1.4vw, 19px)',
              lineHeight: 1.6,
              color: 'var(--muted)',
              maxWidth: '520px',
              margin: '0 0 32px',
            }}
          >
            Virgo connects your <Tag>PMS</Tag> <Tag>Accounting</Tag> <Tag>Guest Messages</Tag>{' '}
            <Tag>Inspections</Tag> and <Tag>Maintenance</Tag>, then answers anything instantly
            and flags what needs a person.
          </p>
        </div>

        {/* The product doing the thing the headline promises: a question types
            itself, the sources light up, an answer lands. Loops. */}
        <div>
          <HeroAskDemo />
        </div>
      </div>
    </section>
  );
}
