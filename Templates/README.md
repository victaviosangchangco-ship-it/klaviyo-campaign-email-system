# Templates/ — reusable campaign starting points

Reusable starting points, grouped by responsibility. `Documentation/` holds the BRD-authoring
scaffold; the cadence folders hold email skeletons + brief scaffolds.

- **`Documentation/`** — `brd-section-template.md`, the scaffold for authoring new BRD sections
  (planning), kept here to avoid a separate top-level folder.

Each cadence folder holds two reusable, brand-neutral artifacts:

- **`Weekly/`**
  - `weekly-skeleton.html` — assembles Components in `WK-S1 → WK-S8` order (the email skeleton).
  - `brief-template.md` — the Stage-1 brief scaffold (`WK-P1`); copied into a send's `Brief/`.
- **`Monthly/`** — the `MO-S1 → MO-S9` skeleton (incl. editorial intro + multi-feature roundup) and a
  monthly brief scaffold. *(Pending — not yet built.)*

A send starts by copying the cadence's `brief-template.md` into its `Brief/`, then generating from the
skeleton + `Components/` with brand values injected at generation.

Skeletons and briefs are **brand-neutral** — no colours, logos, URLs, or typography. See
[`../Components/README.md`](../Components/README.md) for the framework, token convention (`[[TOKEN]]`),
and assembly (`ASSEMBLE:`) rules.
