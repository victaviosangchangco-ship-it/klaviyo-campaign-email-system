# Generate Category Campaign

## Start here

- **Universal entry point:** read [`00-START-HERE.md`](00-START-HERE.md) first — it routes every
  generation task and tells you which prompt and playbook apply.
- **Matching playbook:** [`../Playbooks/Category-Playbook.md`](../Playbooks/Category-Playbook.md) — the
  strategy and worked examples for this type. This file is the *operational prompt*; the playbook is
  the *thinking*.
- **Source-of-truth order (CLAUDE.md §2).** On any conflict the higher source wins:
  **BRD → approved brand sources (`BrandConfig.md` / `Design.md`) → BRD brand doc (`03-Brands/<CODE>.md`)
  → the send's `Brief/`.**
- **Read order (CLAUDE.md §3)** applies unchanged: this file → `BRD.md` → brand doc → approved brand
  sources → campaign `Brief/` → `References/` → existing `Draft/`.
- **Use this prompt when** the send is a **deep dive into one product range/category** (e.g. hi-vis
  workwear, mobility aids, fall-protection). If the send spreads across the whole catalogue, use
  `Generate-Weekly-Campaign.md` instead.

## Objective & psychology

A category campaign moves the reader from awareness to **considered choice within a single range**. The
lever is **education and expertise**: show the breadth of the category, explain the differences between
its sub-types, and help the Australian B2B buyer match the right product to the job. Depth beats
spread — the reader should leave understanding the category and confident about what to buy.

## Email structure (`CAT-S#`)

Structured as a guided walk through one range, not a mixed grid.

| ID | Block | Required | Purpose |
|------|-------|----------|---------|
| CAT-S1 | Header / logo | Yes | Brand identification; logo alignment per CLAUDE.md §6.1 for SS/SC. |
| CAT-S2 | Category hero | Yes | Names and frames the category and who it is for. |
| CAT-S3 | "Why this category" intro | Yes | The problem the range solves and what it covers. |
| CAT-S4 | Range breakdown | Yes | The sub-types / tiers within the category, each briefly explained. |
| CAT-S5 | Featured products in range | Yes | A deeper grid of verified products drawn only from this category. |
| CAT-S6 | Selection / buying guidance | Optional | A short "how to choose" helper (specs, use-case, standards) that aids the decision. |
| CAT-S7 | Shop-the-range CTA | Yes | Sends the reader to the full category page. |
| CAT-S8 | Footer | Yes | Sender identity, unsubscribe, compliance. |

## Hero strategy

- A **category-defining hero** — imagery that says exactly which range this is; no ambiguity.
- **Visual-only by default; no baked-in price** unless the brief explicitly approves it (CLAUDE.md §5.1,
  §7). AI-generated heroes follow §7.
- Build the hero container per the responsive/full-width rules cited in **Build framework** below.

## Copy guidance

- **No em dashes or dash-interruptions in introduction/supporting copy (CLAUDE.md §6.2).**
- **Length (CLAUDE.md §6.3):** informative but scannable — this type earns a little more explanatory copy
  than a normal weekly, because education is the point, but each block stays tight and skimmable.
- Copy is **benefit + application**: what the sub-type is, what job it suits, what standard it meets. Keep
  a consistent, intentional hierarchy across all sections (§6.3).
- **No repeated messaging (§5.2):** the intro, range breakdown and buying guidance each do a *distinct*
  job; do not restate the category pitch in every block.

## Product strategy

- **Every product must belong to the one featured category** — this is the defining constraint of the type.
- Products come from the **brand's approved source; when that is BigCommerce, retrieve via the
  BigCommerce API** and confirm each is **active and in stock on its own product page**, not a category
  listing (CLAUDE.md §5.1). Category/collection pages routinely misreport availability.
- **Never invent** product names, prices, SKUs, stock, URLs or images (§5.1). If enough valid in-category
  products cannot be retrieved, **report the blocker** — do not fabricate or pull from another category to
  fill the grid.
