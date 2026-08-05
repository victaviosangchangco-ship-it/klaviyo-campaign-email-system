# RDD Product Launch — Concept B (Review & QA Notes)

**Latest draft:** `Draft/RDD-2026-LAUNCH-Concept-B-draft-v3.html` (v3 assessed below; v1/v2 kept for history)
**Type:** Product Launch — **alternative concept** for comparison against Concept A
(`…access-safety-range-draft-v1.html`). **Design exploration only.**
**Status:** DRAFT — **not** placed in `Output/`; **not** approved to send. Author: engine generation.
Reviewer/approver ≠ author (CR-16). Date: 2026-07-16.

---

## v3 (2026-07-17) — original industrial launch hero

**Assesses:** `Draft/RDD-2026-LAUNCH-Concept-B-draft-v3.html`. Requested by user. v2 untouched (rollback trail).
Only the hero (section 2) changed vs v2; all other sections and products are identical to v2.

### Hero redesign (Costway reference used as inspiration only — not copied)
- **Original, email-safe industrial hero** replacing v2's flat orange typographic panel. Table-based,
  inline CSS, no external hero image, no CSS transforms.
- **Geometric two-tone split:** charcoal (`#131313`) copy panel + orange (`#fd7f01`) product "platform"
  — a bold blocky industrial composition rather than the reference's busy diagonal ribbons.
- **Industrial hazard-stripe accent:** one restrained diagonal caution-tape bar via
  `repeating-linear-gradient` with a **solid-orange `background-color` fallback** for Outlook (which
  ignores the gradient). The premium nod to the reference's diagonal tape.
- **Warehouse/geometric touches:** orange rule block, charcoal "New" tag, a white "shelf" bar under the
  product, and a bottom **brand-URL strip** (`retaildisplaydirect.com.au · Shipped Australia-wide`) —
  an original echo of the reference's `au.costway.com` line.
- **Premium typography:** heavy uppercase Arial lockup ("ACCESS & / SITE-SAFETY"), tracked orange
  sub-eyebrow. Bulletproof CTA (VML + anchor), orange on charcoal.
- **Real launch product in the hero:** Expandable Safety Barrier – White 3.5m (BC id 1781,
  `visible=true`, image + product URL re-verified **HTTP 200** on 2026-07-17). Hero CTA links to that live
  page.
- **Awareness-led, not discount-led (§5.4):** deliberately dropped the reference's "SALE" framing;
  **no price in the hero** (§7). Badge reads "Just launched", not a discount.

### Automated markup QA (v3) — PASS
| Check | Result |
|-------|--------|
| Anchors wrapping a `<table>` (§6.6) | **0** |
| Block-level image anchors (§6.6) | **0** |
| Images with explicit `width`+`height` | **18 / 18** |
| Em dashes in copy (§6.2) | **0** |
| Tag balance (table / td / a) | 54/54 · 81/81 · 42/42 |
| Hero product image + link HTTP 200 | verified 2026-07-17 |

### Client-rendering caveat specific to this hero
- The hazard-stripe gradient and any `border-radius` will **flatten in Outlook desktop** (solid orange
  bar, square corners) — this is an acceptable, intentional fallback, not a defect. Confirm the two-tone
  split, hero product image, and CTA on **Apple Mail iPhone · Gmail Web/iOS/Android · Outlook · Klaviyo
  Preview** before any send (not exercisable in this environment). All other v2 caveats still apply.

---

## v2 (2026-07-17) — product correction + premium design pass

**Assesses:** `Draft/RDD-2026-LAUNCH-Concept-B-draft-v2.html`. Requested by user. v1 untouched (rollback trail).

