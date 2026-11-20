// 19.0–35.0  HOW IT WORKS — four steps, four cameras. Bold numbered line on the left; the app answers on the right;
// key UI parts lift out with tags on marigold wires; a marigold stamp closes each step. Times are scene-local.
import { phone, screen, PHONE } from '../device.mjs';
import { I } from '../scene-icons.mjs';

const w = (s) => s.split(' ').map((x) => `<span class="w">${x}</span>`).join(' ');
const header = (p, n, l1, l2, sub, top, l2cls = 'grad-text') => `    <div class="step" id="${p}-hd" style="top:${top}px">
      <div class="num st-n" id="${p}-n">${n}</div>
      <div class="hl st-t" id="${p}-t">${w(l1)}<br />${l2.split(' ').map((x) => `<span class="w ${l2cls}">${x}</span>`).join(' ')}</div>
      <div class="sub st-s" id="${p}-s">${sub}</div>
    </div>`;
const stamp = (p, text, top) => `    <div class="sorted" id="${p}-ok" style="left:118px;top:${top}px">${I.check}<span>${text}</span></div>`;
const rig = (id, inner, names, l, t, sets) => `      <div class="rig" id="${id}" style="left:${l}px;top:${t}px;width:${PHONE.w}px;height:${PHONE.h}px">
        ${phone(inner)}
        <div class="lift" style="left:${PHONE.sx}px;top:${PHONE.sy}px;width:${PHONE.sw}px;height:${PHONE.sh}px">
${[].concat(names).map((n, k) => `          <div class="app-screen app-screen--${n} lift-scr" id="${id}-ls${k ? k : ''}" style="width:${PHONE.sw}px;height:${PHONE.sh}px">
${(sets[k] || []).map(([tid, txt]) => `            <div class="wire3d" id="${tid}-w"></div>\n            <div class="tag3d" id="${tid}"><span class="dot"></span>${txt}</div>`).join('\n')}
          </div>`).join('\n')}
        </div>
      </div>`;
const stack = (id, names) => names.map((n, i) => `<div class="stk" id="${id}-s${i}" style="position:absolute;left:0;top:0;z-index:${i + 1};isolation:isolate;overflow:hidden;width:${PHONE.sw}px;height:${PHONE.sh}px">${screen(n)}</div>`).join('');

const CSS = `
    .step { position: absolute; left: 110px; }
    .st-n { font-size: 118px; line-height: 1; color: var(--marigold); letter-spacing: -0.03em; }
    .st-t { font-size: 104px; line-height: 0.98; margin-top: 8px; }
    .st-s { font-size: 30px; margin-top: 22px; }
    .persp { perspective: 2400px; perspective-origin: 50% 50%; }`;
// header in/out, stamp in/out
const HEAD_JS = (p, out, okAt) => `
        tl.fromTo('#${p}-n', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35, ease: 'expo.out' }, 0.02);
        SC.wordsIn(tl, $('${p}-t'), 0.12, { gap: 0.1, dur: 0.18 });
        tl.fromTo('#${p}-s', { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.55);
        SC.stamp(tl, $('${p}-ok'), ${okAt}, ${out});
        tl.to(['#${p}-n', '#${p}-t', '#${p}-s'], { opacity: 0, filter: 'blur(8px)', duration: 0.22, ease: 'power3.in', stagger: 0.03 }, ${out});`;
const wrap = (id, body) => `
      document.fonts.ready.then(function () {${body}
        window.__timelines = window.__timelines || {};
        window.__timelines['${id}'] = tl;
      });`;

