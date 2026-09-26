# AGENTS.md — Codex Entry Point

This file exists so that **Codex** (OpenAI's coding agent) receives project instructions when it opens
this repository. It is a **routing file**, not a governance document.

**All campaign rules, brand governance, email-design standards, QA gates, Klaviyo safety rules, and
workflow instructions live in [`CLAUDE.md`](CLAUDE.md).** That file is the single canonical operational
guide for this project. Codex must read and follow it exactly as written.

> **One source of truth — no duplication.** This project's own governance (ADR-007,
> `Shared/Engineering/README.md` §5.6) prohibits duplicating governed knowledge across files.
> AGENTS.md therefore references CLAUDE.md rather than restating its 2,100+ lines of rules.

## Read Order

Before starting any task, follow the **Project Read Order** defined in `CLAUDE.md` §3. The sequence is:

0. `Shared/Creative-Workflow-Standard.md` (for new email designs)
0b. `Shared/Email-Design-System/` (visual language library)
1. **`CLAUDE.md`** (the canonical operational guide — Codex reads this in place of a Codex-specific copy)
2. `BRD.md`
3. Brand facts — `03-Brands MD Files/<CODE>.md`
4. Visual system — `Shared/design-tokens.md` + `Shared/Fonts/font-stacks.md`
5. Campaign `Brief/` (including its Design Intent block)
6. `References/` (per fidelity mode in the Brief's Reference Register)
7. Existing `Draft/` (if one exists)

Before writing HTML, also read `Shared/Frameworks/Cerberus/FRAMEWORK-README.md` (§6.20).
Before any Hero work, read `Shared/Email-Hero-Engineering-Standard.md` (§6.13-H).

## What CLAUDE.md Governs (do not reimplement)

All of the following are defined exclusively in CLAUDE.md. Codex must follow them as written:

- **Source-of-truth hierarchy** (§2) — BRD → Brand facts → Visual system → Brief
- **File-driven workflow** (§4) — Brief → Draft → Review → Output pipeline
- **Production rules** (§5) — never-invent, verified-source, product verification, theme consistency
- **HTML generation standards** (§6.1–§6.29) — every email-client safety rule, responsive pattern,
  component standard, Cerberus integration, and Gmail/Outlook/Apple Mail fix
- **Asset & reference workflow** (§7) — Vercel hosting, image rules
- **QA workflow** (§8) — Ghost Element Inspection, Gmail QA, email-client compatibility gates
- **Output rules** (§9) — Draft versioning, Output sync, send-approval gate
- **Naming conventions** (§10)
- **Multi-brand Klaviyo credentials** (§12) — brand isolation, one key per brand
- **Klaviyo draft automation** (§13) — audience confirmation gate, approved-creative attachment,
  publish-sync, campaign synchronization
- **Engineering governance** (§3.1) — `Shared/Engineering/` layer

## Codex-Specific Compatibility Notes

CLAUDE.md was written for Claude Code. Where it references a Claude Code mechanism that Codex does not
support, Codex must follow the **intent** of the rule using its own supported workflow. It must not
invent unsupported mechanisms or skip the rule.

| CLAUDE.md reference | Codex interpretation |
|---------------------|----------------------|
| "Claude Code **PostToolUse** hook" (§13.5) | Codex does not have PostToolUse hooks. The underlying rule still applies: campaign sync (`sync-campaign-draft.js`) is a manual, QA-gated step — never automatic. If Codex cannot set up a hook, the sync remains manual. |
| "Claude Code hooks" (general) | Codex uses its own task/tool system. The governed rules (Draft-only safety, no-send, brand isolation, verify-after-write) apply regardless of the triggering mechanism. |
| `/commands` or Claude Code CLI features | If a CLAUDE.md instruction references a Claude Code slash command or CLI feature, follow the intent (e.g. "start from `07-Prompt Library/00-START-HERE.md`") rather than looking for the literal command. |

## Rules for Codex

1. **Follow CLAUDE.md.** Every rule in CLAUDE.md applies to Codex identically.
2. **Never invent brand values, product data, URLs, or campaign content** (CLAUDE.md §5).
3. **Never send, schedule, or activate a Klaviyo campaign** (CLAUDE.md §8.1, §9, §13).
4. **Never skip Draft.** All HTML is authored in `Draft/` first, always (CLAUDE.md §4.1).
5. **Never edit `BRD.md` directly** — edit the modular section sources (CLAUDE.md §5).
6. **If information is missing, stop and request clarification** — do not guess.
7. **Findings go into CLAUDE.md, not AGENTS.md.** When a production lesson becomes a permanent rule
   (CLAUDE.md §8.1.7), add it to CLAUDE.md — that is where all agents read from.

---

_Created: 2026-09-13 · Reduced from full CLAUDE.md duplicate to a thin Codex routing file (Option C).
Canonical rules live in CLAUDE.md; this file routes Codex to them. No campaign, brand, QA, or Klaviyo
governance rule was changed._
