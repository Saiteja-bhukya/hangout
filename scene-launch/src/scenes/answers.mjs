// 19.0–37.0  ANSWERS — five beats. The chat's questions come back as glass bubbles; the app answers each one,
// key UI parts lift out of the screen with glass tags on thin wires, and a ✓ SORTED pill stamps it.
import { phone, screen, PHONE } from '../device.mjs';
import { I } from '../scene-icons.mjs';

const AVC = { Rohan: 'av-rohan', Meera: 'av-meera', You: 'av-you' };
const bubble = (p, from, text, l, t) => `    <div class="qbubble" id="${p}-q" style="left:${l}px;top:${t}px">
      <div class="av ${AVC[from]}">${from[0]}</div>
      <div class="body glass"><div class="who">${from}</div><div class="txt">${text}</div></div>
    </div>`;
const sorted = (p, l, t) => `    <div class="sorted" id="${p}-ok" style="left:${l}px;top:${t}px">${I.check}<span>SORTED</span></div>`;

// a phone rig with a 3D lift layer over its screen. `inner` is the screen markup (one or more stacked screens)
const rig = (id, inner, screenNames, l, t, tagSets) => {
  const names = [].concat(screenNames), sets = Array.isArray(tagSets[0]?.[0]) ? tagSets : [tagSets];
  const layers = names.map((n, k) => `          <div class="app-screen app-screen--${n} lift-scr" id="${id}-ls${k ? k : ''}" style="width:${PHONE.sw}px;height:${PHONE.sh}px">
${(sets[k] || []).map(([tid, txt]) => `            <div class="wire3d" id="${tid}-w"></div>\n            <div class="tag3d glass-solid" id="${tid}"><span class="dot"></span>${txt}</div>`).join('\n')}
          </div>`).join('\n');
  return `      <div class="rig" id="${id}" style="left:${l}px;top:${t}px;width:${PHONE.w}px;height:${PHONE.h}px">
        ${phone(inner)}
        <div class="lift" style="left:${PHONE.sx}px;top:${PHONE.sy}px;width:${PHONE.sw}px;height:${PHONE.sh}px">
${layers}
        </div>
      </div>`;
};
const stack = (id, names) => names.map((n, i) => `<div class="stk" id="${id}-s${i}" style="position:absolute;left:0;top:0;z-index:${i + 1};isolation:isolate;width:${PHONE.sw}px;height:${PHONE.sh}px">${screen(n)}</div>`).join('');

const COMMON_CSS = `
    .persp { perspective: 2400px; perspective-origin: 50% 50%; }
    .stk { overflow: hidden; }`;

function lifts(js) { return `document.fonts.ready.then(function () {\n${js}\n        window.__timelines = window.__timelines || {};\n        window.__timelines[ID] = tl;\n      });`; }

// ---------------------------------------------------------------- a1: what's the plan → Explore (3/4 hero)
const a1 = {
  id: 'a1', start: 19, duration: 3.4, track: 1, async: true,
  css: COMMON_CSS,
  html: `${bubble('a1', 'Rohan', "So what's the plan this Sunday?", 110, 372)}
${sorted('a1', 196, 600)}
    <div class="aura-soft" id="a1-halo" style="left:695px;top:-39px;width:1050px;height:1150px" data-layout-ignore></div>
    <div class="persp" id="a1-persp">
${rig('a1-rig', screen('explore'), 'explore', 1010, 96, [['a1-t0', 'What you feel like'], ['a1-t1', "When you're free"], ['a1-t2', "Who's coming"]])}
    </div>`,
  js: `
      var ID = 'a1', T = function (a) { return a - S0; };
      ${lifts(`
        var scr = $('a1-rig').querySelector('.phone .app-screen'), ls = $('a1-rig-ls');
        // build lifts first (they measure layout)
        var L = [['what', 'a1-t0', 19.85], ['when', 'a1-t1', 20.15], ['who', 'a1-t2', 20.45]];
        SC.layout(scr, function () { L.forEach(function (l) { SC.liftTag(tl, { scr: scr, liftScr: ls, part: l[0], tag: $(l[1]), wire: $(l[1] + '-w'), side: 'right', dz: 90 }, T(l[2])); }); });
        tl.fromTo('#a1-halo', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'power2.out' }, T(19.05));
        tl.to('#a1-halo', { opacity: 0, duration: 0.3, ease: 'power2.in' }, T(22.1));
        SC.qBubble(tl, $('a1-q'), T(19.02), T(22.08));
        // camera: phone swings in to a 3/4 hero, then drifts slowly while it is read
        tl.fromTo('#a1-rig', { x: 760, rotationY: -38, rotationX: 6, opacity: 0 }, { x: 0, rotationY: -16, rotationX: 4, opacity: 1, duration: 0.62, ease: 'power3.out' }, T(19.05));
        tl.to('#a1-rig', { rotationY: -10, duration: 2.3, ease: 'sine.inOut' }, T(19.67));
        // tap "Show venues"
        var cta = scr.querySelector('[data-part="cta"]');
        if (cta) tl.fromTo(cta, { scale: 1 }, { scale: 0.95, duration: 0.08, ease: 'power2.out', yoyo: true, repeat: 1 }, T(21.85));
        SC.stamp(tl, $('a1-ok'), T(21.15), T(22.08));
        tl.to('#a1-rig', { x: -260, opacity: 0, filter: 'blur(10px)', duration: 0.3, ease: 'power3.in' }, T(22.1));`)}`,
};

