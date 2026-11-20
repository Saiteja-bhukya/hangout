// toli film — score and sound effects, synthesised from code (no samples), deterministic.
// Writes assets/audio/music.wav, assets/audio/sfx.wav (48 kHz stereo float stems).
// Then tools/master-audio.sh mixes (SFX ~8 dB under music), masters to -14 LUFS / -1 dBTP and fades the last 0.4 s.
// 120 BPM, D major (D–Bm–G–A, one bar each, 2 s per bar), a dhol groove and a shehnai-style lead. Bars start at 0.5 + 2k so the drop (12.5 s) lands on D.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SR = 48000, DUR = 60, N = SR * DUR;
const TAU = Math.PI * 2;

// ---------------------------------------------------------------- buffers & utils
const bus = () => ({ L: new Float32Array(N), R: new Float32Array(N) });
const music = bus(), sfx = bus(), send = bus(); // send = reverb bus (music + chimes)
let seed = 20261122;
const rnd = () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const noise = () => rnd() * 2 - 1;
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const idx = (t) => Math.round(t * SR);
function put(b, i, l, r, pan = 0) { if (i < 0 || i >= N) return; const gl = Math.cos((pan + 1) * Math.PI / 4), gr = Math.sin((pan + 1) * Math.PI / 4); b.L[i] += l * gl * 1.4142; b.R[i] += r * gr * 1.4142; }

// RBJ biquad, coefficients refreshed by caller
class Biquad {
  constructor() { this.x1 = this.x2 = this.y1 = this.y2 = 0; this.set('lp', 1000, 0.707); }
  set(type, f, q) {
    f = clamp(f, 20, SR * 0.45); const w = TAU * f / SR, c = Math.cos(w), s = Math.sin(w), a = s / (2 * q);
    let b0, b1, b2; const a0 = 1 + a, a1 = -2 * c, a2 = 1 - a;
    if (type === 'lp') { b0 = (1 - c) / 2; b1 = 1 - c; b2 = (1 - c) / 2; }
    else if (type === 'hp') { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = (1 + c) / 2; }
    else { b0 = a; b1 = 0; b2 = -a; } // bp (0 dB peak)
    this.b0 = b0 / a0; this.b1 = b1 / a0; this.b2 = b2 / a0; this.a1 = a1 / a0; this.a2 = a2 / a0;
  }
  run(x) { const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2; this.x2 = this.x1; this.x1 = x; this.y2 = this.y1; this.y1 = y; return y; }
}
const saw = (ph) => 2 * (ph - Math.floor(ph + 0.5));
const sq = (ph, pw = 0.5) => ((ph - Math.floor(ph)) < pw ? 1 : -1);

// ---------------------------------------------------------------- musical grid
const BAR0 = 0.5, BAR = 2, BEAT = 0.5;
const CH = [ // D, Bm, G, A  (MIDI)
  { root: 38, tones: [62, 66, 69], name: 'D' },
  { root: 35, tones: [59, 62, 66], name: 'Bm' },
  { root: 43, tones: [55, 59, 62], name: 'G' },
  { root: 45, tones: [57, 61, 64], name: 'A' },
];
const barIndex = (t) => Math.floor((t - BAR0) / BAR);
const chordAt = (t) => CH[((barIndex(t) % 4) + 4) % 4];
const beatsIn = (a, b, step = BEAT, off = 0) => { const out = []; for (let k = Math.ceil((a - off) / step - 1e-9); k * step + off < b - 1e-9; k++) out.push(+(k * step + off).toFixed(6)); return out; };

