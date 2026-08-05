# RDD-2026-W31 — Review & QA Notes

- **Send:** RDD-2026-W31 (Weekly) · **Assesses Draft:** `RDD-2026-W31-draft-v5.html` (mirrored to `Output/RDD-2026-W31.html`). History: v1 pre-GIF · v2 GIF added · v3 GIF infinite-loop fix · v4 responsive price badge · v5 grid expanded to 14 + "Solutions For Your Business" section replaces closing CTA.
- **Date:** 2026-07-24 · **Author:** Claude Code
- **Approval status:** ⛔ **NOT approved to send.** Build is in `Output/` for preview/QA only (CLAUDE.md §4.1/§9). Requires (1) human separation-of-duties review (CR-16/17) and (2) the §8.1 send-gate to be exercised in real clients + a Klaviyo test import (cannot be run from this environment).

## Theme & baseline (§5.1.1 / §5.2)
- **Theme:** "Meeting Room Solutions — Present with Impact" built around the supplied Mobile TV Stand hero. Fresh vs. baseline **W30** ("shopfront edit": signage/A-frames/acrylic POS). New hero, new product edit (AV + collaboration + desk; zero products reused from W30), new section narrative, new warm-stone `#f2f1ee` field (vs W30 cream `#f6ecdd`).
- **Measurable improvements over W30:** (a) mobile-safe fluid wrapper + table **and** cell `bgcolor` (§6.16) replacing W30's `<center>`+fixed-600; (b) fixed-height card cells (§6.8) replacing W30's `min-height`-only cards (Outlook-safe equal height); (c) hero delivery optimised 662 KB → ~80 KB via Cloudinary (same artwork).

## Products — all verified 2026-07-24 (RDD BigCommerce `s-ugqmr0qfvf`; API source of truth)
8 products, all `is_visible=true`, in stock, page **HTTP 200**, image **200 image/jpeg**. Prices = API calculated_price (GST-inc, calibrated vs W30 $85.32). See Brief for the table.
- **Dead-link caught & excluded:** `/mobile-tv-stand/` (id 1197) reports visible+inv=48 via API but the live URL **404s** (verified twice, browser UA). Replaced with **1224 Floor TV Stand – Mobile** (200). Requirement "1–2 Mobile TV Stand products" met by 1224 + 1254 Mobile TV Trolley.
- Grid balance: groups of 2 / 4 / 2 — all even rows, no odd-card centering needed (§6.9).

## Automated QA run (this environment)
| Check | Result |
|-------|--------|
| Ghost Element Inspection (§8.2): empty/nested anchors, empty td/tr, ghost tables, `href="#"`/empty, literal `…`/`...`, TODO | **0 hits** |
| Link/containment safety (§6.6): `<table>` inside `<a>` | **0** |
| `display:block` on an image-wrapping `<a>` (§6.6) | **0** |
| Nested anchors | **0** |
| Tag balance | table 28/28 · tr 58/58 · td 67/67 · a 31/31 |
| All hrefs resolve (§6.7/§8): 10 site links + privacy | **all HTTP 200**; mailto + `{% unsubscribe_link %}` = valid tokens |
| Hero: single anchor, `img` display:block, anchor inline, cell font-size:0/line-height:0, edge-to-edge (§6.14/6.15) | pass |
| Product cards: 3 sibling anchors each (img / name / price) to same URL, inline content only (§6.6) | pass |
| Gmail size vs ~102 KB clip (§8.3) | **34.5 KB** |
| Production comments = short/functional only; MSO conditionals kept | pass |
| Copy: no em dashes / dash-interruptions in intro (§6.2); intro does not restate hero headline (§5.2) | pass |
| Banned words (best/amazing/premium quality/limited time) | none used |

