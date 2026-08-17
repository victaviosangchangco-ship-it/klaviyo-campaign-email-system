# KLAVIYO_MVP_IMPLEMENTATION_PLAN.md

**Klaviyo Draft MVP — final implementation plan before build**
Prepared as Lead Engineer (Klaviyo API / Automation / AI Systems).
Operationalizes [`KLAVIYO_INTEGRATION_PLAN.md`](KLAVIYO_INTEGRATION_PLAN.md) (the architecture) and extends
the verified [`platform/`](platform/README.md) MVP. Design date: **2026-08-07**.

> **Planning only.** No production code, no repository changes. Where the architecture is already settled
> (folder layout §6, module responsibilities §7, auth strategy §5, endpoint list §4 of the integration
> plan), this document **references** it and does not restate it — it adds the concrete build detail:
> payload shapes, data flow, the error matrix, the test approach, and the task-by-task order.
>
> **Prime directive (unchanged, enforced in code):** the system creates **drafts only**. It has no send
> capability and must never acquire one. See §4 and §6.

---

## 1. MVP Goal

Extend the working pipeline with **one new terminal stage** so that a single instruction ends at a
**review-ready Klaviyo draft campaign**:

```
User → "Create this week's RDD campaign" → Automation Engine → BigCommerce → AI Decision Engine
     → Renderer → QA → Export → [NEW] Create Klaviyo DRAFT Campaign → Human Review → Done
```

**Concretely, the new stage must:** upload the QA-passed HTML as a Klaviyo template, create an email
campaign in **Draft** status with the correct subject, preview text and sender, attach the template, select
one configured audience (list), estimate recipients, and return a deep link to the draft — then **stop**.

**Definition of "the MVP works":** a marketer runs the command, opens Klaviyo, and finds a correctly-built
**draft** waiting for them — which they, a human, preview and send. The system never sends.

**Explicitly out of scope for this MVP:** sending, scheduling, segments (list only), A/B, reporting,
multi-brand, non-Weekly types. (Roadmap: integration plan §10.)

---

## 2. Required Klaviyo APIs

