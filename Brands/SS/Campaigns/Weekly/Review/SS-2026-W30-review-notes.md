# SS-2026-W30 — Review & QA Notes

## Draft v11 — 2026-07-28 (coupon expiry date only) — PROMOTED TO OUTPUT
Authored as `Draft/SS-2026-W30-draft-v11.html`; promoted to `Output/SS-2026-W30.html` (byte-identical, §4.1/§9).
**Status: NOT approved to send** (§8.1 client-render gate still open). **Single-value change** — the diff vs v10 is
*exclusively* the coupon validity date (plus the matching date inside the promo-panel build comment); every other
section is byte-for-byte identical.

**Coupon expiry updated:**
- `Valid until 29 July 2026` → **`Valid until 4 August 2026`** in the SAFESTEP promo panel.
- Rationale: send date **2026-07-28**, coupon valid for **exactly 7 days** (28 July → 4 August inclusive).
- `One-time use` unchanged; the `&nbsp;&nbsp;&middot;&nbsp;&nbsp;` separator, `<p>` inline styles (13px / 1.5 /
  `#ffe4e5` / `margin:0 0 20px 0`), the red `#e11b22` panel, `border-radius:14px`, `34px 28px` padding, the
  `SAFESTEP` code treatment and both Shop now CTAs (MSO VML + inline-block anchor) are all untouched.
- The promo-panel HTML comment's quoted validity string was updated to the same new date so it does not
  contradict the live copy; no other comment text changed.

**No other section changed:** hero, Featured Categories, all product groups + grid alignment, trust, contact,
footer, and the grey-page/white-card layout + spacing are byte-identical to v10.

**Automated QA — PASS (draft v11):** diff vs v10 = coupon date only (2 lines); tags balanced (**table 60/60 ·
tr 110/110 · td 122/122 · a 75/75 · p 66/66**); Ghost Element Inspection (§8.2) clean (0 empty anchors, 0 empty
`<td>`, 0 `href="#"`, 0 `<table>` inside `<a>`); built file **62.2 KB**, well under Gmail's ~102 KB clip (§8.3);
no URL changed, so the v10 link verification (45 unique URLs, 0 non-200) still stands.

**§8.1 SEND GATE (unchanged, required before send — cannot be exercised here):** Gmail Mobile / Apple Mail iPhone ·
Gmail Web · Apple Mail · Outlook · Klaviyo Preview; re-confirm live stock (16 product pages); confirm the Rubber
Wheel Chocks tile image. **⚠️ Coupon gate now also covers the new expiry:** confirm **SAFESTEP** is created,
**ACTIVE** in BigCommerce, **and that its configured expiry in BigCommerce matches 4 August 2026** — the email
copy and the platform rule must agree, or customers hit an invalid code (§6.3).

---

## Draft v10 — 2026-07-22 (FINAL approved hero banner swap) — superseded by v11 (coupon expiry date only)
Authored as `Draft/SS-2026-W30-draft-v10.html`; promoted to `Output/SS-2026-W30.html` (byte-identical, §4.1/§9).
**Status: NOT approved to send** (§8.1 client-render gate still open). **Single-line change** — the diff vs v9 is
*exclusively* the hero `<img src>`; every other section is byte-for-byte identical.

**Hero banner replaced with the final approved version:**
- New source: `…/upload/f_jpg,q_auto:good,w_1200/v1784696022/Safety_Sector_hero_banner_202607221252_z77ux7.jpg`
  (delivered as the same-asset email-optimised Cloudinary derivative used campaign-wide; original 1376×768, ~2×
  retina at 600px). Verified **HTTP 200 image/jpeg**.
- **Identical geometry to the previous hero** (1376×768, 16:9) so `width="600" height="335"` is unchanged — **no
  stretch, no crop, correct aspect ratio** preserved.
- **Destination unchanged** (`…/cable-protector/`); the whole banner remains one clickable anchor (§6.15), anchor
  inline / `<img>` block (§6.6), edge-to-edge with zero gap (§6.14) — the entire responsive implementation is
  untouched (same `.hero-img` class + inline `width:100%; max-width:600px; height:auto`).

**No other section changed** (per request): Featured Categories, all product groups + grid alignment, coupon,
trust, contact, footer, and the grey-page/white-card layout + spacing are all byte-identical to v9.

**Automated QA — PASS (draft v10):** diff vs v9 = hero src only; tags balanced (**table 60/60 · tr 110/110 · td
122/122 · a 75/75 · p 66/66**); **45 unique URLs, 0 non-200** (new hero included); hero `width`/`height` present;
hero anchor → `/cable-protector/` confirmed; no broken links; Ghost Element Inspection (§8.2) clean. This is the
**final hero** for the current SS-2026-W30 draft.

**§8.1 SEND GATE (unchanged, required before send — cannot be exercised here):** confirm the new hero renders
full-size and does not shrink/collapse on **Gmail Mobile / Apple Mail iPhone**, plus Gmail Web · Apple Mail ·
Outlook · Klaviyo Preview; re-confirm live stock (16 product pages); confirm the Rubber Wheel Chocks tile image;
confirm **SAFESTEP** created + ACTIVE in BigCommerce.

---

## Draft v9 — 2026-07-22 (Featured Categories MOVED below the promo + reduced to image-only tiles) — superseded by v10 (hero swap only)
Authored as `Draft/SS-2026-W30-draft-v9.html`; promoted to `Output/SS-2026-W30.html` (byte-identical, §4.1/§9).
**Status: NOT approved to send** (§8.1 client-render gate still open). This is a **placement experiment** for review
of the visual hierarchy — Featured Categories now acts as a secondary discovery block near the bottom instead of
competing with the hero + featured products.

**New content order (as requested):** Hero → Cover the cables → Guide the way underfoot → See every blind corner →
Promo Code → **Featured Categories** → Why site managers buy from Safety Sector → Contact → Footer.

