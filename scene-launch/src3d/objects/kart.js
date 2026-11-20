// 1. Go-kart. Front points +x, right side +z. action: wheels roll 4 turns + steering wiggle.
import {
  Group, Mesh, LatheGeometry, Vector2, CylinderGeometry, TorusGeometry, SphereGeometry,
  ExtrudeGeometry, Shape, BoxGeometry, Vector3, Quaternion,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { rod, TAU } from '../util.js';

function tyreGeom(ro, ri, w, cr) {
  const hw = w / 2, pts = [];
  pts.push(new Vector2(ri, -hw));
  for (let i = 0; i <= 8; i++) {
    const a = -Math.PI / 2 + (i / 8) * (Math.PI / 2);
    pts.push(new Vector2(ro - cr + Math.cos(a) * cr, -hw + cr + Math.sin(a) * cr));
  }
  for (let i = 0; i <= 8; i++) {
    const a = (i / 8) * (Math.PI / 2);
    pts.push(new Vector2(ro - cr + Math.cos(a) * cr, hw - cr + Math.sin(a) * cr));
  }
  pts.push(new Vector2(ri, hw));
  pts.push(new Vector2(ri, -hw)); // close the inner wall
  return new LatheGeometry(pts, 56).rotateX(Math.PI / 2); // axis -> z
}

/** One wheel: tyre + white dish rim + 5 dark spoke slots + cyan hub ring on the outer (+z) face. */
function makeWheel(K, ro, w) {
  const spin = new Group();
  const ri = ro * 0.62;
  spin.add(new Mesh(tyreGeom(ro, ri - 0.004, w, ro * 0.32), K.rubber));
  const rim = new Mesh(new CylinderGeometry(ri, ri, w * 0.86, 40).rotateX(Math.PI / 2), K.white);
  spin.add(rim);
  const face = w * 0.43 + 0.001;
  // spoke slots (make the roll readable)
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * TAU;
    const slot = new Mesh(new RoundedBoxGeometry(ri * 0.5, ri * 0.2, 0.02, 2, 0.008), K.navyDark);
    slot.position.set(Math.cos(a) * ri * 0.55, Math.sin(a) * ri * 0.55, face);
    slot.rotation.z = a;
    spin.add(slot);
  }
  const ring = new Mesh(new TorusGeometry(ri * 0.86, ri * 0.075, 12, 56), K.cyanGlow);
  ring.position.z = face + 0.004;
  spin.add(ring);
  const cap = new Mesh(new CylinderGeometry(ri * 0.24, ri * 0.28, 0.04, 24).rotateX(Math.PI / 2), K.navy);
  cap.position.z = face + 0.01;
  spin.add(cap);
  return spin;
}

