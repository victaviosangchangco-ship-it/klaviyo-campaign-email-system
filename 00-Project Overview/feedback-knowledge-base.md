# Feedback Knowledge Base

This is the **single index** to the standing feedback that governs how campaigns are produced — the
directions that must be honoured on every relevant send. It exists so that recurring, cross-cutting
feedback can be **seen in one place** and does not have to be rediscovered send by send.

It is an **index, not a second copy**. The authoritative wording of each item lives in its home — a
campaign [playbook](campaign-playbooks.md), a [Campaign Standard](Campaign-Standards.md), or a rule in
`CLAUDE.md`. This page themes that feedback and points to the source of truth; it never restates or
overrides it. On any conflict, the home document wins.

## How feedback is organised

- **Type-specific feedback** lives in that type's playbook, in its **Bruce Feedback** section
  (`../Playbooks/<Type>-Playbook.md`). That is the source of truth for feedback tied to one campaign type.
- **Cross-cutting feedback** — direction that recurs across several types — is themed below, with a link
  to where it is authoritatively stated.
- **Reusable build rules** born from feedback live in `CLAUDE.md`; **business decisions** born from
  feedback live in the [Decision Log](../09-Architecture%20Decisions/Decision-Log.md).

## Cross-cutting themes

Standing feedback that applies across campaign types. Each row links to its authoritative home.

| Theme | The standing direction | Authoritative home |
|-------|------------------------|--------------------|
| **Value before the ask** | Lead with range, theme and usefulness; let the hook land before any discount appears. | [Campaign Strategy](campaign-strategy.md) · playbook Hero/CTA sections |
| **Fresh every send** | Never recycle a previous theme, eyebrow, headline concept, hero treatment or promo/coupon title. | [Campaign Psychology](campaign-psychology.md) · `CLAUDE.md` §5.2, §6.5 |
| **Prove it in the real client** | Do not approve on a desktop or local preview; verify rendering and every link after the platform has processed the send. | [Campaign Standards](Campaign-Standards.md) · `CLAUDE.md` §8.1 |
| **Preserve what works** | Keep the proven structure and the established brand feel; change direction only when feedback explicitly calls for it. | Playbook Bruce Feedback sections · `CLAUDE.md` §6.3 |
| **Premium editorial restraint** | A campaign should read like a premium editorial email, not a promotional catalogue; restraint is the default. | `CLAUDE.md` §5.1.3 · [Campaign Psychology](campaign-psychology.md) |
| **Readability first** | Keep hierarchy and type readable for the audience; some brands serve an older audience and must not use cramped or tiny text. | Brand documents · `CLAUDE.md` §6.4 |
| **Real, live, verified links** | Every clickable element points to a real, live, verified destination; never a placeholder, a dead link, or a generic fallback. | [Campaign Standards](Campaign-Standards.md) · `CLAUDE.md` §6.7 |

## How an item enters the knowledge base

When Bruce (or any approver) gives feedback that should hold on future sends:

1. **Record it once, in its home** — the relevant playbook's Bruce Feedback section if it is
   type-specific; a standard or `CLAUDE.md` rule if it is a reusable production rule; the
   [Decision Log](../09-Architecture%20Decisions/Decision-Log.md) if it is a business decision.
2. **Index it here** if it recurs across types, so it is visible in one place. Add a row above with a
   link to the home — do not paste the wording.
3. **Retire it here, not there.** If feedback is superseded, update the home document; this index then
   follows. Nothing is deleted from the home's history.

## Why keep it as an index

Duplicating feedback would create exactly the drift this system exists to prevent: two copies that fall
out of step, and no clear source of truth. Keeping one indexed view over many single homes gives the team
a fast way to see all standing feedback while preserving the single-source-of-truth rule.

See also: [Campaign Playbooks](campaign-playbooks.md) · [Human Workflow](human-workflow.md) ·
[Campaign Performance Review & Optimization](performance-review-and-optimization.md).
