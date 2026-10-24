# Virgo website content plan

Accuracy rules for the copy on askvirgo.co.uk. The site is about the product only;
see `CLAUDE.md` for the brand rules.

## 1. Non-negotiable claims

- **Read-only.** Virgo never writes to a connected system. Wording must be
  "recommends", "surfaces" or "flags", never "adjusts", "applies" or "updates".
  Example of an acceptable line: "I'd recommend +15%. Recommended, not applied."
- **One write surface:** guardrailed WhatsApp guest replies. Nothing else.
- **No invented numbers.** No "saves X hours", no customer counts, no market-size
  claims. Virgo has no customers yet, so there is nothing to source a real stat from.
- **Sample data is labelled.** Figures in mockups (occupancy, revenue) are
  illustrative. Keep any "Sample data" markers on them.

## 2. Data sources: say only what is true

| Source | Status for copy |
|---|---|
| PMS (Cloudbeds) | Live. May be named. |
| Accounting (Xero) | Live. May be named. |
| Guest messaging (WhatsApp) | Live. Guest replies are guardrailed. |
| Reviews | In progress. Say "in progress", not "connected". |
| Weather, local events | Roadmap. Show only as roadmap, never as live. |
| Flights, competitor rates, trends | Not built. Do not mention. |

Re-check against the product's own docs before changing any row.

## 3. Homepage sections (`/`)

| Section | Component | Job |
|---|---|---|
| Hero | `home/Hero.tsx`, `HeroAskDemo.tsx` | One question, every system. Single CTA: Book a demo (scrolls to `#pilot`) |
| Problem | `virgo/VirgoProblem.tsx` | Say what is wrong before selling the fix |
| Before / after | `home/BeforeAfter.tsx` | A working day collapsing from several apps to one question |
| Capabilities (`#virgo`) | `home/CapabilityScroller.tsx` | Meet Virgo, then what you can ask, capability by capability, with honest statuses |
| Integrations (`#integrations`) | `home/Integrations.tsx` | Eight system categories and the names in each |
| How it works (`#how-it-works`) | `virgo/VirgoHowItWorks.tsx` | Connect, ask, get alerts |
| Contact (`#pilot`) | `virgo/VirgoPilotCTA.tsx` | Form, writes to `vzir_pilot_signups` |

## 4. Other pages

- `/privacy`, `/terms`: draft placeholder text with a visible Draft banner. Replace
  with reviewed text before launch, then remove the banner.
- 404: plain "Page not found" with a link home.

## 5. Open items before launch

- Replace draft legal text.
- Real booking link for "Book a demo" if wanted (currently scrolls to the form).
- Add a favicon (`index.html` references `/vite.svg`, which does not exist).
