# Maizzle — research notes

| | |
|---|---|
| **Status** | RESEARCH — **NON-NORMATIVE** |
| **Version** | 1.0.0 |
| **Source** | `maizzle.com` · `github.com/maizzle/framework` |
| **Maintainer** | Cosmin Popovici / Maizzle |
| **Fetched** | 2026-07-29 |
| **Confidence** | **High** on architecture, pipeline stages and positioning. **Medium** on component inventory specifics. **Low** where marked *inference*. |
| **Kind** | A **build framework** — Vite-powered, Vue single-file components, Tailwind CSS, plus a configurable post-processing pipeline. |

> ⛔ **Nothing in this document governs a build.** Cerberus remains the only production rendering framework.
> No Maizzle component, Tailwind class, transformer output or generated markup may be copied into a template.
> See `README.md` §1.
>
> **Already decided:** ADR-002 §Alternatives rejected migrating to Maizzle.

---

## 1. Identity and problem solved

Maizzle is a **Vite-powered email framework built with Vue and Tailwind CSS**. The author writes components
using utility classes; the build pipeline then converts that authoring-time convenience into
email-compatible output — inlining CSS, purging unused rules, and applying a series of email-specific
transformations.

The problem it solves is different from the other frameworks', and this is the key insight: **MJML and
Foundation abstract away the markup. Maizzle does not abstract the markup at all — it abstracts the
post-processing.** The author still writes tables. What the pipeline removes is the tedium of inlining,
purging, and applying the dozens of small email-specific fixes that every production email needs.

**That makes Maizzle the most philosophically compatible of the three tooling sources with how we work**, and
it is why the most valuable extraction in this entire research exercise comes from here — see goal 3.2.

---

## 2. Provenance and maintenance status

Actively and visibly maintained, modern in its dependencies (Vite, Vue, Tailwind), and the most current of
the three tooling sources. Open source. Smaller institutional backing than MJML's, but no maintenance-mode
concern of the kind that decides the Foundation for Emails question.

**Modernity is a double-edged property here.** A framework tracking Vite, Vue and Tailwind inherits three
fast-moving upstream dependencies. For a system whose output must stay correct and unedited for months
(§4.3), rapid upstream movement is a cost, not a feature — see goal 17.

---

## 3. Core architecture

Two distinct halves, and they deserve separate verdicts.

### 3.1 The authoring half — utility classes and Vue components

Tailwind is a first-class citizen with an email-optimised configuration; components are Vue single-file
components. The author composes from utilities rather than writing style declarations.

**Verdict: reject.** A utility-class authoring model is fundamentally build-dependent — the classes only mean
anything after a compilation step resolves them into inline styles. There is no read-time equivalent. Our
`Design.md` tokens are read by a human and by Claude at authoring time; a utility class is read by a
compiler.

### 3.2 The pipeline half — a configurable, ordered transformer chain

**This is the finding of the document, and the most immediately actionable idea in the folder.**

Maizzle's pipeline applies an **ordered series of named, individually-configurable transformations** to the
built HTML. Documented stages include CSS inlining, unused-CSS purging, six-digit hex expansion, widow
prevention, URL parameter appending, and minification — each a discrete, named, toggleable step.

Two properties matter:

**(a) Each transformation is named and separable.** Not "clean up the HTML" but a specific list of specific
operations, each of which can be reasoned about, enabled, disabled and audited independently.

**(b) The pipeline is explicitly configurable and deliberately incomplete** — the framework leaves
customisation to the developer rather than presuming a fixed set. It provides a *place* to put a rule rather
than a fixed set of rules.

**Why this maps onto our system so precisely.** We already perform transformations of exactly this kind — we
just perform them as *prose rules an author must remember*, scattered across `CLAUDE.md`:

| Maizzle pipeline stage | Our equivalent | Where it currently lives |
|---|---|---|
| Six-digit hex expansion | "Six-digit hex only — never `#fff` or `rgb()`" | §8.8, as a rule to remember |
| Minification | "Keep the built HTML well under Gmail's ~102 KB clip threshold" | §9.4, as a goal |
| URL parameter appending | Verified-destination and link-integrity requirements | §8.2, manual |
| CSS inlining | Inline styles authored by hand throughout | §8.1, by construction |
| — | Strip descriptive comments from production | §9.2, as a rule |
| — | Anchor open/close balance, no `<` inside an attribute list, no odd quote counts, no empty or `#` hrefs, no nested anchors | **§8.7, already framed as automated checks** |

