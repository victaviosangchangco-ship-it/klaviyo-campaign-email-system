# Cerberus — Framework Analysis

> Complete analysis of the Cerberus Responsive Email Patterns framework (commit `fa6de2e`,
> 2024-07-07) and what it means for our two Klaviyo systems.
>
> Companion docs: [Techniques](Cerberus-Techniques.md) · [Components](Cerberus-Components.md) ·
> [Best Practices](Cerberus-Best-Practices.md) · [Compatibility](Cerberus-Compatibility.md)

---

## 1. What Cerberus actually is

Cerberus is **not a framework in the software sense.** There is no build step, no CLI, no
dependency, no class library to import. It is **three annotated HTML files** plus documentation:

```
cerberus-fluid.html        22 KB   simple / transactional / single column
cerberus-responsive.html   35 KB   media-query driven, shape-shifting
cerberus-hybrid.html       44 KB   works with or without media-query support
```

Every file is a complete, standalone, copy-pasteable email. The value is in the *annotations* —
almost every line carries a `<!-- What it does: … -->` comment explaining which client bug it fixes.

**The core thesis, stated by the framework itself:**

> "Cerberus strives to support email clients with low levels of HTML & CSS support… It's safest to
> code emails like it's 1999 (still)." — `docs/content/best-practices.md`

That means, in the framework's own words:

- CSS2 instead of CSS3
- `<table>`s instead of `<div>`s
- Raster images (PNG/GIF/JPG) instead of vector (SVG)
- Inline CSS instead of embedded styles or external stylesheets

This is the same position our two CLAUDE.md files already hold. **Cerberus independently validates
our architecture** — it did not need to change it.

### Why the name matters

Cerberus, the three-headed dog. Three templates, three strategies for the same problem: *how do you
make one HTML document look right on a 1990s Word rendering engine, a modern WebKit client, and a
mobile app that strips your stylesheet?* Each head answers it differently. **Choosing the right head
for the job is the single most important decision the framework asks you to make.**

---

## 2. The three template architectures

### 2.1 Fluid (`cerberus-fluid.html`)

**Strategy:** percentage widths that shrink. The layout **never reconfigures** — a 2-column row stays
2-column at every width, just narrower.

```html
<div style="max-width: 600px; margin: 0 auto;" class="email-container">
  <!--[if mso]><table align="center" width="600"><tr><td><![endif]-->
  …content…
  <!--[if mso]></td></tr></table><![endif]-->
</div>
```

Width is declared in exactly **two** places: `max-width` on the container `<div>` for everyone, and an
MSO ghost table at a fixed `600` for Word-engine Outlook (which ignores `max-width`).

- **Columns:** plain `<td width="50%">` — they narrow, they never stack.
- **Media queries:** one, and only for typography (`.email-container p { font-size: 17px }`).
- **Good for:** transactional email, single-column newsletters, anything text-and-image-led.
- **Risk:** a 2-column product row at 320px gives each card ~150px. Unusable for our product grids.

**Verdict for us:** the *shell* is excellent and is close to what we already ship. The *column model*
is not sufficient for a 2-column product grid, which must stack.

---

### 2.2 Responsive (`cerberus-responsive.html`)

**Strategy:** a fixed-width desktop table, reconfigured on small screens by media queries.

```html
<table align="center" width="600" class="email-container">
  …
  <th valign="top" width="50%" class="stack-column-center"> … </th>
  <th valign="top" width="50%" class="stack-column-center"> … </th>
```

```css
@media screen and (max-width: 600px) {
  .email-container { width: 100% !important; }
  .stack-column,
  .stack-column-center {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    direction: ltr !important;
  }
  .stack-column-center { text-align: center !important; }
}
```

Two details worth stealing:

1. **Columns are `<th>`, not `<td>`.** `<th>` is a block-level-friendly table cell that stacks more
   reliably, and Cerberus neutralises its default bold with `th { font-weight: normal; }` in the
   reset. It also gives screen readers a slightly better structure than a bare `<td>`.
