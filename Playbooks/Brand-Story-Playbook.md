# Brand Story Campaign Playbook

The trust-and-values send: low product density, high credibility. It tells the reader who the brand is, why it exists, and why it can be trusted, building relationship rather than pushing a sale.

**Not to be confused with:** the Weekly Playbook (broad product coverage) or the Educational Playbook (practical how-to/buying guidance). Brand Story is about **credibility, values and trust**, not product selection or instruction. Product presence is deliberately minimal. It is the least commercial send type in the system and must not be dressed up as a product grid with a story pasted on top.

## Purpose

A Brand Story campaign builds trust and emotional connection. It communicates the brand's origin, values, credentials, people, quality standards, guarantees and proof (Australian owned, years in trade, certifications, real customers). Its job is to make the reader believe in the brand so that every future commercial send lands on warmer ground. It is relationship infrastructure, not a transaction.

## Business Goal

Increase trust, brand affinity and long-term retention; reduce churn and support future conversion across all other send types. Brand Story is not judged on immediate revenue. Its value shows up as higher engagement and conversion on subsequent sends, lower unsubscribe over time, and stronger replies/sentiment. Attribution is soft and longer-term by design.

## Customer Psychology

The reader is deciding whether this brand is a supplier they can rely on. B2B buyers place real weight on credibility signals: how long you have traded, who you supply, your standards and guarantees, whether you are local. The lever is **trust and reassurance**, not desire or urgency. Authenticity is everything: proof points (real numbers, real certifications, real customers) build belief, while vague self-praise reads as empty and can backfire. Do not invent credentials.

## Copywriting Style

Warm, human and credible. This is the one send type where longer, more emotional narrative copy is clearly justified (CLAUDE.md §6.3 copy-length allows longer emotional messaging for special sends). Tell a genuine story with concrete proof. Still disciplined: every claim must be true and, where a brand value is used, sourced from an approved brand doc with its confidence tag carried through (§5 never-invent; carry `[Confirmed]`/`[Inferred]`/`To be confirmed`).

- **No em dashes or dash-based interruptions** in intro/supporting copy (§6.2), even in a flowing narrative.
- Do not invent brand facts, credentials, history or trust claims; if a value is not in an approved source it is `To be confirmed` and must not be stated as fact (§5).
- One narrative through-line; sections deepen it rather than repeating it (§5.2).

## Design Direction

Shared build standards apply (CLAUDE.md §6): 600px, single-column, table-based, inline CSS, dark-mode aware; brand values from `Design.md`, never invented (§5). Brand Story design is editorial and image-led (people, premises, proof), with generous whitespace and trust marks (certifications, badges, guarantees) used truthfully. Far fewer product blocks than any other type. Any trust badges/logos must be real, approved assets with meaningful alt text (§5, CS-11). Respect link/containment safety (§6.6) and §8.1 gates.

## Hero Strategy

An emotive, human hero that embodies the brand (founders, team, workshop, a signature product in context) and opens the story. Visual-only by default; no baked-in text and no price in the hero (§7). This is not a product-price moment. Build the responsive container correctly so the hero holds full size on desktop and does not shrink on Gmail mobile (§6.6, §8.1 hero gate); watch weight on large photographic heroes (§8).

## CTA Strategy

Soft, relationship-led CTAs: Read our story / Meet the team / See our guarantee / Explore what we stand for. At most one gentle commercial CTA (Browse the range) near the end, clearly secondary. Avoid stacking multiple hard-sell CTAs; that breaks the trust tone (§6.2 no-duplicate/redundant CTAs). Verify every link after Klaviyo import (§8.1 gate 2), including story-page and guarantee links.

## Product Strategy

Minimal by design. A Brand Story may feature a small handful of signature or hero products as proof of quality, not a grid. Whatever products do appear still obey the data rules in full:

- **Never invent** names, prices, SKUs, stock, product URLs or image URLs (§5.1).
- For any featured product, retrieve from the approved source; for **BigCommerce**, use the API and verify it is **active and in stock / purchasable on its own product page** (§5.1).
- Hidden/unpublished products 404 on the live URL; do not link them (§5.1).
- Do not pad the email with products to make it feel commercial; low density is the point.

## KPIs

Realistic ranges for an Australian B2B brand-story send:

- Open rate: 30 to 42 percent
- CTR: 1.5 to 3.0 percent (lower by design; clicks are not the goal)
- Conversion rate: low and not the objective
- Revenue per recipient: not a success measure for this type
- Unsubscribe: below 0.2 percent (a good brand story should reduce unsubscribes)

**Primary metric: engagement quality and downstream lift (read-through, replies/sentiment, and improved performance on subsequent sends).** Brand Story is judged on trust built, not clicks or revenue.

## Bruce Feedback

- Trust is earned with real proof, not slogans; use genuine, approved credentials and never invent them.
- Keep it human and preserve the established brand vibe; this send defines the vibe other sends inherit (§6.3 preserve-what-works).
- Any product or story links must be fully clickable and verified in Klaviyo after import.
- Resist the urge to bolt a sale onto a trust send; if a coupon ever appears it needs a freshly written, on-brand title (§6.5) and, for SC, the fixed-dollar convention (§6.4), but a hard offer usually does not belong here.

## Common Mistakes

- Inventing or embellishing credentials, history or trust claims (violates §5 never-invent).
- Turning it into a product grid with a story caption; over-commercialising kills the trust effect.
- Stating an `Inferred` or unconfirmed brand fact as if `Confirmed` (§5 confidence tags).
- Stacking hard-sell CTAs that break the relationship tone (§6.2).
- Oversized photographic heroes that break on Gmail mobile (§8, §8.1).
- Block-anchor-around-table blocks that fail after Klaviyo import (§6.6).

## Lessons Learned

- The strongest Brand Story sends use specific, verifiable proof (years trading, real certifications, named customers) rather than adjectives; specificity is what builds belief.
- Because brand facts must never be invented, Brand Story is the send most dependent on approved brand sources being populated; where values are `To be confirmed`, stop and request them rather than filling gaps (§5).
- A trust send done well lifts every later campaign, which is why it is measured on downstream effect, not immediate clicks.

## See also

- [../07-Prompt Library/00-START-HERE.md](../07-Prompt%20Library/00-START-HERE.md)
- [../07-Prompt Library/Generate-Monthly-Campaign.md](../07-Prompt%20Library/Generate-Monthly-Campaign.md) (nearest generator; adapt for a low-product narrative)
- [../CLAUDE.md](../CLAUDE.md)