**Featured Categories changes:**
- **Moved** from directly below the hero to **below the Promo Code section, before the trust section.**
- **Removed** the section heading ("Featured categories"), the subtitle ("Jump straight to the site-safety ranges
  businesses order most.") and the **category name label under every image** (the supplied images carry their own
  text overlay, so the labels were repetitive). The section is now simply the **four clickable category images in a
  clean 2×2 grid** — no labels, no extra text, no CTA buttons.
- **Kept:** the 2×2 layout, all four live category links, the white cards, light `#e6e6e6` border, subtle box-shadow,
  6px rounded image inside a 10px-padded 10px-radius card, equal spacing (same 6px gutters / 14px row gaps as the
  product grid), identical tile heights (all images 16:9, no crop), responsive behaviour, and full image
  clickability (one inline anchor around the block image, §6.6).

**Links unchanged (all verified HTTP 200, §6.7):** Expandable Barriers `/expandable-barriers/` · Speed Hump
`/speed-humps/` · Rubber Wheel Chocks `/rubber-wheel-chock/` · Crowd Control Barriers `/crowd-control-barriers/`.
⚠️ Still confirm the Rubber Wheel Chocks image (filename suggests an expandable barrier) before send.

**No protected section changed:** a targeted diff vs v8 shows **zero** changes to any product group, the coupon, the
trust strip, the contact block or the footer — only the FC section moved/simplified + the now-unused `.cnc` mobile
class removed. The v6 grid alignment and v7 grey/white card are fully intact (no regression).

**Automated QA — PASS (draft v9):** tags balanced (**table 60/60 · tr 110/110 · td 122/122 · a 75/75 · p 66/66 ·
center 2/2**); 4 image-only tiles (box-shadow) · **0** `.cnc` label cells · **0** category label text · **0**
heading/subtitle; **22 images**, 22/22 width+height; anchors wrapping `<table>` = **0**; image-anchor
`display:block` = **0**; empty/nested/`#` anchors = **0**; empty `<td>` = **0**; **45 unique URLs, 0 non-200**
(identical set to v8). Ghost Element Inspection (§8.2) clean.

**§8.1 SEND GATE (unchanged, required before send):** verify on **Klaviyo Preview · Gmail Web · Gmail Mobile ·
Apple Mail (iPhone) · Outlook** that the 2×2 image tiles render equal-height with working links after Klaviyo
import; re-confirm live stock (16 product pages); confirm the Rubber Wheel Chocks image; confirm **SAFESTEP** active
in BigCommerce.

---

## Draft v8 — 2026-07-22 (Featured Categories 2×2 section inserted below the hero) — superseded by v9 (section relocated below the promo)
Authored as `Draft/SS-2026-W30-draft-v8.html`; promoted to `Output/SS-2026-W30.html` (byte-identical, §4.1/§9).
**Status: NOT approved to send** (§8.1 client-render gate still open). The **only** change vs v7 is the new section
(diff = 6 removed lines [the v7 placeholder comment + one media-query line] and 48 added). **All other sections —
hero, product grid, coupon, trust, contact, footer — are byte-for-byte identical to v7** (no regression; v6 grid
alignment intact).

**Featured Categories — 2×2 image-led grid, directly below the hero, before "Cover the cables"** (the approved
location). Built on the **existing §6.8 fixed-height card component + §6.9 2-col balance**:
- **Four tiles, image is the focus**, no price, no description, no CTA button — just a 16:9 category image + a
  centred bold category label. Cards are white with a light `#e6e6e6` border and a **subtle box-shadow**
  (`0 1px 4px rgba(0,0,0,0.06)`; degrades gracefully in Outlook, which keeps the border).
- **Identical heights, no crop:** all four supplied images are 16:9 (1376×768), delivered as a same-asset
  Cloudinary derivative (`f_jpg,q_auto:good,w_560` ≈ retina at the ~250px tile) at a uniform `width="250"
  height="140"`, so tiles are identical size without distortion. Label cell is a fixed `height="46"` (`.cnc`,
  resets to auto on mobile); image + label each reset naturally on mobile via the existing `.pc img` rule.
- **Whole tile clickable** via sibling anchors (image + label) to the same URL (§6.6 — anchor wraps inline content
  only; no `<table>` in an `<a>`, no `display:block` image-anchor).
