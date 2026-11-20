from common import *
import json, math, os

# ---------------------------------------------------------------- 4. Make it happen 23.0-34.0
def carousel():
    css = """
    #c-floor { left: 0; top: 0; }
    #c-t1 { left: 120px; top: 360px; font-size: 64px; }
    #c-t2 { left: 120px; top: 470px; font-size: 64px; }
    #c-t3 { left: 120px; top: 556px; font-size: 64px; }
    #c-ring { position: absolute; left: 76px; top: 50px; width: 280px; height: 280px; opacity: 0; }"""
    screens = ["S07Venue", "S08Activity", "S09Packages", "S10Booking", "S11Summary", "S12Confirmed"]
    phones = ""
    for i, s in enumerate(screens):
        extra = f'<img id="c-ring" class="scr" src="{DER}energy_pulse_ring.png" alt="" />' if i == 5 else ""
        phones += "      " + phone(f"c-p{i}", s, 1380, 540, dim=True, extra=extra) + "\n"
    body = f'''    <img class="bg" src="{DER}floating_screens_stage_16x9_bg.jpg" alt="" />
    <img id="c-floor" class="bg scr" src="{DER}floating_screens_stage_16x9_mid_floor_light.png" alt="" />
    <div id="c-st" class="stage">
{phones}    </div>
    <div id="c-t1" class="hl"><span>From discovery</span></div>
    <div id="c-t2" class="hl"><span>to your next</span></div>
    <div id="c-t3" class="hl"><span class="cy">adventure.</span></div>'''
    js = """
    // Three-phone carousel: centre in front, neighbours at +-30 deg pushed back; one screen per step, each held ~1.4 s.
    const N = 6;
    function state(k) {
      const a = Math.abs(k);
      return { x: k * 340, z: -260 * Math.min(a, 2), rotationY: -30 * Math.sign(k) * Math.min(a, 1), opacity: a <= 1 ? 1 : 0, dim: a === 0 ? 0 : 0.45 };
    }
    for (let i = 0; i < N; i++) {
      const s = state(i);
      tl.fromTo("#c-p" + i, { x: s.x + 620, z: s.z, rotationY: s.rotationY, opacity: 0 }, { x: s.x, z: s.z, rotationY: s.rotationY, opacity: s.opacity, duration: 0.45, ease: "expo.out" }, 0);
      tl.fromTo("#c-p" + i + "-dim", { opacity: s.dim }, { opacity: s.dim, duration: 0.01 }, 0);
    }
    const steps = [1.7, 3.5, 5.3, 7.1, 8.9];
    steps.forEach((t, n) => {
      const cur = n + 1;
      for (let i = 0; i < N; i++) {
        const s = state(i - cur);
        tl.to("#c-p" + i, { x: s.x, z: s.z, rotationY: s.rotationY, opacity: s.opacity, duration: 0.4, ease: "power3.inOut" }, t);
        tl.to("#c-p" + i + "-dim", { opacity: s.dim, duration: 0.4, ease: "power2.inOut" }, t);
      }
    });
    // One clean ring from the check mark on Booking confirmed. Nothing else.
    tl.fromTo("#c-ring", { opacity: 0.9, scale: 0.2 }, { opacity: 0, scale: 1.5, duration: 0.85, ease: "power2.out", immediateRender: false }, 9.35);
    // Left text.
    tl.fromTo("#c-t1", { opacity: 0, filter: "blur(10px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.22, ease: "power4.out" }, 0.5);
    tl.fromTo("#c-t2", { opacity: 0, filter: "blur(10px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.22, ease: "power4.out" }, 4.0);
    tl.fromTo("#c-t3", { opacity: 0, filter: "blur(10px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.22, ease: "power4.out" }, 4.15);
    tl.to("#c-st", { opacity: 0, duration: 0.3, ease: "power3.in" }, 10.7);
    tl.to(["#c-t1", "#c-t2", "#c-t3"], { opacity: 0, filter: "blur(8px)", duration: 0.25, ease: "power3.in" }, 10.7);"""
    return scene("carousel", css, body, js)