- **Skip and replace out-of-stock items with another verified item from the same category and re-verify**;
  never leave an empty card.
- **Hidden products whose live URL 404s must not be linked** — exclude and replace within the category.
- Keep the grid balanced per CLAUDE.md §6.2 (consistent image areas, typography, spacing, price placement;
  cards are cohesive units).

## CTA strategy

- Primary CTA: **"Shop the [category] range"** to the live category page. Product cards link to their own
  verified product pages.
- One primary category action; avoid a redundant second generic CTA (CLAUDE.md §6.2). All links live (CS-07).

## Coupon / offer handling

- Usually **none** — a category campaign sells on fit and expertise, not discount. If the brief includes
  an offer, its title/copy are **written fresh and tied to the category (CLAUDE.md §6.5)**; never recycle
  a prior promo title.
- **Never invent a coupon code (§6.5);** placeholder if not supplied; **verify created and active** before
  send (§6.3).
- **SC only (§6.4):** default SC offer is the fixed-dollar **"$20 off orders over $200"**; no percentage
  discounts unless an approved special arrangement applies; keep the SC promo section highly readable.
  Do **not** apply to SS/RDD/Stack.

## Build framework & mechanics (cite, don't restate)

- Build from the shared framework: `Templates/<cadence>` + `Components/` + `Shared/`, brand-dependent
  values applied at generation (CLAUDE.md §5, CS-03/CR-19). No duplication.
- Follow **CLAUDE.md §6 HTML standards** and the link/containment safety rules in **§6.6** (critical for
  the deeper product grid — no `<table>` inside an `<a>`).
- Follow the **image rules in §8** and the **§8.1 email-client compatibility gates** (verify after Klaviyo
  import; Apple Mail / Gmail Web + Mobile / Outlook / Klaviyo Preview). Apply, do not restate.

## Pre-Output QA gate (Category)

Promote to `Output/` only when all pass and are noted in `Review/` (CLAUDE.md §8.1, §9):

- [ ] Every featured product belongs to the one category and is verified active/in-stock on its own
      product page; no 404 links; no empty cards (§5.1).
- [ ] Range breakdown and buying guidance each do a distinct job; no repeated category pitch (§5.2).
- [ ] Product grid is balanced (consistent image/typography/spacing/price); cards are cohesive (§6.2).
- [ ] No em dashes in intro/supporting copy (§6.2); no duplicate CTA concepts (§6.2).
- [ ] Product-grid clickability verified **post-Klaviyo** (image + title + card all navigate correctly);
      hero does not shrink on Gmail Mobile (§6.6, §8.1).
- [ ] Category CTA resolves to the live category page; images load (HTTPS/200/no redirect) (§8, §8.1).
- [ ] Responsive pass: Desktop · Laptop · Gmail Mobile · Apple Mail · Outlook · Klaviyo Preview (§8.1).
- [ ] Independent reviewer/approver ≠ author (CR-16); approval recorded before Output (CR-17).

## Naming (CLAUDE.md §10)

Category sends keep the cadence pattern with a descriptive kebab-case category slug. Weekly uses `Www`;
monthly uses `MM`.

| Artifact | Pattern | Example |
|----------|---------|---------|
| Final HTML | `<CODE>-YYYY-Www-<category-slug>.html` | `SS-2026-W30-hi-vis-workwear.html` |
| Brief | `<CODE>-YYYY-Www-<category-slug>-brief.md` | `SS-2026-W30-hi-vis-workwear-brief.md` |
| Draft (iterations) | `<CODE>-YYYY-Www-<category-slug>-draft-vN.html` | `SS-2026-W30-hi-vis-workwear-draft-v1.html` |
| Review / QA screenshot | `<CODE>-YYYY-Www-<category-slug>-review-<target>.<ext>` | `SS-2026-W30-hi-vis-workwear-review-mobile.png` |
