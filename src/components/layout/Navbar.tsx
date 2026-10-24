import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { animate, stagger } from 'animejs';
import { Menu, X } from 'lucide-react';
import { useMountAnimation, prefersReducedMotion } from '../../lib/motion';

const navLinks = [
  { name: 'Virgo', path: '/#virgo' },
  { name: 'How it works', path: '/#how-it-works' },
  { name: 'Company', path: '/company' },
];

function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="flex flex-col leading-none hover:opacity-70 transition-opacity"
      style={{ textDecoration: 'none' }}
    >
      <span className="font-display" style={{ fontWeight: 800, fontSize: '19px', color: 'var(--ink)' }}>
        A.R.M
      </span>
      <span
        className="font-mono"
        style={{ fontSize: '9px', color: 'var(--faint)', letterSpacing: '2.4px', textTransform: 'uppercase', marginTop: '3px' }}
      >
        Technologies
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const mobileLinksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const { ref: mobileOverlayRef, shouldRender: showMobileOverlay } =
    useMountAnimation<HTMLDivElement>(mobileMenuOpen, { duration: 240 });

  useEffect(() => {
    if (!mobileMenuOpen || !showMobileOverlay || !mobileLinksRef.current) return;
    const children = Array.from(mobileLinksRef.current.children) as HTMLElement[];
    animate(children, {
      opacity: [0, 1],
      translateY: [16, 0],
      duration: prefersReducedMotion() ? 1 : 380,
      delay: prefersReducedMotion() ? 0 : stagger(60),
    });
  }, [mobileMenuOpen, showMobileOverlay]);

  return (
    <>
      <nav
        className="sticky top-0 z-50"
        style={{
          background: scrolled ? 'rgba(244,242,251,0.86)' : 'var(--ground)',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--line-soft)' : '1px solid transparent',
          transition: 'background 0.25s ease, border-color 0.25s ease',
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between gap-6">
          <Wordmark />

          <div className="hidden lg:flex items-center gap-9">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="font-body"
                style={{
                  fontSize: '14.5px',
                  fontWeight: 500,
                  color: location.pathname === link.path ? 'var(--primary)' : 'var(--ink-soft)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary)'; }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = location.pathname === link.path ? 'var(--primary)' : 'var(--ink-soft)';
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            {/* A quieter secondary link, not a pill — it shouldn't compete
                with "Get in touch" for attention. Goes straight to the same
                inbox with a pre-filled subject, same pattern Medflow Dynamics
                uses (their own /investors page has no separate form either,
                just more context before the same two contact channels) —
                Virgo has no traction/funding material to honestly fill a
                dedicated investor page with yet, so a direct channel is the
                honest version of that pattern. */}
            <a
              href="mailto:info@armtechnologies.ltd?subject=Investor%20Enquiry"
              className="font-body"
              style={{ fontSize: '13px', fontWeight: 500, color: 'var(--faint)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--faint)'; }}
            >
              Investor Enquiry
            </a>
            <Link to="/#pilot" className="pill pill-ink" style={{ padding: '11px 24px', minHeight: '44px', fontSize: '14.5px' }}>
              Get in touch
            </Link>
          </div>

          <button
            className="lg:hidden w-11 h-11 flex items-center justify-center"
            style={{ color: 'var(--ink)', background: 'transparent', border: 'none' }}
            onClick={() => setMobileMenuOpen(o => !o)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {showMobileOverlay && (
        <div
          ref={mobileOverlayRef}
          className="fixed inset-0 z-[60] lg:hidden flex flex-col"
          style={{ background: 'var(--ground)' }}
        >
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--line-soft)' }}>
            <Wordmark onClick={() => setMobileMenuOpen(false)} />
            <button
              className="w-11 h-11 flex items-center justify-center"
              style={{ color: 'var(--ink)', background: 'transparent', border: 'none' }}
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <div ref={mobileLinksRef} className="flex flex-col items-center justify-center flex-1 gap-7 px-6">
            {navLinks.map(link => (
              <div key={link.path} style={{ opacity: 0 }}>
                <Link
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-display"
                  style={{
                    fontWeight: 700,
                    fontSize: '28px',
                    color: location.pathname === link.path ? 'var(--primary)' : 'var(--ink)',
                    textDecoration: 'none',
                  }}
                >
                  {link.name}
                </Link>
              </div>
            ))}
            <div style={{ opacity: 0, marginTop: '10px' }}>
              <Link to="/#pilot" onClick={() => setMobileMenuOpen(false)} className="pill pill-ink">
                Get in touch
              </Link>
            </div>
            <div style={{ opacity: 0 }}>
              <a
                href="mailto:info@armtechnologies.ltd?subject=Investor%20Enquiry"
                className="font-body"
                style={{ fontSize: '15px', color: 'var(--faint)', textDecoration: 'none' }}
              >
                Investor Enquiry
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
