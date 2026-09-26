# Architecture Decision Records

| | |
|---|---|
| **Status** | ACTIVE |
| **Version** | 1.0.0 |
| **Owner** | Project Owner |
| **Applies to** | **Klaviyo Campaign Email System** · **Klaviyo Flows Automation System** |
| **Mirroring** | Byte-identical copies in both projects. Both canonical. Any change applies to both in the same edit. |
| **Scope** | **Why** engineering decisions were made. Contains **no** normative build rules — those live in the standards. |

> **An ADR records a decision and its reasoning. It never restates the rule.**
> The rule lives in the standard; the ADR explains why that rule exists, what was rejected, and what it
> costs. When an ADR and a standard appear to disagree, **the standard is normative** and the ADR is
> out of date — fix the ADR.

---

## How to read and write an ADR

**Format.** Each record carries: **Status · Date · Tier · Context · Decision · Consequences · Alternatives
rejected · Evidence · Governs / Referenced by.**

**Status values**

| | |
|---|---|
| **ACCEPTED** | In force |
| **SUPERSEDED** | Replaced by a later ADR, which is named. The record stays, with its original reasoning intact. |
| **PROPOSED** | Under review; not yet in force |

**Rules**

- **Never delete an ADR.** A deleted decision gets re-litigated. Supersede it and name the successor.
- **Never edit an ADR's Context or Decision after acceptance.** If the decision changes, write a new ADR.
  Amendments are limited to correcting cross-references and fixing factual errors, and are noted inline.
- **One decision per ADR.** If it needs "and also", it is two records.
- **An ADR is required for every T3 and T4 change** (`Engineering-Governance.md` §3.1).

**Boundary with the Campaign project's Decision Log.** `09-Architecture Decisions/Decision-Log.md`
(`D-##`) records **business and operating** decisions and is not superseded by this index. ADRs record
**engineering** decisions. Where they touch, they cross-reference; neither restates the other
(`README.md` §8).

---

## Index

