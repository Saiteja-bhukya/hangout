// 10. Diorama stage for the finale: a rounded plum disc with marigold and rani-pink inlay rings.
// action: the inlay rings turn slowly (pure function of action).
import { Group, Mesh, LatheGeometry, Vector2, TorusGeometry, CylinderGeometry } from 'three';
import { TAU } from '../util.js';

function discProfile(R = 1, H = 0.14) {
  const P = [new Vector2(0, 0), new Vector2(R - 0.05, 0)];
  for (let i = 0; i <= 8; i++) { const a = -Math.PI / 2 + (i / 8) * (Math.PI / 2); P.push(new Vector2(R - 0.05 + Math.cos(a) * 0.05, 0.05 + Math.sin(a) * 0.05)); }
  P.push(new Vector2(R, H - 0.035));
  for (let i = 0; i <= 8; i++) { const a = (i / 8) * (Math.PI / 2); P.push(new Vector2(R - 0.035 + Math.cos(a) * 0.035, H - 0.035 + Math.sin(a) * 0.035)); }
  P.push(new Vector2(0, H));
  return P;
}

export default {
  heroRotY: 0,
  build(K) {
    const model = new Group();
    const H = 0.14;
    model.add(new Mesh(new LatheGeometry(discProfile(1, H), 160), K.phys('#24143A', { roughness: 0.35, rim: 0.2 })));
    const top = new Mesh(new CylinderGeometry(0.955, 0.955, 0.004, 160), K.phys('#43204F', { roughness: 0.5, clearcoat: 0.7, clearcoatRoughness: 0.25 }));
    top.position.y = H + 0.001;
    model.add(top);
    const rings = new Group();
    rings.position.y = H + 0.004;
    model.add(rings);
    const add = (r, tube, mat) => { const m = new Mesh(new TorusGeometry(r, tube, 10, 200).rotateX(Math.PI / 2), mat); rings.add(m); return m; };
    add(0.975, 0.011, K.cyanGlow);   // marigold rim
    add(0.62, 0.007, K.blueGlow);    // rani pink
    add(0.6, 0.004, K.cyanGlow);
    add(0.28, 0.006, K.cyanGlow);
    // twelve marigold studs around the rim, like stage lights
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU;
      const s = new Mesh(new CylinderGeometry(0.022, 0.022, 0.012, 24), i % 2 ? K.blueGlow : K.cyanGlow);
      s.position.set(Math.cos(a) * 0.8, 0.003, Math.sin(a) * 0.8);
      rings.add(s);
    }
    function update(t) { rings.rotation.y = t * TAU * 0.25; }
    update(0);
    return { model, update, footprint: { scale: 1.02, wide: 0.3, core: 0.3 } };
  },
};
