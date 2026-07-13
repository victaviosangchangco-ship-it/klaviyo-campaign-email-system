# Monthly Campaign — Overview

This section defines the **end-to-end process, cadence, and structure specific to monthly
campaigns**. It is the authoritative source for how a monthly campaign is planned, produced,
reviewed, and delivered, and for the composition of the monthly email itself (as deferred to
here by [CR-13](../00-Project%20Overview/Campaign-Requirements.md)).

It does not restate the system-wide rules. Functional requirements live in
[Campaign Requirements](../00-Project%20Overview/Campaign-Requirements.md), the quality bar in
[Campaign Standards](../00-Project%20Overview/Campaign-Standards.md), and brand specifics in the
[Brand documentation](../03-Brands/). This section describes only what is **particular to the
monthly cadence**; anything shared with weekly campaigns is referenced, not duplicated. It
parallels the [Weekly Campaign](../01-Weekly%20Campaign/overview.md) section — where the two
differ, the difference is cadence, audience emphasis, and composition, not the underlying
framework.

## Purpose of the monthly campaign

The monthly campaign is the recurring, lower-cadence touchpoint with each brand's audience. Where
the weekly campaign maintains frequent, timely engagement, the monthly campaign takes a **broader,
more editorial view** — consolidating the month's themes, highlights, and featured content into a
single, higher-value send. It is a **scheduled, calendar-driven** send, not a triggered flow (see
[Scope](../00-Project%20Overview/scope.md)).

Like every campaign type, the monthly campaign is produced from the unified framework so it stays
**repeatable and consistent** cycle to cycle ([CR-18](../00-Project%20Overview/Campaign-Requirements.md),
[CS-02](../00-Project%20Overview/Campaign-Standards.md)), differing from the weekly campaign in
composition and cadence rather than in process.

## Cadence & timing

- **Frequency.** One monthly campaign per brand, per calendar month.
- **Calendar-driven.** Each send's date, brand, and theme originate from the
  [Content Calendar](../00-Project%20Overview/content-calendar.md), which is the single source of
  truth for scheduling ([CR-04](../00-Project%20Overview/Campaign-Requirements.md)). The specific
  send day and time per brand are defined there and are not fixed in this document.
- **Production lead time.** Because the monthly campaign is typically larger and more editorial
  than a weekly send, its production begins with enough lead time for briefing, generation, review,
  QA, and approval ([CR-15](../00-Project%20Overview/Campaign-Requirements.md)–[CR-17](../00-Project%20Overview/Campaign-Requirements.md))
  to complete before the scheduled send. The standard lead time is maintained in the content
  calendar so it can be tuned per brand without editing this section.

> **To be confirmed during review:** the default send day/time and lead time per brand. These are
> owned by the content calendar; this section only requires that they exist and are respected. No
> values are assumed here.

## Monthly email structure

Every monthly campaign follows the same structure so output is consistent from cycle to cycle
([CS-02](../00-Project%20Overview/Campaign-Standards.md)) and across brands
([CR-07](../00-Project%20Overview/Campaign-Requirements.md)). The blocks below are the monthly
composition referenced by [CR-13](../00-Project%20Overview/Campaign-Requirements.md); each has a
stable identifier (`MO-S#`) for reference from the [QA Checklist](../07-Prompt%20Library/QA-Checklist.md)
and reviews.

| ID | Block | Required | Purpose |
|------|-------|----------|---------|
| MO-S1 | Subject line | Yes | Drives the open; concise and on-brand. |
| MO-S2 | Preheader | Yes | Supports the subject line; never left as fallback text. |
| MO-S3 | Header / logo | Yes | Brand identification per the relevant [Brand document](../03-Brands/). |
| MO-S4 | Monthly theme / editorial intro | Yes | Sets the month's narrative; the framing that distinguishes the monthly from a weekly send. |
| MO-S5 | Hero / lead feature | Yes | The single primary feature or offer for the month. |
| MO-S6 | Primary call to action | Yes | The main action; must resolve to a live destination ([CS-07](../00-Project%20Overview/Campaign-Standards.md)). |
| MO-S7 | Featured products / content | Conditional | Product or content blocks sourced per [04-Technical](../04-Technical/Product-Source.md); included when the month features products. The monthly send may carry more than one feature block (a roundup); the number is set per send from the brief, not fixed here. |
| MO-S8 | Secondary content | Optional | Supporting messages, secondary offers, or editorial. |
| MO-S9 | Footer | Yes | Sender identity, unsubscribe, and compliance elements ([CS-15](../00-Project%20Overview/Campaign-Standards.md)). |

