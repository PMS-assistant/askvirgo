import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const COLUMNS = [
  {
    heading: 'Virgo',
    links: [
      { name: 'Home', path: '/' },
      { name: 'Virgo', path: '/#virgo' },
      { name: 'How it works', path: '/#how-it-works' },
      { name: 'FAQ', path: '/#faq' },
      { name: 'About', path: '/about' },
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

/* A plain band on the page's drifting colour, with no line above it, so the
   page ends as one continuous surface. */
export default function Footer() {
  return (
    <footer
      style={{
        background: 'transparent',
        padding: 'clamp(48px, 6vw, 72px) clamp(18px, 3vw, 40px) clamp(28px, 3vw, 36px)',
      }}
    >
      <div className="relative max-w-[1440px] mx-auto">
        <div>
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
                Talk to your hotel like you talk to your team.
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
                <li className="flex items-center gap-2">
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
