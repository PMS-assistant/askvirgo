# CLAUDE.md — ARM Technologies website (armtechnologies.ltd)

This is the marketing website for A.R.M Technologies — React + TypeScript +
Vite, Tailwind, Supabase, deployed as armtechnologies.ltd. It markets three
things: **Virgo** (flagship, in development), **The Gig Search** (live
product), and **Consulting** (service).

**Naming note:** the flagship product was renamed from "Vzir" to "Virgo" in
this repo (components, copy, routes, the WhatsApp bot's system prompt in
`backend/main.py`). One exception: the Supabase table that stores pilot
signups is still named `vzir_pilot_signups` — it was left as-is since it's
a live table (see `src/components/virgo/VirgoPilotCTA.tsx`). If it's ever
renamed in Supabase, update that one `.from(...)` call to match.

This repo is separate from and unrelated in code to the actual product
backend — it lives at `/Users/sreenathreddy/Documents/PMS-MCP/backend/`.
Nothing here imports or depends on that repo; the connection is only that
this site's copy makes claims about what the product does, which must stay
accurate against what's actually built there. **That backend repo still
uses the old "Vzir" naming throughout** (file names, docs, BRD) — it has
not been renamed. Until it is, treat "Vzir" (in that other repo) and
"Virgo" (this site) as the same product under two names, and don't assume
the file paths below have been updated.

## Before editing any Virgo-related copy

Read **`docs/vzir-website-content-plan.md`** first (filename kept as-is —
it's a dated historical audit, not live copy). It documents specific places
where this site's copy used to overclaim — most importantly a line implying
the product writes rate changes to a hotel's PMS, when the product's actual
absolute rule is read-only on every connector except WhatsApp guest replies
— plus a full audit of which "connected data sources" are real (PMS, Xero,
WhatsApp, Reviews) vs. not built at all (Flights, live Events, Competitor
rates, "Trends"). Those fixes have been applied; the doc is kept for context
on *why*, not as a live to-do list.

If any claim ever needs re-verifying against the current state of the
product, the real source of truth is in the backend repo, not here (paths
below use that repo's original "Vzir" naming, since it hasn't been renamed):

- `/Users/sreenathreddy/Documents/PMS-MCP/vzir-docs/VZIR_BRD.md` — product vision, connector registry, functional requirements
- `/Users/sreenathreddy/Documents/PMS-MCP/backend/docs/TRD.md` — technical architecture decisions
- `/Users/sreenathreddy/Documents/PMS-MCP/backend/docs/PROGRESS.md` — what's actually live vs. mocked vs. planned right now
- `/Users/sreenathreddy/Documents/PMS-MCP/backend/CLAUDE.md` — absolute constraints (read-only everywhere except WhatsApp, no operational data ever persisted, etc.)

**The core rule to never contradict in marketing copy:** Virgo never writes
to any connected system — no rate changes, no reservation edits, no
bookings. The only write surface in the entire product is scoped,
guardrailed WhatsApp guest replies. Any copy implying Virgo "adjusts,"
"applies," or "updates" something in a connected system (PMS, OTA,
accounting) is wrong and must say it *recommends* or *surfaces* instead.

## Structure

```
src/
  index.css   — DESIGN TOKENS live here (:root custom properties) + .pill button classes
  lib/
    motion.ts — anime.js primitives: useReveal, useStaggerReveal, useScrollScrub,
                useCursorGlow, useMountAnimation, prefersReducedMotion
  components/
    home/     — AnnouncementBanner, Hero, DashboardShot, ConnectsStrip, BentoFeatures, ArmBand
    virgo/    — VirgoProblem, VirgoAIChat, VirgoWhatsApp, VirgoHowItWorks, VirgoPilotCTA
    layout/   — Navbar (sticky), Footer, ScrollToTop
  pages/      — HomePage (/, one continuous scroll), CompanyPage (/company),
                GigSearchPage (/thegigsearch), ConsultingPage (/consulting)
```

`/vzir` redirects to `/` (old route, kept for any existing links/bookmarks).

## Design system

The site is a **light theme** ("Electric Violet on Porcelain") modelled on
semrush.com: porcelain ground, huge Bricolage Grotesque headlines, pill
buttons, a bento feature grid, and one dark contrast band (`ArmBand`).

**Never hardcode a colour in a component.** Every colour is a CSS custom
property in `src/index.css` (`--ground`, `--ink`, `--primary`, `--pop`,
`--amber`, `--mint`, …) — a re-theme should be a change to that one block.
The only deliberate exception is `WhatsAppWidget` and the phone mockup inside
`VirgoWhatsApp`, which keep WhatsApp's own dark green/charcoal palette because
they're imitating that product's real UI.

Animation is anime.js v4 via `src/lib/motion.ts` (framer-motion was removed).
All primitives respect `prefers-reduced-motion`: reveals collapse to instant
so content still lands, decorative motion is skipped entirely.

## Run

```bash
npm run dev        # local dev server
npm run build       # production build
npm run typecheck   # tsc --noEmit
npm run lint         # eslint
```
