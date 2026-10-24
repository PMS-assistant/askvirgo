import { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';
import { Lock, Plus, SendHorizontal } from 'lucide-react';
import { prefersReducedMotion } from '../../lib/motion';
import VirgoOrb from './VirgoOrb';

/* The hero's product demo: a question types itself, the sources it needs light
   up, and an answer arrives, on a loop. The headline next to it promises
   running every system with one question, so this shows exactly that rather
   than diagramming an architecture.

   Figures are illustrative, for the same fictional property ("The Meridian")
   used everywhere else on the site. Nothing here implies Virgo changes
   anything in a connected system: the rate question explicitly says
   recommended, not applied, and the maintenance question says Virgo alerts
   a person, not that it changes the room's status (see docs/PROGRESS.md in
   the product repo: update_room_status was retired for exactly this reason,
   and the two housekeeping/inspection questions describe capability that is
   built and tested in that backend but not yet live for a real hotel). */

const EXCHANGES = [
  {
    q: 'How are we tracking against last month?',
    sources: ['PMS', 'Xero'],
    a: '£47,200 so far, up 18% on last month. RevPAR is £89.40, above your £82 target.',
  },
  {
    q: 'Any rooms flagged for maintenance?',
    sources: ['PMS', 'Maintenance'],
    a: "Room 204 is flagged for the second time this month, so I've alerted your maintenance lead directly. Everything else is clear.",
  },
  {
    q: 'Should I raise rates this weekend?',
    sources: ['PMS', 'Rates'],
    a: "You're at 87% with 6 rooms open Saturday. Last Saturday sold out at £140 by Thursday, so I'd recommend +15%. Recommended, not applied.",
  },
  {
    q: 'Are we up to date on inspections?',
    sources: ['Inspections'],
    a: 'Yes, every housekeeping and safety checklist is current. Your next fire safety check is due in 5 days.',
  },
  {
    q: 'How many check-ins do we have today?',
    sources: ['PMS', 'Guests'],
    a: '12 arrivals today, 3 marked VIP. Ms Chen in 401 is celebrating an anniversary. First guest expected at 2pm.',
  },
  {
    q: "What's our cash position this week?",
    sources: ['Xero'],
    a: '£18,400 in the account against £6,200 in invoices due this week. No overdue payables right now.',
  },
];

type Phase = 'idle' | 'typing' | 'querying' | 'answer' | 'clearing';

const TYPE_MS = 32;
const PHASE_MS: Record<Exclude<Phase, 'typing'>, number> = {
  idle: 900,
  querying: 1300,
  answer: 4600,
  clearing: 420,
};

function TypingDots() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const anim = animate(Array.from(el.children) as HTMLElement[], {
      opacity: [0.3, 1, 0.3],
      translateY: [0, -3, 0],
      duration: 900,
      delay: stagger(170),
      loop: true,
    });
    return () => { anim.revert(); };
  }, []);

  return (
    <span ref={ref} style={{ display: 'inline-flex', gap: '3px', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--primary)' }} />
      ))}
    </span>
  );
}