// ---------------------------------------------------------------- instruments (music)
function kick(t, g = 1, f0 = 150, f1 = 46, dec = 0.32) {
  const n = idx(0.45); let ph = 0;
  for (let i = 0; i < n; i++) { const tt = i / SR; const f = f1 + (f0 - f1) * Math.exp(-tt / 0.035); ph += f / SR;
    const env = Math.exp(-tt / dec) * (tt < 0.002 ? tt / 0.002 : 1); const click = tt < 0.004 ? noise() * (1 - tt / 0.004) * 0.25 : 0;
    const v = (Math.sin(TAU * ph) * env + click) * g; put(music, idx(t) + i, v, v); }
}
function heartbeat(t, g = 0.5) { kick(t, g, 90, 40, 0.12); kick(t + 0.17, g * 0.7, 80, 38, 0.1); }
function hat(t, g = 0.12, dec = 0.03, pan = 0.15) {
  const hp = new Biquad(); hp.set('hp', 7000, 0.7); const n = idx(dec * 5);
  for (let i = 0; i < n; i++) { const tt = i / SR; const v = hp.run(noise()) * Math.exp(-tt / dec) * g; put(music, idx(t) + i, v, v, pan); }
}
function clap(t, g = 0.35) {
  const bp = new Biquad(); bp.set('bp', 1300, 1.2); const n = idx(0.25);
  for (let i = 0; i < n; i++) { const tt = i / SR; let e = 0; for (const o of [0, 0.011, 0.022]) if (tt >= o) e = Math.max(e, Math.exp(-(tt - o) / (o === 0.022 ? 0.09 : 0.008)));
    const v = bp.run(noise()) * e * g * 2.2; put(music, idx(t) + i, v * 0.9, v, 0); put(send, idx(t) + i, v * 0.4, v * 0.4); }
}
function snare(t, g = 0.3) {
  const bp = new Biquad(); bp.set('bp', 1900, 0.8); const n = idx(0.2); let ph = 0;
  for (let i = 0; i < n; i++) { const tt = i / SR; ph += 190 / SR; const v = (bp.run(noise()) * 1.6 * Math.exp(-tt / 0.07) + Math.sin(TAU * ph) * 0.5 * Math.exp(-tt / 0.05)) * g; put(music, idx(t) + i, v, v); }
}
function impact(t, g = 1, b = music) { // sub boom + crash
  const n = idx(2.4); let ph = 0; const lp = new Biquad(); lp.set('lp', 5000, 0.7);
  for (let i = 0; i < n; i++) { const tt = i / SR; const f = 36 + 60 * Math.exp(-tt / 0.08); ph += f / SR;
    const sub = Math.sin(TAU * ph) * Math.exp(-tt / 0.9) * 0.9; const cr = lp.run(noise()) * Math.exp(-tt / 0.55) * 0.35;
    put(b, idx(t) + i, (sub + cr) * g, (sub + cr * 0.9) * g); put(send, idx(t) + i, cr * g * 0.5, cr * g * 0.5); }
}
// sustained detuned-saw voice with a lowpass and a per-sample gain function
function padNote(t0, t1, midi, opts = {}) {
  const { g = 0.06, cut = 1300, att = 0.25, rel = 0.5, pump = null, detune = [-0.11, 0, 0.12], pan = 0, wave = 'saw', cutFn = null } = opts;
  const n = idx(t1 - t0 + rel); const lp = new Biquad(), lp2 = new Biquad(); const ph = detune.map(() => rnd());
  for (let i = 0; i < n; i++) {
    const tt = i / SR, T = t0 + tt; if (i % 64 === 0) { const c = cutFn ? cutFn(T) : cut; lp.set('lp', c, 0.6); lp2.set('lp', c * 1.2, 0.6); }
    let x = 0; for (let k = 0; k < detune.length; k++) { ph[k] += mtof(midi + detune[k]) / SR; x += wave === 'saw' ? saw(ph[k]) : wave === 'sq' ? sq(ph[k]) : Math.sin(TAU * ph[k]); }
    x /= detune.length;
    const env = Math.min(1, tt / att) * (T > t1 ? Math.exp(-(T - t1) / (rel / 3)) : 1);
    const v = lp2.run(lp.run(x)) * env * g * (pump ? pump(T) : 1);
    put(music, idx(t0) + i, v, v, pan); if (opts.wet) put(send, idx(t0) + i, v * opts.wet, v * opts.wet);
  }
}
function pluck(t, midi, g = 0.08, dec = 0.18, cut = 3000, pan = 0, wave = 'saw', wet = 0.15) {
  const n = idx(dec * 5); const lp = new Biquad(); let ph = rnd();
  for (let i = 0; i < n; i++) { const tt = i / SR; if (i % 64 === 0) lp.set('lp', cut * (0.35 + 0.65 * Math.exp(-tt / (dec * 0.8))), 0.9);
    ph += mtof(midi) / SR; const x = wave === 'saw' ? saw(ph) : sq(ph, 0.3); const v = lp.run(x) * Math.exp(-tt / dec) * g * Math.min(1, tt / 0.002);
    put(music, idx(t) + i, v, v, pan); put(send, idx(t) + i, v * wet, v * wet); }
}
function bell(t, freq, g = 0.12, dec = 1.2, b = music, pan = 0, wet = 0.35) {
  const parts = [[1, 1], [2.756, 0.35], [5.404, 0.18], [8.933, 0.08]]; const n = idx(dec * 4);
  for (let i = 0; i < n; i++) { const tt = i / SR; let v = 0; for (const [r, a] of parts) v += Math.sin(TAU * freq * r * tt) * a * Math.exp(-tt * (1 + r * 0.5) / dec);
    v *= g * Math.min(1, tt / 0.002); put(b, idx(t) + i, v, v, pan); put(send, idx(t) + i, v * wet, v * wet); }
}
function noiseSweep(t0, t1, f0, f1, g0, g1, b = music, opts = {}) { // filtered-noise riser/whoosh, gain & centre exponential
  const n = idx(t1 - t0); const bp = new Biquad(), bp2 = new Biquad();
  for (let i = 0; i < n; i++) { const x = i / n; if (i % 32 === 0) { const f = f0 * Math.pow(f1 / f0, opts.curve ? opts.curve(x) : x); bp.set('bp', f, opts.q || 2); bp2.set('bp', f * 1.01, opts.q || 2); }
    const gg = opts.gainFn ? opts.gainFn(x) : g0 + (g1 - g0) * x * x; const nn = noise();
    const pan = opts.pan ? opts.pan(x) : 0; const v = bp2.run(bp.run(nn)) * gg * 3;
    put(b, idx(t0) + i, v, v, pan); }
}
function reverseSwell(t0, t1, g = 0.3) { // a reversed-sounding swell: noise + chord, exponential rise, hard stop
  const n = idx(t1 - t0); const lp = new Biquad(); const tones = [57, 60, 64, 69]; const ph = tones.map(() => 0);
  for (let i = 0; i < n; i++) { const x = i / n; if (i % 64 === 0) lp.set('lp', 400 + 6000 * x * x, 0.8);
    let s = 0; for (let k = 0; k < tones.length; k++) { ph[k] += mtof(tones[k]) / SR; s += saw(ph[k]); }
    const v = lp.run(s * 0.25 + noise() * 0.6) * Math.pow(x, 3) * g; put(music, idx(t0) + i, v, v); }
}


