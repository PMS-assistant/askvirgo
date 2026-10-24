import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useReveal, useStaggerReveal, useScrollScrub } from '../../lib/motion';

/* The transformation panel. Each row is a real workflow a hotel manager
   already does — the LEFT column is today, the RIGHT column is Virgo. */
const ROWS = [
  {
    task: 'Morning occupancy check',
    before: 'Open PMS → switch to Xero → count bookings → switch to WhatsApp web → recheck.',
    after: 'Ask: "How many check-ins do we have today and is anything outstanding?" One answer, every source listed.',
  },
  {
    task: 'Weekly revenue figure',
    before: 'Download PMS report → download Xero report → paste into a spreadsheet → eyeball totals.',
    after: 'Ask: "How is this week tracking against last?" Answer includes the percentage and where each number came from.',
  },
  {
    task: 'The morning briefing',
    before: 'Nobody writes you one. You assemble the picture yourself, app by app, before the day starts.',
    after: 'A one-page summary is waiting at 7am — what needs attention today, and what changed overnight.',
  },
  {
    task: 'Pre-arrival guest questions',
    before: 'Open WhatsApp on the manager\'s phone, copy-paste a template, hope the message lands.',
    after: 'Virgo sends the message automatically the moment the booking lands, and reads the reply first.',
  },
];

/* A small inline chip, reusing the tag language from the hero subcopy so the
   same device (named system → violet pill) reads consistently wherever it
   appears on the page, rather than inventing a second visual convention. */
function Chip({ children, tone }: { children: string; tone: 'before' | 'after' }) {
  const isAfter = tone === 'after';
  return (
    <span
      className="font-mono"
      style={{
        display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap',
        fontSize: '12.5px', fontWeight: 700, letterSpacing: '0.2px',
        color: isAfter ? 'var(--primary)' : 'var(--muted)',
        background: isAfter ? 'var(--primary-wash)' : 'var(--surface)',
        border: `1px solid ${isAfter ? 'var(--primary-line)' : 'var(--line)'}`,
        borderRadius: '6px', padding: '3px 9px', margin: '2px 2px',
      }}
    >
      {children}
    </span>
  );
}

function Hatch({ color }: { color: string }) {
  return (
    <div
      aria-hidden
      className="hatch"
      style={{
        position: 'absolute', top: 0, right: 0, width: '150px', height: '110px',
        color, opacity: 0.45, pointerEvents: 'none',
        maskImage: 'linear-gradient(225deg, #000 10%, transparent 65%)',
        WebkitMaskImage: 'linear-gradient(225deg, #000 10%, transparent 65%)',
      }}
    />
  );
}

