import { useState } from 'react';
import { supabase, supabaseConfigured } from '../../lib/supabase';
import { useStaggerReveal, useReveal } from '../../lib/motion';
import FluidBackdrop from '../home/FluidBackdrop';

function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!re.test(email)) return false;
  const disposable = ['mailinator.com', 'tempmail.com', 'throwaway.email', 'guerrillamail.com', 'yopmail.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  return !disposable.includes(domain);
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--surface)',
  border: '1px solid var(--line)',
  borderRadius: '12px',
  padding: '13px 16px',
  color: 'var(--ink)',
  fontSize: '15px',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};

export default function VirgoPilotCTA() {
  const [formData, setFormData] = useState({ name: '', email: '', hotel: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'invalid-email' | 'duplicate'>('idle');
  const [emailTouched, setEmailTouched] = useState(false);

  const headerRef = useStaggerReveal<HTMLDivElement>({ y: 28, duration: 620, staggerDelay: 90 });
  const formCardRef = useReveal<HTMLDivElement>({ y: 28, duration: 640, delay: 140 });

  const emailValid = formData.email === '' || isValidEmail(formData.email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(formData.email)) {
      setStatus('invalid-email');
      return;
    }

    // No credentials means the insert can only fail on a DNS lookup for the
    // placeholder host — skip the round trip and the spinner that goes with it.
    if (!supabaseConfigured) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    // Table name predates the Virgo rename — left as-is to keep existing rows.
    const { error } = await supabase.from('vzir_pilot_signups').insert({
      name: formData.name,
      email: formData.email.toLowerCase().trim(),
      hotel_name: formData.hotel,
      message: formData.message,
    });

    if (error) {
      setStatus(error.code === '23505' ? 'duplicate' : 'error');
      return;
    }

    setStatus('success');
  };

  return (
    /* The site's one dark band. The fluid sim lives here rather than behind
       the hero: it's interactive, so it rewards a visitor who has already
       scrolled the whole page, and a single contained band keeps the light
       "porcelain" identity intact everywhere else. */
    <FluidBackdrop className="fluid-cta">
      <section
        style={{
          position: 'relative',
          padding: 'clamp(70px, 9vw, 120px) 0',
        }}
      >
      <div className="relative max-w-[1180px] mx-auto px-6 lg:px-10">
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: '44px' }}>
          <p
            className="font-mono"
            style={{ opacity: 0, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--pop)', marginBottom: '16px' }}
          >
            Get in touch
          </p>
          <h2
            className="font-display"
            style={{ opacity: 0, fontWeight: 800, fontSize: 'clamp(28px, 4.2vw, 50px)', color: '#fff', lineHeight: 1.05, marginBottom: '16px' }}
          >
            Let's talk.
          </h2>
          <p
            className="font-body"
            style={{ opacity: 0, fontSize: 'clamp(15px, 1.6vw, 17px)', color: 'rgba(255,255,255,0.74)', maxWidth: '460px', margin: '0 auto', lineHeight: 1.65 }}
          >
            Send a note and we'll come back within one working day — no sales pipeline,
            no follow-up sequence.
          </p>
        </div>

        <div
          ref={formCardRef}
          style={{
            opacity: 0,
            maxWidth: '520px', margin: '0 auto',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-card)',
            padding: 'clamp(28px, 4vw, 44px)',
            boxShadow: '0 26px 60px rgba(20,18,26,0.10)',
          }}
        >
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '22px 0' }}>
              <div
                style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  background: 'var(--primary-wash)', border: '1px solid var(--primary-line)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="font-display" style={{ fontWeight: 700, fontSize: '21px', color: 'var(--ink)', marginBottom: '8px' }}>
                Request received.
              </h3>
              <p className="font-body" style={{ fontSize: '14px', color: 'var(--muted)' }}>
                We'll be in touch within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="font-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="text"
                placeholder="Name"
                required
                aria-label="Name"
                value={formData.name}
                onChange={e => setFormData(d => ({ ...d, name: e.target.value }))}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--line)'; }}
              />

              <div>
                <input
                  type="email"
                  placeholder="Email"
                  required
                  aria-label="Email"
                  value={formData.email}
                  onChange={e => setFormData(d => ({ ...d, email: e.target.value }))}
                  onBlur={e => { setEmailTouched(true); e.target.style.borderColor = 'var(--line)'; }}
                  onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                  style={{
                    ...inputStyle,
                    borderColor: emailTouched && !emailValid ? '#DC2626' : 'var(--line)',
                  }}
                />
                {((emailTouched && !emailValid) || status === 'invalid-email') && (
                  <p style={{ fontSize: '12.5px', color: '#DC2626', marginTop: '6px', marginLeft: '4px' }}>
                    Enter a valid email address.
                  </p>
                )}
                {status === 'duplicate' && (
                  <p style={{ fontSize: '12.5px', color: '#B8760D', marginTop: '6px', marginLeft: '4px' }}>
                    This email is already registered.
                  </p>
                )}
              </div>

              <input
                type="text"
                placeholder="Hotel name"
                aria-label="Hotel name"
                value={formData.hotel}
                onChange={e => setFormData(d => ({ ...d, hotel: e.target.value }))}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--line)'; }}
              />

              <textarea
                placeholder="Anything you'd like us to know (optional)"
                aria-label="Message"
                rows={3}
                value={formData.message}
                onChange={e => setFormData(d => ({ ...d, message: e.target.value }))}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--line)'; }}
              />

              <button
                type="submit"
                disabled={status === 'loading'}
                className="pill pill-primary"
                style={{ width: '100%', marginTop: '4px', opacity: status === 'loading' ? 0.6 : 1 }}
              >
                {status === 'loading' ? 'Sending…' : 'Get in touch'}
              </button>

              {/* A failed submit used to be a dead end ("please try again" on a
                  form that will fail again for the same reason). Handing over
                  the address keeps the lead — the person came here to make
                  contact, so the fallback has to be another way to do that. */}
              {status === 'error' && (
                <p style={{ fontSize: '12.5px', color: '#DC2626', textAlign: 'center', lineHeight: 1.5 }}>
                  We couldn't send that just now. Please email us at{' '}
                  <a href="mailto:info@armtechnologies.ltd" style={{ color: '#DC2626', fontWeight: 600 }}>
                    info@armtechnologies.ltd
                  </a>{' '}
                  instead — we'll pick it up either way.
                </p>
              )}
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <a
              href="mailto:info@armtechnologies.ltd"
              className="font-body"
              style={{ fontSize: '13px', color: 'var(--primary)', textDecoration: 'none' }}
            >
              info@armtechnologies.ltd
            </a>
          </div>

          {/* Same channel now also reachable from the navbar ("Investor
              Enquiry"), so this is a quiet echo for anyone who scrolled the
              whole way down rather than the only way to find it. "Press"
              dropped — no press interest to route yet, and naming a channel
              nobody uses reads worse than not having it. */}
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <span className="font-body" style={{ fontSize: '12.5px', color: 'var(--faint)' }}>
              Investor enquiry?{' '}
            </span>
            <a
              href="mailto:info@armtechnologies.ltd?subject=Investor%20Enquiry"
              className="font-body"
              style={{ fontSize: '12.5px', color: 'var(--muted)', textDecoration: 'underline' }}
            >
              Email us directly
            </a>
          </div>
        </div>
      </div>
      </section>
    </FluidBackdrop>
  );
}