// ---------------------------------------------------------------- toli instruments
function dagga(t, g = 0.8, b = music) { // dhol bass side: a slack membrane with a falling pitch
  const n = idx(0.55); let ph = 0;
  for (let i = 0; i < n; i++) { const tt = i / SR; const f = 62 + 95 * Math.exp(-tt / 0.028); ph += f / SR;
    const v = (Math.sin(TAU * ph) * Math.exp(-tt / 0.2) + (tt < 0.005 ? noise() * 0.35 * (1 - tt / 0.005) : 0)) * g; put(b, idx(t) + i, v, v, -0.05); }
}
function tihli(t, g = 0.3, pan = 0.22) { // dhol treble side: a dry slap
  const bp = new Biquad(); bp.set('bp', 2900, 1.3); const n = idx(0.14); let ph = 0;
  for (let i = 0; i < n; i++) { const tt = i / SR; ph += 540 / SR; const v = (bp.run(noise()) * 1.8 * Math.exp(-tt / 0.035) + Math.sin(TAU * ph) * 0.35 * Math.exp(-tt / 0.025)) * g; put(music, idx(t) + i, v, v, pan); }
}
function marimba(t, midi, g = 0.12, pan = 0, b = music) {
  const f = mtof(midi), n = idx(0.9);
  for (let i = 0; i < n; i++) { const tt = i / SR; const v = (Math.sin(TAU * f * tt) * Math.exp(-tt / 0.32) + 0.35 * Math.sin(TAU * f * 3.93 * tt) * Math.exp(-tt / 0.05)) * g * Math.min(1, tt / 0.002);
    put(b, idx(t) + i, v, v, pan); put(send, idx(t) + i, v * 0.18, v * 0.18); }
}
function shehnai(t0, t1, midi, from = null, g = 0.05, pan = 0) { // reedy lead with a glide in and a late vibrato
  const n = idx(t1 - t0 + 0.12); const bp = new Biquad(); bp.set('bp', 1700, 0.8); const lp = new Biquad(); lp.set('lp', 5200, 0.7); let ph = rnd();
  for (let i = 0; i < n; i++) { const tt = i / SR, T = t0 + tt;
    let m = midi; if (from != null && tt < 0.07) m = from + (midi - from) * (tt / 0.07);
    m += tt > 0.14 ? 0.22 * Math.sin(TAU * 5.6 * (tt - 0.14)) * Math.min(1, (tt - 0.14) / 0.2) : 0;
    ph += mtof(m) / SR; const x = sq(ph, 0.18) * 0.6 + saw(ph) * 0.4;
    const env = Math.min(1, tt / 0.025) * (T > t1 ? Math.exp(-(T - t1) / 0.04) : 1);
    const v = lp.run(bp.run(x) * 1.6 + x * 0.25) * env * g; put(music, idx(t0) + i, v, v, pan); put(send, idx(t0) + i, v * 0.3, v * 0.3); }
}
const strings = (t0, t1, midi, g = 0.04, pan = 0) => padNote(t0, t1, midi, { g, cut: 2600, att: 0.35, rel: 0.6, detune: [-0.14, -0.05, 0.05, 0.14], pan, wet: 0.5 });
function slideDown(t0, dur, f0, f1, g = 0.12, b = music) { let ph = 0; const n = idx(dur);
  for (let i = 0; i < n; i++) { const x = i / n; ph += f0 * Math.pow(f1 / f0, x) / SR; const v = Math.sin(TAU * ph) * g * Math.sin(Math.PI * Math.min(1, x * 1.2)) ; put(b, idx(t0) + i, v, v); } }
