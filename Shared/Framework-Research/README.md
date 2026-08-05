# Shared/Framework-Research — external research, quarantined

| | |
|---|---|
| **Status** | ACTIVE — **NON-NORMATIVE** |
| **Version** | 1.0.0 |
| **Owner** | Project Owner |
| **Applies to** | **Klaviyo Campaign Email System** · **Klaviyo Flow and Claude Code** |
| **Mirroring** | Byte-identical copies in both projects. Both canonical. Any change applies to both in the same edit (ADR-007). |
| **Established** | 2026-07-29 |

---

## 1. The primary rule, before anything else

> ## ⛔ NOTHING IN THIS FOLDER GOVERNS A BUILD.
>
> **Cerberus remains the ONLY production rendering framework.** Every template in both projects is built
> from Cerberus mechanisms plus our own approved standards, and nothing else.
>
> **No HTML, CSS, VML, media query, class name, generated output or component file from any framework
> documented here may be copied into a template, a component, a snippet or a standard.**
>
> This folder contains **engineering concepts only** — the *reasoning* other projects arrived at, recorded
> so we can compare it against ours. A concept becomes binding **only** after it passes through
> `Shared/Engineering/Engineering-Change-Management.md` as an ECP and is written into a standard. Until
> then it is reading material.

### 1.1 Why the quarantine is explicit

An engineering knowledge base that sits next to a production system will be mined for shortcuts. The
failure mode is predictable: someone under time pressure finds a tidy pattern here, pastes it into a
template, and the template inherits an assumption our client matrix does not share. **The quarantine is
the control that prevents research from becoming an undocumented dependency.**

There is also a specific, already-recorded precedent. **ADR-002 §Alternatives** rejected migrating to
MJML, Foundation for Emails or Maizzle to solve a rendering constraint, and found that **MJML's own hero
component would reintroduce a crop our standard prohibits**. Research is useful; adoption is a decision
with consequences.

---

## 2. The three-tier separation

This folder is the third tier. Knowing which tier a document sits in tells you whether it binds you.

```
  TIER 1   STANDARDS            Shared/*.md, Shared/Frameworks/Cerberus/
           NORMATIVE            what a build must do
                                e.g. Email-Hero-Engineering-Standard.md
                ▲
                │  a concept may be promoted upward only via an ECP
                │
  TIER 2   GOVERNANCE           Shared/Engineering/
           NORMATIVE (process)  how standards are decided, versioned, changed, proven
                ▲
                │  research informs proposals; it never bypasses them
                │
  TIER 3   RESEARCH             Shared/Framework-Research/   ← THIS FOLDER
           NON-NORMATIVE        what others concluded, and why
```

**Cerberus sits in Tier 1 and stays there.** It is vendored, unmodified, and it is the external authority
our markup is checked against. The frameworks in this folder are **not** authorities — they are peers whose
reasoning we compare against.

---

## 3. What is in here

| File | Covers |
|---|---|
| `README.md` | This file — the quarantine rule, the tier model, read order, how to promote a finding |
| `Email-Guidelines.md` | Rémi Parmentier's *Email Coding Guidelines* — the most directly useful source of the five |
| `MJML.md` | Mailjet's semantic-markup compiler; component abstraction; `mj-hero`'s two modes |
| `Foundation-for-Emails.md` | ZURB's Inky templating language and its 12-column grid |
| `Maizzle.md` | Utility-first (Tailwind) email development and a configurable transformer pipeline |
| `Really-Good-Emails.md` | A curated gallery — a *composition* and *lifecycle* reference, not an engineering one |
| `Framework-Comparison.md` | The decision matrix across all five, including Cerberus compatibility |
| `Reusable-Engineering-Patterns.md` | The pattern catalogue — 15 families, each with an adopt / reject verdict |
| `Future-Research.md` | What was not covered, what to verify, and the open questions worth answering next |

---

## 4. Read order

**By intent, not front to back.**

### 4.1 I want to understand how our rules compare to the industry

```
1  Email-Guidelines.md          ← closest in kind to our own standards; start here
2  Framework-Comparison.md      ← the matrix
3  Reusable-Engineering-Patterns.md
```

### 4.2 Someone has proposed adopting a framework

```
1  Framework-Comparison.md      ← the verdict per framework
2  the framework's own file
3  Shared/Engineering/Architecture-Decision-Records.md  ← ADR-001 and ADR-002 already decided this
4  Shared/Engineering/Engineering-Change-Management.md  ← the path a proposal must walk
```

### 4.3 I am looking for a technique we do not have

```
1  Reusable-Engineering-Patterns.md    ← check the catalogue and its verdicts first
2  Shared/Frameworks/Cerberus/Cerberus-Techniques.md   ← we may already have it
3  the framework files, for the reasoning behind an unfamiliar approach
4  raise an ECP if it is genuinely new and genuinely needed
```

**Do not read this folder to build a template.** It contains no build rules. For that, follow the read
order in the project's `CLAUDE.md`.

---

## 5. How a finding is promoted

A concept in this folder becomes binding through exactly one route:

```
1  finding recorded here, with its source
2  ECP raised in Engineering-Change-Management.md §13
     - mechanism, not "framework X does it this way"
     - reproduction in a NAMED client, per the evidence bar (§2.2)
     - blast radius across existing templates
3  Owner approval (T3 / T4 changes are Owner-only)
4  written into a STANDARD or into CLAUDE.md, versioned, mirrored
5  ADR recorded if it is an architectural decision
6  the entry here updated to point at the standard that now owns it
```

