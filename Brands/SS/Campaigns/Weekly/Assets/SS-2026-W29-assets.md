# SS 2026-W29 — Asset Manifest

Per-send assets used by the draft. No binaries are stored locally — all are **verified remote URLs**
(logos from SS's approved Klaviyo hosting per SS.md; product images from the live BigCommerce CDN).
**Reworked 2026-07-13** to the reference-driven "Take Control of Your Site" traffic & site-safety theme;
all product data re-fetched live from the SS website / BigCommerce storefront (store `s-498h0egvgn`).

## Brand (evergreen) assets — from SS.md [Confirmed]
| Role | URL |
|------|-----|
| Header wordmark (light bg, LEFT-aligned) | https://d3k81ch9hvuctc.cloudfront.net/company/T7SuPP/images/f4045d61-0ee2-41a3-8fbf-6281da7b3891.gif |
| Dark-mode red mark (dark bg swap) | https://d3k81ch9hvuctc.cloudfront.net/company/T7SuPP/images/f649010e-1543-4913-83fe-9c37cbcef1c3.png |

## Hero banner — RESOLVED (approved asset supplied by user 2026-07-13)
The hero-photo blocker is closed. Approved SS-hosted banner in use (HTTP 200, JPEG, 1167×651, ~16:9):
`https://d3k81ch9hvuctc.cloudfront.net/company/T7SuPP/images/55c52cca-baa1-4ead-b719-476dbc8af1c3.jpeg`
Scene: a man installing a yellow surface-mounted safety bollard (red top) in a commercial car park outside
a modern office building — ties directly to the "Set Up a Safer Site" theme and the featured bollard.
Placed at the top of the hero section in a rounded frame (per reference CampaignSS1), full-width within the
600px container, aspect ratio preserved (width 552 / width:100% / height:auto / border-radius:14px), linked
to the featured bollard's verified product page:
`https://www.safetysector.com.au/surface-mounted-safety-bollard-900mm/`. Not cropped/stretched/regenerated.

## Product images — live BigCommerce CDN (store `s-498h0egvgn`, 728×728 stencil, all verified in-stock + HTTP 200 2026-07-13)
**10 products** (rev 4). Grid uses a fixed 176px image cell so mixed source aspect ratios stay balanced.
Refreshed vs the previous (reference) send: removed Cable Protector 2 Channel + Bike Rack Galvanized
Circular (exact repeats) and Car Park Bollard (bollard balance); added kerb ramp, dock bumper, statutory sign.
| # | Product | Price (AUD) | Image URL |
|---|---------|-------------|-----------|
| 1 | Surface Mounted Safety Bollard 900mm | $57.80 | https://cdn11.bigcommerce.com/s-498h0egvgn/images/stencil/728x728/products/112/779/BSMYEL90__61007.1542078490.jpg?c=2 |
| 2 | Fold Down Parking Bollard | $176.00 | https://cdn11.bigcommerce.com/s-498h0egvgn/images/stencil/728x728/products/547/1038/A__46437.1741843411.jpg?c=2 |
| 3 | Expandable Barrier 7.5 Metre – Black | $686.70 | https://cdn11.bigcommerce.com/s-498h0egvgn/images/stencil/728x728/products/693/2275/A__94106.1741843421.jpg?c=2 |
| 4 | Rope Barrier Set – 3 Posts, 2 Ropes | $150.00 | https://cdn11.bigcommerce.com/s-498h0egvgn/images/stencil/728x728/products/387/484/CROW_NR_RED_A__93671.1535083613.jpg?c=2 |
| 5 | Anti-Slip Rubber Wheel Chock 320x290x260mm | $50.15 | https://cdn11.bigcommerce.com/s-498h0egvgn/images/stencil/728x728/products/721/2454/A-Overview__79411.1746080004.jpg?c=2 |
| 6 | Rubber Kerb Ramp 100mm (NEW) | $41.90 | https://cdn11.bigcommerce.com/s-498h0egvgn/images/stencil/728x728/products/624/1643/A__95600.1741843415.jpg?c=2 |
| 7 | Wall Bumper Rubber 1000mm | $32.26 | https://cdn11.bigcommerce.com/s-498h0egvgn/images/stencil/728x728/products/675/2134/A-cover___74193.1741839763.jpg?c=2 |
| 8 | Rubber Dock Bumper D Type 1000mm (NEW) | $69.70 | https://cdn11.bigcommerce.com/s-498h0egvgn/images/stencil/728x728/products/678/2138/A-cover__04774.1741839763.jpg?c=2 |
| 9 | Convex Mirror Wall Attachment Large | $14.25 | https://cdn11.bigcommerce.com/s-498h0egvgn/images/stencil/728x728/products/550/1052/se01900-04-thumbnail-1080x1080-70__33399.1563273686.jpg?c=2 |
| 10 | Statutory Sign – Storage Room (NEW) | $24.22 | https://cdn11.bigcommerce.com/s-498h0egvgn/images/stencil/728x728/products/759/2545/Storage-Room__00071.1747283355.jpg?c=2 |

**Grid expanded to 14 (rev 10) + A4 image fixed (rev 11).** Added: Car Park Bollard 165x1300mm $205.00
(products/551/1056/DSC_0031_clipped_rev_1__87054.1741843411); Rubber Wall Guard Bumper 1000mm $38.66
(products/676/2135/59e93434062604f64bb479a2f01deab_clipped_rev_1__84231.1741839763); Rubber Dock Bumper
D Type 900mm $48.95 (products/677/2136/A-_cover___42779.1741839763); A4 Stainless Steel Floor Poster
Display Stand $115.50 — image corrected from the low-res / off-brand primary (products/251/**613** =
199×500, showed a Vogue cover) to the higher-res gallery image
**products/251/614/DS-MA4_B__26968.1535088228** (485×728), from the same live BigCommerce product page.
All stencil 728×728, verified HTTP 200 2026-07-13.

Removed vs previous send: Cable Protector 2 Channel, Bike Rack Galvanized Circular (exact repeats), Car Park
Bollard 165x1300mm (balance). Excluded (out of stock 2026-07-13): all wheel stops, rubber speed hump,
rubber kerb ramp 150mm, rubber dock leveler bumper.

## COUPON — SITE15 (verification PENDING, requires user input)
Coupon code **SITE15** (user-provided) is displayed in the red coupon panel per the reference SS2 pattern.
It could **not** be verified in BigCommerce this session: the SS BigCommerce API is not connected (SS.md
lists store hash/token "To be confirmed"), the connected Klaviyo account is RDD's (not SS), and BigCommerce
coupons are not exposed on the public storefront. Per brief the discount %, expiry date and usage restriction
are **not fabricated** — the panel shows "to be confirmed before send" until the user confirms.
**Action required:** confirm (a) SITE15 exists/active in BigCommerce, (b) discount amount/percentage,
(c) expiry date, (d) usage restriction; then replace the pending line in the coupon panel.

## Explore by Category — 4 tile images + confirmed category URLs (added rev 7)
Provided SS-hosted category images (cloudfront `T7SuPP`, 631×354 PNG, all HTTP 200), each linked to a
confirmed live SS category page:
| Category | Image | Category URL (confirmed HTTP 200) |
|----------|-------|-----------------------------------|
| Tactile Indicators | `.../images/f164b73e-3594-4eca-90ab-ed4dc0aedeb0.png` | https://www.safetysector.com.au/tactile-indicator/ |
| Cable Protector | `.../images/ecf38276-d1b5-4367-a961-f64540c627ad.png` | https://www.safetysector.com.au/cable-protector/ |
| Wheel Stop | `.../images/1fbd95ef-166a-4386-b782-87526214804d.png` | https://www.safetysector.com.au/wheel-stops/ |
| Platform Trolley | `.../images/4df2a7c9-4e89-44ab-8a46-a1d2cee829e9.png` | https://www.safetysector.com.au/platform-trolley/ |
All four URLs verified live; no category link is missing/unconfirmed. Images used as supplied (not generated/replaced).

## HERO / PRODUCT BANNER — recommendation + BLOCKER
Recommended banner: a **real-environment lifestyle photo** of Safety Sector traffic/site-safety gear in use —
e.g. stainless/steel bollards plus a barrier or wheel stop protecting a commercial car park, loading dock, or
building entrance; wide 16:9, natural daylight, clean professional/industrial tone (mirrors the approved
reference's building-entrance-with-bollards hero). **No suitable existing SS hero asset is in the project**
(`Brands/SS/Assets/*` hold no images; only the two logo assets are confirmed). No image was generated or
invented. Source/approve such a photo (or approve AI generation via `07-Prompt Library/Hero-Banner-Generator.md`),
then drop it into the documented hero image slot.

## HERO IMAGE — BLOCKER (requires user input)
- The approved reference (`../References/CampaignSS1.png`) shows an **environmental hero photo**
  (stainless-steel bollards at a building entrance) in a rounded frame. **No approved SS hero-banner
  photo asset exists in the project** (`Brands/SS/Assets/*` contain no images; SS.md confirms only the
  two logo assets). Per brief: no image was generated or invented, and no unrelated asset was used to
  fill the space. The hero is implemented as the reference's rounded headline panel with a clearly
  **commented image slot** in the HTML where the approved photo drops in. **Action required:** supply an
  approved SS hero photo URL (or approve AI generation via `07-Prompt Library/Hero-Banner-Generator.md`).

## Not used (deliberate)
- Reference `CampaignSS3` category **image tiles** (Stainless Steel Bollards / Access Ramps / Convex
  Mirror…) omitted — no approved SS category-tile image assets exist; replaced by the confirmed
  secondary-nav pills (All products / Government orders / Bulk deals) to avoid inventing tile imagery.
- Trust icons rendered as unicode glyphs (no confirmed hosted SS trust-icon URLs).
