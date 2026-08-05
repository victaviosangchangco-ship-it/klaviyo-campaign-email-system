# Template — Product Launch

The Product Launch build reuses the shared framework (`../../Components/`, `../../Shared/`) — only the
**section order and hero treatment** differ from Weekly. There is no separate CSS/markup system; a launch
is the shared components assembled in the launch order.

## Canonical section order
`Header → Hero banner → Launch badge → Headline → Introduction → "Why these products" → Product grid →
CTA → Trust section → Footer.`

## Components used
- `header.html` · `hero.html` (typographic launch panel, visual-only, no price) · `product-grid.html` +
  `product-card.html` (balanced, fully-clickable per §6.6) · `CTA.html` (bulletproof) ·
  `trust-strip.html` · `footer.html` · `Shared/Snippets/base-head.html` + `preheader.html`.

## Reference implementation
The first production launch is the canonical worked example — copy its structure, not its content:
`../../Brands/RDD/Campaigns/Product Launch/Draft/RDD-2026-LAUNCH-access-safety-range-draft-v1.html`.

## Rules that make a launch a launch
- Read [`../../Playbooks/Launch-Playbook.md`](../../Playbooks/Launch-Playbook.md) and
  [`../../07-Prompt Library/Generate-Product-Launch-Campaign.md`](../../07-Prompt%20Library/Generate-Product-Launch-Campaign.md).
- Approved SKUs only; verify each via the BigCommerce API (visible + in stock + non-zero price + live URL
  200) before it enters the grid (CLAUDE.md §5.4). Hidden/404 products never link in a shippable build.
- Email-client safety is mandatory: no `<a display:block>` around images, no `<a>` around a `<table>`,
  explicit `width`/`height` on fixed images, full-width tables carry `width:100%` inline (CLAUDE.md §6.6).
- QA with [`../../07-Prompt Library/QA-Launch-Checklist.md`](../../07-Prompt%20Library/QA-Launch-Checklist.md).
