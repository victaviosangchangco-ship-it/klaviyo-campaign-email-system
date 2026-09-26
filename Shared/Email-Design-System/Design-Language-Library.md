# Design Language Library

> **Part of `Shared/Email-Design-System/` (STD-DESIGN).** Start at that folder's `README.md`.
> **Contains no HTML, no CSS, no Cerberus code, no brand values and no measurements.**
> Every value in pixels, every hex and every typeface lives in the owning brand's design document.

---

## Document control

| | |
|---|---|
| **Part of** | **STD-DESIGN** — `Shared/Email-Design-System/` |
| **Status** | **ACTIVE** |
| **Version** | **1.0.0** |
| **Owner** | Project Owner |
| **Applies to** | Klaviyo Campaign Email System · Klaviyo Flows Automation System |
| **Mirroring** | Byte-identical copies in both projects. Both canonical. Any change applies to both in the same edit. |
| **Scope** | **Visual decision-making only.** Selects a coherent visual personality. Governs no markup and no engineering rule. |

---

## 1. What a design language is, and why the library exists

A **design language** is a coherent set of visual decisions that hold together: how type behaves, how
space is distributed, what the Hero is for, how product is presented, how trust is expressed, and what the
email feels like. Choosing one *before* designing is what stops a template becoming a collection of
individually reasonable sections that do not add up.

**Why a library rather than one house style.** These projects serve several brands across many campaign
and flow types. A single house style would either be too loose to prevent drift or too tight to serve an
industrial B2B supplier and a premium retail brand at once. A library of named languages gives a
**decision** instead of a default, and makes that decision reviewable: *"this is Industrial B2B, so the
subordinate imagery and the utilitarian trust block are correct, not a shortfall."*

### 1.1 How to use it

1. Answer the questions in `Design-Decision-Matrix.md`.
2. Select **one** language. Record the choice and the reason in the creative proposal.
3. Take the Hero family from `Hero-Pattern-Library.md` and the sections from
   `Section-Pattern-Library.md`.
4. Apply the brand's own colours, typefaces and measurements from its design document.

### 1.2 The three rules of use

- **One language per email.** Mixing two is the most common cause of an email that "feels off" while every
  section is individually fine.
- **A language never overrides a brand fact.** Where a language suggests a treatment the brand's design
  document contradicts, the brand wins. Precedence is owned by each project's `CLAUDE.md`, not here.
- **A language is a starting position, not a cage.** Deviate deliberately and say why; drift silently and
  the language has stopped doing its job.

### 1.3 Reading the entries

| Field | What it answers |
|---|---|
| **Philosophy** | The single idea the language is built on |
| **Visual personality** | What the reader feels in the first second |
| **Typography style** | How type behaves — expressed as *relationships*, never as sizes |
| **Spacing philosophy** | How space is distributed and what it groups |
| **Hero behaviour** | What the first screen is for |
| **CTA behaviour** | How the action presents itself |
| **Imagery style** | What photography does, and how much of it |
| **Product presentation** | How a product is shown |
| **Trust presentation** | How credibility is expressed |
| **Footer treatment** | How the email ends |
| **Ideal flows** | Where it fits in the lifecycle |
| **Ideal brand profile** | The *kind* of brand it suits |
| **Strengths** | What it does better than the alternatives |
| **Weaknesses** | Where it fails, and what it costs |

**Type and space are given as ratios and relationships throughout.** A ratio is a design principle and
belongs here; a pixel value is a brand measurement and does not.

---

## 2. Selecting a language

| If the email's job is… | Start with |
|---|---|
| Sell a considered product, beautifully | **Premium Ecommerce** |
| Sell to a trade or specification buyer | **Industrial B2B** |
| Establish institutional credibility | **Premium Corporate** |
| Make one product feel inevitable | **Apple Minimal** |
| Feel calm, honest and uncluttered | **Scandinavian Minimal** |
| Tell a story worth reading | **Editorial Magazine** |
| Make the reader feel the object is precious | **Luxury Retail** |
| Convert a warm shopper efficiently | **Shopify Plus** |
| Explain a service or a benefit clearly | **Modern SaaS** |
| Show one product in full detail | **Product Showcase** |
| Announce an offer with energy | **Promotional Campaign** |
| Sell the life around the product | **Lifestyle Commerce** |
| Present many products fairly | **Grid Commerce** |
| Drive one action, hard | **Conversion Landing Page** |

