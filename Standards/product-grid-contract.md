# Product Grid Runtime Contract

Authoritative implementation: `Components/product-card.html` + `Components/product-grid.html`.
Responsive classes: `Shared/Snippets/base-head.html`.
Full engineering history: `Archive/CLAUDE-LEGACY.md` §6.8/§6.9/§6.17.

---

## Invariants (never change during normal generation)

1. **2-column desktop grid.** Two cards per row. Different column count only when explicitly requested.
2. **Fixed-height `<td>` regions** are the equal-height mechanism — not `min-height`, not flexbox/grid.
   Each card reserves: image · title (2 lines) · description (2 lines) · price · CTA/status.
   `<td height="N">` + `style="height:Npx"` — the one sizing primitive Outlook honours.
3. **Image / title / price are separate sibling anchors** to the same product URL.
   Never wrap a `<table>` inside an `<a>`.
4. **Price badge = shrink-to-fit centred `<table>`**, fill+radius on the `<td>`, price as inline `<a>`
   inside. Never a bare `display:inline-block` anchor. Never `%` or fixed width on the badge.
5. **Odd final card centred** with `colspan` spanning the full grid width, then a nested table with
   `align="center"` at a fixed pixel width = one column. The `colspan` is essential — without it the
   card stays left-aligned.
6. **Mobile stacking:** `.pc{display:block!important;width:100%!important;box-sizing:border-box!important}`.
   Fixed heights reset: `.pimg,.pnc,.pdc,.ppc{height:auto!important}`.
7. **Brand mark exclusion:** `.pc img.brandmark{width:15px!important;max-width:15px!important}` —
   prevents mobile `img{width:100%}` from enlarging small icons.
8. **Table/cell `bgcolor`** on every coloured section (both `<table>` and `<td>`).
9. **Never put `height` and `padding` on the same cell.** Different box-model engines size differently.

## Normal generation

Fill the existing component with verified product data. Replace `[[TOKEN]]`s. Do NOT reimplement the
component. If a campaign appears to need new structural HTML for the grid, STOP and report why.

## Equal-height card rows (trust strips, feature rows, etc.)

Any row of cards with variable-length text uses the same pattern:
- `table-layout:fixed` + equal `<td width="(100/N)%">` cells
- Reserved-height `.tct` (heading) and `.tcs` (sub-text) cells
- Mobile reset: `.tct,.tcs{height:auto!important}`
- Never `height` + `padding` on the same cell

See `Components/trust-strip.html` for the approved implementation.
