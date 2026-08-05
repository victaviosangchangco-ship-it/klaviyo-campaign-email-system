# RDD Product Launch — Concept D (Review & QA Notes)

**Latest draft:** `Draft/RDD-2026-LAUNCH-Concept-D-draft-v12.html` (v12 assessed below; v1–v11 kept for history)
**Production file:** `Output/RDD-2026-LAUNCH-Product-Launch-Final.html` (regenerated from v12, in sync).

---

## v12 — New hosted flattened banner image; whole banner one clickable link (+ Output sync)

**Base:** v8 (per user). **Diff vs v8 = the promo banner block only** — sections before the banner and from the Trust Strip to EOF are byte-for-byte identical to v8 (verified). v8 and all prior drafts preserved for history.

**Change.** Swapped the promo banner to the new pre-composed hosted image
`…/v1784345138/Warehouse_email_banner_advertise__202607181124_pgyqxv.jpg`, which already contains the warehouse photo, dark overlay, `SAFE ACCESS.`/`BUILT TO LAST.`, supporting copy **and** the orange `EXPLORE COLLECTION` CTA. Because the CTA is baked into the image, v8's separate HTML CTA strip was removed (keeping it would duplicate the button). The **entire banner is now one clickable `<a>` → `/products/`**.

**Requirements met.**
- Whole banner (image + baked CTA) clickable to `https://www.retaildisplaydirect.com.au/products/`.
- Accessibility: descriptive `alt` on the `<img>`; `aria-label` on the clickable link; `role="presentation"` on the layout tables only.
- Responsive/email-safe (§6.6): anchor wraps inline `<img>` only (no `<table>` in an anchor); `<img>` is `display:block` with explicit `width="552" height="308"` (aspect box reserved) + `max-width:552px` + `.promo-img` fluid class → 100% width on mobile, height auto, **no crop**, no horizontal scroll, aspect ratio preserved, retina-crisp (1200px source for a 552px slot), 320px→desktop.
- Weight: source served via Cloudinary `w_1200,q_auto:good,f_jpg` = **~90 KB** (down from the 680 KB original) so it stays safe on Gmail mobile (§8). No crop transform used.
- Untouched: header, hero, product grids, footer, typography, colours, spacing, structure (identical to v8).

