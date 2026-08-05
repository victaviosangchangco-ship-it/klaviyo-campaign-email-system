# RDD-2026-W32 — Review & QA Notes

## v7 change log (mobile CTA refinement + "•••" re-investigation — 2026-08-04)
Assesses `Draft/RDD-2026-W32-draft-v7.html` (mirrored to `Output/RDD-2026-W32.html`; v1–v6 retained). Mobile-only refinement; desktop byte-identical.
- **Item 4 — mobile CTA proportions (closing "SHOP ACRYLIC DISPLAYS →"):** felt oversized/heavy on mobile. Fix is **mobile-media-query only** — added `.ctabtn { padding:13px 26px !important; letter-spacing:0.3px !important; }` and tuned `.tap { line-height:20px }` (was 22px). Result: button height ~46px (≥44px tap target preserved), horizontal padding 26px (within the requested 24–32px), content-width + centred (shrink-to-fit table unchanged, §6.17), RDD orange + rounded corners kept, wording unchanged. **Desktop unchanged** — inline `padding:15px 32px; font-size:14px` and the Outlook VML `roundrect` untouched (verified present). Diff v6→v7 = the two media-query lines only. Anchor balance 60/60.
- **Item 1 — "•••" re-investigation (conclusive):** diff of the state before my edits (v4) → v6 = **3 lines** (hero `<img>` + 2 footer tags); **no hidden preheader, spacer, zero-height row, `&zwnj;` preview hack, or Gmail/Outlook artifact hack was added by any fix**. v6/v7 scan: 0 literal `•`/`…`, 0 `&zwnj;`/`&#8204;`, no empty spacer rows (the "height:0" greps = `line-height:0` in legit anti-gap styles), 5 MSO conditionals all functional, 59 KB (under 102 KB clip). The **only** hidden element = the §8.3-compliant single-line preheader, present since v4 (legitimate inbox-preview text, not a "•••" trigger) — **kept** per the user's "do not remove legitimate functionality". **Root cause of "•••" = Gmail quoted/trimmed-content collapse on repeated test sends to the same subject/thread; re-test on a fresh subject line.** No HTML removed.
- **Items 2–3 — CLAUDE.md:** §6.23 (added earlier) is footer-merge-tag only and encourages **no** hidden content/dots/hacks → nothing to remove (no duplicate). Added a concise **authoring-restraint clause to §8.3** (never proactively add hidden preview blocks, decorative dots, or Gmail/Outlook hacks unless explicitly requested or fixing a proven defect; fix root cause; validate across clients) — merged into the existing Gmail-rendering section, not a duplicate new section.
- **Still outstanding:** §8.1 send-gate (real Klaviyo import + Gmail/Apple Mail/Outlook device checks) — includes verifying the refined mobile CTA on Gmail Android/iOS. Not verifiable in this environment. ⛔ NOT approved to send.

## v6 change log (footer merge-tag bug fix — 2026-08-04)
Assesses `Draft/RDD-2026-W32-draft-v6.html` (mirrored to `Output/RDD-2026-W32.html`; v1–v5 retained). Bug fix only — footer layout, links, and all other sections unchanged (diff v5→v6 = the two footer `<a href>` tags only).
- **Defect (screenshot):** footer rendered raw markup as visible text — `Unsubscribe" style="color:#777777; text-decoration:underline;">Unsubscribe` — on desktop and mobile after send.
- **Root cause:** footer used `href="{% unsubscribe %}"`. In Klaviyo, `{% unsubscribe %}` emits a **whole anchor** (`<a href="URL">Unsubscribe</a>`), not a URL; injected into the `href`, the tag's `"` closed the attribute early, spilling the trailing `" style="…">Unsubscribe` as visible text and nesting an anchor. A browser preview hid it because the tag was unexpanded (leak only surfaces post-Klaviyo, §8.1.2). Manage Preferences had the same class of defect: `{{ manage_preferences_url }}` is not a valid Klaviyo tag → dead/empty href.
- **Fix (root cause, not masked):** switched to the URL-only tags used by approved W29–W31 — `{% unsubscribe_link %}` and `{% manage_preferences_link %}`. Both anchors now carry a URL in `href` and inline text only.
- **Validation:** diff v5→v6 = 2 footer lines only; anchor balance 60/60; `grep 'href="[^"]*<'` = none; no anchor-emitting subscription tag in any `href`; no unrecognised `{{ }}` vars; footer links (Unsubscribe · Privacy Policy · Manage Preferences) well-formed. ✓
- **CLAUDE.md:** added **§6.23 HTML rendering & footer merge-tag validation** (no existing rule covered Klaviyo merge tags; extends §6.6/§8.2, not a duplicate).
- **Still outstanding:** real Klaviyo test-import render check (tags do not expand on localhost/desktop) + §8.1 send-gate across Klaviyo Preview / Gmail (web+mobile) / Apple Mail iPhone / Outlook / Yahoo. Not verifiable in this environment. ⛔ NOT approved to send.
- **Gmail "•••" bubble investigation (2026-08-04, follow-up):** reported after the footer fix. Full hidden-content/ghost scan of v6 = **clean**: 59.2 KB (under 102 KB clip), zero literal `•`/`…`/`...`, zero `&zwnj;`/spacer-entity runs, zero empty `<td>/<tr>`/ghost tables, zero hacks. Only hidden element = the §8.3-compliant single-line preheader (present since v4; **not** added by the fix; not a "•••" trigger). Diff v4→v6 = 6 lines (hero img + 2 footer tags) — the fix introduced no hidden content. **Root cause = Gmail's quoted/trimmed-content collapse** on repeated test sends to the same subject/thread (§8.2/§8.3), a Gmail UI artifact, not a markup defect. **Action:** re-test on a fresh subject line / clean thread — no HTML change made. v6 unchanged; Output still mirrors v6.

