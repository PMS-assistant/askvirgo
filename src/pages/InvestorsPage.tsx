import { useEffect, useState } from 'react';
import { submitEnquiry } from '../lib/enquiries';

/* Investors: one short page with a four-question form (owner, 2026-11-07:
   "only 3-4 questions, simple"). Saved as enquiry_type 'investor' in the same
   table as demo requests; the owner is emailed and the visitor gets a
   thank-you. No funding stage, amounts or claims are stated on the page. */

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export default function InvestorsPage() {
  const [form, setForm] = useState({ name: '', organisation: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'invalid-email' | 'duplicate'>('idle');

  useEffect(() => {
    const previous = document.title;
    document.title = 'Investors | Virgo';
    return () => { document.title = previous; };
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(form.email.trim())) { setStatus('invalid-email'); return; }
    setStatus('loading');
    const result = await submitEnquiry({ type: 'investor', ...form });
    setStatus(result === 'ok' ? 'success' : result);
  };

  const first = form.name.trim().split(' ')[0];

  return (
    <main className="iv">
      <div className="iv-inner">
        <div className="iv-head">
          <span className="iv-eyebrow">Investors</span>
          <h1>Invest in Virgo.</h1>
          <p>
            Virgo is hotel intelligence for independent hotels, built by ARM Technologies. If you’d like to hear about the
            opportunity, tell us a little about yourself and we’ll arrange an introductory conversation.
          </p>
        </div>

        <div className="iv-card">
          {status === 'success' ? (
            <div className="iv-done">
              <span className="iv-tick" aria-hidden>✓</span>
              <h2>{first ? `Thanks, ${first}.` : 'Thanks.'}</h2>
              <p>Your investor enquiry is in. We’ve sent a confirmation to {form.email.trim()} and we’ll be in touch.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="iv-form">
              <label>
                <span>Full name</span>
                <input required value={form.name} onChange={set('name')} autoComplete="name" />
              </label>
              <label>
                <span>Organisation or fund</span>
                <input required value={form.organisation} onChange={set('organisation')} autoComplete="organization" />
              </label>
              <label>
                <span>Email</span>
                <input required type="email" value={form.email} onChange={set('email')} autoComplete="email" />
                {status === 'invalid-email' && <em className="iv-err">Enter a valid email address.</em>}
              </label>
              <label>
                <span>Message <i>(optional)</i></span>
                <textarea rows={4} value={form.message} onChange={set('message')} />
              </label>
              <button type="submit" className="iv-btn" disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending…' : 'Send investor enquiry'}
              </button>
              {status === 'duplicate' && <p className="iv-err">We already have an enquiry from this email. We’ll be in touch.</p>}
              {status === 'error' && (
                <p className="iv-err">
                  We couldn’t send that just now. Please email us at{' '}
                  <a href="mailto:hello@askvirgo.co.uk">hello@askvirgo.co.uk</a> instead.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