**Output.** Per §9 (Output mirrors the newest draft; regenerate, don't hand-edit), `Output/RDD-2026-LAUNCH-Product-Launch-Final.html` was regenerated as a copy of v12. Note: the previous Output/Final was **stale** (older plain nav + old CSS `background-image` promo); it now matches the current draft lineage (per-item orange-underline nav per §6.10, email-safe image banner). A second, older file `Output/RDD-2026-LAUNCH-access-safety-range.html` (different/earlier build, no promo) was left in place — flag for cleanup so Output holds a single canonical file (§9).

**Still-required manual pre-send checks (not exercised here):** Klaviyo import (confirm the banner link survives rewrite), Gmail Web, Gmail Mobile (Android + iPhone), Apple Mail iPhone, Outlook / Outlook 365, Yahoo Mail. Status: **not approved to send.**

---

## v12 — FINAL QA before production release (2026-07-18)

Full automated + link/asset QA re-run on `Draft/RDD-2026-LAUNCH-Concept-D-draft-v12.html`. `Output/RDD-2026-LAUNCH-Product-Launch-Final.html` confirmed **byte-identical** to v12 (`diff -q` → identical).

### Automated markup QA — ALL PASS
| Check | Result |
|-------|--------|
| Output == Draft v12 (in sync, §9) | **identical** |
| §6.6 — anchors wrapping a `<table>` | **0** |
| §6.6 — image-wrapping `<a>` carrying `display:block` | **0** |
| Images with `width`+`height` attributes | **16 / 16** |
| Em dashes (—/`&mdash;`) in copy (§6.2) | **0** |
| "Safety Sector" competitor name shown (§5.4) | **0** |
| Tag balance (real tags) table/td/tr/a | **39/39 · 79/79 · 62/62 · 41/41** |
| Stray `#` hrefs (excluding `#launching-soon`) | **0** |
| `#launching-soon` placeholders (9 products × 2 anchors) | **18** |

> Tag-balance note: a raw `grep` shows 40 `<table` — the 40th is the literal text `<table>` inside the §6.6 explanatory HTML comment on the promo block, **not** a real tag. Real tables balance 39/39.

### Live link + asset verification — ALL 200 (27 / 27 unique URLs)
| Group | Result |
|-------|--------|
| Logo image (BigCommerce stencil) | 200 `image/jpeg` |
| Hero composed image (Cloudfront `d26798ba`) | 200 `image/jpeg`, **61 KB, 0 redirects** |
| Promo flattened banner (Cloudinary `w_1200,q_auto:good,f_jpg`) | 200 `image/jpeg`, **88 KB, 0 redirects** |
| 13 product images (BigCommerce CDN, incl. 9 launching-soon) | 13 × 200 `image/jpeg` (≤19 KB each) |
| 4 live barrier product pages | 4 × 200 `text/html` |
| 4 nav category pages (`/sit-stand-desk/ /snap-frames/ /safety-equipments/ /acrylic-display/`) | 4 × 200 |
| Promo CTA `/products/`, hero/logo/footer `www`, privacy-policy | all 200 |

All images deliver **direct (0 redirects)** with `image/*` content-type → Gmail image-proxy safe (§8); payloads modest → Gmail-mobile safe.

### Blockers re-checked (unchanged — still gate the SEND, not the file's presence in Output)
1. **9 SKUs (7 ramps + speed hump + bollard) not published** — slug probes 404; authoritative `is_visible=false` state stands. Correctly shown as clearly-marked "Launching soon" placeholders (image + title, `#launching-soon`, no live link). Publish + re-verify (BC Catalog API) before any card links live.
2. **Hero links to homepage (interim)** because the featured ramp page is 404 — swap to the ramp's live product URL once published.
3. **Two "Safety Sector" BigCommerce titles** (speed hump, bollard) still need renaming at source; the email already uses RDD-neutral display names, so nothing competitor-branded ships — data-hygiene item, not a render defect.

### Remaining manual gates — CANNOT be exercised in this environment (must be done before send, §8.1)
These require a real Klaviyo account write + real devices/clients and are **not** proven by the automated pass above. Do **not** treat as passed:
- **Klaviyo test import** → confirm every clickable element (product cards, hero, promo banner→`/products/`, nav, logo, footer) still navigates correctly **after Klaviyo's link rewrite**, and the VML barrier buttons render in Outlook.
- **Client renders:** Gmail Web · Gmail Mobile (Android + iPhone) · Apple Mail iPhone · Outlook / Outlook 365 · Yahoo Mail. Confirm the hero + promo banner render full-size (no shrink/collapse) and the 2-col grids stay aligned & centered (25mm last card).

**Send-gate status: NOT approved to send.** Everything verifiable here is green; the campaign is render-/preview-ready in `Output/`. The §8.1 send gate stays open pending the Klaviyo-import + client-render checks and resolution (or accepted "launching soon" treatment) of the 3 blockers above.

---

## v11 — Promo Banner CTA re-baked premium, banner otherwise identical to v9 (per user direction)

**Base:** v9 (user directed: keep v9's banner exactly; improve only the CTA). v10's HTML-button-in-dark-footer approach was set aside per the user ("do not darken / no extra black sections / do not change composition"). v11 is v9 with the CTA re-baked more premium.

**Assessed draft:** `Draft/RDD-2026-LAUNCH-Concept-D-draft-v11.html`. **Diff vs v9 = one substring**, the Cloudinary *button layer* only. Everything else — warehouse photo, dark overlay (`e_colorize:56`), `SAFE ACCESS.`/`BUILT TO LAST.` and supporting-copy positions, crop (`w_1104,h_500`), banner height, background, alt text, and all HTML/CSS — is byte-for-byte identical to v9 (verified by `diff`). v9, v10 and `Output/` untouched.

**CTA change (baked, since v9's CTA is part of the image).** The old baked button was a tight text-background bar. The new one is a properly padded, centered, rounded button that matches the requested premium spec:
`l_text:Arial_30_bold_letter_spacing_2:EXPLORE COLLECTION,co_rgb:131313,b_rgb:fd7f01,c_pad,g_center,w_340,h_90,r_16`.
At the email's 552px display width (image is 2× for retina) this renders ≈ **46px tall**, **~8px radius** (`r_16`), **15px** bold uppercase (`Arial_30`), **~1px letter-spacing** (`_2`), text **centered H+V** (`c_pad,g_center`), width **hugs the text with balanced padding** (not an oversized fixed width), brand orange `#fd7f01` on `#131313`, left-aligned in the same lower-left position (`g_south_west,x_74`). Iterated and visually verified at both retina and true display size before baking.

**Why still compatible / unchanged elsewhere.** It is the same single clickable `<img>` → `/products/` as v9 (whole banner is the tap target, far exceeding 44px). No CSS background-image/gradient/overlay; §6.6 gates pass (no `<a>` wraps a `<table>`; no image-anchor `display:block`). Banner HTTP 200 `image/jpeg` ~93 KB.

**Note / trade-off (unchanged from v9):** the CTA is part of the flattened image, so it is not an independently click-tracked HTML element — the whole-banner link covers the click and destination. This was the user's chosen direction ("if the CTA is baked into the image, recreate only the CTA area").

**Still-required manual pre-send checks (not exercised here):** Klaviyo import (confirm banner link after rewrite), Gmail Web, Gmail Mobile (Android + iPhone), Apple Mail iPhone, Outlook. Status: **not approved to send.**

---

## v10 — Promo Banner CTA: premium real HTML button, seamless dark hero card

**Assessed draft:** `Draft/RDD-2026-LAUNCH-Concept-D-draft-v10.html` — **only the Promo Banner (§9) changed** vs v9 (before-promo lines 1–392 and Trust Strip→EOF are byte-for-byte identical to v9; verified by diff). v9 and `Output/` untouched.

**Change (CTA only).** v9's CTA was baked into the flattened image and looked low-fidelity. v10 replaces it with a **real, email-safe HTML button** (VML fallback for Outlook) so it can be premium-styled to match the Hero "SHOP NOW" pill: **line-height:50px** height, **padding:0 40px** horizontal, **border-radius:9px**, bold 13px uppercase with 1.5px letter-spacing, text centered horizontally + vertically, orange `#fd7f01` on dark `#131313` text. On mobile the shared `.tap` rule keeps it **≥44px** touch target. It stays left-aligned in the banner's lower-left.

**Seamless integration (no disconnected strip).** The flattened image was re-baked to **fade to solid `#12151a` at its bottom edge** (Cloudinary `e_gradient_fade:symmetric` over `b_rgb:12151a`). The bottom pixel row was measured = **exactly `#12151a` across the full width**, and the HTML CTA footer uses the same `#12151a` background, so image + footer read as one continuous premium dark hero card with no seam. The warehouse photo, dark overlay, headlines and supporting copy are unchanged from v9 (only the baked button was removed and the bottom fade added to host the real button). Assembled composition previewed before build.

**Why compatible.** Standard table + padded-anchor button with VML for Outlook; no CSS background-image, gradient, or absolute overlay anywhere. §6.6 gates pass: no `<a>` wraps a `<table>`; no image-anchor carries `display:block`. Banner image HTTP 200 `image/jpeg` ~50 KB. Whole banner image also links to `/products/` (same destination as the button).

**Still-required manual pre-send checks (not exercised here — do NOT treat as passed):** Klaviyo test import (confirm both the banner image link and the CTA button navigate to `/products/` after link rewrite, and the VML button renders in Outlook), Gmail Web, Gmail Mobile (Android + iPhone), Apple Mail iPhone, Outlook. Status: **not approved to send.**

---

## v9 — Promo Banner: removed dark CTA strip, CTA baked into a single continuous hero

**Assessed draft:** `Draft/RDD-2026-LAUNCH-Concept-D-draft-v9.html` — **only the Promo Banner (§9) changed** vs v8. Everything before the banner (lines 1–392) and everything from the Trust Strip to EOF are byte-for-byte identical to v8 (verified by diff). v8 and `Output/` left untouched.

**Change.** v8's CTA sat on a separate dark `#12151a` strip below the image, which read as disconnected and reduced the premium feel. v9 removes that strip entirely: the warehouse image now runs cleanly to the rounded bottom corners as **one continuous hero banner**, and the orange "EXPLORE COLLECTION" button is **baked into the lower-left of the image** (Cloudinary text layer, `#fd7f01` fill, rounded), exactly matching the v5 in-banner CTA position. No `#12151a` strip remains in the section.

**Why this is the most compatible way to place the CTA "inside" the banner.** Placing a live HTML button *on top of* an image requires CSS absolute positioning / background-image, which **Outlook does not support** and Gmail treats unreliably — so a true overlay cannot be guaranteed. Baking the button into the flattened image makes it render pixel-identically in every client, and the **entire banner is wrapped in one `<a>` → `/products/`** (the destination the CTA implies), so tapping the button area navigates correctly everywhere. Trade-off: the button is not an independently tracked link, but the whole-banner link covers the click and destination.

**QA gates (source-verified here):**
- ✓ §6.6 gate: zero anchors wrap a `<table>` (banner anchor wraps the inline `<img>` only) — Klaviyo's link rewrite keeps the href attached.
- ✓ §6.6 gate: no image-wrapping `<a>` carries `display:block` (`display:block` is on the `<img>`; anchor stays inline) — avoids the Apple Mail iOS zero-height collapse.
- ✓ No separate dark CTA block; single rounded (`border-radius:16px`) clickable image; `width`/`height` (552×250) + `max-width` + `.promo-img` fluid class present.
- ✓ Flattened banner returns **HTTP 200, `image/jpeg`, ~95 KB** (mobile-payload safe).

**Still-required manual pre-send checks (could not be exercised here — do NOT treat as passed):** Klaviyo test import (confirm the banner navigates to `/products/` after link rewrite), Gmail Web, Gmail Mobile (Android + iPhone), Apple Mail iPhone, Outlook. Record results here before the §8.1 send gate is cleared. Status: **not approved to send.**

---

## v8 — Promo Banner restored to v5 marketing design (email-safe)

**Assessed draft:** `Draft/RDD-2026-LAUNCH-Concept-D-draft-v8.html` — **only the Promo Banner (§9) changed** vs v7. Hero, product grids, trust strip, footer and every other section are byte-for-byte identical to v7 (verified by diff). v7 and `Output/` left untouched.

**Change.** v7 was technically compatible but the CTA read as a detached strip and the composition drifted from the preferred v5 design. v8 restores the v5 look — full-width warehouse, full dark overlay, SAFE ACCESS. / BUILT TO LAST. + supporting copy positioned left, orange CTA reading as in-banner — while staying email-safe.

**Implementation (email-safe).** v5's original used CSS `background-image` + `linear-gradient` overlay, which Outlook ignores entirely and other clients render inconsistently. v8 replaces that with **one flattened hosted Cloudinary image** (warehouse + dark overlay + all headline/supporting text baked in), shown as a normal `<img>` with explicit `width`/`height` (552×250) and a `.promo-img` fluid class. The whole banner image is one clickable `<a>` → `/products/`; a visually identical HTML "Explore Collection" button (VML for Outlook, HTML otherwise) sits immediately below inside the **same dark `#12151a`, 16px-rounded, `overflow:hidden` wrapper**, so image + CTA read as one banner with the button in the v5 lower-left position. No CSS background-image, gradient, or absolute-overlay technique used anywhere.

**QA gates (source-verified here):**
- ✓ §6.6 gate: zero anchors wrap a `<table>` (banner anchor wraps inline `<img>` only) — so Klaviyo's link rewrite will not detach the href.
- ✓ §6.6 gate: no image-wrapping `<a>` carries `display:block` (anchor inline; `display:block` on the `<img>`) — avoids the Apple Mail iOS zero-height collapse.
- ✓ Flattened image + base warehouse asset both return **HTTP 200, `image/jpeg`**; flattened banner is **~88 KB** (mobile-safe payload).
- ✓ Wrapper table carries `width:100%` in inline style; image has `max-width:552px; height:auto` + mobile `width:100%` class.

**Still-required manual pre-send checks (could not be exercised in this environment — do NOT treat as passed):** Klaviyo test import (confirm banner image + CTA both navigate to `/products/` after link rewrite), Gmail Web, Gmail Mobile (Android + iPhone), Apple Mail iPhone, Outlook. Record results here before the §8.1 send gate is cleared. Status: **not approved to send.**

---

## v7 — PROMO BANNER (2026-07-17) — Option A: restore original full-width hero-style overlay

> **New comparison draft — `Output/` untouched. v6 (Option B two-column) kept for A/B comparison.**
- **Why:** v6's Option B (two-column: dark text panel + separate warehouse image) is email-safe but
  **changed the original marketing design**. Per request, restore the original **full-width warehouse
  banner with dark overlay, headline text left, CTA below** — without reintroducing the CSS
  `background-image` that broke Gmail mobile.
- **Approach (Option A — single flattened image):** the warehouse photo + dark overlay + "SAFE ACCESS."
  (white) + "BUILT TO LAST." (orange) + gray supporting line are **baked into one hosted JPEG** via
  Cloudinary transforms (`c_fill` crop, `e_colorize:58` dark overlay, `l_text` overlays). Shown as one
  **normal `<img>`** (`width="552" height="230"`, `display:block; width:100%; max-width:552px; height:auto`)
  inside the dark `#12151a` rounded container. The **"Explore Collection"** VML+anchor button sits on a
  dark strip **below** the image. Both the banner `<img>` and the CTA link to
  `https://www.retaildisplaydirect.com.au/products/`.
- **Why email-safe:** no CSS `background-image`, gradient, `position:absolute`, or `opacity` — a plain
  `<img>` renders identically in Gmail mobile/web, Outlook, Apple Mail and Klaviyo. Anchor wraps the image
  only (§6.6); explicit `width`/`height` attributes present.
- **Cloudinary URL note:** literal commas inside overlay text must be **double-encoded (`%252C`)** or
  Cloudinary reads them as parameter separators and 400s. Flattened URL verified HTTP 200 (~83 KB).
- **QA:** tables balanced 39/39 · zero anchors wrap a `<table>` · zero `background-image` in markup (only in
  a comment) · hero + all product grids unchanged from v6 · rendered desktop + tall viewport via headless
  Edge — banner shows the full-width overlay look with headline text and CTA as intended.
- **Still pending before send (all clients):** Klaviyo import + Gmail mobile/web + Apple Mail iPhone +
  Outlook render checks per §8.1; confirm banner + CTA both navigate to `/products/` post-Klaviyo.

---

## v6 — PROMO BANNER FIX (2026-07-17) — email-safe warehouse image (Gmail-mobile bug)

> **Draft only — `Output/` untouched (17:52).** Applied to v6 (current comparison draft).
- **Cause:** the promo put the warehouse photo in a **CSS `background-image` on a `<td>`** (with a
  `linear-gradient` overlay + `#12151a` fallback). Gmail's **mobile apps (iOS/Android) and Outlook**
  **drop CSS background images**, so those clients showed only the dark fallback + text + CTA. (No
  `position:absolute`/`z-index`/`opacity` was involved — purely the unsupported background-image. Worked on
  localhost/Apple Mail because WebKit supports CSS backgrounds.)
- **Fix (Option B — email-safe table):** rebuilt as a two-column dark banner — **solid `#12151a` text panel
  (left)** + the warehouse as a **real `<img>` (right)**, Cloudinary-cropped `w_560,h_600,c_fill,g_auto`
  (36 KB, 200). **No** `background-image`, gradient, positioning, opacity, or z-index. Image + CTA both
  clickable → `/products/`. Same dark premium branding, orange headline accent, orange CTA.
- **Responsive:** `.hcol` stacks on mobile (text panel then full-width photo via `.promo-img`
  width/max-width 100%).
- **Verified visually** (headless Chromium, desktop 620px + mobile 380px): warehouse photo renders as a real
  image in both — desktop right-column, mobile full-width below the text. bg-image=0, gradient=0, real
  position:absolute=0; tags balanced (table 39/39 · td 80/80 · tr 62/62 · a 42/42); 16/16 images sized.
- **Hero + product grids untouched.**
- **Option A note:** a true "text baked over full-bleed darkened photo" needs a single pre-flattened hosted
  banner image (like the hero `d26798ba`). If desired, supply that asset and it drops in as one clickable
  `<img>` + HTML CTA. Option B was chosen as it's buildable/verifiable now and fully email-safe.
- **Also applies to v4 & v5:** they still use the old CSS-background promo — the same fix should be applied
  to whichever nav variant is promoted to Output (can do on request).
- **Real-client caveat:** verified in Chromium; a Gmail-mobile/Klaviyo test-send is still the final check
  per §8.1 (can't run real clients here) — but a real `<img>` is the standard, reliable fix for this exact
  failure.

---

## v6 — NEW A/B DRAFT (2026-07-17) — subtle proportional nav underlines (1px, ~70–80%)

**File:** `Draft/RDD-2026-LAUNCH-Concept-D-draft-v6.html` (copy of v5; **v5 NOT overwritten**). Third nav
option for A/B. **`Output/` untouched (17:52).**
- **Only difference from v5:** the four nav underlines made more subtle — **1px tall** (was 2px),
  **~70–80% of word width** (was ~80–90%): WORKSPACE 68px · SIGNAGE 50px · SAFETY 44px · RETAIL 40px;
  gap 5px (was 6px). Still `#F58220`, centred, per-item table (no `text-decoration`).
- Everything else **byte-identical to v5** (verified via `diff` — only the 4 underline lines differ).
- **Verified visually** (2.5× render): thin, understated orange underlines proportional to each word —
  supports the hero rather than competing.
- **Three-way compare now available:** v4 (fixed 2px) · v5 (proportional 2px, bolder) · v6 (proportional
  1px, most subtle). Pick one → promote to Output.
- **CLAUDE.md §6.10:** added the "keep nav subtle for RDD" note and the broader A/B rule (new Draft for any
  thickness/width/spacing/colour test; never overwrite an approved Draft or Final Output until selected).

---

## v5 — NEW A/B DRAFT (2026-07-17) — proportional nav underlines (vs v4 fixed-width)

**File:** `Draft/RDD-2026-LAUNCH-Concept-D-draft-v5.html` (copy of v4; **v4 NOT overwritten**). Created for
an A/B comparison of the header navigation underline style. **`Output/` untouched.**
- **Only difference from v4:** the four nav underline widths. v4 = fixed 22px for all; **v5 = proportional
  (~80–90% of each word's width):** WORKSPACE 78px · SIGNAGE 58px · SAFETY 48px · RETAIL 46px. Still
  `#F58220`, 2px tall, centred, table-based (no `text-decoration`), per-item pixel widths (stay
  proportional on mobile since text is fixed 11px).
- Everything else is **byte-identical to v4** (verified via `diff` — only lines 66/70/74/78 differ). Hero,
  products, footer, links, colours, typography, responsive all unchanged.
- **Verified visually** (2.5× render): each underline follows its word length (~80–90%), centred, premium
  typography-driven look.
- **Compare:** v4 (fixed-width underline) vs v5 (proportional underline) → pick one for Output.
- **CLAUDE.md §6.10:** added the proportional-underline option (80–90% of text width) and the A/B rule
  (create a new Draft version, never overwrite an approved Draft, before promoting to Output).

---

## v4 — DRAFT-ONLY (2026-07-17q) — nav underlines → RDD orange 2px (brand accent)

> **Draft only — `Output/` untouched (mtime 17:52).**
- Nav per-item underlines restyled from light-gray 1px → **RDD orange `#F58220`, 2px tall, 22px wide**
  (within the 20–24px spec), identical for all four items, centred, table-based (no `text-decoration`).
- **Permanently visible** orange; hover is now a **subtle opacity fade** (`opacity:0.7` + transition) where
  `:hover` is supported — otherwise the orange stays fully visible.
- Spacing: text → 6px → orange underline → **14px** → hero (in the 12–15px range). Hero unchanged.
- **Verified visually** (2.5× headless render): four equal orange underlines centred under Workspace/
  Signage/Safety/Retail; premium, brand-consistent, hero remains the focal point.
- QA: 4 orange 2px `navline` cells; 0 gray underlines; `text-decoration:underline` only on footer
  Unsubscribe/Privacy (2, correct); 0 anchors wrapping `<table>`; 0 block-level image anchors; 15/15 images
  sized; tags balanced (40/40 · 81/81 · 63/63). Output NOT re-synced.
- **CLAUDE.md §6.10 updated:** RDD Header Navigation Standard now specifies orange `#F58220` 2px ~20–24px
  per-item underlines (permanent), opacity hover as progressive enhancement, 6–8px / 12–15px spacing.

---

## v4 — DRAFT-ONLY (2026-07-17p, superseded) — confirmed per-item nav underlines

> **Draft only — `Output/` untouched (mtime 17:52 unchanged).** Nav per-item underlines were already built
> in 17:17o; this pass verified them and hardened rendering.
- Verified via high-DPI headless render: each nav word (Workspace/Signage/Safety/Retail) has its **own
  centred 20px × 1px `#e5e5e5` underline** ~6px below the text — table-based, **no `text-decoration`**.
- Added `height="1"` + `bgcolor="#e5e5e5"` attributes to the 4 `.navline` cells for reliable 1px rendering
  in Outlook/older clients (belt-and-braces with the existing inline styles).
- The only `text-decoration:underline` in the file is on the **footer Unsubscribe / Privacy Policy** links
  (correct convention) — the nav uses `text-decoration:none`.
- **Likely source of the "not applied" report:** the Output file was being previewed; it is intentionally
  NOT updated (pending approval), so it still shows the old header. The change is in the Draft only.
- Note: the `#e5e5e5` 1px line is subtle by design (per the requested spec). Can darken/thicken on request.

---

## v4 — DRAFT-ONLY (2026-07-17o, superseded) — nav per-item underlines

> **Draft only — `Output/` deliberately untouched (mtime unchanged).**
- **Removed** the full-width orange accent line **and** the gray hairline above the hero (felt heavy /
  website-like).
- **Per-item nav underlines:** each of Workspace/Signage/Safety/Retail now sits in its own centred cell
  with a **20px × 1px light-gray (`#e5e5e5`) underline** centred beneath it (not a full-width line).
- **Hover (progressive enhancement):** `.navitem:hover` turns the text + underline **RDD orange `#f58220`**
  where `:hover` is supported (Apple Mail / some webmail); defaults stay gray elsewhere (fine).
- **Breathing room** preserved: logo → nav → underlines → ~16px → hero. **Hero fully unchanged**
  (image/typography/CTA/caution-tape/links), still full width.
- **Verified visually** (headless render): centred logo, four words each with a subtle centred underline,
  no full-width divider, clean premium hierarchy.
- QA: 4 `navline` + 4 `navitem`; 0 full-width divider rows; 0 anchors wrapping `<table>`; 0 block-level
  image anchors; 15/15 images sized; tags balanced (40/40 · 81/81 · 63/63 · 41/41). Output NOT re-synced.
- **CLAUDE.md §6.10 added:** Header navigation style standard (no full-width dividers above hero; per-item
  ~18–24px `#E5E5E5` underlines; `#F58220` hover accent as progressive enhancement; breathing room to hero).

---

## v4 — DRAFT-ONLY (2026-07-17n, superseded) — header→hero separator

> **Draft only, per instruction — `Output/` deliberately left untouched (pending approval).**
- Added breathing room + separation between the nav and the hero (premium feel): removed the nav's old
  `#ededed` bottom border; nav bottom padding → 14px; then a **full-width 1px `#e8e8e8` gray divider** + a
  **full-width 2px `#f58220` RDD orange accent**, then 12px breathing space before the hero.
- **Hero fully unchanged** — same composed image (d26798ba), typography, CTA, caution-tape, product,
  links; still **full width** (no side margins, no white card wrapper, no orange frame).
- Thin lines use `height + line-height + font-size:1px + mso-line-height-rule:exactly` for reliable 1px/2px
  rendering (incl. Outlook).
- **Verified visually** (headless render): logo → nav → gray hairline + orange accent → space → hero;
  clean hierarchy, not heavy.
- QA: tags balanced (36/36 · 74/74… table/td/tr/a 36/36 · 76/76 · 61/61 · 41/41); 0 anchors wrapping
  `<table>`; 0 block-level image anchors; 15/15 images sized. **Output NOT re-synced** (mtime unchanged).

---

## v4 — FINAL (2026-07-17m) — TRUE root cause: last-row cell needed colspan="2"

> Same draft file; Output re-synced (§9). **Visually verified** via headless render (screenshot).
- **Actual root cause (user diagnosed it):** the final ramp row's single `<td>` had **no `colspan`**, so it
  occupied only the **first column (left 50%)** of the 2-column grid — the `align="center"` wrapper was
  centering within that left half, so the card stayed left-aligned. Prior width/shrink theories were
  secondary.
- **Fix:** added **`colspan="2"`** to the final row's cell so it spans the full 564px grid; the untouched
  card (fixed 282px `align="center"` wrapper) now centers across the full width. Card unchanged (identical
  `dm-card`, 180px image, `.pn/.pd/.pp`, pill, padding) — same 268px as every other card.
- **Verified visually:** rendered the email (headless Edge) — Rubber Threshold Ramp 25mm is centered on its
  own row, identical size to all other ramp cards; barriers 2×2, ramps 100/88·75/64·50/38·**centered 25mm**,
  Also Launching 2-up, promo + footer all balanced and premium.
- QA: final row cells = row1-3 two 50% cells, row4 one `colspan=2` cell; all 13 cards identical structure;
  0 anchors wrapping `<table>`; 0 block-level image anchors; 15/15 images sized; tags balanced
  (35/35 · 73/73 · 58/58 · 41/41). Output re-synced.
- **CLAUDE.md §6.9:** added the **`colspan` requirement** as the #1 fix for a "still not centered" last card
  (a lone `<td>` without colspan sits in the first column).

---

## v4 — (2026-07-17l, superseded) — centered last card WITHOUT shrinking it

> Same draft file; Output re-synced (§9). CLAUDE.md §6.9 tightened again.
- **Bug:** the previous centering wrapper used `width="50%"`, which **Gmail/Outlook shrink-wrapped to the
  card content** → the 25mm card rendered smaller than the others.
- **Fix:** the centering wrapper is now a **fixed `width="282"` table** (`align="center"`, `class="center-half"`,
  `max-width:100%`, → 100% on mobile). 282px = exactly one grid column (50% of the 564px grid in the 600px
  container). **The card itself is completely untouched** — identical `dm-card` table, 180px image,
  `.pn/.pd/.pp`, "Launching soon" pill, `padding:0 7px 16px 7px`. It now renders at the **same 268px** as
  every other card, just centered.
- QA: 1 fixed-282 centering wrapper; all 13 product cards share the identical `dm-card` structure; images
  9×180px + 4×190px (none shrunk); 0 anchors wrapping `<table>`; 0 block-level image anchors; 15/15 images
  sized; tags balanced (35/35 · 73/73 · 58/58 · 41/41). Output re-synced.
- **CLAUDE.md §6.9:** the lone centered card must be byte-identical (never resize card/image/font/padding/
  width); center only via a **fixed-pixel wrapper = one grid column** (NOT a `%` wrapper — it shrink-wraps;
  NOT empty spacer cells — they collapse).

---

## v4 — (2026-07-17k, superseded) — robust centering of the odd last ramp card

> Same draft file; Output re-synced (§9). CLAUDE.md §6.9 tightened.
- **Root cause of the off-centre 25mm card:** it was centered with empty `spacer-col` 25% cells, but
  **zero-font empty cells collapse in Gmail/Outlook**, pushing the card to the side.
- **Fix:** replaced the spacer-cell centering with a **nested `align="center"` table** at 50% width
  (`class="center-half"`, → 100% on mobile). The 25mm card is now reliably centered on the last row,
  **same width as the other cards, not stretched**, equal height / image / CTA preserved.
- QA: 0 `spacer-col` cells left; 1 `center-half` centering table; 13 `pc` cards; 13 unique product images;
  0 anchors wrapping `<table>`; 0 block-level image anchors; 15/15 images sized; tags balanced
  (35/35 · 73/73 · 58/58 · 41/41); 23 live/nav + 18 launching links intact. Output re-synced.
- **CLAUDE.md §6.9 updated:** centre odd last card via `align="center"` nested table (NOT empty spacer
  cells — they collapse in Gmail/Outlook); keep it the same width, don't stretch, preserve height/image/CTA
  and row spacing.

---

## v4 — (2026-07-17j, superseded) — Modular Rubber Ramps → balanced 2-column grid

> Same draft file; Output re-synced (§9). CLAUDE.md gained **§6.9** (2-column default + centered odd card).
- **Ramps section converted 3-col → 2-col** for visual balance (7 products): rows of **2·2·2·1**, with the
  final **25mm card centered** via two `spacer-col` 25% cells (collapse on mobile) — no left-aligned orphan.
- Ramp cards restyled to match the other 2-col launching-soon cards: 180px image, `.pn/.pd/.pp` reserved
  heights, `height:100%`, 14px radius, "Launching soon" pill. All 7 links/images/prices preserved.
- **Also Launching** already had 2 products in one balanced row → left as-is (even count, no centering
  needed).
- QA: 0 `pc3` (3-col) cells left; 13 `pc` 50% cards; 2 `spacer-col` 25% (centered last ramp); 13 unique
  product images; 0 anchors wrapping `<table>`; 0 block-level image anchors; 15/15 images sized; tags
  balanced (34/34 · 74/74 · 57/57 · 41/41); 23 live/nav + 18 launching links intact. Output re-synced.
- **CLAUDE.md:** added **§6.9 Email product grid composition** — 2-column default, center the final card on
  an odd count, never leave a left-aligned orphan, symmetrical/balanced grids (pairs with §6.8).

---

## v4 — (2026-07-17i, superseded) — product card equal-height alignment (email-safe)

> Same draft file; Output re-synced (§9). Refactored the card component's alignment across all 3 grids.
- **Why not flexbox:** the requested `display:flex; margin-top:auto` is **not supported in Outlook (Word
  engine) or much of Gmail** — it would silently fail. Used the email-standard equivalent instead.
- **Reserved fixed heights** (min-height classes) so every card reserves equal vertical space and its
  price/CTA land at the same offset regardless of title/description length:
  `.pn 42px · .pd 34px · .pp 26px` (2-col cards) and `.pn3 36px · .pd3 28px · .pp3 22px` (3-col ramps).
  Price lines are now classed (`.pp`/`.pp3`) — fixes the Also-Launching mismatch ($95.00 18px vs "Price to
  be confirmed" 13px) so the "Launching soon" pills align.
- **Equal card box height:** `height:100%` on **all 13 card tables** (was only the 2 Also-Launching) so
  every card in a row ends at the same baseline (bottom borders align).
- **Shortened descriptions** (per request): "Modular metal speed hump, 500mm section" → **"500mm modular
  speed hump."**; "Surface-mounted safety bollard, 89mm" → **"89mm safety bollard."**
- **Mobile:** all reserved heights reset to 0 (cards stack naturally).
- **Unchanged:** links, CTAs, images, prices, colors, typography (only min-height + shortened 2 descs).
- QA: 13/13 cards `height:100%`; 6 `.pp` + 7 `.pp3` prices; 0 anchors wrapping `<table>`; 0 block-level
  image anchors; 15/15 images sized; 0 em dashes; tags balanced (34/34 · 74/74 · 56/56 · 41/41);
  23 live/nav links + 18 launching placeholders intact. Output re-synced identical.
- **Outlook caveat:** `min-height` on `<p>` is not fully honored by Outlook desktop, so perfect pixel
  alignment is guaranteed in Apple Mail / iOS / Gmail; Outlook is close (equal boxes via height:100%),
  minor variance possible — an accepted email limitation.

---

## v4 — (2026-07-17h, superseded) — promo blend + Also-Launching baseline polish

> Same draft file; Output re-synced (§9).
- **Promo banner white container removed:** outer table `#ffffff` → **`#ededed`** so the banner blends
  into the light-grey product zone (full-width content section, no floating white card). Rounded corners,
  centering and responsive behaviour preserved. Top padding tightened (`22px`→`10px`) so the promo begins
  right after "Also Launching" with balanced spacing (removed the excessive gap).
- **Also-Launching card baselines aligned:** added `height:100%` to the two §8 card tables so their boxes
  are equal height and end at the same baseline (the price lines differ — `$95.00` 18px vs "Price to be
  confirmed" 13px — which previously left them uneven). Content/typography/colors/links untouched.
- **Unchanged:** hero, promo image/CTA, footer, product cards' content, all links (23 live + 18 launching),
  typography, colors. Only 1 white section wrapper remains (hero image), by design.
- QA: 0 anchors wrapping `<table>`; 0 block-level image anchors; 15/15 images sized; tags balanced
  (34/34 · 74/74 · 56/56 · 41/41). Output re-synced identical.

---

## v4 — (2026-07-17g, superseded) — light-grey product zone (Weekly W29 design language)

> Same draft file; Output re-synced to match (§9).
- All **3 product sections** (Expandable Barriers · Modular Rubber Ramps · Also Launching — headers +
  grids, 6 section tables) now use a **light-grey `#ededed` background** matching Weekly
  `RDD-2026-W29-draft-v5.html` (`.dm-grey`). Grey flows continuously across the whole product zone.
- **Product cards stay white** (`dm-card` #ffffff, border #eaeaea) → stronger contrast, more premium.
- **Unchanged (as instructed):** hero, promo banner, footer, header/nav, all product links + CTAs. Hero
  image wrapper and promo outer remain white (the only 2 non-grey section tables in the product half).
- QA: 6 grey sections + 13 white cards; 0 anchors wrapping `<table>`; 0 block-level image anchors; 15/15
  images sized; tags balanced (34/34 · 74/74 · 56/56 · 41/41); 23 live links + 18 launching placeholders
  unchanged. Output re-synced (`Output/RDD-2026-LAUNCH-Product-Launch-Final.html`, identical to draft).

Send-gate status unchanged (see 17f): Output is preview/QA only — still **not approved to send** (9 SKUs
404, hero interim link, 2 BC titles to rename, on-device/Klaviyo checks pending).

---

## v4 — (2026-07-17f, superseded) — Trust Cards removed + production build placed in Output

> Same draft file, final pass. Then copied to Output as the production build.

- **Removed the mid-email Trust Cards** (Premium Quality · Built to Perform · Folds Flat · Expert Support)
  entirely — icons, labels, wrappers, spacing. Products now flow straight into the **Promo Banner** with
  intentional spacing (~28px), no large white gap. Single trust section remains (footer "We've got you
  covered").
- **Production file created:** `Output/RDD-2026-LAUNCH-Product-Launch-Final.html` (byte-identical copy of
  the final draft-v4). Draft retained in `Draft/` as the working file (not overwritten). The earlier
  `Output/RDD-2026-LAUNCH-access-safety-range.html` (Concept A) was left in place (removal not requested).

### Final production QA — ALL 200 / PASS
| Check | Result |
|-------|--------|
| All 11 external hrefs (nav, products, /products/, privacy, home) | **HTTP 200** |
| All 15 images (logo + hero + 13 products) | **HTTP 200 image/jpeg** |
| Promo CSS background image | **HTTP 200** |
| Anchors wrapping `<table>` / block-level image anchors | **0 / 0** |
| Images with `width`+`height` | **15 / 15** |
| Em dashes / "Safety Sector" shown | **0 / 0** |
| Tag balance (table/td/tr/a) | 34/34 · 74/74 · 56/56 · 41/41 |
| `#` hrefs (non-launching) | **0** |

### Output presence is NOT send-approval (CLAUDE.md §4.1/§9/§8.1)
The Output file is the latest build for **preview / Klaviyo import / QA / stakeholder review**. It is
**NOT approved to send** — unresolved blockers remain:
1. **9 SKUs (7 ramps + speed hump + bollard) are `is_visible=false`/404** — shown as clearly-marked
   "Launching soon" placeholders; must be published + verified before their cards/hero can link live.
2. **Hero links to the homepage (interim)** because the featured ramp page is 404 — swap to the ramp's
   live URL once published.
3. Two "Safety Sector" BigCommerce titles need renaming (RDD-neutral names used in the email).
4. **On-device / client checks not run here** — Apple Mail iPhone · Gmail Web/iOS/Android · Outlook ·
   Klaviyo Preview + post-import clickability required before send. (Note: promo banner uses a CSS
   background image → Outlook/some Gmail show the solid `#12151a` fallback, not the photo — by design.)

---

## v4 — (2026-07-17e, superseded) — navigation + CTA links wired to live pages

> Supersedes the notes below. Same file. Header nav and the EXPLORE COLLECTION CTA now point to
> verified-live pages; a permanent Navigation & CTA rule was added to CLAUDE.md (§6.7).

- **Header nav** (was homepage placeholders) now links to verified-live RDD categories (all **200**):
  Workspace → `/sit-stand-desk/`, Signage → `/snap-frames/`, Safety → `/safety-equipments/`,
  Retail → `/acrylic-display/`. (RDD has no literal department pages; mapped to closest live categories.)
- **EXPLORE COLLECTION** (promo banner) → `https://www.retaildisplaydirect.com.au/products/` (200),
  updated in both the VML and the anchor.
- **Remaining homepage links are intentional:** header logo, hero banner (interim until the ramp is
  published), and the footer `www.` line.
- **CLAUDE.md updated** — added permanent **§6.7 Navigation & CTA link rules** (nav always → live category;
  CTAs → intended destination; never `#`/placeholder/404; verify every URL; destination mapping table).
- QA: 5 new links verified 200; 0 anchors wrapping `<table>`; 0 block-level image anchors; 0 `#`
  (non-launching) hrefs; anchor tags balanced 41/41. Product/SKU links unchanged.

---

## v4 — (2026-07-17d, superseded) — image promo banner + W29 support footer

> Supersedes the notes below. Same file. Only the promo banner and the RDD-Promise→footer were changed
> (per user "only redesign the promo banner and replace the footer"); hero and all product/SKU links
> are unchanged.

### Promo banner redesigned
- Full-width **warehouse background** (`res.cloudinary.com/atitvoxa/...loading_doc...jpg`) with a
  **dark left→right cinematic gradient overlay** (`linear-gradient(90deg, rgba(15,17,20,.95) → .10)`) for
  readability, warehouse visible on the right. Image **optimized via Cloudinary** to `w_1200,q_auto:good,
  f_jpg` → **85 KB** (from 722 KB) and verified **HTTP 200**.
- Left copy: **SAFE ACCESS.** (white) / **BUILT TO LAST.** (RDD orange) + description + **EXPLORE
  COLLECTION** CTA (bulletproof VML+anchor → live barrier page). Removed the old "100% Australian
  Warehouse Stock" panel / "Smart Solutions" text.
- **Email limitation (documented):** CSS `background-image` is unreliable in **Outlook desktop** (and some
  Gmail) — those clients fall back to a **solid `#12151a`** panel (text/CTA stay readable), no photo. A
  guaranteed-everywhere photo would need the bulletproof VML `v:image` pattern with a pre-darkened image;
  given the bright source, the solid-dark fallback is the cleaner, safe choice.

### RDD Promise removed → W29 support footer
- Deleted "The RDD Promise" black quote card entirely.
- Footer now matches `Weekly/Draft/RDD-2026-W29-draft-v5.html`: **"We've got you covered"** trust strip
  (Australia-Wide Shipping · Fast & Simple Returns · Expert Customer Service, `#ededed`), then the support
  footer (`#f7f7f7`): "Got questions? We're here to help.", `sales@retaildisplaydirect.com.au`,
  `www.retaildisplaydirect.com.au`, `(02) 9708 5288`, Retail Display Direct Pty Ltd, 3 Wordie Place,
  Padstow, NSW 2211, Unsubscribe · Privacy Policy (verified 200), copyright. Same fonts/colors/spacing as
  W29. **No social icons.**

### Automated QA (this pass) — PASS
| Check | Result |
|-------|--------|
| RDD Promise removed / social icons removed | **0 / 0** |
| Promo bg image (optimized) live | **200, 85 KB** |
| Privacy-policy link live | **200** |
| Anchors wrapping `<table>` / block-level image anchors | **0 / 0** |
| Images with `width`+`height` | **15 / 15** (promo bg is CSS, not an `<img>`) |
| Product/SKU links unchanged | 13 unique imgs · 4 live barrier links · 18 launching placeholders |
| "Safety Sector" / em dashes | **0 / 0** |
| Tag balance (table/td/tr/a) | 40/40 · 83/83 · 62/62 · 41/41 |

> Note: there are now two icon rows — the mid-email "Trust Cards" (product qualities) and the footer
> "We've got you covered" (service). Kept both per the "only change promo + footer" scope; can drop the mid
> one if a single trust section is preferred.

---

## v4 — (2026-07-17c, superseded) — composed full-width hero image + full 13-SKU campaign

> Supersedes the notes below. Same file. The hero is now a **single pre-composed banner image** (the
> art the user supplied), full-width and **entirely clickable**; product sections unchanged from 17b.

### Hero (this pass)
- Replaced the built split-hero with one **full-width composed image**
  `…/images/d26798ba-458e-4ba9-98f6-ca4dfc50cb00.jpeg` (1167×651, **HTTP 200 image/jpeg**; shown at
  `width:100%; max-width:600px; height:auto` → crisp, responsive, **no crop/distort**). The whole banner
  is wrapped in **one** `<a>` (inline anchor, `display:block` img — §6.6-safe). The "SHOP NOW" is baked
  into the art, so the entire banner is the tap target.
- **Hero link — IMPORTANT:** the user asked it to open the *featured Modular Recycled Rubber Threshold
  Ramp* product page, but **all ramp/hump/bollard pages return 404** (verified 11 URL variants this pass —
  none published). There is **no live ramp URL to link**. So the hero currently links to the **live RDD
  home/shop** (`https://www.retaildisplaydirect.com.au/`, HTTP 200) as a verified interim, with a code
  comment to swap in the ramp's real product URL once published. This avoids a 404/`#` while staying honest.

### Products / links status (unchanged from 17b)
- All **13 SKUs** present once each, grouped Expandable Barriers (4 live, fully clickable) / Modular Rubber
  Ramps ·7 (launching-soon) / Also Launching (2, launching-soon). RDD-neutral names (no "Safety Sector").
- **The 9 ramp/hump/bollard cards cannot link to their own live pages (404 → not published).** They use
  clearly-marked `#launching-soon` placeholders (image + title). Only the 4 barriers are live-clickable.
  **To make the hero and all ramp cards link to live pages, those products must be published in
  BigCommerce and their live URLs supplied/verified.**

### Automated QA (this pass) — PASS
| Check | Result |
|-------|--------|
| Hero = one full-width image in a single inline anchor | ✓ (old hero image removed) |
| Hero image + hero link (home) live | **200 / 200** |
| Anchors wrapping `<table>` / block-level image anchors | **0 / 0** |
| Images with `width`+`height` | **15 / 15** |
| All 13 SKUs present, unique | **13 / 13, 0 duplicates** |
| "Safety Sector" shown / em dashes | **0 / 0** |
| Tag balance (table/td/tr/a) | 40/40 · 83/83 · 62/62 · 41/41 |
| Stray `#` hrefs (non-launching) | **0** |

---

## v4 — (2026-07-17b, superseded) — blended split hero + full 13-SKU campaign (3 sections)

> Supersedes the v4 notes below. Same file, revised again per user: (a) hero image now **edge-to-edge,
> no black box, blends into orange**; (b) **all 13 approved SKUs** restored in the reference grouping
> (reverses the earlier "keep 4 live only" pass — user explicitly asked for the complete campaign).

### Hero (fix)
- Removed the charcoal frame. Left cell bg is now light `#efedea`; the banner image is **full-bleed**
  (`padding:0`, `width:100%`, real `<img>`, `height:auto` → undistorted) and the orange right panel uses a
  warm **diagonal gradient seam** (`linear-gradient(115deg,#ffa24d,#fd7f01)`) so the two blend as one
  premium banner. Red-script "Launch" kept. (Honest limit unchanged: a *photographic* fade across a
  diagonal still isn't fully email-safe with a rectangular JPEG — Gmail/Outlook drop bg-image compositing;
  a pixel-exact fade needs a pre-composed hero image.)

### Products — ALL 13 approved SKUs, each once, grouped like the reference
- **Section 1 – Expandable Barriers (4, live):** HD White/Black $431.10, Safety White/Black $476.10 —
  2×2, "New" badge, image + title + short desc + price + **VIEW PRODUCT** button, all clickable to the
  **verified-live** product page.
- **Section 2 – Modular Rubber Ramps · 7 Heights (7):** 100/88/75/64/50/38/25mm — 3-col grid (last
  centered), image + title + desc + price + **"Launching soon"** status pill.
- **Section 3 – Also Launching (2):** Metal Speed Hump 500mm $95.00, Surface-Mount Fixed Bollard 89mm
  (Price to be confirmed).
- **The 9 in Sections 2–3 are still `is_visible=false`/404** — shown with real images/names/prices and a
  clearly-marked **`#launching-soon`** placeholder (image + title), **no fake live link, no 404**. They are
  **not** live-clickable until published + verified. **`Safety Sector` brand name is NOT displayed** — the
  two products use RDD-neutral names (§5.4); BigCommerce titles still need renaming.

### Automated QA (revised v4) — PASS
| Check | Result |
|-------|--------|
| All 13 SKUs present, unique (product IDs 1771–1783) | **13 / 13, 0 duplicates** |
| Anchors wrapping `<table>` / block-level image anchors (§6.6) | **0 / 0** |
| Images with `width`+`height` | **15 / 15** (logo + hero + 13 products) |
| Hero black box removed | ✓ (light `#efedea`, full-bleed image) |
| Hero "Launch" red | ✓ `#e0261a` |
| "Safety Sector" competitor name shown | **0** (RDD-neutral names) |
| Em dashes (§6.2) | **0** |
| Tag balance (table/td/tr/a) | 40/40 · 84/84 · 62/62 · 42/42 |
| Live barrier links (verified 200) | 4, each card fully clickable |
| Launching-soon placeholders + id target | 9 products (18 anchors) · id present |

**Send status:** comparison draft, **not send-ready** — send blocked until the 9 are published + verified
(and bollard price/stock set, the 2 BC titles renamed), real FB/IG URLs supplied, and on-device/Klaviyo
render + post-import clickability checked. No fabricated reviews/ratings.

---

## v4 (2026-07-17a, superseded) — split hero, 4 live SKUs only

**Assesses:** `Draft/RDD-2026-LAUNCH-Concept-D-draft-v4.html`. User asked to save as "draft-v3", but a
**v3 already existed** (the diagonal-hero variant); to honour "do NOT overwrite any previous drafts" this
revision was saved as **v4**. Branched from the revised v2 (live-only, red Launch, promo-below-trust).

### Hero replaced with a premium split layout (user's main ask)
- **LEFT = large real banner image** — the supplied Klaviyo-hosted photo
  `https://d3k81ch9hvuctc.cloudfront.net/company/XAUdQX/images/0ec87264-0464-4904-a3d9-a19fbc677352.jpeg`
  (1167×651, **HTTP 200 image/jpeg**, re-verified). Shown as a real `<img>` (undistorted, `height:auto`)
  so it renders in **every** client; on a charcoal frame; clickable to the live flagship product.
- **RIGHT = orange launch panel** — "NEW PRODUCT" + red-script "Launch" (`#e0261a`) + short intro +
  "SHOP NEW IN" bulletproof CTA. Orange cell carries a **diagonal seam gradient** (`linear-gradient(125deg,
  #e06f00,#fd7f01)`) plus full-width **diagonal striped ribbons** top & bottom, so the two sides read as one
  premium banner rather than two flat boxes.
- **Honest email limit:** a *literal* diagonal photo-into-orange crossover (the photo bleeding across a
  diagonal into the orange) is **not reliably email-safe** with a rectangular JPEG — `background-image`+mask
  compositing fails in Gmail/Outlook, and CSS `clip-path`/`transform` fail in Outlook. The robust result
  is the split + diagonal gradient seam + striped ribbons. A pixel-exact single-diagonal crossover would
  need a **pre-composed hero image** (the diagonal baked in, or a transparent-edge PNG) supplied as one file.

### Products — SKU audit (OPEN ITEM, needs a decision)
Current v4 shows the **4 verified-live barriers only** (HD White/Black $431.10, Safety White/Black
$476.10) — each fully clickable (image + title + View Product) to its live 200 URL, no `#`/placeholder.
The user asked to **add every missing approved SKU (all 13, once each)**, but the other **9 SKUs
(7 ramps + speed hump + bollard) are still `is_visible=false` / 404** — they have **no live URL**. That
directly conflicts with the same request's "live URL only · no `#` · no broken · verify every URL."
**DECISION (user, 2026-07-17): keep the 4 live SKUs only.** The 9 will be added once published in
BigCommerce and their live URLs verified (200). v4 is final as built for this pass.

### Automated QA (v4) — PASS
| Check | Result |
|-------|--------|
| Anchors wrapping a `<table>` / block-level image anchors (§6.6) | **0 / 0** |
| Images with `width`+`height` | **6 / 6** |
| Hero image live | **200 image/jpeg** |
| Em dashes (§6.2) | **0** |
| Tag balance (table/td/tr/a) | 32/32 · 52/52 · 41/41 · 24/24 |
| `#` / placeholder hrefs | **0** (all live 200 URLs or Liquid) |
| Hero "Launch" red script | ✓ `#e0261a` |
| Product cards fully clickable (image+title+button) | 4 / 4 |

Send status unchanged (not send-ready; branding [Inferred]; social links → homepage interim; no fabricated
reviews; on-device/Klaviyo checks pending).

---

## v3 (2026-07-17) — diagonal-split hero redesign
**Type:** Product Launch — **fourth concept**, a faithful recreation of the primary reference
`References/Final Design for Product Launch.png` (a 12-component RDD template spec). For comparison against
Concepts A, B, C. **Design exploration only.**
**Status:** DRAFT — **not** in `Output/`; **not** approved to send. Author: engine generation.
Reviewer/approver ≠ author (CR-16). Date: 2026-07-17.

---

## v3 (2026-07-17) — diagonal-split hero redesign

**Assesses:** `Draft/RDD-2026-LAUNCH-Concept-D-draft-v3.html`. User supplied a hero screenshot and asked to
recreate a modern **diagonal-split** hero. **Only the hero (component 2) changed** — every other section
(products, links, launching-soon grid, footer) is identical to v2.

### Hero changes vs v2
- **Diagonal split, email-safe:** a `linear-gradient(120deg,#efedea …,#fd7f01 …)` on both hero cells
  creates an angular **marble-light left / vibrant-orange right** seam. Each cell keeps a **solid
  background-color fallback** (left `#efedea`, right `#fd7f01`), so Outlook/Gmail (which drop the gradient)
  degrade to a clean two-tone split — never a white-box-on-orange artefact.
- **Floating black podium:** the featured product (live Safety Barrier – White) now sits on a **black
  ellipse podium** with a softer grey **shadow ellipse** beneath (border-radius:50%; flattens to a bar in
  Outlook).
- **Thin diagonal ribbon:** finer 8px `repeating-linear-gradient(135deg)` striped bars top & bottom +
  repeating brand eyebrow ("Better worksites · Better performance · Built to last").
- **Bold headline + prominent CTA:** larger "NEW / PRODUCT" (46px) + Georgia-italic "Launch", uppercase
  **SHOP NEW IN** black button (bulletproof VML + anchor), still linking to the live flagship product.

### Known email limits (documented, not defects)
- A **true rotated corner-to-corner text ribbon** and a hard **clip-path diagonal** are **not reliably
  reproducible** in email HTML (CSS transforms/clip-path fail in Outlook). The gradient seam + striped bars
  + eyebrow are the closest email-safe approximation. A pixel-exact diagonal-ribbon hero would require a
  single **hosted background image** (needs a verified HTTPS asset; not fabricated here).
- **Outlook desktop / Gmail:** gradients flatten to the solid fallback colours and `border-radius` to
  squares — intended graceful degradation.

### Automated markup QA (v3) — PASS
| Check | Result |
|-------|--------|
| Anchors wrapping a `<table>` (§6.6) | **0** |
| Block-level image anchors (§6.6) | **0** |
| Images with explicit `width`+`height` | **16 / 16** |
| Em dashes in copy (§6.2) | **0** |
| Tag balance (table / td / tr / a) | 55/55 · 111/111 · 84/84 · 44/44 |
| Product sections unchanged (live links + launching-soon + id target) | intact |

All v2 product/link facts, honesty deviations and send-blockers still apply unchanged.

---

## v2 — REVISED IN PLACE (2026-07-17) — live-only, restructured

> **Note:** v2 was **edited in place** at the user's explicit request ("Do NOT create a new HTML… only
> improve the current Concept D Draft v2"). It no longer contains the full 13-SKU range described in the
> superseded notes below. **v3 was branched from the earlier 13-SKU v2 state**, so v3 still shows the
> launching-soon grid; only this v2 file was revised.

**Assesses (current):** `Draft/RDD-2026-LAUNCH-Concept-D-draft-v2.html` after the in-place revision.

### Changes applied (per user checklist)
- **Hero "Launch"** is now a **red script** (`#e0261a`, Georgia italic) instead of charcoal.
- **Top feature/trust icon strip removed** (New Arrivals / Fast Shipping / Australian Owned / Quality
  Guarantee). **Only ONE trust icon section remains** — the "Trust Cards" (Premium Quality · Built to
  Perform · Folds Flat · Expert Support). The footer-features strip was also removed (no duplicate trust
  rows).
- **Promo banner ("Smart Solutions. Built to Last.") moved lower** — flow is now Hero → Just Landed →
  Trust Cards → Promo Banner → Brand statement → Footer.
- **All "Launching Soon" removed** and the entire **Landing Soon section deleted** (header + 9 upcoming
  product cards). The email now shows **only live, in-stock products** — the 4 barriers.
- **Footer cleaned:** RDD logo removed (still in header); tagline "Proudly Supporting Australian Business";
  social icons reduced to **Facebook + Instagram** only (LinkedIn removed).

### Products — 4 live barriers, every card fully clickable
HD White $431.10, HD Black $431.10, Safety White $476.10, Safety Black $476.10. Each card's **image,
title, and VIEW PRODUCT button** all link to the **verified live** product page (re-verified HTTP 200 on
2026-07-17). **Zero `#`/placeholder/hidden links** anywhere (no launching-soon items remain).

### Automated QA (revised v2) — PASS
| Check | Result |
|-------|--------|
| "Launching/Landing/Coming Soon" text | **0 occurrences** |
| Trust icon sections | **1** (no duplicates) |
| Footer socials | **f + IG only** (LinkedIn removed) |
| Footer logo | **removed** (logo image = header only) |
| Hero "Launch" red | ✓ `#e0261a` |
| Promo below Trust Cards | ✓ (Trust Cards precede Promo) |
| Anchors wrapping `<table>` / block image anchors (§6.6) | **0 / 0** |
| Images with `width`+`height` | **6 / 6** |
| Em dashes (§6.2) | **0** |
| Tag balance (table/td/tr/a) | 33/33 · 53/53 · 42/42 · 24/24 |
| `#` / placeholder hrefs | **0** — all live 200 URLs or Liquid unsubscribe |

**Send status unchanged:** comparison draft, **not send-ready** (branding [Inferred]; social links point to
the homepage as a safe interim — real FB/IG URLs To-be-confirmed; on-device + Klaviyo-import client checks
not exercisable here). No fabricated reviews/ratings.

---

### (Superseded) v2 original — full 13-SKU range (2026-07-17)

**Assesses:** the pre-revision `RDD-2026-LAUNCH-Concept-D-draft-v2.html`. User asked (in Cebuano) to
recreate the reference design and **add the SKU products from `RDD-2026-LAUNCH-Concept-C-draft-v1.html`** —
i.e. the full approved range, not just the 4 live barriers. v1 untouched.

### What changed vs v1
- Keeps every component of the reference layout (header, ribbon hero, trust strip, promo banner, benefits
  strip, footer-features strip, honest brand statement, footer) and adds a **social row** (f / IG / in) +
  RDD logo in the footer.
- **Two product sections now carry all 13 approved SKUs** (matching Concept C v1):
  - **Just Landed (5):** the **4 live barriers** (HD White/Black $431.10, Safety White/Black $476.10) —
    2×2 grid, NEW badge, price, title, VIEW PRODUCT. **Every card fully clickable** (image + title +
    button, VML+anchor) to its **verified live** product URL.
  - **Landing Soon (9):** the **7 rubber ramps + speed hump + bollard** — 3×3 grid, **"Launching soon"**
    badge, real image + name + price (bollard = "Price to be confirmed"). These are `is_visible=false` /
    **404** in BigCommerce, so — exactly as Concept C v1 — they use a **clearly-marked `#launching-soon`
    in-page placeholder** (there is a matching `id="launching-soon"` target), **not** a fake live link and
    **not** a 404. This is the §5.4 draft treatment and is why the send stays blocked.

### Honesty deviations (unchanged from v1, still apply)
- **Testimonial** (component 11) is recreated as a dark brand-statement band — **no fabricated customer
  quote and no star rating** (never-invent). Swap in a real, verified testimonial before send.
- **Promo "warehouse image"** = email-safe orange-gradient panel (no photo); **icons** = Unicode glyphs
  in badges (no external icon images). **Social links** point to the RDD homepage (verified 200) as a safe
  interim — the real **FB / IG / LinkedIn URLs are To-be-confirmed** (RDD.md) and must replace them before
  send. **Diagonal ribbon** = email-safe gradient stripe (rotated text-ribbon isn't reliable in email).

### Verification (run BEFORE generating, 2026-07-17)
| Target | Result |
|--------|--------|
| 4 barrier product pages + homepage | **HTTP 200** |
| All 14 images (logo + 13 products) | **HTTP 200 image/jpeg** |

### Automated markup QA (v2) — PASS
| Check | Result |
|-------|--------|
| Anchors wrapping a `<table>` (§6.6) | **0** (footer social icons rebuilt after a first-pass catch of 3) |
| Block-level image anchors (§6.6) | **0** |
| Images with explicit `width`+`height` | **16 / 16** |
| Em dashes in copy (§6.2) | **0** |
| Tag balance (table / td / tr / a) | 54/54 · 110/110 · 83/83 · 44/44 |
| Live barrier links (unique, verified 200) | 4 |
| Launching-soon placeholders (`#launching-soon`, no 404) + matching id target | 9 products (18 anchors) · id present |
| Unique image sources HTTP 200 `image/jpeg` | 14 / 14 |

### Still required before ANY send (§8.1)
- Comparison concept, **not send-ready** — the 9 hidden SKUs block the send until published + re-verified;
  set the bollard price/stock; rename the two "Safety Sector" BC titles; add real social URLs; swap in a
  real testimonial. On-device client checks (Apple Mail iPhone · Gmail · Outlook · Klaviyo import) +
  post-Klaviyo clickability not exercisable here.

---

## v1 (2026-07-17) — reference recreation, 4 live SKUs only

## What this is
The user set `Final Design for Product Launch.png` as the **main design direction** (recreate, not just
inspire). It breaks the email into 12 labelled components. Concept D recreates **all 12** in original RDD
branding with our approved SKUs — same layout, spacing, hierarchy and premium feel, without copying the
reference's images or products.

## Component-by-component mapping
| # | Reference component | Concept D |
|---|---------------------|-----------|
| 1 | Header | Centered RDD logo + small nav (Workspace/Signage/Safety/Retail) |
| 2 | Hero banner | Left: live product on clean white + soft pedestal; Right: orange panel, "NEW PRODUCT" + Georgia-italic "Launch", "Built for Australian worksites", **Shop New In**. Diagonal **ribbon** = email-safe hazard-gradient bars top & bottom (solid-orange Outlook fallback). |
| 3 | Trust icons strip | New Arrivals · Fast Shipping · Australian Owned · Quality Guarantee |
| 4 | Just Landed header | "JUST LANDED" between orange rules |
| 5 | Just Landed products | **2 live heavy-duty barriers** (White/Black $431.10) — NEW badge, price, title, VIEW PRODUCT; all fully clickable |
| 6 | Promo banner | Dark "SMART SOLUTIONS. / BUILT TO LAST." + **orange-gradient industrial accent panel** (email-safe; solid `#20242b` fallback) + EXPLORE COLLECTION |
| 7 | Benefits icon strip | Premium Quality · Built to Perform · Folds Flat · Expert Support |
| 8 | Featured products header | "FEATURED PRODUCTS" between orange rules |
| 9 | Featured products | **2 live safety-grade barriers** (White/Black $476.10) — fully clickable |
| 10 | Footer features strip | Fast Shipping · Easy Returns · Secure Payment · Expert Support |
| 11 | Testimonial | **Recreated as a dark brand-statement band** — see honesty note below |
| 12 | Footer | RDD logo + "Proudly supporting Australian business" + Liquid unsubscribe |

## Two deliberate, honest deviations (flagged)
1. **Products: 4 live SKUs across two grids, no fakes.** The reference has two 3-item grids (6 slots).
   Only **4 approved SKUs are verified live** (the barriers); the other 9 are `is_visible=false` / **404**.
   The user's rules were absolute — *only verified live, no hidden, no 404, no placeholder/`#` links, every
   card clickable*. So both grids are filled from the 4 live barriers with **zero repetition**:
   Just Landed = the 2 **heavy-duty** barriers; Featured = the 2 **safety-grade** barriers. Every image,
   title and VIEW PRODUCT button links to the real live product page. To show more products, the hidden 9
   must first be published + re-verified (same blocker as Concepts A/B/C).
2. **Testimonial: no fabricated review.** The reference shows a "Verified Customer" quote + 5-star rating.
   Fabricating reviews/ratings is prohibited (never-invent). Component 11 keeps the **dark premium
   testimonial styling** (quote mark, italic serif, centered) but carries an **honest brand statement**
   ("Built to last… for the way Australian worksites actually work — The RDD promise") with **no fake
   customer and no star rating**. Drop in a real, verified testimonial + rating when available.

## Verified live (run BEFORE generating, 2026-07-17)
| Target | Result |
|--------|--------|
| 4 barrier product pages (all image/title/button links) | **HTTP 200** |
| Homepage (logo + nav) | **HTTP 200** |
| 5 unique images (logo + 4 barriers) | **HTTP 200 image/jpeg** |
| `#` / placeholder / hidden-product links | **0** |

## Automated markup QA (v1) — PASS
| Check | Result |
|-------|--------|
| Anchors wrapping a `<table>` (§6.6) | **0** |
| Block-level image anchors (§6.6) | **0** |
| Images with explicit `width`+`height` | **7 / 7** |
| Em dashes in copy (§6.2) | **0** |
| Tag balance (table / td / tr / a) | 44/44 · 69/69 · 52/52 · 23/23 |
| `#` or placeholder hrefs | **0** (all live 200 URLs or Liquid unsubscribe) |
| Product cards fully clickable (image + title + button) | 4 / 4 |

## Notes / to-confirm
- **Icons** are email-safe **Unicode glyphs** in orange/white badges (no external icon images to break).
  For a pixel match to the reference's line icons, swap in small hosted PNG/retina icons later.
- **Promo "warehouse image"** is rendered as an email-safe orange-gradient accent panel (no photo). A real
  warehouse photo can be added once a verified, email-safe, HTTPS-hosted image URL is provided.
- **Diagonal ribbon** with rotated repeating text isn't reliably reproducible in email HTML (CSS transforms
  fail in Outlook); recreated as a diagonal **gradient stripe** + a repeating brand eyebrow line.
- **Outlook desktop:** gradients flatten to solid colour and `border-radius` to square corners — intended
  fallbacks, not defects.

## Still required before ANY send (§8.1)
- Comparison concept, **not send-ready**. On-device client checks (Apple Mail iPhone · Gmail
  Web/iOS/Android · Outlook · Klaviyo Preview) + post-Klaviyo clickability not exercisable here.
- Branding **[Inferred]** from the live site; no fabricated social proof.

## Files
- Created: `Draft/RDD-2026-LAUNCH-Concept-D-draft-v1.html`.
- **Untouched:** Concepts A, B (v1–v3), C (v1–v2), and `Output/`.
