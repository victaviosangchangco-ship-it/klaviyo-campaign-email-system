# Generate Seasonal Campaign

## Start here

- **Universal entry point:** read [`00-START-HERE.md`](00-START-HERE.md) first — it routes every
  generation task and tells you which prompt and playbook apply.
- **Matching playbook:** [`../Playbooks/Seasonal-Playbook.md`](../Playbooks/Seasonal-Playbook.md) — the
  strategy and worked examples for this type. This file is the *operational prompt*; the playbook is
  the *thinking*.
- **Source-of-truth order (CLAUDE.md §2).** On any conflict the higher source wins:
  **BRD → approved brand sources (`BrandConfig.md` / `Design.md`) → BRD brand doc (`03-Brands/<CODE>.md`)
  → the send's `Brief/`.**
- **Read order (CLAUDE.md §3)** applies unchanged: this file → `BRD.md` → brand doc → approved brand
  sources → campaign `Brief/` → `References/` → existing `Draft/`.
- **Use this prompt when** the send is led by a **season or time-of-year mood** (winter, summer, the
  start of the wet season, back-to-work) rather than a hard deadline. If there is a fixed date and an
  expiring offer, use `Generate-Holiday-Campaign.md` instead.

## Objective & psychology

A seasonal campaign builds **relevance and affinity** by reframing the range through the lens of the
current season and the customer's changed need-state. The lever is **emotional resonance, not urgency**:
in an Australian winter, safety and comfort products answer cold, wet, low-light conditions; in summer,
heat, hydration and sun. Conversion is softer and lifestyle-led — the reader should feel the season and
see the brand as the natural fit for it.

## Email structure (`SEA-S#`)

Lifestyle-led and atmospheric — deliberately unlike the dense Weekly product grid.

| ID | Block | Required | Purpose |
|------|-------|----------|---------|
| SEA-S1 | Header / logo | Yes | Brand identification; logo alignment per CLAUDE.md §6.1 for SS/SC. |
| SEA-S2 | Atmospheric hero | Yes | Sets the season's mood with lifestyle imagery + a short evocative line. |
| SEA-S3 | Seasonal narrative intro | Yes | One warm intro that names the season and why it matters now. |
| SEA-S4 | Lifestyle product story | Yes | A small, curated set of season-relevant products shown in context. |
| SEA-S5 | Seasonal tips / use block | Optional | Short practical guidance that reinforces relevance (not a hard sell). |
| SEA-S6 | Soft offer | Optional | A gentle seasonal incentive if the brief includes one — never the centrepiece. |
| SEA-S7 | Explore CTA | Yes | Invites the reader into the seasonal range. |
| SEA-S8 | Footer | Yes | Sender identity, unsubscribe, compliance. |

## Hero strategy

- Lead with **lifestyle/atmosphere**, not a product cut-out — the hero should feel like the season.
- **Visual-only by default; no baked-in price** unless the brief explicitly approves it (CLAUDE.md §5.1,
  §7). AI-generated heroes follow §7 (Hero-Banner-Generator prompt, Australian commercial direction,
  human approval).
- Build the hero container per the responsive/full-width rules cited in **Build framework** below.

## Copy guidance

- **No em dashes or dash-interruptions in introduction/supporting copy (CLAUDE.md §6.2).**
- **Length (CLAUDE.md §6.3):** seasonal copy may be **warmer and slightly more emotional** than a normal
  weekly send, but stay concise and scannable; keep the top clean (first impression, §6.3).
- **One introduction (§5.2):** once SEA-S3 establishes the season and message, later sections *support*
  it — do not add a second opener.
- **Fresh each week/season (§5.2):** do not reuse the previous send's seasonal angle, eyebrow, headline
  concept or hero treatment. Carry the brand vibe forward, make the theme genuinely new.

## Product strategy

