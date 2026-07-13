# Weekly Campaign — Overview

This section defines the **end-to-end process, cadence, and structure specific to weekly
campaigns**. It is the authoritative source for how a weekly campaign is planned, produced,
reviewed, and delivered, and for the composition of the weekly email itself (as deferred to
here by [CR-13](../00-Project%20Overview/Campaign-Requirements.md)).

It does not restate the system-wide rules. Functional requirements live in
[Campaign Requirements](../00-Project%20Overview/Campaign-Requirements.md), the quality bar in
[Campaign Standards](../00-Project%20Overview/Campaign-Standards.md), and brand specifics in the
[Brand documentation](../03-Brands/). This section describes only what is **particular to the
weekly cadence**; anything shared with monthly campaigns is referenced, not duplicated.

## Purpose of the weekly campaign

The weekly campaign is the recurring, high-cadence touchpoint with each brand's audience. Its
role is to maintain regular engagement — surfacing current products, offers, and timely
messaging — within a predictable format that recipients come to recognise. It is a
**scheduled, calendar-driven** send, not a triggered flow (see [Scope](../00-Project%20Overview/scope.md)).

Because it recurs frequently, the weekly campaign is optimised for **speed and repeatability**:
a fixed structure, reusable components, and prompt-assisted generation keep each cycle fast to
produce without redesign ([CR-18](../00-Project%20Overview/Campaign-Requirements.md)).

## Cadence & timing

- **Frequency.** One weekly campaign per brand, per week.
- **Calendar-driven.** Each send's date, brand, and theme originate from the
  [Content Calendar](../00-Project%20Overview/content-calendar.md), which is the single source of
  truth for scheduling ([CR-04](../00-Project%20Overview/Campaign-Requirements.md)). The specific
  send day and time per brand are defined there and are not fixed in this document.
- **Production lead time.** Production begins ahead of the send date so that briefing,
  generation, review, QA, and approval ([CR-15](../00-Project%20Overview/Campaign-Requirements.md)–[CR-17](../00-Project%20Overview/Campaign-Requirements.md))
  all complete before the scheduled send. The standard lead time is maintained in the content
  calendar so it can be tuned per brand without editing this section.

> **To confirm during review:** the default send day/time and lead time per brand. These are
> owned by the content calendar; this section only requires that they exist and are respected.

## Weekly email structure

Every weekly campaign follows the same structure so output is consistent from cycle to cycle
([CS-02](../00-Project%20Overview/Campaign-Standards.md)) and across brands
([CR-07](../00-Project%20Overview/Campaign-Requirements.md)). The blocks below are the weekly
composition referenced by [CR-13](../00-Project%20Overview/Campaign-Requirements.md); each has a
stable identifier (`WK-S#`) for reference from the [QA Checklist](../07-Prompt%20Library/QA-Checklist.md)
and reviews.

| ID | Block | Required | Purpose |
|------|-------|----------|---------|
| WK-S1 | Subject line | Yes | Drives the open; concise and on-brand. |
| WK-S2 | Preheader | Yes | Supports the subject line; never left as fallback text. |
| WK-S3 | Header / logo | Yes | Brand identification per the relevant [Brand document](../03-Brands/). |
| WK-S4 | Hero / lead message | Yes | The single primary message or offer for the week. |
| WK-S5 | Primary call to action | Yes | The main action; must resolve to a live destination ([CS-07](../00-Project%20Overview/Campaign-Standards.md)). |
| WK-S6 | Featured products / content | Conditional | Product or content blocks sourced per [04-Technical](../04-Technical/Product-Source.md); included when the week features products. |
| WK-S7 | Secondary content | Optional | Supporting messages, secondary offers, or editorial. |
| WK-S8 | Footer | Yes | Sender identity, unsubscribe, and compliance elements ([CS-15](../00-Project%20Overview/Campaign-Standards.md)). |

Brand-dependent aspects of these blocks (colours, fonts, logo, tone, button styling) are never
defined here — they are applied from the [Brand documentation](../03-Brands/) and the
[Assets Library](../06-Assets%20Library/) ([CS-01](../00-Project%20Overview/Campaign-Standards.md),
[CS-10](../00-Project%20Overview/Campaign-Standards.md)).

