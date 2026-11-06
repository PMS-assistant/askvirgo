import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUp, Lock } from 'lucide-react';
import { prefersReducedMotion } from '../../lib/motion';

/* The first screen: "Good morning." (or afternoon or evening, by the
   visitor's clock) above the big line "Talk to your hotel like you talk to
   your team.", over a real photo of
   a hotel lobby (public/images/hero-lobby*.jpg, Unsplash License, photo by
   Frames For Your Heart), with a "Try asking" card on the right. A light veil
   keeps the text side readable; the photo shows clearly on the right. The card runs on
   its own (the owner's rule: automatic, nothing to click): a question types
   itself into the box, its suggestion lights, the answer appears with its
   sources, and after a pause the next one starts. It pauses off screen and
   shows the first answer still under reduced motion.

   Every answer is sample data for the fictional Meridian and uses the same
   figures as the rest of the page (virgo.pdf use cases UC-2, UC-5, UC-12,
   UC-15). Sources are named by category, never by vendor. */

type Ask = { q: string; a: string; sources: string[] };

const ASKS: Ask[] = [
  { q: 'How did we do last week?',
    a: 'Rooms took £21,400 last week. After £3,100 in commission and the week’s costs, £8,500 was left.',
    sources: ['PMS', 'Channel manager', 'Accounting'] },
  { q: 'Who’s arriving today?',
    a: '12 arrivals. Ms Patel is due first, at 14:00, and her room, 214, is still being cleaned.',
    sources: ['PMS'] },
  { q: 'Any guest messages need me?',
    a: 'Two need a person: a complaint about the heating in room 312, and a request for an accessible room.',
    sources: ['Guest messaging'] },
  { q: 'Costs this month?',
    a: 'On budget. Revenue is £47,200 so far, up 18% on last month.',
    sources: ['Accounting', 'PMS'] },
];

const TYPE_MS = 42;      // per character
const THINK_MS = 650;    // between the question landing and the answer
const HOLD_MS = 4600;    // how long an answer stays

/* The greeting follows the visitor's own clock (the browser's time zone):
   morning until 12:00, afternoon until 17:00, evening after that and
   through the night. */
function greetingFor(hour: number) {
  if (hour >= 5 && hour < 12) return 'Good morning.';
  if (hour >= 12 && hour < 17) return 'Good afternoon.';
  return 'Good evening.';
}

export default function Hero() {
  const [greeting, setGreeting] = useState(() => greetingFor(new Date().getHours()));

  const rootRef = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'thinking' | 'answer'>('typing');
  const [running, setRunning] = useState(false);
  const still = useRef(false);

  // Run only while the hero is on screen; under reduced motion show one answer, still.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      still.current = true;
      setTyped(ASKS[0].q.length);
      setPhase('answer');
      return;
    }
    const io = new IntersectionObserver(entries => setRunning(entries[entries.length - 1].isIntersecting), { threshold: 0.2 });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (still.current || !running) return;
    const q = ASKS[i].q;
    let t: number;
    if (phase === 'typing') {
      t = window.setTimeout(() => (typed < q.length ? setTyped(typed + 1) : setPhase('thinking')), typed === 0 ? 400 : TYPE_MS);
    } else if (phase === 'thinking') {
      t = window.setTimeout(() => setPhase('answer'), THINK_MS);
    } else {
      t = window.setTimeout(() => { setI((i + 1) % ASKS.length); setTyped(0); setPhase('typing'); }, HOLD_MS);
    }
    return () => clearTimeout(t);
  }, [i, typed, phase, running]);

  // Keep the greeting right if the page stays open past 12:00 or 17:00.
  useEffect(() => {
    const id = window.setInterval(() => setGreeting(greetingFor(new Date().getHours())), 60_000);
    return () => clearInterval(id);
  }, []);

  const ask = ASKS[i];

  return (
    <section ref={rootRef} className="hv">
      <div className="hv-inner">
        <div className="hv-copy">
          <h1>
            <span className="hv-greet">{greeting}</span>
            <span className="hv-line">Talk to your hotel like you talk to your team.</span>
          </h1>
          <p>Ask one question instead of logging into the PMS, the accounts and the guest inbox.</p>
          <div className="hv-actions">
            <a href="#pilot" className="a1-btn">
              Book a demo <ArrowRight size={17} aria-hidden />
            </a>
            <a href="#how-it-works" className="hv-link">See how it works</a>
          </div>
        </div>

        <div className="hv-card" aria-label="A sample question and Virgo’s answer">
          <span className="hv-card-label">Try asking</span>
          <div className="hv-input">
            <span className="hv-typed">
              {ask.q.slice(0, typed)}
              {phase === 'typing' && <i className="hv-caret" aria-hidden />}
            </span>
            <span className={phase === 'thinking' ? 'hv-send hv-send-on' : 'hv-send'} aria-hidden><ArrowUp size={15} /></span>
          </div>
          <div className="hv-chips" aria-hidden>
            {ASKS.map((x, k) => (
              <span key={x.q} className={k === i ? 'hv-chip hv-chip-on' : 'hv-chip'}>{x.q}</span>
            ))}
          </div>
          <div className="hv-answer-wrap">
            <div className={phase === 'answer' ? 'hv-answer hv-answer-on' : 'hv-answer'}>
              <p>{ask.a}</p>
              <div className="hv-src">
                <span className="hv-tags">{ask.sources.map(s => <span key={s}>{s}</span>)}</span>
                <span className="hv-sample">Sample data</span>
              </div>
            </div>
            {phase === 'thinking' && <span className="hv-dots" aria-hidden><i /><i /><i /></span>}
          </div>
          <span className="hv-ro"><Lock size={14} aria-hidden />Read-only on your systems.</span>
        </div>
      </div>
    </section>
  );
}
