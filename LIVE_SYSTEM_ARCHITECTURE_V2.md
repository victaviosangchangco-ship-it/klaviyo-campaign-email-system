# LIVE_SYSTEM_ARCHITECTURE_V2.md

**Klaviyo Campaign Email System → AI-Powered File-Driven Automation Platform**
Architecture design for the LIVE system. Prepared as Principal Software Architect / AI Systems Engineer.
Companion to [`LIVE_SYSTEM_AUDIT.md`](LIVE_SYSTEM_AUDIT.md). Design date: **2026-08-07**.

> **This is a design document only.** No production code is written, no existing file is modified or
> refactored. It defines the target architecture so implementation can begin in a structured, scalable way,
> and it isolates the **MVP** needed for a live management demonstration.

**Two principles govern every decision below:**
1. **The file-driven system stays the system of record.** The platform *drives* `Brief → References →
   Assets → Draft → Review → Output`; it does not replace it. Every module reads and writes those same
   folders. The rulebook (`CLAUDE.md`, BRD, Playbooks, Cerberus) remains the source of truth — the platform
   *executes* it, never contradicts it.
2. **Humans stay in charge of the send.** The platform can build, verify, export, and *prepare* a Klaviyo
   campaign, but it **never sends autonomously**. A Klaviyo campaign is created as a **DRAFT**; a human
   approver (never the author — CR-16/CR-17) presses send. This holds through every phase, including the demo.

---

## 1. Vision

### 1.1 What the LIVE system is

Today a campaign is hand-built by an operator guiding the agent through a 131 KB rulebook. In the LIVE system,
a marketer types a single natural-language instruction and the platform executes the entire deterministic
pipeline around an AI reasoning core — retrieving live products, assembling the email from approved
components, running automated QA, exporting the HTML, and **preparing a review-ready Klaviyo draft** — then
hands a human a concise "ready for review" package.

> **The one-sentence promise:** *"Create this week's RDD campaign"* → in minutes, a fully-built, QA-passed,
> on-brand email with verified live products, staged in `Output/` **and** as a Klaviyo draft campaign with the
> correct segment pre-selected — waiting for a human to review and approve.

### 1.2 How the marketing team uses it

| Role | Before (manual) | After (LIVE) |
|---|---|---|
| **Campaign Manager** | Writes brief, chases products, briefs the build | Types the intent; reviews a generated brief + draft; approves or requests changes |
| **Content/Designer** | Hand-assembles HTML, verifies links/stock manually | Reviews AI-built draft; edits copy/creative where judgment is needed |
| **Reviewer/Approver** | Manual QA against a long checklist | Reads the **automated QA report** (pass/fail + blockers); approves the send in Klaviyo |
| **Stakeholders** | Ad-hoc updates | A dashboard + CSV/Excel exports showing every send's stage, QA state, and approval |

### 1.3 What "done" looks like at the demo

A senior manager watches a marketer type one line. Live, on screen: real RDD products stream in from
BigCommerce, an on-brand Weekly email assembles, an automated QA report turns green (with any real blockers
shown honestly), the HTML lands in `Output/`, and a **draft campaign appears in Klaviyo** with the right
audience selected. The marketer clicks into Klaviyo, previews it, and says: *"and a human approves the send
here."* No email is sent during the demo.

---

## 2. Runtime Architecture

### 2.1 Layered view

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ENTRY / INTERFACE                                                             │
│  CLI  ("campaign create …")   ·   Claude Code chat   ·   (future) Dashboard    │
└───────────────┬────────────────────────────────────────────────────────────── ┘
                │ natural-language intent + flags
                ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  AUTOMATION ENGINE  (the orchestrator process)                                 │
│  • boots config + logging   • loads run context   • owns the run lifecycle     │
└───────────────┬────────────────────────────────────────────────────────────────┘
                │
     ┌──────────┴───────────┐
     ▼                      ▼
