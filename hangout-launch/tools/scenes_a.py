from common import *

STOCK = ["01_kart", "02_bowling", "03_vr", "04_trampoline", "05_claw", "06_gamepad", "07_lock"]

# ---------------------------------------------------------------- 1. Opener 0.0-7.0
def opener():
    css = """
    #o-glow { position: absolute; left: 460px; top: 40px; width: 1000px; height: 1000px; border-radius: 50%;
              background: radial-gradient(closest-side, rgba(54,214,242,.16), rgba(57,123,255,.06) 55%, rgba(8,13,22,0) 100%); }
    .o-box { position: absolute; left: 0; top: 230px; width: 1920px; height: 620px; display: flex; align-items: center; justify-content: center; }
    .o-img { height: 620px; width: auto; max-width: 1100px; object-fit: contain; visibility: hidden;
             filter: drop-shadow(0 0 24px rgba(54,214,242,.55)) drop-shadow(0 22px 34px rgba(8,13,22,.85)); }
    .o-ring { position: absolute; left: 610px; top: 190px; width: 700px; height: 700px; opacity: 0; }
    #o-burst { position: absolute; left: 260px; top: -160px; width: 1400px; height: 1400px; opacity: 0; }
    #o-wash { position: absolute; inset: 0; background: #36D6F2; opacity: 0; }
    #o-words { left: 0; top: 478px; width: 1920px; text-align: center; font-size: 118px; letter-spacing: .1em; }
    #o-words span { opacity: 0; }
    #o-shock { position: absolute; left: 310px; top: -220px; width: 1300px; height: 1300px; opacity: 0; }
    #o-lburst { position: absolute; left: 410px; top: -120px; width: 1100px; height: 1100px; opacity: 0; }
    #o-logo { position: absolute; left: 770px; top: 240px; width: 380px; height: 380px; opacity: 0; }
    #o-wm { position: absolute; left: 680px; top: 650px; width: 560px; height: 102px; opacity: 0; }"""
    body = '    <div id="o-glow"></div>\n'
    for i, s in enumerate(STOCK):
        body += f'    <img id="o-r{i}" class="o-ring scr" src="{DER}energy_pulse_ring.png" alt="" />\n'
        body += f'    <div class="o-box"><img id="o-i{i}" class="o-img" src="{DER}stock_{s}.png" alt="{s[3:]}" /></div>\n'
    body += f'''    <img id="o-burst" class="scr" src="{DER}light_burst_cyan.png" alt="" />
    <div id="o-wash" class="scr"></div>
    <div id="o-words" class="hl"><span id="o-w0">Planning</span> <span id="o-w1">to</span> <span id="o-w2" class="cy">chill?</span></div>
    <img id="o-shock" class="scr" src="{DER}energy_pulse_shockwave.png" alt="" />
    <img id="o-lburst" class="scr" src="{DER}logo_light_burst.png" alt="" />
    <img id="o-logo" src="{DER}logo_symbol_glow_2048.png" alt="HANGOUT" />
    <img id="o-wm" src="{LIB}01_Brand_Assets/svg/hangout_wordmark_gradient.svg" alt="HANGOUT" />'''
    js = """
    // Faint cyan glow in the dark, then seven activities pop in, each cut quicker than the last.
    tl.fromTo("#o-glow", { opacity: 0.55 }, { opacity: 1, duration: 0.25, ease: "power1.out" }, 0);
    const pops = [[0.25, 0.6], [0.85, 0.5], [1.35, 0.45], [1.8, 0.4], [2.2, 0.35], [2.55, 0.3], [2.85, 0.3]];
    pops.forEach(([t, d], i) => {
      const s = i % 2 ? 1 : -1;
      tl.fromTo("#o-i" + i, { autoAlpha: 0, scale: 0.6, rotation: -6 * s }, { autoAlpha: 1, scale: 1.05, rotation: 1.5 * s, duration: 0.11, ease: "power3.out" }, t);
      tl.to("#o-i" + i, { scale: 1, rotation: 0, duration: 0.13, ease: "power2.out" }, t + 0.11);
      tl.to("#o-i" + i, { autoAlpha: 0, scale: 0.94, duration: 0.05, ease: "power2.in" }, t + d - 0.05);
      tl.fromTo("#o-r" + i, { opacity: 0.85, scale: 0.45 }, { opacity: 0, scale: 1.25, duration: Math.min(0.55, d + 0.1), ease: "power2.out", immediateRender: false }, t);
    });
    // Cyan flash.
    tl.fromTo("#o-burst", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1.3, duration: 0.09, ease: "power2.out" }, 3.15);
    tl.to("#o-burst", { opacity: 0, scale: 1.6, duration: 0.12, ease: "power2.in" }, 3.24);
    tl.fromTo("#o-wash", { opacity: 0 }, { opacity: 0.32, duration: 0.07, ease: "power2.out" }, 3.15);
    tl.to("#o-wash", { opacity: 0, duration: 0.13, ease: "power2.in" }, 3.22);
    // PLANNING / TO / CHILL? stamp in.
    [3.4, 3.85, 4.3].forEach((t, j) => {
      tl.fromTo("#o-w" + j, { opacity: 0, scale: 1.7, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.2, ease: "expo.out" }, t);
    });
    tl.to("#o-words", { opacity: 0, filter: "blur(10px)", duration: 0.12, ease: "power3.in" }, 4.83);
    // The logo bursts in on the drop at 5.0; the wordmark rises under it.
    tl.fromTo("#o-shock", { opacity: 0.9, scale: 0.25 }, { opacity: 0, scale: 1.8, duration: 0.95, ease: "power2.out", immediateRender: false }, 5.0);
    tl.fromTo("#o-lburst", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1.1, duration: 0.18, ease: "power3.out" }, 5.0);
    tl.to("#o-lburst", { opacity: 0, scale: 1.45, duration: 0.9, ease: "power2.out" }, 5.18);
    tl.fromTo("#o-logo", { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1.08, duration: 0.18, ease: "expo.out" }, 5.0);
    tl.to("#o-logo", { scale: 1, duration: 0.3, ease: "power2.out" }, 5.18);
    tl.fromTo("#o-wm", { opacity: 0, y: 44, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, ease: "expo.out" }, 5.6);
    tl.to("#o-wm", { opacity: 0, filter: "blur(6px)", duration: 0.15, ease: "power3.in" }, 6.82);"""
    return scene("open", css, body, js)

