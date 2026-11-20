// 46.0–51.0  PAYOFF — the same crew chat, alive: You share the booking; the crew replies. Less planning. More hanging out.
import { phone } from '../device.mjs';
import { chatScreen } from '../chat.mjs';

const MSGS = [
  { from: 'Rohan', text: 'so… sunday?' },
  { from: 'Meera', text: 'maybe' },
  { from: 'You', text: 'done. check this' },
  { from: 'You', card: true },
  { from: 'Rohan', text: "wait, it's booked already??" },
  { from: 'Meera', text: 'finally!! see you at 6' },
  { from: 'Kabir', text: 'same time next sunday?' },
];
// first two are already on screen (context); the rest arrive
const TIMES = [null, null, 46.4, 46.7, 47.55, 48.25, 48.95];
const w = (s) => s.split(' ').map((x) => `<span class="w">${x}</span>`).join(' ');

export default {
  id: 'payoff', start: 46, duration: 5, track: 1, async: true,
  css: `
    #po-rig { left: 300px; top: 100px; width: 421px; height: 880px; }
    #po-hl { position: absolute; left: 1020px; top: 290px; font-size: 118px; line-height: 1.0; }`,
  html: `    <div class="aura-soft" id="po-halo" style="left:25px;top:-65px;width:1150px;height:1250px" data-layout-ignore></div>
    <div class="rig" id="po-rig">${phone(chatScreen(MSGS, { p: 'po', variant: 'colour', title: 'Weekend squad', members: ['Rohan', 'Meera', 'Kabir', 'Zoya', 'You'] }))}</div>
    <div class="hl" id="po-hl"><span class="w">Less</span><br /><span class="w">planning.</span><br /><span class="w">More</span><br /><span class="w grad-text">hanging</span> <span class="w grad-text">out.</span></div>`,
  js: `
      var T = function (a) { return a - S0; };
      var TIMES = ${JSON.stringify(TIMES)};
      document.fonts.ready.then(function () {
        // phone carries in from the right, camera settles pushed-in on the conversation
        tl.fromTo('#po-rig', { x: 260, y: 40, opacity: 0, scale: 1.0, transformOrigin: '210px 757px' },
          { x: 0, y: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }, T(46.0));
        tl.to('#po-rig', { scale: 1.42, x: 90, duration: 0.6, ease: 'power2.inOut' }, T(46.55));

        tl.fromTo('#po-halo', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, T(46.1));
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
        SC.wordsIn(tl, $('po-hl'), T(48.1), { gap: 0.16, dur: 0.2 });
        window.__timelines = window.__timelines || {};
        window.__timelines['payoff'] = tl;
      });`,
};
