import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from common import *
import scenes_a, scenes_b

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..") + "/"
os.makedirs(OUT + "compositions", exist_ok=True)
for name, fn in [("open", scenes_a.opener), ("home", scenes_a.home), ("discover", scenes_a.discover),
                 ("carousel", scenes_b.carousel), ("progress", scenes_b.progress), ("arc", scenes_b.arc),
                 ("brand", scenes_b.brand), ("particles", scenes_b.particles)]:
    open(OUT + f"compositions/{name}.html", "w").write(fn())

SFX = LIB + "07_Audio/sfx/hangout_sfx_"
# Gains put each effect about 8 dB under the music bed (bed -9.2 LUFS; each file measured).
G = {"13_digital_pulse": 0.53, "05_transition_whoosh": 0.28, "11_logo_reveal_impact": 0.36, "02_digital_startup": 0.40,
     "06_screen_reveal": 0.54, "03_ui_click_select": 0.35, "04_ui_click_soft": 0.45, "09_challenge_complete": 0.38,
     "07_xp_accumulate": 0.34, "08_level_up": 0.36, "10_reward_unlocked": 0.33}
DUR = {"13_digital_pulse": 0.5, "05_transition_whoosh": 1.1, "11_logo_reveal_impact": 5.5, "02_digital_startup": 1.8,
       "06_screen_reveal": 1.3, "03_ui_click_select": 0.12, "04_ui_click_soft": 0.1, "09_challenge_complete": 1.5,
       "07_xp_accumulate": 1.7, "08_level_up": 2.4, "10_reward_unlocked": 2.4}
cues = []
for t in [0.25, 0.85, 1.35, 1.8, 2.2, 2.55, 2.85]: cues.append((t, "13_digital_pulse", 1.0))
cues += [(3.15, "05_transition_whoosh", 1.0), (3.5, "11_logo_reveal_impact", 1.0), (7.2, "02_digital_startup", 1.0),
         (9.0, "06_screen_reveal", 1.0), (12.5, "06_screen_reveal", 1.0), (15.5, "06_screen_reveal", 1.0),
         (17.5, "03_ui_click_select", 1.0), (19.0, "05_transition_whoosh", 0.55), (20.0, "05_transition_whoosh", 0.45)]
for n, t in enumerate([24.7, 26.5, 28.3, 30.1, 31.9]):
    cues.append((t, "03_ui_click_select" if n % 2 == 0 else "04_ui_click_soft", 1.0))
cues += [(32.3, "09_challenge_complete", 1.0), (34.6, "07_xp_accumulate", 1.0), (39.0, "08_level_up", 1.0),
         (41.5, "09_challenge_complete", 1.0), (44.5, "10_reward_unlocked", 1.0), (47.0, "05_transition_whoosh", 1.0),
         (50.5, "05_transition_whoosh", 1.0), (53.5, "11_logo_reveal_impact", 1.0)]
# Lane allocation: lowest sfx lane with no overlap.
lanes = []
audio = ""
for i, (t, name, k) in enumerate(sorted(cues)):
    d = min(DUR[name], 60 - t)
    lane = 0
    while lane < len(lanes) and lanes[lane] > t: lane += 1
    if lane == len(lanes): lanes.append(0)
    lanes[lane] = t + d
    vol = round(G[name] * k, 2)
    audio += (f'      <audio id="sfx-{i:02d}" class="clip" src="{SFX}{name}.wav" data-start="{t}" data-duration="{d}" '
              f'data-volume="{vol}" data-track-index="{4 + lane}"></audio>\n')

SCENES = [("open", 0, 7), ("home", 7, 5.5), ("discover", 12.5, 10.5), ("carousel", 23, 11),
          ("progress", 34, 13), ("arc", 47, 7), ("brand", 54, 6)]
hosts = ""
for cid, s, d in SCENES:
    hosts += (f'      <div id="{cid}" class="host" data-composition-id="{cid}" data-composition-src="compositions/{cid}.html" '
              f'data-start="{s}" data-duration="{d}" data-track-index="1" data-track-kind="graphics" data-width="1920" data-height="1080" style="z-index: 2"></div>\n')
root = f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ width: 1920px; height: 1080px; overflow: hidden; background: #080D16; }}
      #root {{ position: relative; width: 100%; height: 100%; }}
      #ground {{ position: absolute; inset: 0; background: #080D16; }}
      .host {{ position: absolute; inset: 0; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="60" data-width="1920" data-height="1080">
      <div id="ground"></div>
      <!-- Seven beats, back to back -->
{hosts}      <!-- Slow ambient particles over the whole film -->
      <div id="particles" class="host" data-composition-id="particles" data-composition-src="compositions/particles.html" data-start="0" data-duration="60" data-track-index="2" data-track-kind="graphics" data-width="1920" data-height="1080" style="z-index: 5; pointer-events: none"></div>
      <!-- Music bed, timed to this edit -->
      <audio id="music" class="clip" src="assets/HANGOUT_Film_Kit/audio/hangout_music_bed_60s_120bpm.wav" data-start="0" data-duration="60" data-volume="1" data-fade-out="0.4" data-track-index="3"></audio>
      <!-- Sound effects, about 8 dB under the music -->
{audio}    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      window.__timelines["main"] = gsap.timeline({{ paused: true }});
    </script>
  </body>
</html>
"""
open(OUT + "index.html", "w").write(root)
print("written", len(cues), "sfx cues, lanes", len(lanes))
