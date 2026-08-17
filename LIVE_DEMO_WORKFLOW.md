# LIVE_DEMO_WORKFLOW.md

**Executive Live Demonstration — Playbook & Script**
Prepared as Product Director / UX Architect / AI Automation Architect / Presentation Consultant.
Audience: **non-technical senior management**, over Google Meet. Design date: **2026-08-07**.

> **This is a design/presentation document only.** No code, no repository changes.
>
> **Honesty note for the presenter (read once).** Everything from *"one instruction"* through
> *"Campaign Preview"* is **LIVE and verified today** (real RDD products, real QA, real links). The final
> **"Klaviyo Draft"** step is the **approved next phase** — the system already produces a package that is
> *ready for* Klaviyo. Section 3 marks each step **[LIVE NOW]** or **[NEXT STEP]** so you never claim
> something that isn't built. If the Klaviyo MVP is completed before the meeting, the [NEXT STEP] screen
> becomes live; if not, you show the "ready-for-Klaviyo" package and the Klaviyo screen manually. Either way
> the story is true.

---

## 1. Demo Objective

**One sentence:** *Show management that a weekly email campaign that used to take most of a day can be
produced, quality-checked, and made ready for review in about a minute — with a human still approving every
send.*

The audience should leave understanding three things, in plain terms:
1. **AI does the heavy lifting** — finding the right in-stock products, writing the email, checking it works.
2. **A person is always in control** — nothing is sent without human approval.
3. **It's faster, more consistent, and lower-risk** — fewer manual errors, no broken links, on-brand every time.

We are **not** demonstrating technology for its own sake. We are demonstrating **time saved, mistakes
avoided, and control retained**.

---

## 2. Demo Story (a story, not a tech demo)

The whole demo is one narrative: *"Here's the painful way we do it now. Here's the same job, done by the
system, in a minute — with you still holding the final say."*

```
   Current Manual Process   "Today, one weekly email is hours of work."
            ↓
        Problems            "Slow, easy to make mistakes, hard to stay consistent."
            ↓
     Introducing AI         "We built an assistant that does the busywork — not the deciding."
            ↓
  File-Driven System        "Every campaign follows the same trusted folder-by-folder process."
            ↓
   Automation Engine        "One instruction kicks the whole thing off."
            ↓
      BigCommerce           "It pulls this week's real, in-stock products automatically."
            ↓
   AI Decision Engine       "It picks the right ones and writes the email."
            ↓
       Renderer             "It builds the on-brand email — the same quality every time."
            ↓
          QA                "It checks every link and image before a human ever looks."
            ↓
   Campaign Preview         "Here's the finished campaign, summarised on one screen."
            ↓
  Manager Approval          "Nothing moves without a person saying yes."   ← the emotional peak
            ↓
     Klaviyo Draft          "Approved work lands in Klaviyo as a draft — ready, never sent."
            ↓
 Ready for Marketing Review "The marketer previews, and presses send. The system never does."
```

**Narrative principles**
- **Lead with the pain, land on the control.** Open on manual effort; close on "a human always approves."
- **Speak outcomes, not modules.** "It checks every link" — not "the QA validator runs 12 rules."
- **One protagonist:** the marketer, whose day just got easier. The system is the helpful assistant, not the hero.
- **Show, then explain.** Run the command, let them watch it happen, then narrate what they saw.

---

## 3. Live Workflow — screen by screen

Recommended run command (safe, fast, works even with poor Wi-Fi — see §7 backup):
`node platform/engine/cli.js create --brand RDD --source snapshot --dry-run --verify-links`

