# KLAVIYO_INTEGRATION_PLAN.md

**Klaviyo Integration — architecture & design (Phase 2)**
Prepared as Senior AI Automation Architect / Klaviyo Solutions Engineer.
Companion to [`LIVE_SYSTEM_ARCHITECTURE_V2.md`](LIVE_SYSTEM_ARCHITECTURE_V2.md) and the built MVP under
[`platform/`](platform/README.md). Design date: **2026-08-07**.

> **This is a design document only.** No production code is written, no existing file is modified. It
> defines how the verified MVP evolves into a LIVE end-to-end workflow that ends at a **Klaviyo draft**.
>
> **The non-negotiable invariant of this entire phase:** the platform **prepares**; a human **sends**.
> Nothing in this design creates, references, or enables an automatic send. (See §8.)

---

## 1. Objectives

The MVP already builds a QA-passed, on-brand Weekly email from live products and exports a package. This
phase closes the last gap between "a file in `Output/`" and "a campaign a marketer can review and send" by
adding a **draft-only Klaviyo integration**.

After this phase, one command —

```
Create this week's RDD campaign
```

— produces, in addition to the existing package, a **draft campaign inside Klaviyo**: HTML uploaded as a
template, subject + preview text set, the correct list/segment pre-selected, recipient count estimated, and
the campaign left in **draft** status. The marketer opens Klaviyo, previews, and presses send themselves.

Success = the demo narrative runs live end-to-end with **zero send risk** and full auditability.

---

## 2. Current State

### 2.1 What the MVP already does (verified)
- **Automation Engine + Workflow Engine** — one command drives `resolve-slot → retrieve → decide → render → qa → export`.
- **Reads context** — CLAUDE.md/BRD grounding, `config/brands/RDD.config.json`, content calendar.
- **BigCommerce (read-only)** — retrieves live products; `live` / `snapshot` / `fixture` modes.
- **AI Decision Engine** — curates verified products, writes subject/preview/hero/CTA (deterministic; LLM seam).
- **Rendering Engine** — assembles the existing components into email-safe HTML (deterministic; golden-tested).
- **QA Layer** — 12 executable §6/§8 checks + optional live HTTP-200 link verification.
- **Export Layer** — writes HTML, `products.json`/`.csv`, `qa-report.md`, `package.json` manifest; sandbox/pipeline targets.
- **Guardrails** — never fabricates; typed errors; secret-safe logging; `Brands/` protected.

### 2.2 What is still missing (this phase closes the first five)
| Missing | Addressed here? |
|---|---|
| Klaviyo API client (transport, auth, retries) | ✅ §4–§7 |
| Upload HTML as a Klaviyo template | ✅ |
| Create a **draft** campaign + set subject/preview | ✅ |
| Select the correct list/segment | ✅ |
| Recipient estimation (pre-send sanity) | ✅ |
| Scheduling / sending | ❌ **deliberately excluded** (§8, §10) |
| Reporting / analytics / A/B / template management | ❌ future (§10) |
| Multi-brand (SS/SC/Stack), non-Weekly types | ❌ later phase (unchanged from Arch V2 §8) |

---

## 3. End-to-End Workflow

The MVP pipeline gains **one new terminal stage** — `prepare-klaviyo-draft` — after `export`. Everything
left of "Create Klaviyo Draft" is already built and verified.

```
                      Automation Engine  (run lifecycle, audit log)
                               │
                     ┌─────────┴─────────  EXISTING (built & verified)
                     ▼
   Read CLAUDE.md / BRD  →  Read Brand Rules (config/brands/RDD)  →  Read Content Calendar
                     │
                     ▼
   Retrieve Products (BigCommerce, read-only)  →  Curate + Copy  →  Generate HTML  →  Run QA
                     │
                     ▼
   Export package (Draft/ + Output/ + products + QA report)
                     │
   ══════════════════╪══════════════════  NEW: prepare-klaviyo-draft (Draft Service)
                     ▼
   [0] Preflight safety check ── GET account ── confirm key ↔ expected RDD account; abort on mismatch
                     │
                     ▼
   [1] Gate: QA has no blockers?  ── if blockers → STOP, do NOT create anything in Klaviyo (report only)
                     │
                     ▼
   [2] Upload HTML  ──────────────  create/replace an email Template from Output HTML
                     │
                     ▼
   [3] Resolve audience  ─────────  look up the configured List/Segment id; confirm it exists
                     │
                     ▼
   [4] Create Campaign (DRAFT)  ──  email message with Subject + Preview Text + From/Reply-To + audience
                     │
                     ▼
   [5] Assign Template  ──────────  link the uploaded template to the campaign message
                     │
                     ▼
   [6] Estimate recipients  ──────  create estimation job → poll → recipient count (sanity gate)
                     │
                     ▼
   [7] Save as Draft  ────────────  (implicit — campaigns are created in DRAFT; we never advance status)
                     │
                     ▼
   [8] Return Success  ───────────  draft campaign id + deep link + audience + est. recipients
                                     status: NOT APPROVED TO SEND — human review required
```

