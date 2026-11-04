import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { useReveal } from '../../lib/motion';

/* "Photo first" (option C from the askvirgo.co.uk first-screen mockups).
   A hotel at dawn fills the hero; the headline sits on it, and a sample ask
   card lets a visitor tap a question and see how Virgo answers. The card
   rotates through four roles every ROTATE_MS; hover or focus pauses it.

   Photo: drop a licensed image at public/hero-hotel.jpg (about 2400px wide,
   landscape, a hotel exterior or lobby in early light). Until that file
   exists the drawn dawn scene below shows instead, so the hero never breaks.

   Copy rule (see CLAUDE.md): sources named here must be live connectors —
   booking system (PMS), Xero, WhatsApp. Weather, events and competitor rates
   are roadmap only. All figures are a clearly labelled sample hotel. */

const ROTATE_MS = 5000;
const PHOTO_SRC = '/hero-hotel.jpg';

type Sample = { role: string; question: string; answer: ReactNode; sources: string[] };

function Fig({ children }: { children: ReactNode }) {
  return <span className="hero-fig">{children}</span>;
}

const SAMPLES: Sample[] = [
  {
    role: 'General manager',
    question: 'How are we tracking against last month?',
    answer: <>£47,200 so far, <Fig>up 18%</Fig> on last month. Rooms brought in <Fig>£39,800</Fig> and costs are <Fig>on budget</Fig>.</>,
    sources: ['Booking system', 'Xero'],
  },
  {
    role: 'Owner',
    question: 'How did last week compare with a year ago?',
    answer: <>Revenue was <Fig>up 9%</Fig> at £21,400, but commission took <Fig>£3,100</Fig>, so profit grew <Fig>only 4%</Fig>.</>,
    sources: ['Booking system', 'Xero'],
  },
  {
    role: 'Accountant',
    question: 'Do September’s folios match the accounts?',
    answer: <>Within <Fig>£312</Fig>. The gap is <Fig>2 unpaid folios</Fig> and <Fig>a refund</Fig> not yet posted in Xero.</>,
    sources: ['Booking system', 'Xero'],
  },
  {
    role: 'Duty manager',
    question: 'Anything I should know before my shift?',
    answer: <><Fig>3 rooms</Fig> won’t be ready for 11:00 arrivals, <Fig>a guest</Fig> needs a late check-in, and <Fig>2 bills</Fig> are still open.</>,
    sources: ['Booking system', 'WhatsApp'],
  },
];

/* Stand-in for the photo: a pale dawn sky, a low sun and a row of hotel
   blocks with a few lit windows. Colours come from the --dawn-* tokens. */
function DawnScene() {
  const windows: [number, number, number, number][] = [
    [130, 180, 26, 34], [190, 180, 26, 34], [250, 180, 26, 34], [310, 180, 26, 34], [370, 180, 26, 34],
    [130, 250, 26, 34], [250, 250, 26, 34], [370, 250, 26, 34],
    [560, 150, 24, 30], [620, 150, 24, 30], [680, 210, 24, 30], [560, 270, 24, 30],
    [860, 220, 26, 32], [980, 220, 26, 32], [1040, 280, 26, 32],
  ];
  return (
    <div className="hero-scene" aria-hidden>
      <div className="hero-sun" />
      <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice">
        <rect x="0" y="330" width="1200" height="70" style={{ fill: 'var(--dawn-ground)' }} />
        <rect x="80" y="150" width="380" height="190" style={{ fill: 'var(--dawn-block)' }} />
        <rect x="120" y="80" width="300" height="80" style={{ fill: 'var(--dawn-block-light)' }} />
        <rect x="520" y="120" width="250" height="220" style={{ fill: 'var(--dawn-block-deep)' }} />
        <rect x="820" y="190" width="320" height="150" style={{ fill: 'var(--dawn-block)' }} />
        <g style={{ fill: 'var(--dawn-window)' }} opacity="0.85">
          {windows.map(([x, y, w, h]) => <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} />)}
        </g>
      </svg>
    </div>
  );
}

export default function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [photoOk, setPhotoOk] = useState(true);

  const copyRef = useReveal<HTMLDivElement>({ y: 24, duration: 750, delay: 0 });
  const cardRef = useReveal<HTMLDivElement>({ y: 20, duration: 700, delay: 180 });

  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(() => setActive((i) => (i + 1) % SAMPLES.length), ROTATE_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, cycle]);

  const pick = useCallback((i: number) => {
    setActive(i);
    setCycle((c) => c + 1);
  }, []);

  const s = SAMPLES[active];

  return (
    <section className="hero-photo" aria-label="Virgo">
      <DawnScene />
      {photoOk && (
        <img
          className="hero-photo-img"
          src={PHOTO_SRC}
          alt=""
          onError={() => setPhotoOk(false)}
        />
      )}
      <div className="hero-scrim" aria-hidden />

      <div className="hero-photo-inner max-w-[1240px] mx-auto px-6">
        <div ref={copyRef} style={{ opacity: 0 }} className="hero-photo-copy">
          <h1 className="font-answer hero-photo-title">Good morning. Here’s your hotel.</h1>
          <p className="font-body hero-photo-sub">
            One question to Virgo replaces a morning of logging into the booking system, the accounts and the guest inbox.
          </p>
          {/* Placeholder target: the pilot form at #pilot, until a real
              booking link is chosen. */}
          <a href="#pilot" className="pill pill-ink">
            Book a demo <ArrowRight size={15} />
          </a>
        </div>

        <div
          ref={cardRef}
          style={{ opacity: 0 }}
          className="hero-askcard"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false); }}
        >
          <p className="font-body hero-askcard-label">See how Virgo answers The Meridian, a sample hotel</p>

          <div className="hero-askcard-body" aria-live="polite">
            <div key={`q-${active}-${cycle}`} className="hero-askcard-swap">
              <p className="hero-askcard-q font-body">
                <span className="font-mono hero-askcard-role">{s.role}</span>
                {s.question}
              </p>
              <p className="font-answer hero-askcard-a">{s.answer}</p>
              <p className="hero-askcard-src font-body">
                From{' '}
                {s.sources.map((src, k) => (
                  <span key={src}>
                    <span className="hero-src">{src}</span>
                    {k < s.sources.length - 1 ? ' and ' : ''}
                  </span>
                ))}
              </p>
            </div>
          </div>

          <div className="hero-askcard-chips" role="group" aria-label="Sample questions">
            {SAMPLES.map((q, i) => (
              <button
                key={q.role}
                type="button"
                className={`hero-chip font-body${i === active ? ' is-on' : ''}`}
                aria-pressed={i === active}
                onClick={() => pick(i)}
              >
                {q.role}
                <i
                  key={i === active ? `bar-${active}-${cycle}` : 'bar'}
                  className="hero-chip-bar"
                  style={{ animationDuration: `${ROTATE_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }}
                />
              </button>
            ))}
          </div>

          <span className="font-body hero-readonly">
            <Lock size={14} aria-hidden /> Read-only. Never changes your systems.
          </span>
        </div>
      </div>
    </section>
  );
}
