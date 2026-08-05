# Weekly Campaign Brief — Retail Display Direct (RDD) 2026-W30

> Stage 1 of the pipeline (WK-P1 / CR-05). Values follow the source-of-truth hierarchy (CLAUDE.md §2).
> Built per the Weekly continuous-improvement loop (§5.1.1): analysed the last approved send
> (`Output/RDD-2026-W29.html`) and deliberately improved + refreshed it. Nothing invented (§5).

> **v2 UPDATE (2026-07-20, current build = `Draft/RDD-2026-W30-draft-v2.html`):** per user instruction —
> (1) grid expanded to **16 products** (added Chalkboard A-Frame Red Wood, Portable Promo Counter, A3 Snap
> Lock Frame, 5-Pocket Magazine/Brochure Stand); (2) **hero changed from dark to a light treatment** (orange
> logo bar + soft cream hero) per RDD hero-rotation rule §6.13; (3) product grid uses the **approved W29 style**
> (light-grey field, white cards) §6.13; (4) **top navigation removed** (opt-in §6.11), approved "Shop by
> Category" pills retained. The Featured Products list below is superseded by the **Asset Manifest** and
> **Review notes** for the current 16-product list.

## Brand-fact source note
Connected **Klaviyo account = Retail Display Direct** (`XAUdQX`); **BigCommerce** store `s-ugqmr0qfvf`
connected read-only via `Brands/RDD/.env`. Org name, sender, address, currency, website [Confirmed].
Visual identity (orange `#f47c20`, navy `#2a2e34`, white logo) is **[Inferred from the reference]** and still
To be confirmed against an official RDD brand guide.

## Campaign meta
- **Brand / code:** Retail Display Direct / RDD
- **Cadence:** Weekly
- **ISO week / send date:** 2026-W30 / target **Tue 2026-07-21** *(placeholder — confirm against Content Calendar)*
- **Subject line (WK-S1):** Turn browsers into buyers — shopfront signage that sells
- **Preheader (WK-S2):** A-frames, poster stands, snap frames and counter displays. Set the scene and sell more, shipped Australia-wide.
- **Approval status:** **APPROVED for production 2026-07-20.** Final design = `Draft/RDD-2026-W30-draft-v9.html`,
  promoted to `Output/RDD-2026-W30.html`. **Actual send still gated by the §8.1 manual client-render + post-Klaviyo
  link checks** listed in the Review notes (cannot be exercised in this environment) — complete those before sending.

## What last week was (baseline) & how W30 improves on it
- **W29 (approved):** "Fresh Displays. Sharper Spaces." — a **workspace/office-leaning** best-seller mix
  (electric sit-stand desk hero, office chair, mobile pedestal, whiteboards, pegboard, TV stand). Orange hero
  band with an overlapping desk lifestyle photo on the orange→cream seam; one flat 10-card grid; "Limited
  Time Sale" heading with no actual offer.
