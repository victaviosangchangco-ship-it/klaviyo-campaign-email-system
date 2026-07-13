# Shared/ — brand-agnostic shared resources

Reusable resources shared across **every brand and cadence** — not tied to one brand or one send.

- **`Assets/`** — shared image assets any brand can use (payment icons, generic social icons,
  spacers/dividers). Brand-specific images live under `Brands/<CODE>/Assets/` or a send's `Assets/`.
- **`Snippets/`** — shared *technical* HTML fragments that a Template assembles around the
  Components: `base-head.html` (doctype + head + shared `<style>`: resets, 600px container,
  responsive, dark-mode) and `preheader.html`.
- **`Fonts/`** — the shared email-safe font-stack policy (`font-stacks.md`) and any hosted-font
  references. Brand typefaces themselves live in each brand's `Design.md`.

## How this differs from Components/ and Templates/

- **Components/** = body content blocks mapped to `WK-S#`/`MO-S#` (header, hero, CTA, …).
- **Templates/** = full email skeletons that assemble Components.
- **Shared/** = the common technical fragments and resources those are built from.

Automation belongs in `Scripts/`, not here. This folder is for reusable *resources*, not tooling.