┌──────────────┐   ┌────────────────────────────────────────────────────────────┐
│ WORKFLOW     │   │ AI DECISION ENGINE  (Claude — reasoning + orchestration)     │
│ ENGINE       │◀─▶│ interprets intent · picks type · curates products · writes   │
│ (state       │   │ copy · fills [[TOKENS]] · chooses segment · adjudicates QA   │
│  machine)    │   └───────────────┬────────────────────────────────────────────┘
└──────┬───────┘                   │ issues typed tasks
       │ advances stages           ▼
       │              ┌──────────────────────────┐
       └─────────────▶│  TASK DISPATCHER         │  routing · concurrency · retries · timeouts
                      └──────────┬───────────────┘
                                 │ calls modules with validated inputs
        ┌────────────────────────┼───────────────────────────────────────────────┐
        ▼                        ▼                        ▼                        ▼
┌───────────────┐   ┌────────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ INTEGRATION   │   │ RENDERING ENGINE   │   │ QA LAYER         │   │ EXPORT LAYER     │
│ LAYER         │   │ [[TOKEN]] → HTML   │   │ automated        │   │ HTML · CSV/XLSX  │
│ BigCommerce · │   │ from Components/   │   │ validators       │   │ · Klaviyo draft  │
│ Klaviyo ·     │   │ + Templates/      │   │ (CLAUDE §6/§8)   │   │ push             │
│ Calendar      │   └────────────────────┘   └──────────────────┘   └──────────────────┘
        │                        │                        │                        │
        └────────────────────────┴───────────┬────────────┴────────────────────────┘
                                              ▼
                        ┌──────────────────────────────────────────┐
                        │ CROSS-CUTTING:  LOGGING  ·  ERROR HANDLING │
                        │ structured run log + audit trail; typed    │
                        │ errors, retries, blockers, escalation      │
                        └──────────────────────────────────────────┘
                                              │
                                              ▼
        FILE-DRIVEN SYSTEM OF RECORD  (unchanged folders, now machine-written)
        Brands/<CODE>/Campaigns/<Type>/  Brief · References · Assets · Draft · Review · Output
