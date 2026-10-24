# CLAUDE.md — Virgo website (askvirgo.co.uk)

Marketing website for **Virgo**, an AI hotel intelligence platform. React +
TypeScript + Vite, Tailwind, Supabase. Deployed on AWS Amplify (see README).
This repo is the website only, not the product.

## Brand rules

- Product only. The site says Virgo and nothing about a parent company.
- **One exception:** the footer legal line, "Virgo is a product of ARM
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

## Pages

| Route | File |
|---|---|
| `/` | `src/pages/HomePage.tsx`, one continuous scroll |
| `/privacy` | `src/pages/PrivacyPage.tsx`, **draft** placeholder text |
| `/terms` | `src/pages/TermsPage.tsx`, **draft** placeholder text |
| `*` | `src/pages/NotFoundPage.tsx` |

Homepage order and anchors: see "Homepage structure" below.

## Structure

```
src/
  index.css   DESIGN TOKENS (:root custom properties) + .pill button classes
  lib/        motion.ts (anime.js primitives), fluid/renderer.ts, supabase.ts
  components/ home/ virgo/ legal/ layout/
  pages/
public/       robots.txt, sitemap.xml
supabase/     migrations/ (signup table), functions/notify-whatsapp
docs/         virgo-website-content-plan.md
```

## Design system

Light theme, "Electric Violet on Porcelain". **Never hardcode a colour in a
component**: every colour is a CSS custom property in `src/index.css`. Animation
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

**Virgo's own integration categories** (the homepage "Integrations" section,
`src/components/home/Integrations.tsx`): Booking systems (Cloudbeds, Mews, Guestline,
Rezcontrol, eviivo, Little Hotelier) · Accounting (Xero, QuickBooks, Sage, FreeAgent) ·
Guest messaging (WhatsApp Business) · Reviews (Google, TripAdvisor) · Staff rotas
(Rotaready, Planday, Deputy) · Channel managers (SiteMinder) · Restaurant and bar tills
(Zonal, Lightspeed, Square, Access EPoS) · Payroll, payments and pricing (Sage Payroll,
BrightPay, Stripe, Adyen, RoomPriceGenie, Lighthouse).

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
1. `Hero`
2. `VirgoProblem`, then `BeforeAfter`
3. `CapabilityScroller` (`#virgo`): "Meet Virgo" tilt panel plus the pinned capability tour
4. `Integrations` (`#integrations`): eight system categories
5. `VirgoHowItWorks` (`#how-it-works`)
6. `VirgoPilotCTA` (`#pilot`): contact form, logic unchanged

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

Still open: pricing (none shown), real security facts (no badges), a real booking link
for "Book a demo" (scrolls to the form), favicon and a real `og:image`, and whether
Integrations needs live / in-progress / roadmap labels on every system (only Reviews
is labelled today).
