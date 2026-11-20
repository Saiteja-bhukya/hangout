// 2. Bowling: deep-blue swirl ball striking three white pins.
// Ball rolls along +x. action 0 = ball approaching from the left, 0.45 = impact, 1 = pins mid-fall.
import {
  Group, Mesh, LatheGeometry, Vector2, Vector3, SphereGeometry, CylinderGeometry, CircleGeometry,
  TorusGeometry, SplineCurve, BufferGeometry, Float32BufferAttribute, Quaternion, Color, DoubleSide,
} from 'three';
import { makeCanvas, canvasTexture, shadowBlob, seg, easeOut, easeIn, lerp, TAU, clamp01 } from '../util.js';
import { PALETTE } from '../materials.js';

const PIN_H = 1.0;
// Regulation pin profile (inches, radius vs height), height 15in.
const PROFILE_IN = [
  [1.0, 0.04], [1.42, 0.7], [1.83, 1.7], [2.18, 2.9], [2.383, 4.4], [2.31, 5.6], [2.06, 6.7],
  [1.66, 7.75], [1.24, 8.7], [0.97, 9.55], [0.9, 10.15], [0.96, 10.85], [1.1, 11.6], [1.24, 12.5],
  [1.272, 13.25], [1.16, 14.0], [0.86, 14.6], [0.45, 14.93], [0.0, 15.0],
];
const STRIPES_IN = [[10.05, 10.42], [10.72, 11.09]];

function pinProfile() {
  const k = PIN_H / 15;
  const curve = new SplineCurve(PROFILE_IN.map(([r, y]) => new Vector2(r * k, y * k)));
  const pts = [new Vector2(0, 0), new Vector2(0.9 * k, 0), new Vector2(1.0 * k, 0.04 * k)];
  const sampled = curve.getPoints(150);
  for (let i = 1; i < sampled.length; i++) pts.push(sampled[i]);
  pts[pts.length - 1].x = 0;
  return pts;
}

/** Lathe band hugging the pin profile between heights a..b (inches), slightly proud of the surface. */
function bandGeometry(pts, a, b) {
  const k = PIN_H / 15, y0 = a * k, y1 = b * k;
  const rAt = (y) => {
    for (let j = 1; j < pts.length; j++) {
      if (pts[j].y >= y && pts[j - 1].y <= y && pts[j].y > pts[j - 1].y) {
        const u = (y - pts[j - 1].y) / (pts[j].y - pts[j - 1].y);
        return lerp(pts[j - 1].x, pts[j].x, u);
      }
    }
    return 0;
  };
  const prof = [];
  const N = 8;
  for (let i = 0; i <= N; i++) { const y = lerp(y0, y1, i / N); prof.push(new Vector2(rAt(y) * 1.012 + 0.0015, y)); }
  return new LatheGeometry(prof, 64);
}

