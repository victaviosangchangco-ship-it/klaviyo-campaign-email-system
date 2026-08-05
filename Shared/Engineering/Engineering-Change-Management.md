# Engineering Change Management

| | |
|---|---|
| **Status** | ACTIVE |
| **Version** | 1.0.0 |
| **Owner** | Project Owner |
| **Applies to** | **Klaviyo Campaign Email System** · **Klaviyo Flow and Claude Code** |
| **Mirroring** | Byte-identical copies in both projects. Both canonical. Any change applies to both in the same edit. |
| **Scope** | The **procedure** for changing an engineering standard. Authority is in `Engineering-Governance.md`; version semantics in `Engineering-Versioning.md`. **No build rules.** |

> **This document is the path a change walks.** Seven stages: **Proposal → Review → Approval →
> Implementation → Validation → Release → Rollback.**
>
> **The process is weighted by tier.** A typo does not walk seven stages — that would guarantee the process
> gets bypassed, which is worse than having none. §1 tells you which stages apply to you.

---

## 1. Which stages apply to your change

Tiers are defined in `Engineering-Governance.md` §3.1. **Tier is decided by consequence, not by effort.**

| Stage | T1 editorial | T2 additive | T3 normative | T4 architectural |
|---|---|---|---|---|
| **1 Proposal (ECP)** | — | short note | **required** | **required + migration plan** |
| **2 Review** | — | recommended | **required, independent** | **required, independent** |
| **3 Approval** | self | self, Owner notified | **Owner** | **Owner** |
| **4 Implementation** | ✔ | ✔ | ✔ | ✔ |
| **5 Validation** | mirror + links | mirror + links + affected gates | **full**, incl. reproduction of the evidence | **full + migration validation** |
| **6 Release** | ✔ | ✔ | ✔ | ✔ + migration schedule |
| **7 Rollback** | available | available | available | available + named prior draft versions |

**Every tier does stages 4, 5 and 6.** Even a typo fix must be mirrored to both copies and have its links
checked — because a one-sided edit forks the standard (ADR-007), and that is tier-independent.

### 1.1 If you cannot tell which tier

Ask the one question that decides it:

> **Would a template that was conforming yesterday still conform after this change?**

**No** → at least T3, probably T4. **Yes, but future work must now do something new** → T3, possibly T2.
**Yes, and nothing new is required of anyone** → T1 or T2.

If still unsure, **treat it as the higher tier.** Over-processing one change costs an hour; under-processing
one costs a migration.

---

## 2. Stage 1 — Proposal

### 2.1 The Engineering Change Proposal (ECP)

Required for T3 and T4. Kept short — one page is normal. **Recorded in the ECP register (§13) the moment it
is raised**, then in the change log of the document being changed, and, once accepted, expanded into an ADR.

```
ECP-<nnn>  <one-line title>

TIER              T3 | T4
STANDARD(S)       which document(s) and section(s)
QUALIFYING REASON which of the five (Governance §4.1): verified defect | client
                  compatibility | accessibility | new brand/business requirement |
                  approved architectural revision

MECHANISM         What is actually happening, stated causally. NOT the symptom.
REPRODUCTION      Client + version + viewport + account type. For Gmail, state
                  Google vs NON-GOOGLE account — <head>-CSS stripping makes it a
                  different renderer in practice.
MEASUREMENT       Computed, working shown, at 320 / 375 / 414 / 600 where relevant.
PROPOSED CHANGE   The exact wording or rule that changes.
VERSION IMPACT    MAJOR | MINOR | PATCH, and why (Versioning §2).
BLAST RADIUS      Which existing templates become non-conforming. Actual paths.
MIGRATION PLAN    T4 only. Governance §10.1 content.
ALTERNATIVES       What else was considered, and why rejected. Becomes the ADR's
                  Alternatives section — so do this properly now, once.
ROLLBACK          What restores the prior state, named specifically.
```

### 2.2 The evidence bar — the control that does the work

**A proposal that cannot state a mechanism is refused, however plausible it sounds.**

