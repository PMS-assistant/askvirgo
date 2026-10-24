import { MessageSquare, FileSearch, Lock } from 'lucide-react';
import { useStaggerReveal } from '../../lib/motion';

/* Three promises, directly under the hero. The third is the one competitors
   cannot make, so it gets the primary treatment. */

const PROMISES = [
  {
    icon: MessageSquare,
    title: 'Ask in plain English',
    body: "Type the question the way you'd ask a colleague. No reports to build, no dashboards to learn.",
  },
  {
    icon: FileSearch,
    title: 'See where each answer came from',
    body: 'Every figure names the system it was read from, so you can check it for yourself.',
  },
  {
    icon: Lock,
    title: 'Read-only by design',
    body: "Virgo can look but not change. It never edits a rate, a reservation or a booking.",
    primary: true,
  },
];

export default function PromiseCards() {
  const ref = useStaggerReveal<HTMLDivElement>({ y: 24, duration: 600, staggerDelay: 90 });

  return (
    <section style={{ background: 'var(--wash)', padding: '0 0 clamp(56px, 7vw, 88px)' }}>
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
        <div ref={ref} className="grid md:grid-cols-3 gap-5">
          {PROMISES.map(({ icon: Icon, title, body, primary }) => (
            <article
              key={title}
              className="lift-card"
              style={{
                opacity: 0,
                background: primary ? 'var(--primary-wash)' : 'var(--surface)',
                border: `1px solid ${primary ? 'var(--primary-line)' : 'var(--line)'}`,
                borderRadius: 'var(--radius-card)',
                padding: '28px 26px',
              }}
            >
              <Icon size={22} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
              <h3 className="font-display" style={{ fontWeight: 700, fontSize: '21px', lineHeight: 1.15, color: 'var(--ink)', margin: '0 0 8px' }}>
                {title}
              </h3>
              <p className="font-body" style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--muted)', margin: 0 }}>
                {body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
