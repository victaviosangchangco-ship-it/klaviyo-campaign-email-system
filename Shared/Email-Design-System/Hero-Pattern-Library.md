# Hero Pattern Library

> **Part of `Shared/Email-Design-System/` (STD-DESIGN).** Start at that folder's `README.md`.
> **Contains no HTML, no CSS, no Cerberus code, no brand values and no measurements.**
>
> ⚠️ **Every Hero engineering rule lives in `Shared/Email-Hero-Engineering-Standard.md` (STD-HERO) and is
> NOT restated here.** Geometry, the aspect lock, the Artwork Contract, the bond colour, the Visual Bridge
> requirement, the prohibition list, the approval gates and the locking policy are all owned there. This
> library selects **which Hero to design**; STD-HERO governs **how it must be built**. Read both.

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
| **Scope** | **Hero selection and composition intent only.** No engineering rules. |

---

## 1. How this library relates to STD-HERO

STD-HERO defines **four marketing roles** — Atmospheric, Product, Offer and Brand — in its §15.6. Those
four are the normative classification, and a Hero must declare one.

**The twelve patterns below are named, reusable expressions of those four roles.** A pattern is a
recognisable Hero *concept*; a role is the classification STD-HERO checks against. Every pattern therefore
maps to exactly one role, and that mapping is stated in each entry so the two documents cannot drift.

| This library gives you | STD-HERO gives you |
|---|---|
| Which Hero concept fits this email's job | Which role it must declare, and the rules for that role |
| The intended hierarchy, imagery and copy | Whether the geometry can survive a phone |
| Strengths and limitations of the concept | The Artwork Contract the asset must satisfy |
| A starting point for the creative proposal | The gates the build must pass |

**Order of use:** select the pattern here → declare the role per STD-HERO §15.6 → pass the Marketing
Review → then engineering, beginning with STD-HERO's geometry gate. That sequence is owned by
`Shared/Creative-Workflow-Standard.md`.

### 1.1 The role map

| Pattern | STD-HERO role |
|---|---|
| Product Hero · Browse Hero · Collection Hero · Category Hero | **Role 2 — Product** |
| Offer Hero · Price Drop Hero · Winback Hero | **Role 3 — Offer** |
| Brand Story Hero · Trust Hero | **Role 4 — Brand** |
| Lifestyle Hero | **Role 1 — Atmospheric** |
| Launch Hero | Role 2 or Role 4, declared per send |
| Comparison Hero | Role 2 or Role 3, declared per send |

**Where a pattern maps to two roles, the role is not optional — it is declared explicitly for that send**,
because the permitted proportion and the bridge requirement differ between roles.

### 1.2 One warning worth repeating

The most expensive Hero failure on record was **a role mismatch**: a Hero built as one role while its
objective required another. It passed every engineering check and still failed. The diagnosis is
**ADR-009**; the diagnostic that separates a composition failure from a geometry failure is **STD-HERO
§15.2**. Selecting the pattern from the email's *objective* — not from the previous template — is what
prevents it.

---

## 2. Selecting a pattern

| The reader's state | Pattern |
|---|---|
| Looked at a specific item | **Browse Hero** |
| Has items waiting | **Product Hero** |
| Is being offered an incentive | **Offer Hero** |
| A watched item changed price | **Price Drop Hero** |
| Has drifted away | **Winback Hero** |
| Is new to the brand | **Brand Story Hero** |
| Needs reassurance before acting | **Trust Hero** |
| Is browsing a segment | **Category Hero** |
| Should see a curated set | **Collection Hero** |
| Is choosing between options | **Comparison Hero** |
| Needs to imagine ownership | **Lifestyle Hero** |
| Is waiting for something new | **Launch Hero** |

---

## 3. The patterns

### 3.1 Product Hero

- **Role.** Role 2 — Product.
- **Objective.** Make the reader recognise a specific item as *theirs* — one they chose, reserved or left
  behind.
- **Best flows.** Abandoned Checkout · Browse Abandonment · Back In Stock · Cross Sell · Replenishment.
- **Hierarchy.** Product image → product name → the single most relevant fact about it → framing → action
  → reassurance.
- **Imagery.** The actual item, large, at the highest quality available. Message-relevant by definition, so
  it may be proportionally dominant.
