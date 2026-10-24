import { useState } from 'react';
import { DollarSign, Settings, MapPin } from 'lucide-react';
import { useReveal, useStaggerReveal } from '../lib/motion';

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

function CardVisual({ number, icon: Icon }: { number: string; icon: React.ElementType }) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-card)',
        padding: 'clamp(30px, 4vw, 46px) clamp(24px, 3vw, 38px)',
        width: '100%',
        minHeight: 'clamp(200px, 22vw, 280px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'flex-start', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div
        aria-hidden
        className="font-display"
        style={{
          position: 'absolute', top: '-18px', right: '-6px',
          fontWeight: 800, fontSize: 'clamp(80px, 12vw, 120px)',
          color: 'var(--primary-wash)', lineHeight: 1, userSelect: 'none',
        }}
      >
        {number}
      </div>
      <div
        style={{
          width: '52px', height: '52px', borderRadius: '14px',
          background: 'var(--primary-wash)', border: '1px solid var(--primary-line)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}
      >
        <Icon size={23} style={{ color: 'var(--primary)' }} />
      </div>
      <div className="font-display" style={{ fontWeight: 800, fontSize: 'clamp(38px, 8vw, 54px)', color: 'var(--ground-deep)', lineHeight: 1 }}>
        {number}
      </div>
    </div>
  );
}

function ConsultingHero() {
  const contentRef = useStaggerReveal<HTMLDivElement>({ y: 32, duration: 700, staggerDelay: 120 });

  const scrollToContact = () => {
    document.getElementById('consulting-contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      style={{
        position: 'relative', overflow: 'hidden',
        background: 'var(--ground)',
        padding: 'clamp(64px, 9vw, 118px) 0',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute', top: '-25%', right: '-8%',
          width: 'min(720px, 100vw)', height: '620px', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(245,166,35,0.20) 0%, transparent 66%)',
        }}
      />

      <div className="relative max-w-[1180px] mx-auto px-6 lg:px-10">
        <div ref={contentRef} style={{ maxWidth: '660px' }}>
          <div style={{ opacity: 0, marginBottom: '28px' }}>
            <span
              className="font-mono"
              style={{
                fontSize: '10.5px', letterSpacing: '2px', textTransform: 'uppercase',
                background: 'var(--surface)', color: 'var(--muted)',
                border: '1px solid var(--line)', padding: '7px 16px',
                borderRadius: 'var(--radius-pill)', display: 'inline-block',
              }}
            >
              Startup consulting
            </span>
          </div>
          <h1
            className="font-display"
            style={{ opacity: 0, fontWeight: 800, fontSize: 'clamp(36px, 5.4vw, 62px)', lineHeight: 1.0, color: 'var(--ink)', marginBottom: '24px' }}
          >
            From idea to operation.
          </h1>
          <p
            className="font-body"
            style={{ opacity: 0, fontSize: 'clamp(15px, 1.8vw, 18px)', color: 'var(--muted)', lineHeight: 1.75, maxWidth: '540px', marginBottom: '36px' }}
          >
            We help startups figure out the hard parts — revenue models, operational
            structure, market entry, and how to actually set up and run a business.
          </p>
          <div style={{ opacity: 0 }}>
            <button onClick={scrollToContact} className="pill pill-primary">
              Start a conversation →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

const blocks = [
  {
    number: '01',
    icon: DollarSign,
    title: 'Revenue & business models',
    description: 'How will your startup make money? We help you design pricing strategies, subscription models, marketplace economics, and unit economics that actually work — before you build anything.',
    imageLeft: true,
  },
  {
    number: '02',
    icon: Settings,
    title: 'Operations & setup',
    description: "Where to register, how to structure your team, what tools to use, compliance requirements, hiring strategy, and the operational playbook to go from zero to running. We've done it ourselves with A.R.M Technologies — we know what works.",
    imageLeft: false,
  },
  {
    number: '03',
    icon: MapPin,
    title: 'Location & market entry',
    description: "Thinking about launching in a new city or country? We research the market, assess competition, map local regulations, and help you build an entry strategy — whether it's the UK, India, Fiji, or anywhere else.",
    imageLeft: true,
  },
];

function HelpBlock({ block }: { block: typeof blocks[number] }) {
  const ref = useStaggerReveal<HTMLDivElement>({ y: 34, duration: 700, staggerDelay: 130 });

  return (
    <div
      ref={ref}
      className={`flex flex-col ${block.imageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-start gap-9 lg:gap-16`}
    >
      <div className="w-full lg:w-[45%]" style={{ opacity: 0 }}>
        <CardVisual number={block.number} icon={block.icon} />
      </div>
      <div className="w-full lg:w-[55%]" style={{ opacity: 0 }}>
        <h3 className="font-display" style={{ fontWeight: 800, fontSize: 'clamp(22px, 2.8vw, 32px)', color: 'var(--ink)', marginBottom: '14px', lineHeight: 1.15 }}>
          {block.title}
        </h3>
        <p className="font-body" style={{ fontSize: 'clamp(14px, 1.5vw, 16px)', color: 'var(--muted)', lineHeight: 1.75 }}>
          {block.description}
        </p>
      </div>
    </div>
  );
}

