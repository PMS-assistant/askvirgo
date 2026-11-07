import { useState } from 'react';
import { submitEnquiry } from '../../lib/enquiries';
import { useStaggerReveal, useReveal } from '../../lib/motion';

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

    setStatus('loading');
    const result = await submitEnquiry({
      type: 'demo',
      name: formData.name,
      email: formData.email,
      hotel: formData.hotel,
      message: formData.message,
    });
    if (result !== 'ok') {
      setStatus(result);
      return;
    }

    setStatus('success');
  };

  return (
    /* The ask, on the page colour like every other section: what to expect
       on the left, the form on the right (stacked on phones). */
    <section className="ct">
      <div className="ct-inner">
        <div ref={headerRef} className="ct-head">
          <p className="ct-eyebrow" style={{ opacity: 0 }}>Book a demo</p>
          <h2 style={{ opacity: 0 }}>Let's talk.</h2>
          <p className="ct-lead" style={{ opacity: 0 }}>
            See Virgo answer the questions your managers ask. Tell us about
            your hotel and we'll be in touch to arrange a demo.
          </p>
        </div>
        <div
          ref={formCardRef}
          className="ct-card"
          style={{ opacity: 0 }}
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
                {formData.name.trim() ? `Thanks, ${formData.name.trim().split(' ')[0]}.` : 'Thanks.'}
              </h3>
              <p className="font-body" style={{ fontSize: '14px', color: 'var(--muted)', maxWidth: '34ch', margin: '0 auto' }}>
                Your demo request is in. We've sent a confirmation to {formData.email.trim()} and we'll be in touch.
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
                    We already have a request from this email. We'll be in touch.
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
                {status === 'loading' ? 'Sending…' : 'Book a demo'}
              </button>

              {/* A failed submit used to be a dead end ("please try again" on a
                  form that will fail again for the same reason). Handing over
                  the address keeps the lead — the person came here to make
                  contact, so the fallback has to be another way to do that. */}
              {status === 'error' && (
                <p style={{ fontSize: '12.5px', color: '#DC2626', textAlign: 'center', lineHeight: 1.5 }}>
                  We couldn't send that just now. Please email us at{' '}
                  <a href="mailto:hello@askvirgo.co.uk" style={{ color: '#DC2626', fontWeight: 600 }}>
                    hello@askvirgo.co.uk
                  </a>{' '}
                  instead — we'll pick it up either way.
                </p>
              )}
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <a
              href="mailto:hello@askvirgo.co.uk"
              className="font-body"
              style={{ fontSize: '13px', color: 'var(--primary)', textDecoration: 'none' }}
            >
              hello@askvirgo.co.uk
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
