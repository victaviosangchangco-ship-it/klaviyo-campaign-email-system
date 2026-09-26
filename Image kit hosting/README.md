# Image kit hosting/ — ImageKit CDN asset publish tree

Mirrors the `hosting/` folder structure (Vercel) but uploads to ImageKit CDN instead.
Each brand subfolder (`rdd/`, `ss/`, `sc/`) keeps the same category paths.

## Upload tool

```bash
# Upload a single file (preserves brand/category path on ImageKit)
node "Scripts/imagekit-upload.js" upload --brand RDD --src "Image kit hosting/rdd/hero-banners/my-hero.png"

# Upload all images in a brand folder
node "Scripts/imagekit-upload.js" upload-all --brand RDD

# Upload all images across all brands
node "Scripts/imagekit-upload.js" upload-all

# Validate folder contents (images only, no secrets)
node "Scripts/imagekit-upload.js" validate [BRAND]
```

The upload script reads credentials from the root `.env` (git-ignored).
It preserves the `brand/category/filename` path on ImageKit and returns the hosted URL.

## Folder structure

```
Image kit hosting/
+-- README.md
+-- rdd/
|   +-- hero-banners/
|   +-- hero-images/
|   +-- featured-images/
|   +-- Environmental Images/
|   +-- Support Banners/
+-- ss/
|   +-- hero-banners/
|   +-- hero-images/
|   +-- featured-images/
|   +-- flow-assets/
|   +-- support-banners/
+-- sc/
|   +-- hero-banners/
|   +-- Featured Categories/
```

## URL pattern

Uploaded files are served at:
`https://ik.imagekit.io/5jjsemhse/<brand>/<category>/<filename>`

Example:
`https://ik.imagekit.io/5jjsemhse/rdd/hero-banners/rdd-2026-w40-hero.png`
