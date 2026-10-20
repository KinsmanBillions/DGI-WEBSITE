# Image Source Manifest

Every shipped asset is derived from workspace originals. Nothing is stock, AI-generated, or sourced externally except the Poppins typeface (Google Fonts, SIL Open Font License — see `fonts/OFL-Poppins.txt`).

## Logos (official artwork, copied unaltered)

| Asset | Source |
|---|---|
| `img/logo.png` | `01-BRAND LOGO/LOGO2.png` — official colour lockup, byte-identical copy |
| `img/logo-white.png` | Extracted from `01-BRAND GUIDE/BRAND GUIDE.pdf`, page 8 ("2.2 Monochrome Version", white-on-dark variant), background made transparent. This is the brand-sanctioned monochrome for dark backgrounds. |
| `img/icons/*` (favicon, apple-touch, icon-192, favicon.ico) | The "D + leaf" glyph cropped from `LOGO2.png` (crop only, no redrawing/recoloring), placed on white. |

## Photography

All from `03-PHOTOGRAPHY PRINTING/`. Exports are WebP at 1600/1200/800/480 px (only sizes ≤ original). Client-identifiable shots were excluded or cropped:

| Shipped asset | Source photo | Treatment |
|---|---|---|
| `img/work/hero-press-*` | IMG_20260206_205601.jpg | as-is (abstract press motion) |
| `work-banner-smile-*` | IMG_20260627_182421.jpg | as-is (no readable client text) |
| `work-printer-close-*` | IMG_20260124_201016.jpg | cropped (0.02, 0.20, 0.86, 1.0) to de-emphasise mirrored print text |
| `work-window-front-*` | IMG_20260319_175400.jpg | as-is (installed retail window graphics) |
| `work-window-inside-*` | IMG_20260319_175354.jpg | as-is |
| `work-report-*` | IMG_20260518_110411.jpg | as-is ("Executive Summary" booklet; no client name) |
| `work-bulk-run-*` | IMG_20260625_092737.jpg | as-is (shrink-wrapped print runs) |
| `work-brochures-*` | IMG_20260401_122716.jpg | cropped (0, 0, 0.62, 1.0) so brochure covers are out of frame |
| `work-tees-program-*` | IMG_20260515_161142.jpg | as-is ("PRESCHOOL 2026" — generic, no client name) |
| `work-tees-run-*` | IMG_20260615_121454.jpg | as-is |
| `work-heatpress-*` | IMG_20260303_090003.jpg | as-is (plain navy garment) |
| `work-wall-*` | IMG_20260608_134313.jpg | as-is (De-Greens' own workflow wall) |
| `work-wall-2-*` | IMG_20260608_134339.jpg | as-is |
| `work-night-press-*` | IMG_20251220_230639.jpg | cropped (0.34, 0, 1, 1) — banner text removed |
| `work-banner-face-*` | IMG_20260627_182414.jpg | cropped (0.22, 0.08, 1, 1) — partial letters removed |

`img/og-image.jpg` — composed from the Royal Green brand field, leaf motif, the extracted white monochrome logo, and the tagline (Poppins SemiBold).

## Deliberately EXCLUDED (client-identifiable)

- IMG_20260409_12*.jpg — DHL-branded keychains (5 shots)
- IMG_20260529_18*, IMG_20260529_20*.jpg — "KubeRice" branded labels
- IMG_20260327_133358.jpg — "PROTOCOL" branded items
- IMG_20260610_202416.jpg — memorial mug with personal name
- IMG_20260901_*.jpg — memorial/bio booklets with personal names (4 shots)
- IMG_20260403_16*.jpg — client ad board with phone number (2 shots)
- IMG_20260617_191930.jpg — cap with client mark

Re-run the pipeline any time: `python tools/build_images.py`
