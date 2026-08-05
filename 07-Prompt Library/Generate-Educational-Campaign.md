# Generate Educational Campaign

## Start here

- **Universal entry point:** read [`00-START-HERE.md`](00-START-HERE.md) first — it routes every
  generation task and tells you which prompt and playbook apply.
- **Matching playbook:** [`../Playbooks/Educational-Playbook.md`](../Playbooks/Educational-Playbook.md) —
  the strategy and worked examples for this type. This file is the *operational prompt*; the playbook is
  the *thinking*.
- **Source-of-truth order (CLAUDE.md §2).** On any conflict the higher source wins:
  **BRD → approved brand sources (`BrandConfig.md` / `Design.md`) → BRD brand doc (`03-Brands/<CODE>.md`)
  → the send's `Brief/`.** Compliance and standards claims must trace to an approved source, never memory.
- **Read order (CLAUDE.md §3)** applies unchanged: this file → `BRD.md` → brand doc → approved brand
  sources → campaign `Brief/` → `References/` → existing `Draft/`.
- **Use this prompt when** the send's job is to **teach** — a how-to, buying guide, or compliance
  explainer — with low commercial pressure. If the aim is primarily to sell a range, use
  `Generate-Category-Campaign.md` instead.

## Objective & psychology

An educational campaign earns trust by being **useful first**. The levers are **authority, reciprocity,
and reduced purchase anxiety**: teach the reader something they need — how to choose, how to comply, how
to use — and the brand becomes the expert they buy from later. For Australian B2B this often means
**compliance and standards** (e.g. the relevant AS/NZS standard for a product class): explaining
obligations plainly is genuinely valuable and positions the brand as the safe choice. Pressure is low;
value is high.

## Email structure (`EDU-S#`)

Structured as a lesson, not a sales sheet.

| ID | Block | Required | Purpose |
|------|-------|----------|---------|
| EDU-S1 | Header / logo | Yes | Brand identification; logo alignment per CLAUDE.md §6.1 for SS/SC. |
| EDU-S2 | Topic hero | Yes | Names the topic and the outcome ("How to choose the right X"). |
| EDU-S3 | Why it matters | Yes | The problem, risk, or obligation that makes this worth reading now. |
| EDU-S4 | The guide | Yes | The core teaching: numbered steps, a checklist, or a clear how-to. |
| EDU-S5 | Compliance / standards callout | Optional | The relevant AS/NZS standard or obligation, stated plainly and sourced. |
| EDU-S6 | Products that support the lesson | Optional | A few contextual products that *apply* the guidance, not a full grid. |
| EDU-S7 | Key takeaways | Optional | A short recap the reader can act on. |
| EDU-S8 | Resource CTA | Yes | Low-pressure next step: read the full guide, or talk to the team. |
| EDU-S9 | Footer | Yes | Sender identity, unsubscribe, compliance. |

## Hero strategy

- An **informative/instructional hero** — a clear topic framing (a diagram-style or explanatory visual),
  not a hard product push.
- **Visual-only by default; no baked-in price** unless the brief explicitly approves it (CLAUDE.md §5.1,
  §7). AI-generated heroes follow §7 and must not depict unsafe or non-compliant practice.
- Build the hero container per the responsive/full-width rules cited in **Build framework** below.

## Copy guidance

- **No em dashes or dash-interruptions in introduction/supporting copy (CLAUDE.md §6.2).**
- **Length (CLAUDE.md §6.3):** a guide justifies **longer, structured copy** — but keep it highly scannable
  (numbered steps, short paragraphs, clear headings). Clarity and correctness outrank persuasion here (CS-04).
- **Accuracy is the whole product.** Never invent a standard number, a compliance requirement, a spec, or a
  statistic. If a fact cannot be sourced from an approved source, mark it `To be confirmed` and raise it —
  do not ship an unverifiable claim (CLAUDE.md §5).
- Each section does a distinct job (§5.2); "why it matters", "the guide" and "key takeaways" must not
  repeat each other.

## Product strategy

- Products are **supporting evidence for the lesson, not the point** — include only a few that directly
  apply the guidance.
