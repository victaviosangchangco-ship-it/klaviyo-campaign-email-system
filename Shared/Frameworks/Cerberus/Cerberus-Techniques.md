# Cerberus — Techniques Reference

> Every mechanical technique in Cerberus, with the client bug it solves and how we apply it.
> Companion to [Analysis](Cerberus-Analysis.md) · [Components](Cerberus-Components.md) ·
> [Best Practices](Cerberus-Best-Practices.md) · [Compatibility](Cerberus-Compatibility.md)

---

## 1. The CSS reset — every rule is a named client fix

Cerberus's `<head>` reset is not a normalise. Each declaration targets a specific documented client
bug. This is the complete annotated list.

```css
/* Declares dark-mode participation in CSS as well as in <meta> —
   some clients read one and not the other. */
:root { color-scheme: light dark; supported-color-schemes: light dark; }

/* Removes the padding some clients add around the message.
   ⚠️ Cerberus warns this can also affect the reply-compose window. */
html, body { margin: 0 auto !important; padding: 0 !important; height: 100% !important; width: 100% !important; }

/* Stops iOS/Windows clients auto-inflating small text. */
* { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }

/* Android 4.4 injects `margin: 16px 0` on a wrapper div; this neutralises it. */
div[style*="margin: 16px 0"] { margin: 0 !important; }

/* Samsung Mail renders the message narrower than the viewport without this. */
#MessageViewBody, #MessageWebViewDiv { width: 100% !important; }

/* Outlook (Word engine) adds horizontal spacing around tables. */
table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; }

/* <th> is used for stacking columns in the responsive template; kill its default bold. */
th { font-weight: normal; }

/* WebKit adds table padding; border-collapse + border-spacing remove it.
   ⚠️ table-layout:fixed — see §1.1, do NOT adopt globally. */
table { border-spacing: 0 !important; border-collapse: collapse !important;
        table-layout: fixed !important; margin: 0 auto !important; }

/* IE/Word downscales images badly without bicubic. */
img { -ms-interpolation-mode: bicubic; }

/* Windows 10 Mail underlines links despite inline CSS. */
a { text-decoration: none; }

/* iOS and Gmail auto-detect dates, addresses and phone numbers and style them
   as blue links. You cannot remove the link — you can make it look like body text. */
a[x-apple-data-detectors],       /* iOS         */
.unstyle-auto-detected-links a,  /* opt-in hook */
.aBn {                           /* Gmail       */
  border-bottom: 0 !important; cursor: default !important; color: inherit !important;
  text-decoration: none !important; font-size: inherit !important; font-family: inherit !important;
  font-weight: inherit !important; line-height: inherit !important;
}

/* Gmail overlays a download button on large, unlinked images. */
.a6S { display: none !important; opacity: 0.01 !important; }
/* Fallback if .a6S doesn't take: tag the image .g-img and hide the injected sibling div. */
img.g-img + div { display: none !important; }

/* Gmail recolours text inside a conversation thread. */
.im { color: inherit !important; }

/* Gmail iOS app leaves a right-hand gutter. Force a per-device minimum container width.
   Add one block per viewport you need to support. */
@media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
  u ~ div .email-container { min-width: 320px !important; }
}
@media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
  u ~ div .email-container { min-width: 375px !important; }
}
@media only screen and (min-device-width: 414px) {
  u ~ div .email-container { min-width: 414px !important; }
}
```

### 1.1 ⚠️ `table-layout: fixed !important` — do not adopt globally

Cerberus applies it to every table. **We must not.**

`table-layout: fixed` makes the widths in the *first row* authoritative and stops the browser sizing
columns from content. Two of our patterns depend on intrinsic sizing:

- **Shrink-to-fit price badges** (Campaign `§6.17`): a `<table>` with **no** `width` attribute that
  collapses to its content. Under `table-layout:fixed` with no declared width the behaviour is
  undefined and client-dependent — the exact fragility that rule exists to eliminate.
