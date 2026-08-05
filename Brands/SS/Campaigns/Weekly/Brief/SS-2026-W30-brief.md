# Weekly Campaign Brief — Safety Sector (SS) 2026-W30

> Stage 1 of the pipeline (WK-P1 / CR-05). Values follow the source-of-truth hierarchy (CLAUDE.md §2):
> BRD → approved brand sources → `03-Brands/SS.md` → this Brief. Anything unknown stays **To be confirmed** —
> nothing invented (CLAUDE.md §5). Reference screenshots in `../References/` are visual direction only.
> Built per the Weekly continuous-improvement loop (CLAUDE.md §5.1.1): analysed the last approved send
> (`Output/SS-2026-W29.html`) and deliberately improved + refreshed it.

> **v10 UPDATE (2026-07-22, current build = `Draft/SS-2026-W30-draft-v10.html`; mirrored to
> `Output/SS-2026-W30.html`):** FINAL approved **hero banner swap** — replaced the hero image with
> `…/v1784696022/Safety_Sector_hero_banner_202607221252_z77ux7.jpg` (same 1376×768 16:9 geometry, so
> `width="600" height="335"` unchanged; no stretch/crop; same optimised retina delivery). Destination
> `…/cable-protector/`, clickability, responsive setup all unchanged. **Diff vs v9 = the hero src line only**;
> every other section byte-identical. 45 URLs, 0 non-200. See Review notes v10.
>
> **v9 UPDATE (2026-07-22, build = `Draft/SS-2026-W30-draft-v9.html`; mirrored to
> `Output/SS-2026-W30.html`):** placement experiment — **moved Featured Categories** from below the hero to
> **below the Promo Code, before the trust section**, and reduced it to **image-only tiles** (removed heading,
> subtitle and the per-image category labels; images carry their own text). Kept the 2×2 grid, white cards,
> rounded corners, spacing, responsiveness, full image clickability, and the four verified-live links. Order now:
> Hero → 3 product groups → Promo → Featured Categories → Trust → Contact → Footer. No protected section changed;
> 45 URLs, 0 non-200. Awaiting user review of the new hierarchy. See Review notes v9.
>
> **v8 UPDATE (2026-07-22, build = `Draft/SS-2026-W30-draft-v8.html`; mirrored to
> `Output/SS-2026-W30.html`):** inserted the **Featured Categories** section (2×2 image-led tiles) directly below
> the hero, before "Cover the cables", using the §6.8 fixed-height component + §6.9 balance. Four tiles (image
> focus, no price/description/CTA, whole tile clickable) → verified-live category pages: Expandable Barriers
> `/expandable-barriers/`, Speed Hump `/speed-humps/`, Rubber Wheel Chocks `/rubber-wheel-chock/`, Crowd Control
> Barriers `/crowd-control-barriers/` (all 200). All other sections byte-identical to v7 (no regression). 45 URLs,
> 0 non-200. Confirm the Rubber Wheel Chocks image (filename suggests an expandable barrier). See Review notes v8.
>
> **v7 UPDATE (2026-07-22, build = `Draft/SS-2026-W30-draft-v7.html`; mirrored to
> `Output/SS-2026-W30.html`):** matched the CampaignSS1/SS2 reference — light-grey page background (`#f0f0f0`)
> with the whole email as a centered **white content card** floating on the grey (outer grey wrapper table +
> padded cell). **Wrapper-only change**: hero, product grid, coupon, trust, footer are byte-identical to v6 (grid
> alignment untouched, no regression). **Category Featured deferred** (PART 2) — a comment placeholder marks the
> recommended spot (directly below the hero) but nothing was implemented pending layout review. Same verified
> 37-URL set. See Review notes v7.
>
> **v6 UPDATE (2026-07-22, build = `Draft/SS-2026-W30-draft-v6.html`; mirrored to
> `Output/SS-2026-W30.html`):** product card **rebuilt from scratch as one reusable fixed-height component** (per
> user) — every region is its own fixed-height `<td>`: image area 196 · title 42 · description 38 · price 30 (its
> top padding is the fixed spacer). Card height is set by structure, not content, so images/titles/descriptions/
> prices all sit at identical positions and each section ends at the same height, in every client incl. Outlook.
> No flex/grid, no empty spacer cell (§8.2). Descriptions not shortened further. Hero/coupon/trust/footer unchanged;
> same verified 37-URL set. See Review notes v6.
>
> **v5 UPDATE (2026-07-22, build = `Draft/SS-2026-W30-draft-v5.html`):** fixed-height name/description cells.
> Superseded by v6.
>
> **v4 UPDATE (2026-07-22, build = `Draft/SS-2026-W30-draft-v4.html`):** product-grid alignment hardened
> (2-row card: content row + bottom-pinned price). Superseded by v5.
>
> **v3 UPDATE (2026-07-22, build = `Draft/SS-2026-W30-draft-v3.html`):** per user instruction — (1) **hero replaced** with a single embedded banner
> artwork (Cloudinary `…uh7tsl.jpg`, delivered as an email-optimised same-asset derivative), one clickable
> anchor, edge-to-edge, kept the existing `…/cable-protector/` destination; (2) **product grid normalised** to
> equal-height cards with descriptions shortened to one concise line; (3) **coupon copy** — removed "Apply at
> checkout on your floor-safety order" and changed validity **28 → 29 July 2026**. SAFESTEP still to be
> created/confirmed ACTIVE in BigCommerce before send; §8.1 client-render gate still open. See Review notes v3.
>
> **v2 UPDATE (2026-07-20, current build = `Draft/SS-2026-W30-draft-v2.html`):** per user instruction —
> (1) **all Anti-Slip Stair Nosing products removed** (now permanent rule CLAUDE.md §6.12); (2) grid rebuilt
> to **16 products** across 3 floor-safety groups (Cover the cables 6 · Guide the way underfoot 4 · See every
> blind corner 6); (3) **top navigation removed** (opt-in per §6.11); (4) **new themed promo code SAFESTEP**,
> valid until 28 July 2026, one-time use (must be created + active in BigCommerce before send). The Featured
> Products / offer sections below describe v1 and are superseded by the **Asset Manifest** and **Review notes**
> for the current 16-product list.