Brand-dependent aspects of these blocks (colours, fonts, logo, tone, button styling) are never
defined here — they are applied from the [Brand documentation](../03-Brands/) and the
[Assets Library](../06-Assets%20Library/) ([CS-01](../00-Project%20Overview/Campaign-Standards.md),
[CS-10](../00-Project%20Overview/Campaign-Standards.md)).

The monthly structure parallels the weekly [`WK-S#`](../01-Weekly%20Campaign/overview.md) blocks;
its distinguishing element is the editorial intro (`MO-S4`) and the potential for multiple feature
blocks under `MO-S7`.

## End-to-end production process

Each monthly campaign moves through the same steps every cycle. Steps carry an `MO-P#` identifier
for traceability.

1. **MO-P1 — Pull the brief from the calendar.** Confirm the month's date, brand, and theme from
   the [Content Calendar](../00-Project%20Overview/content-calendar.md), and establish the brief:
   purpose, audience, key message, and featured content ([CR-05](../00-Project%20Overview/Campaign-Requirements.md)).
2. **MO-P2 — Confirm the audience.** Select the target segment for the send as defined in
   [Audience & Segmentation](../00-Project%20Overview/audience-segmentation.md)
   ([CR-06](../00-Project%20Overview/Campaign-Requirements.md)).
3. **MO-P3 — Gather assets.** Assemble approved assets (logos, banners, product images, buttons)
   that meet the [Assets Library](../06-Assets%20Library/) standards
   ([CR-10](../00-Project%20Overview/Campaign-Requirements.md)). Where products are featured,
   source them per [04-Technical](../04-Technical/Product-Source.md).
4. **MO-P4 — Generate content and HTML.** Produce copy and email HTML using the monthly prompts in
   the [Prompt Library](../07-Prompt%20Library/Generate-Monthly-Campaign.md) and
   [Generate-HTML](../07-Prompt%20Library/Generate-HTML.md), following the MO-S structure above and
   applying the correct [Brand](../03-Brands/) rules ([CR-08](../00-Project%20Overview/Campaign-Requirements.md),
   [CR-09](../00-Project%20Overview/Campaign-Requirements.md)).
5. **MO-P5 — Review.** Review the draft against [Campaign Standards](../00-Project%20Overview/Campaign-Standards.md)
   using [Review-HTML](../07-Prompt%20Library/Review-HTML.md). Review is performed by someone other
   than the author ([CR-16](../00-Project%20Overview/Campaign-Requirements.md)).
6. **MO-P6 — QA.** Pass the [QA Checklist](../07-Prompt%20Library/QA-Checklist.md) in full before
   approval ([CR-15](../00-Project%20Overview/Campaign-Requirements.md),
   [CS-16](../00-Project%20Overview/Campaign-Standards.md)).
7. **MO-P7 — Approve.** Record approval before the campaign may be scheduled
   ([CR-17](../00-Project%20Overview/Campaign-Requirements.md)).
8. **MO-P8 — Hand off to the platform.** Deliver the approved campaign to the sending platform via
   the integration points in [04-Technical/Integrations.md](../04-Technical/Integrations.md), and
   schedule it for the calendar date ([CR-14](../00-Project%20Overview/Campaign-Requirements.md)).

## Roles & responsibilities

The people accountable for each step — author, reviewer, approver — are defined in
[Stakeholders](../00-Project%20Overview/stakeholders.md). This section assumes the separation of
duties required by [CR-16](../00-Project%20Overview/Campaign-Requirements.md): the reviewer and
approver of a monthly campaign are not its author.

## What is monthly-specific vs shared

To keep this section free of duplication:

- **Monthly-specific (defined here):** cadence and lead time, the `MO-S#` email structure
  (notably the editorial intro and multi-feature roundup), and the `MO-P#` production steps in
  their monthly form.
- **Shared (referenced, not restated):** functional requirements
  ([Campaign Requirements](../00-Project%20Overview/Campaign-Requirements.md)), the quality bar
  ([Campaign Standards](../00-Project%20Overview/Campaign-Standards.md)), brand rules
  ([03-Brands](../03-Brands/)), assets ([06-Assets Library](../06-Assets%20Library/)), prompts
  ([07-Prompt Library](../07-Prompt%20Library/)), and technical implementation
  ([04-Technical](../04-Technical/)).

The [Weekly Campaign](../01-Weekly%20Campaign/overview.md) section is the counterpart for the
weekly cadence and shares this framework; the two differ only in cadence, audience emphasis, and
composition.

---

_Status: Draft for review. Last updated: 2026-07-10._
