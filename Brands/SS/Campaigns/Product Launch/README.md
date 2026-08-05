# SS — Product Launch Campaign

**Campaign type:** Product Launch
**Purpose (one line):** Introduce a new product or range — announcement, benefits, premium presentation. Not discount-led.

## How to work in this folder
Follow the universal execution order in [`07-Prompt Library/00-START-HERE.md`](../../../../07-Prompt%20Library/00-START-HERE.md).
This campaign type is **not** a Weekly clone — read its playbook and its generate prompt before building.

| Step | Read / Do |
|------|-----------|
| Playbook | `../../../../Playbooks/Launch-Playbook.md` — psychology, design direction, CTA & product strategy, KPIs, common mistakes |
| Generate prompt | `07-Prompt Library/Generate-Product-Launch-Campaign.md` |
| QA | `07-Prompt Library/QA-Launch-Checklist.md` |

## Stage folders (left → right)
`Brief/` → `References/` → `Assets/` → `Draft/` → `Review/` → `Output/`

- **Brief/** — the specific send brief (from the Content Calendar / request).
- **References/** — screenshots & reference inputs (read-only; never shipped).
- **Assets/** — this send's image files. Sub-folders: `Hero/`, `Products/`, `Lifestyle/`, `Icons/`.
- **Draft/** — work-in-progress HTML (`SS-LAUNCH`-YYYY-<id>-draft-vN.html).
- **Review/** — rendered previews, reviewer notes, QA results.
- **Output/** — the latest generated HTML (un-versioned), kept in sync with the newest Draft; for browser/Klaviyo preview, QA and stakeholder review. Approval-to-send is tracked in `Brief/` + `Review/`, not by withholding HTML (CLAUDE.md §4.1/§9).

## Naming
Final HTML: `SS-LAUNCH-YYYY-<id>.html` (see CLAUDE.md §10 for the id token per cadence/type).
