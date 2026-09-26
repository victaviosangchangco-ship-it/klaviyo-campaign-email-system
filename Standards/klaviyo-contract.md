# Klaviyo Runtime Contract

Load only when creating/updating Klaviyo drafts or syncing campaign HTML.
Full history: `Archive/CLAUDE-LEGACY.md` §12–§13.

---

## Core Safety

- **Draft creation is the maximum automation.** Never send, schedule, or activate.
- **One brand = one Klaviyo account = one key.** RDD = `KLAVIYO_API_KEY`, SS = `SS_KLAVIYO_API_KEY`,
  SC = `SC_KLAVIYO_API_KEY`. Keys live ONLY in `Brands/<CODE>/.env` (git-ignored).
- **Never copy a brand's key into another brand's config.**
- **Brand isolation is mandatory.** Campaign_id prefix must match the brand. Cross-brand = refused.

## Audience Confirmation Gate

Before creating or updating ANY Klaviyo draft:
1. Resolve available Segment/List options for that brand's account (read-only).
2. **ASK the user** which audience to use. Wait for confirmation.
3. A previous campaign's audience is NOT a permanent default.
4. If audience cannot be resolved, STOP. Never guess, invent, or use another brand's audience.

## Draft Sync (Idempotent, No Duplicates)

- Find existing Draft by `campaign_id` as a **whole boundary-delimited token** in the draft name.
- If Draft exists → **update** it. If none → **create** one.
- Running the same push N times updates the **same** Draft — never a duplicate.
- On multi-match → reuse most recent, warn.
- STOP if: no matching campaign, matched campaign is not Draft, ambiguous multi-match.

## Brand Sender

- `from_email` = brand sender from config (RDD: `sales@retaildisplaydirect.com.au`,
  SS: `sales@safetysector.com.au`). Falls back to account default only when config is absent.
- `reply_to_email` = same brand sender.
- Applied on both create and update.

## Tracking

- `tracking_options.add_tracking_params: true` on every campaign (writable on create + PATCH).
- Empty `custom_tracking_params` defers to company UTM defaults.

## Approved-Creative Attachment

When `config/approved-html.json` has an entry for a campaign:
- Attach that approved Output HTML **verbatim** (no regeneration).
- Retain registered Subject + Preview Text.
- STOP if file missing or QA fails. Never fall back to regeneration silently.

## Campaign Sync (`sync-campaign-draft.js`)

- Template name: `Automation: <campaign_id>` (upsert by exact name).
- Draft matched by campaign_id boundary token.
- UPDATE existing only — never create a new Draft.
- Touches only Template + Draft message HTML/subject/preview. Never audience, send_strategy, or timing.

## Verify-After-Write

After every create/update: re-fetch and confirm status=Draft, correct HTML attached, correct sender,
correct tracking, no duplicate, id unchanged.

## Preview Text

1. Calendar `preview_text` → use verbatim.
2. Missing/null/empty → generate from campaign context (complements subject, never duplicates it).
3. Never ship an empty preheader.
