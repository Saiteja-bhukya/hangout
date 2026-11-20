# Rotate the SCENE palette to toli: cyan->marigold, blue->rani pink, violet->magenta, navy->plum, cool greys->plum greys.
import re, sys, colorsys
def tf(r, g, b):
    h, l, s = colorsys.rgb_to_hls(r/255, g/255, b/255); H = h*360
    if s < 0.14 and 0.02 < l < 0.98:            # cool greys -> plum greys
        h2, s2 = 270/360, min(0.16, s*1.4 + 0.04); return colorsys.hls_to_rgb(h2, l, s2)
    if l < 0.26 and 190 <= H < 255:             # navy surfaces -> plum
        return colorsys.hls_to_rgb(268/360, l, min(s, 0.5))
    if 165 <= H < 205: return colorsys.hls_to_rgb(40/360, l, min(1, s*1.05))    # cyan -> marigold
    if 205 <= H < 245: return colorsys.hls_to_rgb(340/360, l, s)                 # blue -> rani pink
    if 245 <= H < 290: return colorsys.hls_to_rgb(322/360, l, s)                 # violet -> magenta
    return (r/255, g/255, b/255)
def hexrep(m):
    v = m.group(0); r, g, b = int(v[1:3], 16), int(v[3:5], 16), int(v[5:7], 16)
    o = tf(r, g, b); return '#%02X%02X%02X' % tuple(round(c*255) for c in o)
def rgbarep(m):
    r, g, b = int(m.group(2)), int(m.group(3)), int(m.group(4)); o = tf(r, g, b)
    return f"{m.group(1)}({round(o[0]*255)}, {round(o[1]*255)}, {round(o[2]*255)}{m.group(5) or ""})"
for p in sys.argv[1:]:
    s = open(p).read()
    s = re.sub(r"#[0-9A-Fa-f]{6}\b", hexrep, s)
    s = re.sub(r"(rgba?)\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*[0-9.]+\s*)?\)", lambda m: rgbarep(m) if True else m.group(0), s)
    open(p, 'w').write(s); print('reskinned', p)
