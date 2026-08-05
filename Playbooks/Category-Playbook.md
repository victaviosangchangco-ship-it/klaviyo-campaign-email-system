# Category Campaign Playbook

The single-range deep dive: one product category explored in depth, combining education with browse so the reader understands the range and finds the right item within it.

**Not to be confused with:** the Weekly Playbook (a broad cross-range grid) or the Educational Playbook (how-to/compliance guidance with low product density and low pressure). Category is **one range, in depth, with strong product presence**. It teaches enough to help the reader choose, then shows the full spread of that category. It is narrower than Weekly and more commercial than Educational.

## Purpose

A Category campaign zooms in on one range (e.g. bollards, signage, first-aid, shelving) and gives it the full spotlight: what the range covers, how to choose within it, and the specific products available. It answers "which one do I need and what are my options" for a single category. It is the send to run when a range is broad enough that customers under-shop it because they do not know the options.

## Business Goal

Grow revenue and basket depth within a specific category by improving discovery and confident selection. Category is judged on engagement and conversion **within that range**: clicks into the category's products, add-to-cart across variants, and revenue attributed to the featured range. Secondary goal is educating the list so future browse of that category is higher-intent.

## Customer Psychology

The reader has a need somewhere in this category but may not know the full range or how to pick the right variant. The lever is **clarity and confidence**: reduce choice-anxiety by explaining the differences (size, spec, compliance, use case) and then presenting clear options. B2B buyers value being shown the decision criteria ("choose by load rating / site type / standard"). Once they feel informed, they browse deeper and buy with more certainty.

## Copywriting Style

Informative and orienting, but still commercial. Slightly more explanatory than a Weekly (the reader needs help choosing) yet more concise and product-focused than an Educational send. Keep it scannable with clear sub-headings that map to how buyers decide (CLAUDE.md §6.3 copy-length; normal-campaign concision).

- **No em dashes or dash-based interruptions** in intro/supporting copy (§6.2).
- One introduction framing the range; sections then break the category down by a useful axis (type, size, use case) without restating the intro (§5.2).
- Do not reuse a prior category send's framing verbatim; each range gets its own angle (§5.2).

## Design Direction

Shared build standards apply (CLAUDE.md §6): 600px, single-column, table-based, inline CSS, dark-mode aware; brand values from `Design.md`, never invented (§5). Category design often groups products by sub-type, so use clear section dividers while keeping grid balance consistent across every group (§5.1, §6.2). A short "how to choose" band can precede the grid. Respect link/containment safety (§6.6) and §8.1 gates.

## Hero Strategy

A hero that clearly names the category and frames the promise ("Everything you need in [range], sorted"). It can carry a light educational hook (choose the right one) but should still be visually product-led and inviting to browse. Visual-only by default; no hero price unless the Brief explicitly requests it (§7). Build the responsive container correctly so it holds size on desktop and does not shrink on Gmail mobile (§6.6, §8.1 hero gate). Prefer a product banner that matches the category theme, from the approved BigCommerce source, with the live brand site only as an approved fallback (§5.1 product-banners).

## CTA Strategy

A primary CTA to the full category page (Shop all [range]) plus sub-section CTAs into each variant group, each a distinct destination (§6.2 no-duplicate-CTAs). Individual products remain clickable to their own pages. Because Category has multiple grouped CTAs, verify each one navigates correctly after Klaviyo import (§8.1 gate 2).

## Product Strategy

Depth within one range: show enough of the category to represent the real breadth of options, grouped logically. Product-data rules apply in full and matter especially here because the reader is comparing:

- **Never invent** names, prices, SKUs, stock, product URLs or image URLs (§5.1).
- Retrieve from the approved source; for **BigCommerce**, use the API and verify each product is **active and in stock / purchasable on its own product page**, not a category listing (§5.1). Category and collection pages routinely misreport availability, which is exactly the trap here.
- Hidden/unpublished products 404 on the live URL; do not link them, replace with a verified in-stock variant and re-verify. Never leave an empty card (§5.1).
- Report a blocker rather than fabricate options to fill the range (§5.1).

## KPIs

Realistic ranges for an Australian B2B single-category send:

- Open rate: 30 to 42 percent
- CTR: 3.0 to 5.0 percent (focused intent lifts clicks)
- Conversion rate (of clicks): 3 to 7 percent (higher; readers are choosing within a range they need)
- Revenue per recipient: solid, concentrated in one range
- Unsubscribe: below 0.3 percent

**Primary metric: conversion rate within the featured category.** Category succeeds when informed readers pick and buy the right variant, so in-range CVR is the defining signal.

## Bruce Feedback

- Lead with the range and the "how to choose" help; any offer supports it rather than opening the email.
- Every product card across every sub-group must be fully clickable and verified inside Klaviyo after import; a comparison send with dead cards is especially damaging.
- Preserve the established brand vibe and proven category-page structure (§6.3).
- Any promo title is freshly written for this category and campaign, never recycled (§6.5); SC's fixed-dollar coupon rule applies where a promo is used (§6.4).

## Common Mistakes

- Verifying stock on the category/collection listing instead of each product page, then linking out-of-stock items (§5.1, the specific Category trap).
- Linking hidden/unpublished variants whose live URL 404s (§5.1).
- Turning it into a broad multi-range Weekly grid and losing the single-range focus.
- Over-explaining until it reads like an Educational send and burying the products.
- Duplicate generic CTAs across sub-groups (§6.2).
- Block-anchor-around-table cards that fail after Klaviyo import (§6.6, SS-2026-W29).

## Lessons Learned

- The Category send is where the "verify on the product page, not the listing" rule earns its keep: listings misreport stock and hide the real image/price, and a comparison email that links dead variants destroys buyer confidence (§5.1).
- Grouping by a real decision axis (size, spec, standard, use case) converts better than an undifferentiated grid because it mirrors how buyers actually choose.
- Balanced cards across every sub-group matter more here than anywhere: uneven cards make a comparison read as disorganised (§5.1, §6.2).

## See also

- [../07-Prompt Library/00-START-HERE.md](../07-Prompt%20Library/00-START-HERE.md)
- [../07-Prompt Library/Generate-Weekly-Campaign.md](../07-Prompt%20Library/Generate-Weekly-Campaign.md) (nearest generator; adapt for a single-range deep dive)
- [../CLAUDE.md](../CLAUDE.md)
