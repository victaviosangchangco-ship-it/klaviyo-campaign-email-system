# RDD Product Launch — Brief

- **Brand:** RDD (Retail Display Direct — <https://www.retaildisplaydirect.com.au/>)
- **Campaign type:** Product Launch (NOT Weekly) — see [`../../../../Playbooks/Launch-Playbook.md`](../../../../../Playbooks/Launch-Playbook.md)
- **Send id / slug:** `2026-LAUNCH-access-safety-range`
- **Date raised:** 2026-07-16
- **Requested by:** Bruce — *"Prepare a new Product Launch email campaign. Do NOT use the Weekly Campaign. Prepare a draft first."*
- **Status:** Draft built with all 13 products and the latest build is in `Output/` for preview/QA/review. **NOT approved to send** — **9 hidden products carry placeholder links** and the **send is blocked** until they are published + re-verified (approval-to-send is tracked here + in `Review/`, per CLAUDE.md §4.1/§9).

## Theme & objective
Announce RDD's new **Access & Site-Safety range** — expandable barriers, a surface-mount bollard, a metal
speed hump, and the 7-height Modular Recycled Rubber Threshold Ramp family. Premium, benefit-led
announcement (awareness + first-wave traffic to the new product pages). **Not discount-led.**

## Product selection — APPROVED SKUs ONLY (do not auto-add newly-created products)
Source of truth: the approved SKU list below. Verified **via BigCommerce API**, store `ugqmr0qfvf`, on
2026-07-16 (credentials: `Brands/RDD/.env`, read-only). Storefront search hides unpublished items, so the
API was used as instructed.

| # | Approved SKU | RDD SKU | Product | Price | Visible | Stock | Live URL | Verdict |
|---|---|---|---|---|---|---|---|---|
| 1 | EXPBAR05WHIHD | EXPBAR05WHIHD | Expandable Barrier – White 3.5m (HD) | $431.10 | ✅ | 7 | 200 | ✅ send-ready |
| 2 | EXPBAR05BLAHD | EXPBAR05BLAHD | Expandable Barrier – Black 3.5m (HD) | $431.10 | ✅ | 7 | 200 | ✅ send-ready |
| 3 | EXPBAR05WHI | EXPBAR05WHI | Expandable Safety Barrier – White 3.5m | $476.10 | ✅ | 12 | 200 | ✅ send-ready |
| 4 | EXPBAR05BLA | EXPBAR05BLA | Expandable Safety Barrier – Black 3.5m | $476.10 | ✅ | 12 | 200 | ✅ send-ready |
| 5 | SPEHPM50 | SPEHPM50 | (BC name) "Safety Sector Metal Speed Hump 500mm" | $95.00 | ❌ | 0 | 404 | ⛔ hidden · OOS · wrong-brand name |
| 6 | BSMYEL90ECO | BSMYEL90ECO | (BC name) "Safety Sector Surface Mount Fixed Bollard 89mm" | $0.00 | ❌ | 0 | 404 | ⛔ hidden · $0 · OOS · wrong-brand name |
| 7 | MDRRUB100 | MDRRUB100 | Modular Recycled Rubber Threshold Ramp 100mm | $110.70 | ❌ | 2 | 404 | ⛔ hidden (URL 404) |
| 8 | MDRRUB88 | MDRRUB88 | Modular Recycled Rubber Threshold Ramp 88mm | $102.60 | ❌ | 5 | 404 | ⛔ hidden |
| 9 | MDRRUB75 | MDRRUB75 | Modular Recycled Rubber Threshold Ramp 75mm | $99.00 | ❌ | 7 | 404 | ⛔ hidden |
| 10 | MDRRUB64 | MDRRUB64 | Modular Recycled Rubber Threshold Ramp 64mm | $86.40 | ❌ | 12 | 404 | ⛔ hidden |
| 11 | MDRRUB50 | MDRRUB50 | Modular Recycled Rubber Threshold Ramp 50mm | $76.50 | ❌ | 12 | 404 | ⛔ hidden |
| 12 | MDRRUB38 | MDRRUB38 | Modular Recycled Rubber Threshold Ramp 38mm | $62.10 | ❌ | 17 | 404 | ⛔ hidden |
| 13 | MDRRUB25 | MDRRUB25 | Modular Recycled Rubber Threshold Ramp 25mm | $58.50 | ❌ | 47 | 404 | ⛔ hidden |

**All 13 are exact SKU matches (product IDs 1771–1783).** Only the 4 barriers are send-ready. No
substitutions were made (per instruction).

### Blockers to clear before this send can go out (owner: RDD/BigCommerce admin)
1. **Publish** products 5–13 (`is_visible = true`) so their live URLs return HTTP 200. Until then they
   are dead links; the draft uses clearly-marked placeholder links (`#not-live-*`) that do not point at a
   404 page.
2. **BSMYEL90ECO (#6):** set a real price (currently $0.00) and stock; publish.
3. **Rename #5 and #6** — product titles contain **"Safety Sector"** (a different brand). An RDD send must
   not display a competing brand's name. Use RDD-neutral names.
4. **Stock** on #5 and #6 is 0 — restock or exclude.
5. Re-run the API verification after fixes; every grid product must be `visible=true` + URL 200 + in stock
   + non-zero price.

## Brand layer — RDD [Inferred] (from the live site; confirm before send)
RDD's brand doc is almost entirely "To be confirmed", so the following are **[Inferred]** from
retaildisplaydirect.com.au (approved website source) per the approved plan:

- **Accent / primary:** `#fd7f01` (RDD orange) — [Inferred]
- **Ink / headline:** `#131313` · **body:** `#333333` · **muted:** `#757575` · **border:** `#e5e5e5` · **bg:** `#ffffff` — [Inferred]
- **Type:** Inter / Open Sans on site → email-safe fallback `Arial, Helvetica, sans-serif` — [Inferred]
- **Design language:** rounded corners, clean, generous whitespace — [Inferred]
- **Logo:** `https://cdn11.bigcommerce.com/s-ugqmr0qfvf/images/stencil/500x100/rdd_logo_1546236190__83236.original.jpg`
  (raster, 500×100, on white; email-safe) — [Confirmed on live site]
- **Footer / sender identity / phone / socials:** **To be confirmed** (not in any approved source).

## Deliverables
- Draft: `Draft/RDD-2026-LAUNCH-access-safety-range-draft-v1.html`
- Review notes: `Review/RDD-2026-LAUNCH-access-safety-range-review-notes.md`
- Output: `Output/RDD-2026-LAUNCH-access-safety-range.html` — latest build present for preview/QA/review.
  **Not approved to send** until the blockers above are cleared and the §8.1 send gate passes.
