# GIF Runtime Contract (Conditional)

Load ONLY when a campaign includes an animated GIF.
Full history: `Archive/CLAUDE-LEGACY.md` §6.19.

---

## Core Rules

1. **A GIF is a promotional content element, NOT a hero.** Never swap a GIF into the hero.
   Never replace the hero because a campaign adds a GIF.
2. **Hero stays untouched** unless the user explicitly says otherwise.
3. **GIF lives in a dedicated content section** (e.g. "See It In Action"), never the hero.
4. **When swapping a GIF:** change ONLY the `src`. Leave every other attribute and surrounding
   layout identical.

## Embedding

Plain `<img>` GIF in the section's responsive image container:
```html
<img src="[[GIF_URL]]" alt="[[meaningful alt]]" width="600" height="337" class="hero-img"
     style="display:block; width:100%; max-width:600px; height:auto; border:0; outline:none;
            text-decoration:none; border-radius:8px; margin:0 auto;" />
```

- Autoplay + infinite loop are native to the GIF file (loop-count 0 in export).
- Outlook shows first frame only (static). Design a strong first frame.
- Explicit `width`/`height` HTML attributes required (Apple Mail).
- Never wrap a `<table>` inside the anchor. Never `display:block` on the anchor.

## File Size

- Target ≤ 1 MB. Hard-flag > ~2 MB as a send-blocker.
- Fewer frames + smaller dimensions shrink a GIF, not quality flags.
- Prefer video-source via Cloudinary for generation.
- Confirm final GIF is HTTP 200 `image/gif`, no redirects.