function WhatWeHelpWith() {
  const headerRef = useStaggerReveal<HTMLDivElement>({ y: 30, duration: 660, staggerDelay: 90 });

  return (
    <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--line-soft)', padding: 'clamp(64px, 8vw, 110px) 0' }}>
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
        <div ref={headerRef} style={{ marginBottom: '56px' }}>
          <p
            className="font-mono"
            style={{ opacity: 0, fontSize: '11px', color: 'var(--faint)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}
          >
            What we help with
          </p>
          <h2
            className="font-display"
            style={{ opacity: 0, fontWeight: 800, fontSize: 'clamp(26px, 3.6vw, 44px)', color: 'var(--ink)', maxWidth: '580px', lineHeight: 1.08 }}
          >
            The decisions that make or break a startup.
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(48px, 8vw, 96px)' }}>
          {blocks.map(block => <HelpBlock key={block.number} block={block} />)}
        </div>
      </div>
    </section>
  );
}

const proofCards = [
  { name: 'Virgo', description: 'Designed the revenue model, market entry strategy, and operational structure for an AI hotel intelligence platform — from concept to launch.' },
  { name: 'The Gig Search', description: 'Built the marketplace model, pricing strategy, and go-to-market plan for a UK hospitality staffing platform — now live.' },
];

function ProofSection() {
  const headingRef = useReveal<HTMLHeadingElement>({ y: 30, duration: 660 });
  const cardsRef = useStaggerReveal<HTMLDivElement>({ y: 30, duration: 660, staggerDelay: 120 });

  return (
    <section style={{ background: 'var(--ground)', borderTop: '1px solid var(--line-soft)', padding: 'clamp(56px, 7vw, 96px) 0' }}>
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
        <h2
          ref={headingRef}
          className="font-display"
          style={{ opacity: 0, fontWeight: 800, fontSize: 'clamp(23px, 3vw, 34px)', color: 'var(--ink)', marginBottom: '36px' }}
        >
          We practice what we advise.
        </h2>
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {proofCards.map(card => (
            <div
              key={card.name}
              style={{
                opacity: 0,
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-card)',
                padding: 'clamp(22px, 3vw, 32px)',
                transition: 'transform 0.4s, border-color 0.4s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'var(--primary-line)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--line)'; }}
            >
              <div
                className="font-display"
                style={{
                  display: 'inline-block', fontWeight: 700, fontSize: '14px', color: 'var(--primary)',
                  background: 'var(--primary-wash)', border: '1px solid var(--primary-line)',
                  padding: '5px 14px', borderRadius: 'var(--radius-pill)', marginBottom: '16px',
                }}
              >
                {card.name}
              </div>
              <p className="font-body" style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.75, margin: 0 }}>
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConsultingContact() {
  const [formData, setFormData] = useState({ name: '', email: '', startup: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const headingRef = useReveal<HTMLDivElement>({ y: 30, duration: 660 });
  const formRef = useReveal<HTMLDivElement>({ y: 30, duration: 660, delay: 140 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="consulting-contact"
      style={{ background: 'var(--surface)', borderTop: '1px solid var(--line-soft)', padding: 'clamp(64px, 8vw, 110px) 0' }}
    >
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
        <div ref={headingRef} style={{ opacity: 0, textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="font-display" style={{ fontWeight: 800, fontSize: 'clamp(26px, 3.6vw, 40px)', color: 'var(--ink)' }}>
            Let's talk about your startup.
          </h2>
        </div>

        <div
          ref={formRef}
          style={{
            opacity: 0,
            maxWidth: '520px', margin: '0 auto',
            background: 'var(--ground)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-card)',
            padding: 'clamp(26px, 4vw, 40px)',
          }}
        >
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div
                style={{
                  width: '50px', height: '50px', borderRadius: '50%',
                  background: 'var(--primary-wash)', border: '1px solid var(--primary-line)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                }}
              >
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="font-display" style={{ fontWeight: 700, fontSize: '20px', color: 'var(--ink)', marginBottom: '8px' }}>
                Conversation started.
              </h3>
              <p className="font-body" style={{ fontSize: '14px', color: 'var(--muted)' }}>We'll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="font-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="text" placeholder="Name" required aria-label="Name"
                value={formData.name}
                onChange={e => setFormData(d => ({ ...d, name: e.target.value }))}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--line)'; }}
              />
              <input
                type="email" placeholder="Email" required aria-label="Email"
                value={formData.email}
                onChange={e => setFormData(d => ({ ...d, email: e.target.value }))}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--line)'; }}
              />
              <input
                type="text" placeholder="Startup name (optional)" aria-label="Startup name"
                value={formData.startup}
                onChange={e => setFormData(d => ({ ...d, startup: e.target.value }))}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--line)'; }}
              />
              <textarea
                placeholder="What do you need help with?" required rows={4} aria-label="What do you need help with?"
                value={formData.message}
                onChange={e => setFormData(d => ({ ...d, message: e.target.value }))}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--line)'; }}
              />
              <button type="submit" className="pill pill-primary" style={{ width: '100%', marginTop: '4px' }}>
                Start a conversation →
              </button>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <a
              href="mailto:hello@armtechnologies.ltd"
              className="font-body"
              style={{ fontSize: '13px', color: 'var(--primary)', textDecoration: 'none' }}
            >
              hello@armtechnologies.ltd
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ConsultingPage() {
  return (
    <>
      <ConsultingHero />
      <WhatWeHelpWith />
      <ProofSection />
      <ConsultingContact />
    </>
  );
}
