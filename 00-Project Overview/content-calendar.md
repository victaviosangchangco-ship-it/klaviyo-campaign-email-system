# Content Calendar & Cadence

This section is the **single source of truth for scheduling** — what sends, when, for which brand, and how
far ahead it must be prepared. It is referenced by [CR-04](Campaign-Requirements.md) and by the weekly and
monthly production steps (`WK-P1` / `MO-P1`). It explains the *cadence logic and planning rhythm* here;
the live, dated schedule is maintained operationally alongside it.

> **On confirmed values.** Campaign **frequencies** that are already documented are stated with their
> source. Specific **send days, times, and lead-time durations** are **To Be Confirmed** — the BRD already
> notes these are owned by the calendar and not yet fixed. Current-year holiday/seasonal dates are
> confirmed **per year**. Nothing is invented.

## How the calendar works

- **Every campaign originates here** ([CR-04](Campaign-Requirements.md)); a send that is not on the
  calendar has not been planned.
- **Australian-market first.** Cadence, seasons and holidays follow the Australian calendar (see the
  [Holiday Campaign Framework](holiday-campaign-framework.md) and
  [Assumptions & Constraints](assumptions-and-constraints.md)).
- **Plan ahead, not reactively.** The calendar's purpose is to reserve the high-intent moments (EOFY,
  BFCM, Christmas) early and fill the gaps with the always-on cadence — the opposite of building near the
  send date.
- **Anchors first, then fill.** Fixed dated events anchor the year; weekly and monthly sends fill the
  space around them so the programme stays varied and fresh (see
  [Campaign Strategy](campaign-strategy.md)).

## Weekly Campaign cadence

- **Frequency:** one weekly campaign **per brand, per week** ([Confirmed], [CR-01](Campaign-Requirements.md)
  and the [Weekly overview](../01-Weekly%20Campaign/overview.md)).
- **Send day / time per brand:** **To Be Confirmed.**
- **Why weekly.** It is the heartbeat that keeps the brand present and deliverability warm between bigger
  moments (see the [Weekly Playbook](../Playbooks/Weekly-Playbook.md)); each send must be a fresh angle,
  never a repeat (`CLAUDE.md` §5.2).

## Monthly Campaign cadence

- **Frequency:** one monthly campaign **per brand, per calendar month** ([Confirmed],
  [CR-01](Campaign-Requirements.md) and the [Monthly overview](../02-Monthly%20Campaign/overview.md)).
- **Send day:** **To Be Confirmed.**
- **Why monthly.** A broader, editorial roundup that steps back to a theme or story; it typically needs a
  **longer lead time** than a weekly because it is larger.

## Product Launch cadence

- **Frequency:** **event-driven, not fixed** — a launch runs when a new product/range is ready and its SKUs
  pass verification (see the [Product Launch Workflow](product-launch-workflow.md)).
- **Timing constraint.** A launch is scheduled only once every featured SKU is confirmed live and
  purchasable; readiness, not a calendar slot, sets the date. Any target launch dates — **To Be Confirmed**
  per launch.

## Seasonal Campaign planning

- **Trigger:** the turn of a season, to align the range with seasonal needs (see
  [Campaign Strategy](campaign-strategy.md)).
- **Planning horizon.** Plan **weeks ahead** so creative and stock are ready before the season turns.
- **Dates.** Season-change dates are Australian-calendar based; the exact send dates each year — **To Be
  Confirmed.**

## Holiday Campaign planning

- **Trigger:** fixed calendar events — the highest-intent, highest-revenue moments (see the
  [Holiday Campaign Framework](holiday-campaign-framework.md) for the occasion library).
- **Sequence the big events.** For major events (BFCM, EOFY, Christmas) plan a short sequence —
  **tease → launch → last chance** — not a single email.
- **Verify the offer first.** Every offer and its expiry must be confirmed active in the commerce platform
  before send, with a freshly-written promo title (`CLAUDE.md` §6.5).
- **Dates.** The occasions are fixed; the **current-year exact dates and shipping cut-offs** are **To Be
  Confirmed each year**.

## Promotional Campaign planning