2. **`direction: ltr !important` in the stack rule.** This is the reset half of the `dir="rtl"`
   order-swap trick (see [Techniques §5](Cerberus-Techniques.md)) — without it, a right-thumbnail
   layout stacks in reverse on mobile.

- **Good for:** layouts that must genuinely change shape (2-col → 1-col) and where you accept that
  media-query-blind clients get a shrunken desktop layout.
- **Risk:** **this is the template's stated weakness.** The framework is explicit that some Gmail app
  configurations and several international clients do not support media queries or `<style>` at all —
  those users see the 600px desktop layout crushed into 320px.

**Verdict for us:** this is architecturally closest to what our systems ship today, and its stacking
classes are cleaner than ours. But its media-query dependence is exactly the failure mode our
Campaign `§6.16` and Flow `§8.4` rules were written to eliminate.

---

### 2.3 Hybrid (`cerberus-hybrid.html`) — the important one

**Strategy:** build a **mobile-first fluid baseline that needs no media queries at all**, then let
Outlook see a fixed-width ghost table, then use media queries only as *progressive enhancement*.

```html
<td align="center" valign="top" style="font-size:0; padding: 10px;">
  <!--[if mso]>
  <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="660">
  <tr>
  <td valign="top" width="330">
  <![endif]-->
  <div style="display:inline-block; margin: 0 -1px; width:100%; min-width:200px; max-width:330px; vertical-align:top;" class="stack-column">
    …column content…
  </div>
  <!--[if mso]>
  </td>
  <td valign="top" width="330">
  <![endif]-->
  <div style="display:inline-block; margin: 0 -1px; width:100%; min-width:200px; max-width:330px; vertical-align:top;" class="stack-column">
    …column content…
  </div>
  <!--[if mso]>
  </td>
  </tr>
  </table>
  <![endif]-->
</td>
```

**How it works, mechanically:**

| Element | Job |
|---------|-----|
| `display:inline-block` on the column `<div>` | columns sit side-by-side while there is room, and **wrap onto a new line when there isn't** — stacking with zero CSS support required |
| `max-width:330px` | caps the column at its desktop width |
| `min-width:200px` | forces the wrap: two 200px minimums cannot fit in a <400px container, so the second wraps |
| `width:100%` | once wrapped, the column fills the row |
| `font-size:0` on the **parent** `<td>` | kills the whitespace gap that `inline-block` elements inherit from the newline between them in source |
| `margin: 0 -1px` | absorbs sub-pixel rounding so two 50% columns don't wrap prematurely |
| `vertical-align:top` | aligns wrapped columns to their top edge |
| MSO ghost table | Outlook ignores every property above, so it is handed a real `<table width="660">` with real `<td width="330">` cells |

**This is the single most valuable idea in Cerberus.** The layout is correct *before any stylesheet
is applied*. A client that strips `<head>` CSS still gets a stacking layout, because the stacking
mechanism is inline.

- **Good for:** everything we build. Especially product grids.
- **Cost:** the framework is honest about it — "All the extra Outlook code can make these templates
  quite large and your maths have to be spot on for multi-column layouts." Column widths, gutters and
  the ghost table width must all reconcile, or Outlook silently drops a column to the next row.
- **Note:** the hybrid template runs at **680px**, not 600px, with the comment that "the hybrid grid
  is more *fragile*, and I've found that 680px is a good width." **We stay at 600px** (see
  [Best Practices §5.6](Cerberus-Best-Practices.md)).

**Verdict for us:** this is the pattern our systems have been *converging on independently*. Our
Campaign `§6.16` "fluid container, never rely on a `@media` rule alone" and Flow `§8.4` "must work
from inline styles and attributes on their own" are hybrid thinking, arrived at by debugging Gmail
mobile rather than by reading Cerberus. Adopting hybrid explicitly gives us the *complete* pattern
instead of the half we reverse-engineered.

---

### 2.4 Choosing between them — our decision table