// ---------------------------------------------------------------- a2: near us? → Results + Map (split screen)
const a2 = {
  id: 'a2', start: 22.4, duration: 3.6, track: 1, async: true,
  css: COMMON_CSS,
  html: `${bubble('a2', 'Meera', 'Which one is even near us?', 110, 118)}
${sorted('a2', 196, 316)}
    <div class="aura-soft" id="a2-halo" style="left:515px;top:-23px;width:1500px;height:1150px" data-layout-ignore></div>
    <div class="persp" id="a2-persp">
${rig('a2-r1', screen('results'), 'results', 800, 112, [['a2-t0', 'Holodeck VR · 6.2 km']])}
${rig('a2-r2', screen('map'), 'map', 1310, 112, [['a2-t1', '₹249 per player']])}
    </div>`,
  js: `
      var ID = 'a2', T = function (a) { return a - S0; };
      ${lifts(`
        var s1 = $('a2-r1').querySelector('.phone .app-screen'), s2 = $('a2-r2').querySelector('.phone .app-screen');
        SC.layout(s1, function () {
          SC.liftTag(tl, { scr: s1, liftScr: $('a2-r1-ls'), part: 'card-holodeck', tag: $('a2-t0'), wire: $('a2-t0-w'), side: 'left', dz: 80, gap: 70 }, T(23.25));
          SC.liftTag(tl, { scr: s2, liftScr: $('a2-r2-ls'), part: 'pin-249', tag: $('a2-t1'), wire: $('a2-t1-w'), side: 'above', dz: 80, gap: 46, dim: 0.5 }, T(23.6));
        });
        tl.fromTo('#a2-halo', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'power2.out' }, T(22.45));
        tl.to('#a2-halo', { opacity: 0, duration: 0.3, ease: 'power2.in' }, T(25.66));
        SC.qBubble(tl, $('a2-q'), T(22.42), T(25.72));
        // split screen: two phones rise in one after the other, then the camera eases in
        tl.fromTo('#a2-r1', { y: 980, rotation: -3 }, { y: 0, rotation: 0, duration: 0.55, ease: 'expo.out' }, T(22.45));
        tl.fromTo('#a2-r2', { y: 980, rotation: 3 }, { y: 0, rotation: 0, duration: 0.55, ease: 'expo.out' }, T(22.6));
        tl.fromTo('#a2-persp', { scale: 1, transformOrigin: '1200px 520px' }, { scale: 1.06, duration: 2.6, ease: 'sine.inOut' }, T(23.1));
        SC.stamp(tl, $('a2-ok'), T(24.85), T(25.72));
        tl.to(['#a2-r1', '#a2-r2'], { y: -1000, duration: 0.32, ease: 'power3.in', stagger: 0.05 }, T(25.66));`)}`,
};

