# Brief — SS-2026-LAUNCH-everyday-mobility-accessories

- **Brand (sender):** Safety Sector (SS) · Klaviyo account T7SuPP
- **Campaign type:** Product Launch (§5.3, §5.4) — an *event* (new accessories as news), NOT a Weekly grid.
- **Approval status:** NOT approved to send. Klaviyo DRAFT `01M04KX3FNTK22S37B1FGXMYYZ` created for review.
  Hero deployed (live 200). Audience user-confirmed: Safety Sector Customer List + Engaged 240D. Manual
  multi-client render QA (§8.1) still required before any send.
- **Product source:** SHARED BigCommerce store `498h0egvgn` (SS/SC). Cross-brand routing per §6.28.

## Origin & brand-ownership verification (§5.4 — re-audited this session)

7 SKUs were supplied and audited via the BigCommerce **Catalog API** (product + variant lookup) against **both**
the RDD store (`ugqmr0qfvf`) and the shared SS/SC store (`498h0egvgn`), then cross-checked against each product's
**live storefront status** and its **BigCommerce brand field** (the store owner's own assignment — authoritative,
never the SKU prefix). Every SKU exists in both stores; ownership was decided from the brand field + live-URL
evidence, which agree for all 7:

| SKU | Product (source title) | BC brand | SS site | SC site | RDD site | Verdict |
|---|---|---|---|---|---|---|
| CHDRBLA | SectorCare 3-in-1 Rotating Cup & Phone Holder – Black | **SectorCare** | 404 | 200 | 200 | SectorCare → route to SC |
| CHDBLA | SectorCare 360° Adjustable Universal Cup Holder – Black | **SectorCare** | 404 | 200 | 200 | SectorCare → route to SC |
| CHDBLAGRE | SectorCare 360° Adjustable Universal Cup Holder – Black & Grey | **SectorCare** | 404 | 200 | 200 | SectorCare → route to SC |
| CHDGRE | SectorCare 360° Adjustable Universal Cup Holder – Grey | **SectorCare** | 404 | 200 | 200 | SectorCare → route to SC |
| CUPSS25BLA | 25oz Vacuum Insulated Water Bottle – Black | **Retail Display Direct** | 200 | 404 | 200 | RDD → **EXCLUDED** |
| CUPSS60GRE | 64oz Vacuum Insulated Flask – Army Green | **Safety Sector** | 200 | 404 | 404 | Genuine SS → SS section |
| SPEHPM50 | Safety Sector Metal Speed Hump 500mm | **Safety Sector** | 200 | 404 | 404 | Genuine SS but off-theme → **HELD BACK** |

- **CUPSS25BLA is excluded** — its "SS" SKU prefix is misleading; the BigCommerce brand is Retail Display Direct.
  No RDD product ships in this SS send.
- **The four cup/phone holders are SectorCare** (brand + titles + live only on sectorcare.com.au). On an SS send
  they are featured with the SectorCare partnership **visible and accurately attributed** (per the user's explicit
  direction), and **every customer-facing link routes to sectorcare.com.au** (§6.28) because they 404 on
  safetysector.com.au. This is NOT the prior launch's name-stripping approach — attribution is intentional here.
- **SPEHPM50 (metal speed hump) is held back** — genuinely SS, but a car-park/traffic product has no place in an
  everyday-mobility-accessories launch (§5.1.2 theme consistency; user: "do not force unrelated SS products").
  Available to add if the user wants it; flagged in Review.

## Product selection (final)

**Primary grid — Featured Mobility Accessories (SectorCare; links → sectorcare.com.au):**
| # | SKU | Display name | Price (AUD) | Product URL (HTTP 200) | Image (HTTP 200) |
|---|---|---|---|---|---|
| 1 | CHDRBLA | 3-in-1 Rotating Cup & Phone Holder – Black | $34.83 | sectorcare.com.au/sectorcare-3-in-1-rotating-cup-phone-holder-black/ | cdn s-498h0egvgn/products/950 |
| 2 | CHDBLA | 360° Adjustable Universal Cup Holder – Black | $23.49 | .../sectorcare-360-adjustable-universal-cup-holder-black/ | products/946 |
| 3 | CHDGRE | 360° Adjustable Universal Cup Holder – Grey | $23.49 | .../sectorcare-360-adjustable-universal-cup-holder-grey/ | products/949 |
| 4 | CHDBLAGRE | 360° Adjustable Universal Cup Holder – Black & Grey | $23.49 | .../sectorcare-360-adjustable-universal-cup-holder-black-grey/ | products/947 |

