# RDD Weekly Campaign Brief — 2026-W32

- **Brand:** Retail Display Direct (RDD)
- **Campaign type:** Weekly (product-led range coverage) — routed via `07-Prompt Library/00-START-HERE.md`
- **Send id:** RDD-2026-W32
- **Created:** 2026-08-03
- **Author:** Claude Code (production)
- **Approval status:** ⛔ **Not approved to send** — build available in `Output/` for preview only (CLAUDE.md §4.1 / §9). Requires human review + §8.1 send-gate before send.

## 1. Objective

Promote the **Acrylic Display range** (sign holders, brochure holders, wall holders, donation/suggestion box, business-card holder) as a curated "Display Information with Confidence" edit. Position acrylic as the crystal-clear, professional way to present information across retail, offices, healthcare and education. Read like a world-class B2B creative-agency campaign, consistent with prior RDD Weekly sends (W29–W31).

Implements the user-provided design reference `References/ToBeImplementedDesign.png` — built as a **cleaner, more premium** version of that layout (Apple / Really Good Emails quality target), not a pixel copy.

## 2. Continuous-improvement baseline (CLAUDE.md §5.1.1)

- **Baseline = latest approved send `Output/RDD-2026-W31.html`** (Meeting Room Solutions — mobile TV/AV + collaboration surfaces + desk setup, 14 products, stone field). Fidelity mode **INSPIRATION** (never TARGET — §4.2 / §5.1.1).
- **How W32 improves & stays fresh (§5.2):** genuinely new theme (acrylic information displays vs. meeting-room AV), new hero, new product edit (6 acrylic SKUs, none reused from W31), new section narrative ("Why Choose Acrylic" benefits → best-sellers → "Where Acrylic Makes an Impact" environment tiles). Curated 6-product edit for a focused theme.
- **New section this send:** environment/use-case **image tiles with photographic backgrounds + gradient title overlay** (Retail / Offices / Healthcare / Education) — a new premium component vs. W31's emoji use-case tiles.

## 3. Hero (locked by request — use exactly as provided)

- **Artwork (single embedded banner, §6.15 pattern / RDD baked-hero convention):** `https://res.cloudinary.com/atitvoxa/image/upload/v1785728997/Edit_product_display_area_202608031147_eakerf.jpg` — verified **1376×768, HTTP 200 image/jpeg**, 702 KB raw.
  - Delivery-optimised (composition unchanged, §8): `.../upload/w_1200,q_auto:good,f_jpg/v1785728997/Edit_product_display_area_202608031147_eakerf.jpg` (~119 KB per Cloudinary `fl_getinfo`).
  - Displayed **600×335** (16:9). Baked-in content (eyebrow / headline "Display Information with Confidence." / intro / SHOP ACRYLIC DISPLAYS CTA / feature icons). **Do NOT re-add any of this as HTML/overlay** (§6.15). **No HTML trust icons inside/under the hero** (per request).
- **Full-width, edge-to-edge, fully clickable** (whole banner in one inline anchor, §6.6/§6.14).
- **Hero destination:** `https://www.retaildisplaydirect.com.au/acrylic-display/` — the all-acrylic category (hero introduces the whole acrylic range → category page, not a single product).

## 4. Verified products (RDD BigCommerce store hash `s-ugqmr0qfvf`; each verified on its OWN product page, §5.1)

All rows verified 2026-08-03 via the live product page (not a category listing): `Availability: In Stock`, Add-to-Cart present, price = displayed GST-inclusive price, product page **HTTP 200**, primary BigCommerce stencil image present. Images served at `stencil/500x500` for email weight.

| # | Display name | Price (AUD, GST inc) | Product URL (200) | Image (products/…) |
|---|--------------|----------------------|-------------------|--------------------|
| 1 | A4 Acrylic Sign Holder | $6.25 | /a4-acrylic-sign-holder/ | 848/2533/47801A___20822.1710652359.jpg |
| 2 | A5 Acrylic Sign Holder | $3.70 | /a5-acrylic-sign-holder/ | 849/2530/47901A__99920.1710795981.jpg |
| 3 | A5 Acrylic Brochure Holder One Tier | $4.91 | /a5-brochure-holders-table-top/ | 899/2509/IMG_1145_clipped_rev_1__38731.1710422588.jpg |
| 4 | A4 Wall Brochure Holder | $9.01 | /a4-wall-brochure-holder/ | 1161/2589/39510A__29167.1710475789.jpg |
| 5 | Business Card Holder | $1.53 | /business-card-holder-counter/ | 884/2646/70101__62770.1710470352.jpg |
| 6 | Charity Donation Box A6 | $12.64 | /charity-donation-box-a6/ | 925/5623/596901A__77564__92118.1766627627.jpg |

- Price label shown as **"FROM $X.XX"** (acrylic SKUs carry size/qty variants; the verified price is the base/displayed price → "FROM" is accurate and matches the reference). Not invented (§5.1).
- **Reference product names/prices are NOT used** — the reference (`ToBeImplementedDesign.png`) is visual direction only; verified catalogue data overrides it (§5.1).

