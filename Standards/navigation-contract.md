# Navigation Runtime Contract (Conditional)

Load ONLY when the user explicitly requests a header navigation menu.
**Navigation is opt-in, never the default layout.**

---

## When to include

- User explicitly asks for a header navigation menu
- In-body category-discovery sections (e.g. "Shop by Category" pills) are content sections,
  not a top nav, and are always allowed

## Style Rules (when included)

- **Premium ecommerce feel**, quietly supporting the hero — not a website menu competing with it.
- **No full-width coloured dividers** directly above the hero.
- **Individual decorative underline** beneath each nav item: centred, 2px height, brand accent colour.
  Built as a centred table cell, never `text-decoration:underline`.
- **Spacing:** logo → nav text → 6–8px → underline → 12–15px → hero.
- **Every nav item links to its matching live category page** (verified HTTP 200). Never decorative
  text, never generic homepage as a stand-in.
- **Avoid** vertical separators, bullets, heavy lines, full-width dividers.
- RDD: keep nav treatment **subtle and supporting** — logo and hero remain the visual focus.

## Underline variants (both approved)

- **Fixed-width:** ~20–24px, all underlines identical width
- **Proportional:** ~80–90% of each nav item's text width (more premium, typography-driven)
