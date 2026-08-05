# RDD Product Launch — Concept C (Review & QA Notes)

**Latest draft:** `Draft/RDD-2026-LAUNCH-Concept-C-draft-v2.html` (v2 assessed below; v1 kept for history)
**Type:** Product Launch — **third alternative concept** for comparison against Concept A
(`…access-safety-range`) and Concept B (`…Concept-B`). **Design exploration only.**
**Status:** DRAFT — **not** placed in `Output/`; **not** approved to send. Author: engine generation.
Reviewer/approver ≠ author (CR-16). Date: 2026-07-17.

---

## v2 (2026-07-17) — clickability fix + focused "Bold Launch" layout

**Assesses:** `Draft/RDD-2026-LAUNCH-Concept-C-draft-v2.html`. Requested by user, inspired by the
"Template 01 — Bold Launch" screenshot (focused, product-first, conversion layout). v1 untouched.

### The critical decision — clickability vs. the hidden SKUs (READ THIS)
User's v2 mandate was absolute: **every product card must link to a real live URL; no `#` links, no
placeholder links, no 404s, no broken links; verify every URL first.** But **9 of the 13 approved SKUs**
(7 rubber ramps + speed hump + bollard) are still **`is_visible=false` and 404 on their customer URLs** —
they have **no live URL to link to**. Linking them = a 404 (forbidden); using `#` = a placeholder link
(forbidden). The two rules cannot both hold for the hidden items.

