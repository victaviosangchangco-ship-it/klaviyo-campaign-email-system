# Foundation for Emails (ZURB) / Inky — research notes

| | |
|---|---|
| **Status** | RESEARCH — **NON-NORMATIVE** |
| **Version** | 1.0.0 |
| **Source** | `get.foundation/emails.html` · `github.com/foundation/inky` |
| **Maintainer** | ZURB / Foundation |
| **Fetched** | 2026-07-29 |
| **Confidence** | **High** on purpose, grid model and maintenance status. **Medium** on Inky's expansion mechanics. |
| **Kind** | A **templating language** (Inky) plus a CSS framework and a build stack. |

> ⛔ **Nothing in this document governs a build.** Cerberus remains the only production rendering framework.
> No Inky tag, grid class, generated table or CSS rule may be copied into a template. See `README.md` §1.
>
> **Already decided:** ADR-002 §Alternatives rejected migrating to Foundation for Emails.

---

## 1. Identity and problem solved

Foundation for Emails brings the **web-design grid mental model** to email. Its templating language, **Inky**,
lets the author write short custom tags — a container, a row, a column, a button, a callout, a spacer — which
a preprocessor **expands into the table markup email requires**.

The problem it solves is **cognitive translation cost**: a designer who thinks in a 12-column grid should not
have to think in nested tables. It is the most explicitly *designer-facing* of the five sources.

---

## 2. Provenance and maintenance status — **read this before anything else**

**Foundation for Emails is transitioning to Inky v2.0. The existing project receives maintenance updates
only; new feature development moves to Inky v2 with a new "Inky Styles" companion.**

That is a decisive finding and it should be the first thing anyone considering this framework learns.

- Building on the current version means building on something explicitly in maintenance mode.
- Building on Inky v2 means building on something whose feature set and migration path are still settling.
- **Neither is a foundation for a system whose templates must render correctly and unchanged for months
  without edits** — which is exactly what `CLAUDE.md` §4.3 requires of a flow email.

This is the clearest **lifecycle** argument in the whole research exercise, and it generalises: **adopting a
framework means inheriting its maintenance risk, and a flow email outlives most frameworks' release cycles.**
Catalogued as a governance lesson rather than a technique — see `Framework-Comparison.md` §6.

---

## 3. Core architecture

A **preprocessor**, not a compiler with a component tree (compare MJML, goal 3). Inky performs tag expansion:
each custom tag maps to a known table structure and is substituted for it. The CSS framework and Sass build
supply the styling layer; a full Node build stack (templating, Sass compilation, inlining, image handling)
surrounds it.

**Architecturally this is the same trade as MJML** — the author writes intent, a tool writes markup, and the
author no longer owns the debugging surface. The difference is one of degree: Inky's expansion is more
mechanically predictable than a component tree, so the mapping from source to output is easier to hold in
your head. That is a genuine advantage of the simpler design.

---

## 4. Layout model — the 12-column grid

The central abstraction, and the most interesting thing in this source.

- A **container** bounds the email; **rows** hold **columns**; columns carry a **span out of twelve**.
- Columns declare **separate small and large spans**, so one element states both its mobile and its desktop
  proportion **in the markup, on the element** — not in a media query somewhere else.
- A **block-grid** places *n* equal items per row without individual column declarations — the natural
  expression of a product grid.
- The framework computes the arithmetic: gutters, first/last column padding, and the residue that makes the
  spans total correctly.

**Assessment — two findings, one adopt and one reject.**

**4.1 Co-located responsive intent is a genuinely good idea (adopt as a documentation practice).** Reading a
column's mobile and desktop proportions off the element itself is better than reading its desktop width off
the element and its mobile width off a media query 200 lines away. We cannot adopt the syntax, but we can
adopt the **discipline**: our `Design.md` measurement tables should state a component's desktop *and* mobile
proportion together, as one fact, rather than in separate sections. Catalogued as **P-04**.

**4.2 Twelve columns is the wrong unit for us (reject).** Our layouts are 1- and 2-column with a documented
odd-count case, at exact pixel measurements tied to approved artwork exports. A twelfth of 580px is
48.33px — an inherently fractional unit. `CLAUDE.md` §8.8 already records that sub-pixel rounding in
inline-block columns needs a negative-margin absorber; a fractional grid unit manufactures more of exactly
that problem. **A grid is a convenience for arbitrary layouts; we do not have arbitrary layouts.**

**4.3 The block-grid concept maps directly onto a real weakness of ours.** Our §8.3 odd-product-count rule —
give the final card's cell a `colspan` equal to the column count, then centre a byte-identical card at a
fixed pixel width equal to one grid column — is a *manual* solution to what a block-grid abstraction handles
generically. Our rule is correct and hard-won (it exists because a lone card without the `colspan` centres
within a half-width cell and reads as left-aligned), but it is a rule an author must remember. The finding is
not "adopt block-grid"; it is **"our odd-count case is a known trap and belongs in a component, not in a
rule an author must recall"** — catalogued as **P-03**.

