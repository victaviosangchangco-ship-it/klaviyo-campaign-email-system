# Product Launch Workflow

_Part of the BRD modular source. Human-first: how a product launch is planned and produced, and why it is
treated differently from a weekly. Strategy detail: [Launch Playbook](../Playbooks/Launch-Playbook.md)._

## What a launch is

A Product Launch introduces a new product or range to the existing audience **as news**. Its job is
awareness, understanding and desire, then a click to a live product page. It is premium and benefit-led,
**not** a discount push. Urgency comes from *availability* ("now in stock", "first run"), not from a
countdown sale.

## The workflow

1. **Brief** — capture the launch: the theme, the objective (first-wave traffic + first sales), and the
   **approved SKU list**. Only the approved SKUs may appear; newly-created products are never
   auto-selected.
2. **Product verification (the critical gate)** — verify every SKU against the **BigCommerce API**, not
   storefront search (search hides unpublished items and gives false negatives). For each SKU confirm:
   exact SKU, product name, `visible=true` (published), in stock, non-zero price, a **live URL that
   returns HTTP 200**, and a public image. Produce a **mapping table** (SKU · name · URL · status · stock
   · price · image · confidence) and get it **approved before building**. Report blockers; never
   substitute products silently.
   - A hidden (`visible=false`) product returns 404 on its customer URL. It is a dead link and cannot
     ship. It may appear only in a *draft* with a clearly-marked placeholder and a "launching soon" flag,
     and it blocks the **send** until published and re-verified (the build still lives in Output for
     preview; approval-to-send status is tracked in Brief/Review).
   - Never display another brand's name on the send; if a product title carries one, flag it for renaming.
3. **Brand layer** — apply the brand's real assets and colours from approved sources; tag inferred values.
4. **Draft** — build the launch layout (Hero → Launch badge → Headline → Introduction → Why these
   products → Product grid → CTA → Trust → Footer). Reuse the shared framework; apply all email-client
   safety rules.
5. **Review + QA** — run the [Launch QA Checklist](../07-Prompt%20Library/QA-Launch-Checklist.md) and the
   email-client compatibility gates; verify clickability after Klaviyo import and rendering on Apple Mail,
   Gmail, Outlook, Yahoo and Klaviyo Preview.
6. **Output** — updated to the latest build for preview/QA/review each time a draft is produced. The
   **send** happens only when every grid product is live (200) and the QA gate passes; until then the
   Review status stays *not approved to send*.

## Lesson baked into this workflow (RDD launch, 2026-07)

All 13 approved SKUs existed in BigCommerce, but 9 were newly-created and **hidden** — invisible to
storefront search yet returned by the API, with live URLs that 404'd. The API is the source of truth for
product state; verifying visibility and live HTTP status before a product enters the grid is now a
mandatory launch gate.

See also: [Campaign Types](campaign-types.md) · [Holiday Campaign Framework](holiday-campaign-framework.md).