**Idempotency.** The Draft Service is safe to re-run: it looks up an existing draft tagged with the
`campaignId` and either updates it or creates a clearly-versioned new one — it never leaves orphans and
never touches a campaign that is not in draft status.

---

## 4. Klaviyo API Requirements

Modern Klaviyo REST API (JSON:API), base `https://a.klaviyo.com/api/`, with a pinned `revision` header.
**Design-only — not implemented.** The right-hand column notes the equivalent session MCP tool (the demo
fast-path; see §9). Endpoint/attribute names must be reconfirmed against Klaviyo's API changelog at build time.

### 4.1 Endpoints we WILL use

| # | Method + path | Purpose | MCP equivalent |
|---|---|---|---|
| E1 | `GET /api/accounts/` | **Preflight safety** — confirm the API key belongs to the expected RDD account before any write. | `get_account_details` |
| E2 | `POST /api/templates/` | **Upload HTML** — create an email template from the Output HTML. | `create_email_template` |
| E3 | `GET /api/lists/` | Enumerate lists to resolve the configured audience by name→id. | `get_lists` |
| E4 | `GET /api/segments/` | Enumerate segments (if the audience is a segment). | `get_segments` |
| E5 | `POST /api/campaigns/` | **Create the campaign in DRAFT** — email message carrying subject, preview text, from/reply-to, and the included audience (list/segment). | `create_campaign` |
| E6 | `POST /api/campaign-message-assign-template/` | **Assign** the uploaded template (E2) to the campaign's email message. | `assign_template_to_campaign_message` |
| E7 | `POST /api/campaign-recipient-estimation-jobs/` → `GET /api/campaign-recipient-estimations/{id}` | **Estimate recipients** — async job + poll; a pre-send sanity number. | `get_campaign_recipient_estimation` |
| E8 | `GET /api/campaigns/{id}` · `GET /api/campaign-messages/{id}` | Read back the draft to build the success summary + deep link. | `get_campaign`, `get_campaign_message` |
| E9 | `POST /api/template-render/` *(optional)* | Server-side render sanity check of the template HTML before/after upload. | `render_email_template` |
| E10 | `PATCH /api/campaigns/{id}` · `PATCH /api/campaign-messages/{id}` *(optional, idempotency)* | Update an existing draft's name/subject/preview on re-run instead of duplicating. | `update_campaign`, `update_campaign_message` |

### 4.2 Endpoints we will NOT use (explicitly forbidden — §8)

| Method + path | Why forbidden |
|---|---|
| `POST /api/campaign-send-jobs/` | **Sends / schedules the campaign.** Never called. No wrapper method exists for it. |
| `DELETE /api/campaigns/{id}` on non-draft, `POST /api/campaign-clone/` into send, any list-write / profile-write / suppression endpoint | Out of scope; the key should not even be scoped for them (§5). |

---

## 5. Authentication Strategy

**Credential.** A Klaviyo **private API key** (`pk_…`), sent as `Authorization: Klaviyo-API-Key <key>` with
a pinned `revision: <YYYY-MM-DD>` header on every request.

**Storage (mirrors the proven BigCommerce pattern).**
- The key lives in the **per-brand `.env`**: add `KLAVIYO_API_KEY` to `Brands/RDD/.env` (already git-ignored
  via `Brands/**/.env`). One brand = one Klaviyo account = one key.
- Non-secret Klaviyo settings (account id/hint, from-email, from-label, reply-to, the audience list/segment
  reference, pinned API revision) go in `config/brands/RDD.config.json` under the existing `klaviyo` block.
- Update `Brands/RDD/integration/.env.example` with the `KLAVIYO_API_KEY` key **name only** (never a value).

**Non-exposure guarantees.**
- The key is read at runtime, held only in the client instance, **never** written to config, logs, or the
  campaign package. The existing secret-safe logger already redacts token-shaped strings and
  `ACCESS TOKEN`/key patterns; extend its redaction list to `pk_` / `Klaviyo-API-Key`.
- Error messages name the **missing env key**, never a value (as the BigCommerce client already does).