| Not acceptable | Acceptable |
|---|---|
| "The hero looks broken on mobile" | "Copy overruns the artwork's first feature by 74px at 375px, because drift accumulates at `k` px per px of lost viewport width" |
| "This might render badly in Outlook" | "Outlook's Word engine renders `v:roundrect` at its own fixed dimensions, so a button resized only in CSS keeps the old size — reproduced in Outlook 2021 desktop" |
| "It would be cleaner to…" | "…and here is the investigation showing the current mechanism cannot satisfy requirement X" |
| "Best practice says…" | "Cerberus states this as a first principle at `Cerberus-Techniques.md` §n, and we reproduced the failure it describes in <client>" |

**Suspected is not reproduced.** *"Gmail probably strips this"* is a research task, not evidence. This is the
control that would have ended the 16-draft crop cycle at draft two: the proposal *"try a different
background-position"* names no mechanism, so it never enters the process.

### 2.3 Before proposing, check it has not already been decided

Search `Architecture-Decision-Records.md` first. Several failure classes in this repository's history were
re-encountered rather than new. If an ADR already decided it:

- **Agreeing with the ADR** → no proposal needed; apply the existing rule.
- **Disagreeing with the ADR** → the proposal must state **what new evidence** overturns it. An ADR is not
  reversed by preference.

---

## 3. Stage 2 — Review

### 3.1 Who

For **T3 and T4, the Reviewer must not be the Implementer** (`Engineering-Governance.md` §2.3). A second,
independent AI pass with the diff and the standard in context is acceptable; the same agent re-reading its own
work in the same turn is not.

### 3.2 What the Reviewer checks

| | |
|---|---|
| **Tier is right** | Is this really T2, or does it make existing work non-conforming? |
| **Mechanism, not symptom** | Does the ECP name a cause? |
| **Reproduction is real** | Named client, version, viewport, account type — not "mobile" |
| **Measurement is computed** | Working shown, not carried forward from another document |
| **No duplication** | Does this restate something an existing document owns? (`README.md` §6.2) |
| **Blast radius is complete** | Actual file paths, not "the RDD templates" |
| **Alternatives are genuine** | Were the obvious ones considered, including *change the artwork/asset instead of the code*? |
| **Rollback is specific** | Named versions, not "revert" |
| **Nothing weakens a gate** | A gate never moves to make a build pass (`Governance` §3.3) |

### 3.3 Verdicts

**ACCEPT** · **ACCEPT WITH CHANGES** (specific, listed) · **NEEDS EVIDENCE** (say exactly what would settle
it) · **REJECT** (with the reason, which is recorded).

A rejection is recorded, not discarded — otherwise the same proposal returns.

---

## 4. Stage 3 — Approval

- **T3 / T4: Owner only.** Not delegable to an implementer or an AI assistant.
- **Approval is of a named, specific change** — a version, a wording, a scope. "Approved in principle" is not
  an approval and does not authorise implementation.
- Approval **must state the grandfathering scope** for anything that changes conformance: which existing work
  stays valid, and which is retrofitted (`Engineering-Governance.md` §7).
- **Approval of a standard change is not approval to promote any template**, and never approval to send. Those
  are separate Owner decisions.

---

## 5. Stage 4 — Implementation

### 5.1 The order of operations

```
1  Edit the OWNING document only               ← one home per fact (README §6.2)
2  Update every REFERENCING document's pointer ← pointers only; never copy the rule across
3  Bump the version in the header              ← Versioning §2
4  Append the change-log entry                 ← Versioning §4
5  Write or amend the ADR (T3/T4)              ← Architecture-Decision-Records.md
6  Update README §3 register if a standard's version or status changed
7  MIRROR to the other project                 ← same edit, both copies (ADR-007)
```

### 5.2 Implementation rules

- **Move rules; never copy them.** When a rule migrates into a standard, the old location gets a **pointer**,
  and the rule text is **removed** from it. Leaving both is the duplication this system exists to prevent.
- **Supersede in place.** A rule being replaced is marked SUPERSEDED with its original reasoning intact
  (`Engineering-Versioning.md` §6.2) — never deleted.
- **Do not touch templates, components or HTML** during a standards change. Standards and builds are separate
  changes with separate approvals. If templates need updating, that is the migration (§8.3).
- **Do not renumber existing sections** if anything references them. Append, or use a suffixed number
  (e.g. `§6.13-H`) — a renumber silently breaks every cross-reference.
