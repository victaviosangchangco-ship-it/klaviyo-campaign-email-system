# Review — RDD-2026-37 (Weekly · Projector Screens)

Assesses `Draft/RDD-2026-37-draft-v6.html`, mirrored to `Output/RDD-2026-37.html` (v1–v5 kept for history).

## v6 update — removed the redundant intro CTA + synced to the existing Klaviyo draft

- **Targeted edit:** removed **only** the intro's "Shop Projector Screens" CTA button/table (below the hero). The
  intro **heading** ("Give Every Audience a Clear View"), **supporting copy**, divider, typography and structure are
  kept; spacing rebalanced naturally (paragraph flows into the first grid section header — no leftover empty CTA
  space, no ghost cells). Everything else is byte-identical: hero, 20-product grid, Environmental Featured section,
  W32 trust, footer, and the **closing CTA "Explore the Full Range" (intact)** were untouched.
- **QA:** tag balance perfect (table 99/99, tr 185/185, td 208/208, a 89/89 — exactly one CTA table + anchor
  removed); 0 empty/nested/table-in anchors, 0 empty cells, 0 dead links; 47 imgs all with alt; hero unchanged;
  ~89 KB (under clip). 0 SS/SC links.
- **Synced to the EXISTING Klaviyo draft** via the §13.4 publish-sync workflow — deterministic `campaign_id` match,
  no duplicate: draft `01M05BP6KA5YRB6S3DFVV5QHFE` (same ID preserved), HTML re-attached (template `VE6dh4`,
  verified — independently confirmed the attached template has **no** "Shop Projector Screens" and **keeps**
  "Explore the Full Range", the intro heading, 20 product images and 4 env images), `from_email` + `reply_to_email`
  = `sales@retaildisplaydirect.com.au`, `tracking_options.add_tracking_params: true`, **status Draft** (nothing
  scheduled/sent), **no duplicate**.

---
### v5 update — Environmental Featured section (real photos) + W32-minimalist trust (hero untouched)

## v5 update — Environmental Featured section (real photos) + W32-minimalist trust (hero untouched)

