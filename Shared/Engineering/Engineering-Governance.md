# Engineering Governance

| | |
|---|---|
| **Status** | ACTIVE |
| **Version** | 1.0.0 |
| **Owner** | Project Owner |
| **Applies to** | **Klaviyo Campaign Email System** · **Klaviyo Flows Automation System** |
| **Mirroring** | Byte-identical copies in both projects. Both canonical. Any change applies to both in the same edit. |
| **Scope** | Authority, approval and ownership. **Contains no build rules.** |

> **This document says who may change engineering standards and under what authority.**
> The mechanics of making a change are in `Engineering-Change-Management.md`; version semantics are in
> `Engineering-Versioning.md`. Read this one first — it determines whether you are permitted to proceed at
> all.

---

## 1. Why governance exists here

A two-person-plus-AI operation does not need a committee. It needs **one thing**: a rule that prevents a
standard from being changed on a suspicion, by someone who will not be the one paying for the regression.

Every governance rule below traces to a real failure mode in this repository's history:

| Failure mode observed | Governance control |
|---|---|
| A parameter tuned repeatedly without the mechanism being named | **Evidence requirement** (§4.2) — a change must name the mechanism, not the symptom |
| A "permanent" rule reversed once the geometry was understood | **Supersession procedure** (§7) — reversals are recorded with reasons, never silent |
| A settled component re-opened for cosmetic reasons | **Locking authority** (§5) — locked components have a bounded change list |
| Knowledge applied inconsistently because it lived only in one template | **Propagation duty** (§6.3) — a fix is not complete until it reaches the shared component and the standard |
| A figure published without being computed | **Author's verification duty** (§4.3) |
| Documentation edited in one project and not the other | **Mirror duty** (§6.4) — a one-sided edit is a defect, not a partial success |

---

## 2. Roles

Three roles. One person or agent may hold more than one, **except where §3 forbids it.**

### 2.1 Owner

**The human accountable for both projects.** Currently the Project Owner.

**Exclusive authority — cannot be delegated to an AI assistant or an implementer:**

- Approving any **T3** or **T4** change (§3.1): a new standard, a superseded standard, a changed
  architecture, a changed prohibition, a changed approval gate.
- Approving promotion of any build to `Output/`, and approving activation of a flow or a send.
- Granting a **named exception** to a standard (§8).
- Unlocking a locked component, or approving a change to one under its qualifying reasons.
- Accepting a documented **degradation** or an accepted limitation as shippable.

### 2.2 Implementer

**Anyone executing a change** — a developer, or an AI assistant such as Claude Code.

**May do without asking:**

- Build and revise templates in `Draft/` within the existing standards.
- Fix a defect **inside** a template where the standard already prescribes the fix.
- Make **T1** changes (§3.1): typos, broken links, formatting, a corrected computed figure whose conclusion
  is unchanged.
- Add or correct **provenance** — recording which client, template and cost produced a rule.
- Propose anything, at any tier.

**May never do:**

- Approve their own T2–T4 change.
- Change a standard, a prohibition, a gate or a locked component without Owner approval.
- Promote to `Output/` or activate a send.
- Weaken a gate to make a build pass.
- Silently absorb a conflict between a build and a standard. **Surface it.**

### 2.3 Reviewer

**Whoever runs the gates in `Engineering-QA-Process.md`.** May be a human, or a second, independent AI pass
with the diff and the standard in context.

- For **T3 and T4 changes, and before any promotion to `Output/`, the Reviewer must not be the
  Implementer.** This mirrors the Campaign project's existing operating decision that reviewer ≠ author
  (`Decision-Log.md` D-04) and extends it to engineering standards.
- The Reviewer's output is a **verdict with evidence**, never an opinion: which checks ran, which passed,
  which could not be verified in this environment.
- A Reviewer who cannot verify a check **records it as unverified.** Recording a check as passed when it was
  not run is the single most serious process failure available here, because it converts an unknown into a
  false assurance.

### 2.4 AI assistants specifically

An AI assistant is an Implementer, and additionally:

- **Must read the applicable standard before acting**, not after producing a draft. For a Hero, STD-HERO's
  geometry gate must be computed *before* artwork is commissioned.
- **Must not begin a new template with HTML.** STD-CREATIVE (`Shared/Creative-Workflow-Standard.md`) is the
  first document to read for any new email design, and its Creative Exploration and Marketing Review stages
  are completed and approved before markup exists. Once a creative direction is approved it is **locked**:
  an Implementer may refine the implementation but may not redesign the concept during the build
  (STD-CREATIVE §8).
- **Must not infer a rule from a pattern.** A plausible-looking tag name, property or measurement that is not
  in a project file or a provider reference is an invention. *(A guessed Klaviyo variable survived seven
  template revisions and forty markdown files precisely because it looked right.)*
