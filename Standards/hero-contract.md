# Hero Runtime Contract

Authoritative implementation: `Components/hero-image.html` + `Components/hero.html`.
Full engineering standard: `Shared/Email-Hero-Engineering-Standard.md` (1,422 lines — load only when
creating a new Hero architecture, debugging a Hero rendering issue, or commissioning new artwork).

---

## Assembly invariants (normal campaign generation)

1. **Edge-to-edge inside the 600px container.** No white canvas, gutters, borders, or gaps.
2. **Hero table:** `width:100%` in inline style (not only the attribute), `cellpadding="0"
   cellspacing="0" border="0"`.
3. **Hero cell:** `padding:0; margin:0; font-size:0; line-height:0; mso-line-height-rule:exactly;`
4. **Hero `<img>`:** `display:block; border:0; outline:none; text-decoration:none; margin:0;
   width:100%; max-width:600px; height:auto;` + `width="600"` HTML attribute for Outlook.
5. **If linked:** one inline `<a>` around the `<img>`. Anchor stays inline (`text-decoration:none` only).
   Never `display:block` on the anchor. Never wrap a `<table>` inside the anchor.
6. **Zero whitespace** between `<td>`, `<a>`, and `<img>` tags.
7. **Real pixel `width`/`height` attributes** on the image for aspect-ratio reservation.
8. **Meaningful `alt` text** with styled alt-text box (`background` + font properties on the `<img>`).

## When to load the full Hero Engineering Standard

- Creating a new Hero architecture or pattern
- Debugging a Hero rendering failure across clients
- Commissioning or briefing new Hero artwork (geometry gate, artwork contract)
- Investigating a composition vs geometry failure
- Changing the Hero engineering approach
- Explicitly requested

## What the full standard covers (not needed for routine assembly)

- Geometry gate formula (`W*` critical-width check)
- Aspect-Locked Band + Colour-Bonded Copy architecture
- Artwork Contract (§4.1–§4.7)
- Prohibited Hero architectures (§13, nine patterns)
- Hero Marketing Psychology (§15, four marketing roles)
- Per-client compatibility matrix
