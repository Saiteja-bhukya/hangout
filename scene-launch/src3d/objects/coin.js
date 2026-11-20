// 9. Reward coin: gold, thick rim, raised ring + star embossed on each face. Stands on its edge.
// action: one full flip about its horizontal (x) axis.
import { Group, Mesh, LatheGeometry, Vector2, Shape, ExtrudeGeometry, TorusGeometry } from 'three';
import { TAU } from '../util.js';

function coinProfile() {
  // (r, y) going from the centre of the top face out over the rim and back to the bottom centre
  const P = [];
  const face = 0.075, rimTop = 0.135, R = 1.0;
  const top = [
    // gently domed field
    [0, face + 0.03], [0.2, face + 0.027], [0.4, face + 0.017], [0.58, face + 0.004], [0.6, face],
    // raised ring
    [0.615, face], [0.635, face + 0.035], [0.7, face + 0.045], [0.765, face + 0.035], [0.785, face],
    [0.83, face],
    // rim wall + rounded lip
    [0.845, rimTop - 0.012], [0.865, rimTop], [0.93, rimTop],
  ];
  for (const [r, y] of top) P.push(new Vector2(r, y));
  for (let i = 1; i < 16; i++) {
    const a = Math.PI / 2 - (i / 16) * Math.PI; // rounded edge from top to bottom
    P.push(new Vector2(0.93 + Math.cos(a) * (R - 0.93), Math.sin(a) * rimTop));
  }
  for (let i = top.length - 1; i >= 0; i--) P.push(new Vector2(top[i][0], -top[i][1]));
  // lathe wants bottom -> top ordering for outward normals
  return P.reverse();
}

function starShape(ro, ri, n = 5) {
  const s = new Shape();
  for (let i = 0; i < n * 2; i++) {
    const a = Math.PI / 2 + (i / (n * 2)) * TAU;
    const r = i % 2 ? ri : ro;
    if (i === 0) s.moveTo(Math.cos(a) * r, Math.sin(a) * r); else s.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  s.closePath();
  return s;
}

export default {
  heroRotY: -0.5,
  build(K) {
    const model = new Group();
    const flip = new Group();
    flip.position.y = 1.0;
    model.add(flip);
    const coin = new Group();
    coin.rotation.x = Math.PI / 2; // lathe axis (y) -> z: the face looks at the camera
    flip.add(coin);
    coin.add(new Mesh(new LatheGeometry(coinProfile(), 128), K.gold));
    const starGeo = new ExtrudeGeometry(starShape(0.4, 0.17), {
      depth: 0.03, bevelEnabled: true, bevelThickness: 0.018, bevelSize: 0.018, bevelSegments: 4,
    });
    for (const side of [1, -1]) {
      const star = new Mesh(starGeo, K.gold);
      star.rotation.x = side * -Math.PI / 2; // shape plane (xy) -> face plane (xz)
      star.position.y = side * 0.085;
      coin.add(star);
    }
    // reeded edge hint: thin ring groove highlights
    for (const y of [-0.06, 0.06]) {
      const g = new Mesh(new TorusGeometry(0.995, 0.012, 8, 128).rotateX(Math.PI / 2), K.gold);
      g.position.y = y;
      coin.add(g);
    }

    function update(t) {
      flip.rotation.x = t * TAU;
    }
    update(0);
    return { model, update, footprint: { scale: 0.85, wide: 0.26, core: 0.34, d: 0.5 } };
  },
};
