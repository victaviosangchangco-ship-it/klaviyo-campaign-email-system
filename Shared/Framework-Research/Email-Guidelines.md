# Email Coding Guidelines (hteumeuleu) — research notes

| | |
|---|---|
| **Status** | RESEARCH — **NON-NORMATIVE** |
| **Version** | 1.0.0 |
| **Source** | `github.com/hteumeuleu/email-guidelines` · `github.com/hteumeuleu/email-guidelines/blob/master/README.md` |
| **Author** | Rémi Parmentier (hteumeuleu) |
| **Fetched** | 2026-07-29 |
| **Confidence** | **High** on the ruleset (read directly). **Medium** on client-behaviour claims we have not reproduced. |
| **Kind** | A written **ruleset**. Not a framework, not a compiler, no code to install. |

> ⛔ **Nothing in this document governs a build.** Cerberus remains the only production rendering framework.
> No markup, style rule or snippet from this source may be copied into a template. See `README.md` §1.

---

## 0. Why this source ranks first of the five

Of the five sources researched, this is the only one that is **the same kind of artefact as our own
standards**: prose rules, each with a stated reason, each traceable to a named client defect. The other four
are tooling. Tooling encodes its reasoning inside an abstraction and hides it; this source states the
reasoning and leaves the markup to you — which is exactly our architecture.

**Consequence:** this is the source where agreement is most meaningful (goal 13 is unusually long) and where
disagreement is most worth resolving carefully (goal 14 finds three genuine conflicts, and we win two of
them for stated reasons).

---

## 1. Identity and problem solved

A public, opinionated set of coding guidelines for HTML email, organised in nine chapters: **Syntax ·
Base · Semantics · Head · Images · Tables · CSS · Responsive · Accessibility**.

The problem it solves is **inconsistency of practice**, not inconsistency of rendering. It exists because
email developers reproduce folklore — techniques carried forward for clients that no longer exist — and it
replaces folklore with rules that each carry a reason. It is descriptive of good practice rather than
generative of markup.

---

## 2. Provenance and maintenance status

Authored by Rémi Parmentier, a widely-cited email-rendering researcher whose published work includes the
fluid-hybrid refinements and several documented client bugs. Maintained as a living document with community
issues and discussion. Not a versioned release artefact — it is a document that changes, which means **a
claim sourced from it should be re-checked before being cited in an ECP**.

---

## 3. Core architecture

**There is no architecture.** That is the finding. There is nothing to install, no compile step, no
component library, no generated output. The deliverable is judgement.

This is the same shape as our own system: `CLAUDE.md` plus `Shared/*.md` plus hand-authored HTML. It
independently confirms that a rules-and-reasons document is a legitimate, complete engineering artefact for
this domain — a framework is not a prerequisite for rigour.

---

## 4. Layout model

**Tables are permitted for exactly three purposes and no others:**

1. Fixing widths where the Word engine ignores CSS width
2. Achieving reliable side-by-side columns in clients without modern layout support
3. Applying a background colour or image to a region where the Word engine cannot honour CSS on the element

Everything else — spacing, grouping, typography wrappers — is expected to be `<div>` and CSS. It treats
each table as a **specific remedy for a specific engine limit**, not as the default container.

**Assessment against our system.** Our `CLAUDE.md` §8.1 mandates table-based layout as the general
mechanism, which is more conservative than this. The two positions are reconcilable: this source is
optimising for lean, maintainable markup on a client matrix it has personally tested, while our rule is
optimising for a Klaviyo import step plus an unaudited client matrix. **Our conservatism is a deliberate
purchase of predictability, not an oversight** — but the three-exception framing is a genuinely useful
review lens, and it appears in the pattern catalogue as **P-06**.

---

## 5. Responsive strategy

The load-bearing rule, and the strongest agreement with our standards:

> **An email must be legible and functional at a minimum width of around 280px, with no `<style>` element
> available at all.**

Two properties of that rule deserve attention:

- **280px is narrower than our own working floor.** Our geometry work assumes a 320px mobile viewport. 280px
  is a stricter budget, and it is the right way to state the constraint: as a *guaranteed floor*, not a
  *typical device*.
- **"With no `<style>`" makes the floor structural.** This is the same principle as our §8.4 and our
  Cerberus-derived "structure carries the layout; CSS refines it" — reached independently, by a different
  author, from a different starting point.

Media queries are treated as **refinement only**. Nothing structural may depend on one.

**This is the single most important agreement in this document.** Our rule was learned expensively, from
Gmail app rendering on non-Google accounts. Finding it stated as a first principle by an independent
authority means the rule is **settled** and should stop being re-argued.

