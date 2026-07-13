# Brand Specifics — SS

This document defines the **brand-specific rules for SS**. It is the single source of truth for SS's
identity within the campaign system. It follows the brand document contract defined in
[Shared Brand Standards](Shared.md) and fills in the values for SS. It does not restate any shared
rule; the role of the brand layer and the standards that apply identically to all brands live in
[Shared.md](Shared.md).

## Sources & confidence

Values below are sourced from the **approved SS brand documentation** and the official website:

- `BrandConfig.md` and `Design.md` — approved SS brand sources (located at
  `Klaviyo Flow and Claude Code/Brands/SS/`). These were reverse-engineered from an approved SS
  Customer Winback email and are a working spec, **not yet an official brand guide**.
- Official website — <https://www.safetysector.com.au/>

Each value carries a confidence tag, consistent with the source documentation:

- **[Confirmed]** — evidenced from an approved source; treat as authoritative.
- **[Inferred]** — derived from an approved source but **not yet authoritative**; confirm before
  production use.
- **To be confirmed** — not present in any approved source; must not be assumed.

## Brand identity

| Attribute | Value | Confidence |
|-----------|-------|------------|
| Brand code | **SS** | [Confirmed] |
| Brand name | Safety Sector (Safety Sector Pty Ltd) | [Confirmed] |
| Industry | Australian industrial / B2B safety products | [Confirmed] |
| Company | Sydney-based; distributor **and** manufacturer, operating 15+ years, with part-ownership in overseas production facilities | [Confirmed, per footer copy] |
| Product range | Bollards, wheel stoppers, tactile indicators, stair nosings — designed to meet Australian safety standards | [Confirmed] |
| Audience | Builders, construction groups, facility operators, government & bulk buyers | [Confirmed] |
| In-market trust claims | Warranty up to 10 years · Australia-wide delivery · 100,000+ customers · 30-day returns | [Confirmed] |

## Logo

Consistent with the [Logo Standards](../06-Assets%20Library/Logo-Standards.md).

- **Primary logo (header / light backgrounds)** — "SAFETY SECTOR" wordmark in a heavy, condensed,
  stencil/industrial uppercase face; black wordmark with a red angular "tag/flag" accent. Used
  ~220px wide, centered. **[Confirmed]**
  Hosted: `https://d3k81ch9hvuctc.cloudfront.net/company/T7SuPP/images/f4045d61-0ee2-41a3-8fbf-6281da7b3891.gif`
- **Secondary logo (footer / dark backgrounds)** — standalone red mark (tag shape, no wordmark);
  doubles as the dark-background logo. Used ~180px wide (footer mark ~48px), centered. **[Confirmed]**
  Hosted: `https://d3k81ch9hvuctc.cloudfront.net/company/T7SuPP/images/f649010e-1543-4913-83fe-9c37cbcef1c3.png`
- **Usage.** On white/light backgrounds → black wordmark + red accent, centered in the header. On
  black/dark backgrounds → standalone red mark (the black wordmark would disappear). **[Confirmed]**
- **Dark-mode-safe wordmark** — a light/white version of the full wordmark is **To be confirmed**
  (needed for dark backgrounds; not currently evidenced).

## Colour palette

Usage must satisfy the accessibility expectations of `CS-11` (see
[Campaign Standards](../00-Project%20Overview/Campaign-Standards.md)). All hex values are sampled from
compressed screenshots unless confirmed.

| Role | Colour | Approx. hex | Confidence |
|------|--------|-------------|------------|
| Primary / text / buttons | Black | `#000000` | [Confirmed] |
| Brand accent | Red | `~#E11B22` | [Inferred] |
| Base background | White | `#FFFFFF` | [Confirmed] |
| Support panel tint | Blush / pale pink | `~#FBEAEA` | [Inferred] |
| Footer background | Black | `#000000` | [Confirmed] |
| Footer body text | White | `#FFFFFF` | [Confirmed] |
| Footer links | Orange / amber | `~#F0A000` | [Inferred] |

**Palette intent [Inferred]:** high-contrast black/white with a single red accent; blush used
sparingly to soften supporting panels. Exact brand hex values are an open confirmation item.

## Typography

- **Headlines** — heavy-weight, near-condensed sans-serif, sentence case, left-aligned. **[Confirmed]**
- **Body** — regular-weight sans-serif, left-aligned, comfortable line length. **[Confirmed]**
- **Footer** — small regular-weight sans-serif, centered. **[Confirmed]**
- **Email-safe stack** — `Arial, Helvetica, sans-serif` fallback (industrial/condensed display face
  acceptable in logo/hero as image or web font with fallback). **[Inferred]**
- **Hierarchy (suggested px)** — H1 ~30px / weight 800; body ~16px / regular; footer ~12px.
  **[Inferred]**
- **Exact brand display & body typefaces and precise px/line-heights** — **To be confirmed.**

## Tone of voice

Copy must meet `CS-05` (see [Campaign Standards](../00-Project%20Overview/Campaign-Standards.md)).

- Professional, dependable, no-nonsense, industrial/utilitarian; factual and credibility-led rather
  than playful. **[Inferred]**
- Avoid hype/clickbait. Lead with the customer's context before the commercial ask. **[Inferred]**

## Imagery style

Applies within the [Assets Library](../06-Assets%20Library/) standards.

- No product/lifestyle photography was present in the approved source email (text + icons only).
- **[Inferred] standard for future use:** clean, well-lit product shots on white/neutral backgrounds
  (industrial catalog aesthetic); always include descriptive `alt` text.
