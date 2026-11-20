/* SCENE film — shared, deterministic helpers for the scene timelines.
   Everything here is a pure function of timeline time: no clocks, no timers, no unseeded randomness. */
(function () {
  var SC = (window.SC = window.SC || {});

  /* seeded PRNG (mulberry32) */
  SC.rng = function (seed) {
    var a = seed | 0;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  /* word-by-word blur-in for every .w inside `el` (no translate: titles land still) */
  SC.wordsIn = function (tl, el, t0, opts) {
    opts = opts || {};
    var gap = opts.gap == null ? 0.12 : opts.gap;
    var dur = opts.dur == null ? 0.16 : opts.dur;
    var ws = el.querySelectorAll('.w');
    for (var i = 0; i < ws.length; i++) {
      tl.fromTo(ws[i], { opacity: 0, filter: 'blur(8px)' },
        { opacity: 1, filter: 'blur(0px)', duration: dur, ease: 'power2.out' }, t0 + i * gap);
    }
    return t0 + (ws.length - 1) * gap + dur;
  };
  SC.wordsOut = function (tl, el, t0, opts) {
    opts = opts || {};
    var gap = opts.gap == null ? 0.04 : opts.gap;
    var dur = opts.dur == null ? 0.14 : opts.dur;
    var ws = el.querySelectorAll('.w');
    for (var i = 0; i < ws.length; i++) {
      tl.to(ws[i], { opacity: 0, filter: 'blur(8px)', duration: dur, ease: 'power3.in' }, t0 + i * gap);
    }
  };

  /* Drive a canvas / 3D stage from this scene's timeline time.
     Draws from a linear proxy tween's onUpdate (Studio playback) and from hf-seek (frame capture:
     it fires after the timeline is seeked, so tl.time() is scene-local). Deduplicated per time. */
  SC.drive = function (tl, absStart, absEnd, draw) {
    var D = absEnd - absStart, last = null, pr = { t: 0 };
    function go(t) { if (t === last) return; last = t; draw(t); }
    tl.fromTo(pr, { t: 0 }, { t: D, duration: D, ease: 'none', onUpdate: function () { go(tl.time()); } }, 0);
    window.addEventListener('hf-seek', function (e) {
      var T = e && e.detail ? e.detail.time : 0;
      if (T < absStart - 0.0001 || T > absEnd + 0.0001) return;
      go(tl.time());
    });
  };

  /* Run fn with every display:none ancestor of el temporarily shown, so layout can be measured
     while the scene is inactive (scenes are hidden outside their window when scripts run). */
  SC.layout = function (el, fn) {
    var fixed = [];
    for (var n = el; n && n.nodeType === 1; n = n.parentElement) {
      if (getComputedStyle(n).display === 'none') {
        fixed.push([n, n.style.getPropertyValue('display'), n.style.getPropertyPriority('display')]);
        n.style.setProperty('display', 'block', 'important');
      }
    }
    try { return fn(); } finally {
      for (var i = fixed.length - 1; i >= 0; i--) {
        var f = fixed[i];
        if (f[1]) f[0].style.setProperty('display', f[1], f[2]); else f[0].style.removeProperty('display');
      }
    }
  };

  /* easing helpers for code-driven motion */
  SC.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  SC.prog = function (t, a, b) { return SC.clamp((t - a) / (b - a), 0, 1); };
  SC.easeOutExpo = function (x) { return x >= 1 ? 1 : 1 - Math.pow(2, -10 * x); };
  SC.easeOutBack = function (x, s) { s = s == null ? 1.7 : s; var c3 = s + 1; return 1 + c3 * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
  SC.easeInOut = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  /* pop-in scale 0.6 -> 1.05 -> 1 over `dur` seconds (brief §4) */
  SC.popScale = function (t, t0, dur) {
    dur = dur || 0.32;
    var x = (t - t0) / dur;
    if (x <= 0) return 0.6;
    if (x >= 1) return 1;
    if (x < 0.56) return 0.6 + 0.45 * SC.easeOutExpo(x / 0.56);
    return 1.05 - 0.05 * SC.easeInOut((x - 0.56) / 0.44);
  };

  /* Lift a data-part out of a phone screen: clones it into a lift layer at the same place.
     scr: the .app-screen element; liftScr: the .lift-scr wrapper that sits exactly over that screen.
     Call before building tweens (measures layout once). Returns geometry in screen CSS px. */
  SC.liftPart = function (scr, part, liftScr) {
    var orig = scr.querySelector('[data-part="' + part + '"]');
    if (!orig) return null;
    var rs = scr.getBoundingClientRect(), ro = orig.getBoundingClientRect();
    var k = scr.offsetWidth / rs.width;
    var x = (ro.left - rs.left) * k, y = (ro.top - rs.top) * k, w = ro.width * k, h = ro.height * k;
    var clone = orig.cloneNode(true);
    clone.removeAttribute('data-part');
    clone.setAttribute('data-lifted', part);
    var cs = clone.style;
    cs.position = 'absolute'; cs.left = x + 'px'; cs.top = y + 'px'; cs.width = w + 'px'; cs.height = h + 'px';
    cs.margin = '0'; cs.opacity = '0'; cs.boxSizing = 'border-box';
    liftScr.appendChild(clone);
    return { clone: clone, orig: orig, x: x, y: y, w: w, h: h };
  };

  /* Lift + glass tag + thin wire, animated at time t (scene-local).
     o: { scr, liftScr, part, tag (element), wire (element), side: 'right'|'left'|'above'|'below', gap, dz, dim } */
  SC.liftTag = function (tl, o, t) {
    var g = SC.liftPart(o.scr, o.part, o.liftScr);
    if (!g) return null;
    var tag = o.tag, wire = o.wire, gap = o.gap == null ? 64 : o.gap, dz = o.dz == null ? 90 : o.dz;
    var tw = tag.offsetWidth, th = tag.offsetHeight, cx = g.x + g.w / 2, cy = g.y + g.h / 2;
    var tx, ty, wx, wy, wl, vertical = false;
    if (o.side === 'left') { tx = g.x - gap - tw; ty = cy - th / 2; wx = g.x - gap; wy = cy; wl = gap; }
    else if (o.side === 'above') { tx = cx - tw / 2; ty = g.y - gap - th; wx = cx; wy = g.y - gap; wl = gap; vertical = true; }
    else if (o.side === 'below') { tx = cx - tw / 2; ty = g.y + g.h + gap; wx = cx; wy = g.y + g.h; wl = gap; vertical = true; }
    else { tx = g.x + g.w + gap; ty = cy - th / 2; wx = g.x + g.w; wy = cy; wl = gap; }
    if (o.dx) tx += o.dx; if (o.dy) ty += o.dy;
    tag.style.left = tx + 'px'; tag.style.top = ty + 'px';
    wire.style.left = wx + 'px'; wire.style.top = (wy - 1) + 'px';
    if (vertical) { wire.style.width = '2px'; wire.style.height = wl + 'px'; wire.style.left = (wx - 1) + 'px'; }
    else { wire.style.width = wl + 'px'; }
    if (o.side === 'left') wire.classList.add('l');
    tl.set(g.clone, { opacity: 1 }, t);
    tl.fromTo(g.clone, { z: 0, scale: 1 }, { z: dz, scale: o.scale == null ? 1.14 : o.scale, duration: 0.42, ease: 'expo.out' }, t);
    tl.to(g.orig, { opacity: o.dim == null ? 0.22 : o.dim, duration: 0.2, ease: 'power2.out' }, t);
    var wo = vertical ? (o.side === 'above' ? '50% 100%' : '50% 0%') : (o.side === 'left' ? '100% 50%' : '0% 50%');
    tl.fromTo(wire, { opacity: 0, z: dz, scaleX: vertical ? 1 : 0, scaleY: vertical ? 0 : 1, transformOrigin: wo },
      { opacity: 1, scaleX: 1, scaleY: 1, duration: 0.2, ease: 'power2.out' }, t + 0.16);
    tl.fromTo(tag, { opacity: 0, z: dz, filter: 'blur(8px)', scale: 0.92 },
      { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 0.26, ease: 'expo.out' }, t + 0.26);
    return g;
  };

  /* Question bubble in/out and the SORTED stamp */
  SC.qBubble = function (tl, el, tin, tout) {
    tl.fromTo(el, { opacity: 0, x: -60, scale: 0.9, transformOrigin: '0% 100%' }, { opacity: 1, x: 0, scale: 1, duration: 0.42, ease: 'back.out(1.4)' }, tin);
    tl.to(el, { opacity: 0, filter: 'blur(8px)', duration: 0.22, ease: 'power3.in' }, tout);
  };
  SC.stamp = function (tl, el, t, tout) {
    tl.fromTo(el, { opacity: 0, scale: 1.7, rotation: -10 }, { opacity: 1, scale: 1, rotation: -4, duration: 0.24, ease: 'back.out(1.7)' }, t);
    tl.to(el, { opacity: 0, filter: 'blur(8px)', duration: 0.2, ease: 'power3.in' }, tout);
  };
})();
