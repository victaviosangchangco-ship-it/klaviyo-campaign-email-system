# SC-2026-LAUNCH — New Product Launch Draft v1 Review

**File reviewed:** `Draft/SC-2026-LAUNCH-new-product-launch-draft-v1.html`
**Date:** 2026-09-13
**Approval status:** NOT APPROVED TO SEND — READY FOR VISUAL REVIEW

---

## Build Summary

- **24 products** in 2-column × 12-row grid, exact specified SKU order
- **8 LIVE products** (rows 1–4): price badges with verified AUD prices, linked to verified HTTP 200 product URLs
- **16 hidden/OOS products** (rows 5–12): "Launching Soon" badges (#8FA3A1 Gray Turquoise), no links (images unlinked, no dead 404 URLs)
- **Navy #465669 palette** per approved creative reference direction
- Standard SC header (left-aligned XAUdQX logo) and footer (contact, subscription links, address)

## Structure Verification

| Section | Status | Notes |
|---|---|---|
| SC Header | PASS | Left-aligned logo, 200px, padding 22px 32px, bgcolor on table AND td |
| Main Hero | PASS | Edge-to-edge, Vercel-hosted, font-size:0/line-height:0, class="hero-img g-img" |
| Intro | PASS | "NEW ARRIVALS" eyebrow + Georgia serif heading + Poppins body |
| Product Grid (24 SKUs) | PASS | 2×12 grid, fixed-height cells (pnc h38, pdc h18), shrink-to-fit price tables |
| Featured Categories | PASS | 2-up × 2 rows, 4 Vercel-hosted images, verified category URLs |
| Secondary Hero | PASS | Edge-to-edge, Vercel-hosted, same build pattern as Main Hero |
| Trust/Service | PASS | 4-up table-layout:fixed 25% cells, reserved tct h34 + tcs h30 |
| Closing CTA | PASS | VML bulletproof button, navy #465669, "Shop Now →" |
| SC Footer | PASS | Contact block, 1px divider, subscription links on #f3f0eb |

## QA Checklist

### §8.2 Ghost Element Inspection
- [x] Zero empty anchors
- [x] Zero nested anchors
- [x] Zero empty `<td>` / `<tr>` (all spacers carry height + `&nbsp;`)
- [x] Zero ghost tables
- [x] Zero `href="#"` / empty / placeholder hrefs
- [x] Anchor balance: 35 `<a ` = 35 `</a>`

### §6.6 Link/Containment Safety
- [x] No `<table>` inside any `<a>`
- [x] No `display:block` on image-wrapping anchors
- [x] Product cards use sibling anchors (image / name / price) to same URL

### §6.16 Gmail Mobile-Safe Wrapper
- [x] Full-width wrapper table with bgcolor="#e7e3db" AND inline background
- [x] MSO ghost table width="600"
- [x] Fluid container width:100% + max-width:600px
- [x] bgcolor on all coloured section tables AND their content tds

### §6.17 Responsive Price Badges
- [x] All 8 live product price badges use shrink-to-fit `<table>` pattern
- [x] No bare `display:inline-block` anchor badges
- [x] Mobile rule `.pricebtn { display:inline-block !important; width:auto !important; }`

### §6.23 Merge-Tag Validation
- [x] Footer uses `{% unsubscribe_link %}` (URL form) — NOT `{% unsubscribe %}`
- [x] Footer uses `{% manage_preferences_link %}` (URL form) — NOT `{% manage_preferences %}`
- [x] No `href="[^"]*<` pattern (no tag inside attribute)
- [x] No unrecognised `{{ }}` variables

### §6.14 Edge-to-Edge Heroes
- [x] Hero table: width:100% inline, cellpadding/cellspacing/border=0
- [x] Hero td: padding:0, font-size:0, line-height:0, mso-line-height-rule:exactly
- [x] Hero img: display:block, width:100%, explicit width/height attrs

### §7.1 Image URLs
- [x] Zero localhost / 127.0.0.1 / :5500 / local filesystem paths
- [x] All 6 Vercel-hosted assets verified HTTP 200 (prior session)
- [x] All 24 BigCommerce product images use HTTPS CDN URLs

### §8.3 Gmail Clip Threshold
- [x] File size: ~95KB — under Gmail's ~102KB clip threshold
- [x] No non-functional HTML comments
- [x] Minimal preheader (one line)

### §6.20 Cerberus Compliance
- [x] Full head scaffold (x-apple-disable-message-reformatting, format-detection, color-scheme)
- [x] MSO OfficeDocumentSettings
- [x] Complete CSS resets (body, table, img, Gmail gutter fix, Samsung, auto-detected links)
- [x] `u ~ div .email-container` min-width blocks (3 breakpoints)
- [x] Responsive media query with height resets for pnc/pdc/ppc/tct/tcs
- [x] VML bulletproof CTA for Outlook

### §5.4 Product Launch Rules
- [x] 8 LIVE products show verified prices and link to verified product URLs
- [x] 16 hidden products show "Launching Soon" badges with no dead links
- [x] Hidden products are not linked (no 404 URLs in the email)
- [x] SKU order matches the exact specified sequence

## Blockers (blocks promotion to Output/)

1. **16 of 24 products are NOT VISIBLE on BigCommerce** — product URLs return HTTP 404. These products appear in the Draft with "Launching Soon" flags per §5.4 but block promotion to Output/ until published and re-verified.
2. EWCCF3BLA and EWCCF4 have **leading spaces in BigCommerce SKU fields** (cosmetic).

## Design Notes

- **Palette:** Navy #465669 (CTAs, badges, accents), Gray Turquoise #8FA3A1 ("Launching Soon" badges — differentiates from live-product navy badges), Dark Gray #232323 (headings), #6b6862 (body text), #e2ddd3 (card borders), #f5f3ef (image placeholder bg), #e7e3db (page bg), #f3f0eb (footer bg), #DCE1E7 (trust section bg)
- **Typography:** Poppins (sans-serif) for body/UI, Georgia (serif) for editorial headings
- **Card structure:** Follows SC Category template's Cerberus-compliant pattern exactly (border-radius:10px, 1px solid #e2ddd3 border, padded inner content, shrink-to-fit price table)
- **Featured Categories:** 2×2 grid with border-radius:10px image tiles, linked to verified category URLs
- **Trust cards:** 4-up on table-layout:fixed, white card backgrounds on #DCE1E7 field
