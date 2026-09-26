# Section Pattern Library

> **Part of `Shared/Email-Design-System/` (STD-DESIGN).** Start at that folder's `README.md`.
> **Contains no HTML, no CSS, no Cerberus code, no brand values and no measurements.**
>
> ⚠️ **This library is about *composition*, not construction.** The reusable component set, its markup, its
> measurements and its client hardening are owned by each project's `CLAUDE.md` and the brand's design
> document. Nothing here describes how a section is built — only what it is for, where it belongs, what it
> combines with, and when it should not be used at all.

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
| **Scope** | **Section selection, placement and rhythm only.** No markup, no measurements, no engineering rules. |

---

## 1. Sections versus components

| | Owns | Lives in |
|---|---|---|
| **Component** | The built, reusable, token-driven unit — its markup, hardening and measurements | `CLAUDE.md` · the brand's design document |
| **Section pattern** (this document) | What that unit is *for*, where it belongs, what it combines with, and when to omit it | here |

One component can serve several section patterns, and a section pattern may be expressed by different
components in different brands. **Keeping the two separate is what lets composition change without
re-engineering anything.**

### 1.1 The two rules that matter most

- **Every section must move the email forward.** If a section could be deleted with no loss to the
  argument, delete it. This is the single most reliable cure for the report-style layout.
- **Sequence is the design.** A section's effect depends almost entirely on what precedes it. The same
  Trust Indicators block is powerful next to a CTA and invisible at the top of an email.

### 1.2 Reading the entries

| Field | What it answers |
|---|---|
| **Purpose** | The one job it does |
| **Placement** | Where it belongs, and why there |
| **Ideal combinations** | What it works with, and what it needs nearby |
| **Spacing rhythm** | How much air it wants relative to its neighbours |
| **Visual rhythm** | What it does to the page's tonal and density pattern |
| **When NOT to use** | The conditions under which it subtracts value |

**Spacing is expressed in relative terms throughout** — generous, tight, equal to, tighter than. Absolute
values are brand measurements and belong in the brand's design document.

---

## 2. The canonical order

Most emails are a subset of this sequence. **Subtracting from it is normal; reordering it needs a reason.**

```
   HERO                       the message and the first action
   PROOF OR OFFER SUPPORT     whatever makes the Hero credible
   PRODUCT CONTENT            grid · related · featured · comparison
   REASSURANCE                trust · guarantee · social proof
   FINAL CTA                  the same action, repeated
   FOOTER                     navigation, brand, compliance
```

**Why this order.** The Hero states the case; the next section defends it; product content gives the reader
something to act on; reassurance removes the last objection at the point of decision; the final CTA catches
the reader who needed all of it. Reassurance placed *before* the product content answers an objection the
reader has not formed yet, which is why a trust strip near the top reliably underperforms.

---

## 3. The patterns

### 3.1 Product Grid

- **Purpose.** Give the reader several things to act on, presented comparably.
- **Placement.** After the Hero and its supporting section. Never above the Hero.
- **Ideal combinations.** A section marker above it; a Final CTA below it; Related Products *instead of*
  it, not as well.
- **Spacing rhythm.** Generous above (it is a new movement), regular within (equal gutters and equal rows),
  generous below.
- **Visual rhythm.** Introduces regularity. Because it repeats, it flattens the page — so it needs a
  distinct surface, one promoted item, or a strong marker to avoid reading as filler.
- **When NOT to use.** When only one product matters — a grid dilutes a single-product message. When fewer
  verified products exist than the grid expects: reduce the row count and report the shortfall rather than
  filling a slot. When the email's job is one urgent action.

### 3.2 Benefits

- **Purpose.** Convert features into reasons, in the reader's terms.
- **Placement.** Directly after the Hero when the proposition needs explaining; after product content when
  it needs justifying.
- **Ideal combinations.** Works with a Hero that promises something; pairs naturally with Guarantee. Do not
  place adjacent to Trust Indicators — the two overlap and the second one read is wasted.
- **Spacing rhythm.** Tight within each benefit, clearly separated between them.
- **Visual rhythm.** Adds evenness. Three or four items is the working range; more becomes a list and reads
  as documentation.
