# Seasonal Campaign Playbook

The mood-and-moment send: an emotional, lifestyle-led campaign built around a change of season and how the reader's needs shift with it, rather than a dated deal.

**Not to be confused with:** the Holiday Playbook (a specific dated event with a hard offer deadline) or the Weekly Playbook (routine broad coverage). Seasonal is about **feeling and context**, not a countdown. It can run for weeks, has no strict expiry, and leads with atmosphere and relevance. If there is a fixed date and a dated discount, that is Holiday, not Seasonal.

## Purpose

Seasonal campaigns connect the range to the time of year and the reader's changing circumstances: winter shutdown prep, summer heat and hydration, back-to-work in the new year, wet-season safety. The send re-frames familiar products through a seasonal lens so they feel newly relevant. It is lifestyle-led and emotional, using the season as a storytelling device to prompt considered, need-based buying rather than deal-chasing.

## Business Goal

Lift relevance and demand for season-appropriate ranges and smooth demand across the year. Seasonal is judged less on a single-window spike (that is Holiday) and more on sustained lift for the featured seasonal range and on engagement quality. It positions the brand as attuned to the customer's real operating conditions, which supports long-term retention.

## Customer Psychology

The reader responds to timeliness and empathy: "they understand what my site/team needs right now." The lever is relevance and mild anticipation, not urgency or scarcity. B2B buyers plan around seasons (heat, wet, shutdown, EOFY prep, new-year restart), so a well-timed seasonal prompt lands as helpful rather than pushy. Emotional, lifestyle imagery does more work here than in any other type except Brand Story; the mood sells the relevance.

## Copywriting Style

Warmer and more evocative than a Weekly, but still clear. A seasonal theme can justify slightly longer, more emotional messaging than a normal campaign (CLAUDE.md §6.3 copy-length-by-type), used to build mood and relevance rather than to hard-sell.

- **No em dashes or dash-based interruptions** in intro/supporting copy (§6.2); keep the emotional copy clean and natural.
- Do not reuse a prior season's eyebrow, headline concept or hero treatment; each seasonal send needs a genuinely new angle (§5.2 fresh).
- One introduction that establishes the season; later sections extend the mood, they do not restate it (§5.2).

## Design Direction

Shared build standards apply (CLAUDE.md §6): 600px, single-column, table-based, inline CSS, dark-mode aware; brand values from `Design.md`, never invented (§5). Seasonal leans harder on lifestyle imagery and seasonal palette accents (within the brand system, never off-brand). Layout is more editorial than a Weekly grid but still ends in balanced, shoppable product blocks (§5.1, §6.2). Respect link/containment safety (§6.6) and §8.1 gates.

## Hero Strategy

A lifestyle-led hero that captures the season's mood and immediately signals relevance to the reader's situation. Visual-only by default; no baked-in text and no hero price unless the Brief explicitly requests it (§7). Because seasonal heroes are often large lifestyle photos, watch image weight and build the responsive container correctly so it renders full-size on desktop and does not shrink on Gmail mobile (§6.6, §8.1 hero gate, §8 image weight).

## CTA Strategy

A relevance-led primary CTA (Get winter-ready / Shop the summer range) rather than an urgency-led one. Section CTAs guide the reader through the seasonal edit, each to a distinct destination (§6.2 no-duplicate-CTAs). No countdown or "ends soon" language unless a genuine dated offer is attached, in which case it is a Holiday send. Verify all links post-Klaviyo import (§8.1 gate 2).

## Product Strategy

Feature products that genuinely suit the season and the theme, curated rather than exhaustive. Product-data rules apply in full:

- **Never invent** names, prices, SKUs, stock, product URLs or image URLs (§5.1).
- Retrieve from the approved source; for **BigCommerce**, use the API and verify each product is **active and in stock / purchasable on its own product page** (§5.1).
- Hidden/unpublished products 404 on the live URL; do not link them, replace and re-verify (§5.1).
- A seasonal reference screenshot is visual direction only and never overrides verified product data (§5.1).
- Report a blocker rather than fabricate if verified seasonal products cannot be sourced (§5.1).

## KPIs

Realistic ranges for an Australian B2B seasonal send:

- Open rate: 33 to 46 percent
- CTR: 2.5 to 4.5 percent
- Conversion rate (of clicks): 2.5 to 5 percent
- Revenue per recipient: moderate, spread over the season rather than one spike
- Unsubscribe: below 0.3 percent

**Primary metric: click-through rate on the featured seasonal range (with sustained range revenue as the key secondary).** Seasonal wins by making the right range feel relevant, measured by engagement with it.

## Bruce Feedback

- Lead with the mood and the products; if there is an offer, it supports the seasonal story rather than opening it.
- Product blocks must be fully clickable and verified inside Klaviyo after import.
- Any promo title is freshly written for this season, never a recycled seasonal heading (§6.5). SC's fixed-dollar coupon rule still applies where a promo is used (§6.4).
- Preserve the established brand vibe while refreshing the seasonal angle (§6.3, §5.2).

## Common Mistakes

- Manufacturing false urgency and turning a mood piece into a fake dated sale (that is a Holiday send, not Seasonal).
- Reusing the previous season's theme, eyebrow or hero treatment (§5.2).
- Recycling a leftover seasonal promo title such as WINTER20 or "Winter Offer" (§6.5).
- Heavy lifestyle hero photos shipped as oversized PNGs that break in the Gmail mobile app (§8, §8.1).
- Letting a reference screenshot override verified product data (§5.1).
- Block-anchor-around-table cards that fail after Klaviyo import (§6.6).

## Lessons Learned

- Seasonal timing is the whole game: the same product reframed for the right season outperforms the same product shown out of context.
- Large lifestyle imagery is where the Gmail-mobile image-weight failure bites; compress and re-host the same approved creative rather than swapping it for a plainer image, which is a design change requiring approval (§8).
- Recycled seasonal promo titles are the classic tell of a rushed seasonal send; generate a fresh, theme-aligned promo title every time (§6.5).

## See also

- [../07-Prompt Library/00-START-HERE.md](../07-Prompt%20Library/00-START-HERE.md)
- [../07-Prompt Library/Generate-Weekly-Campaign.md](../07-Prompt%20Library/Generate-Weekly-Campaign.md) (nearest generator; adapt for the seasonal narrative)
- [../CLAUDE.md](../CLAUDE.md)
