# Generate Holiday Campaign

## Start here

- **Universal entry point:** read [`00-START-HERE.md`](00-START-HERE.md) first — it routes every
  generation task and tells you which prompt and playbook apply.
- **Matching playbook:** [`../Playbooks/Holiday-Playbook.md`](../Playbooks/Holiday-Playbook.md) — the
  strategy and worked examples for this type. This file is the *operational prompt*; the playbook is
  the *thinking*.
- **Source-of-truth order (CLAUDE.md §2).** On any conflict the higher source wins:
  **BRD → approved brand sources (`BrandConfig.md` / `Design.md`) → BRD brand doc (`03-Brands/<CODE>.md`)
  → the send's `Brief/`.** Never let a brief override a brand rule or a brand rule override the BRD.
- **Read order (CLAUDE.md §3)** applies unchanged: this file → `BRD.md` → brand doc → approved brand
  sources → campaign `Brief/` → `References/` → existing `Draft/`.
- **Use this prompt when** the send is anchored to a **fixed calendar moment with a hard deadline** —
  EOFY (30 June), BFCM, Christmas/New Year, a public-holiday or stocktake event. If the send is
  mood-led rather than deadline-led, use `Generate-Seasonal-Campaign.md` instead.

## Objective & psychology

A holiday campaign converts a **time-bounded event** into action before a deadline. The core levers are
**urgency, scarcity of time, and a concrete reason to buy now** — for Australian B2B that reason is
often practical: EOFY tax-deductibility ("purchase and claim this financial year"), stocktake pricing,
or shipping cut-offs before a shutdown period. The deadline is the campaign; every section should make
the clock impossible to ignore.

## Email structure (`HOL-S#`)

Distinct from the standard Weekly layout — the deadline framing is load-bearing top to bottom.

| ID | Block | Required | Purpose |
|------|-------|----------|---------|
| HOL-S1 | Deadline / urgency banner | Yes | Name the event and the hard date at the very top (e.g. "EOFY ends 30 June"). |
| HOL-S2 | Header / logo | Yes | Brand identification; logo alignment per CLAUDE.md §6.1 for SS/SC. |
| HOL-S3 | Event hero | Yes | The single dated message + offer; deadline visible in the hero. |
| HOL-S4 | The offer block | Yes | The event deal, framed dynamically (§6.5) with the validity/expiry date. |
| HOL-S5 | Curated event picks | Conditional | Gift / EOFY / stock-up grid — products chosen to fit the event, not filler. |
| HOL-S6 | Urgency reinforcement | Yes | Shipping cut-off, "order by" date, or "limited to the event window". |
| HOL-S7 | Secondary CTA | Optional | A single supporting action to the same destination; no duplicate CTA concepts (§6.2). |
| HOL-S8 | Footer | Yes | Sender identity, unsubscribe, compliance. |

## Hero strategy

- One bold, event-defining hero. The **deadline must be legible in the hero itself**, not buried below.
- Hero visual is **visual-only by default** — no baked-in price unless the brief explicitly approves it
  (CLAUDE.md §5.1, §7). AI-generated heroes follow §7 (Hero-Banner-Generator prompt, human approval).
- Build the hero container per the responsive/full-width rules cited in **Build framework** below — a
  holiday hero that shrinks on Gmail Mobile undermines the whole send.

## Copy guidance

- **No em dashes or dash-interruptions in introduction/supporting copy (CLAUDE.md §6.2).** Use clean,
  natural sentences.
- **Length (CLAUDE.md §6.3):** holiday sends are a *special/promotional* type, so slightly longer, more
  persuasive copy is justified — but stay scannable and keep the top uncluttered (first impression is a
  primary objective, §6.3).
- Urgency is explicit and honest: state the real date, the real cut-off, the real offer. Never
  manufacture a deadline that is not real.
- **No repeated messaging (§5.2):** the deadline is stated with fresh framing in HOL-S1, HOL-S4 and
  HOL-S6, not copy-pasted three times.

## Product strategy

- Products come from the **brand's approved product source; when that is BigCommerce, retrieve via the
  BigCommerce API** and confirm each item is **active and in stock on its own product page**, not a
  category listing (CLAUDE.md §5.1).
- **Never invent** product names, prices, SKUs, stock, product URLs or image URLs (§5.1). If the count
  cannot be met from valid stock, **report the blocker** — never fabricate to fill the grid.