**"MJML does it this way" is not evidence.** The evidence bar requires a mechanism and a reproduction. A
framework's popularity is not a reproduction — see `Engineering-Change-Management.md` §2.2.

---

## 6. Research philosophy

Six principles, each learned from a real cost already recorded in this repository.

### 6.1 Read the reasoning, not the output

The valuable part of another project is *why* it chose a technique, including what it accepted as the
cost. Copying the output imports the cost without the reasoning.

### 6.2 A framework's abstraction hides a decision

Every abstraction — `mj-hero`, an Inky `<row>`, a Tailwind utility — encodes decisions its authors made
for *their* client matrix and *their* users. Those decisions may not match ours. **The abstraction is the
thing to inspect, not the thing to adopt.**

### 6.3 Popularity is not evidence

Star counts, adoption and tooling maturity say nothing about whether a technique renders correctly in
Gmail on a non-Google account. Only a reproduction does.

### 6.4 Agreement settles a rule; disagreement is the interesting part

Where an external source independently reaches the same conclusion as one of our rules, that rule is
**settled** and should stop being re-litigated. Where a source disagrees with us, the disagreement is
either a gap in our knowledge or a difference in target environment — and finding out which is the whole
point of the exercise.

### 6.5 A pattern we reject must be recorded as rejected

Otherwise it comes back. Rejections belong in the catalogue with their reasons, exactly as
`Architecture-Decision-Records.md` retains superseded decisions with their original reasoning intact.

### 6.6 Never let research create a dependency

No build step, no npm package, no compile stage, no generated file. Our system is file-driven and its
output is hand-authored HTML. That is a deliberate architecture, not a limitation to be modernised away —
see `Framework-Comparison.md` §5.

---

## 7. Confidence and verification limits — read before citing this folder

**These documents were compiled from each project's public README and documentation site, fetched
2026-07-29. They are not the product of reading each framework's full source tree.** That matters for how
much weight a claim here can carry:

| Confidence | What it covers | How to treat it |
|---|---|---|
| **High** | A framework's stated purpose, philosophy, component inventory, documented behaviour, maintenance status | Citable as "framework X documents Y" |
| **Medium** | Implementation mechanics described in documentation but not verified against source | Verify before relying on it in a proposal |
| **Low** | Inferences about *why* a framework made a choice, where it is not stated | Flagged inline as inference. Never citable as evidence |

**Nothing here has been render-tested by us.** No claim in this folder about client behaviour is a
substitute for the §9.1 client matrix. `Future-Research.md` lists the specific items that need source-level
verification.

---

## 8. Relationship to the rest of the system

| This folder is NOT | It IS |
|---|---|
| A replacement for Cerberus | A set of peer comparisons against Cerberus |
| A source of production code | A source of engineering concepts |
| A standard | Reading that may *inform* a standard, via an ECP |
| A component library | A catalogue of patterns with verdicts |
| Normative | Non-normative, permanently |

**Discoverability note.** This folder is deliberately not yet referenced from either `CLAUDE.md` or
`Shared/Engineering/README.md`'s standards register, because it is not a standard and this task was scoped
to exclude modifying those documents. Adding a one-line pointer from each is recommended as a follow-up —
see `Future-Research.md` §6.

---

## 9. The 18 research goals — the canonical structure of every source document

Every source document in this folder answers the same eighteen questions, in the same order, under the same
headings. **The uniform structure is the point:** it makes the five sources directly comparable, it makes an
omission visible rather than invisible, and it stops each write-up from drifting into whatever the source
happens to be good at.

| # | Goal | Asks |
|---|---|---|
| 1 | **Identity and problem solved** | What is it, and which problem was it built to solve? |
| 2 | **Provenance and maintenance status** | Who maintains it, is it alive, under what licence? |
| 3 | **Core architecture** | What is the central mechanism — compiler, templating language, pipeline, prose? |
| 4 | **Layout model** | How is structure expressed, and what does it compile to? |
| 5 | **Responsive strategy** | Media queries, fluid, hybrid, or attribute-driven? What happens without `<style>`? |
| 6 | **Outlook / MSO strategy** | How are the Word engine's limits handled — ghost tables, VML, conditionals? |
| 7 | **Dark mode strategy** | What is provided, and what is left to the author? |
| 8 | **Accessibility strategy** | Roles, language, alt text, reading order, semantics. |
| 9 | **Component and reuse model** | What is the unit of reuse, and how is it composed? |
| 10 | **Theming and token model** | How does one design system become several brands? |
| 11 | **Tooling and dependency profile** | What must be installed, and what breaks when it is not? |
| 12 | **Client-support claims and substantiation** | What compatibility is claimed, and how is it evidenced? |
| 13 | **Where it AGREES with our standards** | Independent agreement — which of our rules this settles. |
| 14 | **Where it DISAGREES with our standards** | Genuine conflicts, and which way we resolve them. |
| 15 | **What it can do that we cannot** | Honest capability gaps on our side. |
| 16 | **What we can do that it cannot** | Honest capability gaps on theirs. |
| 17 | **Adoption risk** | What would go wrong if we adopted it, specifically. |
| 18 | **Verdict** | Adopt as concept / study only / reject — and what is extracted. |

Goals **13–18** are the ones that produce decisions. Goals 1–12 exist so that 13–18 are grounded in
something other than impression.

---

*Established 2026-07-29. Non-normative. Cerberus remains the only production rendering framework in both
projects.*
