# Shared building blocks for the HANGOUT launch film scenes.
SCR = "assets/HANGOUT_Film_Kit/screens/"
LIB = "assets/HANGOUT_Ad_Asset_Library/"
DER = "assets/derived/"
FRAME = LIB + "03_Motion_Graphics/floating_ui/phone_frame_vector.svg"

FONTS = """
    @font-face { font-family: "Urbanist"; src: url("assets/fonts/Urbanist.woff2") format("woff2"); font-weight: 400 800; }
    @font-face { font-family: "Rajdhani"; src: url("assets/fonts/Rajdhani-500.woff2") format("woff2"); font-weight: 500; }
    @font-face { font-family: "Rajdhani"; src: url("assets/fonts/Rajdhani-600.woff2") format("woff2"); font-weight: 600; }
    @font-face { font-family: "Rajdhani"; src: url("assets/fonts/Rajdhani-700.woff2") format("woff2"); font-weight: 700; }"""

BASE_CSS = """
    #root { position: absolute; inset: 0; overflow: hidden; background: #080D16; color: #F4F8FC; font-family: "Urbanist", sans-serif; }
    .bg { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    .scr { mix-blend-mode: screen; pointer-events: none; }
    .stage { position: absolute; inset: 0; perspective: 1900px; perspective-origin: 50% 46%; transform-style: preserve-3d; }
    .ph { position: absolute; width: 433px; height: 892px; transform-style: preserve-3d; }
    .ph-sh { position: absolute; left: 8px; top: 8px; right: 8px; bottom: 8px; border-radius: 60px;
             box-shadow: 0 60px 120px rgba(0,0,0,.72), 0 20px 40px rgba(0,0,0,.5), 0 0 70px rgba(54,214,242,.22); }
    .ph-scr { position: absolute; left: 20px; top: 20px; width: 393px; height: 852px; border-radius: 55px; overflow: hidden; background: #080D16; }
    .ph-scr img { position: absolute; left: 0; top: 0; width: 393px; height: 852px; }
    .ph-dim { position: absolute; left: 0; top: 0; width: 393px; height: 852px; background: #080D16; opacity: 0; }
    .ph-fr { position: absolute; left: 0; top: 0; width: 433px; height: 892px; }
    .hl { position: absolute; font-family: "Urbanist", sans-serif; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; line-height: 1; color: #F4F8FC; white-space: nowrap; }
    .hl span { display: inline-block; }
    .cy { color: #36D6F2; text-shadow: 0 0 18px rgba(54,214,242,.55), 0 0 44px rgba(54,214,242,.28); }
    .lbl { font-family: "Rajdhani", sans-serif; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }"""

def phone(pid, screen, cx, cy, extra="", dim=False, layers=None):
    """A phone: real screen PNG clipped to the frame's window (40,40,786x1704, r110 at 2x), shown at 433x892."""
    imgs = ""
    if layers:
        for lid, s in layers:
            imgs += f'<img id="{lid}" src="{SCR}{s}.png" alt="{s}" />'
    else:
        imgs = f'<img src="{SCR}{screen}.png" alt="{screen}" />'
    d = f'<div id="{pid}-dim" class="ph-dim"></div>' if dim else ""
    return (f'<div id="{pid}" class="ph" style="left:{cx-216.5:.1f}px;top:{cy-446}px">'
            f'<div class="ph-sh"></div><div class="ph-scr">{imgs}{extra}{d}</div>'
            f'<img class="ph-fr" src="{FRAME}" alt="" /></div>')

def scene(cid, css, body, js, vars_json=None):
    return f"""<template>
  <style>{FONTS}{BASE_CSS}
{css}
  </style>
  <div id="root" data-composition-id="{cid}" data-width="1920" data-height="1080">
{body}
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
{js}
    window.__timelines["{cid}"] = tl;
  </script>
</template>
"""
