# SC-2026-W30 — Asset & Product Manifest

Product source: SectorCare BigCommerce store `s-498h0egvgn` / live site `sectorcare.com.au`. SC has **no
connected BigCommerce/Klaviyo API** this session, so each product was re-verified on its **own product
page** (not a category listing, per §5.1) on **2026-07-22**: product page HTTP 200, product image HTTP 200
(GoogleImageProxy UA), add-to-cart present with no out-of-stock marker. **Stock signal is a page heuristic
— re-confirm live stock at send time (§8.1).** Prices AUD, GST-inclusive as shown on the live product page.

## Header logo (evergreen)
- `https://d3k81ch9hvuctc.cloudfront.net/company/XAUdQX/images/f7015926-fe41-4710-8b2f-d8ec95626866.png`
  — verified HTTP 200. Rendered LEFT-aligned, height 32px (§6.1 SC default).

## Products (14) — verified 2026-07-22

### 1 · Start in the Bathroom (6)
| # | Product | Price | Product URL | Page | Img |
|---|---------|-------|-------------|------|-----|
| 1 | Height Adjustable Aluminium Shower Stool | $35.10 | /sectorcare-height-adjustable-aluminium-shower-stool/ | 200 | 200 |
| 2 | U-Shaped Shower Chair with Backrest | $52.20 | /sectorcare-u-shaped-shower-chair-with-backrest/ | 200 | 200 |
| 3 | Wall Mounted Folding Shower Seat | $54.00 | /sectorcare-wall-mounted-folding-shower-seat/ | 200 | 200 |
| 4 | Lightweight Aluminium Commode Chair w/ Removable Armrests | $81.00 | /sectorcare-lightweight-aluminium-commode-chair-with-removable-armrests/ | 200 | 200 |
| 5 | 3-in-1 Folding Shower Chair, Commode & Walker – White | $84.60 | /sectorcare-3-in-1-folding-shower-chair-commode-and-walker-white/ | 200 | 200 |
| 6 | 360° Swivel Transfer Shower Chair with Armrests | $162.00 | /sectorcare-360-swivel-transfer-shower-chair-with-armrests/ | 200 | 200 |

### 2 · Steady on Your Feet — Rollators (4)
| # | Product | Price | Product URL | Page | Img |
|---|---------|-------|-------------|------|-----|
| 7 | LiteRoll Aluminium Rollator Walker – Red | $99.00 | /sectorcare-literoll-aluminium-rollator-walker-red/ | 200 | 200 |
| 8 | ComfortRoll Rollator Walker with Backrest – Grey | $202.50 | /sectorcare-comfortroll-rollator-walker-with-backrest-grey/ | 200 | 200 |
| 9 | GlideRoll Premium Rollator Walker – Champagne | $289.00 | /sectorcare-glideroll-premium-rollator-walker-champagne/ | 200 | 200 |
| 10 | GlideRoll Heavy Duty Rollator Walker – Black | $261.90 | /sectorcare-glideroll-heavy-duty-rollator-walker-black/ | 200 | 200 |

### 3 · Comfort That Goes the Distance — Wheelchairs (4)
| # | Product | Price | Product URL | Page | Img |
|---|---------|-------|-------------|------|-----|
| 11 | Aero Portable Wheelchair | $520.00 | /sectorcare-aero-portable-wheelchair/ | 200 | 200 |
| 12 | Infinity Aluminum Alloy Electric Wheelchair | $999.00 | /infinity-aluminum-alloy-electric-wheelchair/ | 200 | 200 |
| 13 | Infinity Air 2 Electric Wheelchair | $1,199.00 | /infinity-air-2-electric-wheelchair/ | 200 | 200 |
| 14 | Infinity Carbon Ergo Electric Wheelchair – Mesh Back | $2,950.00 | /infinity-carbon-ergo-electric-wheelchair-mesh-back/ | 200 | 200 |

## Category pills (in-body discovery, verified 2026-07-22)
| Label | URL | Status |
|-------|-----|--------|
| Bathroom Safety | /shower-chairs/ | 200 |
| Rollators | /rollators/ | 200 |
| Access Ramps | /disability-ramps/ | 200 |
| Manual Wheelchairs | /manual-wheelchair/ | 200 |
| Electric Wheelchairs | /electric-wheelchair/ | 200 |
| Shop All | / | 200 |

## Compliance / footer links
- Privacy Policy → `https://sectorcare.com.au/privacy-policy/` (**200** — corrected from W29's `/privacy`
  which now returns **404**; do not reuse the old `/privacy` path).
- Unsubscribe `{% unsubscribe_link %}`, `{{ organization.name }}`, `{{ organization.full_address }}` intact.
- Contact: sales@sectorcare.com.au · 02 9172 5607.

## Reused-from-W29 note (§5.1)
The 14 products are the W29-verified in-stock SC set, re-verified here. Reuse is a deliberate merchandising
decision under a narrow in-stock catalogue; the **campaign theme, hero, section framing, section copy and
promo title are all new** for W30 (§5.2). No product, price, SKU, URL or image was invented.