- **Centred odd last card** (Campaign `§6.9`): a nested `align="center"` table at a fixed pixel width
  inside a `colspan` cell.

**Rule:** adopt every reset rule above **except** `table-layout: fixed`. If a specific table ever
needs it, set it on that table inline — never globally, never with `!important`.

### 1.2 The `u ~ div` selector

`u ~ div .email-container` is a Gmail-iOS-only hook. Gmail's iOS app injects a `<u>` element into the
DOM ahead of the message body; no other client does. `u ~ div` therefore matches only there. It is
harmless everywhere else. **Adopt as-is.**

---

## 2. Ghost tables (MSO conditional structure)

**The problem:** Outlook 2007–2021 on Windows renders with the **Microsoft Word** engine. It does not
support `max-width`, `min-width`, `display:inline-block`, or media queries.

**The technique:** wrap modern markup in conditional comments that only Outlook reads, giving it a
real, old-fashioned, fixed-width table while every other client sees the fluid version.

```html
<!--[if mso]>
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" align="center">
<tr>
<td>
<![endif]-->

  <div style="max-width: 600px; margin: 0 auto;" class="email-container">
    … fluid content every other client sees …
  </div>

<!--[if mso]>
</td>
</tr>
</table>
<![endif]-->
```

Outlook sees `<table width="600"><tr><td>` + content + `</td></tr></table>` and ignores the `<div>`
styling entirely. Everyone else sees the comments as comments.

### Conditional targeting syntax

| Target | Syntax |
|--------|--------|
| All Windows Outlook | `<!--[if mso]> … <![endif]-->` |
| Outlook 2007 | `<!--[if mso 12]> … <![endif]-->` |
| Outlook 2010 | `<!--[if mso 14]> … <![endif]-->` |
| Outlook 2013 | `<!--[if mso 15]> … <![endif]-->` |
| Outlook 2016+ | `<!--[if mso 16]> … <![endif]-->` |
| Outlook 2010 **and above** | `<!--[if gte mso 14]> … <![endif]-->` |
| Below Outlook 2010 | `<!--[if lt mso 14]> … <![endif]-->` |
| 2007 **or** 2016 | `<!--[if (mso 12)\|(mso 16)]> … <![endif]-->` |
| **Everything except** Outlook | `<!--[if !mso]><!--> … <!--<![endif]-->` |

Note the asymmetry in the last row: the "not mso" form uses `<!--[if !mso]><!-->` … `<!--<![endif]-->`
so that non-Outlook clients see the inner content as ordinary markup while Outlook sees it as a
comment. Getting these delimiters wrong silently hides content from everyone.

**Our rules already require ghost tables** (Campaign `§6.16`, Flow `§8.4`) and require keeping
`[if mso]` conditionals when stripping comments (Campaign `§8.3` — they are *functional*, not
descriptive).

---

## 3. Hybrid stacking without media queries

The centrepiece technique. Full walkthrough in [Analysis §2.3](Cerberus-Analysis.md).

```html
<td align="center" valign="top" style="font-size:0; padding:10px;">
  <!--[if mso]><table role="presentation" border="0" cellspacing="0" cellpadding="0" width="660"><tr><td valign="top" width="330"><![endif]-->
  <div class="stack-column" style="display:inline-block; margin:0 -1px; width:100%; min-width:200px; max-width:330px; vertical-align:top;">
    …column 1…
  </div>
  <!--[if mso]></td><td valign="top" width="330"><![endif]-->
  <div class="stack-column" style="display:inline-block; margin:0 -1px; width:100%; min-width:200px; max-width:330px; vertical-align:top;">
    …column 2…
  </div>
  <!--[if mso]></td></tr></table><![endif]-->
</td>
```

### The four numbers that must reconcile

For an *N*-column hybrid row inside container width `C` with parent cell padding `P`:

```
inner width      I = C − 2P
column max-width M = I / N              (round DOWN; leftover pixels are absorbed by margin:0 -1px)
column min-width m = choose so that (N × m) > I is FALSE but ((N−1) × m) fits
                     → in practice m ≈ 0.6 × M for a 2-col, ≈ 0.72 × M for 3-col
ghost table      G = I  and each ghost <td> = M
```

Cerberus's own numbers, 680px container, 10px cell padding, 2 columns:
`I = 660`, `M = 330`, `m = 200`, ghost `width="660"` with two `width="330"` cells. For 3 columns:
`M = 220`, `m = 160`.

**At our 600px container with 10px padding:** `I = 580`, 2-col `M = 290`, `m ≈ 175`; 3-col
`M = 193`, `m ≈ 140`. Ghost table `width="580"`.

### Why each supporting property is mandatory

| Property | Remove it and… |
|----------|----------------|
| `font-size:0` on the parent `<td>` | a ~4px whitespace gap appears between columns (the newline in your source becomes a rendered space) |
| `margin: 0 -1px` | sub-pixel rounding at some widths makes column 2 wrap one step early |
| `vertical-align:top` | short and tall columns baseline-align instead of top-aligning |
| `width:100%` | a wrapped column doesn't expand to fill the row |
| `min-width` | columns never wrap — they just squeeze |
| the ghost table | Outlook renders each `<div>` at 100% width, stacking everything |

**Restore the font size inside each column** — the `font-size:0` is inherited. Every text `<td>`
within a hybrid column must declare its own `font-size`.

---

## 4. Full-bleed background sections

A coloured band that spans the full viewport width while its content stays constrained to the email
width. The structure: background table **outside** the container, content re-constrained **inside**.

```html
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
       bgcolor="#709f2b" style="width:100%; background-color:#709f2b;" class="darkmode-fullbleed-bg">
  <tr>
    <td bgcolor="#709f2b" style="background-color:#709f2b;">
      <div align="center" style="max-width:600px; margin:auto;" class="email-container">
        <!--[if mso]><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" align="center"><tr><td><![endif]-->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="width:100%;">
          <tr><td style="padding:20px; font-family:Arial,sans-serif; font-size:15px; line-height:20px; color:#ffffff;">
            <p style="margin:0;">Content stays 600px wide; the colour runs edge to edge.</p>
          </td></tr>
        </table>
        <!--[if mso]></td></tr></table><![endif]-->
      </div>
    </td>
  </tr>
</table>
```

**Our hardening (Campaign `§6.16`):** Cerberus sets the colour via inline `style` only. We add the
`bgcolor` **attribute** on both the `<table>` *and* the `<td>`, because Gmail's mobile apps drop CSS
`background` on tables and cells but honour the attribute. Both values must be the identical hex so
desktop rendering is byte-identical.

---

## 5. `dir="rtl"` — swapping column order without duplicating markup

**New to us and genuinely useful.** For alternating image-left / image-right rows, most templates
duplicate the whole block with the columns reordered. Cerberus instead writes the markup **once** and
flips it with the HTML `dir` attribute.

```html
<!-- Thumbnail LEFT, text right -->
<td dir="ltr" width="100%"> …image column… …text column… </td>

<!-- Thumbnail RIGHT, text left — identical source order, reversed rendering -->
<td dir="rtl" width="100%"> …image column… …text column… </td>
```

Each inner column then resets itself with `dir="ltr"` so its *content* still reads left-to-right:

```html
<th width="33.33%" class="stack-column-center">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr><td dir="ltr" valign="top" style="padding:0 10px;"> … </td></tr>
  </table>
</th>
```

And the mobile stack rule resets direction so the stack order stays natural:

```css
.stack-column, .stack-column-center {
  display: block !important; width: 100% !important;
  max-width: 100% !important; direction: ltr !important;   /* ← the reset */
}
```

**The payoff:** source order — and therefore **mobile stack order and screen-reader order** — stays
image-then-text in both variants, while desktop alternates. Without `direction:ltr` in the stack rule
the right-thumbnail row stacks text-above-image on mobile.

