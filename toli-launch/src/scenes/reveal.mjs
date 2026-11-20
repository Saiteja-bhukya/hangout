// 12.0–15.0  REVEAL — three circles (three friends) fly in from three sides and collide on the drop: the toli mark.
// The wordmark wipes in; "Plans that actually happen."
import { icon, wordmark, WM } from '../logo.mjs';
const w = (s) => s.split(' ').map((x) => `<span class="w">${x}</span>`).join(' ');
const WMH = 200, WMW = Math.round(WM.W / WM.H * WMH);

export default {
  id: 'reveal', start: 12, duration: 3, track: 1,
  css: `
    #rv-icon { position: absolute; left: 810px; top: 320px; width: 300px; height: 300px; }
    #rv-sq { position: absolute; inset: 0; border-radius: 28%; background: linear-gradient(180deg, #2C1C48, #150C26); box-shadow: inset 0 0 0 2px rgba(255,243,226,0.12), 0 30px 70px rgba(0,0,0,0.55); }
    #rv-circles { position: absolute; inset: 0; }
    #rv-circles svg { overflow: visible; }
    #rv-word { position: absolute; left: 910px; top: 372px; width: 0; height: ${WMH}px; overflow: hidden; }
    #rv-word-in { width: ${WMW}px; height: ${WMH}px; }
    #rv-tag { position: absolute; left: 0; right: 0; top: 660px; text-align: center; font-size: 78px; }`,
  html: `    <div id="rv-icon"><div id="rv-sq"></div><div id="rv-circles">${icon('rv', { bg: false })}</div></div>
    <div id="rv-word"><div id="rv-word-in">${wordmark('rvw')}</div></div>
    <div class="hl" id="rv-tag">${w('Plans that actually')} <span class="w grad-text">happen.</span></div>`,
  js: `
      var T = function (a) { return a - S0; };
      // three friends arrive from three sides and meet on the beat (12.5)
      tl.fromTo('#rv-c0', { x: -2300, y: -200 }, { x: 0, y: 0, duration: 0.5, ease: 'power3.in' }, T(12.0));
      tl.fromTo('#rv-c1', { x: 2300, y: -200 }, { x: 0, y: 0, duration: 0.5, ease: 'power3.in' }, T(12.0));
      tl.fromTo('#rv-c2', { x: 0, y: 1500 }, { x: 0, y: 0, duration: 0.5, ease: 'power3.in' }, T(12.0));
      tl.fromTo('#rv-circles', { scale: 1 }, { scale: 1.12, duration: 0.07, ease: 'power2.out', yoyo: true, repeat: 1 }, T(12.5));
      tl.fromTo('#rv-sq', { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.32, ease: 'back.out(1.7)' }, T(12.53));
      // lockup: the icon slides left as the wordmark wipes in; the dot drops onto the i
      tl.to('#rv-icon', { x: -214, scale: 0.8, duration: 0.45, ease: 'power3.inOut' }, T(12.95));
      tl.fromTo('#rv-word', { width: 0 }, { width: ${WMW}, duration: 0.45, ease: 'power3.out' }, T(13.1));
      tl.fromTo('#rvw-dot', { y: -260, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42, ease: 'bounce.out' }, T(13.3));
      SC.wordsIn(tl, $('rv-tag'), T(13.75), { gap: 0.11, dur: 0.18 });`,
};
