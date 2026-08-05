# Cerberus — Component Breakdown

> Every content block Cerberus ships, what it is made of, and how it maps to our production
> component libraries.
> Companion to [Analysis](Cerberus-Analysis.md) · [Techniques](Cerberus-Techniques.md) ·
> [Best Practices](Cerberus-Best-Practices.md) · [Compatibility](Cerberus-Compatibility.md)

---

## 1. Cerberus's component inventory

Cerberus's templates are built from clearly delimited blocks, each fenced with
`<!-- Block Name : BEGIN -->` / `<!-- Block Name : END -->`. That comment convention is itself worth
keeping — it makes blocks copy-pasteable and makes a diff readable.

| Cerberus block | Fluid | Responsive | Hybrid |
|----------------|:-----:|:----------:|:------:|
| Visually Hidden Preheader | ✔ | ✔ | ✔ |
| Preview Text Spacing Hack | ✔ | ✔ | ✔ |
| Email Header (logo) | ✔ | ✔ | ✔ |
| Hero Image, Flush | ✔ | ✔ | ✔ |
| 1 Column Text + Button | ✔ | ✔ | ✔ |
| Background Image with Text | — | ✔ | ✔ |
| 2 Even Columns | ✔ | ✔ | ✔ |
| 3 Even Columns | — | ✔ | ✔ |
| Thumbnail Left, Text Right | — | ✔ | ✔ |
| Thumbnail Right, Text Left | — | ✔ | ✔ |
| Clear Spacer | ✔ | ✔ | ✔ |
| 1 Column Text | ✔ | ✔ | ✔ |
| Button (nested, reusable) | ✔ | ✔ | ✔ |
| Email Footer | ✔ | ✔ | ✔ |
| Full Bleed Background Section | ✔ | ✔ | ✔ |

Note what is **absent**: there is no product card, no product grid, no price badge, no coupon block,
no trust strip. **Cerberus is a layout-pattern library, not an ecommerce component library.** Our
`Components/` directories cover ecommerce; Cerberus covers the substrate they sit on.

---

## 2. Block-by-block

### 2.1 Email Header

```html
<tr>
  <td style="padding: 20px 0; text-align: center">
    <img src="…logo.png" width="200" height="50" alt="Brand Name" border="0"
         style="height:auto; background:#dddddd; font-family:sans-serif; font-size:15px;
                line-height:15px; color:#555555;">
  </td>
</tr>
```

Minimal by design. Two details worth noting: the logo is **not linked** in Cerberus (we always link
ours to the homepage), and the `background` + font properties on the `<img>` style the **alt-text
box** shown when images are blocked.

**Maps to:** Campaign `Components/header.html` · Flow `Design.md > Header`. Ours are richer
(light/dark logo swap, alignment rules per brand — Campaign `§6.1`). No change needed; **do add** the
alt-box styling, which we currently omit.

---

### 2.2 Hero Image, Flush

```html
<tr>
  <td style="background-color:#ffffff;" class="darkmode-bg">
    <img src="…hero@2x.jpg" width="600" height="" alt="…" border="0" class="g-img"
         style="width:100%; max-width:600px; height:auto; background:#dddddd;
                font-family:sans-serif; font-size:15px; line-height:15px; color:#555555;
                margin:auto; display:block;">
  </td>
</tr>
```

Edge-to-edge because the `<td>` carries no padding and the `<img>` is `display:block`.

**Three gaps against our standard** (Campaign `§6.14`, Flow `§8.5`):

| Cerberus | Ours | Why |
|----------|------|-----|
| `height=""` (empty attribute) | Real pixel `height` | Apple Mail iOS needs a box to reserve or it drops the image (Campaign `§6.6`) |
| No `font-size:0; line-height:0` on the `<td>` | Required | Kills the image baseline gap — the thin white strip under a hero (Campaign `§6.14`) |
| Not wrapped in an anchor | One inline `<a>` around the `<img>` | Our heroes are clickable (Campaign `§6.15`) |

Our hero standard is **stricter** than Cerberus's and stays as-is. See
`Components/Hero.html` in this folder for the reconciled version.

---

### 2.3 1 Column Text + Button

Two stacked rows: a text `<td>` with `padding:20px` and full font properties restated, then a button
row. Demonstrates the two typography rules cleanly — `<h1 style="margin: 0 0 10px 0;">` and
`<p style="margin: 0;">` zero out client defaults, and every font property is restated on the `<td>`
rather than inherited.

**Maps to:** Campaign `Components/hero.html` + `intro.html` + `CTA.html`.

---

### 2.4 Button

Covered in full at [Techniques §6](Cerberus-Techniques.md). The essentials:

- A **shrink-to-fit `<table>`** with no `width` attribute, `align="center"`, `margin:auto`.
- Fill + radius on the `<td>` **and** on the `<a>` — Outlook ignores block styling on anchors.
- `.button-td` / `.button-a` classes as `:hover` and dark-mode hooks only.