**Secondary — More New Arrivals from Safety Sector (genuine SS; link → safetysector.com.au):**
| # | SKU | Display name | Price (AUD) | Product URL (HTTP 200) | Image (HTTP 200) |
|---|---|---|---|---|---|
| 5 | CUPSS60GRE | 64oz Stainless Steel Vacuum Insulated Flask – Army Green | $86.67 | safetysector.com.au/64oz-stainless-steel-vacuum-insulated-flask-army-green/ | products/953 |

All prices/stock/visibility confirmed via Catalog API (all `is_visible=true` on their owning storefront, in stock).
Names are product-focused (not fabricated); the SectorCare brand is attributed via a visible SectorCare mark on the
featured section, so nothing is misrepresented as SS-owned.

## Hero

- **Asset:** supplied `hosting/ss/Edit_banner_lower_text_202608161332.jpeg` (1376×768; renders 600×335). Depicts the
  3-in-1 Rotating Cup & Phone Holder with use-case tiles (strollers/bicycles/wheelchairs/scooters/cars). Clean
  SS-style slate artwork, **no foreign logo in the image** — safe to use as the launch hero.
- **Not recreated.** Used as-is, edge-to-edge, one clickable anchor (§6.14/§6.6).
- **Destination:** the SectorCare range `https://sectorcare.com.au/` (§5.4 launch hero → main collection; §6.28 the
  hero advertises SC products so it routes to the SC site). Verified HTTP 200.
- **Deploy gate:** the asset is present in `hosting/ss/` but **not yet deployed** to `assets-ss-wheat.vercel.app`
  (returns 404 until a commit+push triggers the Vercel redeploy, §7.1). HTML references the intended live URL.

## Copy

- **Subject:** New Arrival: One Holder for Your Drink and Phone
- **Preview text:** The 360° adjustable holder that fits strollers, wheelchairs, bikes and more, so what you need
  stays within easy reach wherever the day takes you.
- **Angle (fresh, NOT the prior partnership announcement):** everyday mobility, convenience, keeping essentials
  within reach, real-world use, complementing mobility equipment. Problem-first hook, benefit-led.
- **Coupon:** none supplied or configured; not fabricated (§6.5).

## Design Intent

| Field | Value | Owned by |
|---|---|---|
| **Design status** | PROPOSED | NONE · PROPOSED · LOCKED · SUPERSEDED |
| Fidelity mode | INSPIRATION | STD-CREATIVE §4.0 (reuses the approved SS-2026-LAUNCH structure/card/footer) |
| Hero role | Product Hero | STD-HERO §15.6 (Product Launch) |
| Hero pattern | Supplied full-bleed banner artwork, one anchor | STD-DESIGN / §6.14 (grandfathered baked-copy hero, §6.15) |
| Design language | SS + SectorCare slate house style (charcoal ink, slate #405060 accent, serif headlines, rounded cards) | approved SS-2026-LAUNCH |
| CTA strength | Strong, single intent ("Shop the Range") | Flow-Design-Recommendations §1.2 |

### Reference Register
| File | Mode | Note |
|---|---|---|
| Brands/SS/Campaigns/Product Launch/Output/SS-2026-LAUNCH-mobility-daily-living-aids.html | INSPIRATION | structure, card, trust, contact, footer reused; content is new |
| hosting/ss/Edit_banner_lower_text_202608161332.jpeg | TARGET | supplied hero, implemented faithfully |
| 07-Prompt Library/Launch-Playbook.md | TARGET | launch section order |
