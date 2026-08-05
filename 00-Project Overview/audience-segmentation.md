# Audience & Segmentation

This section defines **who** each scheduled campaign is sent to, and the thinking behind those choices. It
is the single home for audience selection referenced by [CR-06](Campaign-Requirements.md) and by the
weekly and monthly production steps (`WK-P2` / `MO-P2`). It explains *why* we segment before it lists
*how*, so a new team member can make sound audience decisions rather than copy past ones.

> **Scope boundary.** This document governs the audience of **scheduled weekly and monthly campaigns**. It
> does **not** define the audiences of automated, trigger-based journeys (welcome, abandoned cart, winback,
> etc.) — those are owned by the separate **Klaviyo Flow project** (see [Scope](scope.md)). Where the two
> meet, this document gives **coordination** guidance only.

> **On confirmed values.** This is a **framework**, not a live segment definition. Real thresholds (what
> counts as "active", VIP spend levels, engagement windows) are **business decisions** and are marked
> **To Be Confirmed (Business Decision Required)**. Nothing here is invented; confirmed brand facts are
> cited with their existing confidence tags.

## Segmentation Philosophy

- **Right person, right message, right moment.** Segmentation exists to raise relevance, which is what
  lifts opens, clicks and conversion while holding down unsubscribes. It is not about slicing the list into
  ever-smaller pieces for its own sake.
- **Every send targets a defined audience.** Sending to "everyone" is a deliberate decision, not a default
  ([CR-06](Campaign-Requirements.md)). The audience is named in the brief (see the
  [Campaign Planning Framework](campaign-planning-framework.md)).
- **Start broad, refine with evidence.** Early sends establish a baseline (mirroring
  [Success Metrics](success-metrics.md)); segments are tightened as engagement and purchase data accrue,
  not guessed up front.
- **Protect the sender reputation.** Continuing to mail long-disengaged addresses harms deliverability for
  everyone; segmentation is how we stop doing that.
- **Respect frequency across channels.** A customer who sits in several segments — and may also be inside an
  automated flow — must not be over-mailed. Coordination is a first-class concern (see
  [Recommended Klaviyo Flow relationships](#recommended-klaviyo-flow-relationships-coordination-only)).

## Purpose of Customer Segmentation

Segmentation serves four business purposes:

1. **Relevance** — matching offer, tone and product mix to intent (new vs returning vs VIP vs lapsing).
2. **Deliverability** — mailing engaged people keeps inbox placement healthy for the high-stakes sends.
3. **Efficiency** — the right audience makes a campaign's result readable and its budget effective.
4. **Measurement** — comparing like audiences over time is what makes performance review meaningful.

## Active vs Inactive Customers

The most fundamental split. **Active** = engaged or purchased within a defined engagement window;
**inactive** = beyond it.

- **Why it matters.** Active subscribers are the core audience for most scheduled campaigns; inactive
  handling protects deliverability and usually belongs to an automated re-engagement flow (out of scope
  here).
- **The engagement window itself** (e.g. days since last open, click, or purchase) is a
  **To Be Confirmed (Business Decision Required)** value, and may differ per brand.

| Concept | Business meaning | Defining criteria |
|---------|------------------|-------------------|
| Active | Recently engaged and/or purchased | `[engagement window — To Be Confirmed (Business Decision Required)]` |
| Inactive | No engagement beyond the window | `[lapse threshold — To Be Confirmed (Business Decision Required)]` |
| Suppressed | Should not be mailed (hard bounce, complaint, unsubscribe) | Platform-governed; always excluded |

## Weekly Campaign Segments

- **Purpose.** Broad, steady reach that keeps the brand front-of-inbox and the list warm (see the
  [Weekly Playbook](../Playbooks/Weekly-Playbook.md)).
- **Default audience.** The brand's **engaged subscribers**. Exact definition (which activity qualifies,
  over what window) — **To Be Confirmed (Business Decision Required)**.
- **Typical exclusions.** Long-inactive addresses; optionally, very recent purchasers of the featured
  range. Exclusion rules — **To Be Confirmed (Business Decision Required)**.

## Monthly Campaign Segments

- **Purpose.** A broader, more editorial send; may reach slightly wider than the weekly to re-surface the
  brand to marginally-less-active subscribers.
- **Default audience.** Engaged subscribers, optionally widened. The width of any re-engagement reach —
  **To Be Confirmed (Business Decision Required)**.

## Product Launch Segments

- **Purpose.** A premium announcement to those most likely to care — not a discount blast (see the
  [Launch Playbook](../Playbooks/Launch-Playbook.md)).
- **Candidate audiences.** Engaged subscribers; and/or past purchasers of the related range; and/or a
  category-interest segment. Which of these, and any interest signals used — **To Be Confirmed (Business
  Decision Required)**.

## Winback Segments

- **Purpose.** Re-engage customers who have lapsed past the active window.
- **Important boundary.** **Automated winback is a *flow*** and is owned by the separate Klaviyo Flow
  project (out of scope here). A scheduled **re-engagement campaign** may still be run when explicitly
  approved — for example a seasonal "we've missed you" send — but it must be **coordinated with the winback
  flow** so the same customer is not hit by both.
- **Criteria.** Lapse thresholds and eligibility — **To Be Confirmed (Business Decision Required)**.

## VIP Customers

- **Purpose.** Recognise and retain the highest-value, most-loyal customers — early access, appreciation,
  priority offers.
- **Definition.** Typically a value/frequency (RFM-style) threshold. The actual spend, order-count or
  recency thresholds — **To Be Confirmed (Business Decision Required)**, and likely per brand.

## New Customers

- **Purpose.** Introduce the brand and range gently to recently-acquired customers/subscribers.
- **Boundary.** A structured **welcome journey is a flow** (out of scope). For scheduled campaigns, "new
  customers" is a segment we may include or intentionally exclude to avoid clashing with the welcome flow.
- **Definition.** Days since first purchase or subscription — **To Be Confirmed (Business Decision
  Required)**.

## Returning Customers

- **Purpose.** Nurture repeat buyers who already know the brand — the reliable core of scheduled-campaign
  revenue.
- **Definition.** More than one purchase within a defined period — the period and order-count threshold are
  **To Be Confirmed (Business Decision Required)**.

## B2B vs B2C considerations

Audience orientation **varies by brand**, and it changes tone, timing and product framing. The following
reuses existing documented facts (with their confidence tags); it invents nothing.

| Brand | Orientation | Basis |
|-------|-------------|-------|
| SS (Safety Sector) | **B2B** — builders, construction groups, facility operators, government & bulk buyers | [Confirmed] in the [SS brand doc](../03-Brands%20MD%20Files/SS.md) |
| SC (SectorCare) | Leans **consumer / older audience** (readability-sensitive) | [Inferred] from the readability rule (`CLAUDE.md` §6.4) |
| RDD (Retail Display Direct) | **To Be Confirmed (Business Decision Required)** | RDD brand facts not yet confirmed |
| Stack | **To Be Confirmed (Business Decision Required)** | Brand doc not yet populated |

- **B2B implications.** Procurement and facilities buyers; bulk and government orders; weekday send timing;
  practical, credibility-led tone. Consider role/account-type segmentation once data exists.
- **B2C implications.** Individual shoppers; lifestyle and emotional framing; readability and accessibility
  weigh heavily (especially an older audience); send-timing tuned to consumer behaviour.
- **Any brand's definitive orientation and the segmentation attributes available** (account type, industry,
  purchase role) — **To Be Confirmed (Business Decision Required)**.