| Situation | Template | Why |
|-----------|----------|-----|
| Transactional, receipt, single-column notice | **Fluid** | Nothing needs to reconfigure; smallest file |
| Flow email, mostly one column + one 2-col row | **Fluid shell + hybrid row** | Keep the file small, pay the ghost-table cost only where columns exist |
| Weekly/Monthly campaign with a product grid | **Hybrid** | The grid must stack in clients that strip `<head>` CSS |
| Product Launch / Seasonal / any multi-section campaign | **Hybrid** | Same |
| Anything where total client coverage is not required | Responsive | Not applicable to us — we always need coverage |

**Standing rule:** *media queries refine, they never carry the layout.*

---

## 3. Complete concept inventory

Everything the framework teaches, with a one-line verdict. Full detail in the linked docs.

### 3.1 Document scaffold

| Concept | What it is | Verdict |
|---------|-----------|---------|
| `xmlns:v` / `xmlns:o` on `<html>` | Declares the VML and Office namespaces so `<v:*>` / `<o:*>` tags parse | **Adopt** — required for VML buttons/backgrounds |
| `<meta name="x-apple-disable-message-reformatting">` | Stops iOS Mail auto-scaling the whole message | **Adopt — new to us** |
| `<meta name="format-detection" content="telephone=no,address=no,…">` | Stops iOS auto-linking phone/address/date text | **Adopt — new to us** |
| `<meta name="color-scheme">` + `supported-color-schemes` | Declares dark-mode participation | Already have |
| `:root { color-scheme: light dark; }` | CSS duplicate of the meta, for clients that read one and not the other | **Adopt** |
| `<o:OfficeDocumentSettings><o:PixelsPerInch>96` | Makes 72ppi Outlook render background images at the right size | Already have |
| Non-empty `<title>` | Shown in some Android notification previews | **Adopt** — we sometimes ship `[[SUBJECT_LINE]]` unresolved |
| `role="article" aria-roledescription="email" lang="en"` on the wrapper | Announces the message as one article to screen readers | **Adopt — accessibility win** |

### 3.2 The CSS reset — 13 targeted client fixes

Cerberus's reset is not a generic normalise; **every rule fixes a named client bug.** Full annotated
list in [Techniques §1](Cerberus-Techniques.md). The ones we do **not** currently have:

| Rule | Fixes |
|------|-------|
| `div[style*="margin: 16px 0"] { margin: 0 !important; }` | Android 4.4 injecting a 16px margin |
| `#MessageViewBody, #MessageWebViewDiv { width: 100% !important; }` | Samsung Mail not using the full viewport |
| `.a6S { display:none !important; opacity:0.01 !important; }` + `img.g-img + div` | Gmail overlaying a **download button** on large unlinked images |
| `.im { color: inherit !important; }` | Gmail recolouring text inside a conversation thread |
| `a[x-apple-data-detectors]`, `.aBn`, `.unstyle-auto-detected-links a` | iOS/Gmail auto-linking dates and addresses in blue |
| `u ~ div .email-container { min-width: …px }` per device width | **Gmail iOS app right-hand gutter** |
| `img { -ms-interpolation-mode: bicubic; }` | Poor image downscaling in IE-based renderers |
| `table { table-layout: fixed !important; }` | WebKit padding inconsistency — ⚠️ interacts with our fixed-height grids, see §5 |

That `u ~ div .email-container` rule deserves special note: **it is a fix for the exact class of
Gmail-mobile gutter defect that our Campaign `§6.16` was written to solve**, approaching it from a
completely different angle (forcing a minimum container width per device instead of repainting the
background). The two are complementary, not alternatives.

### 3.3 Layout and structure

