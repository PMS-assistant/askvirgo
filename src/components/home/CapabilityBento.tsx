import { useStaggerReveal } from '../../lib/motion';
import { CAPABILITIES, type CapabilityStatus } from './capabilities';

/* The capability grid. Replaces the old pinned scroll tour: every capability
   is visible at once, with the honest status of anything not yet shipped.
   "Ask anything" is the anchor card and carries a small sample exchange. */

export function StatusPill({ status }: { status: CapabilityStatus }) {
  return (
    <span
      className="font-mono"
      style={{
        fontSize: '10.5px', fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase',
        color: 'var(--ink-soft)', background: 'var(--graphite-wash)',
        border: '1px solid var(--line)', borderRadius: '999px', padding: '2px 9px',
      }}
    >
      {status}
    </span>
  );
}

function SampleExchange() {
  const bubble = (who: 'user' | 'virgo', text: string) => (
    <div style={{ display: 'flex', justifyContent: who === 'user' ? 'flex-end' : 'flex-start' }}>
      <div
        className="font-body"
        style={{
          maxWidth: '88%', fontSize: '13.5px', lineHeight: 1.55, padding: '10px 14px',
          color: who === 'user' ? 'var(--ink)' : 'var(--ink-soft)',
          background: who === 'user' ? 'var(--primary-wash)' : 'var(--surface)',
          border: `1px solid ${who === 'user' ? 'var(--primary-line)' : 'var(--line)'}`,
          borderRadius: who === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
        }}
      >
        {text}
      </div>
    </div>
  );
  return (
    <div style={{ marginTop: '22px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {bubble('user', 'How is Saturday looking?')}
      {bubble('virgo', "87% with 6 rooms open. Last Saturday sold out by Thursday, so I'd recommend +15%. Recommended, not applied.")}
      <span className="font-mono" style={{ fontSize: '10.5px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--faint)' }}>
        Sample data
      </span>
    </div>
  );
}

export default function CapabilityBento() {
  const headingRef = useStaggerReveal<HTMLDivElement>({ y: 28, duration: 620, staggerDelay: 100 });
  const gridRef = useStaggerReveal<HTMLDivElement>({ y: 24, duration: 600, staggerDelay: 80 });

  return (
    <section
      id="virgo"
      style={{ background: 'var(--wash)', borderTop: '1px solid var(--line-soft)', padding: 'clamp(70px, 9vw, 118px) 0' }}
    >
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
        <div ref={headingRef} style={{ textAlign: 'center', marginBottom: '52px' }}>
          <p
            className="font-mono"
            style={{ opacity: 0, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: '16px' }}
          >
            What you can do
          </p>
          <h2
            className="font-display"
            style={{ opacity: 0, fontWeight: 800, fontSize: 'clamp(26px, 4vw, 46px)', color: 'var(--ink)', lineHeight: 1.05 }}
          >
            Everything about your hotel, one question away.
          </h2>
        </div>

        <div ref={gridRef} className="grid lg:grid-cols-6 gap-5">
          {CAPABILITIES.map((cap, i) => {
            const Icon = cap.icon;
            // First card anchors the grid; the other four split two-and-three across rows.
            const span = i === 0 ? 'lg:col-span-4' : i === 1 ? 'lg:col-span-2' : 'lg:col-span-2';
            return (
              <article
                key={cap.id}
                className={`lift-card ${span}`}
                style={{
                  opacity: 0,
                  background: `linear-gradient(160deg, ${cap.wash} 0%, var(--surface) 62%)`,
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-card)',
                  padding: '28px 26px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '18px' }}>
                  <span
                    style={{
                      width: '40px', height: '40px', borderRadius: '12px', background: 'var(--surface)',
                      border: '1px solid var(--line)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Icon size={18} style={{ color: cap.accent }} />
                  </span>
                  {cap.status && <StatusPill status={cap.status} />}
                </div>
                <p className="font-mono" style={{ fontSize: '11px', letterSpacing: '1.6px', textTransform: 'uppercase', color: 'var(--faint)', margin: '0 0 8px' }}>
                  {cap.label}
                </p>
                <h3 className="font-display" style={{ fontWeight: 700, fontSize: i === 0 ? 'clamp(24px, 2.8vw, 32px)' : '21px', lineHeight: 1.12, color: 'var(--ink)', margin: '0 0 10px' }}>
                  {cap.title}
                </h3>
                <p className="font-body" style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--muted)', margin: 0 }}>
                  {cap.body}
                </p>
                {i === 0 && <SampleExchange />}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
