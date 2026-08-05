# Generate Clearance Campaign

## Start here

- **Universal entry point:** read [`00-START-HERE.md`](00-START-HERE.md) first — it routes every
  generation task and tells you which prompt and playbook apply.
- **Matching playbook:** [`../Playbooks/Clearance-Playbook.md`](../Playbooks/Clearance-Playbook.md) — the
  strategy and worked examples for this type. This file is the *operational prompt*; the playbook is
  the *thinking*.
- **Source-of-truth order (CLAUDE.md §2).** On any conflict the higher source wins:
  **BRD → approved brand sources (`BrandConfig.md` / `Design.md`) → BRD brand doc (`03-Brands/<CODE>.md`)
  → the send's `Brief/`.**
- **Read order (CLAUDE.md §3)** applies unchanged: this file → `BRD.md` → brand doc → approved brand
  sources → campaign `Brief/` → `References/` → existing `Draft/`.
- **Use this prompt when** the send moves **genuine end-of-line, discontinued, or limited-remaining
  stock** on value and scarcity. If the discount is a date-bounded event promotion, use
  `Generate-Holiday-Campaign.md` instead.

## Objective & psychology

A clearance campaign converts on **value + scarcity**: real markdowns on genuinely limited stock. The
levers are **bargain, loss aversion, and "while stocks last"**. For Australian B2B buyers the pitch is
practical — get the spec you need at a reduced price before it is gone. **Honesty is the non-negotiable
constraint:** scarcity and savings must be real and verified, never manufactured.

## Email structure (`CLR-S#`)

Value-forward and scarcity-anchored, distinct from the full-price Weekly grid.

| ID | Block | Required | Purpose |
|------|-------|----------|---------|
| CLR-S1 | Clearance banner | Yes | Honest framing at the top: "Clearance — while stocks last". |
| CLR-S2 | Header / logo | Yes | Brand identification; logo alignment per CLAUDE.md §6.1 for SS/SC. |
| CLR-S3 | Value hero | Yes | The savings message; the reason these prices exist (end-of-line, discontinued). |
| CLR-S4 | Scarcity note | Yes | Honest limited-stock statement; no invented "only N left" numbers. |
| CLR-S5 | Clearance grid | Yes | Reduced products with verified was/now pricing; balanced cards. |
| CLR-S6 | Final-stock reinforcement | Optional | Restates "once it's gone it's gone" without inventing urgency. |
| CLR-S7 | Shop-clearance CTA | Yes | Sends the reader to the live clearance page. |
| CLR-S8 | Footer | Yes | Sender identity, unsubscribe, compliance. |

## Hero strategy

- A **value/savings hero** — clear, uncluttered, communicates the markdown without shouting fake urgency.
- **Visual-only by default; no baked-in price** unless the brief explicitly approves it (CLAUDE.md §5.1,
  §7). AI-generated heroes follow §7.
- Build the hero container per the responsive/full-width rules cited in **Build framework** below.

## Copy guidance

- **No em dashes or dash-interruptions in introduction/supporting copy (CLAUDE.md §6.2).**
- **Length (CLAUDE.md §6.3):** concise and value-forward — lead with the saving and the honesty; do not
  pad. Keep the top clean and scannable (first impression, §6.3).
- **Urgent but honest:** "while stocks last" is fine; "only 3 left, hurry!" is **not** unless that count
  is verified true. Never manufacture scarcity or a deadline that is not real.

## Product strategy

- Only include items that are **genuinely reduced and genuinely limited**. Clearance stock sells fast, so
  verify **rigorously and late**.
- Products come from the **brand's approved source; when that is BigCommerce, retrieve via the
  BigCommerce API** and confirm each is **active and in stock on its own product page**, not a category
  listing (CLAUDE.md §5.1).
- **Was/now pricing must be the real verified figures** — never invent a "was" price to inflate the
  saving. If the reduced price or original price cannot be verified, **do not show a comparison**.
- **Never invent** product names, prices, SKUs, stock, URLs or images (§5.1). If valid clearance stock
  cannot be retrieved, **report the blocker** — never fabricate to fill the grid.