---

## 6. Outlook / MSO strategy

Two specific findings, both narrower and more precise than the folklore version:

**6.1 Conditional comments are not version-targeting.** The `mso` conditional expression is documented as
matching the Word rendering engine, not a numbered Outlook release — so treating conditionals as a version
switch is a misreading. Any behaviour difference between Outlook releases must be handled by the markup
inside the conditional, not by trying to select a release with it.

**6.2 The 120dpi problem is a document-level setting, not a per-element fix.** Outlook on Windows at 120dpi
scales dimensions expressed in some units but not others, producing layouts that are correct at 96dpi and
subtly wrong at 120dpi. The documented remedy is a **document-level DPI declaration in the head**, paired
with the Office XML namespace on the root element — one declaration, not a per-element workaround.

**Gap on our side, recorded.** Our documentation does not currently address 120dpi at all. Our templates
declare the Office namespace, but the DPI declaration itself is worth verifying. This is **P-09** in the
catalogue and is listed in `Future-Research.md` §3 as needing reproduction before any ECP.

**6.3 A margin caveat we do not have.** Outlook 2007–2019 is documented as not painting an element's
background colour underneath its own margin area. So a coloured block spaced with margin can show the
*parent's* colour in the gap where every other client shows the block's own. This is a real, narrow defect
that our standards do not name — see goal 15.

---

## 7. Dark mode strategy

**Absent.** There is no dark-mode chapter and no dark-mode rules.

This is a documented gap in the source, not a position it takes. It is worth recording explicitly, because
the absence is easy to misread as "dark mode is not an issue".

**Our coverage is materially ahead here.** `CLAUDE.md` §9.6 carries a specific, hard-won rule this source
has no equivalent of: **never use the `background` shorthand in a dark-mode rule, because it resets
`background-image` to `none` and therefore deletes the background image of every element it matches.** That
defect presents as a layout fault and is routinely misdiagnosed as positioning. Nothing in this source would
have caught it.

**Conclusion:** on dark mode we are the more advanced document. Do not treat this source's silence as
permission.

---

## 8. Accessibility strategy

Several concrete rules, and one omission.

- **`lang` must be declared twice** — on the root element *and* on a wrapping element inside the body.
  The reason is that some clients strip or relocate the document shell, discarding the root attribute; the
  inner declaration survives. **We currently set `lang` once.** This is a small, cheap, real improvement —
  **P-13** in the catalogue.
- **Avoid HTML5 sectioning elements** (`header`, `main`, `footer`, `article`, `section`) because Gmail and
  Outlook.com are documented as removing or mangling them. Use `<div>` and rely on **implicit ARIA roles**
  rather than sectioning tags. This aligns with our all-table structure by a different route.
- **`role="presentation"` on every layout table** — identical to our §9.5.
- **Reading order must be correct in source**, not corrected visually — identical to our §9.5.

**The omission:** there is no chapter on buttons, and accessibility coverage stops well short of contrast
ratios, tap-target sizing, and motion. Our §9.5 (WCAG AA contrast, ≥14px body copy, ≥44px tap targets
achieved with padding) has no counterpart here.

---

## 9. Component and reuse model

**None.** This source has no component library and does not attempt one. Reuse is left to the reader.

That is a real limitation relative to our §7 component set — but it also isolates the finding that
**rules and components are separable concerns.** Our system has both; this source has only the first and is
still valuable. It confirms our layering is sound rather than redundant.

---

## 10. Theming and token model

**None.** No tokens, no theme layer, no multi-brand concept. Brand variation is outside its scope entirely.

Our `Design.md`-per-brand token model, and the §7 rule that a brand difference is a **token change, never a
structural rewrite**, has no counterpart in any of the three ruleset-style sources. Multi-brand is a
capability we hold that this source does not address — goal 16.

---

## 11. Tooling and dependency profile

**Zero.** No Node, no build, no package, no compile step. Nothing to break, nothing to maintain, nothing to
version-pin.

**This is the most transferable property of the source** and it is the one that most closely matches our
own operating model. See `Framework-Comparison.md` §5 for why zero-dependency matters more in our
environment than in an agency's.

---

## 12. Client-support claims and substantiation

Claims are **specific and named** — a rule cites the client and version that motivates it (Gmail, Outlook
2007–2019, Yahoo/AOL, Orange webmail, Samsung). That is a materially better evidence standard than "works
everywhere".

Named client behaviours recorded, each of which is a **medium-confidence claim we have not reproduced**:

