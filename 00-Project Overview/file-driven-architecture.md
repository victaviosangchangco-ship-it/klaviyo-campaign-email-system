# File-Driven Architecture

_Part of the BRD modular source. Human-first: how campaign work is organised on disk so every send is
repeatable, reviewable and auditable._

## The idea

Every campaign is produced by moving a send through a fixed sequence of **stage folders**. The folders
are the workflow: what exists in each folder tells you exactly how far a send has progressed, and anyone
can pick it up. Nothing lives "in someone's head" or in a chat thread.

## Brand → Campaign type → Stages

```
Brands/
  <BRAND>/                     (RDD, SC, SS, Stack)
    Assets/                    evergreen brand assets (logos, icons) reused by every send
    Campaigns/
      <Type>/                  Weekly · Monthly · Product Launch · Holiday · Seasonal ·
                               Category · Clearance · Brand Story · Educational · Automation
        Brief/                 1. the specific send brief
        References/            2. screenshots & reference inputs (read-only, never shipped)
        Assets/                3. this send's images
        Draft/                 4. work-in-progress HTML (versioned -draft-vN)
        Review/                5. rendered previews, reviewer notes, QA results
        Output/                6. the latest generated HTML (un-versioned; for preview/QA/review)
```

**Every brand supports every campaign type** — the same ten `Campaigns/<Type>/` folders exist under each
brand, so the system scales the same way for all of them. Product Launch additionally has a richer
`Assets/` sub-structure (`Hero/`, `Products/`, `Lifestyle/`, `Icons/`).

## The six stages (left → right)

1. **Brief** — capture the send's intent from the Content Calendar / request.
2. **References** — gather visual direction (never overrides verified data or brand rules).
3. **Assets** — collect this send's verified images.
4. **Draft** — build the HTML from the shared framework + verified values.
5. **Review** — render, review against standards, run QA; record what was checked.
6. **Output** — always holds the latest build (un-versioned) for browser/Klaviyo preview, QA and review;
   kept in sync with the newest Draft. Approval-to-send is a status in Brief/Review, not folder placement;
   revisions start a new Draft version, then Output is refreshed to match.

## Shared, not duplicated

All brands share one framework — `Templates/`, `Components/`, `Shared/`. Only brand-dependent values
(colours, logo, type, product data) differ, applied at generation. Reusable markup lives once in the
shared layer; send-specific material lives only in that send's campaign folder. This keeps ten campaign
types across four brands maintainable from a single system.

## Why this matters (business view)

- **Repeatable** — any send follows the same path; quality does not depend on who built it.
- **Auditable** — the folder state is the status; approvals and QA are recorded in `Review/`.
- **Scalable** — adding a campaign type or a brand is adding folders, not rebuilding the system.

See also: [Campaign Types](campaign-types.md) · [Execution Order](execution-order.md) ·
[Campaign Planning Framework](campaign-planning-framework.md).