function dholBar(t0, t1, g = 1) { // bhangra chaal, in eighths: D . t D t . D t
  const pat = [['D', 0], ['t', 0.5], ['D', 0.75], ['t', 1.0], ['D', 1.5], ['t', 1.75]];
  for (let b = t0; b < t1 - 1e-6; b += BAR) for (const [k, o] of pat) { const t = b + o * BEAT * 2 / 2; if (t >= t1) continue;
    if (k === 'D') dagga(t, 0.75 * g); else tihli(t, 0.3 * g, o % 1 ? 0.3 : -0.2); }
}
function rollTihli(a, b) { [...beatsIn(a, a + 1, 0.125), ...beatsIn(a + 1, a + 1.5, 0.0625), ...beatsIn(a + 1.5, b, 0.03125)].forEach((t) => tihli(t, 0.1 + 0.3 * (t - a) / (b - a), (t * 7) % 2 > 1 ? 0.3 : -0.3)); }

// ---------------------------------------------------------------- SCORE
const kickTimes = [...beatsIn(12.5, 46), ...beatsIn(46, 51, 1.0, 0.5), ...beatsIn(51, 55.5)];
const lastKickBefore = (T) => { let lo = 0, hi = kickTimes.length - 1, r = -1; while (lo <= hi) { const m = (lo + hi) >> 1; if (kickTimes[m] <= T) { r = kickTimes[m]; lo = m + 1; } else hi = m - 1; } return r; };
const pump = (T) => { const k = lastKickBefore(T); if (k < 0) return 1; return 0.3 + 0.7 * (1 - Math.exp(-(T - k) / 0.11)); };

// 0–4 OPEN: a marimba note for every "we should hang out"; a low hit as the chatter falls back; a bell on "Ever."
const OPEN = [0.0, 0.85, 1.22, 1.52, 1.76, 1.95, 2.1, 2.22, 2.32];
OPEN.forEach((t, k) => marimba(t + 0.02, [62, 64, 66, 69, 71, 74, 76, 78, 81][k], 0.11, (k % 3 - 1) * 0.35));
padNote(0.0, 2.45, 50, { g: 0.035, cut: 500, att: 0.6, rel: 0.1, wave: 'sine', detune: [-0.05, 0.05] });
dagga(2.5, 0.7); padNote(2.5, 3.95, 38, { g: 0.06, cut: 300, att: 0.05, rel: 0.1, detune: [-0.04, 0.04] });
[2.62, 2.73, 2.84, 2.95].forEach((t) => marimba(t, 62 + 12, 0.05));
bell(3.08, mtof(86), 0.09, 1.0, music, 0, 0.5); dagga(3.08, 0.55);

