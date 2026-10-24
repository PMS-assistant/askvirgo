import { useEffect, useRef, useState, type ReactNode } from 'react';
import { animate } from 'animejs';
import { Sunrise, MessageCircle, MessageSquare, Star, Bell, Lock, Check, ChevronDown } from 'lucide-react';
import { useReveal, useScrollIndex, useScrollScrub, prefersReducedMotion } from '../../lib/motion';
import VirgoTiltPanel from './VirgoTiltPanel';

/* The page's capability tour. Pinned on desktop: the list advances as you
   scroll and the panel cross-fades to match, with a multi-colour progress
   rail and a step counter tracking how far through the tour you are.

   Kept deliberately compact (see the `sizing` constants below) — this pins
   the viewport for the length of the scroll, so unlike a normal section it
   has to fit inside one screen on real, short browser windows, not just
   the tall ones content is usually designed against.

   Statuses are checked against the backend's PROGRESS.md and must stay honest —
   anything not shipped carries a label saying so. Per the absolute rule in
   CLAUDE.md, nothing here may imply Virgo writes to a connected system; it
   recommends and surfaces. The one exception, guest WhatsApp replies, is the
   product's only write surface and is described as exactly that. */

type Status = 'In progress' | 'On the roadmap';

type Capability = {
  id: string;
  icon: typeof Sunrise;
  label: string;
  status?: Status;
  title: string;
  body: string;
  panel: ReactNode;
  /** This capability's own accent — the "different colour per scroll" cue.
      Always a CSS custom property, never a literal, so a re-theme is still
      a one-file change (see index.css). */
  accent: string;
  wash: string;
};

/* ---- Small shared pieces for the panel mocks ---- */

