# MJML — research notes

| | |
|---|---|
| **Status** | RESEARCH — **NON-NORMATIVE** |
| **Version** | 1.0.0 |
| **Source** | `mjml.io` · `documentation.mjml.io` · `github.com/mjmlio/mjml` |
| **Maintainer** | Mailjet (Sinch) |
| **Fetched** | 2026-07-29 |
| **Confidence** | **High** on purpose, component inventory and documented behaviour. **Medium** on compiled-output mechanics (from documentation, not source inspection). **Low** where marked *inference*. |
| **Kind** | A markup language plus a **compiler**. Node.js dependency. |

> ⛔ **Nothing in this document governs a build.** Cerberus remains the only production rendering framework.
> No MJML output, component markup, class name or generated table structure may be copied into a template.
> See `README.md` §1.
>
> **Already decided:** ADR-002 §Alternatives rejected migrating to MJML, and specifically found that
> MJML's own hero component would reintroduce a crop our Hero standard prohibits. This document explains
> that finding rather than reopening it.

---

## 1. Identity and problem solved

MJML is a semantic markup language for email that **compiles** to responsive HTML. The author writes
high-level tags — a section, a column, a button, a hero — and the compiler emits the table structure,
conditional comments and media queries.

The problem it solves is **the cost of hand-writing email HTML repeatedly**. Its bet is that the reliable
patterns are known, so they should be generated rather than retyped.

**That is a defensible bet, and it is the opposite of ours.** We bet that the patterns are known *and worth
reading*, because the failures we hit are in the interaction between a pattern and a specific asset,
viewport or import step — and those failures are diagnosed by reading markup. See goal 17.

---

## 2. Provenance and maintenance status

Backed by Mailjet, now part of Sinch. Actively maintained, widely adopted, and the most institutionally
supported of the five sources. Long-running community ecosystem of third-party components. MIT-licensed.

**Maintenance is not a concern here** — unlike Foundation for Emails (see that file, goal 2). If a framework
adoption were ever justified on maintenance grounds alone, MJML would be the candidate.

---

## 3. Core architecture

A compiler with a **component tree**. Head components configure the document (attributes, breakpoint, fonts,
styles, preview text, title); body components produce structure and content. Compilation is the whole
mechanism: the author's document is not the shipped document.

**Head component set** — document attributes, global default attributes per tag, a breakpoint declaration,
web-font registration, raw passthrough, inline and non-inline style blocks, preview text, title.

**Body component set** — wrapper, section, group, column, plus content components: text, image, button,
divider, spacer, table, raw, social, navbar, accordion, carousel, hero.

**The architectural consequence that matters to us:** because the author writes intent and the compiler
writes markup, **the author cannot inspect the failure**. When a compiled email breaks in a client, the
debugging surface is generated output the author did not write and does not control. Our entire §12
continuous-improvement loop — defect → root cause → structural fix → propagate to component → promote to a
rule — depends on the author owning the markup.

---

## 4. Layout model

Section → column, with **automatic width distribution**: columns divide their section's width evenly unless
given explicit widths. A `group` component keeps columns side-by-side on mobile rather than stacking.
Spacing between columns is expressed as a gutter attribute.

A `direction` attribute supports right-to-left ordering, which doubles as an **order-swap mechanism** for
alternating image/text rows — the same capability our `CLAUDE.md` §8.8 already documents as `dir="rtl"`
order-swapping with source order preserved.

**Assessment.** Automatic width distribution is genuinely convenient and genuinely lossy. Our measurements
are exact and load-bearing: 600px container, 10px parent padding, 580px inner, 2-column max 290 / min 175,
3-column max 193 / min 140, ghost table 580. Those numbers exist because they are the widths at which our
approved brand artwork and reserved-height cards are correct. **A compiler that computes widths for you is a
compiler that will silently disagree with an approved measurement.**

---

## 5. Responsive strategy

Media-query driven, with a **single global breakpoint** declared once in the head.

Two findings:

**5.1 One global breakpoint is a real constraint.** Every responsive decision in the document shares one
threshold. Our system does not currently need per-component breakpoints — but our Hero work is precisely
where a second threshold would have been useful, since the Hero's geometry fails at a different width than
the product grid's does. A single global breakpoint would have made that harder, not easier.