Modern JSON:API, base `https://a.klaviyo.com/api/`, header `Authorization: Klaviyo-API-Key <pk_…>` +
pinned `revision: <YYYY-MM-DD>`. The endpoint inventory + MCP equivalents live in integration plan §4; below
is the **build-level responsibility + illustrative payload** for each (⚠️ shapes are revision-dependent —
**reconfirm against Klaviyo's API reference/changelog at build time**; treat these as design intent).

| Endpoint | Responsibility in the MVP |
|---|---|
| **Authentication** — header on every call | Identify + authorize the request. No login flow; a private key (§4 security). |
| **`GET /api/accounts/`** | **Preflight.** Confirm the key resolves to the expected RDD account before any write. Also surfaces the verified sender/company. |
| **`POST /api/templates/`** | **HTML upload.** Store the Output HTML as a reusable email template; returns a `templateId`. |
| **`GET /api/lists/`** | **List selection.** Resolve the configured audience name → `listId`; confirm it exists. |
| **`POST /api/campaigns/`** | **Campaign + Message creation.** Creates the campaign in **Draft** with an email message carrying **subject, preview text, from/reply-to** and the **included audience**. Returns `campaignId` + `messageId`. |
| **`POST /api/campaign-message-assign-template/`** | **Attach HTML.** Bind the uploaded `templateId` to the campaign's `messageId`. |
| **`POST /api/campaign-recipient-estimation-jobs/`** → **`GET /api/campaign-recipient-estimations/{id}`** | **Estimate recipients.** Async job + poll → a count for the review screen (sanity signal). |
| **`GET /api/campaigns/{id}`**, **`GET /api/campaign-messages/{id}`** | **Read-back / Campaign status.** Confirm status is `Draft`; build the deep link + success summary. |
| **`POST /api/template-render/`** *(optional)* | Server-side render check of the HTML before/after upload. |
| **`PATCH /api/campaigns/{id}`, `/api/campaign-messages/{id}`** *(optional, idempotency)* | Update an existing draft on re-run instead of duplicating. |
| **`POST /api/campaign-send-jobs/`** | **FORBIDDEN — never called.** This is the only endpoint that sends/schedules. No wrapper exists for it (§4). |

**Illustrative payloads (design intent — confirm at build):**

*Create template (HTML upload):*
```jsonc
POST /api/templates/
{ "data": { "type": "template",
  "attributes": { "name": "RDD-2026-W32", "editor_type": "CODE", "html": "<!doctype html>…" } } }
// → 201 { data.id: "<templateId>" }
```

*Create campaign in DRAFT (message carries subject/preview/from + audience):*
```jsonc
POST /api/campaigns/
{ "data": { "type": "campaign",
  "attributes": {
    "name": "DEMO — RDD-2026-W32",
    "audiences": { "included": ["<listId>"], "excluded": [] },
    "campaign-messages": { "data": [ { "type": "campaign-message",
      "attributes": { "definition": {
        "channel": "email", "label": "RDD W32",
        "content": { "subject": "This week at Retail Display Direct: …",
                     "preview_text": "16 featured products…",
                     "from_email": "<verified sender>", "from_label": "Retail Display Direct",
                     "reply_to_email": "<verified reply-to>" } } } } ] }
  } } }
// → 201 { data.id: "<campaignId>", …campaign-messages relationship → "<messageId>" }
// Campaign is created in Draft. A send_strategy field may be required by the schema; setting it does NOT
// send — ONLY POST /campaign-send-jobs sends. Confirm the exact required attributes at build time.
```

*Assign template to the message (attach HTML):*
```jsonc
POST /api/campaign-message-assign-template/
{ "data": { "type": "campaign-message", "id": "<messageId>",
  "relationships": { "template": { "data": { "type": "template", "id": "<templateId>" } } } } }
```

*Estimate recipients:*
```jsonc
POST /api/campaign-recipient-estimation-jobs/   { "data": { "type": "campaign-recipient-estimation-job", "id": "<campaignId>" } }
GET  /api/campaign-recipient-estimations/<campaignId>   // → { attributes.estimated_recipient_count }
```

---

## 3. Data Flow (generated HTML → draft in Klaviyo)

Everything left of step A is the existing, verified pipeline; A–H is the new `prepare-klaviyo-draft` stage
(orchestrated by the Draft Service, integration plan §7).

```
Export stage produces:  Output/RDD-2026-W32.html  +  package.json (subject, preview, productCount, qa)
        │
        ▼
[A] Gate         QA summary has 0 blockers?  ── NO → skip Klaviyo entirely, report "not ready" (no writes)
        │ YES
        ▼
[B] Preflight    GET /accounts → key ↔ expected RDD account?  ── mismatch → ApprovalRequired, STOP (no writes)
        │ match
        ▼
[C] Idempotency  Look up an existing draft for this campaignId (by name/tag).
        │        found+draft → update path (PATCH);  none → create path;  found+NOT draft → STOP (never touch)
        ▼
[D] Upload HTML  POST /templates  (html = Output HTML)                         → templateId
        │
        ▼
[E] Resolve list GET /lists → configured audience name → listId (confirm exists) → else ConfigError, STOP
        │
        ▼
[F] Create draft POST /campaigns (subject, preview, from, audiences.included=[listId]) → campaignId, messageId
        │
        ▼
[G] Attach HTML  POST /campaign-message-assign-template (messageId ← templateId)
        │
        ▼
[H] Estimate     POST estimation-job → poll GET estimation → recipientCount
        │
        ▼
[I] Read-back    GET /campaigns/{id} → confirm status == "Draft"; build deep link
        │
        ▼
Return success:  { campaignId, deepLink, listName, recipientCount, status:"Draft",
                   sendStatus:"NOT_APPROVED_TO_SEND" }   +  write all of this into the run manifest + log
```

Nothing in A–I sends. Step I asserts the campaign is in `Draft`; if it is ever anything else, that is a hard
error (the system should not be able to produce a non-draft, but we verify).

---

## 4. Security

Full strategy in integration plan §5/§8. Build-level specifics:

**API key storage**
- Private key `pk_…` in **`Brands/RDD/.env`** as `KLAVIYO_API_KEY` (already git-ignored via `Brands/**/.env`).
- Non-secret Klaviyo settings (account id/hint, `from_email`, `from_label`, `reply_to_email`, audience list
  name/id, pinned `revision`) in `config/brands/RDD.config.json` → `klaviyo` block.
- Add `KLAVIYO_API_KEY` **key name only** to `Brands/RDD/integration/.env.example`.
- Read at runtime into the client instance only; **never** written to config, the package, or logs. Extend
  the logger's redaction list to `pk_…` and `Klaviyo-API-Key`.
- Recommend a **least-privilege scoped key** (Campaigns Full · Templates Full · Lists Read · Accounts Read),
  and a rotation note in the integration README.

**Avoiding accidental sends (four independent layers — integration plan §8):**
1. **No send method exists** anywhere in `platform/integrations/klaviyo/`. The send endpoint is never wrapped.
2. **`safety.assertNoSend()` + a unit test** greps the `klaviyo/` tree and **fails the build** if
   `campaign-send-jobs`, `send_campaign`, `send-job`, or a status transition to `Scheduled`/`Sending` appears.
3. **Preflight account lock** (step B) — wrong account → no writes.
4. **QA gate** (step A) — a build with blockers never reaches Klaviyo.
- The Klaviyo stage is **opt-in** (a `--klaviyo` flag, default OFF), so it never runs by surprise.
- **Demo hardening:** target a dedicated **test/seed list**; prefix campaign names with `DEMO —`.

---

## 5. Error Handling

Every failure maps to a typed error (`platform/common/errors.js`) with an actionable message. Failures in
A–B stop **before** any write; failures in D–H stop and report, leaving no partial send (there is no send).

| Failure | Detection | Typed error | User-facing message / recovery |
|---|---|---|---|
| **Missing key** | `KLAVIYO_API_KEY` absent in `.env` | `ConfigError` | "Set KLAVIYO_API_KEY in Brands/RDD/.env (see .env.example)." No call made. |
| **Invalid key (401)** | 401 from any call | `IntegrationError` | "Klaviyo rejected the API key — check it's current and scoped." Abort, no writes. |
| **Insufficient scope (403)** | 403 | `IntegrationError` | Names the missing scope (Campaigns/Templates/Lists). Abort. |
| **Wrong account** | preflight (B) account id ≠ configured | `ApprovalRequired` | "Key points at account X, expected RDD (Y). Halting before any change." |
| **Sending domain / from not verified (400/422)** | on campaign create (F) | `IntegrationError` | "No verified sender for RDD in Klaviyo — verify a sending domain/from-address first." (Known prerequisite, integration plan §9.) |
| **List not found (404 / empty resolve)** | list resolve (E) | `ConfigError` | "Configured audience '<name>' not found. Confirm the list exists / update config." |
| **HTML upload failed (400)** | template create (D) | `IntegrationError` | "Template upload rejected: <detail>." Surface Klaviyo's `errors[].detail`; do not retry blindly. |
| **Assign-template failed** | (G) | `IntegrationError` | Roll forward cleanly: the draft exists but has no template → report so a human can fix/delete; never send. |
| **Estimation job pending/failed** | poll timeout (H) | `IntegrationError` (non-fatal) | Warn, show "recipients: unavailable"; the draft is still valid. |
| **Rate limit (429)** | 429 + `Retry-After` | handled in client | Honor `Retry-After`, exponential backoff, capped retries; then `IntegrationError` if still failing. |
| **Network timeout** | fetch abort | `IntegrationError` | Bounded retries with backoff; then abort with "Klaviyo unreachable — try again / check connectivity." |
| **Campaign already exists** | idempotency lookup (C) | — (handled) | If a **draft** with this name/tag exists → update it (PATCH) or create a clearly-versioned new draft; if a **non-draft** exists → STOP and report (never modify a sent/scheduled campaign). |
| **QA blockers present** | gate (A) | (handled) | Skip the Klaviyo stage entirely; report "not ready for Klaviyo — fix blockers first." |
| **Partial failure mid-stage** | any of D–I | typed + logged | Report exactly what was created (e.g. template but no campaign) so a human can review/clean up in Klaviyo. No send is ever possible, so partial state is safe. |

Principle: **fail loud, fail safe, never fabricate, never send.** Every attempt + outcome is written to the
run's audit log.

---

## 6. Testing Strategy (safe, draft-only, no customer emails)

**Layers:**
1. **Unit — the safety guard.** `assertNoSend` test greps `platform/integrations/klaviyo/` and fails if any
   send/schedule reference exists. This runs in `npm test` and is the hard stop against regression.
2. **Unit — services with a mocked client.** Test `campaign-service`, `template-service`, `list-service`,
   `draft-service` against a **fake HTTP layer** (recorded/stubbed JSON:API responses) — no network, no keys.
   Assert correct payloads (subject/preview/audience), idempotency logic, and error mapping.
3. **Contract — payload snapshots.** Golden-file the request bodies the services would send, so a change to
   the payload shape is reviewed deliberately.
4. **Integration (manual, gated) — against a real Klaviyo test surface.** Use a **dedicated test/seed list**
   (1–2 internal addresses) or, if available, a **separate sandbox Klaviyo account**. Run
   `--klaviyo --dry-run`? No — Klaviyo needs real calls; instead the safeguard is: **draft-only + test list +
   DEMO- name**. Verify **in the Klaviyo UI** that the campaign exists, is **Draft**, has the right template,
   subject, preview, and audience. **Never press send.**
5. **Idempotency test.** Run the command twice; confirm it updates/versions the draft rather than creating
   duplicates or touching anything sent.
6. **Preflight test.** Point at a deliberately wrong account/key; confirm it halts before any write.

**Rules:** no production list is ever targeted in tests; no send endpoint is ever called; every test draft is
`DEMO —` named and deleted after review. Automated tests (layers 1–3) require **no key and no network**.

---

## 7. Implementation Order (small, independently testable tasks)

Each task has a clear "done + test" and can be merged on its own. Tasks map to the modules in integration
plan §6/§7.

| # | Task | Done when | Test (independent) |
|---|---|---|---|
| **T1** | Config + env wiring | `klaviyo` block filled in `RDD.config.json`; `KLAVIYO_API_KEY` in `.env` + `.env.example`; logger redaction extended | `config` loads; logger redacts a `pk_` string (unit) |
| **T2** | `client.js` transport | auth + `revision` headers, JSON:API GET/POST, 429/timeout backoff, error→`IntegrationError` mapping | unit vs mocked fetch: headers correct, 429 retried, errors mapped |
| **T3** | `safety.js` (+ no-send test) | `assertNoSend()` + preflight helper (parse `GET /accounts`) | greps tree → fails on a planted `send_campaign`; passes clean |
| **T4** | `list-service.js` | resolve configured audience name → id (read-only) | unit vs stubbed `/lists`: resolves + errors on not-found |
| **T5** | `template-service.js` | upload HTML → templateId; assign to message | unit vs stubbed `/templates` + assign: correct payloads |
| **T6** | `campaign-service.js` | create Draft campaign+message (subject/preview/from/audience); read-back status | unit vs stubbed `/campaigns`: payload snapshot; status==Draft |
| **T7** | recipient estimation | job + poll → count (non-fatal on failure) | unit vs stubbed job/poll: count returned; timeout → warn |
| **T8** | `draft-service.js` orchestrator | runs steps A–I; enforces QA gate + preflight + idempotency; returns success summary | unit vs mocked services: happy path + each failure path |
| **T9** | pipeline stage + `--klaviyo` flag | new `prepare-klaviyo-draft` stage after export, opt-in, OFF by default | `create --brand RDD` (no flag) unchanged; `--klaviyo` invokes stage |
| **T10** | End-to-end against test list (manual, gated) | one command → a real **Draft** in Klaviyo, correct content + audience; idempotent re-run | verify in Klaviyo UI; run twice → no duplicate; never send |
| **T11** | Docs | `platform/integrations/klaviyo/README.md`: setup, scopes, no-send policy, demo steps | reviewer can set up + run from the README alone |

**Sequence:** T1→T2→T3 (foundation + safety first) → T4/T5/T6/T7 (services, parallelizable) → T8 (wire) →
T9 (expose) → T10 (prove live) → T11 (document). Safety (T3) lands **before** any campaign-creating code.

---

## 8. Success Criteria — when can we say "The File-Driven System is LIVE"?

All of the following must be true and demonstrated:

1. **One command → a Klaviyo draft.** `Create this week's RDD campaign` (with the Klaviyo stage enabled)
   produces a campaign in Klaviyo in **Draft** status.
2. **Correct content.** The draft has the right **subject**, **preview text**, **sender**, the QA-passed
   **HTML** (as its template), and the correct **audience (list)** selected.
3. **Recipient estimate shown.** A recipient count appears in the run summary / preview (or an honest
   "unavailable" if the estimate failed).
4. **QA gate honored.** A build with any blocker never creates a Klaviyo campaign.
5. **No send capability.** `assertNoSend` passes; there is no code path, flag, or tool that sends or
   schedules; the send endpoint is never called.
6. **Preflight safe.** A wrong key/account halts before any write.
7. **Idempotent.** Re-running does not create duplicates or touch a non-draft campaign.
8. **Human-in-the-loop.** Every result is `NOT_APPROVED_TO_SEND`; sending happens only by a human in the
   Klaviyo UI (reviewer ≠ author).
9. **Automated tests green** (`npm test`), including the existing 19 plus the new Klaviyo unit/contract/no-send
   tests, with **no key and no network** required for the automated suite.
10. **Repeatable + documented.** A reviewer can run the whole flow from the README and see the draft appear.

**Prerequisites that must be confirmed before T10 can pass** (external, not code — integration plan §9):
a **verified sending domain / from-address** in the RDD Klaviyo account, a **test list id**, and the
**scoped private key** in `Brands/RDD/.env`.

> **Demo/offline note:** stages BigCommerce→Export run offline via `--source snapshot`; the **Klaviyo stage
> requires network** (it talks to Klaviyo). For the live demo, either run the Klaviyo stage on stage with
> connectivity, or pre-create the draft before the meeting and show it — the earlier stages remain the
> offline-safe backbone (see LIVE_DEMO_WORKFLOW.md §7).

---

**Constraint honored:** planning only — no production code written, no existing file modified; the sole new
artifact is this document. Implementation begins after your approval, starting at **T1**.
