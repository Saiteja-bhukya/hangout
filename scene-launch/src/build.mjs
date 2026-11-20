// Builds index.html and compositions/*.html from the scene modules in src/scenes/.
// Run: node src/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { SCENES, AUDIO, DURATION } = await import('./scenes/index.mjs');
const { THEME, THEME_KEY } = await import('./theme.mjs');

fs.mkdirSync(path.join(root, 'compositions'), { recursive: true });

function sceneFile(s) {
  return `<template>
  <style>
    #root { position: absolute; inset: 0; overflow: hidden; }
${s.css || ''}
  </style>
  <div id="root" data-composition-id="${s.id}" data-width="1920" data-height="1080"${s.rootAttrs ? ' ' + s.rootAttrs : ''}>
${s.html}
  </div>
  <script>
    (function () {
      var S0 = ${s.start}, S1 = ${+(s.start + s.duration).toFixed(4)}, D = ${s.duration};
      var $ = function (id) { return document.getElementById(id); };
      var tl = gsap.timeline({ paused: true });
${s.js || ''}
${s.async ? '      // (registered at the end of its async build above)' : `      window.__timelines = window.__timelines || {};
      window.__timelines["${s.id}"] = tl;`}
    })();
  </script>
</template>
`;
}

for (const s of SCENES) {
  fs.writeFileSync(path.join(root, 'compositions', `${s.id}.html`), sceneFile(s));
}

const has3d = fs.existsSync(path.join(root, 'lib/scene3d.js'));
const hosts = SCENES.map((s, i) => `      <div
        id="${s.id}"
        class="clip"
        data-composition-id="${s.id}"
        data-composition-src="compositions/${s.id}.html"
        data-start="${s.start}"
        data-duration="${s.duration}"
        data-track-index="${s.track}"
        data-track-kind="graphics"
        data-width="1920"
        data-height="1080"
        style="z-index: ${s.z ?? i + 1}"
      ></div>`).join('\n');

const audio = (AUDIO || []).map((a) => `      <audio id="${a.id}" class="clip" src="${a.src}" data-start="${a.start}" data-duration="${a.duration}" data-track-index="${a.track}" data-volume="${a.volume ?? 1}"${a.mediaStart != null ? ` data-media-start="${a.mediaStart}"` : ''}></audio>`).join('\n');

const index = `<!doctype html>
<html lang="en"${THEME.mode === 'dark' ? ' class="dark"' : ''}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>SCENE — launch film</title>
    <link rel="stylesheet" href="assets/fonts/fonts.css" />
    <link rel="stylesheet" href="assets/css/brand.css" />
    <link rel="stylesheet" href="assets/css/app.css" />
    <link rel="stylesheet" href="assets/css/chat.css" />
${THEME.mode === 'dark' ? '    <link rel="stylesheet" href="assets/css/dark.css" />\n' : ''}
    <style>
      /* secondary colour: ${THEME.label} */
      :root { --s-rgb: ${THEME.s.join(', ')}; --s2-rgb: ${THEME.s2.join(', ')}; --b3-rgb: ${THEME.b3.join(', ')}; --aura-grad: ${THEME.grad}; }
    </style>
    <script>window.SC_THEME = ${JSON.stringify({ key: THEME_KEY, rim: THEME.rim, particles: THEME.particles })};</script>
    <script src="lib/gsap.min.js"></script>
    <script src="lib/film.js"></script>
${has3d ? '    <script src="lib/scene3d.js"></script>\n' : ''}    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: #EEF3FA; }
      #root { position: relative; width: 1920px; height: 1080px; overflow: hidden; background: #EEF3FA; font-family: 'Inter', sans-serif; }
    </style>
  </head>
  <body>
    <div
      id="root"
      data-composition-id="main"
      data-start="0"
      data-duration="${DURATION}"
      data-width="1920"
      data-height="1080"
    >
${hosts}
${audio}
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`;
fs.writeFileSync(path.join(root, 'index.html'), index);
console.log(`[theme ${THEME_KEY}] built index.html + ${SCENES.length} scenes (${SCENES.map((s) => s.id).join(', ')})${has3d ? '' : ' [no lib/scene3d.js yet]'}`);