- **Skip and replace any out-of-stock item and re-verify**; never leave an empty card.
- **Hidden products whose live product URL returns 404 must not be linked** — a card that 404s is a
  dead end and fails QA. Exclude it and choose a verified replacement that still fits the event theme.
- Pick event-relevant products (EOFY = high-value/deductible; gifting = giftable) — not merely the ones
  with the best image.

## CTA strategy

- Primary CTA is **deadline-anchored**: "Shop before 30 June", "Claim this EOFY", "Order before the cut-off".
- One primary action, repeated to the **same destination**; avoid a second generic CTA that duplicates it
  (CLAUDE.md §6.2). Every CTA must resolve to a live URL (CS-07).

## Coupon / offer handling

- The offer title/heading and supporting copy are **written fresh for this event (CLAUDE.md §6.5)** —
  never recycle a previous send's promo title. Generate a unique, event-aligned title that continues the
  hero message; include the **validity/expiry date**.
- **Coupon code vs. promo title are separate (§6.5).** Never invent a code; if the real code has not been
  provided use a clearly-marked placeholder while still writing the correct title/offer framing.
- **Coupons must be verified created and active** in the commerce platform before send (CLAUDE.md §6.3).
- **SC only (CLAUDE.md §6.4):** the standard SC offer is the fixed-dollar **"$20 off orders over $200"**;
  no percentage discounts unless an explicitly approved special arrangement applies. Keep the SC promo
  section highly readable (older audience). Do **not** apply the SC rule to SS/RDD/Stack.

## Build framework & mechanics (cite, don't restate)

- Build from the shared framework: `Templates/<cadence>` + `Components/` + `Shared/`, with only
  brand-dependent values applied at generation (CLAUDE.md §5, CS-03/CR-19). No duplication.
- Follow **CLAUDE.md §6 HTML standards** and the email-client link/containment safety rules in **§6.6**
  (no `<table>` inside an `<a>`; full-width tables carry `width:100%` in inline style; defensive
  responsive hero class). Do not restate these — apply them.
- Follow the **image rules in §8** (public HTTPS, HTTP 200, `image/*`, no redirects, email-safe weight)
  and the **§8.1 email-client compatibility gates** (verify after Klaviyo import; Apple Mail / Gmail
  Web + Mobile / Outlook / Klaviyo Preview).

## Pre-Output QA gate (Holiday)

Promote to `Output/` only when all pass and are noted in `Review/` (CLAUDE.md §8.1, §9):

- [ ] Event name + **hard deadline** correct and legible in HOL-S1 and the hero.
- [ ] Offer validity/expiry date stated and matches the verified coupon; **coupon confirmed active** (§6.3).
- [ ] Promo title freshly written for this event, not recycled (§6.5); SC offer follows §6.4 if SC.
- [ ] Every product verified active/in-stock on its own product page; no 404 links; no empty cards (§5.1).
- [ ] No em dashes in intro/supporting copy (§6.2); no duplicate CTA concepts (§6.2).
- [ ] Clickability verified **post-Klaviyo**; hero does not shrink on Gmail Mobile (§6.6, §8.1).
- [ ] Responsive pass: Desktop · Laptop · Gmail Mobile · Apple Mail · Outlook · Klaviyo Preview (§8.1).
- [ ] Images load (HTTPS/200/no redirect), links + CTA + coupon link all confirmed (§8, §8.1).
- [ ] Independent reviewer/approver ≠ author (CR-16); approval recorded before Output (CR-17).

## Naming (CLAUDE.md §10)

Holiday sends keep the cadence pattern with a descriptive kebab-case event slug. Weekly uses `Www`;
monthly uses `MM`.

| Artifact | Pattern | Example |
|----------|---------|---------|
| Final HTML | `<CODE>-YYYY-Www-<event-slug>.html` | `SS-2026-W26-eofy-sale.html` |
| Brief | `<CODE>-YYYY-Www-<event-slug>-brief.md` | `SS-2026-W26-eofy-sale-brief.md` |
| Draft (iterations) | `<CODE>-YYYY-Www-<event-slug>-draft-vN.html` | `SS-2026-W26-eofy-sale-draft-v1.html` |
| Review / QA screenshot | `<CODE>-YYYY-Www-<event-slug>-review-<target>.<ext>` | `SS-2026-W26-eofy-sale-review-gmail-mobile.png` |