**This independently arrives at the same structure our Campaign `§6.17` price-badge rule mandates** —
a content-width table with the fill on the cell. Cerberus reached it for Outlook reasons; we reached
it because the Gmail mobile app stretches filled inline-block anchors. Same answer, two different
bugs. That convergence is strong evidence the pattern is correct.

**Maps to:** Campaign `Components/CTA.html`, `CTA-secondary.html`, and the price badge inside
`product-card.html`. Our CTA adds VML `roundrect` so Outlook gets true rounded corners rather than
Cerberus's square fallback.

---

### 2.5 Background Image with Text

Covered at [Techniques §8](Cerberus-Techniques.md). Two variants ship:

- **Responsive template** — `v:rect` + `v:fill type="tile"` + `v:textbox`. Simpler; tiles the image.
- **Hybrid template** — `v:image` + `v:rect` + `v:fill opacity="0%"`, with an inner MSO ghost table
  constraining the text to 500px. Gives a cover-fit result and finer text control in Outlook.

**We have no equivalent component.** Worth adding to the Flow system specifically, where `§8.5`
requires personalised and offer copy to stay in HTML rather than baked into artwork — a flow hero
carrying `{{ first_name }}` over a photograph is exactly this pattern. Reference version:
`Components/VML.html`.

---

### 2.6 2 Even Columns — three implementations

This is the clearest illustration of the fluid / responsive / hybrid difference. **Same visual
result, three mechanisms.**

**Fluid** — never stacks, just narrows:
```html
<td valign="top" width="50%"> …column… </td>
<td valign="top" width="50%"> …column… </td>
```

**Responsive** — `<th>` cells stacked by a media query:
```html
<th valign="top" width="50%" class="stack-column-center"> …column… </th>
<th valign="top" width="50%" class="stack-column-center"> …column… </th>
```

**Hybrid** — `inline-block` divs that wrap on their own, with an Outlook ghost table:
```html
<!--[if mso]><table width="660"><tr><td valign="top" width="330"><![endif]-->
<div class="stack-column" style="display:inline-block; margin:0 -1px; width:100%; min-width:200px; max-width:330px; vertical-align:top;"> …column… </div>
<!--[if mso]></td><td valign="top" width="330"><![endif]-->
<div class="stack-column" style="display:inline-block; margin:0 -1px; width:100%; min-width:200px; max-width:330px; vertical-align:top;"> …column… </div>
<!--[if mso]></td></tr></table><![endif]-->
```

**For our product grids: hybrid.** A 2-column product grid that fails to stack is unusable, and the
`<head>`-CSS-stripping clients are exactly where a media-query-only grid fails.

**Maps to:** Campaign `Components/product-grid.html` · Flow `Design.md > Product Grid`. Note that our
grid carries requirements Cerberus's simple column pair does not:

- **Equal card height via fixed-height `<td>` regions** (Campaign `§6.8`) — not in Cerberus at all.
- **Centred odd last card via `colspan`** (Campaign `§6.9`) — not in Cerberus.
- **Three sibling anchors per card** (Campaign `§6.6`) — not in Cerberus.

Those are ours and they stay. What Cerberus improves is the **stacking mechanism underneath them**.

---

### 2.7 3 Even Columns

Same three mechanisms; hybrid uses `max-width:220px; min-width:160px` inside a 660px ghost table.
Useful for trust strips and feature-icon rows.

**Maps to:** Campaign `Components/trust-strip.html` (currently 4-up → 2×2).

---

### 2.8 Thumbnail Left / Right

The `dir="rtl"` order-swap. Covered at [Techniques §5](Cerberus-Techniques.md).

**No equivalent in either of our libraries.** Recommended addition for Brand Story, Educational and
Post Purchase layouts. Reference version: `Components/TwoColumn.html`.

---

### 2.9 Clear Spacer

```html
<tr><td aria-hidden="true" height="40" style="font-size:0px; line-height:0px;">&nbsp;</td></tr>
```

Covered at [Techniques §10](Cerberus-Techniques.md). We have this pattern; **we are missing the
`aria-hidden="true"`**. Add it. Also add `mso-line-height-rule:exactly` so Outlook honours the zeroed
line-height.

---

### 2.10 Email Footer

```html
<table align="center" role="presentation" … class="footer">
  <tr><td style="padding:20px; font-family:sans-serif; font-size:12px; line-height:15px;
                 text-align:center; color:#ffffff;">
    <webversion style="…">View as a Web Page</webversion>
    <br><br>
    Company Name<br>
    <span class="unstyle-auto-detected-links">123 Fake Street, Springfield, OR, 97477 US<br>(123) 456-7890</span>
    <br><br>
    <unsubscribe style="…">unsubscribe</unsubscribe>
  </td></tr>
</table>
```

