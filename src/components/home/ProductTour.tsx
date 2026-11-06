import { useEffect, useRef, type ReactNode } from 'react';
import {
  BarChart3, MessageCircle, ClipboardList, Inbox, TrendingUp, Plug, Archive, ArrowUp, BellRing, Mail, Check,
  BedDouble, Network, PoundSterling, AlertTriangle, CalendarX, Users,
} from 'lucide-react';
import { prefersReducedMotion } from '../../lib/motion';

/* "Inside Virgo": a 32-second product demo that plays like a screen recording.

   A cursor labelled "Sarah · General manager" works the real app's screens
   (modelled on the product repo), one chapter after another, on a loop.
   Every line of content comes from the business requirements (virgo.pdf):

   1. Morning briefing: the figures count in, she opens the room 214 alert and
      a warning names the room, the guest and the arrival time (UC-2).
   2. Ask Virgo: she asks why revenue is down while occupancy is flat (UC-6).
      Virgo reads the systems, answers once with figures, sources and the
      period, and says what isn't connected rather than guessing.
   3. Guest inbox: a routine question is answered from the hotel's own notes
      (UC-14); a complaint goes to the duty manager, the guest is told a person
      is coming, and it is logged for the owner (UC-15, R7, R8). It ends on the
      auto-reply switch, the owner's stop switch (R9).

   Twice, Virgo drafts an email to the team who can fix the problem
   (housekeeping for the late room, maintenance for the heating) and Sarah
   presses Send. Virgo drafts; the manager decides and sends. Nothing is
   written into the PMS or any other connected system (R1).

   Every frame is a pure function of time t, applied to the DOM directly so
   React never re-renders while it plays. It pauses while off screen. Under
   reduced motion it shows one still frame. All figures are sample data for
   the fictional Meridian; sources are named by category. Class names toggled
   here are written out in full so Tailwind keeps them. */

const DUR = 44;

const NAV = [
  { key: 'briefing', label: 'Briefing', icon: BarChart3 },
  { key: 'ask', label: 'Ask Virgo', icon: MessageCircle },
  { key: 'ops', label: 'Operations', icon: ClipboardList },
  { key: 'inbox', label: 'Guest inbox', icon: Inbox, count: '2' },
  { key: 'rep', label: 'Reporting', icon: TrendingUp },
  { key: 'int', label: 'Integrations', icon: Plug },
  { key: 'arch', label: 'Archive', icon: Archive },
];

const QUESTION = 'Why is revenue down this week when occupancy hasn’t moved?';
const ANSWER: (string | { t: string; n: number })[] = [
  'More', 'bookings', 'came', 'through', 'online', 'travel', 'agents,', { t: '58%', n: 1 }, 'against', '41%,', 'so',
  'commission', 'rose', { t: '£1,140', n: 2 }, 'and', 'average', 'rate', 'slipped', { t: '£6', n: 3 }, '.',
];

