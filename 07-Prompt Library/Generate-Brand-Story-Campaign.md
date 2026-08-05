# Generate Brand Story Campaign

## Start here

- **Universal entry point:** read [`00-START-HERE.md`](00-START-HERE.md) first — it routes every
  generation task and tells you which prompt and playbook apply.
- **Matching playbook:** [`../Playbooks/Brand-Story-Playbook.md`](../Playbooks/Brand-Story-Playbook.md) —
  the strategy and worked examples for this type. This file is the *operational prompt*; the playbook is
  the *thinking*.
- **Source-of-truth order (CLAUDE.md §2).** On any conflict the higher source wins:
  **BRD → approved brand sources (`BrandConfig.md` / `Design.md`) → BRD brand doc (`03-Brands/<CODE>.md`)
  → the send's `Brief/`.** For this type the brand's `BrandConfig.md` facts (heritage, ownership,
  certifications) are especially load-bearing — never embellish them.
- **Read order (CLAUDE.md §3)** applies unchanged: this file → `BRD.md` → brand doc → approved brand
  sources → campaign `Brief/` → `References/` → existing `Draft/`.
- **Use this prompt when** the send's job is **trust and affinity, not a sale** — who we are, what we
  stand for, why we can be trusted. If the send is product-led, use another type.

## Objective & psychology

A brand story campaign builds **credibility and belonging**. The levers are **trust, values alignment,
and differentiation** — heritage, mission, the people, Australian ownership, certifications and
credentials. Product density is deliberately **low**; the reader should finish feeling *who* the brand
is and *why they can rely on it*, not pushed to buy. This is a long-game affinity send.

## Email structure (`BST-S#`)

Narrative-led with minimal product — the opposite of a product grid.

| ID | Block | Required | Purpose |
|------|-------|----------|---------|
| BST-S1 | Header / logo | Yes | Brand identification; logo alignment per CLAUDE.md §6.1 for SS/SC. |
| BST-S2 | Evocative hero | Yes | A human, authentic image that sets the brand's character. |
| BST-S3 | Opening narrative | Yes | The single story hook — who we are / why we exist. |
| BST-S4 | Story pillars | Yes | Two to three pillars: heritage, mission, values — each a distinct beat. |
| BST-S5 | Proof points | Yes | Verifiable credibility: certifications, Australian-owned, years in trade, credentials. |
| BST-S6 | Products as embodiment | Optional | Only 1–3 hero products that *demonstrate* the values, not a catalogue. |
| BST-S7 | Soft CTA | Yes | An invitation to learn more (about-us / our-story page), not a hard sell. |
| BST-S8 | Footer | Yes | Sender identity, unsubscribe, compliance. |

## Hero strategy

- Lead with a **human/authentic** image (the team, the workshop, the community) — brand character over
  product beauty-shot.
- **Visual-only by default; no baked-in price** (there is rarely a price to show) (CLAUDE.md §5.1, §7).
  AI-generated heroes follow §7 and must not fabricate people or places that misrepresent the brand.
- Build the hero container per the responsive/full-width rules cited in **Build framework** below.

## Copy guidance

- **No em dashes or dash-interruptions in introduction/supporting copy (CLAUDE.md §6.2).**
- **Length (CLAUDE.md §6.3):** this is a narrative type, so **more emotional, longer-form copy is
  justified** — but keep it genuine and readable, not indulgent. Each pillar is a distinct beat (§5.2),
  never a restatement of the opener (one introduction, §5.2).
- **Never invent brand facts.** Heritage, ownership, dates, certifications and claims come only from
  approved brand sources; carry their confidence tags (`[Confirmed]` / `[Inferred]` / `To be confirmed`,
  CLAUDE.md §5). An unverifiable claim does not go in.

## Product strategy

- **Low density on purpose: 1–3 products maximum**, each chosen because it *embodies* a value, not to
  drive volume.
- Any product shown comes from the **brand's approved source; when that is BigCommerce, retrieve via the
  BigCommerce API** and confirm it is **active and in stock on its own product page** (CLAUDE.md §5.1).
