# Reusable Engineering Patterns — the catalogue

| | |
|---|---|
| **Status** | RESEARCH — **NON-NORMATIVE** |
| **Version** | 1.0.0 |
| **Compiled** | 2026-07-29 |
| **Families** | 15 (**P-01 … P-15**) |
| **Confidence** | Per source — see each family's Source row and `README.md` §7 |

> ⛔ **Nothing in this catalogue governs a build.** A pattern here is a **candidate**, not a rule. It becomes
> binding only after an ECP is raised, evidenced against the bar in
> `Engineering-Change-Management.md` §2.2, approved by the Owner, and written into a standard.
> **Cerberus remains the only production rendering framework.** See `README.md` §1 and §5.
>
> **No markup, CSS, VML or generated output from any source has been carried into this file.** Every family is
> described as a mechanism and a decision, in our own terms.

---

## 0. How to read a family

Each of the 15 families answers the same five questions, as required:

1. **Why it exists** — the problem it solves and the failure it prevents
2. **When to use it**
3. **When NOT to use it** — the boundary is as important as the pattern
4. **Cerberus compatibility** — does it agree with, extend, or contradict our Tier-1 reference
5. **Does it become part of our standards** — verdict, with the route

### 0.1 Verdict vocabulary

| Verdict | Meaning |
|---|---|
| **ADOPT** | Recommended for promotion into a standard. Route stated. |
| **ADOPT AS LENS** | Not a rule; a review question to ask of our own markup. No standard change needed. |
| **VERIFY FIRST** | Plausible and consequential, but rests on an unreproduced client claim. Reproduction required *before* an ECP. |
| **ALREADY OURS** | We already do this. Recorded because independent arrival **settles** the rule (`README.md` §6.4). |
| **STUDY** | Interesting, not currently needed, do not act. |
| **REJECT** | Recorded as rejected so it does not return (`README.md` §6.5). |

### 0.2 The catalogue at a glance

| # | Family | Source | Verdict | Priority |
|---|---|---|---|---|
| **P-01** | Single-declaration component defaults | MJML | ADOPT (principle) | Medium |
| **P-02** | Read-time vs build-time token resolution | MJML · Inky · Maizzle | **ALREADY OURS** — settled | — |
| **P-03** | Generic n-per-row grid as a component | Inky | STUDY → component goal | Low |
| **P-04** | Co-located responsive intent | Inky | **ADOPT** (documentation) | Medium |
| **P-05** | One declared global breakpoint | MJML | REJECT | — |
| **P-06** | Tables-as-remedy review lens | Guidelines | ADOPT AS LENS | Low |
| **P-07** | Reference-consumption protocol | RGE | **ADOPT** — highest immediate value | **High** |
| **P-08** | Named ordered output transformations | Maizzle | **ADOPT** — strongest ECP candidate | **High** |
| **P-09** | Outlook 120dpi document-level declaration | Guidelines | **VERIFY FIRST** | Medium |
| **P-10** | Yahoo/AOL `height` → `min-height` | Guidelines | **VERIFY FIRST** — highest risk | **High** |
| **P-11** | Source-order-preserving order swap | MJML | **ALREADY OURS** — settled | — |
| **P-12** | Automated assertions replacing remembered rules | Maizzle · ours | **ADOPT** (with P-08) | **High** |
| **P-13** | Language declared twice | Guidelines | **ADOPT** — cheapest win | Medium |
| **P-14** | The ~280px no-`<style>` floor as a stated budget | Guidelines | **ADOPT** (QA assertion) | Medium |
| **P-15** | Typographic refinement as a named check | Maizzle | STUDY | Low |

**Four High-priority families: P-07, P-08, P-10, P-12.** P-08 and P-12 are one ECP. P-10 is a reproduction task
that may invalidate a guarantee we currently rely on. P-07 operationalises a rule we already have and have
already paid for breaking.

---

## P-01 · Single-declaration component defaults

| | |
|---|---|
| **Source** | MJML — global per-component-type default attributes and named attribute bundles |
| **Confidence** | High (documented behaviour) |

**1. Why it exists.** When a component is used in twenty places, its default styling exists in twenty places,
and a fix applied to one is a fix missing from nineteen. MJML resolves this by making a component type's
defaults a **single declared statement**, so one edit governs every instance.

Our §7 addresses the same problem with a **duty** rather than a mechanism: *"fix once, propagate immediately —
when a structural or rendering bug is fixed in one flow's HTML, back-port the fix into the shared component…
in the same change. A fix that lives only in one flow's file guarantees the bug returns in the next flow."*
The rule is correct and it is unenforced. `Framework-Comparison.md` §2.2 records this as the **one dimension
where a framework is genuinely ahead of us**.

**2. When to use it.** Whenever a component's visual default is being decided. The default belongs in
`Design.md` as a named, single-home value, and the flow's HTML should be readable as *an instance of that
default*, not as an independent decision that happens to match.

**3. When NOT to use it.** When a value is genuinely instance-specific — a flow-specific artwork dimension, a
one-off measurement driven by a particular asset. Forcing those into a global default creates a false shared
value, and `CLAUDE.md` §2.3's single-home rule then becomes a lie: the file claims to own a value that
instances routinely override.