## v5 change log (hero image swap — 2026-08-04)
Assesses `Draft/RDD-2026-W32-draft-v5.html`. Hero `src` swapped to `Hero_banner_with_acrylic_products…fbeote.jpg` (Cloudinary `w_1200,q_auto:good,f_jpg`; HTTP 200 `image/jpeg`, no redirects, ~118 KB; native 1376×768 → 600×335, matches prior box, no layout shift). Alt text updated. Diff v4→v5 = the single hero line only. All other sections unchanged.

## v4 change log (premium refinement — 2026-08-03)
Assesses `Draft/RDD-2026-W32-draft-v4.html` (mirrored to `Output/RDD-2026-W32.html`; v1–v3 retained). Incremental refinement only — layout, grid, hero, header, footer unchanged.
- **Closing CTA redesigned** (§6.22): replaced the full-width solid-orange bar with a premium light section (`#f8f8f8`, generous whitespace, centred). Headline "Ready to Upgrade Your Display?" (27px bold `#1f2937`); supporting sentence (`#6b7280`, ≤2 lines); single orange rounded CTA "SHOP ACRYLIC DISPLAYS →" (VML for Outlook, ≥44px tap). Orange now only on the button.
- **Environmental supporting copy** rewritten to summarise all four environments: "Designed for retail, offices, healthcare and education. Professional display solutions for every environment." Cards untouched. Requested copy used an em dash → converted to two clean sentences per **§6.2**.
- **Trust strip redesigned** (§6.21 trust standard): now **4-up** — Australia-wide Shipping / Commercial Grade Quality / 30-Day Returns / Expert Australian Support — with **monochrome charcoal** (`#374151`) line glyphs (✈ ★ ↻ ☎, text-presentation `&#xFE0E;`, no colour emoji), equal spacing, more whitespace. Stacks full-width on mobile.
- **CLAUDE.md updated (merged, no duplicates):** new §5.1.3 (Weekly premium-editorial philosophy), trust-indicator standard merged into §6.21, new §6.22 (closing-CTA + environmental section-copy standards).
- **Self-QA v4:** tags balanced (table 56/56 · tr 115/115 · td 128/128 · a 60/60); 0 `<table>`-in-`<a>`; 0 block image-anchors; 0 empty `<td>/<tr>`; 0 `href="#"`; 0 `…`. ✓
- **Still outstanding (unchanged):** independent human review (CR-16) + §8.1 send-gate (Klaviyo import, Gmail mobile Android/iOS, Apple Mail iPhone, Outlook). Not verified in-environment. ⛔ NOT approved to send.

## v3 (prior)

- **Assesses:** `Draft/RDD-2026-W32-draft-v3.html` (mirrored to `Output/RDD-2026-W32.html`). v1/v2 retained for history. **v3 = hero image swap only** (new `eCommerce_hero_banner_acrylic…szuakg.jpg`, HTTP 200, 1376×768; verified diff vs v2 = the single hero line). All v2 QA below still holds.
- **Reviewed:** 2026-08-03 · Author: Claude Code (production)
- **Approval status:** ⛔ **NOT approved to send.** Preview only (§4.1/§9). Needs independent human review (CR-16) + §8.1 send-gate.

