# Automation Campaign Playbook

The triggered-send coordination playbook: content and standards for behaviour-triggered emails (welcome, abandoned cart, browse, post-purchase, win-back). Crucially, the automated **flows** themselves live in a separate project; this workspace coordinates the **content** that goes into them.

**Not to be confused with:** every other playbook in this folder, which covers **one-off, manually scheduled campaign sends** to a list or segment. Automation is **triggered by customer behaviour and sends automatically over time**, not on a calendar. And unlike all the others, the flow logic is not built here.

> **Scope boundary (read first).** The automated **flows** (triggers, timing, branching, wait steps, conditional logic) are built and owned in the **separate Klaviyo Flow project** (`Klaviyo Flow and Claude Code`), which is a completely separate project from this one (CLAUDE.md §1). This Campaign Email System workspace is for **weekly and monthly campaigns**. This playbook exists to **coordinate the email content, copy and HTML standards** for triggered messages and to keep them consistent with campaign sends. **Do not build, edit or configure flows from this workspace.** When flow content is needed, hand the approved, standards-compliant email content to the Flow project; never blur the two projects.

## Purpose

Automation coordinates the **content** for behaviour-triggered lifecycle emails so they meet the same brand and build standards as manual campaigns. Typical triggers (owned in the Flow project) include welcome/onboarding, abandoned cart, abandoned browse, post-purchase, replenishment and win-back. The purpose here is to ensure any content this workspace contributes to those flows is on-brand, email-client-safe, and consistent with the campaign system, then handed over cleanly.

## Business Goal

Support the always-on revenue and retention that flows deliver, by keeping their content quality equal to campaign quality. Flows typically produce a large share of email revenue at high efficiency because they are triggered by intent. This workspace's contribution is judged on whether the content it hands over is accurate, on-brand and defect-free, so the Flow project can deploy it without rework.

## Customer Psychology

Triggered emails meet the reader at a specific behavioural moment, so relevance is already high and expectations are sharp. An abandoned-cart reader knows exactly what they left; a welcome reader is forming a first impression; a win-back reader has drifted and needs a reason to return. The lever varies by trigger (reassurance and helpfulness for welcome, gentle reminder and reduced friction for cart, fresh reason for win-back), but in every case the message must feel like a timely, personal follow-up, not a broadcast.

## Copywriting Style

Personal, concise and context-aware. Triggered emails are generally short and single-purpose (finish your order, welcome aboard, we miss you), so copy is tighter than a campaign (CLAUDE.md §6.3 concision for normal sends; a win-back or welcome series may carry slightly warmer copy). Use dynamic personalisation tokens through the Flow project's standard variables, never hardcoded personal data.

- **No em dashes or dash-based interruptions** in intro/supporting copy (§6.2).
- Never invent personalised values; personalisation is driven by real profile/event data in the flow, not fabricated (§5 never-invent).
- Each message in a series must have a distinct purpose; do not repeat the same message across steps (§5.2 no-repeated-messaging).

## Design Direction

Content contributed here follows the same shared build standards as campaigns (CLAUDE.md §6): 600px, single-column, table-based, inline CSS, dark-mode aware; brand values from `Design.md`, never invented (§5). Triggered emails are usually simpler and lighter than campaign sends (often one hero, a short message and a single clear action, or a dynamic cart/product block). Respect link/containment safety (§6.6) and §8.1 gates in any HTML handed over, since flow emails face the same Klaviyo re-parse and client-rendering issues as campaigns.

## Hero Strategy

Simple and purpose-led: a hero that reflects the trigger moment (welcome, your cart, we saved your spot, come back). Visual-only by default; no price in the hero unless explicitly required (§7). Build the responsive container correctly so it does not shrink on Gmail mobile (§6.6, §8.1 hero gate). Dynamic cart/browse heroes that render product data must still meet image and link safety rules once populated.

## CTA Strategy