```

### 2.2 The nine runtime concerns

**1. Automation Engine** — the top-level process (a Node CLI / long-running worker). Boots configuration and
logging, resolves the *run context* (brand, type, week, environment), instantiates the other engines, and owns
the run's lifecycle from intent to "ready for review." It is thin: it wires and starts; it does not contain
business logic.

**2. Workflow Engine** — a **state machine** over the six file-driven stages. Each stage has entry conditions,
an action, exit/gate conditions, and an artifact it must produce before advancing. It is what makes the run
*resumable* and *auditable*: `Brief✔ → Draft(v3)✔ → Review(QA pass)✔ → Output✔ → Klaviyo-draft✔`. It never
skips `Draft/` (CLAUDE.md §4.1) and never advances past a failed gate.

**3. Task Dispatcher** — routes each unit of work the AI or workflow requests to the correct module, with
**concurrency, timeouts, retries, and rate-limit backoff**. Example: "fetch 16 products + verify each URL is
200" fans out through the dispatcher against the Integration + QA layers, respecting BigCommerce/Klaviyo rate
limits, and returns a consolidated result. It is the single choke-point where all external calls are governed.

**4. AI Decision Engine** — **Claude** (via the Claude Agent SDK / Claude Code). This is the *reasoning* layer,
not a text generator bolted on. It: interprets the intent, runs the **Campaign Selection Engine** (which type?),
selects and curates on-theme products from the candidate set the Integration Layer returns (§5.1/§5.3 rules),
writes fresh non-repeating copy (§5.2), fills the `[[TOKEN]]` contract, chooses the segment/list, and
**adjudicates QA blockers** (deciding "block send" vs. "flag for human"). Deterministic work is delegated to
coded modules; the AI decides *what* and *why*, the modules do *how*.

**5. Integration Layer** — brand-agnostic adapters presenting one internal contract to the rest of the system:
- **BigCommerce adapter** — wraps the existing read-only `bigcommerce-client.js`; per-brand config; GET-only.
- **Klaviyo adapter** — create/update template, create campaign (as **draft**), assign template, list/segment
  read, recipient estimation, preview render, coupon read. **No send in MVP.**
- **Content Calendar adapter** — reads the machine-readable calendar to resolve "this week" → concrete slot.

**6. QA Layer** — the automated encoding of CLAUDE.md §6/§8 as **executable validators**: link/HTTP-200,
image weight + `image/*` + no-redirect, ghost-element/nested-anchor/`<table>`-in-`<a>` lint, merge-tag-leak
grep, 102 KB Gmail-clip check, fixed-height-cell grid checks, dark-mode/responsive presence. Emits a structured
**QA report** with pass/fail per rule and a blocker list. It gates promotion, not file placement (Output still
holds the latest build for preview, §4.1).

**7. Export Layer** — turns finished artifacts into deliverables: writes the un-versioned `Output/` HTML,
generates **CSV/Excel** product-verification and send-manifest workbooks (the §5.4 mapping table), and pushes
the HTML into Klaviyo as a **draft** template+campaign. All exports are idempotent and re-runnable.

**8. Logging** — structured, per-run JSON logs plus a human-readable run summary, and an **audit trail**
(what was built, which products/URLs were verified, what QA found, who approved). Never logs secrets (the
existing client's discipline, generalized). This is both an ops tool and a compliance artifact.

**9. Error Handling** — typed error taxonomy (`ConfigError`, `IntegrationError`, `RenderError`,
`QaBlocker`, `ApprovalRequired`). Transient integration errors retry with backoff via the dispatcher; a
`QaBlocker` stops promotion and is written to `Review/`; anything the AI cannot safely resolve becomes an
`ApprovalRequired` escalation to a human. **Fail loud, fail safe, never fabricate** (CLAUDE.md §5 STOP rule).

---

## 3. Folder Structure V2

**Design rule: purely additive.** Every existing folder keeps its exact path and meaning. New code and runtime
artifacts live in **new top-level directories** so nothing already relied upon moves. The engine reads/writes
the *existing* `Brands/.../` pipeline folders — it does not fork them.

```
Klaviyo Campaign Email System/
│
│  # ===== EXISTING — UNCHANGED (reused as-is) =====
├── CLAUDE.md · BRD.md · README.md          rulebook + entry (read by the AI Decision Engine)
├── 00-…09- section folders                 planning / standards (read-only inputs)
├── Playbooks/ · 07-Prompt Library/         per-type strategy + generate prompts (AI inputs)
├── Components/ · Templates/ · Shared/       the framework the Rendering Engine consumes
├── Brands/<CODE>/                           SYSTEM OF RECORD — engine reads/writes here
│   ├── Assets/                              evergreen brand assets
│   ├── Campaigns/<Type>/                    Brief · References · Assets · Draft · Review · Output
│   └── integration/                         EXISTING RDD BigCommerce client (wrapped, not moved)
│
│  # ===== NEW — ADDITIVE (the platform) =====
├── platform/                               ← all runtime code lives here
│   ├── engine/                             Automation Engine (CLI entry, run lifecycle)
│   ├── workflow/                           Workflow Engine (state machine, stage gates)
│   ├── dispatcher/                         Task Dispatcher (routing, retries, concurrency)
│   ├── ai/                                 AI Decision Engine adapters + prompt loaders
│   ├── render/                             Rendering Engine ([[TOKEN]] → HTML)
│   ├── integrations/
│   │   ├── bigcommerce/                    adapter over Brands/*/integration (multi-brand)
│   │   ├── klaviyo/                         Klaviyo adapter (draft-only in MVP)
│   │   └── calendar/                        Content Calendar adapter
│   ├── qa/                                  automated validators (CLAUDE §6/§8 as code)
│   ├── export/                             HTML / CSV / XLSX / Klaviyo-draft writers
│   ├── common/                             logging, errors, config loader, types
│   └── tests/                              unit + golden-file HTML snapshot tests
│
├── config/
│   ├── brands/<CODE>.config.json           per-brand non-secret mapping (Klaviyo IDs, BC category IDs)
│   ├── platform.config.json                runtime settings (timeouts, concurrency, env)
│   └── content-calendar.json               ← machine-readable calendar (dated slots)
│
├── runtime/                                git-ignored operational output
│   ├── logs/                               structured run logs + audit trail
│   └── exports/                            generated CSV/XLSX workbooks, send manifests
│
├── package.json · package-lock.json        ← makes the platform reproducible (Phase 0)
└── .env  (git-ignored)                     platform-level secrets (Klaviyo key); brand .env stays per-brand
```

**Why this shape**
- `platform/` is the only place logic lives → the repo's documentation identity is untouched.
- The engine treats `Brands/.../Campaigns/<Type>/` as an API (read prior stages, write current) → the proven
  file-driven contract is preserved and every artifact stays exactly where humans already look for it.
- `config/` externalizes the values that are currently scattered (BC category IDs in `rdd.config.js`, Klaviyo
  list IDs implicit) → multi-brand scaling becomes "add a config + a `.env`."
- `runtime/` is git-ignored → logs/exports never pollute the versioned repo.

---

## 4. Complete Execution Flow — `"Create this week's RDD campaign."`

Traced end-to-end, with the module that owns each step and the file it reads/writes.

```
USER ▶ campaign create --brand RDD --intent "this week's campaign"
```

**Step 0 — Boot (Automation Engine + common/)**
Loads `config/platform.config.json` + `config/brands/RDD.config.json`, initializes the run logger
(`runtime/logs/<runId>.json`), assigns a `runId`. → *Run context: {brand: RDD, env, runId}.*

**Step 1 — Load the rulebook (AI Decision Engine)**
Reads, in CLAUDE.md's mandated order: `CLAUDE.md` → `BRD.md` → `03-Brands MD Files/RDD.md` →
`Shared/design-tokens.md` + `Shared/Fonts/font-stacks.md`. These become the AI's grounding context. *(The
`Design.md`/`BrandConfig.md` contradiction flagged in the audit is resolved in Phase 0; the engine reads the
one confirmed brand-config source.)*

**Step 2 — Resolve "this week" (Content Calendar adapter)**
Reads `config/content-calendar.json`, finds the current ISO-week RDD slot → returns
`{type: Weekly, week: 2026-W##, theme?, objective?}`. If no slot exists → `ApprovalRequired` ("no calendar
entry; confirm the theme"). This runs the **Campaign Selection Engine** (§5.3): the slot decides the type.

**Step 3 — Load type strategy (AI Decision Engine)**
Reads `Playbooks/Weekly-Playbook.md` + `07-Prompt Library/Generate-Weekly-Campaign.md` + the
continuous-improvement baseline: the latest approved `Brands/RDD/Campaigns/Weekly/Output/` send (§5.1.1,
`INSPIRATION` mode — improve on it, never copy).

**Step 4 — Draft the Brief (Workflow Engine → AI)**
The AI produces/updates `Brief/RDD-2026-W##-brief.md` including the **Design Intent block + Reference
Register** (§4.2). Workflow gate: a Brief must exist before Draft.

**Step 5 — Retrieve products (Task Dispatcher → BigCommerce adapter)**
Calls the read-only client: `fetchEdmContent()` + `getProductsByCategoryId()` for the theme's categories →
a **candidate pool** (name, price, salePrice, image, url, `inventory_level`, `availability`, `is_visible`,
`date_modified`). GET-only; credentials from `Brands/RDD/.env`.

**Step 6 — Curate + verify (AI + QA Layer, fanned out by the Dispatcher)**
- AI selects ~14–16 **on-theme, same-category** products (§5.1.2), improving on the baseline edit (§5.1.1).
- For each candidate the QA Layer verifies **on its own product page**: `is_visible=true`, in stock, non-zero
  price, **live URL HTTP 200**, image is `image/*` 200 no-redirect (§5.1, §8).
- Any OOS/hidden/404 item is dropped and the AI replaces + re-verifies — **never fabricates** to hit the count
  (§5.1). Result: a verified product set + a verification table.

**Step 7 — Build the email (Rendering Engine)**
Injects verified products + brand tokens into `Components/` (product-card, product-grid, hero, coupon, footer,
trust-strip …) assembled by the Weekly `Templates/`, producing
`Draft/RDD-2026-W##-draft-vN.html`. Deterministic `[[TOKEN]]` substitution; Klaviyo Liquid passes through
untouched. Never rebuilds markup from scratch (Components/README).

**Step 8 — Automated QA (QA Layer)**
Runs the full validator suite against the built HTML: nested-anchor / `<table>`-in-`<a>` (§6.6),
ghost elements (§8.2), Gmail gutter/bgcolor (§6.16), price-badge shrink-to-fit (§6.17), fixed-height grid
(§6.8/§6.9), merge-tag leaks (§6.23), 102 KB clip (§8.3), image safety (§8). Writes a structured **QA report**
to `Review/RDD-2026-W##-review.md`, referencing the exact draft version. Blockers → recorded; the AI decides
block-vs-flag.

**Step 9 — Export HTML (Export Layer)**
Copies the latest draft to the un-versioned `Output/RDD-2026-W##.html` (mirrors newest Draft, §4.1/§9); keeps
all `-vN` history. Writes a **CSV/XLSX verification + send manifest** to `runtime/exports/`.

**Step 10 — Prepare the Klaviyo campaign (Klaviyo adapter — DRAFT ONLY)**
- Creates/updates an **email template** from the Output HTML (`render_email_template` used to sanity-check).
- Creates a **campaign in DRAFT** and assigns the template.
- **Segment/List selection:** reads `get_lists`/`get_segments`; maps to the RDD audience named in
  `config/brands/RDD.config.json`; the AI confirms the match; runs **recipient estimation** as a sanity check.
- **Stops here. No `send_campaign`.** Approval-to-send remains a human action (CR-16/17, §8.1 gate).

**Step 11 — Return "ready for review" (Automation Engine)**
Prints a concise summary: draft path, Output path, QA pass/fail + blockers, product-verification table link,
Klaviyo draft campaign URL + selected segment + estimated recipients, and the explicit **"NOT approved to
send — human review required"** status. The run's audit trail is complete in `runtime/logs/`.

```
RESULT ▶ Output/RDD-2026-W##.html  +  Klaviyo DRAFT campaign (segment pre-selected)
         QA: PASS (0 blockers)  ·  16/16 products verified  ·  awaiting human approval
```

---

## 5. Module Responsibilities

| Module (path) | Responsibility | Reads | Writes | Owns the rule |
|---|---|---|---|---|
| **Automation Engine** `platform/engine` | Boot, run context, lifecycle, final summary | config, env | run summary | run integrity |
| **Workflow Engine** `platform/workflow` | Stage state machine + gates; resumability | pipeline folders | stage artifacts | §4.1 pipeline, never skip Draft |
| **Task Dispatcher** `platform/dispatcher` | Route tasks; concurrency, retries, backoff, timeouts | — | — | rate-limit + retry policy |
| **AI Decision Engine** `platform/ai` | Interpret intent; type selection; product curation; copy; token fill; segment choice; QA adjudication | rulebook, playbooks, baseline | Brief, copy, token map | §5.1–§5.3, §6.2/§6.5 |
| **Rendering Engine** `platform/render` | `[[TOKEN]]` → HTML from Components + Templates | Components/, Templates/, Shared/, token map | `Draft/-vN.html` | Components/README contract |
| **BigCommerce adapter** `platform/integrations/bigcommerce` | Multi-brand read-only product/stock/price/image | `Brands/*/integration`, brand config, `.env` | — | §5.1 verification, read-only |
| **Klaviyo adapter** `platform/integrations/klaviyo` | Template + **draft** campaign + segment/list + estimation + preview | Output HTML, brand config | Klaviyo drafts | **no send**; CR-16/17 |
| **Content Calendar adapter** `platform/integrations/calendar` | Resolve intent → concrete dated slot + type | `config/content-calendar.json` | — | §5.3 selection |
| **QA Layer** `platform/qa` | Executable validators; structured QA report; blockers | Draft HTML, live URLs | `Review/` report | CLAUDE §6/§8 |
| **Export Layer** `platform/export` | Output HTML, CSV/XLSX, Klaviyo push | Draft/Output, manifests | `Output/`, `runtime/exports/` | §4.1/§9 Output sync |
| **Logging** `platform/common` | Structured logs + audit trail; secret-safe | all | `runtime/logs/` | never log secrets |
| **Error Handling** `platform/common` | Typed errors, retries, blockers, escalation | all | logs, `Review/` | §5 STOP rule |

**Separation of concerns:** the AI decides *what/why*; deterministic modules do *how*; the Workflow Engine
enforces *order and gates*; the Dispatcher governs *all external I/O*; QA proves *conformance*; nothing sends.

---

## 6. Integration Strategy

### 6.1 How each integration connects to the Automation Engine

All integrations sit **behind the Task Dispatcher**, never called directly by business logic. Each is an
**adapter** exposing one internal contract, so the AI/engine is decoupled from vendor specifics and rate limits.

**BigCommerce API (product source)**
- Wrap the **existing proven read-only client** (`Brands/RDD/integration/bigcommerce-client.js`) — do not
  rewrite it. The adapter adds multi-brand config resolution and the stock/visibility/HTTP-200 verification
  policy as reusable steps.
- GET-only; `Products: read-only` scope; credentials per-brand `.env`; never logged.
- SS/SC/Stack become "a `config/brands/<CODE>.config.json` + a `.env`" — no core-client change.

**Klaviyo API (email platform)**
- **Two-track by design:**
  - **Demo/MVP track — MCP connector.** The session's Klaviyo MCP tools (`create_email_template`,
    `create_campaign`, `assign_template_to_campaign_message`, `get_lists`, `get_segments`,
    `get_campaign_recipient_estimation`, `render_email_template`) are the fastest path to a live demo and are
    already available. **`send_campaign` is deliberately excluded from the platform's allowed tools.**
  - **Production track — coded SDK client.** For headless/cron and error handling/logging, a coded Klaviyo
    client replaces MCP (MCP is interactive-auth and absent in headless contexts, per the audit). Same adapter
    interface, so nothing above it changes.
