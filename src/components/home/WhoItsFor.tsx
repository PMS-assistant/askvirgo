import { useStaggerReveal } from '../../lib/motion';

/* Who asks what. Example questions only — no figures, no outcome claims. */

const PERSONAS = [
  {
    role: 'Owners and general managers',
    line: 'The whole hotel at a glance, without chasing five people for it.',
    questions: ['How did we do last week?', 'What needs me today?', 'Anything odd in the accounts?'],
  },
  {
    role: 'Revenue managers',
    line: 'Demand, rates and pace read against what actually sold.',
    questions: ['How does Saturday compare with last Saturday?', "What's our pace for next month?", 'What would you recommend for this weekend?'],
  },
  {
    role: 'Finance',
    line: 'Profit and loss and cost movements without opening the accounts package.',
    questions: ['What is revenue month to date?', 'Which invoices are due this week?', 'Where did costs jump?'],
  },
  {
    role: 'Front desk and housekeeping',
    line: "Today's arrivals, checklists and guest messages in one place.",
    questions: ['Who is arriving today?', "Are today's housekeeping checklists done?", 'Which guest messages need a person?'],
  },
];

export default function WhoItsFor() {
  const headingRef = useStaggerReveal<HTMLDivElement>({ y: 28, duration: 620, staggerDelay: 100 });
  const gridRef = useStaggerReveal<HTMLDivElement>({ y: 24, duration: 600, staggerDelay: 80 });

  return (
    <section
      id="who"
      style={{ background: 'var(--wash)', borderTop: '1px solid var(--line-soft)', padding: 'clamp(70px, 9vw, 118px) 0' }}
    >
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
        <div ref={headingRef} style={{ textAlign: 'center', marginBottom: '52px' }}>
          <p
            className="font-mono"
            style={{ opacity: 0, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: '16px' }}
          >
            Who it's for
          </p>
          <h2
            className="font-display"
            style={{ opacity: 0, fontWeight: 800, fontSize: 'clamp(26px, 4vw, 46px)', color: 'var(--ink)', lineHeight: 1.05 }}
          >
            Built for the people who run the hotel.
          </h2>
        </div>

        <div ref={gridRef} className="grid sm:grid-cols-2 gap-5">
          {PERSONAS.map(p => (
            <article
              key={p.role}
              className="lift-card"
              style={{
                opacity: 0,
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-card)',
                padding: '28px 26px',
              }}
            >
              <h3 className="font-display" style={{ fontWeight: 700, fontSize: '22px', lineHeight: 1.15, color: 'var(--ink)', margin: '0 0 8px' }}>
                {p.role}
              </h3>
              <p className="font-body" style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--muted)', margin: '0 0 18px' }}>
                {p.line}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {p.questions.map(q => (
                  <li
                    key={q}
                    className="font-body"
                    style={{
                      fontSize: '14px', color: 'var(--ink-soft)', background: 'var(--primary-wash)',
                      border: '1px solid var(--primary-line)', borderRadius: '12px 12px 12px 4px', padding: '9px 14px',
                    }}
                  >
                    {q}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
