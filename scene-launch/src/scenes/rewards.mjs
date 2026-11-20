// 37.0–48.0  REWARDS — AND EVERY OUTING PAYS YOU BACK. → XP count + level ring 9→10 + gold badge → CHALLENGE COMPLETE. → UNLOCK MORE. (coins)
import { phone, screen, PHONE } from '../device.mjs';
import { I } from '../scene-icons.mjs';

const RIG = { l: 1150, t: 100 };
const stack = (id, names) => names.map((n, i) => `<div class="stk" id="${id}-s${i}" style="position:absolute;left:0;top:0;z-index:${i + 1};isolation:isolate;width:${PHONE.sw}px;height:${PHONE.sh}px;overflow:hidden">${screen(n)}</div>`).join('');
const w = (s) => s.split(' ').map((x) => `<span class="w">${x}</span>`).join(' ');

// sparkle burst (deterministic positions)
function sparks(id, n, seed) {
  let a = seed; const r = () => { a = (a * 16807) % 2147483647; return a / 2147483647; };
  return Array.from({ length: n }, (_, i) => {
    const ang = (i / n) * Math.PI * 2 + r() * 0.3, d = 120 + r() * 90, s = 26 + r() * 22;
    return `<i class="spk" style="left:${(Math.cos(ang) * d).toFixed(1)}px;top:${(Math.sin(ang) * d).toFixed(1)}px;width:${s.toFixed(1)}px;height:${s.toFixed(1)}px"></i>`;
  }).join('');
}