- **Copy.** Short. The product carries the message; copy supplies the reason to act now and must never
  restate what the image already says.
- **CTA.** One action, to that product's own page. Naming the destination outperforms a generic verb.
- **Strengths.** Highest recognition; needs no incentive; unity is free because the artwork and the message
  share a referent.
- **Limitations.** Depends on live product data, so the no-data fallback must be designed as carefully as
  the main path — and the fallback must never claim the reader viewed an item that cannot be verified. A
  large product image is expensive in vertical space, which pushes the action down.

### 3.2 Offer Hero

- **Role.** Role 3 — Offer.
- **Objective.** Make an incentive the focal point and make acting on it feel obvious.
- **Best flows.** Customer Winback · Abandoned Checkout later touches · Birthday · VIP · promotional sends.
- **Hierarchy.** The offer, as the largest element → what it applies to → framing → action → terms.
- **Imagery.** Minimal or absent. Artwork exists to prove the offer is real, not to compete with it.
- **Copy.** The offer expressed in the fewest possible words. A display headline beside a display offer
  creates two focal points, so usually the offer *is* the headline.
- **CTA.** One action, adjacent to the offer so comprehension and action are the same object.
- **Strengths.** Fastest comprehension of any pattern; works with weak or no photography; strongest
  immediate response.
- **Limitations.** Spends the incentive, so its position in a sequence must be planned — an offer used in
  touch one leaves nothing to escalate to. Erodes premium positioning with repetition. Every offer term
  must be durable enough for an evergreen flow.

### 3.3 Price Drop Hero

- **Role.** Role 3 — Offer. A specialised Offer Hero where the *change* is the news.
- **Objective.** Communicate that a price fell, and make the new figure impossible to miss.
- **Best flows.** Price Drop. Occasionally Browse Abandonment when a viewed item is reduced.
- **Hierarchy.** The change announced → the new price at the largest scale → the old price, labelled and
  struck → the saving → what it applies to → action.
- **Imagery.** Modest. The product proves what is reduced; it does not lead.
- **Copy.** Almost none beyond the figures and their labels. **The words "was" and "now" must carry the
  comparison** — a strikethrough alone conveys meaning by visual treatment, which accessibility rules do
  not permit as the sole mechanism.
- **CTA.** One action, to the product page, immediately after the figures.
- **Strengths.** The clearest value proposition available; a price ladder is understood in under a second.
- **Limitations.** Entirely dependent on price data being bound correctly, so a no-data fallback that
  carries **no figures at all** is mandatory. A price must never be hardcoded — a baked figure is not
  evergreen. And the fallback must not name a product it cannot confirm was reduced.

### 3.4 Browse Hero

- **Role.** Role 2 — Product.
- **Objective.** Return attention to something the reader looked at but did not pursue, without pressure.
- **Best flows.** Browse Abandonment. Also early Cross Sell.
- **Hierarchy.** The viewed item → its name → a non-discount reason to act → framing → soft action.
- **Imagery.** The viewed product, large. This is the only personalisation the flow has, so it must be
  visible immediately.
- **Copy.** Recognition without surveillance. Acknowledge the visit lightly; never describe the tracking.
- **CTA.** One action, low-pressure, to the item. A softer verb than an Offer Hero would use.
- **Strengths.** High relevance at zero incentive cost; preserves margin; preserves the incentive for later
  touches.
- **Limitations.** Reads as automated if the copy is generic; the tone is easy to get wrong in the
  direction of intrusiveness; useless without event data, so the fallback carries the email more often than
  is comfortable.

### 3.5 Launch Hero

- **Role.** Role 2 or Role 4 — **declare per send.** Role 2 when the product itself is the news; Role 4
  when the brand's entry into a category is the news.
- **Objective.** Make something new feel worth attention now.
- **Best flows.** Product launch · VIP early access · Welcome Series where a flagship is introduced.
- **Hierarchy.** The news → the object → the one thing that makes it new → action.
- **Imagery.** The hero product at its best, or a considered brand statement. Highest production value the
  brand can afford.
- **Copy.** Confident and specific. "New" is not a benefit; what is new must be stated.
- **CTA.** One action. Early access or a waitlist route where genuine.
- **Strengths.** Highest natural interest of any pattern; permits the boldest art direction.
- **Limitations.** Fails flat with weak assets; novelty is not evergreen, so a launch Hero is rarely
  reusable in an unattended flow without rewriting.