- **When NOT to use.** When the reader already has intent — a Back In Stock reader does not need persuading,
  and benefits delay the click. When the benefits are generic; a generic benefit is worse than none.

### 3.3 Trust Indicators

- **Purpose.** Remove residual risk with concrete, verifiable facts.
- **Placement.** **Near the decision** — immediately before or after the primary action, or before the
  footer. Not at the top.
- **Ideal combinations.** Sits well between product content and the Final CTA. Strong with Guarantee.
  Redundant beside Benefits.
- **Spacing rhythm.** Tight internally, clearly separated from the section above.
- **Visual rhythm.** A tonal shift — usually a distinct surface — which marks the transition from selling to
  reassuring.
- **When NOT to use.** Twice in one email. In a language whose confidence comes from restraint, where
  explicit reassurance undercuts the tone. When the claims cannot be verified — an unverifiable trust claim
  is the most damaging content in an email.

### 3.4 Comparison Cards

- **Purpose.** Let a deciding reader choose.
- **Placement.** Immediately after a Hero that framed a decision.
- **Ideal combinations.** Needs a recommendation, and a Guarantee nearby to de-risk the choice. Never
  alongside a Product Grid — two comparable sets in one email is a decision the reader will defer.
- **Spacing rhythm.** Identical spacing across options. Any asymmetry reads as an undeclared preference.
- **Visual rhythm.** Dense and deliberate. It slows the reader down, which is correct here.
- **When NOT to use.** When the options are not genuinely comparable. When only one option is actually
  recommended — then it is a Product Showcase, not a comparison. When the reader's intent is already
  specific.

### 3.5 Social Proof

- **Purpose.** Let other customers make the argument.
- **Placement.** After product content, before the Final CTA.
- **Ideal combinations.** Strongest immediately before a CTA. Excellent with Lifestyle imagery — real
  projects plus real words compound.
- **Spacing rhythm.** Generous around it; it needs to feel like a pause rather than another block.
- **Visual rhythm.** Breaks a run of product regularity, which is often exactly what a grid-heavy email
  needs.
- **When NOT to use.** With invented, unattributed or unverifiable proof — fabricated proof is both a trust
  failure and a factual one. In an early-sequence email where no relationship exists yet to make the proof
  meaningful.

### 3.6 Testimonial

- **Purpose.** One specific voice answering one specific doubt.
- **Placement.** Adjacent to whatever it addresses — near the price if it speaks to value, near the CTA if
  it speaks to risk.
- **Ideal combinations.** One testimonial plus one guarantee is a strong, compact pairing. Never a
  testimonial *and* a Social Proof block; that is the same argument twice.
- **Spacing rhythm.** Generous and isolated. A testimonial crowded by other content loses its authority.
- **Visual rhythm.** A deliberate quiet moment. Typographic rather than visual.
- **When NOT to use.** When the quote is generic — "great product" persuades nobody and costs credibility.
  When it cannot be attributed. In place of a real answer to a real objection.

### 3.7 FAQ

- **Purpose.** Remove several specific objections efficiently.
- **Placement.** Late — after product content and reassurance, before the Final CTA.
- **Ideal combinations.** Suits explanatory languages and onboarding sequences. Pairs with Guarantee.
- **Spacing rhythm.** Compact and even; it is reference content and may be denser than the rest.
- **Visual rhythm.** Deliberately low-energy. Accept that, and keep it short.
- **When NOT to use.** **In most marketing emails.** An FAQ is the section most likely to turn an email into
  documentation. Two questions is usually the limit; beyond that it belongs on the site with a link. Never
  as a substitute for clear copy earlier in the email.

### 3.8 Guarantee

- **Purpose.** Remove the final risk at the moment of action.
- **Placement.** Immediately adjacent to the primary CTA — before or after, but touching it.
- **Ideal combinations.** The single most effective companion to any CTA. Compounds with Testimonial and
  Trust Indicators.
