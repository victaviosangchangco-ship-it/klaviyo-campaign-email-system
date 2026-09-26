# Visual Hierarchy Guide

> **Part of `Shared/Email-Design-System/` (STD-DESIGN).** Start at that folder's `README.md`.
> **Design principles only. No HTML. No CSS. No Cerberus code. No brand values. No measurements.**
>
> Everything here is expressed as a **relationship** — an order, a ratio, a proportion. That is deliberate:
> a relationship is a design principle and belongs in this library, whereas a pixel value is a brand
> measurement and belongs in the brand's design document.

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
| **Scope** | **Hierarchy principles only.** No implementation, no measurements, no engineering rules. |

---

## 1. Reading order

### 1.1 An email is read as a chain

Each element hands the eye to the next. A chain has **one entry and one exit**. When an element sits
outside the chain — a self-contained image above unrelated copy, a section that answers nothing asked
before it — the reader completes that element, stops, and must re-enter the content from a cold start.
**Every re-entry is a drop-off point.**

### 1.2 The default chain

```
   HOOK          attention, little information
   OFFER         the shortest, highest-information element
   HEADLINE      the framing that elaborates the offer
   PROOF         the objection removed
   ACTION        one thing to do
   REASSURANCE   the last risk removed, at the point of action
```

**Why the offer precedes the headline.** The hook buys attention but delivers no information. The offer is
the shortest, densest element available — a reader absorbs a figure or a single fact in under a second.
Placing it immediately after the hook converts attention into a reason to keep reading *before* asking the
reader to parse display type. The headline then elaborates something the reader already holds, instead of
competing with it for the same instant.

Reversing them makes the display type the first thing to process, so the reader must decide whether to
continue on the strength of a phrase rather than a value.

**For Heroes specifically this order is normative, not advisory** — it is owned by
`Shared/Email-Hero-Engineering-Standard.md` §15.1 and is not restated here. This section describes the same
principle as it applies to the email as a whole.

### 1.3 Reading order is created by sequence, not by position

In email, order is expressed by what comes first in the document. That has two consequences worth stating:
the visual order and the order a screen reader announces are **the same thing**, and the order is
unaffected by how wide the screen is. Both are advantages — they make reading order the most robust
hierarchy tool available.

---

## 2. Eye movement

### 2.1 What the eye does on a first pass

1. **Largest first.** Scale dominates every other signal.
2. **Highest contrast next.** A small element with extreme contrast can outrank a large low-contrast one.
3. **Isolated elements next.** Space attracts attention; a crowded element of the same size loses.
4. **Faces, then products, then abstract imagery.**
5. **Then, and only then, reading begins** — from the top of the content column.

**Design to that order, not against it.** If the third-most-important element is the largest, no amount of
copy will correct the impression.

### 2.2 Scanning versus reading

Most readers scan before they read, and many never read. A scan collects: the biggest words, the images,
anything on a distinct surface, and the button. **An email must therefore be comprehensible from those four
things alone.** If the proposition only exists inside a paragraph, most of the audience never receives it.

The practical test: cover every paragraph. What remains should still say what the email is for.

### 2.3 The single-column consequence

Email is effectively one column, so eye movement is overwhelmingly vertical. This removes the horizontal
scanning patterns that govern web layout and replaces them with a simpler rule: **vertical position is
hierarchy.** The higher an element sits, the more weight it carries — regardless of intent.

### 2.4 Direction of attention

An element can point. A downward-descending price ladder, a product resting on a band, a marker sitting
above the label it introduces — each hands attention onward. Elements that point nowhere are read as
terminal, which is correct for a closing element and wrong for an opening one.

---

## 3. Focal points

### 3.1 One per screen

**A screen with two focal points has none.** The reader's eye alternates, resolves neither, and the
hierarchy the design intended does not exist for them.

This is the most common single cause of an email that "feels wrong" while every section is individually
correct — and it reproduces identically at every width and in every client, which is the signature of a
composition problem rather than an implementation one. The diagnostic is owned by STD-HERO §15.2.

### 3.2 How a focal point is created

In descending order of strength:

| Mechanism | Notes |
|---|---|
| **Scale** | The strongest and most reliable. Something is important because it is bigger. |
| **Isolation** | Space around an element is nearly as strong as size, and cheaper. |
| **Contrast against surface** | A distinct surface promotes everything on it. |
| **Colour** | Weak unless used once. An accent used three times is no longer an accent. |
| **Weight** | Weakest alone; effective in combination with scale. |

### 3.3 Suppression is half the work

A focal point is created as much by demoting its neighbours as by promoting itself. If everything is bold,
nothing is. **Deliberate quietness is a design act**, and a design with no quiet elements has no loud ones.

### 3.4 The focal point must be the message

Stated plainly because it is violated so often: the loudest element should be **what the email is for**. A
beautiful photograph at the proportion of the message, carrying no message-relevant information, is a
misallocation regardless of its quality. The rule that emphasis follows communication value — and that
artwork carrying no message information stays proportionally subordinate — is owned by STD-HERO §15.5.

