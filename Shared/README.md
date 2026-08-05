# Shared/ — brand-agnostic shared resources

Reusable resources shared across **every brand and cadence** — not tied to one brand or one send.

- **`Creative-Workflow-Standard.md`** — 🎨 the **official first document to read before any new email
  design**, shared with the Klaviyo Flow project and mirrored byte-identically. It fixes the order of
  execution — **Creative → Marketing → Engineering → Implementation → Validation → Output** — and states
  that engineering is never the first design activity. It holds **no build rules and no brand or campaign
  values**: it governs *when* the other standards are applied, and requires engineering to **preserve** an
  approved creative direction rather than replace it. Its §9 worked lifecycles are deliberately Flow-only;
  this project uses §1–§8, which are project-neutral. See `CLAUDE.md` §3 item 0.
- **`Email-Design-System/`** — 🎨 the **visual language library** (STD-DESIGN), shared with the Klaviyo Flow
  project and mirrored byte-identically. 14 design languages, 12 Hero patterns, 16 section patterns, the
  visual-hierarchy principles and the Design Decision Matrix. Read during the creative phase that
  `Creative-Workflow-Standard.md` requires — that document supplies the **when**, this folder supplies the
  **what**. It holds **no HTML, no CSS, no brand or campaign values and no measurements**: relationships and
  decisions only. Start at `Email-Design-System/README.md`, then `Design-Decision-Matrix.md`. Its
  `Flow-Design-Recommendations.md` is Flow-specific; the other five documents are project-neutral. See
  `CLAUDE.md` §3 item 0b.
- **`Engineering/`** — the **engineering governance layer**, shared with the Klaviyo Flow project and
  mirrored byte-identically. Holds **no build rules**: it records *why* engineering decisions were made
  (ADRs), *where* knowledge lives, *who* may change a standard, *how* a change is proposed and released,
  and *how* conformance is proven (gates G0–G3). Start at `Engineering/README.md`; its §3 is the
  **Standards Register**, the authoritative index of every engineering standard. See `CLAUDE.md` §3.1.
- **`Email-Hero-Engineering-Standard.md`** — 📐 the **single source of truth for every Hero** in this
  project and in the Klaviyo Flow project (mirrored, both canonical). Mandatory reading **before**
  designing, briefing, exporting or building any Hero, and a **gate**: its geometry check is computed
  before artwork is commissioned. It supersedes the Hero rules that previously lived in `CLAUDE.md` §6.15
  (`CLAUDE.md` §6.13-H).
- **`Assets/`** — shared image assets any brand can use (payment icons, generic social icons,
  spacers/dividers). Brand-specific images live under `Brands/<CODE>/Assets/` or a send's `Assets/`.
- **`Snippets/`** — shared *technical* HTML fragments that a Template assembles around the
  Components: `base-head.html` (doctype + head + shared `<style>`: resets, 600px container,
  responsive, dark-mode) and `preheader.html`.
- **`Fonts/`** — the shared email-safe font-stack policy (`font-stacks.md`) and any hosted-font
  references. Brand typefaces themselves live in each brand's `Design.md`.
- **`Frameworks/Cerberus/`** — the **official HTML email reference framework** (vendored, unmodified),
  plus five analysis documents and a 13-file reference component library. Read
  `Frameworks/Cerberus/FRAMEWORK-README.md` before any HTML build (`CLAUDE.md` §6.20). It is a
  *reference*, not a runtime dependency: production markup stays in `Components/` and `Snippets/`.
  **Never edit an upstream Cerberus file.**

## How this differs from Components/ and Templates/

- **Components/** = body content blocks mapped to `WK-S#`/`MO-S#` (header, hero, CTA, …).
- **Templates/** = full email skeletons that assemble Components.
- **Shared/** = the common technical fragments and resources those are built from.

Automation belongs in `Scripts/`, not here. This folder is for reusable *resources*, not tooling.