// ---------------------------------------------------------------- 01 Pick a vibe — Explore, 3/4 hero
const s1 = {
  id: 's1', start: 19, duration: 4, track: 1, async: true, css: CSS,
  html: `${header('s1', '01', 'Pick a', 'vibe.', 'Mood. Day. Crew.', 250)}
${stamp('s1', 'Vibe set.', 720)}
    <div class="persp">
${rig('s1-rig', screen('explore'), 'explore', 1010, 96, [[['s1-t0', 'What you feel like'], ['s1-t1', "When you're free"], ['s1-t2', "Who's coming"]]])}
    </div>`,
  js: wrap('s1', `
        var scr = $('s1-rig').querySelector('.phone .app-screen'), ls = $('s1-rig-ls');
        SC.layout(scr, function () { [['what', 's1-t0', 0.85], ['when', 's1-t1', 1.15], ['who', 's1-t2', 1.45]].forEach(function (l) {
          SC.liftTag(tl, { scr: scr, liftScr: ls, part: l[0], tag: $(l[1]), wire: $(l[1] + '-w'), side: 'right', dz: 90 }, l[2]); }); });
        tl.fromTo('#s1-rig', { x: 760, rotationY: -38, rotationX: 6, opacity: 0 }, { x: 0, rotationY: -16, rotationX: 4, opacity: 1, duration: 0.62, ease: 'power3.out' }, 0.05);
        tl.to('#s1-rig', { rotationY: -10, duration: 2.6, ease: 'sine.inOut' }, 0.67);
        var cta = scr.querySelector('[data-part="cta"]');
        if (cta) tl.fromTo(cta, { scale: 1 }, { scale: 0.95, duration: 0.08, ease: 'power2.out', yoyo: true, repeat: 1 }, 3.3);
        tl.to('#s1-rig', { x: -260, opacity: 0, filter: 'blur(10px)', duration: 0.3, ease: 'power3.in' }, 3.68);${HEAD_JS('s1', 3.66, 2.7)}`),
};

// ---------------------------------------------------------------- 02 Find it nearby — Results + Map, split screen
const s2 = {
  id: 's2', start: 23, duration: 4, track: 1, async: true, css: CSS,
  html: `${header('s2', '02', 'Find it', 'nearby.', 'Every price upfront.', 520, 'pink-text')}
${stamp('s2', 'Found it.', 930)}
    <div class="persp">
${rig('s2-r1', screen('results'), 'results', 820, 112, [[['s2-t0', 'Holodeck VR · 6.2 km']]])}
${rig('s2-r2', screen('map'), 'map', 1330, 112, [[['s2-t1', '₹249 per player']]])}
    </div>`,
  js: wrap('s2', `
        var a = $('s2-r1').querySelector('.phone .app-screen'), b = $('s2-r2').querySelector('.phone .app-screen');
        SC.layout(a, function () {
          SC.liftTag(tl, { scr: a, liftScr: $('s2-r1-ls'), part: 'card-holodeck', tag: $('s2-t0'), wire: $('s2-t0-w'), side: 'left', dz: 80, gap: 70 }, 0.85);
          SC.liftTag(tl, { scr: b, liftScr: $('s2-r2-ls'), part: 'pin-249', tag: $('s2-t1'), wire: $('s2-t1-w'), side: 'above', dz: 80, gap: 46, dim: 0.5 }, 1.2);
        });
        tl.fromTo('#s2-r1', { y: 980, rotation: -3 }, { y: 0, rotation: 0, duration: 0.55, ease: 'expo.out' }, 0.05);
        tl.fromTo('#s2-r2', { y: 980, rotation: 3 }, { y: 0, rotation: 0, duration: 0.55, ease: 'expo.out' }, 0.2);
        tl.to(['#s2-r1', '#s2-r2'], { y: -1000, duration: 0.32, ease: 'power3.in', stagger: 0.05 }, 3.62);${HEAD_JS('s2', 3.62, 2.65)}`),
};

