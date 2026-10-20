# -*- coding: utf-8 -*-
"""
DE-GREENS INNOVATION website - image build pipeline.
Copies official logo assets unaltered; crops/anonymizes selected production
photos; exports responsive WebP sets + favicon + OG image.

Re-run any time:  python tools/build_images.py
Source of every output is documented in img/SOURCE-MANIFEST.md
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageOps

WS      = r'F:\DE-GREENS INNOVATION\DE-GREENS INNOVATION-WEBSITE'
PHOTOS  = os.path.join(WS, '03-PHOTOGRAPHY PRINTING')
LOGO    = os.path.join(WS, '01-BRAND LOGO', 'LOGO2.png')
TMP     = r'C:\Users\HP\AppData\Local\Temp\dg_discovery'
ROOT    = os.path.join(WS, '06-ZCODE-PROJECT')
IMG     = os.path.join(ROOT, 'img')
WORK    = os.path.join(IMG, 'work')
os.makedirs(WORK, exist_ok=True)
os.makedirs(os.path.join(IMG, 'icons'), exist_ok=True)

ROYAL  = (13, 91, 17)
VERSED = (24, 124, 25)
SAGE   = (222, 233, 219)

def export_set(src_img, name, widths=(1600, 1200, 800, 480), quality=80):
    """Save WebP variants; returns dict width->file for srcset notes."""
    out = {}
    im = src_img.convert('RGB')
    w0, h0 = im.size
    for w in widths:
        if w > w0:
            continue
        v = im.resize((w, round(h0 * w / w0)), Image.LANCZOS)
        fp = os.path.join(WORK, f'{name}-{w}.webp')
        v.save(fp, 'WEBP', quality=quality, method=6)
        out[w] = os.path.getsize(fp)
    print(f'{name}: {im.size} -> ' + ', '.join(f'{w}:{s//1024}KB' for w, s in out.items()))
    return out

def load(name):
    return Image.open(os.path.join(PHOTOS, name))

# ---------------------------------------------------------------- logos (as-is)
Image.open(LOGO).save(os.path.join(IMG, 'logo.png'))                      # official colour lockup, untouched
white = Image.open(os.path.join(TMP, 'logo_white_raw.png'))               # brand-guide p.8 monochrome
white.save(os.path.join(IMG, 'logo-white.png'))
print('logos copied: logo.png, logo-white.png')

# ---------------------------------------------------------------- favicon / D mark
d = Image.open(LOGO).crop((58, 70, 212, 222))
d = d.crop(d.split()[3].getbbox())                                        # trim to the D glyph
print('D mark:', d.size)
def on_square(im, size, bg=(255, 255, 255)):
    s = Image.new('RGB', (size, size), bg)
    t = im.copy(); t.thumbnail((size, size), Image.LANCZOS)
    s.paste(t, ((size - t.width) // 2, (size - t.height) // 2), t)
    return s
sq512 = on_square(d, 512)
sq512.save(os.path.join(IMG, 'icons', 'favicon.png'))
sq512.resize((180, 180), Image.LANCZOS).save(os.path.join(IMG, 'icons', 'apple-touch-icon.png'))
sq512.resize((192, 192), Image.LANCZOS).save(os.path.join(IMG, 'icons', 'icon-192.png'))
sq512.resize((32, 32), Image.LANCZOS).save(os.path.join(IMG, 'icons', 'favicon-32.png'))
sq512.save(os.path.join(IMG, 'icons', 'favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48)])
print('favicons written')

# ---------------------------------------------------------------- hero
# 20260206: print head in motion, fully abstract, no client marks
hero = load('IMG_20260206_205601.jpg')
export_set(hero, 'hero-press', (1920, 1280, 800))

# ---------------------------------------------------------------- selected work
# (source file, out name, crop box as fractions (l,t,r,b) or None)
SELECTION = [
    ('IMG_20260627_182421.jpg', 'work-banner-smile', (0.02, 0.02, 1.0, 1.0)),   # face on banner roll
    ('IMG_20260124_201016.jpg', 'work-printer-close', (0.02, 0.20, 0.86, 1.0)), # crop away reversed text edge
    ('IMG_20260319_175400.jpg', 'work-window-front', None),
    ('IMG_20260319_175354.jpg', 'work-window-inside', None),
    ('IMG_20260518_110411.jpg', 'work-report', None),
    ('IMG_20260625_092737.jpg', 'work-bulk-run', None),
    ('IMG_20260401_122716.jpg', 'work-brochures', (0.0, 0.0, 0.62, 1.0)),       # stack edge, covers out of frame
    ('IMG_20260515_161142.jpg', 'work-tees-program', None),
    ('IMG_20260615_121454.jpg', 'work-tees-run', None),
    ('IMG_20260303_090003.jpg', 'work-heatpress', None),
    ('IMG_20260608_134313.jpg', 'work-wall', None),
    ('IMG_20260608_134339.jpg', 'work-wall-2', None),
    ('IMG_20251220_230639.jpg', 'work-night-press', (0.34, 0.0, 1.0, 1.0)),     # banner text cropped out
    ('IMG_20260627_182414.jpg', 'work-banner-face', (0.22, 0.08, 1.0, 1.0)),    # partial letters cropped out
]
for f, name, frac in SELECTION:
    im = load(f)
    if frac:
        w, h = im.size
        im = im.crop((round(frac[0]*w), round(frac[1]*h), round(frac[2]*w), round(frac[3]*h)))
    export_set(im, name)

# ---------------------------------------------------------------- OG image 1200x630
W, H = 1200, 630
og = Image.new('RGB', (W, H), ROYAL)
dr = ImageDraw.Draw(og, 'RGBA')
# large sage leaf shapes, brand pattern language
def leaf(cx, cy, w, h, ang, fill):
    petal = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    pd = ImageDraw.Draw(petal)
    pd.ellipse((0, 0, w - 1, h - 1), fill=fill)
    points = []
    petal = petal.rotate(ang, expand=True, resample=Image.BICUBIC)
    og.paste(Image.alpha_composite(og.crop((0,0,0,0)), petal) if False else petal,
             (int(cx - petal.width / 2), int(cy - petal.height / 2)), petal)
leaf(1040, 90,  560, 240, 38, (255, 255, 255, 14))
leaf(150,  560, 620, 250, 30, (255, 255, 255, 12))
leaf(980,  540, 420, 170, -24, (0, 0, 0, 26))
# white monochrome logo
lw = white.copy(); lw.thumbnail((430, 200), Image.LANCZOS)
og.paste(lw, (80, 84), lw)
# headline + services line
try:
    f1 = ImageFont.truetype(os.path.join(TMP, 'Poppins-SemiBold.ttf'), 58)
    f2 = ImageFont.truetype(os.path.join(TMP, 'Poppins-SemiBold.ttf'), 26)
except OSError:
    f1 = f2 = ImageFont.load_default()
dr.text((80, 330), 'Where Brands Blossom.', font=f1, fill=(255, 255, 255))
dr.text((83, 428), 'PRINT  ·  BRANDING  ·  ADVERTISING  ·  PACKAGING', font=f2, fill=(196, 224, 193))
dr.rectangle((80, 402, 260, 406), fill=VERSED)
og.save(os.path.join(IMG, 'og-image.jpg'), 'JPEG', quality=88)
print('og-image.jpg', os.path.getsize(os.path.join(IMG, "og-image.jpg")) // 1024, 'KB')

# ---------------------------------------------------------------- verification sheet
names = ['hero-press-800', 'work-banner-smile-800', 'work-printer-close-800', 'work-window-front-800',
         'work-report-800', 'work-bulk-run-800', 'work-brochures-800', 'work-tees-program-800',
         'work-tees-run-800', 'work-heatpress-800', 'work-wall-800', 'work-wall-2-800',
         'work-night-press-800', 'work-banner-face-800']
COLS, TW, LH = 4, 300, 340
rows = (len(names) + COLS - 1) // COLS
sheet = Image.new('RGB', (COLS * 310 + 10, rows * LH + 10), 'white')
sd = ImageDraw.Draw(sheet)
for i, n in enumerate(names):
    t = Image.open(os.path.join(WORK, n + '.webp')); t.thumbnail((TW, 300))
    x, y = 10 + (i % COLS) * 310, 10 + (i // COLS) * LH
    sheet.paste(t, (x, y)); sd.text((x, y + 306), n, fill='black')
sheet.save(os.path.join(TMP, 'verify_crops.png'))
print('verification sheet saved')