- **Must treat a project file as beating chat history**, always, including its own earlier statements in the
  same session.
- **Must report what it could not verify** rather than presenting a plausible completion.
- **Must not open a locked component** on a casual request. Establish the qualifying reason first, and say so
  if none applies.

---

## 3. Change authority

### 3.1 Tiers

| Tier | Change | Version impact | Proposal | Approver | Independent review |
|---|---|---|---|---|---|
| **T1** | Editorial: typo, link, formatting, clarification that changes no requirement; a corrected computed figure whose verdict is unchanged | PATCH | not required | Implementer | not required |
| **T2** | Additive: a new check, a new worked example, new provenance, a tightened wording that forbids nothing new | MINOR | short note in the change log | Implementer, with the Owner notified | recommended |
| **T3** | Normative: a new requirement, a new prohibition, a changed gate, a changed default, a new standard | MINOR or MAJOR | **required** (ECP) | **Owner** | **required, independent** |
| **T4** | Architectural: an existing conforming template becomes non-conforming; a standard is superseded or retired; a locked component's architecture changes | **MAJOR** | **required** (ECP) + migration plan | **Owner** | **required, independent** |

**Tier is decided by consequence, not by effort.** A one-word change that makes existing templates
non-conforming is T4. A 400-line document restructure that changes no requirement is T1.

### 3.2 Worked classifications from this project's actual history

| Change | Tier | Why |
|---|---|---|
| Correcting a published contrast figure from `8.10:1` to `6.86:1` (both pass AA) | **T1** | The number was wrong; the requirement and the verdict did not move |
| Adding the "orange inverts on dark surfaces" contrast table | **T2** | Additive guidance; forbids nothing that was previously allowed |
| Recording `class="unstyle-auto-detected-links"` as required on footer address blocks | **T3** | New requirement; existing templates lacking it become non-conforming on their next revision |
| Establishing the Hero standard and prohibiting left/right overlay Heroes | **T4** | Architectural; changes what a Hero *is* |
| Superseding "copy baked into Hero artwork" | **T4** | Reverses a rule previously marked permanent; changes the artwork brief |
| Adopting Cerberus hybrid stacking as the default for multi-column rows | **T4** | Existing media-query-stacked rows became non-conforming technical debt |

### 3.3 What no tier permits

Regardless of tier or approval, the following are **not available as changes**:

- **Weakening a gate to make a specific build pass.** If a build cannot pass, the build changes or the
  limitation is documented and accepted by the Owner as an exception (§8) — the gate does not move.
- **Recording an unverified check as verified.**
- **Deleting history.** Superseded rules are marked, never removed (§7.3).
- **Editing an upstream vendored file** (`Shared/Frameworks/Cerberus/` upstream files). Refresh is a
  re-vendor operation, not an edit.
- **Retro-breaking approved work** without a migration plan (§10).

---

## 4. When standards may be updated

### 4.1 The five qualifying reasons

Adapted from the component-locking policy, and applied to **standards** as well as components. A standard is
updated only when one of these holds:

1. **A verified defect** — reproduced in a **named client**, not suspected, not inferred, not reasoned-about.
2. **A client compatibility change** — a client's behaviour changed, or a new client entered the support set.
3. **An accessibility requirement** — a WCAG or platform obligation not currently met.
4. **A new brand or business requirement** that the current standard cannot express.
5. **An approved architectural revision** — an investigation has produced a better mechanism, with evidence.

**"It would look better", "this feels cleaner", and "let's try X" are not qualifying reasons.** They are
valid *proposals* under reason 5, but they must first produce the investigation.

### 4.2 Evidence requirement — the load-bearing control

Every T3 and T4 change must state, in the proposal:

- **The mechanism.** Not the symptom. *"Copy overruns the artwork feature by 74px at 375px because drift
  accumulates at k px per px of lost width"* is a mechanism. *"The hero looks broken on mobile"* is a symptom.
- **The reproduction.** Which client, which version, which viewport, which account type. For Gmail,
  specify **Google vs non-Google account** — the `<head>`-CSS-stripping path is a different renderer in
  practice.
- **The measurement.** Computed, with the working shown, at the widths that matter (320 / 375 / 414 / 600).
- **The blast radius.** Which existing templates become non-conforming, and what the migration is (§10).
- **The alternatives rejected**, and why. This becomes the ADR's "Alternatives" section.

**A proposal that cannot supply a mechanism is refused, however plausible it sounds.** This is the control
that would have stopped the 16-draft crop cycle at draft 2.

### 4.3 Author's verification duty

The author of any figure published in a standard **computes it and shows the working.** Carrying a number
forward from another document is not verification. Applies to contrast ratios, aspect ratios, critical
widths, column arithmetic, file sizes and asset dimensions.