**The insight is that our §9.2 ghost-element inspection and §8.7 automated footer checks are already a
transformer pipeline — an unnamed, unordered, manually-executed one.** Naming it, ordering it, and making each
check a discrete addressable item is a real structural improvement that requires **no build step, no
dependency, and no framework**: it is a documentation and process change to
`Shared/Engineering/Engineering-QA-Process.md`, whose 16-scan set is the pipeline in embryo.

This is catalogued as **P-08** and is the single strongest ECP candidate produced by the research. It is also
the correct kind of extraction: **the concept transfers, the code does not.**

---

## 4. Layout model

**The author's own.** Maizzle takes no position on layout structure — no grid abstraction, no row/column
components, no hero component. The author writes the table markup; Tailwind utilities style it.

**This is a significant compatibility finding.** Because Maizzle does not abstract layout:

- **It cannot contradict our hero geometry**, unlike MJML's fill-based hero (`MJML.md` §14.2).
- **It cannot impose media-query-dependent stacking**, unlike MJML and Foundation. Hybrid stacking would be
  authored by hand and would survive intact.
- **It cannot distribute widths automatically** against our exact approved measurements.

**Maizzle is the only one of the three tooling sources whose adoption would not require abandoning an
existing standard of ours.** The objections to it are entirely about dependency and traceability — not about
technique. That is a materially different, and more honest, kind of rejection.

---

## 5. Responsive strategy

Author-determined, via Tailwind's responsive utility variants, resolved at build time into media queries.

**The critical caveat, and a real trap:** Tailwind's responsive model is media-query based *by construction*.
An author working naturally in Tailwind expresses "stacks on mobile" as a responsive variant — which compiles
to a media query — and therefore **does not stack where `<style>` is stripped**. Hybrid stacking remains
possible, but it must be authored *against* the framework's natural idiom rather than with it.

That is a subtle and expensive kind of hazard: the framework permits the correct thing but makes the incorrect
thing easier. **Our §8.8 mandate that hybrid stacking is the default for every multi-column row is precisely
the guard against an author following the path of least resistance.**

---

## 6. Outlook / MSO strategy

Handled at the **component** level rather than by the framework core — the documented library of 30+ email
components includes Outlook button fallbacks, which implies VML-based button treatments among the components
rather than in the pipeline.

*(Inference: keeping MSO handling in components rather than the pipeline is consistent with the framework's
overall stance of not abstracting markup. Recorded as inference.)*

**Assessment.** Component-level MSO handling is the same place ours lives — our VML `roundrect` button and MSO
ghost tables are properties of the components that need them, not of a global processing step. Agreement, and
a mild confirmation that our placement is conventional.

---

## 7. Dark mode strategy

**Documented, and it is the only one of the three tooling sources with any dark-mode provision at all:** the
component library includes dark-mode images.

That is a narrow provision (an image swap), not a dark-mode system, and it does not approach our §9.6
coverage — no equivalent of the `background`-shorthand rule, no `[data-ogsc]` guidance found, no force-invert
guidance.

**But it confirms a rule of ours by independent arrival.** A dark-mode image variant is exactly our §9.6
light/dark logo swap, and our §8.8 note that the dark-mode image must be guarded with a non-MSO conditional
or Outlook renders both variants. **The pattern is conventional; our version is more complete.**

---

## 8. Accessibility strategy

Not a documented focus. No accessibility chapter located, nothing on contrast, tap targets or reading order.

**One structural advantage over MJML and Inky, though:** because the author writes the markup, the author is
positioned to *see* the accessibility decisions. The generated-accessibility risk noted in `MJML.md` goal 8
does not apply here. **Maizzle does not help with accessibility, but it does not remove your ability to do it
either** — a meaningful distinction.

---

## 9. Component and reuse model

**30+ email components** documented, including the Outlook button fallbacks and dark-mode images noted above.
Components are Vue single-file components, composed by inclusion.

**Assessment against ours.** A 30-component library is larger than our §7 standard set (Header · Hero ·
Product Card · Product Grid · CTA Button · Price Badge · Offer/Coupon Bar · Trust Strip · Feature Icons ·
Category Quick-Links · Footer) and larger than Cerberus's 13 reference components. Breadth is not the point,
though — **our components carry brand tokens, dynamic-data bindings with fallback contracts, and, in one case,
an architecture lock. None of those are properties a generic library can have.**