- **Do not edit a vendored upstream file.** Ever.

### 5.3 The AI implementer's additional obligations

- Read the standard **before** acting, not after producing a draft.
- **Never infer a rule, a property name or a measurement from a pattern.** If it is not in a project file or a
  provider reference, it is an invention — and a plausible invention is the dangerous kind. *(A guessed
  Klaviyo variable survived seven template revisions and forty markdown files because it looked correct.)*
- **Surface conflicts rather than absorbing them.** If two project documents disagree, report it; do not pick
  one silently.
- **Report what could not be verified.** Never present a plausible completion as a verified one.
- Compute every published figure and show the working.

---

## 6. Stage 5 — Validation

Validation of a **standards change** is not the same as validation of a **template**. Template gates are in
`Engineering-QA-Process.md`.

### 6.1 Always (every tier)

- ☐ **Both mirrored copies are byte-identical** — verified by hash, not by inspection
- ☐ **Every cross-reference resolves** — section numbers, file paths, ADR IDs
- ☐ **No rule text exists in two documents** — the old location holds a pointer only
- ☐ Header version bumped; change-log entry appended with the mirror confirmation
- ☐ `README.md` §3 register consistent with the document's own header

### 6.2 T3 and T4 additionally

- ☐ **The evidence reproduces.** Re-run the measurement or re-observe the client behaviour independently of
  the proposal. An ECP's numbers are a claim until reproduced.
- ☐ **The new rule is checkable.** If a human or an agent cannot tell whether a build complies, the rule is
  not finished. **Prefer a rule with an automated scan over a rule with a paragraph** — a scan cannot be
  forgotten.
- ☐ **Blast radius verified by search, not by memory.** Grep for the pattern the change affects and confirm the
  affected-file list is complete.
- ☐ The ADR exists, is numbered, and is indexed.
- ☐ **T4: the migration plan is complete and schedulable** — including "can the client matrix actually be run
  for this?" A migration that cannot be validated is not scheduled
  (`Engineering-Governance.md` §10.2).

### 6.3 The self-referential check

> **Does this change make it harder to repeat the mistake, or does it only describe the mistake?**

A description is not a control. A gate, a scan or a required computation is. Where a defect is
machine-detectable, add the scan — most of this project's expensive defects were detectable by a grep: an
anchor imbalance, a `cover` count, a `background` shorthand inside a dark-mode block, a template tag inside an
attribute, an odd quote count in a tag.

---

## 7. Stage 6 — Release

Release is the point at which the change becomes **in force**. It is a short, mechanical sequence — and it is
where the mirror is guaranteed.

```
1  Confirm both copies identical:
     sha256sum "…/Klaviyo Campaign Email System/Shared/<path>" \
               "…/Klaviyo Flow and Claude Code/Shared/<path>"
2  Confirm the version and change log are in the released text (not staged separately)
3  Confirm README §3 register matches
4  Announce the change in the response/summary: what changed, tier, version,
   grandfathering scope, and what contributors must now do differently
5  T4: publish the migration schedule and its first step
```

### 7.1 Release rules

- **A change is not released until both copies are identical.** A one-sided release is a fork, and both copies
  still look authoritative — which is worse than no standard at all.
- **Grandfathering scope is stated at release**, not left to be inferred later.
- **"What contributors must now do differently"** is mandatory in the announcement. A released standard nobody
  knows about is not in force in practice.
- **A release never includes a template edit.** Migration is separate (§8).

---

## 8. Stage 7 — Rollback

### 8.1 Triggers

- The change introduced a defect worse than the one it fixed.
- The evidence does not reproduce on independent attempt.
- A migration is failing and the prior state was demonstrably sound.
- A "clarification" is discovered to have added a requirement nobody approved
  (`Engineering-Versioning.md` §3).

### 8.2 Procedure

**Rollback is a change and walks this same path.** It is not an undo.

```
1  Reinstate the prior requirements as a NEW version number
   (1.2.0 → 1.3.0 restoring 1.1.0's rule). NEVER re-issue an old number.
2  Change-log entry marked ROLLBACK, naming what was rolled back and why.
3  Write or amend the ADR — a rollback is a decision and needs its reasoning
   captured, or it will be re-attempted.
4  Mirror both copies; verify by hash.
5  State the effect on templates built against the rolled-back version
   (normally: grandfathered).
```