### 4.4 Cadence

There is no scheduled review cycle, deliberately — a calendar review invites churn (README §5.8). Standards
are reviewed **when triggered**:

- A qualifying reason arises (§4.1).
- A gate fails repeatedly for the same reason across different builds — that is a signal the **standard** is
  wrong, not the builds.
- A vendored reference is re-vendored at a new commit.
- A **post-incident review** after any defect that reaches `Output/` or a send (§9).

---

## 5. Locking authority

**Component and standard locking is an Owner power.**

- A component is marked `ARCHITECTURE LOCKED` in the document that owns it. For the Hero, the policy and the
  five qualifying reasons live in **STD-HERO §12.5** and are not restated here.
- **An Implementer may not unlock, and may not change a locked component**, even for a change that appears
  trivial. The correct response to a casual request is to establish which qualifying reason applies and, if
  none does, say so and redirect the effort to unlocked work.
- **A lock is not a production sign-off.** `ARCHITECTURE LOCKED` means the engineering is settled; it says
  nothing about client validation. The two states are recorded separately (ADR-008).
- Any change made under a qualifying reason ships as a **new draft version**, states the reason in the file
  header, and re-runs the **regression evidence set** against the previous baseline —
  `Engineering-QA-Process.md` §6.

---

## 6. Documentation ownership

### 6.1 The ownership rule

**Every engineering fact has exactly one owning document.** Other documents may reference it; none may
restate it. A fact found in two documents is a defect to be resolved, not a redundancy to be tolerated —
because when they drift, nothing tells you which is current.

### 6.2 Ownership matrix

