import { useEffect, type ReactNode } from 'react';

/* Shared shell for /privacy and /terms. Both are drafts: the banner stays until
   the real text has been reviewed, so nobody mistakes placeholder copy for the
   final policy. */
export default function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} | Virgo`;
    return () => { document.title = previous; };
  }, [title]);

  return (
    <main className="max-w-[760px] mx-auto px-6" style={{ padding: 'clamp(48px, 7vw, 88px) 24px' }}>
      <div
        role="note"
        className="font-body"
        style={{
          background: 'var(--pop)',
          color: 'var(--ink)',
          borderRadius: 'var(--radius-card)',
          padding: '12px 18px',
          fontSize: '14px',
          fontWeight: 600,
          marginBottom: '32px',
        }}
      >
        Draft — placeholder text only. This page has not been reviewed and is not yet in force.
      </div>
      <h1
        className="font-display"
        style={{ fontWeight: 800, fontSize: 'clamp(34px, 4.6vw, 52px)', lineHeight: 1.05, color: 'var(--ink)', marginBottom: '28px' }}
      >
        {title}
      </h1>
      <div className="font-body" style={{ color: 'var(--ink-soft)', fontSize: '16px', lineHeight: 1.7 }}>
        {children}
      </div>
    </main>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: '28px' }}>
      <h2 className="font-display" style={{ fontWeight: 700, fontSize: '22px', color: 'var(--ink)', marginBottom: '8px' }}>
        {heading}
      </h2>
      <p style={{ margin: 0 }}>{children}</p>
    </section>
  );
}
