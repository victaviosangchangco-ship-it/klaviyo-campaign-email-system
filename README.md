# Klaviyo Campaign Email System

The single, unified repository for every Weekly & Monthly Klaviyo campaign, across all brands. It
holds **both** the planning documentation (the BRD and its sections) **and** the file-driven
production workspace where campaigns are briefed, generated, reviewed, and shipped. It is a
completely separate project from the Klaviyo Flow project and mirrors that project's philosophy
(per-brand folders + a clear pipeline per work unit).

## Planning vs. production

- **Planning** — `BRD.md` (the compiled master) and the numbered section folders
  (`00-Project Overview/` … `09-Architecture Decisions/`). These define the *rules*: requirements
  (`CR-##`), standards (`CS-##`), structures (`WK-S#`/`MO-S#`), and process (`WK-P#`/`MO-P#`).
- **Production** — `Brands/`, `Components/`, `Templates/`, `Shared/`, `Scripts/`. These *execute*
  the rules; they never restate them.

`BRD.md` is a compiled, read-only artifact — edit the modular section folders and regenerate it.

## Project structure

```
Klaviyo Campaign Email System/
├── CLAUDE.md                  Operational guide for Claude Code (read order, workflow, rules)
├── README.md                  This file — the project entry point
│
│   # ---- Planning (the BRD) ----
├── BRD.md                     Compiled master BRD (read-only; regenerated from the sections)
├── 00-Project Overview/       Exec summary, objectives, scope, stakeholders, requirements, standards
├── 01-Weekly Campaign/        Weekly cadence: structure (WK-S#) + process (WK-P#)
├── 02-Monthly Campaign/       Monthly cadence: structure (MO-S#) + process (MO-P#)
├── 03-Brands/                 Brand DOCUMENTS (SS.md, RDD.md, SC.md, Stack.md, Shared.md)
├── 04-Technical/              Assets, product source, dynamic content, integrations, data
├── 05-Future/                 Roadmap / deferred enhancements
├── 06-Assets Library/         Asset standards (logos, icons, banners, buttons, product, social)
├── 07-Prompt Library/         Reusable generation/review/QA prompts
├── 08-Glossary/               Terms
├── 09-Architecture Decisions/ ADR log (ADR-###)
│
│   # ---- Production (the framework + work) ----
├── Templates/                 Reusable email skeletons + brief scaffolds
│   ├── Documentation/         BRD-authoring scaffold (brd-section-template.md)
│   ├── Weekly/                weekly-skeleton.html + brief-template.md (WK-S/WK-P)
│   └── Monthly/               (MO-S/MO-P — pending)
├── Components/                Reusable brand-neutral HTML partials (the framework building blocks)
├── Brands/                    Brand-specific production WORK (SS, RDD, SC, Stack)
│   └── <CODE>/
│       ├── Assets/            evergreen brand assets (Logos, Icons, References)
│       └── Campaigns/<Weekly|Monthly>/  Brief · References · Assets · Draft · Review · Output
├── Shared/                    Brand-agnostic resources (Assets, Snippets, Fonts)
└── Scripts/                   Future automation (deferred)
```

Note the deliberate pairing: `03-Brands/` holds brand **documents** (planning); `Brands/` holds brand
**work** (production). Same subject, different responsibility.

## The Email Framework (production engine)

`Components/` + `Templates/` + `Shared/` form a deterministic engine. Data is **injected** into an
existing framework — HTML is never rebuilt from scratch:

```
Brief → Brand Configuration → Product Data → Components → Template → Final HTML
```

Framework slots use `[[TOKEN]]`; Klaviyo Liquid (`{{ }}` / `{% %}`) passes through untouched. Full
framework/token reference: [`Components/README.md`](Components/README.md).

## The campaign pipeline (per send)

Every send moves through six stages in `Brands/<CODE>/Campaigns/<Weekly|Monthly>/`, mapped to the BRD
process steps:

| Stage | Folder | BRD step |
|-------|--------|----------|
| 1. Brief | `Brief/` | WK-P1 / MO-P1 |
| 2. Reference | `References/` | WK-P1/P3 · MO-P1/P3 |
| 3. Assets | `Assets/` | WK-P3 / MO-P3 |
| 4. Generate | `Draft/` | WK-P4 / MO-P4 |
| 5. Review + QA | `Review/` | WK-P5–P6 · MO-P5–P6 |
| 6. Output | `Output/` | WK-P7–P8 · MO-P7–P8 |

Final HTML lives **only** in each send's `Output/` — the single source of truth. No top-level Output.

## Asset scope ladder

```
Shared/Assets            all brands
  └ Brands/<CODE>/Assets  one brand, evergreen (logos, icons, references)
      └ Campaigns/<cadence>/Assets   one send
```

## Current status

- Weekly framework built (`Components/`, `Shared/Snippets`, `Templates/Weekly`). Monthly pending.
- BRD: sections 00–03 substantially drafted; 04–09 and brand docs RDD/SC/Stack in progress.
- Brand facts sourced from approved `BrandConfig.md` / `Design.md` (Flow project) + `03-Brands`;
  whether those become owned here is deferred until after BRD review.

_Last updated: 2026-07-10._
