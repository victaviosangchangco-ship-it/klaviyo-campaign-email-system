# RDD Weekly Campaign Brief — 2026-W31

- **Brand:** Retail Display Direct (RDD)
- **Campaign type:** Weekly (product-led range coverage) — routed via `07-Prompt Library/00-START-HERE.md`
- **Send id:** RDD-2026-W31
- **Created:** 2026-07-24
- **Author:** Claude Code (production)
- **Approval status:** ⛔ **Not approved to send** — build available in `Output/` for preview only (CLAUDE.md §4.1 / §9). Requires human review + §8.1 send-gate before send.

## 1. Objective

Promote the **Mobile TV Stand collection** while holding RDD's premium Australian B2B identity. Position the range as a **Meeting Room Solutions** edit: mobile displays, collaboration surfaces and desk setup that keep modern workplaces flexible and presentation-ready. Result should read like a world-class creative-agency campaign and stay consistent with prior RDD Weekly sends (W29/W30).

## 2. Continuous-improvement baseline (CLAUDE.md §5.1.1)

- **Baseline = latest approved send `Output/RDD-2026-W30.html`** ("shopfront edit" — signage/A-frames/acrylic POS, 16 products, cream field).
- **How W31 improves & stays fresh (§5.2):** genuinely new theme (meeting rooms / present with impact vs. shopfront signage), new hero, new product edit (AV + collaboration, none reused from W30), new section narrative. Tighter, more curated 8-product edit for a focused theme instead of a broad 16.
- **Engineering upgrades over W30:** mobile-safe fluid wrapper + table/cell `bgcolor` (§6.16, W30 used `<center>`+fixed 600); fixed-height card cells for bulletproof equal-height grid incl. Outlook (§6.8, W30 used `min-height`); Cloudinary-optimised hero delivery (662 KB → ~80 KB, same artwork).

## 3. Hero (locked by request — use exactly as provided)

- **Artwork (single embedded banner, §6.15):** `https://res.cloudinary.com/atitvoxa/image/upload/v1784869680/Improve_CTA_button_design_202607241306_ajaqm2.jpg` (1376×768, 662 KB).
  - Delivery-optimised (composition unchanged, §8): `.../upload/w_1200,q_auto:good,f_jpg/v1784869680/Improve_CTA_button_design_202607241306_ajaqm2.jpg` (~80 KB). Verified **HTTP 200 image/jpeg**.
  - Baked-in content: eyebrow "MEETING ROOM SOLUTIONS", headline "PRESENT WITH IMPACT.", subhead "Effortless, mobile displays for better team collaboration.", orange "Explore Collection →" CTA. **Do NOT re-add any of this as HTML/overlay** (§6.15). Not cropped, not redesigned.
- **Full-width, edge-to-edge, fully clickable** (whole banner in one anchor, §6.6/§6.14).
- **Hero destination:** `https://www.retaildisplaydirect.com.au/mobile-tv-stand-for-sale/` — verified **HTTP 200**.

## 4. Verified products (RDD BigCommerce store hash `s-ugqmr0qfvf`; API = source of truth, §5.1)