// 4–8.2 POSSIBILITIES: 8th-note pulse, a pop on every object, three hits on the headline, a riser, then everything falls
beatsIn(4.0, 7.55).forEach((t) => kick(t, 0.45, 120, 48, 0.2));
beatsIn(4.0, 7.55, 0.25).forEach((t) => padNote(t, t + 0.2, 38, { g: 0.07, cut: 340, att: 0.005, rel: 0.03, detune: [-0.05, 0.05] }));
[4.02, 4.38, 4.72, 5.04, 5.34, 5.62, 5.88].forEach((t, k) => { marimba(t + 0.02, [74, 76, 78, 81, 83, 86, 88][k], 0.12, k % 2 ? 0.3 : -0.3); tihli(t + 0.02, 0.18); });
[6.36, 6.52, 6.72].forEach((t, k) => { dagga(t, 0.8); marimba(t, [66, 69, 74][k], 0.1); });
padNote(6.36, 7.5, 62, { g: 0.03, cut: 1800, att: 0.05, rel: 0.05 }); padNote(6.36, 7.5, 66, { g: 0.03, cut: 1800, att: 0.05, rel: 0.05 }); padNote(6.36, 7.5, 69, { g: 0.03, cut: 1800, att: 0.05, rel: 0.05 });
noiseSweep(6.8, 7.55, 500, 6000, 0, 0.16, music, { q: 1.5 });
slideDown(7.58, 0.55, 1100, 110, 0.14);

// 8.2–12.0 PLANS DIE: cold B-minor drone, a ticking clock, a heartbeat, then near silence and a reversed swell into the drop
padNote(8.2, 11.8, 47, { g: 0.05, cut: 500, att: 0.4, rel: 0.05, wave: 'sine', detune: [-0.04, 0.05] });
padNote(8.2, 11.8, 66, { g: 0.014, cut: 1800, att: 1.0, rel: 0.05, wave: 'sine', detune: [-0.1, 0.1], wet: 0.6 });
beatsIn(8.25, 11.85, 0.25).forEach((t, k) => hat(t, k % 2 ? 0.045 : 0.07, 0.016, k % 2 ? 0.3 : -0.3));
[10.0, 11.0].forEach((t) => heartbeat(t, 0.5));
reverseSwell(12.0, 12.5, 0.3);

// 12.5 DROP → 46: kick, dhol, pumped pad, bass
impact(12.5, 1.0);
beatsIn(12.5, 46).forEach((t) => kick(t, 0.8));
dholBar(12.5, 33.0, 1.0); dholBar(35.0, 46.0, 1.1);
for (let b = 6; ; b++) { const t0 = BAR0 + b * BAR; if (t0 >= 46) break; const c = chordAt(t0 + 0.01);
  const cutFn = (T) => (T < 15 ? 1000 : T < 35 ? 1400 : 1900);
  c.tones.forEach((m, k) => padNote(t0, t0 + BAR - 0.02, m, { g: 0.04, cutFn, att: 0.03, rel: 0.06, pump, pan: [-0.35, 0, 0.35][k], wet: 0.2 }));
  beatsIn(t0, Math.min(t0 + BAR, 46), 0.25).forEach((t) => padNote(t, t + 0.2, c.root + 12, { g: 0.085, cut: 420, att: 0.005, rel: 0.04, pump, detune: [-0.05, 0.05] })); }
// 15: claps on 2 & 4, shaker sixteenths
beatsIn(15, 46, BAR, BAR0 + 0.5).forEach((t) => clap(t)); beatsIn(15, 46, BAR, BAR0 + 1.5).forEach((t) => clap(t));
beatsIn(15, 46, 0.125).forEach((t, k) => hat(t, k % 2 ? 0.04 : 0.07, 0.02, k % 2 ? 0.25 : -0.25));
// 19: marimba arpeggio, opening up
beatsIn(19, 46, 0.125).forEach((t, k) => { const c = chordAt(t + 0.001); const seq = [c.tones[0], c.tones[1], c.tones[2], c.tones[0] + 12, c.tones[2], c.tones[1] + 12, c.tones[2] + 12, c.tones[1]];
  marimba(t, seq[k % 8] + (t > 35 ? 12 : 0), 0.03 + 0.03 * Math.min(1, (t - 19) / 14), k % 2 ? 0.35 : -0.35); });
// 33–35: dhol roll + riser; 35: the peak lands
rollTihli(33.0, 35.0); noiseSweep(33.0, 35.0, 500, 9000, 0, 0.22, music, { q: 1.6 });
impact(35.0, 0.7);
// 35–46: shehnai lead (D major pentatonic) over strings
const E = 0.25;
const PA = [[69, 2], [69, 1], [71, 1], [69, 2], [66, 2], [64, 1], [66, 1], [69, 2], [71, 1], [69, 1], [66, 2]];
const PB = [[74, 2], [74, 1], [76, 1], [74, 2], [71, 2], [69, 1], [71, 1], [74, 2], [76, 1], [78, 1], [74, 2]];
const PC = [[78, 2], [76, 1], [74, 1], [76, 2], [71, 2], [69, 1], [66, 1], [69, 2], [64, 2], [62, 2]];
function play(phrases, t, tEnd, oct = 12, g = 0.05) { let prev = null; for (const ph of phrases) for (const [m, d] of ph) { if (t >= tEnd - 0.01) return t;
  const dur = Math.min(d * E * 0.94, tEnd - t); shehnai(t, t + dur, m + oct, prev, g, 0.05); prev = m + oct; t += d * E; } return t; }