# ---------------------------------------------------------------- 5. Play, progress, unlock 34.0-47.0
def progress():
    G = LIB + "05_Gamification_Effects/"
    css = """
    #g-gold { opacity: 0; }
    .g-h { left: 1040px; top: 150px; font-size: 100px; opacity: 0; }
    .g-h2 { left: 1040px; top: 262px; font-size: 100px; opacity: 0; }
    #g-cnt { position: absolute; left: 1040px; top: 330px; font-size: 200px; line-height: 1; color: #F4F8FC; opacity: 0; letter-spacing: .02em; }
    #g-cnt small { font-size: 72px; color: #36D6F2; letter-spacing: .08em; margin-left: 18px; }
    .chip { position: absolute; left: 1046px; padding: 14px 30px; border-radius: 40px; font-size: 40px; color: #F4F8FC; opacity: 0;
            background: rgba(20,34,53,.78); border: 2px solid rgba(54,214,242,.45); box-shadow: 0 0 28px rgba(54,214,242,.18); }
    .chip b { color: #36D6F2; }
    .orb { position: absolute; left: 0; top: 0; width: 84px; height: 84px; opacity: 0; }
    #g-ring { position: absolute; left: 1090px; top: 400px; width: 400px; height: 400px; opacity: 0; }
    #g-ring .lv { position: absolute; left: 0; top: 118px; width: 400px; text-align: center; font-size: 40px; color: #93A5BA; }
    #g-ring .num { position: absolute; left: 0; top: 150px; width: 400px; text-align: center; font-family: "Rajdhani", sans-serif; font-weight: 700; font-size: 150px; line-height: 1; color: #F4F8FC; }
    #g-n10 { opacity: 0; }
    #g-burst { position: absolute; left: 920px; top: 230px; width: 740px; height: 740px; opacity: 0; }
    #g-badge10 { position: absolute; left: 1520px; top: 470px; width: 260px; height: 260px; opacity: 0; }
    #g-mission { position: absolute; left: 1140px; top: 450px; width: 300px; height: 300px; opacity: 0; }
    #g-flash { position: absolute; left: 1360px; top: 340px; width: 520px; height: 520px; opacity: 0; }
    #g-check { position: absolute; left: 1520px; top: 500px; width: 200px; height: 200px; opacity: 0; }
    #g-rburst { position: absolute; left: 1050px; top: 180px; width: 760px; height: 760px; opacity: 0; }
    #g-rlabel { position: absolute; left: 1130px; top: 800px; width: 600px; height: 90px; opacity: 0; }
    .coin { position: absolute; left: 1375px; top: 640px; width: 110px; height: 110px; opacity: 0; }"""
    orbs = "".join(f'    <img id="g-o{i}" class="orb scr" src="{G}xp_orb.png" alt="" />\n' for i in range(6))
    coins = "".join(f'    <img id="g-coin{i}" class="coin" src="{G}coin.svg" alt="" />\n' for i in range(4))
    front = phone("g-f", None, 560, 540, layers=[("g-s14", "S14XP"), ("g-s15", "S15Levels"), ("g-s17", "S17Mission"), ("g-s19", "S19Redeem")])
    back = phone("g-b", None, 560, 540, dim=True, layers=[("g-s16", "S16Missions"), ("g-s18", "S18Rewards")])
    C = 2 * math.pi * 170
    body = f'''    <img class="bg" src="{DER}atmospheric_blue_lilac_16x9_bg.jpg" alt="" />
    <img id="g-gold" class="bg" src="{DER}atmospheric_navy_gold_16x9_bg.jpg" alt="" />
    <div id="g-st" class="stage">
      {back}
      {front}
    </div>
    <div id="g-h1" class="hl g-h"><span>Play</span> <span class="cy">more.</span></div>
    <div id="g-cnt" class="lbl"><span id="g-num">3,230</span><small>XP</small></div>
    <div id="g-c1" class="chip lbl" style="top:612px"><b>+60 XP</b> · New venue</div>
    <div id="g-c2" class="chip lbl" style="top:704px"><b>+40 XP</b> · Check-in</div>
{orbs}    <div id="g-h2" class="hl g-h"><span>Level</span> <span class="cy">up.</span></div>
    <div id="g-ring">
      <svg width="400" height="400" viewBox="0 0 400 400"><circle cx="200" cy="200" r="170" fill="none" stroke="rgba(147,165,186,.22)" stroke-width="22" />
        <circle id="g-arc" cx="200" cy="200" r="170" fill="none" stroke="#36D6F2" stroke-width="22" stroke-linecap="round" stroke-dasharray="{C:.2f}" stroke-dashoffset="{C*0.53:.2f}" transform="rotate(-90 200 200)" /></svg>
      <div class="lv lbl">Level</div>
      <div id="g-n9" class="num">9</div><div id="g-n10" class="num">10</div>
    </div>
    <img id="g-burst" class="scr" src="{DER}level_up_burst.png" alt="" />
    <img id="g-badge10" src="{G}level_badge_10_gold.svg" alt="Level 10" />
    <div id="g-h3" class="hl g-h"><span>Challenge</span></div>
    <div id="g-h3b" class="hl g-h2"><span class="cy">complete</span></div>
    <img id="g-mission" src="{G}badge_mission_cyan.svg" alt="Mission badge" />
    <img id="g-flash" class="scr" src="{G}challenge_complete_flash.png" alt="" />
    <img id="g-check" src="{G}challenge_complete_check.svg" alt="Challenge complete" />
    <div id="g-h4" class="hl g-h"><span>Unlock</span></div>
    <div id="g-h4b" class="hl g-h2"><span class="cy">more.</span></div>
    <img id="g-rburst" class="scr" src="{DER}reward_unlock_burst.png" alt="" />
    <img id="g-rlabel" src="{G}reward_unlocked_label.svg" alt="Reward unlocked" />
{coins}'''
    js = f"""
    const blurIn = (s, t) => tl.fromTo(s, {{ opacity: 0, filter: "blur(10px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power4.out" }}, t);
    const blurOut = (s, t) => tl.to(s, {{ opacity: 0, filter: "blur(8px)", duration: 0.15, ease: "power3.in" }}, t);
    const swap = (from, to, t) => {{ tl.to(from, {{ opacity: 0, duration: 0.3, ease: "power2.inOut" }}, t); tl.fromTo(to, {{ opacity: 0 }}, {{ opacity: 1, duration: 0.3, ease: "power2.inOut", immediateRender: false }}, t); }};
    // Screens start hidden except the first of each phone.
    ["#g-s15", "#g-s17", "#g-s19", "#g-s18"].forEach((s) => tl.fromTo(s, {{ opacity: 0 }}, {{ opacity: 0, duration: 0.01 }}, 0));
    tl.fromTo("#g-f", {{ x: -620, rotationY: 30, opacity: 0 }}, {{ x: 0, rotationY: 14, opacity: 1, duration: 0.5, ease: "expo.out" }}, 0);
    tl.fromTo("#g-b", {{ x: 200, z: -300, rotationY: 8, opacity: 0 }}, {{ x: 200, z: -300, rotationY: 8, opacity: 0, duration: 0.01 }}, 0);
    tl.fromTo("#g-b-dim", {{ opacity: 0.5 }}, {{ opacity: 0.5, duration: 0.01 }}, 0);

    // a) PLAY MORE. XP counts 3,230 -> 3,330 as orbs arc from the phone into the counter.
    blurIn("#g-h1", 0.3);
    tl.fromTo("#g-cnt", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.3, ease: "expo.out" }}, 0.45);
    const xp = {{ v: 3230 }};
    tl.fromTo(xp, {{ v: 3230 }}, {{ v: 3330, duration: 1.4, ease: "power2.inOut", immediateRender: false, onUpdate: () => {{
      document.getElementById("g-num").textContent = Math.round(xp.v).toLocaleString("en-US");
    }} }}, 0.8);
    [["#g-c1", 1.0], ["#g-c2", 1.5]].forEach(([s, t]) => tl.fromTo(s, {{ opacity: 0, scale: 0.7 }}, {{ opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.6)" }}, t));
    for (let i = 0; i < 6; i++) {{
      const p = {{ u: 0 }};
      const el = "#g-o" + i;
      const P0 = [600, 300], P1 = [960, 40], P2 = [1300, 430];
      tl.fromTo(p, {{ u: 0 }}, {{ u: 1, duration: 0.7, ease: "power1.inOut", immediateRender: false, onUpdate: () => {{
        const u = p.u, a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u;
        gsap.set(el, {{ x: a * P0[0] + b * P1[0] + c * P2[0] - 42, y: a * P0[1] + b * P1[1] + c * P2[1] - 42, scale: 0.6 + 0.5 * Math.sin(Math.PI * u) }});
      }} }}, 0.8 + i * 0.18);
      tl.fromTo(el, {{ opacity: 0 }}, {{ opacity: 1, duration: 0.12 }}, 0.8 + i * 0.18);
      tl.to(el, {{ opacity: 0, duration: 0.12 }}, 1.38 + i * 0.18);
    }}
    blurOut(["#g-h1", "#g-cnt", "#g-c1", "#g-c2"], 2.85);

    // b) LEVEL UP. The ring fills 47% -> 100%, 9 flips to 10, burst and the gold badge.
    swap("#g-s14", "#g-s15", 3.0);
    blurIn("#g-h2", 3.1);
    tl.fromTo("#g-ring", {{ opacity: 0, scale: 0.9 }}, {{ opacity: 1, scale: 1, duration: 0.35, ease: "expo.out" }}, 3.2);
    tl.fromTo("#g-arc", {{ attr: {{ "stroke-dashoffset": {C*0.53:.2f} }} }}, {{ attr: {{ "stroke-dashoffset": 0 }}, duration: 1.3, ease: "power2.inOut" }}, 3.45);
    tl.to("#g-n9", {{ rotationX: -90, opacity: 0, duration: 0.12, ease: "power2.in" }}, 4.82);
    tl.fromTo("#g-n10", {{ rotationX: 90, opacity: 0 }}, {{ rotationX: 0, opacity: 1, duration: 0.18, ease: "power2.out" }}, 4.94);
    tl.fromTo("#g-burst", {{ opacity: 0, scale: 0.4 }}, {{ opacity: 1, scale: 1.05, duration: 0.18, ease: "power3.out" }}, 5.0);
    tl.to("#g-burst", {{ opacity: 0, scale: 1.3, duration: 0.9, ease: "power2.out" }}, 5.18);
    tl.fromTo("#g-badge10", {{ opacity: 0, scale: 0.3 }}, {{ opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.7)" }}, 5.05);
    blurOut(["#g-h2", "#g-ring", "#g-badge10"], 5.85);

    // c) CHALLENGE COMPLETE. Mission in front, missions list dimmed behind; badge stamps, then the check.
    swap("#g-s15", "#g-s17", 6.0);
    tl.to("#g-b", {{ opacity: 1, duration: 0.4, ease: "power2.out" }}, 6.0);
    blurIn("#g-h3", 6.1);
    blurIn("#g-h3b", 6.2);
    tl.fromTo("#g-mission", {{ opacity: 0, scale: 1.8 }}, {{ opacity: 1, scale: 1, duration: 0.25, ease: "power4.out" }}, 6.6);
    tl.fromTo("#g-flash", {{ opacity: 0, scale: 0.5 }}, {{ opacity: 1, scale: 1.1, duration: 0.15, ease: "power3.out" }}, 7.5);
    tl.to("#g-flash", {{ opacity: 0, scale: 1.4, duration: 0.6, ease: "power2.out" }}, 7.65);
    tl.fromTo("#g-check", {{ opacity: 0, scale: 0.3 }}, {{ opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.8)" }}, 7.5);
    blurOut(["#g-h3", "#g-h3b", "#g-mission", "#g-check"], 8.85);

    // d) UNLOCK MORE. Redeem in front, Rewards behind; gold room; burst, label, four coins tumbling up.
    tl.fromTo("#g-gold", {{ opacity: 0 }}, {{ opacity: 1, duration: 1.0, ease: "power1.inOut" }}, 9.0);
    swap("#g-s17", "#g-s19", 9.0);
    swap("#g-s16", "#g-s18", 9.0);
    blurIn("#g-h4", 9.1);
    blurIn("#g-h4b", 9.2);
    tl.fromTo("#g-rburst", {{ opacity: 0, scale: 0.4 }}, {{ opacity: 1, scale: 1.05, duration: 0.2, ease: "power3.out" }}, 10.5);
    tl.to("#g-rburst", {{ opacity: 0, scale: 1.3, duration: 1.0, ease: "power2.out" }}, 10.7);
    tl.fromTo("#g-rlabel", {{ opacity: 0, y: 30, scale: 0.9 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.6)" }}, 10.6);
    [[-300, -200, -540], [-100, -250, 400], [110, -235, -380], [310, -190, 520]].forEach(([dx, dy, rot], i) => {{
      tl.fromTo("#g-coin" + i, {{ x: 0, y: 0, rotation: 0, opacity: 0, scale: 0.6 }}, {{ x: dx, y: dy, rotation: rot, scale: 1, duration: 1.6, ease: "power2.out" }}, 10.55 + i * 0.08);
      tl.to("#g-coin" + i, {{ opacity: 1, duration: 0.15 }}, 10.55 + i * 0.08);
      tl.to("#g-coin" + i, {{ opacity: 0, duration: 0.35, ease: "power1.in" }}, 11.8 + i * 0.08);
    }});
    tl.to("#g-st", {{ opacity: 0, duration: 0.3, ease: "power3.in" }}, 12.7);
    blurOut(["#g-h4", "#g-h4b", "#g-rlabel"], 12.7);"""
    return scene("progress", css, body, js)