function Bubble({ children, from }: { children: ReactNode; from: 'user' | 'virgo' }) {
  const isUser = from === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <div
        className="font-body"
        style={{
          maxWidth: '86%', fontSize: '13.5px', lineHeight: 1.6, padding: '11px 15px',
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

function SourceChips({ items }: { items: string[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
      <span className="font-body" style={{ fontSize: '11.5px', color: 'var(--faint)' }}>Sources:</span>
      {items.map(s => (
        <span
          key={s}
          className="font-mono"
          style={{
            fontSize: '10px', color: 'var(--primary)', background: 'var(--primary-wash)',
            border: '1px solid var(--primary-line)', padding: '3px 9px', borderRadius: '5px',
          }}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

function MiniRow({ tone, title, note }: { tone: 'danger' | 'warn'; title: string; note: string }) {
  const color = tone === 'danger' ? 'var(--danger)' : 'var(--amber)';
  const wash = tone === 'danger' ? 'var(--danger-wash)' : 'rgba(245,166,35,0.12)';
  return (
    <div style={{ display: 'flex', gap: '11px', padding: '10px 0', borderBottom: '1px solid var(--line-soft)' }}>
      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, marginTop: '6px', flexShrink: 0, boxShadow: `0 0 0 4px ${wash}` }} />
      <span style={{ minWidth: 0 }}>
        <span className="font-display" style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)' }}>{title}</span>
        <span className="font-body" style={{ fontSize: '12.5px', color: 'var(--muted)' }}>{note}</span>
      </span>
    </div>
  );
}

const CAPABILITIES: Capability[] = [
  {
    id: 'briefing',
    icon: Sunrise,
    label: 'Morning briefing',
    accent: 'var(--amber)',
    wash: 'var(--amber-wash)',
    title: 'The day, before you open a single app.',
    body: 'At 7am Virgo reads across every connected system and writes you one briefing — what needs attention today, and why it matters.',
    panel: (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
          <span className="font-display" style={{ fontSize: '17px', fontWeight: 800, color: 'var(--ink)' }}>Good morning, John</span>
          <span className="font-mono" style={{ fontSize: '11px', color: 'var(--faint)' }}>07:00</span>
        </div>
        <p className="font-body" style={{ fontSize: '12.5px', color: 'var(--muted)', margin: '0 0 10px' }}>
          Three things need you today.
        </p>
        <MiniRow tone="danger" title="Occupancy down 12% vs last Tuesday" note="Mainly same-day bookings, 2–6pm." />
        <MiniRow tone="danger" title="6 rooms still open for Saturday" note="Last Saturday sold out by Thursday." />
        <MiniRow tone="warn" title="Guest rating dropped to 4.2" note="Reviews mention slow check-in." />
      </>
    ),
  },
  {
    id: 'ask',
    icon: MessageCircle,
    label: 'Ask anything',
    accent: 'var(--primary)',
    wash: 'var(--primary-wash)',
    title: 'One question. Every system answers.',
    body: "Ask the way you'd ask a colleague. Virgo works out which tools hold the answer, gathers what it needs from each, and names the source of every figure.",
    panel: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Bubble from="user">Should I raise rates this weekend?</Bubble>
        <SourceChips items={['PMS', 'Accounting']} />
        <Bubble from="virgo">
          You're at 87% occupancy with 6 rooms open Saturday. Last Saturday sold out at £140 by
          Thursday — a 15% increase would still sit under last month's peak. Recommended, not applied.
        </Bubble>
      </div>
    ),
  },
  {
    id: 'messaging',
    icon: MessageSquare,
    label: 'Guest messaging',
    accent: 'var(--mint-deep)',
    wash: 'var(--mint-wash)',
    title: 'Guest messages that send themselves.',
    body: "Booking confirmations, pre-arrival reminders and checkout notes go out over the official WhatsApp Business API. This is the only place Virgo ever writes anything — replies stay inside guardrails, anything unusual is escalated to your team, and one switch pauses all of it.",
    panel: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Bubble from="user">Is late checkout available?</Bubble>
        <Bubble from="virgo">Until 1pm — no charge. I've noted it on your booking for Room 204.</Bubble>
        <div
          className="font-body"
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px',
            color: 'var(--mint-deep)', background: 'rgba(94,234,212,0.14)',
            border: '1px solid rgba(94,234,212,0.4)', borderRadius: '10px', padding: '9px 12px',
          }}
        >
          <Check size={13} style={{ flexShrink: 0 }} />
          Within policy — sent automatically. Anything outside it goes to your team.
        </div>
      </div>
    ),
  },
  {
    id: 'reviews',
    icon: Star,
    label: 'Reviews',
    status: 'In progress',
    accent: 'var(--gold)',
    wash: 'var(--gold-wash)',
    title: 'What guests are actually saying.',
    body: 'Ratings and written feedback pulled in alongside everything else, so a dip in score can be read against the week that caused it. Google and TripAdvisor connectors are being built now.',
    panel: (
      <>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '14px' }}>
          <span className="font-display" style={{ fontSize: '34px', fontWeight: 800, color: 'var(--ink)' }}>4.2</span>
          <span className="font-body" style={{ fontSize: '12.5px', color: 'var(--danger)', fontWeight: 600 }}>▼ from 4.6 last week</span>
        </div>
        <MiniRow tone="warn" title="Slow check-in at peak arrivals" note="Mentioned in 4 of the last 9 reviews." />
        <MiniRow tone="warn" title="Breakfast service times" note="Mentioned twice this week." />
      </>
    ),
  },
  {
    id: 'alerts',
    icon: Bell,
    label: 'Proactive alerts',
    status: 'On the roadmap',
    accent: 'var(--steel)',
    wash: 'var(--steel-wash)',
    title: 'Told before you thought to ask.',
    body: "We're building proactive monitoring on top of the live connectors — demand signals, weather impact and rate recommendations surfaced without a prompt. Not shipped yet; we'll say so when it is.",
    panel: (
      <div
        style={{
          border: '1px dashed var(--line)', borderRadius: '14px', padding: '22px',
          display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start',
        }}
      >
        <Bell size={20} style={{ color: 'var(--amber)' }} />
        <span className="font-display" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>
          Not built yet
        </span>
        <p className="font-body" style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
          Everything else on this page is live or clearly labelled. When this ships, it'll be
          described the same way — no earlier.
        </p>
      </div>
    ),
  },
  {
    id: 'readonly',
    icon: Lock,
    label: 'Read-only by design',
    accent: 'var(--ink-soft)',
    wash: 'var(--graphite-wash)',
    title: "It can't change your systems. By design.",
    body: 'No rate changes, no edited reservations, no cancelled bookings. Virgo requests read-only scopes and nothing more, and it keeps no copy of your data — everything is fetched live to answer the question, then discarded.',
    panel: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          'Read-only OAuth scopes on every connector',
          'No operational data stored, ever',
          'Guest WhatsApp replies are the only write surface',
          'One switch pauses all automated messages',
        ].map(line => (
          <div key={line} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <Lock size={14} style={{ color: 'var(--ink-soft)', flexShrink: 0, marginTop: '3px' }} />
            <span className="font-body" style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.55 }}>{line}</span>
          </div>
        ))}
      </div>
    ),
  },
];