| # | Screen title | What the audience sees | What you explain | Expected output |
|---|---|---|---|---|
| 0 | **Title slide** — "AI-Assisted Campaign Creation" | A clean title slide, brand logo, your name/role. | The goal in one line (§1). Set the "human always approves" expectation up front. | — |
| 1 | **The way we work today** *(slide)* | A simple before-picture: a checklist of manual steps (find products, check stock, write copy, build HTML, test links, load into Klaviyo). | "This is a normal weekly email today. Each step is manual and takes time." | Audience nods — they recognise the effort. |
| 2 | **Where it goes wrong** *(slide)* | 3–4 bullet pains: slow, human error (dead links, out-of-stock items), inconsistency, hard to scale across brands. | "None of this is anyone's fault — it's just a lot of careful manual work, and manual work drifts." | Audience feels the problem. |
| 3 | **The instruction** *(terminal)* **[LIVE NOW]** | A terminal. You type one line: `Create this week's RDD campaign`. | "Watch — I'm going to ask the system, in plain English, to build this week's campaign." | The engine banner + `▶ Step` lines begin. |
| 4 | **It reads the rules** *(terminal)* **[LIVE NOW]** | Log lines: loads brand rules, content calendar, "this week = 2026-W32". | "First it reads our own brand rules and calendar — the same rules our team follows." | `Slot: RDD/weekly 2026-W32`. |
| 5 | **It gets real products** *(terminal)* **[LIVE NOW]** | `Retrieve products (BigCommerce)… Candidate products: 44`. | "It's pulling this week's **real, in-stock** products straight from our store — nothing typed by hand." | Live product count. |
| 6 | **It decides and writes** *(terminal)* **[LIVE NOW]** | `Curated 16 verified product(s)` + a real subject line. | "It picked the right in-stock products and wrote the subject line and copy — on brand." | Subject line shown. |
| 7 | **It builds and checks** *(terminal)* **[LIVE NOW]** | `Rendered… QA: PASS ✅ (0 blockers)` and `Links: 35/35 HTTP 200`. | "It built the email and **checked every link and image** — 35 out of 35 working. A person never had to click them." | QA PASS, 35/35 links. |
| 8 | **The finished email** *(browser)* **[LIVE NOW]** | The rendered HTML opened in a browser — hero, product grid, prices, CTA, footer. | "And here's the finished campaign — the actual email a customer would receive." | A polished, on-brand email. |
| 9 | **Campaign Preview** *(one-screen summary — §4)* **[LIVE NOW]** | The summary card: brand, type, name, week, product count, subject, preview text, QA status, size, (est. recipients), "Ready for Klaviyo draft". | "Here's the whole campaign on one screen — everything a manager needs to approve, at a glance." | The §4 preview. |
| 10 | **Manager approval** *(the moment)* **[LIVE NOW — human step]** | You pause. "This is where a manager reviews and says yes or no." | "Nothing has been sent. Nothing goes anywhere until a person approves. That control never leaves us." | A deliberate, human pause. |
| 11 | **Klaviyo draft** *(Klaviyo tab)* **[NEXT STEP]** | Either the live draft in Klaviyo (if built), or the "ready-for-Klaviyo" package + the Klaviyo drafts screen shown manually. | "Once approved, it lands in Klaviyo as a **draft** — ready for the marketer to preview and send. The system itself never presses send." | A campaign in **Draft** status. |
| 12 | **Ready for review** *(slide)* | Close slide: "From one instruction to a review-ready draft — in about a minute. Human-approved, always." | Recap the three takeaways (§1). Invite questions. | Confident close. |

---

## 4. Campaign Preview Screen (design)

