// 54.0–60.0  END — ~140 particles converge into the S; icon, wordmark, line; a light streak; fade to white (overlay).
import { icon, wordmark, LOGO } from '../logo.mjs';
const w = (s) => s.split(' ').map((x) => `<span class="w">${x}</span>`).join(' ');

// final icon box on screen
const IC = { x: 820, y: 250, s: 280 };

export default {
  id: 'end', start: 54, duration: 6, track: 1,
  css: `
    #end-cv { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    #end-icon { position: absolute; left: ${IC.x}px; top: ${IC.y}px; width: ${IC.s}px; height: ${IC.s}px; filter: drop-shadow(0 30px 50px rgba(30,60,120,0.26)); }
    #end-flash { position: absolute; left: ${IC.x + IC.s / 2 - 260}px; top: ${IC.y + IC.s / 2 - 260}px; width: 520px; height: 520px; border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(111,232,250,0.5) 35%, rgba(111,232,250,0) 70%); }
    #end-word { position: absolute; left: 696px; top: 586px; width: 0; height: 100px; overflow: hidden; }
    #end-word-in { width: 529px; height: 100px; }
    #end-line { position: absolute; left: 0; right: 0; top: 766px; text-align: center; font-size: 54px; letter-spacing: 0.08em; }
    #end-streak { position: absolute; left: -700px; top: -200px; width: 380px; height: 1480px;
      background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0) 100%); }`,
  html: `    <canvas id="end-cv" width="1920" height="1080" data-layout-ignore></canvas>
    <div id="end-flash" data-layout-ignore></div>
    <div id="end-icon">${icon('end')}</div>
    <div id="end-word"><div id="end-word-in">${wordmark('endw')}</div></div>
    <div class="hl" id="end-line">${w('MAKE EVERY OUTING AN')} <span class="w grad-text">EXPERIENCE.</span></div>
    <div id="end-streak" data-layout-ignore></div>`,
  js: `
      var T = function (a) { return a - S0; };
      var IC = ${JSON.stringify(IC)}, SD = ${JSON.stringify(LOGO.sD)}, SIZE = ${LOGO.SIZE};
      // --- sample 140 target points inside the S (deterministic grid + seeded jitter)
      var off = document.createElement('canvas'); off.width = SIZE; off.height = SIZE;
      var octx = off.getContext('2d'), path = new Path2D(SD), rnd = SC.rng(20251122), pts = [];
      for (var gy = 0; gy < SIZE; gy += 9) for (var gx = 0; gx < SIZE; gx += 9) {
        var px = gx + rnd() * 6, py = gy + rnd() * 6;
        if (octx.isPointInPath(path, px, py)) pts.push([px, py]);
      }
      var N = 140, P = [], k = IC.s / SIZE, cols = ['#FFFFFF', '#6FE8FA', '#36A9FF', '#2F6BFF', '#B7A9FF'];
      for (var i = 0; i < N; i++) {
        var tp = pts[Math.floor(i * pts.length / N)];
        var a = rnd() * Math.PI * 2, r = 620 + rnd() * 700;
        P.push({ tx: IC.x + tp[0] * k, ty: IC.y + tp[1] * k, sx: 960 + Math.cos(a) * r, sy: 400 + Math.sin(a) * r * 0.62,
          d: rnd() * 0.32, curl: (rnd() - 0.5) * 380, s: 2.4 + rnd() * 3.6, c: cols[Math.floor(rnd() * cols.length)] });
      }
      var cv = $('end-cv'), ctx = cv.getContext('2d');
      function draw(t) {
        ctx.clearRect(0, 0, 1920, 1080);
        var fade = 1 - SC.prog(t, T(55.05), T(55.4));
        if (fade <= 0) return;
        for (var i = 0; i < N; i++) {
          var p = P[i], x = SC.prog(t, T(54.0) + p.d, T(54.0) + p.d + 0.85), e = SC.easeInOut(x);
          var bend = Math.sin(Math.PI * e) * p.curl;
          var dx = p.tx - p.sx, dy = p.ty - p.sy, len = Math.sqrt(dx * dx + dy * dy) || 1;
          var X = p.sx + dx * e + (-dy / len) * bend, Y = p.sy + dy * e + (dx / len) * bend;
          var alpha = Math.min(1, x * 4) * fade, rad = p.s * (1.25 - 0.45 * e);
          ctx.globalAlpha = alpha * 0.35; ctx.fillStyle = p.c;
          ctx.beginPath(); ctx.arc(X, Y, rad * 2.6, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = alpha; ctx.beginPath(); ctx.arc(X, Y, rad, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      SC.drive(tl, S0, S1, draw);

      // --- the mark resolves on the impact
      tl.fromTo('#end-flash', { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.18, ease: 'power2.out' }, T(54.98));
      tl.to('#end-flash', { opacity: 0, scale: 1.5, duration: 0.6, ease: 'power2.out' }, T(55.16));
      tl.fromTo('#end-icon', { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 0.34, ease: 'back.out(1.6)' }, T(55.0));
      tl.fromTo('#end-word', { width: 0 }, { width: 529, duration: 0.55, ease: 'power3.out' }, T(55.6));
      SC.wordsIn(tl, $('end-line'), T(56.3), { gap: 0.11, dur: 0.18 });
      tl.fromTo('#end-streak', { x: 0, skewX: -18 }, { x: 3000, skewX: -18, duration: 0.75, ease: 'power2.inOut' }, T(57.6));`,
};