**Adjacent pairs, so the choice is deliberate:** Premium Ecommerce vs Luxury Retail (desirability vs
preciousness) · Apple Minimal vs Scandinavian Minimal (inevitability vs honesty) · Shopify Plus vs Grid
Commerce (efficiency vs breadth) · Promotional Campaign vs Conversion Landing Page (energy vs single-mindedness).

---

## 3. The languages

### 3.1 Premium Ecommerce

- **Philosophy.** The product deserves space, and restraint signals quality.
- **Visual personality.** Confident, uncluttered, quietly expensive. Nothing shouts; the important thing is
  simply larger.
- **Typography style.** Wide display-to-body ratio, at least 2.5:1. Tracking inverted across the scale:
  open on small labels, tight on display sizes. Two weights carry everything.
- **Spacing philosophy.** Generous between movements, tight within them, so grouping does the explaining.
  Space is the primary hierarchy tool, ahead of colour.
- **Hero behaviour.** One product, large, on a committed surface. The first screen states one thing.
- **CTA behaviour.** One primary action, high contrast, unambiguous label naming the destination.
- **Imagery style.** Studio-clean, well-lit, generous margin. Quantity is low and quality is high.
- **Product presentation.** Large, framed, with its own surface. Never a thumbnail.
- **Trust presentation.** Understated and factual, placed near the decision rather than near the top.
- **Footer treatment.** Quiet, structured, complete. It closes the email rather than continuing it.
- **Ideal flows.** Browse Abandonment · Price Drop · Post Purchase · Cross Sell · VIP.
- **Ideal brand profile.** Considered purchases, real product photography, a brand that competes on
  quality rather than price.
- **Strengths.** Reads as premium at almost any content volume; ages well; forgiving of a short copy deck.
- **Weaknesses.** Needs genuinely good photography — it exposes weak assets rather than hiding them. Poor
  fit for a wide catalogue or a hard-urgency message.

### 3.2 Industrial B2B

- **Philosophy.** A specification buyer wants facts, fast, from a supplier who looks like it ships on time.
- **Visual personality.** Utilitarian, high-contrast, engineered. Confidence from precision, not polish.
- **Typography style.** Heavy weights, condensed or tightly-set display, uppercase tracked labels. Moderate
  display-to-body ratio around 2:1 — legibility outranks drama.
- **Spacing philosophy.** Efficient and consistent. Dense enough to feel substantial, regular enough to
  scan. Rhythm over luxury.
- **Hero behaviour.** Product or offer, immediately. No mood-setting: this reader arrived with a task.
- **CTA behaviour.** Blunt, full-width, verb-first. "View specifications", not "Discover more".
- **Imagery style.** Product-in-context or clean catalogue shots. Function over atmosphere.
- **Product presentation.** Clear, comparable, with the attributes that drive specification visible.
- **Trust presentation.** Prominent and concrete — standards compliance, warranty terms, delivery reach,
  years trading. This is a primary conversion element, not decoration.
- **Footer treatment.** Substantial and informative: contact routes, account and bulk-order paths.
- **Ideal flows.** Browse Abandonment · Abandoned Checkout · Replenishment · Back In Stock · Post Purchase.
- **Ideal brand profile.** Trade, construction, safety, facilities, government supply. Buyers who
  specify and re-order rather than browse.
- **Strengths.** Converts task-driven readers; tolerates dense information; credibility is built in.
- **Weaknesses.** Rarely feels aspirational; easily slides into the documentation look the Creative
  Workflow Standard prohibits if hierarchy is not deliberately designed.

### 3.3 Premium Corporate

- **Philosophy.** Institutional trust is the product. Look like an organisation that will still exist in
  ten years.
- **Visual personality.** Formal, composed, restrained. Authority rather than warmth.
- **Typography style.** Conservative scale, moderate contrast near 2:1, generous line height. Structure
  carries emphasis instead of scale.