**Where we'd use it:** alternating feature rows in Brand Story, Educational and Post Purchase flows.

---

## 6. Bulletproof buttons

A background-filled, rounded, tappable button that survives Outlook. Cerberus's version:

```html
<table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:auto;">
  <tr>
    <td class="button-td button-td-primary" style="border-radius:4px; background:#222222;">
      <a class="button-a button-a-primary" href="https://example.com/"
         style="background:#222222; border:1px solid #000000; font-family:sans-serif; font-size:15px;
                line-height:15px; text-decoration:none; padding:13px 17px; color:#ffffff;
                display:block; border-radius:4px;">Primary Button</a>
    </td>
  </tr>
</table>
```

**Why the styles are duplicated on the `<td>` and the `<a>`** — Cerberus is explicit about this:
Desktop Outlook and Office 365 on Windows **do not treat links as block-level elements**, so the
anchor's `padding` and `background` are ignored. Styling the `<td>` to match reproduces the button
shape there; the `<a>` styling produces it everywhere else. The whole cell becomes the click target
in Outlook, the anchor is the click target elsewhere.

The `.button-td` / `.button-a` classes exist purely as `:hover` and dark-mode hooks:

```css
.button-td, .button-a { transition: all 100ms ease-in; }
.button-td-primary:hover, .button-a-primary:hover { background:#555555 !important; border-color:#555555 !important; }
@media (prefers-color-scheme: dark) {
  td.button-td-primary, td.button-td-primary a { background:#ffffff !important; border-color:#ffffff !important; color:#222222 !important; }
}
```

### Three clarifications for our systems

1. **`display:block` on this anchor is correct and safe.** Our Campaign `§6.6` / Flow `§8.2`
   prohibition is specifically on `display:block` on an anchor that **wraps an image** — Apple Mail
   iOS resolves the block height before the image decodes and collapses it to zero. A **text**
   anchor has no decode step and no such failure mode. The two rules do not conflict.
2. **This pattern is a text CTA, not a price badge.** For a background-filled badge that must stay
   content-width on Gmail mobile, use the shrink-to-fit table (Campaign `§6.17`) — the Gmail mobile
   app coerces filled `inline-block`/`block` anchors toward full width. Cerberus's button is centred
   in its own table so it happens to be content-width already; our badge rule makes that explicit and
   removes the anchor's role in sizing entirely.
3. **Add VML for a true rounded button in Outlook.** Cerberus's `<td>` fallback gives Outlook a
   **square** button. Where a brand's radius matters, our `Components/CTA.html` VML `roundrect`
   pattern is the stronger option. See `Components/BulletproofButton.html` in this folder for the
   combined version.

---

## 7. Images

### 7.1 Responsive image

```html
<img src="https://cdn.example.com/hero@2x.jpg" width="600" height="300" alt="Descriptive text"
     border="0" class="g-img"
     style="width:100%; max-width:600px; height:auto; display:block; margin:auto;
            background:#dddddd; font-family:sans-serif; font-size:15px; line-height:15px; color:#555555;">
```

| Attribute / property | Why |
|---|---|
| `src` absolute `https://` | Relative and `localhost` paths never resolve in a mail client |
| `width` / `height` **attributes** | Reserve the box before decode — Apple Mail iOS drops images without them (our `§6.6`) |
| `border="0"` | Kills the blue outline on linked images in older clients |
| `alt` | Always present; `alt=""` when purely decorative |
| `width:100%` | Scales down inside a narrow container |
| `max-width:600px` | Never scales *above* its intended size |
| `height:auto` | Preserves aspect ratio as it scales |
| `display:block` | Removes the ~4px inline baseline gap beneath the image |
| `background:#dddddd` + font styles | Styles the **alt-text box** shown when images are blocked — an under-used accessibility touch |
| `class="g-img"` | Suppresses Gmail's download-button overlay on large images |

### 7.2 Static (non-scaling) image

