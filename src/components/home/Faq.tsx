import { ChevronDown } from 'lucide-react';
import { useStaggerReveal } from '../../lib/motion';

/* Only answers that are true today. Pricing and security-certification
   questions are deliberately absent until there are facts to put in them. */

const FAQS = [
  {
    q: 'Can Virgo change anything in my systems?',
    a: 'No. Virgo asks for read access only. It never edits a rate, a reservation or a booking. The one thing it sends is guest messages over the official WhatsApp Business API, inside guardrails, with anything unusual passed to your team.',
  },
  {
    q: 'Which systems does it connect to?',
    a: 'Booking systems, accounting, guest messaging, reviews, staff rotas, channel managers, tills, and payroll, payments and pricing tools. The Integrations section above lists the names. If yours is missing, ask us.',
  },
  {
    q: 'Do I need an IT team to set it up?',
    a: 'No. You connect each system through its official sign-in, the same way you would connect any app. Nothing is migrated and nothing is replaced.',
  },
  {
    q: 'Does Virgo store my hotel data?',
    a: 'Virgo fetches data live to answer a question and keeps no copy of it.',
  },
  {
    q: 'Is Virgo available now?',
    a: "Virgo is onboarding its first UK hotels. Send us a note and we'll tell you where it stands for your setup.",
  },
  {
    q: 'How do I get started?',
    a: 'Use the contact form below, or email hello@askvirgo.co.uk.',
  },
];

export default function Faq() {
  const headingRef = useStaggerReveal<HTMLDivElement>({ y: 28, duration: 620, staggerDelay: 100 });
  const listRef = useStaggerReveal<HTMLDivElement>({ y: 18, duration: 500, staggerDelay: 60 });

  return (
    <section
      id="faq"
      style={{ background: 'var(--surface)', borderTop: '1px solid var(--line-soft)', padding: 'clamp(70px, 9vw, 118px) 0' }}
    >
      <div className="max-w-[820px] mx-auto px-6 lg:px-10">
        <div ref={headingRef} style={{ textAlign: 'center', marginBottom: '44px' }}>
          <p
            className="font-mono"
            style={{ opacity: 0, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: '16px' }}
          >
            FAQ
          </p>
          <h2
            className="font-display"
            style={{ opacity: 0, fontWeight: 800, fontSize: 'clamp(26px, 4vw, 46px)', color: 'var(--ink)', lineHeight: 1.05 }}
          >
            Questions hoteliers ask first.
          </h2>
        </div>

        <div ref={listRef} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {FAQS.map(({ q, a }) => (
            <details
              key={q}
              className="faq-item"
              style={{
                opacity: 0,
                background: 'var(--surface-alt)',
                border: '1px solid var(--line)',
                borderRadius: '18px',
                padding: '0 22px',
              }}
            >
              <summary
                className="font-display"
                style={{
                  cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: '16px', padding: '18px 0',
                  fontWeight: 700, fontSize: '18px', lineHeight: 1.25, color: 'var(--ink)',
                }}
              >
                {q}
                <ChevronDown size={18} className="faq-chevron" style={{ color: 'var(--primary)', flexShrink: 0 }} />
              </summary>
              <p className="font-body" style={{ fontSize: '15.5px', lineHeight: 1.65, color: 'var(--muted)', margin: '0 0 20px' }}>
                {a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
