// 6. Game controller, propped up so its face looks at the camera.
// action: both sticks tilt (left one circles), and the top face button presses in and out.
import { Group, Mesh, CapsuleGeometry, CylinderGeometry, SphereGeometry, TorusGeometry } from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { TAU, seg } from '../util.js';

const BR = 0.42, BL = 0.45, FLAT = 0.55;
/** height of the body's top surface at (x, z) in the face-up frame */
function yTop(x, z) {
  const dx = Math.max(0, Math.abs(x) - BL);
  const r2 = BR * BR - dx * dx;
  return FLAT * Math.sqrt(Math.max(0, r2 - z * z));
}

export default {
  heroRotY: -0.32,
  build(K) {
    const model = new Group();
    const present = new Group();
    present.rotation.x = 0.92; // face towards the viewer
    model.add(present);
    const pad = new Group();
    present.add(pad);

    // body: flattened capsule + two angled capsule grips
    const body = new Mesh(new CapsuleGeometry(BR, BL * 2, 16, 48).rotateZ(Math.PI / 2), K.navy);
    body.scale.y = FLAT;
    pad.add(body);
    for (const sx of [-1, 1]) {
      const grip = new Mesh(new CapsuleGeometry(0.27, 0.5, 14, 36).rotateX(Math.PI / 2), K.navy);
      grip.rotation.y = sx * 0.4;
      grip.scale.y = 0.62;
      grip.position.set(sx * 0.6, -0.05, 0.38);
      pad.add(grip);
      // shoulder bumper (blue)
      const bump = new Mesh(new RoundedBoxGeometry(0.36, 0.1, 0.14, 3, 0.045), K.blue);
      bump.position.set(sx * 0.56, 0.03, -0.37);
      bump.rotation.y = -sx * 0.12;
      pad.add(bump);
    }

    // touchpad + blue light bar
    const touch = new Mesh(new RoundedBoxGeometry(0.44, 0.04, 0.27, 3, 0.02), K.phys('#0E1829', { roughness: 0.62, clearcoat: 0, rim: 0.12 }));
    touch.position.set(0, yTop(0, -0.06) - 0.005, -0.06);
    pad.add(touch);
    const bar = new Mesh(new RoundedBoxGeometry(0.5, 0.05, 0.075, 3, 0.022), K.blueGlow);
    bar.position.set(0, yTop(0, -0.29) - 0.005, -0.29);
    bar.rotation.x = -0.45;
    pad.add(bar);

    // D-pad (white)
    const dx0 = -0.56, dz0 = -0.04, dy0 = yTop(dx0, dz0) - 0.008;
    for (const rotY of [0, Math.PI / 2]) {
      const arm = new Mesh(new RoundedBoxGeometry(0.22, 0.05, 0.075, 3, 0.022), K.white);
      arm.position.set(dx0, dy0, dz0);
      arm.rotation.y = rotY;
      pad.add(arm);
    }

    // four cyan face buttons in a diamond
    const fx0 = 0.56, fz0 = -0.04, sp = 0.108;
    const faceBtns = [];
    for (const [ox, oz] of [[0, -sp], [sp, 0], [0, sp], [-sp, 0]]) {
      const x = fx0 + ox, z = fz0 + oz;
      const g = new Group();
      g.position.set(x, yTop(x, z) - 0.012, z);
      const b = new Mesh(new CylinderGeometry(0.046, 0.05, 0.05, 28), K.cyanGlow);
      b.position.y = 0.022;
      g.add(b);
      pad.add(g);
      faceBtns.push(b);
    }

    // thumb sticks
    const sticks = [];
    for (const sx of [-1, 1]) {
      const x = sx * 0.27, z = 0.23;
      const y = yTop(x, z);
      const well = new Mesh(new TorusGeometry(0.095, 0.022, 12, 40).rotateX(Math.PI / 2), K.navyDark);
      well.position.set(x, y - 0.01, z);
      pad.add(well);
      const pivot = new Group();
      pivot.position.set(x, y - 0.03, z);
      const stem = new Mesh(new CylinderGeometry(0.04, 0.045, 0.08, 20), K.navyDark);
      stem.position.y = 0.04;
      pivot.add(stem);
      const cap = new Mesh(new CylinderGeometry(0.1, 0.094, 0.04, 36), K.white);
      cap.position.y = 0.09;
      pivot.add(cap);
      const rim = new Mesh(new TorusGeometry(0.088, 0.014, 10, 40).rotateX(Math.PI / 2), K.white);
      rim.position.y = 0.11;
      pivot.add(rim);
      const dish = new Mesh(new SphereGeometry(0.09, 28, 10, 0, TAU, 0, 0.5), K.whiteCool);
      dish.scale.y = 0.35;
      dish.position.y = 0.105;
      pivot.add(dish);
      pad.add(pivot);
      sticks.push(pivot);
    }
    // small home button
    const home = new Mesh(new CylinderGeometry(0.035, 0.035, 0.03, 24), K.white);
    home.position.set(0, yTop(0, 0.2) - 0.005, 0.2);
    pad.add(home);

    function update(t) {
      const env = Math.sin(Math.PI * t);
      sticks[0].rotation.set(0.32 * env * Math.cos(TAU * t), 0, 0.32 * env * Math.sin(TAU * t));
      sticks[1].rotation.set(0, 0, -0.3 * Math.sin(TAU * t));
      const press = Math.sin(Math.PI * seg(t, 0.3, 0.7));
      faceBtns.forEach((b, i) => { b.position.y = 0.022 - (i === 0 ? 0.024 * press : 0); });
    }
    update(0);

    return { model, update, footprint: { scale: 0.9, wide: 0.3, core: 0.36 } };
  },
};
