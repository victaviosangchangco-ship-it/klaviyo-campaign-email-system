# Engineering Versioning

| | |
|---|---|
| **Status** | ACTIVE |
| **Version** | 1.0.0 |
| **Owner** | Project Owner |
| **Applies to** | **Klaviyo Campaign Email System** · **Klaviyo Flow and Claude Code** |
| **Mirroring** | Byte-identical copies in both projects. Both canonical. Any change applies to both in the same edit. |
| **Scope** | Version semantics, deprecation, rollback. **Contains no build rules and no change procedure** — procedure is in `Engineering-Change-Management.md`. |

> **What a version number is for here:** so that a template built in July can be audited in December
> without anyone having to remember what the rules were in July.

---

## 1. What is versioned, and what is not

| Artefact | Versioned how | Why |
|---|---|---|
| **Standards** (STD-HERO, and any future standard) | **SemVer** `MAJOR.MINOR.PATCH` in the document header | Templates are built *to* a standard; conformance is only meaningful against a version |
| **Governance documents** (this folder) | **SemVer** in the header | They constrain process; a process change must be identifiable |
| **ADRs** | **Not versioned.** Immutable once ACCEPTED; superseded by a new ADR | A decision is a point in time. Versioning it invites rewriting history |
| **`CLAUDE.md`** (either project) | **Not versioned.** Continuously maintained; changes are traceable through the section they touch | It is an operating instruction, read in full every session, not a contract templates are built against |
| **Brand documents** | **Not versioned.** Values carry confidence tags — `[Confirmed]` / `[Inferred]` / `TODO` | The meaningful state is *confidence*, not version |
| **Templates** | **Draft version series** — `-v1`, `-v2`, … monotonically increasing, never reused | The draft trail is the comparison and rollback mechanism |
| **Vendored references** (Cerberus) | **Upstream commit hash + vendor date** | Not ours to version. Refresh is a re-vendor, not an edit |
| **Artwork assets** | Immutable URL + published ratio and bond hex | A changed asset is a **new** asset, not a new version of one |

**Deliberate omission: there is no global "platform version".** A single number that increments when anything
changes tells you nothing useful and invites ceremonial bumps. Traceability comes from **§5** — each template
records the standard versions it was built to.

---

## 2. Standard version numbering

### 2.1 The rule — bump by consequence to built templates

```
MAJOR   an existing CONFORMING template becomes NON-CONFORMING
MINOR   a new requirement or capability; existing conforming templates stay conforming
PATCH   no requirement changes at all
```

**The test is always the same question: *"does a template that was conforming yesterday still conform
today?"*** If no → MAJOR. If yes, and something new is required of future work → MINOR. If yes, and nothing
new is required → PATCH.

This maps exactly onto the change tiers in `Engineering-Governance.md` §3.1:

| Tier | Typical bump |
|---|---|
| T1 editorial | PATCH |
| T2 additive | MINOR |
| T3 normative | MINOR, or MAJOR if it invalidates existing work |
| T4 architectural | **MAJOR** |

### 2.2 MAJOR — worked examples

- **Establishing STD-HERO and prohibiting left/right overlay Heroes** (`1.0.0`). Existing Heroes became
  non-conforming; the architecture of a Hero changed.
- **Superseding "copy baked into Hero artwork".** Reversed a rule previously marked permanent and changed the
  artwork brief.
- **Adopting hybrid stacking as the default for multi-column rows.** Existing media-query-stacked rows became
  recorded technical debt.

A MAJOR bump **requires a migration plan before approval** (`Engineering-Governance.md` §10) and an ADR.

### 2.3 MINOR — worked examples

- Adding the *"two-tier orange inverts on dark surfaces"* contrast guidance. Additive; forbids nothing
  previously allowed.
- Requiring `class="unstyle-auto-detected-links"` on footer address blocks. New requirement; existing
  templates conform until their next revision (grandfathering, `Engineering-Governance.md` §7.1).
