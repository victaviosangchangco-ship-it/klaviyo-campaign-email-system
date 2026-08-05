# Review — SS Product Launch (rebrand of RDD Product Launch template)

**Assesses:** `Draft/SS-2026-LAUNCH-Product-Launch-Draft-v1.html` (mirrored to
`Output/SS-2026-LAUNCH-Product-Launch-Final.html`).
**Date:** 2026-07-23 · **Type:** Product Launch (§5.4) · **Approval status: NOT approved to send** (see blockers).

## Objective
Convert the approved RDD Product Launch layout
(`Brands/RDD/Campaigns/Product Launch/Output/RDD-2026-LAUNCH-Product-Launch-Final.html`) into a native
**Safety Sector** campaign while preserving the layout, responsive structure, and the product-grid
sections exactly. The RDD source was used as a read-only reference and was **not modified**.

## What was preserved (unchanged per the brief)
- Email layout, responsive/media-query structure, 600px single-column architecture.
- All three product-grid sections: **4 Expandable Barriers**, **7 Rubber Ramps** (with the colspan-2
  centered final card, §6.9), and the **speed hump + bollard** row. Columns, spacing, card structure,
  image dimensions, reserved-height alignment, "New" badge / "Launching soon" pill placement, and the
  CTA layout are all identical to the RDD reference.
- Product **copy, prices, images, and destination URLs** are carried over verbatim (grid untouched).

## What was rebranded to the SS design system
| Element | RDD → SS |
|---------|----------|
| Header | Centered logo + 4-item orange-underline nav → **left-aligned SS logo, no nav** (SS default §6.1; nav is opt-in §6.11). SS logo GIF (`T7SuPP/…f4045d61…`). |
| Hero | RDD ramp launch image → **SS-branded black launch panel** (red accent bar, red eyebrow, white Arial-Black headline, red "Shop the range" pill → `/expandable-barriers/`). |
| Brand colours | Orange `#fd7f01`/`#f58220`/`#f47c20` → **SS red `#e11b22`**; text `#131313` → `#000000`; sub `#757575` → `#6f6f6f`. |
| Typography | Headlines/prices → `'Arial Black',Arial,…`; body `Arial,Helvetica,…` (SS system). |
| Buttons | "View Product" orange outline → **SS red outline**; VML recolored to match. |
| Section rules | Orange divider lines → SS red. Card border `#eaeaea` → `#e6e6e6`. |
| Promo banner | RDD warehouse image w/ baked CTA → **SS red HTML value panel** ("Kit out your whole site", white "Explore the collection" CTA → `/products/`). No coupon code invented (§6.5). |
| Trust strip | 3-col structure kept; icons + headings → black, subcopy grey (SS restyle). |
| Contact | SS: `02 9790 2182`, `sales@safetysector.com.au`. |
| Social links | Added **Facebook** + **Instagram** (SS official URLs, text links — no unverified icon images). |
| Footer | SS company blurb, `Safety Sector Pty Ltd`, 3 Wordie Place Padstow NSW 2211, SS privacy URL, `{% unsubscribe_link %}`. |
| Preheader / title / dark-mode palette | Rewritten for SS. |

## QA / Ghost-Element Inspection (§8.2) — source-level, PASS
- ✓ Zero leftover RDD orange hex values.
- ✓ Zero `<table>` inside an `<a>`; zero empty/nested anchors (§6.6).
- ✓ Tag balance: table 36/36, tr 58/58, td 72/72, a 39/39.
- ✓ No em dashes in **visible** copy (§6.2) — the 7 matches are inside HTML comments only.
- ✓ Hero/promo CTAs: anchor wraps inline content only; image-free panels (no `display:block` anchor issue).
- Note: `href="#launching-soon"` (18×) is the reference template's intentional in-page anchor for
  not-yet-live "Launching soon" products (points to the section `id`, not a bare `#`). Preserved from the
  untouched grid.

## Blockers — MUST resolve before send (§8.1 send gate)
1. **Product data/URLs/images are still RDD** (`retaildisplaydirect.com.au`, BC store `s-ugqmr0qfvf`) —
   carried over because the grid was to remain untouched. For a real SS send these must be replaced with
   **verified-live SS product data** (SS BigCommerce, HTTP 200, in-stock) per §5.1/§5.4. Present a
   verification/mapping table for approval before promotion.
2. **Hero is an SS-branded HTML panel, not baked artwork.** No SS launch artwork existed for this rebrand.
   Per §6.15, replace with a single full-bleed SS launch hero export before production.
3. **Prices carried from RDD** — reconfirm against SS pricing; bollard price is "to be confirmed".
4. **Client testing not performed here.** Verify in Klaviyo Preview · Gmail Web/Mobile · Apple Mail
   (incl. iPhone) · Outlook; confirm clickability post-Klaviyo import (§8.1). Not yet done.

## Status
Layout/visual rebrand complete and review-ready. Design is native-SS; **content (products, links, hero
artwork, prices) is placeholder** from the reference and gated as above. Not approved to send.

---

# Update — Draft v2 (2026-07-23) — assets + links finalization

**Assesses:** `Draft/SS-2026-LAUNCH-Product-Launch-Draft-v2.html` (mirrored to
`Output/SS-2026-LAUNCH-Product-Launch-Final.html`). Grid layout, spacing, card sizes, responsive
behaviour and typography hierarchy are **unchanged** from v1.

### Changes applied
1. **Hero banner** → single embedded SS artwork, edge-to-edge, one clickable anchor (§6.14/§6.15).
   Src `…/Edit_banner_with_new_branding_202607231016_ppb5jv.jpg` (1376×768, set 600×335), served via
   Cloudinary `w_1200,q_auto:good,f_jpg` transform (source was 641KB — too heavy raw, §8). Links to
   `/expandable-barriers/`. Replaced the v1 HTML hero panel.
2. **Promo banner** → single embedded SS artwork, **full email width** edge-to-edge, clickable
   (`…/Edit_hero_banner_for_Safety_202607231015_r4h2zx.jpg`, 1376×768→600×335, same optimisation
   transform; source 696KB raw). Links to `/products/`. Replaced the v1 red HTML promo panel.
3. **"Launching soon" removed** from every card (0 remain) and replaced with a real **View Product**
   CTA button matching the barrier cards, so all cards are now consistent (§6.8).
4. **Every product fully clickable** — image, title and CTA all link to the same SS destination.

### Product URL mapping (matched to safetysector.com.au)
| Card | SS URL | Confidence |
|------|--------|-----------|
| Expandable Barrier White 3.5m | `/heavy-duty-2m-high-expandable-barrier-white-3-5m/` | High |
| Expandable Barrier Black 3.5m | `/heavy-duty-2m-high-expandable-barrier-black-3-5m/` | High |
| Expandable Safety Barrier White 3.5m | `/2m-high-expandable-barrier-white-3-5m/` | High |
| Expandable Safety Barrier Black 3.5m | `/2m-high-expandable-barrier-black-3-5m/` | High |
| Ramp 100mm | `/door-entrance-ramp-100mm-high/` | Medium (100mm rubber entrance ramp) |
| Ramp 88mm | `/rubber-wheelchair-ramp/` (category) | **TODO — no 88mm match** |
| Ramp 75mm | `/doorway-ramp-75mm-high/` | Medium (75mm rubber doorway ramp) |
| Ramp 64mm | `/rubber-wheelchair-ramp/` (category) | **TODO — no 64mm match** |
| Ramp 50mm | `/rubber-wheelchair-ramp-50mm-high/` | Medium |
| Ramp 38mm | `/rubber-threshold-ramp-38mm-high/` | High (exact) |
| Ramp 25mm | `/rubber-mobility-access-ramp-900x150x25mm/` | Medium (25mm) |
| Metal Speed Hump 500mm | `/speed-humps/` (category) | **TODO — no 500mm metal hump** |
| Surface-Mount Fixed Bollard 89mm | `/surface-mounted-safety-bollard-900mm/` | Medium (~90mm surface-mount) |