- **W30 (this send) — fresh concept:** pivots to RDD's **core: retail display & shopfront signage**
  ("front of house"). Improvements:
  1. **New theme + story** — "Turn Browsers Into Buyers": kit out the whole customer-facing space, a genuine
     cross-sell narrative (out front → windows & walls → the counter) vs W29's flat best-seller list.
  2. **New hero** — **navy hero band** with orange accents (vs W29's orange band + overlapping desk photo).
     Cleaner, typographic, no awkward seam trick.
  3. **Grouped product journey** — three themed 2×2 blocks with sub-headings, so discovery and cross-sell are
     obvious (W29 was one undifferentiated grid).
  4. **Premium header nav** with per-item orange underlines (§6.10) for category discovery (W29 had none).
  5. **100% different product line-up** — zero overlap with W29's 10 SKUs (all workspace items dropped).
- **Continuity preserved:** RDD orange/navy palette, white logo, orange price buttons, subtle corner brand
  mark on cards, 3-up trust strip, light footer — the brand still feels like RDD.

## Objective
- **Purpose:** Drive product/category clicks across RDD's retail-display range by framing it as "everything to
  make your shopfront sell."
- **Primary metric:** CTR to product/category pages → orders.

## Key message (WK-S4 hero)
- **Eyebrow:** THIS WEEK · THE SHOPFRONT EDIT
- **Headline:** Turn Browsers Into Buyers.
- **Body:** Great displays do the selling for you. This week's edit runs from the footpath to the counter, so
  every part of your space is working to bring customers in and move stock.
- **Hero CTA:** Shop the shopfront edit → `/products/`

## Featured products (WK-S6) — 12, verified via BigCommerce Catalog API 2026-07-20
Source: RDD BigCommerce v3 Catalog API (store `s-ugqmr0qfvf`). Each product confirmed `is_visible=true`,
`availability=available`, in stock, non-zero price, live URL HTTP 200, image HTTP 200 (500×500 stencil).

**Group A — "Stop them at the footpath" (outdoor attention):**
| # | Product | Price (AUD) | URL |
|---|---------|------|-----|
| 1 | Double Sided A1 Snap A-Frame | $85.32 | /snap-aframe-for-sale/ |
| 2 | Real Estate A-Frame Sign Board 600x450mm | $67.50 | /real-estate-aframe-sign-board/ |
| 3 | Wooden A-Frame Blackboard | $77.00 | /wooden-aframe-blackboard/ |
| 4 | Outdoor A1 Poster Stand | $170.00 | /outdoor-poster-stand-a1/ |

**Group B — "Frame the message" (windows & walls):**
| # | Product | Price (AUD) | URL |
|---|---------|------|-----|
| 5 | A1 Heavy Duty Snap Frame 32mm | $40.19 | /a1-heavy-duty-snap-frames-32mm/ |
| 6 | A2 Snap Lock Frame | $22.68 | /a2-snap-lock-frames/ |
| 7 | A1 Poster Stand – Single Sided | $148.27 | /a1-floor-poster-stand/ |
| 8 | A2 Floor Poster Stand – Single Sided Black | $142.25 | /A2-poster-stand-single-sided-black/ |

**Group C — "Win at the counter" (point-of-sale displays):**
| # | Product | Price (AUD) | URL |
|---|---------|------|-----|
| 9 | A4 Acrylic Sign Holder | $6.25 | /a4-acrylic-sign-holder/ |
| 10 | A4 Acrylic Menu Holder Slant Back | $6.31 | /a4-acrylic-menu-holder-slant-back/ |
| 11 | A4 Acrylic Brochure Holder One Tier | $6.97 | /a4-acrylic-brochure-holder-one-tier/ |
| 12 | Acrylic Business Card Holder Four Tier | $3.49 | /acrylic-business-card-holder-four-tier/ |

> Group A card #1 (A1 Snap A-Frame) doubles as the hero's featured product (hero → first grid card continuity).
> 12 products (three 2×2 blocks) keeps every row balanced (§6.9). No overlap with W29.

## Offer / incentive
- **No coupon this send** (matches W29; no confirmed active RDD weekly-promo code — `WELCOMEBACK` is a winback
  code, not reused). No placeholder code shown (§6.5). Add a confirmed RDD coupon if/when provided.

## Secondary content (WK-S7)
- **Header nav (per-item orange underline, §6.10; links verified live):** A-Frames (/aframes-sandwich-boards/) ·
  Snap Frames (/snap-frames/) · Poster Stands (/floor-poster-stand/) · Displays (/acrylic-sign-holder/).
- **Primary CTA (single, §6.2):** Explore the full range → `/products/`.
- **Trust strip (3-up, from reference):** Australia-Wide Shipping · Fast & Simple Returns · Expert Customer Service.
- **Contact/footer:** sales@retaildisplaydirect.com.au · www.retaildisplaydirect.com.au · (02) 9708 5288 ·
  Retail Display Direct Pty Ltd, 3 Wordie Place, Padstow, NSW 2211.

## Assets
- **Header logo (white, for navy hero):** `.../company/XAUdQX/images/19434473-b495-4540-8a3c-ffe9c37a879f.png` (verified 200).
- **Corner brand mark (subtle, on cards):** `.../company/XAUdQX/images/6bd02fd5-d5cc-4fc2-8c60-219830e7175e.png` (RDD Favicon-Orange).
- **Product images:** live BigCommerce CDN `s-ugqmr0qfvf`, 500×500 stencil (all 12 verified 200 image/jpeg 2026-07-20).

## Missing / to confirm
- [ ] Official RDD brand guide (orange/navy hex, typefaces, logo usage — all [Inferred]).
- [ ] Optional confirmed RDD coupon (none used).
- [ ] Live stock re-check at send time for all 12 products.
- [ ] §8.1 client render + post-Klaviyo clickability verification (cannot be exercised in this environment).