export default {
  heroRotY: -0.62,
  build(K) {
    const model = new Group();

    // --- chassis / floor pan
    const pan = new Mesh(new RoundedBoxGeometry(1.62, 0.07, 0.74, 3, 0.03), K.navy);
    pan.position.set(-0.02, 0.135, 0);
    model.add(pan);

    // --- front nose fairing (side-profile extrusion)
    const nose = new Shape();
    nose.moveTo(0.36, 0.11);
    nose.lineTo(0.98, 0.11);
    nose.quadraticCurveTo(1.05, 0.12, 1.04, 0.19);
    nose.quadraticCurveTo(1.0, 0.27, 0.86, 0.3);
    nose.lineTo(0.52, 0.36);
    nose.quadraticCurveTo(0.4, 0.37, 0.36, 0.3);
    nose.lineTo(0.36, 0.11);
    const noseGeo = new ExtrudeGeometry(nose, {
      depth: 0.56, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.035, bevelSegments: 4, curveSegments: 12,
    });
    noseGeo.translate(0, 0, -0.28);
    model.add(new Mesh(noseGeo, K.white));
    // front LED bar + number-plate stripe
    const headLed = new Mesh(new RoundedBoxGeometry(0.035, 0.04, 0.5, 2, 0.015), K.cyanGlow);
    headLed.position.set(1.065, 0.19, 0);
    model.add(headLed);

    // --- side pods with cyan LED strips
    for (const sz of [-1, 1]) {
      const pod = new Mesh(new RoundedBoxGeometry(0.66, 0.17, 0.17, 3, 0.07), K.white);
      pod.position.set(0.03, 0.215, sz * 0.45);
      model.add(pod);
      const led = new Mesh(new RoundedBoxGeometry(0.56, 0.035, 0.02, 2, 0.012), K.cyanGlow);
      led.position.set(0.03, 0.235, sz * 0.537);
      model.add(led);
    }

    // --- bucket seat (blue)
    const seat = new Group();
    const base = new Mesh(new RoundedBoxGeometry(0.42, 0.1, 0.42, 3, 0.04), K.blue);
    base.position.set(-0.3, 0.215, 0);
    seat.add(base);
    const back = new Mesh(new RoundedBoxGeometry(0.11, 0.5, 0.46, 3, 0.05), K.blue);
    back.position.set(-0.56, 0.43, 0);
    back.rotation.z = 0.3;
    seat.add(back);
    for (const sz of [-1, 1]) {
      const bol = new Mesh(new RoundedBoxGeometry(0.38, 0.2, 0.07, 3, 0.03), K.blue);
      bol.position.set(-0.36, 0.3, sz * 0.215);
      bol.rotation.z = 0.12;
      seat.add(bol);
    }
    model.add(seat);

    // --- engine block + exhaust (rear right)
    const engine = new Mesh(new RoundedBoxGeometry(0.24, 0.2, 0.2, 3, 0.04), K.navy);
    engine.position.set(-0.74, 0.27, 0.27);
    model.add(engine);
    model.add(rod([-0.8, 0.33, 0.35], [-0.95, 0.38, 0.35], 0.028, K.chrome));

    // --- steering column + wheel
    const colA = new Vector3(0.48, 0.2, 0), colB = new Vector3(0.16, 0.52, 0);
    model.add(rod(colA.toArray(), colB.toArray(), 0.022, K.navy));
    const steer = new Group();
    const colDir = new Vector3().subVectors(colB, colA).normalize();
    steer.position.copy(colB).addScaledVector(colDir, 0.01);
    steer.quaternion.copy(new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), colDir));
    const steerSpin = new Group();
    steer.add(steerSpin);
    steerSpin.add(new Mesh(new TorusGeometry(0.135, 0.026, 14, 48), K.navy));
    const spoke = new Mesh(new BoxGeometry(0.25, 0.035, 0.02), K.navy);
    steerSpin.add(spoke);
    const hub = new Mesh(new CylinderGeometry(0.045, 0.045, 0.03, 24).rotateX(Math.PI / 2), K.cyanGlow);
    hub.position.z = 0.012;
    steerSpin.add(hub);
    model.add(steer);

    // --- rear bumper bar (blue) with struts
    model.add(rod([-0.99, 0.2, -0.6], [-0.99, 0.2, 0.6], 0.036, K.blue));
    for (const sz of [-1, 1]) {
      model.add(rod([-0.8, 0.15, sz * 0.3], [-0.99, 0.2, sz * 0.3], 0.024, K.blue));
      const endCap = new Mesh(new SphereGeometry(0.036, 16, 12), K.blue);
      endCap.position.set(-0.99, 0.2, sz * 0.6);
      model.add(endCap);
    }

    // --- axles
    const RF = 0.205, RR = 0.25, WF = 0.22, WR = 0.3;
    const XF = 0.66, XR = -0.6, ZF = 0.56, ZR = 0.57;
    model.add(rod([XF, RF, -ZF], [XF, RF, ZF], 0.022, K.navy));
    model.add(rod([XR, RR, -ZR], [XR, RR, ZR], 0.026, K.navy));

    // --- wheels
    const wheels = [];
    for (const [x, z, r, w, front] of [
      [XF, ZF, RF, WF, true], [XF, -ZF, RF, WF, true], [XR, ZR, RR, WR, false], [XR, -ZR, RR, WR, false],
    ]) {
      const steerG = new Group();
      steerG.position.set(x, r, z);
      const side = new Group();
      if (z < 0) side.scale.z = -1; // mirror so the hub ring faces outward
      const spin = makeWheel(K, r, w);
      side.add(spin);
      steerG.add(side);
      model.add(steerG);
      wheels.push({ steerG, spin, r, front, mirror: z < 0 });
    }

    function update(t) {
      const travel = t * 4.0 * TAU * 0.25; // distance rolled by the rear wheel (4 turns)
      const steerA = 0.2 * Math.sin(t * TAU * 2.0) * Math.sin(Math.PI * t);
      for (const w of wheels) {
        const ang = -travel / w.r;
        w.spin.rotation.z = ang; // the z-mirror leaves a z-rotation unchanged
        w.steerG.rotation.y = w.front ? steerA : 0;
      }
      steerSpin.rotation.z = -steerA * 2.4;
    }
    update(0);

    return {
      model,
      update,
      footprint: { scale: 1.0, wide: 0.3, core: 0.34 },
      contacts: [
        { x: XF, z: ZF, w: 0.34, d: 0.3 }, { x: XF, z: -ZF, w: 0.34, d: 0.3 },
        { x: XR, z: ZR, w: 0.42, d: 0.4 }, { x: XR, z: -ZR, w: 0.42, d: 0.4 },
      ],
    };
  },
};
