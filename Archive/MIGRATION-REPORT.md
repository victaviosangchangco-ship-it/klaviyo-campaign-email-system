# Migration Report — CLAUDE.md Instruction Architecture Refactor

**Date:** 2026-09-17
**Baseline:** CLAUDE.md at 2,170 lines (backed up as `Archive/CLAUDE-LEGACY.md`)
**Pre-refactor test result:** 332/332 tests PASS

---

## Current Instruction Loading Problem

Every campaign run loads CLAUDE.md (2,170 lines) into context. It contains:
- Production rules that apply to every task (~150 lines) — **KEEP**
- Email-client safety rules learned from specific incidents (~600 lines) — **MOVE to runtime contracts**
- Cerberus integration guide (~200 lines) — **ALREADY HAS canonical home** in Shared/Frameworks/Cerberus/
- Product grid implementation history (~250 lines) — **ALREADY IMPLEMENTED** in Components/
- Hero engineering history (~100 lines) — **ALREADY HAS canonical home** in Shared/Email-Hero-Engineering-Standard.md
- Klaviyo integration rules (~200 lines) — **Needed only when drafting to Klaviyo**
- GIF rules (~70 lines) — **Needed only when a GIF is involved**
- Holiday folder rules (~50 lines) — **Needed only for Holiday campaigns**
- Navigation rules (~50 lines) — **Needed only when nav is requested**
- SC-specific coupon rules (~25 lines) — **Needed only for SC promos**
- Naming conventions (~30 lines) — **KEEP as short reference**
- Future integration notes (~15 lines) — **ARCHIVE**

## Section-by-Section Migration Plan

### §1 Project Role (lines 11–17)
→ **KEEP IN CLAUDE.md** (6 lines, essential context)

### §2 Source of Truth Hierarchy (lines 19–45)
→ **KEEP IN CLAUDE.md** (shortened to ~10 lines, remove the "known gaps" warning block)

### §3 Project Read Order (lines 46–115)
→ **REPLACE WITH SHORT ROUTER** (~15 lines). The old read order told Claude to read everything upfront.
  New version: "Load only files required for the current task" with a conditional pointer table.
