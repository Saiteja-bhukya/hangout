// Renders all 12 SCENE app screens inside phone() frames to a contact sheet.
//   node tools/screens-sheet.mjs            -> review/screens-sheet.png + review/screens/<name>.png (dsf 2)
//   node tools/screens-sheet.mjs --dsf 1    -> quicker check renders at 1×
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { SCREENS, screen, phone } from '../src/screens.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const dsf = args.includes('--dsf') ? Number(args[args.indexOf('--dsf') + 1]) : 2;
const only = args.includes('--only') ? args[args.indexOf('--only') + 1].split(',') : null;

const COLS = 6;
const PHONE_W = 421, PHONE_H = 880, GAP_X = 64, GAP_Y = 70, PAD = 90, LABEL_H = 64;
const W = PAD * 2 + COLS * PHONE_W + (COLS - 1) * GAP_X;
const H = PAD * 2 + 2 * (PHONE_H + LABEL_H) + GAP_Y;

const cells = SCREENS.map((name, i) => `
  <figure class="cell">
    ${phone(screen(name), { id: `ph-${name}` })}
    <figcaption>${String(i + 1).padStart(2, '0')}&nbsp;&nbsp;${name.toUpperCase()}</figcaption>
  </figure>`).join('');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<base href="../">
<link rel="stylesheet" href="assets/fonts/fonts.css">
<link rel="stylesheet" href="assets/css/app.css">
<title>SCENE screens</title>
<style>
  html, body { margin: 0; padding: 0; }
  body { width: ${W}px; height: ${H}px; background: #EEF3FA; position: relative; overflow: hidden; }
  .blob { position: absolute; border-radius: 50%; filter: blur(120px); opacity: .85; }
  .grid { position: absolute; left: ${PAD}px; top: ${PAD}px; display: grid;
          grid-template-columns: repeat(${COLS}, ${PHONE_W}px); column-gap: ${GAP_X}px; row-gap: ${GAP_Y}px; }
  figure.cell { margin: 0; display: flex; flex-direction: column; align-items: center; }
  figcaption { height: ${LABEL_H}px; padding-top: 24px; box-sizing: border-box; font-family: 'Rajdhani', sans-serif;
               font-weight: 700; font-size: 26px; letter-spacing: .14em; color: #0B1A2E; }
</style></head>
<body>
  <div class="blob" style="left:-200px;top:-260px;width:1300px;height:1000px;background:#C9DBFF"></div>
  <div class="blob" style="left:1300px;top:500px;width:1200px;height:1000px;background:#BFF1FA"></div>
  <div class="blob" style="left:2300px;top:-300px;width:1100px;height:900px;background:#D9CCFF"></div>
  <div class="blob" style="left:300px;top:1300px;width:1100px;height:900px;background:#D9CCFF;opacity:.6"></div>
  <div class="grid">${cells}</div>
</body></html>`;

const sheetPath = join(ROOT, 'tools', '_screens-sheet.html');
writeFileSync(sheetPath, html);
mkdirSync(join(ROOT, 'review', 'screens'), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: dsf });
await page.goto(pathToFileURL(sheetPath).href, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(150);

// sanity: fonts + overflow checks
const report = await page.evaluate(() => {
  const out = { fonts: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight}`), issues: [] };
  for (const scr of document.querySelectorAll('.app-screen')) {
    const sr = scr.getBoundingClientRect();
    if (Math.round(sr.width) !== 393 || Math.round(sr.height) !== 852) out.issues.push(`${scr.className}: size ${sr.width}x${sr.height}`);
    if (scr.querySelector('[id]')) out.issues.push(`${scr.className}: has id inside`);
  }
  return out;
});
console.log('fonts loaded:', [...new Set(report.fonts)].join(', '));
if (report.issues.length) console.log('ISSUES:\n' + report.issues.join('\n'));

if (!only) {
  await page.screenshot({ path: join(ROOT, 'review', 'screens-sheet.png'), fullPage: false });
  console.log('wrote review/screens-sheet.png', `${W}x${H} @${dsf}x`);
}
for (const name of only || SCREENS) {
  const box = await page.$eval(`#ph-${name}`, (el) => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
  const m = 10; // include the side buttons (they protrude 3px)
  await page.screenshot({ path: join(ROOT, 'review', 'screens', `${name}.png`), clip: { x: box.x - m, y: box.y - m, width: box.width + 2 * m, height: box.height + 2 * m } });
}
console.log('wrote review/screens/*.png');
await browser.close();