**4. Cerberus compatibility.** Neutral. Cerberus's 13 reference components are files to read and adapt; they
carry no defaults layer and take no position. No conflict.

**5. Does it become part of our standards?** **ADOPT as a principle, not as a mechanism.** We cannot have
compiler-enforced defaults without a compiler, and the compiler is rejected. What we can do is tighten the
existing duty into a checkable statement: **a component's default value must exist in `Design.md`, and a
flow's HTML must not be the origin of any reusable value.** That is very nearly the `CLAUDE.md` Always rule
*"promote a brand-reusable value into `BrandConfig.md` / `Design.md` in the same change — never leave it only
in a flow's HTML"* — so the gap is smaller than it looks, and the improvement is to make it **auditable**:
a QA assertion that no measurement appears in a template without a `Design.md` counterpart.
**Route: fold into the P-08 / P-12 ECP as an assertion rather than a separate prose rule.**

---

## P-02 · Read-time vs build-time token resolution

| | |
|---|---|
| **Source** | MJML (document defaults) · Inky (Sass variables) · Maizzle (Tailwind config) |
| **Confidence** | High |

**1. Why it exists.** All three tooling sources independently converge on the same requirement: a design system
needs a **single declaration point** for colours, spacing and type. All three then resolve that declaration at
**build time** — the token vanishes into the output.

Resolution point turns out to be the decisive property, not declaration:

| | Single declaration | Artefact traceable to the token |
|---|---|---|
| Sass variables · Tailwind config | ✔ | ✗ — compiled away |
| **`Design.md`** | ✔ | ✔ — the token file ships alongside, permanently |

**2. When to use it.** Every brand value, always. `Design.md` owns colours, type, spacing, radii and component
measurements; `BrandConfig.md` owns brand facts. A template references; it never originates.

**3. When NOT to use it.** Never *not* — but do not mistake read-time resolution for a weaker form of
build-time resolution and try to close the gap with tooling. It is a different resolution point chosen for a
reason: it is what makes `CLAUDE.md` §12's byte-identity regression evidence possible, since hashing inline
styles is only meaningful when those styles are the authored artefact.

**4. Cerberus compatibility.** Compatible. Cerberus has no token layer at all, so our `Design.md` layer sits
cleanly above it — which is the correct relationship: Cerberus supplies mechanisms, `Design.md` supplies values.

**5. Does it become part of our standards?** **ALREADY OURS — and now settled.** Three independent frameworks
converging on single-declaration tokens confirms `CLAUDE.md` §2.3's single-home rule and §7's
"a brand difference is a token change, never a structural rewrite". Per `README.md` §6.4, **stop re-litigating
whether a token layer is worth the indirection.** No standard change; record the confirmation.

---

## P-03 · Generic n-per-row grid as a component

| | |
|---|---|
| **Source** | Foundation for Emails — block-grid |
| **Confidence** | High |

**1. Why it exists.** A grid of *n* equal items per row is common enough to deserve one generic mechanism
rather than a per-count rule. Our §8.3 handles the awkward case — an odd product count — with a **procedure an
author must remember**: give the final card's row cell a `colspan` equal to the column count, then centre a
byte-identical card in a nested table at a fixed pixel width equal to one grid column, full-width on mobile.

That rule is correct and expensively learned: **without the `colspan` the lone cell occupies only the first
column and the centring happens within that half, leaving the card left-aligned** — and a percentage-width
wrapper gets shrink-wrapped by Gmail and Outlook while empty flanking cells collapse.

**The finding is not "adopt block-grid".** It is that our odd-count case is **a known trap encoded as a rule an
author must recall**, and a trap encoded in a component is safer than a trap encoded in prose.

**2. When to use it.** When the Product Grid component is next revised — the odd-count variant should be a
*named state of the component* with its own marked-up skeleton, not a paragraph in `CLAUDE.md` describing what
to build.

**3. When NOT to use it.** Do not generalise to arbitrary column counts. Our §8.3 default is 2 columns
("balance beats density — a marketing email is not a category page"), with 3-column measurements documented in
§8.8. A generic *n* grid invites 4- and 5-column layouts that our measurements do not cover and our card
proportions were never designed for.

**4. Cerberus compatibility.** Compatible and complementary. Cerberus's ghost-table component documents the
shapes; the odd-count centring case is exactly the kind of Klaviyo-adjacent product-card concern
`CLAUDE.md` §8.8 identifies as ours to govern where Cerberus is silent.

**5. Does it become part of our standards?** **STUDY — carry as a component-design goal, not a rule change.**
The rule is already correct; only its *location* is suboptimal. **Route: a T2 change to the Product Grid
component at its next revision, folding the odd-count variant in as a documented state.** Not urgent, and not
worth touching a working component for on its own.

---

## P-04 · Co-located responsive intent

| | |
|---|---|
| **Source** | Foundation for Emails — separate small and large column spans on the element |
| **Confidence** | High |

**1. Why it exists.** In Inky, a column declares its **mobile proportion and its desktop proportion on the
element itself**. One glance answers "what does this do on a phone?"

