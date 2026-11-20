// Usage:
//   node render.js svg  <in.svg>  <out.png> <targetWidth>
//   node render.js html <in.html> <outDir>        (page calls window.__jobs: [{name,w,h}] and window.__draw(name) returning a canvas/elt id)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const [mode, inp, out, tw] = process.argv.slice(2);
  const browser = await chromium.launch();
  if (mode === 'svg') {
    const files = fs.statSync(inp).isDirectory() ? fs.readdirSync(inp).filter(f => f.endsWith('.svg')).map(f => path.join(inp, f)) : [inp];
    for (const f of files) {
      const src = fs.readFileSync(f, 'utf8');
      const m = src.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
      const vw = parseFloat(m[1]), vh = parseFloat(m[2]);
      const W = parseInt(tw, 10), scale = W / vw, H = Math.round(vh * scale);
      const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
      const svg = src.replace(/width="[\d.]+" height="[\d.]+"/, `width="${W}" height="${H}"`);
      await page.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
      const target = fs.statSync(inp).isDirectory() ? path.join(out, path.basename(f).replace('.svg', '.png')) : out;
      await page.screenshot({ path: target, omitBackground: true, clip: { x: 0, y: 0, width: W, height: H } });
      await page.close();
      console.log('wrote', target, W + 'x' + H);
    }
  } else if (mode === 'html') {
    const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
    await page.goto('file://' + path.resolve(inp));
    await page.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
    const jobs = await page.evaluate(() => window.__jobs);
    fs.mkdirSync(out, { recursive: true });
    for (const j of jobs) {
      const dataUrl = await page.evaluate(n => window.__draw(n), j.name);
      const b64 = dataUrl.split(',')[1];
      const file = path.join(out, j.file || (j.name + '.png'));
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, Buffer.from(b64, 'base64'));
      console.log('wrote', file);
    }
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