- **Spacing philosophy.** Even and architectural. Predictable rhythm signals reliability.
- **Hero behaviour.** Statement or brand-led. Message before merchandise.
- **CTA behaviour.** Singular, measured, plainly labelled. Never urgent.
- **Imagery style.** Sparse and purposeful. Facilities, people, or nothing at all.
- **Product presentation.** Contextual and secondary; often a range rather than an item.
- **Trust presentation.** Central — accreditation, tenure, scale, governance.
- **Footer treatment.** Full and formal, closer to a letterhead than a shop footer.
- **Ideal flows.** Welcome Series · Sunset · Review Request · account and policy communications.
- **Ideal brand profile.** Government-facing, regulated, enterprise or institutional supply.
- **Strengths.** Highest credibility per pixel; safe for sensitive communications.
- **Weaknesses.** Low energy; poor at driving impulse; can read as cold or as a notice rather than an email.

### 3.4 Apple Minimal

- **Philosophy.** Remove everything that is not the product, then remove more. What remains feels
  inevitable.
- **Visual personality.** Calm, absolute, singular. One idea per screen, with nothing to compare it to.
- **Typography style.** Very wide display-to-body ratio, 3:1 or more, at light-to-medium weight. Tight
  tracking on display. Centred composition. **One** type size change per movement.
- **Spacing philosophy.** Extravagant. Emptiness is the most expensive material in the design and is
  spent deliberately.
- **Hero behaviour.** One product, centred, with more space around it than feels comfortable, and one line
  of copy.
- **CTA behaviour.** Understated and singular — often a plain link rather than a heavy button. The design
  assumes the reader is already persuaded.
- **Imagery style.** One hero image, immaculate, on a neutral field.
- **Product presentation.** Reverent. The product is the composition, not an element in it.
- **Trust presentation.** Almost absent. Confidence is implied by restraint; explicit reassurance would
  undercut it.
- **Footer treatment.** Minimal, small, quiet — compliance and nothing more.
- **Ideal flows.** Back In Stock · single-product launches · VIP.
- **Ideal brand profile.** One or few hero products, exceptional photography, an audience that already
  knows the brand.
- **Strengths.** Unmatched perceived quality; extremely high clarity; excellent on mobile.
- **Weaknesses.** **Fails completely with weak imagery** and cannot carry volume, comparison, or a
  detailed offer. Its understated CTA underperforms with a cold audience.

### 3.5 Scandinavian Minimal

- **Philosophy.** Honest, useful, unfussy. Quality shown through material and craft rather than through
  drama.
- **Visual personality.** Light, airy, humane. Warmer and less absolute than Apple Minimal.
- **Typography style.** Modest scale contrast near 2:1, light-to-regular weights, comfortable line height.
  Left-aligned and even.
- **Spacing philosophy.** Open and consistent, with a soft rhythm. Space feels natural rather than
  engineered.
- **Hero behaviour.** Product in a real setting, calmly framed.
- **CTA behaviour.** Gentle, clearly labelled, low-pressure.
- **Imagery style.** Natural light, muted palette, texture and material visible.
- **Product presentation.** In use, in context, at honest scale.
- **Trust presentation.** Woven into copy as craft, provenance and materials rather than badged.
- **Footer treatment.** Light, tidy, unobtrusive.
- **Ideal flows.** Welcome Series · Post Purchase · Replenishment · Review Request.
- **Ideal brand profile.** Design-led, material-led, sustainability-minded, calm brand voice.
- **Strengths.** Highly likeable; excellent for relationship-building; low fatigue over a long sequence.
- **Weaknesses.** Weak at urgency and at promotion; can under-deliver hierarchy if the palette is too
  even.

### 3.6 Editorial Magazine

- **Philosophy.** Earn the read. The email is content the reader chooses to consume.
- **Visual personality.** Considered, textured, authored. It looks like someone wrote it.
- **Typography style.** The widest working scale of any language — display, subhead, body, caption and
  tracked label all present and clearly ranked. Tracked micro-labels connect movements.
- **Spacing philosophy.** Deliberately uneven. Tight captions, generous section breaks. Asymmetry is
  intentional.
- **Hero behaviour.** A statement or an image with a title, in the manner of a cover.
- **CTA behaviour.** Sits inside the narrative flow, often as a strong text link, repeated at the close.
- **Imagery style.** Rich, varied crops, mixed scale. Photography carries meaning, not just mood.
- **Product presentation.** Woven into the story with captions; rarely a bare grid.
- **Trust presentation.** Implicit in the quality of the writing and the specificity of the detail.
- **Footer treatment.** Substantial, like a masthead — sections, social, credits.
- **Ideal flows.** Welcome Series · Brand Story · Post Purchase education · VIP · Cross Sell.
- **Ideal brand profile.** A brand with something to say — provenance, technique, a point of view.
- **Strengths.** Highest engagement depth; builds affinity; differentiates strongly.
- **Weaknesses.** Expensive in copy and art direction; slow to the CTA; poor for urgent or transactional
  messages.

