# Success Metrics & Measurement

This section defines how we measure success — both the **marketing performance** of campaigns and the
**operational health** of the system that produces them. Metrics turn the goals in
[Objectives & Goals](objectives-and-goals.md) into something we can track and improve.

Targets are set per brand and reviewed over time; early sends establish the baseline before firm targets
are fixed.

## Marketing performance KPIs

| Metric | What it tells us | Why it matters |
|--------|------------------|----------------|
| **Open rate** | Share of recipients who open the email | Health of subject line, sender reputation, and timing |
| **Click-through rate (CTR)** | Share who click a link | How compelling the content, offer, and CTA are |
| **Conversion rate** | Share who complete the desired action (e.g. purchase) | The campaign's real commercial effectiveness |
| **Revenue** | Sales attributed to the campaign | The bottom-line result; track vs baseline and vs target |
| **Bounce rate** | Emails that failed to deliver | List quality and deliverability health |
| **Unsubscribe rate** | Share who opt out | Whether frequency/relevance is right; a rising rate is an early warning |

Read these together, not in isolation: a high open but low CTR points to content/offer; healthy CTR but
low conversion points to the landing experience or price; a rising unsubscribe rate suggests we are
sending too often or off-target.

## Operational / quality KPIs

| Metric | What it tells us | Why it matters |
|--------|------------------|----------------|
| **Campaign production time** | Hours from brief to send-ready | Measures whether the system is delivering the efficiency goal |
| **QA issues per campaign** | Defects found at review | Measures quality of production and whether standards are working |
| **Brand consistency score** | How well a send adheres to brand + campaign standards (reviewer-assessed) | Measures the consistency goal directly |
| **Rework rate** | Share of sends needing significant fixes after QA | Signals gaps in briefs, standards, or templates |
| **On-time send rate** | Sends shipped on the planned date | Measures planning discipline |

## How we use metrics

- **Baseline first.** Record results from early sends to establish a per-brand baseline before setting
  targets.
- **Review on a cadence.** Look at marketing KPIs per campaign and operational KPIs periodically across
  the programme.
- **Act on the read.** Feed findings into the mix of [campaign types](campaign-strategy.md), the
  templates and standards, and the [Decision Log](../09-Architecture%20Decisions/Decision-Log.md).
- **Improve the system, not just the send.** A recurring QA issue is a standards/template problem to fix
  once, not a per-campaign chore.

Formal analytics, attribution, and A/B testing are on the [Future Roadmap](../05-Future/roadmap.md);
until those land, measurement uses the sending platform's native reporting plus reviewer assessment.
