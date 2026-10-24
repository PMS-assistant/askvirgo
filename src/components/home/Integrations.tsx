import { BedDouble, Calculator, MessageCircle, Star, Users, Network, UtensilsCrossed, CreditCard } from 'lucide-react';
import { useStaggerReveal } from '../../lib/motion';

/* The eight kinds of system Virgo connects to, each with the names a hotel
   would recognise and the one thing it lets you ask. Copy is the owner's own
   wording; keep it read-only in tone ("see", "know", "spot") — nothing here
   may imply Virgo changes anything in these systems. */

const CATEGORIES: { icon: typeof BedDouble; title: string; status?: string; systems: string[]; line: string }[] = [
  {
    icon: BedDouble,
    title: 'Booking systems',
    systems: ['Cloudbeds', 'Mews', 'Guestline', 'Rezcontrol', 'eviivo', 'Little Hotelier'],
    line: "Ask about tonight's occupancy, this week's revenue or tomorrow's arrivals.",
  },
  {
    icon: Calculator,
    title: 'Accounting',
    systems: ['Xero', 'QuickBooks', 'Sage', 'FreeAgent'],
    line: 'See profit and loss and spot cost jumps without opening your accounts package.',
  },
  {
    icon: MessageCircle,
    title: 'Guest messaging',
    systems: ['WhatsApp Business'],
    line: 'Urgent guest messages reach the right manager.',
  },
  {
    icon: Star,
    title: 'Reviews',
    status: 'In progress',
    systems: ['Google', 'TripAdvisor'],
    line: 'Know the moment a review needs a reply.',
  },
  {
    icon: Users,
    title: 'Staff rotas',
    systems: ['Rotaready', 'Planday', 'Deputy'],
    line: 'See what your staff cost compared with what you earned.',
  },
  {
    icon: Network,
    title: 'Channel managers',
    systems: ['SiteMinder'],
    line: 'See what you pay Booking.com and Expedia, and what direct bookings would save you.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Restaurant and bar tills',
    systems: ['Zonal', 'Lightspeed', 'Square', 'Access EPoS'],
    line: "See the whole hotel's income in one number.",
  },
  {
    icon: CreditCard,
    title: 'Payroll, payments and pricing',
    systems: ['Sage Payroll', 'BrightPay', 'Stripe', 'Adyen', 'RoomPriceGenie', 'Lighthouse'],
    line: 'Staff costs, card fees and rate suggestions in one place.',
  },
];

export default function Integrations() {
  const headingRef = useStaggerReveal<HTMLDivElement>({ y: 28, duration: 620, staggerDelay: 100 });
  const gridRef = useStaggerReveal<HTMLDivElement>({ y: 24, duration: 600, staggerDelay: 70 });

  return (
    <section
      id="integrations"
      style={{ background: 'var(--surface)', borderTop: '1px solid var(--line-soft)', padding: 'clamp(70px, 9vw, 118px) 0' }}
    >
      <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
        <div ref={headingRef} style={{ textAlign: 'center', marginBottom: '52px' }}>
          <p
            className="font-mono"
            style={{ opacity: 0, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: '16px' }}
          >
            Integrations
          </p>
          <h2
            className="font-display"
            style={{ opacity: 0, fontWeight: 800, fontSize: 'clamp(26px, 4vw, 46px)', color: 'var(--ink)', lineHeight: 1.05 }}
          >
            Connects to the systems you already run.
          </h2>
        </div>

        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map(({ icon: Icon, title, status, systems, line }) => (
            <article
              key={title}
              style={{
                opacity: 0,
                background: 'var(--surface-alt)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-card)',
                padding: '24px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div
                style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: 'var(--primary-wash)', border: '1px solid var(--primary-line)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Icon size={18} style={{ color: 'var(--primary)' }} />
              </div>
              <h3 className="font-display" style={{ fontWeight: 700, fontSize: '19px', lineHeight: 1.15, color: 'var(--ink)', margin: 0 }}>
                {title}
              </h3>
              {status && (
                <span style={{ alignSelf: 'flex-start' }}>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '10.5px', fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase',
                      color: 'var(--ink-soft)', background: 'var(--graphite-wash)',
                      border: '1px solid var(--line)', borderRadius: '999px', padding: '2px 9px',
                    }}
                  >
                    {status}
                  </span>
                </span>
              )}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {systems.map(name => (
                  <li
                    key={name}
                    className="font-mono"
                    style={{
                      fontSize: '11.5px', color: 'var(--primary-deep)', background: 'var(--primary-wash)',
                      borderRadius: '999px', padding: '3px 10px',
                    }}
                  >
                    {name}
                  </li>
                ))}
              </ul>
              <p className="font-body" style={{ fontSize: '14px', lineHeight: 1.55, color: 'var(--muted)', margin: 0 }}>
                {line}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
