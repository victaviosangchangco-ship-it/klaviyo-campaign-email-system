# Framework Comparison — the decision matrix

| | |
|---|---|
| **Status** | RESEARCH — **NON-NORMATIVE** |
| **Version** | 1.0.0 |
| **Compiled** | 2026-07-29 |
| **Covers** | MJML · Foundation for Emails (Inky) · Maizzle · Email Coding Guidelines · Really Good Emails — measured against **Cerberus** and **our own system** |
| **Confidence** | Per source, see each source document's header and `README.md` §7 |

> ⛔ **Nothing in this document governs a build.** Cerberus remains the only production rendering framework.
> This is a comparison, not a shortlist. See `README.md` §1.

---

## 1. The one-line verdicts

| Source | Kind | Verdict | Extracted |
|---|---|---|---|
| **Email Coding Guidelines** | Ruleset (prose) | **STUDY — HIGH VALUE** | 5 patterns · 14 rules settled by agreement · 1 high-priority verification |
| **Maizzle** | Build framework | **REJECT — adopt its central concept** | 4 patterns, including the strongest ECP candidate (P-08) |
| **MJML** | Compiler | **REJECT** | 2 component-ergonomics concepts |
| **Foundation for Emails** | Preprocessor + build stack | **REJECT** | 2 concepts + the governance lesson of §6.1 |
| **Really Good Emails** | Gallery | **STUDY — composition only** | 1 usage protocol (P-07) · 2 architecture confirmations |

**All three tooling sources are rejected, and ADR-002 had already rejected all three.** This research does not
overturn that decision; it explains it and, in MJML's case, strengthens it materially.

---

## 2. The 13-dimension matrix

Read the two right-hand columns as the baseline. **Cerberus is our Tier-1 rendering reference; "Our System" is
what we actually ship.**

### 2.1 Dimensions 1–5 — what it is and how layout works

| # | Dimension | MJML | Foundation / Inky | Maizzle | Email Guidelines | Really Good Emails | **Cerberus** | **Our System** |
|---|---|---|---|---|---|---|---|---|
| **1** | **Artefact kind** | Markup language + compiler | Templating language + CSS framework + build stack | Build framework + transformer pipeline | Prose ruleset | Curated gallery | Reference templates + component library, vendored unmodified | File-driven standards + hand-authored HTML |
| **2** | **Core mechanism** | Component tree compiled to HTML | Tag expansion to tables | Author writes markup; pipeline post-processes | Judgement, stated as rules with reasons | Curation | Known-good patterns to read and adapt | Read order → components → QA gates → versioned drafts |
| **3** | **Dependency footprint** | Node | Node + Sass + inliner + image pipeline (**heaviest**) | Node + Vite + Vue + Tailwind | **Zero** | Zero (a website) | **Zero** (vendored files) | **Zero** |
| **4** | **Layout model** | Section/column, auto width distribution | 12-column grid, small/large spans, block-grid | **None imposed** — author's own | Tables for 3 named remedies only; `<div>` otherwise | None published | Fluid, fluid-hybrid, responsive templates | 600px single column; 2-col grids at exact declared widths |
| **5** | **Responsive mechanism** | Media queries, one global breakpoint | Framework media queries + grid classes | Tailwind variants → media queries | Must work at ~280px **with no `<style>`** | None published | **Hybrid: inline-block + min/max width + ghost tables** | **Hybrid, mandated for every multi-column row** |

**Dimension 5 is the decisive row of the whole matrix.**

Three of the five sources make responsive behaviour depend on a media query. Two do not. Gmail strips `<style>`
entirely and permanently for non-Google accounts, so **for those recipients a media-query-dependent layout does
not degrade — it fails to stack at all**, holding desktop column widths inside a phone viewport, invisibly to
every preview tool that renders `<style>`.

Our position (hybrid stacking, `CLAUDE.md` §8.8) is corroborated by **Cerberus** and, independently, by the
**Email Guidelines** source's "must work with no `<style>`" floor. Two authorities against three frameworks, and
the two are the ones that state a mechanism rather than assert compatibility.

### 2.2 Dimensions 6–10 — engineering coverage

