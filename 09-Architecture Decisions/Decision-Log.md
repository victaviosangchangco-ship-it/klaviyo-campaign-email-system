# Decision Log

A running record of significant decisions about the Email Campaign System and its campaigns — the
business and design choices worth remembering. It exists so the team can see **what** was decided,
**why**, and **who** owns it, without that context living only in someone's memory or a chat thread.

## How to use this log

- Record a decision when it sets a direction, changes a standard, or would otherwise be re-litigated
  later ("why do we do it this way?").
- Keep entries short. Link out to the fuller detail (a brand doc, a standard, `CLAUDE.md`) rather than
  repeating it here.
- Never delete an entry. If a decision is reversed, add a new entry that supersedes it and mark the old
  one **Superseded**.

## Entry format

Each decision records: **Decision · Reason · Expected outcome · Date · Owner · Status**
(Status = Proposed / Approved / Superseded).

## Decisions

| # | Decision | Reason | Expected outcome | Date | Owner | Status |
|---|----------|--------|------------------|------|-------|--------|
| D-01 | Plan before building — documentation is approved before implementation | Reduce rework and align the team on direction first | Fewer false starts; a clear reference to build from | 2026-07-10 | Project Owner | Approved |
| D-02 | One unified framework with a thin brand layer — shared rules written once; only brand-dependent values differ | Eliminate duplication and enable scaling across brands | Faster production; consistent output; easy to add brands | 2026-07-10 | Project Owner | Approved |
| D-03 | Keep this system separate from the Klaviyo Flow project | Scheduled campaigns and automated flows are distinct lifecycles | No overlap or conflicting ownership | 2026-07-10 | Project Owner | Approved |
| D-04 | Independent review/approval required before send (reviewer/approver ≠ author) | Protect quality; catch errors an author is blind to | Consistent quality gate on every send | 2026-07-10 | Project Owner | Approved |
| D-05 | Verify product stock on the product page, not category listings | Category pages misreport availability, risking out-of-stock features | No out-of-stock or fabricated products in sends | 2026-07-14 | Reviewer/QA | Approved |
| D-06 | Keep images email-safe in weight; optimise the *same* approved creative rather than substituting a different image | Oversized images break in mobile clients; substitutions damage the approved design | Reliable rendering on mobile without losing the creative | 2026-07-14 | Reviewer/QA | Approved |
| D-07 | SectorCare (SC) coupons are fixed-dollar ("$20 off orders over $200") by default; no percentage discounts unless a special arrangement is approved | Aligns with Bruce's stated commercial policy for SC | Consistent, on-policy SC offers | 2026-07-14 | Brand Owner (SC) | Approved |
| D-08 | Every weekly send must use a fresh angle/theme/hero — no reuse of the previous week's concept | Repetition trains customers to ignore the emails | Higher engagement; a varied, planned programme | 2026-07-14 | Campaign Manager | Approved |

New decisions are appended with the next D-## number. Related operating rules are enforced in
`CLAUDE.md`; this log records the business rationale behind them.
