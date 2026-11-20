// Renders review/logo.png: the toli mark on night and on cream.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { icon, wordmark } from '../src/logo.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="../assets/fonts/fonts.css"><style>
*{margin:0;box-sizing:border-box} body{width:1600px;height:900px;overflow:hidden;background:#0F0A1C;font-family:Inter;position:relative;color:#FFF3E2}
.big{position:absolute;left:110px;top:170px;width:440px;height:440px}
.lock{position:absolute;left:660px;top:250px;display:flex;align-items:center;gap:40px}
.lock .i{width:170px;height:170px}.lock .w{width:330px;height:171px}
.tag{position:absolute;left:666px;top:470px;font:800 52px 'Bricolage Grotesque';letter-spacing:-0.01em}
.tag b{color:#FFB627}
.def{position:absolute;left:668px;top:550px;font:500 22px Inter;color:#A99BBF}
.def i{font-style:normal;color:#FFF3E2;font-weight:600}
.cream{position:absolute;right:90px;bottom:90px;width:360px;height:220px;border-radius:36px;background:#FFF3E2;display:flex;align-items:center;justify-content:center;gap:22px}
.cream .i{width:110px;height:110px}.cream .w{width:150px;height:78px}
.sw{position:absolute;left:110px;bottom:90px;display:flex;gap:14px}.sw div{width:120px}.sw i{display:block;height:64px;border-radius:14px}.sw small{display:block;font:600 14px Inter;color:#A99BBF;margin-top:8px}
</style></head><body>
<div class="big">${icon('a')}</div>
<div class="lock"><div class="i">${icon('b')}</div><div class="w">${wordmark('c')}</div></div>
<div class="tag">Get the <b>toli</b> out.</div>
<div class="def"><i>toli</i> (टोली) · noun · your crew, your gang of friends.</div>
<div class="cream"><div class="i">${icon('d')}</div><div class="w">${wordmark('e', { color: '#0F0A1C' })}</div></div>
<div class="sw">${[['#0F0A1C','Night'],['#FFB627','Marigold'],['#FF3D81','Rani pink'],['#20C9B5','Teal'],['#FFF3E2','Cream']].map(([c,n])=>`<div><i style="background:${c};box-shadow:inset 0 0 0 1.5px rgba(255,243,226,.15)"></i><small>${n} ${c}</small></div>`).join('')}</div>
</body></html>`;
const out = path.join(root, 'tools/_logo-sheet.html'); fs.writeFileSync(out, html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
await p.goto(pathToFileURL(out).href); await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: path.join(root, 'review/logo.png') }); await b.close(); console.log('wrote review/logo.png');