---

## 4. Spacing rhythm

### 4.1 Space groups, and grouping explains

Elements close together are read as related; elements far apart are read as separate. This is the
cheapest and most powerful explanatory tool available, and it works before a single word is read.

**The rule that follows: space between movements must exceed space within them.** When inner and outer
spacing are similar, grouping collapses and the email reads as an undifferentiated list — which is exactly
what a report looks like.

A workable relationship: **outer space roughly two to three times inner space.**

### 4.2 Rhythm means variation, not evenness

Even spacing throughout produces a page with no emphasis. Rhythm comes from **variation** — generous where
the reader should pause, tight where elements belong together. The most important movement should have the
most space around it.

### 4.3 Space is the premium signal

Across every design language, the single most reliable marker of a premium impression is **space that has
been spent deliberately**. Density signals value in a catalogue and cheapness in a brand email. Where a
budget of vertical space must be allocated, spend it on the focal point and recover it from the sections
that merely support.

### 4.4 Tight is not the opposite of generous

Two elements that belong together — a price and its label, a code and its button, a guarantee and its CTA —
should be **tight to each other**, and that tightness is as deliberate as generosity elsewhere. A guarantee
placed far from the action it de-risks stops working.

### 4.5 Space before and after the action

The primary action wants more space than anything else in the email. Space around a button does two things:
it makes the button unmistakable, and it prevents mis-taps on a phone. Both matter.

---

## 5. Typography hierarchy

### 5.1 Rank must be unambiguous

A reader should be able to rank every text element at a glance, without comparing. Ambiguous rank —
two elements close in size and weight — forces a comparison, and a comparison is a pause.

### 5.2 Contrast in the scale, not in the middle of it

A workable scale has **clearly separated steps**: a display size, a subhead, a body size, and a small
tracked label. Sizes that sit between steps read as mistakes. Fewer, more distinct steps always beat more,
closer ones.

**A useful minimum: the display-to-body ratio should be at least 2:1, and 2.5:1 or wider reads as
premium.** Below about 1.5:1 the hierarchy has effectively collapsed, and the design will feel flat however
carefully it is spaced.

### 5.3 Tracking is a signal, and it inverts

- **Small text: open the tracking.** Wide letter-spacing on a small uppercase label reads as considered and
  makes it legible at size.
- **Display text: tighten it.** Slightly negative tracking on large type reads as confident and modern.

Using the same tracking across the scale wastes one of the cheapest available signals.

### 5.4 Weight is a coarse instrument

Two weights are usually enough. Three is a lot. Weight distinguishes poorly on its own — a bold body line
beside a regular one is a weak signal compared with a size change — so it is best used **with** scale
rather than instead of it.

### 5.5 Hierarchy must not depend on the breakpoint

If type sizes change between a phone and a desktop, the *ratios* must be preserved, or the hierarchy the
design depends on exists at one width and not the other. The safest position is a scale that does not
change at all: then hierarchy is identical at every width by construction. The engineering rule and its
rationale are owned by STD-HERO §8.2.

### 5.6 Line length and line height

A comfortable measure is roughly **50 to 75 characters**. Below that, reading becomes choppy; well above
it, the eye loses the line. Line height should be looser for body copy than for display type — large type
needs proportionally less leading, and applying body leading to display type makes it look loose and
unresolved.

---

## 6. CTA hierarchy

### 6.1 One primary action

**One primary action per email.** Two primaries is not twice the conversion; it is a decision the reader
did not ask to make, and deferring is the cheapest way to resolve it.

### 6.2 Repetition is not competition

The same action, with the same label and the same destination, repeated at natural decision points, is
**one action rendered several times**. A *different* destination is a second primary. This distinction is
what makes a long email workable: the reader who is convinced early and the reader who needs everything
both get a button where they finish.

### 6.3 Secondary actions must be visibly subordinate

A legitimate secondary — a category route, a preference link, a footer path — must be unmistakably quieter:
lighter treatment, smaller, or outlined rather than filled. If a reader has to work out which is primary,
there is no primary.

### 6.4 Place the action where the decision happens

A CTA belongs immediately after whatever creates the willingness to act — under the offer, under the price,
under the guarantee. A CTA separated from its argument by an unrelated section loses the argument's
momentum.

### 6.5 Label the destination, not the gesture

"See the new price" outperforms "Click here" and "Learn more" because it tells the reader what happens
next. Destination-descriptive labels also serve readers using assistive technology, for whom a list of
"Learn more" links carries no information at all.

### 6.6 The action must be reachable

The primary action should be reachable without effort. Where a design commits enough vertical space to
imagery that the first action falls below the first screen, that is a **trade to be chosen and stated** —
and the correct remedies are editorial (shorter copy, tighter spacing) or a repeated action, never cropping
artwork or deleting content. The requirement to compute and publish that offset is owned by STD-HERO §3.8.

