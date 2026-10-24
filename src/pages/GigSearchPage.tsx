import { ArrowUpRight } from 'lucide-react';
import { useStaggerReveal } from '../lib/motion';

export default function GigSearchPage() {
  const contentRef = useStaggerReveal<HTMLDivElement>({ y: 20, duration: 560, staggerDelay: 90 });

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--ground)',
        minHeight: '78vh',
        display: 'flex',
        alignItems: 'center',
        padding: 'clamp(64px, 9vw, 110px) 0',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
          width: 'min(800px, 120vw)', height: '560px', pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, rgba(94,234,212,0.24) 0%, transparent 66%)',
        }}
      />

      <div ref={contentRef} className="relative max-w-[660px] mx-auto px-6 text-center">
        <div
          style={{
            opacity: 0,
            width: '64px', height: '64px', borderRadius: '18px',
            background: 'rgba(94,234,212,0.18)', border: '1px solid rgba(94,234,212,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 26px',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--mint-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <div style={{ opacity: 0, marginBottom: '20px' }}>
          <span
            className="font-mono"
            style={{
              fontSize: '10.5px', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 700,
              color: 'var(--mint-deep)', background: 'rgba(94,234,212,0.18)',
              border: '1px solid rgba(94,234,212,0.45)', padding: '5px 13px',
              borderRadius: 'var(--radius-pill)',
            }}
          >
            ● Live
          </span>
        </div>

        <h1
          className="font-display"
          style={{ opacity: 0, fontWeight: 800, fontSize: 'clamp(34px, 5.4vw, 58px)', lineHeight: 1.02, color: 'var(--ink)', marginBottom: '20px' }}
        >
          The Gig Search
        </h1>

        <p
          className="font-body"
          style={{ opacity: 0, fontSize: 'clamp(15px, 1.6vw, 18px)', color: 'var(--muted)', lineHeight: 1.75, marginBottom: '34px' }}
        >
          A job platform purpose-built for the hospitality industry. Connecting skilled
          workers with the right roles — faster, smarter, and without the noise of general
          job boards.
        </p>

        <div style={{ opacity: 0, display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '38px' }}>
          {['Hospitality-first', 'Smart matching', 'UK market'].map(t => (
            <span
              key={t}
              className="font-body"
              style={{
                fontSize: '13px', color: 'var(--ink-soft)', background: 'var(--surface)',
                border: '1px solid var(--line)', padding: '8px 16px', borderRadius: 'var(--radius-pill)',
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <div style={{ opacity: 0 }}>
          <a
            href="https://www.thegigsearch.com"
            target="_blank"
            rel="noopener noreferrer"
            className="pill"
            style={{ background: 'var(--mint-deep)', color: '#fff' }}
          >
            Visit thegigsearch.com <ArrowUpRight size={16} />
          </a>
        </div>

        <p className="font-body" style={{ opacity: 0, fontSize: '12.5px', color: 'var(--faint)', marginTop: '26px' }}>
          An A.R.M Technologies product
        </p>
      </div>
    </section>
  );
}
