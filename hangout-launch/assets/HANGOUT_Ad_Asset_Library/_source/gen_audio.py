"""Synthesize HANGOUT ad audio from scratch (no samples): 13 SFX + a 45 s music bed. 48 kHz stereo WAV."""
import os, sys
import numpy as np
from scipy.signal import butter, lfilter, fftconvolve
from scipy.io import wavfile

OUT = sys.argv[1]
SR = 48000
rs = np.random.default_rng(42)
os.makedirs(os.path.join(OUT, "sfx"), exist_ok=True)
os.makedirs(os.path.join(OUT, "music"), exist_ok=True)

def t_(d): return np.arange(int(d * SR)) / SR
def env_exp(n, tau): return np.exp(-np.arange(n) / SR / tau)
def bp(x, lo, hi, o=2): b, a = butter(o, [lo / (SR / 2), hi / (SR / 2)], "band"); return lfilter(b, a, x)
def lp(x, f, o=2): b, a = butter(o, min(f, SR / 2 - 100) / (SR / 2), "low"); return lfilter(b, a, x)
def hp(x, f, o=2): b, a = butter(o, f / (SR / 2), "high"); return lfilter(b, a, x)
def noise(n): return rs.standard_normal(n)
def sweep(f0, f1, d, curve="exp"):
    t = t_(d)
    f = f0 * (f1 / f0) ** (t / d) if curve == "exp" else f0 + (f1 - f0) * t / d
    return np.sin(2 * np.pi * np.cumsum(f) / SR)
def saw(freq, t): return 2 * ((freq * t) % 1) - 1
def note(n): return 440 * 2 ** ((n - 69) / 12)
def reverb(x, dur=2.2, mix=.25, bright=6000):
    n = int(dur * SR); ir = noise(n) * env_exp(n, dur / 5); ir = lp(ir, bright); ir /= np.sqrt(np.sum(ir ** 2))
    wet = fftconvolve(x, ir)[: len(x)]
    return x * (1 - mix) + wet * mix
def stereo(x, width=0.0, pan=0.0):
    l = x * (1 - max(pan, 0)); r = x * (1 + min(pan, 0))
    if width:
        d = int(.012 * SR); r = np.concatenate([np.zeros(d), r[:-d]]) * (1 - width * .3) + r * width * .3
    return np.stack([l, r], 1)
def master(x, peak=.89):
    x = np.tanh(x * 1.2) / np.tanh(1.2)
    return x / (np.max(np.abs(x)) + 1e-9) * peak
def fade(x, a=.004, b=.02):
    n = len(x); fa, fb = int(a * SR), int(b * SR)
    e = np.ones(n); e[:fa] = np.linspace(0, 1, fa); e[n - fb:] = np.linspace(1, 0, fb)
    return x * (e[:, None] if x.ndim == 2 else e)
def save(name, x, mono_to_stereo=True):
    if x.ndim == 1: x = stereo(x)
    x = fade(master(x))
    wavfile.write(os.path.join(OUT, name), SR, (x * 32767).astype(np.int16))

# ---------- building blocks ----------
def impact(d=3.0, f0=110, f1=32):
    n = int(d * SR); body = sweep(f0, f1, d) * env_exp(n, .55)
    sub = np.sin(2 * np.pi * 38 * t_(d)) * env_exp(n, 1.1) * .6
    crack = lp(noise(n), 3500) * env_exp(n, .05) * .9
    tail = lp(noise(n), 900) * env_exp(n, .7) * .25
    return reverb(np.tanh((body + sub + crack + tail) * 1.8), 3, .3, 3000)
def blip(f, d=.09, tau=.03, wave="sine"):
    t = t_(d); x = np.sin(2 * np.pi * f * t) if wave == "sine" else np.sign(np.sin(2 * np.pi * f * t)) * .5
    return x * env_exp(len(t), tau)
def chime(f, d=1.4, tau=.45):
    t = t_(d); x = sum(np.sin(2 * np.pi * f * m * t) * a for m, a in [(1, 1), (2.01, .4), (3.02, .18), (4.1, .08)])
    return x * env_exp(len(t), tau) * np.minimum(1, t / .004)
