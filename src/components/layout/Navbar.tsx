import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

/* Header: the Virgo mark, four links, an outlined Investors button and Book a demo. Product, Inside Virgo
   and How it works scroll to those sections of the homepage; About is its own
   page. On phones the links open in a simple panel under the header. */

const navLinks = [
  { name: 'Product', path: '/#virgo' },
  { name: 'Inside Virgo', path: '/#product' },
  { name: 'How it works', path: '/#how-it-works' },
  { name: 'About', path: '/about' },
];

function Wordmark() {
  return (
    <Link
      to="/"
      className="flex items-center hover:opacity-70 transition-opacity"
      style={{ textDecoration: 'none', gap: '9px' }}
    >
      <span
        aria-hidden
        style={{
          width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
          background: 'radial-gradient(circle at 35% 30%, var(--pop) 0%, var(--primary) 55%, var(--ink) 120%)',
        }}
      />
      <span className="font-display" style={{ fontSize: '23px', letterSpacing: '-0.01em', color: 'var(--ink)', lineHeight: 1 }}>
        Virgo
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname, location.hash]);

  const solid = scrolled || open;

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: solid ? 'rgba(251,250,248,0.94)' : 'transparent',
        backdropFilter: solid ? 'blur(14px)' : 'none',
        borderBottom: solid ? '1px solid var(--line-soft)' : '1px solid transparent',
        transition: 'background 0.25s ease, border-color 0.25s ease',
      }}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-6" style={{ padding: '18px clamp(18px, 3vw, 40px)' }}>
        <Wordmark />

        <div className="hidden md:flex items-center" style={{ gap: '28px' }}>
          {navLinks.map(link => (
            <Link
              key={link.name}
              to={link.path}
              className="font-body"
              style={{ fontSize: '13.5px', color: 'var(--ink-soft)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--ink)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink-soft)'; }}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link to="/investors" className="nv-ghost hidden md:inline-flex">
            Investors
          </Link>
          <Link to="/#pilot" className="a1-btn" style={{ fontSize: '13px', padding: '8px 16px' }}>
            Book a demo
          </Link>
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center"
            style={{ color: 'var(--ink)', background: 'transparent', border: 'none' }}
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden" style={{ padding: '4px clamp(18px, 3vw, 40px) 18px', display: 'grid' }}>
          {navLinks.map(link => (
            <Link
              key={link.name}
              to={link.path}
              className="font-display"
              style={{ fontSize: '22px', color: 'var(--ink)', textDecoration: 'none', padding: '12px 0', borderTop: '1px solid var(--line-soft)' }}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/investors"
            className="font-display"
            style={{ fontSize: '22px', color: 'var(--ink)', textDecoration: 'none', padding: '12px 0', borderTop: '1px solid var(--line-soft)' }}
          >
            Investors
          </Link>
        </div>
      )}
    </nav>
  );
}
