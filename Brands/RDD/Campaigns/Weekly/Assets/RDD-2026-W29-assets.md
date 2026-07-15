# RDD 2026-W29 — Asset Manifest

Per-send assets used by the draft. No binaries stored locally — all are **verified remote URLs**
(logo from RDD's Klaviyo library; product images from the live BigCommerce CDN). Verified live 2026-07-11.

## Brand (evergreen) assets — from RDD Klaviyo library (account `XAUdQX`)
| Role | Library name | URL |
|------|--------------|-----|
| Header logo (white, for orange hero) | RDD Logo-White | https://d3k81ch9hvuctc.cloudfront.net/company/XAUdQX/images/19434473-b495-4540-8a3c-ffe9c37a879f.png |

Available but **not** used this send (can be swapped in after a visual check):
`RDD Favicon-White`, `RDD Favicon-Orange.1`, `facebook`, and trust icons `icon-shipping` / `icon-returns` / `icon-service`.

**Orange RD mark (tested rev 5, not adopted):** `RDD Favicon-Orange` =
`https://d3k81ch9hvuctc.cloudfront.net/company/XAUdQX/images/6bd02fd5-d5cc-4fc2-8c60-219830e7175e.png`
(and `.1` = `.../4b9ecca7-2899-44a9-9a99-325b1290472e.png`, identical). Tested as a tiny upper-right
card mark per Bruce; not adopted — its email-safe top-strip placement added card white space / row
asymmetry, counter to the compact-card goal. See review notes rev 5.

## Product images — live BigCommerce CDN (store `s-ugqmr0qfvf`)
| Product | Image URL |
|---------|-----------|
| Electric Sit Stand Desk Black 1600mm (grid #1; BC id 1240, product-on-white 1000×1000) | https://cdn11.bigcommerce.com/s-ugqmr0qfvf/images/stencil/1000x1000/products/1240/5262/SSDW16B__69704.1718865231.jpg?c=2 |
| Mobile Pedestal 3 Drawer | https://cdn11.bigcommerce.com/s-ugqmr0qfvf/images/stencil/532x532/products/1341/3094/A__29950.1657692235.jpg?c=2 |
| Glass Whiteboard 1200x900mm White | https://cdn11.bigcommerce.com/s-ugqmr0qfvf/images/stencil/532x532/products/981/3144/GBW1__24286.1710425007.jpg?c=2 |
| ErgoDC Portable Projector Screen 100" 4:3 | https://cdn11.bigcommerce.com/s-ugqmr0qfvf/images/stencil/532x532/products/1534/5395/A__50334.1723090220.jpg?c=2 |
| TV Floor Stand 65–100" | https://cdn11.bigcommerce.com/s-ugqmr0qfvf/images/stencil/532x532/products/1314/3173/A__45120.1667274086.jpg?c=2 |
| Corkboard & Pinboard 1200x900mm | https://cdn11.bigcommerce.com/s-ugqmr0qfvf/images/stencil/532x532/products/896/3117/CORK1290__03192.1710726541.jpg?c=2 |
| A4 Menu Poster Stand | https://cdn11.bigcommerce.com/s-ugqmr0qfvf/images/stencil/532x532/products/946/2981/83104_AA__14696.1710983258.jpg?c=2 |

## Not used (deliberate)
- No baked-in composite hero image → hero is a typographic orange panel (editable, accessible) rather than an image-with-text.
- Trust icons rendered as unicode glyphs (hosted RDD icons exist and can replace them post visual-check).
