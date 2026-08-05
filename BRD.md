# Business Requirements Document — Weekly & Monthly Email Campaign System

> ⚠️ **Compiled document — do not edit directly.**
> This file is the **assembled, review-ready** version of the BRD. It is generated from the
> modular source files in the section folders (`00-Project Overview/`, `01-Weekly Campaign/`,
> etc.), which remain the **single source of truth**. Any change must be made in the modular
> source and this file regenerated. Edits made here directly will be lost on the next compile.
>
> **Compiled:** 2026-08-04 · **Scope of this compile:** expands the two highest-priority business
> frameworks from stubs to drafted sections — **Audience & Segmentation** and **Content Calendar & Cadence**
> (Part I, framework-level; specific segment values, send days/times and lead times remain *To Be
> Confirmed*). Same-day earlier compile added **Campaign Performance Review & Optimization**, **Feedback
> Knowledge Base**, and **2.7 Assumptions and Constraints**. Prior compile (2026-07-16) added the
> File-Driven System V2 chapters (Campaign Types, Product Launch Workflow, Holiday Workflow, File-Driven
> Architecture, Execution Order, Campaign Playbooks) plus all previously drafted sections.

## About this document

This is the master Business Requirements Document for the **Weekly & Monthly Email Campaign
System** — the primary business document and the review copy for sign-off. It logically combines
the modular documentation into one continuous document.

It is written **for people first** and organised **business-first**: the strategy and planning
chapters (the *why*) come first in **Part I**, followed by requirements, standards, campaign
execution, and brands in **Part II**, and finally technical implementation and reference material
(the *how*) in **Part III**. This BRD is distinct from `CLAUDE.md`, which is the operating manual
for the assisting tool; the BRD explains strategy and intent, not implementation mechanics.