// ---------------------------------------------------------------- a3: per person? → Venue → Packages (close-up pan)
const a3 = {
  id: 'a3', start: 26, duration: 3.4, track: 1, async: true,
  css: COMMON_CSS,
  html: `${bubble('a3', 'Rohan', 'How much per person?', 110, 118)}
${sorted('a3', 196, 316)}
    <div class="aura-soft" id="a3-halo" style="left:665px;top:-110px;width:1250px;height:1300px" data-layout-ignore></div>
    <div class="persp" id="a3-persp">
${rig('a3-rig', stack('a3', ['venue', 'packages']), 'packages', 1040, 100, [['a3-t0', '₹747 for 3 · ₹249 each']])}
    </div>`,
  js: `
      var ID = 'a3', T = function (a) { return a - S0; };
      ${lifts(`
        var sv = $('a3-s0').querySelector('.app-screen'), sp = $('a3-s1').querySelector('.app-screen');
        SC.layout(sp, function () { SC.liftTag(tl, { scr: sp, liftScr: $('a3-rig-ls'), part: 'pkg-crew', tag: $('a3-t0'), wire: $('a3-t0-w'), side: 'left', dz: 70, gap: 56 }, T(28.0)); });
        tl.fromTo('#a3-halo', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'power2.out' }, T(26.04));
        tl.to('#a3-halo', { opacity: 0, duration: 0.3, ease: 'power2.in' }, T(29.12));
        SC.qBubble(tl, $('a3-q'), T(26.02), T(29.12));
        // venue screen first (hero), then packages pushes in from the right
        tl.fromTo('#a3-rig', { x: 700, rotation: 6, opacity: 0, scale: 1, transformOrigin: '50% 0%' }, { x: 0, rotation: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }, T(26.04));
        tl.fromTo('#a3-s1', { x: ${PHONE.sw} }, { x: 0, duration: 0.42, ease: 'power3.inOut' }, T(27.3));
        tl.fromTo('#a3-s0', { x: 0, opacity: 1 }, { x: -120, opacity: 0, duration: 0.42, ease: 'power3.inOut' }, T(27.3));
        // close-up: push in on the screen and pan down to the crew package
        tl.to('#a3-rig', { scale: 1.42, x: 40, y: 10, duration: 0.6, ease: 'power2.inOut' }, T(26.55));
        tl.to('#a3-rig', { y: -330, duration: 0.6, ease: 'power2.inOut' }, T(27.4));
        SC.stamp(tl, $('a3-ok'), T(28.72), T(29.12));
        tl.to('#a3-rig', { x: 300, opacity: 0, filter: 'blur(10px)', duration: 0.28, ease: 'power3.in' }, T(29.12));`)}`,
};

// ---------------------------------------------------------------- a4: open Sunday? → Date & time (top-down tilt)
const a4 = {
  id: 'a4', start: 29.4, duration: 3.4, track: 1, async: true,
  css: COMMON_CSS,
  html: `${bubble('a4', 'You', 'Is it even open Sunday evening?', 110, 372)}
${sorted('a4', 196, 600)}
    <div class="aura-soft" id="a4-halo" style="left:720px;top:-25px;width:1100px;height:1150px" data-layout-ignore></div>
    <div class="persp" id="a4-persp" style="perspective-origin: 62% 30%">
${rig('a4-rig', screen('datetime'), 'datetime', 1060, 110, [['a4-t0', 'Sunday 22'], ['a4-t1', '6:00 pm'], ['a4-t2', 'All 3 of us']])}
    </div>`,
  js: `
      var ID = 'a4', T = function (a) { return a - S0; };
      ${lifts(`
        var scr = $('a4-rig').querySelector('.phone .app-screen'), ls = $('a4-rig-ls');
        var L = [['date-sun22', 'a4-t0', 30.15, 'right'], ['slot-6pm', 'a4-t1', 30.45, 'right'], ['players', 'a4-t2', 30.75, 'right']];
        SC.layout(scr, function () { L.forEach(function (l) { SC.liftTag(tl, { scr: scr, liftScr: ls, part: l[0], tag: $(l[1]), wire: $(l[1] + '-w'), side: l[3], dz: 150, gap: 60, toX: 418 }, T(l[2])); }); });
        tl.fromTo('#a4-halo', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'power2.out' }, T(29.45));
        tl.to('#a4-halo', { opacity: 0, duration: 0.3, ease: 'power2.in' }, T(32.5));
        SC.qBubble(tl, $('a4-q'), T(29.42), T(32.52));
        // top-down tilt: the phone lies back like it's on a table, parts rise off it
        tl.fromTo('#a4-rig', { y: 900, rotationX: 10, rotationZ: 0, opacity: 0 }, { y: 0, rotationX: 34, rotationZ: -7, opacity: 1, duration: 0.6, ease: 'expo.out' }, T(29.45));
        tl.to('#a4-rig', { rotationX: 28, rotationZ: -4, duration: 2.4, ease: 'sine.inOut' }, T(30.05));
        SC.stamp(tl, $('a4-ok'), T(31.7), T(32.52));
        tl.to('#a4-rig', { y: -900, rotationX: 0, duration: 0.3, ease: 'power3.in' }, T(32.5));`)}`,
};