### 3.7 Luxury Retail

- **Philosophy.** Scarcity, ceremony and restraint. The object is precious and the email behaves
  accordingly.
- **Visual personality.** Dark or deeply neutral, still, formal, hushed.
- **Typography style.** Small, widely tracked labels against large restrained display type. Very few words.
  Uppercase used with generous tracking.
- **Spacing philosophy.** Maximal and symmetrical. Centred composition. Space signals value.
- **Hero behaviour.** One object, lit, framed, with a single line of copy and nothing else.
- **CTA behaviour.** Single, quiet, high-contrast. Often outlined rather than filled. Never urgent.
- **Imagery style.** Dramatic lighting, dark or tonal grounds, tight product focus.
- **Product presentation.** As a specimen: framed, isolated, on its own surface.
- **Trust presentation.** Expressed as guarantee, provenance and service rather than as badges.
- **Footer treatment.** Discreet and formal, with concierge or contact routes prominent.
- **Ideal flows.** VIP · Customer Winback · Back In Stock for high-value items · Birthday.
- **Ideal brand profile.** High price point, low volume, brand equity that precedes the email.
- **Strengths.** Very high perceived value; excellent at making a discount feel like an invitation rather
  than a markdown.
- **Weaknesses.** Requires exceptional assets and disciplined copy; actively wrong for volume selling; a
  dark palette needs careful handling for legibility and for inverted-colour environments.

### 3.8 Shopify Plus

- **Philosophy.** The modern DTC standard: clear, efficient, conversion-tested, friendly.
- **Visual personality.** Bright, confident, contemporary. Familiar in the best sense.
- **Typography style.** Clear ranking with a moderate-to-wide ratio around 2.5:1, bold headlines, highly
  legible body.
- **Spacing philosophy.** Comfortable and regular. Predictable section rhythm, generous around the CTA.
- **Hero behaviour.** Product or offer stated immediately, with the action close behind.
- **CTA behaviour.** Prominent filled button, repeated once lower down, benefit-led label.
- **Imagery style.** Bright product photography, occasional lifestyle, consistent treatment.
- **Product presentation.** Clean cards with a clear name and a clear action.
- **Trust presentation.** A compact strip of concrete reassurance — delivery, returns, guarantee —
  positioned near the action.
- **Footer treatment.** Useful and navigational: categories, help, social, compliance.
- **Ideal flows.** Abandoned Checkout · Browse Abandonment · Cross Sell · Post Purchase · Welcome Series.
- **Ideal brand profile.** DTC or hybrid retail with a broad catalogue and a warm list.
- **Strengths.** Reliable conversion; works with average assets; fast to produce; easy to extend.
- **Weaknesses.** Least differentiated of the languages — competence rather than distinction. Slides into
  template-familiarity if hierarchy is not pushed.

### 3.9 Modern SaaS

- **Philosophy.** Explain a benefit clearly enough that the reader understands what changes for them.
- **Visual personality.** Clean, structured, systematic, approachable.
- **Typography style.** Strong subheads doing most of the work; moderate display contrast; short
  paragraphs and clear labels.
- **Spacing philosophy.** Modular and even. Each idea occupies a discrete, consistently-sized region.
- **Hero behaviour.** A benefit statement, not a product shot. Value before object.
- **CTA behaviour.** Prominent primary plus a legitimate secondary path — learn versus act.
- **Imagery style.** Diagrammatic, illustrative or absent. Photography is not the mechanism.
- **Product presentation.** As capability and outcome rather than as an object.
- **Trust presentation.** Logos, numbers, guarantees, social proof — stated plainly.
- **Footer treatment.** Structured and helpful: support, documentation, account.
- **Ideal flows.** Welcome Series · Post Purchase onboarding · Review Request · Sunset · educational
  sequences.
- **Ideal brand profile.** Service, subscription, warranty programme, account-based or B2B relationship.
- **Weaknesses / strengths.** **Strengths:** unmatched at explanation; excellent for onboarding; works with
  no photography at all. **Weaknesses:** the closest of all languages to the report-style layout the
  Creative Workflow Standard prohibits — modular evenness must be broken deliberately, or it reads as a
  dashboard.

