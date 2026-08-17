# LIVE_SYSTEM_AUDIT.md

**Klaviyo Campaign Email System — Architecture Audit (Phase 2 Readiness)**
Prepared as a Senior Software Architect / Technical Lead review.
Audit date: **2026-08-07** · Repo branch: `main` · Commits in history: 4 · Files: 652
Scope: read-only architecture audit. **No project files were modified, refactored, or implemented.**

> **One-line verdict:** This repository is a world-class *documentation, governance, and manual-production*
> system for hand-crafted email HTML. It is **not** a live, end-to-end automation system. The only executable
> code is a single, read-only BigCommerce catalog client for one brand — and it is not yet wired into anything.
> Moving to "LIVE" is a **build project, not a refactor**: roughly 85% of the runtime software layer does not
> yet exist.

---

## 1. Current Architecture

### 1.1 What this repository actually is

The system is a **file-driven, prompt-orchestrated email production workspace**. The "engine" is not a running
program — it is **Claude Code (the LLM agent) following the rules in `CLAUDE.md` and the Prompt Library**,
manually assembling HTML from reusable components. The repository is best understood as three overlapping layers:

| Layer | What it is | Runtime? |
|---|---|---|
| **Knowledge / Governance** | `BRD.md` (106 KB), `CLAUDE.md` (131 KB), `00-`…`09-` section folders, `Shared/Engineering/` (ADRs, versioning, change mgmt, QA gates G0–G3), vendored **Cerberus** framework, `Playbooks/`, `07-Prompt Library/` | No — read by humans + the agent |
| **Production framework** | `Components/` (14 brand-neutral HTML partials + `[[TOKEN]]` system), `Templates/` (mostly READMEs; only `weekly-skeleton.html` exists), `Shared/` (design tokens, fonts, snippets, hero standard) | No — templates the agent fills |
| **Work product + integration** | `Brands/<CODE>/Campaigns/<Type>/` six-stage pipeline (Brief → References → Assets → Draft → Review → Output); `Brands/RDD/integration/` (the only code) | Partially — one read-only client |

### 1.2 How a campaign is produced today (the real control flow)

```
Human plans (content-calendar.md)  ─▶  Brief/ (hand-written .md)
        │
        ▼
Claude Code reads CLAUDE.md + BRD + brand doc + Playbook + Generate-<Type> prompt
        │  (manual product verification — human/agent opens BigCommerce or product pages)
        ▼
Draft/<CODE>-YYYY-<id>-draft-vN.html   (hand-assembled from Components + Templates + tokens)
        │
        ▼
Review/ (QA notes, approval status — human, separation of duties CR-16)
        │
        ▼
Output/<CODE>-YYYY-<id>.html  (latest un-versioned build for preview)
        │
        ▼
Human imports into Klaviyo, verifies, schedules, sends   ← ENTIRELY MANUAL, OUTSIDE THE REPO
```

**Key architectural facts established during the audit:**

- **No package manifest anywhere.** No `package.json`, `requirements.txt`, lockfile, `pyproject.toml`, or
  `Makefile`. There is no build, no dependency graph, no reproducible install.
- **No CI/CD.** No `.github/`, no pipelines, no automated tests. `Scripts/` contains only a `README.md`
  describing *future* automation ("deferred").
- **The `[[TOKEN]]` injection system is conceptual, not coded.** `Components/README.md` defines a
  `Brief → Brand Config → Product Data → Components → Template → Final HTML` pipeline, but nothing executes it.
  The tokens are filled by the LLM by hand, not by a renderer.
- **The only executable code is the RDD BigCommerce integration** (3 files):
  - `bigcommerce-client.js` — brand-agnostic, **read-only (GET-only)** v3 Catalog client factory
    (`createBcClient(config)`); pagination, category cache, actionable 401/403 handling, product shaping
    (price, sale price, stock, visibility, `date_modified`). Clean, well-documented, Node ≥18 (`fetch`).
  - `rdd.config.js` — non-secret RDD mapping (featured category IDs, sale category `579`, hero product `1379`,
    domain), reads credentials from `../.env` at runtime.
  - `verify.py` — Python 3 stdlib connectivity smoke test; never prints secrets.
  - **This integration is not imported or called by any generation workflow.** It is a proven, isolated
    building block awaiting orchestration. Per `04-Technical/Integrations.md`, wiring it into generation is
    explicitly "the **next** step … intentionally not done yet."