## v2 change — animated product-demo GIF (inserted after Section 01)
- **New "See It In Action" section** placed between Section 01's grid and Section 02 (Hero → Intro → 01 → GIF → 02 …), per request. Heading + supporting line + centred GIF.
- **Source MP4 → GIF:** converted via the atitvoxa Cloudinary account (same account serving the heroes), transform `w_480,du_5,fps_6,fl_lossy,q_auto` → `.gif`. Verified **HTTP 200 image/gif, ~783 KB, 480×270** (5s loop, 6fps). Displayed at up to 600×338 (`width:100%; max-width:600px; height:auto`), border-radius 8px, ~28px vertical spacing, 18px horizontal inset (matches grid padding). ALT "Meeting Room Presentation Setup".
- **Email-safety:** GIF has explicit `width`/`height` attrs + `display:block` (§6.6 Apple-Mail box reservation); NOT wrapped in an anchor (no link requested); sits on the same `#f2f1ee` band as neighbours (no white seam, §6.16); reuses the existing `.hero-img` mobile class (scale 100%, preserve aspect, no overflow).
- **Diff vs v1:** pure insertion — verified nothing outside the new section changed (hero, layouts, product cards, typography, CTAs, spacing all untouched, as instructed).
- **v2 automated QA:** ghost inspection 0 hits · table-in-anchor 0 · tag balance table 30/30, td 70/70, a 31/31, tr 61/61 · HTML 36.1 KB (< Gmail clip).
- **Client note:** animated GIFs play in Gmail/Apple Mail/Yahoo; **Outlook desktop shows frame 1 only** (expected) — frame 1 is a complete, representative boardroom shot, so the static fallback reads correctly. Confirm GIF animation + weight on Gmail mobile during the client pass below.

## v3 change — GIF infinite loop
- GIF played once (Cloudinary video→GIF omits the loop extension by default). Fixed by adding `e_loop` to the transform → embeds the **NETSCAPE2.0 looping extension, loop count 0 (infinite)**, byte-verified on the live asset. 200 image/gif, ~773 KB, unchanged dimensions. Outlook desktop still shows frame 1 only (GIF limitation, not a loop setting).

## v4 change — responsive product price badge (Gmail mobile stretch fix)
- **Problem:** the orange price button used a `display:inline-block` anchor. Gmail's mobile app coerces such anchors toward block/full-width, so the badge stretched to nearly the full card width on Gmail Android/iOS (desktop was fine).
- **Root-cause fix (not a fixed-width hack):** rebuilt each of the 8 price badges as a **shrink-to-fit centered `<table>`** — a table with no width attribute collapses to its content width in *every* client (media-query-independent), stays centered via `align="center"` + `margin:0 auto`, with the orange fill + `border-radius:4px` on the inner `<td>` and the price kept as an inline `<a>` (padding 11px 22px). Added a mobile `.pricebtn` rule (`width:auto`, padding 12px 26px) for a comfortable tap target without stretching.
- **Desktop unchanged:** same colour, padding, radius, font, centring — pixel-identical. Only mobile proportion changes (now a compact badge).
- **Untouched:** card width, images, titles, the closing CTA button, and all other spacing (diff = only the 8 price lines + 1 CSS rule).
- **QA v4:** `<table>`-inside-`<a>` = 0 (badge table wraps the anchor, allowed); nested anchors 0; tag balance table 38/38, td 78/78, tr 69/69, a 31/31 (all 8 price links + card img/title anchors + closing CTA intact); 37.6 KB.
- **Still to confirm in the client pass:** the compact badge proportion on Gmail Android + Gmail iOS, and that desktop Gmail is unchanged.

## v5 change — 14-product grid + "Solutions For Your Business" section (customer-journey upgrade)
**Task 1 — replaced closing CTA with a use-case section.** The hero already carries the primary CTA, so the
redundant "Explore the Collection" button was removed and replaced with **"Solutions For Your Business"**,
sitting between the product grid and the trust strip. Four clickable use-case tiles (2×2 desktop → stacked
mobile), white cards matching the RDD card system (not a CTA button), emoji icons at a consistent 30px, equal
fixed-height cells (icon/title/desc), orange divider accent. Each tile is 3 sibling anchors (§6.6) to a
**verified-live category** (all HTTP 200):
- 🏢 Office Workspaces → `/sit-stand-desk/`  ·  🏪 Retail Stores → `/acrylic-display/`
- 🏥 Healthcare → `/healthcare/`  ·  🎓 Education → `/projector-screen/`

**Task 2 — grid expanded 8 → 14** (added 6, all verified 2026-07-24: visible, in stock, page 200, image 200):
- G01 Present (2→4): + Portable Lectern (1000, $170.10) + Portable Projector Screen 100&quot; (1534, $281.14)
- G02 Collaborate (4→6): + Magnetic Whiteboard 1500×900 (1021, $116.86) + Glass Whiteboard 1200×600 (980, $95.36)
- G03 Equip the workspace (2→4): + Electric Sit-Stand Desk 1600mm (1240, $403.71) + Sit-Stand Desk 1400mm (1228, $386.71)
- All 6 support the Meeting-Room theme (present / collaborate / modern workspace); every group stays **even**
  (4 / 6 / 4) so the 2-col grid is balanced with no odd-card centering (§6.9). Group 01 & 03 subheads updated
  to describe the added items.

