// 0.0–4.0  OPEN — "we should hang out", said by everyone, all at once. Then: Said every group chat. Ever.
const SAYS = [
  // who, text, x, y, font px, rotation, time
  ['Rohan', 'we should hang out', 700, 430, 60, -2, 0.0],
  ['Meera', 'we NEED to hang out', 160, 170, 44, 3, 0.85],
  ['Kabir', 'we should hang out this weekend', 1080, 210, 39, -3, 1.22],
  ['Zoya', 'ok but we should hang out', 230, 700, 47, 2, 1.52],
  ['Dev', 'hang out soon?', 1270, 640, 52, -4, 1.76],
  ['Asha', 'we should totally hang out', 640, 860, 39, 1, 1.95],
  ['Rohan', 'we should hang out fr', 1340, 900, 36, 3, 2.1],
  ['Meera', 'hang out?? anyone??', 120, 470, 36, -2, 2.22],
  ['Kabir', 'we should hang out!!', 1330, 470, 42, 2, 2.32],
];
export const OPEN_TIMES = SAYS.map((s) => s[6]);
const w = (s) => s.split(' ').map((x) => `<span class="w">${x}</span>`).join(' ');

export default {
  id: 'open', start: 0, duration: 4, track: 1,
  css: `
    #op-says { position: absolute; inset: 0; }
    #op-hl { position: absolute; left: 0; right: 0; top: 330px; text-align: center; font-size: 150px; line-height: 1.04; }`,
  html: `    <div id="op-says">
${SAYS.map(([who, t, x, y, fs, r], i) => `      <div class="say" id="op-s${i}" style="left:${x}px;top:${y}px"><div class="av av-${who.toLowerCase()}">${who[0]}</div><div class="b" style="font-size:${fs}px"><span class="n">${who}</span>${t}</div></div>`).join('\n')}
    </div>
    <div class="hl" id="op-hl">${w('Said every group chat.')}<br /><span class="w grad-text">Ever.</span></div>`,
  js: `
      var SAYS = ${JSON.stringify(SAYS.map((s) => [s[5], s[6]]))};
      SAYS.forEach(function (s, i) {
        if (i === 0) { tl.set('#op-s0', { rotation: s[0], transformOrigin: '0% 100%' }, 0); return; } // on screen from the first frame
        tl.fromTo('#op-s' + i, { opacity: 0, scale: 0.6, rotation: s[0] * 2, transformOrigin: '0% 100%' },
          { opacity: 1, scale: 1, rotation: s[0], duration: 0.3, ease: 'back.out(1.8)' }, s[1]);
      });
      // the chatter falls back; the line lands
      tl.to('#op-says', { opacity: 0.16, scale: 0.94, filter: 'blur(6px)', duration: 0.35, ease: 'power2.inOut' }, 2.5);
      SC.wordsIn(tl, $('op-hl'), 2.62, { gap: 0.11, dur: 0.18 });`,
};