export default {
  id: 'rewards', start: 37, duration: 11, track: 1, async: true,
  css: `
    #rw-h1 { position: absolute; left: 0; right: 0; top: 380px; text-align: center; font-size: 112px; line-height: 1.04; }
    #rw-rig { left: ${RIG.l}px; top: ${RIG.t}px; width: ${PHONE.w}px; height: ${PHONE.h}px; }
    .rw-chip { position: absolute; }
    .rw-chip .chip-g { height: 84px; font-size: 30px; padding: 0 34px 0 16px; gap: 14px; }
    .rw-chip .chip-g .ic { width: 54px; height: 54px; }
    .rw-chip .chip-g .ic svg { width: 28px; height: 28px; }
    .rw-chip b { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 38px; letter-spacing: 0.02em; }
    #rw-badge { position: absolute; left: 236px; top: 640px; display: flex; align-items: center; gap: 22px; padding: 18px 40px 18px 18px; border-radius: 999px;
      background: linear-gradient(135deg, #F6E3A8 0%, #E9CB7E 45%, #C9A24E 100%); box-shadow: 0 20px 44px rgba(150, 110, 30, 0.35), inset 0 0 0 2px rgba(255,255,255,0.65); }
    #rw-badge .md { width: 84px; height: 84px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #FFF6D8, #E9CB7E 55%, #B88E3A); display: flex; align-items: center; justify-content: center;
      font: 800 44px 'Urbanist', sans-serif; color: #5B4314; box-shadow: inset 0 0 0 3px rgba(255,255,255,0.7); }
    #rw-badge .tx { font: 700 22px 'Rajdhani', sans-serif; letter-spacing: 0.18em; color: #5B4314; }
    #rw-badge .tx b { display: block; font: 800 40px 'Urbanist', sans-serif; letter-spacing: 0.04em; color: #3E2D0A; }
    .rw-burst { position: absolute; width: 0; height: 0; }
    .rw-burst .spk { position: absolute; margin: -14px 0 0 -14px; background: radial-gradient(circle, #FFFBEA 0%, #F3DC9A 22%, rgba(233,203,126,0) 60%); clip-path: polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%); }
    .rw-burst .ring { position: absolute; left: -160px; top: -160px; width: 320px; height: 320px; border-radius: 50%; border: 5px solid rgba(233, 203, 126, 0.9); }
    #rw-h2 { position: absolute; left: 150px; top: 360px; font-size: 104px; line-height: 1.04; }
    #rw-h3 { position: absolute; left: 150px; top: 420px; font-size: 120px; line-height: 1.04; }
    #rw-cv { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    #rw-rays { position: absolute; left: ${RIG.l + PHONE.w / 2 - 700}px; top: ${RIG.t + 300 - 700}px; width: 1400px; height: 1400px; border-radius: 50%;
      background: repeating-conic-gradient(from 0deg, rgba(233,203,126,0.30) 0deg 6deg, rgba(233,203,126,0) 6deg 18deg);
      -webkit-mask-image: radial-gradient(circle, #000 0%, rgba(0,0,0,0.6) 30%, transparent 62%); mask-image: radial-gradient(circle, #000 0%, rgba(0,0,0,0.6) 30%, transparent 62%); }`,
  html: `    <div class="hl" id="rw-h1">${w('AND EVERY OUTING')}<br />${w('PAYS YOU')} <span class="w grad-text">BACK.</span></div>
    <div id="rw-rays" data-layout-ignore></div>
    <div class="aura-soft" id="rw-halo" style="left:835px;top:-35px;width:1050px;height:1150px" data-layout-ignore></div>
    <div class="rig" id="rw-rig">${phone(stack('rw', ['xp', 'missions', 'rewards']))}</div>
    <div class="rw-chip" id="rw-c1" style="left:236px;top:300px"><div class="chip-g glass"><span class="ic">${I.star}</span><b>+60 XP</b>NEW VENUE</div></div>
    <div class="rw-chip" id="rw-c2" style="left:236px;top:430px"><div class="chip-g glass"><span class="ic">${I.check}</span><b>+40 XP</b>CHECK-IN</div></div>
    <div id="rw-badge"><div class="md">10</div><div class="tx">LEVEL 10<b>THE REGULAR</b></div></div>
    <div class="rw-burst" id="rw-b1" style="left:${RIG.l + PHONE.w / 2}px;top:330px" data-layout-ignore><i class="ring"></i>${sparks('b1', 14, 7)}</div>
    <div class="hl" id="rw-h2">${w('CHALLENGE')}<br /><span class="w grad-text">COMPLETE.</span></div>
    <div class="rw-burst" id="rw-b2" style="left:${RIG.l + PHONE.w / 2}px;top:420px" data-layout-ignore><i class="ring"></i>${sparks('b2', 12, 19)}</div>
    <div class="hl" id="rw-h3">${w('UNLOCK')}<br /><span class="w grad-text">MORE.</span></div>
    <canvas id="rw-cv" width="1920" height="1080" data-layout-ignore></canvas>`,
  js: `
      var T = function (a) { return a - S0; };
      document.fonts.ready.then(function () {
        var sx = $('rw-s0').querySelector('.app-screen'), sm = $('rw-s1').querySelector('.app-screen'), sr = $('rw-s2').querySelector('.app-screen');
        var q = function (s, p) { return s.querySelector('[data-part="' + p + '"]'); };

        // 1) headline alone
        SC.wordsIn(tl, $('rw-h1'), T(37.08), { gap: 0.13, dur: 0.2 });
        SC.wordsOut(tl, $('rw-h1'), T(39.05));

        // 2) XP: phone rises; chips land; count 3,230 → 3,330; ring fills; 9 flips to 10; gold badge
        tl.fromTo('#rw-rig', { y: 1000, rotation: 4, scale: 1, transformOrigin: '50% 30%' }, { y: 0, rotation: 0, duration: 0.55, ease: 'expo.out' }, T(39.3));
        tl.fromTo('#rw-halo', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'power2.out' }, T(39.35));
        tl.to('#rw-halo', { opacity: 0, duration: 0.3, ease: 'power2.in' }, T(47.62));
        tl.fromTo('#rw-c1', { opacity: 0, scale: 0.6, x: -40 }, { opacity: 1, scale: 1, x: 0, duration: 0.4, ease: 'back.out(1.6)' }, T(39.8));
        tl.fromTo('#rw-c2', { opacity: 0, scale: 0.6, x: -40 }, { opacity: 1, scale: 1, x: 0, duration: 0.4, ease: 'back.out(1.6)' }, T(40.3));
        var xn = q(sx, 'xp-num'), xp = { v: 3230 };
        var fmt = function (n) { n = Math.round(n); return n >= 1000 ? Math.floor(n / 1000) + ',' + String(n % 1000).padStart(3, '0') : String(n); };
        if (xn) {
          xn.textContent = '3,230';
          tl.fromTo(xp, { v: 3230 }, { v: 3290, duration: 0.45, ease: 'power2.out', onUpdate: function () { xn.textContent = fmt(xp.v); } }, T(39.85));
          tl.to(xp, { v: 3330, duration: 0.45, ease: 'power2.out', onUpdate: function () { xn.textContent = fmt(xp.v); } }, T(40.35));
        }
        var arc = q(sx, 'ring-arc');
        if (arc) {
          var circ = parseFloat(arc.getAttribute('data-circ')) || 600;
          var cur = parseFloat(getComputedStyle(arc).strokeDashoffset) || circ * 0.1;
          tl.fromTo(arc, { strokeDashoffset: cur }, { strokeDashoffset: 0, duration: 0.85, ease: 'power2.inOut' }, T(40.2));
        }
        var ln = q(sx, 'level-num');
        if (ln) {
          tl.to(ln, { scaleY: 0, duration: 0.1, ease: 'power2.in' }, T(41.05));
          var lv = { f: 0 };
          tl.fromTo(lv, { f: 0 }, { f: 1, duration: 0.01, ease: 'none', onUpdate: function () { ln.textContent = lv.f >= 1 ? '10' : '9'; } }, T(41.15));
          tl.to(ln, { scaleY: 1, duration: 0.16, ease: 'back.out(2)' }, T(41.15));
        }
        // camera pushes in toward the ring while it fills
        tl.to('#rw-rig', { scale: 1.18, x: -40, duration: 0.8, ease: 'power2.inOut' }, T(40.1));
        tl.fromTo('#rw-b1 .ring', { scale: 0.4, opacity: 0.9 }, { scale: 1.9, opacity: 0, duration: 0.7, ease: 'expo.out' }, T(41.15));
        tl.fromTo('#rw-b1 .spk', { x: 0, y: 0, opacity: 0, scale: 0.3 }, { x: function (i, el) { return parseFloat(el.style.left) * 0.6; }, y: function (i, el) { return parseFloat(el.style.top) * 0.6; }, opacity: 1, scale: 1, duration: 0.45, ease: 'expo.out', stagger: 0.01 }, T(41.15));
        tl.to('#rw-b1 .spk', { opacity: 0, scale: 0.4, duration: 0.3, ease: 'power2.in' }, T(41.7));
        tl.fromTo('#rw-badge', { opacity: 0, scale: 0.5, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.7)' }, T(41.25));
        // XP beat out
        tl.to(['#rw-c1', '#rw-c2', '#rw-badge'], { opacity: 0, filter: 'blur(8px)', duration: 0.22, ease: 'power3.in', stagger: 0.04 }, T(42.6));
        tl.to('#rw-rig', { scale: 1, x: 0, duration: 0.5, ease: 'power2.inOut' }, T(42.6));

        // 3) CHALLENGE COMPLETE: missions screen slides in, the third stamp lands
        tl.fromTo('#rw-s1', { x: ${PHONE.sw} }, { x: 0, duration: 0.42, ease: 'power3.inOut' }, T(42.75));
        tl.to('#rw-s0', { x: -${PHONE.sw}, duration: 0.42, ease: 'power3.inOut' }, T(42.75));
        SC.wordsIn(tl, $('rw-h2'), T(42.95), { gap: 0.16, dur: 0.2 });
        var s2 = q(sm, 'stamp-2'), s3 = q(sm, 'stamp-3');
        if (s2 && s3) {
          // a filled stamp lands on the third (dashed) slot
          var c2 = s2.querySelector('.sc-stamp__c'), c3 = s3.querySelector('.sc-stamp__c'), cs = getComputedStyle(c2);
          var done = document.createElement('span');
          done.className = 'sc-stamp__c';
          ['background', 'border', 'boxShadow', 'color', 'borderRadius', 'width', 'height', 'display', 'alignItems', 'justifyContent'].forEach(function (k) { done.style[k] = cs[k]; });
          done.innerHTML = c3.innerHTML + (c2.querySelector('i') ? c2.querySelector('i').outerHTML : '');
          done.style.position = 'absolute'; done.style.top = '0px'; done.style.left = '50%'; done.style.marginLeft = '-' + (parseFloat(cs.width) / 2) + 'px';
          s3.style.position = 'relative';
          s3.appendChild(done);
          tl.fromTo(done, { scale: 2.4, opacity: 0, rotation: -18 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.3, ease: 'back.out(1.4)' }, T(43.55));
          var cnt = sm.querySelector('.sc-feat__foot b'), cf = { f: 0 };
          if (cnt) tl.fromTo(cf, { f: 0 }, { f: 1, duration: 0.01, ease: 'none', onUpdate: function () { cnt.textContent = cf.f >= 1 ? '3 of 3' : '2 of 3'; } }, T(43.6));
          var links = sm.querySelectorAll('.sc-stamp__link');
          if (links[1]) tl.fromTo(links[1], { backgroundImage: 'linear-gradient(90deg, rgba(143,163,191,0.2), rgba(143,163,191,0.2))' }, { backgroundImage: 'linear-gradient(90deg, #12B3DA, #2F6BFF)', duration: 0.2 }, T(43.5));
        }
        tl.fromTo('#rw-b2 .ring', { scale: 0.3, opacity: 0.9 }, { scale: 1.6, opacity: 0, duration: 0.6, ease: 'expo.out' }, T(43.75));
        tl.fromTo('#rw-b2 .spk', { x: 0, y: 0, opacity: 0, scale: 0.3 }, { x: function (i, el) { return parseFloat(el.style.left) * 0.5; }, y: function (i, el) { return parseFloat(el.style.top) * 0.5; }, opacity: 1, scale: 1, duration: 0.4, ease: 'expo.out' }, T(43.75));
        tl.to('#rw-b2 .spk', { opacity: 0, scale: 0.4, duration: 0.3, ease: 'power2.in' }, T(44.25));
        SC.wordsOut(tl, $('rw-h2'), T(44.75));

        // 4) UNLOCK MORE: rewards screen, perk selected, balance 275 → 25, coins tumble, reward burst
        tl.fromTo('#rw-s2', { x: ${PHONE.sw} }, { x: 0, duration: 0.42, ease: 'power3.inOut' }, T(44.95));
        tl.to('#rw-s1', { x: -${PHONE.sw}, duration: 0.42, ease: 'power3.inOut' }, T(44.95));
        SC.wordsIn(tl, $('rw-h3'), T(45.15), { gap: 0.18, dur: 0.2 });
        var pv = q(sr, 'perk-vr');
        if (pv) tl.fromTo(pv, { scale: 1 }, { scale: 0.96, duration: 0.08, ease: 'power2.out', yoyo: true, repeat: 1 }, T(45.85));
        var bn = q(sr, 'balance-num'), bal = { v: 275 };
        if (bn) tl.fromTo(bal, { v: 275 }, { v: 25, duration: 0.6, ease: 'power2.inOut', onUpdate: function () { bn.textContent = String(Math.round(bal.v)); } }, T(46.0));
        tl.fromTo('#rw-rays', { opacity: 0, scale: 0.6, rotation: 0 }, { opacity: 1, scale: 1, rotation: 12, duration: 0.6, ease: 'expo.out' }, T(46.0));
        tl.to('#rw-rays', { rotation: 30, duration: 1.4, ease: 'none' }, T(46.6));
        tl.to('#rw-rays', { opacity: 0, duration: 0.3, ease: 'power2.in' }, T(47.6));
        SC.wordsOut(tl, $('rw-h3'), T(47.62));
        tl.to('#rw-rig', { x: -700, opacity: 0, filter: 'blur(10px)', duration: 0.32, ease: 'power3.in' }, T(47.66));

        // coins: 3D, falling and tumbling on seeded arcs (pure function of time)
        if (window.SCENE3D) {
          var stg = SCENE3D.createStage($('rw-cv'), { width: 1920, height: 1080, fov: 30 });
        if (window.SC_THEME && stg.lights && stg.lights.rim2) stg.lights.rim2.color.set(SC_THEME.rim);
          var DIST = 11, PXU = 1080 / (2 * Math.tan(15 * Math.PI / 180) * DIST);
          stg.setCamera({ position: [0, 1, DIST], target: [0, 1, 0], fov: 30 });
          var rnd = SC.rng(4711), C = [];
          for (var i = 0; i < 9; i++) C.push({ h: stg.add('coin'), x0: 980 + rnd() * 760, y0: -160 - rnd() * 260, vx: (rnd() - 0.5) * 380, vy: 80 + rnd() * 220,
            d: rnd() * 0.5, sp: 3 + rnd() * 5, ax: rnd() * 6, sc: 0.32 + rnd() * 0.16 });
          var draw = function (t) {
            var tt = t - T(45.25);
            for (var i = 0; i < C.length; i++) {
              var c = C[i], k = tt - c.d;
              if (k < 0 || k > 2.4) { c.h.set({ visible: false }); continue; }
              var px = c.x0 + c.vx * k, py = c.y0 + c.vy * k + 0.5 * 1500 * k * k;
              c.h.set({ visible: py < 1250, x: (px - 960) / PXU, y: 1 - (py - 540) / PXU, z: 0, scale: c.sc, rotX: c.ax + k * c.sp, rotY: k * c.sp * 0.6, rotZ: k * 1.3, action: 0 });
              c.h.setShadow(0);
            }
            stg.render();
          };
          SC.drive(tl, S0, S1, draw);
        }
        window.__timelines = window.__timelines || {};
        window.__timelines['rewards'] = tl;
      });`,
};