| # | Dimension | MJML | Foundation / Inky | Maizzle | Email Guidelines | Really Good Emails | **Cerberus** | **Our System** |
|---|---|---|---|---|---|---|---|---|
| **6** | **Outlook / MSO** | Ghost tables generated; **button documented as not fully clickable** | Generated inside expansion | In components (Outlook button fallbacks) | Conditionals ≠ version targeting; **120dpi doc-level fix**; margin-background defect | — | Ghost tables + VML documented as techniques | Ghost tables + VML `roundrect`; **fully clickable CTA** |
| **7** | **Dark mode** | ✗ author's own | ✗ none | ~ dark-mode images only | ✗ **none** | ✗ none | ~ `color-scheme` scaffold | ✔ **`prefers-color-scheme` + `[data-ogsc]` + the `background`-shorthand rule** |
| **8** | **Accessibility** | ~ roles + alt | ~ roles | ✗ not a focus | ✔ `lang` ×2, avoid HTML5 sectioning, roles, reading order | ✗ none | ✔ roles, `aria-hidden`, alt discipline | ✔ **the above + WCAG AA contrast, ≥14px copy, ≥44px tap targets** |
| **9** | **Component & reuse** | ✔✔ **global per-type defaults + named bundles** | ✔ tags + Sass settings | ✔ 30+ components | ✗ none | ✗ none | ✔ 13 reference components | ✔ 11-component set + propagation duty + **`ARCHITECTURE LOCKED`** |
| **10** | **Theming / tokens** | ~ document-level defaults | ✔ Sass variables (build-time) | ✔✔ Tailwind config (build-time) | ✗ none | ✗ none | ✗ none | ✔ **`Design.md` per brand, read-time, single-home rule** |

**Dimension 7 — the clearest asymmetry in the matrix.** Four of five external sources have **no dark-mode
position at all**, and the fifth has an image swap. Our §9.6 carries a defect none of them names: the
`background` shorthand in a dark-mode rule resets `background-image` to `none` and therefore **deletes the
background image of every element it matches**, presenting as a layout fault and being routinely misdiagnosed as
positioning. **On dark mode there is no external authority to defer to. We are it.**

**Dimension 9 — the one place a framework is genuinely ahead of us.** MJML's global per-component-type default
means one edit governs every instance. Our §7 propagation is a *duty* ("fix once, propagate immediately"), not a
mechanism. That is the honest ergonomic gap, and it is P-01.

**Dimension 10 — where "ahead" is a category error.** Tailwind's config and Sass variables are better token
*mechanisms* and are both resolved at build time, so the shipped artefact loses traceability to the declaration.
`Design.md` resolves at read time, so token and artefact coexist permanently — which is what makes §12's
byte-identity regression evidence possible at all. Different resolution point, chosen deliberately.

### 2.3 Dimensions 11–13 — trustworthiness and fit

| # | Dimension | MJML | Foundation / Inky | Maizzle | Email Guidelines | Really Good Emails | **Cerberus** | **Our System** |
|---|---|---|---|---|---|---|---|---|
| **11** | **Evidence quality** | By construction; **one candid limitation admitted** | By construction; no defect index | By construction | ✔✔ **per-rule, named client + version** | ✗ none possible | ✔✔ **client matrix + defect index** | ✔✔ **each rule carries the defect that caused it** |
| **12** | **Maintenance / lifecycle risk** | Low — Mailjet/Sinch, active | **HIGH — maintenance-only; migrating to Inky v2** | Medium — 4 fast upstreams | Low, but a **living document** (cite the date) | Low | **None — vendored, frozen** | **None — we own it** |
| **13** | **Fit with our architecture** | ✗✗ **hero contradicts our standard** | ✗✗ maintenance risk + fractional grid | ✗ build step only — **no standards conflict** | ✔✔ same kind of artefact | ~ §15 composition only | ✔✔ **already Tier 1** | — |

**Dimension 11 splits the sources cleanly into two kinds**, and the split determines what can support a
proposal:

- **Substantiation by construction** (all three tooling sources): *"we generate the known-good pattern."*
- **Substantiation by citation** (Email Guidelines, Cerberus, us): *"this rule exists because Gmail does X."*

Only the second kind clears the ECP evidence bar (`Engineering-Change-Management.md` §2.2), which requires a
mechanism and a reproduction in a named client. **A framework's popularity is not a reproduction.** In practical
terms: a claim from the Email Guidelines source or Cerberus can seed an ECP; a claim from MJML, Foundation,
Maizzle or RGE cannot, no matter how confident it sounds.