def place(buf, x, at):
    i = int(at * SR); j = min(len(buf), i + len(x)); buf[i:j] += x[: j - i]; return buf
def riser(d=2.0, f0=300, f1=6000):
    n = int(d * SR); x = noise(n); out = np.zeros(n); seg = 2048
    for s in range(0, n, seg):
        fr = f0 * (f1 / f0) ** (s / n); out[s:s + seg] = bp(x[s:s + seg], fr * .7, min(fr * 1.4, 20000))
    tone = sweep(80, 900, d) * .25
    return (out * 2.5 + tone) * np.linspace(0, 1, n) ** 2

# ---------- SFX ----------
S = "sfx/"
save(S + "hangout_sfx_01_bass_impact_deep.wav", impact(3.0))
x = np.zeros(int(1.8 * SR))
for i, nn in enumerate([57, 64, 69, 76, 81]): place(x, blip(note(nn), .25, .09) * .7, i * .09)
place(x, chime(note(88), 1.3, .4) * .35, .45)
x += lp(noise(len(x)), 9000) * np.sin(np.linspace(0, np.pi, len(x))) * .05
save(S + "hangout_sfx_02_digital_startup.wav", reverb(x, 1.6, .3))
c = hp(noise(int(.12 * SR)), 2500) * env_exp(int(.12 * SR), .008) * .6 + blip(2400, .12, .018) * .5
save(S + "hangout_sfx_03_ui_click_select.wav", c)
c2 = lp(noise(int(.1 * SR)), 4000) * env_exp(int(.1 * SR), .006) * .5 + blip(1200, .1, .02) * .5
save(S + "hangout_sfx_04_ui_click_soft.wav", c2)
n = int(1.1 * SR); wn = noise(n); wo = np.zeros(n); seg = 1024
for s in range(0, n, seg):
    fr = 400 * (5000 / 400) ** (np.sin(np.pi * s / n) * .9); wo[s:s + seg] = bp(wn[s:s + seg], fr * .6, fr * 1.6)
wo *= np.sin(np.linspace(0, np.pi, n)) ** 2
pan = np.linspace(-.8, .8, n)
save(S + "hangout_sfx_05_transition_whoosh.wav", np.stack([wo * (1 - np.maximum(pan, 0)), wo * (1 + np.minimum(pan, 0))], 1))
n = int(1.3 * SR); sw = lp(noise(n), 6000) * np.linspace(0, 1, n) ** 3 * .6
sh = sum(np.sin(2 * np.pi * note(nn) * t_(1.3)) for nn in [76, 81, 83]) * np.linspace(0, 1, n) ** 2 * .15
x = sw + sh; place(x, blip(1800, .08, .02) * .6, 1.18)
save(S + "hangout_sfx_06_screen_reveal.wav", reverb(x, 1.2, .25))
x = np.zeros(int(1.7 * SR))
for i in range(22): place(x, blip(note(72 + i * .9), .08, .02) * (.4 + .6 * i / 22), i * .055)
place(x, chime(note(96), 1.0, .3) * .4, 1.2)
save(S + "hangout_sfx_07_xp_accumulate.wav", reverb(x, 1.2, .2))
x = np.zeros(int(2.4 * SR))
for i, nn in enumerate([72, 76, 79, 84]): place(x, (chime(note(nn), 1.6, .5) + saw(note(nn), t_(1.6)) * env_exp(int(1.6 * SR), .25) * .15) * .55, i * .11)
place(x, impact(1.5, 90, 40) * .45, 0)
place(x, chime(note(91), 1.8, .7) * .3, .44)
save(S + "hangout_sfx_08_level_up.wav", reverb(x, 2.2, .3))
x = np.zeros(int(1.5 * SR)); place(x, chime(note(79), 1.0, .3) * .6, 0); place(x, chime(note(84), 1.3, .45) * .7, .12)
x += hp(noise(len(x)), 7000) * env_exp(len(x), .25) * .08
save(S + "hangout_sfx_09_challenge_complete.wav", reverb(x, 1.4, .25))
x = np.zeros(int(2.4 * SR)); place(x, riser(.6, 600, 9000) * .35, 0)
for i, nn in enumerate([84, 88, 91, 96, 100]): place(x, chime(note(nn), 1.6, .55) * .4, .55 + i * .05)
place(x, impact(1.4, 70, 35) * .35, .55)
save(S + "hangout_sfx_10_reward_unlocked.wav", reverb(x, 2.4, .32))
x = np.zeros(int(5.5 * SR)); place(x, riser(1.5, 200, 8000) * .5, 0); place(x, impact(4.0, 120, 30), 1.5)
for nn in [57, 64, 69, 76]: place(x, chime(note(nn), 3.5, 1.3) * .18, 1.5)
save(S + "hangout_sfx_11_logo_reveal_impact.wav", reverb(x, 3.5, .3))
save(S + "hangout_sfx_12_riser_tension_3s.wav", riser(3.0, 150, 9000))
x = blip(note(81), .5, .12) * .6 + lp(noise(int(.5 * SR)), 2000) * env_exp(int(.5 * SR), .03) * .3 + np.sin(2 * np.pi * 55 * t_(.5)) * env_exp(int(.5 * SR), .15) * .6
save(S + "hangout_sfx_13_digital_pulse.wav", reverb(x, 1.2, .3))

