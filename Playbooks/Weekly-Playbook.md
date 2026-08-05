# Weekly Campaign Playbook

The recurring product-coverage send: fast, scannable, broad range exposure, shipped every week to keep the brand front-of-inbox and drive steady mid-funnel browse-to-cart traffic.

**Not to be confused with:** the Monthly Playbook (a bigger single narrative / roundup, not a fresh weekly product spread), the Seasonal Playbook (emotional season-change storytelling, not routine coverage), or the Category Playbook (one range in depth, not a broad cross-range grid). Weekly is the workhorse; every other type is a deliberate departure from it. Never reuse the Weekly grid layout to fulfil another campaign type.

## Purpose

Weekly is the heartbeat of the calendar. Its job is to put a broad, well-merchandised slice of the current range in front of the list every week, with a strong above-the-fold hook and a clean product grid underneath. It is deliberately repeatable in structure so the audience learns to scan it quickly, but the theme, hero and copy are genuinely new every send (CLAUDE.md §5.2 "fresh each week"). It is not a place for long-form storytelling or heavy promotion; it is consistent, reliable range exposure.

## Business Goal

Drive predictable weekly revenue and keep engagement warm between bigger moments (Monthly, Seasonal, Holiday). Success is steady traffic to product pages and a healthy add-to-cart rate across a wide set of SKUs, not a single blockbuster conversion. Weekly also protects deliverability: a consistent cadence of relevant, clicked email keeps the sending domain healthy for the high-stakes sends.

## Customer Psychology

The reader is a returning B2B buyer (procurement, facilities, trade) skimming a busy inbox. They give the email two or three seconds before deciding to scroll or bin it. They are in a low-intent, browsing frame of mind, not urgently shopping. The email wins by being effortless to scan, showing enough relevant range to trigger a "oh, I need that" moment, and making every product one tap from its page. Overload and clutter lose them; a clean hook plus an orderly grid keeps them scrolling (CLAUDE.md §6.3 first-impression + product-visibility-as-retention).

## Copywriting Style

Concise, highly scannable, practical. Weekly is a "normal" campaign, so keep copy short and functional (CLAUDE.md §6.3 copy-length-by-type). Eyebrow, one headline concept, one short intro, then let the products carry the email. Each section must have a distinct purpose and must not restate the hero (CLAUDE.md §5.2 one-introduction, no-repeated-messaging). Australian B2B voice: direct, benefit-led, no fluff.

- **No em dashes and no dash-based sentence interruptions in intro/supporting copy** (CLAUDE.md §6.2). Use clean, natural sentences.
- One theme per week; do not reuse last week's angle, eyebrow, headline or hero treatment (§5.2 fresh-each-week).

## Design Direction

Follow the shared build standards exactly (CLAUDE.md §6): 600px container, single-column, table-based layout with inline CSS, dark-mode aware. Brand values (colour, type, radius, spacing) come from that brand's `Design.md`; never invent them (§5). The signature Weekly layout is a balanced 2-column product grid under the hero. Cards must be cohesive units with consistent image area, typography, spacing and price/CTA placement across every row (§5.1, §6.2). Header logo alignment follows the brand default (SS and SC left-aligned per §6.1; RDD/Stack per their own docs). Respect link/containment safety (§6.6) and the §8.1 gates as build constraints, not restated here.

## Hero Strategy

A single strong above-the-fold hook that names this week's theme and makes the reader want to scroll. Visual-only by default (no baked-in text, no price in the hero unless the Brief explicitly requests it, per §7). Build the hero in an email-safe responsive container so it renders full-size on desktop and does not shrink on Gmail mobile (§6.6, §8.1 hero gate). One hero, one message; the grid supports it, it does not add a second introduction (§5.2).

## CTA Strategy

Primary CTA in the hero (broad action such as Shop the range / Explore this week). Each product card is itself the click path to its product page. Avoid duplicate or redundant generic CTAs: if the hero already says Shop now, do not bolt on a second See full range later unless it goes somewhere genuinely different (§6.2 no-duplicate-CTAs). Every clickable element (hero, cards, logo, footer) must be verified after Klaviyo import, not just on localhost (§8.1 gate 2).

## Product Strategy

Weekly is broad coverage. Default 10 featured products in a 2x5 grid (§5.1); 14 to 16 is acceptable when it suits the theme and the email stays balanced and not overly long (§6.3). Product data rules are strict:

- **Never invent** product names, prices, SKUs, stock status, product URLs or image URLs (§5.1).
- Pull from the brand's approved product source. Where that is **BigCommerce**, retrieve via the BigCommerce API and verify each product is **active and currently in stock / purchasable** on **its own product page**, not a category or collection listing (§5.1).
- Hidden or unpublished products 404 on their live URL. Do not link them; replace with a verified in-stock product and re-verify. Never leave an empty card (§5.1).
- If 10 valid products cannot be sourced, report the blocker rather than fabricating (§5.1).

## KPIs

Realistic ranges for a healthy Australian B2B weekly list:

- Open rate: 30 to 42 percent
- CTR: 2.0 to 4.0 percent
- Conversion rate (of clicks): 2 to 5 percent
- Revenue per recipient: modest and steady
- Unsubscribe: below 0.3 percent

**Primary metric: click-through rate.** Weekly succeeds when a broad set of products earns clicks. Revenue matters but CTR is the defining signal that the range exposure is working.

## Bruce Feedback

- Hero and products should hook the reader before any offer appears; lead with range and theme, not a discount.
- Product cards must be fully clickable (image and title) and verified inside Klaviyo after import, not assumed from the editor or localhost.
- Preserve what works: keep the proven Weekly structure and the established brand vibe unless feedback explicitly asks for a change (§6.3 preserve-what-works).
- If a coupon/promo block is included, its title and copy must be freshly written for this week's theme, never recycled (§6.5). SC sends use the fixed-dollar "$20 off orders over $200" (§6.4); do not apply that to other brands.

## Common Mistakes

- Reusing last week's theme, eyebrow, headline or hero treatment (violates §5.2 fresh-each-week).
- Adding a second introduction after the hero already set the theme (§5.2).
- Unbalanced grid: cards of differing heights, floating images in oversized image areas, inconsistent price placement (§5.1, §6.2).
- Wrapping a product card `<table>` inside a single `<a>` so cards render but stop being clickable after Klaviyo import (the SS-2026-W29 defect, §6.6).
- Oversized PNG product photos that look fine on desktop but break in the Gmail mobile app (§8, §8.1).
- Approving on a browser/localhost preview alone (§8.1 gate 1).

## Lessons Learned

- **SS-2026-W29:** product cards used a block-level `<table>` inside an anchor. Browser preview looked clickable; after Klaviyo re-parsed the links on import the cards were dead. Fix: anchor wraps inline content only, image in its own anchor, name/price in a separate anchor to the same URL (§6.6). Verify clickability in a real Klaviyo test import.
- **SS-2026-W29 hero shrink:** a full-width table with width only as an HTML attribute collapsed on Gmail/Yahoo mobile. Put `width:100%` in inline style and give the hero image `max-width:100%` plus a defensive responsive class (§6.6).
- Consistent weekly cadence and clean scannable design compound over time: engagement and deliverability improve, which protects the big sends.

## See also

- [../07-Prompt Library/00-START-HERE.md](../07-Prompt%20Library/00-START-HERE.md)
- [../07-Prompt Library/Generate-Weekly-Campaign.md](../07-Prompt%20Library/Generate-Weekly-Campaign.md)
- [../CLAUDE.md](../CLAUDE.md)