### Environment tiles — use-case image cards (photographic bg + gradient title overlay)
| Tile | Background image (Cloudinary, 200) | Destination (200) |
|------|------------------------------------|-------------------|
| Retail Stores | `.../v1785727165/Retail_Stores_xrjazm.jpg` | /acrylic-display/ |
| Offices & Reception | `.../v1785727165/Offices___Reception_202608031107_jkzjwe.jpg` | /acrylic-display/ |
| Healthcare | `.../v1785727164/Healthcare_reception_medical_clinic_202608031111_ouv3jx.jpg` | /healthcare/ |
| Schools & Education | `.../v1785727164/Schools___Education_202608031117_rxcfch.jpg` | /acrylic-display/ |

All four bg images verified **HTTP 200 image/jpeg** (2026-08-03). Delivered via `w_600,q_auto,f_jpg`.

## 5. Structure & copy direction

1. Header — slim orange bar `#f47c20`, centred white RDD logo (W29–W31 approved). **No top nav** (§6.11 opt-in).
2. Hero (above) — full-width, clickable, edge-to-edge → `/acrylic-display/`.
3. **Why Choose Acrylic Displays?** — white band, 4 benefit columns (Crystal Clear Visibility / Built to Last / Easy to Update / Versatile Applications). Supports the hero theme; does not restate the baked hero headline (§5.2).
4. **Best Selling Acrylic Display Solutions** — stone field `#f2f1ee`, white cards, **3-col × 2-row** (6 verified products), equal-height fixed-cell cards (§6.8), "FROM $X" orange price + white "SHOP NOW →" bordered button. *(3-col is a deliberate reference-driven choice; 6 products in 3×2 is balanced, §6.9.)*
5. **Where Acrylic Displays Make an Impact** — white band, **2×2** environment image tiles (bg photo + dark gradient overlay + white title).
6. Trust strip — 6-up (Australian Owned & Operated / Commercial Grade Quality / Fast Australia-wide Shipping / 30-Day Easy Returns / Bulk Order Discounts / Expert Advice & Support).
7. Closing CTA bar — orange, "Upgrade your presentation. Enhance your space." + white "SHOP ACRYLIC DISPLAYS →" → `/acrylic-display/` (single purposeful shop action; §6.2).
8. Footer — **dark** (matches reference premium look), verified approved contact data, white wordmark. **Social icons omitted** pending verified URLs.

- **Copy tone:** professional, helpful, modern, Australian B2B. No em dashes / dash interruptions (§6.2). No coupon this send (Weekly range-led; only `WELCOMEBACK` exists in RDD Klaviyo → none used, §6.3/§6.5).

## 6. Brand facts used (RDD — established from approved W29–W31 + Klaviyo account XAUdQX)
- Palette: orange `#f47c20`, text `#2a2e34`, muted `#6f6f6f`, white cards, warm-stone field `#f2f1ee`, dark footer `#1f2327`.
- Type: 'Trebuchet MS' headings, Arial body.
- Logo (Klaviyo XAUdQX, white wordmark, 200): `.../company/XAUdQX/images/19434473-b495-4540-8a3c-ffe9c37a879f.png` (used on orange header AND dark footer).
- Footer (approved/verified, §5.1): sales@retaildisplaydirect.com.au · (02) 9708 5288 · Retail Display Direct Pty Ltd, 3 Wordie Place, Padstow NSW 2211 · privacy-policy · `{% unsubscribe %}`.

## 7. Open items / to-confirm (flagged, do not block preview; DO gate the send)
- [ ] **Product data** — verified 2026-08-03 via live product pages; **re-verify at send time** (prices/stock drift). Prefer BigCommerce API when connected (§5.1).
- [ ] **Social URLs** — RDD Facebook/Instagram/LinkedIn not in any approved source (RDD.md "To be confirmed"); social row omitted rather than invented (§6.7). Provide verified URLs to add it.
- [ ] **Reference footer address/phone (Silverwater / 1300 135 844)** — differ from approved data; not adopted. Confirm which is current.
- [ ] **Hero baked CTA vs. Outlook** — hero copy/CTA are baked into artwork (RDD convention); accessibility trade-offs per §6.15 accepted for this send.

## Design Intent

| Field | Value | Owned by |
|---|---|---|
| **Design status** | PROPOSED | one of NONE · PROPOSED · LOCKED · SUPERSEDED |
| Fidelity mode | INSPIRATION (reference `ToBeImplementedDesign.png`) | STD-CREATIVE §4.0 — TARGET · INSPIRATION · LEGACY |
| Hero role | Offer/Brand Hero (range-led Weekly) | STD-HERO §15.6 |
| Hero pattern | Single embedded full-bleed artwork band (baked copy, RDD convention) | STD-DESIGN · Hero-Pattern-Library.md |
| Design language | Clean premium B2B, warm-stone + orange accent | STD-DESIGN · Design-Language-Library.md |
| Dominance | Balanced (hero → benefits → product grid) | STD-DESIGN · Design-Decision-Matrix.md Q3 |
| Emotional objective | Confidence / professional clarity | STD-DESIGN · Design-Decision-Matrix.md Q2 |
| CTA strength | Medium (single closing shop CTA + card CTAs) | STD-DESIGN · §1.2 CTA scale |

