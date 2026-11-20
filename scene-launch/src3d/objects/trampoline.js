// 4. Trampoline. action: the mat dips and springs back (one bounce over 0..1).
import { Group, Mesh, TorusGeometry, CylinderGeometry, SphereGeometry, RingGeometry, DoubleSide } from 'three';
import { rod, TAU, seg } from '../util.js';

export default {
  heroRotY: 0.26,
  build(K) {
    const model = new Group();
    const FRAME_Y = 0.4;
    const R_PAD = 0.9, R_MAT = 0.64;

    // steel frame ring + legs
    const frame = new Mesh(new TorusGeometry(R_PAD - 0.02, 0.03, 12, 96).rotateX(Math.PI / 2), K.whiteCool);
    frame.position.y = FRAME_Y - 0.03;
    model.add(frame);
    const contacts = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU + TAU / 12;
      const c = Math.cos(a), s = Math.sin(a);
      const top = [c * (R_PAD - 0.02), FRAME_Y - 0.03, s * (R_PAD - 0.02)];
      const foot = [c * 0.95, 0.03, s * 0.95];
      model.add(rod(top, foot, 0.03, K.navy));
      const f = new Mesh(new CylinderGeometry(0.055, 0.06, 0.03, 20), K.navy);
      f.position.set(foot[0], 0.015, foot[2]);
      model.add(f);
      contacts.push({ x: foot[0], z: foot[2], w: 0.2, o: 0.5 });
    }

    // 24 springs bridging the mat edge to the frame (partly tucked under the pad)
    const springMat = K.phys('#C9D6E6', { metalness: 0.6, roughness: 0.25 });
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * TAU;
      const c = Math.cos(a), s = Math.sin(a);
      const sp = rod([c * (R_MAT - 0.01), FRAME_Y, s * (R_MAT - 0.01)], [c * (R_PAD - 0.04), FRAME_Y - 0.01, s * (R_PAD - 0.04)], 0.016, springMat, 10);
      model.add(sp);
      // coil hint: two little collars on each spring
      for (const f of [0.35, 0.62]) {
        const r = R_MAT + (R_PAD - 0.05 - R_MAT) * f;
        const coll = new Mesh(new CylinderGeometry(0.022, 0.022, 0.018, 10), springMat);
        coll.position.set(c * r, FRAME_Y - 0.004, s * r);
        coll.quaternion.copy(sp.quaternion);
        model.add(coll);
      }
    }

    // blue padded ring (flattened torus)
    const pad = new Mesh(new TorusGeometry(R_PAD, 0.135, 28, 120).rotateX(Math.PI / 2), K.blue);
    pad.scale.y = 0.5;
    pad.position.y = FRAME_Y + 0.035;
    model.add(pad);
    // thin cyan glow ring around the outside of the pad
    const glow = new Mesh(new TorusGeometry(R_PAD + 0.128, 0.011, 8, 160).rotateX(Math.PI / 2), K.cyanGlow);
    glow.position.y = FRAME_Y + 0.035;
    model.add(glow);

    // dark mat (deformable)
    const matGeo = new RingGeometry(0.0005, R_MAT, 96, 24).rotateX(-Math.PI / 2);
    const matMat = K.phys('#101B2F', { roughness: 0.45, clearcoat: 0.5, clearcoatRoughness: 0.3, side: DoubleSide, rim: 0.15 });
    const mat = new Mesh(matGeo, matMat);
    mat.position.y = FRAME_Y + 0.005;
    model.add(mat);
    // inner hem ring of the mat
    const hem = new Mesh(new TorusGeometry(R_MAT - 0.015, 0.014, 8, 120).rotateX(Math.PI / 2), K.whiteCool);
    hem.position.y = FRAME_Y + 0.006;
    model.add(hem);

    const pos = matGeo.attributes.position;
    const r0 = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) r0[i] = Math.hypot(pos.getX(i), pos.getZ(i));

    function dipAt(t) {
      // down and back up, then a small overshoot that settles flat at 1
      const a = seg(t, 0, 0.55), b = seg(t, 0.55, 1);
      return t <= 0.55 ? 0.2 * Math.sin(Math.PI * a) : -0.045 * Math.sin(Math.PI * b);
    }
    function update(t) {
      const d = dipAt(t);
      for (let i = 0; i < pos.count; i++) {
        const u = Math.min(1, r0[i] / R_MAT);
        const prof = Math.pow(Math.cos(u * Math.PI / 2), 1.6);
        pos.setY(i, -d * prof);
      }
      pos.needsUpdate = true;
      matGeo.computeVertexNormals();
    }
    update(0);

    return { model, update, contacts, footprint: { scale: 0.92, wide: 0.26, core: 0.2 } };
  },
};