**⚠️ Two things here must not be copied.**

1. **`<webversion>` and `<unsubscribe>` are Campaign Monitor tags.** In Klaviyo they render as
   unknown elements — visible text with no link. Use `{% unsubscribe_link %}` and
   `{% manage_preferences_link %}` inside a real `<a href="…">`, per Flow `§8.7`.
2. Flow `§8.7` additionally forbids any tag that **emits HTML** from appearing inside an attribute.
   `{% unsubscribe %}` returns a complete `<a>` element, so `href="{% unsubscribe %}"` produces an
   anchor nested inside an `href` and dumps raw attribute text on screen. Only URL-returning tags go
   in an `href`. That rule exists because it happened to us.

**What *is* worth taking:** `class="unstyle-auto-detected-links"` on the address block. iOS and Gmail
auto-link postal addresses and phone numbers and render them as blue links; this neutralises the
styling. **Every one of our footers carries a postal address and none of them has this class.**
Straightforward improvement.

---

### 2.11 Full Bleed Background Section

Covered at [Techniques §4](Cerberus-Techniques.md). Cleaner than our current approach; adopt the
structure and add our `bgcolor`-attribute hardening.

---

## 3. Mapping table — Cerberus → our two libraries

| Cerberus block | Campaign System | Flow System | Gap to close |
|---|---|---|---|
| Email Header | `Components/header.html` | `Design.md > Header` | Add alt-text-box styling on the logo `<img>` |
| Hero Image, Flush | `Components/hero-image.html` | `Design.md > Hero` | Ours is stricter — no change |
| 1 Column Text + Button | `hero.html` + `intro.html` + `CTA.html` | `Design.md > Hero`, `> CTA Style` | — |
| Button | `CTA.html`, `CTA-secondary.html` | `Design.md > Buttons` | Ours adds VML — keep |
| Background Image with Text | *(none)* | *(none)* | **Add** — see `Components/VML.html` |
| 2 Even Columns | `product-grid.html` | `Design.md > Product Grid` | **Migrate stacking to hybrid** |
| 3 Even Columns | `trust-strip.html` | `Design.md > Trust Indicator` | Optionally hybridise |
| Thumbnail Left/Right | *(none)* | *(none)* | **Add** — see `Components/TwoColumn.html` |
| Clear Spacer | inline in templates | inline in templates | **Add `aria-hidden`** |
| Footer | `Components/footer.html` | `Design.md > Footer` | **Add `unstyle-auto-detected-links`** |
| Full Bleed Background | inline in templates | inline in templates | Adopt the structure |
| Preheader | `Shared/Snippets/preheader.html` | inline | Keep ours (no `&zwnj;` run) |
| *(no equivalent)* | `product-card.html` | `Design.md > Product Cards` | Ours — Cerberus has none |
| *(no equivalent)* | `coupon.html`, `announcement.html` | `Design.md > Offer` | Ours |
| *(no equivalent)* | `category-pills.html` | `Design.md > Navigation` | Ours |
| *(no equivalent)* | `section-heading.html` | — | Ours |

---

## 4. The reference library in `Components/`

Thirteen brand-neutral reference components, extracted from Cerberus and hardened with our production
lessons. **Reference only** — they are not wired into any build.

| File | Source | Hardening applied |
|------|--------|-------------------|
| `Header.html` | Cerberus Email Header | Linked logo, light/dark swap, alt-box styling |
| `Hero.html` | Hero Image, Flush | Real `height` attr, `font-size:0` cell, one inline anchor |
| `CTA.html` | Button | Shrink-to-fit table, `.tap` ≥44px |
| `BulletproofButton.html` | Button + VML | VML `roundrect` for true Outlook radius |
| `ProductGrid.html` | 2 Even Columns | Hybrid stacking + fixed-height cells + 3 sibling anchors + centred odd card |
| `TwoColumn.html` | Thumbnail Left/Right | `dir` swap + `direction:ltr` stack reset |
| `ThreeColumn.html` | 3 Even Columns | Hybrid stacking, mobile stack |
| `Divider.html` | *(derived)* | Sized rule cell, `aria-hidden` |
| `Spacer.html` | Clear Spacer | `aria-hidden` + `mso-line-height-rule` |
| `Footer.html` | Email Footer | Klaviyo compliance tags, `unstyle-auto-detected-links` |
| `VML.html` | Background Image with Text | Both `v:rect` and `v:image` variants documented |
| `GhostTable.html` | MSO conditionals | Every ghost-table shape in one file |
| `ResponsiveUtilities.html` | CSS reset + media queries | Full reset **minus** `table-layout:fixed` |

Every file opens with the same header-comment format our `Components/README.md` mandates
(Component / Purpose / Source / Required inputs / Optional inputs / Fallback / Dependencies), so the
reference library reads the same way as the production one.

---

_Component breakdown for Cerberus `fa6de2e` · 2026-07-28._
