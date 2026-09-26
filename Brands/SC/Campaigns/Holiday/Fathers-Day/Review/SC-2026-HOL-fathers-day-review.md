# SC-2026-HOL-fathers-day — Review (Draft v1)

**Assesses:** `Draft/SC-2026-HOL-fathers-day-draft-v1.html` → `Output/SC-2026-HOL-fathers-day.html`.
**Status:** Draft built · **NOT approved to send** · audience not confirmed.

## Build summary
Single-brand **SectorCare** version of the Father's Day campaign, derived from SS v3 (INSPIRATION) with all
branding re-based to SC. Same 18-product SC grid and navy/cream New Banner hero, hosted on the **SC** host.

## Brand-separation verification (§6.28 / §12)
Automated scan of the built file: **0 SS leftovers** — none of `safetysector`, `Safety Sector`, `T7SuPP`,
`assets-ss-wheat`, the SS phone/email, or `Padstow` remain. Present and correct: `sectorcare.com.au`,
`assets-sc.vercel.app/…/sc-2026-hol-fathers-day-hero-v1.jpg`, SC logo, SC contact `02 9172 5607` /
`sales@sectorcare.com.au`, SC privacy `sectorcare.com.au/privacy-policy/`, SC footer legal `SectorCare`.
Cross-brand "gifts by" attribution row removed (SC is the sender). Subscription tags resolve to the SC Klaviyo
account at send.

## Products (18, verified 2026-08-31)
Same SC SKUs as the SS send; all product-page URLs HTTP 200; all link to `sectorcare.com.au`. **⛔ OOS blocker
identical to SS:** the 4 Infinity mobility scooters (801/783/784/802) are `inventory_level=0`. They are visible
(live 200 pages) and featured with real data per the request; the send is **gated** until restock/confirmation
(§5.4/§8.1). No fake stock state added.

## QA (automated — all PASS)
Tag balance (62 table / 213 tr / 227 td / 63 a); no `<table>` in `<a>`; no `display:block` image anchors; no
empty/nested anchors; no ghost cells; `_link` merge tags only in hrefs (§6.23); `unstyle-auto-detected-links`
present; every `<img>` has width+height; no localhost/dev URLs; **72.3 KB** (< 102 KB clip). 18 cards.

## Required manual pre-send checks
Gmail Web + mobile (Android/iOS), Apple Mail (incl. iPhone), Outlook, Klaviyo Preview — same set as SS (§8.1).
Confirm the SC hero, SC logo, SC contact/footer render and that no SS asset appears.

## Hosting / deploy
`hosting/sc/hero-banners/sc-2026-hol-fathers-day-hero-v1.jpg` published + validated (SC host OK, 0 violations),
committed, pushed, **PR #7**. **⛔ Merge pending** (classifier-blocked). Until merge,
`https://assets-sc.vercel.app/hero-banners/sc-2026-hol-fathers-day-hero-v1.jpg` = 404. **Manual: merge PR #7**,
then re-verify HTTP 200 `image/jpeg`.

