# Review / QA — SS-2026-W32 (assesses Draft/SS-2026-W32-draft-v1.html → Output/SS-2026-W32.html)

**Send status: `NOT_APPROVED_TO_SEND`.** Draft is build-complete and passes automated QA; the §8.1 send gate
requires human approval + real-client render verification (noted below as pre-send manual steps).

## Product verification (live shared BigCommerce store 498h0egvgn, SS channel 1 / tree 1)
All 4 products re-fetched live 2026-08-09: visible=true, in stock, price>0, live URL (HTTP 200), image (200).

| ID | SKU | Name | Price | Inv | Visible | URL 200 | Img 200 | Storefront |
|----|-----|------|-------|-----|---------|---------|---------|-----------|
| 534 | SCRE12100ZSA | 12x100mm Zinc Plate Sleeve Anchor – Pk of 4 | $6.60 | 891 | ✓ | ✓ | ✓ | safetysector.com.au |
| 536 | SCRE16110GAL | 16x110mm Galvanized Sleeve Anchor – Pk of 4 | $8.80 | 46 | ✓ | ✓ | ✓ | safetysector.com.au |
| 537 | SCRE12150WS | Wheelstop Concrete Screws – 12x150mm Pk of 3 | $7.15 | 1022 | ✓ | ✓ | ✓ | safetysector.com.au |
| 538 | SCRE1275SH | Speed Hump Fixing Kit – 12x75mm Pk of 2 | $3.85 | 1916 | ✓ | ✓ | ✓ | safetysector.com.au |

**Product count: 4 / 4 unique, in-stock, on-theme SS products.** No invented data; no OOS/hidden; no other brand.

## Link verification (all HTTP 200)
- Hero: `https://assets-ss-wheat.vercel.app/ss-2026-w32-hero-banner.jpg` → 200, image/jpeg (exact URL from brief).
- 4 product pages, 4 product images, fixings category (`/fixings-and-drill-bit/`) → all 200.
- Header logo (cloudfront T7SuPP), hero, all images on approved hosts only. No localhost / relative / `#` / empty hrefs.

## Automated QA
- Project validators (`platform/qa`): **PASS** — 0 blocker, 0 warn, 12 pass.
- Ghost Element Inspection (§8.2): 0 empty anchors, 0 empty `<td>`/`<tr>`, 0 `#`/empty hrefs, 0 ellipsis.
- Structure: anchors 21/21 balanced, `<table>` 37/37, `<tr>` 52/52; **no `<table>` inside `<a>`** (§6.6);
  3 sibling anchors per card (image/title/price).
- §6.23: footer uses `{% unsubscribe_link %}` + `{% manage_preferences_link %}` (URL-form) + Privacy Policy; no
  anchor-emitting tag inside an href; no unrecognised `{{ }}`.
- Copy: no em dashes (§6.2/§6.25); intro is short/scannable; no repetition of the hero headline (§5.2).
- File size 37 KB (well under Gmail's ~102 KB clip, §8.3).
- Full project test suite: **191/191 pass**.

## Design conformance (§8.1 design-intent gate)
- Brief carries a Design Intent block (status LOCKED). Header comment records hero role/pattern + SS design language.
- Hero (TARGET) implemented faithfully; edge-to-edge (§6.14), one inline anchor, `<img>` is block (§6.6).
- SS branding: left logo (§6.1), black/red palette, sharp-corner red CTA (§6.1), trust claims grounded in SS.md.

## Blockers / pre-send manual steps (gate the actual SEND, not the Output file — §4.1/§9)
1. **Human approval required** (reviewer ≠ author, CR-16/17). Not yet approved.
2. **Real-client render check not performed in this environment** — before send, verify in Klaviyo Preview +
   Gmail (web + Android + iPhone) + Apple Mail + Outlook: hero renders full-width, 2×2 grid equal-height, price
   badges compact, footer tags expand cleanly, no clip/`…` (§8.1 / §8.3). This is a required manual gate.
3. **Coupon:** none used (no offer supplied; not fabricated, §6.5) — nothing to verify.

## Notes
- Reduced to 4 products by approved override (catalog cannot support 20 on-theme, in-stock; see Brief). Not a defect.
- Draft v1 is the first version; keep all Draft versions on revision (§4.1). Output mirrors draft v1.