```html
<img src="https://cdn.example.com/icon@2x.png" width="128" height="128" alt="" border="0" style="display:block;">
```

### 7.3 @2x rule

Since SVG is unusable in email, render raster at **twice** the display size and scale it down with
the HTML attributes: a 40×40 PNG coded `width="20" height="20"` is crisp on high-DPI screens.
Our Flow `§9.4` already routes this through the BigCommerce `images/stencil/<W>x<H>/` CDN.

### 7.4 Never SVG

`image/svg+xml` in an `<img>` does not render in Gmail (web, Android, iOS), any Outlook, or Yahoo.
Already codified in Flow `§9.4`; Cerberus states it as a first principle.

---

## 8. Background images with VML

The only reliable way to layer HTML text over an image in email. It must be declared **twice** —
once in CSS for modern clients, once in VML for Word-engine Outlook.

```html
<td valign="middle" style="text-align:center; background-color:#222222;
    background-image:url('https://cdn.example.com/band.jpg');
    background-position:center center !important; background-size:cover !important;">

  <!--[if gte mso 9]>
  <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false"
          style="width:600px; height:175px; background-position:center center !important;">
  <v:fill type="tile" src="https://cdn.example.com/band.jpg" color="#222222" />
  <v:textbox inset="0,0,0,0">
  <![endif]-->

  <div>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr><td valign="middle" style="text-align:center; padding:40px; font-family:Arial,sans-serif;
              font-size:15px; line-height:20px; color:#ffffff;">
        <p style="margin:0;">Text layered over the image.</p>
      </td></tr>
    </table>
  </div>

  <!--[if gte mso 9]>
  </v:textbox>
  </v:rect>
  <![endif]-->
</td>
```

**Requirements:**

- `xmlns:v="urn:schemas-microsoft-com:vml"` must be declared on `<html>` (Cerberus also repeats it on
  the `<v:rect>` defensively).
- **`background-color` is mandatory**, not optional — it is what keeps the overlaid text legible when
  the image is blocked or fails. This is the accessibility argument *for* background images over
  foreground images.
- **VML ignores padding.** The `width`/`height` on `<v:rect>` must be the full container box.
- **Outlook cannot scale a background image** — supply the VML `src` at **@1x**. Other clients scale
  fine, so the CSS `background-image` can be @2x. Cerberus notes this explicitly.

The hybrid template uses a `v:image` + `v:rect` + `v:fill opacity="0%"` variant for a **cover-fit**
background; the responsive template uses the simpler `v:rect` + `v:fill type="tile"` shown above.

