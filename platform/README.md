# Automation Platform — MVP (`platform/`)

The runtime code for the **AI-Powered File-Driven Email Automation Platform**. This MVP implements the
first end-to-end slice of [`LIVE_SYSTEM_ARCHITECTURE_V2.md`](../LIVE_SYSTEM_ARCHITECTURE_V2.md): a
marketer runs one command and the engine reads the brand context, retrieves **live** products from
BigCommerce (read-only), assembles an on-brand Weekly email from the **existing** components, runs
automated QA, and exports a review-ready **campaign package**.

> **The engine prepares; a human sends.** Nothing in this platform sends or schedules anything — the
> FINAL MVP (`--klaviyo`) stops at a review-ready Klaviyo **draft**.

## The FINAL MVP — one command, full live workflow

```bash
node platform/engine/cli.js create --brand RDD --klaviyo
```

Runs, end to end: read the Content Calendar → resolve the campaign → retrieve live products (BigCommerce) →
generate HTML → **QA gate** → resolve List/Segment → **create or reuse** the Klaviyo draft → upload/update
the HTML template + attach → recipient estimate → one review summary. Orchestrator:
[`platform/workflow/live-orchestrator.js`](workflow/live-orchestrator.js). It reuses every module and
**never sends/schedules/publishes**; every result is `NOT_APPROVED_TO_SEND`.

Backward compatible: **without** `--klaviyo`, `create` behaves exactly as the earlier pipeline-only MVP
(build → QA → export a package; no Klaviyo).

---

## Quick start

```bash
# FINAL MVP — full live end-to-end (real products, Klaviyo draft; nothing sent):
node platform/engine/cli.js create --brand RDD --klaviyo

# Pipeline only (no Klaviyo) — writes the package into the pipeline:
node platform/engine/cli.js create --brand RDD --type weekly --commit

# Safe dry-run to a sandbox (never touches Brands/); add live link verification:
node platform/engine/cli.js create --brand RDD --dry-run --verify-links

# Offline replay of the last real capture (no network):
node platform/engine/cli.js create --brand RDD --source snapshot --dry-run

# Tests (deterministic, offline):
npm test
```

Requires **Node ≥ 18** (uses built-in `fetch`). Zero runtime dependencies.

### Flags
| Flag | Meaning |
|---|---|
| `--brand <CODE>` | Brand (default `RDD`; SS/SC/Stack not buildable yet — CLAUDE.md §2). |
| `--type weekly` | Campaign type (MVP = weekly). |
| `--source live\|snapshot\|fixture` | Product source. `live` = BigCommerce (default); `snapshot` = replay last real capture; `fixture` = synthetic test data. |
| `--fixture <path>` | Fixture JSON (implies `--source fixture`). Tests/dev only. |
| `--verify-links` | Run the live HTTP-200 check on every product/CTA/image URL (§8/§8.1). |
| `--dry-run` / `--commit` | Write to a sandbox (`runtime/exports/`) / into the governed `Brands/` pipeline. |
| `--debug` | Verbose logging. |

**Write target safety:** `fixture` and `--dry-run` always write to `runtime/exports/<campaignId>/` so
synthetic/test data can never overwrite approved work in `Brands/`. Real `live`/`snapshot` runs write into
`Brands/<CODE>/Campaigns/Weekly/` (new `Draft/-vN` + mirrored `Output/`, per CLAUDE.md §4.1/§9).

---

## What the run produces (the campaign package)

For `RDD-2026-W32` a run writes:

| File | What |
|---|---|
| `Output/RDD-2026-W32.html` | the email (un-versioned latest, §9) |
| `Draft/RDD-2026-W32-draft-vN.html` | versioned draft (history kept, §4.1) |
| `Output/RDD-2026-W32-package.json` | manifest: **subject, preview text**, product count, QA summary, `sendStatus` |
| `Output/RDD-2026-W32-products.json` / `.csv` | the verified **product data** |
| `Output/RDD-2026-W32-qa-report.md` | the **QA report** (also copied to `Review/`) |
| `runtime/logs/<runId>.json` | structured audit trail |

