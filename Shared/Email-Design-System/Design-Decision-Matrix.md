# Design Decision Matrix

> **Part of `Shared/Email-Design-System/` (STD-DESIGN).** Start at that folder's `README.md`.
> **Contains no HTML, no CSS, no Cerberus code, no brand values and no measurements.**
>
> This is the **entry point** to the design system. Answer six questions, and the answers select the Hero
> pattern, the design language, the sections and the CTA strategy. It is a decision aid, not an authority:
> a reasoned departure that is recorded is always better than a default that was never examined.

---

## Document control

| | |
|---|---|
| **Part of** | **STD-DESIGN** — `Shared/Email-Design-System/` |
| **Status** | **ACTIVE** |
| **Version** | **1.0.0** |
| **Owner** | Project Owner |
| **Applies to** | Klaviyo Campaign Email System · Klaviyo Flows Automation System |
| **Mirroring** | Byte-identical copies in both projects. Both canonical. Any change applies to both in the same edit. |
| **Scope** | **Design decision-making only.** No rules, no markup, no measurements. |

---

## 1. The six questions

Answered **before** any design work, and recorded in the creative proposal.

```
   1  INTENT       What is the customer's intent right now?
   2  EMOTION      What is the customer feeling right now?
   3  DOMINANCE    What single thing should dominate this email?
   4  OBJECTIVE    What is the one action, and what feeling should accompany it?
   5  ASSETS       What assets actually exist?
   6  SEQUENCE     Where does this email sit, and what did the previous one spend?
```

**Questions 1 and 3 determine the most.** Intent sets how hard the ask can be; dominance sets the Hero
pattern and therefore everything downstream.

**Questions 5 and 6 are the two most often skipped, and they are where designs fail.** A language chosen
without checking the assets produces a concept that cannot be built as drawn. A pattern chosen without
checking the sequence produces a touch that repeats or pre-empts its neighbour.

---

## 2. Question 1 — Intent

**What did the customer do, and what does that tell us they want?**

| Intent signal | Strength | The email may |
|---|---|---|
| Asked to be notified | **Highest** | Deliver the news and get out of the way |
| Left items in a cart | **High** | Remove friction; no persuasion needed |
| Viewed a specific item | **Medium-high** | Recall it; do not pressure |
| Bought before, not recently | **Medium** | Give a reason to look again |
| Subscribed, never bought | **Low** | Earn attention; do not ask hard |
| Disengaged entirely | **Lowest** | Ask one honest question, then let go |

**The rule this establishes:** *CTA strength may not exceed intent strength.* A hard ask on low intent
converts worse than a soft one and costs list health. The reverse is also a failure — a soft ask on the
highest intent is a delay between the reader and what they already asked for.

---

## 3. Question 2 — Emotion

**What is the reader feeling before the email arrives, and what should they feel after?**

| Before | After | Register |
|---|---|---|
| Waiting | Relief | Fast, plain, immediate |
| Hesitant | Reassured | Calm, specific, low-pressure |
| Curious | Interested | Warm, evocative, unhurried |
| Indifferent | Recognised | Respectful, personal, restrained |
| Forgotten | Valued | Generous, quiet, dignified |
| Ready | Confident | Direct, frictionless |
| Sceptical | Convinced | Concrete, verifiable, unsalesy |

**Emotion sets the register**, and register sets copy length, pacing and CTA strength. A design whose
emotional target is unstated has no way to judge whether its copy is too pushy or too passive.

---

## 4. Question 3 — Dominance

**What single thing should dominate?** Exactly one answer. Two answers means two focal points, and two
focal points means none.

