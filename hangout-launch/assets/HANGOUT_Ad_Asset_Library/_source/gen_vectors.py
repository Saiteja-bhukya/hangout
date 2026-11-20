"""Vector (SVG) assets for the HANGOUT ad: frames, masks, gamification, logo reveal, text styles."""
import os, sys, json, math, random
ROOT = sys.argv[1]
def w(rel, s):
    p = os.path.join(ROOT, rel); os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, "w").write(s)
def svg(W, H, body, title, defs=""):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><title>{title}</title>{("<defs>"+defs+"</defs>") if defs else ""}{body}</svg>\n'
FONT_H = "Rajdhani, Urbanist, 'Segoe UI', sans-serif"
FONT_B = "Urbanist, 'Segoe UI', sans-serif"
CYG = '<linearGradient id="cy" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7DEBFF"/><stop offset=".5" stop-color="#36D6F2"/><stop offset="1" stop-color="#1FA9D6"/></linearGradient>'
def metal(id_, a, b, c):
    return f'<linearGradient id="{id_}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{a}"/><stop offset=".3" stop-color="{b}"/><stop offset=".55" stop-color="{c}"/><stop offset=".8" stop-color="{b}"/><stop offset="1" stop-color="{a}"/></linearGradient>'
GOLD = metal("gold", "#F6E3AE", "#C9A24C", "#FFF2C9")
LIL = metal("lil", "#E6E1FF", "#9C8BF2", "#F4F1FF")
CYM = metal("cym", "#C8F7FF", "#36D6F2", "#E8FBFF")
GLOW = '<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'

M = "03_Motion_Graphics/"
# phone frame with transparent screen window (screen = 393x852 at 2x → 786x1704)
fw, fh = 786 + 2 * 40, 1704 + 2 * 40
w(M + "floating_ui/phone_frame_vector.svg", svg(fw, fh,
  f'<path fill-rule="evenodd" fill="url(#bz)" d="M0 128A128 128 0 0 1 128 0H{fw-128}A128 128 0 0 1 {fw} 128V{fh-128}A128 128 0 0 1 {fw-128} {fh}H128A128 128 0 0 1 0 {fh-128}Z M40 150A110 110 0 0 1 150 40H{fw-150}A110 110 0 0 1 {fw-40} 150V{fh-150}A110 110 0 0 1 {fw-150} {fh-40}H150A110 110 0 0 1 40 {fh-150}Z"/>'
  f'<rect x="1.5" y="1.5" width="{fw-3}" height="{fh-3}" rx="126.5" fill="none" stroke="#9FEBFA" stroke-opacity=".55" stroke-width="3"/>'
  f'<rect x="40" y="40" width="786" height="1704" rx="110" fill="none" stroke="#36D6F2" stroke-opacity=".4" stroke-width="2"/>',
  "Phone frame, screen window 786x1704 (393x852 at 2x)",
  '<linearGradient id="bz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2A3E5A"/><stop offset=".5" stop-color="#0F1A2B"/><stop offset="1" stop-color="#1D2C44"/></linearGradient>'))
w(M + "light/glow_outline_card.svg", svg(1400, 1000, '<rect x="100" y="100" width="1200" height="800" rx="56" fill="none" stroke="#36D6F2" stroke-width="6" filter="url(#glow)"/>', "Glowing outline card", GLOW))
# reveal masks (white = visible). Animate scale/position in HyperFrames.
w(M + "transitions/masks/mask_iris_circle.svg", svg(1920, 1080, '<circle cx="960" cy="540" r="540" fill="#FFFFFF"/>', "Iris reveal mask"))
w(M + "transitions/masks/mask_diagonal_wipe.svg", svg(1920, 1080, '<path d="M0 0H1300L620 1080H0Z" fill="#FFFFFF"/>', "Diagonal wipe mask"))
w(M + "transitions/masks/mask_rounded_rect_expand.svg", svg(1920, 1080, '<rect x="764" y="114" width="393" height="852" rx="44" fill="#FFFFFF"/>', "Phone-shaped expand mask"))
w(M + "transitions/masks/mask_split_horizontal.svg", svg(1920, 1080, '<rect x="0" y="0" width="1920" height="540" fill="#FFFFFF"/>', "Horizontal split mask (top half; mirror for bottom)"))
w(M + "transitions/masks/mask_soft_vertical_gradient.svg", svg(1920, 1080, '<rect width="1920" height="1080" fill="url(#sv)"/>', "Soft gradient wipe mask", '<linearGradient id="sv" x1="0" y1="0" x2="1" y2="0"><stop offset=".4" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>'))