- **Spacing rhythm.** Tight to the CTA. Distance weakens it; it must read as part of the action.
- **Visual rhythm.** Minimal — usually one line. It should not become a section.
- **When NOT to use.** When the guarantee is conditional in ways the email cannot fairly summarise. When
  the terms are unconfirmed — stating a guarantee that does not exist is a correctness failure, not a
  marketing one.

### 3.9 Category Navigation

- **Purpose.** Give a reader with no specific intent a way in.
- **Placement.** Low — after the primary content, typically just above or inside the footer.
- **Ideal combinations.** Natural in the footer region. Works with a Category or Collection Hero.
- **Spacing rhythm.** Regular and compact. It is utility, not content.
- **Visual rhythm.** Deliberately subordinate. Visually quieter than the primary CTA, always.
- **When NOT to use.** High in the email, where it competes with the primary action and offers an exit
  before the argument is made. In a single-action email, where any alternative route reduces conversion.

### 3.10 Related Products

- **Purpose.** Extend interest from a specific item to adjacent ones.
- **Placement.** After the primary product content it relates to. Its relevance depends entirely on what
  precedes it.
- **Ideal combinations.** Follows a Product or Browse Hero. Mutually exclusive with a Product Grid — pick
  one.
- **Spacing rhythm.** Clearly separated above so the shift from "this" to "also this" is legible.
- **Visual rhythm.** Regular, and deliberately lighter than the primary product presentation. It must not
  out-compete the item it relates to.
- **When NOT to use.** When the relationship is not real — an arbitrary set reads as filler and dilutes the
  primary item. In an urgent, single-action email. When the reader's intent is already narrow.

### 3.11 Featured Collection

- **Purpose.** Present a curated group where the grouping itself is the argument.
- **Placement.** After the Hero, as the primary content movement.
- **Ideal combinations.** Requires a stated organising idea above it. Pairs with Social Proof.
- **Spacing rhythm.** Generous above, cohesive within — the set should read as one object.
- **Visual rhythm.** A single strong movement rather than a repeating pattern.
- **When NOT to use.** When the theme is invented. When the items are not visually consistent — inconsistent
  imagery destroys the sense of a set. When one item clearly matters more than the rest.

### 3.12 Countdown

- **Purpose.** Convert a genuine deadline into action.
- **Placement.** In or immediately below the Hero, adjacent to the primary CTA.
- **Ideal combinations.** Belongs with an Offer Hero and a Promotional or Conversion language.
- **Spacing rhythm.** Tight to the offer and the action; a countdown separated from the CTA is decoration.
- **Visual rhythm.** High energy, and deliberately disruptive.
- **When NOT to use.** ⚠️ **Almost never in an automated flow.** A flow sends unattended for months, so a
  countdown is only legitimate where the deadline is real, per-recipient and derived from the trigger.
  **A fabricated or non-expiring deadline is prohibited** — the evergreen-content and honest-urgency rules
  in each project's `CLAUDE.md` govern this, and they are not negotiable for effect.

### 3.13 Coupon Block

- **Purpose.** Deliver a code the reader can actually use.
- **Placement.** With the offer, and adjacent to the CTA — never stranded below it.
- **Ideal combinations.** Offer Hero, Winback Hero. Pairs with a short terms line.
- **Spacing rhythm.** Tight to the CTA so code and action are one unit.
- **Visual rhythm.** A distinct, contained element. It should look like something you can take.
- **When NOT to use.** When the code is unconfirmed or inactive. When the offer's terms cannot be stated
  durably. Early in a sequence that needs the incentive later. **The code must always be selectable text** —
  a code the reader cannot copy is the largest single friction point in mobile redemption.

### 3.14 Offer Banner

- **Purpose.** State a running offer that is not the email's primary message.
- **Placement.** Below the Hero, or immediately above the footer. It is secondary by definition.
- **Ideal combinations.** Works under a Product or Browse Hero, where it adds a commercial reason without
  taking over.
- **Spacing rhythm.** Compact, with clear separation so it does not merge into the section above.
- **Visual rhythm.** A single accent moment in an otherwise restrained page.
- **When NOT to use.** When the offer *is* the message — then it belongs in the Hero, not in a banner.
  Alongside a Coupon Block, which is the same message twice. More than once in an email.

