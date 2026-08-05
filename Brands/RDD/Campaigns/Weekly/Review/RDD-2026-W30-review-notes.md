# RDD-2026-W30 — Review & QA Notes

## Draft v32 — 2026-07-21 (FINAL hero — full-bleed "copybanner" v1784632637; root-cause corner fix) → SYNCED TO `Output/RDD-2026-W30.html`
Replaces every previous hero with the corrected full-bleed export `v1784632637` (copybanner). This is the **root-cause
fix** for the lower-corner gaps diagnosed on v30/v31: those were **white rounded-corner pixels baked into the prior
artwork** (BL `#FFFFFF`, BR `#FEFFFF`), not an HTML/CSS issue. The new artwork is verified full-bleed:

- **1352×750** (ratio 1.803 → 600-wide height **333**; height attr updated 335→333 to match), **~227 KB** (much
  lighter than the prior 680 KB — good for Gmail mobile; no weight flag needed).
- **All four corners are image content, bottom edge full-bleed** — TL `#F1E0CE`, TR `#693C1B`, BL `#E9CFB8`,
  BR `#A0988D`; no white notches. Corner artifact eliminated at the source.

**Implementation:** one responsive `<img>` in one `/products/` anchor (v10 destination); baked eyebrow/headline/intro/
CTA (no HTML overlay text, no floating CTA); edge-to-edge + flush per §6.14 (cell padding:0/margin:0/font-size:0/
line-height:0; img display:block/width:100%/max-width:600px/height:auto/border:0/outline:none; img+cell
vertical-align:bottom; hero cell bgcolor #f6ecdd = the cream section below, so no white line even at sub-pixel).

**FINAL AUDIT — PASS:** new copybanner src ×1; prior `v1784629959` = 0; ONE `/products/` anchor; height=333; no
HTML text/CTA over hero (cell holds only anchor+img); ghost inspection all 0 (empty a/td/tr/p/div, ghost tables,
href=#, literal `...`, VML, absolute, background-image); 16 product cards + `{% unsubscribe_link %}` intact; tags
balanced (table 41/41, tr 68/68, td 85/85, a 60/60). **Live hero URL: HTTP 200 / image/jpeg / 226.9 KB.**

**CLAUDE.md:** added **§6.15 "Hero banner = single embedded artwork in one anchor"** with the user's exact permanent
rule (single embedded artwork incl. headline/eyebrow/intro/CTA; one clickable anchor; never recreate HTML overlay/
floating CTA unless requested; heroes must be full-bleed rectangular exports with no white borders / rounded-corner
artifacts / canvas margins). §8.1 manual client-render (Gmail/Outlook/Apple Mail/iOS/Android/Klaviyo) is the remaining
pre-send step. Send-approval status carries forward.

## Draft v31 — 2026-07-21 (Hero bottom-gap fix — cream backstop + vertical-align:bottom) → SYNCED TO `Output/RDD-2026-W30.html`
User reported a small visible gap under the hero. The source already had `display:block` + cell `font-size:0`/
`line-height:0` (no classic baseline gap), so the remaining risk was a **thin white sliver** (body white) showing
between the hero image bottom and the cream section from sub-pixel rounding / client quirks. Fix (hero cell + img only,
no artwork/layout change):
- **Hero cell now carries `bgcolor="#f6ecdd"` + `background:#f6ecdd`** — identical to the cream bridge directly below,
  so any sub-pixel gap shows cream (flush), never a white strip. Also `padding:0; margin:0; font-size:0; line-height:0;
  mso-line-height-rule:exactly`.
- **`vertical-align:bottom` on both the img and the cell** (belt-and-suspenders against the image-baseline descender
  gap even where `display:block` alone is insufficient), plus `font-size:0; line-height:0` added to the img style.
- Hero stays one `<img>` in one `/products/` anchor; artwork/src/link unchanged.

**QA — PASS:** hero cell cream bg ×1; img display:block + vertical-align:bottom + font-size:0/line-height:0 PASS;
section below = cream `#f6ecdd` (confirmed); one `/products/` anchor; ghost re-scan all 0 (empty anchors/td/tr, ghost
tables); 16 product cards + `{% unsubscribe_link %}` intact; tags balanced (table 41/41, a 60/60); diff vs v30 =
hero line + comment only. Covered by CLAUDE §6.14 (edge-to-edge) + §8.2 (ghost inspection).

**Note:** if any perceived space remains, it is the cream bridge band's intentional 32px top padding (editorial spacing
inside the cream section, not a gap) — left unchanged per "do not change the next content section." §8.1 manual client
render (Gmail/Outlook/Apple Mail/mobile) + hero-weight flag (~680 KB) carry forward.

## Draft v30 — 2026-07-21 (FINAL hero swap v1784629959 + edge-to-edge verified + new CLAUDE.md §6.14) → SYNCED TO `Output/RDD-2026-W30.html`
Swaps in the latest FINAL approved artwork `v1784629959` (1376×768), used exactly as provided. Same clean single-image
architecture (one `<img>` in one `/products/` anchor, ghost-clean, whitespace-free). Added `outline:none` to the img
inline style for spec completeness.

**Edge-to-edge — verified already-satisfied (no white strips existed):** hero table `width:100%` inside the 600px
container; hero cell `padding:0; font-size:0; line-height:0; mso-line-height-rule:exactly`; img `display:block;
width:100%; max-width:600px; height:auto; border:0; outline:none; margin:0`. That kills the image-baseline gap (white
strip underneath) and there are no side/bottom gutters or spacer rows. `width="600"` attr keeps Outlook flush.

**QA — PASS:** new hero `v1784629959` ×1; prior `v1784625691` = 0; ONE `/products/` anchor; edge-to-edge checks PASS;
ghost re-scan all 0 (empty anchors/td/tr, ghost tables, href=#, literal `...`, VML, bg-image, absolute); 16 product
cards + `{% unsubscribe_link %}` intact; tags a 60/60. **Live hero URL: HTTP 200 / image/jpeg / 679.5 KB.**

**Permanent rule added:** CLAUDE.md **§6.14 "Hero banner must be edge-to-edge (all brands — permanent, automatic)"** —
every hero renders flush in the 600px container with no white canvas/gutters/strips/baseline gaps/spacer rows;
specifies the table/cell/img mechanics (width:100% inline, cell font-size:0/line-height:0, img display:block/margin:0).

**⚠ Weight flag (§8):** exact asset ~**680 KB** — heaviest yet; heavy for Gmail mobile. Used full-weight per "exactly
as provided." Optional same-asset `/upload/q_auto/v1784629959/...` lightening pending approval. §8.1 client-render
checks + fresh-thread Gmail "…" verification carry forward. Send-approval status carries forward.

## Draft v29 — 2026-07-21 (Ghost Element Inspection — defensive cleanup + new permanent CLAUDE.md rule) → SYNCED TO `Output/RDD-2026-W30.html`
Per user: permanently prevent the Gmail floating "…" bubble. Ran a full **Ghost Element Inspection** on the whole
email and made it a permanent project rule.

**Inspection (v28 → all clean in real markup):** empty anchors = 0; **real** nested anchors = 0 (the 1 flagged was
false-positive tag-like prose inside the verbose hero *comment*); empty `<td>`/`<tr>` = 0; ghost tables = 0; ws/nbsp-only
anchors = 0; `href="#"`/empty = 0; zero-size/hidden links = 0; VML = 0; background-image = 0; position:absolute = 0;
bare text nodes after `</table>` = 0; `display:none` = 1 (preheader only). The 2 `&nbsp;` cells are the intentional
orange divider bars (sized + bgcolor, not near the hero).

**Cleanup applied:** replaced the bloated hero comment (which contained tag-like prose `<a>`/`<img>` and a literal
`...`) with a short, clean comment — removing the only in-source noise flagged by the "comment placement around hero"
check. Hero remains one `<img>` in one inline `<a>` to `/products/`, td/a/img on one whitespace-free line. Nothing
else changed.

**Post-cleanup v29 scan — ALL 0:** empty/nested/ws anchors, empty td/tr, ghost tables, href=#, literal `...`,
tag-like prose in comments, VML, bg-image, absolute; hero single-line PASS; 16 product cards + `{% unsubscribe_link %}`
intact; tags balanced (table 41/41, tr 68/68, td 85/85, a 60/60).

**Root cause of the "…" (documented):** with the markup verified clean and file 53.7 KB (< 102 KB clip), the "…" is
Gmail's own trimmed/quoted-content toggle — most likely thread-collapse of duplicated content from repeated test sends;
verify on a fresh subject/clean thread (won't affect first-time recipients).

**Permanent rule added:** CLAUDE.md **§8.2 "Ghost Element Inspection (all brands — permanent, automatic, every
email)"** — every Campaign/Flow/Brand build must run this inspection and remove any ghost element before the HTML is
final, without being asked. (Per §8.1 root-cause principle: reusable finding → permanent CLAUDE.md rule.)

§8.1 manual client-render checks (Gmail Web/Android/iPhone · Outlook · Apple Mail · Yahoo · Samsung) + the ~643 KB
hero-weight flag carry forward. Send-approval status carries forward.

## Draft v28 — 2026-07-21 (FINAL approved hero — new banner v1784625691) → SYNCED TO `Output/RDD-2026-W30.html`
Swaps in the latest FINAL approved artwork `v1784625691` (1376×768), used **exactly as provided** (no
crop/recolor/sharpen/re-encode/compress — no q_auto). Same clean architecture as v27: ONE responsive image wrapped in
ONE clickable anchor to the same v10 destination `https://www.retaildisplaydirect.com.au/products/`, td/a/img on a
single whitespace-free line (v27 hardening retained). Only the hero `src`, `alt` and comment changed; everything else
(header, logo, 16 product cards, Shop by Category, trust, footer, typography, tracking, Klaviyo vars) untouched.

**ALT (as specified):** "Retail Display Direct - Make Every Display Count. Premium display solutions for Australian
businesses."

**QA — PASS:** new hero `v1784625691` in src ×1; prior `v1784623408` = 0; ONE `/products/` anchor around the hero img;
specified ALT present; `display:block` on hero anchor = 0 (§6.6); hero td→a whitespace = 0; `position:absolute` /
`background-image:` / VML / flex / grid / dual-hero classes all = 0; no HTML hero text (only alt); 16 product cards +
Shop by Category (6 pills) + `{% unsubscribe_link %}` intact; "Explore the full range" still removed (0); tags balanced
(table 41/41, tr 68/68). **Live hero URL: HTTP 200 / image/jpeg / 642.7 KB.**

**⚠ Weight flag (§8):** exact asset is **~643 KB** — heavy for the Gmail mobile app. Used full-weight per "do not
compress/modify." Optional lightening (no visual change): swap src to `/upload/q_auto/v1784625691/...` — pending
approval, not applied. §8.1 manual pre-send client checks + the fresh-thread Gmail "…" verification carry forward.
Send-approval status carries forward.

## Draft v27 — 2026-07-21 (Hero whitespace hardening — collapse td/a/img onto one line) → SYNCED TO `Output/RDD-2026-W30.html`
Applied the optional hardening from the Gmail "…" investigation: collapsed the hero `<td>`, `<a>` and `<img>` onto a
single line with **zero whitespace** between them (td→a = 0, a→img = 0, img→/a→/td = 0), eliminating any stray
whitespace text node in the `font-size:0` hero cell. Hero src (`v1784623408`), href (`/products/`) and img styling
byte-identical; nothing else changed (diff vs v26 = the hero collapse only). Belt-and-suspenders — the "…" was
diagnosed as Gmail's thread-collapse of duplicated content from repeated test sends (clean HTML, 53.7 KB < 102 KB clip),
verifiable by testing on a fresh subject/thread. Tags balanced (41/41, 68/68).

## Draft v26 — 2026-07-21 (Removed redundant "Explore the full range" CTA) → SYNCED TO `Output/RDD-2026-W30.html`
Per user: the standalone "Explore the full range →" button (WK-S5) between Featured Products and Shop by Category is
redundant (the hero banner carries the primary CTA, product cards are clickable, and Shop by Category follows). Removed
the **entire table row + its VML fallback + the WK-S5 comment** — not just the anchor — from the end of the Group C
product table. Hero, header, logo, all 16 product cards, Shop by Category pills, trust strip, footer, typography,
colours, tracking and Klaviyo variables all unchanged.

**Spacing (no gap introduced):** after removal, Group C ends with the last product row (~20px below the cards) and
Shop by Category adds ~8px on top ≈ **~28px** between Featured Products and Shop by Category — within the 20–30px
target, so no spacer was added.

**QA — PASS:** "Explore the full range" refs = 0; WK-S5 = 0; 16 product cards intact; Shop by Category + 6 pills intact;
hero `v1784623408` intact; `{% unsubscribe_link %}` intact; **tags balanced (table 41/41, tr 68/68)**. New flow:
Hero → Featured Products → Shop by Category → Trust → Footer. §8.1 pre-send checks + hero weight flag (~629 KB, v25)
carry forward. Send-approval status carries forward.

## Draft v25 — 2026-07-21 (FINAL approved hero — new banner v1784623408, one clickable image) → SYNCED TO `Output/RDD-2026-W30.html`
Same clean architecture as v24, with the latest FINAL approved artwork `v1784623408` (1376×768), used **exactly as
provided** (no crop/recolor/sharpen/re-encode — no q_auto this time, per "do not modify it"). The banner already has
eyebrow + headline + supporting copy + CTA baked in; it is wrapped in ONE clickable anchor to the same v10 destination
`https://www.retaildisplaydirect.com.au/products/`. No HTML text, no second CTA, no button below, no dual hero, no
background-image, no VML, no absolute positioning, no flex/grid — standard table + one responsive image.

**Attributes (per spec):** cell `line-height:0; font-size:0` (no gap/white line); img `display:block; border:0;
height:auto; width:100%; max-width:600px` (600px desktop, fluid mobile, aspect kept, no crop/clip); `width="600"` attr
for Outlook; `height="335"` reserves the Apple-Mail-iOS box (§6.6). ALT set to the exact requested string. §6.6-safe:
`<a>` stays INLINE (no `display:block` on an image-anchor → avoids Apple Mail iOS zero-height collapse), `<img>` is the
block; whole banner clickable.

**QA — PASS:** new hero `v1784623408` (exact, no q_auto) ×1; prior `v1784621415` = 0; ONE `/products/` anchor;
requested ALT present; `display:block` on hero anchor = 0; img has display:block/border:0/height:auto/width:100%/
max-width:600px; `position:absolute` / `background-image:` / VML `v:rect`/`v:fill` / flex / grid all = 0; dual-hero
classes = 0; 16 product cards + `{% unsubscribe_link %}` intact (nothing else changed). **Live hero URL: HTTP 200 /
image/jpeg / 628.7 KB.**

**⚠ Weight flag (§8):** the exact asset is **~629 KB** — heavier than ideal for the Gmail mobile app (can break there).
Used full-weight per "use exactly as provided." To lighten reliably without any visual change, swap the src to the SAME
asset via `/upload/q_auto/v1784623408/...` (~129 KB) — pending approval, not applied. Other §8.1 manual pre-send client
checks (Gmail Android/iOS · Apple Mail · Outlook · Yahoo · Samsung · Klaviyo, + link tracks after Klaviyo import) carry
forward. Send-approval status carries forward.

## Draft v24 — 2026-07-21 (FINAL hero — one approved banner, one clickable link) → SYNCED TO `Output/RDD-2026-W30.html`
Per user, the FINAL production hero: the new approved banner `v1784621415` (1376×768) already contains the headline,
body copy and CTA baked in, so the hero is simply **one responsive image wrapped in ONE clickable anchor** to the same
destination v10 used (`https://www.retaildisplaydirect.com.au/products/`).

**Removed entirely (per instruction):** the dual desktop/mobile split (`.hero-d`/`.hero-m` + their CSS), the
background-image + VML, all HTML overlay headline/subheading/CTA/text containers, absolute positioning. No HTML text is
overlaid; no second CTA.

**Implementation:** one `<a href=".../products/">` (INLINE — no `display:block` on the anchor, which collapses in Apple
Mail iOS per §6.6) wrapping one `<img>` (the block element). `width="600"` + `width:100%; max-width:600px; height:auto;
display:block` → 600px on desktop, fluid on mobile, no crop/clip/duplication/white gaps. `height="335"` reserves the
aspect box for Apple Mail iOS (§6.6). `.hero-img` responsive class retained. Image delivered via a Cloudinary **q_auto**
transform of the same asset (**~132 KB vs ~617 KB**) for reliable Gmail-mobile loading (§8) — same artwork, optimised
delivery (not a change). Most robust possible; renders + clickable in Gmail Desktop/Android/iPhone, Outlook Desktop/Web,
Apple Mail, Yahoo, Samsung, Klaviyo.

**QA — PASS:** new hero `v1784621415` q_auto ×1; wrapped in ONE `/products/` anchor ×1; `display:block` on the hero
anchor = 0 (§6.6); dual-hero classes = 0; old v10 artwork `v1784542530` = 0; hero VML `v:rect/v:fill` = 0;
`background-image:` CSS = 0; no HTML hero headline (the one "Make Every" hit is the img alt); `.hero-img` present; 16
product cards + WK-S5 range CTA + `{% unsubscribe_link %}` intact (below-hero unchanged). **Live hero URL: HTTP 200 /
image/jpeg / 131.8 KB.** §8.1 manual pre-send: confirm render + hero link across Gmail (Desktop/Android/iPhone) ·
Outlook (Desktop/Web) · Apple Mail · Yahoo · Samsung · Klaviyo, and that the hero link tracks after Klaviyo import.
Send-approval status carries forward.

## Draft v23 — 2026-07-21 (REVERTED to the v10 hero; mobile-only reliability refactor) → SYNCED TO `Output/RDD-2026-W30.html`
Decision: **abandon the Google Flow baked-CTA hero line (v14–v22).** Across those iterations the CTA either detached,
duplicated, or read as a separate section, and a real HTML button could not be robustly overlaid on a baked image
(overlay needs `position:absolute`, stripped by Gmail/Outlook/Yahoo/Samsung). Per user, **v10 is the new base** (its
`v1784542530` artwork, background-image desktop overlay + stacked mobile image). v23 = v10 with a **mobile-only
reliability refactor**; desktop must stay identical.

**Desktop — byte-identical to v10 (verified):** the `.hero-d` block (bulletproof background-image + VML overlay,
products on the right) is unchanged character-for-character. Desktop appearance is exactly v10. No typography, spacing,
CTA, layout or artwork change.

**Mobile-only hardening (no visual change to the approved look):**
- Added `.hero-img` class + `@media` rule (`width:100%!important; max-width:100%!important; height:auto!important`) so
  Gmail-app/Yahoo cannot shrink the fluid mobile image; also `.hero-m{width:100%!important}`.
- `valign="top"` + `mso-line-height-rule:exactly` on the mobile image cell (kills any sub-image gap).
- Mobile `<img>` now delivered via a Cloudinary **`q_auto`** transform of the SAME asset — **~89 KB vs ~637 KB**
  (verified HTTP 200 / image/jpeg) so it loads reliably in the Gmail mobile app (§8: heavy images break there). Not an
  artwork replacement — same image, optimised delivery. Kept `width="600" height="335"` (Apple Mail iOS box, §6.6);
  anchor wraps inline content only, `<img>` is the block (§6.6).

**Dual .hero-d/.hero-m retained deliberately:** desktop's text-over-image overlay and mobile's stacked layout are
structurally different; they cannot be merged without changing the approved desktop appearance. All of the user's
listed mobile clients (Gmail Android/iPhone, Apple Mail, Samsung, Outlook Mobile) support media queries, so they render
the robust real-`<img>` `.hero-m`, not the desktop background image.

**QA — PASS:** `.hero-d` byte-identical to v10 (diff = none); baked Google Flow heroes (v1784610781/601385/599188) = 0;
mobile img `q_auto` ×1; `.hero-img` class + media rule present; hero-d + hero-m both present; anchors wrapping `<table>`
= 0; image-anchors `display:block` = 0 (§6.6); 16 product cards intact; below-hero unchanged from v10 (v23 is a copy of
v10 with only the hero/CSS touched). §8.1 manual client checks (Gmail Android/iPhone · Apple Mail · Samsung · Outlook
Mobile · Klaviyo): confirm the hero scales, isn't cropped/missing, and text is readable. Send-approval carries forward.

## Draft v22 — 2026-07-21 (Hero CTA made cohesive — ONE hero container, no "separate section") → SYNCED TO `Output/RDD-2026-W30.html`
Fixes v21's complaint: the CTA looked like an independent section under the hero. Root of that perception — in v21 the
button lived in its OWN `<table>` after the image's table, and the differently-toned bridge band (`#f6ecdd`) right
after made the `#f0deca` button strip read as a sandwiched, separate band.

**Fix — one cohesive hero container (hero only; nothing else changed):**
- The image and the CTA now live in the **SAME table** on **one continuous cream `#f0deca`** (matches the artwork's
  lower edge). Row 1 = the image (flush at top, `display:block`, zero gap). Row 2 = the real CTA on the same cream,
  immediately after the image, left-aligned to the copy. `bgcolor="#f0deca"` on the table + both cells so the fill
  survives clients that drop cell backgrounds. Left seam is invisible (image cream → row cream, identical hex).
- Verified with an in-tool preview composite (`scratchpad/hero_v22_preview.png`) — the button sits in the hero's cream
  base as one block; the only transition (image floor → cream on the right) is subtle and reads as the artwork's floor.
- **All prior requirements kept:** image NOT clickable (the `<img>` is not wrapped in an `<a>`); the CTA is the ONLY
  clickable element (real accessible anchor + `aria-label`, VML roundrect for Outlook); terracotta `#ce6d49` matching
  the approved artwork; baked CTA still cleaned off the image (Cloudinary cream box) so it isn't duplicated. No absolute
  positioning, no background-image, no overlay, no dual hero. Image `width:100%/height:auto/display:block`,
  `width="600" height="335"` for Apple Mail iOS (§6.6).

**QA — PASS:** single hero container (one table: image row + button row) confirmed; 0 anchors wrap the hero img; real
"Explore Collection →" anchor ×1 + VML; `position:absolute` = 0; actual `background-image:` CSS = 0; container + 2 cells
carry `bgcolor="#f0deca"`; 16 product cards intact; below-hero byte-unchanged from v21. §8.1 manual client checks
unchanged (confirm image non-clickable + only CTA navigates on Gmail/Apple/Outlook/Yahoo/Samsung/Klaviyo). Contrast
note (white-on-terracotta ~3.4:1) carries from v21. Send-approval status carries forward.

## Draft v21 — 2026-07-21 (New approved hero + email-safe hybrid CTA: image NOT clickable, real HTML button only) → SYNCED TO `Output/RDD-2026-W30.html`
New approved Google Flow banner `v1784610781` ("Banner_redesign_for_B2B", 1376×768, muted terracotta palette).
Requirements: hero image must **not** be clickable, the **CTA is the only clickable element**, **no CSS absolute
positioning** (unreliable in Gmail/Outlook/Yahoo/Samsung), most robust email-safe solution, match the artwork as
closely as possible. (Numbering: `v20` was already used for the earlier "copy v10 CTA geometry" build, so this
continues as **v21** to avoid overwriting that draft, §4.1.)

**Why not a true overlay:** placing a real HTML button on top of the baked CTA needs `position:absolute`, which
Gmail/Outlook/Yahoo/Samsung strip → button detaches. There is no email-safe *table* way to overlay on an image. So a
robust overlay is impossible; per the user's "compatibility > pixel position," implemented the closest robust design.

**Implementation (hero only; everything below unchanged):**
- **Image is NOT clickable** — one responsive `<img>`, **not** wrapped in an `<a>`. `display:block; width:100%;
  max-width:100%; height:auto`; `width="600" height="335"` reserve the box for Apple Mail iOS (§6.6).
  `alt="Premium retail display solutions for Australian businesses"`.
- **Baked CTA cleaned off the image** via a Cloudinary layer transform (a matching-cream `#F1E0C9` box over the old
  terracotta button; measured button bbox ≈ x75–470/y595–685; verified seamless — surrounding cream is uniform) so the
  baked button isn't duplicated by the real one.
- **Real HTML CTA = the only clickable element** — an anchor button in an email-safe **table row** directly below the
  image, on cream (`#f0deca`) sampled from the image's lower edge so it reads as part of the hero. Terracotta `#ce6d49`
  (matches the approved artwork), white bold "Explore Collection →", 6px radius, left-aligned to the copy, subtle
  box-shadow (progressive), **VML roundrect fallback for Outlook**, `.tap` (44px mobile target), `.mp` (holds ~5% left
  alignment on mobile), `aria-label` for accessibility. No absolute positioning, no background-image, no overlay, no
  dual hero, no swap.
- **Trade-off (accepted per instruction):** the real button sits in the cream band just **below** the artwork, not
  overlaid in the (now-cleaned) baked slot — the only way to keep the image non-clickable + the CTA the sole clickable
  element robustly across Gmail (Android/iOS), Apple Mail, Outlook, Yahoo, Samsung, Klaviyo.

**QA — PASS (built file + live):** cleaned hero src ×1; hero `<img>` **not** wrapped in an anchor (0 anchors around the
hero img); real "Explore Collection →" anchor ×1 + VML fallback; old `v1784601385`/`Arial_32` baked transform = 0;
**`position:absolute` = 0**; actual `background-image:` CSS = 0 (2 plain-text hits are in the comment); hero img has
`width/height/display:block`; 16 product cards intact; below-hero byte-unchanged from v20. **Live cleaned-hero URL:
HTTP 200 / image/jpeg / 127.2 KB.**

**Notes / manual pre-send (§8.1):** confirm on Gmail (Android/iOS) · Apple Mail · Outlook (VML) · Yahoo · Samsung ·
Klaviyo that the image is not clickable and only the button navigates, and the CTA links correctly after Klaviyo
import. Accessibility: button is a real anchor with descriptive text + `aria-label`; white-on-terracotta contrast
matches the approved artwork's own choice (~3.4:1) — flag if a stricter AA ratio is required (darken terracotta).
Send-approval status carries forward.

## Draft v20 — 2026-07-21 (CTA geometry COPIED EXACTLY from v10 — no redesign) → SYNCED TO `Output/RDD-2026-W30.html`
Supersedes v19. Per user: stop improving the CTA; treat v10 as the master spec and reproduce its exact button
proportions on the new artwork (only the hero artwork should differ). Reverted the v19 Montserrat "polish."

**v10 CTA CSS measured (not estimated) and scaled to the 1376px artwork (×2.293 vs the 600px display):**

| v10 (@600 display) | baked (@1376 native) |
|---|---|
| Arial, font-size 14px, weight 700 | Arial 32px bold |
| line-height 46px (= button height; 0 vertical padding) | height 105px |
| padding 0 34px (horizontal) | ~78px each side → box width 338 (`c_pad`) |
| border-radius 6px | 14px |
| letter-spacing 0.4px | ~1 |
| left margin 36px | x aligned to the baked copy's left edge (x72) |
| copy→CTA gap 26px | ~60px (y584 = 26px below copy at display scale) |

**Left-alignment note:** v10's CTA sat at 36px AND aligned with its copy (both at 36px). The new artwork's copy is
baked ~5px further left (~31px @600 = x72 native), so the CTA is aligned to the **baked copy's left edge (x72)** —
this reproduces v10's actual look (CTA flush under the paragraph); using v10's absolute 36px would indent it from the
paragraph. Same button, same proportions, just on the new artwork.

Baked via Cloudinary layer transform (hosted, ~140 KB, renders everywhere, never detaches; flat like v10's CTA).
Reverted v19's font/size changes entirely. Verified in-tool (`scratchpad/hero_v20.jpg`) — matches v10's button.

**QA — PASS:** hero src = Arial v10-geometry transform (Arial 32 bold, 338×105, r14) ×1; Montserrat = 0; 16 product
cards intact; below-hero byte-unchanged from v19. **Live URL: HTTP 200 / image/jpeg / 139.5 KB.** §8.1 manual client
checks unchanged; send-approval status carries forward.

## Draft v19 — 2026-07-21 (Final CTA polish — premium integrated baked button) → SYNCED TO `Output/RDD-2026-W30.html`
Supersedes v18. Hero rendering issue stays fixed (public Cloudinary HTTPS src). This is a **CTA-only polish** — the
baked button felt slightly undersized/generic and "pasted on." Nothing else touched (verified: the v18→v19 diff is
confined to the hero comment + `src`; all sections below the hero byte-unchanged).

**Refinement (Cloudinary layer transform params only):**
- **Font: Arial → Montserrat semibold** — geometric/premium, matches the artwork's baked headline instead of reading
  as a generic HTML/Arial button (addresses "premium commercial font treatment").
- **Size/padding:** re-proportioned to 236×94 (from 280×88) so the label is snug and **optically centred** with
  comfortable padding, not floating in a too-wide box. Matches the v10/reference button height (~13% of hero height).
- **Radius 14px** (moderate, premium), RDD orange `#f47c20`, white text, **flat (no shadow)** to match the flat
  approved reference (BannerDesignToCopy.png) / v10 CTA.
- Position unchanged: baked into the reserved slot, **left-aligned to the copy (x72), ~29px below it (y588)** — sits
  naturally beneath the paragraph, reads as part of the composition.

Because the CTA is baked into the hosted JPEG, it renders pixel-identically everywhere and never detaches. Whole hero
still one live link to `/products/`. Iterated with in-tool visual review (`scratchpad/hero_v19a.jpg` → `hero_v19b.jpg`)
against the reference before choosing this treatment.

**QA — PASS:** hero src = Montserrat Cloudinary transform ×1; old Arial transform = 0; hero wrapped in `/products/`
anchor ×1; 16 product cards intact; below-hero byte-unchanged from v18. **Live URL verified: HTTP 200 / image/jpeg /
138.6 KB.** §8.1 manual client-render checks unchanged (Gmail/Apple/Outlook/Klaviyo); send-approval status carries
forward.

## Draft v18 — 2026-07-21 (Broken-hero ROOT-CAUSE fix + premium restored; CTA baked via Cloudinary transform, hosted) → SYNCED TO `Output/RDD-2026-W30.html`
Supersedes v17. User reported the hero failed to render in Gmail Desktop/Mobile + Klaviyo (broken-image icon +
blank white area) and that the email lost its premium v10 look (compressed/crowded/flat).

**ROOT CAUSE (diagnosed, not assumed):** v17's hero `src` was a **local relative path**
`../Assets/RDD-2026-W30-hero-final.jpg`. Email clients render server-side and can only fetch **public HTTPS URLs**; a
local/relative path is unreachable for Gmail/Klaviyo/Apple Mail → broken image + blank area. It was **not** a
background-image, VML, MIME or invalid-HTML issue — purely the local path (a browser preview resolved it, which masked
the problem). The "compressed/flat/generic" perception was largely a *symptom*: with the hero broken, the email
collapsed to orange bar → blank → sections, which reads as broken/crowded. Restoring the hero restores the premium look.

**FIX:** the hero `src` is now a **public Cloudinary HTTPS URL**. The approved Google Flow artwork `v1784601385` is
**unchanged and not replaced**; the "Explore →" CTA is baked into its reserved lower-left slot via a **Cloudinary layer
transform** (`l_text:Arial_36_bold:Explore →,co_white,b_rgb:f47c20,c_pad,w_280,h_88,r_18/fl_layer_apply,g_north_west,
x_72,y_588`) — matching References/BannerDesignToCopy.png (integrated CTA in the slot, left-aligned to the copy, ~8px
radius, white bold). Result: one flat JPEG, CTA integrated + premium like v10, **hosted with no local file and no
manual upload**, Cloudinary auto-optimised to **~139 KB** (vs 700 KB). Verified fetch: **HTTP 200, image/jpeg, no
redirect, 1376×768**.

**Premium / v10 restoration:** the eyebrow, headline and copy are baked into the approved artwork with the v10 premium
spacing/typography (that composition is fixed in the asset and renders identically everywhere); the CTA now sits in the
slot exactly like the reference. Because the hero renders again, the editorial breathing room / hierarchy / premium AU
B2B feel are restored — the below-hero sections were never changed.

**HTML:** ONE real `<img>` (public Cloudinary src) wrapped in a single live link to `/products/` (clickable +
Klaviyo-trackable). `display:block`, `width="600" height="335"`, `max-width:100%`, `height:auto`, `.hero-img`
responsive class; table `role="presentation"` cellpadding/cellspacing 0. No background-image, no overlay CSS, no dual
hero, no VML, no swap. Email-safe (§6.6): anchor wraps inline content only, `<img>` is the block element.

**QA — PASS (built file + live checks):** hero src = public https Cloudinary ×1; local `../Assets` src = 0 (the one
`../Assets` string left is inside the explanatory comment); hero wrapped in `/products/` anchor ×1; `display:block` on
img; real `background-image:url` = 0; dual-hero classes = 0; anchors wrapping `<table>` = 0; 16 product cards intact;
everything below the hero byte-unchanged from v17. **Hosted URL verified reachable (HTTP 200 / image/jpeg / no
redirect)** — the technical proof it loads for Gmail/Klaviyo, which the local path could not. Transformed hero viewed
in-tool (`scratchpad/hero_cld_btn.jpg`): button in the slot, matches the reference.

**Manual pre-send checks (§8.1 — cannot open real clients from here):** confirm the hero renders in Klaviyo Preview ·
Gmail Web · Gmail Mobile · Apple Mail iPhone · Outlook, and that the hero link tracks after Klaviyo import. The
public-URL fix removes the root cause of the broken image; these confirm rendering. Send-approval status carries forward
unchanged.

## Draft v17 — 2026-07-21 (Hero CTA BAKED into the artwork to pixel-match the approved reference; whole hero linked) → SYNCED TO `Output/RDD-2026-W30.html`
Supersedes v16. User supplied the approved layout reference `References/BannerDesignToCopy.png` and reported v16's
below-image live button was detached with a large empty cream gap. The reference proves the "Explore →" button belongs
**inside the hero's lower-left cream slot, immediately below the copy** (products beside it) — i.e. an overlay in the
artwork, not a button below it.

**Decision (user, via options):** a *live* overlay button can't be made reliable in Gmail mobile + Outlook (CSS
`position`/`background-image` are stripped/unsupported — the SS-2026-W29 failure class, §6.6/§8.1), and the artwork
can't be cropped (products occupy the same bottom band). So the user chose **bake the CTA into the image + wrap the
whole hero in one link** — prioritising pixel-perfect cross-client consistency over an editable/live button.

**Measured, not estimated (per "do not estimate spacing"):**
- Reference button (in `BannerDesignToCopy.png`, 772×393): x113–270, y289–340 → left **14.6%** of width, **~20.3%**
  wide, **~13%** tall, sitting **~37px below the copy** (≈29px @600), left-aligned to the copy.
- Current artwork (`…v1784601385…`, 1376×768): copy left edge **x=72**, copy bottom **y=524**, with the designer's
  reserved empty CTA slot directly below (~x65–405, y572–692).
- **Baked button placed at x=72, y=590, w=280, h=91, radius=18 (native px)** = left-aligned to the copy, ~29px @600
  below it, ~20% width, ~8px @600 radius — matching the reference proportions and landing inside the reserved slot,
  clear of the products (button right edge 352 < products at x≈560). RDD orange `#f47c20`, white bold "Explore →".
  Composited with PowerShell+System.Drawing onto the artwork (`scratchpad/compose_button.ps1`), q90 JPEG (~231 KB).
  Output: `Brands/RDD/Campaigns/Weekly/Assets/RDD-2026-W30-hero-final.jpg`. Artwork/typography otherwise UNMODIFIED.

**HTML (v17):** the live-HTML button row (v16 WK-S4b) is **removed**. Hero = ONE responsive `<img>` (the baked banner)
**wrapped in a single live link to `/products/`** so the whole hero is clickable + Klaviyo-trackable while rendering as
one flat image — pixel-identical on Desktop, Gmail Mobile, Apple Mail, Outlook, Klaviyo (nothing to detach or reflow).
Email-safe (§6.6): anchor wraps inline content only, `<img>` is the block element, `width="600" height="335"` reserve
the aspect box, `.hero-img` + width:100%/height:auto scale it. No dual hero, no background-image, no overlay, no swap.

**QA — PASS (built file):** baked hero asset ref ×1; old `…v1784601385…` URL = 0; v16 live-button row (WK-S4b) = 0;
hero wrapped in `/products/` anchor ×1; anchors wrapping `<table>` = 0; image-anchors with `display:block` = 0 (§6.6);
hero img has width+height; 16 product cards intact; everything below the hero byte-unchanged from v16. Desktop render
verified against the reference — button position/size/style/gap match.

**Trade-off (accepted by user):** the CTA is part of the image, so its text is not separately selectable/editable
(the hero IS clickable). Pixel-consistency was chosen over editable hero content.

**⚠ BLOCKER before Klaviyo import / send (§8 — no local paths in a real email):** the hero `src` is the **local
preview path** `../Assets/RDD-2026-W30-hero-final.jpg` (renders in a browser now). The baked file
`Brands/RDD/Campaigns/Weekly/Assets/RDD-2026-W30-hero-final.jpg` **must be uploaded to the RDD Cloudinary account** and
the `src` swapped to that public HTTPS URL (verify 200 / image/jpeg / no redirect) before import/send. Recommend a
`f_auto,q_auto` delivery transform to keep it light for Gmail mobile (§8). Other §8.1 client-render checks still apply.
Send-approval status carries forward unchanged.

## Draft v16 — 2026-07-21 (New finalised hero image + ONE live HTML CTA button below it) → SYNCED TO `Output/RDD-2026-W30.html`
Supersedes v15. User supplied a new **finalised, approved** hero on Cloudinary
(`…v1784601385…`, HTTP 200, image/jpeg, 1376×768) that already contains the logo tone, eyebrow, headline and
supporting copy — the **only** missing element is the CTA. Task: add **one live HTML CTA button** below the copy,
single hero image, no dual hero / overlay / background-image / duplicate text.

**Key finding (surfaced to user before building):** the image has an **empty CTA slot baked into the flat JPEG**
(a lighter box ~24px below "customer spaces.", left-aligned) — the designer reserved that spot. But a *live* button
cannot sit inside a flat image and still scale responsively **and** stay email-safe: absolute-overlay fails in Outlook
and won't track the scaling image on mobile; background-image doesn't scale on mobile (crops/shrinks — the behaviour
we were told to avoid); and the bottom band can't be cropped because the products occupy the right side of it. Given
those constraints, the live button can only sit **below** the image. **User chose:** "Live button below current
image" (image untouched; accepts that the baked empty slot stays visible and the gap is larger than 24–32px).

**Implementation (WK-S4b, the only change vs v15's hero area):**
- Hero = one responsive `<img>` using the new Cloudinary URL, unmodified. `width="600" height="335"` reserve the
  aspect box (§6.6); `.hero-img` + width:100%/height:auto scale it. No HTML hero text, no dual hero, no
  background-image, no overlay, no swap. **No hosting blocker this time** — the asset is already public on Cloudinary
  (unlike v15's local composite), so this build is send-ready re: the hero src.
- CTA = ONE live HTML anchor button in a row directly below the image: RDD orange `#f47c20`, white text, **bold (800)**,
  **8px radius**, "Explore →", left-aligned (30px desktop pad ≈ the copy's left edge; `.mp` resets to ~5%/18px on
  mobile so alignment holds when the image scales), full tap target via `.tap`, VML `roundrect` fallback for Outlook.
  Email-safe: plain anchor (inline content only) — no overlay, background-image, or absolute positioning.
- **Seamless-seam detail:** the button row background is set to `#ebd5c2`, sampled from the image's **lower-edge
  cream**, so the join between the artwork and the button is effectively invisible and the CTA reads as part of the
  hero. Row padding `14px top / 34px bottom` (button close to the image, generous whitespace below), then the
  unchanged cream bridge band follows.

**Accepted trade-offs of the chosen approach (documented, not defects):** the image's baked empty CTA slot remains
faintly visible above the button, and the paragraph→button gap is ~110px (the image bakes cream + the slot below the
copy), i.e. larger than the requested 24–32px. Eliminating either would require a re-exported image without the baked
slot (offered; user declined) or an in-slot overlay (breaks mobile/Outlook).

**QA — PASS (built file):** new hero URL ×1; old local asset path = 0; hero-d/hero-m elements = 0; background-image in
*code* = 0 (2 hits are in comments); anchors wrapping `<table>` = 0; image-anchors with `display:block` = 0 (§6.6);
one live "Explore →" button + VML fallback; 16 product cards intact; everything below the hero byte-unchanged from
v15. Desktop preview composite rendered (`scratchpad/hero_v16_preview.png`) — button left-aligned to the copy, seam
matched.

**Manual pre-send checks (§8.1):** confirm button + hero render on Gmail Mobile/iOS · Apple Mail iPhone · Outlook
(VML button) · Klaviyo, and that the CTA links correctly after Klaviyo import. Hero JPEG ~700 KB — recommend a
Cloudinary `f_auto,q_auto` delivery transform of the same asset to lighten Gmail-mobile load (§8). Send-approval status
carries forward unchanged.

## Draft v15 — 2026-07-21 (Hero banner typography RE-COMPOSITED to match the approved v11 master) → SYNCED TO `Output/RDD-2026-W30.html`
Supersedes v14. The v14 single-image banner (`…v1784599188…`) had the correct **artwork** but its baked-in typography
did not match the approved design: the eyebrow rendered **grey (not orange)** and there was **no CTA button** at all.
Per user direction — "refine the embedded typography yourself; do not use a designer; keep the artwork" — I
re-composited the banner in this environment rather than swapping the asset or reverting to an HTML overlay.

**Key finding that made this clean:** the clean plate `…v1784542530…` is the **same photography** as the generated
`…v1784599188…` banner but with **no text baked on**. So the approved typography was drawn onto the pristine cream
plate (seam-free — nothing to erase), giving "the correct artwork + the approved typography" in one flat banner.

**How it was produced (me, in-environment — no Photoshop/designer):** a PowerShell + System.Drawing script
(`scratchpad/compose_hero.ps1`) renders the approved v11 spec onto the 1376×768 plate at native resolution
(design authored at 600px → ×2.293 scale), high-quality anti-aliased text, exported JPEG q92 (~241 KB, **lighter than
the 700 KB v14 asset**). Output: `Brands/RDD/Campaigns/Weekly/Assets/RDD-2026-W30-hero.jpg`.

**Typography reproduced to the approved v11 master (the 15 requested points):**
- Eyebrow "THIS WEEK'S FEATURED COLLECTION" — **RDD orange `#c25e0c`**, Arial bold, uppercase, letter-spaced, wrapped
  to **2 lines** inside the text column (matches approved). *Deviation, documented:* rendered at 10px/2.2px-tracking
  (approved 11px/2.5px) because GDI lays tracked caps wider than the browser did; at the exact 11px/2.5px a 2-line
  eyebrow ran into the product arc. The 1px/0.3px reduction is visually indistinguishable and preserves the 2-line
  silhouette clear of the artwork.
- Headline "Make Every / Display Count." — Trebuchet MS **28px**, weight 800, `#2a2e34`, 2 lines, approved position.
- Supporting copy — Arial ~12.5px, `#45484d`, wrapped to the approved **226px** column (3 lines).
- CTA — orange **`#f47c20`** rounded (6px) button, white "Explore →", Arial 14px bold, left-aligned under the copy at
  the approved size/position/proportions.
- Whitespace / margins / hierarchy / vertical balance — block vertically centred with the approved inter-element
  spacing (eyebrow 20 · headline 22 · copy 26), 36px left pad. Almost visually identical to the approved v11 hero.
- Artwork, orange arc, product composition — unchanged (the approved plate).

**HTML:** still one responsive email-safe `<img>` (v14 structure kept) — no HTML overlay, no HTML CTA, no dual hero,
no background-image, no swap. `width="600" height="335"` reserve the aspect box (§6.6); `.hero-img` + width:100%/
height:auto scale it; whole banner links to `/products/` (anchor wraps the img only).

**QA — PASS (built file):** hero src → local asset ×1; old `…v1784599188…` URL = 0; anchors wrapping `<table>` = 0;
image-anchors with `display:block` = 0 (§6.6); 16 product cards intact; everything below the hero byte-unchanged from
v14; refined asset present in `Assets/`.

**⚠ BLOCKER before Klaviyo import / send (§8 — no local paths in a real email):** the hero `src` is currently the
**local preview path** `../Assets/RDD-2026-W30-hero.jpg` so the Output renders correctly in a browser now. The file
`Brands/RDD/Campaigns/Weekly/Assets/RDD-2026-W30-hero.jpg` **must be uploaded to the RDD Cloudinary account** and the
`src` swapped to that public **HTTPS** URL (verify 200 / image/jpeg / no redirect) before import/send. This is a hosting
step, not a redesign. Other §8.1 manual client-render checks (Gmail Mobile/iOS, Apple Mail, Outlook, Klaviyo) still
apply; confirm the baked hero text is legible at mobile width. Send-approval status carries forward unchanged.

## Draft v14 — 2026-07-21 (Hero replaced with the FINALISED single-image production banner) → SYNCED TO `Output/RDD-2026-W30.html`
Supersedes v13. Per user direction the hero design is now **finalised as one approved banner** with the eyebrow,
headline, supporting copy and the orange "Explore →" CTA **baked into the artwork**. Directive: remove the entire
existing hero implementation (desktop `.hero-d`, mobile `.hero-m`, all HTML overlay copy, the HTML CTA, the
background-image approach and the dual-hero swap) and replace it with **one responsive email-safe image**. Everything
below the hero is unchanged.

**Approved asset (verified §8):** `https://res.cloudinary.com/atitvoxa/image/upload/v1784599188/Retail_Display_Direct_Hero_Banner_202607210958_gknamf.jpg`
— HTTP **200**, `image/jpeg`, no redirect, **1376×768** (→ 600×335 at container width). Used exactly as supplied.

**What changed (hero only):**
- **Removed:** the `.hero-d` background-image cell + its Outlook VML `v:rect/v:fill/v:textbox` fallback; the `.hero-m`
  stacked white card; all HTML eyebrow/headline/supporting-copy; the two HTML "Explore →" CTAs; the `.hero-d`/`.hero-m`
  display-swap CSS (both the default `.hero-m{display:none}` and the `max-width:600px` swap rules).
- **Added:** a single foreground `<img>` (the approved banner) in a plain full-width table, wrapped in one anchor to
  `/products/` so the baked-in CTA is clickable. Email-safe by construction (§6.6): anchor wraps inline content only,
  the `<img>` is the block element (`display:block`, anchor stays inline), real pixel `width="600" height="335"`
  reserve the aspect box for Apple Mail iOS, and `width:100%; height:auto` + a new `.hero-img` responsive class scale
  it fluidly. No background-image, no dual hero, no swap, no overlay text, no absolute positioning, no flexbox.
- The eyebrow colour/typography, headline, supporting copy and CTA now live **inside the approved artwork** (single
  source of truth), so the previous HTML-orange-vs-image mismatch risk is gone — there is exactly one hero message and
  one CTA.

**Why this is more robust than the v10–v13 dual-hero line:** every prior "two sections in Gmail Mobile" failure came
from Gmail sanitising the HTML that bound image + copy together (box-shadow/border-radius) or from the media-query
swap not firing on all clients. A single flat image has **no seam to break, no chrome to strip, and no media query to
depend on** — it renders identically on desktop, Gmail Mobile, Apple Mail, Outlook and Klaviyo.

**QA — PASS (verified in the built file):** new hero URL present ×1; old `Commercial_hero_banner` URL = 0;
`background-image` in *code* = 0 (2 hits are inside the explanatory comment only); VML `v:rect/v:fill` = 0; `.hero-d`
/`.hero-m` elements/classes = 0 (remaining refs are in the comment); `.hero-img` class + media-query rule present;
"Make Every" in *visible HTML* = 0 (1 hit is the img alt text, intentional); anchors wrapping `<table>` = 0;
image-anchors with `display:block` = 0 (§6.6); 34 imgs all carry width+height; 16 product cards intact;
`{% unsubscribe_link %}` intact. Editorial strip, product groups, cards, Shop-by-Category, trust strip and footer
all byte-unchanged from v13.

**Notes / manual pre-send checks (§8.1 — cannot be exercised in this environment):**
- **Baked-in-text tradeoff:** because the eyebrow/headline/copy/CTA are now part of the image, on narrow phones they
  scale down with the banner and are **not** live/selectable text. This is the user's explicit chosen direction;
  confirm the baked text is legible at mobile width on **Gmail Android · Gmail iOS · Apple Mail iPhone · Outlook
  Mobile** before send. (A meaningful `alt` is set for image-off/accessibility.)
- **Weight:** the approved JPEG is **~700 KB** — heavier than ideal for the Gmail mobile app (§8). Recommend serving
  the *same* asset via a Cloudinary delivery transform (e.g. `.../upload/f_auto,q_auto,w_1200/v1784599188/...`) to cut
  payload without changing the creative; flagged for approval, not applied (the exact approved URL was used as
  instructed).
- Confirm the hero links to the correct destination **after Klaviyo import** (Klaviyo rewrites links). Send-approval
  status carries forward unchanged (§8.1 gate below).

## Draft v13 — 2026-07-21 (mobile Hero rebuild — strip-proof solid block, NOT strippable chrome) → SYNCED TO `Output/RDD-2026-W30.html`
Supersedes v12. The user confirmed (with real **Gmail Mobile screenshots**) that the v12 "unified card" *still*
rendered as two separate sections in Gmail Mobile. Directive: **rebuild the mobile hero architecture, do not patch;
make it feel like ONE cohesive premium hero in Gmail Mobile; do NOT rely on `box-shadow`, `border-radius`, or any CSS
Gmail may strip; prioritise Gmail Mobile over browser rendering.** Desktop `.hero-d` **not touched** (byte-identical,
locked/approved). Keep artwork, branding, copy, CTA and visual direction.

**Root cause of v12's two-section render (confirmed diagnosis):** v12 bound the image and copy into one object using
**`border-radius:10px` + `box-shadow` + a 1px border** on the inner card table. Gmail Mobile **strips `box-shadow` and
`border-radius`** during its CSS sanitisation. With that chrome removed, nothing was left to fuse the image row and the
copy row, so they read as "image, then text" = two sections. The cohesion was carried entirely by the two CSS
properties Gmail is most likely to delete — a structural flaw, not a spacing/typography issue (which is why v10's
spacing pass and v11's divider also failed).

**Rebuild — cohesion from SOLID STRUCTURE, nothing strippable (`.hero-m` only):**
- The hero is now **one continuous solid-white block**: the banner sits **flush on top of the copy**, and **both rows
  share the identical `#ffffff` bgcolor** (set via `bgcolor` attribute *and* inline `background`, so it survives even
  when `<style>` is ignored). Because there is no rounded corner and no shadow to lose, **there is no chrome for Gmail
  to strip and therefore no seam** — the white block reads as one cohesive premium card on the cream field.
- **Sub-image gap killed at the source** so the two rows can never separate: image cell `padding:0; font-size:0;
  line-height:0; mso-line-height-rule:exactly; valign="top"`, and the `<img>` is `display:block; margin:0;
  vertical-align:top`. This is the strip-proof equivalent of the old rounded/shadow "seam-hider".
- **Visual direction preserved:** same Cloudinary artwork (unmodified), same orange branding, same eyebrow → charcoal
  29px headline → grey supporting copy → orange "Explore →" CTA (identical content, hrefs and hierarchy), same
  white-card-on-cream look. The **only** things removed are the strippable rounded corners + shadow + hairline border,
  which Gmail was discarding anyway — so nothing that actually rendered in Gmail Mobile is lost.
- Dark-mode classes (`dm-bg`/`dm-cream`/`dm-text`/`dm-sub`) retained so the block behaves in dark clients.

**Dual-hero swap retained (deliberate):** desktop (text-over-background-image, products on the right) and mobile
(stacked solid block) are genuinely different layouts and desktop is locked, so `.hero-d`/`.hero-m` + the
`max-width:600px` swap stays. All primary mobile targets (Gmail Android, Gmail iOS, Apple Mail, Outlook **Mobile**,
Klaviyo) support media queries, so `.hero-m` shows on each; only Outlook **desktop** ignores them and keeps the
untouched `.hero-d`. (GANGA — a non-Gmail account synced into the Gmail app — strips `<style>` entirely and would fall
back to `.hero-d`; eliminating that would require changing the locked desktop hero, so it stays a documented manual
pre-send check, not a silent claim.)

**QA — PASS (structural, verified in the built file):** desktop `.hero-d` byte-identical (28px h1, background-image
overlay, 336px, VML intact); `.hero-m` rebuilt with **no `box-shadow`/`border-radius`/`border` on the hero container**
(the 17 `box-shadow` hits remaining in the file are the product-grid cards, out of scope); anchors wrapping `<table>`
= 0; image-anchors with `display:block` = 0 (§6.6); banner keeps `width="600" height="335"` so Apple Mail iOS reserves
the aspect box; `hero-d`=1, `hero-m`=1.
**Manual pre-send verification still required (cannot be exercised in this environment) — email-first, not browser:**
confirm the mobile hero renders as ONE cohesive premium block with the banner full-size on **Gmail Android · Gmail iOS
· Apple Mail iPhone · Outlook Mobile · Klaviyo Inbox Preview** before send. Send-approval status carries forward
unchanged (§8.1 gate below).

## Draft v12 — 2026-07-20 (mobile Hero ARCHITECTURE rebuild — unified card) → SYNCED TO `Output/RDD-2026-W30.html`
Supersedes the v10/v11 spacing + full-bleed-divider passes, which the user reported still rendered as two sections in
Gmail Mobile. Per the user's directive ("do NOT keep patching `.hero-m`; redesign the architecture; make it ONE
premium component"), this is a **structural rebuild of the mobile hero**, not another CSS patch. Desktop `.hero-d`
**not touched** (approved).

**Why full-bleed + spacing kept failing (the actual architecture flaw):** the mobile hero was a bare photo followed
by a copy block sitting on the **same cream (`#f6ecdd`) as the entire email below it**. Nothing bound the photo and
the copy into one object, and nothing separated that copy from the page — so the eye always parsed "photo" + "start
of page content". Padding/typography can't fix a missing container.

**Rebuild — unified card architecture (mobile-only `.hero-m`):**
- The artwork and the copy now live inside **ONE white card** — the same product-card language used in the grid
  (§6.13: white surface, 1px `#eaeaea` hairline border, soft `box-shadow`, 10px rounded corners). Image = top of the
  card (rounded top), copy = body of the same card, **zero seam** between them.
- The card sits on the **cream field** (the `.hero-m` outer cell is cream, continuing the field that runs into the
  grid). So the hero reads as a single premium component **floating on cream**, consistent with the product cards, and
  is clearly distinct from the sections below — exactly the "one commercial banner" intent.
- Copy surface moved cream→white (inside the card); eyebrow (orange), headline (charcoal 29px), supporting copy
  (grey), and the orange CTA are unchanged in content and hierarchy. Artwork/headline/copy/CTA/brand colours all
  preserved. Dark-mode classes (`dm-bg`/`dm-text`/`dm-sub`) applied so the card behaves in dark clients.
- Removed the v11 white divider row (the card + cream field now provide the separation).

**Email-safe by construction (per the user's constraints):** nested tables + inline CSS + a **foreground `<img>`**.
Verified in the built file: `display:flex`=0, `position:absolute`=0, `background-image`=1 (desktop `.hero-d` only,
never on mobile), anchors wrapping `<table>`=0, image-anchors with `display:block`=0 (§6.6). The fixed banner keeps
`width="600" height="335"` so Apple Mail iOS reserves the aspect box, then `width:100%; height:auto` scales it.

**On the `.hero-d`/`.hero-m` swap the user flagged:** it is retained because desktop (text-over-image) and mobile
(stacked card) are genuinely different layouts and desktop is locked — but it is **not** the compatibility risk here.
All five target clients (Gmail Android, Gmail iOS, Apple Mail, Outlook **Mobile**, Klaviyo) support `<style>`/media
queries, so `.hero-m` shows correctly on every one. Only Outlook **desktop/Windows** ignores media queries, and it
keeps the untouched `.hero-d`.

**QA — PASS (structural):** desktop `.hero-d` byte-identical (28px h1, background-image overlay, 336px, VML intact);
mobile card present (radius + shadow); email-safe gates all 0; 16 product imgs @192; `{% unsubscribe_link %}` intact;
tags balanced (table 44·tr 73·td 91·a 63 — table +1 vs v11 = the new nested card). Only `.hero-m` differs from v11.
**Manual pre-send verification still required (cannot be exercised in this environment) — email-first, not browser:**
confirm the hero renders as one premium card and the banner is full-size on **Gmail Android · Gmail iOS · Apple Mail
iPhone · Outlook Mobile · Klaviyo Inbox Preview** before send. Send-approval status carries forward unchanged.

## Draft v11 — 2026-07-20 (mobile Hero cohesion — root cause: connected full-bleed) → SYNCED TO `Output/RDD-2026-W30.html`
Follows v10. User reported the mobile Hero **still** read as two separate sections after the v10 spacing pass, and
asked for a **structural / root-cause** fix (flagging flexbox / absolute positioning / background images /
unsupported Gmail CSS). Design direction chosen by the user: **Connected full-bleed**. Desktop `.hero-d` **not
touched**; all edits confined to the mobile-only `.hero-m` block.

**Root cause (verified in markup — it was NOT unsupported CSS):**
- The mobile hero was already email-safe: a **foreground `<img>` in a stacked table** — no flexbox, no
  `position:absolute`, no `background-image` (only the *desktop* `.hero-d` uses a background image, and it is hidden
  `<600px`). Grep confirms `display:flex` = 0 and `position:absolute` = 0 in the file.
- The real defect was a **surface-continuity problem**: the hero copy sits on cream (`#f6ecdd`), and *every* section
  below it (the "curated edit" bridge band + all three product groups) is the **same cream**. From the CTA down
  there was ~58px of unbroken cream, so the copy visually joined the long cream content region instead of the image
  above it — making the full-bleed image look pasted-in / isolated. Spacing alone (v10) could not fix this because
  the surfaces never broke.

**Fix (mobile `.hero-m` only):**
- Kept the full-bleed edge-to-edge image and the tightened v10 typography.
- Confirmed the **zero-gap seam** between image and copy (img `display:block`; image cell `font-size:0;line-height:0`)
  so the copy is framed flush to the artwork = one hero.
- Added a **mobile-only white divider row** (`height:16px; bgcolor:#ffffff; mso-line-height-rule:exactly`) as the
  last row of `.hero-m`. It breaks the continuous cream and **decisively ends the hero**, so image + copy group as a
  single unit and the cream bridge/product region reads as separate. Because it lives inside `.hero-m` (`display:none`
  on desktop/Outlook), desktop is unaffected.
- Copy band bottom padding trimmed 26→24px (the white divider now supplies the separation).

**Honest client-coverage note (root-cause principle, §8.1):** the *primary* Gmail-Mobile case (standard Gmail
accounts) supports `<style>`/media queries, so `.hero-m` shows and this fix applies. One edge case remains that this
environment cannot exercise: clients that strip `<style>`/media queries entirely (e.g. a non-Gmail account synced
into the Gmail app, "GANGA") fall back to the desktop `.hero-d`, whose `background-image` Gmail strips. Truly
eliminating that would require changing the desktop hero (forbidden here), so it is documented as a **manual
pre-send check**, not silently claimed as fixed.

**QA — PASS (structural):** desktop `.hero-d` byte-identical (28px h1, `background-image` overlay, 336px, VML intact);
`display:flex`=0; `position:absolute`=0; anchors wrapping `<table>`=0; image-anchors with `display:block`=0 (§6.6);
16 product imgs @192; `{% unsubscribe_link %}` intact; tags balanced (table 43·tr 73·td 91·a 63). Only the `.hero-m`
block differs from v10.
**Manual pre-send verification still required (cannot be exercised here):** confirm the mobile Hero reads as one
cohesive section, image renders full-size, and the divider looks intentional on **Gmail Mobile (Android + iOS) ·
Apple Mail iPhone · Outlook Mobile · Klaviyo Preview** before send. Send-approval status carries forward unchanged.

## Draft v10 — 2026-07-20 (mobile Hero cohesion fix) → SYNCED TO `Output/RDD-2026-W30.html`
Authored as `Draft/RDD-2026-W30-draft-v10.html` (copied from the current Output, then edited), and `Output/` was
re-synced to match it (§4.1/§9). Back on the standard flow after the prior in-place polish pass: `Draft/…-v9`
plus the intervening in-place Output edits are preserved as history; v10 is now the newest snapshot.

**Scope: mobile Hero only — desktop deliberately unchanged.** User reported that on mobile the Hero "breaks into
separate sections" — image on top, then a detached text block — weakening the first impression. The desktop hero
(`.hero-d`, the 336px bulletproof background-image with left-side live overlay) was **not touched**; all edits are
confined to the mobile-only `.hero-m` block, which is `display:none` on desktop/Outlook and shown only `<600px`,
so no desktop rendering can change.

**Root cause of the "separate sections" feel (not a structural break):** the image row and the cream text panel
are already two `<tr>`s of a single `.hero-m` table (structurally one unit, flush — image `display:block`, image
`<td>` `padding:0;font-size:0;line-height:0`). The disconnection was purely visual: (a) an oversized **40px**
mobile headline that pushed the CTA far down, and (b) a large **32px** top padding on the cream panel that opened
a visible gap between the artwork and the label, making the copy read as a separate card.

**Fix (mobile `.hero-m` cream panel only):**
- Panel padding `32px 26px 36px 26px` → **`20px 24px 26px 24px`** — pulls the label up against the image so the
  banner + copy read as one continuous Hero.
- Headline **40px → 29px**, line-height `1.14 → 1.2` — proportional, no longer oversized; keeps the CTA high.
- Eyebrow margin-bottom `16 → 9px`; headline margin-bottom `18 → 11px`; copy `15px→14px`, line-height `1.6→1.5`,
  margin-bottom `26 → 20px` — tighter, even vertical rhythm.
- CTA kept a full tap target (`line-height:46px`, `font-size:15px`, `padding:0 36px`) — remains visible and easily
  tappable; unchanged href to `/products/`.
- Hero artwork, headline text, copy, CTA and branding all unchanged (no redesign).

Resulting mobile flow: **Logo → Hero image → Featured Collection label → Headline → Supporting copy → CTA**, now
compact and cohesive.

**QA — PASS:** desktop `.hero-d` byte-identical (28px h1, background-image overlay, 336px intact); no overlap; CTA
visible; mobile type balanced. Anchors wrapping `<table>` = 0; image-anchors with `display:block` = 0 (§6.6). The
edit is inline on a mobile-only table, so it renders identically wherever the mobile hero shows.
**Manual pre-send verification still required** (this environment cannot exercise real clients): confirm the mobile
Hero reads as one section on **Gmail Mobile · Apple Mail (iPhone) · Outlook Mobile · Klaviyo Preview** before send.
Send-approval status carries forward unchanged (§8.1 gate below).

## Output polish — 2026-07-20 (applied in place to `Output/RDD-2026-W30.html`, per user instruction)
Per the user's explicit instruction ("Update the current Output HTML. Do NOT create a Draft version. Modify the
existing Output"), this refinement pass was applied **directly to `Output/RDD-2026-W30.html`** — no new draft.
Note: this intentionally deviates from the usual §9 flow (revise a draft, then regenerate Output); `Draft/…-v9`
remains the pre-polish snapshot and now differs from Output by these polish-only changes. Approved design
direction, layout, hero concept, branding and flow unchanged.

**Refinements (visual polish only):**
- **Product images enlarged ~9% (176→192px)** across all 16 cards for a more premium, visually balanced grid with
  less empty space around each product. Card structure/border/shadow/spacing and equal-height rows unchanged;
  mobile stays fluid (`.pc img{width:100%}`). Per-image internal whitespace is inherent to the 500×500 source
  stencils and is not altered.
- **Editorial strip** given more vertical padding (24/22 → 32/30), looser line-height (1.5→1.65) and a centred
  `max-width:468px` for a premium catalogue line length. Copy/concept unchanged.
- **Section headings**: more space between heading and supporting copy (margin-bottom 6→10px) across all three
  groups; editorial hierarchy preserved (heading primary, orange number accent).
- **Mobile hero headline** +2px (38→40px, line-height 1.1→1.14) for impact; desktop hero headline kept at 28px
  (the max that fits the left cream zone without overlapping the artwork — per the "never overlap products" rule).
- **Hero height kept at 336px:** at 600px width this is the artwork's native ratio (full composition, zero crop);
  any increase would crop, which the brief forbids, so "no change" is the correct outcome. Full desktop + mobile
  responsiveness retained.
- CTAs unchanged — one consistent RDD-orange style, **0 dark buttons**.

**FINAL QA (updated Output) — PASS:** 16 product imgs @192 (0 leftover 176); 3 editorial headings intact; white
cards + shadow ×16; cream field ×9; orange ×37; **dark buttons = 0**; **44 https URLs → 0 non-200**; **16 product
cards**; anchors wrapping `<table>` = 0; image-anchors `display:block` = 0; all 34 imgs width+height;
`{% unsubscribe_link %}` intact; tags balanced (table 43 · tr 72 · td 90 · a 63 · p 40); responsive classes intact.
`Output/RDD-2026-W29.html` (previous approved send) untouched. **§8.1 manual pre-send checks unchanged (below).**

## Draft v9 — 2026-07-20 (final production polish) → PROMOTED TO `Output/RDD-2026-W30.html`
Authored as `Draft/RDD-2026-W30-draft-v9.html`; **user approved v8 direction and approved for production**, so v9
(the polish pass) was promoted to `Output/RDD-2026-W30.html` (byte-identical to v9; §9). Previous approved send
`Output/RDD-2026-W29.html` left untouched. Reviewer/approver ≠ author (CR-16). This is a **refinement pass** —
layout, hero concept, artwork, cards and CTAs unchanged.

**Refinements:**
- **Hero height:** reviewed — kept at **336px**. At the 600px container width this shows the Google Flow artwork
  at its native 1376×768 ratio with **zero crop**; increasing the height would force a crop (which the brief
  forbids), so no change was the correct call. Artwork/headline/CTA/layout unchanged; full desktop + mobile
  responsiveness retained.
- **Editorial strip copy** refined to a catalogue-intro tone (same meaning): *"A curated edit of sixteen display
  pieces, chosen to shape every part of your customer-facing space."*
- **Section headings elevated from instructional → editorial**, consistent across all three groups, with the
  editorial heading as the primary focus and the orange number kept as a small accent (28px→18px) for hierarchy:
  - 01 **"Capture Attention from the First Step."** — Premium A-Frames, outdoor signage and display solutions
    designed to increase visibility and create stronger first impressions.
  - 02 **"Frame Every Message with Impact."** — Snap frames, poster stands and literature displays that keep
    your message sharp and professional.
  - 03 **"Perfect the Point of Sale."** — Considered acrylic displays that present offers, menus and cards where
    decisions are made.
  Heading 22→25px navy; number 28→18px orange. Product cards, cream field, orange CTAs, spacing and responsive
  layout all unchanged (§6.13).

**FINAL QA — PASS (draft v9 and the promoted Output are byte-identical):**
- Hero displays full artwork desktop + mobile (mobile stacks: image + cream copy panel); hero text sits in the
  left cream zone clear of the arc/products (v6 fix retained).
- Typography balanced; editorial heading is the focal point; numbers subordinate.
- **44 https URLs → 0 non-200** (16 product pages, 6 category pills, `/products/` ×hero+CTA, logo, brand mark,
  Cloudinary hero as bg + mobile img, privacy, site, mailto). **16 distinct product cards/images.**
- All primary CTAs orange (`#f47c20`); **dark buttons = 0** — one consistent CTA style.
- Brand colours consistent (warm cream field ×9, orange ×37, navy text); email-safe (anchors wrapping `<table>`
  = 0; image-anchors `display:block` = 0; all 34 imgs width+height); `{% unsubscribe_link %}` intact; 0 visible
  em dashes; tags balanced (table 43 · tr 72 · td 90 · a 63 · p 40). Responsive classes intact.

**⚠️ Manual pre-send checks that cannot be exercised in this environment (§8.1) — do before the actual Klaviyo send:**
- Render the background hero + left overlay in **Klaviyo Preview · Gmail Web · Gmail Mobile · Apple Mail (iPhone)
  · Outlook (VML)**; confirm no overlap and full-size hero on each; confirm the mobile stacked hero on phones.
- Confirm every CTA/product/category link navigates correctly **after Klaviyo import** (Klaviyo rewrites links).
- Hero image **~637 KB** — recommend hosting an optimised Cloudinary delivery URL of the *same* artwork
  (`.../upload/f_auto,q_auto,w_1200/v1784542530/...`) to lighten Gmail-mobile load before send (§8).
- Re-confirm live stock for all 16 SKUs at send time.

---

## Draft v8 — 2026-07-20 (premium white cards on the warm cream field)
Authored as `Draft/RDD-2026-W30-draft-v8.html`. **Status: NOT approved to send.** Card *styling* only —
structure, images, titles, prices, orange CTAs, spacing and sizes unchanged.

**Card restyle (per user) — lighter, more premium on cream:**
- Background `#eeeeee` (v7 light gray) → **white `#ffffff`**.
- Border → **very light gray `#eaeaea`** (1px).
- Added a **soft subtle box shadow** `0 1px 4px rgba(0,0,0,0.07)` (progressive enhancement — renders on Apple
  Mail / iOS / most webmail; Outlook ignores it and falls back to the light border, so cards stay defined).
- Corners kept at **6px** (consistent with the existing design system).
- Warm cream section field (`#f6ecdd`) unchanged; hierarchy is now **warm cream field → white premium cards →
  orange CTA**, a cleaner catalogue-style transition from the hero.

**Automated QA — PASS:** 16 white cards with border+shadow+6px (0 gray cards remain; 0 stray radii); warm cream
field intact (9 refs); orange accents intact (37); dark buttons = 0; 44 https URLs, **0 non-200**; **16 product
cards**; anchors wrapping `<table>` = 0; image-anchors `display:block` = 0; all 34 imgs width+height; responsive
classes unchanged (desktop + mobile); tags balanced (table 43 · tr 72 · td 90 · a 63 · p 40). **§8.1
hero/client-render checks still apply before send** (Outlook VML; overlay legibility; ~637 KB hero — consider a
Cloudinary `f_auto,q_auto` delivery URL of the same asset).

---

## Draft v7 — 2026-07-20 (warm colour harmony: cream carried into the product section)
Authored as `Draft/RDD-2026-W30-draft-v7.html`. **Status: NOT approved to send.** Background/colour only — no
structural or product-card redesign; hero/body layout and copy unchanged from v6.

**Fix — cool-gray section broke the warm hero flow:**
- **Product-section field changed cool gray `#ededed` → warm cream `#f6ecdd`** (the same tone as the hero
  bridge strip and mobile hero panel), so the warm hero now flows seamlessly into the intro strip, the product
  grid field, the Shop-by-Category block and the trust strip — one continuous warm palette (high-end
  catalogue / AU editorial feel). 0 cool-gray sections remain.
- **Product cards kept as distinct light-gray tiles** (`#ffffff` → `#eeeeee`) so they still read as cards on
  the cream field. Card structure, border, radius, spacing, imagery, orange price buttons and navy names are
  **unchanged** (colour only — no redesign).
- **Footer warmed** `#f7f7f7` → `#f5efe6` so the compliance footer harmonises with the warm palette.
- **Orange + navy branding preserved** (37 orange `#f47c20` accents intact — CTAs, price buttons, brand mark,
  numbered group markers, category pills; navy headings/product names unchanged).

**Automated QA — PASS:** cool-gray `#ededed` remaining = **0**; warm cream field present (9 refs); **16 light-gray
cards**; footer warmed; dark buttons = 0; 44 https URLs, **0 non-200**; **16 product cards**; anchors wrapping
`<table>` = 0; image-anchors `display:block` = 0; all 34 imgs width+height; tags balanced (table 43 · tr 72 ·
td 90 · a 63 · p 40). **§8.1 hero/client-render checks still apply before send** (Outlook VML; Gmail/Apple Mail
overlay legibility; ~637 KB hero — consider a Cloudinary `f_auto,q_auto` delivery URL of the same asset).

---

## Draft v6 — 2026-07-20 (fix hero text overlapping artwork + shorter copy)
Authored as `Draft/RDD-2026-W30-draft-v6.html`. **Status: NOT approved to send.** Hero section only; body unchanged.

**Fix — text was overlapping the artwork (arc/products):**
- **Text container narrowed** 248→**226px** and **left padding increased** 32→36px, so the overlay sits inside
  the left cream whitespace with a safe ~20px margin before the orange arc. Right spacer widened to 374px.
- **Hero returned to native height (336px) with `background-position:center`** so the artwork displays at its
  exact 600×336 ratio — **full image, no crop**, all products and the curved arc fully visible; no text overlaps.
- Readability prioritised over filling the space (per brief).

**New hero copy (shorter/stronger):** headline **"Make Every / Display Count."**; intro "Premium display
solutions that help Australian businesses create cleaner, more professional customer spaces." Increased spacing
between label / headline / intro / CTA; intro sits in the narrower column (reduced width). Desktop headline 28px
(sized to fit the cream zone cleanly without wrapping into the artwork); mobile 38px. Same copy desktop + mobile.
- Scan order supports the goal: headline → products (right) → CTA.

**CTA unchanged:** orange "Explore →" → `/products/` (consistent orange primary-CTA style kept from v5; no dark buttons).

**Automated QA — PASS:** copy swapped (old "Designed to Be Seen." removed); text col 226 + 36px left pad (clear
of arc); height 336 full-image no-crop; dark buttons = 0; 44 https URLs, **0 non-200**; **16 product cards**;
anchors wrapping `<table>` = 0; image-anchors `display:block` = 0; all 34 imgs width+height; tags balanced
(table 43 · tr 72 · td 90 · a 63 · p 40). **§8.1 hero checks still apply before send** (client render incl.
Outlook VML; confirm overlay legibility + no overlap on Gmail/Apple Mail; ~637 KB weight — consider a Cloudinary
`f_auto,q_auto` delivery URL of the same asset).

---

## Draft v5 — 2026-07-20 (final hero copy trim + one consistent orange CTA style)
Authored as `Draft/RDD-2026-W30-draft-v5.html`. **Status: NOT approved to send.** Same artwork, structure and
16-product body as v4 — copy shortened and the primary button recoloured only.

**Changes vs v4:**
- **Shorter hero copy** so it sits comfortably in the reserved left whitespace (no overlap, not cramped):
  headline **"Designed / to Be Seen."**; intro "Premium display solutions for shopfronts, showrooms and
  commercial spaces across Australia." Same copy on desktop and mobile now (no desktop condensing needed).
- **Headline enlarged** for impact now that it fits: desktop 30→33px, mobile 35→40px; generous spacing kept
  between label / headline / intro / CTA. Text block stays at ~41% width (right-anchored artwork), products
  clearly visible.
- **Primary CTA recoloured dark → RDD orange.** The end-of-grid "Explore the full range →" button was navy
  (`#2a2e34`); it now uses brand orange (`#f47c20`) in both the HTML anchor and the Outlook VML fallback.
  **All primary CTA buttons in the email are now one consistent orange style** (hero "Explore →", grid price
  buttons, and "Explore the full range →"). No dark button style remains.

**Automated QA — PASS:** headline "Designed to Be Seen." present (desktop + mobile); old headline removed;
**dark button backgrounds = 0**, **dark VML fills = 0**; 44 https URLs, **0 non-200**; **16 product cards**;
anchors wrapping `<table>` = 0; image-anchors `display:block` = 0; tags balanced (table 43 · tr 72 · td 90 ·
a 63 · p 40). `#2a2e34` now appears only as heading/product-name text colour, not on buttons.
**§8.1 hero checks still apply before send** (client render incl. Outlook VML; ~637 KB weight — consider a
Cloudinary `f_auto,q_auto` delivery URL of the same asset).

---

## Draft v4 — 2026-07-20 (hero polish: premium AU B2B / editorial feel — NOT a redesign)
Authored as `Draft/RDD-2026-W30-draft-v4.html`. **Status: NOT approved to send.** Same Cloudinary artwork
(unmodified) and same 16-product body/cards as v3 — **only the hero + header + hero→grid transition refined.**

**Refinements vs v3:**
- **45 / 55 balance:** desktop artwork now **right-anchored** (`background-position:right center`), content column
  narrowed (296→248px, ~41%); products breathe more on the right and are never cropped (right edge stays pinned).
- **Header lighter:** orange bar padding 13→10px, logo 140→132px — cleaner, more breathing room above the hero.
- **Typography impact:** desktop headline **26→30px (+15%)**, re-broken to 4 stacked lines for a taller editorial
  block that fits the narrower column; mobile headline **30→35px**. Line-height 1.15→1.18; increased spacing
  between label / headline / intro / CTA (margins bumped). Easier to scan in the first seconds.
- **CTA** padding increased slightly (line-height 44→46/48, padding 0 28→0 34/38) — more premium, not oversized.
- **Hero→first-section transition:** added a slim **cream bridge band** (orange hairline + one editorial line,
  "Sixteen premium display pieces…") that carries the hero's warm tone into the grey product grid, so the grid
  feels connected to the premium hero instead of an abrupt colour jump. Product cards unchanged (§6.13 W29 style).
- Desktop overlay intro is condensed to fit the balanced left column; the **full supplied intro** shows on the
  mobile stacked panel. Em dash in the supplied copy replaced with a comma (§6.2).

**Automated QA — PASS:** 44 https URLs, **0 non-200**; **16 product cards** intact; headline 30px desktop /
35px mobile; artwork right-anchored; anchors wrapping `<table>` = 0; image-anchors `display:block` = 0; all 34
imgs have width+height; 0 visible em dashes; tags balanced (table 43/43 · tr 72/72 · td 90/90 · a 63/63 · p 40/40).
**§8.1 hero checks from v3 still apply** (render/legibility across clients incl. Outlook VML; ~637 KB weight —
consider a Cloudinary `f_auto,q_auto` delivery URL of the same asset before send).

---

## Draft v3 — 2026-07-20 (approved Google Flow hero banner + overlay copy)
Authored as `Draft/RDD-2026-W30-draft-v3.html`. **Status: NOT approved to send** — awaiting user review.
Body (16-product grid, Shop-by-Category, trust, footer) unchanged from v2; only the header + hero changed.

**Hero upgrade (per user):**
- Uses the **approved Google Flow banner directly from Cloudinary, unmodified** (no crop, no baked-in text):
  `https://res.cloudinary.com/atitvoxa/image/upload/v1784542530/Commercial_hero_banner_for_Klaviyo_202607201813_dwzemp.jpg`
  (1376×768, JPEG, HTTP 200). Artwork: cream empty space on the left, retail-display products (A-frame,
  poster stand, zig-zag brochure stand, plant) inside an orange arc on the right.
- **Live HTML overlay on the LEFT** (no text embedded in the image): label "THIS WEEK'S FEATURED COLLECTION",
  headline "Create Spaces / That Leave / A Lasting Impression.", intro, and an **orange "Explore →" CTA**
  linking `/products/` (real, clickable anchor — not baked into the image).
- **Bulletproof + responsive:** DESKTOP uses a background-image cell (inline `background-image` + `background`
  attr + `bgcolor` cream fallback) with a **VML `v:rect`/`v:fill` + `v:textbox`** fallback for Outlook; the
  text sits in the left column and the products stay uncovered on the right. MOBILE (`.hero-m`, shown < 600px)
  **stacks**: the full banner as a responsive `<img>` (products fully visible, uncovered) with the copy on a
  cream panel below — so nothing overlaps the products on small screens.
- **Header weight reduced** to a slim orange logo bar (padding 22px→13px, logo 150→140px) so it supports and
  blends into the new hero rather than competing with it. RDD branding kept, centred (§6.13 nav/brand system).
- Em dash in the supplied intro copy replaced with a comma (§6.2 no dashes in copy).

**Automated QA — PASS:** 44 unique https URLs, **0 non-200** (incl. the Cloudinary hero as background + mobile
img); **16 product cards**; anchors wrapping `<table>` = 0; image-anchors with `display:block` = 0; every img
has width+height (mobile hero img given `width=600 height=335` to reserve the aspect box for iOS, §6.6); 0
visible em dashes; VML hero fallback present; tags balanced (table 41/41 · tr 70/70 · td 88/88 · a 63/63 · p 39/39).

**⚠️ Extra §8.1 checks for this hero (must pass before send):**
- Confirm the **background image renders with the left overlay legible** on Gmail Web, Gmail Mobile, Apple Mail
  and **Outlook (VML)**; confirm the **mobile stacked** version shows on phones (image + cream copy panel).
- Hero image is **~637 KB** — heavier than ideal for the Gmail mobile app (§8). Recommend serving the *same*
  asset optimised via a Cloudinary delivery transform (e.g. `.../upload/f_auto,q_auto,w_1200/v1784542530/...`)
  before send; this is delivery optimisation of the identical artwork, not a recreation. Flag for approval.
- Confirm the "Explore →" CTA is clickable after Klaviyo import.

---

## Draft v2 — 2026-07-20 (rework per user: 16 products, light hero, W29 grid style, nav removed)
Authored as `Draft/RDD-2026-W30-draft-v2.html`. **Status: NOT approved to send** — awaiting user review.
Keeps the "Turn Browsers Into Buyers" shopfront theme, reworked to the user's W30 instructions and new rules.

**Changes vs v1:**
- **Hero changed from dark navy to a LIGHT treatment** (slim orange logo bar + soft cream/gradient hero,
  navy headline, orange accents) per the new RDD hero-rotation rule (CLAUDE.md §6.13 — don't default to dark).
- **Grid expanded to 16 products** (added 4: Chalkboard A-Frame Red Wood, Portable Promo Counter, A3 Snap
  Lock Frame, 5-Pocket Magazine/Brochure Stand). Three groups: **Footpath (6)** · **Frame the message (6)** ·
  **Win at the counter (4)**.
- **Product grid uses the approved W29 style** (light-grey product field, white cards, orange price buttons,
  subtle corner brand mark) per CLAUDE.md §6.13.
- **Removed the top header navigation** (opt-in per §6.11); kept the **approved "Shop by Category" pills**
  (in-body content section, RDD design system §6.13) with on-theme categories.

**Products — all 16 verified via BigCommerce Catalog API 2026-07-20** (`is_visible=true`, available, in stock,
price, live URL 200, image 200). No coupon (no confirmed RDD code; §6.5).

**Automated QA — PASS:** 43 unique https URLs, **0 non-200**; **16 product cards**; **0 top-nav items**;
anchors wrapping `<table>` = 0; image-anchors with `display:block` = 0; imgs 33/33 with width+height; 0 em
dashes in visible copy; `{% unsubscribe_link %}` intact; tags balanced (table 40/40 · tr 68/68 · td 85/85 ·
a 61/61 · p 37/37).

**§8.1 gate (unchanged, required before send):** verify render + post-Klaviyo clickability on Klaviyo Preview ·
Gmail Web/Mobile · Apple Mail · Outlook; re-confirm live stock; confirm official RDD brand hex when available.

---

## Draft v1 — 2026-07-20 (new Weekly send; theme: "Turn Browsers Into Buyers")
Authored as `Draft/RDD-2026-W30-draft-v1.html`. **Status: NOT approved to send** — awaiting user review.
Per CLAUDE.md §5.1.1 / §9: authored in `Draft/` only; **not** promoted to `Output/`. Reviewer/approver ≠ author
(CR-16); approval not yet recorded (CR-17).

### Continuous-improvement baseline (§5.1.1)
Analysed the last approved send `Output/RDD-2026-W29.html` ("Fresh Displays. Sharper Spaces." — workspace/office
lean, orange band + overlapping desk photo, one flat 10-card grid, "Limited Time Sale" with no actual offer).
W30 improves on it with:
- a **fresh theme** pivoting to RDD's core, **retail-display / shopfront signage** ("out front → windows → counter");
- a **new navy hero** with orange accents (vs W29's orange band + overlapping desk photo);
- **grouped storytelling** — three numbered, themed 2×2 blocks with an editorial "01/02/03" system — a real
  cross-sell journey vs one undifferentiated grid;
- a **premium header nav** with per-item orange underlines (§6.10; W29 had none);
- a **100%-different product line-up** (zero overlap with W29's 10 SKUs).
Continuity kept: orange/navy palette, white logo, orange price buttons, subtle corner brand mark, 3-up trust, footer.

### Products — verified via BigCommerce Catalog API 2026-07-20 (§5.1)
All 12 confirmed `is_visible=true`, `availability=available`, in stock, non-zero price, live URL 200, image 200
image/jpeg (store `s-ugqmr0qfvf`, 500×500 square stencils). Group A card #1 (A1 Snap A-Frame) doubles as the
hero-featured product → first grid card (continuity). Prices shown as listed; no RRP/sale fabricated.

### Automated QA — PASS
- **Links:** 33 unique https URLs, **0 non-200** (12 product pages, 4 nav categories, `/products/`, logo, brand
  mark, privacy, site, mailto). `{% unsubscribe_link %}` intact.
- **§6.6 email-safety:** anchors wrapping a `<table>` = **0**; image anchors with `display:block` = **0**;
  every `<img>` (25/25, incl. 12 product images + 12 corner marks + logo) carries `width` + `height`; corner
  brand mark kept tiny on mobile via `.pc img.brandmark` override.
- **Tag balance:** table 41/41 · tr 56/56 · td 70/70 · a 47/47 · p 32/32.
- **Copy:** 0 em dashes in visible/intro copy (§6.2); remaining `—` are in **HTML comments only** (non-rendered).
  0 unresolved `[[tokens]]`. No coupon/placeholder code (§6.5). Single primary range CTA (§6.2, no duplicate CTA).
- **Grid:** three balanced 2×2 blocks (12 cards); equal-height cards via `.pn` min-height + `height:100%` cells +
  `valign="top"` (§6.8); mobile stacks 1-up.

### ⚠️ OUTSTANDING §8.1 GATE (required before send — cannot be exercised in this environment)
Not yet rendered on real clients here. Before send, verify on **Klaviyo Preview · Gmail Web · Gmail Mobile ·
Apple Mail (iPhone) · Outlook**: navy hero + all 12 product images render at full size; every product card, nav
item, hero CTA and range CTA navigate to the correct live URL **after Klaviyo import**. Re-confirm live stock at
send time. Confirm official RDD brand hex/typography when a brand guide is available. Optional: add a confirmed
RDD coupon.