One dominant, single-purpose CTA aligned to the trigger (Complete your order / Start shopping / Come back and save). Triggered emails should not dilute the action with competing CTAs (§6.2 no-duplicate-CTAs). Any dynamic product/cart blocks must be individually clickable. Because links are as fragile in flows as in campaigns, clickability must be verified after Klaviyo import within the Flow project (§8.1 gate 2); flag this as the Flow project's verification responsibility.

## Product Strategy

Product content in triggered emails is often **dynamic** (cart contents, browsed items, recommendations) and is resolved by Klaviyo at send time from real data. Where this workspace contributes fixed product references, the data rules apply in full:

- **Never invent** names, prices, SKUs, stock, product URLs or image URLs (§5.1); dynamic blocks must be driven by real catalog/event data, never placeholder-as-fact.
- For any fixed featured product, retrieve from the approved source; for **BigCommerce**, verify it is **active and in stock / purchasable on its own product page** (§5.1).
- Hidden/unpublished products 404 on the live URL; do not reference them; dynamic feeds should exclude unpublished items (§5.1).
- Coupon logic in flows is owned by the Flow project, but any code must still be verified active before it goes live (§6.3); SC follows the fixed-dollar "$20 off orders over $200" convention (§6.4).

## KPIs

Triggered emails outperform broadcast on rate metrics because intent is high. Indicative ranges (final measurement belongs to the Flow project):

- Open rate: 45 to 65 percent (welcome and cart are highest)
- CTR: 6 to 15 percent depending on trigger
- Conversion rate (of clicks): high, especially abandoned cart
- Revenue per recipient: high per triggered send
- Unsubscribe: very low; keep frequency and relevance in check

**Primary metric: conversion/recovery rate of the specific trigger (e.g. cart-recovery rate, welcome-to-first-purchase).** Each flow is judged on the behaviour it is designed to convert, not on broadcast-style reach.

## Bruce Feedback

- Keep triggered content on-brand and to the same quality bar as campaigns; preserve the established brand vibe (§6.3).
- Any product/cart blocks and CTAs must be fully clickable and verified in Klaviyo after import (verification sits with the Flow project, but the content handed over must be built to pass it).
- Coupon codes in any flow must be verified active before going live; write fresh, on-brand promo copy, never recycled (§6.3, §6.5).
- Respect the project boundary: do not build flows here; hand over clean, approved content (CLAUDE.md §1).

## Common Mistakes

- Building or editing flow logic inside this workspace instead of handing content to the separate Flow project (violates CLAUDE.md §1 project separation).
- Repeating the same message across steps of a series instead of giving each a distinct purpose (§5.2).
- Hardcoding personal or product data that should be dynamic, or presenting placeholder data as real (§5).
- Handing over HTML with block-anchor-around-table blocks or attribute-only-width heroes that fail after Klaviyo import (§6.6, §8.1, SS-2026-W29 lessons).
- Dynamic feeds that surface out-of-stock or unpublished (404) products (§5.1).

## Lessons Learned

- The clearest lesson is organisational: flows and campaigns are separate projects, and blurring them causes duplicated, inconsistent work. This workspace coordinates triggered **content**; the Flow project owns the **automation** (CLAUDE.md §1).
- Triggered emails are not exempt from the SS-2026-W29 email-client defects; the same link-nesting and image-container rules apply, and clickability must be verified post-Klaviyo in the Flow project (§6.6, §8.1).
- Because triggered sends run unattended for a long time, an inactive coupon or a dead product link causes ongoing, silent revenue loss; verification before go-live matters even more than for a one-off campaign (§6.3, §5.1).

## See also

- [../07-Prompt Library/00-START-HERE.md](../07-Prompt%20Library/00-START-HERE.md)
- [../07-Prompt Library/Generate-Weekly-Campaign.md](../07-Prompt%20Library/Generate-Weekly-Campaign.md) (nearest content generator; flow logic lives in the separate Klaviyo Flow project)
- [../CLAUDE.md](../CLAUDE.md)