### What changed vs v1
1. **Products corrected — the big one.** v1 featured the wrong catalogue (Totguard ergonomic
   chairs/lamps + ErgoDC desk gear + poster stand/wheel stop — a "New Workspace" theme). Those are
   **not** this Product Launch's approved SKUs. v2 now uses the **exact approved Access & Site-Safety
   range** verified via BigCommerce API (store `ugqmr0qfvf`, product IDs 1771–1783) — the same 13 SKUs as
   Concept A / the brief. Real images, names, prices, links and badges only; **no substitutions, no
   invented data.**
   - **4 Expandable Barriers** (`visible=true`, in stock, live URL 200) → **live product links** + "In stock" badge:
     White 3.5m HD $431.10, Black 3.5m HD $431.10, Safety White 3.5m $476.10, Safety Black 3.5m $476.10.
   - **9 not-yet-live** (7 Modular Rubber Ramps + Metal Speed Hump + Surface-Mount Bollard) → **`#launching-soon`
     placeholder links + "Launching soon" badge** (no 404s). Bollard shows "Price to be confirmed" ($0 in BC).
     Speed Hump & Bollard use **RDD-neutral display names** (BC titles still carry the competing "Safety
     Sector" brand — flagged for renaming; never shown here, CLAUDE.md §5.4).
2. **Header (request 1).** RDD logo now **perfectly centered** (`display:block; margin:0 auto`), premium
   vertical spacing, nav row **centered beneath** the logo with a thin divider.
3. **Black brand band (request 3).** Added the **genuine official RDD logo** on a small, tasteful **light
   chip** (width 132, centered) above "Trusted by Australian workplaces". Reason: the only real RDD logo
   asset is an orange-on-**white** raster JPG — placing it directly on black shows a white box, and
   recoloring/AI-generating an orange-transparent mark would fabricate an unofficial logo (not allowed).
   The chip presents the authentic logo professionally and modestly.
4. **Design pass (request 4).** Stronger hierarchy via a consistent orange section-label rhythm (mini rule
   + uppercase orange eyebrow + bold H2); subtle 1px section dividers; larger/tighter hero headline; cleaner
   cards (radius 14, 160px images, aligned name/price via min-heights); bulletproof CTAs (52px, 44px mobile
   tap); more breathing room; stronger orange usage. New storytelling flow: **Available now → pair the
   finishes → landing soon → also landing → act → trust → brand → community.** No reference image copied.

### Automated markup QA (v2) — PASS
| Check | Result |
|-------|--------|
| Anchors wrapping a `<table>` (Klaviyo clickability killer, §6.6) | **0** |
| Block-level image anchors (`<a display:block><img>`, Apple Mail killer, §6.6) | **0** |
| Images with explicit `width`+`height` attrs | **17 / 17** |
| Em dashes in copy (§6.2) | **0** |
| Tag balance (table / td / a) | 52/52 · 76/76 · 41/41 |
| Live barrier product links (HTTP 200 targets) | 4 unique, all verified **200** on 2026-07-17 |
| Not-yet-live products → placeholder (`#launching-soon`, no 404) | 9 products (18 anchors) |
| Logo + all product images HTTP 200 `image/jpeg` (spot + full set) | verified 2026-07-17 |
| Preheader hidden · dark-mode · Liquid intact · bulletproof CTA | present |

### Still required before ANY send (unchanged from v1 / §8.1)
- Concept B is a **comparison concept**, not send-ready. Send is still **blocked** by the 9 not-yet-live
  products (publish + re-verify; set bollard price/stock; rename the two "Safety Sector" BC titles).
- On-device client checks not exercisable here: **Apple Mail iPhone · Gmail Web/iOS/Android · Outlook ·
  Klaviyo Preview**, plus post-Klaviyo clickability of every card. Do not mark the §8.1 gate PASS until done.
- Branding is **[Inferred]** from the live site; no fabricated social proof (trust band is a factual
  positioning line only).

---

## v1 (2026-07-16) — original concept

## What this is
A second, deliberately different Product Launch concept inspired by the reference screenshots in
`References/` (a Costway "New Arrivals" long-scroll email). It reinterprets that **premium, long-scrolling,
storytelling ecommerce** structure in **original RDD branding** — it does **not** copy the references.
Concept A (access-safety-range) is untouched and remains the current primary draft.

## Concept direction
- **Theme:** "RDD New Arrivals" led by the **New Workspace Collection** (Totguard ergonomic study range +
  ErgoDC desk ergonomics), with a mixed "more new arrivals" grid (barriers, poster stand, bollard, stair
  nosing, wheel stop) echoing the reference's multi-category feel.
- **Branding [Inferred]:** RDD orange `#fd7f01`, ink `#131313`, rounded corners, Arial/Helvetica (Inter
  fallback), warehouse-value tone. Logo from the RDD CDN.
- **Structure (16 blocks):** Header → Nav → Quick-link pills → Hero banner (graphic, orange) → Featured
  launch product → Launch story → New Workspace Collection (3-col ×2) → Lifestyle feature with price
  bubble → Product bundle (Chair + Lamp) → More new arrivals (3-col ×2) → Benefits row → Social-proof band
  → Facebook/community join → Why buy from RDD → Footer.

## Products — all REAL, verified via BigCommerce API (store ugqmr0qfvf, 2026-07-16)
All 13 featured products are `visible=true`, in stock, live URL **HTTP 200**, image **200** — so, unlike
Concept A, **there are no placeholder links**. Featured: Totguard Ergonomic Study Chair (Blue) $242.
Collection: Study LED Lamp $110.50, Ergonomic Chair Pink $242, Heated Mouse Pad $54.82, Hand-Warmer Mouse
Pad $54.82, Desktop Pegboard $33.66, Under-Desk Footrest $36.13. More: Retractable Barrier Red $150 /
Black $152, A1 Poster Stand $177.57, Bollard 900mm Galvanised $77.49, Stair Nosing $29.48, Wheel Stop
$38.25. (ErgoDC Under-Desk CPU Mount was excluded — its image rendition returned 504 at build time.)

## Automated markup QA — PASS
| Check | Result |
|-------|--------|
| Block-level image anchors (Apple Mail killer, §6.6) | **0** |
| Anchors wrapping a `<table>` (Klaviyo clickability killer, §6.6) | **0** |
| Images with explicit `width`+`height` | **17 / 17** |
| Em dashes in copy (§6.2) | **0** |
| Tag balance (table/td/a) | 56/56 · 80/80 · 44/44 |
| All `<img src>` HTTP 200 `image/*` | 14/14 unique (logo + 13 products) |
| Product-page links HTTP 200 | verified (sample + all live products) |
| Preheader hidden (CS-14) · dark-mode (CS-12) · Liquid intact | present |
| Bulletproof CTA (VML + anchor, CS-08) · ≥44px tap | present |

## Honesty / to-confirm before any real use
- **No fabricated social proof.** The "social proof" band uses a factual RDD positioning line only — **no
  invented ratings, star counts, or customer quotes.** If Concept B advances, replace it with genuine,
  verified reviews/ratings.
- **Branding is [Inferred]** from the live site; confirm the official RDD kit.
- **Hero is a CSS/graphic banner** (RDD orange, no external hero image) to avoid fabricating lifestyle
  imagery; all other imagery is real product photography from the RDD CDN.
- This is a **concept for comparison**, not a send-ready campaign. §8.1 on-device client checks
  (Apple Mail iPhone, Gmail, Outlook, Klaviyo Preview) still required before any send.

## Files
- Created: `Draft/RDD-2026-LAUNCH-Concept-B-draft-v1.html` (46 KB).
- **Untouched:** Concept A draft, and `Output/RDD-2026-LAUNCH-access-safety-range.html`.