---

## 5. Responsive strategy

**Attribute-and-class-driven, resolved at preprocess time**, with the framework's own media queries doing the
mobile work. Small/large spans are the author-facing mechanism.

**The same fatal objection as MJML applies (see `MJML.md` goal 14.1).** If stacking depends on the
framework's media queries, it does not happen where `<style>` is stripped — Gmail on non-Google accounts.
Two of our five sources are media-query dependent for structure, and both the Email Guidelines source and
our own §8.4 say that is the wrong dependency.

**Our hybrid stacking survives without `<style>`. Theirs does not. That difference is the whole argument.**

---

## 6. Outlook / MSO strategy

Handled inside the expanded output — the author does not write conditional comments. Standard email-framework
practice: generated ghost structures where the Word engine needs fixed widths.

No published Outlook defect index comparable to Cerberus's compatibility document, and no per-rule client
citation comparable to the Email Guidelines source. **Compatibility is asserted through the framework's
maturity rather than evidenced per rule** — which, given goal 2's maintenance status, is a weaker assertion
than it once was.

---

## 7. Dark mode strategy

**None documented.** Consistent with the framework's vintage — it predates dark mode becoming a mainstream
email concern, and it is now in maintenance mode, so it is unlikely to acquire one.

Third of three sources with no dark-mode coverage. Our §9.6 remains ahead of all of them.

---

## 8. Accessibility strategy

Minimal. Generated layout tables receive presentation roles; there is no accessibility chapter, no contrast
guidance, no tap-target guidance, and no reading-order review practice.

The **generated-accessibility risk** noted in `MJML.md` goal 8 applies identically and slightly more sharply:
because Inky's value proposition is that the author does not think about tables, the author is also not
thinking about what the tables announce to a screen reader.

---

## 9. Component and reuse model

Components exist as **tags** (button, callout, spacer, menu, thumbnail-style patterns) plus starter templates
and a Sass settings layer. Reuse is by using the tag; customisation is by the Sass variables and by
overriding the framework CSS.

**Weaker than MJML's model** (no global per-component default declaration, no named attribute bundles) and
**weaker than ours** in one specific respect: there is no equivalent of our §7 propagation discipline, and no
concept comparable to `ARCHITECTURE LOCKED`. A framework component can be restyled at will; there is nothing
that says *this component's engineering is settled and may only change for one of five reasons*.

**That absence is worth naming as a strength of ours.** Across all five sources, **no external framework has
any concept of a locked component.** Our §12 lock is not standard practice; it is something our system does
that the industry does not, and it exists because iterating on a finished component is churn and churn
re-breaks solved problems.

---

## 10. Theming and token model

**Sass variables** — the strongest *token* story of the five sources in one narrow sense: a real variable
layer with a single declaration point, exactly what a token system should be.

**But it is a build-time token layer**, which makes it unavailable to us on principle: the tokens exist in
source files that are compiled away, so the shipped artefact contains resolved values with no record of
which token produced them. Our `Design.md` holds the same information in a file that is *read by a human and
by Claude at authoring time* and is never compiled — so the token and the artefact coexist permanently.

**The concept we extract:** a token needs a **single declaration point** and the artefact needs to be
traceable back to it. Sass achieves the first and loses the second. `Design.md` achieves both. Catalogued as
**P-02**.

---

## 11. Tooling and dependency profile

The **heaviest** of the five. Node, a templating preprocessor, Sass compilation, CSS inlining, image
pipeline, local server. A full front-end build stack.

Every objection in `MJML.md` goal 11 applies, amplified:

- The shipped artefact is not the approved artefact.
- Multiple tool versions become hidden inputs to every template.
- **And now the stack itself is in maintenance mode** (goal 2), so those hidden inputs are pinned to
  something that will not move forward with the client landscape.

---

## 12. Client-support claims and substantiation

Responsive-across-clients positioning, substantiated by maturity and adoption. No defect index. No per-rule
client citation. Given maintenance-only status, **compatibility claims reflect the client landscape at the
time development slowed, not today's.**

This is a general lesson about frameworks as compatibility authorities: **a framework's compatibility is a
snapshot of when it was last actively maintained.** Cerberus is vendored and read as a *reference*, and our
own rules carry the client that motivated each one — neither goes stale silently.

---

## 13. Where it AGREES with our standards

| Our rule | Foundation / Inky | Status |
|---|---|---|
| §8.1 tables + inline styles as the output form | Expands to exactly this | **SETTLED** |
| §8.4 600px-class fixed container as the design canvas | Bounded container as the base unit | **SETTLED** |
| §8.3 2-column default for product grids | Block-grid, equal items per row | **SETTLED** |
| §7 components as the unit of reuse | Tag-based components | **SETTLED** |
| §8.8 spacing as a dedicated sized element | Dedicated spacer component | **SETTLED** |
| §8.8 a visible divider is a painted element, not `<hr>` | Divider as a component, not a rule element | **SETTLED** |
| §8.1 minimal nesting is a goal | Expansion is deliberately shallow | **SETTLED** |
| Tokens need a single declaration point | Sass variable layer | **SETTLED** (concept, not mechanism) |

