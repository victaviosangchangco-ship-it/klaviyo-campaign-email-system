# Creative Workflow Standard

> **The first document to read before beginning any new email design.**
> Applies to the **Klaviyo Campaign Email System** and **Klaviyo Flows Automation System**, every brand
> (RDD · SS · SC · Stack · future), every campaign type and every flow type.
>
> This standard governs the **order in which work happens**. It changes no engineering rule, removes no
> gate, and weakens no prohibition. It moves creative decision-making *in front of* implementation, where
> it belongs.

---

## Document control

| | |
|---|---|
| **ID** | **STD-CREATIVE** |
| **Status** | **ACTIVE — mandatory** |
| **Version** | **1.1.0** — see §11 |
| **Owner** | Project Owner |
| **Established** | 2026-07-29, from the workflow finding recorded in §1.1 |
| **Scope** | **Sequence and creative criteria only.** Contains **no build rules**, no brand values, no flow or campaign values. |
| **Canonical location** | `Shared/Creative-Workflow-Standard.md` |
| **Mirroring** | **Two byte-identical copies exist**, one per project. Both are canonical. **Any change must be applied to both in the same edit**, and recorded in §11. A one-sided edit silently forks the standard — verify by hashing both files. |
| **Cross-reference convention** | **C§n** = Campaign `CLAUDE.md` · **F§n** = Flow `CLAUDE.md` · **H§n** = `Shared/Email-Hero-Engineering-Standard.md` (STD-HERO) · **X§n** = Cerberus analysis docs |

**Sync check** — run before trusting either copy:

```
sha256sum "…/Klaviyo Campaign Email System/Shared/Creative-Workflow-Standard.md" \
          "…/Klaviyo Flow and Claude Code/Shared/Creative-Workflow-Standard.md"
```

---

## 1. Purpose

### 1.1 What this document exists to stop

The engineering foundation is stable. Templates now pass the full gate set: balanced markup, verified
links, computed contrast, hybrid stacking, aspect-locked artwork, doubled `bgcolor`, guarded dynamic
data, clean footer validation.

**And several of them still failed as marketing.** The recurring report was some version of *"technically
correct but it reads like a document"* — prototype-looking layouts, subordinate product imagery, body-size
type doing a headline's job, and section rhythm driven by what was easy to build rather than by what the
reader needed to feel.

The cause was **sequencing, not skill**. When implementation is the first activity, every creative
decision arrives already constrained:

| When engineering leads | The design that results |
|---|---|
| The reusable component set is opened first | Composition becomes an arrangement of existing blocks |
| Client limitations are considered before intent | The brief silently shrinks to what is convenient |
| The grid is chosen before the message | Hierarchy is inherited from the last template, not designed |
| Type sizes come from the token list | Scale contrast is whatever the tokens already contained |
| "Does it render?" is asked before "does it sell?" | Correctness becomes the definition of done |

None of those is an engineering fault. Each is the predictable result of asking the engineering question
first.

### 1.2 What this document is

- A **fixed order of execution** (§7) with a named gate between creative and engineering.
- A **creative philosophy** that assigns Claude a role, and a sequence for those roles (§2).
- A **concept-exploration obligation** that must be discharged before any markup exists (§3).
- A **reference-analysis method** that extracts intent rather than pixels (§4).
- A set of **creative rules** with an explicit prohibition list (§5).
- A **marketing review** that must be passed before implementation begins (§6).
- A **Creative Lock** that protects an approved concept from being redesigned during build (§8).
- **Worked lifecycles** for five flow types (§9).

### 1.3 What this document is not

It is not a design system. Brand colours, type scales, spacing values, component measurements and voice
remain in each brand's design documents. It is not an engineering standard: it adds no rule about tables,
attributes, VML, dark mode or accessibility, and it overrides none.

**It is silent on taste and specific on order.**

### 1.4 The one law

> **Creative decides what the email must achieve. Engineering decides how to make that survive a mail
> client. Never the reverse.**

---

## 2. Creative Philosophy

### 2.1 Role sequence

Claude holds several roles in these projects. This standard fixes the **order** in which they act.