**Least privilege (defence in depth).** Scope the private key to the minimum needed:
**Campaigns: Full · Templates: Full · Lists: Read · Segments: Read · Accounts: Read.** Note: the send
endpoint uses the same Campaigns scope, so **key scope alone cannot prevent a send** — send prevention is
enforced primarily **in code** (§8). Scope-minimisation still reduces blast radius (no profile/list writes).

**Rotation.** Keys are rotatable without code change (env only). Recommend a rotation schedule and a
break-glass note in the integration README. A `preflight` (E1) run confirms a key is valid + points at the
right account before any campaign work.

---

## 6. Folder Structure

Purely additive, inside the existing `platform/` tree. Nothing moves.

```
platform/
└── integrations/
    ├── bigcommerce/            (existing — unchanged)
    ├── calendar/               (existing — unchanged)
    └── klaviyo/                ← NEW
        ├── client.js             transport: auth, revision header, retries, 429 backoff, error mapping
        ├── campaign-service.js   create draft campaign + message (subject/preview/from/audience)
        ├── template-service.js   upload HTML as a template; assign to a message; optional render check
        ├── list-service.js       resolve/list Lists (read-only)
        ├── segment-service.js    resolve/list Segments (read-only)
        ├── draft-service.js      ORCHESTRATOR for the §3 [0]–[8] flow (draft-only)
        ├── safety.js             the hard "no-send" guard + preflight account check
        └── README.md             setup, scopes, the no-send policy

platform/workflow/
└── pipeline.js                 (existing) gains one guarded call to draft-service after export

config/brands/RDD.config.json   (existing) klaviyo block filled: account, from/reply-to, audienceRef, revision
Brands/RDD/.env                  (existing, git-ignored) add KLAVIYO_API_KEY
Brands/RDD/integration/.env.example  (existing) add KLAVIYO_API_KEY name only
```

**Reuse:** `platform/common/{logger,errors,config,fs-utils}.js` are reused as-is. The new `IntegrationError`
already exists in the taxonomy. A future **Task Dispatcher** (Arch V2 §2.3) will front all Klaviyo calls for
retries/rate-limits; until then `client.js` owns that locally.

---

## 7. Module Responsibilities

| Module | Owns | Explicitly does NOT |
|---|---|---|
| **Klaviyo Client** (`client.js`) | HTTP transport: base URL, `Authorization` + `revision` headers, JSON:API request/response shaping, **429 Retry-After backoff**, timeouts, mapping Klaviyo error envelopes → typed `IntegrationError`. Never logs the key. | Contain any business logic or any send call. |
| **Campaign Service** (`campaign-service.js`) | Create a **draft** campaign with an email message: subject, preview text, from-email/label, reply-to, included audience; read a campaign/message back (E5, E8); optional idempotent update (E10). | Advance status, schedule, or send. |
| **Template Service** (`template-service.js`) | Upload the Output HTML as a template (E2), assign it to the campaign message (E6), optional server render check (E9). | Persist secrets; modify the HTML (it uploads what QA passed). |
| **List Service** (`list-service.js`) | Read + resolve Lists by name/id (E3). | Any list write (add/remove profiles, create/delete). |
| **Segment Service** (`segment-service.js`) | Read + resolve Segments by name/id (E4). | Any segment write. |
| **Draft Service** (`draft-service.js`) | **Orchestrate** the §3 [0]–[8] flow; enforce the QA-blocker gate ([1]); assemble the success summary (draft id, deep link, audience, estimated recipients, `NOT_APPROVED_TO_SEND`); guarantee idempotency. | Decide to send; bypass the safety guard. |
| **Safety** (`safety.js`) | The single hard guard: preflight account match (E1); a `assertNoSend()` used in tests to prove no send/schedule endpoint is referenced anywhere in `klaviyo/`. | — |
| **Error Handler** | Reuses `platform/common/errors.js`: transport/API failures → `IntegrationError`; account mismatch or missing audience → `ApprovalRequired`/`ConfigError`; QA blockers stop the Klaviyo stage before any write. | Swallow errors silently. |
| **Logger** | Reuses `platform/common/logger.js` (secret-safe, per-run audit trail). Every Klaviyo action (template id, campaign id, audience, estimate) is logged for audit. | Log the API key or full payloads containing PII. |

---

## 8. Safety Rules

**The platform must NEVER send an email automatically.** This is enforced at four independent layers so no
single mistake can cause a send:

1. **No capability in code.** There is **no send/schedule method anywhere** in `platform/integrations/klaviyo/`.
   The client exposes create/upload/read/estimate only. `POST /api/campaign-send-jobs/` is never wrapped.
2. **Structural test guard.** `safety.assertNoSend()` + a unit test greps the `klaviyo/` tree and fails CI if
   any reference to `campaign-send-jobs`, `send_campaign`, `send-job`, or a status transition to
   `Scheduled`/`Sending` appears. Adding a send path breaks the build.
