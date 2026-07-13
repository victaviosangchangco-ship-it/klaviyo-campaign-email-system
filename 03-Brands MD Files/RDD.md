# Brand Specifics — RDD

This document defines the **brand-specific rules for RDD**. It is the single source of truth for RDD's
identity within the campaign system. It follows the brand document contract defined in
[Shared Brand Standards](Shared.md) and fills in the values for RDD. It does not restate any shared
rule; the role of the brand layer and the standards that apply identically to all brands live in
[Shared.md](Shared.md).

## Sources & confidence

Values below are sourced from the **approved RDD brand documentation** and the official website:

- `BrandConfig.md` and `Design.md` — approved RDD brand sources (located at
  `Klaviyo Flow and Claude Code/Brands/RDD/`). ⚠️ These currently contain **no confirmed brand
  information** — nearly every value is marked `TODO` with an explicit "do not guess" instruction.
- Official website — <https://www.retaildisplaydirect.com.au/> (user-provided).

Confidence tags, consistent with the source documentation:

- **[Confirmed]** — evidenced from an approved source; treat as authoritative.
- **[Inferred]** — derived from an approved source but **not yet authoritative**; confirm before use.
- **To be confirmed** — not present in any approved source; must not be assumed.

> **Status of this brand.** RDD is at an early stage: only the brand code, website, temporary product
> source, and the brand-agnostic standard compliance/dynamic elements are known. All brand-specific
> identity, visual, and configuration values are **To be confirmed** and must be populated from
> official RDD brand assets or provided screenshots. Nothing has been guessed.

## Brand identity

| Attribute | Value | Confidence |
|-----------|-------|------------|
| Brand code | **RDD** | [Confirmed] |
| Brand name | _To be confirmed_ (the approved source marks this `TODO`/do-not-guess; the website domain `retaildisplaydirect.com.au` is the only lead and is not a confirmed brand name) | To be confirmed |
| Industry | _To be confirmed_ | To be confirmed |
| Company | _To be confirmed_ | To be confirmed |
| Product range | _To be confirmed_ | To be confirmed |
| Audience | _To be confirmed_ | To be confirmed |
| Trust claims | _To be confirmed_ | To be confirmed |

## Logo

- **To be confirmed.** RDD's primary (light-background), secondary/dark, and any dark-mode-safe logos
  and their usage rules are not documented in any approved source. When confirmed, they must be
  consistent with the [Logo Standards](../06-Assets%20Library/Logo-Standards.md).

## Colour palette

- **To be confirmed.** RDD's colours, hex values, and usage are not documented. When confirmed, usage
  must satisfy the accessibility expectations of `CS-11` (see
  [Campaign Standards](../00-Project%20Overview/Campaign-Standards.md)).

## Typography

- **To be confirmed.** RDD's display and body typefaces, hierarchy, and exact px/line-heights are not
  documented. The shared email baseline default is an `Arial, Helvetica, sans-serif` fallback until a
  brand face is confirmed.

## Tone of voice

- **To be confirmed.** RDD's tone, personality, and do/don't guidance are not documented. When
  confirmed, copy must meet `CS-05` (see [Campaign Standards](../00-Project%20Overview/Campaign-Standards.md)).

## Imagery style

- **To be confirmed.** RDD's photographic/graphic style is not documented. When confirmed, it applies
  within the [Assets Library](../06-Assets%20Library/) standards.

## Button / CTA styling

- **To be confirmed.** RDD's button fill, text colour, radius, size, and tap height are not documented.
  When confirmed, they must fall within the [Button Standards](../06-Assets%20Library/Button-Standards.md).

## Sender identity & footer

Must satisfy compliance (`CS-15`, see [Campaign Standards](../00-Project%20Overview/Campaign-Standards.md)).

- **Company name / description / privacy paragraph** — **To be confirmed.**
- **Address / contact email / support email / phone** — **To be confirmed.**
- **Social links** — **To be confirmed.**
- **Footer navigation** — **To be confirmed.**
- **Compliance links** — Unsubscribe (`{% unsubscribe %}`), Manage Preferences
  (`{{ manage_preferences_url }}`). **[Confirmed — standard, brand-agnostic]**
- **Privacy Policy / Terms / Shipping / Returns / FAQ URLs** — **To be confirmed.**

## Brand-specific data

Cross-referenced to [04-Technical](../04-Technical/) and
[Audience & Segmentation](../00-Project%20Overview/audience-segmentation.md).

- **Website** — <https://www.retaildisplaydirect.com.au/> **[Confirmed — provided by user]**
- **Temporary product source** (until an API feed is connected) —
  <https://www.retaildisplaydirect.com.au/> [Provided by user]. Points to a live page; it is **not** a
  substitute for dynamic product data — no product names or prices are hardcoded from it.
- **Platform / BigCommerce configuration** — **To be confirmed.** (Store URL, Store Hash, Channel ID,
  Access Token, default currency, default product count, product feed, API endpoint, product URL
  format, image ratio, catalog notes are all `TODO` in the approved source; whether RDD is on
  BigCommerce is itself unconfirmed.)
- **Audience segments** — **To be confirmed** (define in
  [Audience & Segmentation](../00-Project%20Overview/audience-segmentation.md)).
- **Dynamic variables (standard set, brand-agnostic):** `{{ first_name|default:'there' }}`,
  `{{ organization.name }}`, `{{ manage_preferences_url }}`, `{% unsubscribe %}`, `{% catalog … %}`,
  `{% coupon_code … %}`, `event.*`, `person.*`. **[Confirmed — standard]** Brand-specific custom
  properties — **To be confirmed.**

## Outstanding items to confirm

Sourced from the approved documentation's open items. All remain **To be confirmed** and must not be
assumed until confirmed against official RDD brand assets or provided screenshots:

- [ ] Brand identity — name, industry, company, products, audience, trust claims
- [ ] Brand voice / tone
- [ ] Colours & typography (hex values, typefaces, sizes)
- [ ] Logo assets (primary, dark, dark-mode-safe) and usage rules
- [ ] Hosted asset URLs (logos, social icons, trust icons, hero/banner/product placeholders)
- [ ] Social / policy URLs, contact email, phone, address
- [ ] Footer company name, description, navigation links
- [ ] BigCommerce Store Hash, Channel ID, Access Token, product feed (and whether RDD is on BigCommerce)
- [ ] Default currency and default product count
- [ ] Button / CTA styling (fill, radius, size)
- [ ] RDD-specific audience segments and custom properties
- [ ] Coupon type (static vs. dynamic) per campaign

---

_Status: Draft for review — only brand code, website, temporary product source, and standard
brand-agnostic elements confirmed; all brand-specific values To be confirmed. Last updated: 2026-07-10._