---

## 14. Where it DISAGREES with our standards

### 14.1 Media-query-dependent stacking — **we hold our position**

Identical to `MJML.md` §14.1 and equally decisive. Hybrid stacking works without `<style>`; a framework grid
does not. Gmail non-Google accounts get no `<style>`.

### 14.2 A fractional 12-column unit vs exact pixel measurements — **we hold our position**

Goal 4.2. A twelfth of our inner width is fractional; our measurements are exact and tied to approved
artwork. Our §8.8 negative-margin absorber exists because sub-pixel rounding is already a real problem in
inline-block columns — a fractional grid unit manufactures more of it.

### 14.3 Build-time tokens vs read-time tokens — **we hold our position**

Goal 10. A compiled-away token layer breaks traceability from artefact to declaration, and traceability is
what makes our §12 regression evidence possible.

### 14.4 No component lock concept — **we hold our position**

Goal 9. Nothing in the framework says a component's engineering is settled. Our `ARCHITECTURE LOCKED` state
exists because that absence has a cost.

---

## 15. What it can do that we cannot

1. **Co-locate mobile and desktop proportion on the element** — the best idea in this source (P-04).
2. **Express an n-per-row grid generically**, without a per-count rule (P-03) — which is what our
   odd-count `colspan` case is a manual substitute for.
3. **A real variable layer** with a single declaration point and compiler-enforced substitution.
4. **Compute grid arithmetic automatically** — gutters, edge padding, residue.
5. **A designer-facing vocabulary** that a non-email designer can read without learning table markup. Our
   `Design.md` measurement tables are the closest analogue and are less immediately legible.

---

## 16. What we can do that it cannot

1. **Stack without `<style>`** (goal 14.1).
2. **Guarantee equal card height structurally** — our §8.3 reserved-height cells with the explicit rule that
   `height` and `padding` must never share a cell. A generic grid has no concept of a reserved region, and
   `min-height` on a paragraph is ignored by Outlook.
3. **Hero geometry** — no equivalent whatsoever.
4. **Lock a component's architecture** (goal 9) — a capability no external source has.
5. **Byte-identity regression evidence** — impossible with a build step.
6. **Dark mode** (goal 7).
7. **Accessibility beyond presentation roles** (goal 8).
8. **Dynamic-data engineering** and the §8.7 attribute rule.
9. **Ship with zero maintenance risk from a third party** (goal 2) — the decisive one.

---

## 17. Adoption risk

**Very high — the highest of the five**, and for a reason unrelated to technique.

| Risk | Consequence |
|---|---|
| **Maintenance-only status** | Adopting a framework in maintenance mode, for templates that must stay correct for months |
| **Migration to Inky v2 pending** | Adopt now and inherit a migration; adopt v2 and inherit an unsettled feature set |
| **Media-query-dependent stacking** | Silent breakage on Gmail non-Google accounts |
| **Heaviest build stack of the five** | Most hidden inputs, most version pinning, largest bus factor |
| **Compiled-away tokens** | Regression evidence and artefact traceability both lost |
| **Fractional grid unit** | Sub-pixel drift against exact approved measurements |
| **Stale compatibility snapshot** | Client claims frozen at last active development |

---

## 18. Verdict

> **STUDY — REJECT FOR PRODUCTION. Two concepts extracted (co-located responsive intent; generic n-per-row
> grids). Everything else rejected, and the maintenance status alone would be sufficient grounds.**
>
> Consistent with **ADR-002**, which already rejected migration.

**Extracted into the pattern catalogue:**

| Pattern | What is extracted | Verdict there |
|---|---|---|
| **P-03** | Generic n-per-row grid — the concept our odd-count `colspan` rule substitutes for | Adopt as a component-design goal |
| **P-04** | Mobile and desktop proportion co-located as one stated fact | **Adopt as a documentation practice** |
| **P-02** | A token needs a single declaration point *and* artefact traceability | Adopt as a principle |

**Rejected:** Inky and the build stack, the 12-column unit, media-query-dependent stacking, Sass build-time
tokens as our token layer.

**The governance lesson is the real deliverable here, and it outranks every technique in this document:**
**a framework's maintenance lifecycle is shorter than a flow email's production life.** A flow sends
unattended for months and must stay accurate without edits (§4.3). Anything it depends on must be at least as
long-lived as that requirement. Vendored, unmodified reference documents and hand-authored HTML meet that
bar; a maintenance-mode build stack does not.

---

*Research notes, non-normative. Compiled 2026-07-29. Maintenance status is the load-bearing finding —
re-verify before any future proposal.*
