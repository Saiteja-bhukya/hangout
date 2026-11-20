// 15.0–19.0  RANGE — Every way to hang out. over four rows of chips scrolling in opposite directions; One app. Whole crew. + Home phone.
import { I } from '../scene-icons.mjs';
import { phone, screen } from '../device.mjs';

export const ACTIVITIES = [
  ['wheel', 'Go-karting'], ['pin', 'Bowling'], ['vr', 'VR arenas'], ['spring', 'Trampoline parks'], ['key', 'Escape rooms'],
  ['bat', 'Box cricket'], ['ball', 'Turf football'], ['wave', 'Water parks'], ['snow', 'Snow parks'],
  ['mic', 'Karaoke'], ['dice', 'Board-game cafés'], ['palette', 'Pottery workshops'], ['joystick', 'Arcades'], ['pad', 'Gaming cafés'],
  ['laser', 'Laser tag'], ['target', 'Paintball'], ['climb', 'Rock climbing'], ['target', 'Archery'],
  ['ball', 'Mini golf'], ['skate', 'Ice skating'], ['skate', 'Roller skating'], ['paddle', 'Pickleball'], ['paddle', 'Badminton'],
  ['swim', 'Swimming'], ['boat', 'Kayaking'], ['mountain', 'Paragliding'], ['bolt', 'Ziplining'], ['cup', 'Cooking classes'],
  ['palette', 'Art jams'], ['laugh', 'Stand-up comedy'], ['music', 'Live music'], ['star', 'Theme parks'], ['target', 'Snooker'],
  ['bat', 'Cricket nets'], ['horse', 'Horse riding'], ['tent', 'Camping'],
];
const ROWS = [0, 1, 2, 3].map((r) => ACTIVITIES.filter((_, i) => i % 4 === r));
const ROW_Y = [300, 410, 520, 630];
const OBJ = [['cricket', 400, 880], ['bowling', 960, 905], ['controller', 1520, 880]];
const w = (s) => s.split(' ').map((x) => `<span class="w">${x}</span>`).join(' ');

export default {
  id: 'range', start: 15, duration: 4, track: 1,
  css: `
    #rg-hl { position: absolute; left: 0; right: 0; top: 92px; text-align: center; font-size: 120px; }
    #rg-rows { position: absolute; inset: 0; }
    .rg-row { position: absolute; left: 0; display: flex; gap: 22px; white-space: nowrap; }
    .rg-row .chip-g { height: 76px; font-size: 27px; padding: 0 30px 0 16px; }
    .rg-row .chip-g .ic { width: 48px; height: 48px; }
    .rg-row .chip-g .ic svg { width: 26px; height: 26px; }
    #rg-cv { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    #rg-rig { left: 1180px; top: 100px; width: 421px; height: 880px; }
    #rg-app { position: absolute; left: 170px; top: 370px; font-size: 150px; line-height: 1.0; }`,
  html: `    <div id="rg-rows">
${ROWS.map((row, r) => `      <div class="rg-row" id="rg-r${r}" style="top:${ROW_Y[r]}px">${[...row, ...row].map(([ic, t]) => `<div class="chip-g glass ${['', 'mg', 'tl', ''][r]}"><span class="ic">${I[ic]}</span>${t}</div>`).join('')}</div>`).join('\n')}
    </div>
    <canvas id="rg-cv" width="1920" height="1080" data-layout-ignore></canvas>
    <div class="hl" id="rg-hl">${w('Every way to')} <span class="w grad-text">hang</span> <span class="w grad-text">out.</span></div>
    <div class="aura-soft" id="rg-halo" style="left:865px;top:-35px;width:1050px;height:1150px" data-layout-ignore></div>
    <div class="rig" id="rg-rig">${phone(screen('home'))}</div>
    <div class="hl" id="rg-app">${w('One app.')}<br /><span class="w pink-text">Whole</span> <span class="w pink-text">crew.</span></div>`,
  js: `
      var T = function (a) { return a - S0; };
      // rows scroll in alternating directions, staggered so the chips never line up
      [[-120, -460], [-700, -360], [-300, -640], [-820, -480]].forEach(function (k, r) {
        tl.fromTo('#rg-r' + r, { x: k[0] }, { x: k[1], duration: D, ease: 'none' }, 0);
        tl.fromTo('#rg-r' + r, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.05 + r * 0.06);
      });
      SC.wordsIn(tl, $('rg-hl'), T(15.12), { gap: 0.12, dur: 0.18 });
      // hand-off to the app: rows recede, headline leaves, the phone rises
      SC.wordsOut(tl, $('rg-hl'), T(17.3));
      tl.to('#rg-rows', { opacity: 0.16, filter: 'blur(10px)', scale: 0.96, duration: 0.45, ease: 'power2.inOut' }, T(17.3));
      tl.fromTo('#rg-rig', { y: 1000, rotation: 4 }, { y: 0, rotation: 0, duration: 0.6, ease: 'expo.out' }, T(17.35));
      tl.fromTo('#rg-halo', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, T(17.4));
      SC.wordsIn(tl, $('rg-app'), T(17.55), { gap: 0.14, dur: 0.18 });

      if (window.SCENE3D) {
        var st = SCENE3D.createStage($('rg-cv'), { width: 1920, height: 1080, fov: 30 });
        if (window.SC_THEME && st.lights && st.lights.rim2) st.lights.rim2.color.set(SC_THEME.rim);
        var DIST = 11, PXU = 1080 / (2 * Math.tan(15 * Math.PI / 180) * DIST);
        st.setCamera({ position: [0, 1, DIST], target: [0, 1, 0], fov: 30 });
        var OBJ = ${JSON.stringify(OBJ)};
        var H = OBJ.map(function (o) { return st.add(o[0]); });
        var draw = function (t) {
          for (var i = 0; i < H.length; i++) {
            var t0 = T(15.25) + i * 0.15, sc = (i === 1 ? 1.1 : 0.98) * SC.popScale(t, t0, 0.34);
            var drop = SC.prog(t, T(17.3) + i * 0.04, T(17.75) + i * 0.04); drop = drop * drop * drop;
            var px = OBJ[i][1], py = OBJ[i][2] + drop * 520;
            var h = H[i];
            h.set({ visible: t >= t0 && drop < 1, x: (px - 960) / PXU, y: 1 - (py - 540) / PXU - 0.9 * sc, z: 0, scale: sc, rotX: 0.18,
              rotY: ((t - T(16.4)) * 20 + (i - 1) * 10) * Math.PI / 180, action: SC.prog(t, t0 + 0.2, t0 + 1.8) });
            h.setShadow(0);
          }
          st.render();
        };
        SC.drive(tl, S0, S1, draw);
      }`,
};
