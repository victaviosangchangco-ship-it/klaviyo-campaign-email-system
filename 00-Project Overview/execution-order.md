# Execution Order

_Part of the BRD modular source. Human-first: the fixed order in which any campaign task is done, so
output is consistent and nothing important is skipped. The tool-facing version lives in
`07-Prompt Library/00-START-HERE.md`; this chapter explains the intent._

## The universal order

1. **Read `CLAUDE.md`** — the operating rules and standards.
2. **Read the `BRD`** — the business goals, strategy, psychology and human workflow (the *why*).
3. **Read the brand's approved sources** — the brand document and, where available, `BrandConfig.md` /
   `Design.md`. Carry confidence tags (`[Confirmed]` / `[Inferred]` / `To be confirmed`).
4. **Read the Campaign Playbook** for the type — strategy for this specific kind of send.
5. **Read the current prompt / brief** — the generate prompt for the type and the send's brief.
6. **Generate** — build from the shared framework and verified values.
7. **QA** — run the type's checklist and verify across real email clients.
8. **Update the Review notes** — record what was checked, in which clients, and the approval trail.
9. **Improve the system** — if the send revealed a reusable lesson, add it to `CLAUDE.md` (never edit the
   BRD from production work; raise a modular-source change instead).

## The two permanent guardrails

- **If information is missing, stop and ask.** Never invent brand values, product data, SKUs, prices,
  URLs, images or coupon codes. A missing value is `To be confirmed`, not a guess.
- **Choose the campaign type first.** The type decides the playbook, layout and QA. Getting the type
  right is the difference between a launch that feels like news and a launch that feels like a weekly.

## Why the order is fixed

The order moves from *most authoritative* (BRD, brand sources) to *most specific* (the individual send),
so every decision is anchored in an approved source before any pixels are produced. This is what makes
generation deterministic and review fast: the reviewer can trace every value back to where it came from.

See also: [Campaign Types](campaign-types.md) · [File-Driven Architecture](file-driven-architecture.md) ·
[Campaign Planning Framework](campaign-planning-framework.md).
