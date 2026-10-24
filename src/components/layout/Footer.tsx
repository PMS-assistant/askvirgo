import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const COLUMNS = [
  {
    heading: 'Virgo',
    links: [
      { name: 'Home', path: '/' },
      { name: 'Virgo', path: '/#virgo' },
      { name: 'Integrations', path: '/#integrations' },
      { name: 'How it works', path: '/#how-it-works' },
      { name: 'Get in touch', path: '/#pilot' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { name: 'Privacy', path: '/privacy' },
      { name: 'Terms', path: '/terms' },
    ],
  },
];

const SOCIALS = [
  { icon: Mail, href: 'mailto:hello@askvirgo.co.uk', label: 'Email' },
];

/* A frosted glass card rather than a flat band — reuses the same
   backdrop-filter language as .pill-glass (see index.css) so the "liquid
   glass" material reads as one deliberate choice, not a one-off button. */
export default function Footer() {
  return (
    <footer
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--ground-deep)',
        borderTop: '1px solid var(--line-soft)',
        padding: 'clamp(48px, 6vw, 72px) 0 clamp(28px, 3vw, 36px)',
      }}
    >
      {/* Ambient glow blobs behind the glass card — same device as the Hero's
          gradient wash and VirgoProblem's radial tint, on this section's own
          two accent tokens. */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute', top: '-120px', left: '8%',
            width: '320px', height: '320px', borderRadius: '50%',
            background: 'var(--primary-glow)', filter: 'blur(70px)', opacity: 0.5,
          }}
        />
        <div
          style={{
            position: 'absolute', bottom: '-140px', right: '10%',
            width: '360px', height: '360px', borderRadius: '50%',
            background: 'var(--mint)', filter: 'blur(80px)', opacity: 0.18,
          }}
        />
      </div>

      <div className="relative max-w-[1180px] mx-auto px-6 lg:px-10">
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.28) 100%)',
            backdropFilter: 'blur(16px) saturate(1.3)',
            WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
            border: '1px solid rgba(255,255,255,0.5)',
            borderRadius: 'var(--radius-card)',
            boxShadow: '0 20px 50px rgba(20,18,26,0.08), inset 0 1px 0 rgba(255,255,255,0.7)',
            padding: 'clamp(30px, 4vw, 48px) clamp(22px, 4vw, 44px)',
          }}
        >
          {/* Mobile: one compact block — wordmark, every link in a single
              wrapped row (no per-column headers), socials, email. The full
              four-column layout below was four separate stacked sections on
              a phone (brand blurb, two headed link lists, contact block) —
              this is a fifth of the height for the same links. */}
          <div className="sm:hidden text-center">
            <h4 className="font-display" style={{ fontWeight: 800, fontSize: '19px', color: 'var(--ink)', marginBottom: '14px' }}>
              Virgo<span style={{ color: 'var(--primary)' }}>.</span>
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 14px', marginBottom: '18px' }}>
              {[...COLUMNS[0].links, ...COLUMNS[1].links].map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="font-body"
                  style={{ fontSize: '13.5px', color: 'var(--ink-soft)', textDecoration: 'none' }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '18px', justifyContent: 'center', marginBottom: '16px' }}>
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} style={{ color: 'var(--primary)', lineHeight: 0 }}>
                  <Icon size={20} />
                </a>
              ))}
            </div>
            <a
              href="mailto:hello@askvirgo.co.uk"
              className="font-body"
              style={{ fontSize: '13px', color: 'var(--muted)', textDecoration: 'none' }}
            >
              hello@askvirgo.co.uk
            </a>
          </div>

          <div className="hidden sm:grid sm:grid-cols-4 gap-10 md:gap-12 mb-8 text-left">
            <div>
              <h4 className="font-display" style={{ fontWeight: 800, fontSize: '20px', color: 'var(--ink)', marginBottom: '14px' }}>
                Virgo<span style={{ color: 'var(--primary)' }}>.</span>
              </h4>
              <p className="font-body" style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, maxWidth: '220px', margin: 0 }}>
                Read-only AI intelligence for hotels — one question, every system.
              </p>
            </div>

            {COLUMNS.map(col => (
              <div key={col.heading}>
                <h5
                  className="font-mono"
                  style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '1.8px', marginBottom: '16px' }}
                >
                  {col.heading}
                </h5>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {col.links.map(link => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="font-body"
                        style={{ fontSize: '14px', color: 'var(--ink-soft)', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink-soft)'; }}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h5
                className="font-mono"
                style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '1.8px', marginBottom: '16px' }}
              >
                Contact
              </h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <Mail size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  <a
                    href="mailto:hello@askvirgo.co.uk"
                    className="font-body"
                    style={{ fontSize: '14px', color: 'var(--ink-soft)', textDecoration: 'none' }}
                  >
                    hello@askvirgo.co.uk
                  </a>
                </li>
              </ul>

              <div style={{ display: 'flex', gap: '18px', justifyContent: 'center', marginTop: '18px' }} className="md:justify-start">
                {SOCIALS.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    style={{ color: 'var(--primary)', transition: 'color 0.2s', textDecoration: 'none', lineHeight: 0 }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary-deep)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--primary)'; }}
                  >
                    <Icon size={22} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div style={{ paddingTop: '22px', borderTop: '1px solid var(--line-soft)', textAlign: 'center' }}>
            <p className="font-body" style={{ fontSize: '13px', color: 'var(--faint)' }}>
              &copy; 2026 Virgo. All rights reserved.
            </p>
            <p className="font-body" style={{ fontSize: '12px', color: 'var(--faint)', lineHeight: 1.6, marginTop: '6px' }}>
              Virgo is a product of ARM Technologies Limited. Registered in England and Wales, company number 15163077. Registered office: Wilson House, 2 Lorne Park Road, Bournemouth, BH1 1JN.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
