# CLAUDE.md — Klaviyo Campaign Email System (Production)

Operational guide for Claude Code working in this project. It teaches **how to work here** — it does
**not** restate business rules. Requirements, standards, campaign rules, and architecture live in the
**BRD** (`BRD.md` plus the `00-…`/`09-…` section folders, at the project root).
Whenever a rule is needed, this file cites its BRD identifier (`CR-##`, `CS-##`, `WK-P#`, `MO-P#`)
rather than repeating it.

> Supersedes the initial lightweight CLAUDE.md created while scaffolding the workspace.

## 1. Project Role

- This is the **production** workspace for weekly & monthly email campaigns — where campaigns are
  briefed, generated, reviewed, and shipped.
- It is a **completely separate project** from the Klaviyo Flow project.
- **Planning vs. production:** the BRD defines *what/why/standards*; this workspace *executes* them.
  Never blur the two.

## 2. Source of Truth Hierarchy

On any conflict, the higher source wins:

1. **BRD** — requirements, standards, campaign rules, architecture. `BRD.md` is a
   **compiled, read-only artifact**; edit the modular sources in the `00-…`–`09-…` section folders,
   never `BRD.md`.
2. **Brand facts (L3)** — `03-Brands MD Files/<CODE>.md`.
3. **Visual system (L4)** — `Shared/design-tokens.md` (colour, type scale, spacing rhythm) and
   `Shared/Fonts/font-stacks.md` (font policy).
4. **The send's `Brief/`** — the specific campaign instance, including its **Design Intent** block (§4.2).

**Above this list sit the shared layers**, which win on conflict: `Shared/Engineering/` (governance, L0) then
the standards — STD-CREATIVE, STD-DESIGN, STD-HERO and Cerberus (L1). The full precedence order and the layer
model are owned by `Shared/Engineering/Engineering-Document-Relationships.md` §3.1 and are not restated here.

> ⚠️ **`BrandConfig.md` and `Design.md` do not exist in this project, and must not be created here.** They are
> the **Flow** project's L3/L4 documents. Earlier revisions of this section ranked them second and listed them
> in the read order, which pointed at absent files and left campaign builds with no brand visual system. The
> Campaign equivalents are items 2 and 3 above. Duplicating them into this repository would breach the
> single-home rule (`Shared/Engineering/README.md` §5.6) and create the drift ADR-007 exists to prevent.
>
> **Known gaps, to be populated rather than worked around:** `03-Brands MD Files/SC.md` and `Stack.md` are
> placeholders — **SC and Stack are not buildable** until they carry real brand facts. The six
> `06-Assets Library/*-Standards.md` files are **UNPOPULATED** placeholders and are not a visual-system
> source; use item 3 above.

## 3. Project Read Order

Before starting **any** task, read in this exact order (this makes every generation deterministic):

0. **`Shared/Creative-Workflow-Standard.md`** — **read this FIRST when the task is a new email design.**
   It is the official first document before any new design work and it fixes the order of execution:
   **Creative → Marketing → Engineering → Implementation → Validation → Output.** **Engineering is never
   the first design activity.** It holds no build rules and no brand or campaign values, so it never
   displaces items 1–7 below; it decides *when* they are applied, and it requires engineering to
   **preserve** an approved creative direction rather than replace it. Once a creative direction is
   approved it is **locked** — implementation may be refined, the concept may not be redesigned. For a
   small edit to an existing template, start at item 1. Its §9 worked lifecycles are deliberately
   **Flow-only**; this project uses its §1–§8, which are project-neutral. **Its §4.0 defines the three
   reference fidelity modes** — `TARGET` · `INSPIRATION` · `LEGACY` — recorded in the send's `Brief/`
   Reference Register (§4.2); the mode decides whether a reference is implemented faithfully, mined for
   devices, or ignored as the artefact being replaced.
0b. **`Shared/Email-Design-System/`** — the **visual language library** (STD-DESIGN), read during the
   creative phase that item 0 requires. Start at its `README.md`, then `Design-Decision-Matrix.md`. It
   supplies the design language, the Hero pattern, the section set and the CTA strategy — the *what* to
   build, where item 0 supplies the *when*. It holds **no HTML, no CSS, no brand or campaign values and no
   measurements**, so it never displaces items 1–7 either. Its `Flow-Design-Recommendations.md` is
   Flow-specific; this project uses the other five documents, which are project-neutral.
1. `CLAUDE.md` (this file)
2. `BRD.md`
3. Brand facts (L3) — `03-Brands MD Files/<CODE>.md`
4. Visual system (L4) — `Shared/design-tokens.md` and `Shared/Fonts/font-stacks.md`
5. Campaign `Brief/` — **including its Design Intent block** (§4.2), which is this send's design target
6. `References/` — read each file **according to its fidelity mode** in the Brief's Reference Register
   (STD-CREATIVE §4.0): `TARGET` is implemented faithfully, `INSPIRATION` supplies devices only, `LEGACY`
   supplies nothing. Untagged defaults to `INSPIRATION`.
7. Existing `Draft/` (if one exists)

Before writing **any HTML**, also read `Shared/Frameworks/Cerberus/FRAMEWORK-README.md` and the Cerberus
document matching the task (§6.20). It is the official rendering reference, not a source of brand or
campaign values — it never displaces items 1–7 above.

**Before designing, briefing, exporting or building any HERO, read
`Shared/Email-Hero-Engineering-Standard.md` (§6.13-H).** It is the single source of truth for Hero
architecture across this project and Klaviyo Flow and Claude Code, and it is a **gate**, not background
reading: its geometry check must be computed **before artwork is commissioned**. Like Cerberus it holds no
brand or campaign values, and it never displaces items 1–7.

### 3.1 The engineering layer — `Shared/Engineering/`

**`Shared/Engineering/` is the governance layer over the engineering standards.** It holds **no build rules**
and will not help you build a campaign. It answers the questions this file cannot:

| Question | Document |
|---|---|
| **Why** was an engineering decision made? | `Architecture-Decision-Records.md` (ADR-001 … ADR-008) |
| **Where** does knowledge live, and what wins on conflict? | `Engineering-Document-Relationships.md` |
| **Who** may change a standard, and on what authority? | `Engineering-Governance.md` |
| **How** does a change get proposed, approved and released? | `Engineering-Change-Management.md` |
| **What** does a version number mean; how is a rule deprecated or rolled back? | `Engineering-Versioning.md` |
| **How** is conformance proven before anything ships? | `Engineering-QA-Process.md` (gates G0–G3) |
| Which standards exist, and at what version? | `README.md` §3 — the **Standards Register** |

**Read it when:** you are new to the project · you are about to change a standard · something rendered wrong
and you want to know whether it was already diagnosed. **Do not read it to build a campaign** — for that,
follow the read order above.

**Two things it deliberately does not replace.** `09-Architecture Decisions/Decision-Log.md` (`D-##`) keeps
recording **business and operating** decisions and is **not** superseded — ADRs record **engineering**
decisions, and the boundary is set out in `Shared/Engineering/README.md` §8. And `Shared/Engineering/` holds no
campaign standards; those stay in this file and in `00-Project Overview/`.

**Mirrored:** byte-identical copies exist in Klaviyo Flow and Claude Code. Both are canonical, and **any change
must be applied to both in the same edit** (ADR-007). Engineering knowledge exists **once** — these documents
reference standards rather than restating them, and so must any addition to them.

## 4. File-Driven Workflow

Every send moves left→right through the six stages in `Brands/<CODE>/Campaigns/<Type>/`, where
`<Type>` is any supported campaign type (Weekly, Monthly, Product Launch, Holiday, Seasonal, Category,
Clearance, Brand Story, Educational, Automation — see §5.3). Each stage is a folder; read the previous
stages, write only the current one. **Always start from `07-Prompt Library/00-START-HERE.md`**, which
routes you to the right playbook (`Playbooks/<Type>-Playbook.md`), generate prompt, and QA checklist for
the chosen type.

| Stage | Folder | Do | BRD |
|-------|--------|----|-----|
| 1 Brief | `Brief/` | Capture the brief from the Content Calendar | WK-P1 / MO-P1 |
| 2 Reference | `References/` | Gather screenshots & reference inputs | WK-P1/P3 · MO-P1/P3 |
| 3 Assets | `Assets/` | Collect this send's image files (evergreen from `Brands/<CODE>/Assets/`) | WK-P3 / MO-P3 |
| 4 Generate | `Draft/` | Build HTML from `Templates/<cadence>` + `Components` + brand values | WK-P4 / MO-P4 |
| 5 Review + QA | `Review/` | Render, review vs. `CS-##`, run the QA Checklist | WK-P5–P6 · MO-P5–P6 |
| 6 Output | `Output/` | Store the final approved HTML | WK-P7–P8 · MO-P7–P8 |

### 4.1 Mandatory pipeline — Brief → Draft → Review → Output (permanent, all campaign types)

Every generated email — **Weekly, Monthly, Product Launch, Holiday, Seasonal, Category, Clearance, Brand
Story, Educational, Automation** — moves through this pipeline. It is a permanent rule that applies
identically to every brand and every campaign type, and it works the same for all of them.

```
Brief → Draft → Review → Output
```

- **Brief** (`Brief/`) — the request/intent is captured first, and it is where campaign scope, blockers,
  and the **approval status** are recorded. (References + Assets are gathered at this stage too; see the
  stage table above.)
- **Draft** (`Draft/`) — **every generated HTML is created here first**, always, versioned
  `-draft-vN.html`. **Keep the full version history** (v1, v2, v3, …); **never delete previous draft
  versions** — they are the rollback trail.
- **Review** (`Review/`) — QA notes, feedback, client-render results, and **approval status** live here.
  **Review notes must reference the specific Draft version** they assess (e.g. `…-draft-v3.html`).
- **Output** (`Output/`) — **always contains the latest generated HTML** as a single, **un-versioned**
  file (`<CODE>-YYYY-<id>.html`). This is the copy used for browser preview, Klaviyo preview, QA testing,
  and stakeholder review.

**How Output behaves (never bypass Draft):**
- **Never skip `Draft/`.** No campaign type is exempt. HTML is authored in `Draft/` first, always.
- **Every time a new draft is produced:** (1) save the new version in `Draft/` (`-draft-vN.html`),
  (2) update `Output/` with that latest HTML (overwrite the single un-versioned file), (3) keep all
  previous Draft versions intact. `Output/` therefore mirrors the newest Draft.
- **`Output/` presence does NOT mean "approved to send."** Approval is a **status tracked in `Brief/` and
  `Review/`**, not something enforced by withholding HTML from `Output/`. The latest build always lives in
  `Output/` so it can be previewed and reviewed.
- **Blockers do not empty `Output/`.** If there are unresolved blockers (404 / dead links, hidden or
  unpublished products, missing/unverified assets, failing QA, or pending approval), the latest HTML still
  lives in `Output/` for preview, and the blockers + "not approved to send" status are documented in
  `Review/` (and flagged in `Brief/`). What blockers gate is the **actual send** (§8.1), not the file's
  presence in `Output/`.

This mirrors the established Weekly workflow (e.g. `Brands/SS/Campaigns/Weekly/` — many `Draft/-vN`
versions, one un-versioned file in `Output/`). See §9 for the send-approval gate.

### 4.2 Design Intent block — required in every send's `Brief/`

**Every send's `Brief/` carries a Design Intent block and a Reference Register.** This is the design target
of record for that send. Every field is an existing governed concept selected from the documents cited — it
introduces no new vocabulary, no new stage and no new gate. It is metadata: `Design status: NONE` is valid
and means current behaviour. The Flow project carries the identical block in its `Flow.md`; the **mechanism**
is owned by `Shared/Creative-Workflow-Standard.md` §4.0 and `Shared/Email-Design-System/`, and only the
**path** differs between projects.

```markdown
## Design Intent

| Field | Value | Owned by |
|---|---|---|
| **Design status** | NONE | one of NONE · PROPOSED · LOCKED · SUPERSEDED |
| Fidelity mode | — | STD-CREATIVE §4.0 — TARGET · INSPIRATION · LEGACY |
| Hero role | — | STD-HERO §15.6 |
| Hero pattern | — | STD-DESIGN · Hero-Pattern-Library.md |
| Design language | — | STD-DESIGN · Design-Language-Library.md |
| Dominance | — | STD-DESIGN · Design-Decision-Matrix.md Q3 |
| Emotional objective | — | STD-DESIGN · Design-Decision-Matrix.md Q2 |
| CTA strength | — | STD-DESIGN · Flow-Design-Recommendations.md §1.2 |

### Reference Register
| File | Mode | Note |
|---|---|---|
| (each file in this send's References/ folder) | — | untagged = INSPIRATION |
```

- **Design status meanings.** `NONE` — no design intent recorded; the creative phase has not run.
  `PROPOSED` — a direction exists, awaiting approval. `LOCKED` — approved; the Creative Lock
  (STD-CREATIVE §8) applies and implementation may refine but not redesign. `SUPERSEDED` — replaced by a
  later recorded direction; retained for history.
- **`Flow-Design-Recommendations.md` is Flow-specific** (§3 item 0b); for a campaign, take CTA strength
  from its §1.2 scale and select the Hero role from STD-HERO §15.6 per the campaign-type mapping in §6.13-H.
- **The §5.1.1 approved-send baseline is always `INSPIRATION` and is never tagged `TARGET`** — that workflow
  requires each Weekly to *improve on* its baseline, not reproduce it (STD-CREATIVE §4.0, Campaign exception).
- Checked at the §8.1 send gate. **Existing sends are not retrofitted**; the block is required for new work.

## 5. Production Rules

- **If information is missing, stop and request clarification instead of inventing values.**
  *(Permanent operating rule for this project.)*
- **Never invent brand values.** Use only approved sources; carry their confidence tags
  (`[Confirmed]` / `[Inferred]` / `To be confirmed`) into the work. Absent value → `To be confirmed`.
- **Unified framework, thin brand layer** — all brands share `Components`/`Templates`/`Shared`; only
  brand-dependent values differ, applied at generation (`CS-03`, `CR-19`).
- **No duplication** — reusable markup lives once in the shared layer; send-specific material lives in
  that send's campaign folder.
- **Separation of duties** — reviewer/approver ≠ author (`CR-16`).
- **Never edit the BRD from production work.** If production reveals a rule gap, raise it against the
  modular BRD source, then regenerate `BRD.md`.

### 5.1 Product-based Weekly Campaigns (default execution rules)

Global rules for standard product-driven Weekly sends. A campaign `Brief/` may override the default
product count **only** when the override is **explicitly documented and approved** there.

- **10 featured products by default**, laid out as a **2-column × 5-row** grid.
- **Balanced cards** — consistent card height, image area, spacing, padding, product-name area, price
  alignment, and CTA alignment across every card; differing source image dimensions must not break it.
- **Product data comes from the brand's approved product source** (per its brand doc). When that source
  is **BigCommerce**, retrieve from BigCommerce and verify each product is **active** and **currently in
  stock / purchasable** per its inventory configuration.
