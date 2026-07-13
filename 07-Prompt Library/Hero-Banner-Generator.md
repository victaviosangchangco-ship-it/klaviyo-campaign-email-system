# Hero Banner Generator (Weekly Campaign)

Reusable **source of truth** for turning a specific Weekly Campaign into a **campaign-specific Google
Flow prompt** for the hero banner visual (`WK-S4`). This file is the generator; its *output* is a
ready-to-copy prompt saved into the send's workspace. It is a Prompt Library asset alongside
[Generate-Weekly-Campaign](Generate-Weekly-Campaign.md) and [Generate-HTML](Generate-HTML.md).

> Scope: **prompt generation only.** This file never produces or edits campaign HTML, and it never
> auto-approves an AI image. It teaches Claude Code how to write one adaptive prompt per send. It does
> not restate brand facts or campaign standards — it cites them.

## Where this sits in the workflow

```
Brand Rules (03-Brands MD Files/<CODE>.md + approved BrandConfig.md/Design.md)
+ Campaign Brief (Brief/)
+ Campaign Theme
+ Selected VERIFIED Product (Product-Source: BigCommerce first)
+ Real Product Image / Reference (References/ or verified CDN URL)
        ↓
Hero-Banner-Generator.md   ← this file
        ↓
Campaign-Specific Google Flow Prompt   ← saved to the send's Assets/ (see naming)
        ↓
Google Flow (run by the user, with the product reference)
        ↓
Generated Hero Banner Visual
        ↓
Human Review / Approval   (CR-16 author≠reviewer · CR-17 approval recorded)
        ↓
Campaign Assets   (approved visual → Assets/, meets CS-10; alt text CS-11)
        ↓
Final Email Template   (WK-S4 references the approved asset)
```

The generated prompt is a pre-asset artifact created during **WK-P3 (Gather assets)**. It must adapt to
the **actual** brand, campaign, theme, product, product category, target audience, and Australian market
context — **never** emit the same generic prompt twice.

## File placement & naming (file-driven architecture)

- **This generator:** `07-Prompt Library/Hero-Banner-Generator.md` (reusable, brand-agnostic).
- **Each generated prompt** is send-specific and lives in that send's workspace, beside the asset
  manifest, following CLAUDE.md §10 slug conventions:
  - Weekly: `Brands/<CODE>/Campaigns/Weekly/Assets/<CODE>-YYYY-Www-hero-prompt.md`
  - Monthly: `Brands/<CODE>/Campaigns/Monthly/Assets/<CODE>-MM-hero-prompt.md` *(MM in place of Www)*
- **The approved visual** (after review) is a per-send asset:
  `Brands/<CODE>/Campaigns/<cadence>/Assets/<CODE>-YYYY-Www-hero.<ext>` and is recorded in the send's
  `<CODE>-YYYY-Www-assets.md` manifest. Unapproved/AI drafts are **not** stored in Assets/.

## Required inputs (collect & verify first)

Read the [Project Read Order](../CLAUDE.md) sources, then confirm every field below. Carry confidence
tags (`[Confirmed]`/`[Inferred]`/`To be confirmed`). **If any product field is missing, stop and request
it — never invent it** (CLAUDE.md §5, §5.1).

| Input | Source of truth |
|-------|-----------------|
| Brand name / code | `03-Brands MD Files/<CODE>.md` (+ approved `BrandConfig.md`) |
| Campaign name / theme / objective | Send `Brief/` (from the Content Calendar) |
| Selected featured product (verified name) | Approved product source — see [Product-Source](../04-Technical/Product-Source.md) (BigCommerce first for connected brands) |
| Product category | Verified from the product source |
| Verified product image / reference | `References/` screenshot **or** verified product-source CDN image URL |
| Verified product source | BigCommerce (preferred) or approved live website (fallback) |
| Brand visual identity / colours | `Design.md` / `03-Brands MD Files/<CODE>.md` (only confirmed/inferred values) |
| Target audience | [Audience & Segmentation](../00-Project%20Overview/audience-segmentation.md) + brief |
| Australian market context | Brand doc (AU-based brands) + brief |
| Desired environment / lifestyle context | Brief / campaign theme |
| Dimensions / aspect ratio (if defined) | Brief / [Banner-Standards](../06-Assets%20Library/Banner-Standards.md) |

## Core creative direction — Australian commercial advertising

When the target brand and campaign are for the **Australian market**, every generated prompt should carry
a strong, credible **Australian commercial-advertising** feel — suitable for a professional Australian
retail, e-commerce, B2B, workplace, safety, or healthcare/accessibility campaign, matched to the actual
brand and product.

