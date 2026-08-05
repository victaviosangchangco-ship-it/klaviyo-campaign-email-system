# Flow Design Recommendations

> **Part of `Shared/Email-Design-System/` (STD-DESIGN).** Start at that folder's `README.md`.
> **Contains no HTML, no CSS, no Cerberus code, no brand values and no measurements.**
>
> These are **starting positions, not mandates.** Each row is the default a designer would reach for
> without other information. A flow's own spec, its reference material and the brand's design document all
> outrank it — and a recorded, reasoned departure is always preferable to an unexamined default.

---

## Document control

| | |
|---|---|
| **Part of** | **STD-DESIGN** — `Shared/Email-Design-System/` |
| **Status** | **ACTIVE** |
| **Version** | **1.0.0** |
| **Owner** | Project Owner |
| **Applies to** | Klaviyo Campaign Email System · Klaviyo Flow and Claude Code |
| **Mirroring** | Byte-identical copies in both projects. Both canonical. Any change applies to both in the same edit. |
| **Scope** | **Default design pairings per flow type.** Recommendations only; no rules. |

---

## 1. How to read a recommendation

Every entry gives five decisions in one chain:

```
   HERO PATTERN      →  Hero-Pattern-Library.md
   DESIGN LANGUAGE   →  Design-Language-Library.md
   KEY SECTION       →  Section-Pattern-Library.md
   CTA STRATEGY      →  how hard the ask is
   EMOTIONAL OBJECTIVE  →  what the reader should feel
```

### 1.1 The emotional objective is the load-bearing field

It is listed last and matters most. **Two emails with identical patterns and different emotional
objectives are different emails**, and the emotional objective is what the copy, the pacing and the CTA
strength are tuned to. If the emotional objective is not stated, the design has no target.

### 1.2 CTA strategy scale

| Strength | Reads as | Use when |
|---|---|---|
| **Soft** | An invitation | Intent is uncertain; the relationship is early |
| **Medium** | A clear next step | Intent exists; no time pressure |
| **Strong** | A direct ask | Intent is high, or the sequence is escalating |
| **Urgent** | Act now | The reason to hurry is real and per-recipient |

**Urgent is the only level that can become dishonest.** In an automated flow it is legitimate only where
the trigger itself supplies a genuine, recipient-specific reason. The governing rules on honest urgency
and evergreen content live in each project's `CLAUDE.md`.

### 1.3 Escalation is a sequence property

A multi-touch flow escalates. The pattern, language and CTA strength are selected **per email**, not per
flow — and the last touch cannot escalate if the first already spent the incentive. Where a flow's touches
differ materially, the entry below shows the sequence.

---

## 2. Quick reference

| Flow | Hero pattern | Design language | Key section | CTA | Emotion |
|---|---|---|---|---|---|
| **Welcome Series** | Brand Story → Category | Editorial Magazine / Scandinavian | Benefits · Featured Collection | Soft → Medium | Belonging |
| **Abandoned Checkout** | Product → Trust → Offer | Shopify Plus → Conversion | Trust Indicators · Guarantee | Medium → Strong → Urgent | Reassurance → Resolution |
| **Browse Abandonment** | Browse / Product | Lifestyle Commerce | Related Products | Soft | Curiosity |
| **Price Drop** | Price Drop | Premium Ecommerce | Price comparison · Guarantee | Urgent | Excitement |
| **Customer Winback** | Winback / Offer | Luxury Retail | Benefits · Social Proof | Strong | Recovery |
| **Back In Stock** | Product | Product Showcase | Availability · Guarantee | Medium | Relief |
| **Post Purchase** | Brand Story → Product | Scandinavian / Modern SaaS | Benefits · FAQ | Soft | Confidence |
| **Review Request** | Trust | Modern SaaS / Premium Corporate | Guarantee · Social Proof | Soft | Appreciation |
| **Cross Sell** | Collection / Category | Grid Commerce / Premium Ecommerce | Related Products · Social Proof | Medium | Discovery |
| **Replenishment** | Product | Industrial B2B / Grid Commerce | Product Grid · Guarantee | Medium | Convenience |
| **Sunset** | Trust / Offer | Premium Corporate → Conversion | Guarantee · Category Navigation | Soft → Strong | Respect |
| **VIP** | Collection / Launch | Luxury Retail | Featured Collection · Social Proof | Medium | Recognition |
| **Birthday** | Offer | Promotional / Luxury Retail | Coupon Block · Guarantee | Strong | Delight |

**This list follows the supported-flow set in the Flow project's `CLAUDE.md` §1 and is extensible.** A new
flow type is supported by adding a row here and a `Flow.md` there — not by changing any standard.

---

## 3. The recommendations

### 3.1 Welcome Series

```
Brand Story Hero → Editorial Magazine → Benefits → Soft CTA → Belonging
```

- **Why.** The reader has given permission, not intent. The job is to earn the first visit by being worth
  reading, not by discounting. This is the highest-leverage email in the system and the only one where a
  low conversion rate is the correct outcome.
- **Sequence.** Touch 1 Brand Story Hero, soft CTA. Touch 2 Category or Collection Hero, medium CTA. Touch
  3 Product or Offer Hero if an incentive exists.