### Reference Register
| File | Mode | Note |
|---|---|---|
| References/ToBeImplementedDesign.png | INSPIRATION | Acrylic layout direction; product data + footer contact NOT copied (verified data overrides, §5.1) |
| References/Done Files/*.png | LEGACY | Prior send screenshots; not implemented |
| Draft/RDD-2026-W31-draft-v8.html | INSPIRATION (structure) | v2 card / trust / footer structure reference (CR4/CR5) |

---

## v2 Update — 2026-08-03 (client change requests; supersedes v1 layout)

`Draft/RDD-2026-W32-draft-v2.html` (→ `Output/`). v1 retained for history (§4.1). Changes:

- **CR1 — Environment tiles:** switched from background-image + gradient + HTML title overlay to **plain `<img>` tiles** (titles are baked into the artwork). Image + border-radius + spacing + one image-only inline anchor (§6.6). All 4 images uniform 1376×768. Removed all VML/gradient/overlay-text.
- **CR2 — Removed the "Why Choose Acrylic Displays?" benefits section** entirely (heading + icons + copy + spacing). Hero now flows straight into the product grid.
- **CR4 — Product grid rebuilt to the approved W31 card style** (white card, brandmark, 188px image, orange shrink-to-fit price badge §6.17), **2-col × 8 rows = 16 verified acrylic products** (all same theme — sign/brochure/menu/card holders + suggestion box). Replaces v1's 3-col reference-style cards.
- **CR5 — Trust → W31 "We've got you covered" 3-up; Footer → W31 light footer** (verified contact data). Orange closing CTA bar retained.
- **CR3 — All icons monochrome single-tone line glyphs; zero colour emoji** (new CLAUDE.md §6.21). Trust glyphs = `&#9993;`/`&#8635;`/`&#9742;` in brand orange.

### Verified products (16) — all confirmed on their OWN product page 2026-08-03 (in stock · GST-inc price · URL 200 · BigCommerce image)
| # | Name | Price | URL slug |
|---|------|-------|----------|
| 1 | A4 Acrylic Sign Holder | $6.25 | /a4-acrylic-sign-holder/ |
| 2 | A5 Acrylic Sign Holder | $3.70 | /a5-acrylic-sign-holder/ |
| 3 | A6 Acrylic Sign Holder | $3.20 | /a6-acrylic-sign-holder/ |
| 4 | A4 Acrylic Sign Holder Landscape | $7.83 | /a4-acrylic-sign-holder-landscape/ |
| 5 | A3 Acrylic Sign Holder | $18.64 | /a3-acrylic-sign-holder-en/ |
| 6 | A4 Wall Sign Holder Portrait | $7.61 | /a4-wall-sign-holder-portrait/ |
| 7 | DL Acrylic Brochure Holder | $2.85 | /dl-acrylic-brochure-holder/ |
| 8 | A5 Acrylic Brochure Holder One Tier | $4.91 | /a5-brochure-holders-table-top/ |
| 9 | A4 Acrylic Brochure Holder One Tier | $6.97 | /a4-acrylic-brochure-holder-one-tier/ |
| 10 | A5 Acrylic Brochure Holder Four Tier | $9.16 | /a5-acrylic-brochure-holder-four-tier/ |
| 11 | A4 Wall Brochure Holder | $9.01 | /a4-wall-brochure-holder/ |
| 12 | A4 Wall Mount Brochure Holder Lit Loc | $8.61 | /a4-wall-mount-brochure-holder/ |
| 13 | A5 Acrylic Menu Holder Slant Back | $3.15 | /a5-acrylic-menu-holder-slant-back/ |
| 14 | Charity / Suggestion Box A6 | $12.64 | /charity-donation-box-a6/ |
| 15 | Business Card Holder | $1.53 | /business-card-holder-counter/ |
| 16 | Wall Mount Business Card Holder | $1.93 | /wall-mount-business-card-holder/ |

All 16 share the **Acrylic Displays** theme (§5.1.2). Excluded (verified OOS this cycle): A4 Acrylic Menu Holder Slant Back, DL Menu Sign Holder Three Sided, brochure-holder wall rail.

## v3 Update — 2026-08-03 (hero swap, user request)

`Draft/RDD-2026-W32-draft-v3.html` (→ `Output/`). v2 retained. **Only the hero image changed** (verified diff = 1 line); all other sections byte-identical to v2.
- **New hero:** `https://res.cloudinary.com/atitvoxa/image/upload/v1785742147/eCommerce_hero_banner_acrylic_di__202608031528_szuakg.jpg` — verified **HTTP 200 image/jpeg, 1376×768** (same 16:9 → 600×335, aspect box unchanged). Delivered `w_1200,q_auto:good,f_jpg`. Still edge-to-edge, one inline anchor, → `/acrylic-display/`.