# ---------------------------------------------------------------- 6. Big picture 47.0-54.0
def arc():
    css = """
    #a-panels { left: -30px; top: -15px; width: 1980px; height: 1114px; }
    .a-t { left: 0; top: 905px; width: 1920px; text-align: center; font-size: 72px; opacity: 0; }
    #a-black { position: absolute; inset: 0; background: #000; opacity: 0; }"""
    screens = ["S03Explore", "S07Venue", "S10Booking", "S14XP", "S16Missions", "S18Rewards"]
    ph = "".join("      " + phone(f"a-p{i}", s, 960, 470) + "\n" for i, s in enumerate(screens))
    body = f'''    <img class="bg" src="{DER}digital_depth_16x9_bg.jpg" alt="" />
    <img id="a-panels" class="bg" src="{DER}digital_depth_16x9_mid_panels.png" alt="" />
    <div id="a-st" class="stage">
{ph}      {phone("a-home", "S02Home", 960, 470)}
    </div>
    <div id="a-t1" class="hl a-t"><span>Your city.</span></div>
    <div id="a-t2" class="hl a-t"><span>Your experiences.</span></div>
    <div id="a-t3" class="hl a-t"><span>Your</span> <span class="cy">hangout.</span></div>
    <div id="a-black"></div>'''
    js = """
    tl.fromTo("#a-panels", { x: 0 }, { x: -30, duration: 7, ease: "none" }, 0);
    // Six phones on a slowly turning arc, then they converge into one Home phone.
    const R = 1100, base = [-62.5, -37.5, -12.5, 12.5, 37.5, 62.5];
    const st = { phi: -14, c: 0 };
    const place = () => {
      for (let i = 0; i < 6; i++) {
        const th = ((base[i] + st.phi) * Math.PI) / 180;
        const x = R * Math.sin(th), z = R * Math.cos(th) - R, ry = base[i] + st.phi;
        const k = st.c;
        gsap.set("#a-p" + i, { x: x * (1 - k), z: z * (1 - k), rotationY: ry * (1 - k), scale: 0.8, opacity: 1 - k });
      }
    };
    place();
    tl.fromTo(st, { phi: -14 }, { phi: 14, duration: 5.2, ease: "none", onUpdate: place }, 0);
    tl.fromTo(st, { c: 0 }, { c: 1, duration: 0.7, ease: "power3.inOut", onUpdate: place }, 4.55);
    tl.fromTo("#a-st", { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" }, 0);
    tl.fromTo("#a-home", { opacity: 0, scale: 0.65 }, { opacity: 1, scale: 0.85, duration: 0.6, ease: "expo.out" }, 4.95);
    // One line at a time.
    [["#a-t1", 0.4, 2.0], ["#a-t2", 2.2, 3.95]].forEach(([s, a, b]) => {
      tl.fromTo(s, { opacity: 0, filter: "blur(10px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.22, ease: "power4.out" }, a);
      tl.to(s, { opacity: 0, filter: "blur(8px)", duration: 0.16, ease: "power3.in" }, b);
    });
    tl.fromTo("#a-t3", { opacity: 0, filter: "blur(10px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.22, ease: "power4.out" }, 4.15);
    // Fade to black 53.5-54.0.
    tl.fromTo("#a-black", { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power1.in" }, 6.5);"""
    return scene("arc", css, body, js)

