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
2. **Approved brand sources** — the brand's `BrandConfig.md` (facts) and `Design.md` (visual system).
3. **BRD brand document** — `03-Brands/<CODE>.md`.
4. **The send's `Brief/`** — the specific campaign instance.

## 3. Project Read Order

Before starting **any** task, read in this exact order (this makes every generation deterministic):

1. `CLAUDE.md` (this file)
2. `BRD.md`
3. Relevant brand document — `03-Brands/<CODE>.md`
4. Approved brand sources — `BrandConfig.md` / `Design.md`
5. Campaign `Brief/`
6. `References/`
7. Existing `Draft/` (if one exists)

## 4. File-Driven Workflow

Every send moves left→right through the six stages in `Brands/<CODE>/Campaigns/<Weekly|Monthly>/`.
Each stage is a folder; read the previous stages, write only the current one.

| Stage | Folder | Do | BRD |
|-------|--------|----|-----|
| 1 Brief | `Brief/` | Capture the brief from the Content Calendar | WK-P1 / MO-P1 |
| 2 Reference | `References/` | Gather screenshots & reference inputs | WK-P1/P3 · MO-P1/P3 |
| 3 Assets | `Assets/` | Collect this send's image files (evergreen from `Brands/<CODE>/Assets/`) | WK-P3 / MO-P3 |
| 4 Generate | `Draft/` | Build HTML from `Templates/<cadence>` + `Components` + brand values | WK-P4 / MO-P4 |
| 5 Review + QA | `Review/` | Render, review vs. `CS-##`, run the QA Checklist | WK-P5–P6 · MO-P5–P6 |
| 6 Output | `Output/` | Store the final approved HTML | WK-P7–P8 · MO-P7–P8 |

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

### 5.2 Campaign content hierarchy & non-repetition

- **No repeated messaging** — never repeat the same introduction, campaign message, headline concept, or
  supporting copy across consecutive sections. Each section must have a **distinct purpose** that moves
  the campaign narrative forward.
- **One introduction** — when the main campaign hero has already established the theme and message, do not
  add a second introduction. Hero visuals and later sections **support** the theme, they don't restate the
  opener.
- **Fit the theme** — template structure, content hierarchy, visual direction, products, and supporting
  sections must suit the specific campaign theme and objective; do not mechanically reuse a section
  structure when it doesn't fit.
- **Review as one experience** — before finalising, read the whole email end-to-end as one customer
  journey and remove redundant messaging or unnecessary sections.

## 6. HTML Generation Standards

The authoritative standards are `CS-08`–`CS-15` in the BRD — follow them; do not restate them here.
Build mechanics only: 600px container, single-column, **table-based layout + inline CSS**, dark-mode
aware (`color-scheme` meta + `prefers-color-scheme` + `[data-ogsc]`). Brand-specific measurements
(sizes, radius, spacing) come from that brand's `Design.md`.

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
- QA + independent review is the gate before `Output/`; no approval → no output (`CR-16`, `CR-17`).

## 9. Output Rules

- Final approved HTML lives **only** in the send's `Campaigns/<cadence>/Output/` — the single source
  of truth. There is no top-level Output folder.
- Approval must be recorded before a file lands in `Output/` (`CR-17`); hand-off follows `CR-14`.
- **Output files are immutable after approval.** Any requested revision creates a **new `Draft/`
  version** first, which is reviewed/QA'd and only then replaces the file in `Output/`. Never edit an
  approved Output file in place.

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

## 11. Future Integration Guidelines

Forward hooks — **do not implement until explicitly approved:**

- **Integrations** — Klaviyo / BigCommerce / MCP connections for live product data and hand-off.
- **Scripts/** — build, image-optimization, HTML-validation, and screenshot automation.
- **Cross-project brand sources** — whether `BrandConfig.md` / `Design.md` become owned inside this
  workspace is deferred to after BRD review.

Roadmap rationale lives in `05-Future/`.

_Created: 2026-07-10 · Approved structure; operational guide._
