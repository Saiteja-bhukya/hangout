// Composes review/style-frames/*.png into review/style-frames.jpg (2 columns, labelled).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const T = [['3', 'HOOK'], ['9', 'PAIN'], ['14', 'RELIEF'], ['24', 'ANSWERS · NEAR US?'], ['42', 'REWARDS · LEVEL UP'], ['51', 'PAYOFF']];
const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="../assets/fonts/fonts.css"><style>
*{margin:0;box-sizing:border-box} body{width:2600px;background:#0B1A2E;padding:40px;display:grid;grid-template-columns:1240px 1240px;gap:40px 40px}
figure img{width:1240px;height:697.5px;display:block;border-radius:10px} figcaption{font:700 26px Rajdhani;letter-spacing:.16em;color:#EAF2FF;margin-top:12px}
figcaption b{color:#36D6F2;margin-right:16px}</style></head><body>
${T.map(([t, l]) => `<figure><img src="../review/style-frames/frame-${t}s.png"><figcaption><b>${t} s</b>${l}</figcaption></figure>`).join('')}</body></html>`;
const out = path.join(root, 'tools/_style-sheet.html');
fs.writeFileSync(out, html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 2600, height: 800 }, deviceScaleFactor: 1 });
await p.goto(pathToFileURL(out).href);
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: path.join(root, 'review/style-frames.jpg'), fullPage: true, type: 'jpeg', quality: 90 });
await b.close();
console.log('wrote review/style-frames.jpg');
