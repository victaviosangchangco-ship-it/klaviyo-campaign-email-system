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

Two build defects survive a localhost/desktop preview but break in real email clients / Klaviyo. A
browser preview is **never** sufficient proof for either — both must be checked in the built markup.

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
- **QA gate:** before Output, confirm **zero anchors contain a `<table>`** and every structural
  full-width table carries `width:100%` in its inline style. Verify clickability in a real Klaviyo test
  import, not only on localhost/desktop.

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

**5. Responsive QA checklist (must all pass before promotion).**
`✓ Desktop · ✓ Laptop · ✓ Gmail Mobile · ✓ Apple Mail · ✓ Outlook Preview · ✓ Klaviyo Preview.`
Any layout inconsistency (shrink, overflow, broken stack, mis-alignment) must be **resolved before**
promotion to `Output/` — never promoted "to fix later".

**6. Output approval gate.** In addition to the recorded approval and immutability rules in §9, HTML may be
promoted to `Output/` **only** when all of the following are verified and noted in `Review/`:
`✓ clickability verified (post-Klaviyo) · ✓ responsive rendering verified · ✓ images load correctly ·
✓ product links work · ✓ CTA links work · ✓ coupon link works.` `Output/` must always be the final
production-ready version.

**7. Root-cause-first principle.** When an issue is discovered, **do not ship a temporary/symptomatic fix
first.** Always: (a) identify the true root cause, (b) document the lesson in the send's `Review/` notes,
and (c) convert any reusable finding into a permanent CLAUDE.md rule (as §6.6 and this §8.1 were). The
objective is continuous improvement — each completed project should make CLAUDE.md smarter so future
campaigns avoid the same mistake automatically.

## 9. Output Rules

- Final approved HTML lives **only** in the send's `Campaigns/<cadence>/Output/` — the single source
  of truth. There is no top-level Output folder.
- Approval must be recorded before a file lands in `Output/` (`CR-17`); hand-off follows `CR-14`. The
  approval must satisfy the **§8.1 Output approval gate** (clickability verified post-Klaviyo, responsive
  rendering, images/product/CTA/coupon links all confirmed) — recorded approval alone is not enough.
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