## v2 change log (client change requests)
- **CR1** — environment tiles now **plain `<img>`** (titles baked into artwork): image + border-radius + spacing + image-only inline anchor. Removed the duplicated HTML title overlay + gradient + VML.
- **CR2** — **"Why Choose Acrylic Displays?" section removed** entirely; hero → product grid directly.
- **CR3** — permanent icon rule (CLAUDE.md **§6.21**): no emoji/cartoon/colour icons; monochrome single-tone line icons only. All emoji removed; trust icons = monochrome orange glyphs.
- **CR4** — product grid = **approved W31 card style**, **2-col × 8 rows = 16 verified acrylic SKUs** (theme-consistent, §5.1.2).
- **CR5** — trust = W31 "We've got you covered" 3-up; footer = W31 light footer (verified contacts). Orange closing CTA retained.
- Docs: CLAUDE.md **§5.1.2** (theme consistency + 14–16 count) and **§6.21** (icon style) added.

## Automated self-QA — PASS (draft v2)
- **Size:** 58.1 KB — under Gmail's ~102 KB clip (§8.3). ✓
- **Tag balance:** table 56/56 · tr 115/115 · td 127/127 · a 60/60. ✓
- **§6.6 containment:** 0 `<table>` in `<a>`; 0 image-anchors with `display:block`; 0 nested anchors. ✓
- **Ghost (§8.2):** 0 empty `<td>/<tr>`/anchors; 0 `href="#"`/empty; 0 `...`/`…`. ✓
- **Icons (§6.21):** 0 colour emoji anywhere (💎🚚🎧… all removed); trust icons monochrome `&#9993;/&#8635;/&#9742;` in brand orange. ✓
- **Product cards:** 16 cards, each = 3 sibling anchors (image/name/price badge) to same live URL (§6.6); shrink-to-fit orange price badge (§6.17). ✓
- **Images:** all 38 `<img>` carry width+height attrs. ✓
- **Env tiles:** image-only inline anchor, uniform 1376×768 source → equal tiles. ✓
- **Copy (§6.2):** no em dashes in customer copy. ✓

## Data verification (§5.1 / §5.1.2)
16 products all verified **on their own product page** 2026-08-03 (In Stock + Add-to-Cart + GST-inc price + URL 200 + real `s-ugqmr0qfvf` stencil image). Full table in the Brief v2 update. All theme-consistent (Acrylic Displays). Excluded OOS: A4 Acrylic Menu Holder Slant Back, DL Menu Sign Holder Three Sided, Lit-Loc wall rail.

## Reference deviations (unchanged from v1, per rules)
- Footer contact = approved data (Padstow · (02) 9708 5288 · sales@…), NOT the reference's Silverwater/1300. Social icons omitted (no verified URLs; §6.7).
- Product names/prices = verified catalogue, not reference mockup values (§5.1).

## ⚠️ Must-verify BEFORE send (not exercisable on localhost — §8.1)
Browser/localhost preview is not sufficient proof (§8.1.1). Required manual pre-send steps — none claimed passed:
1. **Klaviyo import clickability (§8.1.2):** all links survive rewrite — hero, 48 product-card anchors, 4 env tiles, closing CTA (+VML), footer.
2. **Env tiles:** confirm each `<img>` shows its baked title clearly and renders on Apple Mail (macOS/iOS), Gmail web/Android/iPhone, Outlook (border-radius will square-off in Outlook — acceptable, §6.20).
3. **16-product grid on Gmail mobile (Android & iOS):** cards stack full-width, equal heights hold (§6.8), price badges stay compact/centred and never stretch (§6.17), no overflow (§6.16).
4. **Trust 3-up & footer:** confirm W31 parity; trust glyphs render as monochrome (text-style, not colour emoji) — if any client colourises `&#9993;` etc., swap to hosted monochrome PNG icons per §6.21.
5. **Gmail clip / ghost (§8.2/§8.3):** confirm on a **fresh subject/thread** no "…" toggle; footer visible.
6. **Re-verify all 16 prices/stock/URLs at send time** (catalogue drift).

## §6.21 follow-up (icon upgrade path)
Trust icons are monochrome **glyphs** (best email-safe option; RDD `Assets/Icons/` is empty). To reach true Lucide/Heroicons-style line icons, host a **monochrome PNG icon set** in `Brands/RDD/Assets/Icons/` and swap the glyphs for `<img>` per §6.21. Flagged, not blocking.

## Send-gate (§8.1/§9) — status
`Design status: PROPOSED` passes design-intent. Remaining gate items (post-Klaviyo clickability, responsive across full client set, on-device image/link checks) **OPEN** pending the manual steps above. **Not approved to send** until recorded human approval + those verifications.