The conventional alternative splits that fact in two: the desktop width lives on the element, the mobile
behaviour lives in a media query elsewhere in the document. **Two locations for one fact is a maintenance
hazard** — change one, forget the other, and the failure appears only at a viewport nobody previewed.

Our documentation has the same split. `Design.md` measurement tables state desktop values; mobile behaviour is
described in mobile/media-query sections. Our §8.3 rule *"reset the reserved heights to `auto` in the media
query so stacked cards size naturally"* is a **desktop fact and a mobile fact that must move together**, stated
in two places.

**2. When to use it.** In documentation, whenever a measurement has a different mobile value: state both as one
row of one table. *"Card image box: 300×315 desktop / 100% width, auto height mobile"* is one fact. The current
form makes it two.

**3. When NOT to use it.** Do not import the *syntax* — small/large spans are a framework grid mechanism
resolved by a preprocessor, and our stacking is hybrid, not grid-based. And do not co-locate where there is
genuinely no mobile variance; inventing a mobile column for every value adds noise.

**4. Cerberus compatibility.** Fully compatible — this is a documentation practice, not markup. It arguably
*improves* Cerberus alignment, since `CLAUDE.md` §8.8's hybrid measurements (2-col max 290 / min 175, 3-col max
193 / min 140, ghost table 580) are already co-located facts stated together, and that is exactly why they are
easy to apply correctly.

**5. Does it become part of our standards?** **ADOPT as a documentation practice.** No HTML changes, no
component changes, no risk. **Route: a T1/T2 documentation change to each brand's `Design.md` at its next
revision — measurement tables gain a mobile column rather than a separate mobile section.** Recommended, not
urgent.

---

## P-05 · One declared global breakpoint

| | |
|---|---|
| **Source** | MJML — a single breakpoint declared once in the head |
| **Confidence** | High |

**1. Why it exists.** Declaring the responsive threshold once prevents the drift that comes from repeating a
number across many media queries and eventually mistyping one.

**2. When to use it.** The *declaration* discipline is sound — a threshold repeated in six places is six places
to get wrong.

**3. When NOT to use it.** **When one threshold is not enough — which is our situation.** Different components
fail at different widths. The Hero's geometry constraint and the product grid's stacking constraint are
different functions of width: the Hero standard's feasibility test is
`W* = (inset + copy_width) ÷ k`, where drift accumulates at `k` px per px of lost viewport width, and it has
nothing to do with the width at which two cards stop fitting side by side. **Forcing both to share one global
threshold would mean one of them is wrong at the boundary.**

**4. Cerberus compatibility.** Cerberus is hybrid-first, so its stacking does not depend on a breakpoint at
all — which makes the global-breakpoint concept largely irrelevant to a Cerberus-based system. Media queries in
our templates are refinements (type size, releasing a reserved height, tuning a tap target), and refinements
legitimately differ per component.

**5. Does it become part of our standards?** **REJECT.** Recorded so it does not return. A single global
breakpoint is a constraint disguised as a convenience, and our hero work is the concrete case where it would
have hurt. The *sub-*discipline worth keeping — **each component's breakpoints should be stated in
`Design.md` rather than discovered by reading the template** — is already covered by P-04.

---

## P-06 · Tables-as-remedy review lens

| | |
|---|---|
| **Source** | Email Coding Guidelines — tables permitted for exactly three purposes |
| **Confidence** | High (the rule) · Medium (its client basis, unreproduced by us) |

**1. Why it exists.** The Guidelines source restricts tables to three remedies: fixing widths the Word engine
ignores, achieving reliable side-by-side columns, and applying a background where the Word engine cannot honour
CSS on the element. Everything else is `<div>` and CSS.

We do not adopt that as a rule — `Email-Guidelines.md` §14.1 explains why we keep table-based layout: Klaviyo
re-parses and rewrites the HTML on import, and our client matrix is broader than one developer can personally
test. **Degradation is acceptable; disappearance is not** (§8.8).

**But the three-remedy framing is an excellent diagnostic question**, and `CLAUDE.md` §8.1 already asks for its
outcome without giving a method: *"avoid unnecessary nested tables — keep the table tree minimal."* "Minimal"
is unmeasurable. "Which of the three remedies is this table serving?" is answerable.

**2. When to use it.** During QA on any template with deep nesting, and during any component revision. Walk the
table tree and ask the question of each level. A table serving **none** of the three, and not serving as a
sized spacer row or a shrink-to-fit wrapper, is a deletion candidate.

**3. When NOT to use it.** **Do not use it to justify converting existing table structure to `<div>`s.** That
is the part we rejected, and the lens is not a back door to it. Also do not apply it to our sanctioned
non-remedy tables: the sized spacer row (§8.8), the shrink-to-fit centred button/badge table (§8.4), and the
nested centring table for the odd last card (§8.3) all serve documented purposes outside the three remedies.

**4. Cerberus compatibility.** Compatible. Cerberus is table-based throughout and would pass the lens on
essentially every table it uses — which is itself a mild validation of both.

**5. Does it become part of our standards?** **ADOPT AS LENS. No standard change.** It is a review question,
and inventing a rule for it would risk the misreading warned against in point 3. Worth mentioning in a QA
walkthrough; not worth a clause.

---

