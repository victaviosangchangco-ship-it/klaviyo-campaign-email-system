# SS-2026-W38 Review Notes

**Draft assessed:** SS-2026-W38-draft-v1.html
**Date:** 2026-09-15

## QA Checklist

| Check | Result |
|-------|--------|
| File size (Gmail <102KB clip) | PASS — 67,489 bytes (~66KB) |
| Anchor balance (<a> == </a>) | PASS — 62/62 |
| No tag inside href | PASS — 0 matches |
| Footer uses `{% unsubscribe_link %}` | PASS |
| Footer uses `{% manage_preferences_link %}` | PASS |
| No anchor-emitting tags in href | PASS — 0 `{% unsubscribe %}`/`{% manage_preferences %}` in href |
| No localhost/127.0.0.1/:5500 URLs | PASS — 0 matches |
| Preview text present | PASS — "Durable bike racks, bollards and parking essentials built for Australian workplaces and public spaces. Shop now." |
| Title tag present | PASS — "Ride In. Park Secure. \| Safety Sector" |
| Head scaffold (charset, viewport, x-apple, format-detection, color-scheme) | PASS |
| MSO ghost table (600px Outlook container) | PASS |
| Mobile-safe wrapper (bgcolor on table AND td) | PASS |
| Edge-to-edge hero (padding:0, font-size:0, line-height:0, img display:block) | PASS |
| Hero image Vercel-hosted, HTTPS | PASS — assets-ss-wheat.vercel.app |
| Left-aligned SS logo (§6.1) | PASS — 122px wide |
| No nav (§6.11) | PASS |
| Product grid 2-column with MSO ghost tables | PASS |
| Fixed-height card cells (pimg/pnc/pdc/ppc) | PASS |
| Three sibling anchors per card (image/title/price) | PASS |
| No table inside anchor (§6.6) | PASS |
| Price display: red text, not background badge | PASS — Arial Black 17px #e11b22 |
| Product sections have red accent bars (44×4px #e11b22) | PASS |
| Closing CTA: light panel, red sharp-corner button, VML for Outlook | PASS |
| Trust section: 2×2 grid, monochrome glyphs (§6.21) | PASS |
| Contact block: "Got a question?" + phone + email | PASS |
| Footer: #f7f7f7, unsubscribe + manage prefs + privacy | PASS |
| Dark mode support (prefers-color-scheme + [data-ogsc]) | PASS |
| Mobile responsive (@media max-width:600px resets) | PASS |
| All 18 products present | PASS |
| All even section counts (no centered odd last card needed) | PASS — 2, 6, 6, 4 |

## Product Sections Verified

1. **Bike Racks & Secure Parking** — 2 products (1 row)
2. **Bollards & Zone Protection** — 6 products (3 rows)
3. **Parking & Access Infrastructure** — 6 products (3 rows)
4. **Visibility & Crowd Safety** — 4 products (2 rows)

## Hero Banner

- Source: `hosting/ss/hero-banners/ss-2026-w38-hero-banner.png`
- Live URL: `https://assets-ss-wheat.vercel.app/hero-banners/ss-2026-w38-hero-banner.png`
- Dimensions: 1672×941 (scaled to 600×338 in email)
- Status: Verified HTTP 200 image/png on Vercel

## Approval Status

- [x] QA passed (automated checks)
- [ ] Manual client rendering verification (requires Klaviyo test import)
- [ ] Approved to send
