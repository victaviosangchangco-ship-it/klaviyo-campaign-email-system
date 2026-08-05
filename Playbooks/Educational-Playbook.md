# Educational Campaign Playbook

The helpful, low-pressure send: how-to guidance, compliance explainers and buying guides that make the reader more capable and more confident, with product as supporting reference rather than the pitch.

**Not to be confused with:** the Category Playbook (a commercial single-range deep dive with strong product presence) or the Brand Story Playbook (credibility and values narrative). Educational is about **teaching the reader something useful** (how to choose, how to comply, how to use), with low selling pressure. It carries more practical content than Category and is more product-adjacent than Brand Story, but it never turns into a hard sell.

## Purpose

An Educational campaign gives the reader genuine, usable knowledge: how to choose the right product for a job, how to meet an Australian standard or compliance requirement, how to install/use/maintain something, or a buying-guide that reduces the risk of buying wrong. It positions the brand as the knowledgeable partner. Products appear as helpful references to what the guidance describes, not as a grid to shop.

## Business Goal

Build authority, engagement and mid-funnel confidence so readers buy correctly and return. Educational is judged on engagement (read-through, clicks into guides/resources) and on assisted conversions later, not on immediate revenue. A well-run educational series reduces wrong-product returns and support load and deepens trust in the brand's expertise.

## Customer Psychology

The reader has a question or a risk they want to get right: "which product meets the standard," "what size do I need," "how do I install this correctly." B2B buyers are accountable for compliance and for not wasting budget on the wrong item, so genuinely helpful content earns strong goodwill. The lever is **competence and reassurance**, delivered with low pressure. Overt selling here feels like a bait-and-switch and undermines the helpfulness that makes the send work.

## Copywriting Style

Clear, instructive and plain-spoken. Educational content can run longer than a normal campaign when the topic needs it (CLAUDE.md §6.3 copy-length-by-type), but it should stay well-structured and scannable with numbered steps, checklists and clear sub-headings. Accuracy is paramount: never state a standard, spec or instruction that is not verified.

- **No em dashes or dash-based interruptions** in intro/supporting copy (§6.2); instructional copy especially benefits from clean, natural sentences.
- Do not invent compliance facts, standards numbers, specs or product capabilities; if unverified, do not state it (§5 never-invent).
- One clear framing of the topic; each section teaches a distinct point rather than repeating (§5.2).

## Design Direction

Shared build standards apply (CLAUDE.md §6): 600px, single-column, table-based, inline CSS, dark-mode aware; brand values from `Design.md`, never invented (§5). Educational design favours readable long-form structure: numbered steps, checklists, comparison tables, diagrams, generous line spacing and clear hierarchy. Keep body text legible (important where the audience skews older, e.g. SC readability principles in §6.4 apply to instructional copy). Any product references stay balanced and secondary (§5.1, §6.2). Respect link/containment safety (§6.6) and §8.1 gates.

## Hero Strategy

A hero that clearly states the guide's promise and value ("How to choose the right [product] for your site" / "Meeting [standard]: a quick guide"). Informative and inviting, not salesy. Visual-only by default; no price in the hero (§7). Build the responsive container correctly so it holds size on desktop and does not shrink on Gmail mobile (§6.6, §8.1 hero gate).

## CTA Strategy

Helpful, low-pressure CTAs: Read the full guide / Download the checklist / See the standard / Talk to our team. Any product CTA (View the products mentioned) is clearly secondary and framed as "here are the items this guide refers to," not "buy now." Avoid stacking commercial CTAs (§6.2). Verify every link, including any resource/guide links, after Klaviyo import (§8.1 gate 2).

## Product Strategy

Products are supporting references to the guidance, not the headline. Low-to-moderate density. Whatever products appear obey the data rules in full because linking a wrong or dead item destroys the send's credibility:

- **Never invent** names, prices, SKUs, stock, product URLs or image URLs, and never invent specs, standards or capabilities (§5.1, §5).
- For any referenced product, retrieve from the approved source; for **BigCommerce**, use the API and verify it is **active and in stock / purchasable on its own product page**, not a listing (§5.1).
- Hidden/unpublished products 404 on the live URL; do not link them, replace with a verified in-stock equivalent and re-verify (§5.1).
- Report a blocker rather than fabricate a product or a spec to complete the guide (§5.1, §5).

## KPIs

Realistic ranges for an Australian B2B educational send:

- Open rate: 33 to 45 percent (a genuinely useful subject lifts opens)
- CTR: 2.0 to 4.0 percent (clicks into guides/resources)
- Conversion rate: modest and mostly assisted/delayed, not the objective
- Revenue per recipient: low direct; value is downstream
- Unsubscribe: below 0.2 percent (helpful content reduces churn)

**Primary metric: engagement (read-through and clicks into the guidance/resources), with assisted downstream conversion as the key secondary.** Educational wins by making readers more capable, measured by how deeply they engage with the content.

## Bruce Feedback

- Be genuinely helpful; low pressure is the point, so resist turning a guide into a product pitch.
- Keep instructional and compliance content accurate and never invented; readers act on it.
- Any product references and resource links must be fully clickable and verified in Klaviyo after import.
- Preserve the established brand vibe and readable typography, especially for older audiences (§6.4 readability, §6.3 preserve-what-works). A coupon rarely belongs here; if used, give it a fresh on-brand title (§6.5) and, for SC, the fixed-dollar convention (§6.4).

## Common Mistakes

- Stating a standard number, spec or instruction that was not verified (violates §5 never-invent) and exposes the brand to compliance risk.
- Over-selling and burying the guidance under product blocks, breaking the low-pressure promise.
- Tiny, dense body text that makes instructional content hard to read, especially for SC's older audience (§6.4).
- Linking a referenced product that is out of stock or whose URL 404s (§5.1).
- Duplicate commercial CTAs that undercut the helpful tone (§6.2).
- Block-anchor-around-table references that fail after Klaviyo import (§6.6).

## Lessons Learned

- Educational credibility collapses instantly if a stated fact or standard is wrong, so verification of every claim and every linked product is the core discipline of this type (§5).
- Readability is a first-class requirement here, not a nicety: instructional content that is hard to read does not get followed, and the SC older-audience readability rules apply to any instructional send (§6.4).
- The most effective educational sends lead with the reader's problem and only reference products as the answer, which is why the primary metric is engagement, not immediate revenue.

## See also

- [../07-Prompt Library/00-START-HERE.md](../07-Prompt%20Library/00-START-HERE.md)
- [../07-Prompt Library/Generate-Monthly-Campaign.md](../07-Prompt%20Library/Generate-Monthly-Campaign.md) (nearest generator; adapt for low-pressure guidance)
- [../CLAUDE.md](../CLAUDE.md)
