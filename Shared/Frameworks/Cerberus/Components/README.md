# Cerberus Reference Components

**Reference only.** These 13 components are extracted from Cerberus and hardened with the defects
our own production history has already taught us. They are **not** wired into any build.

Production markup remains where it is:

| System | Production components |
|--------|----------------------|
| Klaviyo **Campaign** Email System | `Components/*.html` + `Shared/Snippets/base-head.html` |
| Klaviyo **Flow** Email System | the brand's `Design.md` component set |

Use this folder to **check** a production component against the canonical pattern, and to build
anything we do not yet have (`TwoColumn.html`, `VML.html`, `ThreeColumn.html`).

---

## The library

| File | What it is | Read it when |
|------|-----------|--------------|
| **`ResponsiveUtilities.html`** | The complete `<head>` — meta, MSO settings, web-font guard, CSS reset, responsive utilities, dark mode | Starting any template; auditing `base-head.html` |
| **`GhostTable.html`** | All 8 MSO conditional shapes in one file, with the hybrid column maths | Building any multi-column row; fixing Outlook |
| `Header.html` | Logo bar, light/dark swap, styled alt-text box | — |
| `Hero.html` | Edge-to-edge hero, one inline anchor | Chasing a white strip under the hero |
| `CTA.html` | Content-width text button (no VML) | — |
| `BulletproofButton.html` | Button with VML `roundrect` + the arcsize conversion | The brand's corner radius matters in Outlook |
| **`ProductGrid.html`** | 2-col grid: hybrid stacking · equal-height cells · 3 sibling anchors · shrink-to-fit badge · centred odd card | Any grid work — this is the densest file here |
| `TwoColumn.html` | Thumbnail + text with the `dir="rtl"` order swap | Alternating feature rows — **we have no production equivalent** |
| `ThreeColumn.html` | Three even hybrid columns | Trust strips, feature-icon rows |
| `Divider.html` | Painted rule as a sized cell (never `<hr>`, never `border-top`) | — |
| `Spacer.html` | Sized spacer row — and why it is *not* a banned empty `<td>` | — |
| `Footer.html` | Compliance footer with **Klaviyo** tags | **Before touching any footer** — read the §8.7 warning |
| `VML.html` | Every VML pattern: background images (2 variants), roundrect, PPI fix | Text over an image — **we have no production equivalent** |

---

## Conventions

- Brand values are `[[TOKEN]]` slots, matching `Components/README.md`.
- Klaviyo Liquid (`{{ … }}`, `{% … %}`) passes through unchanged.
- Every file opens with the standard header comment (Component / Purpose / Source / Required /
  Optional / Fallback / Dependencies).
- Inline comments explain **which client bug** each declaration fixes — that is the point of the
  library, not the markup itself.

---

## Four things in here that are not in Cerberus

Each exists because a real email failed in production:

1. **Three sibling anchors per product card** (`ProductGrid.html`) — Klaviyo detaches the `href`
   from a block-level wrapper on import. The card renders, looks clickable, and is dead.
2. **`bgcolor` attribute on every coloured `<table>` *and* its content `<td>`** (everywhere) —
   Gmail mobile drops CSS `background` and paints the cell, producing white gutters and seams.
3. **Shrink-to-fit price badge** (`ProductGrid.html`) — the Gmail mobile app coerces
   background-filled inline-block anchors toward full width.
4. **Klaviyo compliance tags, never inside an attribute** (`Footer.html`) — an HTML-emitting tag in
   an `href` spills raw markup onto the screen. Source review cannot catch it.

---

## Three things in Cerberus we deliberately did **not** copy

| Not copied | Why |
|-----------|-----|
| `table { table-layout: fixed !important; }` | Disables intrinsic sizing — breaks the shrink-to-fit badge and the centred odd card |
| `<webversion>` / `<unsubscribe>` | Campaign Monitor tags; in Klaviyo they render as inert text and ship a non-compliant email |
| `https://via.placeholder.com/…` | Defunct service — would ship broken images |

Full reasoning: [`../Cerberus-Best-Practices.md`](../Cerberus-Best-Practices.md) §5.

---

## Fix-once, propagate-immediately

If a defect is found in one of these reference components, fix it **here and in the corresponding
production component in the same change** (Campaign `§6.18`, Flow `§7`). A fix that lives in only
one place guarantees the bug returns in the next campaign or the next brand.
