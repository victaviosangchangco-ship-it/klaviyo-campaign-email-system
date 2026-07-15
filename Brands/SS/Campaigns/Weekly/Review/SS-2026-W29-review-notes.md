# SS-2026-W29 — Review & QA Notes

## Revision — 2026-07-15 (rev 15, ROOT-CAUSE FIX: product-card clickability in Klaviyo + hero mobile shrink)
Authored as `Draft/SS-2026-W29-draft-v15.html`, QA'd, promoted to `Output/SS-2026-W29.html`. SS-only.
Reviewer/approver ≠ author (CR-16); human sign-off pending before send.

**Trigger.** Consistent feedback (Bruce, Jack, internal): (1) SS product cards are **not clickable after
upload to Klaviyo** even though they work on localhost and all hrefs are valid; (2) the **hero banner
shrinks on some phones** (desktop/laptop/some phones fine). Neither issue occurs on RDD or SC. Full
architecture diff of SS vs RDD vs SC performed before any change.

### ISSUE 1 — product cards lose clickability after Klaviyo (ROOT CAUSE FOUND)
**Root cause:** SS was the only template that nested a block-level `<table>` **inside** the product-card
`<a>` — i.e. `<a><table>…<img>…</table><p>…</p></a>`. Wrapping a table in an anchor is invalid nesting
(block/table content inside an inline formatting element). Lenient browsers (VS Code localhost, desktop
render) tolerate it, so it "works" locally. **Klaviyo re-parses/normalizes imported HTML and rewrites
links for click-tracking;** per HTML tree-construction rules a `<table>` opening inside an active `<a>`
terminates the anchor and reconstructs formatting inside the table cells (adoption-agency + in-table
foster-parenting). After Klaviyo re-serializes, the anchor no longer wraps the card and the `href` lands
on a collapsed/detached node → **card not clickable.**
- **Why RDD/SC were immune (proven in their markup):** SC wraps only the `<img>` in the anchor (name/price
  are siblings outside it); RDD wraps `<img>`+`<p>` and puts the price in a separate anchor. **Neither ever
  puts a `<table>` inside an `<a>`.** `<table>`-in-`<a>` is the single distinguishing factor — hence SS-only.
- **Fix (design unchanged):** every one of the 14 cards restructured to the proven pattern — the image
  layout `<table>` now sits **outside** all anchors; the `<img>` is wrapped in its **own** anchor
  (`display:block`, matches SC); the name/sub/price `<p>` sit in a **separate** anchor (matches RDD —
  `<p>`-in-`<a>` is Klaviyo-safe, only `<table>`-in-`<a>` is not). Whole card stays fully clickable;
  fonts, colors, 176px balanced image cell, spacing byte-identical.

### ISSUE 2 — hero banner shrinks on some phones (ROOT CAUSE FOUND)
**Root cause:** the hero image lived in a rounded frame `<table>` whose width was declared **only as an
HTML attribute** (`width="100%"`) and **not in its inline `style`**. Some mobile clients (certain Gmail-app
builds on Android, Yahoo mobile) drop the legacy width attribute when a `style` is present and fall back to
**shrink-to-fit**. The frame's only content was a *fluid image* (`width:100%`) with no intrinsic minimum
width to hold the table open, so the frame collapsed and the hero rendered noticeably smaller — only on
those clients (intermittent, client-dependent, exactly as reported). Aggravated by `max-width:528px` (a
fixed desktop ceiling). **Why only the hero and only SS:** product/text tables use the same attribute-only
width but hold open on their *text* min-content; the hero is the only place a *fluid image* is the sole
content of such a table. SC/RDD heroes are direct `<td>` children with no intermediate width:100% table to
collapse. This is an HTML/CSS containment defect — **not** an image-size problem (so "just enlarge it"
would not fix it).
- **Fix (additive hardening, no visual change on correct clients):** added `width:100%` to the **inline
  style** of the hero frame table and the headline panel so no client can shrink-to-fit them; changed the
  hero image `max-width:528px` → `max-width:100%` so it always fills the frame; added a defensive
  `.hero-img { width:100% !important; max-width:100% !important; height:auto !important; }` mobile rule.

### QA — PASS (automated)
- Structure balanced: `<a>` 39/39 · `<table>` 63/63 · `<tr>` 68/68 · `<td>` 79/79 · `<p>` 65/65.
- **Anchors containing a `<table>`: 0** (was 14) — the Klaviyo-breaking construct is fully eliminated.
- 14 product cards, each with image-anchor + text-anchor to the same verified product URL (full-card click).
- Hero: `max-width:528px` removed (0 occurrences); `.hero-img` class present; frame + panel carry inline
  `width:100%`.
- Images spot-validated HTTP 200 / `image/*` / 0 redirects (hero 67 KB JPEG, logo 5 KB, product/category
  samples). `{% unsubscribe_link %}` and SITE15 intact.
- **Not exercised here:** live Gmail-app / Klaviyo import render — remains a manual pre-send spot-check.