- **Skip and replace out-of-stock items and re-verify;** never leave an empty card. Given how fast
  clearance sells, **re-verify stock again immediately before Output**.
- **Hidden products whose live URL 404s must not be linked** — a discontinued item often has its page
  pulled, so this is a frequent clearance failure mode. Exclude any 404 and replace with a verified item.

## CTA strategy

- Primary CTA: **"Shop clearance"** / "Grab it before it's gone" to the live clearance page; product
  cards link to their verified product pages.
- One primary action; avoid a redundant second generic CTA (CLAUDE.md §6.2). All links live (CS-07).

## Coupon / offer handling

- The **markdown itself is usually the offer** — an additional coupon is optional and only if the brief
  approves it. Do not stack an invented discount on top of clearance pricing.
- If a coupon is included, its title/copy are **written fresh for this clearance (CLAUDE.md §6.5)**;
  never recycle a prior promo title. **Never invent a code (§6.5)** — placeholder if not supplied — and
  **verify it is created and active** before send (§6.3).
- **SC only (§6.4):** default SC offer is the fixed-dollar **"$20 off orders over $200"**; no percentage
  discounts unless an approved special arrangement applies; keep the SC promo section highly readable.
  Do **not** apply to SS/RDD/Stack.

## Build framework & mechanics (cite, don't restate)

- Build from the shared framework: `Templates/<cadence>` + `Components/` + `Shared/`, brand-dependent
  values applied at generation (CLAUDE.md §5, CS-03/CR-19). No duplication.
- Follow **CLAUDE.md §6 HTML standards** and the link/containment safety rules in **§6.6**.
- Follow the **image rules in §8** and the **§8.1 email-client compatibility gates** (verify after Klaviyo
  import; Apple Mail / Gmail Web + Mobile / Outlook / Klaviyo Preview). Apply, do not restate.

## Pre-Output QA gate (Clearance)

Promote to `Output/` only when all pass and are noted in `Review/` (CLAUDE.md §8.1, §9):

- [ ] Every clearance item verified active/in-stock on its own product page, **re-verified immediately
      before Output**; no 404 links; no empty cards (§5.1).
- [ ] Was/now prices are the real verified figures; no invented "was" price; scarcity claims are true (§5.1).
- [ ] No em dashes in intro/supporting copy (§6.2); no duplicate CTA concepts (§6.2).
- [ ] If a coupon is present: fresh title (§6.5); code confirmed active (§6.3); SC follows §6.4 where applicable.
- [ ] Product-grid clickability verified **post-Klaviyo**; hero does not shrink on Gmail Mobile (§6.6, §8.1).
- [ ] Clearance CTA resolves to the live clearance page; images load (HTTPS/200/no redirect) (§8, §8.1).
- [ ] Responsive pass: Desktop · Laptop · Gmail Mobile · Apple Mail · Outlook · Klaviyo Preview (§8.1).
- [ ] Independent reviewer/approver ≠ author (CR-16); approval recorded before Output (CR-17).

## Naming (CLAUDE.md §10)

Clearance sends keep the cadence pattern with a descriptive kebab-case slug. Weekly uses `Www`;
monthly uses `MM`.

| Artifact | Pattern | Example |
|----------|---------|---------|
| Final HTML | `<CODE>-YYYY-Www-<clearance-slug>.html` | `RDD-2026-W31-clearance-end-of-line.html` |
| Brief | `<CODE>-YYYY-Www-<clearance-slug>-brief.md` | `RDD-2026-W31-clearance-end-of-line-brief.md` |
| Draft (iterations) | `<CODE>-YYYY-Www-<clearance-slug>-draft-vN.html` | `RDD-2026-W31-clearance-end-of-line-draft-v1.html` |
| Review / QA screenshot | `<CODE>-YYYY-Www-<clearance-slug>-review-<target>.<ext>` | `RDD-2026-W31-clearance-end-of-line-review-gmail-mobile.png` |