```
   1  EMAIL CREATIVE DIRECTOR      what should this email make someone feel and do?
   2  MARKETING ART DIRECTOR       what carries that — hierarchy, proportion, rhythm, tone?
   3  CRO SPECIALIST               where does the eye go, and where does the hand go?
                    ── CREATIVE APPROVAL GATE ──
   4  SENIOR EMAIL ENGINEER        how does that survive Outlook, Gmail, Apple Mail, images-off?
   5  QA / REVIEWER                does it actually render, and is anything unverified?
```

**Roles 1–3 must complete before role 4 begins.** Roles 4–5 serve the output of roles 1–3; they do not
renegotiate it.

### 2.2 The behavioural rule

**Behave as an Email Creative Director before behaving as an HTML Engineer.**

Concretely, in the creative phase:

- Describe the email as a reader experiences it — top to bottom, as a sequence of feelings and decisions.
- Name the single thing the first screen must communicate.
- Decide proportion and emphasis in the abstract, before any pixel or column arithmetic.
- **Do not mention a table, a media query, a client bug, or a component name.** If a limitation is
  genuinely fatal to a concept, note it in one line and continue exploring; do not let it silently
  reshape the idea.

### 2.3 What "engineering-first" looks like, so it can be caught

Named so it is recognisable in a draft, in a proposal, or in Claude's own reasoning:

- The concept is described in terms of sections and components rather than in terms of the reader.
- The first question asked about an idea is whether it renders.
- The layout is a recognisable rearrangement of the previous template.
- Every type size already exists in the token list.
- The hero is "an image and then some text" with no stated role or intent.
- The proposal contains no idea that was considered and rejected.

**Any one of these means the creative phase has not happened yet.**

---

## 3. Creative Exploration Phase

### 3.1 The obligation

**Every new template begins with concept exploration, expressed in words, before any HTML exists.**
This is a deliverable, not a warm-up. It is presented for approval, and it is what gets approved.

### 3.2 What must be proposed

Six items, every time:

| # | Item | The question it answers |
|---|---|---|
| 1 | **Hero direction** | What is the first screen, and what one thing does it communicate? |
| 2 | **Layout direction** | What is the shape of the whole email — its surfaces, movements and rhythm? |
| 3 | **Visual hierarchy** | What is loudest, second, third — and by how much? |
| 4 | **Marketing hierarchy** | In what order does the reader receive *meaning*: hook, offer, framing, proof, action? |
| 5 | **CTA placement** | Where is the single action, why there, and what carries a reader who is not ready yet? |
| 6 | **Product emphasis** | How much of the email is product, and does that match how much the product is the message? |

### 3.3 Explore without implementation constraints

During §3.2 the following are **deliberately out of scope**: table structure, column arithmetic, client
support, VML, dark mode, media queries, file size, component inventory.

**Rationale.** Constraint-first thinking converges too early. The purpose of exploring unconstrained is
to find the strongest idea *first*, and then discover — at the handoff (§7) — that most strong ideas are
buildable, and that the few that are not can usually be preserved in substance by a different mechanism.
An idea that is never proposed can never be adapted.

### 3.4 Explore more than one direction

**Propose at least two genuinely different directions, and say which you recommend and why.** Two
variations of one idea is one direction. Directions differ when they differ in *hierarchy* — what is
loudest, what the first screen is for, where the offer sits.

A single proposal with no rejected alternative is a decision that was never made.

**Exception — a `TARGET` reference.** Where the L5 spec tags a reference `TARGET` (§4.0), the approved
direction already exists and this obligation is **discharged**. Do not propose alternatives to a decision
the Owner has already made.

### 3.5 Declare the Hero role before designing the Hero

The Hero's marketing role — Atmospheric · Product · Offer · Brand — **is a creative decision and is
declared in this phase.** The four roles, their permitted proportions and their bridge requirements are
defined in **H§15.6 and are not restated here.**

Declaring the role in the creative phase is what prevents the single most expensive Hero failure on
record: a Hero built as one role while its objective required another. Diagnosis and precedent:
**ADR-009**.

### 3.6 Output of this phase