| Client | Documented behaviour |
|---|---|
| **Gmail** (non-Google account / GANGA) | `<style>` is stripped entirely and permanently |
| **Yahoo / AOL** | May remove `role="presentation"`; converts an HTML `height` attribute to `min-height` |
| **Yahoo Android** | Strips `<style>` from the first `<head>` |
| **Orange webmail** | Forces top vertical alignment on every cell |
| **Outlook 2007–2019** | Does not paint an element's background under its own margin |
| **Android 4.4** | Injects a margin on a specific `<div>` shape |
| **Samsung Mail** | Constrains the message body width |

**The Yahoo height→`min-height` conversion is the reason this source keeps the HTML `height` attribute** even
where it otherwise prefers styles: a `min-height` is a floor that content can grow past, whereas the CSS
`height` would have been a fixed ceiling. That is a well-reasoned exception and it is **directly relevant to
our own reserved-height product cards** (§8.3) — see goal 14.3.

---

## 13. Where it AGREES with our standards

Each row is a rule of ours that this source reaches **independently**. Per `README.md` §6.4, agreement
settles a rule.

| Our rule | This source | Status |
|---|---|---|
| §8.4 structure must work without `<head>` CSS | Must work with no `<style>` at all | **SETTLED** |
| §8.4 / §8.8 media queries refine, never structure | Media queries are refinement only | **SETTLED** |
| §8.4 fluid width, never a fixed-width-only container | Must be legible at ~280px | **SETTLED** — and their floor is stricter |
| §9.5 `role="presentation"` on layout tables | Same rule | **SETTLED** |
| §9.5 logical reading order in source | Same rule | **SETTLED** |
| §8.8 six-digit hex only | Same rule | **SETTLED** |
| §8.8 never rely on CSS inheritance across nested tables | Restates inherited text properties | **SETTLED** |
| §8.8 `align="center"` paired with `margin:0 auto` | Named as an explicit attribute exception | **SETTLED** |
| §8.4 width attribute paired with an inline `width:100%` | Named as an explicit attribute exception | **SETTLED** |
| §8.1 keep `border` / `cellpadding` / `cellspacing` attributes | Retained deliberately, not legacy | **SETTLED** |
| §9.4 meaningful alt text; empty alt only when decorative | Same rule | **SETTLED** |
| §8.8 `alt=""` rather than a missing alt attribute | Same rationale | **SETTLED** |
| Cerberus-derived: styles belong on the `<td>` | Consistent | **SETTLED** |

Fourteen independent agreements is the substantive result of this research. **These rules are no longer
open questions and should not be re-litigated in future drafts.**

---

## 14. Where it DISAGREES with our standards

Three genuine conflicts. We resolve two in our favour with stated reasons, and one in theirs.

### 14.1 Tables as default vs tables as remedy — **we hold our position**

*Them:* tables only for the three named remedies; `<div>` otherwise.
*Us:* §8.1 mandates table-based layout throughout.

**Resolution: keep ours.** Two reasons this source does not have to account for:

1. **Klaviyo re-parses and rewrites the HTML on import.** Our §8.2 exists because that rewrite detached an
   `href` from a block wrapper and produced a card that rendered but was not clickable. A hand-tuned
   `<div>` structure has a larger surface for that class of surprise, and we cannot audit the rewriter.
2. **Our client matrix is broader than one developer can personally test.** A table structure degrades
   toward "ugly but present"; a `<div>` structure degrades toward "collapsed". Our §8.8 rule is
   *degradation is acceptable; disappearance is not*.

The three-exception framing is still adopted — as a **review lens** (P-06), used to ask "which remedy is
this table serving?" and to delete tables that serve none. That is `CLAUDE.md` §8.1's *"avoid unnecessary
nested tables"* given a concrete test.

### 14.2 Prefer margin/padding over spacer cells — **we hold our position, with their caveat noted**

*Them:* space with margin and padding; avoid empty cells and `<br>`.
*Us:* §8.8 mandates a **sized spacer row** with a real height, `font-size:0`, `line-height:0`,
`mso-line-height-rule:exactly` and `&nbsp;` content.

**Resolution: keep ours** — because our rule was written to fix a defect this source's rule cannot address.
§8.3 records that `height` and `padding` on the same cell resolves to **50px in content-box engines and 36px
in border-box engines**, silently changing a reserved region's size per client and misaligning everything
below it. Moving the gap into its own sized row makes the total height unambiguous. Our spacer is a
*measured element*, not an empty ghost cell, and §9.2 already draws that distinction.

**Their caveat is a genuine addition, though:** Outlook 2007–2019 not painting a background under a margin
is a real defect, and it *strengthens* our position rather than weakening it — a padded/margined spacer
inside a coloured band is exactly where that defect would bite, and our §8.8 rule to carry the section
`bgcolor` onto the spacer already immunises us.