export default function HeroAskDemo() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [typed, setTyped] = useState('');

  const exchange = EXCHANGES[index];
  const showThread = phase === 'querying' || phase === 'answer';

  /* Reduced motion gets one finished exchange, standing still — the point
     still lands without anything moving. */
  useEffect(() => {
    if (prefersReducedMotion()) {
      setPhase('answer');
      return;
    }

    let t: ReturnType<typeof setTimeout>;
    if (phase === 'idle') {
      t = setTimeout(() => setPhase('typing'), PHASE_MS.idle);
    } else if (phase === 'querying') {
      t = setTimeout(() => setPhase('answer'), PHASE_MS.querying);
    } else if (phase === 'answer') {
      t = setTimeout(() => setPhase('clearing'), PHASE_MS.answer);
    } else if (phase === 'clearing') {
      t = setTimeout(() => {
        setIndex(i => (i + 1) % EXCHANGES.length);
        setPhase('idle');
      }, PHASE_MS.clearing);
    }
    return () => clearTimeout(t);
  }, [phase]);

  /* Types the question into the ask bar, one character at a time. */
  useEffect(() => {
    if (phase !== 'typing' || prefersReducedMotion()) return;
    const q = EXCHANGES[index].q;
    let i = 0;
    setTyped('');

    const tick = setInterval(() => {
      i += 1;
      setTyped(q.slice(0, i));
      if (i >= q.length) {
        clearInterval(tick);
        setTimeout(() => setPhase('querying'), 420);
      }
    }, TYPE_MS);

    return () => clearInterval(tick);
  }, [phase, index]);

  /* Clear the ask bar the moment the question is "sent" up into the thread. */
  useEffect(() => {
    if (phase === 'querying') setTyped('');
  }, [phase]);

  return (
    <div
      style={{
        maxWidth: '560px', margin: '0 auto',
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-card)',
        boxShadow: '0 30px 70px rgba(20,18,26,0.10)',
        overflow: 'hidden',
      }}
    >
      {/* Window chrome */}
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
        <span className="font-body" style={{ fontSize: '12px', color: 'var(--faint)' }}>
          Virgo · The Meridian
        </span>
        <span
          className="font-body"
          style={{
            marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '5px',
            fontSize: '10.5px', fontWeight: 600, color: 'var(--primary)',
            background: 'var(--primary-wash)', border: '1px solid var(--primary-line)',
            padding: '3px 9px', borderRadius: 'var(--radius-pill)',
          }}
        >
          <Lock size={10} /> Read-only
        </span>
      </div>

      {/* Conversation — fixed height so the panel never resizes mid-loop. */}
      <div aria-hidden style={{ position: 'relative', height: 'clamp(250px, 27vw, 296px)' }}>
        {/* Resting state, shown while the next question is being typed — the
            app's empty state, rather than a blank hole in the panel. */}
        <div
          style={{
            position: 'absolute', inset: 0,
            padding: 'clamp(16px, 2vw, 22px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '14px', textAlign: 'center',
            opacity: showThread ? 0 : 1,
            transition: 'opacity 300ms ease',
          }}
        >
          <VirgoOrb size={44} />
          <p
            className="font-body"
            style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--muted)', maxWidth: '300px', margin: 0 }}
          >
            Ask anything about The Meridian — Virgo reads your PMS, accounting and
            guest messages to answer.
          </p>
        </div>

        <div
          style={{
            position: 'absolute', inset: 0,
            padding: 'clamp(16px, 2vw, 22px)',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            gap: '11px',
            opacity: showThread ? 1 : 0,
            transform: showThread ? 'none' : 'translateY(6px)',
            transition: 'opacity 320ms ease, transform 320ms ease',
          }}
        >
        {/* The question, once it's been sent */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div
            className="font-body"
            style={{
              maxWidth: '82%', fontSize: '13.5px', lineHeight: 1.55,
              color: 'var(--ink)', background: 'var(--primary-wash)',
              border: '1px solid var(--primary-line)',
              borderRadius: '16px 16px 4px 16px', padding: '10px 14px',
            }}
          >
            {exchange.q}
          </div>
        </div>

        {/* Which systems it had to open to answer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
          <span className="font-body" style={{ fontSize: '11px', color: 'var(--faint)' }}>Querying</span>
          {exchange.sources.map(s => (
            <span
              key={s}
              className="font-mono"
              style={{
                fontSize: '9.5px', color: 'var(--primary)', background: 'var(--primary-wash)',
                border: '1px solid var(--primary-line)', padding: '3px 8px', borderRadius: '5px',
              }}
            >
              {s}
            </span>
          ))}
          {phase === 'querying' && <TypingDots />}
        </div>

        {/* The answer, with the orb as Virgo's avatar */}
        <div
          style={{
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            opacity: phase === 'answer' ? 1 : 0,
            transform: phase === 'answer' ? 'none' : 'translateY(6px)',
            transition: 'opacity 320ms ease, transform 320ms ease',
          }}
        >
          <span style={{ flexShrink: 0, marginTop: '2px' }}>
            <VirgoOrb size={26} />
          </span>
          <div
            className="font-body"
            style={{
              fontSize: '13.5px', lineHeight: 1.6, color: 'var(--ink-soft)',
              background: 'var(--surface-alt)', border: '1px solid var(--line)',
              borderRadius: '4px 16px 16px 16px', padding: '11px 15px',
            }}
          >
            {exchange.a}
          </div>
        </div>
        </div>
      </div>

      {/* Ask bar — where the question types itself before being sent */}
      <div style={{ padding: '0 clamp(16px, 2vw, 22px) clamp(16px, 2vw, 22px)' }}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            border: '1px solid var(--line)', borderRadius: 'var(--radius-pill)',
            padding: '9px 9px 9px 15px', background: 'var(--surface)',
          }}
        >
          <Plus size={15} style={{ color: 'var(--faint)', flexShrink: 0 }} />
          <span
            className="font-body"
            style={{
              flex: 1, minWidth: 0, fontSize: '13.5px',
              color: typed ? 'var(--ink)' : 'var(--faint)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}
          >
            {typed || 'Ask Virgo'}
            {phase === 'typing' && (
              <span
                style={{
                  display: 'inline-block', width: '1.5px', height: '14px',
                  background: 'var(--primary)', marginLeft: '2px', verticalAlign: 'text-bottom',
                }}
              />
            )}
          </span>
          <span
            style={{
              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: typed ? 'var(--primary)' : 'var(--ground-deep)',
              transition: 'background-color 250ms ease',
            }}
          >
            <SendHorizontal size={14} style={{ color: typed ? '#fff' : 'var(--faint)' }} />
          </span>
        </div>
      </div>
    </div>
  );
}