## Campaign meta
- **Brand / code:** Safety Sector / SS
- **Cadence:** Weekly
- **ISO week / send date:** 2026-W30 / target **Tue 2026-07-21** *(placeholder — confirm against Content Calendar)*
- **Subject line (WK-S1):** Slips, trips & falls — fix the hazard underfoot
- **Preheader (WK-S2):** Anti-slip stair nosings, tactile plates and cable protectors. Trip-free floors, shipped Australia-wide.
- **Approval status:** **NOT approved to send.** Draft in `Draft/` awaiting user review (CLAUDE.md §5.1.1 / §9).

## What last week was (baseline) & how W30 improves on it
- **W29 (approved):** "Set Up a Safer Site" — new-financial-year, **vehicle & traffic-control** theme
  (bollards, barriers, wheel chocks, dock bumpers, kerb ramp, mirror, signage). Flat 14-card grid; light-grey
  hero photo panel; SITE15 coupon (unverified).
- **W30 (this send) — fresh concept:** pivots from *vehicles* to **people on foot**: a **slips, trips & falls /
  underfoot-safety** theme. Improvements over W29:
  1. **New theme + new story** (pedestrian hazard prevention, not traffic control) — a genuinely new angle.
  2. **New hero** — bold **dark (near-black) hero panel** with red accent (vs W29's light-grey framed photo).
  3. **Curated & grouped products** — two themed blocks ("Sure footing" + "Clear the trip hazards") instead of
     one flat 14-card list, so the grid tells a story and improves discovery/cross-sell.
  4. **Premium header nav** with per-item red underlines (CLAUDE.md §6.10) for category discovery (W29 had
     logo only).
  5. **Real, verified value** — genuine RRP markdowns shown as strikethrough on 4 products (up to ~55% off),
     replacing W29's unverified SITE15 coupon (honest, no placeholder code, no blocker).
- **Product overlap with W29:** only **Convex Mirror Large** is carried over (it fits the pedestrian
  blind-corner story); the other 9 are new to the Weekly grid. All W29 traffic-control SKUs dropped.

## Objective
- **Purpose:** Drive click-through to anti-slip / tactile / cable-protection product & category pages by framing
  them around the everyday slips-trips-falls hazard; convert on genuine RRP savings.
- **Primary metric:** CTR to product/category pages → orders.

## Audience
- Builders, facility & site operators, property/strata managers, government & bulk buyers (SS.md). Specific SS
  segment **To be confirmed**.

## Key message (WK-S4 hero)
- **Eyebrow:** THIS WEEK AT SAFETY SECTOR
- **Headline:** Every Step, Made Safe.
- **Body:** Wet floors, loose cables and worn steps are behind slips, trips and falls every day. This week we've
  pulled together the gear that keeps every step and every walkway safe underfoot.
- **Hero CTA:** Shop safety underfoot → `/anti-slip-stair-nosing/`

## Featured products (WK-S6) — 10, verified in-stock on their own product pages 2026-07-20
Product source: SS live website / BigCommerce storefront (store `s-498h0egvgn`). SS BigCommerce API is **not
connected** this session, so each product was verified **on its individual product page** (stock, price, image)
per CLAUDE.md §5.1 — not on category listings. (This caught **Stainless Steel Tactile Plate 300x300mm** showing
"in stock" on the category page but **Out of Stock** on its product page — dropped and replaced.)

**Block 1 — "Sure footing on stairs & floors" (6):**
| # | Product | Price (AUD inc GST) | RRP | Product URL |
|---|---------|------|-----|-------------|
| 1 | Anti Slip Stair Nosing Carborundum Insert 10mm | $31.50 | — | /anti-slip-stair-nosing/ |
| 2 | Anti Slip Stair Nosing Rubber Insert 10mm | $33.55 | — | /anti-slip-stair-nosing-rubber-insert-10mm/ |
| 3 | Anti Slip Stair Nosing Poly Insert 10mm | $20.90 | — | /Anti-Slip-Stair-Nosing-Poly-Insert-10mm/ |
| 4 | Anti Slip Stair Nosing Tape Insert 10mm Yellow | $18.90 | — | /anti-slip-stair-nosing-tape-insert-10mm-yellow/ |
| 5 | Stainless Steel Tactile Plate 300x600mm | $136.50 | — | /stainless-steel-tactile-plate-300x600mm/ |
| 6 | Stainless Steel Tactile Plate Carborundum 300x300mm | $76.50 | $120.00 | /stainless-steel-tactile-plate-carborundum-300x300mm/ |

**Block 2 — "Clear the trip hazards" (4):**
| # | Product | Price (AUD inc GST) | RRP | Product URL |
|---|---------|------|-----|-------------|
| 7 | Cable Protector 2 Channel | $33.21 | $120.00 | /cable-protector-2-channel/ |
| 8 | Cable Protector 5 Channel | $60.00 | $135.00 | /cable-protector-5-channel/ |
| 9 | Cable Ramp Protector | $25.00 | $33.50 | /cable-ramp-protector/ |
| 10 | Convex Mirror Wall Attachment Large | $14.25 | — | /convex-mirror-wall-attachment-large/ |

> RRP figures shown only where confirmed on the product page. No sale price invented.

## Offer / incentive
- **No coupon code this send.** Instead the value hook is the **genuine, verified RRP markdowns** above
  (e.g. Cable Protector 5 Channel $60.00 from RRP $135.00 = ~55% off). A red "value" strip highlights these.
- If SS supplies a **confirmed, active** BigCommerce coupon, it can be added (CLAUDE.md §6.3–§6.5); until then,
  **no placeholder code is shown** (avoids inventing a code / creating a send blocker).

## Secondary content (WK-S7)
- **Header nav (per-item red underline, §6.10; links verified live):** Stair Nosing (/anti-slip-stair-nosing/) ·
  Tactile Indicators (/tactile-indicator/) · Cable Protection (/cable-protector/) · All Safety (/safety-sector/).
- **Value strip (real markdowns):** "Trip hazards, marked down — up to 55% off RRP on cable protection." →
  CTA `/cable-protector/`.
- **Trust strip (2×2, SS in-market claims):** Australia-wide shipping · Australian owned · Fast & simple returns ·
  Expert customer service.
- **Contact:** 02 9790 2182 · sales@safetysector.com.au *(phone observed in SS reference footer; SS.md lists
  phone "To be confirmed" — confirm against an official source).*

## Assets
- **Header logo (SS.md [Confirmed]):** `.../company/T7SuPP/images/f4045d61-0ee2-41a3-8fbf-6281da7b3891.gif` (verified 200).
- **Product images:** live BigCommerce CDN `s-498h0egvgn`, 500×500 stencil (all 10 verified HTTP 200 image/jpeg 2026-07-20 — see Assets manifest).
- **Trust icons:** asset-free unicode glyphs (no confirmed hosted SS trust-icon URLs).
- **Hero:** typographic (no photo) — **no approved on-theme SS hero photo exists** (`Brands/SS/Assets/*` hold no
  images). Optional: supply an underfoot/stairs lifestyle photo, or approve AI generation
  (`07-Prompt Library/Hero-Banner-Generator.md`) for a future rev.

## Missing / to confirm
- [ ] Optional confirmed+active SS coupon code (none used this send).
- [ ] Phone number against an official source (SS.md: To be confirmed).
- [ ] Live stock re-check at send time for all 10 products.
- [ ] §8.1 client render + post-Klaviyo clickability verification (cannot be exercised in this environment).