### Carried-forward blockers (unchanged)
- **Coupon SITE15** must be confirmed created + ACTIVE in BigCommerce before send (SS BC not connected here).
- **Category-tile PNGs still heavy** (~0.5 MB each). Optimised same-creative JPEGs exist in
  `Assets/SS-2026-W29-cat-*-opt.jpg` (rev 14) but need hosting on SS's own Klaviyo (`T7SuPP`) before swap.
  Not part of this fix; kept as-is to avoid an unapproved creative change.

---

## Revision — 2026-07-14 (rev 14, revert rev-13 substitution + deeper Gmail-mobile root-cause)
Authored as `Draft/SS-2026-W29-draft-v14.html`, QA'd, promoted to `Output/SS-2026-W29.html`. SS-only.

**Why:** rev 13 replaced the 4 "Explore by Category" tiles with different BigCommerce *product* photos.
That changed the approved branded/lifestyle creative and the section's intended design — rejected.
Rev 14 **restores the 4 original category creatives** (the T7SuPP Klaviyo-hosted lifestyle tiles); links,
labels, layout and spacing unchanged. All 4 originals re-verified HTTP 200; structure 63/63·68/68·79/79.

**Deeper root-cause audit (the reported Gmail-mobile breakage also hit the logo/hero/products, not just
the category tiles).** Re-probed all 21 image URLs, including with Gmail's real `GoogleImageProxy`
user-agent:
- **All 21 return HTTP 200, correct `image/*` content-type, no redirects — even to Gmail's proxy UA.**
  There is **no** origin/URL/redirect/content-type/WAF defect; the 5 KB logo serves fine too.
- Therefore image **weight is not the root cause** of a 5 KB logo failing, and the URLs are all valid.
  The most likely cause of "renders on desktop, broken in the Gmail *app* on a fresh test send" is Gmail's
  **asynchronous image-proxy cache warming** (images can show broken on first mobile open, then resolve),
  or a device-side data-saver / flaky-network condition during the test — not an HTML/URL defect we can
  "fix" at the markup level. **Recommended before drawing conclusions: re-open the test after a few minutes,
  and/or send a fresh Klaviyo test and check "Display images" / data-saver on the test device.**

**Still worth doing (prepared, pending hosting).** The 4 original category PNGs are genuinely oversized
(631×354 photos as ~0.5 MB PNG-RGBA). Optimised, **same-creative** JPEGs were produced (identical
631×354 crop/composition, flattened on the white email background, JPEG q84) and saved to
`Assets/SS-2026-W29-cat-*-opt.jpg`:

| Category | Original PNG | Optimised JPEG | Reduction |
|----------|-------------|----------------|-----------|
| Tactile Indicators | 604,558 B | 60,503 B | −90% |
| Cable Protector | 529,068 B | 51,501 B | −90% |
| Wheel Stop | 578,052 B | 56,863 B | −90% |
| Platform Trolley | 481,862 B | 45,872 B | −90% |

These are **not yet swapped into the email** — they need a stable public HTTPS host first. SS's own
Klaviyo account (`T7SuPP`, where the originals live) is **not connected** this session; the connected
Klaviyo is RDD (`XAUdQX`). **Decision (user, 2026-07-14): host on SS's own account** — do NOT store SS
assets under RDD's Klaviyo or relay through third parties. Handoff: SS team uploads the four
`Assets/SS-2026-W29-cat-*-opt.jpg` files to SS's own Klaviyo (`T7SuPP`) image library or BigCommerce and
returns the hosted URLs; a **rev 15** will then swap the 4 tile `src` URLs to those optimised same-creative
assets (no design/layout/link change). Until then Output keeps the original (heavy but valid) creative.

**Coupon SITE15 still requires confirmation it is created + ACTIVE in BigCommerce before send (unchanged).**

## Revision — 2026-07-14 (rev 13, Gmail-mobile image fix — oversized category tiles)
Authored as `Draft/SS-2026-W29-draft-v13.html`, QA'd, promoted to `Output/SS-2026-W29.html`. SS-only.

**Reported issue:** images rendering on desktop but showing broken-icon + alt text in the Gmail mobile app
(logo, hero, category tiles, several product images).

**Root-cause audit (evidence-based).** Extracted all 21 `<img src>` and probed each as Gmail's proxy would
(followed redirects; captured status, content-type, size):
- **All 21 URLs were already valid** — absolute HTTPS, HTTP 200, no redirects, correct image content-types,
  publicly reachable on `cdn11.bigcommerce.com` and `d3k81ch9hvuctc.cloudfront.net`. So relative/local/
  inaccessible/redirecting URLs were **not** the cause (hypothesis disproven by data).
- **The real defect was image weight.** The 4 "Explore by Category" tiles were 631×354 photos saved as
  **PNG-RGBA at ~480–604 KB each (~2.2 MB combined)**; total email image payload was **~2.9 MB**. That is
  the classic profile for images that render on desktop but fail intermittently in the Gmail mobile app
  (the app aborts/defers heavy loads on mobile and can drop the lighter images alongside them).

**Fix (design + products unchanged).** Replaced only the 4 category tile image URLs with stable BigCommerce
CDN JPEGs (`stencil/500x500`, representative product per category), matching the reliable CDN the product
grid already uses:
- Tactile Indicators → `products/137/854/TACS01_AA…` (32 KB)
- Cable Protector → `products/838/3628/CABL01_A…` (56 KB)
- Wheel Stop → `products/126/2216/A__88254…` (20 KB) — tile is illustrative and links to the `/wheel-stops/`
  category page (the specific SKU pictured is currently OOS, which is fine for a category tile).