- **Klaviyo has zero code in the repo.** Only documented dynamic tags (`{% catalog %}`, `{% coupon_code %}`,
  `{% unsubscribe_link %}`, etc.). All Klaviyo interaction — template import, preview, scheduling, sending — is
  manual in the Klaviyo UI.
- **Secrets:** `Brands/RDD/.env` exists on disk with a live token and is **correctly git-ignored**
  (confirmed `git ls-files` returns nothing). It is plaintext on the local disk — acceptable for local dev, but
  a real concern once this runs unattended (see §7).

### 1.3 Brand + campaign maturity (production evidence)

| Brand | Buildable? | Draft HTMLs | Output HTMLs | Notes |
|---|---|---|---|---|
| **RDD** (Retail Display Direct) | Yes | 26 | 6 | Most mature; only brand with a live product integration |
| **SS** (Safety Sector) | Yes | 31 | 4 | Rich campaign history; BigCommerce store hash/token **TBC** |
| **SC** (SectorCare) | Partially | 6 | 2 | Brand doc is a **stub/placeholder**; facts inferred, not confirmed |
| **Stack** | **No** | 0 | 0 | Brand doc is a placeholder — "not buildable" per CLAUDE.md §2 |

All ten campaign types have folder scaffolding, a Playbook, and a Generate prompt for every brand — but the vast
majority of type/brand cells are empty scaffolding, not delivered work.

---

## 2. Strengths (what is already well designed)

1. **Exceptional governance and knowledge architecture.** The BRD, ADR log (ADR-001…008), engineering
   governance/versioning/change-management, QA gates (G0–G3), and the layered source-of-truth hierarchy are of a
   quality rarely seen even in mature engineering orgs. Rules cite stable identifiers (`CR-##`, `CS-##`,
   `WK-P#`). This is a genuine strategic asset and dramatically de-risks the *content* side of going live.
2. **Hard-won, codified rendering knowledge.** `CLAUDE.md` §6.6–§6.23 encodes email-client defects (Apple Mail
   iOS anchor collapse, Gmail gutters, Outlook fixed-height cells, Klaviyo import rewrite, merge-tag leaks) with
   root causes and fixes. Vendored **Cerberus** provides an external cross-check. This is a moat: an automated
   renderer built on these rules starts far ahead.
3. **Clean, correct, security-conscious integration code.** The BigCommerce client is read-only by design, has
   no store coupling (factory pattern), never logs secrets, gives actionable 401/403 errors, and is already
   brand-agnostic. Adding SS/SC/Stack is genuinely "a config file + a `.env`."
4. **Coherent, deterministic file-driven pipeline.** The `Brief → … → Output` model with versioned drafts, an
   un-versioned latest-Output, and approval-as-status (not folder placement) is a sound, auditable design that
   maps cleanly onto a future state machine.
5. **Deliberate separation of planning vs. production**, and of this project from the Klaviyo Flow project, with
   an explicit single-home / no-duplication rule (ADR-007). Prevents drift.
6. **Component reuse discipline.** `Components/` + `Shared/Snippets/base-head.html` + the `[[TOKEN]]` contract
   give a real specification for a future rendering engine to target.

---

## 3. Weaknesses

### 3.1 Missing modules (runtime software that does not exist)
- **No rendering/assembly engine.** The `[[TOKEN]]` → HTML pipeline is documented but never coded. Every email
  is hand-built by the agent, so output is non-deterministic and unrepeatable across runs.
- **No orchestrator / workflow runner.** Nothing advances a send through Brief→Draft→Review→Output
  programmatically; stage transitions are manual file operations.