| ADR | Decision | Status | Tier | Date |
|---|---|---|---|---|
| [ADR-001](#adr-001) | Cerberus is the vendored external rendering authority, and hybrid stacking is the default — at 600px, not 680px | ACCEPTED | T4 | 2026-07-28 |
| [ADR-002](#adr-002) | Hero geometry failures were caused by two coordinate systems that email cannot reconcile | ACCEPTED | T4 | 2026-07-29 |
| [ADR-003](#adr-003) | HTML owns all Hero text; artwork owns none of it | ACCEPTED | T4 | 2026-07-29 |
| [ADR-004](#adr-004) | Hero artwork is accepted against a contract, before any HTML is written | ACCEPTED | T4 | 2026-07-29 |
| [ADR-005](#adr-005) | Settled Hero components are locked | ACCEPTED | T3 | 2026-07-28 |
| [ADR-006](#adr-006) | Reusable components are preferred over per-campaign layouts | ACCEPTED | T4 | 2026-07-10 |
| [ADR-007](#adr-007) | Shared standards are mirrored byte-identically in both projects rather than shared by dependency | ACCEPTED | T3 | 2026-07-29 |
| [ADR-008](#adr-008) | "Engineering complete" and "production validated" are tracked as separate states | ACCEPTED | T3 | 2026-07-28 |
| [ADR-009](#adr-009) | **Marketing composition is an engineering concern** | ACCEPTED | T3 | 2026-07-29 |

---

<a id="adr-001"></a>
## ADR-001 — Cerberus as the vendored external rendering authority; hybrid stacking as the default

**Status** ACCEPTED · **Date** 2026-07-28 · **Tier** T4

### Context

Both projects' build standards had been derived one production defect at a time. That produces correct rules
but leaves two structural weaknesses: **no external check** on whether a rule is right, and **no canonical
source** for techniques not yet needed. Rules learned only from one's own failures have blind spots exactly
where one has not yet failed.

A specific and severe client behaviour also needed an answer: **the Gmail app strips `<head>` CSS entirely
for non-Google accounts.** Multi-column rows that stack via a media query therefore do not stack for that
population — they compress. Existing templates relied on media queries for stacking.

### Decision

1. **Vendor Cerberus unmodified** (upstream `fa6de2ebb2e0bcd0614c53bd11f930d5bc8173fd`, 2024-07-07;
   vendored 2026-07-28) as `Shared/Frameworks/Cerberus/`, with five analysis documents and a 13-file
   reference component library authored by us alongside it.
2. **It is a reference, not a runtime dependency.** Production markup stays in our own components. Cerberus
   is the authority we *check against*, and the canonical source for unfamiliar techniques.
3. **Never edit an upstream file.** Refreshing is a re-vendor operation: re-clone at a new commit, remove the
   nested `.git`, update the provenance table, re-run the analysis against the diff.
4. **Adopt hybrid stacking as the default for every multi-column row** — `display:inline-block` columns with
   `min-width`/`max-width` inside an MSO ghost table — so rows stack with or without media-query support.
5. **Adopt the mechanism at 600px, not Cerberus's 680px.**
6. **Reject `table { table-layout: fixed !important; }`** despite Cerberus applying it globally.
7. **Where we deliberately differ, record the reason** in `Cerberus-Best-Practices.md` §5, and never
   "correct" our templates toward Cerberus on those points.

### Consequences

**Positive**

- Independent confirmation: Cerberus states most of our hard-won rules as first principles, which settles
  them.
- Hybrid stacking removes the media-query dependency for structure, which is the single largest
  `<head>`-CSS-stripping exposure.
- A named external authority ends "is this rule real?" arguments.
- Techniques we had not needed — `dir="rtl"` order swapping, VML background images, the ghost-table shapes,
  the full head scaffold of named client fixes — arrived documented rather than improvised.

**Negative / accepted**

- **Real technical debt was created the moment this was adopted.** Existing multi-column rows (trust strips,
  product grids, split reassurance rows, footer nav) still stack by media query. Consequence, stated
  precisely: on the Gmail app with a non-Google account those rows **compress rather than stack** — degraded
  and cramped, not broken. Migration is governed by `Engineering-Governance.md` §10 and is deliberately
  deferred rather than hidden.
- Divergences must be maintained. `Cerberus-Best-Practices.md` §5 exists so they are not silently
  "corrected".

### Alternatives rejected

| Alternative | Why rejected |
|---|---|
| Adopt Cerberus's 680px container | Every approved brand measurement, product-card dimension and artwork export is built to 600px. Changing the width means **re-exporting every asset** — a cost with no rendering benefit. Adopt the mechanism, not the width. |
| Adopt `table-layout:fixed` globally, as Cerberus does | It disables intrinsic sizing, which breaks two patterns we depend on: shrink-to-fit content-width badges, and the centred odd last card in a `colspan` cell. Permitted inline on a single table if ever genuinely needed. |
| Use Cerberus as a runtime template base | Would discard approved brand templates for no gain; our components already encode Klaviyo-specific and Gmail-mobile hardening Cerberus does not target. |
| Write our own framework document instead of vendoring | Loses the independence that is the entire point. |
| Migrate to MJML / Foundation for Emails / Maizzle | See ADR-002 §Alternatives. All emit the same HTML/CSS subset; MJML's own hero component would reintroduce a prohibited crop. |

### Evidence

Cerberus upstream `fa6de2e`, checksums recorded in `FRAMEWORK-README.md`. Client behaviours cross-checked in
`Cerberus-Compatibility.md`. Hybrid arithmetic and every ghost-table shape in `Cerberus-Techniques.md` §2–§3
and `Components/GhostTable.html`.

### Governs / Referenced by

Both `CLAUDE.md` files' Cerberus sections · `Cerberus-Best-Practices.md` (all of §5) · STD-HERO §9.6 ·
ADR-002, ADR-006.

---

<a id="adr-002"></a>
## ADR-002 — Hero geometry failures were caused by two coordinate systems that email cannot reconcile

**Status** ACCEPTED · **Date** 2026-07-29 · **Tier** T4

### Context

Approximately **29 Hero drafts** across three templates all shared one outcome: **correct on desktop, the
composition lost on mobile.** Reported symptoms were consistent — the artwork read as separated, the copy
appeared underneath as an unrelated block, and the CTA and coupon became further disconnected blocks.

Multiple distinct approaches were tried and all failed the same way: generated artwork, manual artwork,
Cerberus hybrid implementation, a separate mobile Hero image, hand-written responsive code, and repeated
revisions of crop mode, background position, band height, canvas width and breakpoint behaviour.

**Each fix repaired one device and broke another.** That pattern is the signature of a misdiagnosis: the
parameters being tuned were not the causal variable.

### Decision

**Record the root cause as a geometric incompatibility, not an implementation defect**, and make it
computable before design begins.

The cause: **the raster artwork scales with viewport width; HTML type does not.** Email has **no
viewport-relative font units** — `vw`, `vmin` and `clamp()` are unsupported in Outlook's Word engine, in
Gmail on every platform, and in Yahoo. A Hero that divides copy from imagery along the **width** axis
therefore puts them in competition for the axis that shrinks, and the copy is squeezed out of the artwork's
negative space. Once the copy leaves, the dividing shape no longer divides anything and the artwork becomes a
banner.

Two consequences were adopted as law, and the mechanism was expressed as a **gate**:

- **Divide a Hero along the height axis, never the width axis.**
- **Bond artwork and HTML by a flat published colour, never by position.**
- **Compute `W*` before commissioning artwork.** If `W* > 320px` the architecture is refused.

**The normative rules, the formula, the measurement tables and the prohibition list live in STD-HERO §1.4,
§3 and §13. They are not restated here.**

### Consequences

**Positive**

- The failure class became **predictable before build** rather than discoverable after it. `W*` is a number
  computed from an artwork's own geometry.
- A whole family of proposed fixes was retired at once, because they all addressed the symptom: crop tuning,
  background-position tuning, per-breakpoint canvases, mobile-only images, reveal wrappers.
- The investigation produced an architecture (Aspect-Locked Band + Colour-Bonded Copy) that removes the
  failure structurally instead of mitigating it.
- **`background-size:cover` was identified as an entire defect class, not a setting.** `cover` crops by
  definition, and because a mobile box's height is content-driven, its crop window changes per device. Sixteen
  drafts of one template were spent tuning a crop that should not have existed.

**Negative / accepted**

- **Text over photography on desktop is given up** in the default architecture. That is a real design loss,
  and it is the precise thing that cannot be carried to a phone — so the choice is desktop-only overlay, or
  consistency everywhere.
- A geometric limit is now stated rather than fought: with a 16:9-class artwork the Hero CTA lands below the
  fold on a 375×667 device. Publishing the offset is required; deleting personalisation to buy 20px is not a
  legitimate fix.

### Alternatives rejected

| Alternative | Why rejected — measured |
|---|---|
| Tune the crop / background position further | `cover` discards overflow by definition; `background-position` only selects *which* part is discarded. The visible region is a function of box aspect ratio, which changes per device. There is no correct value. |
| Percentage-width copy column, to remove the drift | Removes horizontal drift but not the type problem. At a 41% column the largest headline that fits at 320px is **18px against 15px body** — a headline-to-body ratio of **1.2:1**, down from 2.0:1. Converts one failure into another. |
| Widen the artwork's clear zone so overlay survives | Would require a clear-zone fraction `k ≥ 0.69`, confining imagery to ~30% of the frame. Not a composition worth having. |
| A second, mobile-specific Hero image | Double download; a ghost node; and invisible to exactly the readers whose client strips `<head>` CSS — the population that needed it. |
| Absolute positioning for a true overlay layer | `position` is **stripped by Gmail** and ignored by Outlook's Word engine. |
| CSS `clip-path` / `transform: skew` / SVG mask for the shape | Unsupported across Outlook, Gmail and Yahoo. |
| A stepped table "staircase" to fake a diagonal | Dozens of painted cells that cannot survive reflow. |
| **Migrate to MJML, Foundation for Emails, or Maizzle** | **All three fail identically.** Every framework compiles to the same table + inline-CSS subset and inherits the same client constraints. MJML's `mj-hero` fixed-height mode behaves cover-like and would **reintroduce the prohibited crop** — a regression. Foundation offers no hero primitive. Maizzle lets you *author* `clamp()`, which clients still do not honour. **This is a client-capability problem, not a framework choice.** |

### Evidence

Pixel sampling of the `w_600` artwork render (clear-zone fraction `k = 327/600 = 0.545`; per-row feature
positions; bottom-edge colour sampled across the full width). Computed drift and hierarchy-collapse tables at
320 / 375 / 414 / 480 / 510 / 560 / 600px. Geometric simulation rendered at true pixel scale for desktop and
mobile. Full working: **STD-HERO §3**.

### Governs / Referenced by

STD-HERO §1.4, §3, §13 · both `CLAUDE.md` Hero sections · `Cerberus-Best-Practices.md` §5.10/§5.11 ·
ADR-003, ADR-004, ADR-005.

---

<a id="adr-003"></a>
## ADR-003 — HTML owns all Hero text; artwork owns none of it

**Status** ACCEPTED · **Date** 2026-07-29 · **Tier** T4

### Context

The two projects held **opposite** rules, and both were defensible on their own terms.

- The **Campaign** system required a single embedded Hero artwork with the headline, eyebrow, introduction
  and CTA **inside the image**, wrapped in one clickable anchor. It was marked a permanent project rule.
- The **Flow** system required the opposite: personalised, dynamic and offer copy must stay in HTML, because
  a flow Hero must carry a defaulted first name and a changeable offer and must read with images blocked.

The conflict was not an oversight. Baking copy into artwork **solves the ADR-002 geometry problem
completely** — every element scales together, so there is no drift, no critical width, and the mobile
composition is guaranteed to match the desktop one. That was a real engineering benefit and it is why the
rule stood.

### Decision

**All Hero copy is live HTML. Nothing is baked into artwork: no text, no logo, no CTA, no coupon code, no
price, no date.** This applies to both projects and supersedes the Campaign requirement for all new work.

The reason it is now possible: the **Aspect-Locked Band + Colour-Bonded Copy** architecture (ADR-002)
delivers the *same* geometric guarantee — because there is no overlay, there is nothing to drift — **without
the accessibility and operational costs.** The trade no longer has to be made.

**Normative detail: STD-HERO §5 (HTML responsibilities), §13.2–§13.4 (prohibitions). Not restated here.**

### Consequences

**Positive**

- **Images-off delivers the message.** Blocked images are common in B2B and corporate mail; a baked Hero
  leaves only one `alt` string.
- **Accessibility**: real text is announced, resizable, reflowable by a magnifier, adaptable to high contrast,
  and translatable.
- **Personalisation becomes possible at all** in a Hero.
- **A real anchor** for the CTA: a per-element verifiable destination, a ≥44px tap target guaranteed by
  padding independent of image scale, and a control that assistive technology can announce. A baked button
  drawn for 600px renders at 53% on a 320px screen.
- **A selectable coupon code.** Retyping a code from an image is the largest friction point in mobile
  redemption, and per-profile dynamic codes become possible.
- **Copy, offer, code and destination changes stop requiring an artwork re-export**, which makes correction
  and A/B testing cheap.

**Negative / accepted**

- **The artwork brief changes** for the Campaign project. Designers and generative tools must be asked for a
  **band asset**, not a finished hero. Operational, not technical, but real.
- **A reference component still reflects the superseded pattern** (`Components/hero-image.html`) and is
  flagged as queued for update. Until then, build to the standard, not to that file.
- Existing approved Campaign templates are **grandfathered** and are not retrofitted
  (`Engineering-Governance.md` §7.1).

### Alternatives rejected

| Alternative | Why rejected |
|---|---|
| Keep baked copy for Campaign, live HTML for Flow | Two Hero architectures means two sets of defects, two briefs, two component sets, and no shared learning. The geometry problem is identical in both; so should the solution be. |
| Keep baked copy everywhere (accept the a11y cost) | Once the Band architecture exists, the geometric benefit is available without the cost — so the cost has no remaining justification. |
| Bake only the decorative headline, keep the CTA live | Still loses images-off legibility and translation for the primary message, and reintroduces the geometry coupling for the one element with the largest type. |
| Composite copy into artwork via a URL-level image transform | Already used, legitimately, for genuinely **decorative** poster artwork inside a scene — where an HTML overlay cannot track a fluid target and a script face cannot load. It is **not** available for marketing-editable copy: greeting, headline, body, offer and CTA stay live HTML. The boundary is decorative vs editable. |

### Evidence

Campaign rule as originally stated and its supersession note; Flow Hero requirements; STD-HERO §13.2–§13.4
with the per-cost breakdown; measured tap-target arithmetic (a 600px-designed button at 320px renders at
53%).

### Governs / Referenced by

STD-HERO §5, §6, §13.2–§13.4 · Campaign `CLAUDE.md` §6.15 (SUPERSEDED) and §6.13-H · Flow `CLAUDE.md` §8.5 ·
ADR-004.

---

<a id="adr-004"></a>
## ADR-004 — Hero artwork is accepted against a contract, before any HTML is written

**Status** ACCEPTED · **Date** 2026-07-29 · **Tier** T4

### Context

Across the whole Hero history, **every revision negotiated with an artwork that had already made the
architectural decision.** The artwork arrived as a finished composition; the HTML then attempted to
accommodate it; the accommodation failed on mobile; a parameter was tuned; repeat.

Three specific artwork properties were measured as the actual constraints, and all three are **export
decisions** made before any code existed:

1. A **clear-zone fraction too small** for overlay to survive below ~510px.
2. A **non-uniform bottom edge** — sampled navy across the left 60% of the frame and daylit floor, glass and
   wall across the right 40%. The join was therefore invisible on 60% of the width and hard-edged on 40%.
   **No HTML can repair that 40%**, because Gmail's mobile apps drop CSS `background` on cells, so the copy
   surface can only be a flat `bgcolor` or a tiled strip — and a flat colour cannot match a two-tone edge.
3. A **left/right dividing shape** (ADR-002).

Separately, supplied assets had already failed on quality grounds: **three of four** trust icons were
unusable — two carried a vendor watermark, one had a transparency checkerboard baked into the pixels and was
non-square. There was no gate; the failures were found during build.

### Decision

**No Hero artwork enters a build until it is accepted against the Artwork Contract, and acceptance happens
before any HTML is written.** Six conditions: declared aspect ratio · a flat termination band of at least 8%
of frame height, uniform across every x · a published bond hex · nothing baked in · no overlay clear zone
(unless the B2 gate is met) · export integrity including a 2× zoom inspection.

**A failing artwork is re-exported. It is never compensated for in HTML or CSS.**

**Normative detail: STD-HERO §4. Not restated here.**

### Consequences

**Positive**

- The architectural decision moves to **where the constraint actually lives**. An artwork that satisfies the
  contract cannot produce the ADR-002 failure.
- **One hex does four jobs** — copy surface, cell `bgcolor`, images-off fallback, dark-mode
  `background-color` — which removes a whole class of mismatch.
- The height reservation **no longer needs to be pixel-exact**, because both sides of the join are the same
  flat colour. A ±1px rounding error is invisible. A direct simplification the contract buys.
- **Generative tools become reliable inputs.** Asked for "a hero", an image model produces a *landing-page*
  hero with implied text zones — the one thing email cannot support. Asked for a **band** with a stated
  termination hex, the same tool produces an asset that cannot break. The tool was never the problem; the
  brief was.
- Asset-quality failures are caught at acceptance rather than during build.

**Negative / accepted**

- **A re-export dependency on whoever produces artwork.** The contract is only as strong as the willingness
  to reject a non-conforming asset.
- Existing artwork does not conform. One known asset also carries a **baked compositing artefact** that
  cannot be repaired in HTML and needs a corrected export.
- Substituting different creative to satisfy the contract is a **design change requiring approval** — not a
  technical fix. Optimisation may compress, resize or re-encode the *same* asset only.

### Alternatives rejected

| Alternative | Why rejected |
|---|---|
| Fix each artwork's shortcomings in HTML | Measured impossible for the two-tone edge: Gmail mobile drops CSS `background` on cells, so the copy surface can only be flat colour. |
| Accept artwork as-is and document the seam | Was effectively the status quo through v1–v26. The seam is what readers perceive as the Hero breaking. |
| Sample the bond hex at build time instead of publishing it | Puts a measurement inside the build step, where it is repeated, undocumented and drifts. Publish once, at acceptance. |
| Loosen the ≥8% band | At 320px, 8% renders as ~14 CSS px of flat colour — the minimum that survives JPEG chroma subsampling, encoder ringing at the frame edge, and sub-pixel rounding in the reservation. Thinner is not reliably flat. |

### Evidence

Bottom-edge colour sample across the full frame width; clear-zone measurement per row; asset QA findings on
the four supplied trust icons; the 2× zoom finding on a separate hero artwork. Full working: **STD-HERO §4**,
and the brand artwork register.

### Governs / Referenced by

STD-HERO §4, §6, §14.1–§14.2 · brand artwork registers · `Engineering-QA-Process.md` Gate G0/G1 · ADR-003.

---

<a id="adr-005"></a>
## ADR-005 — Settled Hero components are locked

**Status** ACCEPTED · **Date** 2026-07-28 · **Tier** T3

### Context

Two Hero implementations reached a state where the engineering was complete: one background image, aspect-
locked, no crop at any width, VML for Outlook, live HTML copy, accessibility scaffold, all URLs verified,
markup balanced, footer anchor validation clean.

The risk at that point is not a defect. It is **churn**. The history immediately preceding it — sixteen
drafts of crop tuning, a dark-mode bug misdiagnosed as a layout fault for four drafts — demonstrated that a
Hero can be re-broken by well-intentioned adjustment. A component that is finished and still being adjusted
is a solved problem waiting to regress.

### Decision

**A Hero whose engineering is settled is marked `ARCHITECTURE LOCKED`** in the document that owns it, naming
its baseline file. A locked Hero may change for **exactly five reasons**: a verified rendering bug reproduced
in a named client · a client compatibility issue · an accessibility issue · a new brand requirement · an
approved design revision.

Any qualifying change ships as a **new draft version**, states the reason in its header, and re-runs the
**regression evidence set** against the previous baseline — hashing inline styles, VML blocks, MSO
conditionals, `height` attributes, `bgcolor` attributes, `href`s, `img src`s and `class` values, and
reporting which sets are identical.

**"It would look better" is not a qualifying reason.** No cosmetic or experimental changes, not even on a
casual request.

**Normative detail: STD-HERO §12.5. Authority: `Engineering-Governance.md` §5.**

### Consequences

**Positive**

- Settled work stops absorbing effort, and effort moves to unlocked components where it produces value.
- **Changes to a locked component are provably bounded.** The regression evidence set turns "I only changed
  the padding" into a hash comparison — which is what makes the lock meaningful rather than declarative.
- A stated reason on every change creates a diagnosable trail.

**Negative / accepted**

- Genuine improvements are slower to land, deliberately. They must qualify first.
- **A lock invites being mistaken for a production sign-off.** It is not — see ADR-008. The two states must
  be recorded separately every time, or the lock becomes actively misleading.

### Alternatives rejected

| Alternative | Why rejected |
|---|---|
| No lock; rely on review to catch churn | Review catches defects, not churn. Churn arrives as a series of individually reasonable adjustments. |
| Freeze permanently | Real defects, accessibility obligations and client changes must be actionable. Five bounded reasons, not zero. |
| Lock by convention rather than with regression evidence | A lock with no verification mechanism is a comment. The hash comparison is the enforcement. |

### Evidence

The 16-draft crop cycle; the four-draft dark-mode misdiagnosis; the regression evidence set as actually run
against a baseline (all carried sets identical, byte-identical carried region).

### Governs / Referenced by

STD-HERO §12.5 · `Engineering-Governance.md` §5 · `Engineering-QA-Process.md` §6 · Flow `CLAUDE.md` §12 ·
ADR-008.

---

<a id="adr-006"></a>
## ADR-006 — Reusable components are preferred over per-campaign layouts

**Status** ACCEPTED · **Date** 2026-07-10, extended 2026-07-29 · **Tier** T4

### Context

Both projects produce many emails across multiple brands. Two organising options existed: author each send's
layout for that send, or build from a shared component set with brand values injected as tokens.

Per-send authoring fails in a specific, observable way: **a defect fixed in one template returns in the
next.** Every structural rendering rule in either project — equal-height cards, the shrink-to-fit badge, the
three-sibling-anchor card, doubled `bgcolor`, the sized spacer — was learned once and then had to be applied
everywhere by hand. Hand application is where it stops happening.

### Decision

**Every repeated UI unit is a component: built once, reused, never re-implemented per send.** Re-writing a
Product Card, Price Badge, CTA, Hero, Offer Bar, Trust Strip or Footer from scratch is **a process defect
even if the result renders correctly.**

- Components are **token-driven**. A brand difference is a token change — colour, type, radius, spacing —
  never a structural rewrite.
- Components must render correctly from **inline styles + HTML attributes + table structure alone**, so they
  survive `<head>` CSS stripping and an ESP's import rewrite.
- **Fix once, propagate immediately** (`Engineering-Governance.md` §6.3): template, then shared component,
  then — if the lesson generalises — the standard, all in the same change.
- **Extended 2026-07-29:** a new Hero is *a new artwork plus new copy*, never new layout code.
  **If a Hero requires new layout code, that is the signal that the architecture is being violated** —
  stop and re-read STD-HERO §2.

### Consequences

**Positive**

- A defect is fixed **once**, in one place, for every brand and every future send.
- Adding a brand is a token exercise, not an engineering exercise.
- Hardening compounds: every client fix learned anywhere lands in every template that uses the component.
- The extension gives a **falsifiable test** for architectural drift — "did this need new layout code?" — that
  does not depend on anyone's judgement.

**Negative / accepted**

- A component must be genuinely general before it is shared, or it accumulates per-brand conditionals and
  becomes worse than duplication.
- **Reference components can fall behind the standard.** One currently does (`Components/hero-image.html`,
  reflecting the superseded baked-copy pattern) and is flagged as queued for update. A stale component is a
  trap precisely because it looks authoritative — flag it in place rather than trusting people to remember.
- Component-level change has a wide blast radius, which is why component changes are tiered
  (`Engineering-Governance.md` §3.1).

### Alternatives rejected

| Alternative | Why rejected |
|---|---|
| Per-campaign bespoke layouts | Guarantees defect recurrence; every fix must be re-applied by hand, and hand application is where it stops happening. |
| Copy a previous send and edit it | The most common failure mode in practice. It propagates the *previous* defects along with the layout, and diverges silently from the standard. |
| One monolithic template with flags | Every flag is a conditional path that must be tested in every client. Combinatorics defeat the QA matrix. |
| Share only the head scaffold, author bodies per send | The head is the least defect-prone part. The body is where the client bugs live. |

### Evidence

Both projects' component sets and the rules attached to each; the propagation-duty rule and its origin; the
current stale-component flag.

### Governs / Referenced by

Both `CLAUDE.md` component sections · `Cerberus-Components.md` · STD-HERO §6 (component reuse strategy) ·
`Engineering-Governance.md` §6.3 · ADR-001.

---

<a id="adr-007"></a>
## ADR-007 — Shared standards are mirrored byte-identically in both projects, not shared by dependency

**Status** ACCEPTED · **Date** 2026-07-29 · **Tier** T3

### Context

`Shared/Email-Hero-Engineering-Standard.md` and `Shared/Engineering/` apply to **both** projects. The
projects are separate top-level folders, worked on independently, and an agent or contributor operating in one
may have no access to the other. A single authoritative copy in one project would be **unreadable from the
other** exactly when it is needed — before writing HTML.

### Decision

**Keep byte-identical copies in both projects. Both are canonical; neither is a shadow.** Any change is
applied to both **in the same edit**, and equality is verified by hash as a release step.

### Consequences

**Positive**

- The standard is readable from inside whichever project is being worked on, with no cross-folder dependency
  and no path assumptions.
- Either project remains self-contained and independently portable.
- Verification is trivial and mechanical: two hashes, equal or not.

**Negative / accepted**

- **A one-sided edit forks the standard silently** — which is worse than having no standard, because both
  copies still look authoritative. Mitigated by: the mirror duty (`Engineering-Governance.md` §6.4), a
  mandatory hash check as a release step, and the sync command printed in each mirrored document's own header.
- Two files to edit per change. Accepted as the cost of readability.

### Alternatives rejected

| Alternative | Why rejected |
|---|---|
| Canonical copy in one project, pointer stub in the other | The pointer is unreadable when only the other project is in scope — which is precisely the moment the standard is needed. |
| A third shared repository or folder above both | Adds a path dependency and a setup step for every contributor and every agent session, to save one file edit. |
| Symlink / junction | Fragile across environments, invisible in a plain file listing, and easily broken by a copy operation. |
| Duplicate but allow per-project divergence | Divergence is the failure being prevented, not a feature. Where a project genuinely differs, the difference belongs in that project's `CLAUDE.md`, not in a forked standard. |

### Evidence

Mirror hashes verified equal at establishment for STD-HERO (`61,169 B`, matching sha256) and for every file
in `Shared/Engineering/`.

### Governs / Referenced by

`README.md` §6.3 · `Engineering-Governance.md` §6.4 · `Engineering-Change-Management.md` §7 · every mirrored
document's header block.

---

<a id="adr-008"></a>
## ADR-008 — "Engineering complete" and "production validated" are separate, separately-recorded states

**Status** ACCEPTED · **Date** 2026-07-28 · **Tier** T3

### Context

Two Hero implementations reached a state that was, correctly, described as engineering-complete: verified
in-repo across VML presence, live HTML copy, single artwork, zero cropping, personalisation, the accessibility
scaffold, responsive behaviour, all URLs HTTP 200, balanced markup and clean footer anchor validation.

**None of it had been rendered in a real client.** The gap is easy to lose, because an engineering-complete
list is long, specific and reassuring — and reads like a sign-off. The two claims answer different questions:
*"is the markup right?"* and *"does it render?"*

### Decision

**Record the two states separately, and never let one imply the other.**

- **Engineering complete** — source analysis, computed values, verified URLs, balanced markup, automated
  scans, `ARCHITECTURE LOCKED` where applicable.
- **Production validated** — rendered and confirmed on the client matrix, including dark mode, images-off,
  and clickability **after a real ESP import**.

Additional rules:

- **A browser or desktop preview is never proof.** Apple Mail is the most capable client and therefore the
  most misleading render to approve on.
- **Anything not verifiable in the working environment is reported as a required manual pre-activation step,
  never as a pass.**
- **A lock is not a production sign-off** (ADR-005).
- **Gmail must be validated on a non-Google account as well**, because `<head>` CSS stripping makes it a
  different renderer in practice.

**Gate definitions: `Engineering-QA-Process.md` §2. Hero-specific matrix: STD-HERO §12.4.**

### Consequences

**Positive**

- No template can be described as production-ready on the strength of source analysis alone.
- Reviewers have language for a real and common state: *engineering complete, validation pending* — which is
  honest rather than either optimistic or dismissive.
- The unvalidated set is **visible**. Several templates currently sit in exactly this state, recorded as such.

**Negative / accepted**

- Client validation is manual and slow, so the validated set lags the engineering-complete set. Making the lag
  visible is the point; hiding it was the failure.
- It is tempting to treat a long green checklist as validation. The two states are therefore recorded in
  **separate blocks with separate wording**, never as one list.

### Alternatives rejected

| Alternative | Why rejected |
|---|---|
| One "done" state | Conflates markup correctness with rendering, which is the failure this prevents. |
| Treat engineering-complete as sufficient for `Output/` | `Output/` feeds production sends. The defect classes that only appear in a real client are exactly the expensive ones. |
| Validate only on Apple Mail because it is most capable | Backwards. The most capable client hides the defects; the floor must be tested. |

### Evidence

The recorded validation-pending state on the two locked Hero baselines; the client matrix as specified; the
Gmail non-Google-account behaviour documented in the compatibility index.

### Governs / Referenced by

`Engineering-QA-Process.md` §2, §7 · STD-HERO §12.4 and its status line · both `CLAUDE.md` pre-activation
gates · ADR-005.

---

<a id="adr-009"></a>
## ADR-009 — Marketing composition is an engineering concern

**Status** ACCEPTED · **Date** 2026-07-29 · **Tier** T3

### Context

STD-HERO 1.0.0 was written from the geometry investigation (ADR-002) and is effective at what it was
designed for: a build satisfying §2–§14 cannot crop, cannot drift and cannot shear on reflow.

**The first build to fully satisfy it was then reported as failing.** Part 3 Draft v4 passed every §11
check. The colour bond between artwork and copy was measured at **0 levels of difference across the full
frame width** — a mathematically perfect join. It was nonetheless reported as *"technically correct but
visually fragmented — the artwork and the marketing message feel disconnected; it reads as two separate
sections instead of one continuous marketing experience."*

Nothing in §2–§14 had been violated. A follow-up exploration identified five causes, none of them
geometric: **semantic disconnect** (the artwork depicted neither the cart, the products nor the offer),
**competing focal points**, **proportional dominance** (47% of Hero height carrying zero marketing
information), **absence of a visual bridge**, and an ambiguous **full-width section boundary**.

The governance question this forced: **is composition inside or outside the engineering standard's remit?**
Leaving it out would have meant the standard could certify a Hero as correct while it failed to
communicate — and that the next contributor would run the same investigation a third time.

### Decision

**Hero quality is determined by engineering correctness AND marketing composition. Both are in scope for
this engineering standard, and both must be reviewed before a Hero is approved.**

1. **Composition rules are normative**, recorded as **STD-HERO §15 Hero Marketing Psychology** — reading
   order, the composition-versus-geometry diagnostic, semantic continuity, the Visual Bridge requirement,
   proportion-follows-communication-value, and the four Hero marketing roles.
2. **The standard has two halves**, stated in its Document control block: §2–§14 govern geometry; §15
   governs composition. **Passing one does not imply passing the other.**
3. **Future Hero reviews must evaluate both**, as separate reviews with separate recorded outcomes. The
   procedural change is **ECP-002** (`Engineering-Change-Management.md` §13).
4. **A diagnostic decides which class a failure belongs to**, applied *before* any fix is proposed: a
   geometry failure looks different between clients or widths; **a composition failure looks the same
   everywhere.**

### Consequences

**Positive**

- **The certification gap closes.** "Passes §11" can no longer be mistaken for "is a good Hero", in the
  same way ADR-008 stopped "engineering complete" being mistaken for "production validated". This is the
  same class of correction, applied to a different axis.
- **Composition becomes checkable rather than a matter of taste.** A declared role, a maximum proportion,
  a required bridge and a fixed reading order are all verifiable by inspection. Subjective judgement is
  confined to *how well* the rules are executed, not *whether* they were followed.
- **The diagnostic prevents a whole class of wasted effort.** The composition investigation began by
  searching for a geometry cause that did not exist. One question — *does it look the same at every width
  and in every client?* — now routes the diagnosis correctly in seconds.
- **The artwork brief inherits composition requirements**, so role and proportion are decided *before* an
  asset is commissioned. That is the same lesson ADR-004 recorded for geometry, applied to composition:
  the artwork decides, so the brief must decide first.
- **Template 3's failure has a precise name** — a role mismatch: built as an Atmospheric Hero, objectively
  an Offer Hero. All five reported symptoms follow from that one mismatch.

**Negative / accepted**

- **Composition review is inherently less mechanical than a grep.** It cannot be fully automated, so it
  depends on a reviewer applying §15 honestly. Mitigated by making the checkable parts explicit (declared
  role, proportion ceiling, bridge present, reading order) and by requiring the review to be *recorded*
  rather than assumed.
- **Scope creep risk.** An engineering standard that admits composition could drift into a brand style
  guide. Boundary held explicitly: §15 governs **structural relationships** — order, proportion, bridge,
  semantic relevance, role. It does not govern colour choices, typefaces, photographic style or copy
  voice, which stay in each brand's design documents.
- **A conforming build became non-conforming.** Part 3 Draft v4 satisfies 1.0.0 but not 1.1.0 §15.4/§15.5.
  As an unapproved draft it is grandfathered at its recorded version; the rebuild is scheduled.

### Alternatives rejected

| Alternative | Why rejected |
|---|---|
| Keep composition out of the standard; treat it as design feedback | It would have permitted a third investigation into the same class of failure, which is precisely what this document set exists to prevent (`README.md` §1.1). It also leaves the standard able to certify a Hero that does not communicate. |
| Put composition rules in each brand's design document | The findings are **brand-independent and project-independent** — reading order, bridges and proportion apply to RDD, SS, SC, Stack, Campaign and Flow alike. Per-brand copies would be four duplications of one truth (`Engineering-Document-Relationships.md` §2). |
| Create a separate "Hero Composition Standard" | Two standards for one component means two places to check, two version numbers, and an inevitable drift about which governs a given decision. The component has one specification. |
| Fix v4's composition and record nothing | Fixes the instance, not the class. The next Hero would be briefed the same way. |
| Treat "reads as two sections" as subjective and out of scope | It reproduced identically at every width and in every client, and it traced to five specific, measurable causes. A reproducible, attributable defect is not a matter of taste. |

### Evidence

Part 3 Draft v4 passing the full §11 checklist while being reported as fragmented · the colour bond
measured at 0 levels across all 24,000 band pixels, proving colour identity is not a bridge · the 47%
proportional allocation carrying zero marketing information · the three-architecture composition
exploration and its comparison matrix · the Template 3 role mismatch (built Atmospheric, objectively
Offer).

### Governs / Referenced by

STD-HERO §15 (all), Document control "Two halves" · **ECP-002** in
`Engineering-Change-Management.md` §13 · `Engineering-QA-Process.md` (on ECP-002 approval) · both
`CLAUDE.md` Hero sections · ADR-002 (the geometry half), ADR-004 (brief-before-asset), ADR-008 (the same
class of two-state correction).

---

## Reserved / next number

**Next ADR number: ADR-010.** Numbers are never reused, including for a withdrawn proposal.

---

*ADRs record reasoning. Normative rules live in the standards listed in `README.md` §3. If an ADR and a
standard disagree, the standard is normative and the ADR needs correcting.*