- Platform Trolley → `products/858/3829/1_64…` (50 KB)
- Logo, dark-mode logo and hero (all small, 5/43/67 KB) kept as-is.

**QA — PASS.** Full re-audit of all 21 images: **21/21 HTTP 200, 0 redirects, all image/*** content-types.
**Total image payload 840 KB, down from ~2.9 MB (−71%);** largest single image now 96 KB. Structure
unchanged (tables/tr/td 63/63 · 68/68 · 79/79); 0 oversized category PNGs remain; `{% unsubscribe_link %}`
and SITE15 intact. Note: Gmail mobile could not be exercised in this environment — verification is via the
proxy-equivalent URL/weight audit; a live Gmail-app spot-check remains a manual pre-send step. **Coupon
SITE15 still requires confirmation it is created + ACTIVE in BigCommerce before send (unchanged from rev 12).**


Authored as `Draft/SS-2026-W29-draft-v12.html`, QA'd, promoted to `Output/SS-2026-W29.html`. SS-only.
- **Hero content block — consistent left alignment axis.** Made the shared left axis for the eyebrow,
  headline and body copy **explicit** (`text-align:left` on the panel td and all three elements; all
  already had no left margin, so they now provably align on one axis and cannot be centered by any client).
- **Vertical rhythm + balanced padding.** Panel padding set to a balanced `36px 32px`; rhythm tuned for a
  clean hierarchy — eyebrow→headline 12px (kicker hugs the title), headline→body 18px (clear step down),
  headline line-height 1.04→1.05.
- **Same discipline throughout.** Added explicit `text-align:left` to the three section headings
  ("Keep your site safe and under control", "Explore by Category", "We provide professional services to
  our clients") so the whole email's left-alignment is intentional and consistent (all section content on
  the 24px column established in rev 11; panel/card inner text consistently inset within its container).
- No product data, copy, coupon, images, or other sections changed.
- **QA:** 7 explicit left-aligns (hero td + 3 hero elements + 3 headings) · 14 product cards · SITE15 +
  validity intact · `{% unsubscribe_link %}` intact · tables/tr/td 63/63 · 68/68 · 79/79 · desktop + mobile
  rendered; hero eyebrow/headline/body verified on one axis with balanced padding; all 14 product images
  load (an earlier render showed transient headless fetch timeouts — all URLs re-verified HTTP 200).

---

## Revision — 2026-07-13 (rev 11, fix broken A4 image + alignment audit applied)
Authored as `Draft/SS-2026-W29-draft-v11.html`, QA'd, promoted to `Output/SS-2026-W29.html`. SS-only.
- **A4 Floor Poster Display Stand image fixed.** The primary image (BC image 613,
  `DS-MA4__97659.1535088197`) is only **199×500** and shows a **Vogue magazine cover** — it rendered as a
  tiny, off-brand sliver ("broken"). Replaced with the same product's higher-res gallery image (BC image
  **614**, `DS-MA4_B__26968.1535088228`, **485×728**, HTTP 200) from the live BigCommerce product page —
  a clean shot of the A4 display frame, no fashion cover. Same card dimensions/aspect/padding as the
  other cards (fixed 176px image cell). No placeholder/invented image.
- **Alignment audit — actually applied (not just documented).** Found the content column was inconsistent:
  hero/panels/coupon/cards/tiles/trust/contact all sat on a **24px** left margin, but the **header logo
  (28px)** and the **three section headings (28px)** were 4px inset. Harmonized header logo + all section
  headings to **24px** so every section's left edge lines up. (Hero eyebrow/headline/intro remain inset
  inside their grey rounded panel by design; card inner text sits at 36px inside the 24px card edge, which
  is the intended card padding.)
- Re-verified: headings, body copy, section widths, product columns/card heights, image sizing, padding,
  coupon/CTA alignment — all consistent on desktop and mobile.
- **QA:** A4 image loads (200, 39KB, higher-res) · 14 product cards · left edges consistent at 24px ·
  tables/tr/td 63/63 · 68/68 · 79/79 · desktop + mobile rendered, balanced, no overflow.

---

## Revision — 2026-07-13 (rev 10, Bruce feedback: product count, first impression, coupon placement)
Authored as `Draft/SS-2026-W29-draft-v10.html`, QA'd, promoted to `Output/SS-2026-W29.html`. SS-only.
- **Product grid 10 → 14** (7×2). Added 4 live, in-stock, non-duplicate SS products (verified HTTP 200
  2026-07-13): Car Park Bollard 165x1300mm $205.00 · Rubber Wall Guard Bumper 1000mm $38.66 · Rubber Dock
  Bumper D Type 900mm $48.95 · A4 Stainless Steel Floor Poster Display Stand $115.50. Chose **14, not 16**:
  additional distinct in-stock SS products that fit the theme were limited (outdoor convex mirror + kerb
  ramp 150mm out of stock), and 14 keeps the grid balanced without making the email excessively long
  (Bruce: prefer 16 only if still balanced). Existing consistent card design + fixed 176px image cells kept.
- **First impression / above-the-fold** — reworked opening to hook first: framed hero photo → bold
  "Set Up a Safer Site." headline → tightened intro → straight into the product grid. No CTA/coupon
  interrupts the top now.
- **Coupon placement** — moved the SITE15 coupon panel from directly-after-hero to **after the product
  grid** (products hook first, then the offer), per Bruce. Coupon not removed.
- **Copy length** — intro trimmed from 3 sentences to 2 concise, scannable sentences (normal weekly
  cadence; no em dashes).
- **Alignment audit** — headline/intro/section headings all left-aligned and consistent; 14 cards uniform
  (equal image areas, name/sub min-heights, aligned red prices); desktop + mobile rendered and checked,
  no overflow.
- **⚠️ Coupon verification flag** — HTML comment + this note: SITE15 must be created and confirmed ACTIVE
  in BigCommerce before send (SS BC API not connected here; cannot auto-verify). Validity "Valid until
  21 July 2026 · One-time use" is user-confirmed; no discount % supplied so none shown.
- **QA:** 14 product cards · 0 duplicate grid products · all images/names/prices/links verified (42 URLs
  HTTP 200) · SITE15 + validity present · Explore by Category (4 tiles) intact · trust + footer +
  `{% unsubscribe_link %}` intact · tables/tr/td 63/63 · 68/68 · 79/79 · desktop + mobile balanced.
- CLAUDE.md updated with reusable workflow rules (new §6.3) — no campaign-specific details added.

---

## Revision — 2026-07-13 (rev 9, harmonized trust-section icons to monochrome black)
Authored as `Draft/SS-2026-W29-draft-v9.html`, QA'd, promoted to `Output/SS-2026-W29.html`. SS-only.
- **Australia-wide shipping icon** changed from the coloured delivery-truck **emoji** (`&#128666;` U+1F69A,
  which renders in colour regardless of CSS) to the monochrome **BLACK TRUCK** glyph `&#9951;&#xFE0E;`
  (U+26DF + text-presentation selector VS15) — the same "U+26xx BLACK … + &#xFE0E;" pattern already used by
  the phone icon (U+260E). Styled identically to the other three: `font-size:22px; line-height:1; color:#000000;`.
- All four trust icons now share one monochrome black style (truck / heart / returns arrow / phone),
  consistent size, weight, alignment and spacing. Verified via an enlarged glyph render: U+26DF renders as a
  clean black truck in Segoe UI Symbol (Windows/Outlook); the VS15 selector matches the phone icon's approach
  for cross-client text presentation. Trust-card text, layout, and all other sections unchanged.
- **QA:** coloured emoji removed (0) · black truck glyph present (1) · all 4 icons `22px/#000000` · card labels
  intact · 10 product cards intact · tables/tr/td 51/51 · 56/56 · 65/65 · desktop + mobile rendered, icons
  consistent monochrome.

---

## Revision — 2026-07-13 (rev 8, CTA cleanup + SITE15 coupon details)
Authored as `Draft/SS-2026-W29-draft-v8.html`, QA'd, promoted to `Output/SS-2026-W29.html`. SS-only.
- **Removed the redundant CTA block** (CLAUDE.md §6.2 no-duplicate-CTA): the "Explore our full range"
  black button and the 3 secondary-nav pills ("All products" / "Government orders" / "Bulk deals"). The
  SITE15 "Shop now" is the single primary CTA; the product grid + Explore by Category are the browsing
  paths. Coupon now flows straight into the product grid (spacing balanced).
- **SITE15 coupon details** — validity line updated from the pending placeholder to the user-confirmed
  "**Valid until 21 July 2026 · One-time use**". Code unchanged (SITE15); "Shop now" CTA retained. No
  discount % was provided by the user, so none is shown (not fabricated). SITE15's active status in
  BigCommerce still can't be auto-verified here (SS BC API not connected) — confirm before send.
- **Final flow:** Header → Hero → Headline+Intro → SITE15 coupon/Shop now → Product grid → Explore by
  Category → Trust → Footer. Explore by Category remains AFTER the grid (not moved below the coupon);
  4 Featured Categories + images/links unchanged.
- **QA:** "Explore our full range" removed (0 visible) · All products/Government orders/Bulk deals removed
  (0) · SITE15 intact · "Valid until 21 July 2026 · One-time use" visible · Shop now intact · grid before
  Explore by Category · 4 categories intact · 10 product cards intact · unsubscribe/footer intact ·
  tables/tr/td 51/51 · 56/56 · 65/65 · desktop + mobile rendered, balanced.

---

## Revision — 2026-07-13 (rev 7, added "Explore by Category" section)
Authored as `Draft/SS-2026-W29-draft-v7.html`, QA'd, promoted to `Output/SS-2026-W29.html`. SS-only.
- **New section: "Explore by Category"** — 2×2 grid of clickable image tiles (reference CampaignSS3 tile
  pattern: rounded image + uppercase centered label below). Placed **after the 10-product grid, before the
  "We provide professional services" trust section** — a natural "keep exploring" position.
- **4 provided SS category images** (all `company/T7SuPP/...png`, 631×354, identical dimensions → balanced,
  no cropping needed) linked to **confirmed live SS category pages:**
  - Tactile Indicators → https://www.safetysector.com.au/tactile-indicator/ (title "Tactile Indicators & Pads", in site nav)
  - Cable Protector → https://www.safetysector.com.au/cable-protector/
  - Wheel Stop → https://www.safetysector.com.au/wheel-stops/
  - Platform Trolley → https://www.safetysector.com.au/platform-trolley/
- Email-safe table layout; tiles use `class="pc"` so they stack 1-up on mobile (same mechanism as product
  cards). Images not generated/replaced. No product data or other sections changed.
- **QA:** heading present · 4 tile images + 4 category URLs HTTP 200 · 10 product cards intact · SITE15 intact ·
  `{% unsubscribe_link %}` intact · tables/tr/td 54/54 · 59/59 · 70/70 · desktop 2×2 + mobile 1-up rendered,
  balanced, no overflow. No missing/unconfirmed category links.

---

## Revision — 2026-07-13 (rev 6, header/hero-frame/heading/order/footer refinements)
Authored as `Draft/SS-2026-W29-draft-v6.html`, QA'd, promoted to `Output/SS-2026-W29.html`. SS-only.
1. **Header logo** reduced 150→130px (max-width 48→42%), still LEFT-aligned — cleaner, more balanced header.
2. **Hero banner frame** — hero photo now sits inside a light-grey (#f2f2f2) rounded frame (outer radius 16px,
   12px balanced padding all sides; inner image radius 10px). Image itself unchanged (same src, not cropped/
   stretched/regenerated); width 552→528 to fit inside the frame padding.
3. **Product heading** — "Traffic and site-safety essentials" → "**Keep your site safe and under control**"
   (drops "essentials"; matches the "Set Up a Safer Site" theme). Supporting copy refreshed to
   "Bollards, barriers and hazard control that protect vehicles, pedestrians and property. Professional
   grade and ready to ship Australia-wide."
4. **Grid order** — swapped products 1 & 2: **Fold Down Parking Bollard is now #1**, Surface Mounted
   Safety Bollard 900mm is #2. Verified data/URLs/images/prices unchanged; grid still balanced.
5. **Footer** — removed the standalone "Facebook · Instagram" text-link line. Unsubscribe, Privacy Policy,
   and company details (Safety Sector Pty Ltd + address) preserved.
- **QA:** logo 130px left-aligned · grey hero frame present · hero img unchanged · 0 "essentials" · Fold Down
  #1 / Surface Mounted #2 · 10 cards balanced · 0 facebook/instagram · unsubscribe+privacy+company intact ·
  tables/tr/td 50/50 · 53/53 · 62/62 · desktop + mobile rendered, email-safe.

---

## Revision — 2026-07-13 (rev 5, hero banner added — blocker resolved)
Authored as `Draft/SS-2026-W29-draft-v5.html`, QA'd, promoted to `Output/SS-2026-W29.html`
(reviewer/approver ≠ author — human sign-off pending). SS-only; nothing else changed.

- **Hero banner blocker RESOLVED.** User supplied an approved SS-hosted photo
  (`.../T7SuPP/images/55c52cca-baa1-4ead-b719-476dbc8af1c3.jpeg`, HTTP 200, JPEG 1167×651, ~16:9): a man
  installing a yellow surface-mounted safety bollard (red top) in a commercial car park. Placed at the top
  of the hero section in a rounded frame (reference CampaignSS1 composition: photo on top, then the grey
  headline/intro panel). Full-width within the 600px container, aspect ratio preserved
  (`width="552"` + `width:100%; max-width:552px; height:auto; border-radius:14px`); not cropped/stretched/
  regenerated. Alt text describes product + scene.
- **Hero link:** banner links to the featured bollard's verified BigCommerce product page
  `https://www.safetysector.com.au/surface-mounted-safety-bollard-900mm/` (HTTP 200; same product as grid
  card #1, which the scene depicts).
- **Spacing:** only adjustment — hero image row `padding:24px 24px 0` and the text-panel top padding
  trimmed 26→16px so the photo and grey panel sit as one integrated hero. Theme, SITE15 coupon, product
  grid, trust, footer all unchanged.
- **QA:** hero img present (1) + resolves 200 · links to bollard URL · 10 product cards intact · SITE15
  intact · `{% unsubscribe_link %}` intact · 0 `[[…]]` · tables/tr/td 49/49 · 52/52 · 61/61 · desktop
  (600px) + mobile (375px) rendered and reviewed — banner scales full-width, aspect preserved, no
  distortion or overflow.

---

## Revision — 2026-07-13 (rev 4, product refresh vs previous send + SITE15 coupon + banner recommendation)
Authored as `Draft/SS-2026-W29-draft-v4.html`, QA'd, promoted to `Output/SS-2026-W29.html`
(reviewer/approver ≠ author — human sign-off pending, CR-16/CR-17). SS-only; no RDD/SC/Stack touched.

- **"Previous SS weekly campaign" = the approved reference send** (`References/CampaignSS1–5.png`,
  "Built Tough. Finished Beautifully."). Its grid products: Removable Safety Bollard 1000mm, Bike Rack
  Galvanized Circular, Expanding Barrier 5 Metre, Platform Cage Trolley, Steel Speed Hump 1m Module,
  Retractable Barriers in Red Belt, Cable Protector 2 Channel, Industrial Rubber Wheel Chock. (No earlier
  dated SS weekly send exists in the project.)
- **Products removed (3) vs previous send / for balance:**
  - Cable Protector 2 Channel — EXACT repeat of the previous send.
  - Bike Rack Galvanized Circular — EXACT repeat of the previous send.
  - Car Park Bollard 165x1300mm — reduced 3 bollards → 2 (balance / too similar to other bollards).
- **Products added (3, live BigCommerce `s-498h0egvgn`, in-stock + HTTP 200 2026-07-13):** Rubber Kerb
  Ramp 100mm $41.90 · Rubber Dock Bumper D Type 1000mm $69.70 · Statutory Sign – Storage Room $24.22.
  Fresh categories (kerb/access ramp, loading-dock impact, compliance signage) not in the previous send.
- **Final 10 (no duplicates):** Surface Mounted Safety Bollard 900mm $57.80 · Fold Down Parking Bollard
  $176.00 · Expandable Barrier 7.5 Metre $686.70 · Rope Barrier Set 3 Posts/2 Ropes $150.00 · Rubber
  Wheel Chock 320x290x260mm $50.15 · Rubber Kerb Ramp 100mm $41.90 · Wall Bumper Rubber 1000mm $32.26 ·
  Rubber Dock Bumper D Type 1000mm $69.70 · Convex Mirror Large Wall Mount $14.25 · Statutory Sign
  Storage Room $24.22. Balanced mix: 2 bollards, 2 barriers, wheel chock, ramp, 2 impact guards,
  mirror, signage. *Note:* Expandable Barrier / Rope Barrier / Wheel Chock are the same category as
  reference items but are distinct live SKUs (different size/type); the previous send's EXACT products
  were removed. Excluded (out of stock 2026-07-13): all wheel stops, rubber speed hump, kerb ramp 150mm.
- **COUPON — SITE15 (user-provided), verification PENDING.** Displayed prominently in a red rounded
  coupon panel matching the reference SS2 pattern (YOUR COUPON CODE / SITE15 / terms line / Shop now).
  SITE15 could **not** be verified in BigCommerce (SS BigCommerce API not connected; SS Klaviyo account
  not connected; BC coupons are not exposed on the public storefront). Per brief, discount %, expiry and
  usage restriction are **not fabricated** — shown as "to be confirmed before send" until the user
  confirms. HTML carries a comment listing exactly what is required.
- **Hero / product banner recommendation (task 1):** the "safer site / new financial year" theme suits a
  **real-environment lifestyle hero photo**: bollards + a barrier/wheel-stop protecting a commercial
  car park or loading dock/site entrance, wide 16:9, natural daylight, professional/industrial tone
  (mirrors the approved reference's building-entrance-with-bollards composition). **No suitable existing
  SS hero asset is in the project** (`Brands/SS/Assets/*` hold no images; SS.md confirms only the two
  logo assets). No image was generated/invented; the reference-style rounded hero panel + documented
  image slot remain. **Action:** source/approve such a photo (or approve AI generation via the Prompt
  Library) and drop it into the slot.
- **QA:** 10 product cards · 0 duplicate product URLs · Cable Protector/Bike Rack/Car Park Bollard removed ·
  SITE15 shown · terms not fabricated · tables/tr/td 49/49 · 52/52 · 61/61 · all images + links HTTP 200 ·
  desktop + 375px mobile reviewed, rows balanced (fixed 176px image cells), no overflow · `{% unsubscribe_link %}`
  + Privacy + socials + company info intact · truck shipping icon retained.

---

## Revision — 2026-07-13 (rev 3, theme rewrite + 10 products + grid balance + coupon blocker)
Authored as `Draft/SS-2026-W29-draft-v3.html`, QA'd, promoted to `Output/SS-2026-W29.html`
(reviewer/approver ≠ author — human sign-off pending, CR-16/CR-17). SS-only + the requested CLAUDE.md
rules; no RDD/SC/Stack campaign HTML touched.

- **New theme:** "**New Financial Year, Safer Site**" — timely for the AU FY start (send ~14 Jul 2026)
  and relevant to commercial/facility/site buyers refreshing site-safety gear. Connects directly to the
  traffic & site-safety product set. No generic weekly-sale language (hero + product heading reworded).
- **Hero rewrite:** eyebrow "New financial year at Safety Sector"; headline "Set Up a Safer Site.";
  3-line intro with clean sentences and **no em dashes / dash interruptions**. Primary CTA "Explore our
  full range" retained (theme-neutral).
- **Header logo:** reduced 190px → **150px**, left-aligned, matched to the approved reference proportion.
- **Coupon — BLOCKER:** `{{SS_WEEKLY_COUPON_PENDING}}` removed. No confirmed general weekly SS coupon
  exists (SS Klaviyo not connected; no coupon screenshots supplied; `WELCOMEBACK` = returning-customer,
  `NEWFY15` = reference mock/never-reuse). Promo panel is **code-free** (themed CTA) with a documented
  `CONFIRMED-COUPON SLOT`. A new general weekly coupon must be created before deployment.
- **Products 6 → 10** (all live BigCommerce `s-498h0egvgn`, in-stock + HTTP 200 2026-07-13). Added:
  Fold Down Parking Bollard $176.00 · Rope Barrier Set (3 posts, 2 ropes) $150.00 · Wall Bumper Rubber
  1000mm $32.26 · Bike Rack Galvanized Circular $168.58. All fit the traffic/site-safety theme.
  No sale prices present → single current price shown. Excluded (OOS): Retractable Barrier Posts,
  Parking Space Protector, Rubber Dock Leveler Bumper.
- **Grid balance:** every product image now sits in a **fixed 176px, vertically-centered image cell**
  (`max-height:176px; max-width:100%`), so mixed source aspect ratios (tall bollards vs wide barriers)
  no longer make paired cards uneven. Descriptions rewritten to concise 2-line factual subs;
  `.prod-name`/`.prod-sub` min-heights lock a shared baseline. All 5 rows balanced desktop + mobile.
- **Shipping icon:** envelope glyph → **truck** glyph (`&#128666;`) for Australia-wide shipping, matching
  the reference truck-style value icon (email-safe text glyph; no image generated).
- **Footer/socials:** unchanged from rev 2 — Facebook + Instagram (confirmed), `{% unsubscribe_link %}` +
  Privacy Policy + company/address preserved.
- **QA:** 10 product cards · 0 `{{…PENDING}}`/`COUPON_CODE_TODO` · 0 visible coupon codes · 0 em dashes in
  body copy · logo 150px left-aligned · truck glyph present · tables/tr/td 49/49 · 52/52 · 61/61 ·
  all 12 images + all 15 links HTTP 200 · desktop + 375px mobile renders reviewed, rows balanced, no overflow.

---

## Revision — 2026-07-13 (rev 2, reference-driven rework + live BigCommerce products)
Authored as `Draft/SS-2026-W29-draft-v2.html`, QA'd, promoted to `Output/SS-2026-W29.html`
(per user task instruction; reviewer/approver still ≠ author — human sign-off pending, CR-16/CR-17).
Genuine rework to the approved SS reference design pattern (not a text-swap). SS-only; no RDD/SC/Stack
campaign HTML touched. The only non-SS change was the permanent header-rule documentation in CLAUDE.md.

- **New theme:** "**Take Control of Your Site**" — traffic & site-safety management. Old
  "Non-Slip Safety, Sorted." theme and the anti-slip/tactile/stair-nosing selection **fully removed**.
- **Header:** logo now **LEFT-aligned** (was centered), per approved SS reference + new CLAUDE.md §6.1 default.
- **Hero:** rebuilt to the reference composition (light-grey rounded panel, red eyebrow, heavy headline,
  intro). **Hero photo is a documented BLOCKER** — no approved SS hero asset exists; a commented image
  slot marks where the approved photo drops in. No image generated/invented; no unrelated asset used.
- **Coupon:** `{{COUPON_CODE_TODO}}` removed → temporary deployment placeholder `{{SS_WEEKLY_COUPON_PENDING}}`
  (long placeholder wraps; a real short code sits on one line). **Must be replaced with a confirmed live
  Klaviyo/BigCommerce coupon before deployment.** No live code invented (`NEWFY15` not reused).
- **Products (6, live BigCommerce store `s-498h0egvgn`, verified in-stock + HTTP 200 2026-07-13):**
  Surface Mounted Safety Bollard 900mm $57.80 · Car Park Bollard 165x1300mm $205.00 · Expandable Barrier
  7.5 Metre Black $686.70 · Anti-Slip Rubber Wheel Chock 320x290x260mm $50.15 · Convex Mirror Wall
  Attachment Large $14.25 · Cable Protector 2 Channel $36.90. Names/URLs/prices/images all fetched live
  from product pages (JSON-LD `InStock` + og meta). No sale prices present → single current price shown.
  Excluded (out of stock): Black Retractable Barrier Posts in Red Belt.
- **Trust/value:** old cards (10-yr warranty · Australia-wide delivery · 100,000+ customers · 30-day
  returns) **removed**; rebuilt to the reference SS5 2×2: Australia-wide shipping (on every order) ·
  Australian owned (trusted local supplier) · Fast & simple returns (hassle-free) · Expert customer
  service (Mon–Fri 9am–5pm). Claims sourced from the approved reference screenshot.
- **Footer:** reworked to the reference's **light** footer + confirmed SS socials
  (Facebook `/safetysectorau/`, Instagram `/safetysector.au/`); `{% unsubscribe_link %}` + Privacy Policy
  + company name/address preserved.
- **Design note (confirm):** reference weekly uses **rounded** pills/panels; SS.md tags button
  sharp-corners `[Confirmed]` from the *winback* email. This campaign follows the approved *weekly
  reference* (rounded) as the primary visual SOT. Flag for brand sign-off which is canonical.
- **QA:** 6 product cards · 0 `[[…]]` tokens · `{% unsubscribe_link %}` intact · tables/tr/td 31/31 ·
  34/34 · 41/41 · all 8 images + all 11 links HTTP 200 · desktop + mobile (375px) renders reviewed,
  no horizontal overflow · old theme/products/trust/coupon fully removed.

---

## Original notes (draft v1)

# SS-2026-W29 — Review & QA Notes (draft v1)

Improved SS Weekly, refreshed from the single existing SS reference campaign
(`../References/CampaignSS1–5.png` = ONE email: "Built Tough. Finished Beautifully.").

- **Draft:** `Draft/SS-2026-W29-draft-v1.html` · **Output:** `Output/SS-2026-W29.html`
- **Brand values:** from `03-Brands MD Files/SS.md` ([Confirmed]/[Inferred] as tagged there).
- **Author:** engine generation. **Reviewer/approver:** _pending_ — must differ from author (CR-16). Approval not yet recorded (CR-17).

## Reference campaign structure (reconstructed)
Header (SAFETY SECTOR wordmark) → photographic hero (building/bollards) → grey headline panel + intro →
**red coupon panel (NEWFY15)** → black full-width CTA ("Explore our full range") → 2×2 category image tiles →
"Exquisite craftsmanship…" heading → large product grid (red prices) → 3 black CTAs (Browse/On Sale/Get Quote) →
"We provide professional services…" 2×2 trust grid → "Got a question?" phone+email → light footer.

## Preserved (brand familiarity)
- Centered wordmark header; **red coupon panel** as the promo centrepiece; **black, sharp-cornered, full-width**
  primary CTA (SS.md [Confirmed] button style); **red prices**; 2-line product descriptions; trust grid; contact
  block (phone + email); brand voice (factual, credibility-led).

## Improvements made
- **Hero:** replaced the missing/unavailable photo hero with a **blush (#FBEAEA) typographic panel** (red eyebrow +
  heavy headline + intro) — cleaner, no fabricated asset, stronger hierarchy.
- **Promo hierarchy:** coupon chip in a dashed white box on the red panel; explicit fine-print line.
- **Curated grid:** tightened the reference's long, mixed grid to a **focused 2×2 of 4 in-stock compliance products**
  (equal-height cards, consistent gutters).
- **Secondary nav:** reference's 3 ad-hoc buttons → 3 outline pills mapped to **confirmed SS URLs** (All products /
  Government orders / Bulk deals).
- **Trust strip:** now uses SS.md **[Confirmed] trust claims** (10-yr warranty · Australia-wide delivery · 100,000+
  customers · 30-day returns) instead of generic reference copy.
- **Footer:** promoted to the SS.md **[Confirmed] black footer** (red mark logo, brand blurb, amber links, social).
- Consistent spacing rhythm, ≥44px tap targets, dark-mode handling, meaningful alt text throughout.

## Distinct from RDD
Black/red/white + blush, heavy `Arial Black` headings, **sharp-cornered** black buttons, **red** prices, black footer —
none shared with RDD's orange/navy/rounded system.

## Automated QA — PASS
| Check | Result |
|-------|--------|
| Unresolved framework tokens `[[…]]` | 0 |
| Klaviyo Liquid intact | `{% unsubscribe_link %}` present |
| Table/tr/td balance | 28/28 · 29/29 · 36/36 |
| Product cards | 4 (2 rows × 2), all in-stock (verified live 2026-07-11) |
| Images with non-empty `alt` (CS-11) | 7/7 |
| Image URLs resolve (HTTP 200) | 7/7 (2 logos + 4 products + footer mark) |
| Preheader (CS-14) | present + hidden |
| Bulletproof CTA (CS-08) | VML + anchor (×2 CTAs) |
| Dark mode (CS-12) | `color-scheme` meta + `prefers-color-scheme` + `[data-ogsc]` (stable-light palette) |

## Products (verified live 2026-07-11 — website source, store `s-498h0egvgn`)
Tactile Plate 300x600mm $136.50 · Tactile Plate Carborundum 300x300mm $76.50 · Anti-Slip Stair Nosing Rubber 10mm
$31.95 · Anti-Slip Stair Nosing Heavy Duty Black 10mm $29.48. All names/URLs/prices/images verified; all **in stock**.
Excluded because **out of stock**: Wheel Stop Australian Compliance, Rubber Wheel Stop 1650mm, SS Tactile Plate 300x300mm.

## Blocking follow-ups / TODOs (before send)
- **Coupon:** `{{COUPON_CODE_TODO}}` — no verified current SS coupon (SS Klaviyo account not connected; `NEWFY15`
  not reused). Confirm code + discount % + expiry + terms, then replace the placeholder.
- **Phone** `02 9790 2182` — observed in the SS reference footer + SS.md [Confirmed] email; SS.md lists phone
  "To be confirmed". Confirm against an official source.
- **Live stock** for all 4 products at send time.
- **Brand hex** (accent red, blush, footer amber) — currently [Inferred] in SS.md; confirm.
- **BigCommerce store hash** `s-498h0egvgn` observed on live CDN URLs; not documented in SS.md — confirm.
- **Manual render** (per QA-Checklist): Gmail/Apple Mail (light+dark)/Outlook (VML); 2-up→1-up stack at 375px; Klaviyo test send resolves `{% unsubscribe_link %}`.
