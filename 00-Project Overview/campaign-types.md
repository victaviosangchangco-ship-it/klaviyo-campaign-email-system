# Campaign Types

_Part of the BRD modular source. Human-first: this chapter explains **what each campaign type is for and
why they differ**. The operating mechanics live in `CLAUDE.md`; the per-type strategy lives in the
[Campaign Playbooks](../Playbooks/)._

## Why we have distinct campaign types

Different customer moments need different emails. A recurring weekly product email, a once-off product
launch, an end-of-financial-year push, and a "how to choose" guide are not the same job, and they should
not look or read the same. Treating every send as a "weekly with different products" flattens the
customer experience and wastes each moment's real intent. The system therefore recognises **ten campaign
types**, and each one owns a distinct psychology, hero approach, copy style, call-to-action, product
strategy, and quality bar.

The first planning decision for any send is **"which type is this?"** — the Campaign Selection Engine
(CLAUDE.md §5.3). Everything downstream (playbook, layout, QA) follows from that answer.

## The ten types

| Type | The moment it serves | Primary success signal |
|------|----------------------|------------------------|
| **Weekly** | The recurring heartbeat send; broad product coverage, fast to scan | Click-through |
| **Monthly** | A larger roundup / editorial narrative across the month | Revenue per recipient |
| **Product Launch** | Introducing something new as genuine news; premium, benefit-led, not discount-led | New-product traffic + first sales |
| **Holiday** | A dated calendar event (EOFY, Black Friday, Christmas) with a real deadline | Revenue in the window |
| **Seasonal** | A season-change range refresh; emotional, thematic, lifestyle-led | Range engagement |
| **Category** | A deep dive into one category/range with buying guidance | In-range conversion |
| **Clearance** | Genuine markdowns and honest finite-stock urgency | Sell-through / units |
| **Brand Story** | Values, provenance and trust; low product density, high credibility | Downstream engagement lift |
| **Educational** | How-to, compliance and buying guides; helpful, low pressure | Assisted conversion |
| **Automation** | Triggered/lifecycle content. Automated **flows** are built in the separate Klaviyo Flow project; this workspace coordinates the content | (per flow) |

## The rule that ties them together

**Never reuse the Weekly layout for another type.** Carry forward the brand's proven vibe and build
quality, but the structure, hero, copy and offer stance must fit the type's job. Each type has a
dedicated playbook and generate prompt so this is easy to get right; start from
[`07-Prompt Library/00-START-HERE.md`](../07-Prompt%20Library/00-START-HERE.md).

## How a type becomes a send

1. Identify the type (Campaign Selection Engine).
2. Read its [playbook](../Playbooks/) for strategy and its generate prompt for the build recipe.
3. Work the send through the six file-driven stages (see [File-Driven Architecture](file-driven-architecture.md)).
4. Verify products and brand values from approved sources only; never invent (see
   [Campaign Planning Framework](campaign-planning-framework.md)).
5. QA against the type's checklist and the email-client compatibility gates before it can ship.