/* Pacing chart data: nights on the books against the same time last year, one 0–100% scale. */
const ON_BOOKS = [82, 58, 71, 84, 88, 64, 60, 55, 66, 79, 91, 86, 61, 57];
const LAST_YEAR = [78, 60, 66, 80, 85, 62, 63, 57, 60, 75, 84, 88, 59, 55];
const DAYS = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const DATES = ['25', '26', '27', '28', '29', '30', '31', '1', '2', '3', '4', '5', '6', '7'];
const LOW = 60; // nights below this are flagged amber

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const easeIO = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function PacingChart() {
  const W = 660, H = 236, L = 34, R = 6, T = 22, B = 40;
  const cw = (W - L - R) / ON_BOOKS.length;
  const y = (v: number) => T + (H - T - B) * (1 - v / 100);
  const cx = (i: number) => L + i * cw + cw / 2;
  // Class names written out in full so Tailwind keeps them.
  const barClass = (i: number, v: number) => (i === 0 ? 'pt-bar pt-bar-now' : v < LOW ? 'pt-bar pt-bar-low' : 'pt-bar');
  return (
    <svg className="pt-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Occupancy on the books for the next 14 nights against the same time last year">
      {[0, 25, 50, 75, 100].map(v => (
        <g key={v}>
          <line className={v === 0 ? 'pt-grid pt-grid-base' : 'pt-grid'} x1={L} x2={W - R} y1={y(v)} y2={y(v)} />
          <text className="pt-axis" x={L - 7} y={y(v) + 3.5} textAnchor="end">{v}%</text>
        </g>
      ))}
      {/* the weekend nights sit on a soft band */}
      {ON_BOOKS.map((_, i) => (DAYS[i] === 'Fri' || DAYS[i] === 'Sat') && (
        <rect key={`w${i}`} className="pt-weekend" x={L + i * cw + 1} y={T - 6} width={cw - 2} height={H - T - B + 6} rx={4} />
      ))}
      {ON_BOOKS.map((v, i) => (
        <rect key={i} className={barClass(i, v)} x={L + i * cw + cw * 0.18} y={y(v)} width={cw * 0.64} height={y(0) - y(v)} rx={4} />
      ))}
      {ON_BOOKS.map((v, i) => (
        <text key={`v${i}`} className={i === 0 ? 'pt-val pt-val-now' : 'pt-val'} x={cx(i)} y={y(v) - 8} textAnchor="middle">{v}</text>
      ))}
      <polyline className="pt-ly" points={LAST_YEAR.map((v, i) => `${cx(i)},${y(v)}`).join(' ')} />
      {LAST_YEAR.map((v, i) => <circle key={`d${i}`} className="pt-ly-dot" cx={cx(i)} cy={y(v)} r={2.6} />)}
      {DAYS.map((d, i) => (
        <g key={`x${i}`} className={i === 0 ? 'pt-x pt-x-now' : 'pt-x'}>
          <text x={cx(i)} y={H - 22} textAnchor="middle">{i === 0 ? 'Tonight' : d}</text>
          <text className="pt-x-date" x={cx(i)} y={H - 9} textAnchor="middle">{DATES[i]}</text>
        </g>
      ))}
    </svg>
  );
}

const Fig = ({ children }: { children: ReactNode }) => <span className="pt-fig">{children}</span>;