**Build method:** v5 was generated from v4 reusing the **exact v4 card markup** (identical card width, image
188×188, title behaviour, fixed-height cells §6.8, and the responsive shrink-to-fit price badge §6.17), so no
layout shift is introduced on desktop or mobile. Hero, intro, GIF, trust strip and footer are preserved
**byte-for-byte** (sliced, not regenerated). Solution tiles added mobile height-reset classes
(`.sicn/.stt/.sdd`) alongside the existing `.pimg/.pnc` resets.

**v5 automated QA:** ghost inspection 0 hits · table-in-anchor 0 · display:block img-anchor 0 · tag balance
table 61/61, tr 122/122, td 136/136, a 60/60 · **all 21 links HTTP 200** (14 products + 4 categories + hero +
home + privacy) · 14 price badges · 60.4 KB (< Gmail ~102 KB clip).

**Still to confirm in the client pass:** desktop 2-col balance across 4/6/4 rows and the 2×2 Solutions tiles;
Gmail mobile (Android & iOS) stacking + compact price badges (§6.17) across all 14 cards; emoji icons render
consistently; equal card heights hold in Outlook (fixed-height `<td>`, §6.8).

## Client verification — REQUIRED before send (§8.1, could NOT be exercised here)
Localhost/desktop preview is never sufficient (§8.1.1). Before send, a human must verify and record:
- ☐ **Klaviyo test import** — confirm every link still navigates after Klaviyo rewrites links (cards ×3 anchors, hero, closing CTA, logo, footer).
- ☐ Gmail Web · ☐ Gmail Android · ☐ Gmail iPhone — no white side gutters/seams (§6.16), no "…" clip bubble on a **fresh subject/thread** (§8.3), footer visible (not clipped).
- ☐ Apple Mail (incl. iPhone) — hero + all product images render (no zero-height collapse, §6.6); grid equal-height holds.
- ☐ Outlook desktop — MSO ghost table holds 600px; fixed-height card cells keep prices aligned; VML button renders.
- ☐ Responsive: desktop / laptop / mobile — 2-col → stacked full-width, no horizontal scroll.

## Send-gate (§8.1 gate 6) — open items
- ☐ Post-Klaviyo clickability · ☐ responsive verified · ☐ images load in Gmail mobile · ☐ product/CTA links confirmed live · (no coupon this send) · ☐ no unresolved blockers.
- **Blocker resolved in-build:** 1197 dead link excluded. No other blockers open. No coupon used (range-led Weekly).

## Notes
- No top navigation (§6.11 opt-in; Design.md defines none). Header = approved slim orange logo bar, centred white RDD logo (W29/W30).
- Category-pill discovery block intentionally omitted this week: guessed whiteboard/monitor category slugs 404; only `/mobile-tv-stand-for-sale/`, `/sit-stand-desk/`, `/products/` verified. Discovery handled by one closing "Explore the Collection →" CTA → `/mobile-tv-stand-for-sale/` (200) to avoid dead category links and keep the edit on-theme.

## v6 — Introduction section copy/readability refinement (2026-07-25)
Scope: **copy + readability polish only, no redesign** (per request). Section between hero and Group 01.
- **Structure change:** the two stacked paragraphs (bold 16px lead + 14px line) read "article-like." Restructured to a **short section heading + one concise supporting paragraph** so the heading is the primary focus and the body is scannable. Design language unchanged: same `#f2f1ee` field, centred alignment, 44×3px orange divider (`#f47c20`), Trebuchet/Arial type tokens, 600px width.
- **Copy (Variation 1 — "Built for Better Collaboration"):** heading + one benefit-driven 2-sentence paragraph; modern B2B tone; no dashes (§6.2 PASS); natural transition into the products ("Everything below…").
- **Typography:** heading 22px/800 Trebuchet `#2a2e34` (matches the "See It In Action" heading — in-system); paragraph 14px/1.6 Arial `#6f6f6f`, `max-width:448px` (was 474px) for tighter measure, centred. Existing `.dm-text`/`.dm-sub` classes reused (mobile resets already defined).
- **Spacing (more breathing room):** cell padding 34/30 → **40/40**; divider→heading margin 16 → **22px**; heading→paragraph **14px**; paragraph→Group 01 now 40px + Group 01's own 26px top.
- **QA:** no em/en dashes in intro copy (PASS); no empty/nested anchors, empty `<td>/<tr>`, or `href="#"` in the block (§8.2 PASS). Background, divider, width and responsive behaviour untouched — mobile still stacks via `.dm-sub`/`.mp` resets; desktop layout unchanged.
- **Output synced to v6.** Alternate copy Variations 2 ("Designed for Modern Teams") and 3 ("Everything Your Workspace Needs") offered for selection — swap on request (identical structure).
- Still requires the §8.1 client pass before send (unchanged; copy edit does not affect the open verification items above).