The reuse *mechanism* (composition by inclusion, with props) is conventional and build-dependent. Nothing to
extract that MJML's global-defaults mechanism (P-01) does not already cover better.

---

## 10. Theming and token model

**The strongest token story of the five sources, in mechanism**: Tailwind's configuration file is a genuine
design-token declaration point — colours, spacing, type scale, all declared once, referenced by name
throughout, with an email-optimised default configuration.

**And it is unusable by us for exactly one reason: it is resolved at build time.** Same objection as
Foundation's Sass variables (`Foundation-for-Emails.md` goal 10), and it is worth stating the general
principle it produces:

> **A token system's value is its single declaration point. A token system's cost is where that declaration
> is resolved.** Resolved at build time, the artefact loses traceability to the token. Resolved at authoring
> time — by a human or by Claude reading `Design.md` — the token and the artefact coexist permanently, and
> regression evidence stays possible.

**Our `Design.md` is a read-time token system.** That is not a primitive version of Tailwind's config; it is a
different resolution point chosen for a reason. Catalogued as **P-02**.

---

## 11. Tooling and dependency profile

**Node, Vite, Vue, Tailwind, plus the transformer pipeline.** Lighter to *operate* than Foundation's stack and
more modern than either, but four fast-moving upstream dependencies deep.

The standing objections (`MJML.md` goal 11) apply:

- The shipped artefact is not the approved artefact.
- Tool versions become hidden inputs to every template.
- **And with four fast-moving upstreams, those inputs move often.** A Tailwind major version changes what a
  utility class resolves to — which changes the output of a template nobody edited.

**The irony is worth recording:** the framework whose *concept* is most valuable to us (the pipeline, P-08) is
one whose *implementation* we most want to avoid depending on. Which is exactly what this folder is for.

---

## 12. Client-support claims and substantiation

Email-compatibility positioning substantiated by the pipeline's transformations and the components' documented
fallbacks, rather than by a published defect index or per-rule client citations. Same evidentiary shape as
MJML and Foundation, and weaker than both Cerberus's compatibility document and the Email Guidelines source's
per-rule citations.