### 3.6 Winback Hero

- **Role.** Role 3 — Offer.
- **Objective.** Give a lapsed reader a reason to look again, then a reason to act.
- **Best flows.** Customer Winback · Sunset.
- **Hierarchy.** Acknowledgement → what has changed or what is offered → proof → action.
- **Imagery.** Range or offer-supporting. Rarely a single product, because the reason for lapsing is
  usually not one item.
- **Copy.** Warm, brief, never guilt-inducing. Absence is acknowledged once and not dwelt on.
- **CTA.** One action. Strength escalates across the sequence; the first touch should not spend the
  incentive.
- **Strengths.** Recovers otherwise-lost value; the only pattern where an offer reads as welcome rather
  than as discounting.
- **Limitations.** Sequence-dependent — it cannot be designed for one email in isolation. Over-incentivised
  winbacks train a list to wait for discounts.

### 3.7 Brand Story Hero

- **Role.** Role 4 — Brand.
- **Objective.** Make the reader understand who this brand is and why it is credible.
- **Best flows.** Welcome Series · Post Purchase early touches · VIP.
- **Hierarchy.** Brand statement → the substantiating fact → what that means for the reader → a gentle
  route in.
- **Imagery.** Facilities, people, making, provenance — or a restrained brand mark. Modest proportion.
- **Copy.** The most copy of any pattern, and it must be genuinely worth reading. Specifics beat adjectives.
- **CTA.** One soft action — explore, read, browse. Not "buy".
- **Strengths.** Builds durable affinity; the highest-leverage email in a Welcome Series; entirely
  evergreen.
- **Limitations.** Low immediate conversion by design, and it must not be judged on it. Requires real
  substance — a Brand Story Hero with nothing to say is the emptiest email in the system.

### 3.8 Category Hero

- **Role.** Role 2 — Product.
- **Objective.** Orient a reader toward a segment of the range rather than one item.
- **Best flows.** Cross Sell · Welcome Series segmentation · Replenishment · category promotions.
- **Hierarchy.** Category named → what it is for → representative products → action into the category.
- **Imagery.** One representative product, or a small consistent set. Consistency across the set matters
  more than the quality of any single frame.
- **Copy.** Functional and orienting. Who the category is for, in one line.
- **CTA.** One action into the category page, plus per-item routes where products are shown.
- **Strengths.** Efficient for broad catalogues; useful when intent is known at segment level but not at
  item level.
- **Limitations.** Lower emotional pull than a single product; easily becomes a grid with a title, which is
  a wireframe rather than a Hero.

### 3.9 Comparison Hero

- **Role.** Role 2 or Role 3 — **declare per send.**
- **Objective.** Help a reader who is deciding between options choose confidently.
- **Best flows.** Cross Sell · Post Purchase upgrade paths · specification-led B2B sends.
- **Hierarchy.** The decision framed → the options at equal weight → the differentiating attribute → a
  recommendation → action.
- **Imagery.** Identical treatment across every option. Any inconsistency reads as a preference the copy
  has not declared.
- **Copy.** Neutral and factual per option, with one clear recommendation. A comparison that recommends
  nothing leaves the decision where it started.
- **CTA.** One action per option, plus a primary on the recommended one.
- **Strengths.** Genuinely useful; strong for considered and specification-driven purchases; high perceived
  helpfulness.
- **Limitations.** The most information-dense Hero, and the hardest to keep above the fold. Options must be
  truly comparable — a comparison of unlike things damages trust. Needs equal-quality imagery for every
  option.

### 3.10 Collection Hero

- **Role.** Role 2 — Product.
- **Objective.** Present a curated set as a set, so the grouping itself carries meaning.
- **Best flows.** Cross Sell · VIP · seasonal or themed sends · Post Purchase complements.
- **Hierarchy.** The theme named → why these belong together → the set → action.
- **Imagery.** A consistent set, or one composite image of the group. Cohesion is the message.
- **Copy.** The organising idea, stated once. Without it a collection is only a grid.
- **CTA.** One action to the collection, plus per-item routes.
- **Strengths.** Raises average order value; makes curation visible; works well where individual items are
  unremarkable but the combination is not.
