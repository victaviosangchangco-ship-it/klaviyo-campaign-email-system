# Assumptions & Constraints

This section records the **assumptions** the plan depends on and the **constraints** it must work within.
Naming them protects the project: an assumption that later proves false, or a constraint that is
overlooked, is a common cause of rework and missed sends. Both are living records — when one changes, the
change is managed rather than absorbed silently.

It states these at the **business level only**. Specific values that are not yet confirmed (send days,
segments, platform credentials, brand specifics) are owned by their home documents and are marked *To be
confirmed* there, never assumed here.

## Assumptions

Things taken to be true for the system to work as designed. If one is invalidated, it is raised for review
and, if it changes direction, recorded in the [Decision Log](../09-Architecture%20Decisions/Decision-Log.md).

- **Recurring, calendar-driven cadence.** The programme is built around scheduled weekly and monthly
  sends planned from the [Content Calendar](content-calendar.md), not triggered journeys (see
  [Scope](scope.md)).
- **Australian-market first.** All brands ship Australia-wide; the calendar, offers and seasonal framing
  are Australian-market first (see the [Holiday Campaign Framework](holiday-campaign-framework.md)).
- **A commerce platform is the source of product truth.** Product names, prices, stock, and links come
  from each brand's approved commerce source; they are verified, never invented. The specific platform per
  brand is stated in that [Brand document](../03-Brands/).
- **A sending platform exists and is administered separately.** Its account configuration and native
  reporting are assumed to be in place; this system produces campaigns for it and hands them off (see
  [CR-14](Campaign-Requirements.md)).
- **A human reviews and approves every send.** The process assumes independent review and recorded
  approval before send, with the reviewer/approver never the author (see [Human Workflow](human-workflow.md)).
- **A thin brand layer over a shared framework.** Adding a brand or campaign type is assumed to be an
  extension of the shared framework, not a fork of it (see [Objectives & Goals](objectives-and-goals.md)).
- **Documentation is approved before build.** The "plan before building" principle is assumed to hold for
  material changes to the system itself, not only to individual campaigns.

## Constraints

Hard limits the system must respect. These are not preferences; a campaign that breaches one is not ready.

- **Email-client rendering reality.** Campaigns must render correctly across the supported clients and on
  both desktop and mobile; the medium's limitations bound what layouts are possible (see
  [Campaign Standards](Campaign-Standards.md), CS-08–CS-12).
- **Deliverability and weight.** Sends must stay within email-safe weight and deliverability practice so
  they load quickly and are not clipped or filtered (CS-13, CS-14).
- **Legal and compliance floor.** Every send must carry the legally required marketing-email elements
  (sender identity, unsubscribe) consistent with the platform's configuration (CS-15).
- **Accessibility floor.** Meaningful alt text, sufficient contrast, and a readable image-to-text balance
  are a minimum, not an enhancement (CS-11).
- **Scope boundary with the Flow project.** Automated, trigger-based journeys are out of scope and owned
  by the separate Klaviyo Flow project; this system coordinates with it but does not build it (see
  [Scope](scope.md)).
- **No invented values.** Where an approved source does not provide a value, it is treated as *To be
  confirmed* and the work stops for clarification rather than guessing — this is a firm operating limit,
  not a soft guideline.
- **Separation of duties is non-negotiable.** Review and approval by someone other than the author is a
  fixed control (CR-16, CS-17).

## Dependencies

The system relies on a small number of external and internal things being in place:

- **Confirmed brand facts** in each [Brand document](../03-Brands/) — a brand cannot be produced until its
  identity, assets, and configuration are confirmed from an approved source.
- **A maintained content calendar** — the single source of truth for what sends when, to whom.
- **Approved assets and reusable libraries** — the shared framework, components, templates, and assets the
  process is built to reuse.

## How assumptions and constraints are managed

- **Reviewed, not fixed forever.** Assumptions are revisited when circumstances change; a proposed change
  to a constraint follows the same "propose → review → approve → record" path as a scope change (see
  [Scope](scope.md)).
- **Invalidation is a decision, not a workaround.** When an assumption fails or a constraint must change,
  the change is recorded in the [Decision Log](../09-Architecture%20Decisions/Decision-Log.md) (business)
  or, if it concerns the engineering standards, raised as an Architecture Decision — never absorbed
  informally.