**Generalising across all three tooling sources: tooling substantiates compatibility by construction
("we generate the known-good pattern"), while rulesets substantiate it by citation ("this rule exists because
Gmail does X").** Only the second kind is usable as evidence under our ECP evidence bar. That is a durable
lesson about which sources can support a proposal.

---

## 13. Where it AGREES with our standards

| Our rule | Maizzle | Status |
|---|---|---|
| §8.8 six-digit hex only | A named pipeline transformation | **SETTLED** — independently arrived at |
| §8.1 inline styles as the shipped form | Pipeline inlines CSS | **SETTLED** |
| §9.4 keep the payload small / under the clip threshold | Minification and CSS purging | **SETTLED** |
| §8.1 the author owns the layout markup | No layout abstraction imposed | **SETTLED** |
| §8.8 MSO handling belongs in the component that needs it | Outlook fallbacks live in components | **SETTLED** |
| §9.6 light/dark image variants | Dark-mode images in the library | **SETTLED** |
| §8.8 / §9.5 typographic polish is part of the build | Widow prevention as a pipeline stage | **SETTLED** |
| Tokens need a single declaration point | Tailwind config | **SETTLED** (concept, not mechanism) |
| §8.2 link integrity is a processing concern | URL parameter transformation | **SETTLED** (concept) |

---

## 14. Where it DISAGREES with our standards

Fewer and shallower conflicts than any other tooling source — because it abstracts less.

### 14.1 Build-time token resolution vs read-time — **we hold our position**

Goal 10. Traceability from artefact to declaration is what makes §12 regression evidence possible.

### 14.2 Tailwind's responsive idiom makes media-query stacking the path of least resistance — **we hold our position**

Goal 5. Not a hard conflict — hybrid stacking remains possible — but a framework that makes the wrong thing
easier is a hazard in a system where §8.8 mandates the harder thing.

### 14.3 A compile step between the approved artefact and the shipped artefact — **we hold our position**

Goal 11. Our §3.3 `Draft → Review → Approval → Output` pipeline and our architecture-lock regression evidence
both assume the approved file *is* the shipped file.

**Notably absent from this list:** any conflict with the Hero standard, with hybrid stacking as a structural
requirement, or with our exact measurements. Maizzle does not reach into any of them.

---

## 15. What it can do that we cannot

1. **A named, ordered, individually-configurable transformer pipeline** — the concept we most want (P-08).
2. **Automated six-digit hex expansion** — we enforce this by rule and by review; a transformation cannot
   forget.
3. **Automated minification and CSS purging** against the clip threshold, rather than a size goal to watch.
4. **Automated widow prevention** — a typographic refinement we do not currently address at all.
5. **Automated URL parameter appending** — relevant to campaign tracking, currently manual.
6. **A token declaration point with compiler-enforced substitution** — our `Design.md` relies on the author
   reading it.
7. **A larger component library** (goal 9), though breadth without brand tokens is of limited value to us.

**Items 2–5 are all the same shape: things we enforce by asking a human to remember.** That is the honest
capability gap, and P-08 is the answer that does not require a dependency.

---

## 16. What we can do that it cannot

1. **Ship the approved artefact itself**, byte-for-byte (goal 14.3).
2. **Byte-identity regression evidence** on a locked component.
3. **Hero geometry** — no equivalent, though also no conflict.
4. **Read-time tokens** with permanent artefact traceability (goal 10).
5. **Dark mode beyond an image swap** (goal 7) — including the `background`-shorthand rule.
6. **Accessibility standards** — contrast, tap targets, reading order (goal 8).
7. **Dynamic-data engineering** — fallback contracts, empty-loop handling, and the §8.7 rule that a template
   tag emitting HTML must never sit inside an attribute.
8. **Lock a component's architecture** — no external source has this.
9. **Zero dependencies**, and therefore no upstream that can change our output (goal 11).
10. **Governance** — ADRs, ECPs, change tiers, QA gates.

---

## 17. Adoption risk

**High — but for different and narrower reasons than the other two tooling sources**, and this distinction
should be preserved rather than flattened.

| Risk | Consequence |
|---|---|
| **Four fast-moving upstreams** (Vite, Vue, Tailwind, framework) | Template output changes without a template edit |
| **Build step** | Approved artefact ≠ shipped artefact; regression evidence undermined |
| **Compiled-away tokens** | Artefact loses traceability to `Design.md` |
| **Tailwind's responsive idiom** | Makes media-query stacking the default path against our §8.8 |
| **Utility-class authoring** | Markup becomes unreadable without the build context — our §12 root-cause loop reads markup |

**What is *not* on this list matters:** no hero contradiction, no imposed stacking model, no imposed grid, no
imposed widths, no generated-accessibility blindness. **If a build step were ever acceptable in this system,
Maizzle would be the right choice.** It is not acceptable, for the reasons in `Framework-Comparison.md` §5 —
but the rejection is about our architecture, not about Maizzle's quality.

---

## 18. Verdict

> **STUDY — REJECT FOR PRODUCTION, BUT ADOPT ITS CENTRAL CONCEPT. The transformer-pipeline model is the most
> valuable single extraction in this research folder, and it can be adopted with zero dependencies as a
> documentation and QA-process change.**
>
> Consistent with **ADR-002**, which already rejected migration.

**Extracted into the pattern catalogue:**

| Pattern | What is extracted | Verdict there |
|---|---|---|
| **P-08** | Named, ordered, individually-configurable output transformations | **ADOPT AS CONCEPT — strongest ECP candidate** |
| **P-02** | Token single-declaration-point, resolved at read time not build time | Adopt as a principle (confirms current design) |
| **P-12** | Automated output assertions replacing remembered rules | Adopt — extends §8.7's automated checks |
| **P-15** | Typographic refinements (widow prevention) as a named check | Study — a gap we do not currently address |

**Rejected:** Vite/Vue/Tailwind authoring, utility-class styling, build-time token resolution, the build step
itself.

**The recommended next step from this source is concrete and cheap:** raise an ECP to convert
`Engineering-QA-Process.md`'s 16-scan set and `CLAUDE.md` §8.7's automated checks into a **named, ordered,
individually-referenceable output-assertion set**, so that a check can be cited by name in a QA report and a
new check can be added without rewriting prose. No dependency, no build step, no code copied — the concept
extracted and re-implemented in our own architecture. That is what this folder is for.

---

*Research notes, non-normative. Compiled 2026-07-29. Component inventory specifics are medium-confidence —
from documentation, not source inspection.*
