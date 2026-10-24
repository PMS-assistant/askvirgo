import { Check, X } from 'lucide-react';
import { useReveal, useStaggerReveal } from '../../lib/motion';

/* The page's one dark band and its signature: a ledger of what Virgo does and
   what it never does. Colours are all tokens — the band inverts --ink and
   --surface rather than introducing new values.

   Accuracy: the "never" column is the product's absolute rule (CLAUDE.md).
   The one write surface, guest WhatsApp messages inside guardrails, is stated
   as the exception rather than hidden. */

const DOES = [
  'Reads figures from the systems you connect',
  'Names the source of every figure',
  'Recommends what to do, and leaves the decision to you',
  'Fetches data live to answer, and keeps no copy of it',
];

const NEVER = [
  'Change a rate or a price',
  'Edit or cancel a reservation',
  'Create a booking',
  'Post to your accounts or move money',
];

export default function ReadOnlyBand() {
  const headRef = useReveal<HTMLDivElement>({ y: 28, duration: 700 });
  const ledgerRef = useStaggerReveal<HTMLDivElement>({ y: 22, duration: 600, staggerDelay: 120 });

  return (
    <section
      id="security"
      style={{ background: 'var(--ink)', color: 'var(--surface)', padding: 'clamp(76px, 10vw, 128px) 0' }}
    >
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
        <div ref={headRef} style={{ opacity: 0, maxWidth: '820px', marginBottom: 'clamp(40px, 5vw, 64px)' }}>
          <p
            className="font-mono"
            style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--pop)', marginBottom: '18px' }}
          >
            Read-only by design
          </p>
          <h2
            className="font-display"
            style={{ fontWeight: 800, fontSize: 'clamp(40px, 6.6vw, 84px)', lineHeight: 0.98, margin: '0 0 22px' }}
          >
            Virgo can look.
            <br />
            It can't touch.
          </h2>
          <p className="font-body" style={{ fontSize: 'clamp(16px, 1.5vw, 19px)', lineHeight: 1.6, opacity: 0.74, margin: 0, maxWidth: '620px' }}>
            Virgo asks each system for read access only, so there is nothing in it that could change your rates, your
            bookings or your books.
          </p>
        </div>

        <div ref={ledgerRef} className="grid md:grid-cols-2 gap-5">
          <div
            style={{
              opacity: 0, border: '1px solid var(--on-ink-line)', borderRadius: 'var(--radius-card)', padding: '28px 26px',
            }}
          >
            <p className="font-mono" style={{ fontSize: '11px', letterSpacing: '1.8px', textTransform: 'uppercase', color: 'var(--mint)', margin: '0 0 18px' }}>
              What it does
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {DOES.map(t => (
                <li key={t} className="font-body" style={{ display: 'flex', gap: '12px', fontSize: '16px', lineHeight: 1.45 }}>
                  <Check size={18} style={{ color: 'var(--mint)', flexShrink: 0, marginTop: '2px' }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              opacity: 0, border: '1px solid var(--on-ink-line)', borderRadius: 'var(--radius-card)', padding: '28px 26px',
            }}
          >
            <p className="font-mono" style={{ fontSize: '11px', letterSpacing: '1.8px', textTransform: 'uppercase', color: 'var(--pop)', margin: '0 0 18px' }}>
              What it never does
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {NEVER.map(t => (
                <li key={t} className="font-body" style={{ display: 'flex', gap: '12px', fontSize: '16px', lineHeight: 1.45 }}>
                  <X size={18} style={{ color: 'var(--pop)', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ textDecoration: 'line-through', textDecorationColor: 'var(--on-ink-strike)' }}>{t}</span>
                </li>
              ))}
            </ul>
            <p className="font-body" style={{ fontSize: '13.5px', lineHeight: 1.55, opacity: 0.66, margin: '22px 0 0' }}>
              The one exception: guest messages over the official WhatsApp Business API. They stay inside guardrails,
              anything unusual goes to your team, and one switch pauses them all.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
