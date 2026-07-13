# Brands/ — brand-specific production work

One folder per brand (**SS, RDD, SC, Stack**). This is where campaign work products live — never
brand *definitions*.

Each brand folder contains:
- `Assets/` — **evergreen** brand assets (logos, icons, references) reused by every send.
- `Campaigns/<Weekly|Monthly>/` — the six-stage pipeline for each send:
  `Brief → References → Assets → Draft → Review → Output`.

**Brand facts & visual system are NOT stored here as rules.** A brand's identity, colours,
typography, footer, and product source come from its `03-Brands/<CODE>.md` and the
approved `BrandConfig.md` / `Design.md`, injected at generation. Components and Templates stay
brand-neutral; this folder holds only the work (briefs, references, assets, drafts, output).