/* A quiet disclosure, not a warning — same honesty as before (still shown
   whenever a capability isn't fully live yet), but styled as a neutral
   caption rather than an amber/mint alert badge, so it doesn't read as
   "something's wrong with this card." */
function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className="font-mono"
      style={{
        fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap',
        color: 'var(--faint)',
        background: 'var(--surface-alt)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-pill)', padding: '2px 8px',
      }}
    >
      {status}
    </span>
  );
}

/* Frosted glass rather than solid white — on desktop it floats over the
   full-bleed colour wash behind it; on mobile, where there's no wash, it
   reads as a very slightly translucent white card. Same material as
   .pill-glass and the footer card, reused here for the same reason.

   The pinned view mounts all six panels at once (only one visible) so the
   cross-fade has something to fade between. `backdrop-filter` is real GPU
   compositing work, so it's applied only to the one currently on screen —
   six simultaneous blur layers on a page already this tall is unnecessary
   cost for five panels nobody can see. */
function Panel({ cap, active = true }: { cap: Capability; active?: boolean }) {
  return (
    <div
      style={{
        background: active ? 'rgba(255,255,255,0.72)' : 'var(--surface)',
        backdropFilter: active ? 'blur(14px) saturate(1.3)' : 'none',
        WebkitBackdropFilter: active ? 'blur(14px) saturate(1.3)' : 'none',
        border: '1px solid rgba(255,255,255,0.6)',
        borderRadius: 'var(--radius-card)', padding: 'clamp(18px, 2.2vw, 26px)',
        boxShadow: '0 24px 60px rgba(20,18,26,0.10)',
        fontSize: '0.92em',
      }}
    >
      {cap.panel}
    </div>
  );
}

/** True while the viewport is at least `lg` (1024px), matching the Tailwind breakpoint. */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isDesktop;
}

/* One rail colour per capability, in order — the fill line sweeps through
   all six as you scroll, so the "extraordinary" touch is the progress
   indicator itself carrying the same colour story as the panel. */
const RAIL_GRADIENT =
  'linear-gradient(to bottom, var(--amber), var(--primary), var(--mint-deep), var(--gold), var(--steel), var(--ink-soft))';