- A definitive SS imagery style is **To be confirmed** against an official source.

## Button / CTA styling

Must fall within the [Button Standards](../06-Assets%20Library/Button-Standards.md).

- **Primary button** — solid **black** fill, **white** text, **sharp corners (0 radius)**, full-width
  within the content column. Observed label: "Shop Now". **[Confirmed]**
- **Footer navigation buttons** — black fill with a thin white/outlined border, white text, sharp
  corners, arranged in a 2×2 grid. **[Confirmed]**
- **[Inferred]** Button text bold, sentence/title case; minimum tap height 44px. One primary CTA per
  key section; footer nav buttons are secondary and must not compete with it.

## Sender identity & footer

Must satisfy compliance (`CS-15`, see [Campaign Standards](../00-Project%20Overview/Campaign-Standards.md)).

- **Company name** — Safety Sector (Safety Sector Pty Ltd). **[Confirmed]**
- **Company description (footer)** — "Dependable, high-quality safety solutions for builders,
  construction groups and facility operators across Australia. Sydney-based distributor and
  manufacturer for 15+ years. Range: bollards, wheel stoppers, tactile indicators, stair nosings —
  built to Australian safety standards." **[Confirmed, condensed]**
- **Address** — 3 Wordie Place, Padstow, NSW 2211, Australia. **[Confirmed]**
- **Contact email** — sales@safetysector.com.au (also used as support inbox). **[Confirmed]**
- **Phone** — **To be confirmed.**
- **Social links** — Facebook <https://www.facebook.com/safetysectorau/> · Instagram
  <https://www.instagram.com/safetysector.au/>. **[Confirmed]**
- **Footer navigation (reuse these exact URLs — do not hardcode/guess):**
  - All Products — `https://www.safetysector.com.au/safety-sector/` [Provided by user] ⚠️ rendered as
    a category subset on inspection; confirm it is the intended "All Products" destination
  - Shop By Category — `https://www.safetysector.com.au/` (homepage) [Provided by user]
  - Government Orders — `https://www.safetysector.com.au/government-orders/` **[Confirmed live]**
  - Bulk Deals — `https://www.safetysector.com.au/bulk-deal/` **[Confirmed live]**
- **Compliance links** — Unsubscribe (`{% unsubscribe %}`), Manage Preferences
  (`{{ manage_preferences_url }}`). **[Confirmed]**
- **Privacy Policy / Terms / Shipping / Returns / FAQ URLs** — **To be confirmed** (referenced in
  footer copy; URLs not captured).

## Brand-specific data

Cross-referenced to [04-Technical](../04-Technical/) and
[Audience & Segmentation](../00-Project%20Overview/audience-segmentation.md).

- **Website** — <https://www.safetysector.com.au/> **[Confirmed]**
- **Temporary product source** (until BigCommerce API is connected) —
  <https://www.safetysector.com.au/products/> [Provided by user]. Points to a live collection page;
  it is **not** a substitute for dynamic product data — no product names or prices are hardcoded from
  it.
- **Platform** — BigCommerce. **[Confirmed per project docs]**
  - Store URL — `https://www.safetysector.com.au` **[Confirmed storefront; confirm BC canonical]**
  - Store Hash / Channel ID / Access Token — **To be confirmed** (do not guess)
  - Default currency — AUD **[Inferred]**
  - Default product count (email grid) — 4 **[Inferred]**
  - Product feed / featured / trending categories, API endpoint, product URL format, image ratio —
    **To be confirmed**
- **Catalog range** — bollards, wheel stoppers, tactile indicators, stair nosings. **[Confirmed]**
- **Audience segments** — SS-specific segments are **To be confirmed** (define in
  [Audience & Segmentation](../00-Project%20Overview/audience-segmentation.md)).
- **Dynamic variables (recommended; confirm against the SS Klaviyo account):**
  `{{ first_name|default:'there' }}`, `{{ organization.name|default:'Safety Sector' }}`,
  `{{ manage_preferences_url }}`, `{% unsubscribe %}`, `{% catalog … %}`, `{% coupon_code … %}`.
  Static literals seen in the source email: coupon `WELCOMEBACK`, discount `15%` — confirm whether
  `WELCOMEBACK` is a static shared code or a Klaviyo dynamic coupon.

## Outstanding items to confirm

Sourced from the approved documentation's open items. Each is either **[Inferred]** (has a provisional
value above, pending sign-off) or **To be confirmed** (no value yet). None may be treated as
authoritative until confirmed against an official SS source:

- [ ] Exact brand hex values (accent red, blush, footer link amber) — currently [Inferred]
- [ ] Brand display & body typefaces and exact px/line-heights — currently [Inferred]
- [ ] Dark-mode-safe (white) full wordmark asset
- [ ] Hosted URLs for the four trust icons
- [ ] Phone number
- [ ] Privacy Policy / Terms / Shipping / Returns / FAQ URLs
- [ ] "All Products" footer destination (confirm intended target)
- [ ] BigCommerce Store Hash, Channel ID, Access Token, and product feed configuration
- [ ] Default currency (AUD) and default product count (4) — currently [Inferred]
- [ ] SS-specific audience segments
- [ ] Coupon type per campaign (static `WELCOMEBACK` vs. dynamic Klaviyo coupon)
- [ ] Tone of voice — confirm against an official brand source (currently [Inferred])

---

_Status: Draft for review — populated from approved SS sources; [Inferred] and To-be-confirmed items
pending sign-off. Last updated: 2026-07-10._