| If dominant | Hero pattern | Language starting point | Key sections | CTA |
|---|---|---|---|---|
| **Product** | Product · Browse · Collection | Premium Ecommerce · Product Showcase · Lifestyle Commerce | Related Products · Guarantee | Medium |
| **Offer** | Offer · Winback | Promotional Campaign · Luxury Retail | Coupon Block · Guarantee | Strong |
| **Price** | Price Drop | Premium Ecommerce · Promotional Campaign | Price comparison · Guarantee | Urgent *(if genuine)* |
| **Story** | Brand Story · Lifestyle | Editorial Magazine · Scandinavian Minimal | Benefits · Social Proof | Soft |
| **Trust** | Trust | Premium Corporate · Modern SaaS | Guarantee · Testimonial | Medium |
| **Urgency** | Offer · Price Drop | Conversion Landing Page · Promotional | Countdown *(if genuine)* · Final CTA | Urgent |
| **Education** | Brand Story · Comparison | Modern SaaS · Editorial Magazine | Benefits · FAQ · Comparison Cards | Soft |

### 4.1 Two dominance answers that need a warning

**Urgency** and **Price** both permit an urgent CTA, and both can only do so when the reason is real and
recipient-specific. In an automated programme that is true for a price change, a personal date, and the
final touch of a genuinely ending sequence — and false almost everywhere else. Manufactured urgency is
prohibited by each project's `CLAUDE.md`, not merely discouraged.

**Education** is the answer most likely to produce a documentation-style layout, because explanation
naturally wants even, modular blocks. If Education is the answer, the hierarchy must be pushed deliberately
or the result will be a report.

---

## 5. Question 4 — Objective

**One action, named. One feeling, named.**

Write it as a single sentence: *"After reading this, the customer should [action], feeling [emotion]."*

If that sentence needs an "and" in the action, the email has two objectives and should be two emails. If the
feeling cannot be named, the design has no target and the Marketing Review has nothing to judge.

---

## 6. Question 5 — Assets

**What exists, verified, right now?** Not what could be commissioned.

| Available | Consequence |
|---|---|
| One immaculate hero image | Apple Minimal and Luxury Retail become available |
| Genuine in-situ photography | Lifestyle Commerce becomes available |
| Clean catalogue shots, consistent | Premium Ecommerce · Product Showcase · Grid Commerce |
| Several images of one product | Product Showcase becomes available |
| Inconsistent or mixed-quality imagery | Avoid Collection, Comparison and Grid — inconsistency reads as an undeclared preference |
| No usable photography | Modern SaaS · Premium Corporate · Promotional Campaign · Conversion Landing Page |
| Real, attributable customer words | Social Proof and Testimonial become available |
| Confirmed, active offer terms | Offer and Coupon sections become available |
| Live product/event data, confirmed | Product, Browse, Price Drop and Comparison Heroes become reliable |

### 6.1 The asset gate

**Four design languages have a hard asset dependency and must not be selected without the asset:** Apple
Minimal, Luxury Retail, Lifestyle Commerce and Editorial Magazine. The substitutions are listed in
`Design-Language-Library.md` §4.3.

**This check happens here, at concept stage** — the same principle the engineering layer already applies to
Hero artwork: the asset decides, so the brief must decide first.

### 6.2 Data is an asset

Where a Hero depends on live data, the data's confirmation status is an asset question. If the binding is
unconfirmed, the **no-data state is the state that will actually render**, and it must be designed to the
same standard as the main path. It must never assert something unverifiable in order to look complete.

---

## 7. Question 6 — Sequence

**Where does this email sit, and what did the previous one already spend?**

| Ask | Consequence |
|---|---|
| Is this the first touch? | Do not spend the incentive; it cannot be recovered later |
| Is this the last touch? | Escalation is permitted; this is where urgency is legitimate if the sequence truly ends |
| What did the previous touch say? | Do not repeat its hook, headline, offer framing or Hero pattern |
| What is the actual delay? | Copy must be true at the real send delay, not at trigger time |
| Could another flow send for the same trigger? | Check the exclusions before designing around an offer |

**A flow's touches are designed as a set.** Selecting a pattern for touch two without knowing touch one
produces either a wasted incentive or a final email with nothing left to say. The escalation rules per flow
are in `Flow-Design-Recommendations.md`.

---

## 8. Worked examples

Each shows the six answers producing the four outputs.

### 8.1 A reader viewed a product and left