- **Alternative language.** Scandinavian Minimal where the brand voice is calm and material-led; Premium
  Corporate for government- or institution-facing brands.
- **Avoid.** Leading with a discount — it trains the list to wait. Trust Indicators in touch one, which
  answers an objection not yet formed.

### 3.2 Abandoned Checkout

```
Product Hero → Shopify Plus → Trust Indicators → Medium CTA → Reassurance
```

- **Why.** The reader chose the items. Nothing needs selling; something needs unblocking. The Hero recalls
  the cart so the first screen answers "this is *mine*", and the reassurance names the friction.
- **Sequence.** Touch 1 Product Hero, medium CTA, no incentive. Touch 2 **Trust Hero**, strong CTA — the
  objection, not the cart, is now the subject. Touch 3 **Offer Hero** in Conversion Landing Page language,
  urgent CTA, if an incentive is authorised.
- **Emotional arc.** Reassurance → objection removed → resolution.
- **Avoid.** An incentive in touch one, which pays for a purchase that was already coming. A generic brand
  image above the items.

### 3.3 Browse Abandonment

```
Browse Hero → Lifestyle Commerce → Related Products → Soft CTA → Curiosity
```

- **Why.** Interest without commitment. The reader looked and left, so pressure is the wrong instrument;
  recognition is the right one. Lifestyle Commerce works because the reader has not yet imagined owning it.
- **Alternative language.** **Premium Ecommerce or Product Showcase where genuine in-situ photography does
  not exist** — Lifestyle Commerce collapses without it, and a staged substitute is worse than a clean
  studio shot.
- **Sections.** Related Products, not a full Product Grid: the reader has demonstrated a narrow interest,
  and a wide grid discards that signal.
- **Avoid.** Discounting a reader who has not even added to cart. Copy that describes the tracking.

### 3.4 Price Drop

```
Price Drop Hero → Premium Ecommerce → Price comparison → Urgent CTA → Excitement
```

- **Why.** The news is factual and quantified, and the figures are the most persuasive content available.
  Premium Ecommerce keeps a markdown feeling like an opportunity rather than a clearance; Promotional
  Campaign is the alternative when energy matters more than positioning.
- **Urgency is legitimate here** — the price genuinely changed, and the change is recipient-specific. That
  is what distinguishes this from a manufactured deadline.
- **Sections.** The price comparison is the primary content; a Guarantee beside the CTA de-risks acting
  immediately.
- **Avoid.** A display headline competing with the figure. Any hardcoded price. A fallback that names a
  product it cannot confirm was reduced.

### 3.5 Customer Winback

```
Winback Hero → Luxury Retail → Benefits → Strong CTA → Recovery
```

- **Why.** The relationship lapsed, so the email must feel like an invitation rather than a chase. Luxury
  Retail's restraint is what makes an incentive read as respect instead of desperation.
- **Sequence.** Touch 1 what has changed, medium CTA, incentive withheld. Touch 2 Offer Hero with the
  incentive, strong CTA. Touch 3 Conversion Landing Page language, urgent CTA, final.
- **Emotional arc.** Acknowledgement → value → recovery.
- **Avoid.** Guilt. Spending the incentive in touch one. Over-incentivising, which teaches the list that
  lapsing is profitable.

### 3.6 Back In Stock

```
Product Hero → Product Showcase → Availability → Medium CTA → Relief
```

- **Why.** The highest-intent email in the entire system — the reader asked to be told. **Brevity is the
  creative idea**, and every additional section is a delay between the news and the click.
- **Alternative language.** Apple Minimal for a single high-value item with exceptional photography.
- **Sections.** Availability and a Guarantee. Nothing else. No recommendation grid, no brand introduction.
- **CTA.** Medium, not urgent — the reader already wants it, and manufactured pressure on a warm request
  reads as distrust.
- **Avoid.** Length. A stock-count claim that cannot stay true.

### 3.7 Post Purchase

```
Brand Story Hero → Scandinavian Minimal → Benefits → Soft CTA → Confidence
```

- **Why.** The purchase is made; the job is to confirm the decision was right and set up the next one.
  Selling immediately undercuts the confirmation.
- **Sequence.** Touch 1 confirmation and brand, soft CTA. Touch 2 use, care or setup — Modern SaaS suits
  this. Touch 3 Cross Sell or Review Request.
- **Sections.** Benefits framed as *what you now have*; a short FAQ where the product genuinely needs one.
- **Avoid.** A discount immediately after purchase, which devalues the price just paid. An upsell before the
  product has arrived.

### 3.8 Review Request

```
Trust Hero → Modern SaaS → Guarantee → Soft CTA → Appreciation
```

- **Why.** This asks for a favour. The design should be plain, respectful and effortless, and the ask must
  be a single, trivially small action.
- **Alternative language.** Premium Corporate for institutional or government customers.
- **Sections.** A Guarantee reminder, which quietly signals that a negative review is safe to leave — that
  is what makes the request credible rather than extractive.
- **Avoid.** Incentivising reviews. Any implication that only positive feedback is welcome. Product
  promotion inside a favour request.

