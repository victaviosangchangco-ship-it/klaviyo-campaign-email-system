# hosting/ — per-brand public asset publish tree (Vercel)

**Phase 1 infrastructure.** This tree exists so each brand can be deployed as its **own** Vercel
static asset host from the **single** `klaviyo-campaign-email-system` GitHub repo, exposing **only**
that brand's approved public email images — never `platform/`, `config/`, `CLAUDE.md`, business docs,
source, `.env`, credentials, or another brand's assets.

```
hosting/
├── README.md        ← this file (NOT served — it is outside every project Root Directory)
├── rdd/  → Vercel project Root Directory = hosting/rdd   (serves ONLY RDD approved images)
├── ss/   → Vercel project Root Directory = hosting/ss    (serves ONLY SS approved images)
└── sc/   → Vercel project Root Directory = hosting/sc    (serves ONLY SC approved images)
```

## Isolation model
- Each Vercel project points at this repo but sets **Root Directory** to `hosting/<brand>`. Vercel only
  deploys files inside the Root Directory, and the dashboard toggle **"Include files outside the Root
  Directory in the Build Step" MUST be OFF**. Everything else in the repo is therefore un-servable.
- Each `hosting/<brand>/` contains ONLY images that the **publish tool** (`Scripts/publish-assets.js`)
  explicitly copied there — an allow-list, not the whole `Brands/<CODE>/` subtree (which also holds
  References/Drafts/Briefs/Output HTML that must stay private).
- Source assets remain untouched in `Brands/RDD|SS|SC/…` — this tree is a generated, approved-only mirror.

## What may live in hosting/<brand>/
Images only (`.jpg .jpeg .png .gif .webp .svg .avif`), plus the infra files `vercel.json` and `.gitkeep`.
The validator (`node Scripts/publish-assets.js validate`) fails on anything else (source, config, docs,
`.env`, or a filename carrying another brand's code prefix).

## Cache / URL policy
`vercel.json` sets `Cache-Control: public, max-age=31536000, immutable`. Filenames must be **versioned
and immutable** (e.g. `ss-2026-w32-hero-banner.jpg`) — never overwrite a name with different content.

## Files
- `healthcheck.png` — a harmless 1×1 transparent PNG per brand, for verifying a deploy returns HTTP 200
  on a known URL. Safe to delete or replace; it is not a campaign asset.

Nothing here is wired into campaign generation yet (that is a later phase, gated on approval).
