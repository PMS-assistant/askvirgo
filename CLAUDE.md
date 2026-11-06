# CLAUDE.md — Virgo website (askvirgo.co.uk)

Marketing website for **Virgo**, an AI hotel intelligence platform. React +
TypeScript + Vite, Tailwind, Supabase. Deployed on AWS Amplify (see README).
This repo is the website only, not the product.

## Brand rules

- Product only. The site says Virgo and nothing about a parent company.
- **Exceptions:** (1) the footer legal line, and (2) the About page (`/about`), which names ARM Technologies Limited as the builder of Virgo, at the owner's request on 2026-11-06. The footer legal line is:
   "Virgo is a product of ARM
  Technologies Limited. Registered in England and Wales, company number
  15163077. Registered office: Wilson House, 2 Lorne Park Road, Bournemouth, BH1 1JN."
- Contact address everywhere: `hello@askvirgo.co.uk`. Use the word "Contact",
  not "Investor Enquiry".
- Never mention hosting, MCP, Claude, OpenAI or other tooling/vendors on the site.
- No invented number claims ("saves X hours", customer counts). Sample figures
  in product mockups are fine, but must stay plainly illustrative.

## The core product rule

**Virgo never writes to any connected system**: no rate changes, no reservation
edits, no bookings. The only write surface is scoped, guardrailed WhatsApp guest
replies. Copy implying Virgo "adjusts", "applies" or "updates" something in a PMS,
OTA or accounting system is wrong; say it *recommends* or *surfaces*.

Before editing Virgo claims, read `docs/virgo-website-content-plan.md`. It lists
which data sources are real today and which are roadmap.

## Business requirements (`virgo.pdf`, the source of truth for copy)

`virgo.pdf` in the repo root is the owner's "Business Requirements and Use Cases"
document. It is gitignored (business document, keep it out of the public repo).
It is now **version 2 (26 Oct 2026)**, with Addendum 1 merged in: section 5.5 (UC-19,
UC-20), a Staff messaging row in section 6, R10, and R1 updated to name the second
exception. The original is kept as `virgo-v1.pdf`; `docs/virgo-requirements-addendum.md`
records just the changes. Website copy must not contradict it. Key points:

- **What Virgo is for:** questions a single system cannot answer, and things no system
  will tell you unless you go looking. If a number is already on a screen someone has
  open, it is not a job for Virgo. It replaces nothing and holds no records of its own.
- **Four users only:** duty/operations manager, general manager, owner/director,
  finance/admin. **Front desk is not a user** (they live in the PMS); anything for them
  goes to the duty manager. Never show front desk asking Virgo something.
- **How answers behave:** plain language; show the figures underneath; name the source
  system and the period; scoped to the user's role; one reconciled answer, not several
  reports; admits what it does not know rather than guessing; reads time the way a
  person means it.
- **Use cases to draw examples from:** UC-1 start-of-shift risk summary, UC-2 guest due
  before their room is ready, UC-3 oversold, UC-4 cancellations climbing, UC-5 what a
  full week actually contributed, UC-6 revenue down while occupancy flat, UC-7 week on
  week for the owner, UC-8 why a weekend was poor, UC-9 event coming (a suggestion only),
  UC-10 which property needs me, UC-11 month-end reconciliation, UC-12 what we are owed
  and how old, UC-13 welcome at check-in, UC-14 routine guest answers from the hotel's
  own notes, UC-15 complaints/bills/commitments go to the duty manager, UC-16 suggested
  reply for early check-in, UC-17 recurring complaint themes, UC-18 thank-you and
  review request at checkout.
- **Systems in scope (§6):** PMS (Cloudbeds, Mews, Guestline, SiteMinder, Opera),
  accounting (Xero, QuickBooks), channels/OTAs via the PMS or channel manager,
  WhatsApp Business, reviews (Google Business Profile, others later), staff rota
  tools, outside conditions (weather, local events, competitor rates). Tills, payroll
  and payment providers are **not** in scope.
- **Non-negotiables (§7):** R1 read-only except guest messages; R2 no operational
  hotel data kept (only configuration, credentials, message logs); R3 every answer
  shows its figures and source; R4 role-based access on every answer; R5 hotels fully
  isolated; R6 guest replies only state what the hotel wrote down; R7 escalate to
  staff and stop, telling the guest a person is picking it up; R8 the owner can see
  every message sent and every escalation; R9 a stop switch for all automatic sending.