### 8.3 Migration and its rollback

Migration — bringing existing templates to a changed standard — is governed by
`Engineering-Governance.md` §10. Two rules matter most for rollback to remain possible:

- **One file per draft version. Never batch-edit templates.** The draft trail *is* the rollback mechanism;
  batching destroys it.
- **Rollback of a migrated template = re-promote a named prior draft version**, with Owner approval. `Draft/`
  keeps the history precisely so this is possible.

### 8.4 What rollback cannot do

**Rollback restores rules and files. It does not un-send an email.** For anything already sent or activated,
the path is the post-incident review (`Engineering-Governance.md` §9) plus the mandatory-retrofit categories
in §7.2 of that document.

---

## 9. Anti-patterns

Observed or narrowly avoided in this project. Each is a refusal reason on its own.

| Anti-pattern | Why it is refused |
|---|---|
| **Changing a standard to make one build pass** | Inverts the relationship. The build changes, or the Owner grants a named exception (`Governance` §8). The gate does not move. |
| **"Clarifying" a rule into a new requirement** | Bypasses approval. If a previously-passing template would now fail, it is T3. |
| **Copying a rule into a second document "for convenience"** | Creates two sources; when they drift, nothing says which is current. |
| **Tuning a parameter without naming the mechanism** | The 16-draft pattern. Refused at Stage 1 for lack of evidence. |
| **Batch-editing templates during a migration** | Destroys the rollback trail. |
| **Recording an unverified check as passed** | Converts an unknown into a false assurance — the most serious process failure available here. |
| **Approving on an Apple Mail render** | The most capable client hides exactly the defects that matter. |
| **Editing an ADR's Decision after acceptance** | Rewrites history. Supersede with a new ADR instead. |
| **Deleting a superseded rule** | It gets re-invented, because the reasoning that made it attractive is still valid and now undocumented. |
| **Renumbering sections that other documents reference** | Silently breaks every cross-reference. Append or suffix. |
| **A one-sided mirror edit** | Forks the standard while both copies still look authoritative. |
| **Proposing a framework migration to fix a rendering constraint** | Every framework emits the same HTML/CSS subset (ADR-002). It is a client-capability problem. |

---

## 10. Worked example — an actual change through all seven stages

*The Hero standard's establishment, as it happened, mapped to this process. Included because an abstract
process is easy to agree with and hard to follow.*

| Stage | What happened |
|---|---|
| **1 Proposal** | Triggered by a repeating symptom: *"every diagonal Hero breaks on mobile"* across ~29 drafts and 6 approaches. Reason 5 (approved architectural revision). Framed as an **investigation first**, not a fix — because no mechanism was yet known. |
| **2 Review** | The investigation itself was the review: it had to explain *all* prior failures, not just the latest, and had to answer why each previous fix repaired one device and broke another. |
| **3 Approval** | Owner approved the standard. |
| **4 Implementation** | STD-HERO created at `1.0.0`. Hero rules **removed** from the Flow `CLAUDE.md` §8.5 body and replaced with a pointer plus a summary. Campaign §6.15 marked **SUPERSEDED** with its original reasoning retained and grandfathering stated. Both `Cerberus-Best-Practices.md` files gained a divergence entry. Mirrored to both projects. |
| **5 Validation** | Mirror hashes verified equal (`61,169 B`, matching sha256). Cross-references counted and confirmed present in all four updated documents. Supersession and grandfathering clauses confirmed present. Confirmed no HTML changed. |
| **6 Release** | Announced with the tier, the supersession, the grandfathering scope, and the two operational consequences: the Campaign artwork brief changes, and a reference component is now stale and flagged. |
| **7 Rollback** | Not exercised. Path if needed: reinstate the prior Hero rules as a new version, amend ADR-002/003, mirror, and state that grandfathered templates are unaffected. |

**What made it work was Stage 1 being an investigation rather than a fix.** The five previous attempts each
proposed a change; this one proposed *finding the mechanism*. That is the single most transferable lesson in
this document.

---

## 11. Governance of this document

Changing §1 (stage-by-tier matrix), §2.2 (the evidence bar) or §4 (approval authority) is a **T4** change.
Everything else follows `Engineering-Governance.md` §3.1.