3. **Preflight account lock.** Before any write, E1 confirms the key resolves to the **expected RDD account**
   (matched against `config/brands/RDD.config.json`). A mismatch aborts with `ApprovalRequired` — no writes.
4. **QA gate.** If the QA report has any blocker, the Klaviyo stage does **not run at all** — nothing is
   created in Klaviyo for a failing build.

**The system MAY only:** create draft campaigns · upload HTML templates · assign a template · read
lists/segments · select an audience · estimate recipients · leave the campaign in **draft**.

**Human approval is always required before sending.** Every result is stamped `NOT_APPROVED_TO_SEND`. The
send action happens **only** inside the Klaviyo UI, performed by a human (reviewer ≠ author, CR-16/CR-17).
**Demo hardening:** use a Klaviyo **test/seed list or a tiny segment**, and prefix the campaign name with
`DEMO —`, so even a manual mis-click can't reach a real audience.

---

## 9. MVP Scope (smallest Klaviyo integration for the LIVE presentation)

**Build exactly this, no more:**
1. `client.js` — auth + revision header + basic 429/timeout handling + error mapping.
2. `safety.js` — preflight account check (E1) + the `assertNoSend` guard.
3. `template-service.js` — upload the existing Output HTML as a template (E2); assign to message (E6).
4. `campaign-service.js` — create ONE **draft** email campaign with subject + preview + from + a **single
   configured list** (E5).
5. `list-service.js` — resolve that one configured list by name→id (E3). *(Segment Service stubbed for later.)*
6. Recipient estimation (E7) — show a count as the pre-send sanity signal.
7. `draft-service.js` — orchestrate [0]–[8]; return draft id + deep link + audience + estimate; `NOT_APPROVED_TO_SEND`.
8. One new pipeline stage + a `--klaviyo` (or `--commit`-gated) flag so the Klaviyo step is **opt-in**.

**Explicitly out of the MVP:** segments (read-only stub only), scheduling, sending, A/B, reporting,
template versioning/cloning, multi-brand, non-Weekly types, the Task Dispatcher.

**Demo config prerequisites (must be confirmed before build):** a **verified sending domain / from-address**
in the RDD Klaviyo account (Klaviyo blocks campaign creation without a valid sender), a **test list** id, and
the **private key** (scoped per §5) in `Brands/RDD/.env`.

**Why this is enough:** it completes the on-stage story — *intent → live products → on-brand build → QA →
Klaviyo draft with the right audience and an estimated reach* — with zero send risk, using the account we
already know (XAUdQX).

---

## 10. Future Enhancements

| Capability | Sketch | Gating |
|---|---|---|
| **Scheduling** | Human-approved `campaign-send-jobs` with `scheduled_at`; only ever triggered by an explicit, logged human action — never by the engine. | Hard human-in-the-loop; separate approval record. |
| **A/B Testing** | Multiple campaign messages / subject variants; fold winners back into templates/standards. | After single-variant drafts are proven. |
| **Reporting** | Pull `campaign-values-reports` / `get_campaign_report` into a metrics rollup (Arch V2 §8, Phase 8). | Read-only. |
| **Analytics** | Trend the success metrics across sends; feed the dashboard read-model. | Read-only. |
| **Flow Automation** | Triggered/lifecycle flows live in the **separate Klaviyo Flow project** — this workspace coordinates content only (CLAUDE.md §5.3). | Out of scope here by charter. |
| **Template Management** | Universal content blocks, template versioning/cloning, brand-library sync (`create/update_universal_content`, `clone_email_template`). | After multi-brand. |
| **Segment Service (full)** | Resolve/estimate against segments, dynamic audience rules. | After the single-list MVP. |
| **Coded client replaces MCP** | Swap the demo MCP fast-path for the coded REST client for headless/cron (Arch V2 two-track). | Before any unattended run. |

---

## Appendix — Two-track note (MCP vs coded client)

Consistent with Architecture V2 §6.1, the session already exposes Klaviyo **MCP tools** (`create_campaign`,
`create_email_template`, `assign_template_to_campaign_message`, `get_lists`, `get_segments`,
`get_campaign_recipient_estimation`, `get_account_details`, `render_email_template`). They are the fastest
path to a **live demo** and can back the Draft Service behind the same interface. The **coded REST client**
(§6/§7) is the production path (headless/cron, explicit retries, no interactive auth). Either way,
`send_campaign` is **excluded from the allowed set** and no send wrapper exists.

**Constraint honored:** design only — no production code written, no existing file modified; the sole new
artifact is this document. Implementation begins after your review and approval.