# ---------- MUSIC BED (45 s, 120 BPM, A minor: Am F C G) ----------
D = 45.0; N = int(D * SR); BEAT = .5; BAR = 2.0
L = np.zeros((N, 2))
def add(x, at, pan=0.0, width=0.0):
    st = stereo(x, width, pan) if x.ndim == 1 else x; i = int(at * SR); j = min(N, i + len(st)); L[i:j] += st[: j - i]
CH = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # Am F C G
ROOT = [45, 41, 48, 43]
def chord_at(t): return int((t - 5) // BAR) % 4 if t >= 5 else 0
def kick():
    d = .45; n = int(d * SR); f = 50 + 110 * env_exp(n, .03); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(n, .16)
    return np.tanh(x * 2) * .9 + lp(noise(n), 5000) * env_exp(n, .004) * .3
KICK = kick()
def hat(open_=False): n = int((.18 if open_ else .05) * SR); return hp(noise(n), 7000) * env_exp(n, .06 if open_ else .012) * .25
HAT, OHAT = hat(), hat(True)
def clap():
    n = int(.3 * SR); x = np.zeros(n)
    for k, o in enumerate([0, .012, .024]): place(x, bp(noise(int(.2 * SR)), 900, 3200) * env_exp(int(.2 * SR), .05 if k == 2 else .01), o)
    return x * .6
CLAP = clap()
# teaser 0-5: drone, pulses, riser
dr = (np.sin(2 * np.pi * note(33) * t_(5.2)) * .5 + saw(note(40), t_(5.2)) * .12)
dr = lp(dr, 600) * np.minimum(1, t_(5.2) / 1.5)
add(dr, 0, width=.5)
add(impact(3.0) * .9, 0)
for k in range(8): add(blip(note(81), .4, .1) * .18 + np.sin(2 * np.pi * 55 * t_(.4)) * env_exp(int(.4 * SR), .12) * .35, .6 + k * .5, pan=(-.4 if k % 2 else .4))
add(riser(2.4, 200, 9000) * .32, 2.6, width=.6)
# hits
for at, scale in [(5.0, 1.0), (27.0, .8), (41.0, 1.1)]: add(impact(3.5) * scale, at)
# drums
for b in range(int(5 / BEAT), int(41 / BEAT)):
    t = b * BEAT
    if 36 <= t < 40 and (b % 2): pass
    add(KICK * (.8 if t < 11 else 1), t)
    if t >= 11 and b % 2 == 1: add(CLAP * (1.1 if t >= 27 else .8), t, width=.4)
    if t >= 11: add(HAT, t + BEAT / 2, pan=.3);
    if t >= 19: add(HAT * .7, t + BEAT / 4, pan=-.3); add(HAT * .7, t + 3 * BEAT / 4, pan=-.3)
    if t >= 27 and b % 4 == 3: add(OHAT, t + BEAT / 2, pan=.2)
for k in range(16): add(CLAP * (.25 + .05 * k), 25 + k * .125, width=.3)  # snare build 25-27
add(riser(2.0, 300, 9000) * .3, 25, width=.6)
add(riser(1.0, 300, 9000) * .3, 40, width=.6)
# bass (8th notes, ducked by kick)
for e in range(int(5 / .25), int(41 / .25)):
    t = e * .25; r = ROOT[chord_at(t)]; d = .24; tt = t_(d)
    x = lp(saw(note(r), tt) + saw(note(r) * 1.005, tt), 300 + (600 if t >= 27 else 250)) * env_exp(len(tt), .12)
    x *= (.45 if e % 2 == 0 else .75)
    add(x * .5, t)
# pads
padbus = np.zeros(N)
for bar in range(int(5 / BAR), int(41 / BAR)):
    t0 = bar * BAR; ch = CH[chord_at(t0)]; tt = t_(BAR + .3)
    x = sum(saw(note(n) * dt, tt) for n in ch for dt in (1, 1.004, .996)) / 9
    x = lp(x, 1400 if t0 < 27 else 2600) * np.minimum(1, tt / .25) * np.exp(-np.maximum(0, tt - BAR) / .1)
    place(padbus, x * (.35 if t0 < 36 else .28), t0)
padbus = reverb(padbus, 2.5, .35)
L[:, 0] += padbus; L[:, 1] += np.concatenate([np.zeros(500), padbus[:-500]])
# arp 16ths from 11 s
arpbus = np.zeros(N)
for s in range(int(11 / .125), int(41 / .125)):
    t = s * .125; ch = CH[chord_at(t)]; nn = (ch + [ch[0] + 12])[s % 4] + 12
    prog = (t - 11) / 30; cut = 900 + 4200 * min(1, prog * 1.4) if t < 36 else 2200
    tt = t_(.12); x = lp(saw(note(nn), tt), cut) * env_exp(len(tt), .05)
    place(arpbus, x * .22, t)
arpbus = reverb(arpbus, 1.6, .3)
L[:, 0] += arpbus * .9; L[:, 1] += np.concatenate([np.zeros(3600), arpbus[:-3600]]) * .9
# lead 27-36 (supersaw melody)
MEL = [(76, 1), (79, .5), (81, .5), (84, 1), (83, .5), (81, .5), (79, 1.5), (76, .5), (77, 1), (79, .5), (81, .5), (79, 1), (76, 1), (74, 1), (76, 1), (72, .5), (74, .5), (76, 1)]
t = 27.0; lead = np.zeros(N)
for nn, beats in MEL:
    d = beats * BEAT
    if t + d > 36: break
    tt = t_(d); x = sum(saw(note(nn) * dt, tt) for dt in (1, 1.006, .994, 1.012, .988)) / 5
    x = lp(x, 3800) * np.minimum(1, tt / .01) * np.exp(-np.maximum(0, tt - d + .06) / .03)
    place(lead, x * .28, t); t += d
lead = reverb(lead, 2.0, .3)
add(lead, 0, width=.6)
# ending: resolve chord 41-45 (A major lift)
tt = t_(4.0)
fin = sum(saw(note(n) * dt, tt) for n in [45, 57, 61, 64, 69] for dt in (1, 1.004)) / 10
fin = lp(fin, 2200) * env_exp(len(tt), 1.2)
add(reverb(fin, 3, .4) * .7, 41.0, width=.6)
for nn in [69, 76, 81]: add(chime(note(nn), 3.5, 1.2) * .12, 41.2)
# section dynamics: quiet teaser, drop, build, climax, montage, final hit
pts = [(0, .42), (4.9, .5), (5.0, .8), (11, .82), (19, .86), (27, 1.0), (36, 1.0), (36.2, .82), (40.9, .85), (41.0, 1.0), (45, 1.0)]
dyn = np.interp(np.arange(N) / SR, [p[0] for p in pts], [p[1] for p in pts])
L *= dyn[:, None]
# final fade to clean silence by 45 s
fe = np.ones(N); fs = int(43.8 * SR); fe[fs:] = np.linspace(1, 0, N - fs)
L *= fe[:, None]
wavfile.write(os.path.join(OUT, "music", "hangout_music_bed_45s_120bpm.wav"), SR, (master(L, .89) * 32767).astype(np.int16))
print("done")