// ---------------------------------------------------------------- a5: who's booking? → Summary → Ticket (pop-outs)
const a5 = {
  id: 'a5', start: 32.8, duration: 4.2, track: 1, async: true,
  css: COMMON_CSS,
  html: `${bubble('a5', 'Meera', "Who's booking?", 110, 372)}
${sorted('a5', 196, 560)}
    <div class="aura-soft" id="a5-halo" style="left:705px;top:-35px;width:1050px;height:1150px" data-layout-ignore></div>
    <div class="persp" id="a5-persp">
${rig('a5-rig', stack('a5', ['summary', 'ticket']), ['summary', 'ticket'], 1020, 100, [[['a5-t0', 'One total for all 3']], [['a5-t1', "Booked. Ticket's ready."]]])}
    </div>`,
  js: `
      var ID = 'a5', T = function (a) { return a - S0; };
      ${lifts(`
        var ss = $('a5-s0').querySelector('.app-screen'), st = $('a5-s1').querySelector('.app-screen');
        SC.layout(ss, function () {
          SC.liftTag(tl, { scr: ss, liftScr: $('a5-rig-ls'), part: 'total', tag: $('a5-t0'), wire: $('a5-t0-w'), side: 'right', dz: 90 }, T(33.6));
          SC.liftTag(tl, { scr: st, liftScr: $('a5-rig-ls1'), part: 'ticket', tag: $('a5-t1'), wire: $('a5-t1-w'), side: 'right', dz: 70, gap: 56 }, T(35.5));
        });
        tl.fromTo('#a5-halo', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'power2.out' }, T(32.85));
        tl.to('#a5-halo', { opacity: 0, duration: 0.3, ease: 'power2.in' }, T(36.68));
        SC.qBubble(tl, $('a5-q'), T(32.82), T(36.68));
        tl.fromTo('#a5-rig', { x: 640, rotationY: 30, opacity: 0 }, { x: 0, rotationY: 12, opacity: 1, duration: 0.6, ease: 'power3.out' }, T(32.85));
        // pay → the summary's lifts settle back, the ticket slides up
        tl.to(['#a5-t0', '#a5-t0-w'], { opacity: 0, duration: 0.2, ease: 'power2.in' }, T(34.8));
        tl.to('#a5-rig-ls [data-lifted]', { opacity: 0, z: 0, duration: 0.25, ease: 'power2.in' }, T(34.8));
        tl.to(ss.querySelector('[data-part="total"]') || {}, { opacity: 1, duration: 0.2 }, T(34.8));
        tl.fromTo('#a5-s1', { y: ${PHONE.sh} }, { y: 0, duration: 0.45, ease: 'power3.inOut' }, T(34.95));
        tl.fromTo('#a5-s0', { opacity: 1 }, { opacity: 0, duration: 0.05, ease: 'none' }, T(35.4));
        tl.to('#a5-rig', { rotationY: 0, scale: 1.04, duration: 0.6, ease: 'power2.inOut' }, T(34.95));
        SC.stamp(tl, $('a5-ok'), T(36.05), T(36.68));
        tl.to('#a5-rig', { opacity: 0, filter: 'blur(10px)', scale: 0.92, duration: 0.3, ease: 'power3.in' }, T(36.68));`)}`,
};

export default [a1, a2, a3, a4, a5];