- Adding a new automated scan to the QA gates.
- Adding a worked example, a symptom → cause row, or provenance for an existing rule.

### 2.4 PATCH — worked examples

- **Correcting a published contrast figure from `8.10:1` to the computed `6.86:1`.** The number was wrong; the
  requirement (dark ink on brand orange passes AA) did not move. **PATCH, not MINOR** — this distinction
  matters, because treating every correction as a requirement change makes the version history unreadable.
- Fixing a broken cross-reference after a section renumber.
- Restructuring a document for readability with no requirement change.
- Correcting a typo in a hex value **that was correct everywhere it was actually used** — if the wrong value
  reached a template, that is a defect and a `CLAUDE.md`/brand-doc correction, not a version question.

### 2.5 Pre-1.0

A standard under active drafting sits at `0.x.y` and may change without a MAJOR bump. **It also may not be
built against** — a template records only released versions (`≥1.0.0`). Promotion to `1.0.0` requires Owner
approval and an ADR.

### 2.6 Version register

Current versions are held in **`README.md` §3 (the Standards Register)** — one home. This document defines the
semantics; the register holds the values.

---

## 3. Document revisions vs standard revisions

Two different things, often confused:

| | **Standard revision** | **Document revision** |
|---|---|---|
| Changes | What is **required** | How it is **explained** |
| Bump | MAJOR or MINOR | PATCH |
| ADR | Required at T3/T4 | Not required |
| Effect on templates | May change conformance | None, ever |
| Examples | New prohibition; changed gate; changed default | Reordered sections; added diagram; clearer wording; corrected typo |

**The trap to avoid:** a "clarification" that quietly adds a requirement. If a reader could now fail a check
they would previously have passed, it is **not** a clarification — it is a T3 normative change and needs a
MINOR bump and Owner approval. When unsure, ask: *would a previously-passing template still pass?*

---

## 4. Change log discipline

Every versioned document carries its own change-log section (§16 in STD-HERO; the final section here).

Each entry records: **version · date · tier · what changed · why · mirrored to both copies (✔)**.

Rules:

- **Append only.** Never edit or remove a prior entry.
- **One entry per released change**, not one per edit.
- **The mirror confirmation is part of the entry**, not a separate step — an entry without it is incomplete
  (ADR-007).
- A MAJOR entry additionally names the **migration plan** and its status.

---

## 5. Template ↔ standard traceability

**Every template header records the standard versions it was built to.** This is what makes a build auditable
later without archaeology.

```
BUILT TO:  STD-HERO 1.0.0 · Cerberus fa6de2e · <project> CLAUDE.md as of 2026-07-29
```

- Recorded on **first build** and updated only when the template is genuinely re-verified against a newer
  version — not on every unrelated edit.
- A template whose recorded version is behind the register is **not automatically defective**; it is
  **grandfathered** until its next revision (`Engineering-Governance.md` §7.1).
- This is how "which templates need migrating?" becomes a search rather than a memory exercise.

---

## 6. Deprecation

### 6.1 Lifecycle

```
   ACTIVE  ─────▶  SUPERSEDED  ─────▶  RETIRED
      │                 │                  │
  in force       replaced, but        no longer applies
                 retained in full     to anything, incl.
                 with reasoning       grandfathered work
                        │
                        └──▶ never DELETED
```

### 6.2 SUPERSEDED — the required content

A superseded standard or rule **stays in place**, marked `SUPERSEDED`, carrying:

1. **The date**, and the **superseding document and section** by name.
2. **A fair statement of why it was originally right.** Not a dismissal. This is the load-bearing part.
3. **What still stands from it** — usually more than people expect.
4. **The grandfathering scope** — which existing work remains valid.
5. **What changes in practice** — including operational consequences such as a changed artwork brief.

**Why the fair statement is mandatory:** a rule dismissed as a mistake gets proposed again by the next
contributor, because the reasoning that made it attractive is still valid and now undocumented. A rule marked
superseded *with its original reasoning intact* is the only form that closes the question.