- **3 in-HTML TODO comments** mark the 88mm, 64mm and 500mm speed-hump cards; each currently points to
  its live parent **category** (verified-live) as an interim so no card ships a dead/`#` link (§6.7).
- Product **images remain RDD BigCommerce CDN** (`s-ugqmr0qfvf`) — only assets/links were in scope this
  round. Swap to SS product imagery before send.

### QA / Ghost-Element Inspection (§8.2) — PASS
✓ 0 `retaildisplaydirect` links · ✓ 0 `href="#"`/empty · ✓ 0 `<table>` in `<a>` · ✓ 0 empty/nested
anchors · ✓ 0 `display:block` on an image anchor (§6.6) · ✓ tag balance table 34/34, tr 56/56, td 70/70,
a 48/48 · ✓ no visible em dashes.

### Outstanding before send (unchanged gate, §8.1)
- Reconfirm each mapped SS product URL returns **HTTP 200** and matches the card (name/price/stock) on
  its own product page; resolve the 3 TODO links to exact products.
- Reconfirm **prices** against SS (carried from reference); bollard price still "to be confirmed".
- Swap product-card **images** to SS assets.
- Client testing not performed here: Klaviyo Preview · Gmail Web/Mobile · Apple Mail (incl. iPhone) ·
  Outlook, and post-Klaviyo clickability. **Not approved to send.**

---

# Update — Draft v3 (2026-07-23) — SKU-verified links, hero/promo destinations, footer

**Assesses:** `Draft/SS-2026-LAUNCH-Product-Launch-Draft-v3.html` (mirrored to `Output/…-Final.html`).
Grid layout, card sizes, spacing, responsive behaviour and typography are **unchanged** from v2 — this
pass edited **links and the footer only**. (New version per §4.1/§9 — the user asked to update v2, but
prior drafts are never overwritten; v2 is preserved as history and Output is synced from v3.)

### Link verification method
SKUs supplied by the user were treated as source of truth and verified against the **SS BigCommerce
storefront search** (`/search.php?search_query=<SKU>`), which resolves a SKU to its real product page.

### Verified product mapping (all clickable elements — image, title, View Product — updated)
| Card | SKU | Verified SS URL |
|------|-----|-----------------|
| Expandable Barrier White 3.5m (HD) | EXPBAR05WHIHD | `/heavy-duty-2m-high-expandable-barrier-white-3-5m/` |
| Expandable Barrier Black 3.5m (HD) | EXPBAR05BLAHD | `/heavy-duty-2m-high-expandable-barrier-black-3-5m/` |
| Expandable Safety Barrier White 3.5m | EXPBAR05WHI | `/2m-high-expandable-barrier-white-3-5m/` |
| Expandable Safety Barrier Black 3.5m | EXPBAR05BLA | `/2m-high-expandable-barrier-black-3-5m/` |
| Rubber Ramp 100 / 88 / 75 / 64 / 50 / 38 / 25mm | MDRRUB100…MDRRUB25 | `/modular-rubber-ramp/` (all 7 SKUs are height **variants of one product**; every ramp SKU resolves here) |

### SKUs that could NOT be matched → in-HTML `<!-- TODO: … -->` left (per instruction, no guessing)
- **SPEHP2535** (Metal Speed Hump 500mm): store search returns only fuzzy 250mm modules ($11.69/$15.13),
  no 500mm/$95 product. Card links to the live `/speed-humps/` category as interim; TODO added.
- **Bollard (Surface-Mount Fixed Bollard 89mm):** **no bollard SKU was supplied.** The three `BS*` SKUs
  all resolve to **bird-spike** products, not bollards — `BSSS10048` = 100cm bird spikes,
  `BSPL502001` = 50cm bird spikes (parallel), `BSPL502002` = 50cm bird spikes (staggered). Card links to
  the live `/surface-mounted-safety-bollard/` page as interim; TODO added. (Bird-spike SKUs were **not**
  used anywhere — no bird-spike product belongs in this launch.)

### Other changes
- **Hero banner + CTA** now link to `https://www.safetysector.com.au/products/` (was
  `/expandable-barriers/`) — per the new CLAUDE.md §5.4 Product-Launch hero-destination rule.
- **Promo banner** confirmed linking to `/products/`.
- **Footer:** Facebook + Instagram social links removed entirely (no empty gap left); rest of footer intact.
- **CLAUDE.md §5.4** gained the permanent Product-Launch hero-destination rule (checked first — no
  duplicate existed).

### QA / Ghost-Element Inspection (§8.2) — PASS
✓ 0 `retaildisplaydirect` · ✓ 0 `href="#"`/empty · ✓ 0 `<table>` in `<a>` · ✓ 0 empty/nested anchors ·
✓ 0 `display:block` image anchors · ✓ 0 Facebook/Instagram · ✓ tag balance table 34/34, tr 56/56,
td 70/70, a 46/46 · ✓ link counts: barriers 4×4, ramps 28 (=7×4), `/products/` 2, speed-humps 4,
bollard 4.

### Still outstanding before send (§8.1)
- Resolve the 2 TODO links (confirm the 500mm speed-hump SKU/URL; obtain the bollard SKU + URL).
- Reconfirm each verified URL returns **HTTP 200** at send time and that prices/stock match.
- Product-card **images** still on RDD CDN — swap to SS assets.
- Multi-client + post-Klaviyo clickability testing. **Not approved to send.**

---

# Update — Draft v4 (2026-07-23) — added 3 required bird-spike SKUs

**Assesses:** `Draft/SS-2026-LAUNCH-Product-Launch-Draft-v4.html` (mirrored to `Output/…-Final.html`).
Added a new **"Bird & Pest Control"** section; all existing sections, layout, sizes, spacing,
responsiveness and typography are **unchanged**. (New draft per §4.1/§9.)

### Three required SKUs added — all verified on safetysector.com.au (product page + on-page SKU)
| SKU | Title | Price | URL | Image |
|-----|-------|-------|-----|-------|
| BSPL502001 | 50cm Stainless Steel Bird Spikes – Parallel Design | $4.50 (RRP $12.00) | `/50cm-stainless-steel-bird-spikes-parallel-design/` | `s-498h0egvgn …/products/918/5009/6_97__50119…` (stencil 500×500, square) |
| BSPL502002 | 50cm Stainless Steel Bird Spikes – Staggered Design | $4.50 (RRP $12.00) | `/50cm-stainless-steel-bird-spikes-staggered-design/` | `s-498h0egvgn …/products/919/images/4742/1__10292…386.513` (portrait) |
| BSSS10048 | 100cm Stainless Steel Bird Spikes – Staggered Design | $10.17 (RRP $20.00) | `/100cm-stainless-steel-bird-spikes-staggered-design/` | `s-498h0egvgn …/products/920/images/4744/1__55618…386.513` (portrait) |

- Layout: 2-column, 2 cards + 1 centered (colspan §6.9), identical card component. Image, title and
  View Product button all link to the correct product page.
- **Image note:** the two 50cm images are portrait 386×513 and BigCommerce has **no square stencil
  rendition** (the 500×500 path returns 404), so their **exact verified URLs** are used, pinned to true
  aspect (135×180) at a common 180px height so the row stays aligned (§6.8). All 3 image URLs verified
  **HTTP 200 image/jpeg**.