- **Draft-only invariant** enforced in the adapter, not by discipline: there is no code path that calls send.

**Content Calendar**
- Introduce `config/content-calendar.json` (dated, per-brand, per-type slots) as the machine-readable form of
  the existing `content-calendar.md` framework. The `.md` stays the human narrative; the `.json` is what the
  engine resolves "this week" against. Requires the currently-`TBC` send days/lead-times to be business-decided
  (audit R-item) — until then the adapter falls back to `ApprovalRequired`.

### 6.2 Future-ready extensions (same adapter pattern)
- **CSV Export** — product-verification tables, send manifests, recipient counts (Export Layer; MVP-lite).
- **Excel Export** — stakeholder workbooks (campaign + QA + verification) via a spreadsheet writer.
- **Reporting Dashboard** — a read-model fed by `runtime/logs/` + Klaviyo `get_campaign_report`; every send's
  stage, QA state, approval, and (post-send) performance. Later horizon; the audit trail from day one is its
  data source.

### 6.3 Integration contract (illustrative — internal shape, not code)
```
ProductSource.getVerifiedProducts(brand, theme, count) -> [{name, price, salePrice, imageUrl, url, verified}]
EmailPlatform.prepareDraft(brand, html, segmentRef)     -> {campaignId, status:"draft", recipients:est}
Calendar.resolveSlot(brand, "this week")                -> {type, week, theme?, objective?}
```