- **Verify stock on the product page itself, not a category/collection listing.** Category and
  collection pages routinely misreport availability (an item can show "Add to Cart" in a listing yet be
  Out of Stock on its own product page, and lazy-loaded listings hide the real image/price). Confirm
  each selected product's stock, price, URL and image on its **individual product page** before it enters
  the grid; if an item is out of stock, replace it and re-verify. Never leave an empty card.
- **Never invent** product names, prices, SKUs, stock status, product URLs, or image URLs (this extends
  the "never invent" rule above to product data). If 10 valid products cannot be retrieved from the
  approved source, **report the blocker** — never fabricate products to reach the count.
- **Reference screenshots are visual direction only** — they never override verified product data or
  authoritative brand rules.

**Product banners.** When a Weekly Campaign requires a product banner, select a product or asset that
**matches the campaign theme** — not merely one with a better image. Prefer the brand's approved
**BigCommerce** source; the **official live brand website** may be used only as an approved **fallback**
when no suitable banner asset is available from BigCommerce. Do not fabricate or AI-generate product
imagery unless explicitly requested and approved.

### 5.1.1 Weekly continuous-improvement loop (analyze the last approved send → beat it)

Permanent Weekly workflow. Every new Weekly send is a deliberate upgrade of the brand's most recent
**approved** send, not a blank-page build. This governs the *creation loop*; freshness rules live in §5.2
and the Draft→Output pipeline in §4.1/§9 — do not restate them.

- **Start from the latest approved campaign.** Before briefing a new Weekly, open the brand's newest
  approved send in `Campaigns/Weekly/Output/` and internally assess it (objective, hero, storytelling,
  journey, visual hierarchy, CTA strategy, product arrangement/grouping, psychology, mobile/scroll,
  strengths, weaknesses). Use it as the improvement baseline only — never copy it.
  **This baseline is always `INSPIRATION` fidelity mode and is never tagged `TARGET`** (§4.2 ·
  STD-CREATIVE §4.0), because this loop requires each send to improve on the baseline, not reproduce it.
- **Each send must measurably improve on that baseline** (creativity, storytelling, UX, psychology,
  product grouping, visual hierarchy, conversion) **and** introduce a genuinely fresh concept per §5.2
  (new theme, hero, journey, section flow, product edit; don't reuse last week's collection).
- **Author in `Draft/` only** (§4.1). Stop after Draft and wait for the user's review; iterate on the
  Draft version. The un-versioned `Output/` file is (re)generated only from the **user-approved** Draft
  (§9) — Output represents the approved production campaign.
- **Every campaign must answer:** why should the customer care · why this theme · why these products ·
  why now · why buy from this brand.

### 5.1.2 Theme consistency & product count (all brands — permanent)

Established RDD-2026-W32. Reinforces §5.1 / §6.3.

- **Theme/category consistency is mandatory.** Every product in a Weekly (and in every campaign type) must
  belong to the **same campaign theme/category**. **Never mix unrelated categories** in one send. Choose
  products that match the theme — e.g. an *Acrylic Displays* send features only acrylic display products
  (sign holders, brochure holders, poster/photo frames, menu holders, business-card holders, suggestion/
  donation boxes, counter/wall displays, leaflet/literature holders, etc.), never unrelated SKUs.
- **Default product count ≈ 14–16** for a range-coverage Weekly (per §6.3), unless the send's `Brief/` or
  project docs specify otherwise. Keep the grid **balanced** (even count → clean 2-col, or centre the odd
  last card, §6.9) and the email not excessively long.
- **Verification still governs (§5.1).** Theme fit never overrides verification — every product must be
  confirmed in stock, correct price, live URL and real image **on its own product page**; a themed product
  that is OOS / 404 is **replaced and re-verified**, never forced to hit the count.

### 5.1.3 Weekly Campaign design philosophy — premium editorial, not promotional catalogue (all brands — permanent)

Established RDD-2026-W32. Governs the *feel* of every Weekly send; the concrete build standards it implies
live in §6.22 (closing CTA + section copy), §6.21 (icons/trust) and §6.8–§6.9 (grid). Do not restate those.

- **Every Weekly Campaign should read like a premium editorial email, not a promotional catalogue.**
  Prioritise: **premium whitespace · product storytelling · clean hierarchy · subtle conversion · a modern
  B2B appearance** (Apple / Shopify Plus / Really Good Emails as the quality bar).
- **Avoid:** excessive orange sections, heavy promotional banners, visual clutter, unnecessary decorative
  elements, and cartoon/emoji graphics (§6.21). **Orange is an accent and a CTA colour, not a background
  for whole sections** — reserve large solid-orange fields for a genuine promo/coupon block, never for a
  generic closing bar (§6.22).
- **Restraint is the default.** When a section can be quieter and still convert, make it quieter. This is a
  design *philosophy*, not a new gate — it informs every refinement but introduces no new stage.

### 5.2 Campaign content hierarchy & non-repetition

- **No repeated messaging** — never repeat the same introduction, campaign message, headline concept, or
  supporting copy across consecutive sections. Each section must have a **distinct purpose** that moves
  the campaign narrative forward.
- **Fresh each week** — a new weekly send must not reuse the previous week's campaign angle, seasonal
  theme, eyebrow, headline concept, or hero treatment. Carry forward the proven structure and brand vibe,
  but the theme and copy must be genuinely new for the current send.
- **One introduction** — when the main campaign hero has already established the theme and message, do not
  add a second introduction. Hero visuals and later sections **support** the theme, they don't restate the
  opener.
- **Fit the theme** — template structure, content hierarchy, visual direction, products, and supporting
  sections must suit the specific campaign theme and objective; do not mechanically reuse a section
  structure when it doesn't fit.
- **Review as one experience** — before finalising, read the whole email end-to-end as one customer
  journey and remove redundant messaging or unnecessary sections.

### 5.3 Campaign Selection Engine (determine the type FIRST — all brands)

**Before creating ANY campaign, decide which campaign type it is.** The type is chosen from the brief /
Content Calendar / request, never assumed. The system supports these types, each with its own folder,
playbook (`Playbooks/<Type>-Playbook.md`) and generate prompt (`07-Prompt Library/Generate-<Type>-Campaign.md`):

**Weekly · Monthly · Product Launch · Holiday · Seasonal · Category · Clearance · Brand Story ·
Educational · Automation.**

- **Each campaign type must have its own** psychology, hero, copywriting, CTA strategy, product strategy,
  QA, and validation. They are genuinely different jobs, not skins of one layout.
- **Never reuse the Weekly layout for another type.** A Product Launch is an *event* (something new as
  news); a Category send is a *deep dive*; Clearance is *urgency + value*; Brand Story is *credibility*,
  low product density. Do not mechanically apply the Weekly grid-first structure to any of them.
- **Automation** = triggered/lifecycle content; automated **flows** live in the **separate Klaviyo Flow
  project** (this workspace coordinates content, it does not build flows).
- The routing map and per-type table live in `07-Prompt Library/00-START-HERE.md` — start there every time.

### 5.4 Product Launch campaigns (type-specific rules)

Permanent rules for **Product Launch** sends (full strategy: `Playbooks/Launch-Playbook.md`).

- **Introduce, educate, build awareness — not discounts.** Launches are premium announcements against a
  warm list. Any offer is a *welcome/introductory* framing placed **after** the product proof, never the
  lead. Use launch-first storytelling: hero sells the idea, grid proves it.
- **Approved SKUs only.** Feature exactly the SKUs in the brief. **Never auto-select newly-created
  BigCommerce products** — newly-created items are frequently `visible=false` and must be treated with
  extra suspicion (see below).
- **Verify every SKU via the BigCommerce API, not storefront search.** Storefront search/sitemap hide
  unpublished products, so they give false negatives. Confirm via the Catalog API
  (`/catalog/products?sku=`, `/catalog/variants?sku=`): exact SKU, `is_visible=true`, in stock, non-zero
  price, and that the **live product URL returns HTTP 200**. A `visible=false` product returns **404** on
  its customer URL — it is a **dead link** and must not be linked in an email (a hidden product may still
  appear in the grid of a *draft* only, with a clearly-marked placeholder link and a "launching soon"
  flag, but it **blocks promotion to `Output/`** until published + re-verified).
- **Never display another brand's name.** If a product's BigCommerce title carries a different brand
  (e.g. "Safety Sector …" on an RDD send), show an RDD-neutral display name and flag the title for
  renaming — never ship a competitor's brand name on this brand's campaign.
- **Present a verification/mapping table for approval before building** (RDD SKU · name · URL · status ·
  stock · price · image · confidence Exact/High/Medium). Report blockers (hidden/404, $0 price, OOS,
  wrong-brand name); **do not substitute** products without approval.
- **Layout** (distinct from Weekly): Hero banner → Launch badge → Headline → Introduction → Why these
  products → Product grid → CTA → Trust section → Footer.
- **Hero banner destination rule.** On a Product Launch, the **hero banner image and its CTA button
  must link to the brand's all-products / main collection page** (for SS:
  `https://www.safetysector.com.au/products/`), **never to an individual product page** — a launch hero
  introduces the whole range, so a single-product destination misrepresents it. Only link the hero/CTA to
  a specific product when the user or approved `Brief/` explicitly requests it.

## 6. HTML Generation Standards

The authoritative standards are `CS-08`–`CS-15` in the BRD — follow them; do not restate them here.
Build mechanics only: 600px container, single-column, **table-based layout + inline CSS**, dark-mode
aware (`color-scheme` meta + `prefers-color-scheme` + `[data-ogsc]`). Brand-specific measurements
(sizes, radius, spacing) come from that brand's `Design.md`.

### 6.1 Brand-specific header defaults (logo alignment)

Permanent **default** brand rules for the header logo. These are defaults, **not** permanent
restrictions: the logo position may be changed for an individual campaign when the user explicitly
requests a different alignment or design.

- **Safety Sector (SS):** Safety Sector (SS) campaign emails must use a **LEFT-aligned logo** in the
  header by default, following the approved SS campaign reference design.
- **SectorCare (SC):** SectorCare (SC) campaign emails must use a **LEFT-aligned logo** in the header
  by default, following the approved SectorCare campaign reference design.

These rules apply to **SS and SC only** — do **not** apply them to RDD or Stack (those brands follow
their own approved reference designs / brand docs).

**Header logo sizing (SS — permanent default, all future SS Campaigns and Flows).** Safety Sector header
logos must always appear **visually balanced**. **Do not use oversized logos.** Prefer a **slightly smaller
logo with generous whitespace** around it, so the logo supports the header and never dominates it — matching
the approved Weekly Campaign reference. Practical default: header wordmark ~**120–130px** wide
(`max-width` ~36–42% of the header cell) with comfortable header padding; scale down, not up, when in doubt.
This is a **default**, not a restriction — a specific campaign may request a different treatment. (Learned on
SS-2026-W30, where a 150px logo read as oversized.) Applies to **SS**; other brands follow their own
approved reference designs.

### 6.2 Campaign copy & product-grid quality (all brands)

General email-design quality rules for every campaign generation:

- **Introduction copy — no dashes.** Campaign introduction/supporting copy must not use em dashes or
  dash-based sentence interruptions. Use clean, natural sentences instead. Keep introduction copy
  concise and visually controlled.
- **Product-grid balance.** Product grids must always be visually balanced. Product cards within the
  same row should use consistent image areas, typography, spacing, and price placement. Shorten overly
  long product descriptions when necessary to prevent uneven card heights, while preserving factual
  accuracy.
- **Product cards are cohesive units.** Design each card so the image, product information, and
  price/CTA feel connected as one unit rather than visually separated. Avoid excessive unused white space
  inside cards, and keep the vertical spacing between the product text and its price/CTA intentional and
  compact. Product images must not appear isolated or floating at the top of an oversized image area —
  rebalance the image, text and price areas together rather than only changing card height.
- **Subtle brand-decorative elements.** Brand-specific decorative elements (e.g. a small brand mark on a
  card) may be used subtly when approved, but they must never compete with the product image or damage
  readability, and must not introduce awkward spacing. If a decorative element makes cards worse, document
  the comparison instead of forcing it.
- **No duplicate/redundant CTAs.** Campaign emails must avoid duplicate or redundant CTA concepts. If an
  earlier primary CTA already provides a broad action such as Learn more, Shop now, Explore the range, or
  similar, do not add another generic CTA such as See full range later in the email unless it serves a
  clearly different purpose or destination.

### 6.3 Campaign workflow & first-impression (all brands)

General campaign-generation workflow principles:

- **First impression is a primary objective.** The above-the-fold area must immediately hook the reader
  and encourage them to keep scrolling. Keep it strong, clean and easy to scan; do not overcrowd the top.
- **Product visibility as retention.** Showing enough relevant products is a retention mechanism — surface
  enough of the range to make readers want to keep exploring.
- **Default recommended product count may be 14–16** when it suits the campaign and the email stays
  visually balanced and not excessively long (otherwise use fewer).
- **Formatting & alignment consistency.** Maintain strict, intentional alignment, spacing, width and
  typography consistency across *all* sections, not just the product grid.
- **Copy length by campaign type.** Normal campaigns should generally use concise, highly scannable copy;
  special seasonal / holiday / EOFY / promotional campaigns may justify longer, more emotional or
  promotional messaging.
- **Coupons must be verified.** Coupon codes must be confirmed created and active in the relevant commerce
  platform (e.g. BigCommerce) before send.
- **Post-build visual QA audit.** Perform a full post-build visual QA (desktop + mobile) before presenting
  a campaign for review, and complete a final self-QA so the version presented is as close to final as
  possible.
- **Preserve what works.** Preserve successful visual direction and the established brand vibe unless new
  feedback explicitly requires a change.

### 6.4 SectorCare (SC) campaign — promo / coupon rule

Permanent, **SC-only** rule (per Bruce). Do **not** apply to SS, RDD or Stack — those brands follow their
own promo conventions.

- **Standard SC coupon is a fixed-dollar discount: "$20 off orders over $200"** (offer text
  "Save $20 on orders over $200" or "$20 off orders over $200"). This is the default for every SC send.
- **No percentage-based discounts for SC** (e.g. "15% off") unless a **special arrangement or explicit
  campaign instruction** specifically requires one.
- If a campaign instruction conflicts with this standard **because of an explicitly approved special
  arrangement**, follow the approved campaign-specific instruction.
- **Readability first (older audience).** SC promo sections must be highly readable: avoid very small font
  sizes for the promo heading, coupon code, offer text, CTA text, and validity/expiry text. Keep a clean,
  balanced hierarchy (readable, not oversized).
- **Always verify** the promo section is clear and readable on **both desktop and mobile**.
- Coupon codes are still subject to the global rule (§6.3): confirmed created and **active** in BigCommerce
  before send.

### 6.5 Dynamic coupon section (all brands)

The coupon/promo section is **part of the campaign story, not a generic discount block**. For every
campaign, its title, heading, CTA, and supporting copy must be **freshly written for that campaign** and
must match its theme, hero message, and customer intent.

