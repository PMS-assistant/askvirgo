# Virgo website content plan

Accuracy rules for the copy on askvirgo.co.uk. The site is about the product only;
see `CLAUDE.md` for the brand rules. The owner's business requirements document
(`virgo.pdf`, summarised in `CLAUDE.md`) is the source of truth: users, use cases,
systems in scope and the non-negotiables R1–R9.

## 1. Non-negotiable claims

- **Read-only.** Virgo never writes to a connected system. Wording must be
  "recommends", "surfaces" or "flags", never "adjusts", "applies" or "updates".
  Example of an acceptable line: "I'd recommend +15%. Recommended, not applied."
- **What Virgo sends:** guardrailed WhatsApp guest replies, and staff messages it
  drafts for a person to send (Addendum 1: UC-19, UC-20, R10). It never writes into
  a connected system.
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
| Weather, local events, competitor rates | In scope (`virgo.pdf` §6), labelled "In progress" on the site. |
| Tills, payroll, payment providers | Not in scope. Do not list. |
| Flights, trends | Not built. Do not mention. |

Re-check against the product's own docs before changing any row.

## 3. Homepage sections (`/`)

| Section | Component | Job |
|---|---|---|
| Hero | `home/Hero.tsx` | A real question and Virgo's answer, every figure footnoted to its source; questions from the document's users rotate (never front desk). Single CTA: Book a demo (scrolls to `#pilot`) |
| What Virgo is (`#virgo`) | `home/VirgoIntro.tsx` | The statement, the constellation of seven system categories becoming Virgo, then five capability rows |
| Inside Virgo (`#product`) | `home/ProductTour.tsx` | Automatic tour of the real app: Today's Briefing, Ask Virgo, Guest inbox |
| How Virgo works (`#how-it-works`) | `home/HowVirgoWorks.tsx` | Five points from `virgo.pdf` §7 and the room use cases, each with a product scene: reads what you run, takes only what a question needs, every number checked, the right team hears in time, you stay in control |
| Contact (`#pilot`) | `virgo/VirgoPilotCTA.tsx` | Form, writes to `vzir_pilot_signups` |

## 4. Other pages

- `/privacy`, `/terms`: draft placeholder text with a visible Draft banner. Replace
  with reviewed text before launch, then remove the banner.
- 404: plain "Page not found" with a link home.

## 5. Open items before launch

- Replace draft legal text.
- Real booking link for "Book a demo" if wanted (currently scrolls to the form).
- Add a favicon (`index.html` references `/vite.svg`, which does not exist).