- Fewer, **curated** products chosen for genuine seasonal relevance — quality of fit over quantity.
- Products come from the **brand's approved source; when that is BigCommerce, retrieve via the
  BigCommerce API** and confirm each is **active and in stock on its own product page** (CLAUDE.md §5.1).
- **Never invent** product data (§5.1); if valid seasonal products cannot be retrieved, **report the
  blocker** rather than fabricate.
- **Skip and replace out-of-stock items and re-verify**; never leave an empty card.
- **Hidden products whose live URL 404s must not be linked** — exclude and replace with a verified,
  season-relevant alternative.

## CTA strategy

- Primary CTA is **exploratory**: "Explore the winter range", "Shop seasonal essentials".
- One clear primary action; avoid duplicate/redundant CTA concepts (CLAUDE.md §6.2). All links resolve
  to live destinations (CS-07).

## Coupon / offer handling

- A seasonal offer is **optional and secondary**. If included, its title/copy are **written fresh for the
  season (CLAUDE.md §6.5)** — never recycle a prior promo title (e.g. no leftover `WINTER20`).
- **Never invent a coupon code (§6.5);** use a clearly-marked placeholder if the real code is not
  supplied, and **verify the code is created and active** before send (§6.3).
- **SC only (§6.4):** default SC offer is the fixed-dollar **"$20 off orders over $200"**; no percentage
  discounts unless an approved special arrangement applies; keep the SC promo section highly readable.
  Do **not** apply to SS/RDD/Stack.

## Build framework & mechanics (cite, don't restate)

- Build from the shared framework: `Templates/<cadence>` + `Components/` + `Shared/`, brand-dependent
  values applied at generation (CLAUDE.md §5, CS-03/CR-19). No duplication.
- Follow **CLAUDE.md §6 HTML standards** and the link/containment safety rules in **§6.6**.
- Follow the **image rules in §8** and the **§8.1 email-client compatibility gates** (verify after
  Klaviyo import; Apple Mail / Gmail Web + Mobile / Outlook / Klaviyo Preview). Apply, do not restate.

## Pre-Output QA gate (Seasonal)

Promote to `Output/` only when all pass and are noted in `Review/` (CLAUDE.md §8.1, §9):

- [ ] Season theme is genuinely new vs. the previous send; single introduction only (§5.2).
- [ ] Hero conveys the season and does **not** shrink on Gmail Mobile (§6.6, §8.1).
- [ ] Curated products all verified active/in-stock on their own product pages; no 404 links; no empty
      cards (§5.1).
- [ ] No em dashes in intro/supporting copy (§6.2); no duplicate CTA concepts (§6.2).
- [ ] If an offer is present: fresh season-aligned title (§6.5); code confirmed active (§6.3); SC follows
      §6.4 where applicable.
- [ ] Clickability verified **post-Klaviyo**; images load (HTTPS/200/no redirect) (§8, §8.1).
- [ ] Responsive pass: Desktop · Laptop · Gmail Mobile · Apple Mail · Outlook · Klaviyo Preview (§8.1).
- [ ] Independent reviewer/approver ≠ author (CR-16); approval recorded before Output (CR-17).

## Naming (CLAUDE.md §10)

Seasonal sends keep the cadence pattern with a descriptive kebab-case season slug. Weekly uses `Www`;
monthly uses `MM`.

| Artifact | Pattern | Example |
|----------|---------|---------|
| Final HTML | `<CODE>-YYYY-Www-<season-slug>.html` | `SC-2026-W28-winter-comfort.html` |
| Brief | `<CODE>-YYYY-Www-<season-slug>-brief.md` | `SC-2026-W28-winter-comfort-brief.md` |
| Draft (iterations) | `<CODE>-YYYY-Www-<season-slug>-draft-vN.html` | `SC-2026-W28-winter-comfort-draft-v1.html` |
| Review / QA screenshot | `<CODE>-YYYY-Www-<season-slug>-review-<target>.<ext>` | `SC-2026-W28-winter-comfort-review-desktop.png` |