function swirlTexture() {
  const W = 1024, H = 512;
  const c = makeCanvas(W, H);
  const g = c.getContext('2d');
  const img = g.createImageData(W, H);
  const deep = new Color('#8A0E3E'), mid = new Color('#FF3D81'), lil = new Color(PALETTE.cyan);
  const tmp = new Color();
  const d = img.data;
  for (let py = 0; py < H; py++) {
    const v = py / H;
    for (let px = 0; px < W; px++) {
      const u = px / W;
      // periodic-in-u domain warp => seamless marble swirl
      const w1 = Math.sin(TAU * u + 3.1 * v * 3.0) * 1.6;
      const w2 = Math.sin(TAU * 2 * u - 4.3 * v * 2.0 + 1.3) * 0.9;
      const ph = TAU * 2 * u + 5.2 * Math.sin(TAU * u + 2.6 * v * 2.2 + w2) + 7.5 * v + w1;
      const s = Math.sin(ph);
      const band = clamp01((s - 0.6) / 0.3);
      const vein = clamp01((Math.sin(ph * 2.0 + 1.1) - 0.9) / 0.08) * 0.5;
      const glow = clamp01((s + 0.2) / 0.9) * 0.45;
      tmp.copy(deep).lerp(mid, glow).lerp(lil, Math.min(1, band * band * (3 - 2 * band) + vein));
      const i = (py * W + px) * 4;
      d[i] = Math.round(tmp.r * 255); d[i + 1] = Math.round(tmp.g * 255); d[i + 2] = Math.round(tmp.b * 255); d[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  return canvasTexture(c);
}

/** Sphere with real drilled finger holes (triangles removed + walls + floor). */
function makeBall(K, R) {
  const ball = new Group();
  const tex = swirlTexture();
  const mat = K.phys('#ffffff', { map: tex, roughness: 0.2, clearcoatRoughness: 0.04, rim: 0.28 });

  // hole layout, around the "up-front" direction of the ball
  const thumb = new Vector3(-0.05, 0.45, 0.89).normalize();
  const t1 = new Vector3(1, 0, 0).sub(thumb.clone().multiplyScalar(thumb.x)).normalize();
  const t2 = new Vector3().crossVectors(thumb, t1).normalize();
  const fingerAt = (ang, off) => thumb.clone().multiplyScalar(Math.cos(ang))
    .add(t1.clone().multiplyScalar(Math.sin(ang) * Math.cos(off)))
    .add(t2.clone().multiplyScalar(Math.sin(ang) * Math.sin(off))).normalize();
  const holes = [
    { dir: thumb, r: 0.115 * R },
    { dir: fingerAt(0.62, 1.32), r: 0.098 * R },
    { dir: fingerAt(0.62, 1.82), r: 0.098 * R },
  ];

  const sph = new SphereGeometry(R, 160, 112);
  const pos = sph.attributes.position, idx = sph.index.array, keep = [];
  const a = new Vector3(), b = new Vector3(), c = new Vector3();
  for (let i = 0; i < idx.length; i += 3) {
    a.fromBufferAttribute(pos, idx[i]); b.fromBufferAttribute(pos, idx[i + 1]); c.fromBufferAttribute(pos, idx[i + 2]);
    const cen = a.add(b).add(c).normalize();
    let inside = false;
    for (const h of holes) if (cen.dot(h.dir) > Math.cos(h.r / R)) inside = true;
    if (!inside) keep.push(idx[i], idx[i + 1], idx[i + 2]);
  }
  sph.setIndex(keep);
  ball.add(new Mesh(sph, mat));

  const wallMat = K.phys('#160C26', { roughness: 0.6, clearcoat: 0, side: DoubleSide });
  const lipMat = K.phys('#C21F5B', { roughness: 0.22 });
  const UPV = new Vector3(0, 1, 0);
  for (const h of holes) {
    const g = new Group();
    g.quaternion.copy(new Quaternion().setFromUnitVectors(UPV, h.dir));
    const ang = h.r / R;
    const top = R * Math.cos(ang);
    const depth = R * 0.5;
    const wall = new Mesh(new CylinderGeometry(h.r, h.r * 0.92, depth, 36, 1, true), wallMat);
    wall.position.y = top - depth / 2 + R * 0.02;
    g.add(wall);
    const floor = new Mesh(new CircleGeometry(h.r * 0.93, 36).rotateX(-Math.PI / 2), K.hole);
    floor.position.y = top - depth + R * 0.03;
    g.add(floor);
    const lip = new Mesh(new TorusGeometry(R * Math.sin(ang), R * 0.022, 10, 48).rotateX(Math.PI / 2), lipMat);
    lip.position.y = top;
    g.add(lip);
    ball.add(g);
  }
  return ball;
}

export default {
  heroRotY: 0.32,
  build(K) {
    const model = new Group();
    const pts = pinProfile();
    const pinGeo = new LatheGeometry(pts, 64);
    const bandGeos = STRIPES_IN.map(([a, b]) => bandGeometry(pts, a, b));
    const pinMat = K.phys(PALETTE.white, { roughness: 0.26, rim: 0.22 });
    const rb = 0.9 / 15; // pivot radius at the base edge

    const PINS = [
      { base: [0.0, 0.0], hit: 0.45, dir: [1, 0.2], ang: 1.2, slide: 0.42, lift: 0.1, spin: 0.6, dur: 0.55 },
      { base: [0.46, 0.27], hit: 0.58, dir: [0.65, 0.76], ang: 0.98, slide: 0.2, lift: 0.04, spin: -0.4, dur: 0.42 },
      { base: [0.46, -0.27], hit: 0.86, dir: [0.9, -0.44], ang: 0.42, slide: 0.08, lift: 0.0, spin: 0.2, dur: 0.3 },
    ];
    const pins = PINS.map((p, i) => {
      const outer = new Group(), inner = new Group();
      const mesh = new Mesh(pinGeo, pinMat);
      for (const bg of bandGeos) mesh.add(new Mesh(bg, K.cyanGlow));
      mesh.rotation.y = i * 1.7;
      inner.add(mesh); outer.add(inner); model.add(outer);
      const d = new Vector2(p.dir[0], p.dir[1]).normalize();
      const sh = shadowBlob(1, 1, 0.5);
      model.add(sh);
      return { ...p, outer, inner, mesh, d, sh };
    });

    const R = 0.29;
    const ballRoll = new Group();
    const ball = makeBall(K, R);
    ballRoll.add(ball);
    model.add(ballRoll);
    const ballSh = shadowBlob(1, 1, 0.55);
    model.add(ballSh);

    const zPath = -0.05;
    const xImp = -Math.sqrt((R + 0.159) ** 2 - zPath ** 2);
    const ballPos = (t) => {
      if (t <= 0.45) return [xImp - (0.45 - t) * 2.6, zPath];
      const u = (t - 0.45) / 0.55;
      return [xImp + u * 0.62 - u * u * 0.02, zPath - u * 0.06];
    };
    const xRef = ballPos(0.6)[0];
    const q = new Quaternion(), axis = new Vector3();

    function update(t) {
      // --- ball
      const [bx, bz] = ballPos(t);
      ballRoll.position.set(bx, R, bz);
      ballRoll.rotation.set(0, 0, -(bx - xRef) / R);
      ballSh.position.set(bx + 0.03, 0.003, bz + 0.02);
      ballSh.scale.set(R * 3.0, 1, R * 2.7);

      // --- pins
      for (const p of pins) {
        const u = seg(t, p.hit, p.hit + p.dur);
        const e = easeOut(u);
        const ang = p.ang * (0.15 * u + 0.85 * e) * (u > 0 ? 1 : 0);
        const slide = p.slide * easeIn(u) * 0.6 + p.slide * u * 0.4;
        const lift = p.lift * Math.sin(Math.PI * Math.min(1, u * 1.1));
        const dx = p.d.x, dz = p.d.y;
        p.outer.position.set(p.base[0] + dx * (rb + slide), lift, p.base[1] + dz * (rb + slide));
        axis.set(dz, 0, -dx);
        p.outer.quaternion.copy(q.setFromAxisAngle(axis, ang));
        p.inner.position.set(-dx * rb, 0, -dz * rb);
        p.mesh.rotation.y = p.spin * u;
        // shadow stretches along the fall direction as the pin tips over
        const sa = Math.sin(ang);
        const len = 0.36 + sa * 0.78;
        p.sh.position.set(p.base[0] + dx * (slide + sa * 0.4), 0.002, p.base[1] + dz * (slide + sa * 0.4));
        p.sh.rotation.y = Math.atan2(-dz, dx);
        p.sh.scale.set(len, 1, 0.36);
        p.sh.userData.dynOpacity = 1 - lift * 2.5;
      }
    }
    update(0.45);

    return {
      model,
      update,
      ownShadows: true,
      refActions: [0.45, 1.0],
    };
  },
};
