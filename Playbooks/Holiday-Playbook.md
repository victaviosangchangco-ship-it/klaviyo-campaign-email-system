# Holiday Campaign Playbook

The time-bound event send: a dated, deadline-driven campaign built around a specific calendar moment (EOFY, Black Friday / Cyber Monday, Christmas, stocktake) with a clear offer and real urgency.

**Not to be confused with:** the Seasonal Playbook (an emotional season-change mood with no hard deadline) or the Clearance Playbook (ongoing markdown/value with scarcity but no calendar event). Holiday is anchored to a **specific date and a dated offer**. When the offer expires, the campaign is over. That deadline is the defining feature and must never be vague or invented.

## Purpose

Holiday campaigns convert a known calendar event into a concentrated commercial push. In an Australian B2B context the big moments are End of Financial Year (EOFY, June), Black Friday / Cyber Monday (BFCM, November), Christmas / end-of-year, and stocktake. The send exists to give the reader a clear, time-limited reason to act now, wrapped in the emotion of the occasion (tax-time savings, biggest deals of the year, get it before the break).

## Business Goal

Maximise revenue inside a tight, dated window. Holiday is one of the highest-revenue sends of the year and is judged on total revenue and order volume during the offer period, not on long-term engagement. It is acceptable to accept a slightly higher unsubscribe rate in exchange for the revenue spike, provided the offer and deadline are genuine and clearly stated.

## Customer Psychology

The reader knows the event is coming and is primed to expect a deal. Urgency and loss-aversion are the primary levers: the fear of missing the best price of the year, or of not ordering before EOFY / the Christmas cut-off. B2B buyers also have a rational trigger (spend before the financial year closes, stock up before the shutdown). The email must make the deadline unmissable and the offer instantly legible. Credibility matters: a fake or perpetual "deadline" trains the list to ignore urgency.

## Copywriting Style

Punchier and more promotional than a normal send. A dated holiday/EOFY/BFCM campaign justifies longer, more emotional or promotional messaging (CLAUDE.md §6.3 copy-length-by-type). Lead with the occasion and the deadline. Repeat the end date in words, not just a countdown graphic.

- **No em dashes or dash-based interruptions** in intro/supporting copy (§6.2), even when the copy is more promotional.
- State the real, specific expiry date and the offer terms clearly; never invent or soften a deadline.
- Keep the promo hierarchy readable; for SC (older audience) avoid tiny fonts on the offer, code, CTA and expiry text (§6.4 readability-first).

## Design Direction

Shared build standards apply (CLAUDE.md §6): 600px, single-column, table-based, inline CSS, dark-mode aware; brand values from `Design.md`, never invented (§5). Holiday design can carry event-specific styling (EOFY, BFCM) but must stay within the brand system and remain accessible. The offer and deadline get strong visual priority. Any promo/coupon banner must be a real clickable element verified post-import (§8.1 gate 2). Respect link/containment safety (§6.6) and all §8.1 gates.

## Hero Strategy

A hero that names the event and the offer window and creates immediate urgency, while still leading with product and theme before the discount dominates (Bruce: hook before offer). Visual-only by default; a price may appear in the hero **only** if the Brief explicitly requests it, otherwise prices stay in the grid (§7, §5.1). Build in an email-safe responsive container so it does not shrink on Gmail mobile (§6.6, §8.1 hero gate).

## CTA Strategy

A single dominant, urgency-led primary CTA (Shop the EOFY sale / Get the BFCM deals) repeated at natural scroll points, all pointing to the same offer destination. Repetition of the **same** deadline-driven CTA is acceptable here (unlike normal sends) because it reinforces one action, but avoid competing generic CTAs that dilute it (§6.2). Verify the coupon/offer link and every CTA in Klaviyo after import (§8.1 gate 6 coupon-link).

## Product Strategy

Feature products that genuinely fit the event and the offer, not random range filler. Product-data rules apply in full:

- **Never invent** names, prices, SKUs, stock, product URLs or image URLs (§5.1).
- Retrieve from the approved source; for **BigCommerce**, use the API and verify each product is **active and in stock / purchasable on its own product page** (§5.1). Holiday drives volume, so stock confidence matters more than ever.
- Hidden/unpublished products 404 on the live URL; do not link them, replace and re-verify (§5.1).
- **Coupons must be verified created and active** in BigCommerce before send (§6.3, §6.4). A dead code on the biggest send of the year is the worst possible failure.
- Report a blocker rather than fabricate products or a deadline (§5.1).

## KPIs

Realistic ranges for a dated Australian B2B holiday/EOFY/BFCM send:

- Open rate: 40 to 55 percent (event anticipation lifts opens)
- CTR: 4.0 to 7.0 percent
- Conversion rate (of clicks): 4 to 8 percent
- Revenue per recipient: highest of any send type
- Unsubscribe: up to 0.5 percent is tolerable given the push

**Primary metric: total revenue within the offer window.** Everything else is secondary during a Holiday send.

## Bruce Feedback

- Even on a promotional send, the hero and products should hook before the offer takes over; do not open with a bare discount slab.
- The coupon/offer must be a real, verified, active code; product cards and the coupon banner must be fully clickable and confirmed in Klaviyo after import.
- Write a fresh, event-specific promo title and copy every time; never recycle a prior holiday's heading (§6.5). SC still uses its fixed-dollar "$20 off orders over $200" unless an explicitly approved special arrangement changes it for the event (§6.4).
- Preserve the established brand vibe even under heavy promotion (§6.3).

## Common Mistakes

- Vague, missing or invented deadlines, or a perpetual "sale ends soon" that never ends.
- Shipping the send with an unverified or inactive coupon code (§6.3, §6.4).
- A percentage discount for SC where the fixed-dollar rule applies and no special arrangement was approved (§6.4).
- Reusing last year's or last event's promo title such as a leftover WINTER20 (§6.5).
- Tiny, unreadable offer/expiry text, especially for SC's older audience (§6.4).
- Block-anchor-around-table cards or an un-clickable coupon banner that fails after Klaviyo import (§6.6, §8.1).

## Lessons Learned

- The single most damaging Holiday failure is a dead or wrong coupon code on the highest-traffic send; verifying the code is active in BigCommerce before send is non-negotiable (§6.3, §6.4).
- The SS-2026-W29 defects hit hardest here because traffic is highest: verify every product card, CTA and the coupon link inside Klaviyo, not on localhost (§6.6, §8.1).
- A genuine, respected deadline keeps urgency effective for future events; a fake one erodes it permanently.

## See also

- [../07-Prompt Library/00-START-HERE.md](../07-Prompt%20Library/00-START-HERE.md)
- [../07-Prompt Library/Generate-Weekly-Campaign.md](../07-Prompt%20Library/Generate-Weekly-Campaign.md) (nearest generator; adapt for the dated offer)
- [../CLAUDE.md](../CLAUDE.md)
