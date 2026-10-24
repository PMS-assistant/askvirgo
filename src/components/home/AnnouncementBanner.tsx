import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function AnnouncementBanner() {
  return (
    <div style={{ background: 'var(--pop)' }}>
      <Link
        to="/#pilot"
        className="font-body"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          padding: '10px 24px',
          color: 'var(--ink)',
          fontSize: '13px',
          textDecoration: 'none',
          textAlign: 'center',
        }}
      >
        <span style={{ fontWeight: 700 }}>Now launching — Virgo</span>
        <span style={{ opacity: 0.75 }}>
          A.R.M's AI hotel intelligence platform is onboarding its first UK hotels.
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600, textDecoration: 'underline' }}>
          Get in touch <ArrowRight size={13} />
        </span>
      </Link>
    </div>
  );
}