**5.2 Media-query-driven stacking is architecturally weaker than hybrid stacking.** This is the sharpest
disagreement in this document and it is a *technical* one, not a preference — see goal 14.1.

---

## 6. Outlook / MSO strategy

MSO ghost tables are **abstracted away**: the compiler emits them, the author never writes one. Conditional
comments are generated as part of section and column output.

**Buttons are the documented weak point.** The button component generates a nested table structure, and the
documentation carries the explicit admission that **the button "won't be fully clickable because of client
support"** — i.e. the clickable region is the text, not the whole padded shape.

That is a significant finding. A partially clickable CTA is a **conversion defect**, not a cosmetic one, and
it is the single most important element in an abandoned-cart email. Our bulletproof CTA — a shrink-to-fit
centred table with fill and radius on the cell, the label as a plain inline anchor, plus a VML `roundrect`
for the Word engine's radius — is built to make the whole shape clickable.

The community's answer is a third-party component adding VML rounded-button support, which means **the
framework's own answer to the most important element in the email is a plugin.** *(Inference: the base
component avoids VML because VML rounding requires an arcsize computed from the button's own height, which
a generic compiler cannot know ahead of the author's styling. Recorded as inference, not as fact.)*

---

## 7. Dark mode strategy

**No first-class dark-mode system.** Dark mode is handled the way it would be handled by hand: via the
style-block head components, written by the author.

This is the same gap the Email Guidelines source has, and our §9.6 coverage — the `background`-shorthand
rule especially — remains ahead of both.

---

## 8. Accessibility strategy

Present but not central. `role="presentation"` on generated layout tables and alt attributes on image
components are supported; there is no accessibility chapter comparable to the Email Guidelines source's, and
nothing on contrast, tap targets or reading-order review.

**A compiler-specific risk:** because the author does not write the markup, the author also does not review
the reading order, the `aria-hidden` on spacers, or the alt text of generated decorative elements. **Generated
accessibility is accessibility nobody checked.** Our §8.8 additions (`role="article"`,
`aria-roledescription="email"`, `aria-hidden` on every spacer and divider, `class="unstyle-auto-detected-links"`
on footer address blocks) are all decisions made at authoring time by someone looking at the element.

---

## 9. Component and reuse model

The strongest part of the framework, and the part most worth studying.

- Components are **declarative and attribute-configured** — the author states intent, not structure.
- `mj-attributes` sets **global defaults per component type**, so every button in the document inherits one
  definition. Change the default, change every instance.
- `mj-class` defines **named attribute bundles** applied by name — a token-like mechanism.
- Third-party components extend the set.

**This is a legitimately better reuse ergonomic than ours.** Our §7 component set is real and disciplined,
but propagation is manual: `CLAUDE.md` §7 has to *instruct* us to back-port a fix into the shared component
in the same change, because nothing enforces it. MJML's global-defaults mechanism makes propagation
structural — one edit, every instance.

**What we extract is the principle, not the mechanism:** a component's *default* should live in exactly one
declared place. In our file-driven system that place is `Design.md` — which is why §7's "a brand difference
is a token change" and the `CLAUDE.md` Always rule "promote a brand-reusable value into `BrandConfig.md` /
`Design.md` in the same change" are the correct analogues. Catalogued as **P-01** and **P-02**.

---

## 10. Theming and token model

Partial. Global default attributes plus named attribute classes give a token-ish layer, but there is no
brand-scoped theme concept — one document, one set of defaults. Multi-brand would be achieved by maintaining
separate head configurations, i.e. by convention rather than by architecture.

Our per-brand `Design.md` + `BrandConfig.md` split, with a single-home rule preventing a value from existing
in two files, is a **stronger multi-brand architecture than MJML offers**. That is worth stating plainly
because it is the dimension where our system is most clearly ahead of the tooling.

---

## 11. Tooling and dependency profile

**Node.js required.** CLI, a desktop application, API and plugin integrations. A build step is mandatory —
the shipped artefact is compiled output.

Dependency consequences for us, concretely:

- A compile step between the source of truth and the shipped file means **the file in `Output/` is not the
  file a human approved** — it is the file a compiler produced from the file a human approved. Our §3.3
  pipeline and §12 architecture-lock regression evidence (hashing inline styles, VML blocks, MSO
  conditionals, `height` and `bgcolor` attributes, `href`s and image sources) all assume the approved
  artefact *is* the shipped artefact.