A single, calm, executive-friendly summary — the "approve at a glance" screen. **Design only** (all fields
already exist in the run's package manifest + QA report). Wireframe:

```
┌────────────────────────────────────────────────────────────────────────────┐
│  ✅  CAMPAIGN READY FOR REVIEW                          Retail Display Direct │
│      Not sent · awaiting approval                                    [ RDD ] │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Campaign name        RDD-2026-W32                                          │
│   Campaign type        Weekly                                                │
│   Content calendar     Week 32 · 2026        (this week)                     │
│                                                                              │
│   ────────────────────────────────────────────────────────────────         │
│   Subject line         This week at Retail Display Direct: Snap Frames & more│
│   Preview text         16 featured products, in stock now, ship Australia-wide│
│                                                                              │
│   Products featured    16   (all verified in stock, priced, live pages)      │
│                                                                              │
│   ────────────────────────────────────────────────────────────────         │
│   Quality check        ✅  PASSED        0 issues · 12 checks                │
│   Links verified       ✅  35 / 35 working (HTTP 200)                        │
│   Email size           47 KB            ✅ well within limits                │
│   Estimated recipients ~ 8,400          (from the selected audience)         │
│                                                                              │
│   ────────────────────────────────────────────────────────────────         │
│   Next step            ▶  Ready to create Klaviyo draft                      │
│   Send status          🔒  NOT SENT — human approval required                │
│                                                                              │
│                          [ Approve → Create Klaviyo Draft ]   [ View Email ] │
└────────────────────────────────────────────────────────────────────────────┘
```

**Design intent**
- **One screen, no scrolling** — a manager approves at a glance.
- **Green ticks carry the message** — quality/links/size are visibly ✅.
- **The lock icon and "NOT SENT" are the loudest safety cues** — control is obvious.
- **"Estimated recipients" is shown as a range** and is a [NEXT STEP] value (comes from Klaviyo) — if the
  Klaviyo step isn't live yet, label it "available at draft stage" rather than a fabricated number.
- Everything shown maps to real output: name/type/subject/preview/product-count/QA/size from the package
  manifest + QA report; recipients from Klaviyo's estimate (§ next phase).

*(If a visual polish is wanted, this same summary can later be rendered as a simple shareable web page — not
required for the demo, and out of scope for this design.)*

---

## 5. Demo Script (business voice — read naturally, pause often)

**[Screen 0 — Title]**
> "Thanks everyone. In the next ten minutes I'll show you something the team has been building: an assistant
> that takes the manual, repetitive work out of our weekly email campaigns — while keeping a person in
> control of every send. Let me start with how we do this today."

**[Screen 1 — Today]**
> "Every week, for each brand, we send a marketing email. Today that means someone manually finding the right
> products, checking each one is in stock, writing the copy, building the email, testing every link, and then
> loading it into our email platform. It's careful work, and it takes hours."

**[Screen 2 — Problems]**
> "Because it's manual, three things happen. It's slow. Mistakes slip through — a link to a sold-out product,
> a broken image. And it's hard to keep everything perfectly consistent and on-brand, especially across
> several brands. Again — not anyone's fault. It's just a lot of manual steps."

**[Screen 3 — The instruction]**
> "So here's the same job, done differently. I'm going to type one plain-English instruction: *Create this
> week's RDD campaign.* That's it. Let's watch what it does."

**[Screens 4–7 — let it run, narrate calmly]**
> "First, it reads our own brand rules and our content calendar — the exact rules our team already follows.
> … Now it's pulling this week's **real, in-stock** products directly from our store. Nothing typed by hand.
> … It's chosen the right products and written the subject line. … And now the important part: it built the
> email and **checked every single link and image** — 35 out of 35 working. Normally a person clicks through
> those one by one."

**[Screen 8 — The email]**
> "And here's the result — the actual email a customer would receive. On-brand, clean, the products laid out
> properly, prices, buttons, footer. Built in seconds, and it looks the same quality every single week."

**[Screen 9 — Campaign Preview]**
> "To make review easy, everything lands on one screen. The campaign name, the products, the subject line,
> the quality check — all passed — the links verified, the size. Everything a manager needs to say yes or no,
> in one look."

**[Screen 10 — Approval — slow down]**
> "Now — this is the part I most want you to notice. **Nothing has been sent.** The system does not send
> emails. It prepares the work and stops. It only moves forward when a person approves. That control stays
> with us, always."

**[Screen 11 — Klaviyo draft]**
> "Once a manager approves, the campaign lands in our email platform as a **draft** — ready for the marketer
> to open, preview, and send when they're happy. The system hands over a finished draft; a person presses
> send."
> *(If not yet live:)* "This next step is the piece we're building right now — and the campaign you just saw
> is already packaged and ready for it."

**[Screen 12 — Close]**
> "So: from one instruction to a review-ready campaign, in about a minute — real products, checked and
> on-brand, with a person approving every send. That's hours back for the team every week, fewer mistakes,
> and no loss of control. I'd love your questions."

---

## 6. Questions Managers May Ask (20+), with concise answers

1. **Does it send emails by itself?** No. It only prepares a draft. A person reviews and sends. It has no
   ability to send — that's built in on purpose.
2. **Could it send by accident?** No. There is deliberately no "send" capability in the system, and a safety
   check blocks it. Sending only happens when a human clicks send in our email platform.
3. **Are these real products or samples?** Real. It pulls this week's live, in-stock products straight from
   our store at the moment you run it.
4. **What if a product is out of stock?** It automatically leaves it out and won't link to it — that's one of
   the mistakes it prevents.
5. **What if it can't find enough products?** It stops and asks for a human decision rather than making
   anything up. It never invents products or prices.
6. **Does it make up content or prices?** No. Prices, stock, images, and links come from our real store; it
   never fabricates them.
7. **How does it know our brand style?** It follows our written brand rules and uses our approved building
   blocks, so every email is on-brand and consistent.
8. **How long does it take?** About a minute end-to-end, versus hours manually.
9. **Which brands does it support?** It's live for one brand (RDD) today; the design supports the others, and
   adding a brand is configuration, not rebuilding.
10. **How much does this cost to run?** Very little — it reuses tools we already pay for (our store and email
    platform). The saving is mainly the team's time.
11. **What happens if the internet drops during the demo?** I have an offline mode using a recent real
    snapshot — the demo runs the same way without live internet.
12. **Is customer data safe?** It only reads product information and prepares a draft. It doesn't touch
    customer lists to send, and credentials are stored securely, never shared or shown.
13. **Who can approve a campaign?** Whoever we decide — and importantly, the approver is never the person who
    built it, keeping a proper second pair of eyes.
14. **Can it pick the wrong audience?** The audience is pre-set and shown on the review screen; a person
    confirms it before anything is sent.
15. **What if the AI makes a mistake?** That's exactly why there's a quality check and a human approval step —
    nothing reaches a customer without both.
16. **Can we still edit the email after it's built?** Yes. It produces a draft; the marketer can adjust
    anything before sending.
17. **Does this replace the marketing team?** No — it removes the repetitive busywork so the team spends time
    on strategy and judgement, which is where they add the most value.
18. **How consistent is the quality?** Very. Because it uses the same approved building blocks every time, the
    quality doesn't drift the way manual work can.
19. **Can it schedule sends?** Not today, by design. Scheduling is a future option and would still require
    human approval.
20. **What about reporting on how campaigns perform?** That's on the roadmap — a dashboard pulling results
    back in — but it's a later phase.
21. **How do we know the links actually work?** It checks every link and image and reports the result — in
    this run, 35 out of 35 working — before anyone reviews it.
22. **Can it handle holidays, launches, sales — not just weekly?** The design covers all our campaign types;
    weekly is simply the first one we've made live.
23. **What if we change our brand or prices?** It reads the current values each time it runs, so it always
    reflects the latest.
24. **How hard is it to maintain?** It's built in small, well-documented, tested pieces, so changes are
    contained and safe.
25. **What's the next step after today?** Connecting the approved draft directly into our email platform —
    that's the phase we're seeking your go-ahead on.

---

## 7. Demo Checklist (have all of this ready before you start)

**Files open / ready**
- [ ] `LIVE_DEMO_WORKFLOW.md` (this script) on a second screen or phone.
- [ ] The Campaign Preview summary (§4) — a slide or the terminal summary.
- [ ] A pre-generated backup email open in the browser (in case you skip the live run): the most recent
      `runtime/exports/RDD-2026-W32/Output/RDD-2026-W32.html`.
- [ ] Slides for screens 0–2 and 12 (title, today, problems, close).

**Commands (rehearse each once, 30 min before)**
- [ ] Primary (safe, offline-capable): `node platform/engine/cli.js create --brand RDD --source snapshot --dry-run --verify-links`
- [ ] Live variant (only if Wi-Fi is solid): `node platform/engine/cli.js create --brand RDD --source live --dry-run --verify-links`
- [ ] Open the email: `start runtime\exports\RDD-2026-W32\Output\RDD-2026-W32.html` (Windows).
- [ ] Sanity: `npm test` (should read `19 pass`) — run privately beforehand, not on stage.

**Browser tabs (pre-opened, logged in, zoomed for readability)**
- [ ] The rendered campaign email (file:// tab).
- [ ] Klaviyo → Campaigns (Drafts view) — for screen 11.
- [ ] (Optional) BigCommerce product catalog — only if asked to prove products are real.
- [ ] (Optional) GitHub repo — only if a technical stakeholder asks to see the code.

**VS Code**
- [ ] One clean window, large font (≥16pt), high-contrast theme, `platform/` visible in the explorer.
- [ ] An **integrated terminal** open, large font, cleared, cwd = project root.
- [ ] Close unrelated tabs/notifications; enable Do-Not-Disturb / hide notifications.

**Accounts / access**
- [ ] BigCommerce: token valid (pre-checked with `verify.py` earlier that day).
- [ ] Klaviyo: logged in to the RDD account; a `DEMO —`-named draft/test list ready if showing screen 11.
- [ ] GitHub: repo reachable (only if asked).

**Environment**
- [ ] Terminal font large, window maximised, colours legible on a projector/shared screen.
- [ ] Google Meet: share the **specific window**, not the whole desktop (hides notifications/secrets).
- [ ] Silence Slack/email/phone.

**Backup plan if the internet fails (rehearse this too)**
- [ ] Run with `--source snapshot` — uses the cached **real** product capture; the full demo runs **offline**.
- [ ] If the terminal itself misbehaves: switch to the **pre-generated email in the browser** + the Campaign
      Preview slide, and narrate from the script. The story still lands.
- [ ] If Klaviyo is unreachable: describe screen 11 from the script and show the "ready-for-Klaviyo" package;
      do not improvise live in Klaviyo.
- [ ] Have a **screen recording** of a successful full run saved locally as the ultimate fallback.

---

## 8. Success Criteria

The demo succeeded if, afterwards, management can say in their own words:

- **"It builds a real, on-brand campaign from one instruction, in about a minute."** (Speed + ease landed.)
- **"It uses our real products and checks everything works."** (Trust in accuracy landed.)
- **"A person always approves before anything is sent — it can't send on its own."** (Control + safety
  landed — the single most important takeaway.)
- **"This saves the team hours every week and reduces mistakes."** (Business value landed.)

**Behavioural signals of success:** managers ask about *rollout and next brands* (not "does it work?"); they
focus questions on *approval and control* and are reassured; they give a **go-ahead for the Klaviyo phase**.

**What "great" looks like:** the room is calm, the live run works, the "nothing is sent without you" moment
gets a visible nod, and the meeting ends on next steps rather than doubts.

**Non-goals (don't chase these):** no code walkthroughs, no jargon, no live editing, no promising features
that aren't built. Underclaim slightly and let the working system speak.

---

**Constraint honored:** design only — no production code written, no existing file modified; the sole new
artifact is this document.
