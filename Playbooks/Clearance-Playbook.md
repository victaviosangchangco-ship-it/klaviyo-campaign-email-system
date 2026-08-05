# Clearance Campaign Playbook

The value-and-scarcity send: genuine markdowns on limited or ex-stock lines, driven by honest scarcity ("when it's gone, it's gone") rather than a calendar event.

**Not to be confused with:** the Holiday Playbook (a dated event with a time-limited offer) or the Category Playbook (an in-depth range explainer at full price). Clearance is about **price, value and finite stock**. Its urgency comes from limited quantity, not a deadline date. Stock honesty is the defining discipline: you are selling the last of something, so availability must be truthful.

## Purpose

Clearance campaigns move end-of-line, overstock, superseded or discontinued inventory by pairing a real discount with genuine scarcity. The send exists to clear stock, recover cash and free warehouse space, while giving value-driven buyers a real reason to act. It trades on honesty: the discount is real, the stock is limited, and once sold the item is gone.

## Business Goal

Sell through specific clearance inventory quickly at an acceptable margin and convert the freed capital and space into fresh stock. Clearance is judged on **sell-through of the clearance lines** and units moved, not on brand-building or long-term engagement. A secondary goal is capturing price-sensitive buyers who ignore full-price sends.

## Customer Psychology

Two levers: **value** ("this is genuinely cheaper than usual") and **scarcity** ("limited stock, won't be restocked"). B2B buyers are rational but respond strongly to a real bargain on something they use, and to the fear that the low quantity will sell out before they order. Trust is fragile here: inflated "was" prices or fake scarcity are quickly spotted and damage credibility across all future sends. Honest, specific scarcity ("limited quantities, no restock") outperforms vague hype.

## Copywriting Style

Direct, value-forward and honest. More promotional than a Weekly but grounded in fact, not hype (CLAUDE.md §6.3 copy-length-by-type allows promotional messaging). State the real saving and the honest stock position plainly.

- **No em dashes or dash-based interruptions** in intro/supporting copy (§6.2).
- Never overstate the discount or invent scarcity; the value and the stock claim must be true.
- One clear introduction of the clearance event; product blocks then carry the deals without restating the intro (§5.2).

## Design Direction

Shared build standards apply (CLAUDE.md §6): 600px, single-column, table-based, inline CSS, dark-mode aware; brand values from `Design.md`, never invented (§5). Clearance design highlights price and saving clearly (was/now where truthful) and can use a value-led treatment while staying on-brand and accessible. Cards remain balanced despite mixed lines and image quality (§5.1, §6.2). Respect link/containment safety (§6.6) and §8.1 gates.

## Hero Strategy

A hero that signals value and finite stock ("Clearance: limited stock, while it lasts") and still leads with the products rather than a bare price slab (Bruce: hook before offer). Visual-only by default; a price appears in the hero only if the Brief explicitly requests it, otherwise savings sit on the cards (§7, §5.1). Build the responsive container correctly so it does not shrink on Gmail mobile (§6.6, §8.1 hero gate).

## CTA Strategy

A value-led primary CTA (Shop clearance / Grab it before it's gone) plus per-card CTAs to each clearance product. Scarcity language can support the CTA but must be honest. Avoid competing generic CTAs (§6.2). Because clearance items sell out, ensure every product link is live and verify all links after Klaviyo import (§8.1 gate 2).

## Product Strategy

Real clearance lines only, with truthful stock. Product-data rules apply in full and stock accuracy is the highest-risk element:

- **Never invent** names, prices, SKUs, stock, product URLs or image URLs, and never invent a discount or a "was" price (§5.1).
- Retrieve from the approved source; for **BigCommerce**, use the API and verify each product is **active and in stock / purchasable on its own product page**, not a listing (§5.1). Clearance stock moves fast, so verify close to send.
- Hidden/unpublished or already-sold-out lines 404 or read out of stock on the live URL; do not link them, replace with a verified in-stock clearance line and re-verify. Never leave an empty card (§5.1).
- If the discount is a coupon, it must be verified created and active in BigCommerce before send (§6.3).
- Report a blocker rather than fabricate clearance stock to fill the grid (§5.1).

## KPIs

Realistic ranges for an Australian B2B clearance send:

- Open rate: 32 to 45 percent ("clearance/sale" in the subject lifts opens)
- CTR: 3.5 to 6.0 percent
- Conversion rate (of clicks): 4 to 9 percent (value-seekers convert fast)
- Revenue per recipient: variable; depends on discount depth
- Unsubscribe: below 0.4 percent

**Primary metric: sell-through of the clearance lines (units moved).** Clearance is judged on whether the targeted stock actually clears, not on revenue per recipient.

## Bruce Feedback

- Lead with the products and the honest value story; the discount supports it rather than opening the email with a naked price.
- Product cards must be fully clickable and verified inside Klaviyo after import, and stock must be truthful at send time.
- Any coupon-based discount must be verified active in BigCommerce; write a fresh, honest promo title for the clearance event, never a recycled heading (§6.5, §6.3). SC's fixed-dollar coupon convention still applies where a coupon is used (§6.4).
- Preserve the established brand vibe even on a value-led send (§6.3).

## Common Mistakes

- Fake scarcity or inflated "was" prices that erode trust across the whole list.
- Linking clearance items that have already sold out (live URL out of stock or 404) because stock was checked too early or on a listing, not the product page (§5.1).
- Leaving an empty card when a line sells out instead of replacing and re-verifying (§5.1).
- Shipping a coupon-based clearance offer with an unverified code (§6.3).
- Reused promo titles from a previous sale (§6.5).
- Block-anchor-around-table cards that fail after Klaviyo import (§6.6).

## Lessons Learned

- Clearance lives and dies on stock honesty: because quantities are finite and moving, verify each line on its own product page close to send, and be ready to swap sold-out lines and re-verify (§5.1).
- Genuine value plus honest, specific scarcity outperforms manufactured urgency and protects long-term list trust.
- The SS-2026-W29 link defect is doubly costly on Clearance because clicks are high-intent: a dead card is a lost, ready-to-buy sale. Verify clickability in Klaviyo, not localhost (§6.6, §8.1).

## See also

- [../07-Prompt Library/00-START-HERE.md](../07-Prompt%20Library/00-START-HERE.md)
- [../07-Prompt Library/Generate-Weekly-Campaign.md](../07-Prompt%20Library/Generate-Weekly-Campaign.md) (nearest generator; adapt for value + scarcity)
- [../CLAUDE.md](../CLAUDE.md)
