import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link2, Brain, MessageCircle } from 'lucide-react';
import { useStaggerReveal, useReveal, prefersReducedMotion } from '../../lib/motion';
import ConnectMock from '../home/ConnectMock';
import CursorSpotlight from '../home/CursorSpotlight';

/* A genuine sequence — you connect before it can learn, it learns before it
   can answer — so the numbering carries real information.

   Direction B from the "How it works" comparison: auto-advancing on a timer
   (same loop pattern as HeroAskDemo) rather than click-only — clicking a
   step still jumps straight to it and resets the timer, but nobody has to
   click for the section to do anything. Not scroll-pinned (the capability
   section already tried full-screen scroll-pinning
   twice this session and both times fought short viewports — this section
   deliberately avoids that class of bug entirely). Steps live on the left;
   one shared panel on the right swaps per step, carrying a real UI mock
   through all three rather than dropping to plain icon cards after step 1. */

const steps = [
  {
    num: '01',
    icon: Link2,
    title: 'Connect your tools',
    desc: 'Point Virgo at the systems you already run — PMS, accounting, guest messaging. Read-only, via official APIs. Around 20 minutes, no IT team, no migration.',
  },
  {
    num: '02',
    icon: MessageCircle,
    title: 'Ask in plain English',
    desc: 'One chat box, any question. No dashboards to learn, no reports to build, no filters to set.',
  },
  {
    num: '03',
    icon: Brain,
    title: 'Virgo goes and gets it',
    desc: 'It works out which tools hold the answer, gathers what it needs from each, and replies — naming the source of every figure.',
  },
];

/* Same window-chrome language as ConnectMock / HeroAskDemo, kept local and
   small since steps 2 and 3 only need a sliver of it, not the full mock. */
function MiniWindow({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--surface)', border: '1px solid var(--line)',
        borderRadius: 'var(--radius-card)', boxShadow: '0 24px 60px rgba(20,18,26,0.10)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '12px 16px', borderBottom: '1px solid var(--line-soft)', background: 'var(--surface-alt)',
        }}
      >
        <div style={{ display: 'flex', gap: '6px' }}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
            <span key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />
          ))}
        </div>
        <span className="font-body" style={{ fontSize: '12px', color: 'var(--faint)' }}>{title}</span>
      </div>
      <div style={{ padding: 'clamp(20px, 2.6vw, 28px)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {children}
      </div>
    </div>
  );
}

function MiniBubble({ children, from }: { children: ReactNode; from: 'user' | 'virgo' }) {
  const isUser = from === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <div
        className="font-body"
        style={{
          maxWidth: '86%', fontSize: '13.5px', lineHeight: 1.6, padding: '11px 15px',
          color: isUser ? 'var(--ink)' : 'var(--ink-soft)',
          background: isUser ? 'var(--primary-wash)' : 'var(--surface-alt)',
          border: `1px solid ${isUser ? 'var(--primary-line)' : 'var(--line)'}`,
          borderRadius: isUser ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* The three right-column panels, index-matched to `steps`. Step 1 reuses
   ConnectMock outright rather than rebuilding it. Steps 2 and 3 reuse the
   exact same fictional Meridian exchange as HeroAskDemo's first entry, so
   the figures are consistent wherever they appear on the site. */
function StepPanel({ index }: { index: number }) {
  if (index === 0) return <ConnectMock />;
  if (index === 1) {
    return (
      <MiniWindow title="Virgo · The Meridian">
        <MiniBubble from="user">How are we tracking against last month?</MiniBubble>
      </MiniWindow>
    );
  }
  return (
    <MiniWindow title="Virgo · The Meridian">
      <MiniBubble from="user">How are we tracking against last month?</MiniBubble>
      <MiniBubble from="virgo">£47,200 so far, up 18% on last month — from your PMS and Xero.</MiniBubble>
    </MiniWindow>
  );
}

const AUTO_ADVANCE_MS = 4500;

export default function VirgoHowItWorks() {
  const [active, setActive] = useState(0);
  const headingRef = useStaggerReveal<HTMLDivElement>({ y: 28, duration: 620, staggerDelay: 100 });
  const bodyRef = useReveal<HTMLDivElement>({ y: 28, duration: 650, delay: 100 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-advances on a loop, same as HeroAskDemo. Picking a step manually
  // jumps straight there and restarts the loop from that point, rather than
  // fighting whatever the timer was about to do.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    timerRef.current = setTimeout(() => {
      setActive(i => (i + 1) % steps.length);
    }, AUTO_ADVANCE_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active]);

  function selectStep(i: number) {
    setActive(i);
  }

  return (
    <CursorSpotlight
      style={{
        background: 'var(--wash)',
        borderTop: '1px solid var(--line-soft)',
      }}
    >
    <section
      id="how-it-works"
      style={{
        padding: 'clamp(70px, 9vw, 118px) 0',
      }}
    >
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
        <div ref={headingRef} style={{ textAlign: 'center', marginBottom: '52px' }}>
          <p
            className="font-mono"
            style={{ opacity: 0, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: '16px' }}
          >
            How it works
          </p>
          <h2
            className="font-display"
            style={{ opacity: 0, fontWeight: 800, fontSize: 'clamp(26px, 4vw, 46px)', color: 'var(--ink)', lineHeight: 1.05 }}
          >
            From connected systems to one clear answer.
          </h2>
        </div>

        <div ref={bodyRef} style={{ opacity: 0 }} className="grid md:grid-cols-[0.85fr_1.15fr] gap-10 md:gap-14 items-center">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {steps.map((step, i) => {
              const Icon = step.icon;
              const on = i === active;
              return (
                <button
                  key={step.num}
                  onClick={() => selectStep(i)}
                  className="font-body"
                  style={{
                    textAlign: 'left', display: 'flex', gap: '16px',
                    padding: '18px 4px', border: 'none', background: 'transparent', cursor: 'pointer',
                    borderLeft: `2px solid ${on ? 'var(--primary)' : 'var(--line)'}`,
                    paddingLeft: '20px',
                    transition: 'border-color 250ms ease',
                  }}
                >
                  <div
                    style={{
                      flexShrink: 0, width: '40px', height: '40px', borderRadius: '12px',
                      background: on ? 'var(--primary-wash)' : 'var(--surface)',
                      border: `1px solid ${on ? 'var(--primary-line)' : 'var(--line)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 250ms ease, border-color 250ms ease',
                    }}
                  >
                    <Icon size={18} style={{ color: on ? 'var(--primary)' : 'var(--faint)' }} />
                  </div>
                  <div>
                    <div
                      className="font-mono"
                      style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', color: on ? 'var(--primary)' : 'var(--faint)', marginBottom: '4px' }}
                    >
                      STEP {step.num}
                    </div>
                    <h3
                      className="font-display"
                      style={{ fontWeight: 800, fontSize: '19px', color: on ? 'var(--ink)' : 'var(--ink-soft)', marginBottom: '6px' }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="font-body"
                      style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--muted)', margin: 0, maxWidth: '360px' }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* One shared frame, sized for the tallest panel (ConnectMock) so
              switching steps doesn't jump the page height. The floor is much
              lower on a phone: reserving 420px there leaves a wall of empty
              space under the short panels, and a little height jump costs less
              than that does. */}
          <div className="min-h-[260px] md:min-h-[clamp(420px,52vh,560px)]" style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '100%' }}>
              <StepPanel index={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
    </CursorSpotlight>
  );
}