- **Limitations.** The theme must be real — an invented grouping is transparent. Requires several
  same-quality images.

### 3.11 Lifestyle Hero

- **Role.** Role 1 — Atmospheric. **This is the one pattern with a hard proportion ceiling and a mandatory
  bridge**, per STD-HERO §15.5 and §15.4.
- **Objective.** Let the reader imagine the product in their own context.
- **Best flows.** Welcome Series · Browse Abandonment · Post Purchase · Cross Sell.
- **Hierarchy.** The scene → the product within it, identified → the connection to the reader → action.
- **Imagery.** Genuine in-situ photography: installed, fitted, worn, in use. Real settings, not staged
  stock.
- **Copy.** Evocative but concrete. It must name what the reader is looking at, or the image raises a
  question the email never answers.
- **CTA.** Invitational.
- **Strengths.** The strongest emotional pull available; makes utilitarian products desirable; excellent
  for discovery.
- **Limitations.** **The most conditional pattern in the library.** Atmospheric artwork must stay
  proportionally subordinate and must carry a Visual Bridge, because atmosphere alone cannot bridge to the
  message. Without genuine in-situ assets it should not be attempted at all — staged imagery produces a
  semantic disconnect that no amount of craft repairs.

### 3.12 Trust Hero

- **Role.** Role 4 — Brand.
- **Objective.** Remove the objection that is stopping an otherwise-ready reader.
- **Best flows.** Abandoned Checkout middle touches · Post Purchase · Review Request · Sunset · first
  purchase from a new customer.
- **Hierarchy.** The concern named → the guarantee or credential that answers it → proof → action.
- **Imagery.** Minimal. Credentials, accreditation marks or nothing. Photography rarely helps.
- **Copy.** Specific and verifiable. "Up to ten years" beats "long warranty"; an unverifiable claim does
  more damage than no claim.
- **CTA.** One action, back to the point the reader stalled at.
- **Strengths.** Converts hesitant readers without discounting; entirely evergreen; needs almost no assets.
- **Limitations.** Low visual interest, and the easiest pattern to render as a documentation-style layout.
  Every claim must be true and confirmed — trust content is precisely where an invented value is most
  damaging.

---

## 4. Cross-cutting rules

### 4.1 Declare the role, then design

The pattern is a starting point; **the declared STD-HERO role is the commitment.** Record both in the
creative proposal and in the built template's header.

### 4.2 A pattern does not survive an objective change

Within one flow, later touches frequently need a different pattern, because the objective changes. An
Abandoned Checkout first touch is a Product Hero; its final touch, if it carries an incentive, is an Offer
Hero. **Re-select per email, never per flow.**

### 4.3 Every pattern needs its no-data state designed

Six of the twelve depend on live data — Product, Browse, Price Drop, Collection, Category and Comparison.
For each, the state where the data is absent is a **first-class design deliverable**, and it must never
assert something unverifiable to fill the gap. The engineering requirement for fallbacks lives in each
project's `CLAUDE.md`; the obligation to *design* that state lives here.

### 4.4 Vertical cost is a design decision, not an engineering surprise

Product, Comparison, Collection and Lifestyle Heroes all commit significant vertical space to imagery,
which pushes the action down. That trade is chosen in the creative phase and its consequence is reported
in the build, not discovered at QA. STD-HERO §3.8 owns the requirement to publish the resulting offset —
and forbids resolving it by cropping artwork or deleting copy.

### 4.5 Never tune a Hero because it "feels wrong" without diagnosing first

STD-HERO §15.2 supplies the diagnostic: a failure that looks *different* between clients or widths is
geometry; a failure that looks the *same* everywhere is composition. Composition failures are fixed here —
by role, proportion, hierarchy and bridge — not in markup.

---

## 5. Change log

| Date | Version | Change | Both copies |
|---|---|---|---|
| 2026-07-29 | 1.0.0 | Library established with twelve Hero patterns, the pattern-to-role map against STD-HERO §15.6, the selection table, and the cross-cutting rules including the no-data-state obligation (§4.3). References STD-HERO throughout; restates none of it. | ✔ |

---

*Selects which Hero to design. `Shared/Email-Hero-Engineering-Standard.md` governs how it must be built,
and wins on any apparent conflict.*
