# DE-GREENS INNOVATION — Website

Premium static website for De-Greens Innovation, a print media & branding firm in Nungua Barrier, Accra.
Built from the official Brand Guide, the Company Profile document, and real workshop photography — nothing invented.

## Run locally

```
cd 06-ZCODE-PROJECT
python -m http.server 8080
```

Open http://localhost:8080 — no build step, no dependencies.

## Structure

```
index.html          Home
services.html       Services (5 detailed + capabilities)
work.html           Our Work (filterable gallery + lightbox)
about.html          Story, vision, mission, values, brand meaning, process
contact.html        Contact + quote form (WhatsApp/email handoff)
css/styles.css      Design system (tokens → components)
js/main.js          Nav, reveal motion, filters, lightbox, quote form
img/                Optimized WebP + logos + favicon + og-image
img/SOURCE-MANIFEST.md  Provenance of every image (incl. what was excluded and why)
fonts/              Poppins (SIL OFL — fonts/OFL-Poppins.txt)
tools/build_images.py  Reproducible image pipeline (requires Pillow)
sitemap.xml robots.txt
```

## Design tokens

- Royal Green `#0D5B11` · Verse Green `#187C19` (official, from Brand Guide p.7)
- Sage tints (`#DEE9DB`, `#F1F6EF`) are derived tints of the brand greens
- Footer depth shade `#09460D` is a derived darker tone of Royal Green
- Typography: **Poppins** stands in for the brand's Horas typeface (no licensable
  Horas web files in the workspace). To swap later: add Horas `@font-face` rules in
  `css/styles.css` and change `--font-display` / `--font-body`. No redesign needed.

## Brand compliance

- Logo used unaltered (`img/logo.png`); white version is the Brand Guide's own
  monochrome (p.8) extracted for dark backgrounds
- D-factor clear space applied around every logo instance (CSS `.brand img` margin ≈ 40% of logo height)
- No shadows, recoloring or distortion applied to logo artwork
- "Where Brands Blossom" narrative is a signature section on Home and About
- Client-identifiable photography excluded or cropped — see SOURCE-MANIFEST.md

## Contact (confirmed by client)

- Phone / WhatsApp: +233 (0) 50 461 8929 → wa.me/233504618929
- Email: degreensinnovationltd@gmail.com
- Location context: Nungua Barrier, Accra, Ghana (no street address published)

## Decisions / configuration still needed from the client

1. Domain: site assumes `https://de-greensinnovation.com` (from Brand Guide letterhead) — confirm it's registered/live before deploying canonicals as-is.
2. Hosting: any static host (GitHub Pages, Netlify, Cloudflare Pages, cPanel). No backend required.
3. Horas web license (optional upgrade) — or keep Poppins.
4. WhatsApp Business profile on +233 50 461 8929 should have the catalogue/replies set up.
5. Optional: a real form backend (e.g. Netlify Forms/Formspree) if email submissions should arrive without WhatsApp.
6. Optional: working hours + full address, once confirmed, for Contact page + JSON-LD.
7. Optional: client permission list to publish named case studies.