| Owns | Document | Must never contain |
|---|---|---|
| **The order of execution for new email design** — the creative phase, reference analysis, the Marketing Review gate, the Creative Lock | **STD-CREATIVE** (`Shared/Creative-Workflow-Standard.md`) | Build rules of any kind; brand values; send/flow values. It is first in **sequence**, not first in **authority** |
| Governance, authority, approval, roles | `Engineering-Governance.md` (this file) | Build rules of any kind |
| Why a decision was made | `Architecture-Decision-Records.md` | The rule itself (that is the standard's) |
| Version semantics, deprecation, rollback | `Engineering-Versioning.md` | Change procedure |
| Change procedure and evidence templates | `Engineering-Change-Management.md` | Version semantics |
| Document hierarchy, layer responsibilities, precedence | `Engineering-Document-Relationships.md` | Any normative rule |
| The QA **process** and its gates | `Engineering-QA-Process.md` | The Hero checklist (STD-HERO §11 owns it) |
| **All Hero architecture, geometry, artwork acceptance, Hero locking** | **STD-HERO** (`Shared/Email-Hero-Engineering-Standard.md`) | Brand values, flow/campaign specifics |
| Rendering mechanisms and the client defect index | `Shared/Frameworks/Cerberus/*` (ours), vendored upstream (never edited) | Brand, product or send values |
| Per-project workflow, build standards, QA gates, prohibitions | `<project>/CLAUDE.md` | Brand values, send/flow copy |
| Brand facts (identity, URLs, hosted assets, footer, integration) | the brand's config document | Visual system, flow logic |
| Visual system (colour, type, spacing, components, measurements) | the brand's design document | Brand facts, flow logic |
| One send's or one flow's spec | the send brief / flow spec | Brand values, global rules |

### 6.3 Propagation duty

**A fix is not complete when the template renders correctly.** It is complete when:

1. The template is fixed, **and**
2. the fix is back-ported into the **shared component**, **and**
3. if the lesson generalises, it is promoted into the **standard or `CLAUDE.md`**, **and**
4. all of that happens in the **same change**.

A fix that lives only in one template guarantees the defect returns in the next one. This is the mechanism by
which most of both projects' build standards were created, and it is mandatory, not aspirational.

### 6.4 Mirror duty

Files in `Shared/Engineering/` and STD-HERO exist as **byte-identical copies in both projects, both
canonical.** A change applied to one copy and not the other is a **defect**, not partial progress. Verify by
hash as a release step — `Engineering-Change-Management.md` §7. Rationale: **ADR-007**.

---

## 7. Backward compatibility policy

### 7.1 Grandfathering is the default

**A standard change does not retroactively make approved work defective.** When a standard is superseded:

- **Templates already approved and in `Output/` remain valid.** They were built to the standard in force, and
  they were validated. They are not retrofitted without a specific Owner instruction.
- **The next revision of a template adopts the current standard.** Conformance is checked at the point of
  change, not continuously.
- **A template records which standard versions it was built to** in its header comment, so its conformance is
  auditable without guesswork (`Engineering-Versioning.md` §5).

**Worked precedent:** when the "copy baked into Hero artwork" rule was superseded, existing approved Campaign
templates were explicitly grandfathered and the supersession was scoped to new work.

### 7.2 When grandfathering does not apply

Retrofitting is **mandatory**, on the Owner's instruction, when the defect is:

- a **compliance** failure — unsubscribe or preference mechanism broken or absent,
- a **legal or factual** error — wrong entity, wrong address, a stale year, an unapproved claim,
- a **dead or wrong destination** — a 404, or a link pointing somewhere it should not,
- a **security or privacy** issue.

These are not standards questions; they are correctness questions, and a grandfather clause does not cover
them.

### 7.3 Superseded rules are retained, never deleted

A superseded rule stays in place, marked **SUPERSEDED**, with:

- the date, the superseding document and section,
- **a fair statement of why it was originally right** — not a dismissal,
- what still stands from it,
- the grandfathering scope.

**Rationale:** a deleted rule is re-invented. A rule marked superseded *with its original reasoning intact*
is the only form that stops the next contributor from proposing it again. The superseded baked-in-copy rule is
the template for how to do this.

---

## 8. Named exceptions

An exception permits one template to depart from a standard. It requires:

1. **Owner approval**, explicitly, for **that named template**.
2. **The reason, recorded in the template header and in the owning brand document** — not in a chat thread.
3. **The accepted cost, stated.** *"White label on brand orange, 2.59:1, fails AA; accepted at explicit
   request to match the approved reference"* — not *"design preference"*.
4. **A one-token reversal path** where possible, recorded.

**An exception applies to that template only and never travels.** A new template inherits the *rule*, not the
exception. A precedent exists: a white CTA label was granted for two templates and, when a third was built,
the standard applied and the AA-compliant colour was used.

**Exceptions are not a pressure valve for a gate that is inconvenient.** If exceptions cluster around one
rule, the rule is wrong — open a T3 proposal (§4.4).

---

## 9. Post-incident review

Any defect that reaches `Output/`, a send, or an activated flow triggers a review. It is short, and it is not
about blame:

1. **What shipped, and what did the reader see?**
2. **Which gate should have caught it, and why did it not?** Missing check · check not run · check run and
   misread · no gate existed.
3. **What is the mechanism?** Not the symptom.
4. **Which control changes?** A new automated scan is worth more than a new paragraph — a scan cannot be
   forgotten.
5. **Does an ADR need writing or amending?**

**Prefer an automated check over a written rule** wherever the defect is machine-detectable. Most of this
project's expensive defects were detectable by a grep: an anchor imbalance, a `cover` count, a `background`
shorthand in a dark-mode block, a template tag inside an attribute.

---

## 10. Migration policy

When a T4 change makes existing templates non-conforming, the proposal must carry a **migration plan** before
approval.

### 10.1 Required content

| | |
|---|---|
| **Inventory** | Every affected file, listed. Not "the RDD templates" — the actual paths. |
| **Classification** | Per file: **retrofit now** · **retrofit on next revision** · **grandfathered permanently** · **retire** |
| **Order** | Which first, and why. Highest-traffic or highest-risk first. |
| **Per-file cost** | Realistic. *"src swap, 10 lines"* is a different decision from *"rebuild four sections"*. |
| **Regression evidence** | What must be hashed and compared against the pre-migration baseline (§5, QA §6) |
| **Validation** | Which client matrix runs, and on which files — not all of them, necessarily |
| **Rollback** | The specific prior draft versions to reinstate, by name |

### 10.2 Migration rules

- **Migrate one file per draft version.** Never batch-edit templates across a migration; the draft trail is
  the rollback mechanism and batching destroys it.
- **A migration that cannot be validated is not scheduled.** If the client matrix cannot be run, the
  migration waits — an unvalidated migration converts working templates into unknown ones.
- **Known debt is recorded, not hidden.** Where a migration is deferred, it is written into the owning
  document as explicit technical debt with its consequence stated. Two examples currently carried: multi-
  column rows that stack by media query rather than hybrid columns (degraded, not broken, when `<head>` CSS
  is stripped), and a reference component still reflecting a superseded pattern.
- **Deferred debt must name its consequence.** "Not yet migrated" is not a record; "compresses rather than
  stacks on the Gmail app with a non-Google account" is.

---

## 11. Governance of this document

This file is governed by its own rules. Changing §2 (roles), §3 (authority) or §4.1 (qualifying reasons) is a
**T4** change requiring Owner approval, an ECP and an ADR. Everything else follows §3.1.

---

*Companion documents: `Engineering-Change-Management.md` (how) · `Engineering-Versioning.md` (versions) ·
`Architecture-Decision-Records.md` (why) · `Engineering-QA-Process.md` (proof) ·
`Engineering-Document-Relationships.md` (where).*