- **No Klaviyo client.** No code to create templates, campaigns, segments/lists, schedule, or send.
- **No product-data → template binder.** The BigCommerce client returns shaped products, but nothing injects
  them into a component grid.

### 3.2 Missing automation
- No scheduler (the content calendar is a *framework*; there is no dated, machine-readable schedule and nothing
  that triggers a build).
- No automated QA/validation (the extensive QA checklists are human-run prose, not executable assertions).
- No image optimization, link/HTTP-200 verification, or accessibility linting as code (all described as future
  `Scripts/`).
- No coupon/stock verification automation.

### 3.3 Missing integrations
- Klaviyo API — not integrated in-repo (available only as a session MCP connector; see §5).
- BigCommerce — only RDD; SS/SC/Stack pending; and even RDD is not connected to generation.
- No analytics/reporting source, no data warehouse, no webhook ingestion.

### 3.4 Missing documentation (gaps, given how strong the rest is)
- `04-Technical/Data-and-Segments.md` is a **single-line stub** — segment/list strategy for Klaviyo sends is
  effectively undocumented, yet it is core to "campaign creation."
- The six `06-Assets Library/*-Standards.md` files are unpopulated placeholders (acknowledged in CLAUDE.md §2).
- SC and Stack brand docs are stubs; Stack is not buildable.
- Content-calendar timing values (send day/time, lead times, promo cadence) are all `TBC` — a live scheduler
  cannot be built until these are business-decided.

### 3.5 Technical debt / inconsistencies
- **Documentation contradiction:** `Components/README.md` and `07-Prompt Library/00-START-HERE.md` §1.3 both
  reference `Design.md` / `BrandConfig.md` as token sources, but `CLAUDE.md` §2 states **explicitly that those
  files do not exist in this project** and must not be created. The token system's cited inputs therefore point
  at absent files — a real blocker for any automated renderer, and a drift ADR-007 is meant to prevent.
- **No dependency pinning / runtime declaration** beyond prose ("Node ≥18", "Python 3 stdlib"). Not
  reproducible.
- **`.tmp` file (4 KB of live HTML)** sits at repo root — a stray scratch artifact, not part of the model.
- **4 commits total:** effectively no version-control history to reason about change safety; large binary/HTML
  churn will be hard to review without a branching + PR discipline.
- **Manual pipeline = key-person risk.** The "engine" is the agent's adherence to a 131 KB rules file; there is
  no test that proves a build conformed to the rules.

---

## 4. Live Readiness Score

## **Score: 22 / 100**

**Interpretation:** *Excellent foundations, negligible runtime.* The knowledge and governance layer is
world-class (this is why the score is not near-zero), but as an **end-to-end LIVE automation system** almost
nothing runs unattended. This is a system that a skilled operator + LLM can use to hand-produce excellent
emails — it is not a system that autonomously creates, validates, and sends campaigns.

### Score breakdown

| Dimension | Weight | Score | Weighted | Rationale |
|---|---:|---:|---:|---|
| Knowledge / governance / standards | 15 | 95% | 14.3 | Best-in-class; ready |
| Production framework (components/templates) | 10 | 60% | 6.0 | Strong spec, not executed; token-source contradiction |
| Product data integration (BigCommerce) | 15 | 25% | 3.8 | Clean code, 1 of 4 brands, not wired in |
| Klaviyo integration (create/segment/schedule/send) | 20 | 2% | 0.4 | Docs only; no code |
| Rendering / assembly engine | 10 | 0% | 0.0 | Does not exist |
| Orchestration / scheduler | 8 | 0% | 0.0 | Does not exist |
| QA / validation automation | 7 | 5% | 0.4 | Checklists only; `verify.py` connectivity only |
| Error handling / logging / observability | 5 | 10% | 0.5 | Only inside the BC client |
| Reporting / analytics / dashboard | 5 | 0% | 0.0 | Does not exist |
| Testing / CI/CD / reproducibility | 5 | 0% | 0.0 | No manifest, no tests, no CI |
| **Total** | **100** | | **≈ 22** | |