export default function BeforeAfter() {
  const headRef = useStaggerReveal<HTMLDivElement>({ y: 24, duration: 600, staggerDelay: 90 });
  const stripRef = useReveal<HTMLDivElement>({ y: 20, duration: 650, delay: 120 });
  const rowsRef = useStaggerReveal<HTMLDivElement>({ y: 22, duration: 620, staggerDelay: 130 });

  // A progress line down the left of the rows, filling violet as you scroll
  // through them — the "before → after" idea rendered as motion, not just copy.
  const scrubTrackRef = useRef<HTMLDivElement>(null);
  const fillRef = useScrollScrub<HTMLDivElement>(
    { scaleY: [0, 1] },
    { container: scrubTrackRef }
  );

  return (
    <section
      style={{
        background: 'var(--wash)',
        padding: 'clamp(64px, 8vw, 100px) 0',
      }}
    >
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 24px' }}>
        <div ref={headRef} style={{ textAlign: 'center', marginBottom: '52px' }}>
          <p
            className="font-mono"
            style={{
              opacity: 0, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--faint)', marginBottom: '16px',
            }}
          >
            Before & after
          </p>
          <h2
            className="font-display"
            style={{
              opacity: 0, fontWeight: 800,
              // Floor is 27px, not 30px: "Same tasks. Fewer steps." measures
              // 357px at 30px, which overflows a 342px phone column — and the
              // forced <br> after it means the line can't rebalance, so it
              // wraps raggedly instead. 27px brings it to ~321px.
              fontSize: 'clamp(27px, 4.4vw, 52px)', color: 'var(--ink)',
              lineHeight: 1.04,
            }}
          >
            Same tasks. Fewer steps.
            <br />
            <span style={{ color: 'var(--primary)' }}>Every source shown.</span>
          </h2>
        </div>

        {/* The aggregate line — a single honest count pulled straight from the
            four rows below (the systems those "before" columns actually name),
            not an invented company-wide metric. Virgo has no customers yet to
            source a real stat from, so this is the one summary claim that's
            true today rather than borrowed credibility. */}
        <div
          ref={stripRef}
          style={{
            opacity: 0,
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center',
            gap: '10px', textAlign: 'center',
            maxWidth: '760px', margin: '0 auto 40px',
            padding: '18px 22px',
            background: 'var(--surface)', border: '1px solid var(--line-soft)',
            borderRadius: 'var(--radius-card)',
          }}
        >
          <span className="font-body" style={{ fontSize: '13.5px', color: 'var(--faint)', marginRight: '2px' }}>
            {/* "these four tasks" would be inaccurate on mobile, where only
                two rows render — this phrasing holds regardless of count. */}
            Across tasks like these, today it's
          </span>
          <span>
            <Chip tone="before">PMS</Chip>
            <Chip tone="before">Xero</Chip>
            <Chip tone="before">WhatsApp</Chip>
            <Chip tone="before">Spreadsheet</Chip>
          </span>
          <ArrowRight size={15} style={{ color: 'var(--faint)', flexShrink: 0 }} />
          <span>
            <Chip tone="after">Virgo</Chip>
          </span>
          <span className="font-body" style={{ fontSize: '13.5px', color: 'var(--faint)', marginLeft: '2px' }}>
            for every one of them.
          </span>
        </div>

        <div ref={scrubTrackRef} style={{ position: 'relative' }}>
          {/* Scroll-linked fill — hidden on mobile where there's no room for it. */}
          <div
            aria-hidden
            className="hidden md:block"
            style={{
              position: 'absolute', left: '-18px', top: 0, bottom: 0, width: '3px',
              background: 'var(--line-soft)', borderRadius: '2px', overflow: 'hidden',
            }}
          >
            <div
              ref={fillRef}
              style={{
                width: '100%', height: '100%', background: 'var(--primary)',
                transform: 'scaleY(0)', transformOrigin: 'top center',
              }}
            />
          </div>

          <div ref={rowsRef} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {ROWS.map((row, i) => (
            <div
              key={row.task}
              /* Four full before/after blocks was the second-longest stretch
                 of unbroken scrolling on mobile. Rows 1 and 3 (a reactive
                 query, and a proactive digest) already span both modes Virgo
                 works in, so 2 and 4 are desktop-only rather than repeating
                 that same shape. */
              className={`${i === 1 || i === 3 ? 'hidden md:grid' : 'grid'} grid-cols-1 md:grid-cols-[1fr_24px_1fr] items-stretch`}
              style={{
                opacity: 0,
                background: 'var(--surface)',
                border: '1px solid var(--line-soft)',
                borderRadius: 'var(--radius-card)',
                overflow: 'hidden',
              }}
            >
              {/* Before — deliberately cooler and flatter than After, so the
                  two sides read as different states at a glance, not just
                  different text. */}
              <div
                style={{
                  position: 'relative',
                  padding: 'clamp(22px, 2.6vw, 32px)',
                  background: 'var(--ground-deep)',
                  borderRight: '1px solid var(--line-soft)',
                }}
              >
                <Hatch color="var(--faint)" />
                <div
                  className="font-mono"
                  style={{
                    fontSize: '10.5px', letterSpacing: '1.5px', textTransform: 'uppercase',
                    fontWeight: 700, color: 'var(--faint)', marginBottom: '10px',
                  }}
                >
                  Before
                </div>
                <div
                  className="font-display"
                  style={{
                    fontWeight: 700, fontSize: 'clamp(15px, 1.7vw, 18px)',
                    color: 'var(--ink)', marginBottom: '8px', lineHeight: 1.2,
                  }}
                >
                  {row.task}
                </div>
                <p
                  className="font-body"
                  style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.65, margin: 0 }}
                >
                  {row.before}
                </p>
              </div>

              {/* Arrow */}
              <div
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--surface)',
                  borderRight: '1px solid var(--line-soft)',
                  minHeight: '100%',
                  padding: '14px 0',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="var(--primary)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* After — a violet wash, warmer and more alive than the flat
                  grey of Before. */}
              <div
                style={{
                  position: 'relative', padding: 'clamp(22px, 2.6vw, 32px)',
                  background: 'linear-gradient(135deg, var(--primary-wash) 0%, var(--surface) 70%)',
                }}
              >
                <Hatch color="var(--primary)" />
                <div
                  className="font-mono"
                  style={{
                    fontSize: '10.5px', letterSpacing: '1.5px', textTransform: 'uppercase',
                    fontWeight: 700, color: 'var(--primary)', marginBottom: '10px',
                  }}
                >
                  After
                </div>
                <div
                  className="font-display"
                  style={{
                    fontWeight: 700, fontSize: 'clamp(15px, 1.7vw, 18px)',
                    color: 'var(--ink)', marginBottom: '8px', lineHeight: 1.2,
                  }}
                >
                  {row.task}
                </div>
                <p
                  className="font-body"
                  style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.65, margin: 0 }}
                >
                  {row.after}
                </p>
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