### 3.10 Product Showcase

- **Philosophy.** One product, fully understood. The email is a considered presentation of a single thing.
- **Visual personality.** Focused, detailed, thorough, product-reverent.
- **Typography style.** Product name at display scale; specification and detail clearly subordinate;
  labels tracked and consistent.
- **Spacing philosophy.** Generous around the product, tighter through the detail. Space marks the shift
  from admiring to evaluating.
- **Hero behaviour.** The product, large, unambiguous, with its name and one reason to care.
- **CTA behaviour.** One action, repeated after the detail so a reader convinced by specifics can act
  immediately.
- **Imagery style.** Multiple views of the same product — full, detail, in use.
- **Product presentation.** Exhaustive and ordered: the object, then its attributes, then its proof.
- **Trust presentation.** Attached to the product — warranty, standards, materials, guarantee.
- **Footer treatment.** Standard, with a clear route to related items.
- **Ideal flows.** Back In Stock · product launch · Cross Sell for one hero item · Browse Abandonment for
  a single viewed product.
- **Ideal brand profile.** Considered purchases, specification-driven buyers, strong single products.
- **Strengths.** Best conversion for a known-intent reader; the detail answers objections in place.
- **Weaknesses.** Requires several good images of one product; wrong for range or offer messages; long, so
  the action must be repeated.

### 3.11 Promotional Campaign

- **Philosophy.** There is news, and the news is the design.
- **Visual personality.** High-energy, high-contrast, immediate. Unashamedly commercial.
- **Typography style.** The offer set at the largest scale in the email, with everything else clearly
  subordinate. Ratio 3:1 or wider between the offer figure and body.
- **Spacing philosophy.** Tighter than the premium languages. Momentum matters more than air.
- **Hero behaviour.** The offer, immediately, as the loudest element on the first screen.
- **CTA behaviour.** Large, filled, accented, repeated. Action-urgent labelling.
- **Imagery style.** Supporting, not leading. Product as proof that the offer is real.
- **Product presentation.** Compact and plural — enough to show the offer applies broadly.
- **Trust presentation.** Brief and functional, so the offer does not read as too good to be true.
- **Footer treatment.** Standard, with terms accessible.
- **Ideal flows.** Price Drop · Customer Winback later touches · Abandoned Checkout final touch · Birthday.
- **Ideal brand profile.** Any brand with a genuine, expressible offer.
- **Strengths.** Highest immediate response; unmistakable message; works with modest assets.
- **Weaknesses.** Fatigues a list quickly; erodes premium positioning if used often; **must never carry an
  unverifiable expiring claim** — in an evergreen flow that is prohibited by each project's `CLAUDE.md`.

### 3.12 Lifestyle Commerce

- **Philosophy.** Sell the situation the product belongs to, and the product sells itself.
- **Visual personality.** Warm, aspirational, human, in-context.
- **Typography style.** Moderate contrast; copy carries more weight than in the minimal languages; captions
  used meaningfully.
- **Spacing philosophy.** Relaxed and slightly irregular. Imagery often runs wider than the copy column.
- **Hero behaviour.** The product in use, in a real setting, with the reader implied in the frame.
- **CTA behaviour.** Invitational rather than transactional — "See it in your space".
- **Imagery style.** Environmental, peopled or site-based, natural light, real installations.
- **Product presentation.** Contextual first, catalogue second.
- **Trust presentation.** Social — real customers, real projects, real installations.
- **Footer treatment.** Warm, with social and community routes prominent.
- **Ideal flows.** Browse Abandonment · Welcome Series · Cross Sell · Post Purchase.
- **Ideal brand profile.** Products whose value is contextual — installed, worn, fitted or displayed.
- **Strengths.** Strong emotional pull; excellent for discovery and for early-sequence relationship
  building; makes utilitarian products desirable.
- **Weaknesses.** **Depends entirely on the existence of genuine in-situ photography.** Catalogue cut-outs
  cannot deliver it, and staged stock imagery reads as false — which is a semantic-continuity failure, not
  a taste issue.

### 3.13 Grid Commerce

- **Philosophy.** Many products, presented fairly, scanned quickly.
- **Visual personality.** Orderly, systematic, efficient, catalogue-like.
- **Typography style.** Compact and highly consistent. Ranking is carried by position and repetition more
  than by scale.
