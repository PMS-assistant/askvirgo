import { useRef, type ReactNode } from 'react';
import { Lock, Building2, Wallet, MessageSquare, CloudRain, Plus, SendHorizontal } from 'lucide-react';
import { useScrollScrub } from '../../lib/motion';
import VirgoOrb from './VirgoOrb';

/* The "Meet Virgo" reveal: the product itself, tilted back in 3D and rotating
   flat as you scroll past it.

   Two parts, in the order a manager actually uses them:

   1. A notifications strip across the top — one at-a-glance line per connected
      source (PMS, accounting, guest messages, weather). Status, not detail:
      enough to know whether anything needs you before you ask anything.
   2. The chat, which is the product. Virgo is a thing you talk to, so the
      screen is mostly conversation rather than tiles and charts.

   Rebuilt from the 21st.dev "Container Text Scroll" effect, which ships on
   framer-motion. `useScrollScrub` in src/lib/motion.ts already binds transforms
   to scroll progress, so no dependency was added.

   `title` is the other half of that effect, and the half this had been missing:
   the headline and the panel share one scroll container, so a single progress
   value drives both — the headline starts oversized and shrinks back while the
   panel rises and straightens under it. Passing the headline in (rather than
   letting the caller render it above) is what makes them the same scroll
   track; rendered as siblings they'd each measure their own progress and
   drift apart. Same idea as the reference component's `titleComponent` prop.

   Reduced motion: useScrollScrub bails out entirely, leaving both the title
   and the panel in their untouched CSS state — deliberately the *finished*
   one (flat, full size, headline at its resting scale).

   Honesty (see CLAUDE.md): all four notification sources are live connectors,
   weather included (`services/weather_service.py` via Open-Meteo, verified in
   the backend's PROGRESS.md).

   The revenue answer is deliberately careful about scope. There is no POS /
   F&B connector — nothing for point-of-sale, bar or restaurant exists in the
   backend or even in the BRD's connector registry — so Virgo can total what
   has been posted to the accounts but cannot break sales down by outlet. The
   copy says "everything else posted to Xero" rather than naming bar or food,
   which would claim a connector that doesn't exist. If a POS integration
   (Lightspeed, Square, Zonal) ever ships, this line can get more specific.

   Nothing here implies Virgo changed a rate, a booking or a room status.
   Figures are for the fictional Meridian used everywhere else on the site. */

type Source = {
  icon: typeof Building2;
  label: string;
  value: string;
  note: string;
  tone: 'neutral' | 'attention';
};

const SOURCES: Source[] = [
  {
    icon: Building2,
    label: 'PMS',
    value: '12 arrivals',
    note: '87% occupancy',
    tone: 'neutral',
  },
  {
    icon: Wallet,
    label: 'Accounting',
    value: '£47,200',
    note: 'Up 18% on last month',
    tone: 'neutral',
  },
  {
    icon: MessageSquare,
    label: 'Guest messages',
    value: '4 new',
    note: '1 needs a person',
    tone: 'attention',
  },
  {
    icon: CloudRain,
    label: 'Weather',
    value: 'Rain Sat',
    note: '12mm, 14°C',
    tone: 'attention',
  },
];