- **Section heading** reuses the established group-header style (red 44×4 accent bar + Arial Black h2 "Featured
  categories" + one grey sub-line) so typography/spacing match the rest of the campaign.

**Category → live destination (all verified HTTP 200, §6.7):**
| Tile | Live URL |
|------|----------|
| Expandable Barriers | `https://www.safetysector.com.au/expandable-barriers/` |
| Speed Hump | `https://www.safetysector.com.au/speed-humps/` |
| Rubber Wheel Chocks | `https://www.safetysector.com.au/rubber-wheel-chock/` |
| Crowd Control Barriers | `https://www.safetysector.com.au/crowd-control-barriers/` |

⚠️ **Image/label note (confirm):** the image supplied for **Rubber Wheel Chocks** has a filename suggesting an
*expandable safety barrier* (`White_expandable_safety_barrier…zlkbvv.jpg`). It was used exactly as supplied per
instruction; confirm this is the intended image for the Rubber Wheel Chocks tile before send. `alt` text is set to
the category label on each tile.

**Automated QA — PASS (draft v8):** diff vs v7 = the new section only; tags balanced (**table 62/62 · tr 116/116 ·
td 128/128 · a 79/79 · p 71/71 · center 2/2**); **22 images**, 22/22 width+height; 4 tiles, 4 fixed-height label
cells; anchors wrapping `<table>` = **0**; image-anchor `display:block` = **0**; empty/nested/`#` anchors = **0**;
empty `<td>` = **0**; literal `...`/`…` = **0**; no placeholder left. **45 unique https URLs, 0 non-200** (adds the
4 tile images + 4 category pages; the prior 37 unchanged). Ghost Element Inspection (§8.2) clean.

**§8.1 SEND GATE (unchanged, required before send — cannot be exercised here):** render + post-Klaviyo clickability
on **Klaviyo Preview · Gmail Web · Gmail Mobile · Apple Mail (iPhone) · Outlook**; confirm the 2×2 tiles are equal
height and the four category links navigate correctly after Klaviyo import; confirm the Rubber Wheel Chocks image is
correct; re-confirm live stock on all 16 product pages; confirm **SAFESTEP** created + ACTIVE in BigCommerce.

---

## Draft v7 — 2026-07-22 (grey page background + white content card, per CampaignSS1/SS2 reference) — superseded by v8
Authored as `Draft/SS-2026-W30-draft-v7.html`; promoted to `Output/SS-2026-W30.html` (byte-identical, §4.1/§9).
**Status: NOT approved to send** (§8.1 client-render gate still open). **Wrapper-only change** — the diff vs v6 is
*exclusively* the outer page wrapper + a planning placeholder comment; **every protected section (hero, product
grid, coupon, trust, contact, footer) is byte-for-byte identical to v6**, so the v6 fixed-height grid alignment is
untouched (PART 4 honoured, no regression).

**PART 1 — reference layout (grey page + white card):** the page background is now light grey (`#f0f0f0`) and the
whole 600px email is a centered **white content card** floating on the grey, matching CampaignSS1/SS2 (which show the
entire email as one white card on a light-grey page). Implemented email-safe: an outer full-width grey wrapper table
(`bgcolor="#f0f0f0"`) with a centred cell padded **28px top / 32px bottom / 12px sides**, holding the
`.email-container` which now carries `bgcolor="#ffffff"` + `background:#ffffff` (+ `dm-bg` so it stays white in dark
mode). Grey shows as gutters top/bottom and on the sides on desktop; on mobile the card goes full width (existing
`.email-container{width:100%}` media rule) with grey only top/bottom. **Hero unchanged** (still edge-to-edge/flush at
the top of the white card, §6.14/§6.15 preserved — no grey hero frame added). **Footer unchanged.**

**PART 2 — Category Featured NOT implemented (deferred for review).** A clearly-marked HTML **comment placeholder**
was added directly **below the hero** to reserve the position without shipping any empty/ghost markup (§8.2). It is a
comment only (renders nothing). **Recommended location: directly below the hero** as the category-discovery entry
point (strong above-the-fold hook, §6.3); **alternative** considered: after the three product groups, before the
coupon (keeps the product story first). Four supplied category images (Expandable Barriers · Speed Hump · Rubber
Wheel Chocks · Crowd Control Barriers) are on hand; when approved, each card will need a **verified-live SS category
URL** (§6.7 — no `#`/placeholder) and will reuse the §6.8 fixed-height card component + §6.9 balance.

**PART 3 — spacing/separation:** the grey/white card contrast now does the heavy lifting for visual hierarchy
(clean separation of the email body from the page). Internal section spacing was intentionally **left as v6** to
avoid any change to the protected sections (PART 4); the added wrapper padding gives the premium "floating card"
framing seen in the reference.

**Automated QA — PASS (draft v7):** diff vs v6 = wrapper + placeholder only; tags balanced (**table 52/52 · tr
102/102 · td 112/112 · a 71/71 · p 66/66 · center 2/2**); anchors wrapping `<table>` = **0**; image-anchor
`display:block` = **0**; empty/nested/`#` anchors = **0**; empty `<td>` = **0**; literal `...`/`…` = **0**; **0** em
dashes in visible copy (placeholder comment de-em-dashed too); imgs 18/18 width+height; **identical 37-URL set to v6
(0 new links; 0 non-200)**. Ghost Element Inspection (§8.2) clean.

**§8.1 SEND GATE (unchanged, required before send — cannot be exercised here):** render + post-Klaviyo clickability on
**Klaviyo Preview · Gmail Web · Gmail Mobile · Apple Mail (iPhone) · Outlook**; confirm the white card + grey page
render correctly (esp. Outlook, where the grey wrapper `bgcolor` is the reliable mechanism); re-confirm live stock on
all 16 product pages; confirm **SAFESTEP** created + ACTIVE in BigCommerce.

---

## Draft v6 — 2026-07-22 (product card REBUILT as one reusable fixed-height component — every region a fixed cell) — superseded by v7 (grid unchanged)
Authored as `Draft/SS-2026-W30-draft-v6.html`; promoted to `Output/SS-2026-W30.html` (byte-identical, §4.1/§9).
**Status: NOT approved to send** (§8.1 client-render gate still open). Per user instruction the card was **rebuilt
from scratch as one reusable component**, not patched. Hero, coupon, trust, contact, footer unchanged; identical
verified 37-URL set (0 non-200). Descriptions **not** shortened further (already concise) — the fix is architectural.

**The reusable card component (identical for all 16 cards, every region a fixed-height `<td>`):**
| Row | Cell | Reserved height | valign |
|-----|------|-----------------|--------|
| 1 | Image area (`.pimg`) | **196px** (176px image + padding) | top, centered |
| 2 | Product title (`.pnc`) | **42px** (2 lines) | top |
| 3 | Description (`.pdc`) | **38px** (2 lines) | top |
| 4 | Price (`.ppc`) | **30px**; its 10px top padding is the fixed **spacer** | middle |

Because **every** region is a fixed-height table cell (the one sizing primitive Outlook honours), total card height
is set by structure, not content. So across every row and every section: images start at the same position, titles
start at the same position, descriptions occupy the same reserved space, and **prices sit on the same horizontal
line** (Group A: $33.21 / $39.90 / $49.26 / $60.00 align exactly). Each group's last row therefore ends at the same
height, so the next section heading always begins at a consistent position. `.pimg/.pnc/.pdc/.ppc` reset to `auto`
in the `max-width:600px` media query so full-width stacked cards size naturally on mobile.

**No CSS Grid / Flexbox / align-items / justify-content anywhere** — pure nested tables, fixed cell heights,
`valign`, explicit `height` attributes + inline CSS. **No empty spacer cell** (the spacer is fixed padding) per §8.2.
SS cards have no CTA button (price + whole card are the clickable link — the approved SS design); "CTA row if used"
is therefore N/A. §6.6 preserved: 4 sibling anchors per card to the same URL, anchor wraps inline content only.

**Automated QA — PASS (draft v6):** tags balanced (**table 51/51 · tr 101/101 · td 111/111 · a 71/71 · p 66/66**);
16 image cells @196 · 16 title cells @42 · 16 desc cells @38 · 16 price cells @30; 18 imgs, **18/18 width+height**;
anchors wrapping `<table>` = **0**; image-anchor `display:block` = **0**; empty/nested/`#` anchors = **0**; empty
`<td>` = **0**; literal `...`/`…` = **0**; tag-like prose in comments = **0** (§8.2); **0** em dashes in visible copy;
"29 July 2026" present, "Apply at checkout" absent; **0** stair-nosing refs; `{% unsubscribe_link %}` intact; identical
37-URL set to v5 (**0 non-200**). Ghost Element Inspection (§8.2) clean.

**§8.1 SEND GATE (unchanged, required before send — cannot be exercised here):** render + post-Klaviyo clickability on
**Klaviyo Preview · Gmail Web · Gmail Mobile · Apple Mail (iPhone) · Outlook**; in **Outlook desktop** confirm every
card is equal height and each price row sits on the same line; re-confirm live stock on all 16 product pages; confirm
**SAFESTEP** created + ACTIVE in BigCommerce.

---

## Draft v5 — 2026-07-22 (product grid: fixed-height content CELLS) — superseded by v6
Authored as `Draft/SS-2026-W30-draft-v5.html`; promoted to `Output/SS-2026-W30.html` (byte-identical, §4.1/§9).
**Status: NOT approved to send** (§8.1 client-render gate still open). Only the product-card internals changed vs v4;
hero, coupon, trust, contact, footer unchanged; identical verified 37-URL set (0 non-200).

**Why v4 was not enough:** v4 pinned the price to the bottom and equalised the card boxes, but the name/description
reservations still used `min-height` on `<p>`, which **Outlook ignores** — so the *vertical position* of the name,
description and price could still differ card-to-card in Outlook, and the price no longer started at the same height.

**Fix — fixed-height table cells (the one email-safe primitive Outlook honours):** each card is now a **4-row table**
where every content region is its own cell with a reserved height:
- **Image cell** — 176×176 image (already fixed) + uniform 12/10px padding.
- **Name cell** — `<td height="40">` (reserves 2 lines), `valign="top"`.
- **Description cell** — `<td height="38">` (reserves 2 lines), `valign="top"`.
- **Price cell** — `valign="bottom"`, uniform padding.
Because each region is a fixed-height *cell* (not a `min-height` `<p>`), **card height is fixed by structure, not by
content** — every card is pixel-identical, every product name starts on the same line, every description occupies the
same slot, and **every price begins at the exact same vertical position across all 16 cards** (e.g. the Group A row
$33.21 / $39.90 / $49.26 / $60.00 all sit on one line) — in Gmail, Apple Mail **and Outlook**. The `.pnc`/`.pdc`
classes reset the reserved heights to `auto` on mobile so stacked cards size naturally. Structure follows the required
order exactly: **Image → Name → Description (≤2 lines) → Price** (SS cards have no separate CTA button; the price and
whole card are the clickable link, so "CTA if present" is N/A — unchanged from the approved SS design).

Descriptions were already trimmed to one concise line and are unchanged; **product names, prices and images unchanged.**

**§6.6 safety:** each card uses **four sibling anchors to the same product URL** (image · name · description · price) —
anchor wraps inline content only; no `<table>` inside an `<a>`; no `display:block` on any image anchor.

**Automated QA — PASS (draft v5):** tags balanced (**table 51/51 · tr 101/101 · td 111/111 · a 71/71 · p 66/66**);
16 cards each with a fixed name cell (h=40), fixed description cell (h=38) and bottom-aligned price cell; 18 imgs,
**18/18 width+height**; anchors wrapping `<table>` = **0**; image-anchors `display:block` = **0**; empty/nested/`#`
anchors = **0**; literal `...`/`…` = **0**; **0** em dashes in visible copy (and comment prose de-tagged per §8.2 —
no tag-like text in comments); "29 July 2026" present, "Apply at checkout" absent; **0** stair-nosing refs;
`{% unsubscribe_link %}` intact; identical 37-URL set to v4 (**0 non-200**). Ghost Element Inspection (§8.2) clean.

**§8.1 SEND GATE (unchanged, required before send — cannot be exercised here):** render + post-Klaviyo clickability on
**Klaviyo Preview · Gmail Web · Gmail Mobile · Apple Mail (iPhone) · Outlook**; in **Outlook desktop** specifically
confirm every card is equal height and each price row starts on the same line; re-confirm live stock on all 16 product
pages; confirm **SAFESTEP** created + ACTIVE in BigCommerce.

---

## Draft v4 — 2026-07-22 (product-grid alignment hardened — bottom-pinned price) — superseded by v5
Authored as `Draft/SS-2026-W30-draft-v4.html`; promoted to `Output/SS-2026-W30.html` (byte-identical, §4.1/§9).
**Status: NOT approved to send** (§8.1 client-render gate below still open). Only the product-grid **structure**
changed vs v3 — hero, coupon, trust, contact and footer are byte-for-byte unchanged; the 37-URL set is identical
to v3 (already verified **0 non-200**).

**Why:** v3 relied on `min-height` on `<p>` to reserve name/description regions. **Outlook's Word engine ignores
`min-height` on non-table elements** (CLAUDE §6.8), so a card with a one-line name could still render shorter and
its price would float up — rows looked balanced in Apple Mail/Gmail but could drift in Outlook.

**Fix — §6.8 reference equal-height pattern (structural, not min-height-dependent):** every one of the 16 cards
is now a **2-row table inside its equal-height row cell**:
- **Top content row** (`valign="top"`, `height:100%`) holds image + name + description and **absorbs all slack**,
  so any extra space in a shorter card is pushed *below the text*, never between cards.
- **Bottom footer row** (`valign="bottom"`) holds the price, **pinning it to the card bottom**. Prices now align
  on the same baseline across every row even in Outlook.
- Card `<table height:100%>` inside the equal-height 2-col row cells keeps the card boxes identical height per row.
- Reserved `.pn` (38px, 2 lines) / `.pd` (34px) retained for the min-height-honouring clients so image → name →
  description spacing stays consistent; they reset to 0 on mobile so stacked cards size naturally.
- Result matches the requested structure exactly: **Image → Name → Description (≤2 lines) → Price/old-price → bottom**,
  identical height, identical image area (176px fixed), uniform spacing, bottom-aligned prices. Descriptions were
  already trimmed to one concise line in v3 and are unchanged; names/prices/images unchanged.

**§6.6 safety preserved:** each card uses **three sibling anchors to the same product URL** (image · name+description ·
price) — anchor wraps inline content only, no `<table>` inside an `<a>`, no `display:block` on any image anchor.

**Automated QA — PASS (draft v4):** tags balanced (table 67/67 · tr 85/85 · td 95/95 · a 55/55 · p 66/66); 16
product cards, each with **1 top content row + 1 bottom footer (price) row**; 18 imgs, **18/18 width+height**;
anchors wrapping `<table>` = **0**; image-anchors with `display:block` = **0**; empty `<td>`/anchors = **0**; nested
anchors = **0**; `href="#"`/placeholder = **0**; literal `...`/`…` = **0**; **0** em dashes in visible copy; **0**
stair-nosing refs; "29 July 2026" present, "Apply at checkout" absent; `{% unsubscribe_link %}` intact; identical
37-URL set to v3 (0 non-200). Ghost Element Inspection (§8.2) clean.

**§8.1 SEND GATE (unchanged, still required before send — cannot be exercised here):** verify render +
post-Klaviyo clickability on **Klaviyo Preview · Gmail Web · Gmail Mobile · Apple Mail (iPhone) · Outlook**;
**specifically confirm in Outlook desktop that every card is equal height and prices bottom-align** (the defect
this rework targets); re-confirm live stock on all 16 product pages; confirm **SAFESTEP** created + ACTIVE in
BigCommerce.

---

## Draft v3 — 2026-07-22 (hero banner swap · grid normalisation · coupon copy/date) — superseded by v4
Authored as `Draft/SS-2026-W30-draft-v3.html`; promoted to `Output/SS-2026-W30.html` (byte-identical, §4.1/§9).
**Status: NOT approved to send** — Output holds the latest build for preview/QA only (§8.1 gate below still open).
Three user-requested edits applied to the v2 build; nothing else in the campaign changed.

**PART 1 — Hero banner replaced.** The v2 typographic near-black hero panel was replaced with a **single
embedded banner artwork wrapped in one clickable anchor** (§6.15). Source:
`https://res.cloudinary.com/atitvoxa/image/upload/.../Safety_Sector_hero_banner_202607220917_uh7tsl.jpg`
(native 1376×768, 16:9). Delivered via a Cloudinary derivative of the **same asset** — `f_jpg,q_auto:good,w_1200`
(1200×670, **110 KB** vs 573 KB original, still JPEG, ~2× retina at 600px) — an email-weight optimisation of the
identical artwork (no crop/composition change), permitted by §8.
- **Fully clickable** → kept the campaign's existing hero destination `…/cable-protector/` (unchanged, per brief).
- **Edge-to-edge, no gaps** (§6.14): hero `<td>` `padding:0; font-size:0; line-height:0; mso-line-height-rule:exactly`;
  `<img display:block>`; `<td>/<a>/<img>` collapsed onto one line (no stray text node).
- **Responsive, no stretch, no crop** (§6.6): `width="600" height="335"` HTML attrs reserve the aspect box for
  Apple Mail iOS; inline `width:100%; max-width:600px; height:auto`; defensive `.hero-img` class (100% width /
  auto height) in both the base style and the mobile media query.
- **§6.6 safety:** anchor stays **inline** (no `display:block` on the `<a>`); the `<img>` is the block element.

**PART 2 — Product grid normalised (equal-height cards, §6.8).** All 16 descriptions rewritten to a single
concise factual line (no invented specs), and the reserved description height `.pd` reduced **52px → 36px** so
cards are tighter and perfectly balanced. Reserved name `.pn` (38px) and price `.pp` (24px) unchanged; `height:100%`
equal-height cells + `valign="top"` retained. Result: every card is identical height and prices/CTAs align across
every row on desktop; min-heights reset to 0 on mobile so stacked cards size naturally.

**PART 3 — Coupon section.** Removed the sentence **"Apply at checkout on your floor-safety order"** (and its
middot separator, so no empty gap remains) from the SAFESTEP promo copy; changed **"Valid until 28 July 2026" →
"Valid until 29 July 2026"**. The copy now reads "Valid until 29 July 2026 · One-time use". Nothing else in the
coupon section changed (code, offer framing, panel style, CTA all as v2). Single-line copy renders identically on
desktop and mobile.

**Automated QA — PASS (draft v3):** 37 unique https URLs, **0 non-200** (16 product pages, 16 product images, logo,
hero, `/cable-protector/`, homepage, privacy — checked with a browser UA for pages and the GoogleImageProxy UA for
images, incl. the new Cloudinary hero). **16 product cards** (+4 trust cards); **18 imgs** (16 products + logo +
hero), **18/18 carry `width`+`height`**; anchors wrapping a `<table>` = **0**; image-anchors with `display:block` =
**0**; empty/`#`/placeholder anchors = **0**; literal `...`/`…` = **0**; **0** anti-slip stair-nosing references
(§6.12); **0** em dashes in visible copy (6 `—` are inside HTML comments only); `{% unsubscribe_link %}` intact;
tags balanced (table 67/67 · tr 69/69 · td 79/79 · a 39/39 · p 66/66). Ghost Element Inspection (§8.2) clean.

**§8.1 SEND GATE (unchanged, still required before send — cannot be exercised in this environment):**
verify render + post-Klaviyo clickability on **Klaviyo Preview · Gmail Web · Gmail Mobile · Apple Mail (iPhone) ·
Outlook**; confirm the **hero renders full-size and does not shrink on Gmail Mobile / paint on Apple Mail iPhone**;
re-confirm live stock on all 16 product pages at send time; confirm **SAFESTEP is created and ACTIVE in BigCommerce**
(no discount % supplied → none shown, §6.5).

---

## Draft v2 — 2026-07-20 (rework per user: no stair nosings, 16 products, themed promo, nav removed)
Authored as `Draft/SS-2026-W30-draft-v2.html`. **Status: NOT approved to send** — awaiting user review.
Keeps the "Every Step, Made Safe" slips/trips/falls direction but reworked to the user's W30 instructions.

**Changes vs v1:**
- **Removed ALL Anti-Slip Stair Nosing products** (now a permanent SS rule, CLAUDE.md §6.12) — 4 nosings dropped.
- **Grid rebuilt to 16 products**, three themed floor-safety groups: **Cover the cables (6)** ·
  **Guide the way underfoot (4 tactile)** · **See every blind corner (6 mirrors)**.
- **Removed the top header navigation** (nav is now opt-in, CLAUDE.md §6.11; user did not request one).
- **New themed promo panel** replacing v1's value strip: code **SAFESTEP**, "Valid until 28 July 2026 ·
  One-time use", W29 red-panel style. Genuine RRP strikethroughs retained on the 6 cable cards + carborundum plate.

**Products — all 16 verified In Stock on their own product pages 2026-07-20 (§5.1).**
Caught + excluded as **Out of Stock** on their product pages (category listings wrongly showed in stock):
Tactile Plate 300x300mm, Safety Convex Mirror Outdoor/Indoor 450mm, Safety Convex Mirror Outdoor/Indoor 600mm.

**⚠️ Promo code gate:** **SAFESTEP must be created and confirmed ACTIVE in BigCommerce before send** (SS BC API
not connected here, so it cannot be auto-verified). No discount % was supplied, so none is shown (not
fabricated, §6.5); set the discount when creating the code.

**Automated QA — PASS:** 36 unique https URLs, **0 non-200**; **16 product cards**; **0 stair-nosing
references**; **0 top-nav items**; anchors wrapping `<table>` = 0; image-anchors with `display:block` = 0;
imgs 17/17 with width+height; 0 em dashes in visible copy; `{% unsubscribe_link %}` intact; tags balanced
(table 68/68 · tr 70/70 · td 80/80 · a 39/39 · p 68/68).

**§8.1 gate (unchanged, required before send):** verify render + post-Klaviyo clickability on Klaviyo Preview ·
Gmail Web/Mobile · Apple Mail (iPhone) · Outlook; re-confirm live stock; confirm SAFESTEP active in BigCommerce.

---

## Draft v1 — 2026-07-20 (new Weekly send; theme: "Every Step, Made Safe")
Authored as `Draft/SS-2026-W30-draft-v1.html`. **Status: NOT approved to send** — awaiting user review.
Per CLAUDE.md §5.1.1 / §9: authored in `Draft/` only; **not** promoted to `Output/` (Output is reserved for the
user-approved production campaign). Reviewer/approver ≠ author (CR-16); approval not yet recorded (CR-17).

### Continuous-improvement baseline (§5.1.1)
Analysed the last approved send `Output/SS-2026-W29.html` ("Set Up a Safer Site" — vehicle/traffic-control,
flat 14-card grid, light-grey hero photo, unverified SITE15 coupon). W30 improves on it with:
- a **fresh theme** (slips/trips/falls — people on foot, not vehicles);
- a **new hero** (bold near-black panel + red accent, vs W29's grey framed photo);
- **grouped storytelling** (two themed blocks vs one flat grid) improving discovery + cross-sell;
- a **premium header nav** with per-item red underlines (§6.10; W29 was logo-only);
- **verified RRP markdowns** (up to ~55% off) replacing the unverified coupon — honest, no placeholder code.
Only 1 product carried over from W29 (Convex Mirror, fits the pedestrian blind-corner story); 9 are new.

### Products — verified on their own product pages 2026-07-20 (§5.1)
All 10 confirmed **In Stock**, current price, live URL 200, image 200 image/jpeg. SS BigCommerce API is not
connected, so each was checked on its **individual product page** (not category listings).
- **Caught + dropped:** *Stainless Steel Tactile Plate 300x300mm* showed "in stock" on the category page but
  **Out of Stock on its product page** — replaced with the Poly stair nosing (exactly the §5.1 trap).
- RRP shown as strikethrough only where confirmed on the page: Tactile Plate Carborundum ($120→$76.50),
  Cable Protector 2ch ($120→$33.21), Cable Protector 5ch ($135→$60.00), Cable Ramp ($33.50→$25.00).

### Automated QA — PASS
- **Links:** 26 unique https URLs, **0 non-200** (product pages, category pages, logo, privacy). `tel:`/`mailto:`
  and `{% unsubscribe_link %}` present and intact.
- **§6.6 email-safety:** anchors wrapping a `<table>` = **0**; image anchors with `display:block` = **0**;
  every `<img>` (11/11) carries both `width` and `height` attributes; structural full-width tables carry
  `width:100%` inline; product image = inline anchor around a block `<img>`, name/price in a separate anchor.
- **Tag balance:** table 53/53 · tr 56/56 · td 66/66 · a 31/31 · p 49/49.
- **Copy:** 0 em dashes in visible/intro copy (§6.2); remaining `—` occurrences are in **HTML comments only**
  (non-rendered). 0 unresolved `[[tokens]]`. No coupon code invented (§6.5).
- **Grid:** two balanced 2-col blocks (6 + 4 cards); equal-height cards via reserved `.pn/.pd/.pp` min-heights +
  `height:100%` cells + `valign="top"` (§6.8); mobile resets min-heights and stacks 1-up.

### ⚠️ OUTSTANDING §8.1 GATE (required before send — cannot be exercised in this environment)
Not yet rendered on real clients here. Before send, verify on **Klaviyo Preview · Gmail Web · Gmail Mobile ·
Apple Mail (iPhone) · Outlook**: hero + all product images render at full size; every product card, nav item,
hero CTA and value-strip CTA navigate to the correct live URL **after Klaviyo import** (Klaviyo rewrites links).
Re-confirm live stock at send time. Optional: supply a confirmed active SS coupon and/or an on-theme hero photo.

---

## Draft v12 — Trust/coupon/product enhancements (assessed 2026-08-01)

**Draft assessed:** `Draft/SS-2026-W30-draft-v12.html` (built from `SS-2026-W30-final.html` / `drafthtml1.html`, byte-identical base). Output synced (`Output/SS-2026-W30.html` + `-final.html`).

### Changes made (scope: enhancements only — hero, header, product grids, "Ideal for many environments" layout untouched)
1. **Trust section fully redesigned** (below coupon): red eyebrow "Why Australian businesses trust us" + heading "100,000+ Australian customers trust Safety Sector"; **5-card trust strip** (Australian Standards · Fast Australia-Wide Delivery · Trusted by 100,000+ Customers · Expert Product Advice · 30-Day Returns) — 5-up desktop / 2-up mobile (Cerberus hybrid + MSO ghost 5-col, reserved 180px cell height for equal-height cards, resets to auto on mobile); **4-stat metrics row**; **social proof** (★★★★★ 4.8/5, factual, no fabricated quotes/names); **contact card** (white, rounded, soft shadow) replacing "Got a question?" — "Need help choosing the right safety solution? / Talk to our Safety Specialists" with ☎ phone, ✉ email and a red **CONTACT US** button → `/contact-us/`; **subtle divider** before footer. White cards on #F7F7F7, 12–14px radius, SS red as small accent only (no red blocks). Icons are email-safe monochrome glyphs in a thin red-ringed badge (SVG is unusable in email).
2. **Coupon redesigned** — industrial-light: brushed-steel gradient panel (#f1f0ed, solid fallback), thin metallic border, soft shadow, subtle diagonal hazard-stripe top accent (red, solid-red Outlook fallback), white **dashed ticket chip** around the code. Coupon label, **GUARDZONE**, expiry (11 Aug 2026) and CTA unchanged. Not dark, minimal red.
3. **Barrier swap (bottom-left card)** — requested product `/expanding-safety-barriers/` = "Expanding Barrier 5 Metre" is **OUT OF STOCK** on its own product page, so per user decision it was **not** used. Replaced the in-stock White 3.5m with a different **in-stock** barrier: **Expandable Barrier 7.5 Metre — AUD $588.60** (`/Expandable-barrier-for-sale/`, image products/559/…AA__82019…). Keeps a lighter-toned product for grid balance; card dimensions/styling unchanged.
4. **Link correctness fix** — all 6 links that pointed at the OOS single product (`/expanding-safety-barriers/`: 4 environment images + coupon VML + coupon anchor) repointed to the live barrier **collection** `/expandable-barriers/`.
5. **Featured This Week** — left as-is per user decision (existing 6 verified complementary products: dock/wall bumpers ×4, convex mirrors ×2; no barriers).

### QA performed
- **Live verification (HTTP 200, no redirects, this session):** new barrier image (image/jpeg), `/Expandable-barrier-for-sale/`, `/expandable-barriers/`, `/contact-us/`. New barrier confirmed **In Stock** on its product page; the rejected 5 Metre confirmed **Out Of Stock**.
- **§6.6 containment:** 0 anchors wrap a `<table>`; 0 image-wrapping anchors carry `display:block`.
- **§8.2 ghost inspection:** 0 empty anchors, 0 `href="#"`/empty href, 0 literal `…`/`...`.
- **§8.3 size:** 65,051 bytes — well under Gmail's ~102 KB clip.
- **Tag balance:** table 58/58, tr 94/94, a 42/42 (td shows the same benign −1 grep delta as the already-shipped base, unchanged by these edits).

### Outstanding before SEND (not blocking Draft/Output preview — §4.1/§8.1)
- **Coupon code GUARDZONE** must be confirmed created + ACTIVE in BigCommerce (SS BC API not connected here). No discount % was supplied, so none is stated (not fabricated, §6.5).
- **Real-client render checks not runnable in this environment:** Klaviyo import + click-tracking, Gmail Web/Mobile (Android & iOS), Apple Mail (incl. iPhone), Outlook. Required manual pre-send: 5-card trust strip stacks 2-up cleanly on mobile; coupon gradient/stripe degrade acceptably in Outlook (solid panel + solid red bar); CONTACT US + coupon buttons render (VML) and click through; no white gutters/seams on the #F7F7F7 band.
- Re-verify the 4 barrier + 6 featured product pages are still in stock at send time.

**Status: NOT approved to send** (pending coupon activation + real-client QA + approval).

---

## drafthtml2 — lower-section refresh + email extension (assessed 2026-08-01)

**Draft assessed:** `Draft/SS-2026-W30-drafthtml2.html` (80,502 B). Built from the latest build (drafthtml1 + prior-turn refinements). **`drafthtml1.html` left unchanged (51,323 B); Output NOT overwritten** (65,051 B each) — per user instruction to preserve the current file and create a new draft for comparison.

### Changes
1. **Product grid (barriers):** bottom-left already the in-stock **Expandable Barrier 7.5 Metre ($588.60)** — kept (satisfies "not the White one; in-stock; complements the range").
2. **Featured This Week:** unchanged (existing 6 verified complementary products; no barriers).
3. **Coupon redesigned** — light industrial: brushed-steel gradient panel, thin metallic border, soft shadow, subtle hazard-stripe accent; dashed chip **replaced with an embossed brushed-steel coupon plate**. New hierarchy: eyebrow **EXCLUSIVE INDUSTRIAL OFFER** › **SAVE 15% ON SITE SAFETY** › code **SAFEACCESS** › "Valid until 11 August 2026 · One-time use" › supporting line "Protect your workplace while saving on Australia's trusted industrial safety solutions." CTA **SHOP EXPANDABLE BARRIERS** → `/expandable-barriers/`. Light, not dark.
4. **Trust section improved** — eyebrow "Why Australian businesses trust us" + heading "100,000+ Australian customers trust Safety Sector"; **5 cards** now: Australian Standards · Fast Australia-Wide Delivery · **Commercial Grade Quality** (was "Trusted by 100,000+ Customers"; gear icon; "Built for demanding industrial environments.") · Expert Product Advice · 30-Day Returns. **Four-checkmark metrics row removed** (reduced repetition). Social proof kept (★★★★★ 4.8/5; copy trimmed to "Trusted by Australian workplaces…"). Contact card kept ("Need help choosing the right safety solution? / Talk to our Safety Specialists", ☎/✉, CONTACT US → `/contact-us/`).
5. **NEW section "More site safety essentials"** (below Featured This Week) — 6 **verified in-stock**, non-barrier, non-duplicate cross-sell products via the existing card component:
   - Parking Bollard 140mm x 1200mm — $173.25 (/Parking-bollard-for-sale-Sydney/)
   - Removable Bollard – Twist Type — $170.00 (/surface-mount-removable-bollard-twist-type/)
   - Rubber Wheel Stop 1650mm — $45.00 (/rubber-wheel-stop-1650mm/)
   - Rubber Speed Hump – Mid Module — $104.50 (/traffic-calming-rubber-speed-hump-mid-module/)
   - Cable Protector – 4 Channel — $54.73 (/cable-protector-4-channel/)
   - Solar Battery Bollard — $110.00 (/solar-battery-bollard/)
   Rejected as **out of stock** during verification: Wheel Stop Australian Compliance, Stainless Steel Tactile Plate 300x300, Convex Mirror 450mm.

### QA performed (this session)
- **Live verification, HTTP 200 no-redirect:** all 6 new product images (image/jpeg) + their product pages (in stock). CTA collection `/expandable-barriers/` and `/contact-us/` 200.
- **§6.6:** 0 anchors wrap a `<table>`; 0 image-anchors with `display:block`. **§8.2:** 0 empty anchors, 0 `#`/empty href, 0 literal ellipsis. **§8.3:** 80,502 B — under the ~102 KB clip. Tags balanced (table 71/71, tr 124/124, a 60/60 = +18 for the 6 new cards). 16 product prices total.

### Before SEND (unchanged gate — not blocking preview)
- **Create + activate coupon SAFEACCESS (15% off) in BigCommerce** before send.
- Real-client QA not runnable here: Klaviyo import + click-tracking, Gmail Web/mobile (Android & iOS), Apple Mail iPhone, Outlook — especially the 5-card strip stacking 2-up, coupon plate/gradient degrading to solid in Outlook, VML buttons, and the longer email staying under the Gmail clip after Klaviyo's processing.
- Re-verify all 16 product pages in stock at send time.

**Status: NOT approved to send** (pending coupon activation + real-client QA + approval). Output still holds the previous build (drafthtml1/v12 content); tell me which draft to promote.

---

## drafthtml3 — trust re-focus, promo compaction, copy polish (assessed 2026-08-01)

**Draft assessed:** `Draft/SS-2026-W30-drafthtml3.html` (80,195 B). Built from drafthtml2. **drafthtml2 left unchanged (80,393 B); Output NOT overwritten** (65,051 B each) — new draft only, per instruction.

### Changes
1. **Trust cards re-focused on COMPANY trust** (no longer repeating the hero's product claims of Australian-owned/commercial-grade/fast-delivery/industrial/high-visibility/portable). New 5 cards: **Australian Owned** · **100,000+ Customers Served** · **Secure Checkout** · **Dedicated Safety Specialists** · **30-Day Returns** (each with the specified support line; icons ⚑ ★ ✓ ? ↺). Section title kept ("100,000+ Australian customers trust Safety Sector") but **heading reduced 21px → 17px (~19%)**. White cards, shadows, rounded corners, spacing and responsive behaviour unchanged; reserved card height unchanged so the section is not taller (slightly shorter).
2. **Promo section compacted** using draft-v11 spacing as reference: outer cell 14/34 → 16/12 padding; content cell 32/34 → 24/26; headline 26px → 24px with tighter margins; plate padding 15/34 → 13/30. **Supporting sentence "Protect your workplace while saving…" removed.** Code **SAFEACCESS**, EXCLUSIVE INDUSTRIAL OFFER, SAVE 15%, brushed-steel plate and CTA retained.
3. **Section headings rewritten** as engaging ecommerce copy with fewer hyphens:
   - "Our expandable barriers range" → **Expandable Barriers for Every Worksite** / "Portable access control that sets up in seconds, in four sizes to suit any space."
   - "Ideal for many environments" → **Protect High-Traffic Areas** / "From warehouses to construction sites, keep vehicles and people safely apart."
   - "Featured this week" → **This Week's Top Safety Picks** / "Pair your barriers with the impact protection and visibility your site needs."
   - "More site safety essentials" → **Complete Your Site Safety Setup** / "Bollards, wheel stops, speed humps and more to round out your workplace safety."
4. **Copy polish:** unnecessary hyphens fixed ("loading-dock" → "loading dock"; "car-park" → "car park"); valid compound adjectives (heavy-duty, all-weather, surface-mounted, 4-channel, after-hours, high-traffic) retained. Products, prices, links and layout structure unchanged from drafthtml2.

### QA performed
- **§6.6/§8.2/§8.3:** 0 anchors wrap a `<table>`, 0 image-anchors `display:block`, 0 empty anchors, 0 `#`/empty href, 0 OOS-product links; 80,195 B (under the ~102 KB clip). Tags balanced (table 71/71, tr 124/124, a 60/60). 16 product prices. Product set unchanged (images/pages already verified in-stock this session).

### Before SEND (unchanged gate)
- Create + activate coupon **SAFEACCESS (15%)** in BigCommerce.
- Real-client QA not runnable here (Klaviyo import, Gmail mobile Android/iOS, Apple Mail iPhone, Outlook): 5-card strip stacking, coupon plate degrading to solid in Outlook, VML button, longer email under the Gmail clip.
- Re-verify all 16 product pages in stock at send time.

**Status: NOT approved to send.** Three drafts now exist for comparison (drafthtml1, drafthtml2, drafthtml3); Output still holds the earlier build — tell me which to promote.