- **Addendum 1 (staff messages):** UC-19 drafts a message to the head of housekeeping
  when a room won't be ready; UC-20 drafts a message to the maintenance lead when a
  guest reports something broken. R10: staff messages are always drafted, never sent
  automatically; a person presses Send; each one is logged for the owner; nothing is
  written into any connected system (R1 still holds).
- The document says the problem costs a manager "between one and four hours a day".
  The site does not use that figure, per the no-number-claims rule; ask the owner
  before adding it.

## Pages

| Route | File |
|---|---|
| `/` | `src/pages/HomePage.tsx`, one continuous scroll |
| `/about` | `src/pages/AboutPage.tsx`, who builds Virgo (ARM Technologies) and the three ideas behind it |
| `/privacy` | `src/pages/PrivacyPage.tsx`, **draft** placeholder text |
| `/terms` | `src/pages/TermsPage.tsx`, **draft** placeholder text |
| `*` | `src/pages/NotFoundPage.tsx` |

Homepage order and anchors: see "Homepage structure" below.

## Structure

```
src/
  index.css   DESIGN TOKENS (:root custom properties) + .pill button classes
  lib/        motion.ts (anime.js primitives), supabase.ts
  components/ home/ virgo/ legal/ layout/
  pages/
public/       robots.txt, sitemap.xml
supabase/     migrations/ (signup table), functions/notify-whatsapp
docs/         virgo-website-content-plan.md
```

## Design system

Light theme, "Sunrise": warm off-white ground (`--ground`), deep navy ink and
buttons (`--ink`), coral accent (`--primary`), peach and sky as the soft pair (`--pop`,
`--sky`). **Font (owner chose Poppins everywhere, option A, 2026-11-06):** every font on the site is Poppins; headings semibold (600), answers and small headings medium (500), body regular (400); there are no serif or monospace fonts. Poppins is wider than the old Newsreader, so display sizes were scaled down by about 12%. Other pairings were compared in `docs/mockups/fonts/`.
**Never hardcode a colour in a component**: every colour is a CSS custom property
in `src/index.css`. An interim `.font-display { font-weight: 400 !important }` in
`index.css` overrides old inline extra-bold weights; remove it once every section is
restyled. Animation
goes through `src/lib/motion.ts` and must respect `prefers-reduced-motion`.

## Supabase

The contact form inserts into the table `vzir_pilot_signups`. The name is a
leftover from the product's old name and is kept on purpose because the table holds
live rows. Do not rename the table or its migration without migrating the data and
updating the one `.from(...)` call in `VirgoPilotCTA.tsx`. Do not change the form
logic when only changing its text.

## Environment variable names

- Site: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (see `.env.example`)
- `notify-whatsapp` edge function secrets: `WHATSAPP_TOKEN`, `PHONE_NUMBER_ID`,
  `WHATSAPP_NOTIFY_NUMBER`, `ENQUIRY_WEBHOOK_SECRET`, `WHATSAPP_TEMPLATE_NAME`,
  `WHATSAPP_TEMPLATE_LANG`

Never commit values. `.env` is gitignored.

## Run

```bash
npm install
npm run dev         # http://localhost:5173
npm run build
npm run typecheck
npm run lint
```

## Deploy

AWS Amplify, using `amplify.yml` (`npm ci`, `npm run build`, output `dist`). The SPA
rewrite to `/index.html` (type 200) is required, or `/privacy` and `/terms` will 404
on direct load. Details in README.

## Reference: systems competitors list (research, checked 2026-10-24)

For ideas only. Do not copy their wording or claims. Virgo stays read-only.

**Virgo's own integration categories** (aligned with `virgo.pdf` §6; the homepage
"Integrations" section that listed them was removed on 2026-10-26 and is in git history): Property
management (Cloudbeds, Mews, Guestline, SiteMinder, Opera) · Accounting (Xero,
QuickBooks) · Channels and OTAs (through the PMS or channel manager) · Guest messaging
(WhatsApp Business) · Reviews (Google Business Profile, more later; in progress) ·
Staff rotas (Rotaready, Planday, Deputy) · Outside conditions (weather, local events,
competitor rates; in progress) · plus a "Using something else?" card. Tills, payroll
and payment providers were removed as out of scope.

**otelai.com** (hotel operations AI, closest match to Virgo): names **no** specific
systems on its homepage. It only claims "100+ hotel systems connected, including
legacy", "nothing migrates, nothing gets replaced, even the ones with no API". Its
proof is customer stories, results stats, security certifications and a team section,
none of which Virgo has yet. Unlike Virgo it also drafts and runs approved actions
(for example rate actions), so it is not read-only.