**What would move the needle fastest:** a coded renderer that consumes the `[[TOKEN]]` contract + BigCommerce
products (→ ~40), then a Klaviyo create-template/campaign client with human-gated send (→ ~60).

---

## 5. Missing Components (required before "LIVE end-to-end")

Legend: **[✗]** absent · **[◐]** partial/isolated · **[MCP]** available as a session connector but not wired
into the repo.

### Content & product
- **[◐] BigCommerce API — product retrieval.** RDD read-only client exists; **SS/SC/Stack pending**; not
  connected to generation. Needs: multi-brand config, stock/visibility/HTTP-200 gate as code, image selection.
  *(Also available live as `mcp__…github`-style BigCommerce/**Klaviyo MCP** connectors this session — see note.)*
- **[✗] Product → template binder / rendering engine.** The `[[TOKEN]]` injector that turns shaped products +
  brand config into the approved component grid. **This is the single highest-value missing module.**
- **[✗] Machine-readable Content Calendar** (dated, per-brand, per-type) — currently a framework with all times
  `TBC`. Prerequisite for any scheduler.

### Klaviyo (the entire send side)
- **[✗ / MCP] Campaign creation** (`create_campaign`, `create_email_template`, `assign_template_to_campaign_message`).
- **[✗ / MCP] Segment selection** (`get_segments`, `create_segment`) and **List selection** (`get_lists`).
  ⚠ *Data-and-Segments.md is a one-line stub — the strategy must be defined before this is safe.*
- **[✗ / MCP] Recipient estimation** (`get_campaign_recipient_estimation`) as a pre-send guardrail.
- **[✗ / MCP] Scheduling / send** (`send_campaign`) — **must remain human-gated per CR-16/CR-17.**
- **[✗ / MCP] Coupon verification** (`get_coupon`, `get_coupon_codes`) before send.
- **[✗ / MCP] Preview/render checks** (`render_email_template`, `create_template_preview_send_job`).

> **Note on MCP connectors:** this session exposes a large **Klaviyo** tool surface plus **BigCommerce/GitHub**
> connectors. That means the *capability* to create/segment/schedule already exists at the agent layer — but it
> is **not** part of the repository's automation, has no error handling/logging/approval wiring around it, and
> is unavailable in headless/cron contexts. Treat MCP as a fast path to a prototype, **not** as the production
> integration. Several other connectors (Google Drive, M365, NetSuite, Zapier) require authorization and are
> currently unavailable.

### Approval, QA & safety
- **[◐] Approval workflow** — exists as human status in `Brief/`+`Review/` (CR-16 separation of duties). Needs a
  systemized, auditable gate (who approved, when, against which draft version) before an automated send is even
  conceivable.
- **[✗] QA validation as code** — link/HTTP-200 checker, image-weight + `image/*` + no-redirect checker, ghost-
  element/nested-anchor linter, merge-tag-leak grep, Gmail 102 KB clip check, dark-mode/responsive checks. All
  currently prose in CLAUDE.md §6/§8.
- **[✗] Error handling** — beyond the BC client's try/catch, nothing has failure semantics.
- **[✗] Logging** — no structured run logs, no audit trail of what was built/verified/sent.

### Data export & reporting
- **[✗] CSV export** (e.g. product-verification/mapping tables, recipient counts, send manifests).
- **[✗] Excel export** (stakeholder-facing campaign/QA/verification workbooks).
- **[✗] Reporting** (`get_campaign_report` / `get_flow_report` ingestion; success-metrics rollup).
- **[✗] Dashboard** (status of every send across brands/types; QA pass/fail; approval state; calendar view).

### Platform / engineering
- **[✗] Scheduler / job runner** (cron/queue) to trigger builds and hand approved sends to Klaviyo.
- **[✗] Testing** (unit tests for the renderer + integrations; golden-file/snapshot tests for HTML;
  contract tests for BigCommerce/Klaviyo).
- **[✗] CI/CD** (`.github/` pipeline: lint HTML, run QA validators, run tests on PR).
- **[✗] Dependency management & reproducible runtime** (`package.json` / lockfile; pinned Python env).
- **[✗] Secrets management** (vault/parameter store; key rotation) for unattended operation.
- **[✗] Configuration module** (per-brand + per-environment config; today it is scattered `.env` + `*.config.js`).

---

## 6. Recommended Roadmap

Phased so each phase is independently valuable and human-in-the-loop is preserved until the very end. Effort
sizes are relative (S/M/L).

### Phase 0 — Foundations & hygiene *(prerequisite, S)*
- Add `package.json` + lockfile and a pinned Python env; declare Node ≥18. Make the repo reproducible.
- Resolve the `Design.md`/`BrandConfig.md` vs. CLAUDE.md §2 contradiction (decide the real brand-config source
  and correct the token docs). **This unblocks the renderer.**
- Establish branching + PR discipline; move `.tmp` out of root; add `.editorconfig`/formatters.
- Stand up structured logging + a config module. No behavior change to email output.

### Phase 1 — Core Engine (deterministic renderer) *(M–L)*
- Build the coded `[[TOKEN]]` rendering engine: brand config + product data + `Components/` + `Templates/` →
  HTML, byte-conformant to the approved reference outputs.
- Port the CLAUDE.md §6/§8 rules into **automated QA validators** (link/HTTP-200, image weight/type, ghost
  elements, nested anchors, merge-tag leaks, 102 KB clip).
- Golden-file tests against existing approved `Output/` HTML so the engine provably matches the hand-built bar.

### Phase 2 — Klaviyo Integration *(M)*
- Coded, in-repo Klaviyo client: create/update email template, create campaign, assign template, render preview,
  recipient estimation.
- **Segment & list selection** — but first, write the missing `Data-and-Segments` strategy.
- **Send stays human-gated:** a systemized approval record (approver ≠ author, draft version, timestamp) is a
  hard precondition to any `send_campaign` call. Start with "prepare + schedule as draft in Klaviyo; a human
  presses send."

### Phase 3 — BigCommerce (all brands) + product automation *(M)*
- Add SS/SC/Stack configs + `.env`s to the existing brand-agnostic client (confirm store hashes/tokens first).
- Automated stock/visibility/HTTP-200 verification with a **CSV/Excel verification-and-mapping export** for
  stakeholder approval (matches the §5.4 launch process).
- Wire verified products into the Phase-1 renderer.

### Phase 4 — Scheduler, Reporting & Exports *(M)*
- Machine-readable content calendar + a scheduler/job runner that triggers builds ahead of send dates.
- `get_campaign_report` ingestion → success-metrics rollup; CSV/Excel exports for stakeholders.
- Full error handling, retries, and audit logging across all integrations; CI running validators + tests.

### Phase 5 — Dashboard & Optimization *(L)*
- Operational dashboard: every send's stage, QA pass/fail, approval state, calendar, per-brand health.
- A/B testing framework and analytics feedback loop into templates/standards (roadmap Horizon 3).

---

## 7. Risks (before going live)

| # | Risk | Severity | Why it matters | Mitigation |
|---|---|---|---|---|
| R1 | **Automated/erroneous send to a real list** | **Critical** | Klaviyo send is irreversible and outbound to customers; MCP already exposes `send_campaign`. | Keep send human-gated (CR-16/17); systemized approval record; hard block on any auto-send until Phase 4+ with guardrails. |
| R2 | **Secret exposure / no rotation** | High | Live BigCommerce token sits in plaintext `.env`; unattended runs need vaulting + rotation; more brands = more secrets. | Secrets manager, least-privilege (read-only scope already good), rotation policy, never log values (already honored). |
| R3 | **Non-deterministic output (agent-built HTML)** | High | No renderer/tests means the same brief can yield different HTML; email-client regressions slip through despite the rulebook. | Phase 1 coded renderer + golden-file/snapshot tests + automated QA validators. |
| R4 | **Sending against the wrong segment/list** | High | Segment strategy is undocumented (one-line stub); wrong audience = deliverability + reputation damage. | Define Data-and-Segments; recipient estimation as a pre-send gate; require explicit list confirmation. |
| R5 | **Dead links / hidden products / stale stock in a live send** | High | Known failure mode (§5.4, 9 of 13 launch SKUs were hidden); manual verification does not scale. | Automated HTTP-200 + visibility + stock gate that **blocks** promotion/send. |
| R6 | **Documentation drift causes engine to build on absent inputs** | Medium | `Design.md`/`BrandConfig.md` contradiction; SC/Stack stubs; TBC calendar values. | Resolve in Phase 0; treat brand/config completeness as a build precondition. |
| R7 | **Klaviyo/BigCommerce API changes, rate limits, outages** | Medium | No retry/backoff/error handling outside the BC client; no monitoring. | Centralized clients with retries, rate-limit handling, alerting; contract tests. |
| R8 | **No reproducible runtime / no CI** | Medium | "Works on my machine"; no gate catches regressions before send. | Phase 0 manifests + Phase 4 CI running validators and tests on every PR. |
| R9 | **Key-person / agent-dependency risk** | Medium | The "engine" is adherence to a 131 KB rules file; if the agent or operator changes, quality varies. | Encode rules as tests/validators so conformance is machine-checked, not memorized. |
| R10 | **Compliance (unsubscribe/consent/AU spam law)** | Medium | Automated sending raises consent/CAN-SPAM/Australian Spam Act obligations; merge-tag footer bugs already seen (§6.23). | Automated footer/merge-tag validation; consent checks in the send gate; legal review before any automation of send. |

---

## Appendix A — Audit method & evidence

- **Structure:** enumerated all non-`.git` directories and files (652 files: 258 `.md`, 208 `.gitkeep`, 117
  `.html`, plus images). Confirmed **no** `package.json`/`requirements.txt`/lockfile/CI anywhere outside vendored
  Cerberus.
- **Code reviewed in full:** `Brands/RDD/integration/bigcommerce-client.js`, `rdd.config.js`, `verify.py`,
  `integration/README.md`, `.env.example`. Confirmed read-only, no store coupling, no secret logging.
- **Governance/planning reviewed:** `CLAUDE.md`, `README.md`, `04-Technical/{Integrations,Product-Source,
  Data-and-Segments}.md`, `05-Future/roadmap.md`, `00-Project Overview/{content-calendar,human-workflow}.md`,
  `07-Prompt Library/00-START-HERE.md`, `Components/README.md`, `Shared/Engineering/` (register), Decision-Log
  (`D-01…D-08`).
- **Production evidence:** counted Draft/Output HTML per brand (RDD 26/6, SS 31/4, SC 6/2, Stack 0/0).
- **Security:** confirmed `Brands/RDD/.env` is git-ignored and untracked (`git ls-files` empty). Live token value
  is **not** reproduced in this report.
- **Constraint honored:** no project files were modified, refactored, or created except this audit report.

## Appendix B — Notable contradictions/anomalies to resolve (Phase 0 checklist)

1. `Design.md` / `BrandConfig.md` referenced by `Components/README.md` + `00-START-HERE.md` but declared
   non-existent by `CLAUDE.md` §2. → decide the real brand-config source, correct docs.
2. `04-Technical/Data-and-Segments.md` is a single-line stub. → write before any Klaviyo send automation.
3. `06-Assets Library/*-Standards.md` (6 files) are unpopulated placeholders.
4. SC brand doc is a stub (facts inferred); Stack brand doc is a placeholder (**not buildable**).
5. Content-calendar send days/times/lead-times are all `TBC` (business decisions). → required for a scheduler.
6. Stray `.tmp` (4 KB HTML) at repo root.
7. Only 4 commits — establish PR/branch discipline before multi-developer/live work.

_End of audit._
