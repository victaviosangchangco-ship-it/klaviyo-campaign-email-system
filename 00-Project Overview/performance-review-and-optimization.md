# Campaign Performance Review & Optimization

This section defines what happens **after a campaign is sent** — how we review its result and turn that
read into a better next campaign. It closes the loop that [Human Workflow](human-workflow.md) opens at
steps 8–9 (Reporting and Continuous improvement) and gives the programme a repeatable rhythm rather than
an ad-hoc glance at the numbers.

It does **not** redefine the metrics themselves — those live once in
[Success Metrics](success-metrics.md) and are referenced, not restated. This section defines the
**ritual**: when we review, what we look at together, and how a finding becomes a lasting improvement.

## Why this matters

The system already sets a quality bar *before* send (brief, standards, QA gate). Without an equal
discipline *after* send, results are observed but rarely acted on, and the same missed opportunity
repeats. A light, consistent review turns each send into evidence and makes improvement compound —
directly serving the "improve the system, not just the send" principle.

## Two review rhythms

The programme runs two complementary reviews. Neither is heavy; both are recorded.

| Rhythm | When | Question it answers | Owner |
|--------|------|---------------------|-------|
| **Per-campaign review** | Shortly after each send, once results have settled | Did *this* send meet the goal set in its brief? | Campaign Manager |
| **Programme review** | On a regular cadence across many sends | Is the *mix* working, and what should change in templates, standards, or the type mix? | Campaign Manager, with the Sponsor informed |

## Per-campaign review

After each send, capture a short read **against the brief's own success criteria** (see the
[Campaign Planning Framework](campaign-planning-framework.md)) and the programme
[Success Metrics](success-metrics.md). Keep it to a page — the goal is a usable signal, not a report.

Record:

- **Result vs intent** — did the send achieve the single primary objective stated in its brief?
- **The primary metric for its type** — each campaign type names one defining metric in its
  [playbook](campaign-playbooks.md) KPIs (for example, click-through for Weekly, revenue-in-window for
  Holiday). Judge the send first on that.
- **The read across metrics together** — never one number in isolation (per
  [Success Metrics](success-metrics.md): a high open but low click points to content/offer; healthy click
  but low conversion points to landing or price; rising unsubscribes point to frequency or relevance).
- **One thing to keep, one thing to change** — the smallest honest conclusion the next send can act on.

## Programme review

On a regular cadence, step back from the individual send to the **portfolio**:

- Are the right **campaign types** running for each brand, in the right proportion? Feed the read back
  into the type mix in [Campaign Strategy](campaign-strategy.md).
- Are there **recurring QA or rework issues**? A pattern is a standards or template problem to fix once,
  not a per-campaign chore.
- Which **lessons** should be promoted from a single send into a durable place — a
  [playbook](campaign-playbooks.md) "Lessons Learned", a standard, a template, or a
  [Decision Log](../09-Architecture%20Decisions/Decision-Log.md) entry?

## From finding to improvement

An observation only has value once it changes something. The optimization loop is deliberately simple:

1. **State it as a small, testable idea.** "A benefit-led hero lifts click-through for this brand's
   Weekly" is actionable; "the last send felt flat" is not.
2. **Change one thing at a time.** Isolating a single variable per send keeps the read honest while
   formal experimentation is still on the roadmap (below).
3. **Observe against the same metric.** Compare like with like — the type's primary metric, same brand,
   a fair baseline.
4. **Promote the winner to where it lasts.** A proven improvement belongs in a template, a standard, a
   playbook's Lessons Learned, or — if it is a lasting decision — the
   [Decision Log](../09-Architecture%20Decisions/Decision-Log.md). A finding left only in a review note
   will be relearned.

## Relationship to formal testing

Structured **A/B testing, attribution, and consolidated analytics are on the
[Future Roadmap](../05-Future/roadmap.md)** (Horizon 3) and are not assumed here. Until they land, this
loop uses the sending platform's native reporting plus reviewer judgement and disciplined before/after
comparison. When the A/B Testing Framework graduates from the roadmap, it slots into step 3 above as the
rigorous form of "observe against the same metric" — it does not replace this review rhythm, it sharpens
it.

## Roles

Responsibilities follow the RACI in [Stakeholders](stakeholders.md). In summary: the **Campaign Manager**
owns both reviews and the decision on what to change; the **Reviewer/QA** supplies the quality and rework
signal; the **Brand Owner** is consulted where a change is brand-specific; the **Sponsor** is informed by
the programme review. As everywhere in this system, changes to shared standards or templates are made
once, in their single home, and never duplicated.
