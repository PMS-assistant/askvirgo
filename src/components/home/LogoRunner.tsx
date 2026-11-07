/* A band of PMS logos that scrolls continuously, placed after Inside Virgo.
   No heading or wording, at the owner's request (2026-11-06). The list is
   drawn twice so the loop is seamless; it never pauses (owner, 2026-11-07) and sits still
   under reduced motion.

   Logos are the brands' own files from their websites (public/images/pms/),
   unaltered except Rezcontrol, whose white wordmark was made dark for the
   light page; Oracle's wordmark is taken from oracle.com in Oracle red, with
   OPERA set beside it. Guestline and Little Hotelier are text placeholders until the
   official logo files are supplied. Before launch, check each brand's
   guidelines on showing its logo. */

type Brand = { name: string; src?: string; h: number; suffix?: string };

const BRANDS: Brand[] = [
  { name: 'Cloudbeds', src: '/images/pms/cloudbeds.svg', h: 48 },
  { name: 'Mews', src: '/images/pms/mews.svg', h: 34 },
  { name: 'Guestline', h: 0 },
  { name: 'Rezcontrol', src: '/images/pms/rezcontrol.png', h: 56 },
  { name: 'eviivo', src: '/images/pms/eviivo.svg', h: 50 },
  { name: 'Little Hotelier', h: 0 },
  { name: 'Oracle OPERA', src: '/images/pms/oracle.svg', h: 24, suffix: 'OPERA' },
];

function Logo({ b }: { b: Brand }) {
  if (b.src && b.suffix) {
    return (
      <span className="lr-pair">
        <img src={b.src} alt="" style={{ height: b.h }} className="lr-logo" loading="lazy" decoding="async" />
        <span className="lr-suffix">{b.suffix}</span>
        <span className="sr-only">{b.name}</span>
      </span>
    );
  }
  return b.src ? (
    <img src={b.src} alt={b.name} style={{ height: b.h }} className="lr-logo" loading="lazy" decoding="async" />
  ) : (
    <span className="lr-word">{b.name}</span>
  );
}

export default function LogoRunner() {
  return (
    <section className="lr" aria-label="Property management systems">
      <div className="lr-track">
        {[0, 1].map(copy => (
          <ul key={copy} className="lr-list" aria-hidden={copy === 1}>
            {BRANDS.map(b => <li key={b.name}><Logo b={b} /></li>)}
          </ul>
        ))}
      </div>
    </section>
  );
}