- **Trigger:** a discount/coupon-led offer (may overlay a weekly, seasonal or holiday send).
- **Rules that already apply.** The coupon must be **verified created and active** before send
  (`CLAUDE.md` §6.3); brand-specific offer conventions hold (for example SC's fixed-dollar "$20 off orders
  over $200", `CLAUDE.md` §6.4); the promo title and copy are written fresh for the campaign, never
  recycled (`CLAUDE.md` §6.5).
- **Cadence and discount limits** (how often a brand may run promotions, to protect margin and avoid
  training customers to wait for a deal) — **To Be Confirmed (Business Decision Required)**.

## Asset preparation timeline

- **What happens.** References and assets are gathered and verified before the build (`WK-P3` / `MO-P3`),
  moving through `References/` → `Assets/` → `Draft/` (see
  [File-Driven Architecture](file-driven-architecture.md)).
- **Lead time.** The number of days assets must be ready before send — **To Be Confirmed**, and likely
  longer for monthly, seasonal and holiday sends than for a weekly.

## Review timeline

- **What happens.** An **independent review** (`WK-P5` / `MO-P5`) and the **QA gate** (`WK-P6` / `MO-P6`)
  run before approval, checking against [Campaign Standards](Campaign-Standards.md) and the QA checklist,
  including desktop and mobile rendering.
- **Timing.** Review and QA must complete with enough margin before the send date. The specific number of
  days — **To Be Confirmed.**

## Approval workflow

- **Recorded approval is required before any send** ([CR-17](Campaign-Requirements.md); `WK-P7` / `MO-P7`),
  and the reviewer/approver is **never the author** ([CR-16](Campaign-Requirements.md)).
- Approval-to-send is a **status**, gated by the send checks (clickability after platform import,
  responsive rendering, live links, no unresolved blockers) — presence of a finished build does not by
  itself mean "approved to send".

## Scheduling workflow

- Once approved, the campaign is **handed to the sending platform and scheduled for its calendar date**
  (`WK-P8` / `MO-P8`; [CR-14](Campaign-Requirements.md)), independent of the Klaviyo Flow project.

## Post-campaign review

- After send, results are reviewed per the
  [Campaign Performance Review & Optimization](performance-review-and-optimization.md) rhythm — a
  per-campaign read against the brief's success criteria, feeding lessons back into templates, standards
  and playbooks. This closes the calendar loop: each cycle informs the next.

## Standard lead times (planning summary)

A single place to hold the agreed lead times once confirmed. All durations below are **To Be Confirmed**;
the structure is fixed, the numbers are a business decision.

| Campaign type | Brief ready by | Assets ready by | Review & QA by | Approval by | Total lead time |
|---------------|----------------|-----------------|----------------|-------------|-----------------|
| Weekly | `[TBC]` | `[TBC]` | `[TBC]` | `[TBC]` | `[TBC]` |
| Monthly | `[TBC]` | `[TBC]` | `[TBC]` | `[TBC]` | `[TBC]` |
| Product Launch | `[TBC]` | `[TBC]` | `[TBC]` | `[TBC]` | `[TBC]` |
| Seasonal | `[TBC]` | `[TBC]` | `[TBC]` | `[TBC]` | `[TBC]` |
| Holiday | `[TBC]` | `[TBC]` | `[TBC]` | `[TBC]` | `[TBC]` |
| Promotional | `[TBC]` | `[TBC]` | `[TBC]` | `[TBC]` | `[TBC]` |

## Business assumptions

- Weekly and monthly **frequencies** are fixed as above; **timing details** (day, time, lead time) are
  configurable per brand without changing this framework.
- The calendar is **maintained continuously** and is the reference every brief is pulled from.
- Holiday and seasonal **occasions** are stable year to year; only their **exact dates** change annually.

## Items requiring confirmation (dates & cadence)

Each is **To Be Confirmed**; none may be invented:

- [ ] **Send day and time per brand**, for weekly and for monthly.
- [ ] **Standard lead times** for each campaign type (the table above).
- [ ] **Promotional cadence and discount limits** per brand (Business Decision Required).
- [ ] **Current-year dates and shipping cut-offs** for each holiday/seasonal occasion.
- [ ] Any **blackout dates** or brand-specific scheduling constraints.
- [ ] Whether monthly and weekly for the same brand have a **preferred spacing** to avoid clustering.
