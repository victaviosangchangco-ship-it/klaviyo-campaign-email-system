# SC-2026-CAT-electric-mobility — Review / QA (assesses SC-2026-CAT-electric-mobility-draft-v3.html)

**Draft assessed:** `Draft/SC-2026-CAT-electric-mobility-draft-v3.html` (mirrored to `Output/SC-2026-CAT-electric-mobility.html`). v1 + v2 retained as the rollback trail (§4.1).
**Approval status:** NOT approved to send (draft for human review, §9). Send gate not cleared.

## v3 update — card architecture rebuilt to match FD proven pattern (visual QA pass)

**Problem (what was visually wrong in v2).** The footer structure already matched FD (confirmed via property-by-property comparison — 18/20 properties identical, 2 intentional accent-colour differences). However, the **product cards** used a fundamentally different architecture from the proven FD reference, causing the grid to look visually inconsistent despite being structurally valid:

| Property | v2 (old) | v3 / FD (new) | Impact |
|---|---|---|---|
| Image sizing | Fixed `width="188" height="188"` in a `height="200"` cell with `valign="middle"` | Fluid `width:100%; max-width:246px; height:auto` — no fixed cell height | Images now **fill the card width** instead of floating inside an oversized cell |
| Image `valign` | `middle` (images centered vertically in 200px cell) | `top` (images top-aligned, natural flow) | Consistent top-edge alignment, no floating |
| Card outer padding | `padding:6px` (uniform) | `padding:0 6px 14px` | **14px bottom gap** between rows — visible breathing room matching FD |
| Grid outer padding | `padding:24px 12px 8px` | `padding:0 16px` | Matches FD grid inset |
| Border radius | `8px` | `10px` | Matches FD |
| Border color | `#ddd` | `#e2ddd3` | Matches FD warm tone |
| Region spacers | None — regions run together | `aria-hidden` spacers: 10px (after image), 4px (after title), 8px (after category) | Clean visual separation between card regions |
| Title height | `height="40"` | `height="36"` | Matches FD, still fits 2-line titles |
| Category height | `height="24"` | `height="20"` | Tighter, matches FD description region |
| Card inner padding | Split across regions | Single `padding:12px 12px 14px` content cell wrapping inner table | Matches FD card structure |
| Section header → grid | Direct transition | 18px `aria-hidden` spacer row between header and grid | Clean breathing room |
| Dark-mode classes | None | Not added (EM-specific decision, FD has them) | Acceptable for this campaign |

**What was NOT changed (preserved):** hero, header/logo, intro copy, campaign theme/copy, 18-product selection, all product URLs, all product images, category structure (3 sections), "Why SectorCare" trust strip, closing CTA, teal `#3d7a94` price badges (EM's own style vs FD's navy text price), teal accent throughout, footer (already matching FD from v2).

**Rendered QA (headless Edge, v3):**
- Desktop 720px: ✓ All 18 cards render with fluid images filling card width. ✓ Rows have even card heights. ✓ 14px row gaps visible. ✓ Centered odd last card in each section (Wheelchairs 8→4 rows even; Scooters 7→3+1 centered; Batteries 3→1+1 centered). ✓ Trust strip 4 cards aligned. ✓ Closing CTA clean (cream bg, teal button). ✓ Footer: contact → divider → legal band — matches FD proportions.
- Mobile 390px: ✓ Cards stack full-width, images fill width. ✓ Price badges compact/shrink-to-fit (not stretched). ✓ Section headers visible. ✓ Trust strip stacks. ✓ Closing CTA responsive. ✓ Footer intact, links visible.

**Structural QA:** anchors 62/62; 18 cards (pricebtn count); 0 empty `<td>`/`<tr>`; 0 `<table>`-in-`<a>`; 0 ghost elements; 0 `{{ }}` invalid vars; no `#`/empty/localhost links; 67.1KB (under 102KB clip). All `aria-hidden` spacers properly formed (height + font-size:0 + line-height:0 + `&nbsp;`). Mobile height-resets present for `.pnc,.pdc,.ppc,.tct,.tcs`.

**Klaviyo:** not re-synced; the SC draft still holds a prior version until sync is requested.