---

## 7. MVP (Highest Priority) — the live-demo system

**MVP goal:** the smallest system that runs *one* real end-to-end campaign live and lands a review-ready
Klaviyo draft. **Scope = exactly what the demo shows; nothing more.**

### 7.1 In scope (build these)
1. **CLI entry** — `campaign create --brand RDD --type weekly` (calendar lookup optional in MVP; type may be
   passed explicitly to keep the demo deterministic).
2. **RDD BigCommerce retrieval** — reuse the existing client (already works, read-only).
3. **Rendering Engine (Weekly only)** — `[[TOKEN]]` → HTML from the existing Weekly components/template.
4. **QA Layer — the high-value validators only:** HTTP-200 links, image safety, nested-anchor/ghost-element,
   merge-tag leak, 102 KB clip. (The subset that most often blocks a send.)
5. **Export** — write `Output/RDD-2026-W##.html` + a **CSV** verification table.
6. **Klaviyo draft creation** — template + **draft** campaign + segment pre-selected + recipient estimate,
   via the **MCP connector**. **No send.**
7. **Structured run log + a clean "ready for review" summary.**

### 7.2 Explicitly OUT of scope for MVP (fast-follow)
Multi-brand (SS/SC/Stack), all non-Weekly types, machine calendar/scheduler, Excel, dashboard, coded Klaviyo
SDK client, CI/CD, full validator coverage, A/B testing. *These are Phase 3+.*