## End-to-end production process

Each weekly campaign moves through the same steps every cycle. Steps carry a `WK-P#` identifier
for traceability.

1. **WK-P1 — Pull the brief from the calendar.** Confirm the week's date, brand, and theme from
   the [Content Calendar](../00-Project%20Overview/content-calendar.md), and establish the brief:
   purpose, audience, key message, and featured content ([CR-05](../00-Project%20Overview/Campaign-Requirements.md)).
2. **WK-P2 — Confirm the audience.** Select the target segment for the send as defined in
   [Audience & Segmentation](../00-Project%20Overview/audience-segmentation.md)
   ([CR-06](../00-Project%20Overview/Campaign-Requirements.md)).
3. **WK-P3 — Gather assets.** Assemble approved assets (logos, banners, product images, buttons)
   that meet the [Assets Library](../06-Assets%20Library/) standards
   ([CR-10](../00-Project%20Overview/Campaign-Requirements.md)). Where products are featured,
   source them per [04-Technical](../04-Technical/Product-Source.md).
4. **WK-P4 — Generate content and HTML.** Produce copy and email HTML using the weekly prompts in
   the [Prompt Library](../07-Prompt%20Library/Generate-Weekly-Campaign.md) and
   [Generate-HTML](../07-Prompt%20Library/Generate-HTML.md), following the WK-S structure above and
   applying the correct [Brand](../03-Brands/) rules ([CR-08](../00-Project%20Overview/Campaign-Requirements.md),
   [CR-09](../00-Project%20Overview/Campaign-Requirements.md)).
5. **WK-P5 — Review.** Review the draft against [Campaign Standards](../00-Project%20Overview/Campaign-Standards.md)
   using [Review-HTML](../07-Prompt%20Library/Review-HTML.md). Review is performed by someone other
   than the author ([CR-16](../00-Project%20Overview/Campaign-Requirements.md)).
6. **WK-P6 — QA.** Pass the [QA Checklist](../07-Prompt%20Library/QA-Checklist.md) in full before
   approval ([CR-15](../00-Project%20Overview/Campaign-Requirements.md),
   [CS-16](../00-Project%20Overview/Campaign-Standards.md)).
7. **WK-P7 — Approve.** Record approval before the campaign may be scheduled
   ([CR-17](../00-Project%20Overview/Campaign-Requirements.md)).
8. **WK-P8 — Hand off to the platform.** Deliver the approved campaign to the sending platform via
   the integration points in [04-Technical/Integrations.md](../04-Technical/Integrations.md), and
   schedule it for the calendar date ([CR-14](../00-Project%20Overview/Campaign-Requirements.md)).

## Roles & responsibilities

The people accountable for each step — author, reviewer, approver — are defined in
[Stakeholders](../00-Project%20Overview/stakeholders.md). This section assumes the separation of
duties required by [CR-16](../00-Project%20Overview/Campaign-Requirements.md): the reviewer and
approver of a weekly campaign are not its author.

## What is weekly-specific vs shared

To keep this section free of duplication:

- **Weekly-specific (defined here):** cadence and lead time, the `WK-S#` email structure, and the
  `WK-P#` production steps in their weekly form.
- **Shared (referenced, not restated):** functional requirements
  ([Campaign Requirements](../00-Project%20Overview/Campaign-Requirements.md)), the quality bar
  ([Campaign Standards](../00-Project%20Overview/Campaign-Standards.md)), brand rules
  ([03-Brands](../03-Brands/)), assets ([06-Assets Library](../06-Assets%20Library/)), prompts
  ([07-Prompt Library](../07-Prompt%20Library/)), and technical implementation
  ([04-Technical](../04-Technical/)).

The [Monthly Campaign](../02-Monthly%20Campaign/) section mirrors this structure for the monthly
cadence; where the two differ, the difference is cadence, audience emphasis, and composition —
not the underlying framework.

---

_Status: Draft for review. Last updated: 2026-07-10._