---

## 7. Information hierarchy

### 7.1 Rank information by what the reader needs to decide

Not by what the business wants to say. The order that works:

```
   1  What is this about?                     identity
   2  Why does it matter to me?               value
   3  What exactly is it?                     detail
   4  Why should I believe you?               proof
   5  What do I do?                           action
   6  What if it goes wrong?                  risk
```

Most weak emails invert 2 and 3, presenting detail before value — which asks the reader to evaluate
something before they have been given a reason to care.

### 7.2 One idea per movement

A movement that carries two ideas communicates neither reliably. Split it, or drop the weaker one. **The
weaker idea is almost always the one to drop**, because adding a movement costs the whole email a little
weight.

### 7.3 Progressive disclosure

Give the minimum that supports a decision, and let the site carry the rest. An email is not a catalogue,
a specification sheet or a FAQ page. The most common failure is completeness: everything true about the
product, none of it ranked.

### 7.4 Every claim must be true and durable

Two constraints, and the second is easy to miss. A claim must be **accurate**, and in an automated
programme it must also **stay** accurate for as long as the email keeps sending — which rules out stock
counts, finite quantities, dated references and prices in copy. The governing rules live in each project's
`CLAUDE.md`. The design consequence is what belongs here: **a design that structurally depends on a
non-durable claim is the wrong design**, and it should be changed at concept stage rather than patched
later.

### 7.5 Say less, and mean it

Cutting a section makes every remaining section more prominent. That is the cheapest hierarchy improvement
available and the one most often skipped, because subtraction feels like loss and reads as confidence.

---

## 8. Conversion psychology

### 8.1 Attention is spent, not given

A reader arrives with a small, finite budget of attention. Every element spends some of it. Elements that
spend without returning value — a decorative section, a second competing action, a paragraph restating the
headline — reduce what remains for the ask.

### 8.2 Recognition beats persuasion

The strongest conversion signal in lifecycle email is not an argument; it is **recognition**. An email
showing the reader something they already chose needs far less persuasion than one introducing something
new. Where recognition is available — a cart, a viewed item, a watched price — it belongs on the first
screen, because it is the most persuasive content the email has.

### 8.3 Specificity is credibility

Concrete beats superlative in every case. "Up to ten years" is credible; "long-lasting" is noise. Numbers,
named standards and stated terms build trust; adjectives spend it. **An unverifiable claim damages
credibility more than an absent one**, because a reader who doubts one claim discounts all of them.

### 8.4 Remove risk at the point of action

Reassurance works where the decision happens and nowhere else. A guarantee beside the button converts; the
identical guarantee three sections earlier answers a question the reader had not yet reached.

### 8.5 Friction is mostly mechanical

Most lost conversions are not persuasion failures. They are a code that cannot be copied, a tap target too
small for a thumb, a message that requires an image the client blocked, or an action the reader had to hunt
for. **Designing for the mechanics is a conversion activity, not a technical afterthought.**

### 8.6 Honest urgency, or none

Real urgency works. Manufactured urgency works once, then costs trust permanently — and in an automated
programme it is also a correctness failure, because the deadline is not real for most recipients.
**Where there is no genuine reason to hurry, the honest alternative is not a weaker deadline; it is a
clearer benefit.**

### 8.7 The email is one moment in a relationship

A single send is one touch in a sequence with the same reader. This has a design consequence: an email that
converts well but leaves the reader feeling pressured has borrowed from the next one. Across a lifecycle
programme the objective is cumulative, so the right question is never only "does this convert?" but "does
this convert *and* leave the relationship intact?"

---

## 9. The hierarchy review

Ten questions. Run them against a design before implementation, and again before promotion.

```
☐  Can the purpose of the first screen be stated in one sentence?
☐  Is the loudest element the message?
☐  Is there exactly one focal point per screen?
☐  Does the email still communicate with every paragraph covered?
☐  Is space between movements clearly greater than space within them?
☐  Can every text element be ranked at a glance, without comparison?
☐  Is the display-to-body ratio at least 2:1?
☐  Is there exactly one primary action, with any secondary visibly subordinate?
☐  Is reassurance adjacent to the action rather than distant from it?
☐  Would any section's removal cost the argument nothing?
```

**A failure here is a composition failure and is fixed in the design, not in the markup.** Composition
failures look the same at every width and in every client; that is how they are told apart from rendering
failures.

---

## 10. Change log

| Date | Version | Change | Both copies |
|---|---|---|---|
| 2026-07-29 | 1.0.0 | Guide established covering reading order, eye movement, focal points, spacing rhythm, typography hierarchy, CTA hierarchy, information hierarchy and conversion psychology, plus the ten-question hierarchy review. Principles and relationships only; references STD-HERO where a principle is normatively owned there. | ✔ |

---

*Principles only. Every measurement belongs to the owning brand's design document, and every build rule to
the standards registered in `Shared/Engineering/README.md` §3.*