- **Never reuse a coupon title or promotional heading from a previous campaign** unless explicitly
  instructed. Avoid recycled headings such as `WINTER20`, "Winter Offer", or any leftover title from an
  earlier send.
- **Generate a unique promo title** that aligns with the current campaign theme and feels like a natural
  continuation of the hero message (not a bolt-on).
- **Make all promo copy context-aware** — the promo eyebrow/title, the offer line, the CTA text, and any
  supporting copy adapt to the current campaign's theme and audience.
- **Coupon code vs. promo title are separate.** Never invent a coupon *code* (this reinforces the
  "never invent" rule and §6.3). If the real code has not been provided, use a **clearly-marked
  placeholder** for the code while still writing an appropriate promo title, offer framing, and copy.
- Brand-specific offer structure still applies (e.g. SC's fixed-dollar rule, §6.4); this rule governs the
  *title and messaging*, not the discount mechanics.

Example promo titles (illustrative, adapt per campaign — do not reuse verbatim): "Move Freely. Save More.",
"Your Mobility Bonus", "Everyday Comfort Savings", "Independence Starts Here", "Better Living Starts Today",
"Safe Steps, Better Savings", "Comfort That Rewards You".

### 6.6 Email-client link & containment safety (all brands — learned from SS-2026-W29)

Several build defects survive a localhost/desktop preview but break in real email clients / Klaviyo
(notably **Apple Mail on iPhone**, the strictest common client). A browser preview is **never** sufficient
proof for any of them — each must be checked in the built markup.

- **Never wrap a `<table>` (or any block-level element) inside an `<a>`.** An anchor is an inline
  formatting element; wrapping a table in it is invalid nesting. Browsers tolerate it, but **Klaviyo
  re-parses and rewrites links on import** and detaches the `href` from the block wrapper, so the element
  renders but is **not clickable after upload** (this is exactly why SS product cards failed while RDD/SC
  did not). **Rule for clickable product cards:** the anchor must contain **inline content only** — wrap
  the `<img>` in its own anchor, keep any image-centering `<table>` **outside** all anchors, and put the
  name/description/price in a **separate** anchor (`<p>`/`<span>` inside an anchor is fine; a `<table>`
  is not). To make the whole card clickable, use multiple sibling anchors to the same URL — never one
  anchor around the whole card structure.
- **Fluid images must sit in tables whose width is set in inline `style`, not only the HTML attribute.**
  A `<table width="100%">` that carries width **only** as an attribute can be shrunk-to-fit by some mobile
  clients (Gmail app / Yahoo) when it wraps a fluid `width:100%` image with no intrinsic minimum width —
  the frame collapses and the image renders smaller on *some* devices only (the SS hero shrink). Always
  put `width:100%` in the `style` of any structural full-width table, give fluid banner images
  `max-width:100%` (never a fixed `max-width:NNNpx` ceiling below the container), and add a defensive
  responsive class (e.g. `.hero-img { width:100% !important; max-width:100% !important; height:auto !important; }`).
- **Never put `display:block` on an `<a>` that wraps an image — keep the anchor inline; make the `<img>`
  the block element.** An anchor is inline by default. Forcing `display:block` on an anchor that contains
  only an image makes Apple Mail (iOS WebKit) resolve that block's height *before the image decodes*; with
  no explicit box it **collapses the anchor to zero height and never paints the image**. Desktop Safari and
  Gmail Android decode-then-reflow and recover, so the image looks fine everywhere except **Apple Mail on
  iPhone/iOS** — which is exactly why the SS-2026-W29 hero + product images failed on iPhone while rendering
  in desktop browsers, VS Code and Gmail Android. Put `display:block` on the `<img>`, leave the `<a>` inline
  (`text-decoration:none;` only).
- **Every fixed-size image needs explicit `width` and `height` HTML attributes** — do **not** size an image
  by `max-height` + `width:auto` with no dimension attributes. Apple Mail iOS has no intrinsic box to reserve
  and drops the image. For a square product thumbnail use `width="176" height="176"` +
  `style="display:block; width:176px; max-width:100%; height:auto; margin:0 auto"` (fluid on mobile via a
  `.pc img{width:100%!important}` rule); for a fluid banner give the real pixel `width`/`height` so the aspect
  box is reserved, then let `width:100%; height:auto` scale it.
- **QA gate:** before Output, confirm **zero anchors contain a `<table>`**, **zero image anchors carry
  `display:block`**, every structural full-width table carries `width:100%` in its inline style, and every
  fixed image carries `width`/`height` attributes. Verify clickability **and** image rendering in a real
  Klaviyo test import **and on Apple Mail iPhone**, not only on localhost/desktop.

### 6.7 Navigation & CTA link rules (all brands — permanent, default for every campaign)

Every clickable element in an email must point to a real, live, verified destination. This is a
**permanent default** — it applies to every Klaviyo campaign automatically and needs no manual reminder.

- **Every navigation item must link to its matching live category page.** Header/menu items are **never**
  decorative or plain text, and never link to the generic homepage as a stand-in for a category.
- **Every CTA button must link to its intended destination** (its specific product, category, or
  collection page) — not a generic fallback.
- **Never use `#`, empty `href`s, placeholder URLs, or dead/404 links** anywhere in an email. A product
  that has no live page yet is **not** linked as if it were live (see `§5.4` / `§8.1`): show it clearly
  flagged (e.g. "Launching soon") rather than pointing a CTA at a 404 or `#`.
- **Verify every URL before publishing** — each must return **HTTP 200** (product/category pages and image
  `src`s alike). Re-verify on every revision; never assume a link still resolves.

**Destination mapping (canonical examples):**

| Element | Links to |
|---------|----------|
| `SHOP NOW` | the specific featured **product page** |
| `VIEW PRODUCT` (product card) | that card's own live **product page** |
| `EXPLORE COLLECTION` | the all-products collection — `https://www.retaildisplaydirect.com.au/products/` |
| Nav: **Workspace** | Workspace/office category (e.g. `…/sit-stand-desk/`) |
| Nav: **Signage** | Signage category (e.g. `…/snap-frames/`) |
| Nav: **Safety** | Safety category (e.g. `…/safety-equipments/`) |
| Nav: **Retail** | Retail-display category (e.g. `…/acrylic-display/`) |

RDD has no literal "Workspace/Signage/Safety/Retail" department pages; map each nav label to the closest
**verified-live** RDD category (the examples above are confirmed 200). Product-card image, title, and CTA
must **all three** link to the same live product page (`§6.6`, `§8.1`). Future email templates follow this
rule by default.

### 6.8 Product Grid Layout Standard (all brands — permanent, mandatory for every template)

Every product grid in every Klaviyo email — **Weekly, Product Launch, Seasonal, Holiday, Category,
Clearance, Brand Story, Educational, Automation, and any future template** — must produce **equal-height,
perfectly aligned cards** regardless of differing title/description/price lengths. This is a permanent
default; no manual reminder should be needed.

**Required outcome (the rule):**
1. **Equal card height per row** — every card in the same row is identical height; a card never grows or
   shrinks because its content is longer/shorter.
2. **Fixed/reserved content regions** — each card reserves a **consistent height** for: product image ·
   product name · description · price · CTA button / status badge. If a product has less text, the
   reserved height is kept so all cards still align.
3. **Price + CTA/status align horizontally** across every card in a row ("View Product", "Launching Soon",
   price, etc. sit on the same line).
4. **Concise descriptions** — roughly one line where possible; avoid long marketing sentences inside cards.
   Good: "500mm modular speed hump." · "89mm surface-mounted bollard." · "Concertina barrier, extends to
   3.5m." Keep copy tight (preserving factual accuracy) as **polish** — but the **reserved fixed-height
   cell (below), not copy length, is what holds the grid together**; a longer line must never be what
   determines a card's height.
5. **Responsive consistency** — desktop and mobile both preserve equal heights and clean alignment; on
   mobile, reserved heights reset so stacked cards size naturally.

**Why grids drift if you get this wrong (root cause — learned across SS-2026-W30 v3→v6):**
- **Letting content decide card height is the root cause.** When one card's title wraps to 2 lines or a
  description runs longer, that card grows taller than its neighbour — so its price/CTA lands at a different
  vertical position, the row looks unbalanced, and the *next section* starts at an inconsistent height.
- **Shortening titles/descriptions is NOT a fix.** It only lowers the odds of a wrap; the next copy change
  reintroduces the drift. Treat copy-shortening as cosmetic, never as the alignment mechanism.
- **`min-height` on `<p>`/`<div>` (non-table elements) is not enough.** It reserves height in Apple
  Mail/iOS/Gmail but is **ignored by Outlook's Word engine**, so cards still drift in Outlook. The fix has
  to be structural.

**How to implement it — build every card from ONE reusable, fully fixed-height component (email-safe;
table-based medium, NOT a browser):**
- **Reserve every region with a fixed-height table CELL, not `min-height`.** A `<td height="N">` (repeat
  `height:Npx` in the inline `style` too) is the one sizing primitive **Outlook honours**. Give every card
  the same stack of cells, each with an explicit height sized to the longest content in that grid:
  **image area · product title (reserve 2 lines) · description (reserve 2 lines) · price · CTA button /
  status badge (if used)**. Because height is set by structure, card height **never depends on content** —
  every image, title, description, price and CTA sits at the identical vertical position across the whole
  grid, in Gmail, Apple Mail **and** Outlook.
- **`valign="top"`** on the image/title/description cells (content grows downward from a fixed origin);
  **`valign="middle"`/`"bottom"`** on the price/CTA cell so it holds its line.
- **The inter-region spacer is fixed PADDING, never an empty cell.** Add the gap as top padding on the next
  cell (e.g. `padding-top` on the price cell). **Do NOT insert an empty `<td></td>` spacer** — empty cells
  are ghost elements (§8.2) and collapse/misrender in Gmail/Outlook.
- **Do NOT use `display:flex` / `grid` / `align-items` / `justify-content` / `margin-top:auto`.** Flexbox
  and grid are unsupported in Outlook (Word engine) and unreliable in Gmail, so an equal-height / pinned-CTA
  layout built on them **silently fails**. They may only be a progressive-enhancement layer *on top of* a
  working table layout, never the sole mechanism.
- **Keep `height:100%` on each card `<table>`** inside the equal-height row cells as a defensive backstop:
  if content ever exceeds a reserved height, the shorter card still stretches to match rather than leaving a
  short border.
- **Mobile:** reset the fixed cell heights to `auto` in the `max-width:600px` media query (put a class on
  each reserved cell, e.g. `.pimg/.pnc/.pdc/.ppc`) so full-width stacked cards size naturally.
- **`min-height` utility classes are a fallback only** — acceptable as progressive enhancement for clients
  that honour them, but never the primary equal-height mechanism (Outlook ignores them).
- **Never fake alignment with ad-hoc/random margins.**

**QA gate before Output (run on every grid, every section):** confirm ✓ every card in a row is identical
height · ✓ every image, title, description and price **begins at the same vertical position** · ✓ every
price/CTA sits on the same **horizontal line** · ✓ each section's last row ends at the same height so the
next section starts consistently · ✓ it holds on **Gmail desktop + mobile, Apple Mail (incl. iPhone) and
Outlook** (the §8.1 client set), not just a browser/localhost preview. Record the result in `Review/`.

**Never deliver a product grid with cards misaligned due to varying content.** (Reference implementations —
one reusable fixed-height-cell card component, every region a fixed-height `<td>`
(image → title → optional promo-label → description → price → CTA), with mobile height resets:
`Brands/SS/Campaigns/Product Launch/Output/SS-2026-LAUNCH-Product-Launch-Final.html` (v23 — Product Launch,
includes the reserved promo-label row) and `Brands/SS/Campaigns/Weekly/Draft/SS-2026-W30-draft-v6.html`;
earlier grid reference: `Brands/RDD/Campaigns/Product Launch/Draft/RDD-2026-LAUNCH-Concept-D-draft-v4.html`.
Reserve enough height for the **longest** expected title/description (2 lines each by default; `height` is a
minimum in Outlook, so a 3-line line will grow the cell — bump the reserve if copy runs longer).)

### 6.9 Email product grid composition — 2-column default & balance (all brands — permanent)

Marketing emails prioritise **visual balance over product density**. A campaign email is not an ecommerce
category page — a symmetrical, generous grid outperforms cramming the maximum products per row.

- **Default to a 2-column product grid** (two cards per row). Only use a different column count when a
  campaign specifically requires it and it still stays balanced.
- **Center the final card when a section has an odd number of products** (5, 7, 9 …). Never leave a single
  card aligned only to the **left or right** — it reads as a missing product.
  - **The lone card must be byte-for-byte identical to every other card** — same CSS class, card width,
    card height, image dimensions, typography, padding, and CTA/button size. **Only the wrapper handles
    centering; never resize the card, image, fonts, padding, or width to make it fit.**
  - **Robust email-safe centering:** give the final row's cell **`colspan="<number of grid columns>"`**
    (e.g. `colspan="2"` in a 2-col grid) so it spans the **full grid width**, then inside it wrap the
    *unchanged* card in a nested table with the **`align="center"` attribute** at a **fixed pixel width equal
    to exactly one grid column** (not a shrink-to-fit `%`), full-width on mobile. Example:
    `<tr><td colspan="2" align="center"><table align="center" width="282" class="center-half"
    style="width:282px; max-width:100%;"> …identical card cell… </table></td></tr>` with
    `.center-half { width:100% !important }` in the mobile media query. (282px = 50% of a 564px grid inside
    the 600px container; compute per template.)
  - **The `colspan` is essential — this is the #1 cause of a "still not centered" last card.** A lone `<td>`
    **without** `colspan` only occupies the **first column** (left half) of the row, so any centering inside
    it just centers within that half and the card stays left-aligned. Always span all columns first.
  - **Do NOT** center with a percentage-width wrapper (e.g. `width="50%"`) — Gmail/Outlook **shrink-wrap it
    to the content**, making the card render smaller than the others. And **do NOT** flank the card with
    empty spacer `<td>`s — zero-content/zero-font cells **collapse in Gmail and Outlook**, pushing the card
    to the side. Both are known bugs this rule exists to prevent.
- **No orphan rows.** A lone left/right-aligned card on the last row reads as a mistake; balance every row.
- **Preserve** equal card heights, equal image sizes, equal CTA/price alignment, and consistent vertical
  row spacing when centering the final card.
- **Grids should feel symmetrical and professionally composed** — equal spacing, equal card widths,
  intentional last-row treatment.
- **Mobile:** all cards stack to full width; spacer cells collapse (`display:none`).
- Combine with `§6.8` (equal card height + reserved content regions) so the 2-column grid is both balanced
  *and* aligned. Applies to Weekly, Product Launch, Seasonal, Brand, and every future Klaviyo template.

(Example: a 7-product section becomes rows of 2·2·2·1 with the final card centered — see the Modular
Rubber Ramps grid in the reference implementation above.)

### 6.10 Header navigation style standard (all brands — applies ONLY when a nav is included, §6.11)

**This section governs *how* a header navigation looks, not *whether* to include one.** A header nav is
**opt-in**, never automatic — see §6.11. When (and only when) the user has asked for a header navigation, it
must follow the style below. The header navigation should feel like a **premium ecommerce brand**, quietly
supporting the hero — not a website-style menu competing with it.

- **No full-width coloured dividers directly above the hero banner** (no full-width gray or orange bars).
  They feel heavy and fight the hero. Use per-item underlines instead (below).
- **Individual decorative underline beneath each nav item** — a short centred line under each word,
  **identical for every item**, **not** a line spanning the whole header:
  - **Colour: RDD brand orange `#F58220`** (permanently visible — it reads as branding, not a hyperlink).
  - **Height: 2px. Width: ~20–24px** (all underlines the same width; never mixed widths or thick lines).
  - **Centred** beneath the nav text.
  - **Email-safe build:** each nav item in its own centred `<td class="navitem">` with the link, then a
    centred underline table beneath it:
    `<table align="center" width="22"><tr><td class="navline" width="22" height="2" bgcolor="#f58220"
    style="width:22px;height:2px;line-height:2px;font-size:2px;mso-line-height-rule:exactly;
    background:#f58220">&nbsp;</td></tr></table>`.
- **Never** use `text-decoration:underline` for this — always a table-cell line.
- **Hover (optional, progressive enhancement):** a subtle opacity fade is fine where `:hover` is supported
  (`.navitem:hover a, .navitem:hover .navline { opacity:0.7 }` with a `transition`). Where unsupported, the
  orange underline must remain permanently visible.
- **Avoid** vertical separators (`|`), bullets, heavy/thick lines, borders across the nav, and full-width
  dividers in the header.
- **Spacing:** logo → nav text → **6–8px** → orange underline (2px) → **12–15px breathing room** → hero.
  Keep it centred and balanced; the hero stays the focal point and the nav quietly supports it.
- **Proportional variant (optional):** navigation underlines **may be proportional — approximately 80–90%
  of each nav item's text width** (so a longer word gets a longer underline) — when a more premium,
  typography-driven appearance is desired. Still centred, still `#F58220` 2px, still per-item tables (set a
  per-item pixel width). The fixed-width and proportional styles are both approved; pick per campaign.
- **Keep it subtle (RDD).** For Retail Display Direct campaigns, navigation underlines should stay **subtle
  and supporting** — the logo and hero remain the visual focus. Avoid any nav treatment (too thick, too
  wide, too bold) that competes with the primary campaign message. When in doubt, thinner/narrower wins.
- **A/B experiments:** when testing visual refinements — underline **thickness, width, spacing, or colour**,
  or any header treatment — **always create a NEW Draft version for the comparison; never overwrite an
  approved Draft or the Final Output** until a design is selected. Promote the chosen one to `Output/`
  afterwards. (See `§4.1`/`§9` — keep every draft version; never delete prior drafts.)

(Reference implementations, all identical except the nav underline:
fixed-width 2px = `…/Draft/RDD-2026-LAUNCH-Concept-D-draft-v4.html`;
proportional 2px ~80–90% = `…-draft-v5.html`; proportional 1px ~70–80% (most subtle) = `…-draft-v6.html`.)

### 6.11 Navigation menus are opt-in — not the default layout (all brands — permanent)

- **Do NOT automatically generate a header/navigation menu** at the top of a Weekly Campaign. A top nav is
  **not** part of the default template.
- **Include a navigation menu only when the user explicitly requests it.** When they do, style it per §6.10
  (and, for RDD, §6.13's navigation-style rule).
- Navigation must **never become the default layout.** In-body category-discovery sections that are part of a
  brand's *approved* template (e.g. RDD's "Shop by Category" pills, an "Explore by Category" tile block) are
  content sections, not a top nav menu, and remain allowed.

### 6.12 Safety Sector product exclusions (SS-only — permanent)

- **Do not use any Anti-Slip Stair Nosing products in any SS campaign** — not in the hero, product grid,
  featured products, promotions, or recommendations. Use them again **only if the user explicitly requests
  them.** (Applies to SS only; does not restrict other brands.)

### 6.13 Retail Display Direct design defaults (RDD-only — permanent)

- **Rotate hero styles — do not make every RDD hero dark.** Vary the hero treatment to fit each campaign
  theme (e.g. white, light grey, soft gradient, orange, dark, or mixed layouts). A dark hero is one option in
  the rotation, never the automatic choice; pick the treatment that best fits the theme.
- **Product-grid style = the approved `Output/RDD-2026-W29.html` grid** — light-grey product-section field,
  clean white product cards, orange price buttons, consistent spacing, premium presentation, equal-height
  cards (§6.8), 2-col balance (§6.9). Keep this as the **default RDD product-card style** unless the user
  instructs otherwise.
- **Navigation style follows the approved RDD design system** (when a nav is included per §6.11) — reuse the
  approved treatment (e.g. the W29 orange-outline "Shop by Category" pills / §6.10 underlines); **do not
  invent new RDD navigation styles unless the user requests it.**

### 6.13-H Hero architecture is governed by the Email Hero Engineering Standard

> ## 📐 THE HERO SPECIFICATION LIVES IN ONE PLACE
>
> **`Shared/Email-Hero-Engineering-Standard.md`** is the **single source of truth** for every Hero in this
> project and in Klaviyo Flow and Claude Code. It is mandatory reading **before** designing, briefing,
> exporting or building any Hero — and its geometry check must be computed **before artwork is
> commissioned**, not after a draft renders badly.
>
> It holds: the geometry gate · the Artwork Contract · the **Aspect-Locked Band + Colour-Bonded Copy**
> architecture · responsive behaviour · per-client requirements (Outlook VML, Gmail, Apple Mail, Samsung) ·
> accessibility · dark mode · images-off · the Hero locking policy · and the **prohibition list**.
>
> **The standard has TWO halves, and a Hero must pass both.** Its §2–§14 govern **geometry** —
> engineering correctness. Its **§15 Hero Marketing Psychology** governs **composition** — communication
> correctness: the mandatory reading order (hook → offer → headline → CTA → reassurance), semantic
> continuity, the **Visual Bridge** requirement, artwork proportion, and the four **Hero marketing roles**.
> **A geometrically perfect Hero can still fail to communicate.** Rationale: **ADR-009**. Review
> procedure: **ECP-002**. None of it is restated here.
>
> **Diagnostic, before proposing any Hero fix** (standard §15.2): a **geometry** failure looks *different*
> between clients or widths; a **composition** failure looks the *same* everywhere.
>
> **Campaign relevance.** §15.6's roles map directly onto campaign types — a Product Launch is a **Product
> Hero**, a promotional Weekly is an **Offer Hero**, a Brand Story is a **Brand Hero**. Declare the role in
> the send's `Brief/` before artwork is commissioned; §15.5's proportion ceiling then follows from it.
>
> Two byte-identical copies exist, one per project; both are canonical. **Any change must be applied to
> both in the same edit.**
>
> **§6.14 below stands unchanged.** **§6.15 below is SUPERSEDED** — read it and the standard's §13.2
> together before building any new Hero.

**Established** 2026-07-29 from the completed v1–v26 Hero geometry investigation (RDD Abandoned Checkout).
The finding, in one line: *the artwork scales with viewport width and HTML type does not, so any Hero whose
composition depends on a left/right relationship between the two will shear on a phone.* The standard turns
that into a checkable formula (`W* = (inset + copy_width) ÷ k`; if `W* > 320px` the architecture is wrong)
and an artwork acceptance contract.

### 6.14 Hero banner must be edge-to-edge (all brands — permanent, automatic)

**Every hero banner must render flush, edge-to-edge inside the 600px email container** — no white canvas, gutters,
borders, strips, baseline gaps, or unwanted padding/margins/spacer rows around it. This is an automatic default for
every campaign; no manual fix should ever be needed. (Learned on RDD-2026-W30.)

- **Hero table:** full-width, `width:100%` in inline `style` (not only the attribute), `cellpadding="0"
  cellspacing="0" border="0"`; no side padding on the hero cell.
- **Hero cell (`<td>`):** `padding:0; margin:0; font-size:0; line-height:0; mso-line-height-rule:exactly;` — the
  `font-size:0`/`line-height:0` kill the image-baseline gap (the thin white strip under an image).
- **Hero `<img>`:** `display:block;` (removes the baseline gap), `border:0; outline:none; text-decoration:none;
  margin:0; width:100%; max-width:600px; height:auto;` plus `width="600"` HTML attr for Outlook. `display:block` is
  mandatory — an inline image leaves a few px of white underneath.
- **No white strips left/right:** the hero must not sit in a narrower table or a padded cell inside the 600px
  container; it spans the full container width.
- **No spacer rows/cells** immediately before or after the hero (no empty `<td>`/`<tr>`, no spacer GIFs, no ghost
  tables) — this overlaps the Ghost Element Inspection (§8.2); run both.
- Applies to a single-image hero, a linked hero, and any future hero treatment, for every brand and campaign type.

### 6.15 ⚠️ SUPERSEDED — "copy baked into the Hero artwork"

> **Status: SUPERSEDED 2026-07-29 by `Shared/Email-Hero-Engineering-Standard.md` §13.2–§13.4.**
> Retained here as history, and because it explains what changed and why. **Do not build to it.**

**The superseded rule** (established RDD-2026-W30) required:

> "All future campaigns must use a single embedded Hero Banner artwork (including headline, eyebrow text,
> introduction, and CTA inside the image). The Hero Banner itself must be wrapped in one clickable anchor. Never
> recreate HTML overlay text or floating CTA buttons over the Hero Banner unless explicitly requested. Hero images
> must always be exported as full-bleed rectangular artwork with no white borders, rounded corner artifacts, or
> embedded canvas margins."

