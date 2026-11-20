// 8.2–12.0  PLANS DIE — the crew chat fizzles out. "Plans die in the group chat." Then the screen falls silent.
import { phone } from '../device.mjs';
import { chatScreen } from '../chat.mjs';

export const PAIN_MSGS = [
  { from: 'Rohan', text: 'so… sunday?' },
  { from: 'Meera', text: 'maybe' },
  { from: 'Kabir', text: "who's booking?" },
  { from: 'Zoya', text: 'not me' },
  { from: 'Rohan', text: 'not me either' },
  { divider: 'Sunday, 11:48 pm' },
  { from: 'Meera', text: 'next weekend then?' },
  { seen: 'Seen by 4' },
];
export const PAIN_TIMES = [8.45, 8.72, 8.98, 9.2, 9.4, 9.75, 10.0, 10.25];
const w = (s) => s.split(' ').map((x) => `<span class="w">${x}</span>`).join(' ');

export default {
  id: 'pain', start: 8.2, duration: 3.8, track: 1, async: true,
  css: `
    #pain-rig { left: 330px; top: 100px; width: 421px; height: 880px; }
    #pain-hl { position: absolute; left: 1000px; top: 300px; font-size: 128px; line-height: 1.0; }
    #pain-black { position: absolute; inset: 0; background: #000; opacity: 0; }`,
  html: `    <div class="rig" id="pain-rig">${phone(chatScreen(PAIN_MSGS, { p: 'pain', variant: 'grey', title: 'Weekend squad', members: ['Rohan', 'Meera', 'Kabir', 'Zoya', 'You'] }))}</div>
    <div class="hl" id="pain-hl">${w('Plans die')}<br />${w('in the')}<br /><span class="w pink-text">group</span> <span class="w pink-text">chat.</span></div>
    <div id="pain-black" data-layout-ignore></div>`,
  js: `
      var T = function (a) { return a - S0; };
      var TIMES = ${JSON.stringify(PAIN_TIMES)};
      document.fonts.ready.then(function () {
        tl.fromTo('#pain-rig', { y: 900, rotation: -4, scale: 1, transformOrigin: '210px 757px' }, { y: 0, rotation: 0, duration: 0.45, ease: 'expo.out' }, T(8.2));
        tl.to('#pain-rig', { scale: 1.38, duration: 0.55, ease: 'power2.inOut' }, T(8.55));
        var items = []; for (var i = 0; i < TIMES.length; i++) items.push($('pain-m' + i));
        var gap = 8, h = SC.layout(items[0], function () { return items.map(function (el) { return el.offsetHeight + gap; }); });
        var below = function (k) { var s = 0; for (var j = k + 1; j < h.length; j++) s += h[j]; return s; };
        tl.set('#pain-list', { y: below(-1) }, 0);
        items.forEach(function (el, k) {
          var t = T(TIMES[k]); tl.to('#pain-list', { y: below(k), duration: 0.22, ease: 'power3.out' }, t);
          var mine = el.classList.contains('ch-mine');
          tl.fromTo(el, { opacity: 0, scale: 0.86, transformOrigin: mine ? '100% 100%' : '0% 100%' }, { opacity: 1, scale: 1, duration: 0.24, ease: 'back.out(1.6)' }, t);
        });
        SC.wordsIn(tl, $('pain-hl'), T(10.3), { gap: 0.12, dur: 0.18 });
        // the plan dies: the chat drops away, everything goes quiet
        tl.to('#pain-rig', { y: 1100, rotation: 9, duration: 0.5, ease: 'power3.in' }, T(11.45));
        tl.to('#pain-hl', { opacity: 0, duration: 0.3, ease: 'power2.in' }, T(11.6));
        tl.fromTo('#pain-black', { opacity: 0 }, { opacity: 1, duration: 0.15, ease: 'none' }, T(11.85));
        window.__timelines = window.__timelines || {};
        window.__timelines['pain'] = tl;
      });`,
};