## (v2 assessment — superseded) Update round (footer swap + product-grid categorization)
- **Footer** — replaced the generic footer (which also carried a broken `{{ organization.full_address }}` — an invalid Klaviyo variable, §6.23) with the **approved SC footer pattern reproduced from `SC-2026-HOL-fathers-day`**: a contact block ("Got a question? We're here to help." + `02 9172 5607` + `sales@sectorcare.com.au`) → 1px `#e2ddd3` divider → minimalist `#f3f0eb` footer band with legal links (`{% unsubscribe_link %}` · `{% manage_preferences_link %}` · Privacy Policy, §6.23 URL-form) + `SectorCare`. Structure/spacing/typography/divider match the FD footer; the SC accent is kept as **this campaign's teal `#3d7a94`** (not FD navy) for in-email consistency (§6.26). **No Father's Day messaging was copied.**
- **Product grid categorized** — the flat 18-card grid is now three category sections built from the products' own category data, using the existing SC card design (unchanged) with SC-styled section headers (teal kicker + Georgia title + one grey sub line); odd sections centre the trailing card (§6.9):
  1. **Electric Wheelchairs** — **8** products (EWCP1, EWCP2, EWCS1, EWCS1R, EWCS1M, EWCS1MR, EWCS0, EWCF0)
  2. **Mobility Scooters** — **7** products (EMSLB2, EMSLB3, EMSLB1BLU, EMSLB1CHA, EMSLB1GRY, EMSLB1RED, EMSLB1WHI)
  3. **Replacement Batteries** — **3** products (EWCSBTY, EWCP1BTY, EMSLB2BTY)  →  total **18** unique.
- **Product-card alignment (refinement):** the cards use the proven SC fixed-height-cell pattern (§6.8/§6.29, established on this Father's Day campaign) — reserved image cell (200px), title (`pnc` 40px, fits every name at ≤2 lines), category label (`pdc` 24px), price badge, with `height:100%` backstop and mobile height-resets — so titles/labels/prices already align across every row. The one inconsistency was images (varied product-photo aspect ratios were **top**-aligned in the 200px cell, so they sat at different heights); fixed by centering every image in its reserved cell (`valign="middle"`, all 18). No card redesign, no image/data change.
- **Footer confirmed vs `SC-2026-HOL-fathers-day`:** identical block order (contact "Got a question? We're here to help." + phone|email → 1px `#e2ddd3` divider → `#f3f0eb` minimalist band with legal URL-form links + "SectorCare"), same padding (`34px 30px 8px` / `22px 30px 28px`), typography hierarchy and (explicit-colour) dark-mode behaviour. Accent kept as this campaign's teal `#3d7a94` for in-email consistency (§6.26); no FD messaging copied.
- **Unchanged:** hero, header/logo, intro copy, "Why SectorCare" trust strip, closing CTA, brand styling, all product data/URLs/images, product count.
- **Stock (BigCommerce read-only Catalog API, shared store `498h0egvgn`):** **18/18 IN STOCK**; all 18 are SC (`sectorcare.com.au`) and electric-mobility relevant; no RDD/SS/unrelated/filler; no duplicates.
- **QA:** anchors 62/62; 18 cards; 0 ghost `<td>`/`<tr>`/anchors; 0 `<table>`-in-`<a>`; **0 `{{ }}` invalid vars**; no `#`/empty/localhost; all 39 URLs HTTP 200; 60.5KB (under the 102KB clip). Rendered (headless Edge) desktop 720px + mobile 390px: three categories render with deliberate transitions, cards stack 1-col on mobile, footer matches the FD pattern and is intact/responsive.
- **Klaviyo:** not re-synced in this round (scope was the file change); the SC draft still holds the prior version until a sync is requested.

## (v1 assessment — superseded) Automated QA — PASS
- Structure: anchor balance 60/60; no `<table>` inside `<a>`; no nested/empty anchors; no empty `<td>`/`<tr>` (§6.6/§8.2).
- Product grid: exactly 18 cards, 2-col x 9 rows, fixed-height cells (§6.8), 3 sibling anchors per card, shrink-to-fit price badge (§6.17).
- Hero: edge-to-edge band, one inline anchor, width/height set, `display:block` img (§6.14/§6.6). Hosted URL verified HTTP 200 serving the correct bytes.
- Links: all 18 product pages HTTP 200; all 18 product images HTTP 200 `image/*`; hero + collection CTA + logo destinations HTTP 200 (§6.7/§8). No `#`/empty/placeholder/localhost.
- Footer: `{% unsubscribe_link %}` + `{% manage_preferences_link %}` URL-form tags, Privacy Policy link; no anchor-emitting tag in an href, no invalid `{{ }}` in an href (§6.23).
- Size: 55.0KB, under Gmail's ~102KB clip (§8.3). No descriptive comments (only functional MSO conditionals).
- Copy: no em/en dashes (§6.2/§6.25); single short intro; hero headline not restated below (§5.2).
- Mobile-safe wrapper + table/cell bgcolor (§6.16); Cerberus head scaffold (§6.20).

## Manual review still required before SEND (cannot be exercised in this environment)
- Real client render pass: Klaviyo Preview, Gmail Web + Mobile (Android & iOS), Apple Mail (incl. iPhone), Outlook, Samsung (§8.1). Only source-level + live-URL checks were automated here.
- Post-Klaviyo-import clickability of every card/CTA (§8.1.2).
- SC postal address: footer uses {{ organization.full_address }} (Klaviyo org var) because no confirmed SC address is on file; confirm the SC Klaviyo account has a full org address before send (CS-15).
- Audience: to be confirmed by the user before the campaign draft is created (§13.1).
