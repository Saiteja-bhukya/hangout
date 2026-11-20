// 4.0–8.2  POSSIBILITIES — 3D outings pop into the centre, each cut quicker than the last; they ring the frame:
// "So many plans." … then everything drops out of frame.
const ITEMS = [
  ['kart', 'Go-karting'], ['bowling', 'Bowling'], ['vr', 'VR arenas'], ['trampoline', 'Trampoline parks'],
  ['claw', 'Arcades'], ['controller', 'Gaming cafés'], ['padlock', 'Escape rooms'],
];
const START = 4.0;
const LENS = [0.36, 0.34, 0.32, 0.30, 0.28, 0.26, 0.24];
const SLOTS = [];
{ let t = 0.1; for (const l of LENS) { SLOTS.push([+t.toFixed(4), +(t + l).toFixed(4)]); t += l; } }
const RING_T = 2.22;  // scene-local
const DROP_T = 3.55;  // everything falls
const RING = [[330, 250], [300, 560], [1590, 240], [1610, 560], [430, 870], [1490, 875], [960, 905]];

export default {
  id: 'hook', start: START, duration: 4.2, track: 1,
  css: `
    #hook-cv { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    .hook-lbl { position: absolute; left: 0; right: 0; top: 832px; text-align: center; font-size: 76px; opacity: 0; }
    #hook-hl { position: absolute; left: 0; right: 0; top: 300px; text-align: center; font-size: 180px; line-height: 0.98; }`,
  html: `    <canvas id="hook-cv" width="1920" height="1080" data-layout-ignore></canvas>
${ITEMS.map(([, l], i) => `    <div class="hl hook-lbl" id="hook-l${i}">${l}</div>`).join('\n')}
    <div class="hl" id="hook-hl"><span class="w">So</span> <span class="w">many</span><br /><span class="w grad-text">plans.</span></div>`,
  js: `
      var SLOTS = ${JSON.stringify(SLOTS)}, RING = ${JSON.stringify(RING)}, RING_T = ${RING_T}, DROP_T = ${DROP_T};
      SLOTS.forEach(function (s, i) {
        var el = $('hook-l' + i), end = i === SLOTS.length - 1 ? RING_T : s[1];
        tl.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, s[0]);
        tl.set(el, { opacity: 0 }, end);
      });
      var ws = $('hook-hl').querySelectorAll('.w');
      [2.36, 2.52, 2.72].forEach(function (t, i) {
        tl.fromTo(ws[i], { opacity: 0, scale: 1.25, filter: 'blur(10px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.22, ease: 'expo.out' }, t);
      });
      // the headline drops with everything else
      [0, 1, 2].forEach(function (i) {
        tl.to(ws[i], { y: 900, rotation: [-12, 8, -6][i], duration: 0.6, ease: 'power2.in' }, DROP_T + 0.12 + i * 0.05);
      });

      if (window.SCENE3D) {
        var NAMES = ${JSON.stringify(ITEMS.map((x) => x[0]))};
        var st = SCENE3D.createStage($('hook-cv'), { width: 1920, height: 1080, fov: 30 });
        var DIST = 11, PXU = 1080 / (2 * Math.tan(15 * Math.PI / 180) * DIST);
        st.setCamera({ position: [0, 1, DIST], target: [0, 1, 0], fov: 30 });
        var H = NAMES.map(function (n) { return st.add(n); });
        var world = function (px, py, sc) { return { x: (px - 960) / PXU, y: 1 - (py - 540) / PXU - 0.9 * sc }; };
        var CEN = [960, 470], BIG = 1.5, SMALL = 0.84;
        var draw = function (t) {
          for (var i = 0; i < H.length; i++) {
            var h = H[i], s = SLOTS[i], mid = (s[0] + s[1]) / 2;
            if (t < RING_T) {
              var vis = t >= s[0] && t < s[1];
              if (!vis) { h.set({ visible: false }); continue; }
              var sc = BIG * SC.popScale(t, s[0], Math.min(0.28, s[1] - s[0]));
              var p = world(CEN[0], CEN[1], sc);
              h.set({ visible: true, x: p.x, y: p.y, z: 0, scale: sc, rotX: 0.12, rotY: (t - mid) * 20 * Math.PI / 180, action: (t - s[0]) / (s[1] - s[0]) });
              h.setShadow(0.5);
            } else {
              var t0 = RING_T + i * 0.035, x = SC.prog(t, t0, t0 + 0.5), e = SC.easeOutExpo(x), last = i === H.length - 1;
              var sc2 = last ? BIG + (SMALL - BIG) * e : SMALL * SC.popScale(t, t0, 0.34);
              var px = CEN[0] + (RING[i][0] - CEN[0]) * e, py = CEN[1] + (RING[i][1] - CEN[1]) * e;
              // the drop: gravity from DROP_T, staggered
              var dt = Math.max(0, t - (DROP_T + i * 0.04)); py += 0.5 * 4200 * dt * dt;
              var q = world(px, py, sc2);
              h.set({ visible: (t >= t0 || last) && py < 1500, x: q.x, y: q.y, z: 0, scale: sc2, rotX: 0.22 + dt * 2,
                rotY: ((t - 2.9) * 20 + (i % 2 ? 12 : -12)) * Math.PI / 180, rotZ: dt * (i % 2 ? 3 : -3), action: i === 1 ? 0.75 : 0.0 });
              h.setShadow(0);
            }
          }
          st.render();
        };
        SC.drive(tl, S0, S1, draw);
      }`,
};