## Segment Selection Decision Tree

A repeatable way to choose the audience for any send. Work top to bottom; the thresholds referenced are the
To-Be-Confirmed values above.

1. **What is the campaign type and its one goal?** (from the brief). This sets the default audience — e.g.
   Weekly → engaged subscribers; Launch → those most likely to care.
2. **Apply the engagement filter.** Start from **active** subscribers unless the goal is explicitly
   re-engagement.
3. **Apply any theme/category interest.** If the campaign is about one range, prefer subscribers with a
   relevant interest or purchase history (where that data exists).
4. **Apply exclusions.** Remove very recent purchasers of the featured item where a repeat ask is
   pointless; remove anyone who should be reached by a **flow** instead (welcome, winback) to avoid
   double-messaging; always exclude suppressed profiles.
5. **Check size and deliverability.** If the resulting segment is too small to be worthwhile or skews
   heavily disengaged, widen or reconsider before sending.
6. **Record the audience in the brief.** The chosen segment and its rationale are captured per the
   [Campaign Planning Framework](campaign-planning-framework.md).

> The **branch thresholds** (what "active", "recent purchaser", "relevant interest" mean numerically) are
> **To Be Confirmed (Business Decision Required)**.

## Recommended Klaviyo Flow relationships (coordination only)

Automated flows are **out of scope** here; this is coordination so the overall customer experience stays
coherent (the roadmap's *Customer Journey Mapping* intent, [Future Roadmap](../05-Future/roadmap.md)).

- **Avoid double-messaging.** A customer actively inside a high-touch flow (welcome, abandoned cart,
  winback) should generally be **suppressed from an overlapping scheduled campaign** for that window.
- **Complement, don't compete.** Scheduled campaigns cover broad range/theme; flows cover lifecycle
  moments. New customers are usually served by the welcome flow first; lapsed customers by the winback
  flow first.
- **The exact suppression rules and the list of flows to coordinate with** — **To Be Confirmed (Business
  Decision Required)**, and must be agreed jointly with the Klaviyo Flow project.

## Business assumptions

- The subscriber list is **permission-based and consented**, consistent with the compliance floor
  ([Assumptions & Constraints](assumptions-and-constraints.md)).
- **Engagement and purchase data** needed to define segments exists in the sending/commerce platforms.
- Each send has **one primary audience**; layered micro-segments are an optimisation, not a starting point.
- Segment definitions may legitimately **differ per brand** and are owned with the relevant **Brand Owner**.

## Items requiring Bruce's confirmation

Each is a **To Be Confirmed (Business Decision Required)** item; none may be invented:

- [ ] The **active / inactive engagement window(s)** (per brand if they differ).
- [ ] **Weekly** default audience definition and standard exclusions.
- [ ] **Monthly** audience width and any re-engagement reach.
- [ ] **Product Launch** target audience (engaged vs past-purchasers vs interest-based).
- [ ] **Winback / re-engagement** eligibility and whether it runs as a campaign, a flow, or both.
- [ ] **VIP** definition (spend / frequency / recency thresholds), per brand.
- [ ] **New customer** and **returning customer** definitions (windows and order counts).
- [ ] Each brand's **B2B vs B2C orientation** (RDD, Stack) and available segmentation attributes.
- [ ] **Flow-coordination / suppression rules** (agreed with the Klaviyo Flow project).
- [ ] Which **segments already exist** in each brand's Klaviyo account (to reuse, not recreate).