# ---------------------------------------------------------------- 2. Home reveal 7.0-12.5
def home():
    css = """
    #h-grid, #h-pill { left: -40px; top: -20px; width: 2000px; height: 1125px; }
    #h-logo { position: absolute; left: 770px; top: 240px; width: 380px; height: 380px; }
    .tile { position: absolute; left: 1420px; width: 400px; height: 210px; opacity: 0; }
    .tile .glass { position: absolute; inset: 0; width: 400px; height: 210px; }
    .tile .pic { position: absolute; left: 16px; top: 15px; width: 180px; height: 180px; object-fit: contain;
                 filter: drop-shadow(0 0 16px rgba(54,214,242,.5)); }
    .tile .lbl { position: absolute; left: 206px; top: 78px; font-size: 46px; color: #F4F8FC; }
    #h-sweep { position: absolute; left: 160px; top: -260px; width: 1600px; height: 1600px; opacity: 0; }"""
    tiles = [("h-t0", "05_claw", "Arcade", 150), ("h-t1", "03_vr", "VR", 435), ("h-t2", "01_kart", "Karting", 720)]
    tbody = ""
    for tid, s, label, top in tiles:
        tbody += (f'      <div id="{tid}" class="tile" style="top:{top}px"><img class="glass" src="{LIB}03_Motion_Graphics/floating_ui/glass_panel_1200x800.png" alt="" />'
                  f'<img class="pic" src="{DER}stock_{s}.png" alt="{label}" /><div class="lbl">{label}</div></div>\n')
    body = f'''    <img class="bg" src="{DER}futuristic_environment_16x9_bg.jpg" alt="" />
    <img id="h-grid" class="bg" src="{DER}futuristic_environment_16x9_mid_grid.png" alt="" />
    <img id="h-pill" class="bg scr" src="{DER}futuristic_environment_16x9_fg_light_pillars.png" alt="" />
    <img id="h-logo" src="{DER}logo_symbol_glow_2048.png" alt="HANGOUT" />
    <div id="h-all" class="stage">
      {phone("h-p2", "S04Categories", 960, 540, dim=True)}
      {phone("h-p1", "S02Home", 960, 540)}
{tbody}    </div>
    <img id="h-sweep" class="scr" src="{DER}light_sweep_diagonal.png" alt="" />'''
    js = """
    tl.fromTo("#h-grid", { x: 0, y: 0 }, { x: -24, y: -14, duration: 5.5, ease: "none" }, 0);
    tl.fromTo("#h-pill", { x: 0 }, { x: -40, duration: 5.5, ease: "none" }, 0);
    // The logo shrinks into the centre; the Home phone opens out of it at 40 deg, then turns to 14 deg and slides left.
    tl.fromTo("#h-logo", { scale: 1, y: 0, opacity: 1 }, { scale: 0.18, y: 110, opacity: 0, duration: 0.5, ease: "power3.in" }, 0);
    tl.fromTo("#h-p1", { scale: 0.18, opacity: 0, rotationY: 40, x: 0, z: 0 }, { scale: 1, opacity: 1, duration: 0.65, ease: "expo.out" }, 0.3);
    tl.to("#h-p1", { rotationY: 14, x: -360, duration: 1.2, ease: "power2.inOut" }, 0.75);
    // Categories phone enters behind, on the right.
    tl.fromTo("#h-p2", { x: 520, z: -280, rotationY: -32, opacity: 0 }, { x: 150, z: -280, rotationY: -12, opacity: 1, duration: 0.7, ease: "expo.out" }, 2.0);
    tl.fromTo("#h-p2-dim", { opacity: 0 }, { opacity: 0.18, duration: 0.7, ease: "power2.out" }, 2.0);
    // Glass category tiles slide in on the far right.
    ["#h-t0", "#h-t1", "#h-t2"].forEach((s, i) => {
      tl.fromTo(s, { x: 260, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "expo.out" }, 2.6 + i * 0.14);
    });
    // Light sweep.
    tl.fromTo("#h-sweep", { x: -1500, opacity: 0 }, { x: 1500, opacity: 0.85, duration: 0.8, ease: "power2.inOut" }, 3.45);
    tl.to("#h-sweep", { opacity: 0, duration: 0.15, ease: "power2.in" }, 4.25);
    // Everything exits left.
    tl.to("#h-all", { x: -1500, opacity: 0, duration: 0.5, ease: "power3.in" }, 5.0);"""
    return scene("home", css, body, js)