### 3.15 Final CTA

- **Purpose.** Catch the reader who needed the whole email before deciding.
- **Placement.** After the last substantive content, before the footer.
- **Ideal combinations.** A Guarantee immediately beside it. It is the natural partner of every content
  section above it.
- **Spacing rhythm.** The most generous space in the email. It must not feel appended.
- **Visual rhythm.** A clear close. The reader should sense the email ending here.
- **When NOT to use.** As a *different* action from the Hero CTA — that creates two primaries. A repeat of
  the same action with the same label is one action rendered twice; a new destination is competition. Omit
  it only in a very short email where the Hero CTA is still on screen.

### 3.16 Footer Variations

- **Purpose.** Close the email, provide navigation and carry the legally required mechanisms.
- **Placement.** Last. Always.
- **Three working variations:**

| Variation | Contents | Use when |
|---|---|---|
| **Minimal** | Brand mark, compliance, address | Single-action emails where any alternative route costs conversion |
| **Standard** | Category navigation, social, brand statement, compliance | Most emails |
| **Extended** | Standard plus contact routes, account and support paths | B2B, corporate, onboarding and service communications |

- **Spacing rhythm.** Generous separation from the content above; compact and orderly within.
- **Visual rhythm.** A definite tonal close, usually the darkest or quietest surface in the email.
- **When NOT to use.** Never omitted. **The compliance mechanisms are mandatory in every email** — the rules
  and the pre-production checkpoint live in each project's `CLAUDE.md` and are a hard gate, not a
  preference.

---

## 4. Combination rules

### 4.1 Pairs that conflict

Each of these says the same thing twice, and the second one read is wasted space:

| Do not combine | Because |
|---|---|
| Benefits **+** Trust Indicators | Both answer "why should I trust this?" |
| Social Proof **+** Testimonial | Both are other people's endorsement |
| Product Grid **+** Related Products | Two comparable sets; the reader defers |
| Comparison Cards **+** Product Grid | Two decisions in one email |
| Coupon Block **+** Offer Banner | The same offer, twice |
| FAQ **+** Benefits **+** Guarantee | Three explanatory blocks becomes documentation |

### 4.2 Pairs that compound

| Combine | Because |
|---|---|
| Guarantee **+** primary CTA | Removes the last risk at the moment of action |
| Social Proof **+** Final CTA | Peer endorsement immediately before the decision |
| Testimonial **+** Guarantee | Emotional and practical reassurance together |
| Offer Banner **+** Product or Browse Hero | Adds a commercial reason without displacing the product |
| Category Navigation **+** footer | Utility where utility belongs |
| Featured Collection **+** Social Proof | Curation validated by other people |

### 4.3 The four-movement rule of thumb

**A marketing email rarely needs more than four content movements** between the Hero and the footer. Beyond
four, each additional section reduces the weight of every other one, and the email starts to read as a
summary of everything rather than an argument for one thing.

A working default: **Hero → one product movement → one reassurance movement → Final CTA.**

### 4.4 Rhythm: alternate, do not repeat

A page reads well when surfaces and densities alternate. Three consecutive sections on the same surface at
the same density read as one long undifferentiated block, whatever their content. Vary the surface, the
density, or both — and let the most important movement be the one that differs most from its neighbours.

### 4.5 Markers, not headlines

Movements are best announced by a quiet marker — a short tracked label, optionally with a small painted
rule. A bold sub-headline for every section creates a series of competing announcements and is a common
cause of an email with no discernible focal point.

---

## 5. Change log

| Date | Version | Change | Both copies |
|---|---|---|---|
| 2026-07-29 | 1.0.0 | Library established with sixteen section patterns, the canonical order and its rationale, the conflicting- and compounding-pair tables, the four-movement rule and the rhythm rules. Notes the flow-specific constraint on Countdown (§3.12) by reference, without restating the owning rule. | ✔ |

---

*Governs what a section is for and where it belongs. How a section is built is owned by each project's
`CLAUDE.md` and the brand's design document, which win on any apparent conflict.*
