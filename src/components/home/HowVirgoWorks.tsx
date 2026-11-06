import { useEffect, useRef } from 'react';
import { Lock } from 'lucide-react';
import { prefersReducedMotion } from '../../lib/motion';

/* How Virgo works: a light bento of five tiles, each a plain answer to what a
   general manager or owner actually asks, with a small picture of it
   happening (owner's direction, 2026-11-06: light tints, saffron only as an
   accent, no abstract points, fits one screen).

   1 Works with the systems you already run (R1, read-only)
   2 Your morning, ready at 7am (UC-1 briefing)
   3 Every number shows its source (R3)
   4 Problems reach the right team first (UC-2, UC-19/20, R10)
   5 Guests answered, day and night (UC-14, UC-15, R9)

   Tiles rise in when the section comes into view; the small loops (pulses,
   the red dot) are CSS and stop under reduced motion. Sample data. */

export default function HowVirgoWorks() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) { el.classList.add('bn-in'); return; }
    const io = new IntersectionObserver(entries => {
      if (entries[entries.length - 1].isIntersecting) { el.classList.add('bn-in'); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="bn">
      <div className="bn-inner">
        <div className="bn-head">
          <span className="bn-eyebrow">How it works</span>
          <h2>How Virgo works.</h2>
        </div>

        <div ref={ref} className="bn-grid">
          <article className="bn-tile bn-t1">
            <div className="bn-flow" aria-hidden>
              <span className="bn-sys">PMS</span>
              <span className="bn-sys">Accounts</span>
              <span className="bn-sys">Guest messages</span>
              <svg viewBox="0 0 400 200" preserveAspectRatio="none">
                <path d="M0 24 C 200 24, 220 100, 400 100" />
                <path d="M0 100 L 400 100" />
                <path d="M0 176 C 200 176, 220 100, 400 100" />
                <path className="bn-pulse" d="M0 24 C 200 24, 220 100, 400 100" />
                <path className="bn-pulse bn-pulse-2" d="M0 100 L 400 100" />
                <path className="bn-pulse bn-pulse-3" d="M0 176 C 200 176, 220 100, 400 100" />
              </svg>
              <div className="bn-core"><i /><span><Lock size={12} aria-hidden />Read-only</span></div>
            </div>
            <h3>Works with the systems you already run.</h3>
            <p>Nothing new for your team to learn. Virgo only reads, so nothing in your PMS or accounts changes.</p>
          </article>

          <article className="bn-tile bn-t2">
            <div className="bn-brief" aria-hidden>
              <span className="bn-brief-h">07:00 · Today</span>
              <div><b>82%</b><span>Occupancy</span></div>
              <div><b>12</b><span>Arrivals</span></div>
              <div className="bn-hot"><b>3</b><span>Need you</span></div>
            </div>
            <h3>Your morning, ready at 7am.</h3>
            <p>Tonight’s numbers and what needs you, in one place.</p>
          </article>

          <article className="bn-tile bn-t3">
            <span className="bn-fig" aria-hidden><u>£47,200</u><sup>1</sup></span>
            <span className="bn-fig-note" aria-hidden><b>1</b>From your PMS · 1–24 Oct</span>
            <h3>Every number shows its source.</h3>
            <p>Click any figure to see where it came from.</p>
          </article>

          <article className="bn-tile bn-t4">
            <div className="bn-alert" aria-hidden>
              <div className="bn-alert-row"><span className="bn-dot" /><b>Room 214 isn’t ready</b><em>Ms Patel arrives 14:00</em></div>
              <span className="bn-alert-ok">✓ Housekeeping told · 10:44</span>
            </div>
            <h3>Problems reach the right team first.</h3>
            <p>Virgo drafts the message to housekeeping or maintenance. You press Send.</p>
          </article>

          <article className="bn-tile bn-t5">
            <div className="bn-chat" aria-hidden>
              <div className="bn-c-in">What time is breakfast?</div>
              <div className="bn-c-out">7 to 10am in the Garden Room.</div>
              <span className="bn-c-note">Complaints go straight to your duty manager</span>
            </div>
            <h3>Guests answered, day and night.</h3>
            <p>From your own hotel notes. Complaints go to your duty manager, and one switch turns it off.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
