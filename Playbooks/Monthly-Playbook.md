# Monthly Campaign Playbook

The bigger-picture send: a single cohesive narrative or roundup that steps back from the weekly churn to tell one larger story, recap the month, and set up what is next.

**Not to be confused with:** the Weekly Playbook (a fresh broad product grid every week, fast and functional) or the Seasonal Playbook (an emotional season-change theme). Monthly is longer-arc and editorial. It carries more narrative weight than a Weekly and covers more ground than a single-theme Seasonal send. Do not simply enlarge a Weekly grid and call it Monthly; the structure and intent are different.

## Purpose

Monthly is the marquee send of the calendar month. Its job is to lift the reader out of the weekly rhythm and give them one larger story: a roundup of the month's best, a new-range introduction, a themed edit, or a "what's new and what's coming" recap. It uses more editorial sections and a stronger narrative spine than a Weekly, while still ending in verified, shoppable product blocks. It is the send that reinforces brand relationship, not just this week's browse.

## Business Goal

Deepen relationship and lift average engagement across the whole list, including less-active subscribers who ignore routine weeklies. The Monthly should drive a meaningful revenue spike relative to a weekly and re-activate readers who did not click during the month. It is also the natural home for a considered offer when one is warranted, though the story leads and the offer supports (Bruce: hook before offer).

## Customer Psychology

The reader recognises the Monthly as "the big one" and gives it more attention than a routine send, but only if it feels curated rather than padded. B2B buyers respond to a sense of authority and curation: "here is what mattered this month, here is what is worth your time." They will read a longer email if each section earns its place. Redundancy is punished harder here than in a Weekly because expectations are higher. The email must read as one journey, not a stack of unrelated blocks (§5.2 review-as-one-experience).

## Copywriting Style

More editorial and narrative than a Weekly, but still disciplined. A Monthly can justify slightly longer, more considered copy because it carries a larger story (CLAUDE.md §6.3 copy-length-by-type), yet every section must still have a distinct purpose and must not restate the opener (§5.2). Use section headers to guide the reader through the arc.

- **No em dashes or dash-based interruptions** in intro/supporting copy (§6.2).
- Do not reuse the previous month's angle or theme; carry the brand vibe forward with a genuinely new story (§5.2).
- One introduction only; later sections advance the narrative rather than reintroducing it (§5.2 one-introduction).

## Design Direction

Shared build standards apply (CLAUDE.md §6): 600px, single-column, table-based, inline CSS, dark-mode aware; brand values from `Design.md`, never invented (§5). Monthly uses a richer vertical rhythm than a Weekly: a strong hero, then distinct editorial sections (roundup, feature, new arrivals) each visually differentiated but consistent in alignment, width and typography (§6.3 formatting-consistency). Product blocks within the story still follow grid-balance rules (§5.1, §6.2). Respect link/containment safety (§6.6) and §8.1 gates.

## Hero Strategy

A hero that sets the month's overarching theme or headline story, more editorial in tone than a Weekly hook. Visual-only by default; no baked-in text and no hero price unless the Brief explicitly requests it (§7). Build in an email-safe responsive container so it holds full size on desktop and does not shrink on Gmail mobile (§6.6, §8.1 hero gate). The hero opens the story; the following sections continue it without re-introducing.

## CTA Strategy

A clear primary CTA tied to the month's story (e.g. Explore this month's edit), plus section-level CTAs that each point somewhere genuinely different (the feature, the new range, the roundup). Because a Monthly has several sections, be strict about not repeating the same generic CTA concept (§6.2 no-duplicate-CTAs). Product blocks remain individually clickable. Verify every link post-Klaviyo import (§8.1 gate 2), including the extra editorial-section CTAs a Monthly introduces.

## Product Strategy

Product density sits between a Weekly grid and a story-led send: curated product blocks that support each section rather than one giant grid. All product-data rules still apply in full:

- **Never invent** names, prices, SKUs, stock, product URLs or image URLs (§5.1).
- Retrieve from the brand's approved source; for **BigCommerce**, use the API and verify each product is **active and in stock / purchasable on its own product page**, not a listing (§5.1).
- Hidden/unpublished products 404 on the live URL; do not link them, replace and re-verify. Never leave an empty block (§5.1).
- Report a blocker rather than fabricate if verified products cannot be sourced (§5.1).

## KPIs

Realistic ranges for a monthly marquee to an Australian B2B list:

- Open rate: 35 to 48 percent (higher than weekly; it is anticipated)
- CTR: 3.0 to 5.5 percent
- Conversion rate (of clicks): 3 to 6 percent
- Revenue per recipient: notably above a weekly
- Unsubscribe: below 0.3 percent

**Primary metric: revenue per recipient (with re-engagement of lapsed openers as the key secondary).** Monthly is judged on the revenue lift and on pulling back readers who ignored the weeklies.

## Bruce Feedback

- Story and products hook first; any offer supports the narrative and appears after the reader is engaged.
- Product blocks must be fully clickable and verified inside Klaviyo after import.
- Preserve the established brand vibe and any proven Monthly structure; evolve the story, not the format, unless feedback asks (§6.3 preserve-what-works).
- Any coupon block gets a freshly written, theme-matched title and copy, never recycled (§6.5). SC uses the fixed-dollar "$20 off orders over $200" (§6.4).

## Common Mistakes

- Padding the email with sections that do not advance the story (§5.2 review-as-one-experience).
- Treating Monthly as just a longer Weekly grid with no narrative spine.
- Repeating the same CTA concept across multiple editorial sections (§6.2).
- Reusing the previous month's theme or a leftover promo title such as a recycled seasonal heading (§5.2, §6.5).
- Block-anchor-around-table product blocks that die after Klaviyo import (§6.6, SS-2026-W29 lesson).
- Approving on desktop/localhost only (§8.1 gate 1).

## Lessons Learned

- A Monthly earns its length only when every section is distinct; the fastest way to raise a Monthly's performance is to cut a redundant block, not add one.
- The SS-2026-W29 link and hero-shrink defects apply to every send type: anchors wrap inline content only, full-width tables carry `width:100%` in inline style, images use `max-width:100%` and a defensive class (§6.6). Verify in Klaviyo, not localhost.
- Reused coupon or promo titles from a prior month cheapen the marquee send; generate a unique promo title aligned to this month's theme (§6.5).

## See also

- [../07-Prompt Library/00-START-HERE.md](../07-Prompt%20Library/00-START-HERE.md)
- [../07-Prompt Library/Generate-Monthly-Campaign.md](../07-Prompt%20Library/Generate-Monthly-Campaign.md)
- [../CLAUDE.md](../CLAUDE.md)
