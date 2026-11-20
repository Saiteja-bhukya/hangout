// Renders review/logo.png: the logo on the brand's light world and on a dark device tile.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { icon, wordmark } from '../src/logo.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="../assets/fonts/fonts.css">
<style>
*{margin:0;box-sizing:border-box} body{width:1600px;height:900px;overflow:hidden;background:#EEF3FA;font-family:Inter;position:relative}
.blob{position:absolute;border-radius:50%;filter:blur(110px)}
.lbl{font:700 18px Rajdhani;letter-spacing:.16em;color:#5A6B80;text-transform:uppercase}
.big{position:absolute;left:120px;top:150px;width:420px;height:420px;filter:drop-shadow(0 30px 50px rgba(30,60,120,.28))}
.lock{position:absolute;left:660px;top:230px;display:flex;align-items:center;gap:34px}
.lock .i{width:150px;height:150px;filter:drop-shadow(0 16px 30px rgba(30,60,120,.25))}
.lock .w{width:420px;height:80px}
.tag{position:absolute;left:664px;top:420px;font:800 30px Urbanist;letter-spacing:.08em;color:#0B1A2E}
.tag b{background:linear-gradient(90deg,#2F6BFF,#12B3DA);-webkit-background-clip:text;color:transparent}
.sm{position:absolute;left:664px;top:540px;display:flex;align-items:flex-end;gap:28px}
.dark{position:absolute;right:110px;top:520px;width:300px;height:260px;border-radius:44px;background:#080D16;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;box-shadow:0 24px 60px rgba(30,60,120,.25)}
.dark .i{width:120px;height:120px}
</style></head><body>
<div class="blob" style="width:900px;height:900px;left:-250px;top:-350px;background:#C9DBFF"></div>
<div class="blob" style="width:800px;height:800px;left:900px;top:350px;background:#BFF1FA"></div>
<div class="blob" style="width:700px;height:700px;left:300px;top:500px;background:#D9CCFF"></div>
<div class="lbl" style="position:absolute;left:120px;top:80px">SCENE · brand mark · built in SVG</div>
<div class="big">${icon('a')}</div>
<div class="lock"><div class="i">${icon('b')}</div><div class="w">${wordmark('c')}</div></div>
<div class="tag">PLAN IT. BOOK IT. <b>PLAY IT.</b></div>
<div class="sm">${[96,64,40,24].map((s,i)=>`<div style="width:${s}px;height:${s}px">${icon('s'+i)}</div>`).join('')}</div><div class="lbl" style="position:absolute;left:664px;top:670px">96 · 64 · 40 · 24 px</div>
<div class="dark"><div class="i">${icon('d')}</div><div class="lbl" style="color:#8FA3BF">on device</div></div>
</body></html>`;
const out = path.join(root, 'tools/_logo-sheet.html');
fs.writeFileSync(out, html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
await p.goto(pathToFileURL(out).href);
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: path.join(root, 'review/logo.png') });
await b.close();
console.log('wrote review/logo.png');