A short written proposal covering §3.2's six items, the declared Hero role, at least two directions with
a recommendation, and any reference analysis (§4). No markup. No file in `Draft/`.

---

## 4. Reference Analysis

### 4.0 Reference fidelity mode — declare it before analysing

Every reference carries exactly one mode, recorded in the **L5 spec's Reference Register** (Flow:
`Brands/<CODE>/Flows/<FLOW>/Flow.md` · Campaign: the send's `Brief/`). The mode selects the entry point
into §9.0's lifecycle. **It adds no stage and removes no gate.**

| Mode | Means | Workflow consequence |
|---|---|---|
| **TARGET** | An approved design direction for **this** brand, supplied pre-approved | §3 exploration is **discharged** — the direction already exists. §4.3 does not apply. The Creative Lock (§8) closes on the reference. Proceed to §6 as a **conformance** review, then §7. |
| **INSPIRATION** | Evidence of what works, from any source | §3 and §4.3 apply in full, unchanged. |
| **LEGACY** | The artefact being replaced | Contributes nothing. Extract no devices. Treat as a blank page: full §3. |

**Bounds on TARGET — all four absolute:**

1. Valid only for the brand's **own** approved design. A third-party design is always INSPIRATION, and
   §4.3 is unchanged for it.
2. Binds **structure, hierarchy, proportion, section order and CTA placement**. It binds nothing else.
3. Never overrides an L1 standard, an L3 brand fact, verified product data or compliance. **§4.4 stands in
   full.**
4. **An untagged reference defaults to INSPIRATION** — this section is a no-op until a mode is declared.

**Why this exists.** A reference supplied as a design target had no expressible mode, so §4.3 and §4.4
together made faithful implementation unreachable — the recorded cause of generated HTML diverging from
supplied references. TARGET does not weaken §4.3; it scopes it to the case §4.3 was written for.

**Campaign exception.** The approved-send baseline required by Campaign `CLAUDE.md` §5.1.1 is **always
INSPIRATION** and is never tagged TARGET — that workflow requires each send to improve on its baseline
rather than reproduce it.

### 4.1 When a reference exists

Where a reference image, screenshot or approved design direction is supplied, it is analysed **before**
any concept is proposed, and the analysis is written down.

### 4.2 What must be identified

| Extract | The question |
|---|---|
| **Why it converts** | What does it do to a reader that a weaker version would not? |
| **Hierarchy** | What is loudest, and what has been deliberately suppressed? |
| **Spacing** | Where is space generous, where is it tight, and what does that grouping say? |
| **Rhythm** | How do surfaces and movements alternate down the page? |
| **Emotional tone** | Calm, urgent, premium, utilitarian, reassuring — and carried by what? |
| **Premium characteristics** | The specific devices: restraint, scale contrast, one accent, framing, tracking, whitespace |

### 4.3 Reproduce intent, never pixels

**Claude must not reproduce a reference pixel-for-pixel, and must not carry across another brand's
identity** — wordmark, palette, typeface, imagery, product category, or copy. A reference is evidence of
*what works*, not a layout to be cloned.

The output of analysis is a list of **devices** — "a floating information card carries the offer",
"micro-labels at wide tracking connect movements", "one accent colour, used once" — which are then
re-expressed in the brand's own system.

### 4.4 A reference never overrides a higher source

References are **visual guidance**. They lose to the brand layer and to verified data, every time. The
precedence order is owned by each project's `CLAUDE.md` (F§2.2 / C§2) and by
`Shared/Engineering/Engineering-Document-Relationships.md`, and is not restated here.

**In practice this means a reference's structure is declined whenever it conflicts with a confirmed brand
value, and the decline is recorded** — for example a reference CTA style that contradicts the brand's
confirmed button specification, or a reference's scarcity claim that an evergreen flow cannot make.

### 4.5 State what was taken and what was declined

Every implementation informed by a reference records: which devices were adopted, which were declined and
why, and confirmation that no identity or copyrighted layout was carried across. This is what makes
"inspired by" auditable rather than asserted.

---

## 5. Creative Rules

### 5.1 Encourage

