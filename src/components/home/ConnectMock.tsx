import { Lock, Check } from 'lucide-react';
import { useReveal } from '../../lib/motion';

/* Illustrative mock of the OAuth consent screen a hotelier actually sees when
   connecting Virgo — the whole of step 01, in one picture.

   Accuracy matters here: Cloudbeds is OAuth 2.0 and Virgo requests read scopes
   only (VZIR_BRD.md §5.2; Cloudbeds and Xero are both live-verified per
   PROGRESS.md). Showing the scope list is the strongest possible statement of
   the read-only rule — it's evidence rather than a claim. Nothing here is
   clickable; same convention as the other product mocks on this site. */

const SCOPES = [
  { name: 'Reservations', detail: 'Arrivals, departures, occupancy' },
  { name: 'Rates', detail: 'Rate plans and pricing' },
  { name: 'Guests', detail: 'Guest profiles on a booking' },
  { name: 'Room status', detail: 'Housekeeping and availability' },
];

export default function ConnectMock() {
  const frameRef = useReveal<HTMLDivElement>({ y: 28, duration: 750 });

  return (
    <div
      ref={frameRef}
      aria-hidden
      style={{
        opacity: 0,
        maxWidth: '660px', margin: '0 auto 44px',
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-card)',
        boxShadow: '0 30px 70px rgba(20,18,26,0.10)',
        overflow: 'hidden',
      }}
    >
      {/* Window chrome — same language as the hero panel and VirgoShowcase. */}
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
          Cloudbeds · Authorize application
        </span>
      </div>

      <div style={{ padding: 'clamp(24px, 3.4vw, 36px)' }}>
        <p
          className="font-mono"
          style={{ fontSize: '10px', letterSpacing: '1.6px', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: '12px' }}
        >
          Connect an application
        </p>
        <h3
          className="font-display"
          style={{ fontSize: 'clamp(19px, 2.3vw, 24px)', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.25, margin: '0 0 26px' }}
        >
          <span style={{ color: 'var(--primary)' }}>Virgo</span> is requesting access to The Meridian
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '20px' }}>
          {SCOPES.map(s => (
            <div
              key={s.name}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 0', borderBottom: '1px solid var(--line-soft)',
              }}
            >
              <Check size={15} style={{ color: 'var(--mint-deep)', flexShrink: 0 }} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span className="font-body" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>
                  {s.name}
                </span>
                <span className="font-body" style={{ fontSize: '12.5px', color: 'var(--muted)' }}>
                  {' — '}{s.detail}
                </span>
              </span>
              <span
                className="font-mono"
                style={{
                  flexShrink: 0, fontSize: '9.5px', letterSpacing: '1px', textTransform: 'uppercase',
                  color: 'var(--mint-deep)', background: 'rgba(94,234,212,0.18)',
                  border: '1px solid rgba(94,234,212,0.42)', borderRadius: 'var(--radius-pill)', padding: '3px 9px',
                }}
              >
                Read
              </span>
            </div>
          ))}
        </div>

        {/* The point of the whole mock. */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'var(--primary-wash)', border: '1px solid var(--primary-line)',
            borderRadius: '12px', padding: '12px 14px', marginBottom: '24px',
          }}
        >
          <Lock size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <span className="font-body" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
            No write access requested
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <span
            className="font-body"
            style={{
              fontSize: '13.5px', fontWeight: 600, color: '#fff', background: 'var(--primary)',
              padding: '10px 22px', borderRadius: '10px',
            }}
          >
            Authorize
          </span>
          <span
            className="font-body"
            style={{
              fontSize: '13.5px', fontWeight: 600, color: 'var(--muted)', background: 'var(--surface)',
              border: '1px solid var(--line)', padding: '10px 22px', borderRadius: '10px',
            }}
          >
            Cancel
          </span>
        </div>
      </div>
    </div>
  );
}