- A compiler version becomes a **hidden input to every template.** A compiler upgrade can change the output
  of a file nobody edited — which is precisely the failure mode our byte-identity regression discipline
  exists to detect, and which it would then flag on every template at once.

---

## 12. Client-support claims and substantiation

Broad "responsive across email clients" positioning, substantiated by adoption and by the maturity of the
generated patterns rather than by a published defect index. There is no equivalent of Cerberus's client
matrix and defect index, and no per-rule client citation of the kind the Email Guidelines source provides.

**The button admission (goal 6) is the most valuable substantiated claim in the documentation**, because it
is a candid statement of a limitation rather than a compatibility promise.

---

## 13. Where it AGREES with our standards

| Our rule | MJML | Status |
|---|---|---|
| §8.1 table-based layout with inline styles as the output form | Compiles to exactly this | **SETTLED** — the target form is not in dispute |
| §8.1 / §8.8 MSO ghost tables for fixed width in the Word engine | Generated automatically | **SETTLED** |
| §8.8 `dir="rtl"` order swap with source order preserved | Direction attribute on columns | **SETTLED** |
| §7 components as the unit of reuse | The framework's central premise | **SETTLED** |
| §7 a brand difference is configuration, not a structural rewrite | Attribute-configured components | **SETTLED** |
| §9.4 hero background requires a background-colour fallback | Hero component requires one | **SETTLED** |
| §8.5 a hero needs explicit dimensions declared, not inferred | Fixed-height mode requires both | **SETTLED** |
| §9.7 preheader is a first-class element | Dedicated preview-text component | **SETTLED** |

Notably, the **agreement is on the destination and the disagreement is on how you get there.** MJML and our
system want the same HTML; we differ on whether a human or a compiler should write it.

---

## 14. Where it DISAGREES with our standards

### 14.1 Media-query stacking vs hybrid stacking — **we hold our position; this is technical, not stylistic**

MJML's responsive stacking is media-query driven. Our `CLAUDE.md` §8.8 mandates **hybrid stacking as the
default for every multi-column row**: inline-block columns with min/max widths that wrap on their own,
inside an MSO ghost table.

**Why ours is stronger, in one sentence:** hybrid stacking works **with or without media-query support**,
and Gmail strips `<style>` entirely for non-Google accounts.

An email whose columns stack only via a media query does not stack for those recipients — it holds its
desktop column widths inside a phone-width viewport. That is not degradation, it is breakage, and it is
invisible in every preview tool that renders `<style>`. This is the same principle as the Email Guidelines
source's "must work with no `<style>`" (see that file, goal 5) — **two independent sources agree with us
against MJML here.**

**Resolution: keep hybrid stacking. Not negotiable, and now doubly evidenced.**

### 14.2 The hero component reintroduces a crop our standard prohibits — **already decided in ADR-002**

MJML's hero offers two modes:

- **Fixed height** — the author declares the height; the background is sized to fill the declared box.
- **Fluid height** — the box height follows content; the background is sized to fill whatever box results.

Both fill a box whose aspect ratio the author does not control across viewports. Our
`Email-Hero-Engineering-Standard.md` requires the opposite: **the band is aspect-locked to the artwork's own
ratio and the background must fit rather than fill** — because filling discards overflow, and on mobile the
box height is content-driven, so *the crop changes per device*. That is the defect that cost sixteen drafts
of one template.

**A fill-based hero cannot satisfy an aspect-locked, no-crop contract. This is not a configuration
difference; it is a contradiction in the geometry.** Restated here because it is the most consequential
finding across all five sources, and because it is the reason ADR-002 rejected migration.

### 14.3 A partially clickable button — **unacceptable for our use case**

Documented in goal 6. Our CTA must be clickable across its whole padded shape. See `CLAUDE.md` §9.5's
≥44px tap target achieved *with padding* — if the padding is not clickable, the tap target is not 44px, and
the accessibility rule and the conversion requirement fail together.

### 14.4 Automatic width distribution vs exact declared measurements — **we hold our position**

Covered in goal 4. Our widths are approved values tied to approved artwork exports, not conveniences.

---

## 15. What it can do that we cannot

