// 3. VR headset. Visor faces +z. action: a subtle nod/tilt (returns to rest at 1).
import { Group, Mesh, TorusGeometry, CylinderGeometry, SphereGeometry } from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { superBlob, TAU } from '../util.js';

export default {
  heroRotY: 0.62,
  build(K) {
    const model = new Group();
    const head = new Group(); // nod pivot ~ centre of the visor
    head.position.set(0, 0.5, 0);
    model.add(head);

    const W = 1.8, H = 1.0, D = 0.78;
    // soft superellipsoid shell
    const body = new Mesh(superBlob(W / 2, H / 2, D / 2, 0.38, 0.42, 0.42), K.white);
    head.add(body);

    // domed glossy-black shield with a cyan halo hugging its edge
    const SA = 0.78, SB = 0.37;
    const halo = new Mesh(superBlob(SA + 0.035, SB + 0.035, 0.12, 0.34, 0.34, 0.8), K.cyanGlow);
    halo.position.z = D / 2 - 0.05;
    head.add(halo);
    const shield = new Mesh(superBlob(SA, SB, 0.17, 0.34, 0.34, 0.75), K.glossBlack);
    shield.position.z = D / 2 - 0.05;
    head.add(shield);
    const front = D / 2 - 0.05 + 0.17;

    // tracking-camera dots + status LED on the shield
    for (const [x, y] of [[-0.6, 0.22], [0.6, 0.22], [-0.6, -0.22], [0.6, -0.22]]) {
      const cam = new Mesh(new SphereGeometry(0.04, 20, 12), K.navy);
      cam.scale.z = 0.16;
      // follow the dome: superellipse depth at this (x, y)
      const nx = Math.pow(Math.abs(x) / SA, 1 / 0.34), ny = Math.pow(Math.abs(y) / SB, 1 / 0.34);
      const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
      cam.position.set(x, y, D / 2 - 0.05 + 0.17 * Math.pow(nz, 0.75) - 0.004);
      head.add(cam);
    }
    const led = new Mesh(new SphereGeometry(0.024, 16, 10), K.cyanGlow);
    led.scale.z = 0.4;
    led.position.set(0, -0.25, front - 0.035);
    head.add(led);

    // navy face gasket at the back
    const gasket = new Mesh(new RoundedBoxGeometry(1.56, 0.82, 0.24, 6, 0.1), K.navy);
    gasket.position.z = -D / 2 + 0.02;
    head.add(gasket);

    // blue fabric strap: a flattened torus segment wrapping round the back of the head
    const RS = 0.9, zc = -0.32, sz = 1.22;
    const strapGeo = new TorusGeometry(RS, 0.075, 16, 96, Math.PI + 0.62)
      .rotateX(Math.PI / 2)          // ring in the x/z plane: (cos a, 0, sin a)
      .rotateY(-(Math.PI - 0.31));   // start the arc just in front of the side attachment
    const strap = new Mesh(strapGeo, K.blue);
    strap.scale.set(1, 2.4, sz);
    strap.position.set(0, -0.02, zc);
    head.add(strap);
    // top strap arching over to the rear pad
    const backZ = zc - RS * sz;
    const topR = (-0.12 - backZ) / 2;
    const topStrap = new Mesh(new TorusGeometry(topR, 0.06, 12, 64, Math.PI).rotateY(Math.PI / 2), K.blue);
    topStrap.scale.set(2.2, 0.95, 1);
    topStrap.position.set(0, 0.16, (-0.12 + backZ) / 2);
    head.add(topStrap);
    // rear adjuster pad
    const pad = new Mesh(new RoundedBoxGeometry(0.62, 0.46, 0.14, 5, 0.06), K.navy);
    pad.position.set(0, -0.02, backZ - 0.02);
    head.add(pad);
    const padLed = new Mesh(new RoundedBoxGeometry(0.3, 0.035, 0.02, 2, 0.012), K.cyanGlow);
    padLed.position.set(0, -0.02, backZ - 0.095);
    head.add(padLed);
    // side hinges where the strap meets the visor
    for (const sx of [-1, 1]) {
      const hinge = new Mesh(new RoundedBoxGeometry(0.12, 0.3, 0.3, 4, 0.05), K.whiteCool);
      hinge.position.set(sx * (W / 2 + 0.005), -0.02, -0.16);
      head.add(hinge);
      const dot = new Mesh(new SphereGeometry(0.03, 12, 10), K.cyanGlow);
      dot.position.set(sx * (W / 2 + 0.065), 0.05, -0.16);
      head.add(dot);
    }

    function update(t) {
      head.rotation.x = -0.1 * Math.sin(TAU * t);
      head.rotation.z = 0.045 * Math.sin(Math.PI * t);
    }
    update(0);

    return { model, update, footprint: { scale: 0.9, wide: 0.3, core: 0.36 } };
  },
};