play([PA, PB, PC], 35.0, 46.0);
for (let b = 17; b < 23; b++) { const t0 = BAR0 + b * BAR; const c = chordAt(t0 + 0.01); const a = Math.max(t0, 35), z = Math.min(t0 + BAR, 46); if (z <= a) continue;
  c.tones.forEach((m, k) => strings(a, z - 0.02, m - 12, 0.022, [-0.4, 0, 0.4][k])); }
// 46–51: warm half-time breakdown with chimes (the crew chat comes alive)
impact(46.0, 0.3);
beatsIn(46, 51, 1.0, 0.5).forEach((t) => kick(t, 0.65, 120, 44, 0.4));
beatsIn(46, 51, 2.0, 1.5).forEach((t) => { clap(t, 0.2); dagga(t, 0.5); });
for (let b = 22; b < 26; b++) { const t0 = BAR0 + b * BAR; const a = Math.max(t0, 46), z = Math.min(t0 + BAR, 50.98); if (z <= a) continue; const c = chordAt(t0 + 0.01);
  c.tones.forEach((m, k) => padNote(a, z, m, { g: 0.045, cut: 900, att: 0.2, rel: 0.2, pan: [-0.3, 0, 0.3][k], wet: 0.45 }));
  padNote(a, z, c.root + 12, { g: 0.055, cut: 300, att: 0.1, rel: 0.1, detune: [0] });
  [0, 0.75, 1.0, 1.5].forEach((o, k) => { const t = t0 + o; if (t >= 46 && t < 50.9) bell(t, mtof(c.tones[(k + b) % 3] + 24), 0.045, 1.0, music, k % 2 ? 0.4 : -0.4, 0.5); }); }
// 51–55.5: the finale — everything at once: dhol, strings, lead reprise, bells
impact(51.0, 0.8);
beatsIn(51, 55.5).forEach((t) => kick(t, 0.85));
dholBar(50.5, 55.5, 1.2); beatsIn(51, 55.5, 0.125).forEach((t, k) => hat(t, k % 2 ? 0.05 : 0.08, 0.02, k % 2 ? 0.25 : -0.25));
for (let b = 25; b < 28; b++) { const t0 = BAR0 + b * BAR; const a = Math.max(t0, 51), z = Math.min(t0 + BAR, 55.48); if (z <= a) continue; const c = chordAt(t0 + 0.01);
  c.tones.forEach((m, k) => { strings(a, z, m, 0.03, [-0.4, 0, 0.4][k]); strings(a, z, m - 12, 0.022, [0.3, -0.3, 0][k]); });
  beatsIn(a, z, 0.25).forEach((t) => padNote(t, t + 0.2, c.root + 12, { g: 0.09, cut: 420, att: 0.005, rel: 0.04, pump, detune: [-0.05, 0.05] })); }
play([PB, PA], 51.0, 55.4, 12, 0.055);
// 55.5: the final hit and a long D-major chord with bells; dhol signs off
impact(55.5, 1.0); [55.5, 55.75, 56.0].forEach((t, k) => dagga(t, [0.7, 0.7, 1.0][k]));
[38, 50, 57, 62, 66, 69, 74].forEach((m, k) => strings(55.5, 59.0, m, k < 2 ? 0.05 : 0.032, [0, 0, -0.4, 0.4, -0.2, 0.2, 0][k]));
[[55.55, 86], [55.8, 90], [56.05, 93], [56.4, 98]].forEach(([t, m], k) => bell(t, mtof(m), 0.06, 2.0, music, (k - 1.5) * 0.25, 0.6));