**Dimension 13 rewards a close reading.** Maizzle's single ✗ against the other two frameworks' ✗✗ is the most
useful distinction in the matrix. MJML and Foundation would each require us to **abandon an existing standard**
— MJML's fill-based hero contradicts the no-crop contract outright, and Foundation's media-query stacking and
fractional grid unit contradict §8.8 and our exact measurements. Maizzle contradicts **nothing**; it imposes no
layout model, no hero, no widths, no stacking mechanism. Its rejection rests entirely on the build step. That is
a rejection about *our* architecture, not about Maizzle's quality — and it is why Maizzle is the source we take
the most from.

---

## 3. Coverage scorecard

Marks are **relative to our requirements**, not to general quality. `—` means the source does not attempt it.

| Requirement (source of truth) | MJML | Inky | Maizzle | Guidelines | RGE | Us |
|---|---|---|---|---|---|---|
| Stacks with no `<style>` (§8.4) | ✗ | ✗ | ~ | ✔ | — | ✔ |
| No-crop, aspect-locked hero (Hero std §5) | ✗✗ | — | — | — | — | ✔ |
| Fully clickable CTA (§8.4, §9.5) | ✗ | ~ | ~ | — | — | ✔ |
| Structural equal-height cards (§8.3) | — | — | — | — | — | ✔ |
| Odd-count centred card (§8.3) | — | ~ | — | — | — | ✔ |
| Dark mode incl. shorthand rule (§9.6) | ✗ | ✗ | ~ | ✗ | — | ✔ |
| WCAG AA contrast / tap targets (§9.5) | — | — | — | ~ | — | ✔ |
| Dynamic data + fallback contracts (§6) | — | — | — | — | — | ✔ |
| Tag-in-attribute prohibition (§8.7) | — | — | — | — | — | ✔ |
| Multi-brand tokens (§7, `Design.md`) | ~ | ✔ | ✔ | — | — | ✔ |
| Component propagation enforced (§7) | ✔ | ~ | ~ | — | — | ~ |
| Component architecture lock (§12) | — | — | — | — | — | ✔ |
| Client-matrix QA discipline (§9.1) | — | — | — | ~ | ✗ | ✔ |
| Governance: ADR / ECP / tiers / gates | — | — | — | — | — | ✔ |
| Zero dependencies | ✗ | ✗ | ✗ | ✔ | ✔ | ✔ |
| Approved artefact = shipped artefact | ✗ | ✗ | ✗ | ✔ | — | ✔ |

**One row where we are not best: component propagation.** Everything else either matches or exceeds every
external source, and eight requirements are attempted by **no external source at all** — hero geometry, equal-
height cards, the odd-count case, dynamic-data engineering, the tag-in-attribute rule, architecture locks,
client-matrix discipline, and governance.

**That is the headline result of this research.** Our hardest problems are not solved elsewhere. They are not
even *addressed* elsewhere.

---

## 4. Why the tooling sources cluster

The three tooling sources fail our requirements in the same three ways, which suggests a structural cause
rather than three independent oversights.

| Shared failure | Why it recurs |
|---|---|
| **Media-query-dependent responsiveness** | A framework must serve a general audience, and media queries are the general answer. Hybrid stacking is more markup for a defect (Gmail GANGA) that is invisible in preview tools — so a framework optimising for author experience under-weights it. |
| **No dark mode worth the name** | Dark mode requires per-element decisions about what an inverted surface does to *this* image and *this* colour. It resists generic abstraction almost completely. |
| **A build step** | Abstraction requires resolution, and resolution requires a compiler. **The build step is not incidental to a framework; it is the price of the abstraction.** |

**The inference this supports** *(marked as inference, per `README.md` §7)*: a framework's value is highest where
the problem is **general and repetitive** (inlining, ghost tables, hex normalisation) and lowest where the
problem is **specific and constrained** (this artwork, this ratio, this brand, this client, this ESP's import
rewrite). Every one of our expensive problems has been of the second kind.

---

## 5. Why zero dependency matters more here than elsewhere

An agency shipping 200 campaigns a year and a system shipping evergreen lifecycle flows are not the same
business, and the dependency calculus differs accordingly.

**Five reasons specific to us, each tied to an existing rule:**