**Interaction with our rules:** Campaign `§6.15` requires the hero to be a single embedded artwork in
one anchor, with copy baked into the image — so this technique is **not** for RDD/SS/SC/Stack hero
banners. It is for *secondary* bands, and it is the right tool in the **Flow** system, where
`§8.5` requires the opposite ("keep personalised, dynamic and offer copy in HTML, not baked into the
artwork") — a flow hero that must carry `{{ first_name }}` over artwork is exactly this pattern.

---

## 9. Dark mode

### 9.1 Declaration

```html
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
```
```css
:root { color-scheme: light dark; supported-color-schemes: light dark; }
```

Both the meta tags and the CSS — clients differ in which they read.

### 9.2 Utility-class pattern

Cerberus does not restyle elements directly; it defines **immutable utility classes** in the `<head>`
and applies them to markup, with `!important` so they beat the inline styles.

```css
@media (prefers-color-scheme: dark) {
  .email-bg              { background: #111111 !important; }
  .darkmode-bg           { background: #222222 !important; }
  h1, h2, h3, p, li,
  .darkmode-text,
  .email-container a:not([class]) { color: #F7F7F9 !important; }
  td.button-td-primary,
  td.button-td-primary a { background:#ffffff !important; border-color:#ffffff !important; color:#222222 !important; }
  .footer td             { color: #aaaaaa !important; }
  .darkmode-fullbleed-bg { background-color: #0F3016 !important; }
}
```

```html
<td style="background-color:#ffffff;" class="darkmode-bg"> … </td>
```

The `a:not([class])` selector is neat: it recolours *body* links in dark mode while leaving classed
elements (buttons) to their own rules.

**We already run this pattern**, and we extend it with `[data-ogsc]` selectors for Outlook.com, which
Cerberus does not cover.

### 9.3 Light/dark image swap

Raster images cannot be recoloured, so ship both and toggle:

```css
@media (prefers-color-scheme: dark) {
  .display-only-in-dark-mode  { display: inline-block !important; }
  .display-only-in-light-mode { display: none !important; }
}
```
```html
<img src="logo-light-mode.png" class="display-only-in-light-mode" alt="Brand">
<!--[if !mso]><!-->
<img src="logo-dark-mode.png" class="display-only-in-dark-mode" alt="Brand">
<!--<![endif]-->
```

**The `[if !mso]` guard is the critical part.** Outlook supports neither `prefers-color-scheme` nor
the display toggle, so without the guard it renders **both** logos stacked. Cerberus is candid that
this means Outlook simply cannot swap — it gets the light logo, permanently.

**Our position:** we already require a light/dark logo swap where the brand supplies both, and RDD
additionally uses a `keep-light` strategy (forcing white sections to stay light because its logo is a
JPEG on flat white and product photography is shot on white). RDD's approach is a valid third option
Cerberus doesn't document, and it stays.

---

## 10. Spacers

`padding` on `<td>` and `margin` on typography cover most spacing. Neither works reliably **between
tables or rows**. For that, a sized spacer row:

```html
<tr>
  <td aria-hidden="true" height="40" style="font-size:0px; line-height:0px;">&nbsp;</td>
</tr>
```

| Part | Why it is mandatory |
|------|---------------------|
| `height="40"` **attribute** | The sizing primitive Outlook honours |
| `&nbsp;` | Some clients collapse a cell with no content to zero height |
| `font-size:0; line-height:0` | Otherwise the `&nbsp;`'s own font metrics add unwanted height on top of the 40px |
| `aria-hidden="true"` | Stops a screen reader announcing the non-breaking space |

**This is *not* the "empty `<td>`" our ghost-element inspections ban.** Campaign `§8.2` and Flow
`§9.2` forbid `<td></td>` — a cell with **no height, no content and no purpose**. A cell with an
explicit height, real content and `aria-hidden` is a deliberate, sized structural element. Flow
`§8.3` already draws this distinction in exactly these terms. Cerberus's spec is the canonical
version of it — adopt the `aria-hidden` attribute, which our current spacers omit.

Also add `mso-line-height-rule: exactly` to the style so Outlook honours the zeroed line-height.

---

## 11. Preheader / preview text

```html
<!-- Visually hidden preheader -->
<div style="max-height:0; overflow:hidden; mso-hide:all;" aria-hidden="true">
  Text shown in the inbox preview but not the email body.
</div>

<!-- Preview-text spacing hack -->
<div style="display:none; font-size:1px; line-height:1px; max-height:0px; max-width:0px;
            opacity:0; overflow:hidden; mso-hide:all; font-family:sans-serif;">
  &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;…
</div>
```

The first block is the preheader. The second pads the inbox preview with invisible characters so the
client doesn't pull the first line of body copy in after it.

**We adopt the first and reject the second** (Campaign `§8.3`): the `&zwnj;&nbsp;` run adds bulk
toward Gmail's ~102 KB clip threshold and matches the ghost-node patterns our inspection flags. A
single well-written preheader line at the right length achieves the same result without the run.

Cerberus notes that an *extended* preheader (~490 characters) is better UX for screen-reader and
voice-assistant users, which is a fair point — but it argues for a **longer real preheader**, not for
invisible padding characters.

---

## 12. Web fonts

```html
<!--[if mso]>
<style> * { font-family: sans-serif !important; } </style>
<![endif]-->

<!--[if !mso]><!-->
<link href="https://fonts.googleapis.com/css2?family=Lobster&display=swap" rel="stylesheet" type="text/css">
<!--<![endif]-->
```

Then reference the web font **first** in the stack with an email-safe fallback behind it:
`font-family: 'Lobster', Arial, Helvetica, sans-serif;`

Windows Outlook chokes on web-font references and falls back to **Times New Roman** for the whole
document — hence the forced `sans-serif !important` inside `[if mso]`.

**Our position is unchanged** (`Shared/Fonts/font-stacks.md`): treat the brand face as enhancement
over the email-safe stack, and never let a component hardcode a family. Cerberus's MSO guard is the
correct implementation *if* a brand ever ships a web font.

---

## 13. Typography rules

| Rule | Reason |
|------|--------|
| Semantic `<h1>`–`<h3>`, `<p>`, `<ul>`, `<ol>`, `<strong>`, `<em>` | Screen readers navigate by them |
| **Zero out default margins inline** — `<p style="margin:0;">` | Client defaults vary wildly |
| **Use `margin` for typography, `padding` for cells** | Margin is well supported on text elements, unreliable on tables |
| List indent via `margin-left` on the `<li>`, not `padding` on the `<ul>` | Cerberus: `<ul style="padding:0; margin:0 0 10px 0;">` + `<li style="margin:0 0 10px 30px;">` |
| **Restate `font-family`, `font-size`, `line-height`, `color` on every text `<td>`** | Some Outlook versions reset inherited font properties when tables nest |
| `&nbsp;` to prevent typographic widows | `Praesent laoreet malesuada&nbsp;cursus.` |
| Six-digit hex only | `#ffffff`, never `#fff` or `rgb()` — three-digit hex fails in some clients and in HTML attributes |

---

## 14. Accessibility techniques

| Technique | Implementation |
|-----------|----------------|
| Announce the message as an article | `<center role="article" aria-roledescription="email" lang="en">` |
| Skip layout tables in screen readers | `role="presentation"` on **every** layout table |
| Hide decoration from screen readers | `aria-hidden="true"` on spacers, rules, decorative marks |
| Describe every image | `alt="…"` always present; `alt=""` when purely decorative. An image with **no** `alt` attribute is read as its filename — "icon dash checkmark dot png" |
| Meaningful link text | Avoid "Click Here" / "Learn More" — bad for screen readers, dictation, and spam scoring |
| Plain-text alternative | Ships with every email; better for magnifiers, text-resizing and non-HTML clients |
| Language | `lang="en"` on `<html>` and on the wrapper |

---

## 15. Quick technique index

| Need | Technique | §  |
|------|-----------|----|
| Layout stacks without CSS support | Hybrid `inline-block` + ghost table | 3 |
| Outlook fixed width | MSO ghost table | 2 |
| Alternate image left/right, one markup block | `dir="rtl"` + `direction:ltr` reset | 5 |
| Colour band edge-to-edge, content constrained | Full-bleed background section | 4 |
| Rounded filled button in Outlook | `<td>`-styled button + VML `roundrect` | 6 |
| Text over an image | CSS `background-image` + VML `v:rect`/`v:fill`/`v:textbox` | 8 |
| Image scales on mobile | `width:100%; max-width:Npx; height:auto; display:block` + `width`/`height` attrs | 7 |
| Space between tables/rows | Sized spacer `<td>` with `&nbsp;` + `aria-hidden` | 10 |
| Dark mode | `prefers-color-scheme` utility classes + `[data-ogsc]` | 9 |
| Gmail download-button overlay | `.a6S` + `img.g-img + div` | 1 |
| Gmail iOS right gutter | `u ~ div .email-container { min-width }` | 1 |
| iOS auto-linked addresses | `a[x-apple-data-detectors]` + `.unstyle-auto-detected-links` | 1 |

---

_Techniques reference for Cerberus `fa6de2e` · 2026-07-28._