1. **Structural propagation of a component default** — one declaration governs every instance, enforced by
   the compiler rather than by an instruction in `CLAUDE.md`. This is the honest ergonomic gap (P-01).
2. **Named attribute bundles** applied by name at the call site (P-02).
3. **Generate MSO ghost tables automatically**, removing a whole class of hand-authoring arithmetic error.
4. **Author-facing brevity** — a document of intent is dramatically shorter than the markup it produces, and
   shorter documents are easier to review for *content* correctness.
5. **A declared global breakpoint in one place**, rather than a threshold repeated across media queries.
6. **A dedicated carousel and accordion**, i.e. interactive patterns we have never attempted. *(Whether
   those are wise in email is a separate question; the capability exists.)*

---

## 16. What we can do that it cannot

1. **Guarantee no-crop hero geometry.** Structurally impossible in a fill-based hero (goal 14.2).
2. **Stack without media-query support** (goal 14.1).
3. **Ship a fully clickable bulletproof CTA** (goal 14.3).
4. **Hold exact approved measurements** tied to approved artwork.
5. **Byte-identity regression evidence** on a locked component — impossible when a compiler sits between the
   source and the artefact (goal 11).
6. **Own the debugging surface.** Every defect in §8 of our `CLAUDE.md` was diagnosed by reading markup a
   human wrote.
7. **Multi-brand token architecture** with a single-home rule (goal 10).
8. **Dynamic-data engineering** — Klaviyo tag placement, the §8.7 attribute rule, fallback contracts,
   empty-loop handling. MJML is template-engine agnostic and takes no position, which means it offers no
   protection against the §8.7 defect class either.
9. **Zero dependencies.** No compiler version as a hidden input to every template.

---

## 17. Adoption risk

**High.** In descending order of severity:

| Risk | Consequence |
|---|---|
| **The hero contradiction** | Adoption would require abandoning `Email-Hero-Engineering-Standard.md`, or hand-writing the hero as raw passthrough — which forfeits the reason for adopting at once |
| **Media-query-only stacking** | Silent breakage for Gmail non-Google accounts, invisible in previews |
| **Partially clickable CTA** | Conversion and accessibility defect in the single most important element |
| **Compiler as hidden input** | An upgrade changes files nobody edited; regression evidence becomes meaningless |
| **Loss of the debugging surface** | Our §12 root-cause loop depends on reading authored markup |
| **Node dependency** | A build step in a file-driven system with no build step |
| **Measurement drift** | Auto-distributed widths silently disagreeing with approved artwork |
| **Generated accessibility** | Nobody inspects what nobody wrote |

**The escape hatch makes it worse, not better.** Raw-passthrough blocks let you hand-write the parts MJML
gets wrong — but the parts MJML gets wrong for us are the hero and the CTA, which are the two components we
care most about. A framework you must bypass for your hardest problems is providing convenience for your
easiest ones at the cost of a dependency.

---

## 18. Verdict

> **STUDY — REJECT FOR PRODUCTION. Adopt two component-ergonomics concepts; reject the compiler, the hero,
> the stacking model and the button.**
>
> Consistent with **ADR-002**, which already rejected migration. Nothing in this research changes that
> decision, and the hero finding (goal 14.2) strengthens it.

**Extracted into the pattern catalogue:**

| Pattern | What is extracted | Verdict there |
|---|---|---|
| **P-01** | A component default declared in exactly one place | Adopt as a principle — `Design.md` is our declaration point |
| **P-02** | Named token bundles applied by name | Adopt as a principle |
| **P-05** | A declared global breakpoint recorded once | Study — we may want the opposite |
| **P-11** | Order-swap for alternating rows | **Already ours** (§8.8) — confirmed by a second source |

**Rejected outright:** the compiler and its build step, `mj-hero` in both modes, media-query-only stacking,
the button component, automatic width distribution.

**The most valuable single finding in this document is a negative one:** the most mature, best-resourced
email framework in the industry ships a hero that cannot satisfy our no-crop contract and a button it
documents as not fully clickable. **Our hardest problems are not solved problems elsewhere.** That is worth
knowing before the next time a framework is proposed as a shortcut.

---

*Research notes, non-normative. Compiled 2026-07-29. Compiled-output mechanics are from documentation, not
source inspection — see `README.md` §7.*