**Do not use obvious clichés.** Do **not** automatically add Australian flags, kangaroos, koalas, the
Sydney Opera House, the Harbour Bridge, beaches, or outback scenery **unless genuinely relevant** to the
specific campaign.

Instead achieve the Australian feel through:

- clean, practical commercial styling; modern, uncluttered composition
- contemporary Australian environments — realistic local workplace, retail, commercial, industrial,
  healthcare, or lifestyle settings, with realistic AU architecture and interiors
- bright but natural Australian daylight; natural colour treatment
- authentic, approachable, trustworthy commercial photography
- premium but not overly luxurious styling
- practical, product-focused storytelling with a clear visual hierarchy
- confident, straightforward advertising aesthetics

Target result: a visual that could naturally appear in a polished Australian retail catalogue, e-commerce
campaign, B2B advertisement, or professional email campaign.

### Brand-specific Australian context (adapt — do not reuse one look)

Always read the brand source-of-truth files first, then tailor the environment:

- **RDD** — contemporary Australian retail environments, modern offices and workspaces, commercial
  display environments, practical business settings, clean retail merchandising, professional workspace
  styling.
- **SS** — Australian workplace and industrial environments: warehouses, workshops, construction-related
  commercial settings where relevant, professional safety-focused and credible workplace scenes.
- **SC** — Australian healthcare, care, mobility, accessibility, or home environments where relevant;
  clean, respectful, realistic settings.
- **Stack** — follow its authoritative brand rules and actual product context.

If a brand is not AU-focused (per its brand doc), follow that brand's documented market context instead.

## Hero visual modes (choose intelligently)

Pick the single most suitable mode based on product type, campaign objective, theme, brand identity,
audience, and the quality/suitability of the available product reference.

1. **Product-Focused Hero** — when the product has strong visual presence on its own. Product is the
   dominant focal point with premium commercial composition, a clean environment/background, realistic
   lighting, and subtle contextual styling.
2. **Lifestyle Hero** — when the product benefits from a realistic use environment. Place the verified
   product naturally inside an appropriate Australian commercial / workplace / retail / industrial /
   healthcare / lifestyle setting. The environment supports the story without overpowering the product.
3. **Environmental Product Hero** — when a wider scene best communicates purpose. The product stays
   clearly identifiable but is integrated into a professionally styled, campaign-relevant environment.

## Product accuracy — critical

When a real product reference is provided, **preserve** the actual product design, shape, proportions,
colour, materials, visible branding, and important physical features.

**Do not** redesign the product, change its colour without approval, add nonexistent features, remove
important features, swap it for a generic look-alike, or create a misleading representation.

The AI treatment **may** enhance only the environment, background, lighting, composition, shadows,
lifestyle context, and campaign atmosphere. The actual product must remain **recognisable and accurate**.

## Hero banner text & price rule

By default the generated hero **image is VISUAL-ONLY**. Do **not** bake into the image: product price,
sale price, discount %, coupon code, promotional badge, headline, supporting copy, CTA text, fake logo,
or watermark. The email's eyebrow, headline, supporting copy, and CTA remain **editable HTML content**.

**CRITICAL PRICE RULE:** Do **not** display a product price in the hero banner section unless the user or
an explicitly approved `Brief/` specifically requests it. **Hero pricing is OFF by default** — prices
normally belong in the product grid (see CLAUDE.md §5.1).

## Composition for email hero banners

Request: a strong product focal point; clean visual hierarchy; professional commercial composition; the
appropriate Australian advertising aesthetic; realistic lighting and shadows; an uncluttered environment;
crop-safe, responsive-friendly framing; suitable negative space where required; and clear separation
between product and background. Never create an excessively busy scene.

Account for where the HTML text will sit relative to the image:

- **Text above the image** → the visual can use a centred composition.
- **Text overlaid on / beside the image** → intentionally leave clean negative space in the correct area
  for that text.

Honour any dimensions/aspect ratio from the brief or [Banner-Standards](../06-Assets%20Library/Banner-Standards.md).

## Google Flow prompt generation rule

For every campaign needing an AI hero banner, generate one **complete, ready-to-copy** Google Flow prompt
built from the actual campaign context. The prompt must include all eleven parts:

1. **Visual objective** — what the banner must communicate.
2. **Verified featured product** — the exact product being featured.
3. **Product reference instruction** — explicit instruction to preserve the real referenced product.
4. **Australian commercial context** — the appropriate AU advertising environment and visual direction.
5. **Campaign theme** — the specific campaign concept.
6. **Scene / environment** — a product- and brand-relevant setting.
7. **Composition** — product placement, framing, negative space, and crop safety.
8. **Lighting** — realistic commercial lighting appropriate to the environment.
9. **Brand mood** — visual tone derived from the authoritative brand files.
10. **Email banner suitability** — composition suitable for the actual email layout.
11. **Negative constraints** — explicitly state what must not be added, changed, or fabricated.

### Quality standard

The prompt must be **specific and art-directed**, not generic.

- ❌ **Bad:** "Create a modern Australian advertisement for this desk."
- ✅ **Good:** a campaign-specific prompt naming the exact referenced product, the appropriate Australian
  environment, the campaign objective, realistic commercial lighting, product placement, composition,
  negative space, email-banner usage, product-accuracy requirements, and prohibited elements.

Aim for output that feels professionally art-directed, commercially credible, distinctly suitable for the
Australian market, realistic, product-focused, brand-appropriate, and campaign-specific. Avoid generic
"AI-looking" advertising imagery.

## Output format (use for every generated prompt)

```markdown
# Hero Banner Generation Prompt

## Campaign Context
- Brand:
- Campaign:
- Theme:
- Objective:
- Target Market: Australia
- Featured Product:
- Product Category:
- Product Source:
- Product Reference:

## Recommended Visual Mode
- Product-Focused Hero | Lifestyle Hero | Environmental Product Hero  (choose one)

## Creative Direction
Explain why the selected direction fits the product, the campaign, the brand, and the Australian target
market.

## Google Flow Prompt
[Complete, ready-to-copy, campaign-specific prompt covering all 11 parts above]

## Negative Constraints
All prohibited changes and elements (product redesign/colour change/added features, baked-in
text/price/badge/logo/watermark, clichés, busy scenes, etc.).

## Usage Notes
- Expected banner usage (WK-S4; dimensions/aspect if defined)
- Product-accuracy checks the reviewer must perform
- Human review requirement (CR-16 — reviewer ≠ author)
- Asset-approval requirement (CR-17) before the visual enters Assets/
```

## Campaign workflow (when a Weekly Campaign requires a hero banner)

1. Read the send `Brief/`.
2. Read the authoritative brand files (`03-Brands MD Files/<CODE>.md` + approved `BrandConfig.md`/`Design.md`).
3. Select and verify the featured product via the approved product source (BigCommerce first).
4. Obtain the verified product reference image (`References/` or verified CDN URL).
5. Determine the campaign theme and Australian market context.
6. Use this file (`Hero-Banner-Generator.md`).
7. Generate the campaign-specific Google Flow prompt in the **Output format** above.
8. Save it to the send's workspace: `Assets/<CODE>-YYYY-Www-hero-prompt.md` (file-driven architecture).
9. The user runs the prompt + product reference in Google Flow.
10. Review the generated visual for **product accuracy** and **brand suitability**.
11. **Never auto-approve** AI-generated output.
12. Only an approved final visual enters the Assets workflow (`Assets/`, meeting CS-10; alt text CS-11).
13. The final email template (WK-S4) references the **approved** asset.

## Worked micro-example (illustrative — regenerate per send, never copy verbatim)

> **Input:** RDD · Weekly "Featured Picks / Limited Time Sale" · verified product *Electric Sit Stand
> Desk Black 1600mm* (BigCommerce, in stock) · reference = verified product CDN image.
> **Mode:** Environmental Product Hero.
> **Prompt (excerpt):** "Photorealistic commercial hero image of the referenced Electric Sit Stand Desk
> (black desktop, light-grey electric lift legs, corner cable grommet, front control panel) — reproduce
> the referenced desk exactly, do not alter its shape, proportions, colour, or controls. Place it in a
> bright, contemporary Australian open-plan office with natural daylight from large windows, muted neutral
> walls, and a few tasteful, out-of-focus workspace details. Desk positioned slightly right of centre with
> clean negative space to the upper-left for editable headline text. Natural soft commercial lighting with
> realistic contact shadows; uncluttered, crop-safe, responsive-friendly framing. Trustworthy,
> practical, premium-but-not-luxury Australian retail/B2B tone. Do not add any text, price, badge, logo,
> or watermark; no Australian clichés."

---

_Reusable Prompt Library asset. Governs Weekly (and, with `MM`, Monthly) AI hero-banner prompt generation.
Created: 2026-07-12._