1. **A flow sends unattended for months and must stay accurate without edits** (§4.3). Its dependencies must
   outlive that window. `Foundation-for-Emails.md` §2 is the cautionary case: a framework already in
   maintenance-only mode while our templates are still expected to be correct next year.
2. **The approved artefact must be the shipped artefact.** §3.3's approval gate and §12's byte-identity
   regression evidence both assume it. A compiler between them means a human approved an input, not an output.
3. **A compiler version is a hidden input to every template.** An upgrade changes files nobody edited — and our
   regression discipline would then flag every template simultaneously, which is a true positive that reads as
   noise.
4. **Our root-cause loop reads markup** (§12). Every rule in §8 exists because a human read authored markup and
   found the mechanism. Generated markup, and especially utility-class markup, removes that surface.
5. **Klaviyo re-parses and rewrites the HTML on import.** §8.2 exists because that rewrite detached an `href`
   from a block wrapper and produced a card that rendered but was not clickable. **We already have one
   transformation we do not control between our file and the recipient.** Adding a second, upstream, is how a
   defect becomes undiagnosable.

**Point 5 is the argument that does not generalise to anyone else**, and it may be the strongest of the five.

---

## 6. The governance lessons

Three findings that are about **how to decide**, not about technique. These are the most durable output of the
comparison.

### 6.1 A framework's maintenance lifecycle is shorter than a flow email's production life

From `Foundation-for-Emails.md` §2. A flow must stay correct for months without edits; a framework can enter
maintenance mode inside that window. **Anything a flow depends on must be at least as long-lived as the flow's
correctness requirement.** Vendored reference documents and hand-authored HTML meet that bar by construction.

### 6.2 A framework's compatibility claim is a snapshot of its last active development

From `Foundation-for-Emails.md` §12. Compatibility asserted by construction ages silently, because nothing in
the artefact records *when* the claim was true. Our rules each carry the defect that caused them, so they age
visibly — a rule whose client no longer exists can be identified and retired. **Prefer a dated reason to an
undated assurance.**

### 6.3 The most valuable extraction is a concept re-implemented in our own architecture

From `Maizzle.md` §3.2. The transformer-pipeline model (P-08) is the strongest finding in the folder, and
adopting it costs **no dependency, no build step, and no copied code** — it is a restructuring of
`Engineering-QA-Process.md`'s 16-scan set and `CLAUDE.md` §8.7's automated checks into a named, ordered,
individually-referenceable assertion set.

**That is the template for how this folder should be used.** Not "which framework should we adopt", but "which
of their concepts can we re-implement in an architecture we control".

---

## 7. What would change our mind

Recorded so that a future proposal has a bar to clear rather than an argument to have. **Adoption of any
tooling source would require all four:**

1. A mechanism for **structural stacking without `<style>`**, not media queries (dimension 5).
2. A hero mechanism that can satisfy an **aspect-locked, no-crop contract** (`MJML.md` §14.2).
3. A way to keep the **approved artefact identical to the shipped artefact**, preserving §12 regression
   evidence (§5.2 above).
4. A dependency lifecycle at least as long as a flow's production life (§6.1).

**No source currently meets any of the four except Maizzle, which meets none of them but conflicts with no
standard.** If a future framework meets all four, that is an ADR-worthy conversation. Until then, ADR-001 and
ADR-002 stand.

---

## 8. Where each finding is carried forward

| Source | Patterns extracted |
|---|---|
| Email Guidelines | **P-06** tables-as-remedy lens · **P-09** Outlook 120dpi · **P-10** Yahoo `height`→`min-height` · **P-13** `lang` ×2 · **P-14** the 280px no-`<style>` floor |
| Maizzle | **P-08** transformer pipeline · **P-02** read-time tokens · **P-12** automated assertions · **P-15** typographic refinements |
| MJML | **P-01** single-declaration component defaults · **P-02** named token bundles · **P-05** declared global breakpoint · **P-11** order-swap (already ours) |
| Foundation / Inky | **P-03** generic n-per-row grid · **P-04** co-located responsive intent · **P-02** token declaration point |
| Really Good Emails | **P-07** reference-consumption protocol |

Full catalogue with adopt/reject verdicts and Cerberus compatibility: `Reusable-Engineering-Patterns.md`.

---

*Research notes, non-normative. Compiled 2026-07-29. Cerberus remains the only production rendering framework.*
