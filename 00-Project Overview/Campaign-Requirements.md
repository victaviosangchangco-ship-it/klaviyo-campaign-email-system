# Campaign Requirements

This section defines *what the Weekly & Monthly Email Campaign System must do* — the
functional requirements that every campaign, regardless of brand or cadence, is expected
to satisfy. The quality bar and non-functional expectations (accessibility, performance,
consistency, etc.) are defined separately in [Campaign Standards](Campaign-Standards.md).

Requirements are written at the system level and remain deliberately brand-neutral. Where
a requirement depends on a brand, it references the [Brand documentation](../03-Brands/)
rather than stating the specifics here. Cadence-specific detail is documented in the
[Weekly](../01-Weekly%20Campaign/) and [Monthly](../02-Monthly%20Campaign/) sections.

## How to read this section

Each requirement has a stable identifier (`CR-##`) so it can be referenced from other
sections, reviews, and QA. Requirements describe an outcome, not an implementation; the
mechanism for meeting them is documented under [04-Technical](../04-Technical/).

## Functional requirements

### Campaign definition & cadence

- **CR-01 — Two campaign types.** The system must support two recurring, calendar-driven
  campaign types: **weekly** and **monthly**.
- **CR-02 — Multi-brand.** Every campaign type must be producible for each supported brand
  (RDD, SS, SC, Stack) using one unified process.
- **CR-03 — Scheduled, not triggered.** Campaigns must be planned and scheduled from the
  content calendar. Trigger/event-based sends are out of scope (see [Scope](scope.md)).

### Planning & briefing

- **CR-04 — Calendar-driven.** Each campaign must originate from the
  [Content Calendar](content-calendar.md), which defines its date, brand, and type.
- **CR-05 — Defined brief.** Each campaign must have a brief identifying its purpose,
  audience, key message, and featured content before production begins.
- **CR-06 — Audience selection.** Each campaign must target a defined audience/segment as
  described in [Audience & Segmentation](audience-segmentation.md).

### Content production

- **CR-07 — Standard structure.** Each campaign must follow the agreed content structure
  for its type (weekly or monthly), so output is consistent and predictable.
- **CR-08 — Prompt-assisted generation.** Content and HTML must be producible using the
  reusable prompts in the [Prompt Library](../07-Prompt%20Library/).
- **CR-09 — Brand application.** Campaigns must apply the correct brand rules by referencing
  the relevant [Brand document](../03-Brands/); brand specifics must not be re-authored per
  campaign.
- **CR-10 — Approved assets only.** Campaigns must use assets that conform to the
  [Assets Library](../06-Assets%20Library/) standards (logos, icons, banners, product
  images, buttons, social).
- **CR-11 — Product and dynamic content.** Where a campaign features products or
  personalised/dynamic content, it must draw from the defined product source and dynamic
  content rules in [04-Technical](../04-Technical/).

### Output & delivery

- **CR-12 — Email HTML output.** Each campaign must produce email-ready HTML that renders
  correctly across the supported email clients defined in [Campaign Standards](Campaign-Standards.md).
- **CR-13 — Required elements.** Each campaign must include the mandatory elements common
  to all sends (for example subject line, preheader, header, body, call(s) to action, and
  footer). The exact per-type composition is defined in the Weekly and Monthly sections.
- **CR-14 — Platform hand-off.** Completed campaigns must be deliverable to the sending
  platform via the integration points defined in [04-Technical/Integrations.md](../04-Technical/Integrations.md),
  without depending on the separate Klaviyo Flow project.

### Review, QA & approval

- **CR-15 — Mandatory review.** Every campaign must pass a review against
  [Campaign Standards](Campaign-Standards.md) and the
  [QA Checklist](../07-Prompt%20Library/QA-Checklist.md) before it can be approved.
- **CR-16 — Separation of duties.** A campaign must be reviewed and approved by someone
  other than its author (see [Stakeholders](stakeholders.md)).
- **CR-17 — Approval before send.** No campaign may be scheduled to send without recorded
  approval.

### Maintainability & growth

- **CR-18 — Reusable and repeatable.** The process must be repeatable for every cycle
  without redesign, relying on the shared framework and libraries.
- **CR-19 — Extensible.** The system must accommodate new brands or campaign types by
  extending the unified framework, not by duplicating it.

## Traceability

These requirements are the reference point for the detailed process sections and for QA.
Success against them is measured through [Success Metrics](success-metrics.md), and any
requirement that cannot be met in the initial build should be recorded in
[Future Enhancements](../05-Future/roadmap.md).