- **Bold layouts.** Committed surfaces, decisive colour blocks, real contrast between movements.
- **Premium ecommerce composition.** One focal point per screen. Restraint over density.
- **Luxury spacing.** Space that varies deliberately: generous between movements, tight within them.
- **Strong typography.** Wide scale range, and tracking used as a signal — open on small labels, tight on
  display sizes.
- **Emotional hierarchy.** The reader should feel the point before parsing it.
- **Product-first thinking.** If the product is the message, it gets the space.
- **Conversion-first thinking.** Every element earns its place by moving the reader toward one action.

### 5.2 Do not allow

| Prohibited | What it looks like |
|---|---|
| **Documentation-style layouts** | Uniform panels, heading-plus-paragraph repetition, everything the same weight |
| **Report-style layouts** | Content presented as an itemised summary rather than a message |
| **Placeholder appearance** | Visible borders on everything, boxed regions, evenly-sized blocks, filler copy |
| **Engineering-first composition** | Structure chosen because it was convenient to build (§2.3) |

### 5.3 The prototype tell

> **If the layout would look unchanged with the content replaced by grey bars, it is a wireframe, not a
> design.**

A design's structure carries meaning: the loudest thing is loud *because* it matters most. A prototype's
structure carries only arrangement.

### 5.4 Creative rules never override an engineering prohibition

Nothing in §5 authorises a prohibited technique. Where a creative ambition and an engineering
prohibition genuinely collide, the handoff (§7.3) resolves it — by finding a different mechanism for the
same intent, not by suspending the rule and not by abandoning the intent.

---

## 6. Marketing Review

### 6.1 The gate

**Before implementation begins, the approved concept is reviewed against one question:**

> **Does this read as a premium ecommerce campaign — the standard of Klaviyo's showcase, Shopify Plus
> brands, Apple, Nike — or does it read as documentation, a dashboard, or CMS output?**

The comparison is to the *standard* those names represent: restraint, hierarchy, proportion, whitespace,
one clear action. It is **not** an instruction to imitate them, and their identities are never borrowed
(§4.3).

### 6.2 Checkable questions

| Ask | Fail signal |
|---|---|
| What is the first screen for? | It cannot be stated in one sentence |
| What is the loudest element, and should it be? | The loudest element is not the message |
| How many focal points are on screen one? | More than one |
| Does the artwork carry message-relevant content? | It is atmosphere at the proportion of a product shot |
| Does every section move the email forward? | A section could be deleted with no loss |
| Is there exactly one primary action? | Two things compete to be the click |
| Would this look premium with images blocked? | The message lives in the artwork |
| Does it look like this brand? | It could be any brand with the logo swapped |

### 6.3 Composition rules already exist — apply them, do not restate them

The normative composition rules for Heroes — mandatory reading order, semantic continuity, the Visual
Bridge requirement, proportion-follows-communication-value, and the four marketing roles — are **H§15**.
This review *applies* H§15; it does not duplicate it. The geometry-versus-composition diagnostic is
**H§15.2**.

### 6.4 The review is recorded

A marketing review that was not written down did not happen. Record what was checked, what passed, and
what was changed as a result. **A composition pass and an engineering pass are separate outcomes and are
recorded separately** (ADR-009, and ADR-008 for the equivalent rule about validation).

---

## 7. Engineering Handoff

### 7.1 What happens only after creative approval

Once the concept has passed §6, engineering begins — and only then are these applied:

- Cerberus mechanisms and the hybrid stacking arithmetic (`Shared/Frameworks/Cerberus/`, F§8.8 / C§6.20)
- Outlook, Gmail, Apple Mail, Samsung Mail and Yahoo requirements
- Accessibility requirements
- Responsive behaviour
- Images-off behaviour
- Dark mode
- The reusable component set

**All of these remain exactly as specified in their owning documents.** This standard changes when they
are applied, never what they require.

### 7.2 The prime directive of the handoff

> **Engineering preserves the creative vision. Engineering never replaces it.**

Engineering's job is to find the mechanism that delivers the approved intent in a mail client. It is not
to select a different, easier intent.

### 7.3 When a concept cannot be built as drawn

A real and normal situation. The resolution order is fixed:

1. **Name the mechanism that blocks it**, precisely — not "that will not work in Outlook", but which
   engine, which property, which client behaviour.
2. **Find a different mechanism for the same intent.** Most premium devices have an email-safe
   expression: a framed plate on a contrasting surface instead of an overlap; a painted band instead of a
   border effect; a shrink-to-fit table instead of an inline-block; scale and tracking instead of a
   weight the stack does not have.
3. **If the intent survives but the execution changes, that is a success** — record the substitution.
4. **If the intent genuinely cannot survive, return to creative** (§3), do not silently degrade it. The
   creative director decides what to give up.
5. **Never weaken a gate to make a concept pass.** `Engineering-Governance.md` §3.3 forbids it, and that
   is unchanged.

### 7.4 The geometry gate is not an exception to this order

**One clarification, because two standards touch here and must not appear to disagree.**

STD-HERO requires a **geometry gate before artwork is commissioned** (H§12.1, H§14.1 step 2). That is not
an engineering-first activity, and it does not precede creative work:

- The **creative phase** decides the Hero's role, its proportion and its reading order (§3.5, H§15).
- The **geometry gate** then runs as the **first step of engineering** and answers one narrow question:
  can the proposed artwork hold its composition at phone widths? It is a feasibility check on a brief,
  not a design decision.
- Both still happen **before artwork is commissioned and before any HTML is written**, which is the
  outcome H§12.1 exists to guarantee.

Order: **creative concept → marketing review → geometry gate → artwork brief → build.** Nothing in
STD-HERO moves; it gains a phase in front of it.

### 7.5 Engineering may still refuse

The handoff is not a rubber stamp. Engineering must surface a conflict rather than absorb it
(`Engineering-Governance.md` §2.2). A concept that requires a prohibited architecture is returned with
the §13 entry named and the Band-architecture equivalent offered (H§14.3).

---

## 8. Creative Lock

### 8.1 The lock

**Once a creative direction is approved, it is locked. Engineering may refine implementation; it must not
redesign the visual concept.**

Locked means: hierarchy, proportion, surfaces, reading order, focal point, Hero role and CTA placement
are fixed.

**A `TARGET` reference is an approved creative direction that arrives pre-approved** (§4.0), so the lock
closes at the moment it is tagged rather than at §6. §8.2–§8.4 then apply to it unchanged.

### 8.2 What refinement is, and is not

| Refinement — permitted | Redesign — prohibited without re-approval |
|---|---|
| Choosing the mechanism that delivers the approved composition | Changing which element is the focal point |
| Adjusting a measurement so a region reconciles | Reordering the reading sequence |
| Substituting an email-safe expression of the same device (§7.3) | Demoting the product or the offer |
| Recomputing a colour pair for its actual surface (H§7.3) | Changing the surface palette of the design |
| Reporting a fold offset and mitigating it as the standard prescribes | Cropping artwork or deleting copy to move a fold |

### 8.3 Two different locks — do not confuse them

| Lock | Means | Owned by |
|---|---|---|
| **Creative Lock** | The **visual concept** is approved and fixed | this document, §8 |
| **`ARCHITECTURE LOCKED`** | The **engineering** of a component is settled | H§12.5 (Heroes) · the owning design document (other components) |

They are independent. A design can be creatively locked while its engineering is still in progress, and
a component can be architecture-locked while its creative treatment is being revised. **Neither implies
production validation** (ADR-008).

### 8.4 Changing a locked creative direction

Requires the same approval that created it: a return to §3 with the reason stated, and a new draft
version. It is never done inside a build. **Iterating an approved concept during implementation is churn,
and churn is how a solved problem gets re-broken** — the same principle the engineering layer already
applies to locked components (`Shared/Engineering/README.md` §5.8).

---

## 9. Workflow Examples — Flow templates only

> **This section is deliberately restricted to the Klaviyo Flows Automation System project.**
>
> The Klaviyo Campaign Email System has a different purpose — one-off promotional sends, with a weekly
> selection engine, a campaign-type decision and a continuous-improvement loop against the last approved
> send — and therefore a different creative workflow. It is **not** used as an example here, and these
> examples must not be applied to it.
>
> **§1–§8 are project-neutral and apply to both projects in full.** A Campaign reader uses §1–§8 and
> ignores §9.