// ---------------------------------------------------------------- SFX (placed one frame after the picture)
const F = 1 / 30;
const pop = (t, k = 0) => { const n = idx(0.07); let ph = 0; for (let i = 0; i < n; i++) { const tt = i / SR; ph += (380 + 900 * (tt / 0.07) + k * 25) / SR; const v = Math.sin(TAU * ph) * Math.exp(-tt / 0.025) * 0.26; put(sfx, idx(t + F) + i, v, v, (k % 3 - 1) * 0.3); } };
const msgPop = (t, k = 0) => { const a = [880, 990, 932][k % 3]; for (const [o, f] of [[0, a], [0.045, a * 1.5]]) { const n = idx(0.09); for (let i = 0; i < n; i++) { const tt = i / SR; const v = Math.sin(TAU * f * tt) * Math.exp(-tt / 0.03) * 0.22 * Math.min(1, tt / 0.002); put(sfx, idx(t + F + o) + i, v, v, 0.1); } } };
const click = (t, g = 0.16) => { const n = idx(0.03); for (let i = 0; i < n; i++) { const tt = i / SR; const v = (Math.sin(TAU * 3200 * tt) * Math.exp(-tt / 0.006) + (tt < 0.0015 ? noise() * 0.6 : 0)) * g; put(sfx, idx(t + F) + i, v, v); } };
const whoosh = (t, k = 0, pan = null) => { const v = [[0.42, 500, 3200], [0.34, 800, 4200], [0.5, 350, 2600]][k % 3]; const t0 = t - v[0] * 0.6 + F;
  noiseSweep(t0, t0 + v[0], v[1], v[2], 0, 0, sfx, { q: 1.1, curve: (x) => Math.sin(Math.PI * x * 0.5), gainFn: (x) => 0.2 * Math.sin(Math.PI * x) ** 2, pan: pan != null ? () => pan : (x) => (k % 2 ? 1 : -1) * (x - 0.5) * 0.8 }); };
const chime = (t) => { bell(t + F, mtof(86), 0.09, 0.9, sfx, -0.2, 0.3); bell(t + F + 0.07, mtof(93), 0.08, 0.9, sfx, 0.2, 0.3); }; // D6 + A6 (a fifth)
const coin = (t, k = 0) => { const fr = [3150, 4720, 6080].map((f) => f * (1 + (k % 3) * 0.04)); const n = idx(0.3); for (let i = 0; i < n; i++) { const tt = i / SR; let v = 0; fr.forEach((f, j) => { v += Math.sin(TAU * f * tt) * Math.exp(-tt / (0.12 - j * 0.03)) / (j + 1); }); put(sfx, idx(t + F) + i, v * 0.12, v * 0.12, (k % 2 ? 0.4 : -0.4)); } };
const thud = (t, g = 0.5) => { const n = idx(0.14); for (let i = 0; i < n; i++) { const tt = i / SR; const v = Math.sin(TAU * (70 + 60 * Math.exp(-tt / 0.02)) * tt) * Math.exp(-tt / 0.05) * g; put(sfx, idx(t + F) + i, v, v); } };
const tok = (t, k = 0) => { const f = [880, 990, 760, 1050][k % 4], n = idx(0.12); for (let i = 0; i < n; i++) { const tt = i / SR; const v = (Math.sin(TAU * f * tt) * Math.exp(-tt / 0.03) + Math.sin(TAU * f * 2.7 * tt) * 0.3 * Math.exp(-tt / 0.012)) * 0.2; put(sfx, idx(t + F) + i, v, v, (k % 3 - 1) * 0.4); } };
const logoHit = (t, rise) => { noiseSweep(t - rise, t, 600, 9000, 0, 0.0, sfx, { q: 1.5, gainFn: (x) => 0.2 * Math.pow(x, 2.2) }); impact(t + F, 0.55, sfx); bell(t + F, mtof(86), 0.07, 1.6, sfx, 0, 0.5); };
const bounceTicks = (t0, d) => [0.364, 0.727, 0.909, 0.98].forEach((f, k) => marimba(t0 + d * f + F, 81 + k * 2, 0.08 - k * 0.015, 0, sfx));

