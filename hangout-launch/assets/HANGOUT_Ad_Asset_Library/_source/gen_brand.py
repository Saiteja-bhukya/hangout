"""Generate HANGOUT brand SVGs (logo symbol, wordmark, lockups, app icon)."""
import os, sys
OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)

CY_STOPS = '<stop offset="0" stop-color="#8FF0FF"/><stop offset=".45" stop-color="#36D6F2"/><stop offset="1" stop-color="#397BFF"/>'
INK = "#03141C"

# --- symbol "H with a point of light" on a 64 grid (from the splash screen) ---
H_PATH = "M18 14v36M46 14v36M18 32h28"

def tile(size, uid, radius_ratio=0.30, bleed=False):
    s = size / 64.0
    r = 0 if bleed else 64 * radius_ratio
    return f'''<defs>
<linearGradient id="g{uid}" x1="0" y1="0" x2="1" y2="1">{CY_STOPS}</linearGradient>
<linearGradient id="hl{uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".45"/><stop offset=".45" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>
<linearGradient id="sh{uid}" x1="0" y1="0" x2="0" y2="1"><stop offset=".6" stop-color="#10307A" stop-opacity="0"/><stop offset="1" stop-color="#10307A" stop-opacity=".45"/></linearGradient>
</defs>
<g transform="scale({s})">
<rect width="64" height="64" rx="{r}" fill="url(#g{uid})"/>
<rect width="64" height="64" rx="{r}" fill="url(#hl{uid})"/>
<rect width="64" height="64" rx="{r}" fill="url(#sh{uid})"/>
<path d="{H_PATH}" fill="none" stroke="{INK}" stroke-width="8" stroke-linecap="round"/>
<circle cx="32" cy="18" r="4" fill="{INK}"/>
</g>'''

def svg(w, h, body, title):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-label="{title}"><title>{title}</title>{body}</svg>\n'

def write(name, content):
    with open(os.path.join(OUT, name), "w") as f:
        f.write(content)

# 1. Symbol tile (app-icon style)
write("hangout_symbol_tile.svg", svg(512, 512, tile(512, "t"), "HANGOUT symbol"))
# 2. Symbol mark only (no tile), gradient strokes / mono
def mark(color_attr, defs="", uid=""):
    return f'''{defs}<g transform="translate(8 8) scale(7.75)"><path d="{H_PATH}" fill="none" stroke="{color_attr}" stroke-width="8" stroke-linecap="round"/><circle cx="32" cy="18" r="4" fill="{color_attr}"/></g>'''
gdef = f'<defs><linearGradient id="gm" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="512" y2="512">{CY_STOPS}</linearGradient></defs>'
write("hangout_symbol_mark_gradient.svg", svg(512, 512, mark("url(#gm)", gdef), "HANGOUT mark"))
write("hangout_symbol_mark_white.svg", svg(512, 512, mark("#F4F8FC"), "HANGOUT mark white"))
write("hangout_symbol_mark_ink.svg", svg(512, 512, mark("#080D16"), "HANGOUT mark dark"))

# --- custom geometric wordmark, drawn as strokes (no font dependency) ---
L = {
 "H": (60,  "M0 0V100M60 0V100M0 50H60"),
 "A": (66,  "M0 100L33 0L66 100M14 64H52"),
 "N": (60,  "M0 100V0L60 100V0"),
 "G": (100, "M88 18A50 50 0 1 0 100 54H58"),
 "O": (100, "M50 0A50 50 0 1 1 49.99 0Z"),
 "U": (60,  "M0 0V70A30 30 0 0 0 60 70V0"),
 "T": (66,  "M0 0H66M33 0V100"),
}
def wordmark_paths(x0=0, y0=0, gap=30):
    out, x = [], x0
    for ch in "HANGOUT":
        w, d = L[ch]
        out.append(f'<path transform="translate({x} {y0})" d="{d}"/>')
        x += w + gap
    return "".join(out), x - gap - x0
paths, WW = wordmark_paths()
SW = 16
def wordmark_svg(stroke, defs=""):
    pad = SW
    w, h = WW + pad * 2, 100 + pad * 2
    body = f'{defs}<g transform="translate({pad} {pad})" fill="none" stroke="{stroke}" stroke-width="{SW}" stroke-linecap="round" stroke-linejoin="round">{paths}</g>'
    return w, h, body
wdef = f'<defs><linearGradient id="gw" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="{WW}" y2="0"><stop offset="0" stop-color="#F4F8FC"/><stop offset=".55" stop-color="#9FEBFA"/><stop offset="1" stop-color="#36D6F2"/></linearGradient></defs>'
for name, stroke, d in [("gradient", "url(#gw)", wdef), ("white", "#F4F8FC", ""), ("ink", "#080D16", "")]:
    w, h, body = wordmark_svg(stroke, d)
    write(f"hangout_wordmark_{name}.svg", svg(w, h, body, "HANGOUT wordmark"))

# --- lockups ---
def lockup_h(variant):
    stroke, d = {"dark": ("url(#gw)", wdef), "light": ("#080D16", "")}[variant]
    th = 160
    ws = th / (100 + 2 * SW) * 0.78
    tw = (WW + 2 * SW) * ws
    W = th + 48 + tw
    body = f'<g>{tile(th, "lh"+variant)}</g>{d}<g transform="translate({th + 48} {(th - (100 + 2*SW) * ws) / 2}) scale({ws})"><g transform="translate({SW} {SW})" fill="none" stroke="{stroke}" stroke-width="{SW}" stroke-linecap="round" stroke-linejoin="round">{paths}</g></g>'
    return svg(round(W, 1), th, body, "HANGOUT logo")
write("hangout_logo_horizontal_for_dark_bg.svg", lockup_h("dark"))
write("hangout_logo_horizontal_for_light_bg.svg", lockup_h("light"))

def lockup_v(variant):
    stroke, d = {"dark": ("url(#gw)", wdef), "light": ("#080D16", "")}[variant]
    W = 720
    ts = 240
    ws = (W - 40) / (WW + 2 * SW)
    wh = (100 + 2 * SW) * ws
    H = ts + 56 + wh
    body = f'<g transform="translate({(W - ts)/2} 0)">{tile(ts, "lv"+variant)}</g>{d}<g transform="translate(20 {ts + 56}) scale({ws})"><g transform="translate({SW} {SW})" fill="none" stroke="{stroke}" stroke-width="{SW}" stroke-linecap="round" stroke-linejoin="round">{paths}</g></g>'
    return svg(W, round(H, 1), body, "HANGOUT logo stacked")
write("hangout_logo_stacked_for_dark_bg.svg", lockup_v("dark"))
write("hangout_logo_stacked_for_light_bg.svg", lockup_v("light"))

# --- app icons ---
write("hangout_app_icon_1024_rounded.svg", svg(1024, 1024, tile(1024, "ai", 0.2237), "HANGOUT app icon"))
write("hangout_app_icon_1024_full_bleed.svg", svg(1024, 1024, tile(1024, "af", 0, bleed=True), "HANGOUT app icon full bleed"))
print("wordmark width", WW)