Every manifest carries `sendStatus: NOT_APPROVED_TO_SEND` — presence in `Output/` is preview only.

---

## Architecture (module map)

```
platform/
├── engine/          Automation Engine — run lifecycle + CLI (Arch V2 §2.1)
│   ├── cli.js         arg/intent parsing
│   └── run.js         boot, context, error taxonomy, "ready for review" summary
├── workflow/        Workflow Engine — the staged state machine (§2.2)
│   └── pipeline.js    resolve-slot → retrieve → decide → render → qa → export
├── ai/              AI Decision Engine (§2.4) — curation + copy (DETERMINISTIC in MVP; LLM seam here)
│   └── copy.js
├── render/          Rendering Engine (§2.5) — [[TOKEN]] → HTML from existing components
│   ├── tokens.js      substitution + conditional-aware comment stripper (§8.3)
│   └── renderer.js    assembles Templates/Weekly/weekly-skeleton.html + Components/*
├── integrations/    Integration Layer (§2.5/§6)
│   ├── bigcommerce/   wraps the existing read-only client; live/snapshot/fixture modes
│   └── calendar/      resolves "this week" (ISO week) from config/content-calendar.json
├── qa/              QA Layer (§2.6) — executable §6/§8 validators + report
├── export/          Export Layer (§2.7) — HTML + CSV/JSON + manifest + QA report
├── common/          logging (secret-safe), typed errors, config loader, fs utils (§2.8/§2.9)
└── tests/           golden-file (determinism) + validator + curation tests
```

The engine **reads and writes the existing file-driven folders** — it does not fork them. Brand facts +
design tokens come from [`config/brands/RDD.config.json`](../config/brands/RDD.config.json) (the single
brand-config source, resolving the audit's `Design.md`/`BrandConfig.md` contradiction). Markup comes from
the existing [`Components/`](../Components) + [`Templates/Weekly/`](../Templates/Weekly) — **never rebuilt**.

---

## Design decisions worth knowing

- **Deterministic renderer.** Same config + same products → byte-identical HTML. This is enforced by a
  golden-file test, so a regression is caught before it ships. The AI Decision Engine (`ai/copy.js`) is
  deterministic in the MVP and is the documented swap-point for a Claude Agent SDK call in a later phase —
  the module boundary does not change when that happens.
- **Never fabricate (CLAUDE.md §5/§5.1).** Missing brand fact → `RenderError` (STOP). Too few verified
  products → `ApprovalRequired`. Live retrieval failure → `IntegrationError` (never fake data).
- **Curation = verification.** Hidden (`is_visible:false`), disabled, unpriced, imageless, or URL-less
  products are dropped; the set is trimmed to an even count for a clean 2-col grid (§6.9).
- **QA severity split.** Genuine send-breakers block (empty href, table-in-anchor, nested anchors,
  unresolved tokens, non-HTTPS/empty image, merge-tag-in-attribute, >102KB); a blocker is recorded, not
  hidden, and the build still lands in Output/ for preview (§4.1).
- **Reuse over duplication.** The renderer loads `weekly-skeleton.html` and expands its `ASSEMBLE`
  markers with the real components, injecting `[[TOKEN]]`s and stripping descriptive comments while
  preserving MSO conditionals (§8.3). No component markup is copied into the platform.

---

## What is intentionally NOT here (next phases — Arch V2 §8)

Klaviyo client · segment/list selection · scheduling · **sending** · Excel export · dashboard · multi-brand
(SS/SC/Stack) · non-Weekly types · CI. See the roadmap in `LIVE_SYSTEM_ARCHITECTURE_V2.md` §8.

## Manual pre-send gate (still required — §8.1)

Automated QA is necessary, not sufficient. Before any real send a human must verify in Klaviyo Preview ·
Gmail (web + mobile) · Apple Mail · Outlook, confirm clickability **after Klaviyo import**, and record
approval by a reviewer who is not the author (CR-16/CR-17).