// ---------------------------------------------------------------- 03 Pay once. For everyone. — Venue → Packages, close-up pan
const s3 = {
  id: 's3', start: 27, duration: 4, track: 1, async: true, css: CSS,
  html: `${header('s3', '03', 'Pay once.', 'For everyone.', '₹747 for three. Nobody chases anybody.', 520)}
${stamp('s3', 'Paid once.', 930)}
    <div class="persp">
${rig('s3-rig', stack('s3', ['venue', 'packages']), 'packages', 1040, 100, [[['s3-t0', '₹747 for 3 · ₹249 each']]])}
    </div>`,
  js: wrap('s3', `
        var sp = $('s3-s1').querySelector('.app-screen');
        SC.layout(sp, function () { SC.liftTag(tl, { scr: sp, liftScr: $('s3-rig-ls'), part: 'pkg-crew', tag: $('s3-t0'), wire: $('s3-t0-w'), side: 'left', dz: 70, gap: 56 }, 2.0); });
        tl.fromTo('#s3-rig', { x: 700, rotation: 6, opacity: 0, scale: 1, transformOrigin: '50% 0%' }, { x: 0, rotation: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }, 0.04);
        tl.to('#s3-rig', { scale: 1.42, x: 40, y: 10, duration: 0.6, ease: 'power2.inOut' }, 0.56);
        tl.fromTo('#s3-s1', { x: ${PHONE.sw} }, { x: 0, duration: 0.42, ease: 'power3.inOut' }, 1.3);
        tl.fromTo('#s3-s0', { x: 0, opacity: 1 }, { x: -120, opacity: 0, duration: 0.42, ease: 'power3.inOut' }, 1.3);
        tl.to('#s3-rig', { y: -330, duration: 0.6, ease: 'power2.inOut' }, 1.4);
        tl.to('#s3-rig', { x: 300, opacity: 0, filter: 'blur(10px)', duration: 0.28, ease: 'power3.in' }, 3.7);${HEAD_JS('s3', 3.66, 2.85)}`),
};

// ---------------------------------------------------------------- 04 Everyone's in. — Summary → Ticket, top-down tilt
const s4 = {
  id: 's4', start: 31, duration: 4, track: 1, async: true, css: CSS,
  html: `${header('s4', '04', "Everyone's", 'in.', 'One booking. Three tickets.', 250, 'teal-text')}
${stamp('s4', 'Booked.', 720)}
    <div class="persp" style="perspective-origin: 62% 30%">
${rig('s4-rig', stack('s4', ['summary', 'ticket']), ['summary', 'ticket'], 1060, 100, [[['s4-t0', '₹720 after Coins']], [['s4-t1', 'Tickets for all 3']]])}
    </div>`,
  js: wrap('s4', `
        var ss = $('s4-s0').querySelector('.app-screen'), stt = $('s4-s1').querySelector('.app-screen');
        SC.layout(ss, function () {
          SC.liftTag(tl, { scr: ss, liftScr: $('s4-rig-ls'), part: 'total', tag: $('s4-t0'), wire: $('s4-t0-w'), side: 'right', dz: 120, toX: 418, dim: 0 }, 0.8);
          SC.liftTag(tl, { scr: stt, liftScr: $('s4-rig-ls1'), part: 'ticket', tag: $('s4-t1'), wire: $('s4-t1-w'), side: 'right', dz: 110, toX: 418 }, 2.45);
        });
        tl.fromTo('#s4-rig', { y: 900, rotationX: 10, rotationZ: 0, opacity: 0 }, { y: 0, rotationX: 30, rotationZ: -6, opacity: 1, duration: 0.6, ease: 'expo.out' }, 0.05);
        tl.to('#s4-rig', { rotationX: 24, rotationZ: -3, duration: 3.0, ease: 'sine.inOut' }, 0.65);
        tl.to(['#s4-t0', '#s4-t0-w'], { opacity: 0, duration: 0.2, ease: 'power2.in' }, 1.85);
        tl.to('#s4-rig-ls [data-lifted]', { opacity: 0, z: 0, duration: 0.25, ease: 'power2.in' }, 1.85);
        var pay = ss.querySelector('[data-part="total"]');
        tl.fromTo('#s4-s1', { y: ${PHONE.sh} }, { y: 0, duration: 0.45, ease: 'power3.inOut' }, 2.0);
        tl.fromTo('#s4-s0', { opacity: 1 }, { opacity: 0, duration: 0.05, ease: 'none' }, 2.45);
        tl.to('#s4-rig', { y: -900, rotationX: 0, duration: 0.3, ease: 'power3.in' }, 3.68);${HEAD_JS('s4', 3.66, 3.0)}`),
};

export default [s1, s2, s3, s4];