### 3.9 Cross Sell

```
Collection Hero → Grid Commerce → Related Products → Medium CTA → Discovery
```

- **Why.** A known customer with demonstrated preferences. The email's value is relevance, and relevance
  needs breadth presented fairly.
- **Alternative language.** Premium Ecommerce with a Collection Hero where one curated set matters more
  than coverage.
- **Sections.** Related Products with a real relationship; Social Proof to validate the adjacency.
- **Avoid.** Arbitrary product sets — an unreal relationship is transparent and dilutes the primary item.
  A flat uniform grid with no promoted item, which is the wireframe failure Grid Commerce is prone to.

### 3.10 Replenishment

```
Product Hero → Industrial B2B → Product Grid → Medium CTA → Convenience
```

- **Why.** The reader has bought this before and will again. The only real job is to make reordering
  frictionless, so utility beats persuasion.
- **Alternative language.** Grid Commerce where several consumables are due together.
- **Sections.** The previously-purchased items, prominently; a Guarantee on delivery reliability, which is
  the operative concern for a repeat buyer.
- **CTA.** Medium and specific — reorder, not browse.
- **Avoid.** Treating a repeat buyer as a prospect. Brand storytelling to someone who already bought.

### 3.11 Sunset

```
Trust Hero → Premium Corporate → Guarantee → Soft CTA → Respect
```

- **Why.** This is the last email before disengagement, and its dignity matters more than its conversion.
  Premium Corporate's restraint is the right register for letting someone go cleanly.
- **Sequence.** Touch 1 a genuine, low-pressure question — is this still useful? Touch 2, if any, a final
  Conversion Landing Page ask with a clear, honest preference route.
- **Sections.** A Guarantee that leaving is easy and that preferences can be narrowed rather than severed.
  Category Navigation as a last low-commitment route in.
- **Avoid.** Guilt or manipulation. Burying the preference route. Treating the last email as the loudest one.

### 3.12 VIP

```
Collection Hero → Luxury Retail → Featured Collection → Medium CTA → Recognition
```

- **Why.** The reward is *access*, not discount. Luxury Retail's ceremony is what makes recognition feel
  earned; a percentage-off treatment would reduce a status message to a promotion.
- **Alternative pattern.** Launch Hero for genuine early access.
- **Sections.** A Featured Collection framed as selected for them; Social Proof from peers rather than from
  the general customer base.
- **Avoid.** Making the reward purely monetary. Language that any customer could receive — if it is not
  specific to their status, it is not a VIP email.

### 3.13 Birthday

```
Offer Hero → Promotional Campaign → Coupon Block → Strong CTA → Delight
```

- **Why.** A date-triggered gift, and the only flow where a genuine, personal, time-bound deadline exists —
  so urgency here is honest.
- **Alternative language.** Luxury Retail for high-value brands, where a gift should feel considered rather
  than energetic.
- **Sections.** A Coupon Block with a selectable code adjacent to the CTA, and durable terms.
- **Avoid.** A gift so conditional it reads as a promotion. A minimum spend that makes the gesture feel
  transactional.

---

## 4. Cross-cutting notes

### 4.1 Three flows depend on live data more than the rest

Browse Abandonment, Price Drop and Back In Stock are **built on event data**. Their no-data state is not an
edge case — it may be the state that actually renders. Design it to the same standard as the main path, and
never let it assert something unverifiable to fill the gap. The engineering requirement for guarded
fallbacks lives in each project's `CLAUDE.md`; the obligation to design that state is in
`Hero-Pattern-Library.md` §4.3.

### 4.2 Two flows must not be designed one email at a time

Abandoned Checkout and Customer Winback **escalate**, and the escalation is the design. Selecting a pattern
for touch two without knowing what touch one spent produces either a wasted incentive or a final touch with
nothing left to say.

### 4.3 Urgency is available to three flows

Price Drop (the price changed), Birthday (a real date), and the final touch of an escalating sequence
(where the sequence is genuinely ending). **Everywhere else, urgency in an automated flow is manufactured**,
and manufactured urgency is prohibited rather than merely discouraged.

### 4.4 Discount discipline across the lifecycle

| Never discount | Because |
|---|---|
| Welcome touch one | Trains the list to wait |
| Browse Abandonment | The reader has not even added to cart |
| Back In Stock | Intent is already maximal |
| Post Purchase, immediately | Devalues the price just paid |
| Review Request | Compromises the review |

### 4.5 Record the choice

The selected pattern, language and emotional objective are recorded in the creative proposal and in the
built template's header. A design reviewed against a stated intention is reviewable; a design reviewed
against taste is not.

---

## 5. Change log

| Date | Version | Change | Both copies |
|---|---|---|---|
| 2026-07-29 | 1.0.0 | Recommendations established for all thirteen supported flow types, with the CTA strength scale, per-flow sequences and alternatives, and the cross-cutting notes on data dependency, escalation, legitimate urgency and discount discipline. | ✔ |

---

*Recommendations only. A flow's own spec, its reference material and the brand's design document all
outrank this document, and every build rule lives in the standards registered in
`Shared/Engineering/README.md` §3.*
