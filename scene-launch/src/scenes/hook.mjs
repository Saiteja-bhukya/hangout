// 0.0–5.0  HOOK — 3D objects pop into the centre, each cut quicker than the last; they fly out to a ring; PLANNING / TO / CHILL?
const ITEMS = [
  ['kart', 'GO-KARTING'],
  ['bowling', 'BOWLING'],
  ['vr', 'VR ARENAS'],
  ['trampoline', 'TRAMPOLINE PARKS'],
  ['claw', 'ARCADES'],
  ['controller', 'GAMING CAFÉS'],
  ['padlock', 'ESCAPE ROOMS'],
];
const LENS = [0.40, 0.375, 0.35, 0.325, 0.30, 0.275, 0.25];
const SLOTS = [];
{ let t = 0.12; for (const l of LENS) { SLOTS.push([+t.toFixed(4), +(t + l).toFixed(4)]); t += l; } }
const RING_T = 2.4;
// ring positions (screen px) around the headline
const RING = [[330, 240], [300, 560], [1590, 230], [1610, 560], [430, 870], [1490, 875], [960, 905]];

export default {
  id: 'hook', start: 0, duration: 5, track: 1,
  css: `
    #hook-cv { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    #hook-glow { left: 960px; top: 470px; width: 1100px; height: 1100px; margin: -550px 0 0 -550px; }
    #hook-rays { left: 960px; top: 470px; width: 1500px; height: 1500px; margin: -750px 0 0 -750px; }
    .hook-lbl { position: absolute; left: 0; right: 0; top: 840px; text-align: center; font-size: 60px; letter-spacing: 0.22em; opacity: 0; }
    #hook-hl { position: absolute; left: 0; right: 0; top: 300px; text-align: center; font-size: 150px; line-height: 1.0; }`,
  html: `    <div class="aura-rays" id="hook-rays" data-layout-ignore></div>
    <div class="aura" id="hook-glow" data-layout-ignore></div>
    <canvas id="hook-cv" width="1920" height="1080" data-layout-ignore></canvas>
${ITEMS.map(([, l], i) => `    <div class="lbl hook-lbl" id="hook-l${i}">${l}</div>`).join('\n')}
    <div class="hl" id="hook-hl"><span class="w">PLANNING</span><br /><span class="w">TO</span><br /><span class="w grad-text">CHILL?</span></div>`,
  js: `
      var NAMES = ${JSON.stringify(ITEMS.map((x) => x[0]))};
      var SLOTS = ${JSON.stringify(SLOTS)}, RING = ${JSON.stringify(RING)}, RING_T = ${RING_T};
      // labels swap with each cut
      SLOTS.forEach(function (s, i) {
        var el = $('hook-l' + i), end = i === SLOTS.length - 1 ? RING_T : s[1];
        tl.fromTo(el, { opacity: 0, filter: 'blur(6px)' }, { opacity: 1, filter: 'blur(0px)', duration: 0.08, ease: 'power2.out' }, s[0]);
        tl.set(el, { opacity: 0 }, end);
      });
      tl.fromTo('#hook-glow', { opacity: 0, scale: 0.5 }, { opacity: 0.95, scale: 1, duration: 0.35, ease: 'power2.out' }, 0.05);
      tl.fromTo('#hook-rays', { opacity: 0, rotation: 0 }, { opacity: 0.8, rotation: 24, duration: 2.35, ease: 'none' }, 0.05);
      // at the ring the aura widens behind the headline and settles softer
      tl.to('#hook-glow', { scale: 1.35, opacity: 0.6, duration: 0.5, ease: 'power2.out' }, RING_T);
      tl.to('#hook-rays', { scale: 1.2, opacity: 0.45, rotation: 50, duration: 2.6, ease: 'none' }, RING_T);
      // headline, word by word
      var ws = $('hook-hl').querySelectorAll('.w');
      [2.5, 2.7, 2.9].forEach(function (t, i) {
        tl.fromTo(ws[i], { opacity: 0, filter: 'blur(10px)', scale: 1.12 }, { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 0.2, ease: 'expo.out' }, t);
      });

      // --- 3D: every transform is a pure function of scene time
      if (window.SCENE3D) {
        var st = SCENE3D.createStage($('hook-cv'), { width: 1920, height: 1080, fov: 30 });
        if (window.SC_THEME && st.lights && st.lights.rim2) st.lights.rim2.color.set(SC_THEME.rim);
        var DIST = 11, PXU = 1080 / (2 * Math.tan(15 * Math.PI / 180) * DIST);
        st.setCamera({ position: [0, 1, DIST], target: [0, 1, 0], fov: 30 });
        var H = NAMES.map(function (n) { return st.add(n); });
        var world = function (px, py, sc) { return { x: (px - 960) / PXU, y: 1 - (py - 540) / PXU - 0.9 * sc }; };
        var CEN = [960, 470], BIG = 1.45, SMALL = 0.84;
        var draw = function (t) {
          for (var i = 0; i < H.length; i++) {
            var h = H[i], s = SLOTS[i], mid = (s[0] + s[1]) / 2, spin = ((t < RING_T ? t - mid : t - 3.0) * 20 + (t < RING_T ? 0 : (i % 2 ? 12 : -12))) * Math.PI / 180;
            if (t < RING_T) {
              var vis = t >= s[0] && t < s[1];
              if (!vis) { h.set({ visible: false }); continue; }
              var sc = BIG * SC.popScale(t, s[0], Math.min(0.3, s[1] - s[0]));
              var p = world(CEN[0], CEN[1], sc);
              h.set({ visible: true, x: p.x, y: p.y, z: 0, scale: sc, rotX: 0.12, rotY: spin, action: (t - s[0]) / (s[1] - s[0]) });
              h.setShadow(0.55);
            } else {
              var t0 = RING_T + i * 0.035, x = SC.prog(t, t0, t0 + 0.5), e = SC.easeOutExpo(x);
              var last = i === H.length - 1;
              var sc2 = (last ? BIG : 0.25) + ((SMALL) - (last ? BIG : 0.25)) * e;
              if (!last) sc2 = SMALL * SC.popScale(t, t0, 0.34);
              var px = CEN[0] + (RING[i][0] - CEN[0]) * e, py = CEN[1] + (RING[i][1] - CEN[1]) * e;
              var q = world(px, py, sc2);
              h.set({ visible: t >= t0 || last, x: q.x, y: q.y, z: 0, scale: sc2, rotX: 0.22, rotY: spin, action: i === 1 ? 0.75 : 0.0 });
              h.setShadow(0);
            }
          }
          st.render();
        };
        SC.drive(tl, S0, S1, draw);
      }`,
};