function SourceTile({ source }: { source: Source }) {
  const Icon = source.icon;
  const accent = source.tone === 'attention' ? 'var(--amber)' : 'var(--primary)';
  const wash = source.tone === 'attention' ? 'var(--amber-wash)' : 'var(--primary-wash)';
  return (
    <div
      style={{
        minWidth: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '11px 13px',
        background: 'var(--surface)',
        border: '1px solid var(--line-soft)',
        borderRadius: '13px',
      }}
    >
      <span
        style={{
          flexShrink: 0, width: '28px', height: '28px', borderRadius: '9px',
          background: wash, border: `1px solid ${accent}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon size={13} style={{ color: accent }} />
      </span>
      <span style={{ minWidth: 0 }}>
        <span
          className="font-mono"
          style={{ display: 'block', fontSize: '8.5px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: '2px' }}
        >
          {source.label}
        </span>
        <span className="font-display" style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.1 }}>
          {source.value}
        </span>
        <span className="font-body" style={{ display: 'block', fontSize: '10.5px', color: 'var(--muted)', marginTop: '1px' }}>
          {source.note}
        </span>
      </span>
    </div>
  );
}

function Bubble({ children, from }: { children: ReactNode; from: 'user' | 'virgo' }) {
  const isUser = from === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <div
        className="font-body"
        style={{
          maxWidth: '80%', fontSize: '13.5px', lineHeight: 1.6, padding: '11px 15px',
          color: isUser ? 'var(--ink)' : 'var(--ink-soft)',
          background: isUser ? 'var(--primary-wash)' : 'var(--surface-alt)',
          border: `1px solid ${isUser ? 'var(--primary-line)' : 'var(--line)'}`,
          borderRadius: isUser ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function VirgoReply({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
      <span style={{ flexShrink: 0, marginTop: '2px' }}>
        <VirgoOrb size={24} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Bubble from="virgo">{children}</Bubble>
      </div>
    </div>
  );
}

function SourceChips({ items }: { items: string[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', paddingLeft: '34px' }}>
      <span className="font-body" style={{ fontSize: '10.5px', color: 'var(--faint)' }}>Read from</span>
      {items.map(s => (
        <span
          key={s}
          className="font-mono"
          style={{
            fontSize: '9px', color: 'var(--primary)', background: 'var(--primary-wash)',
            border: '1px solid var(--primary-line)', padding: '2px 7px', borderRadius: '5px',
          }}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

export default function VirgoTiltPanel({ title }: { title?: ReactNode }) {
  // The scrub tracks this taller wrapper, so there's real scroll distance to
  // rotate through rather than the panel snapping flat instantly.
  const trackRef = useRef<HTMLDivElement>(null);

  // A 26° tilt reads well on a wide panel; on a phone the same angle on a
  // narrow card mostly foreshortens the text into unreadability and eats
  // vertical space. Sampled once at mount, which is all useScrollScrub reads.
  const narrow =
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;

  const panelRef = useScrollScrub<HTMLDivElement>(
    {
      rotateX: narrow ? [10, 0] : [26, 0],
      scale: narrow ? [0.95, 1] : [0.88, 1],
      translateY: narrow ? [22, 0] : [44, 0],
    },
    { container: trackRef, ease: 'outQuad' }
  );

  // Shares `trackRef` with the panel above, so one progress value moves both.
  // Phones only shrink, never start oversized: the headline is already pinned
  // to its clamp() floor at that width, so scaling past 1 is the one direction
  // that can push "Meet Virgo." wider than the screen.
  const titleRef = useScrollScrub<HTMLDivElement>(
    {
      scale: narrow ? [1, 0.9] : [1.16, 0.86],
      translateY: narrow ? [0, -10] : [0, -26],
    },
    { container: trackRef, ease: 'outQuad' }
  );

  return (
    <div
      ref={trackRef}
      style={{ perspective: narrow ? '900px' : '1400px', marginBottom: 'clamp(48px, 7vw, 88px)' }}
    >
      {title && (
        <div ref={titleRef} style={{ transformOrigin: 'center top', willChange: 'transform' }}>
          {title}
        </div>
      )}

      <div
        ref={panelRef}
        style={{
          transformOrigin: 'center top',
          maxWidth: '900px',
          margin: '0 auto',
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-card)',
          boxShadow: '0 40px 90px rgba(20,18,26,0.16)',
          overflow: 'hidden',
        }}
      >
        {/* Window chrome */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 16px', borderBottom: '1px solid var(--line-soft)', background: 'var(--surface-alt)',
          }}
        >
          <div style={{ display: 'flex', gap: '6px' }}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
              <span key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />
            ))}
          </div>
          <span className="font-body" style={{ fontSize: '12px', color: 'var(--faint)' }}>
            Virgo · The Meridian
          </span>
          <span
            className="font-body"
            style={{
              marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '5px',
              fontSize: '10.5px', fontWeight: 600, color: 'var(--primary)',
              background: 'var(--primary-wash)', border: '1px solid var(--primary-line)',
              padding: '3px 9px', borderRadius: 'var(--radius-pill)',
            }}
          >
            <Lock size={10} /> Read-only
          </span>
        </div>

        {/* Notifications strip — one line per connected source.
            Grid rather than flex: four tiles side by side on a phone leaves
            about 70px each, which shreds labels like "Guest messages". Two
            columns on mobile, four from `sm` up. */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-2"
          style={{
            padding: 'clamp(14px, 1.8vw, 18px) clamp(16px, 2.4vw, 24px)',
            background: 'var(--ground)',
            borderBottom: '1px solid var(--line-soft)',
          }}
        >
          {SOURCES.map(s => <SourceTile key={s.label} source={s} />)}
        </div>

        {/* The chat — the actual product. */}
        <div
          style={{
            padding: 'clamp(18px, 2.4vw, 26px) clamp(16px, 2.4vw, 24px)',
            display: 'flex', flexDirection: 'column', gap: '12px',
          }}
        >
          <Bubble from="user">What have we actually made this month?</Bubble>

          <SourceChips items={['Xero', 'PMS']} />

          <VirgoReply>
            £47,200 through the books month-to-date, up 18% on last month. Rooms account
            for £39,800 of that at £89.40 RevPAR — the rest is everything else posted to
            Xero. Six trading days left.
          </VirgoReply>

          <Bubble from="user">Anything else I should know this morning?</Bubble>

          <VirgoReply>
            Room 204's shower was reported low a second time, and three rooms are still
            to clean before the 2pm arrivals.
          </VirgoReply>
        </div>

        {/* Ask bar */}
        <div style={{ padding: '0 clamp(16px, 2.4vw, 24px) clamp(16px, 2.4vw, 24px)' }}>
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              border: '1px solid var(--line)', borderRadius: 'var(--radius-pill)',
              padding: '9px 9px 9px 15px', background: 'var(--surface)',
            }}
          >
            <Plus size={14} style={{ color: 'var(--faint)', flexShrink: 0 }} />
            <span className="font-body" style={{ flex: 1, minWidth: 0, fontSize: '13px', color: 'var(--faint)' }}>
              Ask Virgo
            </span>
            <span
              style={{
                width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--ground-deep)',
              }}
            >
              <SendHorizontal size={13} style={{ color: 'var(--faint)' }} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