### 7.3 Why this is enough to demo
It shows the whole narrative — **intent → live products → on-brand build → automated QA → export → Klaviyo
draft with the right audience → human approves** — on the most mature brand (RDD), using the one integration
that already works, with zero send risk. It is honest (real blockers show) and repeatable.

### 7.4 Demo de-risking
- **Dry-run + cache mode:** snapshot the RDD product fetch before the meeting so a flaky venue network can't
  break the demo; a `--live` flag hits the API when the room is stable.
- **Golden reference:** the MVP's Weekly output is snapshot-tested against an approved existing RDD Output so a
  last-minute change can't regress the look on stage.
- **Klaviyo sandbox account / clearly-named `DEMO —` draft** so nothing touches a real audience.

---

## 8. Implementation Roadmap

| Phase | Goal | Expected output | Dependencies | Complexity |
|---|---|---|---|---|
| **0 — Foundations** | Reproducible, observable base; resolve blockers | `package.json`+lockfile; `platform/common` (config, logging, errors); resolve `Design.md`/`BrandConfig.md` contradiction; `config/brands/RDD.config.json` | none | **S** |
| **1 — Core Engine (MVP core)** | Deterministic Weekly renderer proven against approved output | `platform/render`; golden-file snapshot tests vs. an approved RDD Output; token map from brand config | P0 | **M–L** |
| **2 — QA Layer (MVP validators)** | Automated pass/fail on the high-value rules | `platform/qa` validators + structured `Review/` report | P1 (HTML to test) | **M** |
| **3 — MVP integration + demo** | One live end-to-end run → Klaviyo draft | CLI + BigCommerce adapter (reuse) + Export (HTML+CSV) + Klaviyo **draft** via MCP + run summary; **dry-run/cache mode** | P1, P2 | **M** |
| **4 — Workflow Engine + Dispatcher** | Resumable, gated, rate-limited runs | `platform/workflow` state machine; `platform/dispatcher` retries/concurrency; systemized approval record | P3 | **M** |
| **5 — Multi-brand + more types** | SS/SC/Stack (as confirmed) + Monthly/Launch/etc. | per-brand configs + `.env`; additional templates wired to renderer | P1–P4; brand facts confirmed | **M** |
| **6 — Calendar + Scheduler** | "this week" auto-resolves; builds triggered ahead of send | `config/content-calendar.json` + calendar adapter + job runner | P4; TBC calendar values decided | **M** |
| **7 — Production Klaviyo client + CI/CD** | Headless-safe sends prep; regressions caught pre-send | coded Klaviyo SDK adapter (replaces MCP); `.github/` CI running validators+tests | P4 | **M** |
| **8 — Reporting + Dashboard + Excel** | Stakeholder visibility + performance loop | dashboard read-model from logs + `get_campaign_report`; XLSX exports; A/B framework | P4–P7 | **L** |

