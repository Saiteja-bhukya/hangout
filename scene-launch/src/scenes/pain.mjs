// 5.0–12.5  PAIN — grey group chat spiralling, chips buzzing, "SOUND FAMILIAR?", glitch, white silence.
import { phone } from '../device.mjs';
import { chatScreen } from '../chat.mjs';
import { I } from '../scene-icons.mjs';

export const PAIN_MSGS = [
  { from: 'Rohan', text: "So what's the plan this Sunday?" },
  { from: 'Meera', text: 'Bowling?' },
  { from: 'Rohan', text: 'Again?? Something new' },
  { from: 'You', text: 'Go-karting? VR? Escape room?' },
  { from: 'Meera', text: 'Which one is even near us?' },
  { from: 'Rohan', text: 'How much per person?' },
  { from: 'You', text: 'Is it even open Sunday evening?' },
  { from: 'Meera', text: "Who's booking?" },
  { from: 'Rohan', text: 'not me' },
  { from: 'Meera', text: 'not me either' },
  { divider: '2 hours later' },
  { from: 'You', text: "let's just stay home" },
  { seen: 'Seen by Meera' },
];
const TIMES = [5.45, 5.78, 6.11, 6.44, 6.77, 7.10, 7.43, 7.76, 8.09, 8.42, 8.85, 9.30, 9.75];

const CHIPS = [
  // id, icon, text, left, top, time
  ['pain-c1', 'tabs', '12 tabs open', 210, 250, 6.6],
  ['pain-c2', 'phoneMissed', '3 missed calls', 1350, 400, 7.1],
  ['pain-c3', 'rupee', 'Prices?', 330, 600, 7.6],
  ['pain-c4', 'calX', 'Fully booked?', 1390, 720, 8.1],
];

const w = (s) => s.split(' ').map((x) => `<span class="w">${x}</span>`).join(' ');