- **Never invent** product data (§5.1). **Skip and replace out-of-stock items and re-verify;** never leave
  an empty card.
- **Hidden products whose live URL 404s must not be linked** — a broken link badly damages a
  credibility-focused send. Exclude and replace, or drop the product block entirely rather than link a 404.

## CTA strategy

- **Soft, low-pressure CTA:** "Discover our story", "Meet the team", "Learn what we stand for" to an
  about-us / our-story page.
- One clear invitation; avoid duplicate/redundant CTAs (CLAUDE.md §6.2). All links live (CS-07).

## Coupon / offer handling

- **Usually none.** A discount can cheapen a trust-and-values narrative — default to **no coupon**.
- If the brief explicitly includes one, keep it **subtle and secondary**, with a title/copy **written
  fresh (CLAUDE.md §6.5)**; never recycle a prior promo title. **Never invent a code (§6.5);** placeholder
  if not supplied; **verify created and active** before send (§6.3).
- **SC only (§6.4):** if SC and an offer is approved, use the fixed-dollar **"$20 off orders over $200"**;
  no percentage discounts unless an approved special arrangement; keep the SC promo section highly
  readable. Do **not** apply to SS/RDD/Stack.

## Build framework & mechanics (cite, don't restate)

- Build from the shared framework: `Templates/<cadence>` + `Components/` + `Shared/`, brand-dependent
  values applied at generation (CLAUDE.md §5, CS-03/CR-19). No duplication.
- Follow **CLAUDE.md §6 HTML standards** and the link/containment safety rules in **§6.6**.
- Follow the **image rules in §8** and the **§8.1 email-client compatibility gates** (verify after Klaviyo
  import; Apple Mail / Gmail Web + Mobile / Outlook / Klaviyo Preview). Apply, do not restate.

## Pre-Output QA gate (Brand Story)

Promote to `Output/` only when all pass and are noted in `Review/` (CLAUDE.md §8.1, §9):

- [ ] Every brand fact / certification / claim is sourced from approved brand sources with its confidence
      tag; nothing invented or embellished (§5).
- [ ] Single opening narrative; each story pillar is a distinct beat, not a restatement (§5.2).
- [ ] Product density is low (1–3); any product verified active/in-stock on its own page; no 404 links;
      no empty cards (§5.1).
- [ ] No em dashes in intro/supporting copy (§6.2); no duplicate CTA concepts (§6.2).
- [ ] Soft CTA resolves to the live about-us / story page; any coupon (if present) confirmed active (§6.3).
- [ ] Clickability verified **post-Klaviyo**; hero does not shrink on Gmail Mobile (§6.6, §8.1); images
      load (HTTPS/200/no redirect) (§8, §8.1).
- [ ] Responsive pass: Desktop · Laptop · Gmail Mobile · Apple Mail · Outlook · Klaviyo Preview (§8.1).
- [ ] Independent reviewer/approver ≠ author (CR-16); approval recorded before Output (CR-17).

## Naming (CLAUDE.md §10)

Brand story sends keep the cadence pattern with a descriptive kebab-case slug. Weekly uses `Www`;
monthly uses `MM`.

| Artifact | Pattern | Example |
|----------|---------|---------|
| Final HTML | `<CODE>-YYYY-Www-<story-slug>.html` | `SC-2026-08-our-story-australian-owned.html` |
| Brief | `<CODE>-YYYY-Www-<story-slug>-brief.md` | `SC-2026-08-our-story-australian-owned-brief.md` |
| Draft (iterations) | `<CODE>-YYYY-Www-<story-slug>-draft-vN.html` | `SC-2026-08-our-story-australian-owned-draft-v1.html` |
| Review / QA screenshot | `<CODE>-YYYY-Www-<story-slug>-review-<target>.<ext>` | `SC-2026-08-our-story-australian-owned-review-desktop.png` |

*(Brand story sends are commonly monthly; the example uses the monthly `MM` form. Use `Www` for weekly.)*