## v7 — Hero GIF swap + product-grid reorder (2026-07-25)

### Task 1 — Hero GIF replaced
- **Old hero:** static baked JPG (`Improve_CTA_button_design…jpg`, §6.15 single embedded artwork) — removed.
- **New hero:** animated commercial GIF `…/v1784950377/Commercial_animation_Retail_Disp_202607251120-ezgif.com-optimize_tehnjt.gif` (600×337, **HTTP 200 image/gif**), embedded via the permanent **Hero GIF Standards** technique now documented in CLAUDE.md **§6.19**: plain `<img>` GIF in one clickable anchor, edge-to-edge (§6.14), anchor inline / `<img>` block (§6.6), explicit `width`/`height`, `.hero-img` fluid class. Autoplay + infinite loop are native to the GIF (no controls, no play button). Outlook shows the first frame as the automatic fallback (first frame = meeting-room scene, self-sufficient).
- **GIF carries NO baked text** (verified by extracting frame 1 + last frame: scene → RDD logo, no headline/eyebrow/CTA). To honour "keep the hero headline / introduction / CTA," these are rendered as **HTML below the GIF** (eyebrow "Meeting Room Solutions" · H1 "Present With Impact." · intro "Effortless, mobile displays for better team collaboration." · orange bulletproof CTA "Explore Collection →" with Outlook `v:roundrect` VML fallback). This is the **explicit-request exception to §6.15** (GIF cannot carry the message). Hero + CTA both link to `…/mobile-tv-stand-for-sale/` (**200**).
- **Campaign intro** switched to "Everything Your Workspace Needs" (was "Built for Better Collaboration") so it no longer duplicates the hero's "collaboration" message (§5.2).

### ⚠️ BLOCKER — Hero GIF file size (§8 / §6.19)
- Source GIF is **~3.9 MB** (ezgif "optimize" notwithstanding). Cloudinary quality/width transforms of the same asset barely reduce it (w_600 q_50 ≈ 3.75 MB; w_480 ≈ 2.87 MB) because the driver is **frame count**, not quality — and I cannot re-host a frame-reduced version here (no upload creds). Delivered the provided URL as-is for preview.
- **Risk:** > ~2 MB GIFs load slowly and can blank/break in the **Gmail mobile app**. This **blocks send** on weight grounds (build stays in `Output/` for preview per §4.1).
- **Recommended fix (before send):** re-export the same animation from its **video source via Cloudinary** at reduced fps/duration + lossy (e.g. `/video/upload/w_600,du_5,fps_8,fl_lossy,q_auto,e_loop/…gif`) targeting **≤ 1 MB**, same creative. Provide the video source (as with the "See It In Action" GIF) and I'll wire the optimised URL in a new draft.

### Task 2 — Product grid reordered (logical journey; 14 products, all even/2-col balanced)
Order now: **S01** Mobile TV Stand · Mobile TV Trolley → **S02** Whiteboards/Glass/Notice (×6) → **S03** Single Monitor Mount · Dual Monitor Arm → **S04** Portable Lectern · Portable Projector Screen → **S05** Electric Sit-Stand 1600 · Sit-Stand 1400. Lectern + Projector moved out of S01 to **below the monitor section** as requested. Section headings updated (S03 "Set Up a Cleaner Desk." monitors-only · S04 "Command the Room." · S05 "Raise the Standard."). Journey arc: Presentation → Collaboration → Organisation → Planning/Presenting → Upgrade.

### QA run on v7 (this environment)
- ✓ Tag balance (table 67/67, tr 128/128). ✓ Ghost inspection (§8.2): no empty/nested/whitespace anchors, no `<td></td>`/`<tr></tr>`, no `href="#"`/empty, no `...`/`…`, no `display:block` on image anchors, no `<table>` inside `<a>`. ✓ No em/en dashes in headings or supporting copy (§6.2). ✓ 14 price badges = 14 products.
- ✓ **All 15 URLs re-verified HTTP 200** (hero + 14 products) on 2026-07-25. ✓ Hero GIF 200 image/gif; product images 200 image/jpeg; logo 200 image/png. ✓ HTML weight 66.6 KB (< 102 KB Gmail clip, §8.3).
- **Output synced to v7.** Draft v6 (intro refinement) preserved.

