# Hero Banner Generation Prompt

> Generated from [`07-Prompt Library/Hero-Banner-Generator.md`](../../../../../07-Prompt%20Library/Hero-Banner-Generator.md)
> for the RDD Weekly 2026-W29 send. Prompt only — **no HTML changes, no image generated, hero not
> replaced.** AI output requires human review + approval (`CR-16`/`CR-17`) before it enters `Assets/`.

## Campaign Context
- **Brand:** Retail Display Direct (RDD) — [Confirmed via connected Klaviyo account `XAUdQX`]
- **Campaign:** Weekly 2026-W29 — "Fresh Displays. Sharper Spaces." / Featured Picks · Limited Time Sale
- **Theme:** This week's featured picks — retail-display + workspace essentials; a sharper, more
  productive Australian workspace, with the sit-stand desk as the centrepiece.
- **Objective:** Elevate the plain catalogue-style hero into a premium, art-directed Australian
  commercial visual that drives clicks to product/category pages (CTR → orders).
- **Target Market:** Australia (contemporary AU offices / workspaces; B2B + e-commerce).
- **Featured Product:** Electric Sit Stand Desk Black 1600mm  *(verified — do not alter)*
- **Product Category:** Sit-Stand / Height-Adjustable Desks (workspace)
- **Product Source:** BigCommerce v3 Catalog API (RDD store `s-ugqmr0qfvf`), read-only — verified live
  2026-07-12: product id **1240**, price **AUD $403.71**, inventory **46**, `availability=available`,
  `is_visible=true`. Product URL: <https://www.retaildisplaydirect.com.au/electric-sit-stand-desk/>
- **Product Reference (primary):** official product image id **5262** (thumbnail) —
  `https://cdn11.bigcommerce.com/s-ugqmr0qfvf/images/stencil/1000x1000/products/1240/5262/SSDW16B__69704.1718865231.jpg?c=2`
  *(Alternate 3/4 angle: image id 2126. Do NOT use id 2175 — laptop/on-screen promo; or id 3829 — line drawing.)*

## Recommended Visual Mode
**Environmental Product Hero** — a wider, professionally styled contemporary Australian office scene in
which the real desk is unmistakably the hero. (Borrows Lifestyle warmth, but the desk stays dominant and
uncluttered rather than becoming one prop among many.)

## Creative Direction
- **Fits the product:** a 1600mm sit-stand desk is architectural and space-defining — it reads best as
  the anchor of a real workspace, which shows scale, purpose (sit ⇄ stand), and quality far better than a
  floating cut-out. An environmental scene turns the catalogue shot into an aspirational "sharper space."
- **Fits the campaign:** "Fresh Displays. Sharper Spaces." is about upgrading the working environment;
  placing the verified desk in a clean, modern office directly visualises that promise.
- **Fits RDD:** RDD's documented Australian context is contemporary retail environments, modern offices
  and workspaces, and practical professional business settings — this scene is squarely on-brand.
- **Fits the Australian market:** bright natural daylight, realistic local open-plan architecture, and a
  practical, trustworthy, premium-but-not-luxury aesthetic gives an authentic Australian commercial-ad
  feel without clichés — credible for AU retail/B2B/e-commerce.

## Google Flow Prompt

