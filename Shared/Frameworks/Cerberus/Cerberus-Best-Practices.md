# Cerberus — Best Practices, Adopted

> Every rule Cerberus states, with an explicit verdict: **ADOPT** (new to us) · **HAVE** (already in
> our standards) · **DIVERGE** (we deliberately do otherwise, with the reason).
>
> Companion to [Analysis](Cerberus-Analysis.md) · [Techniques](Cerberus-Techniques.md) ·
> [Components](Cerberus-Components.md) · [Compatibility](Cerberus-Compatibility.md)

---

## 0. How to read this document

Cross-references use each project's own numbering:

- **C§n** = Klaviyo **Campaign** Email System `CLAUDE.md`
- **F§n** = Klaviyo **Flow** Email System `CLAUDE.md`

A rule marked **HAVE** needs no action. A rule marked **ADOPT** is a genuine addition and is
reflected in the updated CLAUDE.md sections. A rule marked **DIVERGE** must **not** be copied from
Cerberus source — §5 explains why for each.

> ### 📐 Hero architecture is out of scope for this document
>
> **Every Hero rule now lives in `Shared/Email-Hero-Engineering-Standard.md`** — the single source of
> truth for both projects. Read it before designing, briefing, exporting or building any Hero.
>
> **Cerberus is deliberately neutral on the Hero geometry problem**, and that is worth stating so it is
> not blamed: Cerberus supplies reflow mechanisms for *content columns* and has no primitive for
> positioning text relative to a feature inside an image. Nothing in Cerberus caused the v1–v26 Hero
> failures and nothing in it can cure them — see §5.10.
>
> What Cerberus **does** contribute to a Hero is the hybrid stacking for the rows **below** the artwork
> band (§5.6, §6.4, and the standard's §9.6), the VML background pattern for that standard's gated
> Variant B2 (§9.2 there), and VML `roundrect` for the CTA. Adopt those; take Hero geometry from the
> standard.
>
> ⚠️ **Campaign-specific:** this supersedes C§6.15 ("copy baked into the Hero artwork") for all new
> work. Existing approved Campaign templates are grandfathered. `Components/hero-image.html` still
> reflects the superseded pattern and is queued for update — build to the standard, not to that file.

---

## 1. Founding principles

| # | Rule | Verdict |
|---|------|---------|
| 1.1 | Code emails "like it's 1999" — target the lowest common denominator, not the best client | **HAVE** — C§6, F§8.1 |
| 1.2 | CSS2 over CSS3 | **HAVE** |
| 1.3 | `<table>`s over `<div>`s for layout | **HAVE** |
| 1.4 | Raster images (PNG/GIF/JPG) over vector (SVG) | **HAVE** — F§9.4 |
| 1.5 | Inline CSS over embedded or external styles | **HAVE** |
| 1.6 | Emails do not need to look identical in every client — they need to *work* in every client | **ADOPT as stated policy.** Our rules imply it; saying it explicitly prevents wasted effort chasing pixel parity in Outlook |
| 1.7 | Check [caniemail.com](https://www.caniemail.com/) before using any CSS property | **ADOPT** — name it as the reference in both QA checklists |

---

## 2. HTML and CSS

| # | Rule | Verdict |
|---|------|---------|
| 2.1 | `<table border="0" cellpadding="0" cellspacing="0" role="presentation">` on every new table | **HAVE** — C§6, F§8.1 |
| 2.2 | When in doubt, nest another table | **HAVE** (balanced against our "keep the table tree minimal" rule for Gmail clip size — C§8.3) |
| 2.3 | **Never rely on CSS inheritance.** Restate `font-family`, `font-size`, `font-weight`, `line-height` and `color` on each text `<td>` — some Outlook versions reset them when tables nest | **ADOPT** — new explicit rule |
| 2.4 | Put styles on the `<td>`, not the `<table>` or `<tr>` | **ADOPT** — new explicit rule |
| 2.5 | Use **padding** for spacing inside table cells | **HAVE** |
| 2.6 | Use **margin** for typography (`<h>`, `<p>`, `<ul>`, `<li>`) | **ADOPT** — new explicit rule |
| 2.7 | Use `align` for layout, never `float` / `flex` / `grid` | **HAVE** — C§6.8, F§8.1 |
| 2.8 | HTML attributes still matter — `align`, `valign`, `height`, `width`, `bgcolor` | **HAVE** — C§6.8, C§6.16, F§8.3, F§8.4 |
| 2.9 | **Six-digit hex only** — `#ffffff`, never `#fff` or `rgb()` | **ADOPT** — new explicit rule |
| 2.10 | Always ship preview text | **HAVE** — C§8.3, F§9.7 |
| 2.11 | Do not run a CSS inliner over the template | **ADOPT** — consistent with our file-size discipline |

---

## 3. Images

| # | Rule | Verdict |
|---|------|---------|
| 3.1 | PNG / GIF / JPG only; never SVG | **HAVE** — F§9.4 |
| 3.2 | Export **@2x** and scale down with HTML `width`/`height` attributes | **ADOPT** as an explicit rule (F§9.4 mentions 2× for the BigCommerce CDN; generalise it) |
| 3.3 | Absolute `https://` `src` always | **HAVE** — C§8, F§9.4 |
| 3.4 | `border="0"` on every image | **ADOPT** — kills the blue outline on linked images |
| 3.5 | `alt` on **every** image; `alt=""` for decorative | **HAVE**, but see 4.4 — the empty-alt half is under-applied |
| 3.6 | Responsive: `width:100%; max-width:Npx; height:auto` | **HAVE** — C§6.6 |
| 3.7 | `display:block` on images | **HAVE** — C§6.6, C§6.14 |
| 3.8 | `.g-img` class on images >~300px wide to suppress Gmail's download-button overlay | **ADOPT — new to us** |
| 3.9 | Style the `<img>`'s `background` + font properties so the **alt-text box** looks intentional when images are blocked | **ADOPT — new to us** |

---

## 4. Accessibility

| # | Rule | Verdict |
|---|------|---------|
| 4.1 | `role="presentation"` on all layout tables | **HAVE** |
| 4.2 | `aria-hidden="true"` on presentational elements (spacers, rules, decorative marks) | **ADOPT** — our spacers omit it |
| 4.3 | Semantic tags — `<h1>`–`<h3>`, `<p>`, `<ul>`, `<strong>`, `<em>` | **HAVE** |
| 4.4 | `alt` on every image; **empty `alt=""` on decorative ones**. An image with *no* `alt` is read aloud as its filename | **PARTIAL — tighten.** We require meaningful alt; we do not consistently require `alt=""` on decoration |
| 4.5 | **Avoid "Click Here" / "Learn More" link text** — poor for screen readers and dictation, and it scores badly with spam filters | **ADOPT — new to us.** ⚠️ Note: C§6.2 currently uses "Learn more" as an example of a *broad primary CTA*. That guidance is about CTA *duplication*, not link-text quality. Prefer destination-descriptive labels — "Shop the Ramps Range", "View the Safety Collection" |
| 4.6 | Ship a **plain-text version** of every email | **ADOPT — new to us.** Klaviyo can auto-generate one; the rule is to *review* it, not just let it generate |
| 4.7 | `role="article" aria-roledescription="email" lang="en"` on the wrapper | **ADOPT — new to us** |
| 4.8 | WCAG AA contrast | **HAVE** — F§9.5 (RDD's two-tier orange is the mechanism) |
| 4.9 | ≥14px body, ≥44px tap targets | **HAVE** — F§9.5 |

---

## 5. Where we deliberately diverge — the reasoning

Each of these is a case where Cerberus's assumptions do not match our production environment.
**Do not "fix" our templates toward Cerberus on any of these points.**

### 5.1 Page background: wrapper table, not `<body>` + `<center>`

**Cerberus:** background colour declared in three places — the `<body>` tag, the `<center>` tag, and an
MSO conditional table.

**Us (C§6.16):** a full-width wrapper `<table>` carrying **both** `bgcolor="#…"` **and** inline
`background:#…`, plus `bgcolor` on **every coloured section's `<table>` and its content `<td>`**.

**Why:** Gmail's mobile apps rewrite `<body>` and frequently drop CSS `background` on tables and
cells. Cerberus's three-place approach still produced white side gutters and white seams between
adjacent sections for us on SS-2026-LAUNCH. The `bgcolor` **attribute** is the only declaration Gmail
mobile reliably honours, and it must be on the **cell**, not just the table, because that is what
Gmail paints. Ours is a strict superset of Cerberus's — desktop renders byte-identically.

### 5.2 Preheader: one line, no `&zwnj;` run

**Cerberus:** a hidden preheader `<div>` followed by a long `&zwnj;&nbsp;&zwnj;&nbsp;…` spacing run.

**Us (C§8.3):** the hidden preheader only, as a single minimal line.

**Why:** the spacer run adds bulk toward Gmail's ~102 KB clip threshold — past which the footer
(carrying the legally required unsubscribe) disappears behind "View entire message" — and it matches
the invisible-node patterns our ghost-element inspection (C§8.2, F§9.2) flags. Cerberus's own point
that a longer preheader is better for screen readers argues for **more real preheader text**, not for
invisible padding characters. We take that half.

### 5.3 Product cards: three sibling anchors, never a wrapped block

**Cerberus:** does not address it (it has no product card). Its buttons wrap inline content only,
which is consistent with our rule, but the framework states no prohibition.

**Us (C§6.6, F§8.2):** an `<a>` may contain **inline content only**. A clickable card uses **three
sibling anchors** — one around the `<img>`, one around the title, one around the price — all to the
same URL. Never one anchor around the card `<table>`.

**Why:** **Klaviyo re-parses and rewrites every link on import** for click tracking, and detaches the
`href` from a block-level wrapper. The card renders and looks clickable, and is dead after upload.
This is not a browser bug and no browser preview reveals it. Cerberus does not target Klaviyo.

### 5.4 Filled badges: shrink-to-fit table, not an inline-block anchor

**Cerberus:** `<a style="display:block">` inside a styled `<td>`, inside a content-width table.

**Us (C§6.17):** for a **background-filled price badge**, the fill and radius live on the `<td>` of a
shrink-to-fit `<table>` with **no `width` attribute**, and the price is a plain inline `<a>` inside
that cell.

**Why:** the Gmail mobile app normalises inline styles and coerces background-filled inline-block /
block anchors toward full width. On RDD-2026-W31 the badges rendered correctly on desktop and
stretched to nearly the full card width on Gmail Android and iOS. A table with no `width` attribute
collapses to its content in every client, **whether or not `<head>` CSS is honoured**.

**Not a conflict for text CTAs.** Cerberus's button is already inside a content-width table, so it
behaves correctly. Our rule generalises the mechanism and removes the anchor's role in sizing.

### 5.5 `display:block` on an anchor — the distinction that matters

**Cerberus:** puts `display:block` on the button anchor. **Correct, and we keep it.**

**Us (C§6.6, F§8.2):** never `display:block` on an anchor that **wraps an image**.

**Why they don't conflict:** the failure is decode-order-specific. Apple Mail on iOS resolves a block
anchor's height *before the image inside it decodes*; with no intrinsic box it collapses the anchor to
zero height and never paints the image. Desktop Safari and Gmail Android decode-then-reflow and
recover, which is why the SS-2026-W29 hero looked fine everywhere except iPhone. A **text** anchor has
no decode step and no such failure. **Rule: `display:block` on text anchors — yes. On image-wrapping
anchors — never; put it on the `<img>` instead.**

### 5.6 Container width: 600px, not the hybrid's 680px

**Cerberus:** the hybrid template runs at 680px, noting the hybrid grid is "more fragile" and that
680px works well.

**Us:** 600px across both systems, all brands, all campaign types.

**Why:** every approved brand design, product-card measurement, hero artwork export and reference
rendering we own is built to 600px. Changing the container is a redesign of every template and a
re-export of every hero — not a framework upgrade. Adopt hybrid's *mechanism* at our width; the
column maths are recomputed in [Techniques §3](Cerberus-Techniques.md).

### 5.7 `table-layout: fixed !important` — do not adopt

**Cerberus:** applies it globally in the reset.

**Us:** adopt the rest of the reset, **omit this declaration.**

**Why:** it makes the first row's widths authoritative and disables intrinsic sizing. Two of our
patterns depend on intrinsic sizing — the shrink-to-fit price badge (§5.4) and the centred odd last
card inside a `colspan` cell (C§6.9). A global `!important` version of this rule is exactly the kind
of quiet, cross-cutting override that produces client-dependent grid drift. If one table ever needs
it, set it inline on that table.

### 5.8 ESP tags: Klaviyo, not Campaign Monitor

**Cerberus:** `<webversion>` and `<unsubscribe>` custom elements.

**Us:** `{% unsubscribe_link %}` and `{% manage_preferences_link %}` inside real `<a href="…">`
elements, per F§8.7.

**Why:** those are Campaign Monitor tags. In Klaviyo they render as unknown elements — visible text,
no link, no compliance. And F§8.7 additionally forbids any tag that **emits HTML** inside an
attribute: `{% unsubscribe %}` returns a complete `<a>`, so `href="{% unsubscribe %}"` nests an anchor
inside an `href` and spills raw attribute text onto the screen. That defect shipped once and survived
seven template revisions. Only **URL-returning** tags go in an `href`.

### 5.9 Placeholder image URLs

**Cerberus:** `https://via.placeholder.com/…` throughout.

**Us:** never. That service is defunct; copying a template verbatim ships broken images. Every
`<img src>` must be a verified HTTPS 200 `image/*` response with no redirects (C§8, F§9.4).

### 5.10 Hero: Aspect-Locked Band + Colour-Bonded Copy, not a background-image hero with overlaid copy

[Established 2026-07-29 by the v1–v26 Hero geometry investigation. **Full specification:
`Shared/Email-Hero-Engineering-Standard.md` — not restated here.**]

**Cerberus:** offers a background-image band (`Cerberus-Techniques.md` §8 — CSS `background-image` +
VML `v:rect`/`v:fill`/`v:textbox`) and presents overlaying HTML text on an image as *"the only reliable
way to layer HTML text over an image in email"*. It is silent on what happens to that overlay as the
container narrows.

**Us:** the artwork is a **full-width aspect-locked band whose bottom terminates in a flat published
colour**, and **all** copy sits **below** it on that same colour. Overlay is not the default; it is a
gated exception (that standard's Variant B2) requiring `W* ≤ 320px`.

**Why we differ — and this is measurement, not taste:**

1. **Cerberus's statement is true but incomplete.** Overlay *is* the only way to layer text over an
   image. What does not exist in email is **responsive** overlay. The overlay is anchored by table
   padding in absolute px; the artwork's features sit at percentages of the container width. The two
   drift apart at `k` px per px of lost width, where `k` is the artwork's clear-zone fraction.
2. **The critical width is computable, and it is above every phone.** `W* = (inset + copy_width) ÷ k`.
   Measured on the artwork that triggered the investigation (`k = 327/600 = 0.545`, inset 32, copy 246):
   **`W* = 510px`.** At 375px the copy overruns the artwork's first feature by **74px**.
3. **Percentage columns remove the drift but collapse the hierarchy.** Type cannot scale — there are no
   viewport-relative font units in Outlook, Gmail or Yahoo. Holding a 41% column, the largest headline
   that fits at 320px is 18px against 15px body: a headline-to-body ratio of **1.2:1**, down from 2.0:1.
4. **Cerberus has no reason to have hit this.** Its background band carries a short centred line, not a
   display headline in a constrained clear zone beside photography. Our brands' Heroes do.
5. **The Band architecture removes VML from the Hero entirely** in the default variant, because nothing
   sits over the artwork. That is strictly *less* Outlook risk than Cerberus's pattern, not more.

**What we keep from Cerberus:** hybrid stacking for the rows below the band · the VML background pattern
verbatim for Variant B2 · VML `roundrect` for the CTA · `background-color` as mandatory rather than
optional (it is the images-off surface) · the @1x VML `src` rule (Outlook cannot scale a background
image) · alt-text-box styling.

**Do not "correct" a Hero toward Cerberus's overlay pattern.** Compute `W*` first.

**Campaign note:** this also replaces C§6.15's baked-in-copy requirement for new work. Baking copy in was
*geometrically* sound — everything scaled together — but cost images-off legibility, accessibility,
personalisation and editability. The Band architecture keeps the geometric guarantee and returns all four.

---

## 6. The adoption list — what actually changes

Everything below is **additive**. No approved template is modified, no existing rule is reversed.

### 6.1 Head scaffold additions

```html
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
```
```css
:root { color-scheme: light dark; supported-color-schemes: light dark; }
```
Plus a real, non-empty `<title>`.

### 6.2 Reset additions (all of these are new to us)

```css
div[style*="margin: 16px 0"] { margin: 0 !important; }          /* Android 4.4 */
#MessageViewBody, #MessageWebViewDiv { width: 100% !important; } /* Samsung Mail */
img { -ms-interpolation-mode: bicubic; }                         /* IE/Word downscaling */
.a6S { display:none !important; opacity:0.01 !important; }       /* Gmail download button */
img.g-img + div { display: none !important; }                    /* …fallback */
.im { color: inherit !important; }                               /* Gmail thread recolour */
a[x-apple-data-detectors], .unstyle-auto-detected-links a, .aBn {
  border-bottom:0 !important; cursor:default !important; color:inherit !important;
  text-decoration:none !important; font-size:inherit !important; font-family:inherit !important;
  font-weight:inherit !important; line-height:inherit !important;
}
@media only screen and (min-device-width:320px) and (max-device-width:374px) { u ~ div .email-container { min-width:320px !important; } }
@media only screen and (min-device-width:375px) and (max-device-width:413px) { u ~ div .email-container { min-width:375px !important; } }
@media only screen and (min-device-width:414px) { u ~ div .email-container { min-width:414px !important; } }
```

**Omit `table-layout: fixed`** (§5.7).

### 6.3 Markup additions

- `role="article" aria-roledescription="email" lang="en"` on the outer wrapper.
- `aria-hidden="true"` + `mso-line-height-rule:exactly` on every spacer cell.
- `class="unstyle-auto-detected-links"` on every footer address / phone block.
- `class="g-img"` on images wider than ~300px.
- `border="0"` on every `<img>`.
- Alt-text-box styling (`background` + font properties) on hero and logo images.

### 6.4 Layout additions

- **Hybrid stacking** for multi-column rows — the layout must be correct before CSS loads.
- **`dir="rtl"` order-swapping** for alternating image/text rows.
- **VML background-image** pattern for text-over-image bands (Flow system especially).
- **Full-bleed background section** structure, with our `bgcolor` hardening.

### 6.5 Codified micro-rules

- Six-digit hex only.
- Padding for cells, margin for typography.
- Restate inherited font properties on every text `<td>`.
- Export images @2x, scale via HTML attributes.
- No "Click Here" / generic link text.
- Review the plain-text version.
- Check caniemail.com before using an unfamiliar property.

---

## 7. Combined pre-Output checklist

Run alongside the existing QA gates (C§8.1/§8.2/§8.3, F§9). Cerberus-derived items marked ★.

> **If the template contains a Hero, run
> `Shared/Email-Hero-Engineering-Standard.md` §11 (Validation Checklist) and §12 (Approval Gates) as
> well.** Those items are **not** duplicated below. The Hero checklist is additive to this one, and its
> Gate 4 client matrix is a hard requirement before promotion to `Output/`.

**Structure**
- ☐ Every layout table: `role="presentation" cellpadding="0" cellspacing="0" border="0"`
- ☐ Container fluid — `width:100%; max-width:600px` — never a bare `width="600"`
- ☐ MSO ghost table locks 600px for Outlook
- ☐ ★ Multi-column rows stack from inline styles alone (hybrid), not from a media query
- ☐ ★ Hybrid column maths reconcile: `min-width`, `max-width`, ghost `<td>` widths, ghost table width
- ☐ ★ `font-size:0` on the hybrid parent cell; font size restated inside each column

**Backgrounds**
- ☐ Page background on a wrapper `<table>` with `bgcolor` **and** inline `background`
- ☐ Every coloured section: `bgcolor` on the `<table>` **and** its content `<td>`, identical hex

**Links**
- ☐ Zero `<table>` inside any `<a>`; product cards use three sibling anchors
- ☐ Zero `display:block` on an image-wrapping anchor
- ☐ No `#`, empty, placeholder or 404 `href`
- ☐ Clickability verified **after** a real Klaviyo import
- ☐ ★ No template tag that emits HTML inside any attribute

**Images**
- ☐ Every `<img>`: absolute HTTPS, HTTP 200, `image/*`, no redirects
- ☐ Every `<img>`: explicit `width` + `height` attributes, `border="0"`, `display:block`
- ☐ ★ `class="g-img"` on images >300px
- ☐ ★ Alt-text box styled; `alt=""` on decorative images
- ☐ No SVG anywhere

**Buttons / badges**
- ☐ Fill + radius duplicated on the `<td>` and the `<a>`
- ☐ VML `roundrect` where the brand's radius matters
- ☐ Filled badges are shrink-to-fit tables, content-width on Gmail mobile
- ☐ ≥44px tap targets via padding

**Grid**
- ☐ Equal card height via fixed-height `<td>`, not `min-height`
- ☐ Odd last card centred via `colspan`
- ☐ Reserved heights reset to `auto` on mobile

**Accessibility** ★
- ☐ `role="article" aria-roledescription="email" lang="en"` on the wrapper
- ☐ `aria-hidden="true"` on every spacer
- ☐ No "Click Here" / generic link text
- ☐ `unstyle-auto-detected-links` on the footer address block
- ☐ Plain-text version reviewed
- ☐ WCAG AA contrast throughout

**Dark mode**
- ☐ `color-scheme` meta + `:root` CSS + `prefers-color-scheme` + `[data-ogsc]`
- ☐ Light/dark image swap guarded by `<!--[if !mso]><!-->`

**File**
- ☐ Well under Gmail's ~102 KB clip; footer visible without "View entire message"
- ☐ Descriptive comments stripped; `[if mso]` conditionals **kept**
- ☐ Ghost-element inspection clean

---

_Best-practices adoption record for Cerberus `fa6de2e` · 2026-07-28._