### Still REQUIRED before send (unchanged §8.1 client pass + new items)
- ☐ Resolve Hero GIF weight (above). ☐ Klaviyo test import — hero + 14 cards + hero CTA + closing CTA clickable after rewrite. ☐ Gmail Android/iPhone — **GIF animates**, no white gutters, footer not clipped. ☐ Apple Mail iOS — GIF paints (no zero-height collapse). ☐ Outlook desktop — GIF first-frame + VML CTA render; fixed-height cards hold.
- **Recommendation (flag, not changed):** the "See It In Action" GIF (after S01) is now **redundant** with the animated hero (both meeting-room animations, §5.2) and adds mobile weight — consider removing it. Awaiting your call.

## v8 — REVERT v7 hero + GIF-in-content + monitor-section merge (2026-07-25)
**Base = v6** (v7's hero swap was rejected as a misunderstanding; v7 kept in history, not used).

- **Task 1 — Hero UNTOUCHED.** Hero is exactly v6: static embedded JPG artwork (`Improve_CTA_button_design…jpg`), same layout/image/headline/eyebrow/intro/CTA. No hero change of any kind. The v6 intro ("Built for Better Collaboration") is also unchanged.
- **Task 2 — Replaced ONLY the "See It In Action" GIF `src`.** Old video-sourced GIF → new `…/v1784950377/Commercial_animation_Retail_Disp…gif` (600×337, **HTTP 200 image/gif**). Same `<img>` container, attributes, position and layout — only the `src` changed. GIF autoplays + loops forever natively; Outlook shows first frame (fallback). It stays a **promotional content GIF**, not a hero.
- **Task 3 — Moved Portable Lectern + Portable Projector Screen into the existing "Set Up a Cleaner Desk" (Section 03).** No new category / no new heading. Section 03 now holds **6 cards, one heading**, in the requested order: Single Monitor Mount · Dual Monitor Arm · Electric Sit-Stand 1600 · Sit-Stand 1400 · Portable Lectern · Portable Projector Screen (rows 2·2·2, even → balanced §6.9). Section 01 now = Floor TV Stand + Mobile TV Trolley (subhead updated to drop the lectern/projector mention).
- **Task 4 — CLAUDE.md corrected.** Replaced the earlier "§6.19 Hero GIF Standards" (which wrongly framed GIF-as-hero) with **§6.19 "GIF Implementation Rules & promotional-GIF embedding"** — the 6 permanent Rules (hero and promotional GIF are separate; swapping a GIF never touches the hero; GIFs live only in content sections; never auto-move a GIF into the hero; future campaigns preserve this). Reusable promotional-GIF embedding technique + file-size guidance retained; animated-hero is now an explicit opt-in exception only.

### QA on v8 (this environment)
- ✓ Hero JPG present/untouched; new GIF appears exactly **once** (inside See It In Action). ✓ Old See-It GIF removed. ✓ Section 03 = 6 product cards, single heading, no duplicate category. ✓ Tag balance (table 61/61, tr 122/122, a 60/60). ✓ Ghost inspection clean (no empty/nested anchors, no `<table>` in `<a>`, no `display:block` image anchors, no `href="#"`). ✓ HTML 61.7 KB (< 102 KB, §8.3).
- ✓ New GIF + moved product URLs re-verified **HTTP 200** (2026-07-25). All 15 URLs already 200 same day (v7 pass).
- **Output synced to v8.**

### ⚠️ Carried-over blocker — new GIF weight (§8)
The new promotional GIF is **~3.9 MB** (frame-count driven; Cloudinary quality/width transforms barely help, can't re-host here). Risk of slow load / blank in Gmail mobile app. **Recommend** re-exporting from its video source via Cloudinary (`du/fps/fl_lossy/e_loop`, ≤1 MB) — same as the previous See-It GIF was made. Blocks send on weight grounds; build stays in Output for preview.

### Still REQUIRED before send (§8.1)
☐ Resolve GIF weight. ☐ Klaviyo import clickability (hero + all cards + CTAs). ☐ Gmail Android/iPhone GIF animates, no gutters, footer not clipped. ☐ Apple Mail iOS renders. ☐ Outlook first-frame + fixed-height cards hold.