| Concept | Verdict |
|---------|---------|
| Table-based layout, `role="presentation"` everywhere | Already have |
| `cellpadding="0" cellspacing="0" border="0"` on every table | Already have |
| Padding on `<td>` for spacing; margin on `<p>`/`<h>`/`<li>` for typography | **Adopt as an explicit rule** |
| Never `float`, `flex`, or `grid` — use `align` | Already have |
| Nest another table when in doubt | Already have |
| Never rely on CSS inheritance — restate `font-family`/`size`/`color` on each `<td>` | **Adopt as an explicit rule** |
| HTML attributes (`align`, `valign`, `width`, `height`, `bgcolor`) still matter | Already have |
| Six-digit hex (`#ffffff`, never `#fff` or `rgb()`) | **Adopt as an explicit rule** |
| Hybrid ghost tables | **Adopt** — §2.3 |
| `dir="rtl"` / `dir="ltr"` to swap column order on desktop while preserving mobile stack order | **Adopt — new to us**, valuable for alternating flow layouts |
| Full-bleed background section (bg table outside the container, content re-constrained inside) | **Adopt** — cleaner than what we do |
| Spacer row: `<td aria-hidden="true" height="40" style="font-size:0;line-height:0;">&nbsp;</td>` | **Already have** and already correctly distinguished from a ghost cell |

### 3.4 Components

Buttons, images, backgrounds, typography, spacers — see [Components](Cerberus-Components.md).

### 3.5 Dark mode

`prefers-color-scheme` with `!important` utility classes, and the light/dark **image swap** guarded by
`<!--[if !mso]><!-->` so Outlook doesn't show both. See [Techniques §8](Cerberus-Techniques.md).

### 3.6 Accessibility

`role="presentation"`, `aria-hidden` on decoration, semantic `<h>`/`<p>`/`<ul>`, `alt` on every image
(empty `alt=""` when decorative), avoid "Click Here" link text, ship a plain-text version.
See [Best Practices §4](Cerberus-Best-Practices.md).

### 3.7 Explicit anti-recommendation: CSS inliners

Cerberus recommends **against** running a CSS inliner over its templates — the `<head>` CSS is
deliberately placed there, `:hover` doesn't inline, and inlining bloats the file toward Gmail's clip
threshold. **This aligns with our own file-size discipline** (Campaign `§8.3`, Flow `§9.4`).

---

## 4. What Cerberus confirms about our existing architecture

Reading Cerberus against our two CLAUDE.md files, the overlap is substantial and independent. Rules
we learned from production defects that Cerberus states as first principles:

| Our rule | Learned from | Cerberus states it as |
|----------|-------------|----------------------|
| Table-based + inline CSS, 600px, single column | Baseline | Core thesis |
| Never `flex`/`grid`/`float` | Campaign §6.8, Flow §8.1 | "Use `align` for layout" |
| Fixed-height `<td>`, not `min-height`, for equal cards | Campaign §6.8 (SS-2026-W30 v3→v6) | "HTML attributes are still relevant"; Outlook honours `height` |
| `display:block` on the `<img>`, never the anchor | Campaign §6.6 (SS-2026-W29, Apple Mail iOS) | "use `display:block` when possible since it negates a few pixels of unwanted space below images" |
| Explicit `width`/`height` attributes on every image | Campaign §6.6 | Image attribute table |
| Never ship SVG | Flow §9.4 | "SVG has almost no support in email" |
| Structural width must not depend on `@media` | Campaign §6.16, Flow §8.4 | The entire hybrid rationale |
| Keep the file under Gmail's clip threshold | Campaign §8.3 | Anti-inliner argument |
| Sized spacer with `&nbsp;`, not an empty cell | Flow §8.3 | Spacer component spec |

**Conclusion: no architectural change is warranted.** Cerberus is a confirmation and an extension,
not a correction. What it adds is (a) the complete hybrid pattern, (b) roughly eight client-specific
reset rules we were missing, and (c) a vocabulary for techniques we had not yet needed.

---

## 5. Where we deliberately diverge from Cerberus

These are **not** oversights. Each is a case where our production conditions differ from Cerberus's
assumptions. Summarised here; argued in full in
[Best Practices §5](Cerberus-Best-Practices.md).