# ---------------------------------------------------------------- 3. Discover 12.5-23.0
def discover():
    css = """
    #d-t1 { left: 140px; top: 330px; font-size: 132px; }
    #d-t2 { left: 146px; top: 488px; font-size: 70px; letter-spacing: .07em; }
    #d-t3 { left: 0; top: 900px; width: 1920px; text-align: center; font-size: 62px; }
    .d-ring { position: absolute; left: 510px; top: 20px; width: 900px; height: 900px; opacity: 0; }
    .d-fly { position: absolute; left: 760px; top: 320px; width: 400px; height: 300px; opacity: 0; }
    .d-fly img { width: 400px; height: 300px; object-fit: contain; filter: drop-shadow(0 0 22px rgba(54,214,242,.55)); }
    .d-trail { position: absolute; left: 960px; top: 414px; width: 900px; height: 112px; transform-origin: 0% 50%; opacity: 0; }
    #d-ven { clip-path: inset(62.5% 4% 25.5% 4% round 14px); }"""
    # Fly-out directions (seeded, fixed): dx, dy in px.
    dirs = [(-760, -400), (760, -330), (-860, 230), (820, 300), (-320, -560), (300, 560), (900, -40)]
    import math
    fly = ""
    for i, s in enumerate(STOCK):
        dx, dy = dirs[i]
        ang = math.degrees(math.atan2(dy, dx))
        fly += f'    <img id="d-tr{i}" class="d-trail scr" src="{LIB}03_Motion_Graphics/transitions/motion_trail_cyan.png" alt="" data-ang="{ang:.1f}" />\n'
        fly += f'    <div id="d-f{i}" class="d-fly"><img src="{DER}stock_{s}.png" alt="{s[3:]}" /></div>\n'
    ven_overlay = f'<img id="d-ven" src="{SCR}S07Venue.png" alt="S07Venue" />'
    body = f'''    <img class="bg" src="{DER}atmospheric_cyan_blue_16x9_bg.jpg" alt="" />
    <img class="d-ring scr" id="d-r0" src="{DER}energy_pulse_ring.png" alt="" />
    <img class="d-ring scr" id="d-r1" src="{DER}energy_pulse_ring.png" alt="" />
    <img class="d-ring scr" id="d-r2" src="{DER}energy_pulse_ring.png" alt="" />
    <div id="d-st" class="stage">
      {phone("d-map", "S06Map", 420, 470)}
      {phone("d-ex", "S03Explore", 1290, 540, dim=True)}
      {phone("d-res", "S05Results", 1290, 540, extra=ven_overlay)}
    </div>
{fly}    <div id="d-t1" class="hl"><span>Discover</span></div>
    <div id="d-t2" class="hl"><span>What's out</span> <span class="cy">there.</span></div>
    <div id="d-t3" class="hl"><span>Find your next</span> <span class="cy">experience.</span></div>'''
    js = """
    // Explore on the right, the question on the left.
    tl.fromTo("#d-ex", { x: 700, rotationY: -32, opacity: 0 }, { x: 0, rotationY: -14, opacity: 1, duration: 0.55, ease: "expo.out" }, 0);
    tl.fromTo("#d-t1", { opacity: 0, filter: "blur(10px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power4.out" }, 0.4);
    tl.fromTo("#d-t2", { opacity: 0, filter: "blur(10px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power4.out" }, 0.62);
    // Results slides in front; Explore recedes.
    tl.fromTo("#d-res", { x: 640, z: 120, rotationY: -32, opacity: 0 }, { x: -20, z: 80, rotationY: -10, opacity: 1, duration: 0.6, ease: "expo.out" }, 3.0);
    tl.to("#d-ex", { x: 190, z: -320, rotationY: -22, duration: 0.6, ease: "power2.inOut" }, 3.0);
    tl.to("#d-ex-dim", { opacity: 0.5, duration: 0.6, ease: "power2.out" }, 3.0);
    tl.to(["#d-t1", "#d-t2"], { opacity: 0, filter: "blur(8px)", duration: 0.18, ease: "power3.in" }, 4.75);
    // The Holodeck VR card expands into the venue page, filling the phone.
    tl.fromTo("#d-ven", { clipPath: "inset(62.5% 4% 25.5% 4% round 14px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 0.45, ease: "power3.inOut" }, 5.0);
    tl.to("#d-ex", { opacity: 0, duration: 0.35, ease: "power2.in" }, 5.0);
    // Portal: the venue recedes to the centre, rings pulse outward, the activities fly past the camera.
    tl.to("#d-res", { x: -330, y: -70, z: -600, rotationY: 0, duration: 0.9, ease: "power2.inOut" }, 6.5);
    [6.6, 7.1, 7.6].forEach((t, i) => {
      tl.fromTo("#d-r" + i, { opacity: 0.9, scale: 0.3 }, { opacity: 0, scale: 2.6, duration: 1.2, ease: "power2.out", immediateRender: false }, t);
    });
    const dirs = [[-760, -400], [760, -330], [-860, 230], [820, 300], [-320, -560], [300, 560], [900, -40]];
    dirs.forEach(([dx, dy], i) => {
      const t = 7.0 + i * 0.32;
      const tr = document.getElementById("d-tr" + i);
      const ang = parseFloat(tr.getAttribute("data-ang"));
      tl.fromTo("#d-f" + i, { x: 0, y: 0, scale: 0.15, opacity: 0, rotation: (i % 2 ? 8 : -8) },
        { x: dx, y: dy, scale: 1.9, rotation: 0, duration: 1.1, ease: "power2.in" }, t);
      tl.to("#d-f" + i, { opacity: 1, duration: 0.15, ease: "power1.out" }, t);
      tl.to("#d-f" + i, { opacity: 0, duration: 0.2, ease: "power1.in" }, t + 0.9);
      tl.fromTo(tr, { rotation: ang, scaleX: 0, opacity: 0.85 }, { rotation: ang, scaleX: 1, opacity: 0, duration: 1.1, ease: "power2.in", immediateRender: false }, t);
    });
    tl.fromTo("#d-map", { x: -520, z: -250, rotationY: 32, opacity: 0 }, { x: 0, z: -250, rotationY: 16, opacity: 1, duration: 0.7, ease: "expo.out" }, 7.6);
    tl.fromTo("#d-t3", { opacity: 0, filter: "blur(10px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.22, ease: "power4.out" }, 8.0);
    tl.to("#d-st", { opacity: 0, duration: 0.3, ease: "power3.in" }, 10.2);
    tl.to("#d-t3", { opacity: 0, filter: "blur(8px)", duration: 0.3, ease: "power3.in" }, 10.2);"""
    return scene("discover", css, body, js)