// open
OPEN.forEach((t, k) => pop(t, k)); whoosh(2.55, 2);
// possibilities
whoosh(6.17, 0); whoosh(7.7, 2); thud(8.0, 0.4);
// plans die
whoosh(8.25, 1); [8.45, 8.72, 8.98, 9.2, 9.4, 10.0].forEach((t, k) => msgPop(t, k)); whoosh(11.55, 2); thud(11.9, 0.55);
// reveal
whoosh(12.45, 0, -0.8); whoosh(12.45, 1, 0.8); whoosh(12.45, 2, 0); logoHit(12.5, 0.5); whoosh(13.15, 1); bounceTicks(13.3, 0.42);
// range
whoosh(15.05, 0); whoosh(17.4, 2);
// steps
[19.05, 22.68, 23.05, 23.2, 26.62, 27.04, 28.3, 30.7, 31.05, 33.0, 34.68].forEach((t, k) => whoosh(t, k));
[19.85, 20.15, 20.45, 23.85, 24.2, 29.0, 31.8, 33.45, 22.3].forEach((t) => click(t));
[21.7, 25.65, 29.85, 34.0].forEach(chime);
// rewards
whoosh(37.3, 0);
[[37.85, 0.45], [38.35, 0.45]].forEach(([t0, d], j) => { for (let k = 0; k < 9; k++) { const t = t0 + k * d / 9, f = 1400 + (j * 9 + k) * 70, n = idx(0.025); for (let i = 0; i < n; i++) { const tt = i / SR; const v = Math.sin(TAU * f * tt) * Math.exp(-tt / 0.008) * 0.12; put(sfx, idx(t + F) + i, v, v); } } });
[86, 90, 93, 98].forEach((m, k) => bell(39.15 + F + k * 0.07, mtof(m), 0.08, 0.8, sfx, (k - 1.5) * 0.2, 0.4));
whoosh(40.75, 1); click(41.55, 0.25); thud(41.55, 0.45); bell(41.6 + F, mtof(86), 0.07, 0.9, sfx, 0, 0.4); bell(41.67 + F, mtof(93), 0.06, 0.9, sfx, 0, 0.4);
whoosh(42.95, 2); click(43.85); [43.4, 43.55, 43.78, 44.0, 44.22, 44.5, 44.85].forEach((t, k) => coin(t, k)); whoosh(45.66, 0);
// payoff
whoosh(46.05, 1); [46.4, 46.7, 47.55, 48.25, 48.95].forEach((t, k) => msgPop(t, k));
// finale
thud(51.05, 0.5); [0, 1, 2, 3, 4, 5, 6, 7].forEach((k) => tok(51.3 + k * 0.12 + 0.5, k));
whoosh(55.3, 2); logoHit(55.55, 0.9); whoosh(55.9, 1); bounceTicks(56.05, 0.42); click(57.35, 0.22); bell(57.38 + F, mtof(93), 0.06, 1.2, sfx, 0, 0.4);

// ---------------------------------------------------------------- reverb (Schroeder) on the send bus → music
function reverb(src, mix = 0.28) {
  const combs = [1557, 1617, 1491, 1422, 1277, 1356].map((d) => Math.round(d * SR / 44100)), aps = [225, 556, 441].map((d) => Math.round(d * SR / 44100));
  for (const ch of ['L', 'R']) { const x = src[ch], out = new Float32Array(N); const spread = ch === 'R' ? 23 : 0;
    for (const d0 of combs) { const d = d0 + spread, buf = new Float32Array(d); let p = 0, lpz = 0; for (let i = 0; i < N; i++) { const y = buf[p]; lpz = y * 0.6 + lpz * 0.4; buf[p] = x[i] + lpz * 0.82; out[i] += y; p = (p + 1) % d; } }
    for (const d0 of aps) { const d = d0 + spread, buf = new Float32Array(d); let p = 0; for (let i = 0; i < N; i++) { const b = buf[p]; const y = -out[i] + b; buf[p] = out[i] + b * 0.5; out[i] = y; p = (p + 1) % d; } }
    for (let i = 0; i < N; i++) music[ch][i] += out[i] * mix / combs.length; }
}
reverb(send);

// keep the fall's cut and the black silence clean (no reverb tail bleeds there)
for (const ch of ['L', 'R']) { const b = music[ch];
  for (let i = idx(11.86); i < idx(12.0); i++) b[i] *= 0.06; }

// ---------------------------------------------------------------- write stems (32-bit float WAV)
function writeWav(file, b) {
  const data = Buffer.alloc(N * 8); for (let i = 0; i < N; i++) { data.writeFloatLE(Math.tanh(b.L[i] * 1.0), i * 8); data.writeFloatLE(Math.tanh(b.R[i] * 1.0), i * 8 + 4); }
  const h = Buffer.alloc(44); h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16);
  h.writeUInt16LE(3, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 8, 28); h.writeUInt16LE(8, 32); h.writeUInt16LE(32, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(file, Buffer.concat([h, data]));
}
fs.mkdirSync(path.join(root, 'assets/audio'), { recursive: true });
writeWav(path.join(root, 'assets/audio/music.wav'), music);
writeWav(path.join(root, 'assets/audio/sfx.wav'), sfx);
console.log('wrote assets/audio/music.wav and sfx.wav');
