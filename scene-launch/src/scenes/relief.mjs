// 12.5–15.0  RELIEF — colour floods back on the drop; icon bursts in, wordmark wipes in, PLAN IT. BOOK IT. PLAY IT.
import { icon, wordmark } from '../logo.mjs';

export default {
  id: 'relief', start: 12.5, duration: 2.5, track: 1,
  css: `
    #rl-white { position: absolute; inset: 0; background: #fff; }
    #rl-flood { left: 960px; top: 470px; width: 2600px; height: 2600px; margin: -1300px 0 0 -1300px; }
    #rl-aura { left: 960px; top: 470px; width: 1200px; height: 1200px; margin: -600px 0 0 -600px; }
    #rl-rays { left: 960px; top: 470px; width: 1700px; height: 1700px; margin: -850px 0 0 -850px; }
    #rl-ring { left: 960px; top: 470px; width: 340px; height: 340px; margin: -170px 0 0 -170px; border-radius: 30%; }
    #rl-icon { position: absolute; left: 820px; top: 330px; width: 280px; height: 280px; filter: drop-shadow(0 30px 50px rgba(30,60,120,0.28)); }
    #rl-word { position: absolute; left: 820px; top: 450px; width: 0; height: 100px; overflow: hidden; }
    #rl-word-in { width: 529px; height: 100px; }
    #rl-tag { position: absolute; left: 0; right: 0; top: 690px; text-align: center; font-size: 70px; letter-spacing: 0.08em; }`,
  html: `    <div class="aura" id="rl-flood" data-layout-ignore></div>
    <div id="rl-white" data-layout-ignore></div>
    <div class="aura-rays" id="rl-rays" data-layout-ignore></div>
    <div class="aura" id="rl-aura" data-layout-ignore></div>
    <div class="aura-ring" id="rl-ring" data-layout-ignore></div>
    <div id="rl-icon">${icon('rl')}</div>
    <div id="rl-word"><div id="rl-word-in">${wordmark('rlw')}</div></div>
    <div class="hl" id="rl-tag"><span class="w">PLAN IT.</span> <span class="w">BOOK IT.</span> <span class="w grad-text">PLAY IT.</span></div>`,
  js: `
      var T = function (a) { return a - S0; };
      // the white silence floods away into colour
      tl.fromTo('#rl-white', { opacity: 1 }, { opacity: 0, duration: 0.42, ease: 'power2.inOut' }, T(12.5));
      tl.fromTo('#rl-flood', { scale: 0.05, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.9, ease: 'expo.out' }, T(12.5));
      // the aura: blooms with the icon, then rests behind the lockup while its rays turn slowly
      tl.fromTo('#rl-aura', { scale: 0.2, opacity: 0 }, { scale: 1.1, opacity: 1, duration: 0.5, ease: 'expo.out' }, T(12.55));
      tl.to('#rl-aura', { scale: 1.3, opacity: 0.55, x: -40, duration: 0.8, ease: 'power2.inOut' }, T(13.0));
      tl.fromTo('#rl-rays', { scale: 0.4, opacity: 0, rotation: -10 }, { scale: 1, opacity: 0.9, rotation: 0, duration: 0.6, ease: 'expo.out' }, T(12.58));
      tl.to('#rl-rays', { rotation: 28, opacity: 0.4, duration: 1.8, ease: 'none' }, T(13.18));
      // icon bursts in with a light ring
      tl.fromTo('#rl-icon', { scale: 0.4, opacity: 0, rotation: -8 }, { scale: 1.08, opacity: 1, rotation: 0, duration: 0.26, ease: 'back.out(1.8)' }, T(12.55));
      tl.to('#rl-icon', { scale: 1, duration: 0.2, ease: 'power2.out' }, T(12.81));
      tl.fromTo('#rl-ring', { scale: 0.7, opacity: 0.95 }, { scale: 2.3, opacity: 0, duration: 0.6, ease: 'expo.out' }, T(12.56));
      // lockup: icon slides left and shrinks, wordmark wipes in from the left
      tl.to('#rl-icon', { x: -287, y: 30, scale: 0.72, duration: 0.45, ease: 'power3.inOut' }, T(12.95));
      tl.fromTo('#rl-word', { width: 0 }, { width: 529, duration: 0.45, ease: 'power3.out' }, T(13.12));
      // tagline, phrase by phrase on the beat
      SC.wordsIn(tl, $('rl-tag'), T(13.45), { gap: 0.2, dur: 0.18 });`,
};
