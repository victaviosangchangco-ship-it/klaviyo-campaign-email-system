# Components — Email Framework Guide

This folder is the **production engine** of the Campaign System: a set of independent, brand-neutral
HTML components that a Template assembles in order. The long-term pipeline is:

```
Brief → Brand Configuration → Product Data → Components → Template → Final HTML
```

Future automation (and Claude Code) **injects data into this framework** — it never rebuilds HTML
from scratch. Everything here is designed to be deterministic: each file declares its required
inputs, optional inputs, and fallback behavior in its own header comment, so generation is
predictable without ever editing the component.

## Token convention

Framework injection points use **double square brackets**: `[[TOKEN_NAME]]`.

This is deliberately distinct from Klaviyo/Liquid tags (`{{ ... }}` and `{% ... %}`), which are **not**
framework tokens — they are real dynamic tags that pass through unchanged into the final HTML.

| Syntax | Meaning | Resolved |
|--------|---------|----------|
| `[[TOKEN]]` | Framework slot | Replaced at generation time |
| `{{ ... }}` / `{% ... %}` | Klaviyo Liquid | Left intact; resolves at send in Klaviyo |

## Token categories

Every `[[TOKEN]]` belongs to exactly one source layer in the pipeline:

- **Brand-Style** (from the brand's `Design.md`): `[[FONT_STACK]]`, `[[HEADING_FONT_STACK]]`,
  `[[HEADING_WEIGHT]]`, `[[TEXT_COLOR]]`, `[[MUTED_TEXT_COLOR]]`, `[[BODY_BG]]`, `[[ACCENT_COLOR]]`,
  `[[LINK_COLOR]]`, `[[BUTTON_BG]]`, `[[BUTTON_TEXT_COLOR]]`, `[[BUTTON_RADIUS]]`, `[[BUTTON_ARCSIZE]]`,
  `[[BUTTON_WIDTH]]`, `[[CARD_BG]]`, `[[CARD_BORDER_COLOR]]`, `[[CARD_RADIUS]]`, `[[IMAGE_RADIUS]]`,
  `[[PILL_RADIUS]]`, `[[SECTION_BG]]`, `[[FOOTER_BG]]`, `[[FOOTER_TEXT_COLOR]]`,
  `[[EYEBROW_SIZE]]`, `[[H1_SIZE]]`, `[[H2_SIZE]]`, `[[BODY_SIZE]]`, `[[META_SIZE]]`, `[[SMALL_SIZE]]`,
  `[[DARK_BODY_BG]]`, `[[DARK_TEXT_COLOR]]`. **The full type scale, spacing rhythm, and token contract
  live in [`Shared/design-tokens.md`](../Shared/design-tokens.md)** — read it before editing a component.
- **Brand-Fact** (from the brand's `BrandConfig.md`): `[[LOGO_URL]]`, `[[LOGO_DARK_URL]]`,
  `[[LOGO_ALT]]`, `[[COMPANY_NAME]]`, `[[COMPANY_ADDRESS]]`, `[[FOOTER_DESCRIPTION]]`,
  `[[FACEBOOK_URL]]`, `[[INSTAGRAM_URL]]`, `[[FB_ICON_URL]]`, `[[IG_ICON_URL]]`.
- **Content** (from the send's `Brief/`): `[[SUBJECT_LINE]]`, `[[PREHEADER_TEXT]]`, `[[HERO_HEADING]]`,
  `[[HERO_BODY]]`, `[[CTA_LABEL]]`, `[[CTA_URL]]`, `[[ANNOUNCEMENT_TEXT]]`, `[[PRODUCT_*]]`,
  `[[TRUST_*]]`.
- **Liquid pass-through** (from Klaviyo, stay in output): `{% unsubscribe %}`,
  `{{ manage_preferences_url }}`, `{% catalog %}`, `{{ first_name|default:'there' }}`.

## Brand neutrality — what is and isn't tokenized

- **Tokenized (brand identity):** all colours, backgrounds, font families, type sizes, button radius,
  and every logo/URL/company value. **No brand value is ever hardcoded in a component or template.**
- **Concrete (shared email baseline, not brand identity):** 600px container width, table-based
  scaffolding, `role="presentation"`, the 600px responsive breakpoint, mobile stacking, and ≥44px tap
  targets. These come from the shared standard (`CS-08`–`CS-12`), not from any brand.

## Component header-comment format

Every component and template begins with this block (makes maintenance and AI generation
deterministic):

```
<!--
  Component: <name>
  Purpose: <one line>
  BRD mapping: <WK-S# / MO-S#>
  Required inputs: <tokens that MUST be provided>
  Optional inputs: <tokens with documented defaults>
  Fallback behavior: <what happens when an optional/required input is absent>
  Dependencies: <none, or shared styles it assumes>
-->
```

## Assembly convention (Templates)

A Template is a full HTML document shell that assembles components **in order** using markers:

```
<!-- ASSEMBLE: header.html -->
<!-- ASSEMBLE: hero.html -->
```

Generation expands each marker with the component's markup, then injects tokens. Components remain the
single source of truth for their markup; the Template owns only document structure and assembly order.

## Independence rule

Each component is self-contained and renders on its own — no component `@import`s or requires another.
Components assume only the shared `<style>` from `Shared/Snippets/base-head.html` is present in the
document head (provided by the Template). `product-grid.html` mirrors the structure of
`product-card.html` inline rather than depending on it.

## Responsive component standards & fix-once propagation (CLAUDE.md §6.17 / §6.18)

These components **are** the reusable design system. Two permanent rules:

1. **Copy, never recreate.** Build every campaign by copying these components (and the latest approved
   reference rendering) and injecting `[[TOKEN]]`s — never hand-author a one-off Product Card, Product
   Grid, Price Badge, CTA, Coupon/Promo bar or Hero. Change **tokens** for a brand's look, not the
   structural pattern.
2. **Fix-once, propagate immediately.** When a responsive/structural bug is fixed in any campaign,
   **back-port the fix into the corresponding file here in the same change** (`Components/<file>.html` for
   markup, `Shared/Snippets/base-head.html` for a shared class), and note it below. An un-propagated fix
   is incomplete — the next campaign/brand copies the library, so the bug would return.

Non-negotiable patterns baked into `product-card.html` / `product-grid.html` (do not deviate):
- **Equal height = fixed-height `<td>` cells** (`.pimg/.pnc/.pdc`), not `min-height` (Outlook-safe, §6.8).
- **Clickability = three sibling anchors** (image / title / price) to the same URL; never one anchor around
  the whole card, never a `<table>` inside an `<a>` (§6.6).
- **Price badge = shrink-to-fit centred `<table>`** (fill+radius on the `<td>`); stays compact on Gmail
  mobile and never stretches to card width; never a bare `display:inline-block` anchor or `%`/fixed width
  (§6.17). Mobile tuning via the shared `.pricebtn` class.
- **Backgrounds** carry the `bgcolor` attribute on both `<table>` and content `<td>` (Gmail-mobile seams,
  §6.16); **brand marks** are excluded from the mobile `.pc img{width:100%}` rule via `.pc img.brandmark`.
- Every product image carries explicit `width`/`height` attributes + `display:block` (Apple Mail iOS, §6.6).

### Cerberus reference library (CLAUDE.md §6.20)

`Shared/Frameworks/Cerberus/Components/` holds **13 reference components** extracted from the Cerberus
framework and hardened with our production lessons. They are **reference only** — the files in *this*
folder remain the production source of truth for markup. Use the reference library to **check** a
component against the canonical pattern before changing it, and to build the two patterns we do not yet
have (`TwoColumn.html` — `dir="rtl"` order swap; `VML.html` — text over a background image).

| Production component | Cerberus reference | Check it for |
|---|---|---|
| `header.html` | `Header.html` | alt-text-box styling on the logo `<img>` |
| `hero-image.html` | `Hero.html` | ours is stricter — no change |
| `CTA.html` / `CTA-secondary.html` | `CTA.html`, `BulletproofButton.html` | arcsize conversion; `<td>`+`<a>` style duplication |
| `product-card.html` / `product-grid.html` | `ProductGrid.html` | hybrid stacking under the existing card rules |
| `trust-strip.html` | `ThreeColumn.html` | hybrid stacking |
| `footer.html` | `Footer.html` | **`unstyle-auto-detected-links` on the address block** |
| `Shared/Snippets/base-head.html` | `ResponsiveUtilities.html` | the eight missing reset rules |
| *(none — recommended additions)* | `TwoColumn.html`, `VML.html` | — |

⚠️ Three things in Cerberus source must **never** be copied into a production component:
`table { table-layout: fixed !important; }` (disables intrinsic sizing — breaks the shrink-to-fit price
badge and the centred odd card), `<webversion>` / `<unsubscribe>` (Campaign Monitor tags; inert text in
Klaviyo), and `via.placeholder.com` image URLs (defunct service). Reasoning:
`Shared/Frameworks/Cerberus/Cerberus-Best-Practices.md` §5.

**Change log (propagated fixes):**
- 2026-07 (RDD-2026-W31): rebuilt `product-card.html` + `product-grid.html` to fixed-height cells, 3 sibling
  anchors, and the shrink-to-fit responsive price badge; added `.pimg/.pnc/.pdc/.pricebtn` +
  `.pc img.brandmark` to `base-head.html`. Replaces the earlier single-anchor / `min-height` card that
  reintroduced the SS-2026-W29 (§6.6) and Gmail-mobile price-stretch (§6.17) defects.

## Components in this library

| File | BRD block | Role |
|------|-----------|------|
| `header.html` | WK-S3 / MO-S3 | Logo bar with light/dark swap |
| `hero-image.html` | WK-S4 / MO-S5 | Full-width hero banner image (optional, linkable) |
| `hero.html` | WK-S4 / MO-S5 | Headline block — eyebrow + H1 + optional lead line |
| `intro.html` | WK-S4 / MO-S5 | Intro body copy (1–3 paragraphs) |
| `category-pills.html` | WK-S4 / MO-S5 | Outline category/collection nav pills (3-up → 2-up) |
| `CTA.html` | WK-S5 / MO-S6 | Bulletproof **primary** button (+ VML) |
| `CTA-secondary.html` | WK-S5 / MO-S6 | **Secondary** outline button (CTA hierarchy) |
| `section-heading.html` | WK-S6 / MO-S7 | Tinted section title panel + subhead + optional badge |
| `product-card.html` | WK-S6 / MO-S7 | Single product card — fixed-height cells, 3 sibling anchors, shrink-to-fit price badge (§6.8/§6.6/§6.17) |
| `product-grid.html` | WK-S6 / MO-S7 | 2-up product row (repeatable), equal-height cards, responsive price badges, centred odd card (§6.8/§6.9/§6.17) |
| `coupon.html` | offer/promo | Promo block — dashed code chip + offer + CTA + fine print |
| `announcement.html` | offer/promo | Simple text offer bar (lighter alternative to coupon) |
| `trust-strip.html` | supporting | 4-card credibility grid (4-up → 2×2) |
| `footer.html` | WK-S8 / MO-S9 | Brand blurb + social + compliance |
