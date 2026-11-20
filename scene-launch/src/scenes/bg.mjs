// Light world: #EEF3FA with three large soft blobs that drift slowly; a cool-grey version crossfades in for the Pain section.
const blobs = [
  // id, left, top, size, colour, grey, drift keyframes [x,y] at 0/20/40/60 s
  ['bg-b1', -380, -520, 1500, '#C9DBFF', '#D9DDE3', [[0, 0], [160, 90], [60, 180], [200, 60]]],
  ['bg-b2', 1060, 260, 1400, '#BFF1FA', '#E2E5E9', [[0, 0], [-140, -80], [-60, -170], [-180, -40]]],
  ['bg-b3', 180, 520, 1300, 'VAR', '#D6D9DF', [[0, 0], [120, -110], [220, -30], [90, -140]]],
];
const radial = (c) => c === 'VAR'
  ? 'radial-gradient(circle at 50% 50%, rgba(var(--b3-rgb),1) 0%, rgba(var(--b3-rgb),0.9) 22%, rgba(var(--b3-rgb),0.5) 44%, rgba(var(--b3-rgb),0) 70%)'
  : `radial-gradient(circle at 50% 50%, ${c} 0%, ${c}E6 22%, ${c}80 44%, ${c}00 70%)`;

export default {
  id: 'bg', start: 0, duration: 60, track: 0, z: 0,
  css: `
    #bg-base { position: absolute; inset: 0; background: #EEF3FA; }
    #bg-base-g { position: absolute; inset: 0; background: #ECEEF1; opacity: 0; }
    .bg-blob { position: absolute; }
    .bg-blob .bc, .bg-blob .bgr { position: absolute; inset: 0; border-radius: 50%; }
    .bg-blob .bgr { opacity: 0; }`,
  html: blobs.map(([id, l, t, sz, c, g]) => `    <div class="bg-blob" id="${id}" style="left:${l}px;top:${t}px;width:${sz}px;height:${sz}px"><div class="bc" style="background:${radial(c)}"></div><div class="bgr" style="background:${radial(g)}"></div></div>`)
    .join('\n').replace(/^/, '    <div id="bg-base"></div>\n    <div id="bg-base-g"></div>\n'),
  js: `
      ${JSON.stringify(blobs.map((b) => [b[0], b[6]]))}.forEach(function (b) {
        var k = b[1];
        tl.fromTo('#' + b[0], { x: k[0][0], y: k[0][1] }, { x: k[1][0], y: k[1][1], duration: 20, ease: 'sine.inOut' }, 0);
        tl.to('#' + b[0], { x: k[2][0], y: k[2][1], duration: 20, ease: 'sine.inOut' }, 20);
        tl.to('#' + b[0], { x: k[3][0], y: k[3][1], duration: 20, ease: 'sine.inOut' }, 40);
      });
      // Pain: desaturate to cool grey at 5.0 s; colour floods back at 12.5 s
      tl.fromTo(['#bg-base-g', '#bg-b1 .bgr', '#bg-b2 .bgr', '#bg-b3 .bgr'], { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.inOut' }, 5.0);
      tl.to(['#bg-base-g', '#bg-b1 .bgr', '#bg-b2 .bgr', '#bg-b3 .bgr'], { opacity: 0, duration: 0.4, ease: 'power2.inOut' }, 12.5);`,
};