- Any product shown comes from the **brand's approved source; when that is BigCommerce, retrieve via the
  BigCommerce API** and confirm it is **active and in stock on its own product page** (CLAUDE.md §5.1).
- **Never invent** product data (§5.1). **Skip and replace out-of-stock items and re-verify;** never leave
  an empty card. If no suitable in-stock product supports the lesson, omit the product block rather than pad it.
- **Hidden products whose live URL 404s must not be linked** — exclude and replace, or drop the block.

## CTA strategy

- **Low-pressure, resource-led CTA:** "Read the full guide", "Download the checklist", "Talk to our team".
- One clear next step; avoid duplicate/redundant CTAs (CLAUDE.md §6.2). All links live (CS-07).

## Coupon / offer handling

- **Usually none** — a discount undercuts the value-first, low-pressure intent. Default to **no coupon**.
- If the brief explicitly includes one, keep it **subtle and clearly secondary** to the lesson, with a
  title/copy **written fresh (CLAUDE.md §6.5)**; never recycle a prior promo title. **Never invent a code
  (§6.5);** placeholder if not supplied; **verify created and active** before send (§6.3).
- **SC only (§6.4):** if SC and an offer is approved, use the fixed-dollar **"$20 off orders over $200"**;
  no percentage discounts unless an approved special arrangement; keep the SC promo section highly readable.
  Do **not** apply to SS/RDD/Stack.

## Build framework & mechanics (cite, don't restate)

- Build from the shared framework: `Templates/<cadence>` + `Components/` + `Shared/`, brand-dependent
  values applied at generation (CLAUDE.md §5, CS-03/CR-19). No duplication.
- Follow **CLAUDE.md §6 HTML standards** and the link/containment safety rules in **§6.6**.
- Follow the **image rules in §8** and the **§8.1 email-client compatibility gates** (verify after Klaviyo
  import; Apple Mail / Gmail Web + Mobile / Outlook / Klaviyo Preview). Apply, do not restate.

## Pre-Output QA gate (Educational)

Promote to `Output/` only when all pass and are noted in `Review/` (CLAUDE.md §8.1, §9):

- [ ] Every fact, standard number, spec and compliance claim is sourced from an approved source; nothing
      invented; unverifiable items marked `To be confirmed` and raised (§5).
- [ ] The guide is clear and correct (CS-04); sections do distinct jobs with no repetition (§5.2).
- [ ] Any supporting product verified active/in-stock on its own page; no 404 links; no empty cards (§5.1).
- [ ] No em dashes in intro/supporting copy (§6.2); no duplicate CTA concepts (§6.2).
- [ ] Resource CTA resolves to the live guide/contact destination; any coupon (if present) confirmed
      active (§6.3).
- [ ] Clickability verified **post-Klaviyo**; hero does not shrink on Gmail Mobile (§6.6, §8.1); images
      load (HTTPS/200/no redirect) (§8, §8.1).
- [ ] Responsive pass: Desktop · Laptop · Gmail Mobile · Apple Mail · Outlook · Klaviyo Preview (§8.1).
- [ ] Independent reviewer/approver ≠ author (CR-16); approval recorded before Output (CR-17).

## Naming (CLAUDE.md §10)

Educational sends keep the cadence pattern with a descriptive kebab-case topic slug. Weekly uses `Www`;
monthly uses `MM`.

| Artifact | Pattern | Example |
|----------|---------|---------|
| Final HTML | `<CODE>-YYYY-Www-<topic-slug>.html` | `SS-2026-W32-choosing-fall-protection.html` |
| Brief | `<CODE>-YYYY-Www-<topic-slug>-brief.md` | `SS-2026-W32-choosing-fall-protection-brief.md` |
| Draft (iterations) | `<CODE>-YYYY-Www-<topic-slug>-draft-vN.html` | `SS-2026-W32-choosing-fall-protection-draft-v1.html` |
| Review / QA screenshot | `<CODE>-YYYY-Www-<topic-slug>-review-<target>.<ext>` | `SS-2026-W32-choosing-fall-protection-review-mobile.png` |
