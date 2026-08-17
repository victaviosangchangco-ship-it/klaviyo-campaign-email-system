# Brief — SS-2026-LAUNCH-mobility-daily-living-aids

- **Brand:** Safety Sector (SS) · account T7SuPP
- **Campaign type:** Product Launch (§5.3, §5.4) — an *event* (new range as news), NOT a Weekly grid.
- **Approval status:** NOT approved to send. HTML built + QA passed; **audience pending user confirmation** (§13.1).
- **Product source:** SHARED BigCommerce store `498h0egvgn` (user-directed). Storefront URLs use `safetysector.com.au` (SS).

## Origin & brand-ownership verification (§5.4)

22 SKUs were supplied without a brand mapping. Each was verified via the BigCommerce **Catalog API** against
**both** the RDD store (`ugqmr0qfvf`) and the shared SS/SC store (`498h0egvgn`). Findings:

- **All 21 found SKUs are titled "SectorCare …"** (mobility / daily-living aids) and exist in **BOTH** stores.
- `THRAL01SIL` was **not found**; confirmed by the user as a typo for **`THRAL01SSIL`** ("Raised Toilet Seat
  with Flip-Up Armrests"), which exists in both stores. → final set = 22 verified products.
- The data showed **neither RDD nor SS** ownership (all SectorCare). Per the STOP rules this was reported and
  the user **explicitly directed: launch under SS, using the shared store's data**.

## §5.4 brand-name handling (applied)

- Every source title carries a **sister brand ("SectorCare")**. On an SS send this breaches §5.4, so all
  **display names are SS-neutral** (the "SectorCare" prefix is stripped, e.g. "SectorCare Adjustable Underarm
  Crutches" → "Adjustable Underarm Crutches"). **Zero "SectorCare" text is visible** in the email body.
- **FLAG for the store owner:** the BigCommerce product **titles should be renamed** for SS use, and the
  product **URL slugs still contain `sectorcare`** (e.g. `safetysector.com.au/sectorcare-…/`). The slugs are
  the real live SS product URLs (HTTP 200) and were **not** altered (changing a URL would breach §6.7). Flagged
  for the store team to re-slug if a fully SS-branded URL is required.
- **Category departure (noted, user-directed):** these are aged-care / mobility products launching under a
  site-safety brand. Verified and built as instructed; flagged here for the record.

## Products (22 — all verified: `is_visible=true`, in stock, priced, URL + image HTTP 200 on safetysector.com.au)

See `Output/SS-2026-LAUNCH-mobility-daily-living-aids-products` (data captured from store `498h0egvgn`).
Range: crutches, walking canes, indoor walker, shower seats/chairs, bath benches/boards, toilet aids, raised
toilet seats, bedside table, seat cushion.

## Copy

- **Subject:** Just Launched: Mobility and Daily Living Aids
- **Preview text:** New at Safety Sector. Crutches, walkers, shower and bath aids, toileting supports and more,
  in stock and shipping Australia wide.
- **Hero:** solid brand band (no fabricated artwork), "JUST LAUNCHED" badge → headline → one intro line → one
  CTA to the all-products page (§5.4 hero destination `https://www.safetysector.com.au/products/`).
- **Coupon:** none (no coupon supplied or configured for this launch; not fabricated, §6.5).

## Design Intent

| Field | Value | Owned by |
|---|---|---|
| **Design status** | NONE | one of NONE · PROPOSED · LOCKED · SUPERSEDED |
| Fidelity mode | INSPIRATION | STD-CREATIVE §4.0 (reused SS-2026-W32 card/head/footer patterns) |
| Hero role | Product Hero | STD-HERO §15.6 (Product Launch) |
| Hero pattern | Solid colour-bonded band, live HTML copy | STD-DESIGN |
| Design language | SS house style (black/white, single red accent, sharp corners) | SS.config.json |
| CTA strength | Strong, single intent ("Shop the New Range") | Flow-Design-Recommendations §1.2 |

### Reference Register
| File | Mode | Note |
|---|---|---|
| Brands/SS/Campaigns/Weekly/Output/SS-2026-W32.html | INSPIRATION | card / head / footer patterns reused |
| 07-Prompt Library/Generate-Product-Launch-Campaign.md | TARGET | launch section order |