The superseded baked-in-Hero-copy rule is the reference implementation of this format.

### 6.3 RETIRED

A standard is RETIRED only when **nothing in either project depends on it**, including grandfathered work.
The document is kept; its status line becomes `RETIRED`, with the date and the reason.

### 6.4 Never delete

**No engineering document is ever deleted, and no superseded rule is ever removed from its file.** Deletion
destroys the only record of *why* — which is the asset this whole folder exists to protect.

The one exception is a **withdrawn proposal** that was never accepted: it is removed, but **its ADR number is
retired and never reused** (`Architecture-Decision-Records.md` § Reserved).

---

## 7. Rollback

### 7.1 Templates — the draft trail is the mechanism

- Draft versions **only ever increase** and are never overwritten, deleted or renumbered.
- Rollback = **reinstate a named prior draft version** as the current working version, and record why.
- `Output/` holds one un-versioned approved file; `Draft/` holds the history. Rolling back `Output/` means
  re-promoting a **named** draft version with Owner approval.
- **Never batch-edit templates**, especially during a migration — batching destroys the trail that makes
  rollback possible (`Engineering-Governance.md` §10.2).

### 7.2 Standards — reinstate, do not revert silently

Rolling back a standard is itself a change and follows the full path in
`Engineering-Change-Management.md`:

1. **Reinstate** the prior version's requirements as a **new version number** — e.g. `1.2.0` → `1.3.0` that
   restores `1.1.0`'s rule. **Never re-issue an old number.**
2. **Record it in the change log** as a rollback, naming what was rolled back and why.
3. **Write or amend an ADR.** A rollback is a decision and needs its reasoning captured, or it will be
   re-attempted.
4. **Mirror both copies** and verify by hash.
5. **State the effect on templates** built against the rolled-back version — usually grandfathered.

### 7.3 Rollback triggers

Roll back when any of these is true:

- A change introduced a defect worse than the one it fixed.
- The evidence behind the change turns out not to reproduce.
- A migration is failing and the pre-migration state was demonstrably sound.
- A "clarification" turns out to have added a requirement nobody agreed to (§3).

### 7.4 What rollback does **not** cover

**Rollback restores rules. It does not un-send an email.** For anything already sent or activated, the path is
the post-incident review in `Engineering-Governance.md` §9, plus the mandatory-retrofit categories in §7.2 of
that document (compliance, legal, factual, dead destinations, security).

---

## 8. Vendored reference versioning

`Shared/Frameworks/Cerberus/` is upstream code and is **not ours to version.**

- Identified by **upstream commit hash + vendor date** — currently `fa6de2ebb2e0bcd0614c53bd11f930d5bc8173fd`
  (2024-07-07), vendored 2026-07-28.
- **Never edit an upstream file.** Our analysis documents and reference components sit alongside them and are
  ours.
- **Refreshing is a re-vendor**, and is a T3 change: re-clone at the new commit, remove the nested `.git`,
  update the provenance table and checksums, and **re-run the analysis documents against the diff** so
  divergences are re-confirmed rather than assumed.
- A refresh that changes a divergence verdict is **T4** and needs an ADR.

---

## 9. Governance of this document

Changing §2 (bump semantics) or §6 (deprecation lifecycle) is a **T4** change: it alters how every other
document is versioned. Everything else follows `Engineering-Governance.md` §3.1.

---

## 10. Change log

| Version | Date | Tier | Change | Mirrored |
|---|---|---|---|---|
| 1.0.0 | 2026-07-29 | — | Established. Defines SemVer-by-consequence for standards, the standard-vs-document revision distinction, template↔standard traceability, the ACTIVE → SUPERSEDED → RETIRED lifecycle with mandatory retained reasoning, and rollback for templates and standards. | ✔ |

---

*Procedure for making a change: `Engineering-Change-Management.md`. Authority to make one:
`Engineering-Governance.md`. Current standard versions: `README.md` §3.*