Because the BRD is still being authored, this compile contains **only the sections that have real
content**. Sections that are not yet drafted are omitted from the body and listed as
*Not yet drafted* in the [Document status](#document-status) table below, with links to their
modular source. Regenerating this file after more sections are drafted will expand it.

Within this document, cross-references to included sections jump to the relevant heading. References
to sections that are not yet drafted link out to their modular source file.

## Document status

| # | Section | Status |
|---|---------|--------|
| — | Introduction & orientation (README) | ✅ Drafted |
| 00 | Executive Vision | ✅ Drafted |
| 00 | Business Problems | ✅ Drafted |
| 00 | Campaign Strategy | ✅ Drafted |
| 00 | Holiday Campaign Framework | ✅ Drafted |
| 00 | Campaign Planning Framework | ✅ Drafted |
| 00 | Campaign Types | ✅ Drafted |
| 00 | Product Launch Workflow | ✅ Drafted |
| 00 | File-Driven Architecture | ✅ Drafted |
| 00 | Execution Order | ✅ Drafted |
| 00 | Campaign Playbooks | ✅ Drafted |
| 00 | Campaign Psychology | ✅ Drafted |
| 00 | Human Workflow | ✅ Drafted |
| 00 | Campaign Performance Review & Optimization | ✅ Drafted |
| 00 | Feedback Knowledge Base | ✅ Drafted |
| 00 | Executive Summary | ✅ Drafted |
| 00 | Objectives & Goals | ✅ Drafted |
| 00 | Scope | ✅ Drafted |
| 00 | Stakeholders | ✅ Drafted |
| 00 | Campaign Requirements | ✅ Drafted |
| 00 | Campaign Standards | ✅ Drafted |
| 00 | Success Metrics & Measurement | ✅ Drafted |
| 00 | Assumptions & Constraints | ✅ Drafted |
| 00 | Audience & Segmentation | ✅ Drafted (framework; specific segment values *To Be Confirmed*) |
| 00 | Content Calendar & Cadence | ✅ Drafted (framework; send days/times & lead times *To Be Confirmed*) |
| 01 | Weekly Campaign — Overview | ✅ Drafted |
| 02 | Monthly Campaign — Overview | ✅ Drafted |
| 03 | Brands — Shared Standards | ✅ Drafted |
| 03 | Brands — SS | ✅ Drafted (populated from approved SS sources; some values *Inferred* / *To be confirmed*) |
| 03 | Brands — RDD | ✅ Drafted (brand code, website & standard elements confirmed; all brand-specific values *To be confirmed*) |
| 03 | Brands — SC | ⬜ Not yet drafted — [source](03-Brands/SC.md) |
| 03 | Brands — Stack | ⬜ Not yet drafted — [source](03-Brands/Stack.md) |
| 04 | Technical | ⬜ Not yet drafted — [source](04-Technical/) |
| 05 | Future / Roadmap | ✅ Drafted |
| 06 | Assets Library | ⬜ Not yet drafted — [source](06-Assets%20Library/) |
| 07 | Prompt Library | ⬜ Not yet drafted — [source](07-Prompt%20Library/) |
| 08 | Glossary | ⬜ Not yet drafted — [source](08-Glossary/Terms.md) |
| 09 | Decision Log | ✅ Drafted |

## Table of contents

- [Introduction and Orientation](#introduction-and-orientation)

**Part I — Business Strategy & Planning (the *why*)**
- [Executive Vision](#executive-vision)
- [Business Problems](#business-problems)
- [Business Goals](#business-goals)
- [Campaign Strategy](#campaign-strategy)
- [Holiday Campaign Framework](#holiday-campaign-framework)
- [Campaign Planning Framework](#campaign-planning-framework)
- [Audience & Segmentation](#audience--segmentation)
- [Content Calendar & Cadence](#content-calendar--cadence)
- [Campaign Types](#campaign-types)
- [Product Launch Workflow](#product-launch-workflow)
- [Holiday Workflow](#holiday-workflow)
- [File-Driven Architecture](#file-driven-architecture)
- [Execution Order](#execution-order)
- [Campaign Playbooks](#campaign-playbooks)
- [Campaign Psychology](#campaign-psychology)
- [Success Measurement & KPIs](#success-measurement--kpis)
- [Human Workflow](#human-workflow)
- [Campaign Performance Review & Optimization](#campaign-performance-review--optimization)
- [Feedback Knowledge Base](#feedback-knowledge-base)
- [Decision Log](#decision-log)
- [Future Roadmap](#future-roadmap)

**Part II — Requirements, Standards, Execution & Brands (the specification)**
- [2. Project Overview](#2-project-overview)
  - [2.1 Executive Summary](#21-executive-summary)
  - [2.2 Objectives and Goals](#22-objectives-and-goals)
  - [2.3 Scope](#23-scope)
  - [2.4 Stakeholders](#24-stakeholders)
  - [2.5 Campaign Requirements](#25-campaign-requirements)
  - [2.6 Campaign Standards](#26-campaign-standards)
  - [2.7 Assumptions and Constraints](#27-assumptions-and-constraints)
- [3. Weekly Campaign](#3-weekly-campaign)
- [4. Monthly Campaign](#4-monthly-campaign)
- [5. Brands](#5-brands)
  - [5.1 Shared Standards](#51-shared-standards)
  - [5.2 SS](#52-ss)
  - [5.3 RDD](#53-rdd)

**Part III — Technical & Reference (the *how*)**
- [Technical & Reference](#technical--reference)

---

## Introduction and Orientation

This documentation set is the **primary planning document** for the Weekly & Monthly Email
Campaign System. It is written before implementation, in line with the agreed "plan first, then
build" approach, and serves as the single source of truth for what the system must do, the
standards it must meet, and how campaigns are produced across all supported brands.

> **Scope note:** This BRD covers the **Weekly and Monthly Email Campaign System only**. It is
> intentionally **separate from the Klaviyo Flow documentation**. Automated, trigger-based flows
> (welcome, abandoned cart, win-back, etc.) are documented and maintained elsewhere and are out of
> scope here. See [Scope](#23-scope).

### Supported brands

The system is designed as a **unified** framework that supports four brands. Brand-specific details
are never duplicated across sections — they live only in the Brand documentation:

| Code | Reference |
|------|-----------|
| RDD | [5.3 RDD](#53-rdd) |
| SS | [5.2 SS](#52-ss) |
| SC | [Brands — SC](03-Brands/SC.md) |
| Stack | [Brands — Stack](03-Brands/Stack.md) |
| Shared standards (all brands) | [5.1 Shared Standards](#51-shared-standards) |

### How this documentation is organised

The full section map and the drafting status of every section are shown in the
[Document status](#document-status) table above. This compiled document reproduces the drafted
sections in the order below; the modular source files remain the editable origin of each section.

### Document conventions

- **Unified first.** Anything that applies to every brand is written once, in the shared location,
  and referenced — never copied.
- **No duplication across sections.** Each fact has one home; other sections link to it.
- **Brand-neutral by default.** Where behaviour depends on a brand, the text references the relevant
  Brand document rather than stating brand specifics inline.
- **Living document.** Sections are versioned as they are approved; unreviewed sections remain
  placeholders until content is signed off.
- **Stable identifiers.** Requirements use `CR-##`, standards `CS-##`, weekly structure/process
  `WK-S#`/`WK-P#`, monthly structure/process `MO-S#`/`MO-P#`, and architecture decisions `ADR-###`.

---

# Part I — Business Strategy & Planning

> The chapters in Part I explain **why** the system exists, the **strategy** behind our campaigns,
> and **how the human team plans and runs** them. They are written for people first. The detailed
> specification (requirements, standards, execution, brands) follows in Part II, and technical
> implementation in Part III.

## Executive Vision

To make every scheduled marketing email we send feel like it came from one confident, well-run brand
family — professionally designed, on-message, and produced quickly enough that the team can focus on
strategy instead of rebuilding the same email from scratch each week.

We are building a **repeatable campaign engine**, not a collection of one-off emails. Over time this
engine should let us launch a high-quality campaign for any brand, for any occasion, in a fraction of
the time it takes today, while raising quality rather than lowering it.

**Why this project exists.** Marketing email is one of the most cost-effective channels we own: it
reaches customers who already know us, it is measurable, and it drives repeat revenue. Yet its quality
has depended too much on who happened to build a given send and how much time they had. This project
turns campaign production into a documented, repeatable system so quality and consistency come from the
process, not from heroics.

**Why documentation matters.** It makes knowledge shared rather than personal (removing single points of
failure), makes quality repeatable (a written standard can be reviewed and held to), speeds up
onboarding of new people and brands, and — in line with our "plan before building" principle — gives us
the plan we build from.

**Why consistency matters.** Consistency is not sameness. Each brand keeps its own voice and look.
Consistency means a customer always recognises the brand, always finds the email easy to read, and
always trusts what they see — in July or December, on a phone or a laptop. Consistent structure also
compounds: every reusable component we standardise makes the *next* campaign cheaper and better.

**The three-horizon view.** *Now* — a reliable, documented weekly and monthly process across all brands.
*Next* — a richer toolkit: holiday/seasonal library, brand templates, assisted review. *Later* — a
measured, semi-automated system (dynamic product selection, analytics, testing). See the
[Future Roadmap](#future-roadmap). This vision is realised through the objectives in
[Objectives and Goals](#22-objectives-and-goals) and measured by [Success Measurement & KPIs](#success-measurement--kpis).

## Business Problems

Naming the problems plainly keeps the project honest: every standard and process step should trace back
to one of these.

1. **Inconsistent email design** — layout, spacing, typography, and buttons varied between sends and
   brands, eroding trust and making the brands look less professional than they are.
2. **Repeated campaign themes and messaging** — without a plan, sends repeat the same angle and hero,
   training customers to ignore us.
3. **Duplicated work** — the same header, footer, product grid, and coupon block were rebuilt every week.
4. **Repeated mistakes** — oversized images that break on mobile, unverified coupons, out-of-stock
   products, broken links — because lessons were never written down.
5. **Knowledge trapped in one person's head** — critical know-how lived with individuals, a single point
   of failure.
6. **No campaign planning system** — campaigns were produced reactively near send date rather than
   planned against a calendar of seasons, holidays, and priorities.
7. **Hard to scale across brands** — each new brand multiplied manual effort because nothing was shared.
8. **Quality depended on time available, not on a standard** — there was no gate a campaign had to pass
   before going out.

These are commercial problems, not cosmetic ones: inconsistency and repetition reduce open and click
rates; duplicated work and rework inflate cost and delay sends; trapped knowledge creates risk; and the
absence of planning means missing the high-intent moments (holidays, seasons, EOFY) that drive the most
revenue. [Business Goals](#business-goals) defines the outcomes that resolve them.

## Business Goals

The goals below are the outcomes that resolve the [Business Problems](#business-problems). Detailed
objectives, guiding principles, and non-goals are specified in
[Objectives and Goals](#22-objectives-and-goals); the measures are in
[Success Measurement & KPIs](#success-measurement--kpis).

- **Increase campaign quality** — raise and hold a reliable quality bar on every send via
  [Campaign Standards](#26-campaign-standards) and an enforced review gate.
- **Improve consistency** — one recognisable, professional experience per brand, every time.
- **Reduce production time** — standard structure, shared assets, and templates so effort is spent once.
- **Improve collaboration** — clear roles, briefs, and a shared source of truth (see [Human Workflow](#human-workflow)).
- **Build reusable assets** — components, templates, and a holiday library that compound over time.
- **Scale across brands** — a thin brand layer over a shared framework, so new brands add little effort.
- **Prepare for future automation** — a clean, documented process is the foundation the
  [Future Roadmap](#future-roadmap) builds on.

## Campaign Strategy

Every campaign should earn its place in the inbox. Before we send, we should be able to answer: *why
this, why now, and what do we want the customer to do?* Campaigns fall into a small number of repeatable
**types**; knowing the type sets the tone, offer logic, product mix, and design direction — which is
what makes production fast and consistent. Two principles run through all types: **right message, right
moment**, and **value before ask**.

| Type | When to use | Why | Expected customer behaviour |
|------|-------------|-----|-----------------------------|
| **Weekly** | Every week (always-on) | Keep the brand present; surface fresh product; steady baseline revenue | Browse, click to explore, incremental purchases |
| **Monthly** | Once a month | Step back to a theme, category, or brand story | Re-engage, discover, higher-consideration purchases |
| **Holiday** | Fixed calendar dates | Capture high-intent shopping moments | Time-bound, gift/deal-driven purchases; urgency |
| **Seasonal** | Turn of a season | Align range with seasonal needs | Needs-based, time-of-year purchasing |
| **Product launch** | New / hero product | Build awareness and desire for one product | Learn, click to product page, early adoption |
| **Clearance / sale** | End of range, overstock, promo | Move stock; reward deal-seekers | Fast, price-led purchasing |
| **Educational** | Range benefits from explanation | Build trust; reduce hesitation | Read, learn, return with confidence |
| **Customer appreciation** | Loyalty moments | Strengthen relationship; retention | Feel valued; redeem a thank-you offer |
| **Brand awareness** | Establishing / repositioning a brand | Communicate who the brand is | Recognise and remember; softer response |

**Choosing well:** start from the calendar and the business goal, not the product; keep **one primary
objective per send**; vary the type week to week to stay fresh; and match copy length to type (concise
for weekly/clearance, warmer and longer for seasonal/holiday/educational/appreciation). Over time, let
performance data (see [Success Measurement & KPIs](#success-measurement--kpis)) reshape the mix per brand.
The fixed calendar anchors are documented in the [Content Calendar](00-Project%20Overview/content-calendar.md).

## Holiday Campaign Framework

Holiday campaigns are among the highest-intent, highest-revenue moments of the year. This is a planning
library: the Campaign Manager selects an occasion and uses its entry as the starting brief, then adapts
it to the specific brand (voice, colours, coupon conventions from the [Brands](#5-brands) section) and to
the current-year dates in the [Content Calendar](00-Project%20Overview/content-calendar.md). The calendar
is Australian-market first (all brands ship Australia-wide).

**Planning principles:** plan early (weeks ahead, not the final days); respect the mood (celebratory and
gift-led vs practical and value-led); verify every offer is created and active before send; and for big
events, plan a short sequence (tease → launch → last chance) rather than a single email.

For each occasion below: **Purpose · Theme · Typical products · Promotion ideas · Design direction ·
Customer psychology · Business objective.**

- **Christmas** — Capture peak gifting. Warmth and giving. Gift-friendly heroes and bundles. Gift guides,
  bundles, shipping cut-offs. Festive but on-brand, clear last-order dates. Generosity + time pressure.
  Maximise Q4 revenue and order value.
- **New Year** — "Fresh start" motivation. New beginnings and goals. Items supporting new routines,
  independence, safety. New-year offer. Clean, optimistic. Motivation and optimism. Re-activate after the
  holiday lull.
- **Easter** — Long-weekend and autumn transition. Family, home, getting out and about. Family/home and
  outing items. Long-weekend sale. Light and family-warm. Relaxed break spending. Lift a quieter period.
- **Black Friday** — The biggest deal moment. Genuine, unmissable savings; urgency. Best-sellers and
  heroes. Headline storewide offer, tiered discounts, tease→launch→last-chance. Bold, high-contrast,
  clear code and deadline. Deal-seeking and FOMO. Maximise volume and acquisition.
- **Cyber Monday** — Extend and close the weekend. "Last chance", online-only. Carry-over best-sellers.
  Final-hours messaging. Urgent, countdown-led, consistent with Black Friday. Urgency and
  regret-avoidance. Capture procrastinators.
- **EOFY (End of Financial Year)** — Capitalise on the strong June "tax-time" mindset. Value and
  practicality, "sorted before 30 June". Practical/higher-value equipment. EOFY sale, clearance, bundle
  value. Confident and value-forward. Practicality and deadline. Drive a strong end-of-June peak.
- **Australia Day** — National moment, local angle. Proudly Australian, local, community. Broad range with
  "Australian owned" trust signals. Australia Day sale. Clean and tasteful (avoid cliché). Local pride and
  trust. Reinforce local-supplier positioning; lift January.
- **Mother's Day** — Gifting for mothers/carers. Care, appreciation, comfort. Comfort and wellbeing items.
  "For Mum" gift guide and bundles. Warm and soft. Gratitude and care. Capture seasonal gifting.
- **Father's Day** — Gifting for fathers/carers. Practicality and reliability. Practical, useful items.
  "For Dad" gift guide. Clean and practical. Appreciation. Capture seasonal gifting.
- **Labour Day** — Long-weekend sale (date varies by state). A well-earned break/deal. Broad range and
  best-sellers. Long-weekend sale. Simple and upbeat. Relaxed long-weekend mood. Lift long-weekend sales.
- **Boxing Day** — Major post-Christmas sale. Big clearance, "treat yourself". Clearance, overstock,
  best-sellers. Deep clearance, stepped discounts. Bold and high-urgency. Self-gifting and bargain-hunting.
  Clear stock; capture strong demand.

## Campaign Planning Framework

Every campaign is planned before it is built. We complete a one-page brief for each send — it forces the
"why" before the "how", keeps campaigns distinct, and gives the reviewer and approver a clear standard.

| Field | What it answers |
|-------|-----------------|
| **Campaign goal** | Why are we sending this? (one sentence, tied to a business goal or calendar moment) |
| **Campaign type** | Which type (see [Campaign Strategy](#campaign-strategy))? |
| **Target audience** | Who is this for — the brand's customers, or a defined segment? |
| **Main offer** | The single most important value or hook |
| **Featured products** | The grid — verified in stock, on-brand, on-theme |
| **Hero product** | The one product or idea the hero communicates |
| **Campaign theme** | The unifying idea and tone (must be fresh vs recent sends) |
| **Primary CTA** | The one action we most want (above the fold) |
| **Secondary CTA** | Optional; must serve a different purpose/destination (no duplicate CTAs) |
| **Expected customer emotion** | What they should feel (see [Campaign Psychology](#campaign-psychology)) |
| **Expected customer action** | Click, browse, buy, read, redeem, save for later |
| **Success criteria** | How we'll judge it (see [Success Measurement & KPIs](#success-measurement--kpis)) |
| **Risk assessment** | What could go wrong (offer not active, stock risk, date clash, deliverability, brand-fit) |

A short, consistent brief prevents the two most expensive failure modes: building the wrong thing, and
discovering a blocker (dead coupon, out-of-stock hero) only at QA. Confirm the risky items — is the
coupon active? are products in stock? are the dates right? — *early*.

## Audience & Segmentation

_Source: [`00-Project Overview/audience-segmentation.md`](00-Project%20Overview/audience-segmentation.md)._

Defines **who** each scheduled campaign is sent to, and the reasoning behind the choice — the single home
for audience selection referenced by [CR-06](#25-campaign-requirements) (`WK-P2` / `MO-P2`). Philosophy:
right person, right message, right moment; **every send targets a defined audience** (sending to "everyone"
is a decision, not a default); start broad and refine with evidence; protect deliverability by not mailing
the long-disengaged; and respect frequency across channels.

It frames the standard segments — **active vs inactive**, Weekly, Monthly, Product Launch, Winback, VIP,
New and Returning customers — plus **B2B vs B2C** considerations (SS is [Confirmed] B2B; SC leans
consumer/older-audience; RDD and Stack *To Be Confirmed*), a **segment-selection decision tree**, and
**flow-coordination** guidance. Because automated flows (welcome, abandoned cart, winback) are owned by the
separate Klaviyo Flow project ([Scope](#23-scope)), this document gives **coordination only** where the two
meet. It is a **framework**: real thresholds — the engagement window, VIP levels, new/returning definitions
— are business decisions marked **To Be Confirmed (Business Decision Required)** and are never invented.

## Content Calendar & Cadence

_Source: [`00-Project Overview/content-calendar.md`](00-Project%20Overview/content-calendar.md)._

The **single source of truth for scheduling** referenced by [CR-04](#25-campaign-requirements) (`WK-P1` /
`MO-P1`): what sends, when, for which brand, and how far ahead it must be prepared. Cadence logic:
anchor the year on fixed dated events (EOFY, BFCM, Christmas — see the
[Holiday Campaign Framework](#holiday-campaign-framework)), then fill the gaps with the always-on cadence;
plan ahead, not reactively; Australian-market first.

Confirmed **frequencies**: one **Weekly per brand per week** and one **Monthly per brand per month**
([CR-01](#25-campaign-requirements)); **Product Launch** is event-driven (readiness, not a slot, sets the
date); Seasonal, Holiday and Promotional planning follow their frameworks. It also documents the
**asset-preparation, review, approval and scheduling** timelines against the existing `WK-P#` / `MO-P#`
steps, and the **post-campaign review** loop (see
[Campaign Performance Review & Optimization](#campaign-performance-review--optimization)). Specific **send
days, times and lead-time durations** are owned by the calendar and marked **To Be Confirmed**; current-year
holiday/seasonal dates are confirmed per year.

## Campaign Psychology

Good campaigns are built on an understanding of the customer, not just the product. Design every campaign
against three questions, in order:

1. **What should the customer FEEL?** Emotion drives attention and memory — reassurance and confidence
   (considered/assistive products), excitement and urgency (sales), warmth and gratitude (appreciation,
   gifting), or optimism (new year, seasonal).
2. **What should the customer THINK?** The rational follow-through: *"this is right for me / someone I
   care about", "this brand is trustworthy and local", "this is a genuine deal", "this will make daily
   life easier."* Trust signals (Australian owned, fast shipping, support, NDIS where relevant) support
   the thought.
3. **What should the customer DO?** One clear action, made obvious and easy, reachable above the fold.

**Emotion in the hero banner.** The hero carries most of the emotional load: it should communicate a
feeling at a glance before any copy is read, show the *outcome* (a person enjoying a day out) rather than
just the object, set up the theme, and lead the eye to the primary action.

**Lifestyle photography vs catalogue images.** Lifestyle imagery (people, real settings, outcomes) is
stronger for emotional, aspirational moments — the hero of seasonal, appreciation, awareness, or
"everyday outings" campaigns. Catalogue images (clean, on white) are stronger for the product grid, where
the job is clarity and easy scanning. **Lead with lifestyle to create feeling; support with catalogue to
enable decisions.** Do not swap approved lifestyle creative for plain product shots merely to save effort.

## Success Measurement & KPIs

Metrics turn the [Business Goals](#business-goals) into something we can track and improve. Targets are
set per brand; early sends establish the baseline before firm targets are fixed.

**Marketing performance:** Open Rate (subject/timing/reputation), Click-Through Rate (content, offer, CTA
strength), Conversion Rate (real commercial effectiveness), Revenue (bottom line vs baseline/target),
Bounce Rate (list quality/deliverability), Unsubscribe Rate (frequency/relevance — an early warning).
Read them together: high open but low CTR points to content/offer; healthy CTR but low conversion points
to landing/price; rising unsubscribes suggests too-frequent or off-target sending.

**Operational / quality:** Campaign Production Time (efficiency goal), QA Issues per campaign (quality of
production), Brand Consistency Score (consistency goal, reviewer-assessed), Rework Rate (gaps in
briefs/standards/templates), On-Time Send Rate (planning discipline).

We baseline first, review on a cadence, and act on the read — feeding findings into the campaign-type
mix, templates and standards, and the [Decision Log](#decision-log). Formal analytics, attribution, and
A/B testing are on the [Future Roadmap](#future-roadmap); until then we use the platform's native
reporting plus reviewer assessment.

## Human Workflow

How the **human team** takes a campaign from idea to launch and back again. (How the assisting tool
supports production is documented separately in `CLAUDE.md` and not repeated here.) It is a loop: every
campaign ends by feeding lessons into the next.

1. **Planning** — the Campaign Manager works from the calendar and decides which campaign to run and why.
2. **Proposal / Brief** — written up via the [Campaign Planning Framework](#campaign-planning-framework).
3. **Review of the brief** — sanity-check the offer, stock, freshness, and dates before any design.
4. **Approval to proceed** — confirm the brief is worth building.
5. **Design & production** — produced against [Campaign Standards](#26-campaign-standards) and brand
   rules, using shared assets and templates.
6. **QA** — an independent reviewer (never the author) checks against the standards and QA checklist,
   including desktop + mobile rendering.
7. **Launch / Send** — scheduled and sent; the final approved version is recorded.
8. **Reporting** — results captured against the brief's success criteria and the programme KPIs.
9. **Continuous improvement** — lessons fed back into templates, standards, and the [Decision Log](#decision-log).

Responsibilities follow the RACI in [Stakeholders](#24-stakeholders). Core principles: **plan before
building**; **one quality gate, always**; **fix the system, not just the send**; and **keep humans in
charge** — a person reviews and approves every campaign before it goes out, with the reviewer/approver
never being the author.

## Campaign Performance Review & Optimization

This chapter defines what happens **after a campaign is sent** — how we review its result and turn that
read into a better next campaign. It closes the loop that [Human Workflow](#human-workflow) opens at its
Reporting and Continuous-improvement stages, giving the programme a repeatable rhythm rather than an
ad-hoc glance at the numbers. It does **not** redefine the metrics — those live once in
[Success Measurement & KPIs](#success-measurement--kpis) and are referenced, not restated.

**Why it matters.** The system already sets a quality bar *before* send (brief, standards, QA gate).
Without an equal discipline *after* send, results are observed but rarely acted on, and the same missed
opportunity repeats. A light, consistent review makes improvement compound — the direct expression of
"improve the system, not just the send".

**Two review rhythms.** Neither is heavy; both are recorded.

| Rhythm | When | Question it answers | Owner |
|--------|------|---------------------|-------|
| **Per-campaign review** | Shortly after each send, once results settle | Did *this* send meet the goal set in its brief? | Campaign Manager |
| **Programme review** | On a regular cadence across many sends | Is the *mix* working, and what should change in templates, standards, or the type mix? | Campaign Manager (Sponsor informed) |

**Per-campaign review** captures a short read (a page, not a report) against the brief's own success
criteria (see [Campaign Planning Framework](#campaign-planning-framework)) and the programme KPIs: result
vs intent; the **primary metric for the type** named in its [playbook](#campaign-playbooks); the read
across metrics *together* (never one number alone); and one thing to keep and one thing to change.

**Programme review** steps back to the portfolio: are the right [campaign types](#campaign-strategy)
running per brand in the right proportion; are there recurring QA/rework patterns to fix once at the
standard or template; and which lessons should be promoted into a playbook, a standard, or the
[Decision Log](#decision-log).

**From finding to improvement.** An observation only has value once it changes something: state it as a
small testable idea, change one thing at a time, observe against the same metric, and promote the winner
to where it lasts (template, standard, playbook Lessons Learned, or Decision Log). A finding left only in
a review note will be relearned.

**Relationship to formal testing.** Structured A/B testing, attribution, and consolidated analytics are on
the [Future Roadmap](#future-roadmap) (Horizon 3) and are not assumed here; until they land, this loop uses
native platform reporting, reviewer judgement, and disciplined before/after comparison. When the A/B
Testing Framework graduates, it sharpens the "observe against the same metric" step — it does not replace
this rhythm. Roles follow the RACI in [Stakeholders](#24-stakeholders): the Campaign Manager owns both
reviews and the decision to change; the Reviewer/QA supplies the quality signal; the Sponsor is informed.

## Decision Log

A running record of significant business and design decisions — **what** was decided, **why**, and
**who** owns it — so the team isn't re-litigating settled questions from memory. Entries are never
deleted; a reversed decision is superseded by a new entry. (Full log maintained in the
[modular source](09-Architecture%20Decisions/Decision-Log.md).)

| # | Decision | Reason | Date | Owner | Status |
|---|----------|--------|------|-------|--------|
| D-01 | Plan before building | Reduce rework; align on direction first | 2026-07-10 | Project Owner | Approved |
| D-02 | Unified framework, thin brand layer | Eliminate duplication; scale across brands | 2026-07-10 | Project Owner | Approved |
| D-03 | Keep separate from the Klaviyo Flow project | Distinct lifecycles and ownership | 2026-07-10 | Project Owner | Approved |
| D-04 | Independent review/approval before send (reviewer ≠ author) | Protect quality; catch author-blind errors | 2026-07-10 | Project Owner | Approved |
| D-05 | Verify stock on the product page, not category listings | Category pages misreport availability | 2026-07-14 | Reviewer/QA | Approved |
| D-06 | Keep images email-safe; optimise the *same* approved creative, don't substitute | Oversized images break on mobile; substitutions damage the design | 2026-07-14 | Reviewer/QA | Approved |
| D-07 | SC coupons are fixed-dollar ("$20 off orders over $200"); no % unless a special arrangement is approved | Aligns with SC's commercial policy | 2026-07-14 | Brand Owner (SC) | Approved |
| D-08 | Every weekly send uses a fresh angle/theme/hero | Repetition trains customers to disengage | 2026-07-14 | Campaign Manager | Approved |

## Future Roadmap

Everything here is a **proposal**, not a commitment; items move into scope only after stakeholder review
(see [Scope](#23-scope)). Sequencing follows the three-horizon view in the
[Executive Vision](#executive-vision). Full detail in the [modular source](05-Future/roadmap.md).

- **Next — enrich the toolkit:** Holiday Campaign Library (ready-to-brief kits per occasion), Brand
  Templates (approved starting points per brand), AI Review System (assisted pre-QA that flags issues
  before human review).
- **Later — reduce manual effort:** Automatic Product Selection (pull in-stock, on-theme products from
  the commerce platform), Dynamic Hero Banner Generation (assisted, human-reviewed hero creation).
- **Later — measure & optimise:** Campaign Analytics (consolidated KPI view), A/B Testing Framework
  (test subject lines, offers, creative, layout), Customer Journey Mapping (coherence with the separate
  automated flows).

Items graduate from the roadmap only after a proposal is reviewed, approved, moved into scope, and
recorded in the [Decision Log](#decision-log) — consistent with "plan before building".

## Campaign Types

_Source: [`00-Project Overview/campaign-types.md`](00-Project%20Overview/campaign-types.md)._

Different customer moments need different emails, so the system recognises **ten campaign types**, each
with its own psychology, hero, copy, CTA, product strategy and quality bar. The first planning decision
for any send is *which type is this?* — everything downstream follows from that answer.

| Type | The moment it serves | Primary success signal |
|------|----------------------|------------------------|
| **Weekly** | Recurring heartbeat send; broad product coverage | Click-through |
| **Monthly** | Larger roundup / editorial narrative | Revenue per recipient |
| **Product Launch** | New product/range as news; premium, not discount-led | New-product traffic + first sales |
| **Holiday** | Dated calendar event (EOFY, BFCM, Christmas) | Revenue in the window |
| **Seasonal** | Season-change range refresh; emotional, lifestyle-led | Range engagement |
| **Category** | Deep dive into one range with buying guidance | In-range conversion |
| **Clearance** | Genuine markdowns, honest finite-stock urgency | Sell-through / units |
| **Brand Story** | Values, provenance, trust; low product density | Downstream engagement lift |
| **Educational** | How-to, compliance, buying guides; low pressure | Assisted conversion |
| **Automation** | Triggered/lifecycle content (flows live in the separate Klaviyo Flow project) | per flow |

The tying rule: **never reuse the Weekly layout for another type.** Each type has a dedicated
[playbook](#campaign-playbooks) and generate prompt.

## Product Launch Workflow

_Source: [`00-Project Overview/product-launch-workflow.md`](00-Project%20Overview/product-launch-workflow.md)._

A launch introduces a new product/range **as news** — awareness, understanding and desire, then a click
to a live product page. It is premium and benefit-led, not a discount push. The workflow: capture the
brief with an **approved SKU list** → **verify every SKU via the BigCommerce API** (not storefront
search, which hides unpublished items) confirming `visible=true`, in stock, non-zero price and a **live
URL returning HTTP 200**, and present a **mapping table for approval before building** → apply the brand
layer → build the launch-specific layout → QA across real clients → Output only when every grid product
is live. A hidden product (`visible=false`) returns 404 and is a dead link; it may appear in a *draft*
only, clearly marked "launching soon", and blocks Output until published and re-verified. This gate was
learned on the RDD launch (2026-07), where 9 of 13 approved SKUs were newly-created and hidden.

## Holiday Workflow

_Source: [`00-Project Overview/holiday-campaign-framework.md`](00-Project%20Overview/holiday-campaign-framework.md)
(see the Holiday Campaign Framework chapter above)._

Holiday sends are built around a **real deadline** (EOFY, Black Friday/Cyber Monday, Christmas, sale
windows). The offer and its expiry are explicit and verified active in the commerce platform before send,
the promo title is freshly written for the event (never a recycled coupon heading), and shipping cut-off
dates are surfaced. Success is measured on **total revenue in the window**, not a single-day open rate.

## File-Driven Architecture

_Source: [`00-Project Overview/file-driven-architecture.md`](00-Project%20Overview/file-driven-architecture.md)._

Every campaign is produced by moving a send through fixed **stage folders** under
`Brands/<Brand>/Campaigns/<Type>/`: `Brief/` → `References/` → `Assets/` → `Draft/` → `Review/` →
`Output/`. **Every brand supports every campaign type** (the same ten type folders under each brand), and
all brands share one framework (`Templates/`, `Components/`, `Shared/`) with only brand-dependent values
differing at generation. The folder state *is* the workflow status, which makes every send repeatable,
auditable and scalable.

## Execution Order

_Source: [`00-Project Overview/execution-order.md`](00-Project%20Overview/execution-order.md)._

Every task follows one order, most-authoritative to most-specific: **1** read `CLAUDE.md` → **2** read
the BRD → **3** read the brand's approved sources → **4** read the campaign-type playbook → **5** read the
generate prompt + send brief → **6** generate → **7** QA → **8** update Review notes → **9** feed reusable
lessons back into `CLAUDE.md`. Two permanent guardrails: **if information is missing, stop and ask**
(never invent), and **choose the campaign type first**.

## Campaign Playbooks

_Source: [`00-Project Overview/campaign-playbooks.md`](00-Project%20Overview/campaign-playbooks.md);
playbooks in [`Playbooks/`](Playbooks/)._

A playbook is the **strategy brief for one campaign type**, with twelve fixed sections: Purpose, Business
Goal, Customer Psychology, Copywriting Style, Design Direction, Hero Strategy, CTA Strategy, Product
Strategy, KPIs, Bruce Feedback, Common Mistakes, Lessons Learned. There is one playbook per type (Weekly,
Monthly, Product Launch, Holiday, Seasonal, Category, Clearance, Brand Story, Educational, Automation).
Playbooks explain *why*; the matching generate prompts explain *how*. They are living documents — each
completed campaign feeds a lesson back in.

## Feedback Knowledge Base

_Source: [`00-Project Overview/feedback-knowledge-base.md`](00-Project%20Overview/feedback-knowledge-base.md)._

A **single index** to the standing feedback that governs how campaigns are produced — the directions that
must be honoured on every relevant send — so recurring, cross-cutting feedback can be **seen in one place**
rather than rediscovered send by send. It is an **index, not a second copy**: the authoritative wording of
each item stays in its home (a [playbook](#campaign-playbooks)'s Bruce Feedback section, a
[Campaign Standard](#26-campaign-standards), or a `CLAUDE.md` rule), and on any conflict the home wins.

Type-specific feedback lives in that type's playbook; **cross-cutting** feedback is themed here with a link
to its home — for example *value before the ask*, *fresh every send*, *prove it in the real client*,
*preserve what works*, *premium editorial restraint*, *readability first*, and *real, live, verified
links*. New standing feedback is recorded once in its home (playbook, standard/`CLAUDE.md`, or the
[Decision Log](#decision-log)), then indexed here if it recurs across types — never pasted. Keeping one
indexed view over many single homes preserves the single-source-of-truth rule while giving the team a fast
way to see all standing feedback at once.

---

# Part II — Requirements, Standards, Execution & Brands

> Part II is the detailed specification: the project overview, the functional requirements and quality
> standards every campaign must meet, the weekly and monthly execution process, and the brand rules.

## 2. Project Overview

### 2.1 Executive Summary

#### Purpose

This document introduces the **Weekly & Monthly Email Campaign System** — a unified, repeatable
framework for planning, producing, and publishing scheduled marketing emails across all supported
brands (RDD, SS, SC, and Stack).

It exists to replace ad-hoc, manually built campaigns with a consistent, well-documented process
that any team member can follow to produce on-brand, high-quality emails predictably and
efficiently.

#### Background

Scheduled email campaigns are currently produced on a recurring basis but without a single agreed
standard for structure, assets, or quality. This leads to inconsistency between brands, duplicated
effort, and a heavy reliance on individual knowledge. As the number of brands and the campaign
cadence grow, a documented system is needed to keep output consistent and scalable.

#### What this system covers

The system governs two recurring, calendar-driven campaign types:

- **Weekly campaigns** — higher-frequency, timely communications. See [3. Weekly Campaign](#3-weekly-campaign).
- **Monthly campaigns** — lower-frequency, broader communications. See [4. Monthly Campaign](#4-monthly-campaign).

Both share a common foundation — requirements, standards, brand rules, assets, and production
prompts — while allowing each campaign type and brand to differ where needed.

#### What this system does not cover

This BRD is deliberately **separate from the Klaviyo Flow documentation**. Automated,
event-triggered flows (for example welcome, abandoned cart, and win-back journeys) are out of scope
and documented independently. The precise boundary is defined in [Scope](#23-scope).

#### Approach

In line with the agreed guidance to **plan before building**, this documentation is completed and
approved first and acts as the primary reference for implementation. It is authored as a **unified**
framework: anything common to all brands is written once and shared, while brand-dependent detail
lives only in the [Brand documentation](#5-brands).

#### Expected outcomes

- A consistent, on-brand experience across every brand and campaign.
- A faster, more reliable production process with less rework.
- Reduced dependence on individual knowledge through clear, reusable documentation.
- A scalable foundation that can absorb new brands, campaign types, and enhancements.

Detailed objectives are defined in [Objectives and Goals](#22-objectives-and-goals), and the
measures of success are defined in [Success Metrics](00-Project%20Overview/success-metrics.md).

### 2.2 Objectives and Goals

This section defines *why* the Weekly & Monthly Email Campaign System exists and what it is expected
to achieve. Objectives describe the intended outcomes; goals make those outcomes specific and
testable. Quantified targets are tracked separately in
[Success Metrics](00-Project%20Overview/success-metrics.md).

#### Business objectives

1. **Consistency** — deliver a consistent, on-brand experience across every brand and every
   scheduled campaign, regardless of who produces it.
2. **Efficiency** — reduce the time and manual effort required to produce each campaign by
   standardising structure, assets, and content generation.
3. **Quality** — raise and hold a reliable quality bar for every send, as defined in
   [Campaign Standards](#26-campaign-standards).
4. **Scalability** — support additional brands, campaign types, and volume without redesigning the
   process.
5. **Knowledge retention** — capture the production process in documentation so it does not depend
   on any single individual.

#### System goals

The system is designed to meet the objectives above by:

- Providing a single, repeatable process for producing weekly and monthly campaigns.
- Maintaining one **unified** framework in which shared rules are written once and brand-specific
  rules live only in the [Brand documentation](#5-brands).
- Supplying reusable assets and prompts (see [Assets Library](06-Assets%20Library/) and
  [Prompt Library](07-Prompt%20Library/)) to accelerate and standardise production.
- Enforcing a defined review and QA step before any campaign is published.

#### Guiding principles

- **Plan first, then build.** Documentation is approved before implementation begins.
- **Unified, not duplicated.** Common information has exactly one home and is referenced, not copied.
- **Brand-neutral by default.** Where behaviour depends on a brand, the documentation references the
  relevant Brand document rather than stating specifics inline.
- **Future-proof.** Content is written so it remains valid as brands and campaigns grow; deferred
  ideas are captured in [Future Enhancements](05-Future/roadmap.md).
- **Separation of concerns.** Scheduled campaigns are documented here and kept distinct from
  automated Klaviyo Flows.

#### Non-goals

To keep the objectives focused, the following are explicitly **not** goals of this system (see
[Scope](#23-scope) for the full boundary):

- Designing or documenting automated, trigger-based Klaviyo Flows.
- Defining brand identity itself — brand rules are owned by the [Brand documentation](#5-brands).
- Replacing the email sending platform or its native reporting.

### 2.3 Scope

This section defines the boundary of the Weekly & Monthly Email Campaign System: what this BRD
governs, and what it explicitly does not. It exists to prevent overlap with adjacent work — most
importantly the **Klaviyo Flow** project.

#### In scope

The following are covered by this documentation:

- **Weekly email campaigns** — their process, cadence, and structure. See [3. Weekly Campaign](#3-weekly-campaign).
- **Monthly email campaigns** — their process, cadence, and structure. See [4. Monthly Campaign](#4-monthly-campaign).
- **A unified production framework** applied consistently across all supported brands (RDD, SS, SC,
  Stack).
- **Campaign requirements and standards** — the functional behaviour and quality bar every campaign
  must meet. See [Campaign Requirements](#25-campaign-requirements) and
  [Campaign Standards](#26-campaign-standards).
- **Shared brand application** — how brand rules are referenced during production, sourced from the
  [Brand documentation](#5-brands).
- **Supporting libraries** — reusable assets and prompts. See [Assets Library](06-Assets%20Library/)
  and [Prompt Library](07-Prompt%20Library/).
- **Technical implementation of campaigns** — assets, product source, dynamic content, integrations,
  and data/segments. See [Technical](04-Technical/).

#### Out of scope

The following are **not** covered by this documentation:

- **Klaviyo Flows.** All automated, event- or trigger-based journeys (for example welcome,
  browse/abandoned-cart, and win-back flows) are owned by the separate Klaviyo Flow project. This
  BRD does not modify, reference, or depend on that work.
- **Brand identity definition.** The BRD applies brand rules but does not define them; the source of
  truth for each brand is its [Brand document](#5-brands).
- **Email platform selection and administration.** The underlying sending platform, its account
  configuration, and its native reporting are assumed to exist and are not specified here beyond the
  integration points noted in [Technical / Integrations](04-Technical/Integrations.md).
- **One-off or ad-hoc campaigns** that do not follow the recurring weekly or monthly cadence, unless
  later brought under this framework.
- **Non-email channels** (for example SMS and push), except where a social media asset is produced
  as a by-product and governed by [Assets Library / Social Media](06-Assets%20Library/Social-Media.md).

#### Relationship to the Klaviyo Flow project

Scheduled campaigns (this BRD) and automated flows (the Klaviyo Flow project) are distinct bodies of
work with separate documentation and separate lifecycles. Where a topic could appear to belong to
both, it is documented here only if it is specific to scheduled weekly or monthly campaigns. Anything
trigger-driven belongs to the Flow project.

#### Scope changes

Scope is not fixed for all time. Proposed additions (for example a new campaign cadence or a new
channel) should be raised as [Future Enhancements](05-Future/roadmap.md) and moved into scope only
after review and approval by the stakeholders listed in [Stakeholders](#24-stakeholders).

### 2.4 Stakeholders

This section identifies the roles involved in the Weekly & Monthly Email Campaign System and their
responsibilities. Roles are described generically so the documentation remains valid as individuals
change. Named owners for each role are recorded and maintained by the project owner and are
intentionally not hard-coded into this document.

#### Roles

| Role | Description |
|------|-------------|
| **Project Sponsor** | Owns the business case and provides final approval on scope and direction. |
| **Project Owner / Lead** | Accountable for the system overall; maintains this documentation and the list of named role owners. |
| **Campaign Manager** | Plans the campaign calendar and briefs each weekly and monthly campaign. |
| **Content Author** | Produces campaign copy and content, using the [Prompt Library](07-Prompt%20Library/). |
| **Designer / Asset Owner** | Produces and maintains assets to the standards in the [Assets Library](06-Assets%20Library/). |
| **Developer / Builder** | Produces campaign HTML and implements the [Technical](04-Technical/) requirements. |
| **Brand Owner** | Owns the rules for a given brand in the [Brand documentation](#5-brands); consulted whenever behaviour is brand-dependent. |
| **Reviewer / QA** | Reviews content and HTML against [Campaign Standards](#26-campaign-standards) and the QA checklist before publication. |
| **Approver** | Signs off the final campaign for release. |

#### Responsibility model (RACI)

The matrix below shows involvement per activity, using **R**esponsible, **A**ccountable,
**C**onsulted, **I**nformed. It describes responsibilities at the system level; detailed per-campaign
steps live in the [Weekly](#3-weekly-campaign) and [Monthly](#4-monthly-campaign) sections.

| Activity | Sponsor | Project Owner | Campaign Mgr | Content Author | Designer | Developer | Brand Owner | Reviewer/QA | Approver |
|----------|:------:|:-------------:|:------------:|:--------------:|:--------:|:---------:|:-----------:|:-----------:|:--------:|
| Maintain this documentation | I | A/R | C | C | C | C | C | C | I |
| Plan campaign calendar | I | A | R | C | I | I | C | I | I |
| Brief a campaign | I | I | A/R | C | C | I | C | I | I |
| Produce content | I | I | C | A/R | C | I | C | C | I |
| Produce / supply assets | I | I | C | C | A/R | C | C | C | I |
| Build campaign HTML | I | I | C | I | C | A/R | C | C | I |
| Apply brand rules | I | I | C | C | C | C | A/R | C | I |
| Review & QA | I | I | C | C | C | C | C | A/R | I |
| Final approval to send | A | I | C | I | I | I | C | C | R |

#### Notes

- A single person may hold more than one role, provided the review and approval of a campaign are
  performed by someone other than its author.
- Brand-dependent decisions always involve the relevant **Brand Owner**; this document never records
  brand-specific rules inline (see [5. Brands](#5-brands)).
- The current holder of each role is maintained by the Project Owner outside this BRD so the
  documentation does not require updating when personnel change.

### 2.5 Campaign Requirements

This section defines *what the Weekly & Monthly Email Campaign System must do* — the functional
requirements that every campaign, regardless of brand or cadence, is expected to satisfy. The quality
bar and non-functional expectations (accessibility, performance, consistency, etc.) are defined
separately in [Campaign Standards](#26-campaign-standards).

Requirements are written at the system level and remain deliberately brand-neutral. Where a
requirement depends on a brand, it references the [Brand documentation](#5-brands) rather than stating
the specifics here. Cadence-specific detail is documented in the [Weekly](#3-weekly-campaign) and
[Monthly](#4-monthly-campaign) sections.

#### How to read this section

Each requirement has a stable identifier (`CR-##`) so it can be referenced from other sections,
reviews, and QA. Requirements describe an outcome, not an implementation; the mechanism for meeting
them is documented under [Technical](04-Technical/).

#### Functional requirements

##### Campaign definition & cadence

- **CR-01 — Two campaign types.** The system must support two recurring, calendar-driven campaign
  types: **weekly** and **monthly**.
- **CR-02 — Multi-brand.** Every campaign type must be producible for each supported brand (RDD, SS,
  SC, Stack) using one unified process.
- **CR-03 — Scheduled, not triggered.** Campaigns must be planned and scheduled from the content
  calendar. Trigger/event-based sends are out of scope (see [Scope](#23-scope)).

##### Planning & briefing

- **CR-04 — Calendar-driven.** Each campaign must originate from the
  [Content Calendar](00-Project%20Overview/content-calendar.md), which defines its date, brand, and
  type.
- **CR-05 — Defined brief.** Each campaign must have a brief identifying its purpose, audience, key
  message, and featured content before production begins.
- **CR-06 — Audience selection.** Each campaign must target a defined audience/segment as described
  in [Audience & Segmentation](00-Project%20Overview/audience-segmentation.md).

##### Content production

- **CR-07 — Standard structure.** Each campaign must follow the agreed content structure for its type
  (weekly or monthly), so output is consistent and predictable.
- **CR-08 — Prompt-assisted generation.** Content and HTML must be producible using the reusable
  prompts in the [Prompt Library](07-Prompt%20Library/).
- **CR-09 — Brand application.** Campaigns must apply the correct brand rules by referencing the
  relevant [Brand document](#5-brands); brand specifics must not be re-authored per campaign.
- **CR-10 — Approved assets only.** Campaigns must use assets that conform to the
  [Assets Library](06-Assets%20Library/) standards (logos, icons, banners, product images, buttons,
  social).
- **CR-11 — Product and dynamic content.** Where a campaign features products or personalised/dynamic
  content, it must draw from the defined product source and dynamic content rules in
  [Technical](04-Technical/).

##### Output & delivery

- **CR-12 — Email HTML output.** Each campaign must produce email-ready HTML that renders correctly
  across the supported email clients defined in [Campaign Standards](#26-campaign-standards).
- **CR-13 — Required elements.** Each campaign must include the mandatory elements common to all
  sends (for example subject line, preheader, header, body, call(s) to action, and footer). The exact
  per-type composition is defined in the Weekly and Monthly sections.
- **CR-14 — Platform hand-off.** Completed campaigns must be deliverable to the sending platform via
  the integration points defined in [Technical / Integrations](04-Technical/Integrations.md), without
  depending on the separate Klaviyo Flow project.

##### Review, QA & approval

- **CR-15 — Mandatory review.** Every campaign must pass a review against
  [Campaign Standards](#26-campaign-standards) and the
  [QA Checklist](07-Prompt%20Library/QA-Checklist.md) before it can be approved.
- **CR-16 — Separation of duties.** A campaign must be reviewed and approved by someone other than
  its author (see [Stakeholders](#24-stakeholders)).
- **CR-17 — Approval before send.** No campaign may be scheduled to send without recorded approval.

##### Maintainability & growth

- **CR-18 — Reusable and repeatable.** The process must be repeatable for every cycle without
  redesign, relying on the shared framework and libraries.
- **CR-19 — Extensible.** The system must accommodate new brands or campaign types by extending the
  unified framework, not by duplicating it.

#### Traceability

These requirements are the reference point for the detailed process sections and for QA. Success
against them is measured through [Success Metrics](00-Project%20Overview/success-metrics.md), and any
requirement that cannot be met in the initial build should be recorded in
[Future Enhancements](05-Future/roadmap.md).

### 2.6 Campaign Standards

This section defines the **quality bar** every weekly and monthly campaign must meet — the
non-functional expectations that govern *how well* a campaign is produced, rather than *what* it must
contain (which is defined in [Campaign Requirements](#25-campaign-requirements)).

Standards are system-wide and brand-neutral. Where a standard depends on a brand — for example
specific colours, fonts, logos, or tone — this document states the expectation and defers the
specifics to the [Brand documentation](#5-brands). Asset-level detail is governed by the
[Assets Library](06-Assets%20Library/).

Each standard has a stable identifier (`CS-##`) for reference from reviews and QA.

#### Brand & consistency

- **CS-01 — On-brand.** Every campaign must comply with the applicable brand rules in
  [5. Brands](#5-brands). This document does not restate brand specifics.
- **CS-02 — Structural consistency.** Campaigns of the same type must be structurally consistent from
  cycle to cycle, so recipients experience a predictable format.
- **CS-03 — Unified framework.** Shared standards apply to all brands identically; only genuinely
  brand-dependent elements may differ, and only as defined in the Brand documents.

#### Content quality

- **CS-04 — Clear and concise.** Copy must be clear, correct, and free of spelling and grammatical
  errors.
- **CS-05 — Appropriate tone.** Tone of voice must match the applicable brand guidance in
  [5. Brands](#5-brands).
- **CS-06 — Accurate.** Product, pricing, and promotional details must be accurate at the time of
  send and sourced as defined in [Technical](04-Technical/).
- **CS-07 — Working links.** All links and calls to action must resolve to the correct, live
  destinations.

#### Design & rendering

- **CS-08 — Email-client compatibility.** Campaigns must render correctly across the supported email
  clients and both desktop and mobile viewports. The authoritative client matrix is maintained in
  [Technical / Integrations](04-Technical/Integrations.md).
- **CS-09 — Responsive.** Layouts must be responsive and legible on small screens.
- **CS-10 — Asset compliance.** All logos, icons, banners, product images, buttons, and social assets
  must meet the [Assets Library](06-Assets%20Library/) standards for format, dimensions, and quality.
- **CS-11 — Accessibility.** Campaigns should follow accessibility good practice — meaningful alt
  text, sufficient colour contrast, logical reading order, and a usable text-to-image balance.
- **CS-12 — Graceful degradation.** Campaigns must remain readable and actionable when images are
  blocked or fail to load.

#### Performance & deliverability

- **CS-13 — Reasonable weight.** Total email weight and image sizes must be optimised so the campaign
  loads quickly and avoids clipping in common clients.
- **CS-14 — Deliverability hygiene.** Campaigns must follow good deliverability practice, including a
  valid preheader, balanced content, and a compliant footer.
- **CS-15 — Compliance.** Campaigns must include the legally required elements for marketing email
  (for example sender identity and unsubscribe), consistent with the sending platform's configuration.

#### Process quality

- **CS-16 — QA before approval.** Every campaign must pass the
  [QA Checklist](07-Prompt%20Library/QA-Checklist.md) before approval.
- **CS-17 — Reviewed independently.** Review and approval must be performed by someone other than the
  author (see [Stakeholders](#24-stakeholders)).
- **CS-18 — Reproducible.** A campaign must be reproducible from its brief, assets, and prompts,
  without relying on undocumented individual knowledge.

#### Maintainability & future-proofing

- **CS-19 — Documented over tribal.** Any repeatable decision must be captured in this documentation
  rather than held informally.
- **CS-20 — Extensible without duplication.** Standards must be met by extending the shared framework;
  brand or campaign additions must not fork or copy shared standards.

#### Relationship to success metrics

These standards define the qualitative bar; the quantitative targets that indicate whether the system
is succeeding are defined in [Success Metrics](00-Project%20Overview/success-metrics.md). Where a
standard cannot yet be met, it should be logged in [Future Enhancements](05-Future/roadmap.md).

### 2.7 Assumptions and Constraints

_Source: [`00-Project Overview/assumptions-and-constraints.md`](00-Project%20Overview/assumptions-and-constraints.md)._

This section records the **assumptions** the plan depends on and the **constraints** it must work within.
Naming them protects the project: an assumption that later proves false, or a constraint that is
overlooked, is a common cause of rework and missed sends. Both are stated at the **business level only** —
specific unconfirmed values (send days, segments, platform credentials, brand specifics) stay in their
home documents marked *To be confirmed*, never assumed here.

**Key assumptions.** A recurring, calendar-driven cadence planned from the
[Content Calendar](00-Project%20Overview/content-calendar.md), not triggered journeys ([Scope](#23-scope));
Australian-market first across all brands; a commerce platform as the source of product truth (verified,
never invented); a sending platform that exists and is administered separately ([CR-14](#25-campaign-requirements));
a human reviewing and approving every send ([CR-16](#25-campaign-requirements)); a thin brand layer over a
shared framework; and documentation approved before build.

**Key constraints.** Email-client rendering reality and responsive behaviour ([CS-08](#26-campaign-standards)–[CS-12](#26-campaign-standards));
email-safe weight and deliverability ([CS-13](#26-campaign-standards), [CS-14](#26-campaign-standards)); the
legal marketing-email floor ([CS-15](#26-campaign-standards)); the accessibility floor ([CS-11](#26-campaign-standards));
the scope boundary with the separate Klaviyo Flow project ([Scope](#23-scope)); the firm "no invented
values" limit (stop and confirm rather than guess); and non-negotiable separation of duties
([CR-16](#25-campaign-requirements), [CS-17](#26-campaign-standards)).

**Dependencies & management.** The system depends on confirmed brand facts per [Brand document](#5-brands),
a maintained content calendar, and approved reusable libraries. Assumptions are reviewed when circumstances
change; a failed assumption or a changed constraint is recorded as a decision in the
[Decision Log](#decision-log) (or, for engineering standards, raised as an Architecture Decision) — never
absorbed informally.

---

## 3. Weekly Campaign

This section defines the **end-to-end process, cadence, and structure specific to weekly campaigns**.
It is the authoritative source for how a weekly campaign is planned, produced, reviewed, and
delivered, and for the composition of the weekly email itself (as deferred to here by
[CR-13](#25-campaign-requirements)).

It does not restate the system-wide rules. Functional requirements live in
[Campaign Requirements](#25-campaign-requirements), the quality bar in
[Campaign Standards](#26-campaign-standards), and brand specifics in the
[Brand documentation](#5-brands). This section describes only what is **particular to the weekly
cadence**; anything shared with monthly campaigns is referenced, not duplicated.

### Purpose of the weekly campaign

The weekly campaign is the recurring, high-cadence touchpoint with each brand's audience. Its role is
to maintain regular engagement — surfacing current products, offers, and timely messaging — within a
predictable format that recipients come to recognise. It is a **scheduled, calendar-driven** send,
not a triggered flow (see [Scope](#23-scope)).

Because it recurs frequently, the weekly campaign is optimised for **speed and repeatability**: a
fixed structure, reusable components, and prompt-assisted generation keep each cycle fast to produce
without redesign ([CR-18](#25-campaign-requirements)).

### Cadence & timing (weekly)

- **Frequency.** One weekly campaign per brand, per week.
- **Calendar-driven.** Each send's date, brand, and theme originate from the
  [Content Calendar](00-Project%20Overview/content-calendar.md), which is the single source of truth
  for scheduling ([CR-04](#25-campaign-requirements)). The specific send day and time per brand are
  defined there and are not fixed in this document.
- **Production lead time.** Production begins ahead of the send date so that briefing, generation,
  review, QA, and approval ([CR-15](#25-campaign-requirements)–[CR-17](#25-campaign-requirements)) all
  complete before the scheduled send. The standard lead time is maintained in the content calendar so
  it can be tuned per brand without editing this section.

> **To confirm during review:** the default send day/time and lead time per brand. These are owned by
> the content calendar; this section only requires that they exist and are respected.

### Weekly email structure

Every weekly campaign follows the same structure so output is consistent from cycle to cycle
([CS-02](#26-campaign-standards)) and across brands ([CR-07](#25-campaign-requirements)). The blocks
below are the weekly composition referenced by [CR-13](#25-campaign-requirements); each has a stable
identifier (`WK-S#`) for reference from the [QA Checklist](07-Prompt%20Library/QA-Checklist.md) and
reviews.

| ID | Block | Required | Purpose |
|------|-------|----------|---------|
| WK-S1 | Subject line | Yes | Drives the open; concise and on-brand. |
| WK-S2 | Preheader | Yes | Supports the subject line; never left as fallback text. |
| WK-S3 | Header / logo | Yes | Brand identification per the relevant [Brand document](#5-brands). |
| WK-S4 | Hero / lead message | Yes | The single primary message or offer for the week. |
| WK-S5 | Primary call to action | Yes | The main action; must resolve to a live destination ([CS-07](#26-campaign-standards)). |
| WK-S6 | Featured products / content | Conditional | Product or content blocks sourced per [Technical](04-Technical/Product-Source.md); included when the week features products. |
| WK-S7 | Secondary content | Optional | Supporting messages, secondary offers, or editorial. |
| WK-S8 | Footer | Yes | Sender identity, unsubscribe, and compliance elements ([CS-15](#26-campaign-standards)). |

Brand-dependent aspects of these blocks (colours, fonts, logo, tone, button styling) are never defined
here — they are applied from the [Brand documentation](#5-brands) and the
[Assets Library](06-Assets%20Library/) ([CS-01](#26-campaign-standards), [CS-10](#26-campaign-standards)).

### End-to-end production process (weekly)

Each weekly campaign moves through the same steps every cycle. Steps carry a `WK-P#` identifier for
traceability.

1. **WK-P1 — Pull the brief from the calendar.** Confirm the week's date, brand, and theme from the
   [Content Calendar](00-Project%20Overview/content-calendar.md), and establish the brief: purpose,
   audience, key message, and featured content ([CR-05](#25-campaign-requirements)).
2. **WK-P2 — Confirm the audience.** Select the target segment for the send as defined in
   [Audience & Segmentation](00-Project%20Overview/audience-segmentation.md)
   ([CR-06](#25-campaign-requirements)).
3. **WK-P3 — Gather assets.** Assemble approved assets (logos, banners, product images, buttons) that
   meet the [Assets Library](06-Assets%20Library/) standards ([CR-10](#25-campaign-requirements)).
   Where products are featured, source them per [Technical](04-Technical/Product-Source.md).
4. **WK-P4 — Generate content and HTML.** Produce copy and email HTML using the weekly prompts in the
   [Prompt Library](07-Prompt%20Library/Generate-Weekly-Campaign.md) and
   [Generate-HTML](07-Prompt%20Library/Generate-HTML.md), following the WK-S structure above and
   applying the correct [Brand](#5-brands) rules ([CR-08](#25-campaign-requirements),
   [CR-09](#25-campaign-requirements)).
5. **WK-P5 — Review.** Review the draft against [Campaign Standards](#26-campaign-standards) using
   [Review-HTML](07-Prompt%20Library/Review-HTML.md). Review is performed by someone other than the
   author ([CR-16](#25-campaign-requirements)).
6. **WK-P6 — QA.** Pass the [QA Checklist](07-Prompt%20Library/QA-Checklist.md) in full before
   approval ([CR-15](#25-campaign-requirements), [CS-16](#26-campaign-standards)).
7. **WK-P7 — Approve.** Record approval before the campaign may be scheduled
   ([CR-17](#25-campaign-requirements)).
8. **WK-P8 — Hand off to the platform.** Deliver the approved campaign to the sending platform via the
   integration points in [Technical / Integrations](04-Technical/Integrations.md), and schedule it for
   the calendar date ([CR-14](#25-campaign-requirements)).

### Weekly — roles & responsibilities

The people accountable for each step — author, reviewer, approver — are defined in
[Stakeholders](#24-stakeholders). This section assumes the separation of duties required by
[CR-16](#25-campaign-requirements): the reviewer and approver of a weekly campaign are not its author.

### Weekly — specific vs shared

To keep this section free of duplication:

- **Weekly-specific (defined here):** cadence and lead time, the `WK-S#` email structure, and the
  `WK-P#` production steps in their weekly form.
- **Shared (referenced, not restated):** functional requirements
  ([Campaign Requirements](#25-campaign-requirements)), the quality bar
  ([Campaign Standards](#26-campaign-standards)), brand rules ([5. Brands](#5-brands)), assets
  ([Assets Library](06-Assets%20Library/)), prompts ([Prompt Library](07-Prompt%20Library/)), and
  technical implementation ([Technical](04-Technical/)).

The [Monthly Campaign](#4-monthly-campaign) section mirrors this structure for the monthly cadence;
where the two differ, the difference is cadence, audience emphasis, and composition — not the
underlying framework.

---

## 4. Monthly Campaign

This section defines the **end-to-end process, cadence, and structure specific to monthly campaigns**.
It is the authoritative source for how a monthly campaign is planned, produced, reviewed, and
delivered, and for the composition of the monthly email itself (as deferred to here by
[CR-13](#25-campaign-requirements)).

It does not restate the system-wide rules. Functional requirements live in
[Campaign Requirements](#25-campaign-requirements), the quality bar in
[Campaign Standards](#26-campaign-standards), and brand specifics in the
[Brand documentation](#5-brands). This section describes only what is **particular to the monthly
cadence**; anything shared with weekly campaigns is referenced, not duplicated. It parallels the
[Weekly Campaign](#3-weekly-campaign) section — where the two differ, the difference is cadence,
audience emphasis, and composition, not the underlying framework.

### Purpose of the monthly campaign

The monthly campaign is the recurring, lower-cadence touchpoint with each brand's audience. Where the
weekly campaign maintains frequent, timely engagement, the monthly campaign takes a **broader, more
editorial view** — consolidating the month's themes, highlights, and featured content into a single,
higher-value send. It is a **scheduled, calendar-driven** send, not a triggered flow (see
[Scope](#23-scope)).

Like every campaign type, the monthly campaign is produced from the unified framework so it stays
**repeatable and consistent** cycle to cycle ([CR-18](#25-campaign-requirements),
[CS-02](#26-campaign-standards)), differing from the weekly campaign in composition and cadence rather
than in process.

### Cadence & timing (monthly)

- **Frequency.** One monthly campaign per brand, per calendar month.
- **Calendar-driven.** Each send's date, brand, and theme originate from the
  [Content Calendar](00-Project%20Overview/content-calendar.md), which is the single source of truth
  for scheduling ([CR-04](#25-campaign-requirements)). The specific send day and time per brand are
  defined there and are not fixed in this document.
- **Production lead time.** Because the monthly campaign is typically larger and more editorial than a
  weekly send, its production begins with enough lead time for briefing, generation, review, QA, and
  approval ([CR-15](#25-campaign-requirements)–[CR-17](#25-campaign-requirements)) to complete before
  the scheduled send. The standard lead time is maintained in the content calendar so it can be tuned
  per brand without editing this section.

> **To be confirmed during review:** the default send day/time and lead time per brand. These are
> owned by the content calendar; this section only requires that they exist and are respected. No
> values are assumed here.

### Monthly email structure

Every monthly campaign follows the same structure so output is consistent from cycle to cycle
([CS-02](#26-campaign-standards)) and across brands ([CR-07](#25-campaign-requirements)). The blocks
below are the monthly composition referenced by [CR-13](#25-campaign-requirements); each has a stable
identifier (`MO-S#`) for reference from the [QA Checklist](07-Prompt%20Library/QA-Checklist.md) and
reviews.

| ID | Block | Required | Purpose |
|------|-------|----------|---------|
| MO-S1 | Subject line | Yes | Drives the open; concise and on-brand. |
| MO-S2 | Preheader | Yes | Supports the subject line; never left as fallback text. |
| MO-S3 | Header / logo | Yes | Brand identification per the relevant [Brand document](#5-brands). |
| MO-S4 | Monthly theme / editorial intro | Yes | Sets the month's narrative; the framing that distinguishes the monthly from a weekly send. |
| MO-S5 | Hero / lead feature | Yes | The single primary feature or offer for the month. |
| MO-S6 | Primary call to action | Yes | The main action; must resolve to a live destination ([CS-07](#26-campaign-standards)). |
| MO-S7 | Featured products / content | Conditional | Product or content blocks sourced per [Technical](04-Technical/Product-Source.md); included when the month features products. The monthly send may carry more than one feature block (a roundup); the number is set per send from the brief, not fixed here. |
| MO-S8 | Secondary content | Optional | Supporting messages, secondary offers, or editorial. |
| MO-S9 | Footer | Yes | Sender identity, unsubscribe, and compliance elements ([CS-15](#26-campaign-standards)). |

Brand-dependent aspects of these blocks (colours, fonts, logo, tone, button styling) are never defined
here — they are applied from the [Brand documentation](#5-brands) and the
[Assets Library](06-Assets%20Library/) ([CS-01](#26-campaign-standards), [CS-10](#26-campaign-standards)).

The monthly structure parallels the weekly `WK-S#` blocks (see [3. Weekly Campaign](#3-weekly-campaign));
its distinguishing element is the editorial intro (`MO-S4`) and the potential for multiple feature
blocks under `MO-S7`.

### End-to-end production process (monthly)

Each monthly campaign moves through the same steps every cycle. Steps carry an `MO-P#` identifier for
traceability.

1. **MO-P1 — Pull the brief from the calendar.** Confirm the month's date, brand, and theme from the
   [Content Calendar](00-Project%20Overview/content-calendar.md), and establish the brief: purpose,
   audience, key message, and featured content ([CR-05](#25-campaign-requirements)).
2. **MO-P2 — Confirm the audience.** Select the target segment for the send as defined in
   [Audience & Segmentation](00-Project%20Overview/audience-segmentation.md)
   ([CR-06](#25-campaign-requirements)).
3. **MO-P3 — Gather assets.** Assemble approved assets (logos, banners, product images, buttons) that
   meet the [Assets Library](06-Assets%20Library/) standards ([CR-10](#25-campaign-requirements)).
   Where products are featured, source them per [Technical](04-Technical/Product-Source.md).
4. **MO-P4 — Generate content and HTML.** Produce copy and email HTML using the monthly prompts in the
   [Prompt Library](07-Prompt%20Library/Generate-Monthly-Campaign.md) and
   [Generate-HTML](07-Prompt%20Library/Generate-HTML.md), following the MO-S structure above and
   applying the correct [Brand](#5-brands) rules ([CR-08](#25-campaign-requirements),
   [CR-09](#25-campaign-requirements)).
5. **MO-P5 — Review.** Review the draft against [Campaign Standards](#26-campaign-standards) using
   [Review-HTML](07-Prompt%20Library/Review-HTML.md). Review is performed by someone other than the
   author ([CR-16](#25-campaign-requirements)).
6. **MO-P6 — QA.** Pass the [QA Checklist](07-Prompt%20Library/QA-Checklist.md) in full before approval
   ([CR-15](#25-campaign-requirements), [CS-16](#26-campaign-standards)).
7. **MO-P7 — Approve.** Record approval before the campaign may be scheduled
   ([CR-17](#25-campaign-requirements)).
8. **MO-P8 — Hand off to the platform.** Deliver the approved campaign to the sending platform via the
   integration points in [Technical / Integrations](04-Technical/Integrations.md), and schedule it for
   the calendar date ([CR-14](#25-campaign-requirements)).

### Monthly — roles & responsibilities

The people accountable for each step — author, reviewer, approver — are defined in
[Stakeholders](#24-stakeholders). This section assumes the separation of duties required by
[CR-16](#25-campaign-requirements): the reviewer and approver of a monthly campaign are not its author.

### Monthly — specific vs shared

To keep this section free of duplication:

- **Monthly-specific (defined here):** cadence and lead time, the `MO-S#` email structure (notably the
  editorial intro and multi-feature roundup), and the `MO-P#` production steps in their monthly form.
- **Shared (referenced, not restated):** functional requirements
  ([Campaign Requirements](#25-campaign-requirements)), the quality bar
  ([Campaign Standards](#26-campaign-standards)), brand rules ([5. Brands](#5-brands)), assets
  ([Assets Library](06-Assets%20Library/)), prompts ([Prompt Library](07-Prompt%20Library/)), and
  technical implementation ([Technical](04-Technical/)).

The [Weekly Campaign](#3-weekly-campaign) section is the counterpart for the weekly cadence and shares
this framework; the two differ only in cadence, audience emphasis, and composition.

---

## 5. Brands

The brand layer is the source of truth for brand identity. The **shared brand rules (5.1)** apply
identically to every brand; each brand's specific values live in its own subsection. SC and Stack are
not yet drafted — see the [Document status](#document-status) table.

### 5.1 Shared Standards

This subsection defines everything about branding that is **common across all supported brands** (RDD,
SS, SC, Stack). It is the single home for shared brand rules, in line with the "write once, reference
everywhere" convention: anything that applies to every brand lives here, and is never repeated in the
individual brand documents.

It is deliberately **brand-neutral**. It defines *how* branding works within the campaign framework and
*what* every brand document must specify — but it contains **no brand-specific values** (no colours,
typography, logos, tone, assets, domains, or segments). Those live only in
[5.3 RDD](#53-rdd), [5.2 SS](#52-ss), [SC](03-Brands/SC.md), and [Stack](03-Brands/Stack.md).

It also does not restate the campaign rules. Functional requirements are in
[Campaign Requirements](#25-campaign-requirements), the quality bar in
[Campaign Standards](#26-campaign-standards), and the per-cadence structure and process in
[3. Weekly Campaign](#3-weekly-campaign) and [4. Monthly Campaign](#4-monthly-campaign).

#### Purpose of the brand layer

The brand layer is the **source of truth for brand identity** within this system. Campaigns do not
define brand identity; they *apply* it. When a weekly or monthly campaign is produced, the correct
brand's rules are pulled from that brand's document and applied to the shared campaign structure
([CR-09](#25-campaign-requirements), [CS-01](#26-campaign-standards)).

This separation keeps the framework unified: one production process, one set of standards, and a thin
brand layer that varies only the genuinely brand-dependent details ([CS-03](#26-campaign-standards),
[CR-19](#25-campaign-requirements)).

#### Shared branding principles

These principles hold identically for every brand:

- **Single source of truth.** Each brand's identity is defined once, in its own brand document. No
  brand value is duplicated here or in any campaign document.
- **Unified framework, thin brand layer.** All brands share the same campaign structure (`WK-S#` /
  `MO-S#`) and process (`WK-P#` / `MO-P#`); only brand-dependent elements differ, and only as defined
  in the brand documents ([CS-03](#26-campaign-standards)).
- **Brand-neutral by default.** Shared documents reference "the applicable brand" and link to the brand
  layer rather than naming or hard-coding any one brand.
- **Extensible without duplication.** A new brand is added by creating one brand document that fulfils
  the contract below — not by forking the shared framework ([CR-19](#25-campaign-requirements),
  [CS-20](#26-campaign-standards)).

#### Where brand identity is applied

Brand identity maps onto the shared campaign structure at defined points. This mapping is the same for
every brand; the values applied at each point come from the brand document.

| Applied at | Shared structure block | Brand document supplies |
|------------|------------------------|-------------------------|
| Header / logo | WK-S3 / MO-S3 | The brand's logo and header treatment |
| Copy & messaging | WK-S4–WK-S7 / MO-S4–MO-S8 | The brand's tone of voice and messaging guidance |
| Calls to action | WK-S5 / MO-S6 | The brand's button/CTA styling |
| Colour, typography, imagery | All visual blocks | The brand's palette, fonts, and imagery style |
| Footer / sender identity | WK-S8 / MO-S9 | The brand's sender identity and footer details |

#### The brand document contract

Every brand document (RDD, SS, SC, Stack) must define the **same set of attributes**, so the brand
layer is consistent and any campaign can apply any brand the same way. This section defines *which
attributes* each brand document must specify; it does **not** specify their values.

Each brand document is expected to cover:

- **Brand identity** — name, brand code, and a short description of positioning.
- **Logo** — the brand's logo(s) and rules for their use, consistent with the
  [Logo Standards](06-Assets%20Library/Logo-Standards.md).
- **Colour palette** — the brand's colours and how they are used, applied within the accessibility
  expectations of [CS-11](#26-campaign-standards).
- **Typography** — the brand's fonts and hierarchy, with email-safe fallbacks.
- **Tone of voice** — how the brand speaks, so copy meets [CS-05](#26-campaign-standards).
- **Imagery style** — the brand's photographic/graphic style, applied within the
  [Assets Library](06-Assets%20Library/) standards.
- **Button / CTA styling** — the brand's treatment for calls to action, within the
  [Button Standards](06-Assets%20Library/Button-Standards.md).
- **Sender identity & footer** — the brand's from-name, sender details, and footer content needed to
  satisfy compliance ([CS-15](#26-campaign-standards)).
- **Brand-specific data** — any brand-specific segments, product sources, or domains, cross-referenced
  to [Technical](04-Technical/) and
  [Audience & Segmentation](00-Project%20Overview/audience-segmentation.md).

> Attribute **values** are owned exclusively by the individual brand documents. Where a brand has not
> yet documented an attribute from an approved source, it is recorded there as "To be confirmed" —
> never assumed in this shared document.

#### Shared standards that apply identically to all brands

The following are governed by [Campaign Standards](#26-campaign-standards) and apply to every brand
without variation. They are listed here so brand documents do **not** restate them:

- **Accessibility** — meaningful alt text, sufficient contrast, logical reading order
  ([CS-11](#26-campaign-standards)).
- **Responsive rendering** — legible on desktop and mobile across supported clients
  ([CS-08](#26-campaign-standards), [CS-09](#26-campaign-standards)).
- **Graceful degradation** — readable and actionable when images are blocked
  ([CS-12](#26-campaign-standards)).
- **Compliance & deliverability** — valid preheader, compliant footer, required marketing-email
  elements ([CS-14](#26-campaign-standards), [CS-15](#26-campaign-standards)).
- **Asset compliance** — all assets meet the [Assets Library](06-Assets%20Library/) standards
  ([CS-10](#26-campaign-standards)).

Where a brand needs to *differ* from a shared standard, that difference must be justified and recorded
in the brand document and, if it is a lasting decision, logged as an Architecture Decision (`ADR-###`)
in [Architecture Decisions](09-Architecture%20Decisions/Decision-Log.md).

#### Brands — shared vs brand-specific

To keep the boundary clean:

- **Shared (defined here):** the role of the brand layer, the shared branding principles, the
  brand-to-structure application mapping, the brand document contract, and the standards that apply
  identically to all brands.
- **Brand-specific (defined only in the brand documents):** every actual value — logo, colours,
  typography, tone, imagery, CTA styling, sender identity, and brand-specific data. See
  [5.3 RDD](#53-rdd), [5.2 SS](#52-ss), [SC](03-Brands/SC.md), and [Stack](03-Brands/Stack.md).

### 5.2 SS

This subsection defines the **brand-specific rules for SS**. It follows the brand document contract in
[5.1 Shared Standards](#51-shared-standards) and fills in the values for SS. It does not restate any
shared rule.

#### Sources & confidence

Values are sourced from the **approved SS brand documentation** (`BrandConfig.md` and `Design.md` at
`Klaviyo Flow and Claude Code/Brands/SS/`, reverse-engineered from an approved SS Customer Winback
email — a working spec, not yet an official brand guide) and the official website
<https://www.safetysector.com.au/>. Confidence tags: **[Confirmed]** = evidenced from an approved
source; **[Inferred]** = derived but not yet authoritative, confirm before production; **To be
confirmed** = not present in any approved source.

#### Brand identity

| Attribute | Value | Confidence |
|-----------|-------|------------|
| Brand code | **SS** | [Confirmed] |
| Brand name | Safety Sector (Safety Sector Pty Ltd) | [Confirmed] |
| Industry | Australian industrial / B2B safety products | [Confirmed] |
| Company | Sydney-based; distributor **and** manufacturer, 15+ years, with part-ownership in overseas production | [Confirmed, per footer] |
| Product range | Bollards, wheel stoppers, tactile indicators, stair nosings — to Australian safety standards | [Confirmed] |
| Audience | Builders, construction groups, facility operators, government & bulk buyers | [Confirmed] |
| In-market trust claims | Warranty up to 10 years · Australia-wide delivery · 100,000+ customers · 30-day returns | [Confirmed] |

#### Logo

Consistent with the [Logo Standards](06-Assets%20Library/Logo-Standards.md).

- **Primary logo (header / light backgrounds)** — "SAFETY SECTOR" wordmark, heavy condensed
  stencil/industrial uppercase; black wordmark with a red angular accent; ~220px, centered.
  **[Confirmed]** · `https://d3k81ch9hvuctc.cloudfront.net/company/T7SuPP/images/f4045d61-0ee2-41a3-8fbf-6281da7b3891.gif`
- **Secondary logo (footer / dark backgrounds)** — standalone red mark; ~180px (footer ~48px),
  centered. **[Confirmed]** · `https://d3k81ch9hvuctc.cloudfront.net/company/T7SuPP/images/f649010e-1543-4913-83fe-9c37cbcef1c3.png`
- **Usage.** Light backgrounds → black wordmark + red accent; dark backgrounds → red mark only.
  **[Confirmed]**
- **Dark-mode-safe (white) full wordmark** — **To be confirmed** (needed; not evidenced).

#### Colour palette

Usage must satisfy [CS-11](#26-campaign-standards). Hex values are sampled from screenshots unless
confirmed.

| Role | Colour | Approx. hex | Confidence |
|------|--------|-------------|------------|
| Primary / text / buttons | Black | `#000000` | [Confirmed] |
| Brand accent | Red | `~#E11B22` | [Inferred] |
| Base background | White | `#FFFFFF` | [Confirmed] |
| Support panel tint | Blush / pale pink | `~#FBEAEA` | [Inferred] |
| Footer background | Black | `#000000` | [Confirmed] |
| Footer body text | White | `#FFFFFF` | [Confirmed] |
| Footer links | Orange / amber | `~#F0A000` | [Inferred] |

**Palette intent [Inferred]:** high-contrast black/white with a single red accent; blush sparingly.
Exact brand hex values are an open confirmation item.

#### Typography

- Headlines: heavy-weight, near-condensed sans-serif, sentence case, left-aligned. **[Confirmed]**
- Body: regular-weight sans-serif, left-aligned. **[Confirmed]** · Footer: small regular sans-serif,
  centered. **[Confirmed]**
- Email-safe stack: `Arial, Helvetica, sans-serif` fallback. **[Inferred]**
- Hierarchy (suggested): H1 ~30px/800; body ~16px; footer ~12px. **[Inferred]**
- Exact brand display & body typefaces and precise px/line-heights — **To be confirmed.**

#### Tone of voice

Copy must meet [CS-05](#26-campaign-standards).

- Professional, dependable, no-nonsense, industrial/utilitarian; factual and credibility-led rather
  than playful. **[Inferred]**
- Avoid hype/clickbait; lead with the customer's context before the commercial ask. **[Inferred]**

#### Imagery style

Applies within the [Assets Library](06-Assets%20Library/) standards.

- No product/lifestyle photography in the approved source email. **[Inferred]** future standard: clean,
  well-lit product shots on white/neutral backgrounds (industrial catalog aesthetic); descriptive
  `alt` always. A definitive SS imagery style is **To be confirmed**.

#### Button / CTA styling

Must fall within the [Button Standards](06-Assets%20Library/Button-Standards.md).

- **Primary button** — solid **black** fill, **white** text, **sharp corners (0 radius)**, full-width;
  observed label "Shop Now". **[Confirmed]**
- **Footer navigation buttons** — black fill, thin white/outlined border, white text, sharp corners,
  2×2 grid. **[Confirmed]**
- **[Inferred]** Bold text; ≥44px tap height; one primary CTA per section, footer nav secondary.

#### Sender identity & footer

Must satisfy compliance ([CS-15](#26-campaign-standards)).

- **Company name** — Safety Sector (Safety Sector Pty Ltd). **[Confirmed]**
- **Company description (footer)** — "Dependable, high-quality safety solutions for builders,
  construction groups and facility operators across Australia. Sydney-based distributor and
  manufacturer for 15+ years. Range: bollards, wheel stoppers, tactile indicators, stair nosings —
  built to Australian safety standards." **[Confirmed, condensed]**
- **Address** — 3 Wordie Place, Padstow, NSW 2211, Australia. **[Confirmed]**
- **Contact email** — sales@safetysector.com.au. **[Confirmed]** · **Phone** — **To be confirmed.**
- **Social** — Facebook <https://www.facebook.com/safetysectorau/> · Instagram
  <https://www.instagram.com/safetysector.au/>. **[Confirmed]**
- **Footer navigation (reuse exact URLs):** All Products
  `https://www.safetysector.com.au/safety-sector/` [Provided; confirm intended target] · Shop By
  Category `https://www.safetysector.com.au/` · Government Orders
  `https://www.safetysector.com.au/government-orders/` **[Confirmed live]** · Bulk Deals
  `https://www.safetysector.com.au/bulk-deal/` **[Confirmed live]**
- **Compliance links** — Unsubscribe (`{% unsubscribe %}`), Manage Preferences
  (`{{ manage_preferences_url }}`). **[Confirmed]**
- **Privacy Policy / Terms / Shipping / Returns / FAQ URLs** — **To be confirmed.**

#### Brand-specific data

Cross-referenced to [Technical](04-Technical/) and
[Audience & Segmentation](00-Project%20Overview/audience-segmentation.md).

- **Website** — <https://www.safetysector.com.au/> **[Confirmed]**
- **Temporary product source** — <https://www.safetysector.com.au/products/> [Provided]; a live
  collection page, **not** a substitute for dynamic product data (no hardcoded names/prices).
- **Platform** — BigCommerce **[Confirmed per project docs]**. Store URL
  `https://www.safetysector.com.au` **[Confirmed storefront]** · Store Hash / Channel ID / Access
  Token — **To be confirmed** · Default currency AUD **[Inferred]** · Default product count 4
  **[Inferred]** · product feed / API endpoint / URL format / image ratio — **To be confirmed**.
- **Catalog range** — bollards, wheel stoppers, tactile indicators, stair nosings. **[Confirmed]**
- **Audience segments** — SS-specific segments **To be confirmed**.
- **Dynamic variables (confirm against the SS Klaviyo account):** `{{ first_name|default:'there' }}`,
  `{{ organization.name|default:'Safety Sector' }}`, `{{ manage_preferences_url }}`,
  `{% unsubscribe %}`, `{% catalog … %}`, `{% coupon_code … %}`. Source email literals: coupon
  `WELCOMEBACK`, discount `15%` — confirm static vs. dynamic coupon.

#### SS — outstanding items to confirm

Each is either **[Inferred]** (provisional value above, pending sign-off) or **To be confirmed** (no
value yet); none is authoritative until confirmed against an official SS source:

- [ ] Exact brand hex values (accent red, blush, footer link amber) — [Inferred]
- [ ] Brand display & body typefaces and exact px/line-heights — [Inferred]
- [ ] Dark-mode-safe (white) full wordmark asset
- [ ] Hosted URLs for the four trust icons
- [ ] Phone number
- [ ] Privacy Policy / Terms / Shipping / Returns / FAQ URLs
- [ ] "All Products" footer destination
- [ ] BigCommerce Store Hash, Channel ID, Access Token, product feed
- [ ] Default currency (AUD) and default product count (4) — [Inferred]
- [ ] SS-specific audience segments
- [ ] Coupon type per campaign (static `WELCOMEBACK` vs. dynamic)
- [ ] Tone of voice — confirm against an official brand source — [Inferred]

### 5.3 RDD

This subsection defines the **brand-specific rules for RDD**. It follows the brand document contract in
[5.1 Shared Standards](#51-shared-standards) and fills in the values for RDD. It does not restate any
shared rule.

#### Sources & confidence

Values are sourced from the **approved RDD brand documentation** (`BrandConfig.md` and `Design.md` at
`Klaviyo Flow and Claude Code/Brands/RDD/`) and the official website
<https://www.retaildisplaydirect.com.au/> (user-provided). ⚠️ The approved RDD sources currently
contain **no confirmed brand information** — nearly every value is marked `TODO` with an explicit "do
not guess" instruction. Confidence tags: **[Confirmed]** = evidenced; **[Inferred]** = derived, confirm
before use; **To be confirmed** = not present in any approved source.

> **Status of this brand.** RDD is at an early stage: only the brand code, website, temporary product
> source, and brand-agnostic standard compliance/dynamic elements are known. All brand-specific
> identity, visual, and configuration values are **To be confirmed** and must be populated from official
> RDD brand assets or provided screenshots. Nothing has been guessed.

#### Brand identity

| Attribute | Value | Confidence |
|-----------|-------|------------|
| Brand code | **RDD** | [Confirmed] |
| Brand name | _To be confirmed_ (source marks `TODO`/do-not-guess; domain `retaildisplaydirect.com.au` is the only lead, not a confirmed name) | To be confirmed |
| Industry / Company / Product range / Audience / Trust claims | _To be confirmed_ | To be confirmed |

#### Logo

- **To be confirmed.** Primary, secondary/dark, and dark-mode-safe logos and usage rules are not
  documented. When confirmed, consistent with the [Logo Standards](06-Assets%20Library/Logo-Standards.md).

#### Colour palette

- **To be confirmed.** Colours, hex values, and usage are not documented. Usage must satisfy
  [CS-11](#26-campaign-standards) when confirmed.

#### Typography

- **To be confirmed.** Display/body typefaces, hierarchy, and px/line-heights are not documented; shared
  baseline default is `Arial, Helvetica, sans-serif` until a brand face is confirmed.

#### Tone of voice

- **To be confirmed.** Tone, personality, and do/don't guidance are not documented. Copy must meet
  [CS-05](#26-campaign-standards) when confirmed.

#### Imagery style

- **To be confirmed.** Photographic/graphic style is not documented; applies within the
  [Assets Library](06-Assets%20Library/) standards when confirmed.

#### Button / CTA styling

- **To be confirmed.** Button fill, text colour, radius, size, and tap height are not documented; must
  fall within the [Button Standards](06-Assets%20Library/Button-Standards.md) when confirmed.

#### Sender identity & footer

Must satisfy compliance ([CS-15](#26-campaign-standards)).

- **Company name / description / privacy paragraph** — **To be confirmed.**
- **Address / contact email / support email / phone** — **To be confirmed.**
- **Social links / footer navigation** — **To be confirmed.**
- **Compliance links** — Unsubscribe (`{% unsubscribe %}`), Manage Preferences
  (`{{ manage_preferences_url }}`). **[Confirmed — standard, brand-agnostic]**
- **Privacy Policy / Terms / Shipping / Returns / FAQ URLs** — **To be confirmed.**

#### Brand-specific data

Cross-referenced to [Technical](04-Technical/) and
[Audience & Segmentation](00-Project%20Overview/audience-segmentation.md).

- **Website** — <https://www.retaildisplaydirect.com.au/> **[Confirmed — provided by user]**
- **Temporary product source** — <https://www.retaildisplaydirect.com.au/> [Provided]; a live page,
  **not** a substitute for dynamic product data (no hardcoded names/prices).
- **Platform / BigCommerce configuration** — **To be confirmed** (store URL, hash, channel ID, token,
  currency, product count, feed, API endpoint, URL format, image ratio all `TODO`; whether RDD is on
  BigCommerce is itself unconfirmed).
- **Audience segments** — **To be confirmed.**
- **Dynamic variables (standard, brand-agnostic):** `{{ first_name|default:'there' }}`,
  `{{ organization.name }}`, `{{ manage_preferences_url }}`, `{% unsubscribe %}`, `{% catalog … %}`,
  `{% coupon_code … %}`, `event.*`, `person.*`. **[Confirmed — standard]** Brand-specific custom
  properties — **To be confirmed.**

#### RDD — outstanding items to confirm

All remain **To be confirmed** until confirmed against official RDD brand assets or provided
screenshots:

- [ ] Brand identity — name, industry, company, products, audience, trust claims
- [ ] Brand voice / tone
- [ ] Colours & typography (hex values, typefaces, sizes)
- [ ] Logo assets (primary, dark, dark-mode-safe) and usage rules
- [ ] Hosted asset URLs (logos, social/trust icons, hero/banner/product placeholders)
- [ ] Social / policy URLs, contact email, phone, address
- [ ] Footer company name, description, navigation links
- [ ] BigCommerce Store Hash, Channel ID, Access Token, product feed (and whether RDD is on BigCommerce)
- [ ] Default currency and default product count
- [ ] Button / CTA styling (fill, radius, size)
- [ ] RDD-specific audience segments and custom properties
- [ ] Coupon type (static vs. dynamic) per campaign

---

# Part III — Technical & Reference

> Technical and reference material is placed last, on purpose: it is the *implementation detail* that
> supports the business strategy (Part I) and specification (Part II). Business intent comes first;
> the mechanics follow. `CLAUDE.md` is the operating manual for the assisting tool and is maintained
> separately from this BRD.

## Technical & Reference

The following reference material is maintained in its modular source folders and is summarised here as
an index. Several of these sections are still being drafted (see the
[Document status](#document-status) table); this index will expand as they are completed.

| Area | What it covers | Source |
|------|----------------|--------|
| **Technical implementation** | Assets, product source, dynamic content, integrations, data & segments | [04-Technical](04-Technical/) |
| **Assets Library** | Standards for banners, buttons, icons, logos, product images, and social assets | [06-Assets Library](06-Assets%20Library/) |
| **Prompt Library** | Production and QA prompts (weekly/monthly generation, HTML, review, hero banners, QA checklist) | [07-Prompt Library](07-Prompt%20Library/) |
| **Glossary** | Shared terms and identifiers used across the documentation | [08-Glossary/Terms.md](08-Glossary/Terms.md) |
| **Decision Log (full)** | The complete, ongoing record of decisions summarised in Part I | [09-Architecture Decisions/Decision-Log.md](09-Architecture%20Decisions/Decision-Log.md) |
| **Roadmap (full)** | The complete Future Enhancements & Roadmap summarised in Part I | [05-Future/roadmap.md](05-Future/roadmap.md) |

The functional requirements (`CR-##`), quality standards (`CS-##`), and weekly/monthly execution detail
that govern implementation live in [Part II](#part-ii--requirements-standards-execution--brands).

---

_End of compiled content. Part I (business strategy) and the Success Metrics, Roadmap, and Decision Log
sections are newly drafted; the SC and Stack brand documents and the detailed Technical/Assets/Prompt/
Glossary sections remain in their modular sources (see the [Document status](#document-status) table).
This file is compiled from the modular sources — edit those, then regenerate this document._
