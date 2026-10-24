import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Brain, Search, Lightbulb } from 'lucide-react';
import { useStaggerReveal } from '../lib/motion';

const products = [
  {
    icon: Brain,
    tag: 'Flagship product',
    name: 'Virgo',
    tagline: 'AI Hotel Intelligence Platform',
    desc: 'One AI that connects your PMS, accounting and WhatsApp — and reasons across all of them at once. Ask anything in plain English, get one clear answer.',
    accent: 'var(--primary)',
    wash: 'var(--primary-wash)',
    line: 'var(--primary-line)',
    link: '/',
    linkText: 'Explore Virgo',
    external: false,
    status: 'Now launching',
  },
  {
    icon: Search,
    tag: 'Product',
    name: 'The Gig Search',
    tagline: 'Hospitality staffing marketplace',
    desc: 'A job platform purpose-built for the hospitality industry. Connecting skilled workers with the right roles — faster, and without the noise of general job boards.',
    accent: 'var(--mint-deep)',
    wash: 'rgba(94,234,212,0.16)',
    line: 'rgba(94,234,212,0.45)',
    link: 'https://www.thegigsearch.com',
    linkText: 'Visit thegigsearch.com',
    external: true,
    status: 'Live',
  },
  {
    icon: Lightbulb,
    tag: 'Service',
    name: 'Consulting',
    tagline: 'From idea to operation',
    desc: 'We help startups figure out the hard parts — revenue models, operational structure, market entry, and how to actually set up and run a business.',
    accent: '#B8760D',
    wash: 'rgba(245,166,35,0.16)',
    line: 'rgba(245,166,35,0.42)',
    link: '/consulting',
    linkText: 'Work with us',
    external: false,
    status: 'Available',
  },
];

function CompanyHero() {
  const contentRef = useStaggerReveal<HTMLDivElement>({ y: 28, duration: 700, staggerDelay: 120 });

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--ground)',
        padding: 'clamp(64px, 9vw, 110px) 0 clamp(48px, 6vw, 76px)',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute', top: '-25%', left: '50%', transform: 'translateX(-50%)',
          width: 'min(900px, 120vw)', height: '600px', pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.14) 0%, transparent 66%)',
        }}
      />

      <div className="relative max-w-[900px] mx-auto px-6 text-center">
        <div ref={contentRef}>
          <span
            className="font-mono"
            style={{
              opacity: 0,
              fontSize: '11px', color: 'var(--muted)', letterSpacing: '1.5px', textTransform: 'uppercase',
              background: 'var(--surface)', border: '1px solid var(--line)',
              padding: '7px 16px', borderRadius: 'var(--radius-pill)', display: 'inline-block',
              marginBottom: '26px',
            }}
          >
            Bournemouth, UK · Est. 2023
          </span>

          <h1
            className="font-display"
            style={{ opacity: 0, fontWeight: 800, fontSize: 'clamp(34px, 5.4vw, 62px)', lineHeight: 1.02, color: 'var(--ink)', marginBottom: '22px' }}
          >
            The company behind Virgo.
          </h1>

          <p
            className="font-body"
            style={{ opacity: 0, fontSize: 'clamp(15px, 1.7vw, 19px)', color: 'var(--muted)', lineHeight: 1.75, maxWidth: '620px', margin: '0 auto 34px' }}
          >
            A.R.M Technologies is a UK software company building AI-powered products for the
            hospitality industry. Virgo is our flagship — an AI that connects the systems your
            hotel already uses and answers any question in plain English, without ever changing
            anything in them.
          </p>

          <div style={{ opacity: 0, display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="pill pill-primary">
              Explore Virgo <ArrowRight size={15} />
            </Link>
            <a href="mailto:info@armtechnologies.ltd" className="pill pill-outline">
              info@armtechnologies.ltd
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function AlsoByARM() {
  const headerRef = useStaggerReveal<HTMLDivElement>({ y: 26, duration: 620, staggerDelay: 90 });
  const cardsRef = useStaggerReveal<HTMLDivElement>({ y: 26, duration: 620, staggerDelay: 110 });

  return (
    <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--line-soft)', padding: 'clamp(64px, 8vw, 110px) 0' }}>
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
        <div ref={headerRef} style={{ marginBottom: '48px' }}>
          <p
            className="font-mono"
            style={{ opacity: 0, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: '16px' }}
          >
            What we build
          </p>
          <h2
            className="font-display"
            style={{ opacity: 0, fontWeight: 800, fontSize: 'clamp(26px, 3.6vw, 44px)', lineHeight: 1.05, color: 'var(--ink)', maxWidth: '620px' }}
          >
            Virgo is the flagship. Here's everything else.
          </h2>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {products.map(product => {
            const Icon = product.icon;
            const linkStyle: React.CSSProperties = {
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '13.5px', fontWeight: 600, color: product.accent,
              textDecoration: 'none', marginTop: 'auto', paddingTop: '16px',
              borderTop: '1px solid var(--line-soft)',
            };

            return (
              <div
                key={product.name}
                style={{
                  opacity: 0,
                  background: 'var(--ground)',
                  border: '1px solid var(--line-soft)',
                  borderRadius: 'var(--radius-card)',
                  padding: 'clamp(26px, 3vw, 34px)',
                  display: 'flex', flexDirection: 'column', gap: '15px',
                  transition: 'transform 0.35s, border-color 0.35s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = product.line; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--line-soft)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <span className="font-mono" style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '1.5px', color: product.accent, textTransform: 'uppercase' }}>
                    {product.tag}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '9.5px', color: product.accent, background: product.wash,
                      border: `1px solid ${product.line}`, padding: '3px 9px', borderRadius: 'var(--radius-pill)',
                    }}
                  >
                    {product.status}
                  </span>
                </div>

                <div
                  style={{
                    width: '46px', height: '46px', borderRadius: '13px',
                    background: product.wash, border: `1px solid ${product.line}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Icon size={21} style={{ color: product.accent }} />
                </div>

                <div>
                  <h3 className="font-display" style={{ fontWeight: 700, fontSize: 'clamp(20px, 2vw, 25px)', color: 'var(--ink)', marginBottom: '5px' }}>
                    {product.name}
                  </h3>
                  <p className="font-body" style={{ fontSize: '13px', color: product.accent, fontWeight: 600 }}>
                    {product.tagline}
                  </p>
                </div>

                <p className="font-body" style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, flex: 1 }}>
                  {product.desc}
                </p>

                {product.external ? (
                  <a href={product.link} target="_blank" rel="noopener noreferrer" className="font-body" style={linkStyle}>
                    {product.linkText} <ArrowUpRight size={14} />
                  </a>
                ) : (
                  <Link to={product.link} className="font-body" style={linkStyle}>
                    {product.linkText} <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function CompanyPage() {
  return (
    <>
      <CompanyHero />
      <AlsoByARM />
    </>
  );
}
