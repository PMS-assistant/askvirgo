import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  useEffect(() => {
    const previous = document.title;
    document.title = 'Page not found | Virgo';
    return () => { document.title = previous; };
  }, []);

  return (
    <main className="max-w-[760px] mx-auto text-center" style={{ padding: 'clamp(72px, 12vw, 140px) 24px' }}>
      <p className="font-mono" style={{ fontSize: '13px', letterSpacing: '1.8px', color: 'var(--faint)', marginBottom: '14px' }}>
        404
      </p>
      <h1 className="font-display" style={{ fontWeight: 800, fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 1.05, color: 'var(--ink)', marginBottom: '16px' }}>
        Page not found.
      </h1>
      <p className="font-body" style={{ color: 'var(--muted)', fontSize: '17px', marginBottom: '28px' }}>
        That page doesn't exist or has moved.
      </p>
      <Link to="/" className="pill pill-primary">Back to Virgo</Link>
    </main>
  );
}