**Why it was adopted, stated fairly.** Baking the copy into the artwork *is* geometrically robust: every
element scales together, so there is no drift between raster and type, no critical width, and the mobile
composition is guaranteed to match the desktop one. That was a real and correct engineering benefit, and it
is why the rule stood.

**Why it is superseded.** The v1–v26 geometry investigation produced an architecture — **Aspect-Locked Band
+ Colour-Bonded Copy** — that delivers the *same* geometric guarantee while keeping every word in live HTML.
The trade no longer has to be made, and the costs of baking in are severe:

- **Images-off destroys the entire message.** Only one `alt` string survives; blocked images are common in
  B2B and corporate mail.
- **Accessibility failure** — baked text cannot be announced beyond `alt`, resized, reflowed by a magnifier,
  adapted to high contrast, or translated.
- **A baked CTA makes the whole artwork one click target**, cannot guarantee a ≥44px tap target at 320px
  (a button drawn for 600px renders at 53%), and offers no real control for assistive technology.
- **A baked coupon code cannot be selected or copied** — a direct conversion loss on mobile — and rules out
  per-profile dynamic codes.
- **Every copy, offer, code or destination change becomes an artwork re-export**, which makes correction and
  A/B testing slow and expensive.

**What still stands from §6.15, unchanged:**

- **§6.14 edge-to-edge** — applies in full to the artwork band.
- **One clickable anchor** around a linked artwork band (anchor inline, `<img>` is the block element, §6.6).
- **Full-bleed rectangular export** — white borders, rounded-corner artifacts and canvas margins are
  **artwork export defects**. Request a corrected export; never mask them with HTML/CSS workarounds.
- Combine with §8.2 (Ghost Element Inspection).

**What changes in practice — the artwork brief.** Designers and generative tools must now be asked for a
**band asset**: photographic content terminating along a shaped edge above a **solid flat band of a published
hex** occupying the bottom **≥8%** of the frame, with **no text, logo, CTA, coupon, price or date in the
image**. Full brief template: the standard's §14.1–§14.2.

**Grandfathering.** **Existing approved Campaign templates built under §6.15 are not defective and must not
be retrofitted** without a specific instruction. The supersession applies to **new work only**.

### 6.16 Gmail Mobile Rendering Fixes — edge-to-edge background / mobile-safe wrapper (all brands — permanent)

Permanent build standard for **every** template (Product Launch, Weekly, Monthly, and all future Klaviyo
templates, all brands). It prevents the **thin white gutters/strips on the left and right edges** that
appear in **Gmail mobile (Android/iOS)** while desktop looks fine. Learned on SS-2026-LAUNCH.

**Root cause — why Gmail produced white edge gutters.** The page background (`#f0f0f0`) was set **only on
`<body>` and `<center>`**, and the content container was a **fixed `width="600"`**. Gmail's mobile apps
**rewrite the `<body>` and do not reliably honour `background` on `<body>`/`<center>`**, so the area beside
the 600px container fell back to Gmail's **default white** → white side strips. Desktop honours the body
background, so it looked correct there. A fixed-width (not fluid) container makes it worse: when Gmail
can't apply the `<style>` media query (non-Google accounts in the Gmail app strip `<head>` styles), the
container stays 600px and the mismatched gutters show.

**The fix (mobile-safe wrapper architecture — use this shell for every template):**
```
<body style="margin:0; padding:0; background:#f0f0f0;">
  <!-- full-width wrapper TABLE carries the page background (bgcolor attr + inline) — Gmail honours table
       bgcolor even when it drops body/center bg -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f0f0f0"
         style="width:100%; margin:0; padding:0; background:#f0f0f0;">
    <tr><td align="center" style="padding:0;">
      <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td><![endif]-->
      <!-- FLUID container: width:100% + max-width:600px → full-width (flush, no gutters) on mobile without
           relying on media queries; capped at 600px and centered on desktop -->
      <table role="presentation" class="email-container" width="100%" cellpadding="0" cellspacing="0" border="0"
             align="center" bgcolor="#ffffff" style="width:100%; max-width:600px; margin:0 auto; background:#ffffff;">
        <tr><td> … content … </td></tr>
      </table>
      <!--[if mso]></td></tr></table><![endif]-->
    </td></tr>
  </table>
</body>
```

**Best practices / recommendations:**
- **Background-color — set BOTH `bgcolor` attribute AND inline `background` on EVERY coloured table *and*
  the coloured section cells, not only the outer wrapper.** This is the specific cause of white **vertical
  strips on the right of grey sections** and **white seams between sections** on Gmail mobile: Gmail's
  mobile apps frequently **drop CSS `background:` on `<table>`/`<td>`** but reliably honour the HTML
  `bgcolor` attribute, so a section styled with `background:#ededed` only fails to paint and the white
  container/body shows through. Fix: every `#ededed`/`#ffffff`/`#f7f7f7` section carries
  `bgcolor="#…"` **and** `style="background:#…"` (identical value → desktop is byte-identical). **Adjacent
  same-colour sections that should read as one continuous block (e.g. trust → benefits → support) must each
  carry the `bgcolor` attribute** so they paint continuously with no white gap on mobile.
- Also put the page background on a **full-width `<table>`** via BOTH `bgcolor` + inline (never `<body>`/
  `<center>` alone), and give the content container its own `bgcolor="#ffffff"` + inline background.