# ---------------------------------------------------------------- 7. Brand reveal 54.0-60.0
def brand():
    d = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets/HANGOUT_Ad_Asset_Library/06_Logo_Reveal/particle_convergence_H.json"))
    cx, cy = 960, 420
    kEnd = 400 / 1024 * 0.53   # the JSON's H is ~1.9x the logo tile's H: scale it onto the logo's H
    kStart = 1.0
    parts = ""
    for i, p in enumerate(d["particles"]):
        sx, sy = cx + (p["start"][0] - 512) * kStart, cy + (p["start"][1] - 512) * kStart
        ex, ey = cx + (p["end"][0] - 512) * kEnd, cy + (p["end"][1] - 512) * kEnd
        r = p["r"] * 0.85
        h = ((i * 2654435761) % 1000) / 1000.0   # deterministic spread of start times
        parts += (f'    <div class="bp" style="left:{sx - r:.1f}px;top:{sy - r:.1f}px;width:{2*r:.1f}px;height:{2*r:.1f}px;'
                  f'background:{p["color"]};box-shadow:0 0 {r*2.2:.0f}px {p["color"]}" data-dx="{ex - sx:.1f}" data-dy="{ey - sy:.1f}" data-d="{h*0.22:.3f}"></div>\n')
    css = """
    .bp { position: absolute; border-radius: 50%; }
    #b-ring { position: absolute; left: 510px; top: -30px; width: 900px; height: 900px; opacity: 0; }
    #b-lburst { position: absolute; left: 410px; top: -130px; width: 1100px; height: 1100px; opacity: 0; }
    #b-logo { position: absolute; left: 760px; top: 220px; width: 400px; height: 400px; opacity: 0; }
    #b-wm { position: absolute; left: 690px; top: 668px; width: 540px; height: 98px; opacity: 0; }
    #b-tag { left: 0; top: 818px; width: 1920px; text-align: center; font-size: 54px; letter-spacing: .1em; opacity: 0; }
    #b-flare { position: absolute; left: -1088px; top: 356px; width: 4096px; height: 512px; opacity: 0; }
    #b-black { position: absolute; inset: 0; background: #000; opacity: 0; }"""
    body = f'''    <img class="bg" src="{DER}logo_reveal_clean_16x9_bg.jpg" alt="" />
{parts}    <img id="b-ring" class="scr" src="{DER}energy_pulse_ring.png" alt="" />
    <img id="b-lburst" class="scr" src="{DER}logo_light_burst.png" alt="" />
    <img id="b-logo" src="{DER}logo_symbol_glow_2048.png" alt="HANGOUT" />
    <img id="b-wm" src="{LIB}01_Brand_Assets/svg/hangout_wordmark_gradient.svg" alt="HANGOUT" />
    <div id="b-tag" class="hl"><span>Make every outing an</span> <span class="cy">experience.</span></div>
    <img id="b-flare" class="scr" src="{LIB}06_Logo_Reveal/logo_flare_streak.png" alt="" />
    <div id="b-black"></div>'''
    js = """
    // 126 particles fly in and form the H (54.0-55.0).
    document.querySelectorAll("#root .bp").forEach((el) => {
      const dx = parseFloat(el.dataset.dx), dy = parseFloat(el.dataset.dy), dl = parseFloat(el.dataset.d);
      tl.fromTo(el, { x: 0, y: 0, opacity: 0 }, { x: dx, y: dy, opacity: 1, duration: 0.78 - dl * 0.5, ease: "power3.inOut" }, dl);
      tl.to(el, { opacity: 0, duration: 0.25, ease: "power2.in" }, 1.0);
    });
    // 55.0 logo with burst and ring; 55.5 wordmark; 56.2 tagline; 57.0 flare streak.
    tl.fromTo("#b-logo", { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.3, ease: "expo.out" }, 1.0);
    tl.fromTo("#b-lburst", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1.05, duration: 0.2, ease: "power3.out" }, 1.0);
    tl.to("#b-lburst", { opacity: 0, scale: 1.4, duration: 0.9, ease: "power2.out" }, 1.2);
    tl.fromTo("#b-ring", { opacity: 0.9, scale: 0.3 }, { opacity: 0, scale: 1.8, duration: 0.9, ease: "power2.out", immediateRender: false }, 1.0);
    tl.fromTo("#b-wm", { opacity: 0, y: 30, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: "expo.out" }, 1.5);
    tl.fromTo("#b-tag", { opacity: 0, filter: "blur(10px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.3, ease: "power4.out" }, 2.2);
    tl.fromTo("#b-flare", { x: -1500, opacity: 0 }, { x: 1500, opacity: 1, duration: 1.0, ease: "power2.inOut" }, 3.0);
    tl.to("#b-flare", { opacity: 0, duration: 0.2, ease: "power2.in" }, 4.0);
    // Hold, then fade to black by 60.0.
    tl.fromTo("#b-black", { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "power1.in" }, 5.3);"""
    return scene("brand", css, body, js)

# ---------------------------------------------------------------- Particles drifting the whole film
def particles():
    css = """
    #root { background: transparent; }
    #pt-mid { left: -120px; top: -70px; width: 2160px; height: 1216px; opacity: .45; }
    #pt-fg { left: -160px; top: -90px; width: 2240px; height: 1260px; opacity: .3; }"""
    body = f'''    <img id="pt-mid" class="bg scr" src="{DER}particles_ambient_mid_3840x2160.png" alt="" />
    <img id="pt-fg" class="bg scr" src="{DER}particles_ambient_fg_3840x2160.png" alt="" />'''
    js = """
    tl.fromTo("#pt-mid", { x: 0, y: 0 }, { x: -70, y: -36, duration: 60, ease: "none" }, 0);
    tl.fromTo("#pt-fg", { x: 0, y: 0 }, { x: -150, y: -70, duration: 60, ease: "none" }, 0);"""
    return scene("particles", css, body, js)