- **Task 1–4 — Environmental Featured section redesigned** to the `Reference to Copy` pattern: each card is a
  **prominent environmental photo on top** with **orange line-icon on the left + title/short description on the
  right** below (editorial card, not "text card with image above"). Section heading kept ("Where These Displays
  Work Hardest"). White cards, orange accent, generous whitespace, rounded image top; `class="pc"` → 2-col desktop /
  1-col mobile; images `width:100%; height:auto` at native 16:9 (no crop/distortion), explicit `width`/`height`
  attrs reserve the box (§6.6). Exact image→card mapping (verified live HTTP 200 `image/jpeg`):
  | Card | Image file (deployed to assets-rdd) |
  |---|---|
  | Boardroom Presentations | `Environmental Images/Boardroom Presentation.jpeg` |
  | Training & Workshops | `Environmental Images/Training and Workshops.jpeg` |
  | Conferences & Venues | `Environmental Images/Conference and Venues.jpeg` |
  | Pop-up & On-site Events | `Environmental Images/POP-UP & ON-SITE EVENTS.jpeg` |
  `Reference to Copy.png` is **NOT** deployed (untracked, returns 404 on the host) and **not** referenced in the
  email — confirmed. No image duplicated. Files were **not** renamed (URLs are %20/%26-encoded).
- **Task 5 — "We've got you covered" trust rebuilt in the RDD-W32 minimalist style:** flat single-tone **charcoal
  `#374151` line glyphs** (no cards, no orange circles), Trebuchet/Arial heading, grey `#f2f1ee` panel, generous
  padding — visually lighter than the previous orange-circle "Why Retail Display Direct" block (which is removed, not
  duplicated). Verified/approved RDD claims only: Australia-Wide Shipping · Commercial-Grade Quality · 30-Day
  Returns · Expert Support (02) 9708 5288 (from approved RDD-2026-W32 / -35). No invented claims. Stacks 2×2 on
  mobile via the inherited `.trust-card` rule.
- **Task 6 — no duplication:** exactly one Environmental section and one trust section; the two use deliberately
  different treatments (photo cards + orange icons vs flat charcoal glyphs). No repeated headings.
- **Assets deployed:** 4 env JPEGs committed + pushed (`70c0682`) to `assets-rdd.vercel.app`; Reference PNG excluded.
- **QA:** tag balance perfect (table 100/100, tr 186/186, td 209/209, a 90/90); 0 empty/nested/table-in anchors,
  0 empty cells, 0 dead links; 47 imgs all with alt; hero byte-identical (unchanged); logo centered; MSO conditionals
  intact; **91 KB** (under the ~102 KB Gmail clip). Klaviyo draft + Lark calendar **not** touched (per instruction).
- **⚠ Weight caveat (§8):** the four environmental photos are ~692–835 KB each (~3.1 MB total). They render fine on
  desktop but that payload risks the broken-image fallback in the **Gmail mobile app**. No image tool is available
  here to optimise, and the brief said use these exact files, so they ship as-is — **recommend re-exporting them at
  ~600–800px wide / ~100 KB each before send** (same crop, same filenames) for mobile reliability. Manual
  multi-client render QA (esp. Gmail Android/iOS) remains the pre-send gate (§8.1).

---
### v4 update — intro shortened · 20-product grid · fresh use-case section · cleaner trust (hero untouched)

## v4 update — intro shortened · 20-product grid · fresh use-case section · cleaner trust (hero untouched)

- **Hero, head, header (centered logo) and footer preserved verbatim.** Only the body between hero and footer was
  regenerated, reusing the exact approved RDD components (orange header, grey product field, white cards, orange
  price buttons, Arial type, `.pc`/`.trust-card`/`.mp` responsive classes).
- **Task 1 — intro shortened.** The two-sentence paragraph became one scannable line: *"Professional display
  solutions for presentations, meetings and events, in sizes to suit any room or audience."* Heading kept ("Give
  Every Audience a Clear View"); no hero repeat.
- **Task 2 — 20 products (all verified RDD, HTTP 200 URL + image, in stock):** organised into four themed
  sub-grids so it stays scannable — **Projector Screens (6)**, **Screens & Media Stands (6)**, **Whiteboards &
  Presentation Boards (4)**, **Lecterns & Event Display (4)**. Every group is even (clean 2-col, no orphans).
  Brands 69 (ERGO DC) / 90 (Retail Display Direct) — both RDD; zero SS/SC products. **Low-stock flag:** id 1532
  (72" 4:3 projector screen) inv=1 — valid but near-sellout; replace/re-verify before send if it moves.
- **Task 3 — trust indicators** rebuilt as a clean 4-across benefit row (icon → heading → one line), using only the
  **verified RDD claims** from the approved RDD-2026-35: Australia-Wide Shipping · Quality Displays · Easy Returns ·
  Expert Support (02) 9708 5288. No invented guarantees/policies/certifications.
- **Task 4 — new environment section** *"Where These Displays Work Hardest"* with four **fresh** use-case cards —
  **Boardroom Presentations · Training & Workshops · Conferences & Venues · Pop-up & On-site Events** — deliberately
  none of the banned Office/Retail/Healthcare/Education concepts; each supported by the featured range.
- **Task 5 — freshness:** headings, use-cases, product grouping (projector + AV/media + boards + event display),
  and intro copy are new vs recent RDD sends (RDD-2026-35 study space, -36 Father's Day, -34 acrylic). The closing
  CTA "Explore the Full Range" is the standard approved RDD closing CTA (reused intentionally); the intro CTA
  "Shop Projector Screens" is theme-fresh.
- **QA:** tag balance perfect (table 100/100, tr 182/182, td 201/201, a 90/90); 0 empty/nested/table-in anchors,
  0 empty cells, 0 dead links, 0 display:block image anchors; 43 imgs all with alt; 20 unique product hrefs (no
  dupes), all HTTP 200; hero unchanged; monochrome icons (§6.21); URL-form footer tags (§6.23); **89 KB** (was 93 KB
  after a safe CSS-comment strip that also removed phantom tag-text) — under the ~102 KB Gmail clip. Klaviyo draft
  and Lark calendar were **not** touched (per instruction). Manual multi-client render QA (Gmail/Apple Mail/Outlook,
  desktop+mobile) remains the pre-send step (§8.1).

---
### v3 update — introduction rewritten (hero untouched)

## v3 update — introduction rewritten (hero untouched)

- **Problem:** the intro below the hero repeated the hero's message — H1 "A Bigger Screen, Ready Wherever You Are"
  and a "portable / big / easy to set up" line, restating what the hero already says (§5.2 non-repetition).
- **Fix (intro section only):** new structure per the reference direction — small **orange accent divider**
  (40×3, #f47c20) → **new heading** "Give Every Audience a Clear View" → **use-case/business-value paragraph**
  (presentations, training sessions, events; a clear view for every seat; teams and audiences focused on the
  content) → existing CTA → product grid. The eyebrow/heading/paragraph changed; **nothing else** did.
- **Constraints honoured:** hero image + link untouched; CTA ("Shop Projector Screens") and the 6-product grid
  unchanged; no banned hero phrases in the intro ("Bigger Screen" / "Better Experiences" / "Ready Wherever" /
  portable-large-easy); no invented specs, prices, discounts or claims; RDD orange accent, Arial typography,
  spacing, CTA styling and responsive `.mp` behaviour preserved. ("Portable" now appears only in the real product
  name/description and the grid sub-label — factual product data, not the intro; subject + preheader unchanged.)
- **QA:** tag-balanced (+1 divider table/tr/td, all closed); 0 empty cells / dead links; hero verified present;
  CTA ×2 and 6 cards/6 price buttons intact; ~44 KB. Klaviyo draft `01M05BP6KA5YRB6S3DFVV5QHFE` re-attached
  (reuse, no duplicate; QA 0 blocker/0 warn); still Draft, NOT_APPROVED_TO_SEND. Manual multi-client render QA
  (Gmail/Apple Mail/Outlook, desktop+mobile) still required before send (§8.1).

---
### v2 update — header logo centered; ID confirmed RDD-2026-37
**Approval status: NOT approved to send.** Klaviyo DRAFT created; manual multi-client render QA still required (§8.1).

## v2 update — header logo centered; ID confirmed RDD-2026-37

- **Logo centered (requested).** The RDD logo previously rendered left in the orange header because both logo
  images are `display:block` with no auto margin (a block image ignores the cell's `text-align:center`). Fix:
  wrapped the two logo anchors in a centered nested `<table align="center" style="margin:0 auto">` and added
  `margin:0 auto` to each image. Bulletproof across Outlook (honours `align="center"`), Gmail and Apple Mail.
  Logo asset, header colours, padding and dimensions unchanged; only alignment changed. Balanced (+1 table/tr/td,
  all closed); still 0 empty cells / dead links. Klaviyo draft template re-attached (reuse, QA 0 blocker/0 warn).
- **ID decision (user-confirmed):** this campaign **stays RDD-2026-37** — it is NOT renumbered to RDD-2026-35.
  RDD-2026-35 is an already-SENT campaign (study space, Klaviyo `01KZFKRRT4GBQK76MAEZBTPKVE`, Sent 2026-08-11);
  reusing that ID would overwrite the record of a sent campaign, so it was left untouched. No duplicate campaign,
  no calendar renumbering, no change to RDD-2026-35 / RDD-2026-36 / the sent Klaviyo campaign.
- **Registered** in `config/approved-html.json` (RDD-2026-37 → this Output HTML + subject + preview) for mapping
  consistency. Klaviyo draft `01M05BP6KA5YRB6S3DFVV5QHFE` (reused), audience Active in the last one year (clone),
  NOT_APPROVED_TO_SEND.

---
### v1 baseline (below)

## Calendar slot & theme

- **Slot:** RDD-2026-37 (Lark RDD calendar), scheduled **2026-08-31**. Next open/ungenerated RDD slot (RDD-2026-35/-36
  already built).
- **Theme decision (user-directed):** the calendar row's planned topic is *Mobile TV Stands (Promotional sale)*, but
  the supplied hero is **portable projector screens**. Per the user, this send uses the **slot's id + date** with the
  **hero's projector-screen theme** (theme overrides the calendar topic for this run; the Lark calendar was **not**
  modified). Flagged so the calendar row can be reconciled by the coordinator.
- **Not a duplicate:** no existing RDD projector-screen Weekly; the past projector slot RDD-2026-20 (May) is unrelated.

## Hero

- **Asset:** supplied `hosting/rdd/Replace_product_in_design_template_202608162013.jpeg` (1376×768 → 600×335).
  "BIGGER SCREEN. BETTER EXPERIENCES.", 100" 4:3 portable screen, RDD orange. Clean RDD artwork, no foreign brand.
- **Deployed:** committed + pushed (`2a5c112`); live at
  `https://assets-rdd.vercel.app/Replace_product_in_design_template_202608162013.jpeg` (HTTP 200 `image/jpeg`).
- **Destination:** hero + primary CTA → `https://www.retaildisplaydirect.com.au/projector-screen/` (category, HTTP 200).

## Products (6 — all RDD, brand_id 69 "ERGO DC"; verified via Catalog API `ugqmr0qfvf` + live URL/image HTTP 200)

| SKU/id | Name | Price | Stock | URL |
|---|---|---|---|---|
| 1534 | Portable Projector Screen 100" 4:3 | $253.30 | 13 | /ergodc-portable-projector-screen-100-4-3/ |
| 1537 | Floor Projector Screen 100" 16:9 | $325.00 | 10 | /ergodc-floor-projector-screen-100-16-9/ |
| 1536 | Retractable Projector Screen 80" 16:9 | $234.60 | 17 | /ergodc-retractable-projector-screen-80-16-9/ |
| 1533 | Floor Rising Projector Screen 80" 4:3 | $289.00 | 3 | /ergodc-floor-rising-projector-screen-80-4-3/ |
| 1535 | Pull Up Projector Screen 72" 16:9 | $270.00 | 6 | /ergodc-pullup-projector-screen-72-16-9/ |
| 1532 | Floor Projector Screen 72" 4:3 | $295.05 | **1** | /ergodc-floor-projector-screen-72-4-3/ |

- Theme-consistent (§5.1.2): the complete projector-screen range, 6 products, clean 2×3 grid (even, balanced).
- All `is_visible=true`, in stock; **1532 stock = 1** (low but valid) — flagged, replace/drop if it sells out before send.
- Only RDD products (ERGO DC is RDD's own house brand); **no SS or SectorCare products** (0 references).

## Strategy

Weekly (not Launch): hero → range CTA → themed grid → closing CTA → trust → footer. Fresh copy (AV & presentation
angle: "A Bigger Screen, Ready Wherever You Are"), concise/scannable (§6.3), no promo language (calendar theme is
overridden to product-insight-style; no discount fabricated). RDD design system reused (orange header/logo, §6.13
grey product field + white cards + orange price buttons, brandmark, trust "Why Retail Display Direct", footer).

## QA

- Built by reusing the approved `RDD-2026-35.html` head/header/trust/footer (Cerberus-hardened) + injected projector
  content. Structure equivalent to the approved baseline.
- Ghost/safety (§8.2/§6.6): 0 empty anchors, 0 nested anchors, 0 `<table>` in `<a>`, 0 empty `<td>`, 0 dead `href`,
  0 localhost. *(The `<td>` open/close count shows a +1 that is inherited byte-for-byte from the approved, sent
  RDD-2026-35 template — an Outlook-only cell — not introduced by this build; injected content is internally balanced.)*
- Links: 6 product cards (image+name+desc+price all → the product), hero+CTA → /projector-screen/, closing → /products/;
  all HTTP 200 this session. No SS/SC/localhost.
- Merge tags (§6.23): footer URL-form `{% unsubscribe_link %}` / `{% manage_preferences_link %}`; no anchor-emitting
  tag in an href; no invalid `{{ }}` vars.
- Images: 15 `<img>`, all with alt; 6 product images on the RDD CDN (`s-ugqmr0qfvf`) HTTP 200; price buttons are
  shrink-to-fit tables (§6.17); fixed-height card cells (§6.8).
- ~43 KB (under Gmail clip). Manual multi-client render QA (Gmail/Apple Mail/Outlook, desktop+mobile) still required
  before send (§8.1).

## Open gate

- **RDD audience (§13.1) — pending user confirmation** before the Klaviyo draft is created. The calendar's
  "RDD - All Subscribers" is a placeholder that does not exist in the RDD Klaviyo account; recent RDD sends used the
  `60D Active Customers` segment. Not defaulting — asking.
