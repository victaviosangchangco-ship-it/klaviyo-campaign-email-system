# Human Workflow

This section describes how the **human team** takes a campaign from idea to launch and beyond. It is the
people-and-process view. (The separate `CLAUDE.md` describes how an assisting tool supports production;
that is deliberately not repeated here.)

The workflow is a loop, not a line: every campaign ends by feeding lessons back into the next.

## The stages

1. **Planning.** The Campaign Manager works from the calendar (holidays, seasons, business priorities in
   the [Content Calendar](content-calendar.md)) and decides which campaign to run and why. Output: a slot
   on the calendar with a stated goal.

2. **Proposal / Brief.** The campaign is written up using the
   [Campaign Planning Framework](campaign-planning-framework.md): goal, type, audience, offer, products,
   hero, theme, CTAs, expected emotion/action, success criteria, and risks. Output: an approved brief.

3. **Review of the brief.** Before any design work, the brief is sanity-checked — is the offer real and
   confirmable, is stock available, is the theme fresh, are the dates right? Catching problems here is
   far cheaper than at QA.

4. **Approval to proceed.** The Approver (or Campaign Manager per the RACI in
   [Stakeholders](stakeholders.md)) confirms the brief is worth building.

5. **Design & production.** Content and design are produced against the brief and the
   [Campaign Standards](Campaign-Standards.md), using shared assets and templates. Brand rules come from
   the [Brand documentation](../03-Brands/). Output: a draft campaign.

6. **QA.** An independent reviewer (never the author) checks the draft against the standards and the
   QA checklist — content, links, images, stock, coupon, accessibility, and desktop + mobile rendering.
   Output: a pass, or a list of fixes.

7. **Launch / Send.** Once approved, the final campaign is scheduled and sent on the platform. Output:
   a live campaign and a recorded, approved final version.

8. **Reporting.** After send, results are captured against the campaign's success criteria and the
   programme [Success Metrics](success-metrics.md). Output: a short read on what happened.

9. **Continuous improvement.** Lessons — what worked, what didn't, what to standardise — are fed back
   into templates, standards, and the [Decision Log](../09-Architecture%20Decisions/Decision-Log.md), so
   the next campaign starts from a better baseline.

## Roles at each stage

Responsibilities follow the RACI in [Stakeholders](stakeholders.md). In summary: the **Campaign Manager**
owns planning and the brief; **Content Author** and **Designer** produce; the **Brand Owner** is consulted
whenever a decision is brand-specific; the **Reviewer/QA** gates quality; and the **Approver** authorises
the send. A single person may hold several roles, provided **the reviewer/approver of a campaign is never
its author** (separation of duties).

## Principles

- **Plan before building.** No design work starts without an approved brief.
- **One quality gate, always.** No campaign reaches send without independent QA and approval.
- **Fix the system, not just the send.** When something goes wrong, update the standard or template so it
  can't recur — don't just patch the one email.
- **Keep humans in charge.** Assisting tools accelerate production, but a person reviews and approves
  every campaign before it goes out.
