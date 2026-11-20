#!/usr/bin/env node
// Renders every SCENE3D hero object to review/objects/<name>.png (1024x1024, transparent),
// composites the 4x2 review sheet review/objects-sheet.png, exports assets/renders/vr-hero.png,
// and runs a determinism check + a 1000x1000 timing pass on the heaviest object (claw).
//
// Usage: node tools/render-objects.mjs [--only kart,claw] [--no-sheet] [--no-checks] [--default-cam]
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const outDir = path.join(root, 'review', 'objects');
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.join(root, 'assets', 'renders'), { recursive: true });

const args = process.argv.slice(2);
const only = (() => { const i = args.indexOf('--only'); return i >= 0 ? args[i + 1].split(',') : null; })();
const doSheet = !args.includes('--no-sheet') && !only;
const doChecks = !args.includes('--no-checks') && !only;
const defaultCam = args.includes('--default-cam');

// review poses: action that reads best at a glance, plus framing tweaks
const POSES = {
  kart: { action: 0.06 },
  bowling: { action: 0.6 },
  vr: { action: 0 },
  trampoline: { action: 0.22, elevation: 0.42 },
  claw: { action: 0.16 },
  controller: { action: 0 },
  padlock: { action: 0.8 },
  cricket: { action: 0.36 },
  coin: { action: 0 },
};
const SHEET = ['kart', 'bowling', 'vr', 'trampoline', 'claw', 'controller', 'padlock', 'cricket'];

const ms = (t0) => Number(process.hrtime.bigint() - t0) / 1e6;
const writeDataUrl = (file, url) => fs.writeFileSync(file, Buffer.from(url.split(',')[1], 'base64'));

async function launch(extraArgs = []) {
  const browser = await chromium.launch({ args: extraArgs });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1200 }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('[pageerror]', e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.error(`[${m.type()}]`, m.text()); });
  await page.goto(pathToFileURL(path.join(here, 'harness.html')).href);
  await page.waitForFunction(() => window.harnessReady === true);
  return { browser, page };
}

let { browser, page } = await launch();
// sanity: make sure WebGL actually draws (fall back to SwiftShader flags otherwise)
const probe = await page.evaluate(() => {
  const url = window.renderOne('coin', { w: 64, h: 64 });
  return url.length;
});
if (probe < 1500) {
  console.log('blank canvas, retrying with SwiftShader flags');
  await browser.close();
  ({ browser, page } = await launch(['--use-angle=swiftshader', '--enable-unsafe-swiftshader']));
}

const names = only || [...SHEET, 'coin'];
for (const name of names) {
  const pose = POSES[name] || {};
  const t0 = process.hrtime.bigint();
  const url = await page.evaluate(([n, p]) => window.renderOne(n, p), [name, { w: 1024, h: 1024, ...pose, camera: defaultCam ? 'default' : undefined }]);
  writeDataUrl(path.join(outDir, `${name}.png`), url);
  console.log(`${name.padEnd(11)} -> review/objects/${name}.png  (${ms(t0).toFixed(0)} ms incl. build)`);
}

// VR hero for the app's Venue screen: 1200x900, ~80% fill
if (!only || only.includes('vr')) {
  const url = await page.evaluate(() => window.renderOne('vr', { w: 1200, h: 900, action: 0, rotY: -0.12, fill: 0.78, elevation: 0.2 }));
  writeDataUrl(path.join(root, 'assets', 'renders', 'vr-hero.png'), url);
  console.log('vr hero   -> assets/renders/vr-hero.png');
}

if (doChecks) {
  // determinism: same object/action twice must be byte-identical
  for (const [n, a] of [['claw', 0.5], ['bowling', 0.6], ['coin', 0.3]]) {
    const [u1, u2] = await page.evaluate(([nn, aa]) => [
      window.renderOne(nn, { w: 512, h: 512, action: aa }),
      window.renderOne(nn, { w: 512, h: 512, action: aa }),
    ], [n, a]);
    console.log(`determinism ${n}@${a}: ${u1 === u2 ? 'byte-identical' : 'DIFFERENT'} (${u1.length} b64 chars)`);
  }
  // timing at 1000x1000 on the heaviest object
  for (const n of ['claw', 'bowling']) {
    const t0 = process.hrtime.bigint();
    await page.evaluate(([nn]) => window.setupTiming(nn, 1000, 1000, 0.3), [n]);
    await page.evaluate(() => window.renderTimed(0.3)); // first frame compiles shaders
    const first = ms(t0);
    const times = [];
    for (let i = 0; i < 6; i++) {
      const t1 = process.hrtime.bigint();
      await page.evaluate((a) => window.renderTimed(a), 0.3 + i * 0.1);
      times.push(ms(t1));
    }
    const tris = await page.evaluate(() => window.timingStage.stage.renderer.info.render.triangles);
    console.log(`timing ${n} 1000x1000: setup+first ${first.toFixed(0)} ms; steady ${times.map((x) => x.toFixed(0)).join(', ')} ms; ${tris} tris/frame`);
  }
}
await browser.close();

if (doSheet) {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 2400, height: 1400 }, deviceScaleFactor: 1 });
  await p.goto(pathToFileURL(path.join(here, 'sheet.html')).href);
  await p.evaluate(() => window.sheetReady);
  await p.screenshot({ path: path.join(root, 'review', 'objects-sheet.png'), fullPage: true });
  await b.close();
  console.log('sheet     -> review/objects-sheet.png');
}