**alveni.ai** (confirmed by the owner as the "Alven AI" they meant): a different product, an
AI phone and guest-messaging assistant for hotels, mainly DACH region. Names about 20
integrations: PMS (Mews, SIHOT, Shiji, 3RPMS, apaleo, aleno) · Booking and revenue
(HotelPartner, Hotel Net Solutions, DIRS21, simpleBooking, CampNerd) · Guest
messaging and reviews (Hotel MSSNGR, Tripadvisor, Google Maps, Booking.com, Expedia) ·
Other (hotelkit, dailypoint). Channels: phone, email, website chat, WhatsApp,
Instagram, Facebook Messenger. Pricing tiers shown on the page.

**Takeaways:** (1) Naming real systems builds trust; otelai does not, so naming them is
a chance to stand out. (2) Group them by category, as Virgo's section does. (3) Alveni
shows PMS names that Virgo does not list yet (apaleo, SIHOT). (4) Only claim a system
as connected once it is, or label it "In progress" / "Roadmap". Status today per the
content plan: Cloudbeds, Xero and WhatsApp live, Reviews in progress.

## Homepage structure

Order in `src/pages/HomePage.tsx`:
1. `Hero`: a greeting that follows the visitor's own clock ("Good morning." 05:00–11:59, "Good afternoon." 12:00–16:59, "Good evening." otherwise; it updates if the page stays open), then "Talk to your hotel like you talk to your team." on one line below it (wraps only on narrower screens). Both lines share one modest size and colour, like the earlier "Good morning. / Here's your hotel." (owner, 2026-11-06: no oversized text, no coral highlight). The card label is just "Try asking" (no hotel name); answers keep their "Sample data" tag. (from the owner's reference image, 2026-11-04). A real photo of a hotel lobby fills the whole hero (`public/images/hero-lobby.jpg`, 2000px, and `hero-lobby-1000.jpg` for phones). Source: Unsplash, photo by Frames For Your Heart (unsplash.com/photos/zSG-kd-L6vw), Unsplash License: free for commercial use, no credit required. A light veil (`--veil-*` tokens) is strong behind the text on the left and clear on the right; text and card sit low in the frame. Chosen 2026-11-04 from `docs/mockups/hero-photo-2-lobby.html` after the owner rejected drawn backgrounds ("I need a realistic image", not 3D). Never use photos that show a real hotel's name or a 3D render. The section is pulled up under the navbar, which is transparent until you scroll. Left: the headline, "Ask one question instead of logging into the PMS, the accounts and the guest inbox.", Book a demo and a "See how it works" link. Right: a "Try asking The Meridian, a sample hotel" card that runs on its own (no clicking): a question types itself into the box, its suggestion chip lights, the answer appears with source tags and "Sample data", then the next one. Four questions, using the same sample figures as the rest of the page. Footer line "Read-only on your systems." (not "never changes", per the owner's no-negatives rule).
2. `VirgoIntro` (`#virgo`): what Virgo is. A data constellation plays when it comes into view, on every page load or refresh (about 9 seconds, no Replay button): points drift, gather into nine clusters labelled with the system categories, pour into the centre, then burst out and spread onto four thin concentric rings before fading, leaving the Virgo orb and name at the centre. The nine systems then fly back in as icon chips and keep orbiting Virgo, on four rings (1: PMS, Operations; 2: Guest messaging, Channel manager; 3: Reviews, RMS; 4: Staff rota, Outside conditions, Inventory; owner's change 2026-11-06: Accounting replaced by Operations on this screen, RMS and Inventory added), each ring turning at its own speed and direction (icons only on phones). The drawing loop pauses while the section is off screen. Beside it, the statement "Virgo is the decision layer for your hotel…". Below, "Five things it takes off your plate.": five capability cards (Ask anything, Your morning ready, Told in time, Explains why, Guests handled), each line word for word from `virgo.pdf` §2 "What it needs to achieve". The cards rise in one by one, then a spotlight moves across them every 4.2 seconds: the lit card's icon acts (bubble pops, sun rises, bell rings, trend draws, people hop), its example question types itself, then the card turns over to show a sample answer with sources and turns back; hovering turns a card too. Then badges: Read-only · Every figure sourced · Your data isn't kept · One switch stops guest messages. Orbit rings are at 58% / 72% / 86% / 100% so chips clear the Virgo name. Chosen from the "Virgo Constellation" mockup; it replaced the old problem section and the "Meet Virgo" capability tour.
3. `ProductTour` (`#product`): **Lightened 2026-11-06** (pastel bars `--bar-soft/now/low`, very light washes `--*-soft`, thin severity borders, light count pills; the intro paragraph beside "Inside Virgo." was removed as redundant). **Restyled 2026-11-06** (owner: "hairy and clumsy", wanted site colours, red for danger, a detailed chart, bigger details): briefing has a one-line greeting ("Good morning, Sarah. You're at 82% tonight, and three things need you today."), four tinted KPI cards (sky occupancy, mint RevPAR, amber OTA share, coral revenue) with icons and up/warn chips, a pacing chart with values on every bar, 25% gridlines, day+date labels, tonight in coral, nights under 60% in amber, weekend bands and last year as a line with points, and "Needs you today" cards coloured by severity (red urgent room 214 with due time, amber cancellations, steel guests). Red (`--danger`) marks danger everywhere (urgent, Needs a person, the inbox count). Typewriter-font labels replaced by the body font. Original description follows: "Inside Virgo." with the line from `virgo.pdf` §2 ("Virgo sits above the systems a hotel already runs…"). A full-width 44-second product demo that plays like a screen recording on a loop, in an app window modelled on the real product (PMS-MCP frontend); no chapter list beside it. A cursor labelled "Sarah · General manager" works it, and every line of content comes from `virgo.pdf`: (1) Briefing for the GM's view (§4): Occupancy, RevPAR, OTA against direct, Revenue (Accounting); "Needs you today" = room 214 not ready before Ms Patel's 14:00 arrival (UC-2, plus a "Heads up" warning), Saturday cancellations 3× normal through one channel with expected occupancy (UC-4), slow check-in raised 4 times across messages and reviews (UC-17). (2) Ask Virgo: UC-6 "Why is revenue down this week when occupancy hasn't moved?", one answer with figures, sources and period, plus "Competitor rates aren't connected" (§3). (3) Guest inbox (§5.4): welcome at check-in (UC-13), breakfast answered from the hotel's notes (UC-14), heating complaint sent to the duty manager and logged for the owner (UC-15, R7, R8), thank-you and review request at checkout (UC-18), ending on the Auto-replies stop switch (R9). Twice Virgo drafts an email to the team that can fix the problem (to the head housekeeper for room 214, to the maintenance lead for the room 312 heating) and the manager presses Send; Virgo drafts, the manager sends, nothing is written into the PMS or any connected system (R1). This is UC-19, UC-20 and R10 in `docs/virgo-requirements-addendum.md` (added 2026-10-26); confirm the product ships them before launch. Loop is 44 seconds. Pauses off screen; still frame under reduced motion. All sample data. Replaced Before/After.
(Removed 2026-11-06) `AskExamples` (`#examples`): "Ask it anything / Real questions, real answers." This is the old first screen ("the answer is the headline", option A1), moved here when the sunrise hero took the top. Nine sample questions from `virgo.pdf` use cases, asked only by the four users (never front desk); a new one fades in every 4 seconds; hover pauses; nothing clickable. Every figure is underlined and footnoted to its source by category (PMS, Accounting, Channel manager, Guest messaging, Staff rota), never by vendor. Ends with the "Ask your hotel anything" line, Book a demo and "Read-only on your systems".
4. `LogoRunner`: a band of PMS logos scrolling continuously (36 s loop, pauses on hover, still and wrapped under reduced motion), no heading or wording at the owner's request: Cloudbeds, Mews, Guestline, Rezcontrol, eviivo, Little Hotelier, Oracle OPERA (Oracle wordmark from oracle.com plus "OPERA"). Logo files in `public/images/pms/`, taken from each brand's own website; Rezcontrol's white wordmark recoloured dark for the light page. Guestline and Little Hotelier are text placeholders until official files are supplied. Check each brand's logo-use guidelines before launch.
5. `HowVirgoWorks` (`#how-it-works`): "How Virgo works." A light bento of five tiles that fits one laptop screen (owner, 2026-11-06: light tints, saffron only as an accent, plain language a GM or owner understands, no abstract points like "nothing is kept"). Tiles: Works with the systems you already run (systems pulse into a Read-only Virgo orb) · Your morning, ready at 7am (82% / 12 arrivals / 3 need you) · Every number shows its source (£47,200¹ with its PMS source) · Problems reach the right team first (red dot "Room 214 isn't ready" → "Housekeeping told") · Guests answered, day and night (breakfast question answered; complaints to the duty manager; one switch). Tints are `--tint-blue/peach/sand/mint`. Tiles rise in on view and lift on hover. Chosen from `docs/mockups/how-1-bento-light.html`.
5b. `Faq` (`#faq`): "Questions hotels ask." Seven questions a GM or owner asks before a demo, answered only from `virgo.pdf` (read-only, which systems, no training, data, guest replies, sources, getting started). No pricing, data location, certifications or timelines until they are facts. Native `<details>`, first one open.
6. `VirgoPilotCTA` (`#pilot`): "Let's talk." on the page colour, text on the left and the form card on the right (stacked on phones); form logic unchanged. The dark fluid band it used to sit in was removed (2026-10-26) and `FluidBackdrop` / `lib/fluid` deleted.

**Footer:** kept simple: a plain links band on the page colour, nothing decorative. The owner rejected the watermark, footer-reveal, arrivals-board and big-caption ideas (2026-11-06) and will revisit the footer later; the mockups are in `docs/mockups/footer*`; tagline "Talk to your hotel like you talk to your team."; links include FAQ. Navbar: Virgo mark, links Product (`/#virgo`), Inside Virgo (`/#product`), How it works (`/#how-it-works`) and About (`/about`), and Book a demo; on phones the links open in a simple panel. The dropdown multi-page menu is deferred (owner, 2026-11-06; mockup in `docs/mockups/menu/`).

**Look and scroll (owner's direction, 2026-10-26):** all light, one colour, clean and professional. Sections are full-width bands separated by hairlines, not rounded cards or framed boxes (the constellation has no frame, How Virgo works is a full-width peach band, the footer is a plain band). Plain native scrolling only: the owner rejected a scroll-driven version (pinned sections, sideways card rails, scroll-scrubbed animation, very large type) as too much and too big, especially on phones. Keep motion to what each section already does on its own; do not add scroll effects. The page always opens on the hero; menu links scroll to a section without leaving `#section` in the address (`layout/ScrollToTop.tsx`).

**Rejected redesign (do not redo as-is).** A layout inspired by otelai.com was built and
then reverted at the owner's request. It added promise cards, a capability bento grid,
a "who it's for" section, a dark read-only band and an FAQ, and removed the pinned
tour. The owner disliked the overall look and colours, the new sections, found it too
plain next to otelai, and missed parts of the earlier design. It is still in git
history (commit `2aada9c`) if any piece is wanted back. Any new redesign must start by
asking what look the owner does want, ideally with a reference.

Constraints for any redesign: take layout ideas only, never otelai's wording or
branding; Virgo is strictly read-only whereas otelai takes approved actions, so never
borrow "automation" or rate-action sections; no stats, case studies, certifications or
quotes until real ones exist.

Tailwind note: classes in `@layer components` are purged unless written out in full in the source; never build class names from pieces (e.g. `vi-${x}`).

Still open: pricing (none shown), real security facts (no badges), a real booking link
for "Book a demo" (scrolls to the form), favicon and a real `og:image`, and whether the systems list (now off the homepage) should
come back somewhere, with live / in-progress / roadmap labels.

## Site expansion (owner, 2026-11-06)

The product is still in development, but the website must look full-fledged because clients will browse it. Plan: a multi-page site with a dropdown menu (Product, Solutions, Integrations, Resources, Company, Book a demo), about 14 pages written from `virgo.pdf`. Rules: integrations are worded "Built to read from" with **no Live / In progress labels** (clients can be told the exact position in the demo); no "live now", customer counts, results or certifications; every figure marked Sample data. **Data location (owner confirmed): everything Virgo stores is kept in the UK.** Word it accurately: Virgo keeps no copy of bookings or accounts (R2); what it does store is settings, logins and message records, and those are kept in the UK. Do not add GDPR or certification wording until the owner supplies it. Mockups: `docs/mockups/menu/`.

## Seamless page (owner's choice, 2026-11-06)

The site reads as one continuous surface, not a stack of boxes: homepage sections and the footer are transparent over the drifting `--wash` colour (`ScrollColorWash`, stops tuned to the current sections), there are no lines between sections, the hero photo fades into the page at its bottom edge, and the main blocks fade up softly as they arrive (`src/components/layout/ScrollReveal.tsx`, CSS block "Seamless page" in `index.css`). Normal scrolling is untouched. Chosen over two other trial versions, Glide (inertia scrolling) and Depth (parallax), which were removed.
