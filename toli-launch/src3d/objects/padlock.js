// 7. Escape-room padlock with three cyan number wheels, plus an old key lying beside it.
// action: wheels roll to the code 4-7-2 (0.05-0.8), shackle pops up and swings open (0.85-1).
import {
  Group, Mesh, CylinderGeometry, TorusGeometry, SphereGeometry, BoxGeometry, ExtrudeGeometry, Shape,
  Color, MeshPhysicalMaterial,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { makeCanvas, canvasTexture, roundedRect, rod, seg, easeInOut, easeOut, easeOutBack, TAU } from '../util.js';
import { PALETTE } from '../materials.js';

// seven-segment glyphs (a b c d e f g)
const SEGS = {
  0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg',
};
function drawDigit(g, d, cx, cy, w, h, lw) {
  const x0 = -w / 2, x1 = w / 2, y0 = -h / 2, y1 = h / 2, ym = 0;
  const L = {
    a: [x0, y0, x1, y0], b: [x1, y0, x1, ym], c: [x1, ym, x1, y1], d: [x0, y1, x1, y1],
    e: [x0, ym, x0, y1], f: [x0, y0, x0, ym], g: [x0, ym, x1, ym],
  };
  g.save();
  g.translate(cx, cy);
  g.rotate(Math.PI / 2); // glyph "up" -> canvas +x (the wheel's upward direction)
  g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = lw;
  g.beginPath();
  for (const s of SEGS[d]) { const [a, b, c, e] = L[s]; g.moveTo(a, b); g.lineTo(c, e); }
  g.stroke();
  g.restore();
}
// Canvas proportions match the wheel surface (circumference x width) so pixels are square.
const WHEEL_R = 0.22, WHEEL_W = 0.17;
function wheelTextures() {
  const W = 1536, H = 192, cell = W / 10;
  const col = makeCanvas(W, H), mask = makeCanvas(W, H);
  const gc = col.getContext('2d'), gm = mask.getContext('2d');
  gc.fillStyle = '#3A2600'; gc.fillRect(0, 0, W, H);       // dark base: the cyan comes from emission
  gm.fillStyle = '#ffffff'; gm.fillRect(0, 0, W, H);
  // knurl ticks between digits
  gm.fillStyle = '#9A7A3C';
  for (let k = 0; k < 10; k++) for (const off of [-W, 0, W]) gm.fillRect(k * cell + cell / 2 - 3 + off, 22, 6, H - 44);
  gc.strokeStyle = PALETTE.ink; gm.strokeStyle = '#000000';
  for (let k = 0; k < 10; k++) {
    for (const off of [-W, 0, W]) {
      drawDigit(gc, k, k * cell + off, H / 2, 70, 104, 19);
      drawDigit(gm, k, k * cell + off, H / 2, 70, 104, 19);
    }
  }
  return { map: canvasTexture(col), emissiveMap: canvasTexture(mask) };
}

export default {
  heroRotY: -0.38,
  build(K) {
    const model = new Group();
    const BW = 1.1, BH = 1.0, BD = 0.5;

    const body = new Mesh(new RoundedBoxGeometry(BW, BH, BD, 6, 0.16), K.navy);
    body.position.y = BH / 2;
    model.add(body);
    const FZ = BD / 2;

    // wheel window: a narrow opening in a raised white bezel, wheels sit just behind it
    const WY = 0.57;
    const back = new Mesh(new RoundedBoxGeometry(0.76, 0.17, 0.01, 2, 0.004), K.glossBlack);
    back.position.set(0, WY, FZ - 0.002);
    model.add(back);
    const bez = roundedRect(0.92, 0.36, 0.12);
    bez.holes.push(roundedRect(0.76, 0.15, 0.05, true));
    const bezel = new Mesh(new ExtrudeGeometry(bez, {
      depth: 0.045, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 3, curveSegments: 10,
    }), K.white);
    bezel.position.set(0, WY, FZ - 0.01);
    model.add(bezel);
    // little cyan pointer marks on the bezel at each wheel
    for (let i = 0; i < 3; i++) {
      const m = new Mesh(new RoundedBoxGeometry(0.06, 0.016, 0.01, 2, 0.006), K.cyanGlow);
      m.position.set((i - 1) * 0.225, WY + 0.122, FZ + 0.05);
      model.add(m);
    }

    // number wheels
    const { map, emissiveMap } = wheelTextures();
    const wheelMat = new MeshPhysicalMaterial({
      color: new Color('#ffffff'), map, emissiveMap, emissive: new Color(PALETTE.cyan), emissiveIntensity: 1.0,
      roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.12, toneMapped: false,
    });
    const capMat = K.navyDark;
    const wheels = [];
    const WR = WHEEL_R, WW = WHEEL_W;
    for (let i = 0; i < 3; i++) {
      const g = new Group();
      g.position.set((i - 1) * 0.225, WY, FZ + 0.035 - WR);
      const wheel = new Mesh(new CylinderGeometry(WR, WR, WW, 96, 1).rotateZ(Math.PI / 2), [wheelMat, capMat, capMat]);
      g.add(wheel);
      for (const sx of [-1, 1]) {
        const rim = new Mesh(new CylinderGeometry(WR + 0.006, WR + 0.006, 0.012, 96).rotateZ(Math.PI / 2), K.navy);
        rim.position.x = sx * (WW / 2 + 0.004);
        g.add(rim);
      }
      model.add(g);
      wheels.push(wheel);
    }

    // keyhole escutcheon
    const esc = new Mesh(new CylinderGeometry(0.1, 0.1, 0.03, 40).rotateX(Math.PI / 2), K.white);
    esc.position.set(0, 0.22, FZ);
    model.add(esc);
    const kh = new Shape();
    kh.absarc(0, 0.018, 0.032, 0, TAU, false);
    const khBody = new Shape();
    khBody.moveTo(-0.016, 0.0); khBody.lineTo(0.016, 0.0); khBody.lineTo(0.028, -0.07); khBody.lineTo(-0.028, -0.07); khBody.lineTo(-0.016, 0);
    const khGeo = new ExtrudeGeometry([kh, khBody], { depth: 0.008, bevelEnabled: false, curveSegments: 24 });
    const keyhole = new Mesh(khGeo, K.glossBlack);
    keyhole.position.set(0, 0.235, FZ + 0.012);
    model.add(keyhole);

    // cyan status strip
    const strip = new Mesh(new RoundedBoxGeometry(0.62, 0.035, 0.02, 2, 0.012), K.cyanGlow);
    strip.position.set(0, 0.83, FZ + 0.0);
    model.add(strip);

    // shackle (pivots about its long left leg)
    const SR = 0.33, ST = 0.075, SY = 1.2;
    const shackle = new Group();
    shackle.position.set(-SR, 0, 0);
    const sInner = new Group();
    sInner.position.x = SR;
    const arc = new Mesh(new TorusGeometry(SR, ST, 24, 64, Math.PI), K.chrome);
    arc.position.y = SY;
    sInner.add(arc);
    sInner.add(rod([-SR, 0.5, 0], [-SR, SY, 0], ST, K.chrome, 28));
    sInner.add(rod([SR, 0.86, 0], [SR, SY, 0], ST, K.chrome, 28));
    shackle.add(sInner);
    model.add(shackle);

    // old key, lying flat beside the lock
    const key = new Group();
    const bow = new Mesh(new TorusGeometry(0.11, 0.034, 16, 48).rotateX(Math.PI / 2), K.gold);
    key.add(bow);
    const bowIn = new Mesh(new TorusGeometry(0.045, 0.018, 10, 32).rotateX(Math.PI / 2), K.gold);
    key.add(bowIn);
    key.add(rod([0.14, 0, 0], [0.64, 0, 0], 0.026, K.gold, 16));
    const collar = new Mesh(new CylinderGeometry(0.042, 0.042, 0.05, 20).rotateZ(Math.PI / 2), K.gold);
    collar.position.x = 0.17;
    key.add(collar);
    const collar2 = collar.clone(); collar2.position.x = 0.24; collar2.scale.set(0.6, 0.85, 0.85);
    key.add(collar2);
    const bit = new Mesh(new BoxGeometry(0.1, 0.045, 0.15), K.gold);
    bit.position.set(0.56, 0, -0.085);
    key.add(bit);
    const bit2 = new Mesh(new BoxGeometry(0.04, 0.045, 0.07), K.gold);
    bit2.position.set(0.47, 0, -0.045);
    key.add(bit2);
    const tipS = new Mesh(new SphereGeometry(0.03, 12, 10), K.gold);
    tipS.position.x = 0.64;
    key.add(tipS);
    const KX = 0.56, KZ = 0.5, KR = 0.5;
    key.position.set(KX, 0.034, KZ);
    key.rotation.y = KR;
    model.add(key);

    const CODE = [4, 7, 2], TURNS = [1, 1, 2];
    function update(t) {
      for (let i = 0; i < 3; i++) {
        const u = easeInOut(seg(t, 0.05 + i * 0.1, 0.55 + i * 0.12));
        const val = (TURNS[i] * 10 + CODE[i]) * u;
        wheels[i].rotation.x = (val / 10) * TAU;
      }
      const pop = seg(t, 0.85, 0.93);
      shackle.position.y = 0.24 * (pop > 0 ? easeOutBack(pop) : 0);
      shackle.rotation.y = -0.7 * easeOut(seg(t, 0.91, 1.0));
    }
    update(0);

    // key shadow: centre of the key in model space
    const kc = 0.32;
    return {
      model, update,
      footprint: { x: 0, z: 0, w: BW * 1.15, d: BD * 1.6, wide: 0.3, core: 0.4 },
      contacts: [{ x: KX + Math.cos(KR) * kc, z: KZ - Math.sin(KR) * kc, w: 0.9, d: 0.24, rot: KR, o: 0.45 }],
    };
  },
};
