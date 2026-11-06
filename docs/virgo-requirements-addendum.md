# Virgo — Business Requirements: Addendum 1

Adds to `virgo.pdf` (Business Requirements and Use Cases). Same structure and
numbering; everything in the original still stands. Added 26 October 2026.

## What this adds

When Virgo raises a problem that another team has to fix, it drafts the message
to that team so the manager doesn't have to. The manager reads it, changes it if
they want, and sends it. Virgo never sends a message to staff on its own, and it
never creates a job, a work order or a room status change in any connected system.

## 5.5 Getting it fixed

| Ref | User | Situation | What Virgo must give back | What it needs to know |
|---|---|---|---|---|
| UC-19 | Operations manager / General manager | A room won't be ready for a guest who is due shortly (follows UC-2). | A drafted message to the head of housekeeping naming the room, the guest's arrival time and any staffing pressure, for the manager to send or change. | Reservations and arrival times, housekeeping status, staff rota, who leads housekeeping |
| UC-20 | Operations manager / General manager | A guest reports something broken in their room, such as the heating (follows UC-15). | A drafted message to the maintenance lead naming the room, what the guest reported and when, for the manager to send or change. The guest conversation itself still goes to the duty manager as in UC-15. | Guest message, room, who leads maintenance |

## 7. Non-negotiables (addition)

| | Requirement |
|---|---|
| R10 | Messages to staff are drafted, never sent automatically. A person reviews and presses Send every time. Each staff message that is sent is written down and visible to the owner, in the same record as R8. Drafting a message does not write anything into the PMS, the maintenance or housekeeping tools, or any other connected system, so R1 still holds. |

## 6. What Virgo needs to reach (addition)

| Category | Providers in scope | What we need from it |
|---|---|---|
| Staff messaging | The hotel's email | Sending a message the manager has approved. Team leads (head housekeeper, maintenance lead) are set up by the hotel. |

## Effect on the website

The homepage demo (`src/components/home/ProductTour.tsx`) shows both use cases:
housekeeping for room 214 in the briefing (UC-19) and maintenance for the room 312
heating in the guest inbox (UC-20). In both, Virgo drafts and the manager sends.
Until the product ships these, they are planned features shown with sample data.