G = "05_Gamification_Effects/"
w(G + "xp_chip_plus60.svg", svg(360, 96, f'<rect x="2" y="2" width="356" height="92" rx="46" fill="#0D1624" fill-opacity=".92" stroke="#36D6F2" stroke-opacity=".6" stroke-width="3"/><path d="M13 2L4 14h7l-1 8 9-12h-7z" transform="translate(30 24) scale(2)" fill="none" stroke="#36D6F2" stroke-width="2" stroke-linejoin="round"/><text x="92" y="62" font-family="{FONT_H}" font-weight="700" font-size="40" fill="#F4F8FC">+60 XP</text>', "XP chip (editable text)"))
w(G + "xp_counter_template.svg", svg(900, 240, f'<text x="0" y="150" font-family="{FONT_H}" font-weight="700" font-size="180" fill="#F4F8FC"><tspan id="xp-value">3,330</tspan><tspan dx="24" font-size="72" fill="#36D6F2">XP</tspan></text><text x="4" y="220" font-family="{FONT_B}" font-weight="500" font-size="40" fill="#93A5BA">of 3,630 · Level 9</text>', "XP counter template (count up #xp-value)"))
C = 2 * math.pi * 210
w(G + "level_ring.svg", svg(520, 520, f'<g transform="rotate(-90 260 260)"><circle cx="260" cy="260" r="210" fill="none" stroke="#1B2B42" stroke-width="40"/><circle id="progress" cx="260" cy="260" r="210" fill="none" stroke="url(#cy)" stroke-width="40" stroke-linecap="round" stroke-dasharray="{C:.1f}" stroke-dashoffset="{C*(1-.47):.1f}"/></g><text x="260" y="206" text-anchor="middle" font-family="{FONT_B}" font-weight="700" font-size="30" letter-spacing="4" fill="#93A5BA">LEVEL</text><text id="level" x="260" y="340" text-anchor="middle" font-family="{FONT_H}" font-weight="700" font-size="120" fill="#F4F8FC">9</text>', f"Level ring: animate #progress stroke-dashoffset from {C:.1f} to 0", CYG))
w(G + "level_bar.svg", svg(1000, 60, '<rect x="0" y="18" width="1000" height="24" rx="12" fill="#1B2B42"/><rect id="fill" x="0" y="18" width="470" height="24" rx="12" fill="url(#bf)"/>', "Level bar: animate #fill width 0 to 1000", '<linearGradient id="bf" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#36D6F2"/><stop offset="1" stop-color="#397BFF"/></linearGradient>'))
def medal(fill, inner_icon, title, extra=""):
    return svg(400, 400, f'<circle cx="200" cy="200" r="180" fill="url(#{fill})"/><circle cx="200" cy="200" r="148" fill="#0D1624"/><circle cx="200" cy="200" r="148" fill="none" stroke="#FFFFFF" stroke-opacity=".12" stroke-width="4"/>{inner_icon}{extra}', title, GOLD + LIL + CYM)
PIN = '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" transform="translate(110 110) scale(7.5)" fill="none" stroke="#F6E3AE" stroke-width="1.8" stroke-linecap="round"/>'
CREW = '<path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c.8-3.5 3.2-5.5 6-5.5s5.2 2 6 5.5M16 5a3 3 0 0 1 0 6M18 20c-.3-2-1.2-3.6-2.5-4.6" transform="translate(110 110) scale(7.5)" fill="none" stroke="#E6E1FF" stroke-width="1.8" stroke-linecap="round"/>'
TGT = '<path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01" transform="translate(110 110) scale(7.5)" fill="none" stroke="#C8F7FF" stroke-width="1.8" stroke-linecap="round"/>'
w(G + "badge_first_visit_gold.svg", medal("gold", PIN, "Badge: First visit"))
w(G + "badge_crew_of_3_lilac.svg", medal("lil", CREW, "Badge: Crew of 3"))
w(G + "badge_mission_cyan.svg", medal("cym", TGT, "Badge: Mission"))
w(G + "badge_locked.svg", svg(400, 400, '<circle cx="200" cy="200" r="178" fill="#111C2C" stroke="#93A5BA" stroke-opacity=".35" stroke-width="6" stroke-dasharray="18 14"/><path d="M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3" transform="translate(128 120) scale(6)" fill="none" stroke="#6F8399" stroke-width="2" stroke-linecap="round"/>', "Badge: locked"))
w(G + "level_badge_10_gold.svg", medal("gold", f'<text x="200" y="250" text-anchor="middle" font-family="{FONT_H}" font-weight="700" font-size="150" fill="#F6E3AE">10</text>', "Level badge 10 (editable number)"))
w(G + "challenge_complete_check.svg", svg(400, 400, '<circle cx="200" cy="200" r="170" fill="url(#cy)"/><path d="M5 12l5 5L20 7" transform="translate(80 80) scale(10)" fill="none" stroke="#03141C" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>', "Challenge complete check", CYG))
w(G + "stamp_booked.svg", svg(320, 320, f'<g transform="rotate(-12 160 160)"><circle cx="160" cy="160" r="140" fill="#36D6F2" fill-opacity=".12" stroke="#36D6F2" stroke-width="10"/><circle cx="160" cy="160" r="112" fill="none" stroke="#36D6F2" stroke-width="3" stroke-dasharray="8 8"/><text x="160" y="178" text-anchor="middle" font-family="{FONT_H}" font-weight="700" font-size="44" letter-spacing="2" fill="#7FE6F7">BOOKED</text></g>', "Stamp: Booked (editable text)"))
w(G + "coin.svg", svg(256, 256, '<circle cx="128" cy="128" r="120" fill="url(#gold)"/><circle cx="128" cy="128" r="78" fill="none" stroke="#8A6A22" stroke-opacity=".55" stroke-width="10"/>', "Coin", GOLD))
w(G + "coupon_ticket_shape.svg", svg(1000, 220, '<path fill="url(#cp)" d="M40 0H960A40 40 0 0 1 1000 40V180A40 40 0 0 1 960 220H40A40 40 0 0 1 0 180V40A40 40 0 0 1 40 0Z"/><circle cx="760" cy="0" r="26" fill="#080D16"/><circle cx="760" cy="220" r="26" fill="#080D16"/><path d="M760 34V186" stroke="#2E4462" stroke-width="5" stroke-dasharray="12 10"/>', "Coupon ticket shape (holes are #080D16; place on matching background)", '<linearGradient id="cp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1D3A66"/><stop offset="1" stop-color="#132840"/></linearGradient>'))
w(G + "reward_unlocked_label.svg", svg(800, 120, f'<rect x="2" y="2" width="796" height="116" rx="58" fill="#0D1624" stroke="#E9CB7E" stroke-width="3"/><circle cx="62" cy="60" r="30" fill="url(#gold)"/><text x="116" y="76" font-family="{FONT_H}" font-weight="700" font-size="46" letter-spacing="3" fill="#F4F8FC">REWARD UNLOCKED</text>', "Reward unlocked label (editable)", GOLD))