**Critical path to the demo:** P0 → P1 → P2 → P3. Everything else is post-demo hardening and scale.

---

## 9. Technical Risks

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| TR1 | **Accidental live send** (MCP exposes `send_campaign`) | **Critical** | Exclude send from the platform's allowed tools; draft-only Klaviyo adapter with no send path; sandbox/DEMO-named campaign for the demo; human-gated approval (CR-16/17). |
| TR2 | **Live-demo API/network failure on stage** | **High (demo)** | Dry-run + cached product snapshot; `--live` only when stable; rehearse; pre-created Klaviyo draft as fallback. |
| TR3 | **Non-deterministic AI output** (copy/layout varies per run) | High | Deterministic Rendering Engine owns markup; AI fills tokens/copy only; golden-file snapshot tests; temperature/prompt discipline; approved-baseline diffing. |
| TR4 | **Renderer builds on absent/ambiguous brand config** (`Design.md`/`BrandConfig.md` contradiction; SC/Stack stubs) | High | Resolve in P0; treat brand-config completeness as a build precondition; RDD-only for MVP. |
| TR5 | **Dead links / hidden / OOS products reach the draft** | High | QA HTTP-200 + visibility + stock gate that **blocks** promotion; verify on the product page, not listings (§5.1). |
| TR6 | **Wrong segment/list selected** | High | Segment mapping in brand config + AI confirmation + recipient estimation as a pre-send sanity gate; human confirms in Klaviyo. |
| TR7 | **MCP unavailable headless / auth expiry** | Medium | Two-track integration: coded Klaviyo SDK client for production (P7); MCP only for interactive demo. |
| TR8 | **Secrets in unattended runs** (plaintext `.env`, multi-brand) | Medium | Secrets manager + rotation (P7); least-privilege read-only scopes; never log values (existing discipline generalized). |
| TR9 | **API rate limits / changes / outages** | Medium | All external I/O behind the Dispatcher (retry+backoff); contract tests; caching for read-heavy product fetches. |
| TR10 | **Regressions ship without CI** | Medium | Golden-file + validator suite in CI on every PR (P7); no promotion on a failed validator. |
| TR11 | **Compliance (consent / AU Spam Act / unsubscribe)** | Medium | Automated footer/merge-tag validation (§6.23); consent/segment checks in the send gate; legal sign-off before any send automation. |
| TR12 | **Scope creep past the demo MVP** | Medium | Freeze MVP scope to §7.1; everything else is roadmap P4+. |

---

## Appendix — Design decisions & assumptions

- **Runtime:** Node.js ≥18 (matches the existing BigCommerce client + native `fetch`; strong Klaviyo SDK).
  TypeScript recommended for `platform/` (type-safe adapters) but JS is acceptable to match existing code.
  Python retained only for the existing `verify.py`.
- **AI layer:** Claude via the Claude Agent SDK / Claude Code — reasoning + orchestration, deterministic modules
  for everything mechanical.
- **Assumption:** the demo uses **RDD** (only brand with a working integration) and **Weekly** (most mature
  type). Stated as the MVP boundary, not a limitation of the design — the architecture is multi-brand,
  multi-type by construction.
- **Assumption:** `config/content-calendar.json` and the `TBC` timing values require a business decision before
  the scheduler (P6); until then the calendar adapter escalates rather than invents (CLAUDE.md §5).
- **Invariant across all phases:** the platform **prepares**, humans **approve and send**. No autonomous send
  exists anywhere in the design.
- **Constraint honored:** this is design only — no production code written, no existing file modified or
  refactored; the sole new artifact is this document.

_End of architecture design._