- **Spacing philosophy.** Regular and modular. Equal gutters, equal cards, predictable rows.
- **Hero behaviour.** Brief. A short framing statement, then the grid — the grid is the content.
- **CTA behaviour.** Per-item actions plus one closing primary. Individual items carry their own route.
- **Imagery style.** Consistent treatment across every item; uniformity is the point.
- **Product presentation.** Equal-weight cards, identical structure, comparable at a glance.
- **Trust presentation.** A single strip, once, usually near the close.
- **Footer treatment.** Navigational and category-rich.
- **Ideal flows.** Cross Sell · Replenishment · Customer Winback range reminders · category promotions.
- **Ideal brand profile.** Broad catalogue, repeat purchasing, buyers who compare.
- **Strengths.** Highest product exposure per email; scales to any catalogue size; efficient to produce.
- **Weaknesses.** **The language most prone to reading as a wireframe** — uniform cards with no focal
  point. It needs one deliberately promoted item or a strong opening statement to avoid flatness.

### 3.14 Conversion Landing Page

- **Philosophy.** One action. Everything in the email exists to produce it.
- **Visual personality.** Direct, persuasive, single-minded, sequenced.
- **Typography style.** Strong display for the promise, clear subheads for each objection, plain body.
- **Spacing philosophy.** Purposeful and forward-moving. Each block hands the reader to the next; no
  section is decorative.
- **Hero behaviour.** The promise plus the action, immediately. The CTA appears on the first screen.
- **CTA behaviour.** The same primary action repeated at every natural decision point, identically labelled.
  No competing secondary.
- **Imagery style.** Only where it removes an objection. Otherwise absent.
- **Product presentation.** As the solution to a stated problem.
- **Trust presentation.** Load-bearing and placed adjacent to each CTA — guarantee, returns, proof.
- **Footer treatment.** Deliberately minimal, so nothing competes with the action.
- **Ideal flows.** Abandoned Checkout final touch · Customer Winback final touch · Sunset · time-critical
  offers.
- **Ideal brand profile.** Any brand where a single measurable conversion is the whole objective.
- **Strengths.** Highest conversion rate per send when intent already exists.
- **Weaknesses.** Builds no brand equity; repetitive CTAs fatigue quickly; wrong for discovery, education
  or relationship-building; must not manufacture urgency an evergreen flow cannot honour.

---

## 4. Cross-cutting rules

### 4.1 One language per email

Two languages in one email produce sections that are individually correct and collectively incoherent.
If an email genuinely needs two personalities, it is two emails in a sequence.

### 4.2 A language may not be used to justify a prohibited technique

Nothing here authorises anything the engineering standards forbid. Where a language's ambition and an
engineering prohibition collide, the resolution path is the Creative Workflow Standard's engineering
handoff — find a different mechanism for the same intent.

### 4.3 A language does not survive contact with the wrong assets

Four languages have a hard asset dependency, and choosing them without the assets is the most common way
this library gets misused:

| Language | Requires | If absent |
|---|---|---|
| **Apple Minimal** | One immaculate hero image | Choose Premium Ecommerce |
| **Luxury Retail** | Dramatic lighting, tonal grounds | Choose Premium Ecommerce |
| **Lifestyle Commerce** | Genuine in-situ photography | Choose Product Showcase or Grid Commerce |
| **Editorial Magazine** | Real copy, written to length | Choose Shopify Plus |

**Check the assets before committing to the language**, in the same spirit as the geometry gate: the asset
decides, so the brief must decide first.

### 4.4 A language must not be inherited by default

The previous template's language is not this template's language. A flow's later touch frequently needs a
different language from its first — a Winback first touch and a Winback final touch are not the same
email. Record the choice every time.

### 4.5 Register the choice

The selected language is recorded in the creative proposal and in the built template's header comment,
alongside the Hero pattern. This makes a design reviewable against an intention rather than against taste.

---

## 5. Change log

| Date | Version | Change | Both copies |
|---|---|---|---|
| 2026-07-29 | 1.0.0 | Library established with fourteen design languages, the selection table, the adjacent-pair distinctions, and the cross-cutting rules including the asset-dependency table (§4.3). | ✔ |

---

*Holds visual decisions only. Every measurement, hex value and typeface belongs to the owning brand's
design document; every build rule belongs to the standards registered in `Shared/Engineering/README.md` §3.*
