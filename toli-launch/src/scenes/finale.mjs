// 51.0–60.0  FINALE — every outing drops onto a turning stage (3D diorama); marigold & pink petals fall;
// "Your crew. Your city. Your Sunday." The diorama becomes a pedestal under the lockup, the name's meaning, and the call to action.
import { icon, wordmark, WM } from '../logo.mjs';
import { I } from '../scene-icons.mjs';
const w = (s) => s.split(' ').map((x) => `<span class="w">${x}</span>`).join(' ');
const WMH = 170, WMW = Math.round(WM.W / WM.H * WMH);
const ICON = 220, GAP = 40, LW = ICON + GAP + WMW, LX = Math.round(960 - LW / 2);

export default {
  id: 'finale', start: 51, duration: 9, track: 1,
  css: `
    #fn-cv, #fn-pt { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; z-index: 0; }
    #fn-pt { z-index: 1; }
    #fn-top, #fn-icon, #fn-word, #fn-tag, #fn-def, #fn-cta { z-index: 3; }
    #fn-top { position: absolute; left: 0; right: 0; top: 92px; text-align: center; font-size: 92px; }
    #fn-icon { position: absolute; left: ${LX}px; top: 118px; width: ${ICON}px; height: ${ICON}px; }
    #fn-word { position: absolute; left: ${LX + ICON + GAP}px; top: ${118 + Math.round((ICON - WMH) / 2) + 6}px; width: 0; height: ${WMH}px; overflow: hidden; }
    #fn-word-in { width: ${WMW}px; height: ${WMH}px; }
    #fn-tag { position: absolute; left: 0; right: 0; top: 388px; text-align: center; font-size: 92px; }
    #fn-def { position: absolute; left: 0; right: 0; top: 512px; text-align: center; font-size: 28px; }
    #fn-def b { color: var(--cream); font-weight: 600; }
    #fn-cta { position: absolute; left: 0; right: 0; top: 584px; display: flex; justify-content: center; }
    #fn-cta .pill { display: inline-flex; align-items: center; gap: 14px; height: 76px; padding: 0 36px 0 26px; border-radius: 999px; background: var(--marigold); color: var(--night);
      font: 800 32px 'Bricolage Grotesque', sans-serif; letter-spacing: -0.01em; box-shadow: 0 18px 40px rgba(0,0,0,0.5); white-space: nowrap; }
    #fn-cta .pill svg { width: 30px; height: 30px; }
    #fn-cta .pill i { font-style: normal; font-weight: 600; font-family: 'Inter', sans-serif; font-size: 26px; opacity: 0.8; }`,
  html: `    <canvas id="fn-cv" width="1920" height="1080" data-layout-ignore></canvas>
    <canvas id="fn-pt" width="1920" height="1080" data-layout-ignore></canvas>
    <div class="hl" id="fn-top">${w('Your crew.')} ${w('Your city.')} ${w('Your')} <span class="w grad-text">Sunday.</span></div>
    <div id="fn-icon">${icon('fn')}</div>
    <div id="fn-word"><div id="fn-word-in">${wordmark('fnw')}</div></div>
    <div class="hl" id="fn-tag"><span class="w">Get</span> <span class="w">the</span> <span class="w grad-text">toli</span> <span class="w">out.</span></div>
    <div class="sub" id="fn-def"><b>toli</b> (टोली) · noun · your crew, your gang of friends.</div>
    <div id="fn-cta"><div class="pill" id="fn-pill">${I.bolt}<span>Download free</span><i>· Live in Hyderabad</i></div></div>`,
  js: `
      // headline over the diorama
      SC.wordsIn(tl, $('fn-top'), 0.7, { gap: 0.16, dur: 0.2 });
      SC.wordsOut(tl, $('fn-top'), 4.2);
      // the lockup
      tl.fromTo('#fn-icon', { opacity: 0, scale: 0.4, rotation: -10 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.45, ease: 'back.out(1.8)' }, 4.55);
      tl.fromTo('#fn-word', { width: 0 }, { width: ${WMW}, duration: 0.45, ease: 'power3.out' }, 4.85);
      tl.fromTo('#fnw-dot', { y: -220, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42, ease: 'bounce.out' }, 5.05);
      SC.wordsIn(tl, $('fn-tag'), 5.35, { gap: 0.13, dur: 0.2 });
      tl.fromTo('#fn-def', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 6.0);
      tl.fromTo('#fn-pill', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.8)' }, 6.35);
      // the diorama sinks into a pedestal under the lockup
      tl.fromTo('#fn-cv', { y: 0, scale: 1 }, { y: 330, scale: 0.62, duration: 0.85, ease: 'power3.inOut' }, 4.3);

      // ---- petals (2D, seeded, pure function of time)
      var pc = $('fn-pt'), px = pc.getContext('2d'), rnd = SC.rng(2211), P = [];
      var COLS = ['#FFB627', '#FFB627', '#FF3D81', '#FFC95A', '#FF6A9E', '#FFF3E2'];
      for (var i = 0; i < 84; i++) P.push({ x: -80 + rnd() * 2080, y: -60 - rnd() * 1500, v: 150 + rnd() * 190, a: 30 + rnd() * 70, f: 0.4 + rnd() * 0.9,
        ph: rnd() * 6.28, r: rnd() * 6.28, rv: (rnd() - 0.5) * 5, s: 11 + rnd() * 17, c: COLS[Math.floor(rnd() * COLS.length)], fl: 1.5 + rnd() * 3 });
      function petals(t) {
        px.clearRect(0, 0, 1920, 1080);
        var tt = t - 0.25; if (tt < 0) return;
        for (var i = 0; i < P.length; i++) {
          var p = P[i], y = p.y + p.v * tt; if (y < -40 || y > 1120) continue;
          var x = p.x + p.a * Math.sin(6.283 * p.f * tt + p.ph);
          px.save(); px.translate(x, y); px.rotate(p.r + p.rv * tt); px.scale(Math.max(0.18, Math.abs(Math.cos(p.fl * tt + p.ph))), 1);
          px.fillStyle = p.c; px.beginPath(); px.moveTo(0, -p.s);
          px.bezierCurveTo(p.s * 0.75, -p.s * 0.4, p.s * 0.55, p.s * 0.75, 0, p.s);
          px.bezierCurveTo(-p.s * 0.55, p.s * 0.75, -p.s * 0.75, -p.s * 0.4, 0, -p.s); px.fill(); px.restore();
        }
      }

      // ---- 3D diorama: every outing on one turning stage
      var draw3d = function () {};
      if (window.SCENE3D) {
        var st = SCENE3D.createStage($('fn-cv'), { width: 1920, height: 1080, fov: 30 });
        if (window.SC_THEME && st.lights && st.lights.rim2) st.lights.rim2.color.set(SC_THEME.rim);
        st.setCamera({ position: [0, 4.4, 13.2], target: [0, 1.0, 0], fov: 30 });
        var plat = st.add('platform');
        var NAMES = ['kart', 'bowling', 'vr', 'trampoline', 'claw', 'controller', 'padlock', 'cricket'];
        var H = NAMES.map(function (n) { return st.add(n); });
        var TOP = 0.6, RR = 3.05;
        draw3d = function (t) {
          var th = -0.55 + 0.12 * t;                                       // slow orbit
          var ps = 4.5 * SC.popScale(t, 0.0, 0.4);
          plat.set({ visible: true, x: 0, y: 0, z: 0, scale: ps, rotY: th, action: SC.prog(t, 0, 9) });
          plat.setShadow(0.6);
          for (var i = 0; i < H.length; i++) {
            var a = th + i * Math.PI / 4, ti = 0.3 + i * 0.12, p = SC.prog(t, ti, ti + 0.5);
            var y = TOP + 5 * Math.pow(1 - p, 2), land = SC.prog(t, ti + 0.5, ti + 0.72);
            var sq = 1 + 0.08 * Math.sin(Math.PI * land);
            H[i].set({ visible: t >= ti, x: RR * Math.sin(a), y: y, z: RR * Math.cos(a), scale: 1.08 * sq, rotX: 0, rotY: a * 0.55, rotZ: 0,
              action: SC.prog(t, ti + 0.6, ti + 2.9) });
            H[i].setShadow(0.45);
          }
          st.render();
        };
      }
      SC.drive(tl, S0, S1, function (t) { draw3d(t); petals(t); });`,
};