All rows: `is_visible=true`, `availability=available`, `inventory_level>0`, live product page **HTTP 200**, square stencil image **HTTP 200 image/jpeg**, price = API `calculated_price` (GST-inclusive; calibrated against W30's Snap A-Frame $85.32). Prices captured 2026-07-24.

> **v5 update:** grid expanded 8 → **14 products** (groups 4 / 6 / 4, all even → balanced 2-col). Added rows
> marked **(v5)** below — all verified 2026-07-24 (visible, in stock, page 200, image 200), on the same
> Meeting-Room theme.

### Group 01 — Mobile TV display / presentation (primary, hero-supporting)
| id | Display name | Price (AUD) | Product URL (200) |
|----|--------------|-------------|-------------------|
| 1224 | Floor TV Stand – Mobile | $143.55 | /floor-tv-stand-mobile/ |
| 1254 | Mobile TV Trolley | $294.80 | /mobile-tv-trolley/ |
| 1000 | Portable Lectern **(v5)** | $170.10 | /lectern-for-sale/ |
| 1534 | Portable Projector Screen 100″ **(v5)** | $281.14 | /ergodc-portable-projector-screen-100-4-3/ |

### Group 02 — Collaboration surfaces
| id | Display name | Price (AUD) | Product URL (200) |
|----|--------------|-------------|-------------------|
| 1310 | Mobile Magnetic Whiteboard 1200×900mm | $153.96 | /mobile-whiteboard-1200x900mm-magnetic/ |
| 981 | Glass Whiteboard 1200×900mm | $149.50 | /glass-whiteboard-writing-board/ |
| 1022 | Magnetic Whiteboard 1800×900mm | $151.10 | /magnetic-white-board-for-sale-1800x900mm/ |
| 1370 | Magnetic Notice Board 6× A4 | $157.97 | /magnetic-notice-board-6xa4-indoor-whiteboard/ |
| 1021 | Magnetic Whiteboard 1500×900mm **(v5)** | $116.86 | /magnetic-whiteboard-for-sale-1500x900mm/ |
| 980 | Glass Whiteboard 1200×600mm **(v5)** | $95.36 | /glass-whiteboard-for-sale/ |

### Group 03 — Desk & workspace setup
| id | Display name | Price (AUD) | Product URL (200) |
|----|--------------|-------------|-------------------|
| 1216 | Single Monitor Mount – Desktop | $37.36 | /monitor-mount-desktop-Black/ |
| 1217 | Dual Monitor Arm – Desktop | $84.11 | /dual-monitor-arm-desktop/ |
| 1240 | Electric Sit-Stand Desk 1600mm **(v5)** | $403.71 | /electric-sit-stand-desk/ |
| 1228 | Sit-Stand Desk 1400mm **(v5)** | $386.71 | /sit-stand-desk-for-sale/ |

### Solutions For Your Business — use-case tiles (v5, verified-live categories, HTTP 200)
| Tile | Destination |
|------|-------------|
| 🏢 Office Workspaces | /sit-stand-desk/ |
| 🏪 Retail Stores | /acrylic-display/ |
| 🏥 Healthcare | /healthcare/ |
| 🎓 Education | /projector-screen/ |

### Blockers / exclusions (documented, §5.1)
- **`/mobile-tv-stand/` (product 1197, Mobile TV Stand, $123.71) EXCLUDED — dead link.** API reports `is_visible=true, inv=48`, but the live customer URL returns **HTTP 404** (verified twice, with browser UA, no redirect). Exactly the API-says-visible / URL-404s trap in CLAUDE.md §5.4 / product-source memory. Replaced with **1224 Floor TV Stand – Mobile** (live 200), so the "1–2 Mobile TV Stand" requirement is met with 1224 + 1254.
- OOS (excluded): 1198 Mobile LCD 60-100″, 1199 Mobile LCD 40-60″ Dual (both inv=0). Hidden/404 (excluded): 1210 (`is_visible=false`).
- **No coupon/promo this send** (Weekly, range-led, no discount per playbook). Only `WELCOMEBACK` exists in the RDD Klaviyo account; no weekly-promo code confirmed → none used (§6.3/§6.5).

## 5. Structure & copy direction

1. Existing header — slim orange bar, centred white RDD logo (W29/W30 approved). **No top nav** (§6.11 opt-in; Design.md defines none).
2. Hero (above) — full-width, clickable, edge-to-edge.
3. Intro — cream/stone band, max 2 short paragraphs, business-outcome focus (collaboration, flexible meeting spaces, professional presentations, modern workplaces). No dashes (§6.2). Must not repeat the hero headline (§5.2).
4. Groups 01/02/03 — numbered section headers (W30 pattern), 2-col balanced grid, all even rows (2/4/2 — no odd-card centering needed, §6.9).
5. Closing CTA — "Explore the Collection →" → `/mobile-tv-stand-for-sale/` (single purposeful shop action; §6.2).
6. Trust strip (3-up) + footer — reuse approved W30 content (verified links).

- **Copy tone:** professional, helpful, modern, Australian B2B. Avoid "best / amazing / premium quality / limited time" (per request). Focus on productivity, collaboration, meeting-room efficiency, professional presentation, modern workspaces.
- **Category-pill block dropped this week:** guessed whiteboard/monitor category slugs 404; only `/mobile-tv-stand-for-sale/`, `/sit-stand-desk/`, `/products/` verified. To avoid dead links and keep the edit tight/on-theme, discovery is handled by the single closing CTA instead of off-theme signage pills.

## 6. Brand facts used (RDD, established from approved W29/W30 + Klaviyo account XAUdQX)
- Palette: orange `#f47c20`, text `#2a2e34`, muted `#6f6f6f`, white cards, warm-stone section field `#f2f1ee`.
- Type: 'Trebuchet MS' headings, Arial body.
- Logo (Klaviyo XAUdQX): `.../company/XAUdQX/images/19434473-...png` (200). Brandmark: `.../6bd02fd5-...png` (200).
- Footer: sales@retaildisplaydirect.com.au · (02) 9708 5288 · 3 Wordie Place, Padstow NSW 2211 · privacy-policy · `{% unsubscribe_link %}`.
