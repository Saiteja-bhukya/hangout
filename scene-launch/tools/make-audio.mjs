// SCENE film — music and sound effects, synthesised from code (no samples), deterministic.
// Writes assets/audio/music.wav, assets/audio/sfx.wav (48 kHz stereo float stems).
// Then tools/master-audio.sh mixes (SFX ~8 dB under music), masters to -14 LUFS / -1 dBTP and fades the last 0.4 s.
// 120 BPM, A minor, Am–F–C–G one bar each (2 s per bar). Bars start at 0.5 + 2k so the drop (12.5 s) lands on Am.
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
const CH = [ // Am, F, C, G  (MIDI)
  { root: 45, tones: [57, 60, 64], name: 'Am' },
  { root: 41, tones: [53, 57, 60], name: 'F' },
  { root: 48, tones: [55, 60, 64], name: 'C' },
  { root: 43, tones: [55, 59, 62], name: 'G' },
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

// ---------------------------------------------------------------- SCORE
const kicksMain = beatsIn(12.5, 48);           // four on the floor
const kickTimes = [...kicksMain, ...beatsIn(48, 54, 1.0, 0.5)];
// sidechain pump: duck after every kick
const lastKickBefore = (T) => { let lo = 0, hi = kickTimes.length - 1, r = -1; while (lo <= hi) { const m = (lo + hi) >> 1; if (kickTimes[m] <= T) { r = kickTimes[m]; lo = m + 1; } else hi = m - 1; } return r; };
const pump = (T) => { const k = lastKickBefore(T); if (k < 0) return 1; const d = T - k; return 0.28 + 0.72 * (1 - Math.exp(-d / 0.11)); };

// 0–5  HOOK: low drone, pulse blips on each object pop, noise riser 2.4 → 5.0 (cut dead at 5.0)
padNote(0.0, 4.98, 33, { g: 0.11, cut: 260, att: 0.8, rel: 0.02, detune: [-0.08, 0.07] });
padNote(0.0, 4.98, 40, { g: 0.05, cut: 320, att: 1.2, rel: 0.02, detune: [-0.05, 0.06] });
const POPS = [0.12, 0.52, 0.895, 1.245, 1.57, 1.87, 2.145];
const POP_NOTES = [69, 72, 74, 76, 79, 81, 84];
POPS.forEach((t, k) => { pluck(t + 0.02, POP_NOTES[k], 0.11, 0.07, 5200, k % 2 ? 0.2 : -0.2, 'sq', 0.25); pluck(t + 0.02, POP_NOTES[k] - 12, 0.05, 0.05, 2000, 0, 'saw', 0.1); });
noiseSweep(2.4, 5.0, 300, 7000, 0.0, 0.22, music, { q: 1.4, gainFn: (x) => 0.02 + 0.22 * Math.pow(x, 1.6) });
padNote(2.4, 4.995, 57, { g: 0.035, cutFn: (T) => 300 + 2600 * Math.pow((T - 2.4) / 2.6, 2), att: 2.0, rel: 0.005 });

// 5–12.5  PAIN: cold sparse drone; ticking hats every half beat; heartbeat from 8 s; tension riser 9.7–11.3; near-silence; reverse swell
padNote(5.0, 11.3, 45, { g: 0.05, cut: 500, att: 0.6, rel: 0.05, wave: 'sine', detune: [-0.04, 0.05] });
padNote(5.0, 11.3, 64, { g: 0.018, cut: 1800, att: 1.5, rel: 0.05, wave: 'sine', detune: [-0.1, 0.1], wet: 0.6 });
padNote(5.0, 11.3, 72, { g: 0.010, cut: 2600, att: 2.5, rel: 0.05, wave: 'sine', detune: [-0.2, 0.2], wet: 0.8 });
beatsIn(5.0, 11.35, 0.25).forEach((t, k) => hat(t, k % 2 ? 0.05 : 0.08, 0.018, k % 2 ? 0.3 : -0.3));
[8.0, 9.0, 10.0, 11.0].forEach((t) => heartbeat(t, 0.55));
noiseSweep(9.7, 11.3, 400, 5000, 0, 0.18, music, { q: 2.5 });
padNote(9.7, 11.3, 57, { g: 0.03, cutFn: (T) => 600 + 3000 * ((T - 9.7) / 1.6), att: 1.4, rel: 0.02, wave: 'sq', detune: [0, 0.3] });
reverseSwell(11.75, 12.5, 0.28);

// 12.5 DROP: sub impact; kick every beat; sidechained detuned-saw pad; bass
impact(12.5, 0.95);
kicksMain.forEach((t) => kick(t, 0.85));
for (let b = 6; ; b++) { // bars from 12.5 to 48 (b = bar index)
  const t0 = BAR0 + b * BAR; if (t0 >= 48) break; const c = chordAt(t0 + 0.01);
  const cutFn = (T) => (T < 15 ? 900 : T < 37 ? 1200 : 1700);
  c.tones.forEach((m, k) => padNote(t0, t0 + BAR - 0.02, m, { g: 0.045, cutFn, att: 0.03, rel: 0.06, pump, pan: [-0.35, 0, 0.35][k], wet: 0.2 }));
  // bass: 8th-note root pulses (octave 2), pumped
  beatsIn(t0, t0 + BAR, 0.25).forEach((t) => padNote(t, t + 0.2, c.root - 12 + 12, { g: 0.09, cut: 380, att: 0.005, rel: 0.04, pump, detune: [-0.05, 0.05] }));
}
// 15: claps on 2 & 4, off-beat hats
beatsIn(15, 48, BAR, BAR0 + 0.5).forEach((t) => clap(t)); beatsIn(15, 48, BAR, BAR0 + 1.5).forEach((t) => clap(t));
beatsIn(15, 48, BEAT, 0.25).forEach((t, k) => hat(t, 0.11, 0.045, k % 2 ? 0.25 : -0.25));
// 19: 16th-note arpeggio, filter opening slowly
beatsIn(19, 48, 0.125).forEach((t, k) => { const c = chordAt(t + 0.001); const seq = [c.tones[0], c.tones[1], c.tones[2], c.tones[0] + 12, c.tones[2] + 12, c.tones[1] + 12, c.tones[2], c.tones[1]];
  const open = t < 35 ? 500 * Math.pow(9, (t - 19) / 16) : 5200; pluck(t, seq[k % 8], t >= 37 ? 0.045 : 0.05, 0.1, open, k % 2 ? 0.3 : -0.3, 'saw', 0.2); });
// 35–37: snare roll build + riser
[...beatsIn(35, 36, 0.25), ...beatsIn(36, 36.5, 0.125), ...beatsIn(36.5, 37, 0.0625)].forEach((t) => snare(t, 0.12 + 0.28 * ((t - 35) / 2)));
noiseSweep(35, 37, 500, 9000, 0, 0.25, music, { q: 1.6 });
impact(37.0, 0.6);
// 37–48: peak — bright lead melody (A minor pentatonic), with a dotted-8th echo
const E = 0.25; // eighth note
const PHRASE_A = [[76, 2], [76, 1], [74, 1], [72, 2], [69, 2], [72, 1], [74, 1], [76, 2], [79, 1], [76, 1], [74, 2]];
const PHRASE_B = [[76, 2], [76, 1], [74, 1], [72, 2], [69, 2], [67, 1], [69, 1], [72, 2], [74, 1], [72, 1], [69, 2]];
let tl = 37.0;
for (const ph of [PHRASE_A, PHRASE_B, PHRASE_A, PHRASE_B, PHRASE_A]) { for (const [m, d] of ph) { if (tl >= 47.9) break;
  const dur = d * E * 0.92; padNote(tl, tl + dur, m + 12, { g: 0.055, cut: 4200, att: 0.008, rel: 0.12, wave: 'sq', detune: [-0.06, 0.06], wet: 0.25 });
  padNote(tl + 0.375, tl + 0.375 + dur, m + 12, { g: 0.018, cut: 2600, att: 0.008, rel: 0.12, wave: 'sq', detune: [0.04], pan: 0.5 });
  tl += d * E; } }
// 48–54: warm half-time breakdown with soft chimes
impact(48.0, 0.35);
beatsIn(48, 54, 1.0, 0.5).forEach((t) => kick(t, 0.7, 120, 44, 0.4));
beatsIn(48, 54, 2.0, 1.5).forEach((t) => clap(t, 0.22));
for (let b = 24; b < 27; b++) { const t0 = BAR0 + b * BAR; if (t0 >= 54) break; const c = chordAt(t0 + 0.01);
  c.tones.forEach((m, k) => padNote(Math.max(t0, 48), Math.min(t0 + BAR, 53.98), m, { g: 0.05, cut: 900, att: 0.2, rel: 0.2, pan: [-0.3, 0, 0.3][k], wet: 0.4 }));
  padNote(Math.max(t0, 48), Math.min(t0 + BAR, 53.98), c.root, { g: 0.06, cut: 300, att: 0.1, rel: 0.1, detune: [0] });
  [0, 0.75, 1.0, 1.5].forEach((o, k) => { const t = t0 + o; if (t >= 48 && t < 53.9) bell(t, mtof(c.tones[(k + b) % 3] + 24), 0.05, 1.0, music, k % 2 ? 0.4 : -0.4, 0.5); }); }
// 54: final impact + long A-major resolve, fading out by 60
impact(54.0, 1.0);
[45, 57, 61, 64, 69].forEach((m, k) => padNote(54.0, 59.2, m, { g: k === 0 ? 0.07 : 0.045, cutFn: (T) => 2200 - 1500 * ((T - 54) / 6), att: 0.05, rel: 0.75, pan: [0, -0.3, 0.3, -0.15, 0.15][k], wet: 0.5 }));
bell(54.05, mtof(81), 0.06, 2.4, music, 0, 0.6); bell(54.3, mtof(88), 0.04, 2.4, music, 0.3, 0.6);

// ---------------------------------------------------------------- SFX (placed one frame after the picture)
const F = 1 / 30;
const msgPop = (t, k = 0) => { const a = [880, 990, 932][k % 3]; for (const [o, f] of [[0, a], [0.045, a * 1.5]]) { const n = idx(0.09); for (let i = 0; i < n; i++) { const tt = i / SR; const v = Math.sin(TAU * f * tt) * Math.exp(-tt / 0.03) * 0.22 * Math.min(1, tt / 0.002); put(sfx, idx(t + F + o) + i, v, v, 0.1); } } };
const buzz = (t) => { for (let p = 0; p < 3; p++) { const n = idx(0.07); for (let i = 0; i < n; i++) { const tt = i / SR; const v = (Math.sin(TAU * 160 * tt) + 0.35 * Math.sin(TAU * 320 * tt)) * 0.32 * Math.min(1, tt / 0.004, (0.07 - tt) / 0.006); put(sfx, idx(t + F + p * 0.11) + i, v, v); } } };
const click = (t, g = 0.16) => { const n = idx(0.03); for (let i = 0; i < n; i++) { const tt = i / SR; const v = (Math.sin(TAU * 3200 * tt) * Math.exp(-tt / 0.006) + (tt < 0.0015 ? noise() * 0.6 : 0)) * g; put(sfx, idx(t + F) + i, v, v); } };
const whoosh = (t, k = 0) => { const v = [[0.42, 500, 3200], [0.34, 800, 4200], [0.5, 350, 2600]][k % 3]; const t0 = t - v[0] * 0.6 + F;
  noiseSweep(t0, t0 + v[0], v[1], v[2], 0, 0, sfx, { q: 1.1, curve: (x) => Math.sin(Math.PI * x * 0.5), gainFn: (x) => 0.2 * Math.sin(Math.PI * x) ** 2, pan: (x) => (k % 2 ? 1 : -1) * (x - 0.5) * 0.8 }); };
const chime = (t) => { bell(t + F, mtof(88), 0.09, 0.9, sfx, -0.2, 0.3); bell(t + F + 0.07, mtof(95), 0.08, 0.9, sfx, 0.2, 0.3); }; // E6 + B6 (a fifth)
const coin = (t, k = 0) => { const fr = [3150, 4720, 6080].map((f) => f * (1 + (k % 3) * 0.04)); const n = idx(0.3); for (let i = 0; i < n; i++) { const tt = i / SR; let v = 0; fr.forEach((f, j) => { v += Math.sin(TAU * f * tt) * Math.exp(-tt / (0.12 - j * 0.03)) / (j + 1); }); put(sfx, idx(t + F) + i, v * 0.12, v * 0.12, (k % 2 ? 0.4 : -0.4)); } };
const glitch = (t) => { for (let s = 0; s < 6; s++) { const n = idx(0.014); const f = 200 + rnd() * 1800; for (let i = 0; i < n; i++) { const tt = i / SR; const crushed = Math.round(noise() * 4) / 4 * 0.5 + sq(f * tt) * 0.35; put(sfx, idx(t + s * 0.017) + i, crushed * 0.4, crushed * 0.4, s % 2 ? 0.6 : -0.6); } } };
const logoHit = (t, rise) => { noiseSweep(t - rise, t, 600, 9000, 0, 0.0, sfx, { q: 1.5, gainFn: (x) => 0.2 * Math.pow(x, 2.2) }); impact(t + F, 0.55, sfx); bell(t + F, mtof(81), 0.07, 1.6, sfx, 0, 0.5); };

// chat messages
[5.45, 5.78, 6.11, 6.44, 6.77, 7.10, 7.43, 7.76, 8.09, 8.42, 9.30].forEach((t, k) => msgPop(t, k));
[48.45, 48.75, 49.75, 50.55, 51.35].forEach((t, k) => msgPop(t, k));
// phone buzz on the floating chips
[6.6, 7.1, 7.6, 8.1].forEach(buzz);
// glitch
glitch(11.25);
// logo hits
logoHit(12.5, 0.55); logoHit(55.0, 1.1);
// whooshes on camera cuts / big moves (three takes rotated)
[2.4, 5.0, 10.12, 15.0, 17.35, 19.05, 22.45, 26.04, 27.3, 29.45, 32.85, 34.95, 39.3, 42.75, 44.95, 47.66, 48.0].forEach((t, k) => whoosh(t, k));
// soft UI clicks on taps and pop-outs
[19.85, 20.15, 20.45, 21.85, 23.25, 23.6, 28.0, 30.15, 30.45, 30.75, 33.6, 34.8, 35.5, 45.85].forEach((t) => click(t));
// SORTED chimes
[21.15, 24.85, 28.72, 31.7, 36.05].forEach(chime);
// XP tick-up (two count-ups), level-up arpeggio, mission stamp, coins
[[39.85, 0.45], [40.35, 0.45]].forEach(([t0, d], j) => { for (let k = 0; k < 9; k++) { const t = t0 + k * d / 9; const f = 1400 + (j * 9 + k) * 70; const n = idx(0.025); for (let i = 0; i < n; i++) { const tt = i / SR; const v = Math.sin(TAU * f * tt) * Math.exp(-tt / 0.008) * 0.12; put(sfx, idx(t + F) + i, v, v); } } });
[81, 85, 88, 93].forEach((m, k) => bell(41.15 + F + k * 0.07, mtof(m), 0.08, 0.8, sfx, (k - 1.5) * 0.2, 0.4));
click(43.55, 0.25); { const n = idx(0.12); for (let i = 0; i < n; i++) { const tt = i / SR; const v = Math.sin(TAU * (70 + 60 * Math.exp(-tt / 0.02)) * tt) * Math.exp(-tt / 0.05) * 0.5; put(sfx, idx(43.55 + F) + i, v, v); } } bell(43.6 + F, mtof(84), 0.07, 0.9, sfx, 0, 0.4); bell(43.67 + F, mtof(91), 0.06, 0.9, sfx, 0, 0.4);
[45.4, 45.55, 45.78, 46.0, 46.22, 46.5, 46.85].forEach((t, k) => coin(t, k));

// ---------------------------------------------------------------- reverb (Schroeder) on the send bus → music
function reverb(src, mix = 0.28) {
  const combs = [1557, 1617, 1491, 1422, 1277, 1356].map((d) => Math.round(d * SR / 44100)), aps = [225, 556, 441].map((d) => Math.round(d * SR / 44100));
  for (const ch of ['L', 'R']) { const x = src[ch], out = new Float32Array(N); const spread = ch === 'R' ? 23 : 0;
    for (const d0 of combs) { const d = d0 + spread, buf = new Float32Array(d); let p = 0, lpz = 0; for (let i = 0; i < N; i++) { const y = buf[p]; lpz = y * 0.6 + lpz * 0.4; buf[p] = x[i] + lpz * 0.82; out[i] += y; p = (p + 1) % d; } }
    for (const d0 of aps) { const d = d0 + spread, buf = new Float32Array(d); let p = 0; for (let i = 0; i < N; i++) { const b = buf[p]; const y = -out[i] + b; buf[p] = out[i] + b * 0.5; out[i] = y; p = (p + 1) % d; } }
    for (let i = 0; i < N; i++) music[ch][i] += out[i] * mix / combs.length; }
}
reverb(send);

// keep the hook riser's abrupt cut and the near-silence clean (nothing from the reverb tail bleeds there)
for (const ch of ['L', 'R']) { const b = music[ch];
  for (let i = idx(5.0); i < idx(5.02); i++) b[i] *= (i - idx(5.0)) / (idx(5.02) - idx(5.0));
  for (let i = idx(11.35); i < idx(11.75); i++) b[i] *= 0.08; }

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
