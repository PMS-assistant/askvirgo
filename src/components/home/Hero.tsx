import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { useReveal } from '../../lib/motion';

/* "The answer is the headline" (option A1 from the askvirgo.co.uk first-screen
   mockups). Instead of a product screenshot, the hero IS a manager's question
   and Virgo's answer, with every figure footnoted to the system it came from.
   Four roles take turns every ROTATE_MS; hovering or focusing pauses it, and
   the role tabs jump straight to one.

   Copy rule (see CLAUDE.md): every source named here must be a connector that
   is actually live — booking system (PMS), Xero, WhatsApp. Weather, events and
   competitor rates are roadmap only, so they never appear as a source. All
   figures are a clearly labelled sample hotel, not a customer. */

const ROTATE_MS = 5000;

type Note = { source: string; detail: string };
type Slide = { role: string; time: string; question: string; answer: ReactNode; notes: [Note, Note, Note] };

function Fig({ n, children }: { n: number; children: ReactNode }) {
  return (
    <span className="hero-fig">
      {children}
      <sup className="font-mono">{n}</sup>
    </span>
  );
}

const SLIDES: Slide[] = [
  {
    role: 'General manager',
    time: '07:02',
    question: 'How are we tracking against last month?',
    answer: (
      <>£47,200 so far, <Fig n={1}>up 18%</Fig> on last month. Rooms brought in <Fig n={2}>£39,800</Fig> and costs are <Fig n={3}>on budget</Fig>.</>
    ),
    notes: [
      { source: 'Booking system', detail: '1–24 Oct against 1–24 Sep' },
      { source: 'Booking system', detail: 'RevPAR £89.40 · 445 room nights' },
      { source: 'Xero', detail: 'Profit and loss, month to date' },
    ],
  },
  {
    role: 'Owner',
    time: '08:15',
    question: 'How did last week compare with a year ago?',
    answer: (
      <>Revenue was <Fig n={1}>up 9%</Fig> at £21,400, but commission took <Fig n={2}>£3,100</Fig>, so profit grew <Fig n={3}>only 4%</Fig>.</>
    ),
    notes: [
      { source: 'Booking system', detail: '13–19 Oct 2026 against 14–20 Oct 2025' },
      { source: 'Booking system', detail: 'Online travel agent bookings, by channel' },
      { source: 'Xero', detail: 'Profit and loss, same two weeks' },
    ],
  },
  {
    role: 'Accountant',
    time: '09:30',
    question: 'Do September’s folios match the accounts?',
    answer: (
      <>Within <Fig n={1}>£312</Fig>. The gap is <Fig n={2}>2 unpaid folios</Fig> and <Fig n={3}>a refund</Fig> not yet posted in Xero.</>
    ),
    notes: [
      { source: 'Booking system and Xero', detail: 'September close, folios against ledger' },
      { source: 'Booking system', detail: 'Rooms 114 and 207, checked out unpaid' },
      { source: 'Xero', detail: '£86 refund issued 28 Sep, not posted' },
    ],
  },
  {
    role: 'Duty manager',
    time: '06:45',
    question: 'Anything I should know before my shift?',
    answer: (
      <><Fig n={1}>3 rooms</Fig> won’t be ready for 11:00 arrivals, <Fig n={2}>a guest</Fig> needs a late check-in, and <Fig n={3}>2 bills</Fig> are still open from last night.</>
    ),
    notes: [
      { source: 'Booking system', detail: 'Housekeeping status, rooms 301, 305, 312' },
      { source: 'WhatsApp', detail: 'Message received 06:31, needs a person' },
      { source: 'Booking system', detail: 'Rooms 118 and 204, balance outstanding' },
    ],
  },
];

export default function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // Bumped on every manual pick so the timer and the progress bar restart.
  const [cycle, setCycle] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const rotatorRef = useReveal<HTMLDivElement>({ y: 20, duration: 700, delay: 0 });
  const footRef = useReveal<HTMLDivElement>({ y: 16, duration: 650, delay: 200 });

  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(() => setActive((i) => (i + 1) % SLIDES.length), ROTATE_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, cycle]);

  const pick = useCallback((i: number) => {
    setActive(i);
    setCycle((c) => c + 1);
  }, []);

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + SLIDES.length) % SLIDES.length;
    pick(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section className="hero-answer" aria-label="Virgo answering questions from four roles">
      <div className="relative max-w-[1240px] mx-auto px-6">
        <div
          ref={rotatorRef}
          style={{ opacity: 0 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false); }}
        >
          <div className="hero-roles" role="tablist" aria-label="Who is asking">
            {SLIDES.map((s, i) => (
              <button
                key={s.role}
                ref={(el) => { tabRefs.current[i] = el; }}
                type="button"
                role="tab"
                id={`hero-tab-${i}`}
                aria-selected={i === active}
                aria-controls={`hero-slide-${i}`}
                tabIndex={i === active ? 0 : -1}
                className={`hero-role font-body${i === active ? ' is-on' : ''}`}
                onClick={() => pick(i)}
                onKeyDown={(e) => onTabKey(e, i)}
              >
                {s.role}
                <i
                  key={i === active ? `bar-${active}-${cycle}` : 'bar'}
                  className="hero-role-bar"
                  style={{
                    animationDuration: `${ROTATE_MS}ms`,
                    animationPlayState: paused ? 'paused' : 'running',
                  }}
                />
              </button>
            ))}
          </div>

          <div className="hero-slides">
            {SLIDES.map((s, i) => (
              <div
                key={s.role}
                id={`hero-slide-${i}`}
                role="tabpanel"
                aria-labelledby={`hero-tab-${i}`}
                aria-hidden={i !== active}
                className={`hero-slide${i === active ? ' is-on' : ''}`}
              >
                <div>
                  <p className="hero-asked">
                    <span className="font-mono hero-asked-time">{s.time} · {s.role} asked</span>
                    <q className="font-answer">{s.question}</q>
                  </p>
                  {/* The answer is the page's headline for the active slide only;
                      hidden slides render it as a plain paragraph. */}
                  {i === active ? (
                    <h1 className="font-answer hero-answer-text">{s.answer}</h1>
                  ) : (
                    <p className="font-answer hero-answer-text">{s.answer}</p>
                  )}
                </div>

                <div aria-label="Where these figures came from">
                  <p className="font-mono hero-eyebrow">Where these figures came from</p>
                  <ol className="hero-notes">
                    {s.notes.map((n, k) => (
                      <li key={k} className="hero-note">
                        <span className="font-mono hero-note-n">{k + 1}</span>
                        <span>
                          <b>{n.source}</b>
                          <span>{n.detail}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                  <p className="font-mono hero-sample">Sample hotel · The Meridian</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div ref={footRef} style={{ opacity: 0 }} className="hero-foot">
          <p className="font-body hero-foot-text">
            <strong>Ask your hotel anything.</strong>{' '}
            <span>Virgo reads your booking system, accounts and guest messages, and answers in plain English with a source for every figure.</span>
          </p>
          <div className="hero-actions">
            {/* Placeholder target: the pilot form at #pilot, until a real
                booking link is chosen. */}
            <a href="#pilot" className="pill pill-ink">
              Book a demo <ArrowRight size={15} />
            </a>
            <span className="font-body hero-readonly">
              <Lock size={14} aria-hidden /> Read-only
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