export default function CapabilityScroller() {
  const trackRef = useRef<HTMLDivElement>(null);
  const headRef = useReveal<HTMLDivElement>({ y: 24, duration: 620 });
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const railTrackRef = useRef<HTMLDivElement>(null);

  const isDesktop = useIsDesktop();
  // Pinning drives state off scroll position — hostile on touch, and exactly
  // what reduced-motion asks us not to do. Both fall back to an accordion.
  const pinned = isDesktop && !prefersReducedMotion();
  const active = useScrollIndex(trackRef, CAPABILITIES.length, pinned);
  const activeCap = CAPABILITIES[active];

  // Mobile/reduced-motion accordion: only one capability's title/body/panel
  // is ever expanded. Six of these stacked open at once (the old behaviour)
  // put roughly 2500px of unconditionally-expanded product mockups between
  // "Meet Virgo" and "How it works" — the single worst offender for a page
  // that already felt like nothing but scrolling.
  const [mobileOpen, setMobileOpen] = useState(0);

  const railFillRef = useScrollScrub<HTMLDivElement>(
    { scaleY: [0, 1] },
    { container: trackRef }
  );

  // A small elastic "pop" on whichever icon just became active — the extra
  // flourish on top of the colour change, rather than a plain colour swap.
  useEffect(() => {
    if (!pinned) return;
    const el = iconRefs.current[active];
    if (!el) return;
    const anim = animate(el, { scale: [1, 1.32, 1], duration: 520, ease: 'outElastic(1, 0.6)' });
    return () => { anim.revert(); };
  }, [active, pinned]);

  return (
    <section
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--line-soft)',
        padding: 'clamp(60px, 8vw, 100px) 0',
      }}
    >
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 24px' }}>
        {/* The product itself, tilted back and straightening as you scroll —
            the "Meet Virgo" reveal. Sits between the headline and the tour so
            you see what Virgo *is* before reading what it does.

            The headline is passed *into* the panel rather than rendered above
            it so both ride the same scroll track: "Meet Virgo." lands oversized
            and shrinks back as the chat rises and flattens under it, so the
            headline hands the section over to the product instead of just
            sitting on top of it. The reveal wrapper stays nested inside the
            scrub wrapper — two elements, so the fade-in and the scroll-scrub
            never fight over the same transform. */}
        <VirgoTiltPanel
          title={
            <div ref={headRef} style={{ opacity: 0, maxWidth: '760px', margin: '0 auto 48px', textAlign: 'center' }}>
              <p
                className="font-mono"
                style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: '16px' }}
              >
                What Virgo does
              </p>
              <h2
                className="font-display shine-text"
                style={{ fontSize: 'clamp(48px, 8vw, 92px)', fontWeight: 800, lineHeight: 0.98, marginBottom: '14px' }}
              >
                Meet Virgo.
              </h2>
              <p
                className="font-display meet-virgo-sub"
                style={{ fontSize: 'clamp(19px, 2.4vw, 28px)', fontWeight: 700, lineHeight: 1.25, color: 'var(--ink)' }}
              >
                One place to ask. Every system answers.
              </p>
            </div>
          }
        />
      </div>

      {pinned ? (
        /* Tall track: one (reduced) viewport-fraction of scroll per capability,
           with the content pinned inside it while the list advances. Kept
           compact deliberately — see the padding/minHeight values below —
           so the whole thing fits comfortably even on a short window with a
           bookmarks bar eating into it, rather than assuming a tall one. */
        <div ref={trackRef} style={{ height: `${CAPABILITIES.length * 60}vh`, position: 'relative' }}>
          <div
            style={{
              position: 'sticky', top: 0, height: '100vh',
              display: 'flex', alignItems: 'center',
              boxSizing: 'border-box', paddingTop: '88px', paddingBottom: '24px',
            }}
          >
            {/* Decorative layer only — clipped to the section so the blobs'
                negative offsets never cause a horizontal scrollbar. Kept as
                a sibling of the content (not a shared overflow:hidden
                ancestor) so real content can never be clipped by it. */}
            <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
              <div
                style={{
                  position: 'absolute', inset: 0,
                  background: `linear-gradient(135deg, ${activeCap.wash} 0%, var(--surface) 65%)`,
                  transition: 'background 700ms ease',
                }}
              />
            </div>

            <div style={{ position: 'relative', width: '100%', maxWidth: '1180px', margin: '0 auto', padding: '0 24px' }}>
              <div className="grid grid-cols-2 gap-10 items-center">
                <div style={{ display: 'flex', gap: '18px' }}>
                  {/* Multi-colour progress rail — an "extraordinary" touch:
                      the fill sweeps through every capability's own colour in
                      sequence as you scroll, rather than a plain single-tone
                      bar, so progress and colour identity are the same line. */}
                  <div ref={railTrackRef} style={{ position: 'relative', width: '3px', flexShrink: 0, borderRadius: '2px', background: 'var(--line-soft)', overflow: 'hidden' }}>
                    <div
                      ref={railFillRef}
                      style={{
                        position: 'absolute', inset: 0, transformOrigin: 'top center', transform: 'scaleY(0)',
                        background: RAIL_GRADIENT,
                      }}
                    />
                  </div>

                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1 }}>
                    {CAPABILITIES.map((cap, i) => {
                      const Icon = cap.icon;
                      const on = i === active;
                      return (
                        <li
                          key={cap.id}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '11px',
                            padding: '11px 0', borderBottom: '1px solid var(--line-soft)',
                            color: on ? 'var(--ink)' : 'var(--faint)',
                            transition: 'color 320ms ease, opacity 320ms ease',
                            opacity: on ? 1 : 0.55,
                          }}
                        >
                          <span ref={el => { iconRefs.current[i] = el; }} style={{ display: 'inline-flex', flexShrink: 0 }}>
                            <Icon size={16} style={{ color: on ? cap.accent : 'var(--faint)', transition: 'color 320ms ease' }} />
                          </span>
                          <span className="font-display" style={{ fontSize: '15.5px', fontWeight: on ? 700 : 500 }}>
                            {cap.label}
                          </span>
                          {cap.status && <StatusPill status={cap.status} />}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Every panel occupies the same absolutely-positioned box, so the
                    column never changes height as the active one changes. The
                    outgoing panel fades out before the incoming one starts —
                    without that delay you read two different headings at once. */}
                <div style={{ position: 'relative', minHeight: 'clamp(260px, 38vh, 360px)' }}>
                  {CAPABILITIES.map((cap, i) => (
                    <div
                      key={cap.id}
                      aria-hidden={i !== active}
                      style={{
                        position: 'absolute', top: 0, left: 0, right: 0,
                        opacity: i === active ? 1 : 0,
                        transform: i === active ? 'none' : 'translateY(10px)',
                        transition: i === active
                          ? 'opacity 260ms ease 140ms, transform 260ms ease 140ms'
                          : 'opacity 140ms ease, transform 140ms ease',
                        pointerEvents: i === active ? undefined : 'none',
                      }}
                    >
                      <span
                        className="font-mono"
                        style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', color: cap.accent, marginBottom: '8px' }}
                      >
                        STEP {String(i + 1).padStart(2, '0')} / {String(CAPABILITIES.length).padStart(2, '0')}
                      </span>
                      <h3 className="font-display" style={{ fontSize: 'clamp(19px, 2.1vw, 25px)', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.15, margin: '0 0 8px' }}>
                        {cap.title}
                      </h3>
                      <p className="font-body" style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--muted)', margin: '0 0 16px' }}>
                        {cap.body}
                      </p>
                      <Panel cap={cap} active={i === active} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Accordion — mobile, and anyone who asked for reduced motion. Only
           the open row shows title/body/panel; the rest are a single compact
           line, so the section reads as six labelled rows plus one detail
           block rather than six full screens back to back. */
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {CAPABILITIES.map((cap, i) => {
            const Icon = cap.icon;
            const open = i === mobileOpen;
            return (
              <div
                key={cap.id}
                style={{
                  border: '1px solid var(--line-soft)',
                  borderRadius: 'var(--radius-card)',
                  background: open ? cap.wash : 'transparent',
                  overflow: 'hidden',
                  transition: 'background 250ms ease',
                }}
              >
                <button
                  onClick={() => setMobileOpen(open ? -1 : i)}
                  className="font-body"
                  aria-expanded={open}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '11px',
                    padding: '15px 16px', border: 'none', background: 'transparent', cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <Icon size={17} style={{ color: cap.accent, flexShrink: 0 }} />
                  <span
                    className="font-display"
                    style={{ flex: 1, minWidth: 0, fontSize: '15px', fontWeight: open ? 800 : 700, color: 'var(--ink)' }}
                  >
                    {cap.label}
                  </span>
                  {cap.status && <StatusPill status={cap.status} />}
                  <ChevronDown
                    size={16}
                    style={{ color: 'var(--faint)', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }}
                  />
                </button>

                {open && (
                  <div style={{ padding: '0 16px 20px' }}>
                    <h3 className="font-display" style={{ fontSize: 'clamp(19px, 4vw, 24px)', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.15, margin: '0 0 10px' }}>
                      {cap.title}
                    </h3>
                    <p className="font-body" style={{ fontSize: '14px', lineHeight: 1.65, color: 'var(--muted)', margin: '0 0 16px' }}>
                      {cap.body}
                    </p>
                    <Panel cap={cap} active />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
