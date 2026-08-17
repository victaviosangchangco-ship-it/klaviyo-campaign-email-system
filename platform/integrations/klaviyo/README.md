# Klaviyo Integration (`platform/integrations/klaviyo/`)

Read-capable Klaviyo integration for the Automation Platform. It authenticates with a private API key,
reads Lists/Segments/Account, and creates **DRAFT** campaigns. It **cannot send or schedule** — by design,
and enforced by an automated guard.

> **The one rule that governs everything here:** the platform **prepares drafts**; a human **sends**.
> There is no send/schedule code anywhere in this folder, and `safety.js` fails the build if any appears.

## Modules

| File | Role | Writes? |
|---|---|---|
| `config.js` | Loads non-secret Klaviyo settings + resolves key **presence** (never the value). | no |
| `client.js` | Transport: auth + `revision` header, timeouts, retry/backoff, error mapping. `get()` + `post()` + `patch()`. | `post`/`patch` (drafts/templates only) |
| `safety.js` | No-send guard — scans this tree for any send/schedule reference and throws if found. | no |
| `list-service.js` | Read-only Lists: `listAll`, `resolveByName`, `resolveById`, `validateConfiguredList`. | no |
| `segment-service.js` | Read-only Segments (mirrors the List Service; reuses `toRelativePath`). | no |
| `draft-campaign-service.js` | **Creates a DRAFT campaign** from a calendar row (Calendar→List→Segment→Transport). | draft only |
| `template-service.js` | **Uploads HTML as a template + attaches it to a draft** (upsert=no-duplicate, assign, readback). | template + assign only |
| `approved-output.js` | Reads + validates a QA-approved Output package (HTML exists + QA PASS) before upload. | no |
| `verify-connectivity.js` | Live diagnostic — auth + account + revision. | no |
| `verify-lists.js` / `verify-segments.js` | Live diagnostics — list/segment retrieval. | no |
| `verify-draft-campaign.js` | Live diagnostic — creates ONE clearly-named DEMO draft. | draft only |
| `verify-html-upload.js` | Live diagnostic — uploads QA-approved HTML + attaches to the DEMO draft. | template + assign only |

## Setup

1. Put the private key in the brand `.env` (git-ignored):
   ```
   KLAVIYO_API_KEY: pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   Least-privilege scopes: **Campaigns: Full · Templates: Full · Lists: Read · Segments: Read · Accounts: Read**.
2. Non-secret settings live in `config/brands/<CODE>.config.json → klaviyo` (api base, pinned revision,
   sender, audience). Sender falls back to the account's own default sender if `klaviyo.sender.fromEmail`
   is unset.

## Live diagnostics (read-only unless noted)

```bash
node platform/integrations/klaviyo/verify-connectivity.js  --brand RDD   # auth + account + revision
node platform/integrations/klaviyo/verify-lists.js         --brand RDD   # retrieve Lists
node platform/integrations/klaviyo/verify-segments.js      --brand RDD   # retrieve Segments
node platform/integrations/klaviyo/verify-draft-campaign.js --brand RDD  # CREATE a DEMO draft (never sent)
node platform/integrations/klaviyo/verify-html-upload.js    --brand RDD  # UPLOAD HTML + attach to the DEMO draft
```

## HTML upload + template assignment (template-service.js)

`attachHtmlToCampaign({ campaignId, templateName, html })` runs: read+validate QA-approved HTML
(`approved-output.js`, QA must PASS) → **upsert** a CODE template by a deterministic name
(`Automation: <campaign_id>`) → resolve the draft's message id → assign the template → read back.

- **No duplicates:** `upsert` finds the template by name and **updates** it (PATCH) if it exists, else
  creates it. Re-running never makes a second source template.
- **Klaviyo clones on assign:** assigning a template to a campaign message creates a message-scoped
  **copy** — so the message's template id differs from the source template id, and the HTML byte length
  differs (Klaviyo normalizes it). Verification therefore checks that the message has an assigned template
  **carrying HTML**, not that the ids match.
- **Draft stays a draft:** only `POST /templates/`, `PATCH /templates/{id}/`, and
  `POST /campaign-message-assign-template/` are used. Confirmed by readback: campaign `status` remains
  `Draft`, `scheduled_at`/`send_time` remain `null`.

## The draft workflow (draft-campaign-service.js)

`createDraftForWeek({ brand, week?, sender, namePrefix })` runs 10 steps: read the calendar campaign →
resolve List → resolve Segment (if present) → validate audience → build payload → `POST /campaigns/`
(→ Draft) → **no schedule, no send** → return `{ campaignId, url, status, sendStatus: NOT_APPROVED_TO_SEND }`.

- **No `send_strategy`** is set, so the campaign has no scheduling semantics; a created campaign is a Draft.
- **Sending** requires `POST /campaign-send-jobs/`, which is **never** wrapped or called (guard-enforced).
- **Idempotency:** `post()` retries only on 429 (rejected, not processed) — never on 5xx/network — so a
  retry can never create a duplicate campaign.
- The draft is created **without a template/HTML** — template upload + assignment is the next sprint.

## Notes / gotchas

- **API revision `2024-10-15`:** campaign-message attributes are **flat** (`channel`/`label`/`content`),
  not nested under `definition`. Confirmed against the live API. Reconfirm on any revision bump.
- **Secrets:** the key is redacted from all logs (`logger.js`), never written to config or the package,
  and never returned by `config.js` (presence flag only).