---

## 12. Change log

| Version | Date | Tier | Change | Mirrored |
|---|---|---|---|---|
| 1.0.0 | 2026-07-29 | — | Established. Defines the seven stages, tier-weighted process, the ECP template, the evidence bar, the release mirror requirement, rollback-as-a-change, the anti-pattern list, and a worked example from the Hero standard's establishment. | ✔ |
| 1.1.0 | 2026-07-29 | T2 | Added **§13 the ECP register**, so proposals live in the repository rather than in a conversation. Seeded with ECP-001 and ECP-002. Numbered as a new trailing section so no existing section number shifts (§5.2). | ✔ |

---

## 13. ECP register

**Every Engineering Change Proposal is recorded here, at the moment it is raised.** A proposal that exists
only in a conversation is not a proposal — it is an intention, and it is exactly the kind of knowledge this
document set exists to stop losing.

**Numbers are never reused**, including for a withdrawn or rejected proposal. **Next ECP number: ECP-003.**

| ECP | Title | Tier | Status | Raised | Approver |
|---|---|---|---|---|---|
| [ECP-001](#ecp-001) | Make the Artwork Contract's termination band conditional on the join type | T3 | **PROPOSED — awaiting Owner** | 2026-07-29 | Owner |
| [ECP-002](#ecp-002) | Hero Composition Review | T3 | **PROPOSED — awaiting Owner** | 2026-07-29 | Owner |

**Status values:** PROPOSED · ACCEPTED · ACCEPTED WITH CHANGES · NEEDS EVIDENCE · REJECTED · WITHDRAWN ·
IMPLEMENTED. A rejection is recorded with its reason and **never deleted** — otherwise the same proposal
returns (§3.3).

---

<a id="ecp-001"></a>
### ECP-001 — Make the Artwork Contract's termination band conditional on the join type

```
TIER              T3
STATUS            PROPOSED — awaiting Owner approval
STANDARD(S)       STD-HERO §4.2 (flat termination band), §2.1, §4.3
QUALIFYING REASON 5 — approved architectural revision (Governance §4.1)
```

**MECHANISM.** §4.2 currently requires a flat termination band of ≥8% of frame height on **every** Hero
artwork. Its purpose (§2.1, §4.3) is to serve a **colour-identical** join between the artwork's last row
and the copy surface. Two of the three architectures in the composition exploration satisfy the same
underlying invariant through the **contrasting** branch instead — the artwork's edge abutting a full-width
offer bar or a card border — where a termination band serves no purpose and costs artwork height that the
mobile fold cannot spare.

**REPRODUCTION.** Not a defect report; an architectural gap surfaced by the composition exploration. The
supporting measurement is that producing a conforming band for Part 3 v4 required padding the master by
96px, which deepened the ratio from 1.59:1 to 1.59:1-plus and added **+26px** of reserved height at 375px —
a cost incurred purely to satisfy a condition the abutting-bar architecture does not need.

**MEASUREMENT.** Band cost at 375px: 96 master px → ~42 CSS px of the reserved 235px. Under an abutting
offer bar the same join is achieved by a painted cell of 3–4px that also carries the coupon.

**PROPOSED CHANGE.** §4.2 applies **when the artwork's bottom edge meets a same-colour surface**. Where it
meets a deliberately contrasting element, it is replaced by:

> *"The junction must be a designed, full-width element of ≥3px, in a colour of ≥3:1 contrast against the
> artwork's edge."*

**VERSION IMPACT.** MINOR. It **relaxes** a condition; nothing previously conforming becomes
non-conforming.

**BLAST RADIUS.** No existing template. `Brands/RDD/Design.md` Artwork Contract acceptance record gains a
join-type column. Part 3 v4's padded derivative remains valid under the colour-identical branch.

**ALTERNATIVES.** (a) Keep §4.2 unconditional — costs artwork height for no benefit in two architectures.
(b) Drop §4.2 entirely — would reintroduce the two-tone-edge defect §4.2 was written to prevent.

**ROLLBACK.** Reinstate the unconditional wording as a new version; no template changes required.

**DEPENDENCY.** ⚠️ **An abutting-bar Hero must not be built until this is approved**, or it would be built
against a condition it deliberately does not meet.

---

<a id="ecp-002"></a>
### ECP-002 — Hero Composition Review

```
TIER              T3
STATUS            PROPOSED — awaiting Owner approval
STANDARD(S)       STD-HERO §12 (Approval Gates), §15 (new)
                  Engineering-QA-Process.md §2, §5
QUALIFYING REASON 5 — approved architectural revision; and 4 — a requirement the
                  current gates cannot express (Governance §4.1)
```

**MECHANISM.** The approval gates were written from the geometry investigation and verify **engineering
correctness** only. A build can therefore pass every gate — full §11 checklist, all automated scans,
computed contrast, regression evidence — and still fail to communicate. Part 3 Draft v4 did exactly that:
every check green, colour bond measured at 0 levels of difference, and reported as *"technically correct
but visually fragmented; reads as two separate sections."* **There is no gate at which composition is
evaluated, so nothing forced the question to be asked.**

**REPRODUCTION.** Part 3 Draft v4, reproducing **identically** at 320 / 375 / 414 / 600px and in every
client — which is itself the §15.2 signature of a composition rather than a geometry failure.

**MEASUREMENT.** Five attributable causes: semantic disconnect (artwork depicts neither cart, products nor
offer) · competing focal points · proportional dominance (**47%** of Hero height carrying zero marketing
information) · no visual bridge (colour bond at 0 levels was insufficient) · ambiguous full-width section
boundary.

**PROPOSED CHANGE — four reviews, all four required before a Hero is considered approved:**

| # | Review | Verifies | Source of truth | Recorded outcome |
|---|---|---|---|---|
| **1** | **Geometry** | Aspect lock · no crop · `W*` where applicable · fold offsets published | STD-HERO §3, §4, §11 | pass / fail per item |
| **2** | **Composition** | Declared **role** matches the email's objective · artwork proportion within the role's ceiling · a **Visual Bridge** is present and is not colour alone · reading order per §15.1 | **STD-HERO §15** | declared role + the three checks |
| **3** | **Marketing** | Offer prominence · single primary action · CTA reachability at 320/375/414 · message matches the lifecycle trigger · copy is evergreen | STD-HERO §15.1, §15.5 + the project's `CLAUDE.md` | CTA offsets + verdict |
| **4** | **Responsive** | Order, surface and presence identical at every width · zero `display:none` on Hero content · zero font-size overrides · degradation stated | STD-HERO §8 | per-width verdict |

**Additional requirements:**

- **All four are recorded, with evidence.** An unrecorded review is an unverified one
  (`Engineering-QA-Process.md` §1.3), and its verdict is `UNVERIFIED IN THIS ENVIRONMENT`, never a pass.
- **The Hero's role is declared before design begins**, at Gate G0, and carried in the build header.
- **Reviews 2 and 3 must not be performed by the Implementer** for a new or rebuilt Hero — the author of a
  composition is the least able to see that it does not read as one object (§3.1).
- **Passing review 1 does not imply passing review 2.** They are separate outcomes, in the same way
  engineering-complete and production-validated are separate states (ADR-008).

**VERSION IMPACT.** MINOR on `Engineering-QA-Process.md` (a new gate requirement; existing approved work
grandfathered). STD-HERO §15 already carries the substance at 1.1.0.

**BLAST RADIUS.** `Engineering-QA-Process.md` §2 and §5 gain review 2 and review 3 within Gate G1/G2. No
template changes; no HTML. Part 3 Draft v4 would not pass review 2 and is already scheduled for rebuild.

**ALTERNATIVES.** (a) Leave composition to informal feedback — permits a third repeat of the same
investigation. (b) Fold composition into the existing geometry gate — conflates two failure classes with
different fixes, which is the confusion §15.2 exists to end. (c) Automate it — the checkable parts are
already automatable and are in review 2; role suitability and semantic relevance are judgement and cannot
be.

**ROLLBACK.** Remove reviews 2 and 3 from the gates as a new version; STD-HERO §15 remains as guidance.

---

---

*Authority: `Engineering-Governance.md`. Version semantics: `Engineering-Versioning.md`. Decisions:
`Architecture-Decision-Records.md`. Template gates: `Engineering-QA-Process.md`.*