L = "06_Logo_Reveal/"
random.seed(7)
pts = []
segs = [((18, 14), (18, 50)), ((46, 14), (46, 50)), ((18, 32), (46, 32))]
for (a, b) in segs:
    n = 42 if a[0] == b[0] else 26
    for i in range(n):
        t = i / (n - 1)
        x = a[0] + (b[0] - a[0]) * t + random.uniform(-3.4, 3.4)
        y = a[1] + (b[1] - a[1]) * t + random.uniform(-3.4, 3.4)
        pts.append((x, y))
for i in range(16):
    ang = 2 * math.pi * i / 16
    r = random.uniform(0, 4)
    pts.append((32 + r * math.cos(ang), 18 + r * math.sin(ang)))
S = 1024 / 64
circles, data = [], []
for i, (x, y) in enumerate(pts):
    ex, ey = x * S, y * S
    ang = random.uniform(0, 2 * math.pi); rad = random.uniform(700, 1400)
    sx, sy = 512 + rad * math.cos(ang), 512 + rad * math.sin(ang)
    r = random.choice([4, 5, 6, 7, 9])
    col = random.choice(["#7FE6F7", "#36D6F2", "#E8FBFF", "#36D6F2"])
    circles.append(f'<circle class="p" cx="{ex:.1f}" cy="{ey:.1f}" r="{r}" fill="{col}" data-x0="{sx:.1f}" data-y0="{sy:.1f}"/>')
    data.append({"end": [round(ex, 1), round(ey, 1)], "start": [round(sx, 1), round(sy, 1)], "r": r, "color": col})
w(L + "particle_convergence_H.svg", svg(1024, 1024, f'<g filter="url(#glow)">{"".join(circles)}</g>', "Particle convergence: tween each .p from (data-x0,data-y0) to (cx,cy)", GLOW.replace('stdDeviation="12"', 'stdDeviation="6"')))
w(L + "particle_convergence_H.json", json.dumps({"canvas": [1024, 1024], "note": "Animate each particle from start to end; end positions trace the HANGOUT H mark.", "particles": data}, indent=1))
w(L + "tagline_make_every_outing_an_experience.svg", svg(2400, 200, f'<text x="1200" y="128" text-anchor="middle" font-family="{FONT_H}" font-weight="700" font-size="104" letter-spacing="10" fill="#F4F8FC">MAKE EVERY OUTING AN EXPERIENCE.</text>', "Tagline (editable text; load Rajdhani 700)"))
w(L + "tagline_two_lines.svg", svg(1600, 340, f'<text x="800" y="140" text-anchor="middle" font-family="{FONT_H}" font-weight="700" font-size="112" letter-spacing="10" fill="#F4F8FC">MAKE EVERY OUTING</text><text x="800" y="290" text-anchor="middle" font-family="{FONT_H}" font-weight="700" font-size="112" letter-spacing="10" fill="#36D6F2">AN EXPERIENCE.</text>', "Tagline, two lines (editable)"))
print(len(pts), "particles")
