# Vzir Website Content Plan

Source: current live copy on `armtechnologies.ltd` (`/` and `/vzir`, pulled 2026-08-09) checked against `VZIR_BRD.md`, `docs/TRD.md`, and `docs/PROGRESS.md` in the PMS-MCP backend repo (`/Users/sreenathreddy/Documents/PMS-MCP/backend/`) — i.e. what's actually built vs. what this site currently claims.

---

## 1. Fix these before shipping anything else

These aren't copy nitpicks — two of them claim things the architecture explicitly forbids or that don't exist yet.

### 1a. "Rates adjusted automatically" — contradicts the core product rule
Homepage `/vzir` Proactive Intelligence section says the festival-pricing alert results in **"→ Rates adjusted automatically."** This is a PMS **write**. The absolute constraint in this product (backend `CLAUDE.md` #1, BRD §9) is: *no connector is ever written to — the only write surface in the whole product is WhatsApp guest replies.* Vzir cannot and will not change a rate in the PMS. Say it recommends; never say it acts.

**Fix:** `→ Rates adjusted automatically` → `→ Rate increase recommended, one click to apply in your PMS` (or just cut the arrow line — "recommended +22%" already lands the point without implying a write).

**File:** `src/components/vzir/VzirProactiveAlerts.tsx`

### 1b. Flights / Events / Weather / Competitors / Trends are not real connectors yet
The BRD's connector registry (§3, §6) and `PROGRESS.md`'s adapter list cover exactly: **PMS** (Cloudbeds live, Mews planned), **Accounting** (Xero live, QuickBooks mock), **Reviews** (Google + TripAdvisor, both mock pending API approval), **Rota** (Rotaready, mock), **WhatsApp** (live). Weather (Open-Meteo) is on the roadmap (backend `CLAUDE.md` build order) but not built. **Flights, live Events, Competitor rates, and "Trends" appear nowhere in the BRD, TRD, or PROGRESS — there's no adapter, no data source, no design for them.** The whole "10 data sources," the festival/flight/weather alert cards, and "Querying: Events / Competitors" in the live-demo mockup are describing a product that doesn't exist yet.

**Fix — pick one:**
- Relabel the section **"Roadmap"** / **"Where Vzir is going"** instead of presenting it as live capability, or
- Cut Flights/Events/Competitors/Trends from the "connected now" list entirely and keep only what's real: PMS, Accounting, Reviews, WhatsApp, (Weather — roadmap).

**Files:** `src/components/vzir/VzirDataSources.tsx`, `src/components/vzir/VzirProactiveAlerts.tsx`, `src/components/home/VzirSection.tsx` / `ProductShowcase.tsx` (the `Querying: Events / Competitors` line in the live-demo mockup)

### 1c. Pilot length is inconsistent
Homepage says **"90-day"** free pilot; the `/vzir` page says **"60-day pilot"** in three places. Pick one number sitewide.

**Files:** `src/components/home/CTASection.tsx` (and/or `Hero.tsx` stats bar), `src/components/vzir/VzirPilotCTA.tsx`

### 1d. Full-journey WhatsApp automation overstates what's live
`PROGRESS.md` (2026-07-31) confirms outbound sends are live-verified — but also flags that **the shared WhatsApp number is currently owned by ARM's own website chatbot's webhook**, so Vzir's inbound guest-reply handling is silently unreachable right now. The "Pre-Arrival → Check-In → In-Stay → Departure+Review" journey graphic implies a fully working two-way flow. Until Vzir has its own dedicated WhatsApp number, don't imply guest replies are live in production — outbound lifecycle sends are proven, two-way conversation isn't yet.

**File:** `src/components/vzir/VzirWhatsApp.tsx`

---

## 2. Homepage (`/`) — updated copy

### Hero — `src/components/home/Hero.tsx`
```
A.R.M Technologies · Bournemouth, UK
AI · Hospitality · SaaS

We build software that thinks for your hotel.

A.R.M Technologies is a UK software company building AI-powered products
for the hospitality industry. Our flagship product, Vzir, connects the
systems your hotel already uses and answers any question in plain
English — instantly, without ever changing anything in them.

[Explore Vzir →]   [What we build ↓]
```
(Added "without ever changing anything in them" — read-only is a genuine differentiator against tools that write to the PMS; it's worth saying out loud, not just implying.)

### Stats bar
Keep `UK · Based in Bournemouth` and `20 min · Setup time` as-is (both match the BRD's onboarding intent). Fix `90-day` to match whichever pilot length you commit to (see 1c). `£11B+ Market size` — keep only if you can point to a source; otherwise drop rather than leave an unsourced number on a site making a "we tell you the truth" pitch.

### Live-demo mockup
Change `Querying: Events / Competitors` → `Querying: PMS / Accounting` — matches what's actually connected today.

### What We Build — Vzir card — `src/components/home/VzirSection.tsx` / `ProductShowcase.tsx`
```
FLAGSHIP PRODUCT · In Development
Vzir — AI Hotel Command Centre

One AI that connects your PMS, accounting, and WhatsApp — and reasons
across all of them at once. Ask anything in plain English. Get one
clear answer, with the source cited for every figure.

Cloudbeds · Xero · WhatsApp
Read-only · No IT team · 20 min setup

[Explore Vzir]
```
(Dropped Events/Flights/Weather from the tag row — keep the card honest about the three real connector categories; add them back individually as each one goes live.)

### Flagship walkthrough section
```
OUR FLAGSHIP PRODUCT
Your hotel runs on disconnected systems. Vzir connects them.

Every morning, hotel managers log into their PMS, accounting software,
and guest inbox — then manually piece it together before they can make
one decision. Vzir ends that: connect your systems once, ask anything
in plain English, get one clear answer, with the source cited.

Connects to: PMS · Xero · WhatsApp
Roadmap: OTA/channel mix · Reviews · Weather · Rota
```

---

## 3. `/vzir` product page — updated copy

### Hero — `src/components/vzir/VzirHero.tsx`
```
HOTEL INTELLIGENCE PLATFORM
Ask your hotel anything.
"How many check-ins do we have today?"

Vzir connects your PMS, bookings, revenue, and guest messages into one
AI — and answers any question in plain English, instantly. Every
answer shows which system it came from.

Now onboarding UK hotels · Read-only access
[Apply for the pilot ↓]  [See it in action ↓]
```

### The Problem — `src/components/vzir/VzirProblem.tsx`
Keep as-is structurally, but drop the per-app "minutes" figures unless you've actually timed a real hotel doing this — invented precision (`~22 min/day`) undercuts the site's credibility next to a product whose entire pitch is "no fabricated numbers." Either source them from a real pilot hotel once you have one, or say it qualitatively: *"Hotel managers routinely lose an hour or more every morning just collecting data before they can make one decision."*

### Live demo — `src/components/vzir/VzirAIChat.tsx`
Keep the chat mockup and its four example questions — all four ("check-ins today," "raise rates," "rooms needing cleaning," "tracking vs last month") map cleanly to real handlers (`get_todays_arrivals`, revenue/reporting intents, room status, `/reporting/kpis`). This section is accurate as-is.

### Data sources — `src/components/vzir/VzirDataSources.tsx` — rewrite as "Live" vs "Roadmap"
```
WHAT'S CONNECTED TODAY

PMS            Live bookings, occupancy & guest profiles — Cloudbeds now, Mews next
Accounting     Revenue, invoices & cash position — Xero
WhatsApp       Automated booking confirmations, check-in/checkout messages,
               and guardrailed guest FAQ replies — always with a human escalation path
Reviews        Guest reviews and ratings — Google, TripAdvisor (in progress)

ON THE ROADMAP

OTA / Channel mix    Rates and bookings across Booking.com, Expedia
Weather              Impact on bookings and guest plans
Rota / Staffing      Who's working, labour cost
```
This is the single highest-value change on the page — it turns an inflated "10 sources, all live" claim into an honest, still-impressive "here's what's real now, here's what's next," which is a much more defensible pitch to a pilot hotel who will find out the truth within a week of onboarding anyway.

### Proactive Intelligence section — `src/components/vzir/VzirProactiveAlerts.tsx`
Either cut this section for now (it's entirely built on the non-existent Flights/Events/Competitors data) or reframe it explicitly as a roadmap teaser:
```
COMING NEXT

Vzir won't just answer questions — it'll surface what matters
before you ask.

We're building proactive monitoring on top of the connectors above:
local demand signals, weather impact, and rate recommendations —
always something Vzir tells you, never something it does on its own.
Every connector in Vzir is read-only; Vzir will never change a rate,
a reservation, or a booking without you.
```

### Guest messaging section — `src/components/vzir/VzirWhatsApp.tsx`
Keep the visual concept but rewrite the claim of a fully automated round-trip:
```
GUEST MESSAGING

Automated lifecycle messages on WhatsApp — with a human always in reach.

Vzir sends booking confirmations, pre-arrival reminders, and checkout
messages automatically over the official WhatsApp Business API. Guest
replies are read and classified — simple FAQ questions (check-in time,
wifi, parking) get an instant, guardrailed answer grounded only in your
hotel's own information; anything else (bookings, cancellations,
complaints, money) is flagged straight to your team. Every message is
logged, and a kill switch pauses all automated sends instantly.
```
(This matches what `PROGRESS.md` actually verifies: outbound lifecycle sends + kill switch + 24h-window enforcement + classify-then-route auto-handle/escalate logic. It drops the implied "full two-way conversation is live for every guest" claim until the dedicated WhatsApp number issue in §1d is resolved.)

### How It Works — `src/components/vzir/VzirHowItWorks.tsx`
Keep as-is — "Connect / Learn / Ask," read-only, no IT team, no migration — all match the BRD's actual FR-12/FR-13 connector-management design.

### Pilot CTA — `src/components/vzir/VzirPilotCTA.tsx`
Keep, once the 60 vs 90-day mismatch (§1c) is resolved.

---

## 4. One-line summary for whoever implements this

The product's actual differentiator is **real, cited, cross-source answers from systems you already use, with a hard read-only guarantee** — that's genuinely strong and doesn't need embellishment. The current copy dilutes it by claiming data sources and automated actions that don't exist, which is a liability the moment a pilot hotel actually uses the product and notices Vzir can't see flight data or adjust a rate. Ship the honest version — it's still a compelling pitch, and it won't need a walk-back later.

---

## 5. Source-of-truth docs (for reference, not copied into this repo)

If anything above needs re-checking against the current state of the product, the source docs live in the PMS-MCP backend repo, not here:

- `/Users/sreenathreddy/Documents/PMS-MCP/vzir-docs/VZIR_BRD.md` — product vision, connector registry, functional requirements
- `/Users/sreenathreddy/Documents/PMS-MCP/backend/docs/TRD.md` — technical architecture decisions
- `/Users/sreenathreddy/Documents/PMS-MCP/backend/docs/PROGRESS.md` — what's actually built vs. mocked vs. planned, updated after each backend change
- `/Users/sreenathreddy/Documents/PMS-MCP/backend/CLAUDE.md` — absolute constraints (read-only everywhere except WhatsApp, no operational data persisted, etc.)

These weren't copied into this repo on purpose — they're internal engineering docs (one of them gitignored at the source for containing business-sensitive content) and go stale fast. Treat this file as a point-in-time snapshot from 2026-08-09/10, not a live source of truth.