- These three SKUs are the same bird-spike products that were incorrectly listed against the bollard
  earlier; the **bollard card is unchanged** (still its own TODO — no bollard SKU supplied).

### Final SKU-in-grid checklist
☑ BSPL502001 present (×4 clickable) · ☑ BSPL502002 present (×4) · ☑ BSSS10048 present (×4).

### QA — PASS
✓ 0 `<table>` in `<a>` · 0 empty/nested anchors · 0 `display:block` image anchors · 0 `href="#"`/empty ·
tag balance table 42/42, tr 68/68, td 85/85, a 55/55 · 16 product cards total (4 barriers · 7 ramps ·
speed hump · bollard · 3 bird spikes). Grid layout/responsiveness of existing sections untouched.
Still **not approved to send** (2 remaining TODO links, image swap for the RDD-CDN cards, prices/stock
reconfirmation, and multi-client testing all still outstanding per §8.1).

---

# Update — Draft v5 (2026-07-23) — ramp SKUs now link to distinct variant URLs (root-cause fix)

**Assesses:** `Draft/SS-2026-LAUNCH-Product-Launch-Draft-v5.html` (mirrored to `Output/…-Final.html`).
Only the 7 ramp-card links changed; layout/sizes/spacing/responsiveness/typography unchanged.

### Root cause (why all 7 ramps opened the same page)
On safetysector.com.au the seven ramp SKUs are **not seven separate products** — they are the seven
**height variants of a single product**, "Modular Rubber Ramp" (master SKU **MDRUB1**, one product page
with a size dropdown). The dropdown is one product option, `attribute[176]`, with values 165–171. The
store's SKU search therefore returns exactly one product (`/modular-rubber-ramp/`) for every `MDRRUB*`
SKU, and in v3/v4 all seven cards were mapped to that one bare URL — so every card opened the same page.
This was **not** a first-result/parent-vs-SKU bug in a lookup script (there is no script — links are
hand-mapped); it reflected the site's real structure. BigCommerce does not give option values their own
product URLs, so seven wholly separate URLs do not exist on the storefront.

### Fix
Extracted the option/value map directly from the product page's own form and gave each ramp card its own
**verified variant deep-link** (distinct query string that pre-selects that height), so each SKU now has a
different destination that opens on its correct variant:

| SKU | Height | option value | URL |
|-----|--------|--------------|-----|
| MDRRUB25 | 25mm | 165 | `/modular-rubber-ramp/?attribute%5B176%5D=165` |
| MDRRUB38 | 38mm | 166 | `…=166` |
| MDRRUB50 | 50mm | 167 | `…=167` |
| MDRRUB64 | 64mm | 168 | `…=168` |
| MDRRUB75 | 75mm | 169 | `…=169` |
| MDRRUB88 | 88mm | 170 | `…=170` |
| MDRRUB100 | 100mm | 171 | `…=171` |

All three clickable elements per card (image, title, View Product) use the same per-card URL.

### Verification
- All 7 deep-links return **HTTP 200** (curl).
- Value↔height pairing verified on each image line: 171↔100mm, 170↔88mm, 169↔75mm, 168↔64mm, 167↔50mm,
  166↔38mm, 165↔25mm.
- 7 unique ramp destination URLs present; each value appears 4× (image/title/mso/non-mso); 0 bare base
  URLs remain.
- Ghost/HTML QA: 0 `<table>`-in-`<a>`, 0 empty/nested anchors, 0 `display:block` image anchors,
  0 `href="#"`/empty; tags balanced (table 42/42, tr 68/68, td 85/85, a 55/55). Bird-spike SKUs intact.

### Note / caveat
These are variant deep-links to the **one** live "Modular Rubber Ramp" product, not seven standalone
product pages (those do not exist on the storefront). If the SS BigCommerce admin genuinely holds seven
separate products with their own canonical URLs (e.g. hidden/unpublished), provide those URLs or connect
the SS BigCommerce API and they can replace the deep-links. Also note the product's own variant price
range ($65–$662) differs from the per-height prices shown on the cards (carried from the RDD brief) —
reconfirm ramp pricing before send. **Still not approved to send** per the outstanding §8.1 items.

---

# Update — Draft v6 (2026-07-23) — verified prices + standalone URLs + full link/image QA

**Assesses:** `Draft/SS-2026-LAUNCH-Product-Launch-Draft-v6.html` (mirrored to `Output/…-Final.html`).
Prices/links/one image changed; layout, sizes, spacing, responsive behaviour and typography unchanged.

### Prices reviewed against live safetysector.com.au — CHANGED items
Ramp prices were pulled from BigCommerce's live variant-price endpoint
(`/remote/v1/product-attributes/948`, option `attribute[176]`); all others from the product pages.

| Product | Old (RDD-brief) | New (verified SS) | Source |
|---------|-----------------|-------------------|--------|
| Ramp 100mm (MDRRUB100) | $110.70 | **$662.00** | variant 171 |
| Ramp 88mm (MDRRUB88) | $102.60 | **$539.00** | variant 170 |
| Ramp 75mm (MDRRUB75) | $99.00 | **$425.00** | variant 169 |
| Ramp 64mm (MDRRUB64) | $86.40 | **$315.00** | variant 168 |
| Ramp 50mm (MDRRUB50) | $76.50 | **$219.00** | variant 167 |
| Ramp 38mm (MDRRUB38) | $62.10 | **$134.00** | variant 166 |
| Ramp 25mm (MDRRUB25) | $58.50 | **$65.00** | variant 165 |
| Bollard "89mm" | Price to be confirmed | **$57.80** | standalone `surface-mounted-safety-bollard-900mm` (SKU BSMYEL90) |
| Metal Speed Hump 500mm | $95.00 | **Price to be confirmed** | no matching SS product found; cannot verify |

### Prices reviewed — UNCHANGED (already correct)
- Barriers: $431.10 / $431.10 / $476.10 / $476.10 (re-verified on product pages).
- Bird spikes: $4.50 / $4.50 / $10.17 (verified on product pages).

### Standalone-URL upgrades
- **Bollard** now links to its standalone product page `…/surface-mounted-safety-bollard-900mm/`
  (was the generic `…/surface-mounted-safety-bollard/`), image swapped to the real SS product image
  (`s-498h0egvgn …/products/112/779/BSMYEL90…`, verified 200), price $57.80. **Matched by description —
  no bollard SKU was supplied — so an in-HTML NOTE asks for confirmation.**
- **Speed hump:** no standalone SS product exists for a 500mm metal hump (only 1m steel / 250mm rubber
  modules), so it stays on the live `/speed-humps/` category with its `TODO: Verify … SPEHP2535` and
  price set to "Price to be confirmed" (could not verify $95 on the SS site).
