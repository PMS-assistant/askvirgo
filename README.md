# A.R.M Technologies website

The marketing site for A.R.M Technologies, live at **armtechnologies.ltd**.

It markets three things:

| | What it is | Status |
|---|---|---|
| **Virgo** | AI hotel intelligence platform. Connects a hotel's PMS, accounting and guest messaging, and answers questions in plain English. | In development, onboarding first pilot hotels |
| **The Gig Search** | Hospitality staffing marketplace | Live at [thegigsearch.com](https://www.thegigsearch.com) |
| **Consulting** | Advisory for other founders | Ongoing |

This repo is the **website only**. It is not the Virgo product itself.

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · React Router · anime.js v4 · Supabase

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script | Does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |

### Environment

Create `.env.local` in the project root:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Without them the app still runs, but the pilot signup form cannot save anything —
it fails fast and tells the visitor to email instead. `src/lib/supabase.ts` logs a
console error naming the missing variables, so a misconfigured deploy is visible
rather than silently dropping every signup.

Set the same two variables in the hosting provider's environment settings.

## Enquiry notifications

A signup that only lands in a database table is a signup nobody reads. A Supabase
database webhook fires the `notify-whatsapp` edge function on every insert into
`vzir_pilot_signups`, which sends the enquiry to A.R.M's WhatsApp number.

The form itself is not involved: it inserts a row and finishes. Nothing about
notification can cost you a signup — if the WhatsApp send fails, the row is
already committed and the enquiry is still in the table.

The Meta access token can send messages as A.R.M, so it never goes near the React
bundle — anything shipped to the browser is readable by every visitor. It lives in
edge function secrets, which is the whole reason this runs server-side.

**1. Deploy the function**

```bash
supabase functions deploy notify-whatsapp
```

**2. Set its secrets** (Supabase dashboard → Edge Functions → Secrets)

| Secret | What it is |
|---|---|
| `WHATSAPP_TOKEN` | Meta access token |
| `PHONE_NUMBER_ID` | Meta phone number ID (the sending number) |
| `WHATSAPP_NOTIFY_NUMBER` | Where alerts go — A.R.M's number, not the visitor's |
| `ENQUIRY_WEBHOOK_SECRET` | Any long random string you invent |
| `WHATSAPP_TEMPLATE_NAME` | Optional, but see the 24-hour note below |
| `WHATSAPP_TEMPLATE_LANG` | Optional, defaults to `en` |

The first three are the same values the WhatsApp bot already uses.

**3. Create the webhook** (Supabase dashboard → Database → Webhooks)

Table `vzir_pilot_signups`, event `INSERT`, type "Supabase Edge Functions",
pointing at `notify-whatsapp`. Add one HTTP header:

```
x-webhook-secret: <the ENQUIRY_WEBHOOK_SECRET value>
```

This is configured in the dashboard rather than as a migration on purpose — a
migration is tracked in git, and both the secret and the project URL would end up
committed.

Without that header the function returns 401. Its URL is otherwise a public
"send a WhatsApp as A.R.M" button.

**The 24-hour window.** Meta only delivers a plain text message inside a 24-hour
window that opens when the receiving number last messaged your business number.
For an alert arriving at 3pm on a quiet Tuesday that window is usually shut, and
the send fails with error `131047`. Plain text is therefore fine for testing but
not for running on. Get a simple one-parameter template approved in Meta Business
Manager and set `WHATSAPP_TEMPLATE_NAME` — templates have no window and always
deliver.

## Structure

```
src/
  index.css              Design tokens (:root custom properties) and .pill button classes
  App.tsx                Routes
  lib/
    motion.ts            anime.js primitives: useReveal, useStaggerReveal,
                         useScrollScrub, useCursorGlow, prefersReducedMotion
    supabase.ts          Supabase client
  components/
    home/                Homepage sections, in page order
    virgo/               Virgo-specific sections (problem, how it works, pilot form)
    layout/              Navbar, Footer, ScrollToTop
  pages/                 HomePage, CompanyPage, GigSearchPage, ConsultingPage
supabase/
  migrations/            SQL for the pilot signup table
  functions/             Edge functions (notify-whatsapp: enquiry → WhatsApp)
docs/                    Copy audits and content planning
```

Routes: `/` · `/company` · `/thegigsearch` · `/consulting`. `/vzir` redirects to
`/` for old bookmarks.

## Design system

A light theme, "Electric Violet on Porcelain": porcelain ground, large Bricolage
Grotesque headlines, pill buttons, a bento feature grid and one dark contrast band.

**Never hardcode a colour in a component.** Every colour is a CSS custom property
in `src/index.css` (`--ground`, `--ink`, `--primary`, `--pop`, `--amber`, `--mint`,
`--danger`…), so re-theming is a change to that one block.

Animation runs through `src/lib/motion.ts`. Every primitive respects
`prefers-reduced-motion`: reveals collapse to instant so content still lands, and
purely decorative motion is skipped.

## The WhatsApp bot

A.R.M's WhatsApp bot used to live in this repo under `backend/`. Nothing in the
site ever called it, so it now has its own project at `../arm-whatsapp-bot`. This
repo is the website and nothing else.

## A note on the name

The flagship product was renamed from **Vzir** to **Virgo**. A few "vzir" names
survive on purpose, because renaming them would break live things:

- the Supabase table `vzir_pilot_signups`, which holds real signups
- its migration file in `supabase/migrations/`
- `/vzir`, which redirects to `/`
- `docs/vzir-website-content-plan.md`, a dated historical audit

Everything a visitor can see says Virgo.

## Writing copy for this site

Read `CLAUDE.md` before editing anything about Virgo. The short version:
**Virgo never writes to a connected system.** No rate changes, no reservation
edits, no bookings. The only write surface in the product is guardrailed WhatsApp
guest replies. Any copy implying Virgo "adjusts", "applies" or "updates" something
is wrong and must say it *recommends* or *surfaces* instead.