**Resolution:** v2's shoppable grid features **only the 4 verified-live Expandable Barriers**, each a
**fully-clickable card** (image + title/price + "View Product" button → the real live product URL). The
rest of the range is represented **honestly in text only** ("modular rubber ramps, speed humps and
bollards landing soon") in the dark banner — **no product links, no `#`, no 404s.** This satisfies every
one of the user's link rules and matches the reference's focused few-product layout. Trade-off:
visible clickable products drop from 13 (v1, with `#launching-soon` placeholders) to 4 (all live).
If the fuller range must appear as cards, the hidden 9 must first be published in BigCommerce and
re-verified (URL 200) — same blocker as Concepts A/B.

### URL verification (run BEFORE generating, 2026-07-17)
| Target | Result |
|--------|--------|
| 4 barrier product pages (all `View Product` / image / title links) | **HTTP 200** |
| Homepage (hero fallback + "Browse all new arrivals") | **HTTP 200** |
| 6 unique images (logo + hero + 4 grid) | **HTTP 200 image/jpeg** |
| `#` / placeholder hrefs anywhere in the file | **0** |

### Design changes vs v1
- **Hero redesigned:** two-column premium composition — large clickable product on a cream "lightbox"
  (premium lighting) + bold uppercase **"NEW ARRIVALS"** (46px) + Georgia-italic "built for the site" +
  "Shop New In" CTA + a charcoal **"Australian Warehouse · Shipped Australia-wide"** strip (warehouse/
  industrial feel). Stacks to one column on mobile.
- **Benefit icon row** (Fast Shipping / Warehouse Prices / Australian Owned / Quality Assured) using
  CSS circle badges with unicode glyphs — **no external icon images** (nothing to break).
- **JUST LANDED grid:** 4 live barriers, larger 200px images, clearer price hierarchy (19px orange),
  filled-orange bulletproof "View Product" buttons. Every card fully clickable (3 sibling anchors → same
  live URL, §6.6-safe).
- **Dark "Built to last" banner**, **5-item trust section** (Australian Warehouse · Fast Shipping ·
  Commercial Grade · Trusted Locally · Bulk Orders Welcome), and a **stronger final CTA** ("Browse all new
  arrivals" → homepage 200).
- **Removed** v1's in-page pill nav (used `#` anchors) to comply with the no-`#` rule; community tiles
  dropped for a focused, reference-aligned layout.

### Automated markup QA (v2) — PASS
| Check | Result |
|-------|--------|
| Anchors wrapping a `<table>` (§6.6) | **0** |
| Block-level image anchors (§6.6) | **0** |
| Images with explicit `width`+`height` | **6 / 6** |
| Em dashes in copy (§6.2) | **0** |
| Tag balance (table / td / tr / a) | 43/43 · 60/60 · 49/49 · 23/23 |
| `#` or placeholder hrefs | **0** (all links live 200 URLs or Liquid unsubscribe) |
| Product cards fully clickable (image + title + button) | 4 / 4 |

### Still required before ANY send (§8.1)
- Comparison concept, **not send-ready**. On-device client checks (Apple Mail iPhone · Gmail
  Web/iOS/Android · Outlook · Klaviyo Preview) + post-Klaviyo clickability not exercisable here.
- Branding **[Inferred]**; trust lines are factual positioning only (no fabricated reviews).
- Border-radius flattens to square in Outlook desktop (acceptable fallback).

---

## v1 (2026-07-17) — premium ecommerce concept

## What this is
A **premium ecommerce** Product Launch concept requested by the user, inspired by the **"Final Design
Reference"** (a 5-template RDD showcase: Bold Launch / Clean Minimal / Industrial / Feature Highlight /
Gallery) and supporting `Reference1–7` (a Costway "New Arrivals" email). Reinterpreted in **original RDD
branding** — references used as inspiration only, **not copied pixel-for-pixel**. Concepts A and B are
untouched.

## Design direction (distinct from A and B)
- **Concept A** = access-safety long-scroll, orange-panel typographic hero. **Concept B** = industrial
  two-tone hero + hazard stripe. **Concept C** = premium ecommerce "New Arrivals" poster hero + product
  spotlight, gallery grids, redesigned community, conversion sections.
- **Header (user request):** RDD logo **centered** (`display:block; margin:0 auto`), refined nav spacing
  (2px tracking, even padding), thin divider — cleaner and more premium.
- **Quick-link pill bar** (New Arrivals / Fast Shipping / Trade & Community) → in-page anchors.
- **Hero (user request):** bold uppercase **"NEW ARRIVALS"** (54px) + a Georgia-italic **"now live"**
  script accent (email-safe serif, no web font), premium orange poster, a **real launch product spotlight**
  on a cream shelf (Expandable Safety Barrier – White, live/verified), "Shop New In" bulletproof CTA, and a
  charcoal brand-URL strip (`retaildisplaydirect.com.au`) echoing the reference's site line. No baked-in
  price in the hero (§7); prices live in the grids.
- **Trust badge row** (Fast dispatch / Warehouse prices / Australian owned / Quality assured).
- **JUST LANDED grid** (4 live barriers, 2×2) with "In stock" badges, prices and per-card "View product"
  outline buttons → live product pages.
- **Featured collection** dark banner ("Built for Australian worksites") → live barrier CTA.
- **RECENTLY LAUNCHED** 3×3 grid — the 9 not-yet-live SKUs (7 ramps + speed hump + bollard) with
  "Launching soon" badges + `#launching-soon` placeholder links (no 404s).
- **Trusted by Australian businesses** dark band + **Fast shipping** strip.
- **Community section redesigned (user request):** cream panel with the **official RDD logo** (on a light
  chip), clear hierarchy, and 5 tiles — **Facebook Community · New Arrivals · Product Updates · Trade
  Customers · Warehouse Deals** — plus a "Join the community" CTA. No fabricated discounts/coupons
  (Product Launch is awareness-led, §5.4; the reference's cashback/% -off framing was deliberately dropped).
- **Why buy from RDD** + compliant footer.

## Products — all REAL, verified via BigCommerce API (store ugqmr0qfvf), re-checked 2026-07-17
Same approved Access & Site-Safety SKUs as Concept A / the brief. **No placeholders, no random products,
no invented data.**
- **4 Expandable Barriers** (`visible=true`, in stock) → **live links + prices**, all 4 pages HTTP **200**.
- **9 not-yet-live** (7 Rubber Ramps + Metal Speed Hump + Surface-Mount Bollard) → **`#launching-soon`
  placeholders + "Launching soon" badges**. Bollard = "Price to be confirmed" ($0 in BC). Speed Hump &
  Bollard shown with **RDD-neutral names** (BC titles carry the competing "Safety Sector" brand — flagged
  for renaming; never displayed, §5.4).
- **All 14 images** (logo + 13 products) verified **HTTP 200 `image/jpeg`** on 2026-07-17.

## Automated markup QA (v1) — PASS
| Check | Result |
|-------|--------|
| Anchors wrapping a `<table>` (Klaviyo clickability killer, §6.6) | **0** |
| Block-level image anchors (Apple Mail killer, §6.6) | **0** |
| Images with explicit `width`+`height` attrs | **16 / 16** |
| Em dashes in copy (§6.2) | **0** |
| Tag balance (table / td / tr / a) | 69/69 · 98/98 · 80/80 · 46/46 |
| Live barrier product links (unique, HTTP 200) | 4, verified 2026-07-17 |
| Not-yet-live products → placeholder (`#launching-soon`, no 404) | 9 products (18 anchors) |
| In-page anchor targets present (`#new`,`#why`,`#community`,`#launching-soon`) | all present |
| Unique image sources HTTP 200 `image/jpeg` | 14 / 14 |
| Preheader hidden · dark-mode · Liquid intact · bulletproof CTAs | present |

## Client-rendering notes
- **Georgia italic** "now live" and `border-radius` render everywhere; in **Outlook desktop** border-radius
  flattens to square corners (acceptable, on-brand). The Georgia serif is a standard email-safe font.
- Hero, cream product shelf, trust row, both grids and the 5-tile community all **stack to single column**
  on mobile (`.pc/.bcol/.ccol/.stack` → 100%).

## Still required before ANY send (unchanged, §8.1)
- Concept C is a **comparison concept**, not send-ready. Send is **blocked** by the 9 not-yet-live products
  (publish + re-verify; set bollard price/stock; rename the two "Safety Sector" BC titles).
- On-device client checks not exercisable here: **Apple Mail iPhone · Gmail Web/iOS/Android · Outlook ·
  Klaviyo Preview**, plus post-Klaviyo clickability of every card. Do not mark the §8.1 gate PASS until done.
- Branding is **[Inferred]** from the live site; the "Trusted by Australian businesses" band is a factual
  positioning line only — **no fabricated reviews/ratings**.

## Files
- Created: `Draft/RDD-2026-LAUNCH-Concept-C-draft-v1.html` (~50 KB).
- **Untouched:** Concept A drafts/output, Concept B drafts (v1/v2/v3), and all other Product Launch HTML.