→ §3.1 Engineering layer table: **KEEP** shortened (it's already a pointer)

### §4 File-Driven Workflow (lines 116–257)
→ **KEEP** the stage table and §4.1 pipeline (~30 lines, compressed)
→ §4.2 Design Intent block: **MOVE to Shared/Email-Design-System/** (it's a creative-phase artifact)
→ §4.3 Holiday folder organisation: **MOVE to Playbooks/Holiday-Playbook.md** (type-specific)

### §5 Production Rules (lines 259–430)
→ **KEEP** core never-invent, theme consistency, campaign selection engine (~40 lines compressed)
→ §5.1 Weekly product rules: **MOVE to Playbooks/Weekly-Playbook.md** (already partially there)
→ §5.1.1 Weekly improvement loop: **ALREADY IN** Weekly-Playbook.md (deduplicate)
→ §5.1.2 Theme consistency: **KEEP** short (universal rule)
→ §5.1.3 Design philosophy: **KEEP** 2-line summary, detail in Weekly-Playbook
→ §5.4 Product Launch rules: **MOVE to Playbooks/Launch-Playbook.md** (type-specific)

### §6 HTML Generation Standards (lines 431–1721) — THE BULK (1,290 lines!)
This is where most savings come from. Current state: §6 restates implementation details already
embodied in the Components/*.html files + base-head.html + approved campaign outputs.

→ §6.1 Header logo defaults: **MOVE to brand MD files** (brand-specific)
→ §6.2 Campaign copy quality: **KEEP** short (3-line universal rule)
→ §6.3 Campaign workflow: **KEEP** compressed (5 lines)
→ §6.4 SC coupon rule: **MOVE to 03-Brands MD Files/SC.md** (brand-specific)
→ §6.5 Dynamic coupon section: **MOVE to runtime contract** (conditional)
→ §6.6 Link/containment safety: **MOVE to Standards/email-safety-contract.md** (runtime contract)
→ §6.7 Navigation & CTA link rules: **KEEP** 3-line summary in CLAUDE.md
→ §6.8 Product Grid Layout (75 lines): **REPLACE WITH 5-line runtime contract** pointing to Components/
→ §6.9 Grid composition (40 lines): **MERGE into grid runtime contract**
→ §6.10 Header nav style (45 lines): **MOVE to Standards/** (conditional, opt-in nav only)
→ §6.11 Nav opt-in (10 lines): **KEEP** 2-line rule
→ §6.12 SS exclusions (5 lines): **MOVE to 03-Brands MD Files/SS.md**
→ §6.13 RDD defaults (15 lines): **MOVE to 03-Brands MD Files/RDD.md**
→ §6.13-H Hero architecture (40 lines): **REPLACE WITH 3-line pointer** to Hero Standard
→ §6.14 Hero edge-to-edge (20 lines): **MERGE into hero runtime contract**
→ §6.15 SUPERSEDED (50 lines): **ARCHIVE** (historical, not needed at runtime)
→ §6.16 Gmail mobile fixes (90 lines): **MOVE to Standards/email-safety-contract.md**
→ §6.17 Responsive price badges (100 lines): **MOVE to Standards/** (implementation in Components/)
→ §6.18 Responsive component standards (60 lines): **MOVE to Standards/** (implementation in Components/)
→ §6.19 GIF rules (70 lines): **MOVE to Standards/** (conditional, GIF campaigns only)
→ §6.20 Cerberus integration (200 lines): **ALREADY IN** Shared/Frameworks/Cerberus/ — DEDUPLICATE
→ §6.21 Icon style (35 lines): **MOVE to Standards/** (universal but short)
→ §6.22 Weekly premium refinement (25 lines): **MOVE to Weekly-Playbook.md**
→ §6.23 Footer merge-tag validation (50 lines): **MOVE to Standards/email-safety-contract.md**
→ §6.24 Preview text (30 lines): **KEEP** compressed (5 lines, universal)
→ §6.25 Weekly intro copy (25 lines): **MOVE to Weekly-Playbook.md**
→ §6.26 Footer philosophy (35 lines): **KEEP** compressed (5 lines, universal)
→ §6.27 Trust-card alignment (25 lines): **MOVE to Standards/** (implementation-specific)
→ §6.28 Product-brand routing (30 lines): **KEEP** compressed (universal multi-brand rule)
→ §6.29 Equal-height card rows (70 lines): **MERGE into grid runtime contract** (implementation)

### §7 Asset & Reference Workflow (lines 1723–1769)
→ **KEEP** compressed (~10 lines)
→ §7.1 Vercel hosting: **KEEP** compressed (5 lines, universal)

### §8 QA Workflow (lines 1771–1937)
→ **MOVE to QA-Checklist.md** (make it self-contained) — this is the Phase 7 refactor
→ §8.1 Client compatibility: **Extract pass/fail conditions into QA-Checklist.md**
→ §8.2 Ghost Element Inspection: **Extract into QA-Checklist.md**
→ §8.3 Gmail Rendering QA: **Extract into QA-Checklist.md**
→ **KEEP** 5-line QA summary + pointer in CLAUDE.md

### §9 Output Rules (lines 1939–1957)
→ **KEEP** compressed (~8 lines)

### §10 Naming Conventions (lines 1958–1990)
→ **KEEP** the table (~15 lines, universal reference)

### §11 Future Integration (lines 1992–2000)
→ **ARCHIVE** (forward hooks, not operational)

### §12 Multi-Brand Klaviyo Credentials (lines 2001–2026)
→ **MOVE to Standards/klaviyo-contract.md** (loaded only when Klaviyo drafting)

### §13 Klaviyo Draft Automation (lines 2027–2170)
→ **MOVE to Standards/klaviyo-contract.md** (loaded only when Klaviyo drafting)

---

## Files to Create

| New file | Purpose | Loaded when |
|----------|---------|-------------|
| `Standards/email-safety-contract.md` | All email-client safety rules (§6.6, §6.16, §6.17, §6.23, etc.) | Every HTML build |
| `Standards/product-grid-contract.md` | Grid invariants + pointer to Components/ | Every product-grid build |
| `Standards/hero-contract.md` | Hero assembly invariants | Every hero build |
| `Standards/klaviyo-contract.md` | Klaviyo draft rules, audience gate, sync | Klaviyo draft operations |
| `Standards/coupon-contract.md` | Coupon/promo rules (conditional) | Promo campaigns only |
| `Standards/gif-contract.md` | GIF implementation rules (conditional) | GIF campaigns only |
| `Standards/navigation-contract.md` | Nav style rules (conditional) | When nav is requested |

## Conflicts / Needs Review

1. §6.15 (SUPERSEDED hero rule) references §6.13-H which references the full Hero Standard.
   **Resolution:** Archive §6.15 text. Hero contract points to the Standard for deep dives.

2. §6.20 Cerberus section in CLAUDE.md duplicates content from 5 Cerberus-*.md files.
   **Resolution:** Remove from CLAUDE.md. Keep pointer. The analysis docs are the canonical source.

3. QA-Checklist.md says "open each referenced [CLAUDE.md] section and apply it."
   **Resolution:** Make QA-Checklist.md self-contained with actual pass/fail conditions.

4. 00-START-HERE.md says "Read CLAUDE.md" and "Read BRD.md" as step 1-2 for every task.
   **Resolution:** Update to match the new lazy-loading approach.

5. Weekly-Playbook.md already has some of §5.1's rules but not all.
   **Resolution:** Merge the missing rules into Weekly-Playbook.md during this refactor.

## Estimated Result

| Metric | Before | After (target) |
|--------|--------|-----------------|
| CLAUDE.md lines | 2,170 | ~250–350 |
| Context loaded for a normal Weekly | ~2,170+ lines of CLAUDE.md | ~250 lines CLAUDE.md + ~85 lines playbook + ~60 lines QA |
| Total governed knowledge | Unchanged | Unchanged (redistributed) |
| Knowledge deleted | 0 | 0 |
| Tests expected to break | 0 | 0 |
