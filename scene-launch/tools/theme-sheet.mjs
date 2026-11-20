// Composes review/themes/<theme>-<t>.png into review/theme-options.jpg: one row per secondary colour.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { THEMES } from '../src/theme.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rows = [['rose', 'A'], ['lime', 'B'], ['gold', 'C']];
const times = ['3', '14', '24', '56.9'];
const hex = (c) => '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();
const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="../assets/fonts/fonts.css"><style>
*{margin:0;box-sizing:border-box} body{width:3000px;background:#0B1A2E;padding:36px 40px;font-family:Inter;color:#EAF2FF}
.row{display:grid;grid-template-columns:300px repeat(4,656px);gap:16px;align-items:center;margin-bottom:28px}
.row img{width:656px;height:369px;display:block;border-radius:8px}
.k{font:800 64px Urbanist;color:#36D6F2;line-height:1}.n{font:700 30px Rajdhani;letter-spacing:.12em;text-transform:uppercase;margin:10px 0 14px}
.sw{display:flex;gap:8px}.sw i{width:52px;height:52px;border-radius:12px;display:block;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.25)}
.sw small{display:block;font:600 14px Rajdhani;letter-spacing:.06em;color:#8FA3BF;margin-top:6px}
.hd{display:grid;grid-template-columns:300px repeat(4,656px);gap:16px;font:700 22px Rajdhani;letter-spacing:.16em;color:#8FA3BF;margin-bottom:12px}
</style></head><body>
<div class="hd"><span></span>${times.map((t) => `<span>${t} S</span>`).join('')}</div>
${rows.map(([k, l]) => { const T = THEMES[k]; return `<div class="row"><div><div class="k">${l}</div><div class="n">${T.label}</div>
<div class="sw"><div><i style="background:#12B3DA"></i><small>#12B3DA</small></div><div><i style="background:#2F6BFF"></i><small>#2F6BFF</small></div><div><i style="background:${hex(T.s)}"></i><small>${hex(T.s)}</small></div></div></div>
${times.map((t) => `<img src="../review/themes/${k}-${t}.png">`).join('')}</div>`; }).join('')}
</body></html>`;
const out = path.join(root, 'tools/_theme-sheet.html');
fs.writeFileSync(out, html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 3000, height: 800 }, deviceScaleFactor: 1 });
await p.goto(pathToFileURL(out).href);
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: path.join(root, 'review/theme-options.jpg'), fullPage: true, type: 'jpeg', quality: 88 });
await b.close();
console.log('wrote review/theme-options.jpg');