```
Create a photorealistic, professionally art-directed commercial advertising hero image of the SPECIFIC
referenced product — the "Electric Sit Stand Desk Black 1600mm" — for an Australian retail/B2B email
campaign. Use the attached product reference image as the exact model of the desk and reproduce it
faithfully.

VISUAL OBJECTIVE: Present this height-adjustable sit-stand desk as the premium centrepiece of a sharper,
more productive workspace — an upgrade-your-workspace hero that feels like a genuine, polished Australian
commercial campaign, not a plain catalogue cut-out.

VERIFIED FEATURED PRODUCT (preserve exactly, this is a real product): a 1600mm-wide electric sit-stand
desk with a matte BLACK rectangular desktop that has a gently contoured front edge (a shallow curved
ergonomic cut-out on the user side) and a round cable grommet near the rear of the top; TWO light-grey /
white telescoping electric lift columns (two-stage); white/light-grey T-shaped feet; and a front-mounted
control panel under the desktop's front-right with a small digital height display, memory preset buttons
(1–4) and up/down arrows. Keep the desk's real shape, proportions, black-top-plus-light-grey-frame colour
scheme, materials, and all controls exactly as in the reference.

PRODUCT REFERENCE INSTRUCTION: The attached image is the ground truth. Do not redesign, restyle, recolour,
add, or remove any part of the desk. Do not swap it for a generic or similar-looking desk. The desk must
remain instantly recognisable as this exact product; only the environment, lighting, and composition
around it are new.

AUSTRALIAN COMMERCIAL CONTEXT: A contemporary Australian commercial advertising aesthetic — clean,
practical, confident, and trustworthy. Realistic modern Australian workplace architecture and interiors,
bright but natural Australian daylight, natural colour treatment, uncluttered and modern, premium but not
overly luxurious. No Australian clichés (no flags, kangaroos, koalas, Opera House, Harbour Bridge,
beaches, or outback).

CAMPAIGN THEME: "Fresh Displays. Sharper Spaces." — featured picks for a sharper, healthier, more
organised workspace; the desk embodies the "upgrade your workspace" idea.

SCENE / ENVIRONMENT: A bright, contemporary Australian open-plan office / professional workspace. Large
windows with soft natural daylight, muted neutral walls (white/warm grey), light timber or pale flooring,
and a few tasteful, softly out-of-focus workspace details in the background (a monitor or two, a plant, a
subtle shelf or display unit) — enough to feel real and lived-in, never cluttered. Keep the background
clean and secondary so the desk is clearly the hero. The desk is shown set up as a functional workstation
but tidy and minimal.

COMPOSITION: Wide, landscape-oriented framing suitable for an email hero banner. Place the full desk as
the dominant focal point, roughly centred or slightly off-centre, with the whole desk (top, both legs,
feet, and the front control panel) clearly visible in a natural 3/4 perspective similar to the reference.
Maintain clean negative space and generous, crop-safe margins around the desk so the image can be cropped
to different heights without cutting the product. Clear visual separation between the desk and the
background.

LIGHTING: Realistic, soft commercial daylight from the windows, with natural, believable contact shadows
under the desk and a gentle highlight along the desktop edge. Even, flattering exposure; no harsh flash,
no artificial studio gradient, no HDR glow.

BRAND MOOD: Practical, modern, professional, and approachable — Retail Display Direct's clean workspace
tone. Warm, natural neutrals; if any accent colour appears in the environment keep it subtle. Trustworthy
premium-but-accessible feel.

EMAIL BANNER SUITABILITY: Design for use as a responsive email hero image (~600px wide, landscape-safe).
The email's eyebrow, headline, supporting copy, price, and CTA are added later as editable HTML OUTSIDE
this image, so keep the image purely visual and leave calm, uncluttered space (upper area / one side)
that editable text could sit above without competing.

STYLE: High-end commercial product photography look — sharp, realistic, natural depth of field, authentic
materials and reflections. Avoid any generic, plastic, over-saturated, or obviously AI-generated
appearance.
```

## Negative Constraints
The generated image must be **visual-only**. Do **NOT** include or do any of the following:
- No text of any kind: no headline, eyebrow, body copy, or CTA text.
- **No price / sale price / discount %** — in particular the current **AUD $403.71** must not appear.
- No coupon code, promotional badge, "SALE"/"% OFF" sticker, or on-screen promo (e.g. a laptop showing an
  offer, as in reference image 2175).
- No fake logo, brand mark, wordmark, or watermark.
- **Product integrity:** do not redesign the desk; do not change the black desktop colour or the
  light-grey/white frame/legs; do not alter its shape, proportions, or contoured front edge; do not add
  nonexistent features (drawers, different controls, extra tiers); do not remove the control panel, cable
  grommet, or feet; do not replace it with a generic/look-alike desk.
- No Australian clichés (flags, kangaroos, koalas, Opera House, Harbour Bridge, beaches, outback).
- No cluttered/busy scene, no distracting foreground props, no people obscuring the desk.
- No cartoon, illustration, CGI-plastic, or obviously AI-generated styling.

## Usage Notes
- **Expected banner usage:** WK-S4 featured-pick hero banner in `Output/RDD-2026-W29.html` (currently the
  `stencil/1000x1000` product cut-out at `max-width:440px`). Target a landscape, crop-safe hero; confirm
  final dimensions/aspect against [Banner-Standards](../../../../../06-Assets%20Library/Banner-Standards.md)
  before use.
- **Product-accuracy checks (reviewer):** black contoured desktop + cable grommet present; light-grey/white
  two-stage lift columns and T-feet unchanged; front control panel with digital display + preset buttons
  intact; overall proportions match the 1600mm reference; no invented features; desk still instantly
  recognisable as product id 1240.
- **Visual-only check:** confirm no price, text, badge, logo, or watermark is baked into the image.
- **Human review required (`CR-16`):** reviewer/approver must not be the author.
- **Approval required (`CR-17`):** only the approved visual becomes a per-send asset
  (`Assets/RDD-2026-W29-hero.<ext>`, meeting `CS-10`; add meaningful `alt` text per `CS-11`), is recorded
  in `RDD-2026-W29-assets.md`, and only then may WK-S4 reference it. Do not auto-approve AI output.
- **Reference to supply to Google Flow:** attach product image id **5262** (primary); optionally id 2126
  as a secondary angle.

---

_Campaign-specific hero-banner prompt for RDD 2026-W29. Product verified via BigCommerce (read-only)
2026-07-12. Created: 2026-07-12._
