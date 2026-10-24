# Virgo website

The marketing site for **Virgo**, the AI hotel intelligence platform, live at
**askvirgo.co.uk**. Virgo connects a hotel's PMS, accounting and guest messaging
and answers questions about the hotel in plain English.

This repo is the **website only**. It is not the Virgo product.

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · React Router · anime.js v4 · Supabase

## Pages

| Route | Page |
|---|---|
| `/` | Home: one continuous scroll (hero, promises, product, problem, before/after, capabilities, integrations, who it's for, read-only, how it works, FAQ, contact form) |
| `/privacy` | Privacy policy. **Draft** placeholder text, with a visible Draft banner |
| `/terms` | Terms of use. **Draft** placeholder text, with a visible Draft banner |
| `*` | 404 page |

## Running it

```bash
npm install
cp .env.example .env.local   # then fill in the two values
npm run dev                  # http://localhost:5173
```

| Script | Does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |

### Environment variables

Names only; see `.env.example`.

| Variable | Used by |
|---|---|
| `VITE_SUPABASE_URL` | Site (contact form) |
| `VITE_SUPABASE_ANON_KEY` | Site (contact form) |

Without them the site still runs, but the contact form cannot save anything. It
fails fast and tells the visitor to email instead, and `src/lib/supabase.ts` logs
a console error naming the missing variables.

The `notify-whatsapp` edge function has its own secrets, set in Supabase and never
in the site build. See [Enquiry notifications](#enquiry-notifications).

## Deploying to AWS Amplify

`amplify.yml` in the repo root tells Amplify how to build: `npm ci`, then
`npm run build`, publishing `dist/`.

1. In Amplify, connect this repo and pick the branch to deploy.
2. Under **Environment variables**, add `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY`. Vite bakes them in at build time, so redeploy after
   changing them.
3. Add the custom domain `askvirgo.co.uk` under **Domain management**.

### SPA rewrite (required)

This is a single-page app: `/privacy`, `/terms` and any other path only exist in
the browser's router. Without a rewrite, loading them directly (or refreshing)
returns a 404 from the host. In Amplify go to **Rewrites and redirects** and add:

| Source address | Target address | Type |
|---|---|---|
| `</^[^.]+$\|\.(?!(css\|gif\|ico\|jpg\|js\|png\|txt\|svg\|woff\|woff2\|ttf\|map\|json\|webp\|xml)$)([^.]+$)/>` | `/index.html` | `200 (Rewrite)` |

It must be type **200 (Rewrite)**, not a 301/302 redirect. Static files
(`robots.txt`, `sitemap.xml`, assets) are excluded so they are still served as-is.

## Enquiry notifications

The contact form inserts a row into the Supabase table `vzir_pilot_signups`. A
Supabase database webhook then fires the `notify-whatsapp` edge function, which
sends the enquiry to a WhatsApp number. The form itself is not involved: if the
send fails, the row is already saved.

The Meta access token never goes near the React bundle. Anything shipped to the
browser is readable by every visitor, so it lives in edge function secrets.

**1. Deploy the function**

```bash
supabase functions deploy notify-whatsapp
```

**2. Set its secrets** (Supabase dashboard → Edge Functions → Secrets)

| Secret | What it is |
|---|---|
| `WHATSAPP_TOKEN` | Meta access token |
| `PHONE_NUMBER_ID` | Meta phone number ID (the sending number) |
| `WHATSAPP_NOTIFY_NUMBER` | Where alerts go, not the visitor's number |
| `ENQUIRY_WEBHOOK_SECRET` | Any long random string you invent |
| `WHATSAPP_TEMPLATE_NAME` | Optional, but see the 24-hour note below |
| `WHATSAPP_TEMPLATE_LANG` | Optional, defaults to `en` |

**3. Create the webhook** (Supabase dashboard → Database → Webhooks)

Table `vzir_pilot_signups`, event `INSERT`, type "Supabase Edge Functions",
pointing at `notify-whatsapp`. Add one HTTP header:

```
x-webhook-secret: <the ENQUIRY_WEBHOOK_SECRET value>
```

This is configured in the dashboard rather than as a migration on purpose: a
migration is tracked in git, and the secret and project URL would be committed.
Without the header the function returns 401.

**The 24-hour window.** Meta only delivers a plain text message inside a 24-hour
window that opens when the receiving number last messaged the sending number.
Outside it the send fails with error `131047`. Plain text is fine for testing; for
real use, get a one-parameter template approved in Meta Business Manager and set
`WHATSAPP_TEMPLATE_NAME`.

## Structure

```
src/
  index.css              Design tokens (:root custom properties) and .pill button classes
  App.tsx                Routes
  lib/
    motion.ts            anime.js primitives
    fluid/renderer.ts    WebGL fluid backdrop
    supabase.ts          Supabase client
  components/
    home/                Homepage sections and visual effects
    virgo/               Problem, how it works, contact form
    legal/               Shared layout for the draft legal pages
    layout/              Navbar, Footer, ScrollToTop
  pages/                 HomePage, PrivacyPage, TermsPage, NotFoundPage
public/                  robots.txt, sitemap.xml
supabase/
  migrations/            SQL for the signup table
  functions/             notify-whatsapp edge function
docs/                    Content plan
```

## Design system

A light theme, "Electric Violet on Porcelain": porcelain ground, large Bricolage
Grotesque headlines, pill buttons, one dark contrast band.

**Never hardcode a colour in a component.** Every colour is a CSS custom property
in `src/index.css`, so re-theming is a change to that one block.

Animation runs through `src/lib/motion.ts`, and every primitive respects
`prefers-reduced-motion`.

## Brand and copy rules

- The site is about the **product, Virgo**. No parent-company branding anywhere.
  The single exception is the legal line in the footer.
- **Virgo never writes to a connected system.** No rate changes, no reservation
  edits, no bookings. The only write surface is guardrailed WhatsApp guest replies.
  Copy must say Virgo *recommends* or *surfaces*, never "adjusts" or "applies".
- No invented numbers: no "saves X hours", no customer or revenue claims. Figures
  inside product mockups are sample data and are labelled as such.
- Do not mention hosting, tooling or AI vendors on the site.

## A note on the name `vzir`

The product was previously called Vzir. The Supabase table `vzir_pilot_signups`
and its migration keep that name on purpose, because the table holds live rows and
renaming it would break the form. Visitors never see it.

Before launch, replace the draft text on `/privacy` and `/terms` and remove the
Draft banner (`src/components/legal/LegalLayout.tsx`).