### 14.3 The HTML `height` attribute — **their reasoning is better than ours; adopt the awareness**

They keep the HTML `height` attribute specifically because **Yahoo and AOL convert it to `min-height`**.

That is a more precise reason than we have recorded. Our §8.3 requires `height` on the attribute *and*
`height` in the inline style, on the assumption both are ceilings. If Yahoo/AOL treat the attribute as a
floor, then in those clients **a reserved-height product-card region can grow past its reserved height** and
the equal-height guarantee is weaker there than we have documented.

**Action:** this is not a code change and not an ECP yet — it is a **reproduction task**. Recorded as
**P-10** in the catalogue and in `Future-Research.md` §3.1 as the single highest-value verification item
produced by this entire research exercise.

---

## 15. What it can do that we cannot

1. **Name the 120dpi Outlook defect and its document-level remedy.** We have no coverage of this (P-09).
2. **Name the Outlook 2007–2019 background-under-margin defect.** Not in our documentation.
3. **Name the Yahoo/AOL `height` → `min-height` conversion.** Not in our documentation, and it interacts
   with a guarantee we rely on (§14.3).
4. **Name the Orange webmail forced top-alignment.** Our §8.3 depends on `valign` for card regions; a client
   that forces top alignment would break a `valign="middle"` price row. Untested by us.
5. **State a stricter width floor (~280px)** than our working 320px assumption.
6. **`lang` declared twice** for shell-stripping clients (P-13).
7. **Avoid HTML5 sectioning elements** for named clients — a rule we arrive at by accident (we use tables)
   rather than by intent, which means nothing stops a future author from reaching for `<section>`.

Items 1–4 are all **client-behaviour knowledge**, which is the category where an independent researcher who
tests personally will always be ahead of a documentation-driven system. That is the honest gap.

---

## 16. What we can do that it cannot

1. **Multi-brand token architecture** — `Design.md` per brand, brand difference as a token change.
2. **A component library** with propagation discipline (§7 "fix once, propagate immediately").
3. **Dark mode**, including the `background`-shorthand defect that deletes background images (§9.6).
4. **Accessibility beyond semantics** — WCAG AA contrast, ≥14px body copy, ≥44px tap targets via padding.
5. **Hero geometry as a governed engineering problem** — the aspect-locked band, the artwork contract, and
   the `W* = (inset + copy_width) ÷ k` feasibility test. No source of the five has anything comparable.
6. **Dynamic-data engineering** — fallbacks, empty-loop handling, the §8.7 rule that a template tag emitting
   HTML must never sit inside an attribute. Entirely outside this source's scope.
7. **A governance layer** — ADRs, ECPs, change tiers, QA gates, architecture locks.
8. **Marketing composition as an engineering concern** (§15 of the Hero standard, ADR-009).

---

## 17. Adoption risk

Low in kind, because there is nothing to adopt structurally — but two real risks:

- **Selective quotation.** Because it is prose, a single sentence can be lifted to justify a change without
  its surrounding reasoning. Every citation must carry the reason, not just the rule.
- **Environment mismatch on tables.** Adopting §14.1 wholesale would trade predictability under Klaviyo's
  import rewrite for leaner markup. That is a bad trade for us and a fine one for a developer who controls
  the sending platform.

**It is a living document**, so a claim can change under us. Cite the fetch date.

---

## 18. Verdict

> **STUDY — HIGH VALUE. The most useful of the five sources. Adopt as a review lens and as client-behaviour
> intelligence; adopt nothing structurally, because there is nothing structural to adopt.**

**Extracted into the pattern catalogue:**

| Pattern | What is extracted | Verdict there |
|---|---|---|
| **P-06** | Tables-as-remedy, used as a review lens on our own nesting | Adopt as lens |
| **P-09** | Outlook 120dpi document-level DPI declaration | Verify, then ECP |
| **P-10** | Yahoo/AOL `height` → `min-height` — affects reserved-height cards | **Verify — highest priority** |
| **P-13** | `lang` declared twice | Adopt (cheap, safe) |
| **P-14** | The ~280px no-`<style>` floor as a stated budget | Adopt as a QA assertion |

**Rejected:** tables-as-default replacement (§14.1), margin-over-spacer-rows (§14.2).

**Settled by agreement:** the fourteen rules in goal 13.

**Nothing from this source is binding until it passes an ECP.**

---

*Research notes, non-normative. Compiled 2026-07-29. Source is a living document — re-verify before citing.*