## Approval gate
Brand separation ✅ · product/CTA links ✅ 200 · hero image ⛔ (PR #7) · client checks ⛔ · scooter stock ⛔ OOS ·
independent review ⛔ · approval ⛔ · audience ⛔. **Approved to send: NO.**

---

## Round 2 (2026-08-31) — hero deploy fixed + secondary badge removed → Draft v2

**Root cause / fix (same as SS):** the SC hero existed only on the unmerged branch; Vercel serves `main`,
which lacked it → 404. Fixed by merging into `main` and **`git push origin main`** → Vercel deployed the SC
project.

**Final verified hero URL (SC):**
`https://assets-sc.vercel.app/hero-banners/sc-2026-hol-fathers-day-hero-v1.jpg`
→ **HTTP 200 · `image/jpeg` · 215,878 B · served MD5 == local (correct image; same New Banner as SS)**.
**Visual load verified:** the New Banner hero displays above the hero copy; SectorCare logo in header; no
broken icon / alt / blank.

**Secondary badge removed.** Deleted the dark pill *"A GIFT THAT KEEPS DAD GOING"* below the CTA (Draft v2);
hero now has one CTA (*Explore Gift Ideas →*). **Brand isolation re-verified: 0 SS leftovers.**
`Draft/SC-2026-HOL-fathers-day-draft-v2.html` → `Output/` (71.7 KB, 18 cards, QA PASS). Draft v1 retained.

---

## Round 3 (2026-08-31) — hero copy panel + deadline strip removed; Klaviyo Draft created

**Cleanup (latest draft v3 → Output):** removed the top black deadline strip ("FATHER'S DAY · SUNDAY 6 SEPTEMBER · ORDER EARLY") and the full colour-bonded hero copy panel below the hero (eyebrow/divider/headline/sub/CTA) — the hero artwork already carries that message, so the panel was redundant. Structure is now HEADER → HERO → next section → grid. Re-rendered (headless Edge): hero image loads (HTTP 200), no broken image/alt, no deadline strip, no duplicate panel, 18 product cards intact. SC branding verified, 0 SS leakage.

**Klaviyo Draft (account W2Ua5v):** created **DRAFT** campaign `01M1BA67PYZS23H2FP3H83YK9J` (message `01M1BA67Q6XQCW6GSYQFKH3FM7`), template assigned with the current Output HTML (verified: correct hero URL, brand logo, brand domain, 18 cards, no deadline strip/panel). from=sales@sectorcare.com.au / SectorCare. status **Draft**, tracking_options.add_tracking_params=true. **Not scheduled, not sent, no send-job.** ⚠️ Audience is a **placeholder** (Preview List Xy2wrD, 1 profile) only to satisfy Klaviyo's non-empty-audience requirement — the platform key lacks Lists:Write so an empty list could not be created. **The real send audience MUST be set (and confirmed per §13.1) before any send.**

---

## Round 4 (2026-09-01) — Bruce feedback: SC restructure + Local Pickup → Draft v5

Assesses `Draft/SC-2026-HOL-fathers-day-draft-v5.html` → `Output/SC-2026-HOL-fathers-day.html`. **SC only** (SS/RDD untouched).

**Bruce's feedback applied:**
1. **Removed the Mobility Scooters section** ("01 · Mobility Scooters / Freedom to Get Out" + the 4 Infinity scooter cards) cleanly — no orphan heading, spacing or numbering. (Removed from this campaign only; scooters remain in the catalogue/other work.)
2. **Bath and Toilet Aids is now the FIRST product section** (renumbered **01**). Full order: **01 Bath & Toilet Aids · 02 Rollators & Walkers · 03 Walking Aids · 04 Daily Living**. Sections renumbered and reordered cleanly.
3. **Trust "We've got you covered" alignment FIXED** — root cause: the card titles had different line counts (1 vs 2 lines) with no reserved height, so the sub-lines fell at different heights across the four cards. Fix (email-safe, §6.8/§6.27): wrapped each title in a **fixed-height `<td height="34">` (`.tct`, reset to auto on mobile)**, so icons, titles and sub-lines now align across all four cards. No redesign — same claims/glyphs/colours.
4. **Local Pickup emphasised** (Bruce: "emphasise our local pickup capability"). Added a dedicated **Local Pickup callout** below the gift-guide intro ("Prefer to Collect? Choose Local Pickup" → *"…choose Pickup at checkout to collect your order from our Sydney warehouse in Padstow…"* + "Select Pickup at checkout. Collect from 3 Wordie Place, Padstow NSW 2211."), plus a light mention in the preheader and closing. **Not** repeated in every section; tone stays helpful/premium, not a shipping warning.

**Local Pickup capability — source verified.** SC's public shipping pages (`sectorcare.com.au/shipping-returns`, `/how-to-order`, `/delivery-time`) document **courier only** and do **not** advertise pickup; the only on-site signal is the warehouse address **3 Wordie Place, Padstow NSW 2211** (shared with RDD, which does document Click & Collect). **Bruce (business owner) confirmed SC has local pickup capability** — that is the authoritative business source used here. To avoid inventing, the copy states only: pickup is available, chosen **at checkout**, collected from the **Sydney/Padstow warehouse** — **no ready-time ("two hours"), no guarantee, no eligibility claim**. If SC's exact checkout wording/eligibility differs, adjust the callout wording to match the real checkout labels before send.

**Product count:** **14** (was 18; the 4 scooters were removed per Bruce — the old 18 target no longer applies). All 14 are verified SC products with live `sectorcare.com.au` URLs and CDN images; grid stays balanced (4·4·4·2, even rows).

**Preserved:** SC hero (`sc-2026-hol-fathers-day-hero-v1.jpg`, HTTP 200), SC logo/branding, closing CTA, SC contact + footer. **0 SS/RDD leakage** re-verified. Hero unchanged.

**QA:** tags balanced, 14 cards, 59.5 KB (< clip), no broken images, no empty gaps from the removed section, no localhost/dev URLs.

**Klaviyo:** existing SC Draft `01M1BA67PYZS23H2FP3H83YK9J` (account W2Ua5v) **updated** with v5 (no duplicate). Re-fetched: **status Draft**, order Bath→Rollators→Walking→Daily, no "Mobility Scooters", pickup callout + trust fix present, 14 cards, 0 SS leak; preview updated to the pickup line, subject kept. **Not scheduled, not sent.**

---

## Round 5 (2026-09-01) — remove Gift-Guide intro + fix trust-card alignment → Draft v6

**SC only** (SS/RDD untouched). `Draft/SC-2026-HOL-fathers-day-draft-v6.html` → `Output/`.

1. **Removed the "The Father's Day Gift Guide" intro block** (eyebrow + the "Fourteen mobility and daily living gifts…" paragraph) directly below the hero — redundant with the hero messaging. Not replaced. The hero now flows **straight into the Local Pickup callout**, giving pickup more emphasis higher in the email.
2. **Trust "We've got you covered" alignment — fully fixed.** Round 4 reserved the title height, but the **sub-text still wrapped to different line counts** (e.g. "trusted mobility and care" / "here when you need us" = 2 lines vs 1-line others), so card bottoms stayed uneven. Fix: reserved a **fixed-height sub cell (`.tcs`, height 30) in addition to the fixed-height title cell (`.tct`, height 34)** — no height+padding on the same cell (§6.20). All four cards now have equal width (fixed-layout table), equal 10px gaps, and **equal height with tops and bottoms aligned**; icon → heading → sub all align across the row. `.tct,.tcs` reset to `auto` on mobile (responsive-safe). Verified in the render.

Preserved: hero (200), pickup callout, product grid (14), closing, SC contact/footer, styling/typography/colours, responsiveness. 0 SS/RDD leakage. QA: tags balanced, 14 cards, 59.3 KB.

**Klaviyo:** SC Draft `01M1BA67PYZS23H2FP3H83YK9J` (W2Ua5v) updated with v6 (no duplicate). Re-fetched: **Draft**, gift-guide removed, pickup callout + trust `.tct`/`.tcs` present, 14 cards, 0 SS leak. Not scheduled, not sent.
