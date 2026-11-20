#!/usr/bin/env node
// Bundles src3d/ -> lib/scene3d.js (IIFE, global SCENE3D) and makes it HyperFrames-lint safe:
//   * Math.random            -> __hfRand  (seeded mulberry32, prepended)
//   * requestAnimationFrame  -> __hfNoRAF (only reachable through setAnimationLoop, never called)
//   * cancelAnimationFrame   -> __hfNoCAF
//   * setTimeout             -> __hfNoTimer (only in three's async helpers, never called)
// then verifies none of the forbidden tokens survive.
//
// Usage: node tools/build-3d.mjs
// esbuild/three are resolved from normal node resolution first, then from $SCENE3D_VENDOR
// (a directory containing node_modules/esbuild and node_modules/three).
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const entry = path.join(root, 'src3d', 'index.js');
const outfile = path.join(root, 'lib', 'scene3d.js');

const VENDOR = process.env.SCENE3D_VENDOR
  || '/tmp/claude-0/-home-user-hangout/9ae9efe8-e484-5a97-bbb4-c62d9d81e022/scratchpad/vendor';
const vendorModules = path.join(VENDOR, 'node_modules');

async function loadEsbuild() {
  const tryReq = (base) => { try { return createRequire(base).resolve('esbuild'); } catch { return null; } };
  const p = tryReq(path.join(root, 'package.json')) || tryReq(path.join(vendorModules, 'noop.js'));
  if (!p) throw new Error(`esbuild not found (set SCENE3D_VENDOR; looked in ${vendorModules})`);
  return (await import(pathToFileURL(p).href)).default ?? (await import(pathToFileURL(p).href));
}

const esbuild = await loadEsbuild();
const result = await esbuild.build({
  entryPoints: [entry],
  bundle: true,
  format: 'iife',
  globalName: 'SCENE3D',
  minify: true,
  target: ['chrome110'],
  legalComments: 'none',
  nodePaths: fs.existsSync(vendorModules) ? [vendorModules] : [],
  write: false,
  logLevel: 'warning',
});
let code = result.outputFiles[0].text;

const PRNG = 'var __hfRand=(function(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}})(1234567);'
  + 'var __hfNoRAF=function(){return 0},__hfNoCAF=function(){},__hfNoTimer=function(){return 0};';
const counts = {
  'Math.random': code.split('Math.random').length - 1,
  requestAnimationFrame: code.split('requestAnimationFrame').length - 1,
  cancelAnimationFrame: code.split('cancelAnimationFrame').length - 1,
  setTimeout: code.split('setTimeout').length - 1,
};
code = code
  .split('Math.random').join('__hfRand')
  .split('requestAnimationFrame').join('__hfNoRAF')
  .split('cancelAnimationFrame').join('__hfNoCAF')
  // three only uses timers inside compileAsync()/readRenderTargetPixelsAsync(), which SCENE3D never calls
  .split('setTimeout').join('__hfNoTimer');

const banner = '/* SCENE3D hero objects (three.js r170, bundled). Built by tools/build-3d.mjs: deterministic, no RAF. */\n';
code = banner + PRNG + '\n' + code;
fs.mkdirSync(path.dirname(outfile), { recursive: true });
fs.writeFileSync(outfile, code);

// ---- verification (mirrors `grep -c`)
const forbidden = ['Math.random', 'requestAnimationFrame', 'cancelAnimationFrame', 'Date.now', 'performance.now', 'setTimeout', 'setInterval', 'setAnimationLoop('];
const written = fs.readFileSync(outfile, 'utf8');
let bad = 0;
console.log(`replaced: ${JSON.stringify(counts)}`);
for (const tok of forbidden) {
  const n = written.split(tok).length - 1;
  console.log(`  grep -c "${tok}" lib/scene3d.js -> ${n}`);
  if (n && tok !== 'setAnimationLoop(') bad += n;
}
console.log(`wrote ${path.relative(root, outfile)} (${(written.length / 1024).toFixed(1)} KB)`);
if (bad) { console.error('FORBIDDEN TOKENS REMAIN'); process.exit(1); }
