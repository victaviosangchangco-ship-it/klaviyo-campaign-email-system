# Email Design System — the visual language library

| | |
|---|---|
| **ID** | **STD-DESIGN** |
| **Status** | **ACTIVE** |
| **Version** | **1.0.0** |
| **Owner** | Project Owner |
| **Applies to** | **Klaviyo Campaign Email System** · **Klaviyo Flows Automation System** |
| **Mirroring** | Byte-identical copies in both projects. Both canonical. See §6. |
| **Established** | 2026-07-29 |

> ## 🚫 This folder contains NO HTML, NO CSS and NO Cerberus code.
>
> It also contains **no brand values and no measurements** — no hex codes, no typefaces, no pixel sizes.
> Every value expressed here is a **relationship**: a ratio, an order, a proportion.
>
> **Its only responsibility is visual decision-making.** It replaces no engineering standard, relaxes no
> gate and overrides no brand fact.

---

## 1. What this layer is

The projects already had **how to build** (the engineering standards, the Hero standard, Cerberus), **how to
decide** (governance), **how to prove** (QA), and **when to think** (the Creative Workflow Standard).

What was missing was **what to build** — a reusable vocabulary of visual decisions. Without it, every
template's creative phase started from a blank page, and a blank page under time pressure reliably produces
the previous template again.

**This folder is that vocabulary.** It turns "make it look premium" into a set of named, selectable,
reviewable decisions.

## 2. The five documents, in reading order

| Order | Document | Answers |
|---|---|---|
| **1** | **`Design-Decision-Matrix.md`** | **Start here.** Six questions whose answers select everything below. |
| 2 | `Design-Language-Library.md` | Which of 14 visual languages does this email speak? |
| 3 | `Hero-Pattern-Library.md` | Which of 12 Hero patterns fits this email's job? |
| 4 | `Section-Pattern-Library.md` | Which sections, in what order, with what rhythm? |
| 5 | `Flow-Design-Recommendations.md` | What is the sensible default for this flow type? |
| — | `Visual-Hierarchy-Guide.md` | The principles all four rest on. Read once; consult when something feels wrong. |

**The short path for an experienced session:** `Design-Decision-Matrix.md` → the one language → the one Hero
pattern → the sections. Four decisions, recorded, then hand off to engineering.

## 3. Where this sits in the system

```
        BUSINESS GOAL              why send anything at all
             │
             ▼
        CREATIVE WORKFLOW          Shared/Creative-Workflow-Standard.md   ← WHEN to think
             │                       creative before engineering; the approval gate; the lock
             ▼
        EMAIL DESIGN SYSTEM        Shared/Email-Design-System/            ← WHAT to build
             │                       this folder: languages, Heroes, sections, hierarchy
             ▼
        HERO ENGINEERING           Shared/Email-Hero-Engineering-Standard.md
             │                       geometry gate · Artwork Contract · composition rules
             ▼
        FRAMEWORK RESEARCH         Shared/Framework-Research/
             │                       what other frameworks solved, and what they cannot
             ▼
        ENGINEERING                 <project>/CLAUDE.md
             │                       build standards, dynamic data, compliance
             ▼
        CERBERUS                   Shared/Frameworks/Cerberus/
             │                       the external rendering authority
             ▼
        HTML                       the build, in Draft/
             │
             ▼
        QA                         the gate set; a preview is never proof
             │
             ▼
        OUTPUT                     only on explicit approval of a named draft
```

**Precedence is the reverse of sequence.** This folder comes early in the *order of work* and last in
*authority*: on any conflict the engineering standards, each project's `CLAUDE.md` and the brand documents
all win. Ordering is owned by the Creative Workflow Standard; correctness is owned by the engineering layer.

## 4. How this differs from the layers either side of it

| | Owns | Does not own |
|---|---|---|
| **Creative Workflow Standard** | **When** creative happens, the approval gate, the Creative Lock, the handoff | Which language, Hero or sections to choose |
| **Email Design System** (this folder) | **What** to build — the vocabulary of visual decisions | When to decide; how to build; any measurement |
| **Hero Engineering Standard** | **How** a Hero must be built, and the rules a composition must satisfy | Which Hero pattern suits an email's objective |
| **Framework Research** | What external frameworks solved, and their limits | Any decision about a specific email |

The clean split: the Creative Workflow Standard is a **process**, this folder is a **library**, the Hero
standard is a **specification**, and Framework Research is **reference**.

## 5. Rules of use

1. **Record every choice.** The language, the Hero pattern and the emotional objective go in the creative
   proposal and in the built template's header. A design reviewed against a stated intention is reviewable;
   one reviewed against taste is not.
2. **One design language per email.** Mixing two produces sections that are individually correct and
   collectively incoherent.
3. **Check the assets before committing to a language.** Four languages have a hard asset dependency
   (`Design-Language-Library.md` §4.3). The asset decides, so the brief must decide first.
4. **Re-answer per email, never per flow.** A flow's later touch usually needs a different pattern, because
   its objective changed.
5. **A recommendation is a starting position.** Depart from it deliberately and say why. Silent drift means
   the library has stopped working.
6. **Nothing here authorises a prohibited technique.** Where a creative ambition and an engineering
   prohibition collide, the resolution path is the Creative Workflow Standard's engineering handoff: find a
   different mechanism for the same intent.

## 6. Mirroring

Every file in this folder exists as a **byte-identical copy in both projects. Both are canonical; neither
is a shadow.** Any change must be applied to both **in the same edit**, and verified by hash — a one-sided
edit forks the library while both copies still look authoritative. Rationale: **ADR-007**.

```
sha256sum "…/Klaviyo Campaign Email System/Shared/Email-Design-System/"*.md \
          "…/Klaviyo Flow and Claude Code/Shared/Email-Design-System/"*.md
```

## 7. Governance

Registered as **STD-DESIGN** in `Shared/Engineering/README.md` §3 — the Standards Register. Governed like
any standard: `Engineering-Governance.md` for authority, `Engineering-Change-Management.md` for the change
path, `Engineering-Versioning.md` for version semantics.

**A note on scope discipline.** The single greatest risk to this folder is scope creep — a design system that
starts collecting measurements, then hex values, then markup, and ends up as a second, competing source of
truth. The boundary is therefore absolute and worth restating: **relationships and decisions live here;
values live in the brand documents; rules live in the standards.** Before adding anything, ask whether it is
a *decision* or a *value*. If it is a value, it belongs elsewhere.

## 8. Change log

| Date | Version | Change | Both copies |
|---|---|---|---|
| 2026-07-29 | 1.0.0 | Folder established with six documents: the Design Decision Matrix, the Design Language Library (14 languages), the Hero Pattern Library (12 patterns mapped to STD-HERO's four roles), the Section Pattern Library (16 sections), Flow Design Recommendations (13 flow types) and the Visual Hierarchy Guide. Registered as **STD-DESIGN**. Referenced from both `CLAUDE.md` files, both `Shared/README.md` files and `Shared/Engineering/README.md`. **Changes no engineering rule and removes no gate.** | ✔ |

---

*Visual decision-making only. Every measurement belongs to the owning brand's design document; every build
rule belongs to the standards registered in `Shared/Engineering/README.md` §3.*