```
INTENT      medium-high — looked, did not commit
EMOTION     curious → interested
DOMINANCE   Product
OBJECTIVE   return to the product page, feeling recognised rather than tracked
ASSETS      clean catalogue shots; no in-situ photography; event data unconfirmed
SEQUENCE    first touch; incentive must be preserved
───────────────────────────────────────────────────────────────────
HERO        Browse Hero  (role 2 — Product)
LANGUAGE    Premium Ecommerce   ← NOT Lifestyle Commerce: no in-situ assets exist
SECTIONS    Related Products · Trust Indicators · Final CTA
CTA         Soft, to the product page
ALSO        design the no-data state first — it is what renders today
```

### 8.2 A watched product dropped in price

```
INTENT      medium-high — asked to be told, in effect
EMOTION     indifferent → excited
DOMINANCE   Price
OBJECTIVE   see the new price, feeling it is worth acting on now
ASSETS      one good product image; price data via event, currency unconfirmed
SEQUENCE    single touch
───────────────────────────────────────────────────────────────────
HERO        Price Drop Hero  (role 3 — Offer)
LANGUAGE    Premium Ecommerce   ← keeps a markdown reading as opportunity, not clearance
SECTIONS    price comparison · Guarantee · Final CTA
CTA         Urgent — legitimate, because the price genuinely changed
ALSO        no figure hardcoded; fallback carries no numbers and names no product
```

### 8.3 A customer has not bought in a long time

```
INTENT      medium — bought before, not recently
EMOTION     forgotten → valued
DOMINANCE   Offer
OBJECTIVE   return to the site, feeling invited rather than chased
ASSETS      range photography; incentive terms confirmed
SEQUENCE    touch 1 of 3 — incentive withheld until touch 2
───────────────────────────────────────────────────────────────────
HERO        Winback Hero  (role 3 — Offer)
LANGUAGE    Luxury Retail   ← restraint makes an incentive read as respect
SECTIONS    Benefits · Social Proof · Final CTA
CTA         Medium in touch 1, escalating to Strong in touch 2
ALSO        no guilt; the sequence is designed as a set, not one email
```

### 8.4 A requested product is available again

```
INTENT      highest — the reader explicitly asked
EMOTION     waiting → relief
DOMINANCE   Product
OBJECTIVE   buy it, feeling nothing stood in the way
ASSETS      several good images of the one product
SEQUENCE    single touch
───────────────────────────────────────────────────────────────────
HERO        Product Hero  (role 2 — Product)
LANGUAGE    Product Showcase
SECTIONS    Availability · Guarantee.  Nothing else.
CTA         Medium — not urgent; pressure on a warm request reads as distrust
ALSO        brevity IS the design; sections may not be added during build
```

---

## 9. Failure modes this matrix prevents

| Failure | The question that catches it |
|---|---|
| Two focal points | 3 — Dominance permits exactly one answer |
| A CTA harder than the reader's intent | 1 — CTA strength may not exceed intent strength |
| A language whose assets do not exist | 5 — the asset gate |
| A design that dies when data is missing | 5.2 — data is an asset |
| An incentive spent too early | 6 — sequence |
| Copy untrue at the actual delay | 6 — the real delay, not trigger time |
| An email with no measurable purpose | 4 — one sentence, one action, one feeling |
| A pattern inherited from the last template | 3 and 6 — both are re-answered per email |
| Manufactured urgency | 4.1 — urgency requires a real, recipient-specific reason |
| An explanatory email that reads as a report | 4.1 — the Education warning |

---

## 10. Recording the answers

The six answers and the four outputs are recorded **in the creative proposal**, and the selected Hero
pattern and design language are carried into the built template's header comment.

**Why recording matters more than it appears to.** A design reviewed against a stated intention can be
judged; a design reviewed against taste can only be argued about. Recording the decision is what turns
"I don't like it" into "this does not achieve the stated objective" — which is actionable.

---

## 11. Change log

| Date | Version | Change | Both copies |
|---|---|---|---|
| 2026-07-29 | 1.0.0 | Matrix established with six questions, the dominance mapping table, the asset gate, the sequence check, four worked examples and the failure-mode table. | ✔ |

---

*A decision aid. The flow or campaign spec, the brand's design document and every engineering standard
outrank it.*