- **Mobile product-card alignment:** stack the 2-col grid with a media query only
  (`.pc{display:block!important; width:100%!important; box-sizing:border-box!important}`; the centered
  lone card's wrapper `.center-half{width:100%!important}`) so cards become equal-width, equal-padding,
  full-width rows on mobile. This is **mobile-only CSS** — it must never alter the desktop 2-col grid.
- **Width:** the content container must be **fluid** — `width="100%"` + `style="width:100%; max-width:600px"`,
  centered with `align="center"` + `margin:0 auto`. Do **not** ship a fixed `width="600"` as the only width;
  a fixed container is the thing Gmail can't shrink when media queries are stripped.
- **Outlook:** lock 600px for Outlook with an **MSO ghost table** (`<!--[if mso]><table width="600">…`); this
  is the only place a fixed 600 belongs. These `[if mso]` conditionals are functional — keep them (§8.3).
- **Reset mechanics:** `<body style="margin:0;padding:0">`; every table `cellpadding="0" cellspacing="0"
  border="0"` + `border-collapse:collapse` (in `<style>`); `img{display:block}` for full-width images.
- **Table structure:** wrapper table (bg) → single centered `<td>` → fluid container → sections. Keep the
  tree minimal; no `<center>` needed for width (the wrapper `td align="center"` + container `align` centers it).

**Things to AVOID (they reintroduce the gutters):**
- Page background only on `<body>`/`<center>` (Gmail drops it). · A fixed-only `width="600"` container. ·
  Relying solely on a `@media` rule to make the container full-width (stripped for non-Google Gmail-app
  accounts). · `box-sizing`/`margin`/`padding` on the outer container that leaves a sliver. · Horizontal
  overflow — the body must never scroll sideways (wide content scrolls inside its own container, not the page).

**Why the cell-level bgcolor matters (root cause, learned SS-2026-LAUNCH v17→v18):** putting `bgcolor` on
the section `<table>` alone was **not enough** — Gmail mobile paints the **cell** background, so a grey
`<table bgcolor="#ededed">` whose content sits in a transparent `<td>` still showed a white strip on the
right and white seams between sections. The fix that actually holds: **every coloured section carries the
`bgcolor` attribute on BOTH the `<table>` AND its direct content `<td>`** (identical hex to the inline
`background`, so desktop is byte-identical). Adjacent same-colour sections then paint as one continuous
block on mobile.

**Mobile QA checklist — verify BEFORE approval for every Product Launch, Weekly Campaign and Flow (all brands):**
- **Mobile:** ☑ Gmail Android · ☑ Gmail iPhone · ☑ Apple Mail Mobile · ☑ Samsung Mail · ☑ Outlook Mobile
- **Desktop (must stay identical to the approved baseline):** ☑ Gmail Web · ☑ Outlook Desktop · ☑ Apple Mail
  Desktop · ☑ Klaviyo Preview
- **Verify:** ☑ no white gutters · ☑ no white background bleed · ☑ continuous grey backgrounds (table+cell
  bgcolor) · ☑ product cards aligned (equal width/padding, centred, images centred) · ☑ consistent spacing ·
  ☑ no horizontal scrolling · ☑ **desktop layout unchanged** · ☑ mobile visually matches desktop.
- All background/wrapper/width changes here are **mobile-rendering reliability only** and are authored so
  they **never alter the approved desktop design**. Record the result in `Review/`. Combine with §8.1 and §8.3.
This wrapper + table/cell bgcolor is the permanent default shell for all future templates so the gutter/bleed
issue never returns.

### 6.17 Responsive Product Grid & Price-Badge Standards (all brands — permanent, learned RDD-2026-W31)

Mobile responsiveness rules for **every product grid and every in-card price badge/button**, in **every**
template and brand (RDD, Safety Sector, SectorCare, Stack, and any future brand/type). This is an automatic
default; no manual reminder should be needed. It complements §6.8 (equal-height cards) and §6.9 (2-col
balance) — apply all three together.

**Problem.** On RDD-2026-W31 the orange product **price badges rendered correctly on desktop/laptop but
stretched to nearly the full card width in Gmail's mobile app** (Android + iOS), dominating the card. Desktop
was unaffected. A localhost/desktop preview did not reveal it (reinforces §8.1.1).

**Root cause.** The price badge was a single `<a style="display:inline-block; …">$PRICE</a>`. An
`inline-block` anchor shrinks to its content on desktop, but **Gmail's mobile app rewrites/normalises inline
styles and coerces such background-filled inline-block anchors toward block / full-width**, so the badge
expanded to the width of the (now full-width, stacked) card. It is the same class of defect as §6.6: an
element that looks right in a browser behaves differently once a real client re-parses the HTML. A
width-only or desktop-pixel "fix" would not survive Gmail's normalisation.

**Solution (implemented, permanent pattern).** Rebuild every in-card price badge / pill as a **shrink-to-fit,
centred `<table>`** whose fill + radius live on the inner `<td>`, with the price as a plain inline `<a>`
inside that cell:

```
<td class="ppc" align="center" valign="top" bgcolor="#ffffff" style="padding:10px 12px 16px 12px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
    <tr><td align="center" bgcolor="[[ACCENT]]" style="background:[[ACCENT]]; border-radius:4px;">
      <a href="[[PRODUCT_URL]]" target="_blank" class="pricebtn" style="display:inline-block;
         font-family:Arial,Helvetica,sans-serif; font-size:13px; font-weight:800; line-height:1;
         color:#ffffff; padding:11px 22px; text-decoration:none;">AUD $XX.XX</a>
    </td></tr>
  </table>
</td>
```
with a mobile rule that only tunes the tap target, never the width:
```
@media screen and (max-width:600px){ .pricebtn{ display:inline-block !important; width:auto !important; padding:12px 26px !important; } }
```

**Why it works.** A `<table>` **with no `width` attribute collapses to its content width in every email
client** — Gmail (web + mobile app), Apple Mail, Outlook, Yahoo — and it does so **whether or not the client
honours the `<style>` block** (so it protects the ~30–40% of Gmail-app users on non-Google accounts whose
`<head>` CSS is stripped, per §6.16). `align="center"` + `margin:0 auto` centres the badge; the fill/radius on
the `<td>` and the inline `<a>` padding reproduce the desktop look pixel-for-pixel, so **desktop is
unchanged** while mobile is forced compact. The badge can never stretch because its width is driven by
content, not by a CSS declaration Gmail can override.

**Prevention / Responsive Rules (must always be followed).**
- **Never build a background-filled button/badge as a bare `display:inline-block` anchor and rely on it
  shrinking on mobile.** Use the shrink-to-fit centred-`<table>` pattern above for price badges and any
  pill/button that must stay content-width. (Full-width CTAs like the closing "Explore the Collection" button
  are intentionally wide and are exempt — but they must be *deliberately* full-width, not accidentally.)
- **No hard-coded desktop-only widths** to constrain a mobile badge (e.g. `width:120px`), and **never a
  percentage width** on the badge/wrapper (Gmail/Outlook shrink-wrap `%` to content unpredictably, §6.9).
  Content-width via the table is the mechanism.
- **Grid cells:** the 2-col grid stacks with `.pc{display:block!important;width:100%!important;box-sizing:border-box!important}`
  (mobile only) — never let mobile CSS touch the desktop 2-col widths (§6.16).
- **Card regions stay fixed-height on desktop and reset to `auto` on mobile** (`.pimg/.pnc/.pdc/.ppc`, §6.8);
  the price/CTA row keeps its alignment because the badge is centred content, not a stretched block.
- **Product images:** `.pc img{width:100%!important;height:auto!important}` on mobile, but **exclude small
  brand marks** (`.pc img.brandmark{width:15px!important;max-width:15px!important}`) so a decorative mark is
  not blown up to full width — the same "mobile img rule caught an element it shouldn't" failure mode.
- **Tap targets ≥44px on mobile** via padding on the badge cell/anchor, not by widening it.
- Keep the badge anchor **inline content only** (no `<table>` *inside* the `<a>`, §6.6). The badge `<table>`
  wraps *around* the anchor (anchor inside the `<td>`) — that direction is valid and keeps the card's three
  sibling anchors (image / title / price) all clickable after Klaviyo import.

**Klaviyo-specific considerations (affect responsive rendering).**
- **Klaviyo re-parses and rewrites HTML on import** (link click-tracking, style normalisation). Structure
  that renders in a browser can change once imported — always verify in a **real Klaviyo test import**, not
  the editor/localhost (§8.1.2). Content-width tables survive this; fragile inline-block sizing may not.
- **Gmail app strips `<head>` styles for non-Google accounts** — do not depend on a `@media` rule alone to
  make a badge compact; the shrink-to-fit table must work with inline/attribute styling on its own (§6.16).
- Keep the built file **well under Gmail's ~102 KB clip** so no section (including the grid) is truncated (§8.3).

**Best practices for responsive product grids + price bars.**
- One reusable, fully-fixed-height card component (§6.8) + 2-col balance with centred odd last card (§6.9) +
  the shrink-to-fit price badge (this section) = a grid that is equal-height, balanced *and* never stretches.
- Prices/CTAs across a row sit on the same horizontal line because each region is a fixed-height cell and the
  badge is centred content.
- Preserve the approved brand card look (RDD: white card, orange price badge, §6.13); this pattern changes
  the *badge mechanics*, not its appearance.

**Common mistakes that reintroduce this.**
- Reverting a price badge to a lone `display:inline-block` anchor "because it looked fine on desktop".
- Using `width:100%`/`display:block` on the badge, or a `%`-width wrapper.
- A mobile `.pc img{width:100%}` rule with no `.brandmark` exclusion (blows up decorative marks).
- Approving on desktop/browser preview without a Gmail-mobile (Android **and** iOS) check.

**QA gate before Output (run on every grid, every campaign, every brand):** confirm on **desktop + Gmail
mobile (Android & iOS)**: ✓ every price badge is a compact, centred badge (not full-width) · ✓ badge width is
content-driven (shrink-to-fit table, no `%`/fixed width) · ✓ desktop appearance unchanged vs the approved
baseline · ✓ cards equal-height, images/titles/prices aligned (§6.8) · ✓ 2-col stacks cleanly to full-width
on mobile with no overflow (§6.9/§6.16) · ✓ brand marks not enlarged · ✓ tap targets ≥44px. Record the
result in `Review/`. Never consider an email complete until the product grid and price badges are verified at
the mobile breakpoint, not only on desktop.

### 6.18 Responsive Component Standards (all brands — permanent)

**Every reusable UI unit is a component, built once and reused — never hand-authored one-off per campaign.**
The shared library (`Components/*.html` + `Shared/Snippets/base-head.html` + `Templates/`) is the **single
source of truth for markup**; generation *injects data* into a component (`[[TOKEN]]`s), it does not rebuild
the HTML (Components/README, §5 "unified framework, thin brand layer"). This applies to **every brand** (RDD,
Safety Sector, SectorCare, Stack, future) and **every campaign type**. A campaign that re-implements a
Product Card, Price Badge, CTA Button, Promo/Coupon Bar or Product Grid from scratch instead of copying the
approved component is a process defect, even if it happens to render correctly.

**Approved responsive component patterns** (each is defined by the cited section; the library file embodies it):

| Component | Library file | Approved responsive pattern | Defined in |
|-----------|--------------|-----------------------------|------------|
| Product Card | `product-card.html` | Fixed-height `<td>` regions; 3 sibling anchors (image / title / price) to the same URL; explicit img `width`/`height` | §6.8, §6.6 |
| Price Badge | (in card) | **Shrink-to-fit centred `<table>`**, content-width, fill+radius on the `<td>` | §6.17 |
| CTA Button | `CTA.html` / `CTA-secondary.html` | Bulletproof: Outlook **VML** + inline-block anchor, `.tap` ≥44px | §6.2, Components/CTA.html |
| Promo / Coupon Bar | `coupon.html` / `announcement.html` | Table+cell `bgcolor`; content-width code chip; fresh per-campaign copy | §6.5, §6.16 |
| Product Grid | `product-grid.html` | 2-col, equal-height cards, centred odd last card, mobile stack | §6.8, §6.9 |
| Hero | `hero-image.html` ⚠️ *reflects the superseded pattern; queued for update* | **Aspect-Locked Band + Colour-Bonded Copy** — artwork band, all copy in live HTML below it, edge-to-edge, one anchor if linked | **`Shared/Email-Hero-Engineering-Standard.md`**, §6.13-H, §6.14 |
| Page shell / background | Template + `base-head.html` | Mobile-safe fluid wrapper + table **and** cell `bgcolor` | §6.16 |

**Components that must NEVER rely on client-specific rendering behaviour.** These must render correctly from
**inline styles + HTML attributes + table structure alone**, so they survive a client that strips `<head>`
CSS (Gmail app on non-Google accounts, §6.16) and Klaviyo's import rewrite (§8.1.2): **Product Card, Price
Badge, CTA Button, Promo/Coupon Bar, Product Grid, Hero, page shell/background.** Width and containment come
from the table (content-width tables, fixed-`width` MSO ghost, `bgcolor` attributes) — never from a lone
`@media`/`<style>` rule or a fragile `display:inline-block` sizing assumption (the §6.17 root cause).

**Components that REQUIRE Gmail mobile validation (Android *and* iOS)** before Output: **Product Grid, Product
Card, Price Badge, Hero, page shell + every coloured background section** (gutters/seams, §6.16), **CTA
Button**. Confirm: no full-width price-badge stretch (§6.17), no white gutters/seams, images render (not
zero-height collapse, §6.6), 2-col stacks cleanly, no horizontal scroll.

**Components that REQUIRE Outlook (Word-engine) validation** before Output: **CTA Button** (VML roundrect
renders), **Price Badge / any filled button** (square-corner fallback acceptable, must not disappear),
**Product Grid** equal height (must use fixed-height `<td>`, **not** `min-height`, §6.8), **Hero** (MSO ghost
600 table holds width), **every full-width background** (must carry the `bgcolor` attribute, §6.16).

**Components that must be COPIED from the approved library, not recreated.** Start from the `Components/` file
**and** the latest approved reference rendering — never hand-write a new variant of these: **Product Card,
Product Grid, Price Badge, CTA Button, Coupon/Promo Bar, Hero, page shell/footer.** Approved reference
implementations: product card + grid + responsive price badge =
`Brands/RDD/Campaigns/Weekly/Output/RDD-2026-W31.html`; fixed-height-cell grid =
`Brands/SS/Campaigns/Product Launch/Output/SS-2026-LAUNCH-Product-Launch-Final.html`. If a brand needs a
different look, change **tokens** (colour/type/radius), not the structural pattern.

**Fix-once, propagate-immediately (the core rule).** When a responsive (or any structural) bug is fixed in a
campaign, **back-port the fix into the corresponding library file(s) in the same change** —
`Components/<file>.html` for markup, `Shared/Snippets/base-head.html` for a shared class — and record it in
`Components/README.md` and the relevant `§6.x`. A campaign fix that is not propagated to the library is
**incomplete**: the library, not the one-off campaign file, is what the next campaign and the next brand copy,
so an un-propagated fix guarantees the bug returns. On any conflict, **update the component to match the
approved fix** (the library file is the source of truth for markup; the latest approved campaign Output is the
reference rendering). Never ship a fix that lives only in a campaign file or only in documentation.

**QA gate:** before Output, confirm each of the above components was **copied from the current library** (not
re-implemented), validated in the client set its row requires (Gmail mobile / Outlook), and that any fix made
this campaign was **already propagated back into the library**. Record it in `Review/`.

### 6.19 GIF Implementation Rules & promotional-GIF embedding (all brands — permanent)

> **Correction (supersedes the earlier "Hero GIF" framing, learned RDD-2026-W31 v7→v8):** an animated GIF is a
> **promotional content element**, NOT a hero mechanism. The hero is **never** a GIF by default — it stays the
> brand's approved static embedded hero artwork (§6.15). Do **not** swap a GIF into the hero, do **not** replace
> the hero because a campaign adds/updates a GIF, and do **not** add HTML hero text/CTA under the hero on account
> of a GIF. A promotional GIF lives only inside a dedicated content section.

**GIF Implementation Rules (permanent project standard — every brand, every campaign type).**
- **Rule 1 — Hero Banner and Hero Image are completely separate from the promotional GIF section.** They are
  different components with different jobs; a change to one never implies a change to the other.
- **Rule 2 — Adding or replacing a GIF NEVER means replacing the Hero Banner.** "Swap/replace the GIF" means
  change the `src` of the **existing** promotional GIF only — nothing in the hero.
- **Rule 3 — The Hero section must remain untouched unless the user explicitly instructs otherwise.** No hero
  image, layout, headline, eyebrow, intro or CTA change as a side effect of a GIF task.
- **Rule 4 — The promotional GIF belongs ONLY inside dedicated content sections** (e.g. "See It In Action" or
  another campaign content block) — never in the hero.
- **Rule 5 — Never automatically move or promote a GIF into the Hero.** Keep the GIF exactly where it already
  lives; do not relocate it and do not create a new GIF section unless explicitly asked.
- **Rule 6 — Future Weekly Campaigns (all types, all brands) must preserve this behavior** by default.

**Embedding a promotional GIF (the canonical, reusable build).** When adding or replacing a GIF inside a
content section, use a plain `<img>` GIF in the responsive image container the section already uses — when
**swapping**, change **only** the `src` and leave every other attribute and the surrounding layout identical:
```
<td align="center" style="padding:…" bgcolor="#f2f1ee">
  <img src="[[GIF_URL]]" alt="[[meaningful alt]]" width="600" height="337" class="hero-img"
       style="display:block; width:100%; max-width:600px; height:auto; border:0; outline:none;
              text-decoration:none; border-radius:8px; margin:0 auto;" />
</td>
```
- **Autoplay + loop are native to the GIF file.** Infinite loop requires loop-count 0 in the exported GIF
  (ezgif / Cloudinary `e_loop`); there is **no HTML attribute** for looping or autoplay, and no controls / play
  button exist. Nothing can block GIF autoplay (unlike `<video>`).
- **Responsive:** `width:100%; max-width:600px; height:auto` + the `.hero-img` class already in
  `base-head.html`. Keep explicit `width`/`height` HTML attributes so Apple Mail iOS reserves the box (§6.6).
- **Fallback for unsupported clients:** Outlook (Word engine) does **not** animate GIFs — it displays the
  **first frame** as a static image (automatic; author a strong, self-sufficient first frame). If images are
  blocked, the `alt` shows, so keep it meaningful. No `<video>`, no `poster`, no JS.
- **Klaviyo / client compatibility:** a plain `<img>` (optionally wrapped in ONE inline anchor) survives
  Klaviyo's import rewrite and renders on Gmail (web + Android + iPhone), Apple Mail (incl. iOS), Samsung,
  Yahoo. Verify in a real Klaviyo test import **and** on-device, never localhost/desktop only (§8.1).
- **Never wrap a `<table>` in the anchor and never put `display:block` on an image-wrapping anchor** (§6.6);
  the `<img>` is the block element, the `<a>` stays inline.

**Performance & file size (§8).** GIF is a heavy format — an unoptimised commercial GIF is easily **3–5 MB**,
which loads slowly and can blank/break in the **Gmail mobile app**. Targets: **aim ≤ 1 MB; hard-flag anything
> ~2 MB** as a send-blocker in `Review/` (the build still sits in `Output/` for preview per §4.1, but is not
marked send-ready on weight grounds). **Fewer frames + smaller dimensions are what shrink a GIF, not quality
flags** — prefer generating it from a **video source via Cloudinary**
(`/video/upload/w_600,du_5,fps_8,fl_lossy,q_auto,e_loop/…gif`); `q_auto` / `fl_lossy` on an already-rendered
GIF barely help and can even enlarge it. Same-asset optimisation only (never swap approved creative for weight
without approval, §8). Confirm the final GIF is **HTTP 200 `image/gif`, no redirects**. Keep built HTML under
Gmail's ~102 KB clip (§8.3); the GIF weight is external/separate but still governs mobile render success.

**Animated hero (rare — explicit request only).** If, and only if, the user **explicitly** asks for an
animated hero, the same `<img>`-GIF embedding technique may be used inside the hero container (edge-to-edge,
one inline anchor, §6.14/§6.15), and only then may HTML headline/eyebrow/intro/CTA sit below a text-free hero
GIF. This is an explicit, opt-in exception — **never the default**; Rules 1–6 govern every normal campaign.

**QA gate before Output (record in `Review/`):** ✓ hero untouched (unless the user explicitly asked to change
it) · ✓ only the intended promotional GIF `src` changed · ✓ GIF loops forever, autoplays, no controls · ✓
animates on Gmail (web + Android + iPhone) and Apple Mail (incl. iOS); Outlook shows an acceptable first
frame · ✓ responsive / no shrink on mobile · ✓ explicit `width`/`height`, block `<img>`, no `<table>` inside
`<a>`, zero ghost nodes (§6.6/§8.2) · ✓ GIF is HTTP 200 `image/gif` and within the file-size target (flag if
over).

### 6.20 Cerberus Email Framework — official rendering reference (all brands — permanent)

**Cerberus is this project's official HTML email reference framework.** It is vendored, unmodified, at
`Shared/Frameworks/Cerberus/` with five analysis documents and a 13-file reference component library.
It does **not** replace our architecture: the File-Driven System, the `Brief → Draft → Review → Output`
pipeline (§4.1), `Components/`, `Templates/` and `Shared/` are unchanged. Cerberus is the **external
authority we check our markup against**, and the canonical source for techniques we have not yet needed.

**Read `Shared/Frameworks/Cerberus/FRAMEWORK-README.md` before any HTML build**, then the document that
matches the task: `Cerberus-Analysis.md` (architecture) · `Cerberus-Techniques.md` (mechanics) ·
`Cerberus-Components.md` (block-by-block) · `Cerberus-Best-Practices.md` (the ruleset + our divergences) ·
`Cerberus-Compatibility.md` (client matrix + defect index). **Never edit an upstream Cerberus file.**

#### Why Cerberus patterns are used

Our §6.6–§6.19 rules were each learned from a production defect. Cerberus states most of them as first
principles, independently. That convergence is the point: where Cerberus and our hard-won rules agree, the
rule is settled. Where Cerberus is silent (product cards, price badges, Klaviyo's import rewrite) our rules
govern. Where we deliberately differ, `Cerberus-Best-Practices.md` §5 records the reason — those are not
oversights and must not be "fixed" toward Cerberus.

#### The layered standard (applies to every campaign type, every brand)

1. **Structure carries the layout — CSS refines it.** Every layout must be correct from **table markup,
   HTML attributes and inline styles alone**, before a single `<head>` rule is applied. The Gmail app
   strips `<head>` CSS entirely for non-Google accounts. This restates §6.16 as an architectural principle.
2. **Media queries are progressive enhancement, never load-bearing.** They may adjust type size, release a
   reserved height, or tune a tap target. They may never be what makes a layout stack, contain, or fit.
3. **Outlook gets its own structure.** MSO ghost tables lock the 600px container and every multi-column
   row; VML draws rounded buttons and background images. `[if mso]` conditionals are **functional** — keep
   them when stripping comments (§8.3).
4. **Degradation is acceptable; disappearance is not.** A square button in Outlook is fine. A missing
   button is a hard fail.

#### Mobile-first strategy — hybrid stacking is the default for multi-column rows

Multi-column rows use the **hybrid pattern**: `display:inline-block` columns with `min-width`/`max-width`
that wrap on their own, inside an MSO ghost table. The row stacks **with or without media-query support**.
At our 600px container with 10px parent padding: inner width `580`, 2-col `max-width:290px`
/`min-width:175px`, 3-col `max-width:193px`/`min-width:140px`; ghost table `width="580"`.
Mandatory supports: `font-size:0` on the parent cell (kills the inline-block whitespace gap — restate the
font size inside each column), `margin:0 -1px` (absorbs sub-pixel rounding), `vertical-align:top`.
Full walkthrough: `Cerberus-Techniques.md` §3; every shape in `Components/GhostTable.html`.

**The 600px container does not change.** Cerberus's hybrid template runs at 680px; every approved brand
design, product-card measurement and hero export we own is built to 600px. Adopt the mechanism, not the width.

#### Head scaffold — required additions

Add to `Shared/Snippets/base-head.html` and every template head:

- `<meta name="x-apple-disable-message-reformatting">` — stops iOS Mail auto-scaling the message.
- `<meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">`.
- `:root { color-scheme: light dark; supported-color-schemes: light dark; }` alongside the meta tags.
- A real, non-empty `<title>` (shown in some Android notification previews).
- **Reset rules** (each fixes a named client bug): `div[style*="margin: 16px 0"]{margin:0!important}`
  (Android 4.4) · `#MessageViewBody,#MessageWebViewDiv{width:100%!important}` (Samsung) ·
  `img{-ms-interpolation-mode:bicubic}` · `.a6S{display:none!important;opacity:0.01!important}` and
  `img.g-img + div{display:none!important}` (Gmail's download-button overlay) ·
  `.im{color:inherit!important}` (Gmail thread recolour) · the
  `a[x-apple-data-detectors], .unstyle-auto-detected-links a, .aBn` block (iOS/Gmail auto-linked
  addresses and dates) · the three `u ~ div .email-container { min-width }` blocks (**Gmail iOS
  right-hand gutter** — a second, complementary defence to §6.16).
- ⚠️ **Do NOT adopt Cerberus's `table { table-layout: fixed !important; }`.** It disables intrinsic sizing
  and breaks the shrink-to-fit price badge (§6.17) and the centred odd last card (§6.9). If one table ever
  needs it, set it inline on that table only.

#### Gmail-safe coding

§6.16 stands unchanged and is **stricter than Cerberus** — page background on a full-width wrapper
`<table>` with **both** `bgcolor` and inline `background`, and `bgcolor` on **every coloured section's
`<table>` and its content `<td>`**. Cerberus's `<body>` + `<center>` + MSO approach alone still produced
white gutters and seams for us. Add on top: the `u ~ div` gutter fix, `.g-img` on images >300px, `.im`,
and the ~102 KB clip discipline (§8.3) that Cerberus's anti-CSS-inliner argument reinforces.

#### Outlook-safe coding

Ghost tables for width and columns · VML `roundrect` for radius (arcsize ≈ `radius ÷ (height ÷ 2) × 50`) ·
VML `v:rect`/`v:fill`/`v:textbox` for background images, `src` at **@1x** because Outlook cannot scale
one · `mso-table-lspace/rspace:0pt` · `mso-line-height-rule:exactly` · fixed-height `<td>` (never
`min-height`, §6.8) · duplicate button fill and padding onto the `<td>` because Outlook does not treat
anchors as block-level · guard any web-font reference with `[if mso]{*{font-family:sans-serif!important}}`
or the whole document falls back to Times New Roman · guard the dark-mode image with `[if !mso]` or
Outlook renders both logos.

#### Bulletproof CTA standard

Content-width `<table>` with **no `width` attribute** (collapses to content in every client, with or
without `<head>` CSS) · fill, radius and border duplicated on the `<td>` **and** the `<a>` · `bgcolor`
attribute as well as inline `background` · VML `roundrect` where the brand's radius matters · ≥44px tap
target via **padding**, never by widening · destination-descriptive label (Cerberus's accessibility rule:
avoid "Click Here"/"Learn More" — this refines label *quality*; §6.2's guidance is about CTA
*duplication*) · verified HTTP 200 destination.

**`display:block` on a CTA anchor is correct and stays.** The §6.6 prohibition is specifically on
`display:block` on an anchor that **wraps an image** — Apple Mail iOS resolves the block height before the
image decodes and collapses it. A text anchor has no decode step. The two rules do not conflict.
A background-filled **price badge** is a different component and follows §6.17.

#### Hero banner standard

**Governed by `Shared/Email-Hero-Engineering-Standard.md` (§6.13-H). Not restated here.**

Our Hero remains stricter than Cerberus's, which ships an empty `height=""`, no `font-size:0` on the cell,
and no anchor. Ours: real pixel `width`/`height` attributes · hero `<td>` `padding:0; font-size:0;
line-height:0; mso-line-height-rule:exactly` · `<img>` `display:block` with the anchor inline · exactly one
anchor · zero whitespace between `<td>`, `<a>` and `<img>`. **§6.14 (edge-to-edge) stands unchanged.**

⚠️ **The phrase "single embedded artwork, copy baked in" is withdrawn.** §6.15 is superseded: all Hero copy
is now live HTML on a colour-bonded surface below an aspect-locked artwork band. Cerberus is neutral on the
underlying geometry problem — it supplies reflow mechanisms for *content columns* and has no primitive for
positioning text relative to a feature inside an image, so nothing in Cerberus caused it or can cure it. See
the standard's §9.6 for what Cerberus *does* contribute (hybrid stacking for the rows below the band).
Reference: `Components/Hero.html` — which still reflects the superseded pattern and is **queued for update**;
build to the standard, not to that file.

#### Image handling

Absolute HTTPS, HTTP 200, `image/*`, no redirects (§8) · explicit `width`/`height` attributes always ·
`border="0"` · `display:block` on the `<img>` · fluid images `width:100%; max-width:Npx; height:auto` ·
export **@2x** and scale down with the HTML attributes (SVG is unusable in email, so this is how we get
crisp high-DPI raster) · `class="g-img"` on images wider than ~300px · **style the alt-text box** on hero
and logo images (`background` + `font-family`/`size`/`line-height`/`color` on the `<img>`) so a blocked
image degrades deliberately · never SVG · meaningful `alt`, and **`alt=""` on genuinely decorative images**
(an image with no `alt` attribute is read aloud as its filename).

#### Product grid standard

§6.8, §6.9 and §6.17 stand unchanged — Cerberus has no product card and adds no requirements here. What it
contributes is the **stacking mechanism underneath**: build the 2-column grid on hybrid columns so it
stacks without `<head>` CSS, then keep every existing rule on top — fixed-height `<td>` regions, three
sibling anchors per card, shrink-to-fit price badge, centred odd last card via `colspan`, reserved heights
released on mobile. Reference: `Components/ProductGrid.html`.

⚠️ **Never put `height` and `padding` on the same cell.** `<td height="36" style="height:36px;padding-top:14px">`
is 50px in content-box engines and 36px in border-box engines — the region silently changes size per client
and everything below it misaligns. Put the gap in its own sized spacer row.

#### Email spacing system

`Shared/design-tokens.md` §2 remains the rhythm. Cerberus adds the **mechanism** rules:

- **`padding` on `<td>` for cell spacing. `margin` on `<p>`/`<h>`/`<ul>`/`<li>` for typography.** Margin is
  unreliable on tables and containers; padding is unreliable on text elements.
- **Between tables or rows, use a sized spacer row** —
  `<td aria-hidden="true" height="N" style="height:Npx; font-size:0; line-height:0; mso-line-height-rule:exactly;">&nbsp;</td>`.
  Every part is load-bearing: the `height` attribute is what Outlook honours, the `&nbsp;` stops clients
  collapsing the cell, `font-size:0`/`line-height:0` stop the `&nbsp;` inflating it, and `aria-hidden`
  keeps it out of screen readers. **This is not the empty `<td>` banned by §8.2** — that is a cell with no
  height, no content and no purpose. Add `aria-hidden` to our existing spacers; they currently omit it.
- Carry the section `bgcolor` on a spacer inside a coloured band, or Gmail mobile paints a white stripe.
- A **visible** divider is a painted sized cell — never `<hr>`, never `border-top` as the mechanism.

#### Typography system

`Shared/design-tokens.md` §1 remains the scale, `Shared/Fonts/font-stacks.md` remains the font policy.
Cerberus adds:

- **Never rely on CSS inheritance.** Restate `font-family`, `font-size`, `font-weight`, `line-height` and
  `color` on **every text `<td>`** — some Outlook versions reset inherited font properties across nested
  tables. This is mandatory inside hybrid columns, whose parent cell is `font-size:0`.
- **Put styles on the `<td>`**, not on the `<table>` or `<tr>`.
- **Six-digit hex only** — `#ffffff`, never `#fff` or `rgb()`. Three-digit hex fails in some clients and in
  HTML attributes such as `bgcolor`.
- Zero out defaults inline: `<p style="margin:0;">`, `<h1 style="margin:0 0 10px 0;">`.
- List indent via `margin-left` on the `<li>`, not `padding` on the `<ul>`.
- `&nbsp;` to prevent typographic widows in headlines.

#### Accessibility additions

`role="article" aria-roledescription="email" lang="en"` on the outer wrapper · `aria-hidden="true"` on
every spacer, divider and decorative mark · `alt=""` on decorative images · destination-descriptive link
text · `class="unstyle-auto-detected-links"` on **every footer address/phone block** (iOS and Gmail
auto-link them in blue; none of our footers currently carries this) · review the plain-text version, do not
just let it generate.

#### QA additions

Add to the §8.1 / §8.2 / §8.3 gates: ✓ multi-column rows stack from inline styles alone (disable `<head>`
CSS and confirm) · ✓ hybrid column maths reconcile (`min-width`, `max-width`, ghost `<td>`s, ghost table) ·
✓ `font-size:0` on hybrid parents with font size restated inside each column · ✓ no `height`+`padding` on
one cell · ✓ `role="article"` and `aria-hidden` present · ✓ `.g-img` on large images · ✓
`unstyle-auto-detected-links` on the footer address · ✓ no "Click Here" link text · ✓ plain-text version
reviewed. Check any unfamiliar CSS property at **caniemail.com** before using it.

#### Compatibility

`Cerberus-Compatibility.md` holds the full client matrix and a **known-defect quick reference** (symptom →
cause → rule). Consult it first when a render is wrong — most of our historical defects are already indexed
there.

### 6.21 Icon style standard — minimalist monochrome line icons only (all brands — permanent)

Permanent, **all brands, all campaign types, every icon in every email** — trust indicators, feature/benefit
icons, shipping/returns/warranty/support, footer, and any future icon. Established RDD-2026-W32.

- **NEVER use emoji, cartoon, colourful illustration, or playful icon sets** for any campaign icon.
  Full-colour emoji (💎 🚚 🎧 …) are **prohibited** — they read as consumer/playful, render inconsistently
  (colour on Apple/Gmail, monochrome/tofu in Outlook), and cannot be tuned to the brand tone.
- **ALWAYS use minimalist, premium, monochrome outline / line icons** in the brand's single tone — the
  **Apple / Stripe / Shopify / Linear / Lucide / Heroicons** aesthetic: clean, lightweight, professional
  B2B, visually consistent (same size, weight, colour) across the whole email. Icons stay subtle and
  **support** the content; they never dominate.
- **Email delivery (SVG is unusable in email, §6.20):** deliver line icons as **hosted monochrome PNG @2x**
  (transparent background, single brand colour) via `<img>` with explicit `width`/`height`; store the
  reusable set in `Brands/<CODE>/Assets/Icons/` (evergreen, §7). **When no hosted icon set exists yet**, use
  **single-tone text-style Unicode glyphs** forced to text presentation (`&#xNNNN;&#xFE0E;`) and coloured
  with the brand tone (the approved W29–W31 trust-strip approach) — **never a colour emoji**. Building a
  hosted monochrome PNG icon set is the upgrade path and should replace glyphs when available.
- **QA gate (record in `Review/`):** confirm **zero colour-emoji / cartoon icons**; every icon is
  monochrome line style, consistent, and legible across the §8.1 client set (a monochrome fallback in
  Outlook is acceptable; a colourful/emoji icon is a **fail**).

**Trust-indicator section standard (applies this rule to the "trust / we've got you covered" strip — all
brands, permanent, established RDD-2026-W32).** The trust strip is a **minimalist B2B** block, not a
decorated banner — Apple / Shopify Plus / Really Good Emails quality:

- **Icons:** premium outline **line icons**, **monochrome charcoal** (`#374151`/`#1f2937`), with **subtle
  RDD orange as an accent only where appropriate** — never full-colour icons. Delivered as hosted mono PNG
  @2x or, until that set exists, single-tone text-presentation glyphs (`&#xNNNN;&#xFE0E;`) coloured charcoal
  (per the delivery rule above). **Never** cartoon icons, emoji, colourful illustrations, or playful graphics.
- **Layout:** all items on one row on desktop with **equal spacing, consistent typography and generous
  whitespace**, icons vertically aligned; each item = icon → bold charcoal title → one short grey line.
  Items stack full-width on mobile (`.trust-col`). Maintain Outlook + Gmail + Cerberus compatibility.

### 6.22 Weekly premium refinement — closing CTA & section copy (all brands — permanent)

Established RDD-2026-W32. Applies the §5.1.3 editorial philosophy to two specific sections. Build mechanics
elsewhere (edge-to-edge §6.14, bulletproof CTA §6.20, Gmail-safe bg §6.16) still govern and are not restated.

**Closing CTA section standard.** Every Weekly Campaign should **end with a premium closing conversion
section that feels like an invitation, not an advertisement.** The closing CTA:

- **Never uses a heavy full-width promotional (solid-orange) banner.** Its background is **white or a very
  light warm grey** (e.g. `#f8f8f8`) with **generous whitespace** and a centred layout. Orange appears
  **only on the CTA button**, not as the section field.
- Contains **one premium headline** (large, bold, dark charcoal `#1f2937`), **one concise supporting
  sentence** (neutral grey, max two lines, scannable, professional B2B tone), and **one primary CTA button**
  (RDD orange, centred, rounded corners, premium padding, **elegant not oversized**, ≥44px tap target, VML
  for Outlook). It should transition naturally into the footer.

**Environmental / "where it's used" section-copy standard.** When a Weekly features an environments block
(e.g. "Where Acrylic Displays Make an Impact"):

- The supporting line **summarises all featured environments** rather than using generic marketing copy,
  stays **concise (max two lines)**, centred, premium typography, professional B2B tone.
  Example: *"Designed for retail, offices, healthcare and education. Professional display solutions for every
  environment."* Keep the environment cards themselves (sizing, radius, overlay, titles) unchanged.
- **No em dashes / dash interruptions** in this copy — per §6.2, write clean sentences (a dash in requested
  copy is converted to separate sentences).

### 6.23 HTML rendering & footer merge-tag validation (all brands — permanent, every campaign)

Permanent build+QA standard for **every** template (all brands, all campaign types). It prevents raw HTML
markup — attributes, `style="…"`, tag fragments — from rendering as **visible text** to recipients, and
guarantees the footer subscription links resolve. It extends §6.6 (link/containment) and §8.2 (ghost/nested
anchors) to **Klaviyo merge tags**, which those sections do not cover; do not restate them, apply all three.
Established RDD-2026-W32 (footer showed `Unsubscribe" style="color:#777777; text-decoration:underline;">`).

**Root cause — a Klaviyo tag that emits a whole anchor was placed inside an `href`.** In Klaviyo,
**`{% unsubscribe %}` and `{% manage_preferences %}` render a COMPLETE anchor element**
(`<a href="…">Unsubscribe</a>`), **not a URL**. Put inside `href="{% unsubscribe %}"`, Klaviyo injects
`<a href="URL">Unsubscribe</a>` into the attribute; the injected `"` **closes the `href` early**, so
`Unsubscribe</a>` becomes a nested link and the leftover `" style="…">Unsubscribe` **spills out as visible
text**. A browser preview of the un-rendered source hides it because the tag has not expanded yet — the leak
only appears **after Klaviyo processes the send** (exactly the class of defect §8.1.2 warns about).

**The rule.**
- **Inside an `href`, use the URL-only tag form** — **`{% unsubscribe_link %}`** and
  **`{% manage_preferences_link %}`** (this is what the approved W29–W31 footers use). **Never** put the
  anchor-emitting `{% unsubscribe %}` / `{% manage_preferences %}` inside an `href` or any other attribute.
- **The bare (anchor-emitting) `{% unsubscribe %}` / `{% manage_preferences %}` may appear ONLY as
  standalone body content**, never wrapped in your own `<a>` (that produces the nested-anchor defect of
  §6.6/§8.2). For a custom-styled footer link, author your own `<a>` and use the `…_link` URL tag in its
  `href` — do not wrap the anchor-emitting tag.
- **Never invent a merge variable.** `{{ manage_preferences_url }}`, `{{ unsubscribe_url }}` and similar are
  **not valid Klaviyo tags** — an unrecognised `{{ }}` renders empty or literal, producing a **dead/empty
  `href`** (breaches §6.7). Use only Klaviyo's documented tags; when unsure, copy the exact tag from the
  latest **approved** Output footer, which is the in-repo source of truth.
- **HTML validity is a gate, not a preference.** Before Output: every `<a>` is properly opened, self-closed
  with matching `</a>`, and contains **inline content only** (§6.6); no nested anchors; no duplicate
  attributes; no unclosed tags; inline CSS is well-formed (balanced quotes, no stray `>` inside a value);
  follow Cerberus (§6.20). Fix the **root cause**, never mask a leak by deleting the visible text.

**QA gate before Output (record in `Review/`).** Grep the built file for the defect signatures and verify in
a **real Klaviyo test import** (not localhost/desktop — the tags do not expand there):
- ✓ **anchor balance** — count of `<a ` equals count of `</a>`.
- ✓ **no tag inside an attribute** — `grep 'href="[^"]*<'` returns **nothing**.
- ✓ **no anchor-emitting subscription tag inside an `href`** — footer uses `{% unsubscribe_link %}` /
  `{% manage_preferences_link %}`, never `{% unsubscribe %}` / `{% manage_preferences %}` in an `href`.
- ✓ **no unrecognised `{{ … }}` variables** in any `href`; every footer link resolves (not empty / not `#`).
- ✓ **no HTML attributes or tag fragments visible as text** anywhere (footer especially) on **Klaviyo
  Preview · Desktop · Mobile · Outlook · Gmail · Apple Mail · Yahoo** — a browser preview alone is
  insufficient because merge tags are unexpanded there.
- ✓ footer links (**Unsubscribe · Privacy Policy · Manage Preferences**) render as clean text, are
  clickable, and the layout is unchanged.

## 7. Asset & Reference Workflow

- **Evergreen brand assets** (logos, icons, brand-level references) → `Brands/<CODE>/Assets/`. Reused
  by every send; never duplicated per campaign.
- **Per-send assets** (this send's hero, product images, graphics) → `Campaigns/<cadence>/Assets/`.
- **Reference inputs** (screenshots of live site/products, past sends, design refs) →
  `References/`. Read-only guidance; never shipped.
- Assets must meet the Assets Library standards (`CS-10`); meaningful `alt` text required (`CS-11`).
- **AI-generated hero banners** — when a Weekly Campaign needs an AI-generated hero visual (`WK-S4`),
  generate the Google Flow prompt via `07-Prompt Library/Hero-Banner-Generator.md` (never hand-write
  ad-hoc prompts). Australian-market sends follow the Australian commercial-advertising direction defined
  there. Hero visuals are **visual-only by default** — no baked-in text; a product **price must not appear
  in the hero** unless a user or approved `Brief/` explicitly requests it (prices belong in the grid, §5.1).
  AI output is **never auto-approved**: a human reviews it for product accuracy and brand fit
  (`CR-16`/`CR-17`), and only the approved visual enters the Assets workflow.

## 8. QA Workflow

- Work happens in the send's `Review/` folder (`CR-15`, `CS-16`).
- Render the draft, review against `CS-##`, and run the QA Checklist
  (`07-Prompt Library/QA-Checklist.md`).
- Store rendered-preview screenshots and reviewer notes in `Review/`.
- **Validate every image URL before finalising — accessibility *and* email-client compatibility.** Confirm
  each `<img src>` is a public absolute **HTTPS** URL that returns **HTTP 200** with an `image/*`
  content-type and **no redirects** (Gmail's image proxy dislikes redirects and non-image responses). Never
  use local paths, `localhost`, relative paths, temporary/expiring links, or HTML-encoded/malformed query
  strings. **Keep images email-safe in weight:** favour well-compressed JPEGs on the stable product CDN
  (BigCommerce `stencil/WxH`), avoid multi-hundred-KB PNG photos, and keep total image payload modest —
  oversized images render on desktop yet break in the Gmail **mobile** app (broken-icon + alt text). A
  desktop/browser preview is **not** sufficient proof; never approve on local or desktop rendering alone.
- **Optimising an image must preserve the approved visual creative.** If a campaign image is too large,
  **compress / resize / re-encode / re-host the *same* asset first** (e.g. same crop and composition, PNG
  photo → quality-tuned JPEG at the same dimensions). Do **not** swap approved branded/lifestyle creative
  for a different image (e.g. a plain product photo) purely to cut file size. Any visual substitution is a
  design change and **requires approval**.
- QA + independent review is the gate before `Output/`; no approval → no output (`CR-16`, `CR-17`).

### 8.1 Email Client Compatibility Standard (all brands — permanent)

Distilled from the SS-2026-W29 investigation: defects that pass a localhost/browser preview but break
once a real email client (or Klaviyo) processes the HTML. These are **verification and approval gates**;
the *build mechanics* that prevent the defects live in §6.6 (link/containment safety) and the image rules
in §8 — do not restate those, apply them. This section says **what must be proven, and where**, before a
campaign can move to `Output/`.

**1. Never approve on localhost/browser preview alone.** A local or desktop render is never sufficient
proof (reinforces §8). Every campaign must additionally be verified in: **Klaviyo Preview · Gmail Web ·
Gmail Mobile · Apple Mail · Outlook (when available).** Record which clients were checked in the `Review/`
notes; if a client genuinely cannot be exercised in this environment, say so explicitly and flag it as a
required manual pre-send step (never imply it passed).

**2. Verify every clickable element *after Klaviyo processes the HTML*, not just in source.** Klaviyo
re-parses and rewrites links (click-tracking) on import; **never assume a link survives that rewrite.**
Import the template into Klaviyo and confirm each of these actually navigates to the correct live URL:
product cards · hero banner · CTA buttons · category images/tiles · logo(s) · promotional/coupon banners.
(Root cause of a lost link is almost always invalid nesting — see §6.6; the *check* here is behavioural,
in Klaviyo, not structural in the editor.)

**3. Product-grid clickability gate.** Every product card must use email-safe HTML per §6.6 (anchor wraps
inline content only; no `<table>` inside an `<a>`). Before approval, confirm on each card: **✓ image is
clickable · ✓ product title is clickable · ✓ the whole card behaves as expected · ✓ every link opens the
correct live product page.** A card that renders but does not track/navigate after Klaviyo import is a
**fail**, even if it looked clickable on localhost.

**4. Hero-banner rendering gate.** The hero must render at a consistent, full size across desktop **and**
mobile. Build it with responsive, email-safe image containers per §6.6 (full-width table declared in inline
`style`, `max-width:100%` image, defensive responsive class). Explicitly confirm the hero does **not**
shrink or collapse on **Gmail Mobile** (the client where the SS hero failed). Do not rely on browser
rendering; do not "fix" a shrink by merely enlarging the image — resolve the container.

**5. Responsive QA checklist (must all pass before send).**
`✓ Desktop · ✓ Laptop · ✓ Gmail Mobile · ✓ Apple Mail · ✓ Outlook Preview · ✓ Klaviyo Preview.`
Any layout inconsistency (shrink, overflow, broken stack, mis-alignment) must be **resolved before the
send** — never sent "to fix later". (The build still lives in `Output/` for preview while it is being
fixed; see §4.1 / §9.) **Product-grid + price-badge responsiveness is part of this gate** — confirm the
grid and every price badge on **Gmail mobile (Android & iOS)**, not only desktop, per §6.17 (badges must
stay compact/centred and never stretch to card width).

**6. Send-approval gate.** `Output/` always holds the latest build for preview/QA (§4.1, §9); this gate
governs the **actual send**, not the file's presence in `Output/`. A campaign may be **sent** only when
recorded approval exists (`CR-17`) **and** all of the following are verified and noted in `Review/`:
`✓ clickability verified (post-Klaviyo) · ✓ responsive rendering verified · ✓ images load correctly ·
✓ product links work · ✓ CTA links work · ✓ coupon link works · ✓ no unresolved blockers (404/dead links,
hidden products, missing assets).` Until then the `Review/` approval status stays **not approved to
send**, even though the HTML is available in `Output/`.

**Design-intent conformance — added to this gate, not a new gate:**

`✓ the send's Brief/ carries a Design Intent block, with Design status one of NONE · PROPOSED · LOCKED ·
SUPERSEDED · ✓ the built template's header comment records the same Hero role, Hero pattern and design
language as that block · ✓ where a reference's fidelity mode is TARGET, the build's structure, hierarchy,
proportion, section order and CTA placement match that named reference.`

This checks a requirement that already existed — `Shared/Email-Design-System/README.md` §5.1 and §10, and
STD-HERO §15.6, already require the design language, Hero pattern and Hero role to be recorded in the built
template's header. It was unenforced. **A `Design status` of `NONE` passes this gate**; what fails it is a
build whose header contradicts a `LOCKED` block, or a `TARGET` reference the build did not follow. The Design
Intent block and Reference Register are specified in §4.2.

**7. Root-cause-first principle.** When an issue is discovered, **do not ship a temporary/symptomatic fix
first.** Always: (a) identify the true root cause, (b) document the lesson in the send's `Review/` notes,
and (c) convert any reusable finding into a permanent CLAUDE.md rule (as §6.6 and this §8.1 were). The
objective is continuous improvement — each completed project should make CLAUDE.md smarter so future
campaigns avoid the same mistake automatically.

### 8.2 Ghost Element Inspection (all brands — permanent, automatic, every email)

**Every generated email — every Campaign, every Flow, every Brand — must pass a Ghost Element Inspection before
its HTML is considered complete.** This is an automatic, default step: run it on every build without waiting to be
asked, and **remove any ghost element found before producing the final HTML / promoting to `Output/`.** It exists
because stray/empty/malformed nodes can make email clients (notably **Gmail**) inject a floating "…" bubble,
mis-placed clickable artifacts, or other rendering anomalies that pass a browser preview (learned from RDD-2026-W30).

**Inspect for (and remove/fix every hit):**
- **Empty anchors** — `<a…></a>` or an anchor whose only content is whitespace / `&nbsp;` / `&zwnj;`.
- **Nested anchors** — an `<a>` inside another `<a>` (invalid; a known Gmail artifact trigger).
- **Empty table cells / empty rows** — `<td></td>`, `<tr></tr>` (a deliberate divider cell must carry a real
  size + `bgcolor` and visible purpose, never an empty spacer).
- **Ghost tables** — a `<table>` with no real cell content.
- **Spacer / hidden clickable nodes** — zero-width or zero-height links, links with `display:none`/`width:0`/
  `height:0`, or any hidden anchor.
- **`#`, empty, or placeholder `href`s** — never ship them (reinforces §6.7).
- **Whitespace / invisible text nodes at container boundaries** — especially inside the hero: keep the hero
  `<td>`, `<a>` and `<img>` collapsed onto one line with **zero whitespace between them**, cell `font-size:0;
  line-height:0`, so no stray text node can render (RDD-2026-W30 v27 hardening).
- **Comment placement / content around the hero and section boundaries** — keep comments short and **free of
  tag-like prose** (`<a>`, `<img>`, `<td>`) and of literal `...`/`…`; such prose bloats the file, trips
  inspections, and is unnecessary noise next to the hero.
- **Duplicate/adjacent anchors** — allowed only as the intentional product-card pattern (sibling anchors to the
  same product URL, §6.6); never as accidental repeats.
- **Malformed hero wrappers** — no `display:block` on an image-wrapping `<a>` (§6.6), no leftover VML/background-
  image/dual-hero remnants from earlier iterations.
- **Any other pattern known to trigger a Gmail (or other client) rendering anomaly / floating "…" UI.**

**How to run it:** grep the built file for each pattern above (empty/nested/ws-only anchors, empty `<td>`/`<tr>`,
ghost tables, zero-size or hidden links, `href="#"`/empty, literal `...`/`…`, tag-like prose inside comments,
stray text nodes after `</table>`), confirm tag balance (`<table>/<tr>/<td>/<a>` open==close), and fix every hit
**before** the HTML is final. Record the inspection result in the send's `Review/` notes.

**Note on the Gmail "…" specifically:** it is often Gmail's own *trimmed/quoted-content* toggle (e.g. collapsing
duplicate content from repeated test sends to the same thread), not an element in the HTML. This inspection removes
every in-source trigger; if a "…" persists on a **fresh subject line / clean thread**, treat it as Gmail's UI, not
a defect to chase in the markup.

### 8.3 Gmail Rendering QA — no expansion bubbles / footer visible (all brands — mandatory, EVERY campaign)

A **mandatory QA checkpoint for every campaign of every type** (Weekly, Monthly, Product Launch, Holiday,
Seasonal, Category, Clearance, Brand Story, Educational, Automation — and any future type) for **every
brand** (Safety Sector, Retail Display Direct, SectorCare, Stack, and future brands), before the send is
considered complete. Complements §8.2 (Ghost inspection) and §8.1 (client set) — apply them, don't restate.

**Gmail QA checklist (all must pass, recorded in `Review/`):**
- ✓ **No Gmail expansion ("…") bubbles anywhere** — the recipient never clicks to continue reading.
- ✓ **No hidden content** surfaced by Gmail; ✓ **no collapsed sections**.
- ✓ **No empty spacer structures** — no empty `<td>`/`<tr>`, ghost/orphan wrapper tables, hidden
  `display:none` spacer elements, or whitespace-only text nodes between/inside tables (strip blank lines).
- ✓ **No unnecessary wrapper tables** — remove redundant single-cell wrappers; keep the table tree minimal.
- ✓ **Footer visible immediately** — never behind Gmail's "[Message clipped] / View entire message" toggle.
- ✓ **Full Gmail compatibility** verified (Gmail Web + Gmail app).

**Build rules that keep Gmail clean (apply, then verify):** keep the built HTML **well under Gmail's ~102KB
clip threshold**; **strip all non-functional/descriptive HTML comments** from the production file (keep only
functional MSO conditionals `[if mso]`/`[if !mso]`); simplify the hidden preheader to a **single minimal
line** (no long `&zwnj;&nbsp;` spacer runs); run §8.2 Ghost inspection (zero empty/nested/ghost nodes, zero
literal `…`/`...`); avoid needlessly duplicated blocks.

**Authoring restraint — never ADD hidden content or dots proactively (learned RDD-2026-W32).** The rules
above are about *removing* ghost/hidden nodes; this states the authoring default so they are never introduced
in the first place. **Never add a hidden preview/preheader block, decorative dots (`•`/`…`), invisible spacer
content, or a Gmail/Outlook rendering hack unless (a) the user explicitly requested it, or (b) it fixes a
*proven, reproduced* rendering defect** — and when it does, keep it minimal and record the defect it solves in
`Review/`. A legitimate single-line preheader is permitted (it supplies inbox preview text) but is optional
and must stay one minimal line; it is **not** a cause of the Gmail "•••". **Fix the root cause; never add a
workaround to mask a symptom** (reinforces §8.1.7). A "•••" seen only on a repeated test thread is Gmail's
quoted-content collapse (below), not a reason to strip legitimate content. Keep the HTML clean and minimal,
and validate Desktop · Mobile · Outlook · Gmail · Apple Mail · Klaviyo before completion (§8.1).

**Diagnosing a persistent "…":** once every in-source trigger above is removed, a "…" that still appears
**only on a repeated test thread** is Gmail's own *quoted-content* collapsing — Gmail trims the portions of
a new send that duplicate an earlier version sitting in the **same subject/thread**, producing "…" at each
repeated section. **Always confirm on a FRESH subject line / new thread (or a different recipient)** before
treating a "…" as a markup defect (per §8.2). A browser/desktop preview cannot confirm this — a live Gmail
test on a clean thread is required.

## 9. Output Rules

- The send's HTML lives **only** in that send's `Campaigns/<Type>/Output/` — there is no top-level Output
  folder. `Output/` holds the **latest generated build** as one **un-versioned** file
  (`<CODE>-YYYY-<id>.html`), used for browser/Klaviyo preview, QA and stakeholder review (§4.1).
- **`Output/` is kept in sync with the newest `Draft/` version.** When a new draft is produced, update the
  Output file to match; keep every `Draft/-vN` version for history/rollback (never delete drafts).
- **Presence in `Output/` is not sending approval.** Approval-to-send is a **status recorded in `Brief/`
  and `Review/`**, not folder placement. A build may sit in `Output/` for preview while still marked *not
  approved to send*.
- **Sending is gated (`CR-17`, `CR-14`), not the Output file.** A campaign may be **sent** only when
  approval is recorded **and** the **§8.1 send gate** passes (clickability verified post-Klaviyo,
  responsive rendering, images/product/CTA/coupon links confirmed, no unresolved blockers). Recorded
  approval alone is not enough; blockers (404 / dead links, hidden products, failing QA) **block the
  send** even though the HTML is present in `Output/` for preview.
- **Revisions are new Draft versions.** Any change creates a **new `Draft/-vN`**, which is reviewed/QA'd,
  then the `Output/` file is updated to match. Do not hand-edit the `Output/` file directly — regenerate
  it from the newest approved (or latest) Draft so `Draft/` remains the complete history.

## 10. Naming Conventions

One standard across the whole project. Weekly uses ISO week `Www`; monthly uses `MM`. Description
slugs are lowercase kebab-case.

| Artifact | Pattern | Example |
|----------|---------|---------|
| Weekly final HTML | `<CODE>-YYYY-Www.html` | `SS-2026-W28.html` |
| Monthly final HTML | `<CODE>-YYYY-MM.html` | `SS-2026-07.html` |
| Brief | `<CODE>-YYYY-Www-brief.md` | `SS-2026-W28-brief.md` |
| Draft (iterations) | `<CODE>-YYYY-Www-draft-vN.html` | `SS-2026-W28-draft-v1.html` |
| Reference image (per send) | `<CODE>-YYYY-Www-ref-<slug>.<ext>` | `SS-2026-W28-ref-homepage.png` |
| Reference image (brand-level, evergreen) | `<CODE>-ref-<slug>.<ext>` | `SS-ref-brand-guide.png` |
| Review / QA screenshot | `<CODE>-YYYY-Www-review-<target>.<ext>` | `SS-2026-W28-review-gmail-dark.png` |

`<target>` = client and/or viewport (e.g. `gmail`, `applemail-dark`, `desktop`, `mobile`). Use `MM`
in place of `Www` for all monthly artifacts.

**Non-Weekly/Monthly campaign types** use a type token + a lowercase kebab-case slug in place of the
`Www`/`MM` id: `<CODE>-YYYY-<TYPE>-<slug>`. Type tokens: `LAUNCH` (Product Launch), `HOL` (Holiday),
`SEA` (Seasonal), `CAT` (Category), `CLR` (Clearance), `STORY` (Brand Story), `EDU` (Educational),
`AUTO` (Automation). Examples: `RDD-2026-LAUNCH-access-safety-range.html`,
`RDD-2026-LAUNCH-access-safety-range-draft-v1.html`, `SS-2026-HOL-eofy-brief.md`.

## 11. Future Integration Guidelines

Forward hooks — **do not implement until explicitly approved:**

- **Integrations** — Klaviyo / BigCommerce / MCP connections for live product data and hand-off.
- **Scripts/** — build, image-optimization, HTML-validation, and screenshot automation.
- **Cross-project brand sources** — whether `BrandConfig.md` / `Design.md` become owned inside this
  workspace is deferred to after BRD review.

Roadmap rationale lives in `05-Future/`.

_Created: 2026-07-10 · Approved structure; operational guide._