export default function ProductTour() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const app = root.querySelector<HTMLElement>('.pt-app');
    if (!app) return;
    const q = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel);
    const qa = <T extends Element = HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T>(sel));
    const tog = (el: Element | null, cls: string, on: boolean) => el?.classList.toggle(cls, on);
    const setText = (el: Element | null, s: string) => { if (el && el.textContent !== s) el.textContent = s; };

    const cursor = q('.pt-cursor'), ripple = q('.pt-ripple'), toast = q('.pt-toast');
    const counts = qa('[data-count]');
    const bars = qa<SVGRectElement>('.pt-bar');
    const ly = q<SVGPolylineElement>('.pt-ly');
    const vals = qa<SVGTextElement>('.pt-val');
    const dots = qa<SVGCircleElement>('.pt-ly-dot');
    const words = qa('.pt-answer .pt-w');
    const typed = q('[data-typed]');
    const screensEl = q('.pt-screens');

    // Centre of an element in the app's own coordinates (unaffected by transforms).
    const centre = (sel: string) => () => {
      let el = app.querySelector<HTMLElement>(sel);
      if (!el) return { x: app.clientWidth * 0.6, y: app.clientHeight * 0.6 };
      let x = el.offsetWidth / 2, y = el.offsetHeight / 2;
      while (el && el !== app) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent as HTMLElement | null; }
      return { x, y };
    };
    const corner = () => ({ x: app.clientWidth * 0.84, y: app.clientHeight * 0.86 });
    // [time, place]: the cursor glides between consecutive waypoints along a gentle arc.
    const PATH: [number, () => { x: number; y: number }][] = [
      [1.8, corner], [3.6, centre('[data-at="alert"]')], [8.4, centre('[data-at="alert"]')],
      [9.0, centre('[data-at="act-hk"]')], [11.6, centre('[data-at="act-hk"]')], [12.3, centre('[data-at="send-hk"]')],
      [14.6, centre('[data-at="send-hk"]')], [16.8, centre('[data-nav="ask"]')], [17.3, centre('[data-nav="ask"]')],
      [18.0, centre('[data-at="askbar"]')], [26.3, centre('[data-at="askbar"]')], [26.9, centre('[data-nav="inbox"]')],
      [30.5, centre('[data-nav="inbox"]')], [31.2, centre('[data-at="t312"]')], [34.0, centre('[data-at="t312"]')],
      [34.6, centre('[data-at="act-mt"]')], [37.0, centre('[data-at="act-mt"]')], [37.6, centre('[data-at="send-mt"]')],
      [40.2, centre('[data-at="send-mt"]')], [40.8, centre('[data-at="switch"]')], [43.2, centre('[data-at="switch"]')],
    ];
    const CLICKS = [9.1, 12.4, 16.9, 18.1, 27.0, 31.3, 34.7, 37.7];
    const fmt = (v: number, f?: string) =>
      f === 'pct' ? `${Math.round(v)}%` : f === 'gbp2' ? `£${v.toFixed(2)}` : `£${Math.round(v).toLocaleString('en-GB')}`;
    const hkWords = qa('[data-drawer="hk"] .pt-dw');
    const mtWords = qa('[data-drawer="mt"] .pt-dw');
    const D = 4.9; // the ask and inbox chapters start this much later than the briefing's extra beat

    const render = (t: number) => {
      // a short fade at the loop point, like a cut between takes
      if (screensEl) screensEl.style.opacity = String(Math.min(seg(t, 0.45, 0.8), 1 - seg(t, DUR - 0.5, DUR - 0.05)));
      // chapters
      const screen = t < 17.0 ? 'briefing' : t < 27.1 ? 'ask' : 'inbox';
      qa('.pt-screen').forEach(el => tog(el, 'pt-screen-on', el.dataset.screen === screen));
      qa('.pt-nav').forEach(n => tog(n, 'pt-nav-on', n.dataset.nav === screen));
      setText(q('[data-title]'), screen === 'briefing' ? 'Today’s Briefing' : screen === 'ask' ? 'Ask Virgo' : 'Guest inbox');

      // 1 · briefing: numbers count in, chart draws, the alert opens and a warning arrives
      const k = easeIO(seg(t, 0.4, 2.2));
      counts.forEach(el => setText(el, fmt(parseFloat(el.dataset.count || '0') * k, el.dataset.fmt)));
      bars.forEach((b, i) => { b.style.transform = `scaleY(${easeIO(seg(t, 0.8 + i * 0.05, 1.8 + i * 0.05))})`; });
      if (ly) ly.style.strokeDashoffset = String(900 * (1 - seg(t, 1.6, 3.4)));
      vals.forEach((v, i) => { v.style.opacity = String(seg(t, 1.5 + i * 0.05, 1.9 + i * 0.05)); });
      dots.forEach((d, i) => { d.style.opacity = String(seg(t, 1.8 + i * 0.11, 2.1 + i * 0.11)); });
      tog(q('[data-at="alert"]'), 'pt-hover', t > 3.8 && t < 17.0);
      const tw = seg(t, 4.6, 5.1) * (1 - seg(t, 7.6, 8.0));
      if (toast) { toast.style.opacity = String(tw); toast.style.transform = `translateY(${(1 - tw) * 14}px)`; }
      // ...then a message to housekeeping is drafted, and Sarah sends it
      tog(q('[data-drawer="hk"]'), 'pt-drawer-on', t > 9.3 && t < 14.4);
      const hn = Math.round(seg(t, 9.7, 11.2) * hkWords.length);
      hkWords.forEach((w, i) => tog(w, 'pt-show', i < hn));
      tog(q('[data-drawer="hk"]'), 'pt-sent', t > 12.5);
      tog(q('[data-done="hk"]'), 'pt-show', t > 14.5);

      // 2 · ask: type, read, answer once with sources, admit what isn't connected
      const typing = t > 13.2 + D && t < 15.8 + D;
      tog(q('[data-at="askbar"]'), 'pt-focus', typing);
      const tp = seg(t, 13.3 + D, 15.6 + D);
      const n = Math.round((tp < 0.5 ? tp * 1.1 : 0.55 + (tp - 0.5) * 0.9) * QUESTION.length);
      setText(typed, typing ? QUESTION.slice(0, n) : 'Ask Virgo anything about your hotel');
      tog(q('.pt-bubble-q'), 'pt-show', t > 15.8 + D);
      qa('[data-read]').forEach((r, i) => {
        tog(r, 'pt-show', t > 16.0 + D + i * 0.4);
        tog(r, 'pt-lit', i < 2 && t > 16.0 + D + i * 0.4 && t < 17.4 + D);
      });
      const wn = Math.round(seg(t, 17.4 + D, 19.8 + D) * words.length);
      words.forEach((w, i) => tog(w, 'pt-show', i < wn));
      tog(q('.pt-notes'), 'pt-show', t > 20.0 + D);
      tog(q('.pt-caveat'), 'pt-show', t > 20.4 + D);

      // 3 · inbox: one answered from the hotel's notes, one handed to a person
      tog(q('[data-thread="108"]'), 'pt-show', t > 22.6 + D);
      tog(q('[data-thread="108"]'), 'pt-thread-on', t > 22.6 + D && t < 26.4 + D);
      tog(q('[data-thread="312"]'), 'pt-thread-on', t >= 26.4 + D);
      const st = q('[data-st108]');
      if (st) {
        const done = t > 24.4 + D;
        setText(st, done ? 'Answered by Virgo' : 'New');
        tog(st, 'pt-st-ok', done);
        tog(st, 'pt-st-wait', !done);
      }
      tog(q('[data-convo="108"]'), 'pt-convo-on', t > 22.6 + D && t < 26.4 + D);
      tog(q('[data-convo="312"]'), 'pt-convo-on', t >= 26.4 + D);
      const m = (id: string, a: number, b = 99) => tog(q(`[data-m="${id}"]`), 'pt-show', t > a && t < b);
      m('108g', 22.8 + D); m('108t', 23.4 + D, 24.4 + D); m('108v', 24.4 + D); m('108s', 24.8 + D);
      m('312g', 26.6 + D); m('312t', 27.2 + D, 28.2 + D); m('312v', 28.2 + D); m('312s', 28.6 + D);
      // ...then a message to maintenance is drafted, and Sarah sends it
      tog(q('[data-at="act-mt"]'), 'pt-show', t > 33.9);
      tog(q('[data-drawer="mt"]'), 'pt-drawer-on', t > 34.9 && t < 39.6);
      const mn = Math.round(seg(t, 35.3, 36.8) * mtWords.length);
      mtWords.forEach((w, i) => tog(w, 'pt-show', i < mn));
      tog(q('[data-drawer="mt"]'), 'pt-sent', t > 37.8);
      m('312mt', 39.7);
      tog(q('.pt-tip'), 'pt-show', t > 40.9 && t < 42.8);

      // cursor
      let p = PATH[0][1]();
      for (let i = 0; i < PATH.length - 1; i++) {
        const [ta, fa] = PATH[i], [tb, fb] = PATH[i + 1];
        if (t >= ta && t <= tb) {
          const a = fa(), b = fb(), u = easeIO(seg(t, ta, tb));
          const lift = Math.sin(Math.PI * u) * Math.min(40, Math.hypot(b.x - a.x, b.y - a.y) * 0.12);
          p = { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u - lift };
          break;
        }
        if (t > tb) p = fb();
      }
      const click = CLICKS.find(c => t >= c - 0.08 && t < c + 0.55);
      const pressing = click !== undefined && t < click + 0.12;
      if (cursor) {
        cursor.style.transform = `translate(${p.x - 3}px, ${p.y - 2}px) scale(${pressing ? 0.86 : 1})`;
        cursor.style.opacity = String(seg(t, 1.6, 2.2) * (1 - seg(t, 43.0, 43.5)));
        // keep the name tag inside the window near its right edge
        tog(cursor, 'pt-cursor-left', p.x > app.clientWidth - 200);
      }
      if (ripple) {
        if (click !== undefined && t >= click) {
          const u = (t - click) / 0.55;
          ripple.style.transform = `translate(${p.x}px, ${p.y}px) scale(${0.4 + u})`;
          ripple.style.opacity = String(0.9 * (1 - u));
        } else ripple.style.opacity = '0';
      }
    };

    if (prefersReducedMotion()) {
      render(6);
      return;
    }

    let start = performance.now(), raf = 0, visible = false;
    const tick = (now: number) => {
      render(((now - start) / 1000) % DUR);
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    render(0);
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      const was = visible;
      visible = e.isIntersecting;
      if (visible && !was && !raf) { start = performance.now(); raf = requestAnimationFrame(tick); }
    }), { threshold: 0.25 });
    io.observe(root);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  return (
    <section id="product" className="pt">
      <div ref={rootRef} className="pt-inner">
        <div className="pt-head">
          <h2>Inside Virgo.</h2>
        </div>

        <div className="pt-row">
          <div className="pt-app" aria-label="Virgo product demo with sample data" role="img">
            <aside className="pt-side" aria-hidden>
              <div className="pt-dots"><i /><i /><i /></div>
              <div className="pt-logo"><span />Virgo</div>
              {NAV.map(({ key, label, icon: Icon, count }) => (
                <div key={key} className="pt-nav" data-nav={key}>
                  <Icon size={15} aria-hidden />
                  {label}
                  {count && <span className="pt-count">{count}</span>}
                </div>
              ))}
            </aside>

            <div className="pt-main" aria-hidden>
              <div className="pt-top">
                <span><b data-title>Today’s Briefing</b> · The Meridian</span>
                <span className="pt-top-r">
                  <span className="pt-sample">Sample data</span>
                  <span className="pt-avatar" title="Sarah · General manager">S</span>
                </span>
              </div>

              <div className="pt-screens">
                {/* 1 · Morning briefing */}
                <div className="pt-screen" data-screen="briefing">
                  <div className="pt-brief-top">
                    <div>
                      <span className="pt-when">07:00 · Saturday 25 October</span>
                      <p className="pt-greet">Good morning, Sarah. You’re at <Fig>82%</Fig> tonight, and <b className="pt-greet-hot">three things need you</b> today.</p>
                    </div>
                    <span className="pt-for">Prepared for the general manager</span>
                  </div>
                  <div className="pt-kpis">
                    <div className="pt-kpi pt-kpi-sky">
                      <span className="pt-kpi-ico"><BedDouble size={16} aria-hidden /></span>
                      <span className="pt-kpi-l">Occupancy tonight</span>
                      <span className="pt-kpi-v" data-count="82" data-fmt="pct">82%</span>
                      <span className="pt-kpi-d"><i className="pt-chip pt-chip-up">▲ 4 pts</i> vs last Sat · PMS</span>
                    </div>
                    <div className="pt-kpi pt-kpi-mint">
                      <span className="pt-kpi-ico"><TrendingUp size={16} aria-hidden /></span>
                      <span className="pt-kpi-l">RevPAR</span>
                      <span className="pt-kpi-v" data-count="89.40" data-fmt="gbp2">£89.40</span>
                      <span className="pt-kpi-d"><i className="pt-chip pt-chip-up">▲ 9%</i> vs last Sat · PMS</span>
                    </div>
                    <div className="pt-kpi pt-kpi-amber">
                      <span className="pt-kpi-ico"><Network size={16} aria-hidden /></span>
                      <span className="pt-kpi-l">Booked through OTAs</span>
                      <span className="pt-kpi-v" data-count="58" data-fmt="pct">58%</span>
                      <span className="pt-kpi-d"><i className="pt-chip pt-chip-warn">▲ was 41%</i> · Channel manager</span>
                    </div>
                    <div className="pt-kpi pt-kpi-coral">
                      <span className="pt-kpi-ico"><PoundSterling size={16} aria-hidden /></span>
                      <span className="pt-kpi-l">Revenue this month</span>
                      <span className="pt-kpi-v" data-count="47200" data-fmt="gbp">£47,200</span>
                      <span className="pt-kpi-d"><i className="pt-chip pt-chip-up">▲ 18%</i> vs Sept · Accounting</span>
                    </div>
                  </div>
                  <div className="pt-brief-grid">
                    <div className="pt-panel">
                      <div className="pt-panel-h">Pacing, next 14 nights <span>PMS · % of rooms on the books</span></div>
                      <div className="pt-legend">
                        <span><i className="pt-key-bar" />On the books</span>
                        <span><i className="pt-key-now" />Tonight</span>
                        <span><i className="pt-key-low" />Below 60%</span>
                        <span><i className="pt-key-ly" />Same time last year</span>
                      </div>
                      <PacingChart />
                    </div>
                    <div className="pt-panel">
                      <div className="pt-panel-h">Needs you today <span className="pt-count-pill">3</span></div>
                      <div className="pt-att">
                        <div className="pt-att-item pt-att-danger" data-at="alert">
                          <span className="pt-att-ico"><AlertTriangle size={15} aria-hidden /></span>
                          <div>
                            <span className="pt-att-top"><span className="pt-tagc pt-tagc-r">Urgent · Rooms</span><span className="pt-att-time">Due 14:00</span></span>
                            <b>Room 214 isn’t ready for Ms Patel</b>
                            <span>Still waiting to be cleaned · PMS</span>
                            <span className="pt-more">
                              Housekeeping is one person short this morning · Staff rota
                              <span className="pt-act" data-at="act-hk"><Mail size={12} aria-hidden /> Draft to housekeeping</span>
                            </span>
                            <span className="pt-done" data-done="hk"><Check size={12} aria-hidden /> Housekeeping told · 10:44</span>
                          </div>
                        </div>
                        <div className="pt-att-item pt-att-warn">
                          <span className="pt-att-ico"><CalendarX size={15} aria-hidden /></span>
                          <div>
                            <span className="pt-att-top"><span className="pt-tagc pt-tagc-a">Watch · Bookings</span></span>
                            <b>Saturday cancellations 3× normal</b>
                            <span>Mostly one online travel agent · occupancy 82% → 74%</span>
                          </div>
                        </div>
                        <div className="pt-att-item pt-att-info">
                          <span className="pt-att-ico"><Users size={15} aria-hidden /></span>
                          <div>
                            <span className="pt-att-top"><span className="pt-tagc pt-tagc-s">Guests</span></span>
                            <b>Slow check-in, raised 4 times</b>
                            <span>2 guest messages, 2 reviews this week</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2 · Ask Virgo */}
                <div className="pt-screen" data-screen="ask">
                  <div className="pt-ask">
                    <div className="pt-bubble-q">{QUESTION}</div>
                    <div className="pt-reading">
                      <span data-read="0">Reading PMS</span>
                      <span data-read="1">Reading Channel manager</span>
                      <span data-read="2" className="pt-read-off">Competitor rates · not connected</span>
                    </div>
                    <div className="pt-answer">
                      <span className="pt-answer-meta">One answer from 2 systems · 20–26 Oct against 13–19 Oct</span>
                      <p>
                        {ANSWER.map((w, i) =>
                          typeof w === 'string' ? (
                            <span key={i} className="pt-w">{w === '.' ? '.' : `${i ? ' ' : ''}${w}`}</span>
                          ) : (
                            <span key={i} className="pt-w"> <Fig>{w.t}</Fig><sup>{w.n}</sup></span>
                          )
                        )}
                      </p>
                      <div className="pt-notes">
                        <div className="pt-note"><em>1</em><div><b>Channel manager</b><span>Booking source, 20–26 Oct</span></div></div>
                        <div className="pt-note"><em>2</em><div><b>Channel manager</b><span>Commission, same week vs last</span></div></div>
                        <div className="pt-note"><em>3</em><div><b>PMS</b><span>ADR £96 against £102</span></div></div>
                      </div>
                      <p className="pt-caveat">Competitor rates aren’t connected, so they aren’t part of this answer.</p>
                    </div>
                    <div className="pt-askbar" data-at="askbar">
                      <span data-typed>Ask Virgo anything about your hotel</span>
                      <span className="pt-caret" />
                      <span className="pt-go"><ArrowUp size={13} aria-hidden /></span>
                    </div>
                  </div>
                </div>

                {/* 3 · Guest inbox */}
                <div className="pt-screen" data-screen="inbox">
                  <div className="pt-inbox">
                    <div className="pt-threads">
                      <div className="pt-thread pt-thread-new" data-thread="108"><div className="pt-t1">Room 108 <span>07:52</span></div><div className="pt-t2">What time is breakfast?</div><span className="pt-st pt-st-wait" data-st108>New</span></div>
                      <div className="pt-thread" data-thread="312" data-at="t312"><div className="pt-t1">Room 312 <span>06:31</span></div><div className="pt-t2">The heating isn’t working and it’s freezing</div><span className="pt-st pt-st-danger">Needs a person</span></div>
                      <div className="pt-thread"><div className="pt-t1">Room 302 <span>Yesterday</span></div><div className="pt-t2">Checked in · welcome message and room confirmed</div><span className="pt-st pt-st-ok">Welcome sent</span></div>
                      <div className="pt-thread"><div className="pt-t1">Room 117 <span>Yesterday</span></div><div className="pt-t2">Checked out · thank-you and review request</div><span className="pt-st pt-st-ok">Review requested</span></div>
                    </div>
                    <div className="pt-convos">
                      <div className="pt-convo" data-convo="108">
                        <div className="pt-convo-h"><b>Room 108 · WhatsApp</b></div>
                        <p className="pt-msg pt-msg-g" data-m="108g">What time is breakfast?</p>
                        <span className="pt-typing" data-m="108t"><i /><i /><i /></span>
                        <p className="pt-msg pt-msg-v" data-m="108v">Breakfast is 7 to 10am in the Garden Room. Just message here if you need anything else.</p>
                        <span className="pt-sys pt-sys-ok" data-m="108s">Answered from your hotel’s notes</span>
                      </div>
                      <div className="pt-convo" data-convo="312">
                        <div className="pt-convo-h"><b>Room 312 · WhatsApp</b></div>
                        <p className="pt-msg pt-msg-g" data-m="312g">Hi, the heating in our room isn’t working and it’s freezing.</p>
                        <span className="pt-typing" data-m="312t"><i /><i /><i /></span>
                        <p className="pt-msg pt-msg-v" data-m="312v">Sorry about that. I’ve passed this to our duty manager, who’ll be with you shortly.</p>
                        <span className="pt-sys" data-m="312s">Sent to the duty manager · Logged for the owner</span>
                        <span className="pt-act pt-act-c" data-at="act-mt"><Mail size={12} aria-hidden /> Draft to maintenance</span>
                        <span className="pt-sys pt-sys-ok" data-m="312mt">Maintenance told · 06:35</span>
                      </div>
                      <div className="pt-switch-row">
                        <span className="pt-switch" data-at="switch">Auto-replies <i /></span>
                        <span className="pt-tip">One switch stops every automatic reply</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-drawer" data-drawer="hk" aria-hidden>
              <div className="pt-drawer-h"><b>New message</b><span>Email</span></div>
              <div className="pt-drawer-row"><span>To</span><b>Maria · Head housekeeper</b></div>
              <div className="pt-drawer-row"><span>Subject</span><b>Room 214 needed by 14:00</b></div>
              <p className="pt-drawer-body"><span className="pt-dw">Hi</span> <span className="pt-dw">Maria,</span> <span className="pt-dw">Ms</span> <span className="pt-dw">Patel</span> <span className="pt-dw">arrives</span> <span className="pt-dw">at</span> <span className="pt-dw">14:00</span> <span className="pt-dw">and</span> <span className="pt-dw">room</span> <span className="pt-dw">214</span> <span className="pt-dw">is</span> <span className="pt-dw">still</span> <span className="pt-dw">waiting</span> <span className="pt-dw">to</span> <span className="pt-dw">be</span> <span className="pt-dw">cleaned.</span> <span className="pt-dw">We’re</span> <span className="pt-dw">one</span> <span className="pt-dw">person</span> <span className="pt-dw">short</span> <span className="pt-dw">this</span> <span className="pt-dw">morning,</span> <span className="pt-dw">so</span> <span className="pt-dw">could</span> <span className="pt-dw">214</span> <span className="pt-dw">go</span> <span className="pt-dw">first?</span> <span className="pt-dw">Thanks,</span> <span className="pt-dw">Sarah</span></p>
              <p className="pt-drawer-note">Drafted by Virgo from the PMS and the staff rota. Nothing is sent until you press Send.</p>
              <div className="pt-drawer-actions">
                <span className="pt-btn-ghost">Edit</span>
                <span className="pt-btn-send" data-at="send-hk"><span className="pt-send-label">Send</span><span className="pt-sent-label"><Check size={13} aria-hidden /> Sent</span></span>
              </div>
            </div>
            <div className="pt-drawer" data-drawer="mt" aria-hidden>
              <div className="pt-drawer-h"><b>New message</b><span>Email</span></div>
              <div className="pt-drawer-row"><span>To</span><b>Dave · Maintenance lead</b></div>
              <div className="pt-drawer-row"><span>Subject</span><b>Room 312 heating not working</b></div>
              <p className="pt-drawer-body"><span className="pt-dw">Hi</span> <span className="pt-dw">Dave,</span> <span className="pt-dw">the</span> <span className="pt-dw">guest</span> <span className="pt-dw">in</span> <span className="pt-dw">room</span> <span className="pt-dw">312</span> <span className="pt-dw">told</span> <span className="pt-dw">us</span> <span className="pt-dw">at</span> <span className="pt-dw">06:31</span> <span className="pt-dw">that</span> <span className="pt-dw">the</span> <span className="pt-dw">heating</span> <span className="pt-dw">isn’t</span> <span className="pt-dw">working.</span> <span className="pt-dw">Could</span> <span className="pt-dw">you</span> <span className="pt-dw">take</span> <span className="pt-dw">a</span> <span className="pt-dw">look</span> <span className="pt-dw">this</span> <span className="pt-dw">morning?</span> <span className="pt-dw">The</span> <span className="pt-dw">duty</span> <span className="pt-dw">manager</span> <span className="pt-dw">is</span> <span className="pt-dw">with</span> <span className="pt-dw">them</span> <span className="pt-dw">now.</span> <span className="pt-dw">Thanks,</span> <span className="pt-dw">Sarah</span></p>
              <p className="pt-drawer-note">Drafted by Virgo from the guest’s message. Nothing is sent until you press Send.</p>
              <div className="pt-drawer-actions">
                <span className="pt-btn-ghost">Edit</span>
                <span className="pt-btn-send" data-at="send-mt"><span className="pt-send-label">Send</span><span className="pt-sent-label"><Check size={13} aria-hidden /> Sent</span></span>
              </div>
            </div>
            <div className="pt-toast" aria-hidden>
              <div className="pt-toast-h"><BellRing size={14} aria-hidden /><b>Heads up</b><span>10:42</span></div>
              <p>Ms Patel arrives at 14:00 and room 214 isn’t ready yet.</p>
              <span className="pt-toast-src">PMS · arrival time and housekeeping status</span>
            </div>
            <span className="pt-ripple" aria-hidden />
            <div className="pt-cursor" aria-hidden>
              <svg viewBox="0 0 24 24"><path d="M4 2l16 9-7 2-3 7Z" fill="#0F1B33" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" /></svg>
              <span className="pt-who">Sarah · General manager</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