## P-07 · Reference-consumption protocol

| | |
|---|---|
| **Source** | Really Good Emails — derived from the hazard, not from the source's own guidance |
| **Confidence** | High (the hazard is recorded in this project's own history) |
| **Priority** | **HIGH — highest immediate value in the catalogue** |

**1. Why it exists.** `CLAUDE.md` §5.4 states the rule for reference designs: **study layout, structure,
hierarchy, sections, icons, CTA placement and spacing, then create a fresh design inspired by them; never
reproduce another design exactly; reference screenshots are visual direction only and never override verified
product data.** §2.2 reinforces it: `Reference/` is the lowest tier of the source-of-truth hierarchy.

**The rule is right and it has no method.** This project has the receipt: a single reference image drove **four
successive draft rejections** of one template. The failure was not disobedience — it was that a reference image
is **a composition presented without its constraints**. It carried a mock coupon code, an unverified tagline, a
product grid whose data source did not exist, and a shaped panel division whose email-safe implementation was
an unsolved engineering problem. Each of those had to be discovered *after* the composition was mandated, which
is the most expensive possible ordering.

**2. When to use it.** Every time a reference image, screenshot, competitor email or gallery entry enters a
build. The seven steps, in order:

```
1  Extract the STRUCTURE  — reading order, section sequence, density, hierarchy, CTA placement
2  Discard the SURFACE    — typography, colour, spacing values, artwork, proportions, brand marks
3  Test against §15       — mandatory reading order; proportion follows communication value
4  Test against §4.3      — is every element evergreen, or does it depend on a season, a date,
                            a stock level, or copy baked into artwork?
5  Test against §8 / §9   — is the structure achievable from tables, attributes and inline styles
                            alone, with no <style>, at ~280–320px, with images blocked, in dark mode?
6  Verify every DATUM     — no product, price, coupon, tagline or claim survives from a reference.
                            An absent value is "To be confirmed", never an assumption.
7  Design FRESH           — a new design informed by the structure, never a re-skin (§5.4)
```

**Step 5 is the step that was missing.** A composition that cannot be built under §8 is not a design direction;
it is an unresolved engineering problem wearing one. Running step 5 *before* a composition is mandated converts
four rejection cycles into one up-front conversation.

**3. When NOT to use it.** Do not apply it to our **own** approved prior drafts used as regression baselines —
those are engineering artefacts with known constraints, not references, and steps 2 and 6 would be nonsense
against them. And do not let the protocol become a reason to *reject* a reference: its purpose is to surface
constraints early, not to filter out ambitious direction. A composition that fails step 5 should trigger
*"here is what makes this hard and here are the options"*, not a refusal.

**4. Cerberus compatibility.** Fully compatible — it is a process, not markup. Step 5 is in effect a Cerberus
feasibility check, since "achievable from tables, attributes and inline styles alone, with no `<style>`" is
`CLAUDE.md` §8.8's architectural principle restated as a question.

**5. Does it become part of our standards?** **ADOPT.** This has the best ratio of value to risk in the
catalogue: it costs one subsection, changes no HTML, and addresses a failure mode that has already consumed
four draft cycles. **Route: an ECP proposing the 7-step protocol as a new subsection under `CLAUDE.md` §5.4 in
both projects, with a cross-reference from the Hero standard §15.** T2 — a process addition that constrains no
existing markup.

---

## P-08 · Named, ordered output transformations

| | |
|---|---|
| **Source** | Maizzle — a configurable transformer pipeline |
| **Confidence** | High (documented stages) |
| **Priority** | **HIGH — strongest ECP candidate in the catalogue** |

**1. Why it exists.** Maizzle applies an **ordered series of named, individually-configurable transformations**
to built HTML — CSS inlining, unused-CSS purging, six-digit hex expansion, widow prevention, URL parameter
appending, minification. Two properties do the work: each transformation is **named and separable**, and the
set is **explicitly extensible** — a place to put a rule rather than a fixed list.

**The finding is that we already have this pipeline and have not named it.** Our equivalents are prose rules an
author must remember, scattered across three documents:

| Operation | Where it currently lives | Current form |
|---|---|---|
| Six-digit hex only | §8.8 | a rule to remember |
| Strip descriptive comments from production | §9.2 | a rule to remember |
| Payload under the ~102 KB clip threshold | §9.4 | a goal to watch |
| Anchor open/close balance | §8.7 | **already framed as an automated check** |
| No `<` inside an attribute list | §8.7 | **already an automated check** |
| No odd quote count in any tag | §8.7 | **already an automated check** |
| No empty or `#` href | §8.7, §9.2 | **already an automated check** |
| No anchor nested inside an anchor | §8.7, §9.2 | **already an automated check** |
| Tag balance across table/row/cell/anchor | §9.2 | a grep instruction |
| No unrendered template syntax in output | §9.3 | a preview check |
| Every image has explicit dimensions | §8.2 | a rule to remember |
| Every image has meaningful or deliberately empty alt | §9.4 | a rule to remember |
| Spacers carry `aria-hidden` | §8.8 | a rule to remember |
| No `display:none` clickable nodes | §9.2 | a grep instruction |

**§8.7's five automated checks prove the model already works here** — they exist precisely because a template
tag expanded inside an attribute produces markup that is **invisible to source review and breaks only after
rendering**, and because a plausible-but-undefined tag name *"survived seven template revisions and 40 project
markdown files undetected"*. That is the exact class of defect a named assertion catches and a remembered rule
does not.

`Engineering-QA-Process.md`'s 16-scan set is this pipeline in embryo. What it lacks is **naming, ordering, and
individual addressability.**

**2. When to use it.** On every built file, before it is presented or written to `Draft/` — which is already
when §9's gates run. The change is not *when* but *how*: each assertion gets an ID, so a QA report can state
`A-04 PASS / A-11 FAIL` rather than a paragraph, and a new assertion can be added by appending a row instead of
rewriting prose.

**3. When NOT to use it.** **Do not implement it as a build step or a dependency.** The whole point is that the
concept transfers and the implementation does not: this is a documentation and QA-process restructuring, run by
Claude at generation time with the same shell tooling already used for tag-balance and hash checks. And do not
let an assertion set become a **false completeness signal** — §9.1's rule zero stands unconditionally: a
passing assertion set is not a client render, and *"anything that cannot be verified in this environment is
reported as a required manual pre-activation step, never as a pass."*

There is also a specific, already-recorded hazard to encode: **comment prose must not contain the tokens the
assertions search for.** Literal element names, style values and template tags inside descriptive comments
produced false tag-balance mismatches, a false nested-anchor hit and false missing-attribute counts on three
separate occasions in this project. An assertion set makes that failure mode more likely, not less, so the
prohibition belongs in the same ECP.

**4. Cerberus compatibility.** Fully compatible and strengthening. Cerberus documents a client matrix and a
defect index; an assertion set is the mechanism that checks a built file against the rules those documents
motivate. Nothing about it alters markup.

**5. Does it become part of our standards?** **ADOPT — the recommended first ECP from this research.**
**Route: an ECP (next number **ECP-003**, subject to the register) proposing that
`Engineering-QA-Process.md`'s 16-scan set and `CLAUDE.md` §8.7's automated checks be restructured as a named,
ordered, individually-referenceable output-assertion set**, with:

- a stable ID per assertion, so it can be cited in a QA report and in a `Draft/` header
- an explicit order, so cheap structural assertions run before expensive semantic ones
- an extension procedure, so a new defect becomes a new assertion rather than a new paragraph
- the comment-prose prohibition recorded alongside
- **an explicit statement that the set does not and cannot substitute for §9.1 client validation**

T2–T3: it changes process and documentation, not markup, but it touches a governance document, so Owner
approval applies. **Bundle P-12 into the same ECP** — they are the same change viewed from two angles.

---

## P-09 · Outlook 120dpi document-level declaration

| | |
|---|---|
| **Source** | Email Coding Guidelines |
| **Confidence** | **Medium** — documented by a credible source, **not reproduced by us** |

**1. Why it exists.** Outlook on Windows at 120dpi scales dimensions expressed in some units but not others, so
a layout correct at 96dpi is subtly wrong at 120dpi — mismatched widths, drifting spacing, misaligned columns.
The documented remedy is a **document-level DPI declaration in the head**, paired with the Office XML namespace
on the root element. One declaration, not a per-element workaround.

**This is a genuine gap on our side.** `CLAUDE.md` has no coverage of 120dpi anywhere. Our templates declare
the Office namespace (it is required for VML), but the DPI declaration itself is unverified in our files.

**Why it matters more to us than to a general email:** our product cards depend on **reserved fixed-height
regions**, and §8.3 already records how badly a per-client height discrepancy behaves — `height` and `padding`
on the same cell resolving to 50px in one engine and 36px in another *"silently changes size per client, so
everything below it misaligns."* A DPI-driven scaling discrepancy is the same failure mode from a different
cause, and it would be invisible to anyone testing Outlook at 96dpi only.

**2. When to use it.** In the head scaffold of every template, if verified. It is a document-level declaration
with no per-component cost.

**3. When NOT to use it.** **Not before reproduction.** Adding an unverified declaration to the head scaffold
of every template in both projects is a broad change on a medium-confidence claim, and our evidence bar
requires *"reproduction in a NAMED client, not suspected or inferred."* Never add it to a locked component
without one of the five qualifying reasons — and if it is real, reason 2 (client compatibility) applies
cleanly.

**4. Cerberus compatibility.** Cerberus's head scaffold is well documented in `Cerberus-Techniques.md` and
`CLAUDE.md` §8.8 already enumerates our required head additions, each tied to a named client bug. **If verified,
this belongs in exactly that list** — it is the same kind of item, from the same kind of cause, and its absence
there is the anomaly.

**5. Does it become part of our standards?** **VERIFY FIRST, then ADOPT.** **Route: reproduction task →
if confirmed, an ECP adding it to the §8.8 required head-scaffold list in both projects, cited to the client and
the observed defect.** Recorded in `Future-Research.md` §3.2. Medium priority: real, cheap, and currently
unmeasured.

---

## P-10 · Yahoo/AOL `height` attribute converted to `min-height`

| | |
|---|---|
| **Source** | Email Coding Guidelines |
| **Confidence** | **Medium** — documented, **not reproduced by us** |
| **Priority** | **HIGH — highest-risk finding in the catalogue** |

**1. Why it exists.** The Guidelines source keeps the HTML `height` attribute — against its own general
preference for styles over attributes — for a specific stated reason: **Yahoo and AOL convert an HTML `height`
attribute into `min-height`.**

If that is accurate, it has a direct consequence for a guarantee we rely on. Our §8.3 equal-height product card
reserves each region with a fixed-height cell — `height` as an attribute **and** `height` in the inline style —
on the assumption both act as ceilings, with the load-bearing rule that **content must never determine card
height.**

**In a client that reads the attribute as `min-height`, the attribute becomes a floor.** So:

- a long product title could push a reserved title region past its reserved height
- the card's total height changes
- **the two cards in a row stop matching**, which is exactly the defect §8.3 exists to prevent

The inline `height` should still constrain in a client that honours it — so the realistic exposure is narrow
(Yahoo and AOL specifically, and only where content overflows a reserved region). **But it is exposure on a
guarantee we currently state without qualification**, and §9.3 requires us to preview long product names
explicitly.

**This is the most valuable single finding of the research exercise**, because it is the only one that suggests
a rule we already ship may be weaker than documented.

**2. When to use it.** Not "use" — **test**. Build a two-card row where one card's title overflows its reserved
two-line region, and render it in Yahoo and AOL. Compare card heights against a Gmail and Outlook baseline.

**3. When NOT to use it.** Do not pre-emptively change the card architecture on a medium-confidence claim. The
current pattern is correct in every client we have reasoned about, and §8.3 is a settled, expensively derived
rule. **Do not "fix" it before the defect is reproduced** — that is precisely the churn the architecture lock
exists to prevent, and an unverified fix to a settled component is the worst category of change.

**4. Cerberus compatibility.** Cerberus's compatibility document is the natural home for the client fact, and
our §8.3 owns the card rule (Cerberus is silent on product cards). If reproduced, the fix would be a card-level
mitigation — a documented overflow behaviour, or a hard constraint on title length backed by an assertion —
not a change to a Cerberus mechanism.

**5. Does it become part of our standards?** **VERIFY FIRST — and this is the highest-priority verification
item produced by this research.** Three outcomes:

| Outcome | Action |
|---|---|
| Not reproduced | Record as not-applicable in `Future-Research.md`, keep §8.3 unchanged, and note the reasoning so the claim does not resurface |
| Reproduced, inline `height` still constrains | Add a documented caveat to §8.3 naming the clients and the narrow condition. No architecture change |
| Reproduced, cards genuinely mismatch | ECP under qualifying reason 1 (a verified rendering bug in a named client) with a card-level mitigation |

**Route: reproduction task in the §9.1 client matrix → outcome-dependent ECP.** Recorded in
`Future-Research.md` §3.1.

---

## P-11 · Source-order-preserving order swap

| | |
|---|---|
| **Source** | MJML — a direction attribute on columns |
| **Confidence** | High |

**1. Why it exists.** Alternating image/text feature rows need visual left/right variation on desktop while
keeping a **single consistent stack order on mobile and a single reading order for screen readers**. Writing the
row twice — once per direction — doubles the markup and doubles the defect surface. A direction reversal at the
wrapper level, with inner cells reset, achieves the visual swap while source order stays fixed.

**2. When to use it.** Alternating feature rows — `CLAUDE.md` §8.8 names Welcome Series, Post Purchase and
Brand Story.

**3. When NOT to use it.** Where the mobile stack order genuinely differs by row (then it is not an order swap,
it is two layouts), and **never without the mobile-stack safeguard**: §8.8 records that the mobile stacking rule
**must** carry an explicit left-to-right direction override *"or right-thumbnail rows stack backwards."* That
caveat is the whole risk of the pattern, and it is already documented.

**4. Cerberus compatibility.** Already the recommended mechanism — `CLAUDE.md` §8.8 cites Cerberus's two-column
reference component as the source.

**5. Does it become part of our standards?** **ALREADY OURS — settled.** §8.8 documents the mechanism, the use
cases, and the failure mode. MJML's independent arrival at the same technique confirms it per `README.md` §6.4.
No change. Recorded so that "should we handle alternating rows differently?" is a closed question.

---

## P-12 · Automated assertions replacing remembered rules

| | |
|---|---|
| **Source** | Maizzle (pipeline) · our own §8.7 (the five automated checks) |
| **Confidence** | High |
| **Priority** | **HIGH — bundle with P-08** |

**1. Why it exists.** P-08 is the *structure* (named, ordered, addressable). This family is the **selection
criterion**: which rules should become assertions, and why.

The criterion is mechanical: **a rule should become an assertion when it is (a) checkable from the built file
alone, (b) binary, and (c) has a recorded history of being missed.** Criterion (c) is what makes this a
data-driven exercise rather than a preference — this project's own history supplies the list:

| Defect | How it was missed | Assertable? |
|---|---|---|
| A template tag emitting HTML inside an `href` | Valid-looking source; broke only after expansion | ✔ — no `<` inside an attribute list |
| A plausible but undefined tag name | Rendered as an empty string; **survived seven revisions and 40 markdown files** | ✔ — no empty href |
| Comment prose containing literal element names and template tags | Produced false scan results **three times** | ✔ — assert on comment content |
| `height` and `padding` on the same reserved cell | Renders correctly in one engine, wrong in another | ✔ — assert the combination never occurs |
| An anchor wrapping a block element | Renders fine; **not clickable after Klaviyo import** | ✔ — assert no table inside an anchor |
| `display:block` on an image-wrapping anchor | Fine on desktop; **collapses to zero height on Apple Mail iOS** | ✔ — assert the combination |
| An image with no explicit width/height attributes | Fine everywhere except Apple Mail iOS, which drops it | ✔ — assert both attributes present |
| A structural full-width table without inline `width:100%` | Attribute-only width shrink-collapsed on mobile | ✔ — assert inline width present |

**Every one of those is currently a rule someone must remember, and every one has a recorded miss.** The three
comment-prose false positives are especially instructive: they were failures of the *checking process itself*,
which is the strongest possible argument for making the checks explicit rather than ad hoc.

**2. When to use it.** At generation time, on every built file, as part of §9 — not as a follow-up step. QA is
already specified as *"part of generation, not a follow-up step"*; this makes that specification executable.

**3. When NOT to use it.** **Never for anything requiring a render.** Dark mode, contrast against a real
background, client-specific collapse, clickability after Klaviyo's import rewrite, dynamic-data states in a
real preview — none are assertable from a file, and §9.1's rule zero governs: **a browser preview is never
proof**, and an assertion set is weaker than a browser preview. **The danger of this pattern is false
confidence**, so the assertion set must state its own scope limits, and unverifiable checks must continue to be
reported as required manual pre-activation steps rather than passes.

**4. Cerberus compatibility.** Neutral to strengthening — assertions check conformance to rules Cerberus
motivates; they never alter markup.

**5. Does it become part of our standards?** **ADOPT — same ECP as P-08.** They are one change: P-08 supplies
the structure, P-12 supplies the contents and the selection criterion. Splitting them would produce a named set
with no principled membership, or a list of checks with no addressability.

---

## P-13 · Language declared twice

| | |
|---|---|
| **Source** | Email Coding Guidelines |
| **Confidence** | High (the rule) · Medium (the client basis) |

**1. Why it exists.** The Guidelines source requires the document language to be declared **on the root element
and again on a wrapping element inside the body**, because some clients strip or relocate the document shell and
discard the root attribute. The inner declaration survives, so a screen reader still knows the language.

Without it, a screen reader in a shell-stripping client may fall back to the user's default language and
pronounce English copy with the wrong phonetics — which is an accessibility failure that is completely invisible
in any visual test, including a full client-matrix render.

**We currently declare it once.** `CLAUDE.md` §9.5 requires the `lang` attribute be set, and §8.8's
accessibility additions specify a language attribute on the outer wrapper alongside the article role — so we may
already be close, but "declared on the root **and** on a body-level wrapper, deliberately, for this reason" is
not what our documentation says.

**2. When to use it.** Every template. It is one attribute.

**3. When NOT to use it.** No reason not to. The only caution is scope discipline: it touches the outer wrapper,
which is part of the wrapper architecture — so on a locked component it needs qualifying reason 3 (an
accessibility issue), which it satisfies cleanly.

**4. Cerberus compatibility.** Compatible and additive. `CLAUDE.md` §8.8 already places a language attribute on
the outer wrapper as part of the Cerberus-derived accessibility set; this makes the *pair* explicit and states
the reason.

**5. Does it become part of our standards?** **ADOPT — the cheapest genuine improvement in the catalogue.**
**Route: fold into the next accessibility-touching ECP rather than raising one for a single attribute** — it is a
T1/T2 change, one line per template, no layout risk, and a real (if narrow) accessibility gain. Verify current
state before writing the rule, so the change is stated accurately.

---

## P-14 · The ~280px no-`<style>` floor as a stated budget

| | |
|---|---|
| **Source** | Email Coding Guidelines |
| **Confidence** | High |

**1. Why it exists.** The Guidelines source states a single load-bearing requirement: **an email must be legible
and functional at around 280px wide, with no `<style>` element available at all.**

Two things make that formulation better than ours. It is **narrower than our working 320px assumption**, and it
is stated as a **guaranteed floor rather than a typical device** — which is the correct way to express a
constraint, because a typical device changes and a floor does not.

Our equivalent is distributed and implicit: §8.4 requires structure to survive `<head>` CSS being stripped,
§8.8 states it as an architectural principle, and our geometry work assumes 320px. **The requirement exists; the
number is not written down as a budget anyone is tested against.**

And it is directly relevant to the most expensive problem in this project's history. The Hero feasibility test
`W* = (inset + copy_width) ÷ k` **needs a floor to be tested against** — the standard's own rule is that if
`W* > 320px` the architecture is wrong rather than the code. **That threshold is exactly a stated floor**, which
means we already depend on one; we have simply never written it as a project-wide budget rather than a
hero-specific one.

**2. When to use it.** As two things: an explicit QA assertion under P-08 ("renders legibly at the floor width
with no `<style>`"), and the declared input to any geometry feasibility calculation.

**3. When NOT to use it.** Do not adopt 280px as a *design* target — designing for 280px would compromise the
overwhelming majority of recipients on wider viewports. It is a **degradation floor**: at the floor, the email
must remain legible and functional, not optimal.

Also, **do not lower our hero threshold to 280px without redoing the geometry.** The Hero standard's `W* ≤ 320`
gate for its background-image variant is a specific, derived number. Changing the floor changes what passes that
gate, which is a substantive engineering change and not a documentation tidy-up.

**4. Cerberus compatibility.** Directly aligned — `CLAUDE.md` §8.8's Cerberus principle is *"every layout must
be correct from table markup, HTML attributes and inline styles alone, before a single `<head>` rule applies."*
This adds the missing number to that sentence.

**5. Does it become part of our standards?** **ADOPT as a stated budget and a QA assertion.** **Route: fold into
the P-08 / P-12 ECP as an assertion, plus a one-line statement of the floor in `CLAUDE.md` §8.4.** The open
question — whether our floor is 280px or 320px — is a decision for the Owner, and it must be taken with the
hero geometry consequence in view. Recorded in `Future-Research.md` §4.

---

## P-15 · Typographic refinement as a named check

| | |
|---|---|
| **Source** | Maizzle — widow prevention as a pipeline stage |
| **Confidence** | High (the stage exists) · Low (its value to us — inference) |

**1. Why it exists.** Maizzle treats **widow prevention** — stopping a single trailing word wrapping alone onto
a final line — as a named, automatic pipeline stage. It is a small typographic refinement, applied consistently
because it is automated rather than remembered.

We have no coverage of this. `CLAUDE.md` §5.3 governs copy quality (concise, scannable, short paragraphs,
no em dashes, one-line product descriptions) but says nothing about wrapping behaviour.

**Where it would actually matter for us** *(inference)*: a headline or CTA label wrapping to leave one orphaned
word is most visible in a **reserved fixed-height region** — precisely our product-card title and description
areas, which §8.3 reserves at two lines each. A widow there does not just look untidy; it can push a two-line
region to three lines' worth of content in a space reserved for two.

**2. When to use it.** Only if adopted, and then in headlines, CTA labels and card titles — short, high-visibility
strings where a widow is conspicuous. Never in body paragraphs, where the mechanism would fight normal reflow.

**3. When NOT to use it.** **Three real cautions, which together are why this is STUDY and not ADOPT:**

- The usual mechanism is a non-breaking space, and a stray non-breaking space is exactly the kind of node §9.2's
  ghost-element inspection looks for. Introducing them deliberately makes that scan noisier.
- Our copy is often **dynamic**. A widow fix applied to a static string is safe; applied to a bound product name
  it is meaningless, because the string is unknown at authoring time.
- It is **cosmetic**. On a locked component none of the five qualifying reasons applies, so it could not be
  shipped there at all — which limits the achievable benefit to unlocked components.

**4. Cerberus compatibility.** Neutral. Cerberus takes no position on typographic refinement.

**5. Does it become part of our standards?** **STUDY. Do not act.** The benefit is genuine but small, the
mechanism interacts awkwardly with an existing QA scan, and dynamic copy limits its reach. Recorded so it is
available if a real widow defect is ever observed in a reserved region — at which point it stops being cosmetic
and becomes reason 1, a verified rendering issue. Recorded in `Future-Research.md` §5.

---

## 16. Recommended sequencing

If any of this is acted on, this order minimises risk and maximises value per change:

| Order | Action | Type | Why first |
|---|---|---|---|
| **1** | **P-10** — reproduce the Yahoo/AOL `height` behaviour | Verification | It may weaken a rule we already ship. Knowing costs one test; not knowing is an unquantified exposure |
| **2** | **P-08 + P-12 + P-14 + P-01** — the named assertion-set ECP | ECP (T2–T3) | One change, no markup touched, and it makes every later change cheaper to verify |
| **3** | **P-07** — the reference-consumption protocol | ECP (T2) | Addresses a failure mode that has already cost four draft cycles |
| **4** | **P-09** — reproduce 120dpi, then decide | Verification → ECP | Real gap, cheap fix, but a broad change on a medium-confidence claim |
| **5** | **P-13** — language declared twice | Fold into an accessibility ECP | Cheapest real win; not worth its own ECP |
| **6** | **P-04** — co-located responsive intent in `Design.md` | Documentation (T1–T2) | Do at the next `Design.md` revision, not on its own |
| **7** | **P-03** — odd-count grid case into the component | Component (T2) | Only at the Product Grid's next revision. Not worth touching a working component for |
| — | **P-02 · P-11** | No action | Already ours. **Settled** — stop re-litigating |
| — | **P-06** | No action | A review question, not a rule |
| — | **P-05 · P-15** | No action | Rejected / study only. Recorded so they do not return |

**Nothing in this table is authorised.** Each numbered row is a *proposal* requiring the route stated in its
family. See `Engineering-Change-Management.md`.

---

*Research notes, non-normative. Compiled 2026-07-29. No pattern here is binding until an ECP promotes it into a
standard. Cerberus remains the only production rendering framework.*