| # | Cerberus does | We do | Why |
|---|---------------|-------|-----|
| 1 | Page background on `<body>` + `<center>` + MSO conditional | Page background on a **full-width wrapper `<table>` with `bgcolor` attribute AND inline `background`**, plus `bgcolor` on every coloured section's `<table>` **and** its content `<td>` | Gmail's mobile apps rewrite `<body>` and drop CSS `background`. Cerberus's three-place approach still produced white gutters and seams for us (Campaign §6.16, SS-2026-LAUNCH). Ours is a superset. |
| 2 | Long `&zwnj;&nbsp;` preview-text spacing run | **One minimal preheader line** | The spacer run adds bulk toward Gmail's ~102 KB clip and is a ghost-node pattern our §8.2/§9.2 inspection flags. Campaign §8.3. |
| 3 | Anchor-wrapped card is fine (Cerberus never wraps a table in an `<a>`, but doesn't forbid it) | **Three sibling anchors** per product card; never a `<table>` inside an `<a>` | Klaviyo re-parses and rewrites links on import and detaches the `href` from a block wrapper. Cerberus does not target Klaviyo. Campaign §6.6, Flow §8.2. |
| 4 | `display:inline-block` anchors for buttons | Fine for **text** buttons; **never** for a background-filled price badge — those use a shrink-to-fit centred `<table>` | The Gmail mobile app coerces background-filled inline-block anchors toward full width. Campaign §6.17 (RDD-2026-W31). |
| 5 | Hybrid template runs at **680px** | **600px** everywhere | Our brands' approved designs, product-card measurements and hero artwork are all built to 600px. Changing it is a redesign, not a framework upgrade. |
| 6 | `table { table-layout: fixed !important; }` in the reset | **Do not adopt globally** | `table-layout:fixed` makes the first row's widths authoritative and can override the intrinsic sizing our fixed-height card grids and shrink-to-fit price badges rely on. Apply per-table if ever needed, never as a global `!important`. ⚠️ |
| 7 | `<webversion>` and `<unsubscribe>` custom ESP tags | Klaviyo tags: `{% unsubscribe_link %}`, `{% manage_preferences_link %}` | Those are Campaign Monitor tags. Copying them ships a broken footer. And per Flow §8.7, only **URL-returning** tags may appear inside an `href`. |
| 8 | `https://via.placeholder.com/…` image sources | Never — that service is dead and would ship as broken images | Our images come from the brand CDN, verified HTTP 200 `image/*`, no redirects. |
| 9 | Web-font `<link>` in `<head>` guarded by `[if !mso]` | Permitted, but **treat the email-safe stack as the real design** | Existing policy in `Shared/Fonts/font-stacks.md`. |

**Items 6, 7 and 8 are traps.** Copying Cerberus source verbatim into a production template would
ship a dead-image URL, a non-functional unsubscribe, and a global table rule that can quietly break
our product grids. This is precisely why the framework is vendored as a **reference** and why our
`Components/` directory holds *hardened* extractions rather than raw copies.

---

## 6. What we adopt — the shortlist

Ranked by value to us:

1. **Hybrid layout pattern with MSO ghost tables** — the layout must be correct before CSS loads.
2. **The eight missing reset rules** (Gmail download button, Gmail thread recolour, Gmail iOS gutter,
   Samsung viewport, Android 4.4 margin, iOS/Gmail auto-detected links, `x-apple-disable-message-reformatting`,
   `format-detection`).
3. **`dir="rtl"` order-swapping** for alternating image/text rows without duplicating markup.
4. **Accessibility hardening** — `role="article"`, `aria-roledescription`, `aria-hidden` on spacers,
   `alt=""` on decorative images, no "Click Here" link text, plain-text version.
5. **Full-bleed background section pattern.**
6. **VML background images** (`v:rect` / `v:fill` / `v:textbox`) — we have VML buttons but no
   documented background-image pattern.
7. **Codified micro-rules** — six-digit hex, padding-for-cells / margin-for-typography, restate
   inherited font properties, @2x images scaled by attributes.

All seven are additive. None requires changing an existing approved template.

---

_Analysis of Cerberus `fa6de2e` · written 2026-07-28 · applies to both the Klaviyo Campaign Email
System and the Klaviyo Flow Email System._
