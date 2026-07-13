# Shared — Design Token Contract (engine-level, brand-neutral)

The **type scale**, **spacing rhythm**, and **shared class vocabulary** that every Weekly (and later
Monthly) component is built against. This is the *structure* of the visual system; the *values* for a
given send come from that brand's `Design.md` at generation time (`CS-03`, `CR-19`).

- **Tokenized = brand identity** → fonts, colours, type sizes, radii. Injected via `[[TOKEN]]`.
- **Structural = shared email baseline** → the spacing rhythm, 600px container, breakpoint, stacking,
  ≥44px tap targets. These are constants (`CS-08`–`CS-12`), *not* brand values, and are the same for
  every brand. A brand may override a structural value only if its `Design.md` explicitly says so.

Neutral defaults below let the engine render and be QA'd before any brand values are wired in. They are
**placeholders, not brand facts** — carry `To be confirmed` until a `Design.md` supplies the real value.

## 1. Typography tokens

Two families: a heading stack and a body stack (the benchmark pairs a serif heading with a sans body —
the engine supports that without assuming it). Weight and family are brand identity; the *scale* is fixed.

| Token | Role | Neutral default | Line-height |
|-------|------|-----------------|-------------|
| `[[HEADING_FONT_STACK]]` | Headings (H1/H2/eyebrow) | `Helvetica Neue, Helvetica, Arial, sans-serif` | — |
| `[[FONT_STACK]]` | Body / UI text | `Helvetica Neue, Helvetica, Arial, sans-serif` | — |
| `[[EYEBROW_SIZE]]` | Kicker above headline (uppercase, tracked) | `11px` | 1.2 |
| `[[H1_SIZE]]` | Hero headline | `32px` (mobile 28px via `.hh`) | 1.15 |
| `[[H2_SIZE]]` | Section heading | `22px` | 1.2 |
| `[[BODY_SIZE]]` | Body / intro / buttons | `15px` | 1.6 |
| `[[META_SIZE]]` | Product name / dense meta | `13px` | 1.4 |
| `[[SMALL_SIZE]]` | Captions / legal | `12px` | 1.5 |
| `[[HEADING_WEIGHT]]` | Heading weight (serif brands set 400) | `700` | — |

Rules: headings use `[[HEADING_FONT_STACK]]` + `[[HEADING_WEIGHT]]`; body uses `[[FONT_STACK]]` weight
400 with **700 for emphasis** (price, product name, link labels). Eyebrow = `[[EYEBROW_SIZE]]`/700/
`letter-spacing:2px`/uppercase in `[[ACCENT_COLOR]]`. **Never hardcode a size or weight in a component** —
reference these tokens so the whole system re-scales from one place.

## 2. Spacing rhythm (structural constants)

One rhythm across all components so stacked sections read as one system. Values are px (email-safe).

| Name | Value | Used for |
|------|-------|----------|
| Content inset (X) | `28px` desktop / `16px` mobile (`.mp`) | left/right padding of text sections |
| Section top gap | `32px` | space opening a new major section |
| Block gap | `16px` | between stacked blocks within a section |
| Card gutter | `6px` | space between grid cards |
| Card padding | `12px 12px 16px` | inside a product card |
| Button padding | `15px 20px` (≥44px tall on mobile) | CTA hit area |

Component vertical padding follows `top: (section gap or block gap)  ·  bottom: block gap`. Horizontal
padding is always the content inset. Do not invent one-off padding values — pull from this table.

## 3. Colour tokens (already in Components/README — summary)

`[[BODY_BG]]`, `[[TEXT_COLOR]]`, `[[MUTED_TEXT_COLOR]]`, `[[ACCENT_COLOR]]`, `[[LINK_COLOR]]`,
`[[BUTTON_BG]]`, `[[BUTTON_TEXT_COLOR]]`, `[[CARD_BORDER_COLOR]]`, `[[CARD_BG]]`, `[[SECTION_BG]]`
(tinted section-heading panel), `[[FOOTER_BG]]`, `[[FOOTER_TEXT_COLOR]]`, plus dark-mode
`[[DARK_BODY_BG]]` / `[[DARK_TEXT_COLOR]]`.

## 4. Radius tokens

`[[BUTTON_RADIUS]]` (+ `[[BUTTON_ARCSIZE]]` VML equiv), `[[CARD_RADIUS]]` (default 12px),
`[[IMAGE_RADIUS]]` (default 8px), `[[PILL_RADIUS]]` (default 24px).

## 5. Shared responsive classes (defined in `Shared/Snippets/base-head.html`)

| Class | Purpose |
|-------|---------|
| `.email-container` | 600px max, centred |
| `.stack-col` / `.pc` | grid cell → full-width block on mobile |
| `.mp` | content inset shrinks 28px → 16px on mobile |
| `.center-sm` | centre-align on mobile |
| `.tap` | ≥44px tap target on mobile |
| `.hh` | hero headline mobile size |
| `.prod-name` / `.prod-sub` | fixed heights so prices align across a row (reset on mobile) |
| `.dm-bg` / `.dm-text` / `.dm-logo-light` / `.dm-logo-dark` | dark-mode swaps |

_Brand-neutral engine contract. Brand `Design.md` overrides values; structure stays fixed._
