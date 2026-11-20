// 48.0–54.0  PAYOFF — the same chat, now bright: You share the booking card; the crew replies. LESS PLANNING. MORE SCENES.
import { phone } from '../device.mjs';
import { chatScreen } from '../chat.mjs';

const MSGS = [
  { from: 'Rohan', text: "So what's the plan this Sunday?" },
  { from: 'Meera', text: 'Bowling?' },
  { from: 'You', text: 'Check this' },
  { from: 'You', card: true },
  { from: 'Rohan', text: "Wait, it's booked already??" },
  { from: 'Meera', text: 'Finally!! See you at 6' },
  { from: 'Rohan', text: 'Same plan next Sunday?' },
];
// first two are already on screen (context); the rest arrive
const TIMES = [null, null, 48.45, 48.75, 49.75, 50.55, 51.35];
const w = (s) => s.split(' ').map((x) => `<span class="w">${x}</span>`).join(' ');

export default {
  id: 'payoff', start: 48, duration: 6, track: 1, async: true,
  css: `
    #po-rig { left: 300px; top: 100px; width: 421px; height: 880px; }
    #po-hl { position: absolute; left: 1040px; top: 300px; font-size: 110px; line-height: 1.04; }`,
  html: `    <div class="rig" id="po-rig">${phone(chatScreen(MSGS, { p: 'po', variant: 'colour' }))}</div>
    <div class="hl" id="po-hl"><span class="w">LESS</span><br /><span class="w">PLANNING.</span><br /><span class="w">MORE</span><br /><span class="w grad-text">SCENES.</span></div>`,
  js: `
      var T = function (a) { return a - S0; };
      var TIMES = ${JSON.stringify(TIMES)};
      document.fonts.ready.then(function () {
        // phone carries in from the right, camera settles pushed-in on the conversation
        tl.fromTo('#po-rig', { x: 260, y: 40, opacity: 0, scale: 1.0, transformOrigin: '210px 757px' },
          { x: 0, y: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }, T(48.0));
        tl.to('#po-rig', { scale: 1.42, x: 90, duration: 0.6, ease: 'power2.inOut' }, T(48.55));

        var items = [], gap = 8;
        for (var i = 0; i < TIMES.length; i++) items.push($('po-m' + i));
        var h = SC.layout(items[0], function () { return items.map(function (el) { return el.offsetHeight + gap; }); });
        var below = function (k) { var s = 0; for (var j = k + 1; j < h.length; j++) s += h[j]; return s; };
        tl.set('#po-list', { y: below(1) }, 0);
        items.forEach(function (el, k) {
          if (TIMES[k] == null) return;
          var t = T(TIMES[k]);
          tl.to('#po-list', { y: below(k), duration: 0.26, ease: 'power3.out' }, t);
          var mine = el.classList.contains('ch-mine');
          tl.fromTo(el, { opacity: 0, scale: 0.86, transformOrigin: mine ? '100% 100%' : '0% 100%' },
            { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.6)' }, t);
        });
        SC.wordsIn(tl, $('po-hl'), T(50.1), { gap: 0.16, dur: 0.2 });
        window.__timelines = window.__timelines || {};
        window.__timelines['payoff'] = tl;
      });`,
};