- Ramps kept as verified variant deep-links (per user's decision).

### FINAL QA — all pass
- **Links:** all 19 unique hrefs return **HTTP 200** (7 ramp variants, 4 barriers, 3 bird spikes,
  bollard, speed-humps, /products/, privacy, homepage).
- **Images:** all 19 unique image srcs return **HTTP 200 image/***  (no broken images) — logo GIF, hero,
  promo, 13 product images.
- **Hero + Promo** both link to `https://www.safetysector.com.au/products/`.
- **Required SKUs present** in grid: BSPL502001, BSPL502002, BSSS10048 (each ×4 clickable).
- **Ghost/HTML:** 0 `<table>`-in-`<a>`, 0 empty/nested anchors, 0 `display:block` image anchors,
  0 `href="#"`/empty; tags balanced (table 42/42, tr 68/68, td 85/85, a 55/55).
- **Responsive:** media query + `.pc` stacking + `.center-half` + `colspan="2"` centering all intact;
  desktop 600px table and mobile stack unchanged. (Actual client rendering — Gmail/Apple Mail/Outlook/
  Klaviyo — still to be confirmed in a real test per §8.1; cannot be executed from this environment.)

### Remaining before send
- Confirm the **bollard** is the intended product (no SKU supplied) and provide the **speed-hump** SKU/URL.
- Sanity-check the much higher ramp prices ($65–$662) against the small-threshold-ramp images shown
  (images are still on the RDD CDN; the SS "Modular Rubber Ramp" may be a larger product — confirm the
  imagery/price coherence, and swap product images to SS assets).
- Real multi-client + post-Klaviyo test. **Not yet approved to send.**

---

# Update — Draft v7 (2026-07-23) — Modular Rubber Ramp consolidated to ONE product (Bruce-approved)

**Assesses:** `Draft/SS-2026-LAUNCH-Product-Launch-Draft-v7.html` (mirrored to `Output/…-Final.html`).
**New campaign design standard, approved by Bruce:** the Modular Rubber Threshold Ramp is presented as a
single product, not seven per-size cards. Only the ramp section (§6 products) changed; Hero, Expandable
Barriers, Also New, Promo, Trust icons and Footer are untouched (verified present).

### What changed
- **Removed** the 7 per-size cards (25/38/50/64/75/88/100mm) and the centered-7th `colspan` wrapper
  (all `?attribute%5B176%5D=` variant deep-links now gone — 0 remain).
- **One premium centered card** (440px, full-width on mobile) featuring the **combined "all components"
  image** from the SS product listing — product 948, image 5145
  (`s-498h0egvgn …/products/948/images/5145/…386.513.jpg`, verified HTTP 200). Visually confirmed it shows
  the full stacked modular ramp system.
- **Copy:** Title "Modular Rubber Threshold Ramp" · red eyebrow "Available in Multiple Sizes" ·
  description "Choose from multiple height options ranging from 25mm to 100mm to suit different access and
  mobility requirements. Select your preferred size on the product page." · price **"From $65.00"**.
- **Link:** image, title and CTA all → verified base `https://www.safetysector.com.au/modular-rubber-ramp/`
  (customer selects size on the product page).
- Section rebalanced to a single centered card, premium, no orphan white space.

### Image note
Bruce's "combined image" was not supplied as a URL/file; it was identified as the recently-uploaded
combined-components image on the SS `/modular-rubber-ramp/` listing (img 5145) and visually verified.
If Bruce meant a different specific asset, it's a one-line `src` swap.

### QA — all pass
- Ramp card links (image/title/MSO+non-MSO CTA = 4) → base `/modular-rubber-ramp/` (HTTP 200); combined
  image HTTP 200; 0 variant deep-links remain.
- Hero + Promo still → `/products/`; required bird-spike SKUs still present (×4 each).
- Ghost/HTML: 0 `<table>`-in-`<a>`, 0 empty/nested anchors, 0 `display:block` image anchors,
  0 `href="#"`/empty; tags balanced (table 35/35, tr 52/52, td 66/66, a 37/37).
- Responsive: single card uses `.center-half`/`.pc` so it centres on desktop and goes full-width on mobile.
- Untouched sections confirmed intact.

Outstanding before send unchanged (bollard/speed-hump confirmations, real multi-client + Klaviyo test).
**Not yet approved to send.**

---

# Update — Draft v8 (2026-07-23) — featured ramp card re-aligned to the shared card system (§6.8/§6.9)

**Assesses:** `Draft/SS-2026-LAUNCH-Product-Launch-Draft-v8.html` (mirrored to `Output/…-Final.html`).
Fixes the v7 featured ramp card, which broke §6.9 (a lone/centered card must be byte-for-byte identical
to the other product cards — only the wrapper centers it; never resize the card/image/fonts/padding).

### Problem in v7
The featured card was a bespoke 440px card with an oversized 280×372 image and larger fonts (19px title),
so the image dominated and it didn't match the rest of the email.

### Fix (v8) — now the standard card component, centered
- **Card width 282px** via the `center-half` wrapper (same as the old centered ramp/bird cards); card
  itself not resized.
- **Image 135×180** — identical treatment to the bird-spike portrait cards; 180px height matches the
  section's other cards, so it no longer dominates. Combined image (product 948 / img 5145) unchanged.
- **Standard classes/spacing restored:** `pn` (title 14px/700), `pd` (description 11px), `pp` (price 18px),
  image cell `padding:16px 14px 12px 14px`, content cell `padding:0 14px 18px 14px`, CTA `padding:11px 24px`
  — all identical to every other card.
- Copy kept (Bruce's direction): title "Modular Rubber Threshold Ramp" · red eyebrow "Available in Multiple
  Sizes" · "Heights from 25mm to 100mm. Choose your size on the product page." · "From $65.00" · View Product.
- Still one product; image/title/CTA all → verified `/modular-rubber-ramp/`.

### QA — pass
- 10 product cards, all using `pn/pd/pp` alignment classes and the identical 11px×24px CTA; 3 images at
  135×180 (2 bird + this ramp); no 440px/280×372/19px-title leftovers.
- Ramp card 4 links → base `/modular-rubber-ramp/`; combined image present; hero+promo → `/products/`;
  bird SKUs intact.
- Ghost: 0 table-in-a / empty-a / block-a / `href="#"`; tags balanced (table 35/35, tr 52/52, td 66/66,
  a 37/37). Untouched sections confirmed.

Outstanding before send unchanged. **Not yet approved to send.**

---

# Update — Draft v9 (2026-07-23) — product grid rebalanced into complete 2-col rows (no orphans)

**Assesses:** `Draft/SS-2026-LAUNCH-Product-Launch-Draft-v9.html` (mirrored to `Output/…-Final.html`).
Only the post-Barriers product grid changed; Hero, Expandable Barriers, Promo, Trust and Footer untouched.

### Why the orphans existed (root cause)
Non-barrier products = ramp(1) + speed hump(1) + bollard(1) + bird spikes(3) = **6**. With the ramp as a
solo featured card, the remaining 5 is odd → a lone orphan bird card. Pairing the ramp (per Bruce) makes
6 into three complete 2-col rows with no orphan.

### Change
Merged the former separate "Modular Rubber Ramps", "Also New" (speed hump + bollard) and "Bird & Pest
Control" sections into ONE balanced section, **"New This Launch"**, subtitle "Fresh additions to the
Safety Sector range":
- **Row 1:** Modular Rubber Threshold Ramp · 50cm Bird Spikes – Parallel
- **Row 2:** 50cm Bird Spikes – Staggered · 100cm Bird Spikes – Staggered
- **Row 3:** Metal Speed Hump 500mm · Surface-Mount Fixed Bollard 89mm

- **Alignment (§6.8/§6.9):** all 6 cards use the identical standard component — image height 180px,
  `pn/pd/pp` reserved regions, `height:100%` equal-height backstop, standard 11px×24px CTA. The featured
  ramp card's extra red eyebrow was dropped so it structurally matches its row-mate; the multi-size
  message moved into its description ("Multiple sizes from 25mm to 100mm, chosen on the product page").
- **Descriptions shortened** to ~1 line each (birds/speed/bollard) for even card heights; barriers untouched.
- Featured ramp CONCEPT kept (one product, multi-size, links to `/modular-rubber-ramp/`); it leads row 1.
- Speed-hump TODO and bollard NOTE comments carried over.

### QA — pass
- 6 cards / 3 complete 2-col rows; **0 orphan** (no colspan/center-half in the grid). Row 1 = ramp + bird
  as directed.
- All cards: `pn/pd/pp` classes (10 incl. barriers), 180px image height (×6), standard CTA (×10).
- Old section headers removed (7 Heights / Bird & Pest Control / Also New = 0).
- Hero + Promo → `/products/`; untouched sections all present.
- **Every link and image re-verified HTTP 200** (no broken links/images); ghost-clean (0 table-in-a /
  empty-a / block-a / `href="#"`); tags balanced (table 26/26, tr 44/44, td 55/55, a 37/37).

Outstanding before send unchanged (bollard/speed-hump confirmations, real multi-client + Klaviyo test).
**Not yet approved to send.**

---

# Update — Draft v10 (2026-07-23) — correct speed hump SKU, bollard removed, last row centered

**Assesses:** `Draft/SS-2026-LAUNCH-Product-Launch-Draft-v10.html` (mirrored to `Output/…-Final.html`).
Only the product grid changed.

### Changes
1. **Speed hump replaced with the correct product (SKU SPEHP2535), verified on safetysector.com.au:**
   Title **Speed Hump Heavy Duty – 250mm Module** · price **$11.69** (RRP $24.95, was "Price to be
   confirmed") · image `s-498h0egvgn …/products/123/images/896/speed_hump_cc…386.513.jpg` (verified 200) ·
   canonical URL `/speed-hump-heavy-duty-250mm-module/` (tracking params stripped). Old placeholder speed
   hump (RDD image, category link, TODO) removed; SPEHP2535 TODO resolved.
2. **Bollard card removed entirely** (BSMYEL90 no longer in the email).
3. **Last row centered:** 5 products now — Row1 Ramp + Bird-Parallel · Row2 Bird-Staggered + Bird-100cm ·
   Row3 Speed Hump centered alone via `colspan="2"` + 282px `center-half` wrapper (no empty column; lone
   card is the identical standard component, not resized — §6.9).

### QA — pass
- 5 cards; bollard + old speed hump gone; new SPEHP2535 present (4 links); centered last row `colspan="2"`.
- Alignment (§6.8/§6.9): identical component — 180px image height, `pn/pd/pp` regions, `height:100%`
  backstop, standard 11px×24px CTA.
- **Every link and image HTTP 200**; ghost-clean; tags balanced (table 26/26, tr 43/43, td 53/53, a 34/34).
- Hero + Promo → `/products/`; Hero, Barriers, Promo, Trust, Footer untouched.

Outstanding before send: real multi-client + Klaviyo render test. **Not yet approved to send.**

---

# Update — Draft v11 (2026-07-23) — speed hump image swapped to official white-background shot

**Assesses:** `Draft/SS-2026-LAUNCH-Product-Launch-Draft-v11.html` (mirrored to `Output/…-Final.html`).
Only the speed hump card image changed.

### Problem
The v10 speed hump image (`…/products/123/images/896/speed_hump_cc…`) was an in-situ photo on textured
grey concrete with shadows and the product cropped at the frame edge. A clean background removal was NOT
feasible here (no ImageMagick / AI matting in this environment; cannot host a new asset on the brand CDN;
textured non-uniform background + shadows + cropped product = no reliable keying). Additionally the image
was actually **386×332 landscape** but was being displayed at 135×180 (portrait) — i.e. distorted.

### Fix (no cutout needed)
The product's own gallery on safetysector.com.au includes **official white-background studio shots**.
Swapped in the black module studio image — `…/images/stencil/500x500/products/123/888/speed_hump_black…`
(verified HTTP 200) — displayed as a clean **180×180 square**, centred, matching the other cards' image
height. No manipulation; it is a genuine official SS product image. Black variant chosen for consistency
with the email's black/white/red palette; the yellow studio shot (887) is an available alternative.

### QA — pass
- Speed hump now clean white background, centred, 180×180 (distortion fixed); old concrete image gone.
- Every link and image **HTTP 200**; ghost-clean; tags balanced (table 26/26, tr 43/43, td 53/53, a 34/34).
- Last row still one centred card; Hero/Barriers/Promo/Trust/Footer untouched.

Outstanding before send: real multi-client + Klaviyo render test. **Not yet approved to send.**

---

# Update — Draft v12 (2026-07-23) — NEW THIS LAUNCH product order rebalanced

**Assesses:** `Draft/SS-2026-LAUNCH-Product-Launch-Draft-v12.html` (mirrored to `Output/…-Final.html`).
Reorder only — no card styling or product information changed.

New order (per Bruce): the two flagship products lead row 1; bird spikes grouped beneath; final bird centered.
```
Row 1:  Modular Rubber Threshold Ramp   |   Speed Hump Heavy Duty – 250mm Module
Row 2:  50cm Bird Spikes – Parallel     |   50cm Bird Spikes – Staggered
Row 3:            100cm Bird Spikes – Staggered  (centered, colspan=2 / 282px center-half)
```
- Only which card sits in the centered wrapper changed (speed hump → 100cm bird); every card's markup,
  image, price, CTA and styling is byte-identical to v11.
- Alignment (§6.8/§6.9): 5 cards, identical component, 180px image height, `pn/pd/pp` regions, standard CTA;
  centered card same width as the others (282px), perfectly centered.
- QA: all links + images HTTP 200; ghost-clean; tags balanced (table 26/26, tr 43/43, td 53/53, a 34/34);
  Hero/Barriers/Promo/Trust/Footer untouched.

Outstanding before send: real multi-client + Klaviyo render test. **Not yet approved to send.**

---

# Update — Draft v13 (2026-07-23) — restore "Available in Multiple Sizes" + Gmail-clean pass

**Assesses:** `Draft/SS-2026-LAUNCH-Product-Launch-Draft-v13.html` (mirrored to `Output/…-Final.html`).

### 1. Restored ramp size messaging
Between the title and price on the Modular Rubber Threshold Ramp card:
- red eyebrow **AVAILABLE IN MULTIPLE SIZES** (10px uppercase, letter-spaced, `#e11b22` — approved styling)
- size list **25mm · 38mm · 50mm · 64mm · 75mm · 88mm · 100mm** (in the `pd` description slot).

### 2/3. Gmail bubble + footer-clipping fix
- File is **39KB**, far below Gmail's ~102KB clip threshold — footer clipping is not size-driven.
- **Stripped ALL descriptive/non-functional HTML comments** from the production file (kept only the
  functional MSO conditionals `[if mso]`/`[if !mso]` — verified 9/9 VML `v:roundrect` + 9/9 non-MSO CTAs
  intact). This removes the §8.2-flagged tag-like-prose comments and trims size.
- Verified: 0 literal `…`/`...`; 0 empty `<td>`/`<tr>`/anchors; 0 ghost tables; 0 nested/`display:block`
  image anchors; tags balanced (table 26/26, tr 43/43, td 53/53, a 34/34).
- Per §8.2/§8.3: with every in-source trigger removed, any "…" that still appears must be tested on a
  **fresh subject line / clean thread** — a persistent bubble there is Gmail's own quoted-content UI (from
  repeated test sends to the same thread), not a markup defect. **This still needs a real fresh-thread
  Gmail test to confirm.**

### 4. Final QA — pass (source-level)
All links + images HTTP 200; ghost-clean; tags balanced; MSO/VML intact; responsive classes intact
(`.pc`/`.center-half`/media query); untouched sections (Hero, Barriers, Promo, Trust, Footer) unchanged.
Live client rendering (Gmail fresh thread, Apple Mail, Outlook, Klaviyo import) still to be run.

### 5. CLAUDE.md
Added **§8.3 Gmail Rendering QA** (mandatory Product Launch gate, all brands) — cross-references §8.2/§8.1,
no duplication: no expansion bubbles, footer immediately visible, keep < ~102KB, strip descriptive comments,
verify before approval.

**Not yet approved to send** (pending live fresh-thread Gmail + multi-client test).

---

# Update — Draft v15 (2026-07-23) — Gmail expansion-bubble structural refactor (root-cause)

**Assesses:** `Draft/SS-2026-LAUNCH-Product-Launch-Draft-v15.html` (mirrored to `Output/…-Final.html`).
Visual appearance unchanged (tag balance identical to v14: table 26/26, tr 43/43, td 53/53, a 34/34).

### In-source cleanup (every Gmail trigger the audit found)
- **Hidden preheader simplified** to a single minimal line; removed the `&zwnj;&nbsp;` spacer run (a long
  run of hidden chars — the classic "hidden content before the hero").
- **Removed all 12 whitespace-only lines** between sibling tables + the **stray whitespace node inside the
  centered `<td>`** (left by the earlier comment strip). Zero blank lines remain.
- **Removed the unused `.spacer-col { display:none }`** hidden-spacer CSS rule.

### Full structural audit (post-cleanup) — all clean
- Empty `<td>`/`<tr>`/`<a>`/`<p>`: **0**; `<table>`-in-`<a>`: **0**; whitespace-only nodes: **0**.
- MSO ghost tables (`[if mso]><table`): **0**; VML leftovers outside `[if mso]`: **0**; orphan/duplicated
  wrapper tables: none; malformed nesting: none (all tag pairs balanced).
- Hidden elements: only the standard **minimal display:none preheader** (required for inbox preview).
- Size **~39KB** — far below Gmail's ~102KB clip threshold (footer is not size-clipped).
- Descriptive comments: **0** (only functional MSO conditionals remain). All links + images HTTP 200.

### Root-cause conclusion (honest)
Every in-source structural trigger for Gmail's "…" is now removed. The reported pattern — "…" bubbles at
**multiple** section boundaries (before hero, before grid, between sections, before footer) — is the
signature of **Gmail's quoted-content collapsing**: when successive versions (v11→v14) are sent to the
**same subject/thread**, Gmail trims the portions of each new send that duplicate the previous one and
shows a "…" at each repeated section. This is Gmail's UI, not a markup defect (§8.2/§8.3), and cannot be
removed from the HTML.

**Required confirmation (cannot be run from this environment):** send the v15 build to a **FRESH subject
line / new thread (or a different recipient)** and view in Gmail Web + app. On a clean thread the "…"
bubbles should not appear. A browser/desktop preview cannot verify this. **Not approved to send** until
this live fresh-thread Gmail test (plus Apple Mail / Outlook / Klaviyo import) is recorded here.

### CLAUDE.md
§8.3 broadened from "Product Launch" to a **mandatory Gmail Rendering QA for every campaign of every type,
all brands**, with the full checklist (no bubbles / no hidden content / no collapsed sections / no empty
spacer structures / no unnecessary wrapper tables / footer visible / full Gmail compat) and the
fresh-thread diagnosis protocol.

---

# Update — Draft v16 (2026-07-23) — Gmail-mobile white edge-gutter fix (wrapper refactor)

**Assesses:** `Draft/SS-2026-LAUNCH-Product-Launch-Draft-v16.html` (mirrored to `Output/…-Final.html`).
Structural wrapper refactor; visible design unchanged (desktop 600px centered as before).

### Root cause of the Gmail-mobile white side strips
Page background (`#f0f0f0`) was set only on `<body>`/`<center>`, and the container was a fixed `width="600"`.
Gmail mobile rewrites `<body>` and drops body/center backgrounds, so the area beside the 600px container
fell back to Gmail's **default white** → thin white gutters (desktop honours body bg, so it looked fine).
Fixed-width container worsens it when Gmail strips the media query (non-Google accounts).

### Fix (mobile-safe wrapper architecture)
- Replaced `<center bg>` with a **full-width wrapper `<table bgcolor="#f0f0f0">`** (bgcolor attr + inline) —
  Gmail honours table bgcolor even when it drops body/center bg.
- Container is now **fluid**: `width="100%"` + `style="width:100%; max-width:600px"`, `align="center"` +
  `margin:0 auto`, `bgcolor="#ffffff"` — full-width/flush on mobile without needing the media query; 600px
  centered on desktop.
- **MSO ghost table** (`[if mso]><table width="600">`) locks 600px for Outlook.

### QA — pass
Tag balance 28/28 tables (wrapper + mso-ghost added), tr 45/45, td 55/55, a 34/34; 0 empty td/tr; 0
table-in-anchor; all links + images HTTP 200; outer `<center>` removed (VML button `<center>`s remain).

### CLAUDE.md
Added **§6.16 Gmail Mobile Rendering Fixes** — permanent mobile-safe wrapper standard for all templates/
brands (root cause, the wrapper shell, background/width/Outlook/table-structure best practices, things to
avoid, client-compat checklist).

### Still to verify live (cannot run here)
Confirm **no white gutters, flush edge-to-edge** in Gmail Android + Gmail iOS + Apple Mail + Outlook +
Klaviyo Preview. **Not approved to send** until that live check (and the fresh-thread Gmail bubble check)
is recorded.

---

# Update — Draft v17 (2026-07-23) — Gmail-mobile background bleed fix (bgcolor attributes)

**Assesses:** `Draft/SS-2026-LAUNCH-Product-Launch-Draft-v17.html` (mirrored to `Output/…-Final.html`).
**Mobile-only rendering fix — desktop is byte-identical** (tag balance unchanged 28/28, only additive
`bgcolor` attributes matching existing inline colours).

### Root cause of the remaining mobile issues (white strips in grey sections + white seams)
The section tables/cells declared colour with **CSS `background:` only, no `bgcolor` attribute**. Gmail's
mobile apps frequently **drop CSS `background` on `<table>`/`<td>`** but honour the HTML `bgcolor`
attribute — so grey `#ededed` sections didn't fully paint and the white container showed through as
right-edge strips and seams between sections. (The v16 full-width grey wrapper already handled the
body-level gutters; this handles the per-section fills.)

### Fix
Added `bgcolor="#…"` (matching the existing inline `background`) to **all 19** colour-bearing tables
(10 sections + 9 cards): 5×`#ededed`, 14×`#ffffff`, plus the `#f0f0f0` wrapper and `#f7f7f7` footer.
Because each `bgcolor` equals the existing CSS colour, **desktop rendering does not change at all**.
Product-card mobile stacking (equal width/padding, centered lone card) is handled by the existing
media query, unchanged.

### QA — pass
Desktop-identical (tag balance 28/28, tr 45/45, td 55/55, a 34/34); 0 empty `<td>`; 0 table-in-anchor;
all links + images HTTP 200; no horizontal-overflow structures (fluid container + `max-width:100%` images).

### Note on "continuous grey" (Issue 3)
The **Contact ("Got a question?") section is intentionally WHITE** in the current desktop baseline
(trust `#ededed` → contact `#ffffff` → footer `#f7f7f7`). The bgcolor fix removes the mobile white
*seams/bleed* so each section paints solidly, but the contact block stays white to keep desktop identical.
Making trust+contact+footer a single continuous grey block would change the **desktop** design too —
flagged for approval, not done unilaterally.

### CLAUDE.md
§6.16 augmented: **set BOTH `bgcolor` + inline background on every coloured table AND section cell** (root
cause of grey-section white strips/seams on Gmail mobile), plus the mobile card-stacking rule — noted as
mobile-only, never altering desktop.

### Still to verify live (cannot run here)
Gmail Android · Gmail iPhone · Apple Mail mobile · Samsung Mail → grey fills fully, no white strips/seams,
cards aligned, no horizontal scroll. Desktop (Gmail Web, Outlook, Apple Mail, Klaviyo) must stay identical.
**Not approved to send** until this live mobile check is recorded.

---

# Update — Draft v18 (2026-07-23) — grey fill completed at CELL level (root-cause, not a patch)

**Assesses:** `Draft/SS-2026-LAUNCH-Product-Launch-Draft-v18.html` (mirrored to `Output/…-Final.html`).
**Desktop byte-identical** (tag balance unchanged 28/28, 45/45, 55/55, 34/34; only additive `bgcolor`
attributes equal to existing inline colours).

### Root cause (why v16/v17 weren't enough)
v16 added a full-width grey wrapper; v17 added `bgcolor` to section **tables**. But Gmail mobile paints the
**cell** background — a grey `<table bgcolor>` whose content lives in a **transparent `<td>`** still left the
right edge unpainted (white strip) and white seams between sections. Table-level bgcolor alone doesn't hold
on Gmail mobile.

### Fix
Added `bgcolor="#ededed"` to the **6 grey section content `<td>`s** (Expandable-Barriers header + products,
New-This-Launch header + products, trust header + body) so grey is painted at the cell level, edge to edge,
continuously. Each equals the existing inline `background`, so desktop is unchanged. Product-card mobile
stacking (equal width/padding, centred) remains handled by the existing media query.

### QA — pass
Desktop-identical; 0 empty `<td>`; 0 table-in-anchor; all links + images HTTP 200; no horizontal-overflow
structures. CLAUDE.md §6.16 updated with the table+cell bgcolor root cause and a full mobile/desktop QA
checklist (Gmail Android/iPhone, Apple Mail Mobile, Samsung, Outlook Mobile + desktop set).

### Open decision — the Contact section colour (needs your call; conflict with "don't change desktop")
Issue 3 lists the **Contact ("Got a question?") section** as part of the continuous grey block, but it is
**white `#ffffff` in the approved desktop baseline** (trust `#ededed` → contact `#ffffff` → footer `#f7f7f7`).
Making it grey would change the **desktop** too, which contradicts "desktop must stay pixel-perfect." Left
white pending a decision: (a) keep white (desktop unchanged), (b) grey on mobile only via media query, or
(c) grey on both desktop + mobile.

### Escalation path if grey bleed STILL shows on a real device after v18
The remaining lower-probability cause would be media-query-dependent card stacking failing on a specific
Gmail config; the proven fix is a **hybrid/"spongy" grid rebuild** (inline-block + ghost tables, no reliance
on media queries). That is a larger refactor with desktop-regression risk and **must be verified on a real
device**, so it should only be done with sign-off — not applied blind. **Cannot be render-tested from this
environment.** Not approved to send until a live mobile device check is recorded.

---

# Update — Draft v19 (2026-07-23) — full architecture audit + uniform cell-level backgrounds

**Assesses:** `Draft/SS-2026-LAUNCH-Product-Launch-Draft-v19.html` (mirrored to `Output/…-Final.html`).
Desktop byte-identical (tag balance 28/28, 45/45, 55/55, 34/34; only additive `bgcolor` attributes).

### Phase 1 — Root cause (audited, not guessed)
Desktop clients (Gmail Web, Outlook, Apple Mail desktop, Klaviyo) honour CSS `background` on tables → always
looked correct. **Gmail's mobile apps (Android/iOS) drop CSS `background` on `<table>`/`<td>` and paint the
CELL's `bgcolor` attribute.** Earlier versions coloured sections with CSS `background` only (≤v16) or with
`bgcolor` on the section `<table>` only (v17) — but the section's content lived in a **transparent `<td>`**,
so Gmail mobile left that cell (and its right edge) unpainted → white vertical strip on the right + white
seams between sections. Card "misalignment" was the same white bleed showing between/under the stacked cards.

### Phase 2 — Architecture review
The v16–v18 shell is sound and standards-compliant: full-width `bgcolor` wrapper → centred `<td>` → MSO ghost
(Outlook 600px lock) → fluid `width:100%; max-width:600px` container → sections. No element exceeds 100% width
(no overflow). The ONLY gap was incomplete background painting at the **cell** level.

### Phase 3 — Decision: OPTION A (architecture sound; minimum change), not a rebuild
No structural refactor/redesign needed. Completed the painting model: **`bgcolor` on BOTH the `<table>` and
its content `<td>` for every section** — grey cells done in v18, white + footer cells done here in v19. All
11 section content cells now carry `bgcolor` (4×#ffffff, 6×#ededed, 1×#f7f7f7). A hybrid/"spongy" grid rebuild
was considered and rejected: the audit shows even without media queries the grid is 2-col at 50/50 (aligned)
on a cell-painted grey background, so a rebuild would add desktop-regression risk for no benefit.

### Validation
Desktop: identical (additive attributes only; tag balance unchanged). Source checks: all links + images
HTTP 200; 0 empty `<td>`/`<tr>`; 0 table-in-anchor; no >100% widths. **Live device rendering (Gmail
Android/iPhone, Apple Mail, Samsung, Outlook mobile) cannot be executed from this environment** and must be
verified on v19 specifically (earlier versions lacked the cell-level fix). Not approved to send until that
device check is recorded.

---

# Update — Draft v20 (2026-07-23) — zero-transparent-cell verification pass

**Assesses:** `Draft/SS-2026-LAUNCH-Product-Launch-Draft-v20.html` (mirrored to `Output/…-Final.html`).
Desktop byte-identical (tag balance 28/28, 45/45, 55/55, 34/34; additive `bgcolor` only).

Verified and eliminated EVERY transparent cell in the render path so Gmail mobile (which paints cell
backgrounds) has an explicit colour at every level:
- **All 55 `<td>` now carry `bgcolor`** (was 11): 36×#ededed / 42×#ffffff / 2×#f0f0f0 / 2×#f7f7f7 across
  td+table. Painted the nested grey cells (`.pc` gutters, grid tables, rule line/title cells, colspan +
  center-half wrappers, trust inner table + trust-col cells) grey; card inner cells (badge/image/text) and
  container/section cells white; wrapper cell #f0f0f0; footer cell #f7f7f7.
- **Checks:** 0 cells with double bgcolor · 0 `.pc`/`trust-col`/`colspan` cells mis-coloured white ·
  0 card cells mis-coloured grey · every parent/child bgcolor matches its zone · all links+images HTTP 200.
- **Only uncoloured table:** the Outlook-only **MSO ghost table** inside an `[if mso]` comment (correct —
  Outlook paints from the section/container bgcolor; the ghost is a width-lock, not a painted surface).

Still requires the live device check (Gmail Android/iPhone, Apple Mail, Samsung, Outlook mobile) — cannot
run here. Not approved to send until recorded.

---

# Update — Draft v21 (2026-07-23) — desktop product-card alignment (CTA/price on one line)

**Assesses:** `Draft/SS-2026-LAUNCH-Product-Launch-Draft-v21.html` (mirrored to `Output/…-Final.html`).
**Gmail-mobile work (wrapper/bgcolor/responsive) untouched; mobile byte-unchanged** (the new reserve is
hidden on mobile via `.pl-empty{display:none}`, and cards stack there so cross-card alignment is moot).

### Root cause (desktop)
Within the "New This Launch" row, only the **Modular Rubber Threshold Ramp** card had the
"AVAILABLE IN MULTIPLE SIZES" label; its row-mate (speed hump) and the bird cards did not. That extra line
made the ramp taller, pushing its price + CTA below the others → misaligned CTA line and uneven bottoms.
Title/description/price regions were already reserved (`.pn`/`.pd`/`.pp`), but the **promo-label region was
reserved on one card only.**

### Fix
Reserved the promo-label region on **every** card in that section: the 4 non-ramp cards now carry a
matching label placeholder (`<p class="pl-empty">` with the ramp eyebrow's exact font metrics, `&nbsp;`
content — **real reserved space, not a min-height hack, so it holds in Outlook too**). Hidden on mobile
via `.pl-empty{display:none!important}` so the mobile layout is unchanged. All NTL titles normalised to the
same 4px bottom margin. Result: identical region stack on every card → prices and CTA buttons land on the
same horizontal line, bottoms level. (Barriers row was already uniform — no label there — so untouched.)

### Validation
Tag balance unchanged (table 28/28, tr 45/45, td 55/55, a 34/34; p 47/47 — +4 balanced); desktop layout
otherwise identical; all links + images HTTP 200. Aligns in min-height-honouring clients (Gmail Web, Apple
Mail, Klaviyo) and, via the real-content label reserve + equal-length copy, in Outlook.

### Note / escalation
Titles and descriptions are reserved via `.pn`/`.pd` **min-height** (2 lines). Outlook ignores min-height,
so if a future title/description differs in line count between row-mates it could drift in Outlook only.
The ultimate all-client guarantee is the §6.8 **fixed-height table-CELL** card component (as in the W30
reference); the current cards use min-height (the §6.8 fallback) plus this real-content label reserve.
Offered as a follow-up if Outlook shows residual drift on a device test. **Not approved to send** until the
device/client check is recorded.

---

# Update — v21 width audit + DEBUG build (2026-07-23) — isolating the Gmail-mobile white gutter

**No production change.** Output remains v21. Diagnostic only.

### Width audit of the grey render path (v21) — source is clean
Enumerated every width in the file: **27× `width="100%"`**; the only fixed widths are images (130 logo /
135 / 180 / 190), the centered card (282), and the Outlook-only ghost (600). Every grey section table, its
content cell, the grid table, the `.pc` cells and the trust cells are `width:100%` **and** carry
`bgcolor="#ededed"`. **There is no table or TD in the source narrower than its parent** — so nothing in this
HTML can expose a strip on the right of a grey section. (This is why repeated source-level bgcolor passes
haven't moved it: the source was already correct.)

### DEBUG build for on-device isolation → `Draft/SS-2026-LAUNCH-Product-Launch-DEBUG.html`
Per-level colours so the strip's colour on a real Gmail-mobile device names the exact culprit:
- **RED `#ff2d2d`** = outer WRAPPER (body + full-width wrapper table/cell)
- **BLUE `#2d6bff`** = CONTAINER (`.email-container` + its content cell)
- **GREEN `#22cc22`** = every GREY section (table + all cells)
- **WHITE `#ffffff`** = white sections + cards (unchanged)

Interpretation of the right-edge strip beside a GREEN section:
- **BLUE strip** → container is wider than the section (section not full-width) — a source bug (not found in audit).
- **RED strip** → container is narrower than the wrapper (container not full-width).
- **GREEN everywhere, no strip** → source renders correctly; any residual strip is **external**.
- **WHITE / uncoloured strip** → NOT wrapper/container/section → it is **outside this HTML**: Klaviyo's own
  wrapper table added on import, or Gmail's app scaling/right-margin chrome. In that case the fix is in the
  Klaviyo template settings (content width / padding), not this file — send me the Klaviyo-exported source.

Tag balance identical to v21 (28/28, 45/45, 55/55). Predicted result given the audit: **white/uncoloured
strip → external cause.** Awaiting the on-device colour to confirm.

---

# Update — Draft v22 (2026-07-23) — Gmail-mobile-app right-inset fix (min-width:100%)

**Assesses:** `Draft/…-v22.html` → `Output/…-Final.html`. Desktop byte-identical (tag balance unchanged).

**Diagnosis (Gmail-app behaviour, not HTML):** desktop correct + Gmail-mobile-app-only white strip =
Gmail app's auto-fit/"shrink-to-fit" pass under-fitting the message by a device pixel or two and exposing
its own (white) window background on the right. Gmail app doesn't honour `max-width` like desktop webmail;
the width audit already proved every grey element is `width:100%`, so the source isn't the cause.

**Documented Gmail-safe workaround applied (Litmus/EOA):** force the full-width layers to never fit short —
`min-width:100%` on `<body>` (inline + `<style>`), `html/body { background:#f0f0f0 }`, and `min-width:100%`
on the outer wrapper table. All are `width:100%` already, so desktop is unchanged; on mobile they can't
render under 100%, removing the inset. Links/images still 200.

**If it persists:** view the DEBUG build on-device — the strip's colour is definitive: WHITE/uncoloured =
Gmail-app chrome or Klaviyo wrapper (no HTML fix; adjust Klaviyo content-width/padding); RED/BLUE = wrapper/
container level. **Not approved to send** until the on-device check is recorded.

---

# Update — Draft v23 (2026-07-23) — reusable fixed-height-CELL product card system (§6.8)

**Assesses:** `Draft/…-v23.html` → `Output/…-Final.html`.

**Root cause of the drift:** cards reserved space with `min-height` on `<p>` (Gmail/Apple honour it, **Outlook
ignores it**), and the promo label was reserved on one card only → titles/prices/CTAs landed at different Y
between row-mates.

**Permanent fix (the reusable system):** rebuilt all 9 cards so **every region is its own fixed-height table
CELL** — the one sizing primitive Outlook honours (`<td height="N" style="height:Npx">`):
image → title(40) → label(16, NTL) → description(34) → price(30, valign bottom) → CTA. Because the cell
heights are structural (not content-driven), title/label/description/price/CTA begin at the **same Y on every
card in a row**, so prices align, CTA buttons align, and bottom edges are level — in Gmail Web/Android/iPhone,
Apple Mail, Outlook and Klaviyo alike. Each region keeps its own anchor (sibling anchors to the product URL,
§6.6). Mobile: `.c-badge/.c-img/.c-title/.c-label/.c-desc/.c-price { height:auto }` resets so stacked cards
size naturally; `.pl-empty` hides the reserved-empty label on mobile. All cell `bgcolor` (the Gmail-mobile
fill) preserved.

**Reusable:** drop-in card component — every future product reserves the same regions; short content keeps the
reserved height so the CTA never moves. Label row is optional (filled = promo label, empty = reserved).

**QA:** tag balance 28/28, tr 77/77, td 87/87, a 53/53; all 87 cells carry `bgcolor`; 0 empty/`display:block`
anchors; 0 `href="#"`; all links + images HTTP 200; reserved heights consistent (title40/label16/desc34/price30 ×N).

**Note:** heights reserve **2 lines** for title/description (fits current copy). A future 3-line title/desc
would grow that cell (Outlook treats `height` as a minimum) — bump the reserve if copy runs longer. Live
render check (esp. Outlook + Gmail mobile) still recommended. **Not approved to send** until that is recorded.