export default {
  id: 'pain', start: 5, duration: 7.5, track: 1, async: true,
  css: `
    #pain-wrap { position: absolute; inset: 0; }
    #pain-rig { left: 750px; top: 100px; width: 421px; height: 880px; }
    .pain-chip { position: absolute; }
    .pain-chip .chip-g { height: 76px; font-size: 28px; padding: 0 32px 0 18px; color: #3A4250; }
    .pain-chip .chip-g .ic { width: 48px; height: 48px; background: #8A94A3; }
    .pain-chip .chip-g .ic svg { width: 26px; height: 26px; }
    #pain-badge { position: absolute; left: 1222px; top: 128px; min-width: 112px; height: 78px; padding: 0 22px; border-radius: 999px; background: #4A5566; color: #fff; display: flex; align-items: center; justify-content: center; font: 700 46px 'Rajdhani', sans-serif; letter-spacing: 0.02em; box-shadow: 0 14px 30px rgba(40, 50, 70, 0.28), inset 0 0 0 3px #ECEEF1; }
    #pain-sf { position: absolute; left: 1010px; top: 360px; font-size: 112px; line-height: 1.02; }
    #pain-glitch { position: absolute; inset: 0; opacity: 0; }
    #pain-glitch i { position: absolute; left: 0; right: 0; display: block; }
    #pain-white { position: absolute; inset: 0; background: #fff; opacity: 0; }
    #pain-easier { position: absolute; left: 0; right: 0; top: 500px; text-align: center; font-size: 72px; letter-spacing: 0.08em; }`,
  html: `    <div id="pain-wrap">
      <div class="rig" id="pain-rig">${phone(chatScreen(PAIN_MSGS, { p: 'pain', variant: 'grey' }))}</div>
      <div id="pain-badge">1</div>
${CHIPS.map(([id, ic, txt, l, t]) => `      <div class="pain-chip" id="${id}" style="left:${l}px;top:${t}px"><div class="chip-g glass"><span class="ic">${I[ic]}</span>${txt}</div></div>`).join('\n')}
      <div class="hl" id="pain-sf">${w('SOUND')}<br />${w('FAMILIAR?')}</div>
    </div>
    <div id="pain-glitch" data-layout-ignore>
      <i style="top:180px;height:46px;background:rgba(90,107,128,.55)"></i>
      <i style="top:430px;height:18px;background:rgba(11,26,46,.6)"></i>
      <i style="top:610px;height:70px;background:rgba(255,255,255,.85)"></i>
      <i style="top:860px;height:26px;background:rgba(90,107,128,.5)"></i>
    </div>
    <div id="pain-white"></div>
    <div class="hl" id="pain-easier">${w("THERE'S AN EASIER WAY.")}</div>`,
  js: `
      var T = function (a) { return a - S0; };
      var TIMES = ${JSON.stringify(TIMES)};
      var CHIPS = ${JSON.stringify(CHIPS.map((c) => [c[0], c[5]]))};
      document.fonts.ready.then(function () {
        // --- phone enters, then the camera pushes in on the newest messages
        tl.fromTo('#pain-rig', { y: 220, opacity: 0, scale: 1, transformOrigin: '210px 757px' },
          { y: 0, opacity: 1, duration: 0.45, ease: 'expo.out' }, T(5.0));
        tl.to('#pain-rig', { scale: 1.5, duration: 0.6, ease: 'power2.inOut' }, T(5.55));

        // --- messages: measure once, then each arrival lifts the list by its own height
        var items = [];
        for (var i = 0; i < TIMES.length; i++) items.push($('pain-m' + i));
        var gap = 8, h = items.map(function (el) { return el.offsetHeight + gap; });
        var below = function (k) { var s = 0; for (var j = k + 1; j < h.length; j++) s += h[j]; return s; };
        tl.set('#pain-list', { y: below(-1) }, 0);
        items.forEach(function (el, k) {
          var t = T(TIMES[k]);
          tl.to('#pain-list', { y: below(k), duration: 0.24, ease: 'power3.out' }, t);
          var mine = el.classList.contains('ch-mine');
          tl.fromTo(el, { opacity: 0, scale: 0.86, transformOrigin: mine ? '100% 100%' : '0% 100%' },
            { opacity: 1, scale: 1, duration: 0.26, ease: 'back.out(1.6)' }, t);
        });

        // --- unread badge climbs to 99+
        var badge = $('pain-badge'), cnt = { v: 1 };
        tl.fromTo('#pain-badge', { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, T(5.5));
        tl.fromTo(cnt, { v: 1 }, { v: 99, duration: 2.95, ease: 'power2.in', onUpdate: function () {
          badge.textContent = cnt.v >= 98.5 ? '99+' : String(Math.max(1, Math.round(cnt.v)));
        } }, T(5.5));
        [6.6, 7.1, 7.6, 8.1].forEach(function (t) {
          tl.fromTo('#pain-badge', { scale: 1.18 }, { scale: 1, duration: 0.2, ease: 'power2.out' }, T(t));
        });

        // --- grey chips float in around the phone, each with a buzz
        CHIPS.forEach(function (c, k) {
          var t = T(c[1]);
          tl.fromTo('#' + c[0], { opacity: 0, scale: 0.6, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.42, ease: 'back.out(1.5)' }, t);
          tl.to('#' + c[0], { y: (k % 2 ? 16 : -16), duration: T(10.0) - t - 0.4, ease: 'sine.inOut' }, t + 0.42);
          tl.fromTo('#pain-rig', { rotation: 0 }, { rotation: 0.6, duration: 0.05, ease: 'none', yoyo: true, repeat: 3 }, t);
        });

        // --- chips and badge leave; phone slides left; SOUND FAMILIAR? lands on the right
        tl.to(CHIPS.map(function (c) { return '#' + c[0]; }).concat(['#pain-badge']), { opacity: 0, filter: 'blur(8px)', duration: 0.22, ease: 'power3.in', stagger: 0.03 }, T(10.0));
        tl.to('#pain-rig', { x: -390, duration: 0.5, ease: 'power3.inOut' }, T(10.12));
        SC.wordsIn(tl, $('pain-sf'), T(10.32), { gap: 0.16, dur: 0.18 });

        // --- glitch 11.25–11.35 (three stuttered frames)
        tl.set('#pain-glitch', { opacity: 1 }, T(11.25));
        tl.set('#pain-wrap', { x: 26, skewX: 6, filter: 'contrast(1.6) brightness(1.15)' }, T(11.25));
        tl.set('#pain-wrap', { x: -34, skewX: -4 }, T(11.2834));
        tl.set('#pain-glitch i', { x: 60 }, T(11.2834));
        tl.set('#pain-wrap', { x: 14, skewX: 0, filter: 'contrast(2.2) brightness(1.35)' }, T(11.3167));
        tl.set('#pain-glitch i', { x: -40 }, T(11.3167));

        // --- white silence: THERE'S AN EASIER WAY.
        tl.set('#pain-white', { opacity: 1 }, T(11.35));
        tl.set(['#pain-wrap', '#pain-glitch'], { opacity: 0 }, T(11.35));
        SC.wordsIn(tl, $('pain-easier'), T(11.6), { gap: 0.12, dur: 0.2 });

        window.__timelines = window.__timelines || {};
        window.__timelines['pain'] = tl;
      });`,
};