### 9.0 The lifecycle

Every flow template moves through this sequence. The three creative stages are new; the four engineering
stages are the existing pipeline, unchanged.

```
        REFERENCE IMAGE            analyse intent, not pixels                 §4
                ↓
        CREATIVE EXPLORATION       2+ directions · Hero role declared         §3
                ↓
        MARKETING REVIEW           premium ecommerce, or documentation?       §6
                ↓
        CREATIVE APPROVAL          ── the lock closes here ──                 §8
                ↓
        ENGINEERING IMPLEMENTATION geometry gate → artwork brief → build      §7
                ↓
        CERBERUS RENDERING         hybrid, ghost tables, head scaffold, VML
                ↓
        RESPONSIVE VALIDATION      320 / 375 / 414 / 600 · head-CSS removed
                ↓
        QA                         full gate set · a preview is never proof
                ↓
        OUTPUT                     only on explicit approval of a named draft
```

### 9.1 Abandoned Checkout

| Stage | What happens |
|---|---|
| **Reference** | Extract: how the cart is recalled, where reassurance sits, how urgency escalates across touches. |
| **Creative exploration** | Hero role **Product** (H§15.6 role 2 — the reader's own cart items are the highest-information content). Two directions: *(a)* the cart itself as the hero, items at full scale; *(b)* a single hero item with the remainder as a compact recall strip. Recommend (a) for a multi-item cart, (b) for one item. Marketing hierarchy: cart recall → the friction removed → framing → one action. |
| **Marketing review** | First screen must answer "this is *my* cart", not "this is a shop". Fail signal: a generic brand image above the items. |
| **Creative approval** | Hierarchy, item scale and CTA position locked. |
| **Engineering** | Geometry gate on any artwork band; item grid built on hybrid columns with fixed-height regions; line-item loop guarded so an empty or single-item cart cannot break the layout. |
| **Cerberus / responsive / QA / Output** | Standard pipeline. QA additionally previews the empty-cart, single-item and long-product-name states. |
| **Note on the later touches** | The third touch's objective is recovery through an incentive, so its Hero role is **Offer**, not Product. Same flow, different role, because the objective changed — the mismatch that ADR-009 records. |

### 9.2 Browse Abandonment

| Stage | What happens |
|---|---|
| **Reference** | Extract: how the viewed item is re-presented, and how related products are framed without reading as a generic upsell. |
| **Creative exploration** | Hero role **Product**. Two directions: *(a)* the viewed product presented at full scale on a contrasting stage; *(b)* an editorial "return to it" composition where the product is one of a small curated set. Recommend (a) — the reader's own browsing is the only personalisation this flow has. Marketing hierarchy: the product → the reason to act now that is *not* a discount → framing → one action. |
| **Marketing review** | First screen must feel like recognition, not automation. Fail signals: a headline that would suit any email; a product thumbnail smaller than the logo. |
| **Creative approval** | Product scale, stage treatment and the position of the commercial line locked. |
| **Engineering** | Viewed-product data bound with guards so a missing key degrades to a truthful fallback rather than a blank panel or a false claim; related products on hybrid columns. |
| **Cerberus / responsive / QA / Output** | Standard pipeline. QA additionally previews the no-event-data state, because that is what renders until the payload keys are confirmed. |

### 9.3 Price Drop

| Stage | What happens |
|---|---|
| **Reference** | Extract: how a price change is dramatised — the ladder from old to new, where the saving sits, how the number is made the loudest thing. |
| **Creative exploration** | Hero role **Offer** (H§15.6 role 3 names Price Drop explicitly). Two directions: *(a)* the number as the headline — no display sentence competing with it; *(b)* a floating price card on a product stage, so the figure and the action are one object. Marketing hierarchy: the news → the figures → the product as proof → one action. |
| **Marketing review** | The reader must learn the price dropped on screen one. Fail signals: the price set at body size; a display headline competing with the figure; two focal points. |
| **Creative approval** | The price is the focal point; the display scale ratio is fixed. |
| **Engineering** | Every price bound dynamically and guarded — no figure is ever hardcoded, because a baked price is not evergreen; the saving badge built shrink-to-fit so a mobile client cannot stretch it. |
| **Cerberus / responsive / QA / Output** | Standard pipeline. QA additionally previews price-present, price-absent and saving-absent states. |

### 9.4 Customer Winback

| Stage | What happens |
|---|---|
| **Reference** | Extract: how absence is acknowledged without guilt, and how an incentive is introduced without leading with it. |
| **Creative exploration** | Hero role **Offer** (H§15.6 names Winback). Two directions: *(a)* what has changed since they left, with the incentive as the closing argument; *(b)* the incentive as the hero, with the range as proof. Recommend (a) for the first touch and (b) for the last — the sequence must escalate, so the incentive cannot be spent in touch one. Marketing hierarchy: acknowledgement → what is new → the offer → one action. |
| **Marketing review** | Must read as an invitation, not a plea. Fail signal: the discount is the first thing on screen in touch one, leaving the later touch nothing to escalate to. |
| **Creative approval** | The escalation position of the incentive is locked across the sequence, not just within one email. |
| **Engineering** | Coupon bound as a dynamic code with a guarded fallback so no naked template tag or empty offer box can render. |
| **Cerberus / responsive / QA / Output** | Standard pipeline. QA additionally previews the coupon-absent state. |

### 9.5 Back In Stock

| Stage | What happens |
|---|---|
| **Reference** | Extract: how immediacy is expressed structurally — how fast the reader gets from "it's back" to a click. |
| **Creative exploration** | Hero role **Product** (H§15.6 names Back In Stock). Two directions: *(a)* the restocked item at full scale with the news as a single tracked line and the CTA immediately beneath; *(b)* a fuller editorial treatment. Recommend (a) — this is the one flow where brevity is the creative idea, because the reader already wants the product. Marketing hierarchy: the news → the product → one action. Nothing else. |
| **Marketing review** | Must be the shortest email in the system. Fail signal: a brand introduction, a trust essay, or a recommendation grid delaying the click. |
| **Creative approval** | Brevity is part of the locked concept — sections may not be added during build. |
| **Engineering** | Restocked-item data bound with guards; the CTA must be reachable on the first screen, and if it is not, the offset is published and the copy is shortened rather than the artwork cropped. |
| **Cerberus / responsive / QA / Output** | Standard pipeline. |

### 9.6 Why this order produces better templates than starting with HTML

Six mechanisms, each of which fails when implementation comes first:

1. **The message is designed instead of inherited.** Starting from the component set produces an
   arrangement of what already exists. Starting from the reader produces a hierarchy that matches *this*
   email's job — which, in a flow, is set by the trigger and differs at every step of the sequence.
2. **The Hero role is chosen deliberately.** Declaring the role before designing is the single control
   that prevents the most expensive documented Hero failure: built as one role, objectively another
   (ADR-009). Role cannot be recovered by markup afterwards.
3. **Proportion is decided before the asset exists.** An artwork's ratio sets the mobile height cost and
   therefore the fold. Once an asset exists, that decision has already been made for you — the same
   lesson ADR-004 recorded for geometry, applied to composition.
4. **Constraints arrive as problems to solve, not as limits on imagination.** Discovering at the handoff
   that a device needs a different mechanism costs one substitution. Never proposing the device costs the
   idea entirely.
5. **Rejected alternatives make the choice defensible.** Two explored directions produce a decision.
   One produces a default.
6. **The creative intent survives the build.** Without a lock, implementation quietly optimises toward
   what is easy, and the result passes every gate while missing the point. With a lock, engineering
   changes the *how* and never the *what*.

**And the engineering quality does not drop — it improves.** A build with an approved concept has a fixed
target, so gate failures become genuine mechanism problems rather than symptoms of a design still being
negotiated mid-implementation.

---

## 10. Relationship to the existing documents

### 10.1 Nothing is removed

| Document | Status after this standard |
|---|---|
| Each project's `CLAUDE.md` | **Unchanged in substance.** Gains a pointer to this document as the first read for new design work. |
| `Shared/Email-Hero-Engineering-Standard.md` | **Unchanged.** Fully valid. Gains a creative phase in front of its geometry gate (§7.4). H§15 remains the normative composition rule set. |
| `Shared/Frameworks/Cerberus/` | **Unchanged.** Still the external rendering authority. Applied at §7, not before. |
| `Shared/Engineering/` | **Unchanged in authority.** Governance, ADRs, versioning, change management and the QA gates all continue to apply to this document as they do to any standard. |
| Reusable components | **Unchanged.** Still built once and reused; still token-driven (ADR-006). |
| All QA gates and prohibitions | **Unchanged.** No gate moves, no prohibition is relaxed (`Engineering-Governance.md` §3.3). |

### 10.2 What actually changed

**Only the order of execution**, plus two new artefacts that did not exist before: a written creative
proposal (§3.6) and a recorded marketing review (§6.4).

```
BEFORE   read → build → QA → review → output
AFTER    read → CREATIVE → MARKETING → build → QA → review → output
```

### 10.3 Precedence

This document is **first in sequence, not first in authority.** On any conflict the existing precedence
order stands: a project's `CLAUDE.md` and the engineering standards win over this document, exactly as
they win over a reference. Ordering is what this standard owns; correctness is owned elsewhere.

### 10.4 Governance

This standard is governed like any other: `Engineering-Governance.md` for authority,
`Engineering-Change-Management.md` for the change path, `Engineering-Versioning.md` for version
semantics, and `Shared/Engineering/README.md` §3 for its register entry.

---

## 11. Change log

| Date | Version | Change | Applied to both copies |
|---|---|---|---|
| 2026-07-29 | 1.0.0 | Document established on Owner instruction, from the workflow finding in §1.1: engineering-first sequencing was producing gate-passing templates that failed as marketing. Introduces the permanent creative-before-engineering order, the Creative Exploration obligation, the reference-analysis method, the Marketing Review gate, the Engineering Handoff and its geometry-gate clarification (§7.4), the Creative Lock, and five Flow-only worked lifecycles. **Changes no engineering rule and removes no gate.** Registered as **STD-CREATIVE** in `Shared/Engineering/README.md` §3. Referenced from both `CLAUDE.md` files, `Shared/README.md` (both projects), `Shared/Engineering/README.md` and `Engineering-Governance.md`. | ✔ |

| 2026-07-30 | **1.1.0** | **Added §4.0 Reference fidelity mode** — the three modes `TARGET` / `INSPIRATION` / `LEGACY`, recorded in the L5 spec's Reference Register, with four absolute bounds on TARGET and the Campaign §5.1.1 exception. Hooks added at §3.4 (a TARGET reference discharges the two-directions obligation) and §8.1 (the lock closes at tagging). **Establishes no new document, no new stage and no new gate**; an untagged reference defaults to INSPIRATION, so existing behaviour is unchanged. Classified **MINOR** under `Engineering-Versioning.md`: no conforming, approved work becomes non-conforming. Register updated to 1.1.0 in the same edit. | ✔ |

**Version note (1.1.0).** Additive only. §4.3 and §4.4 are unchanged in text and authority; §4.0 scopes
§4.3 to the case it was written for and leaves §4.4 absolute. The companion ADR obligation below is
unchanged and still outstanding.

**Version note.** Classified **1.0.0** as a new standard. It is a **T3/T4-class** change under
`Engineering-Governance.md` §3.1 — it establishes a new standard and changes the read order — and was
approved directly by the Owner. **One governance step remains outstanding: §3.1 requires an ADR for every
T3 and T4 change, and the companion record (ADR-010) has not yet been written.** It is flagged here
rather than assumed, per `Engineering-Governance.md` §2.4.

---

*Establishing evidence: the Hero composition investigation and its role-mismatch finding (ADR-009); the
geometry investigation that put a gate before artwork (ADR-002, ADR-004); and the recurring report that
gate-passing templates were reading as documentation rather than as premium ecommerce email. This
document holds sequence and creative criteria only — every normative build rule lives in the standards
listed in `Shared/Engineering/README.md` §3.*
