// 3. VR headset. Visor faces +z. action: a subtle nod/tilt (returns to rest at 1).
import { Group, Mesh, TorusGeometry, ExtrudeGeometry, CylinderGeometry, SphereGeometry } from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { roundedRect, TAU } from '../util.js';

export default {
  heroRotY: 0.55,
  build(K) {
    const model = new Group();
    const head = new Group(); // nod pivot ~ centre of the visor
    head.position.set(0, 0.5, 0);
    model.add(head);

    const W = 1.8, H = 1.0, D = 0.78;
    const body = new Mesh(new RoundedBoxGeometry(W, H, D, 8, 0.32), K.white);
    head.add(body);

    // glossy dark front shield
    const PW = 1.56, PH = 0.74;
    const panel = new Mesh(new RoundedBoxGeometry(PW, PH, 0.2, 8, 0.1), K.glossBlack);
    panel.position.z = D / 2 - 0.03;
    head.add(panel);
    const front = D / 2 - 0.03 + 0.1;

    // emissive cyan edge around the shield
    const ringShape = roundedRect(PW + 0.05, PH + 0.05, 0.135);
    ringShape.holes.push(roundedRect(PW - 0.035, PH - 0.035, 0.1, true));
    const ringGeo = new ExtrudeGeometry(ringShape, {
      depth: 0.012, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.006, bevelSegments: 2, curveSegments: 10,
    });
    const ring = new Mesh(ringGeo, K.cyanGlow);
    ring.position.z = front - 0.035;
    head.add(ring);

    // tracking-camera dots + status LED on the shield
    for (const [x, y] of [[-0.6, 0.24], [0.6, 0.24], [-0.6, -0.24], [0.6, -0.24]]) {
      const cam = new Mesh(new CylinderGeometry(0.045, 0.045, 0.02, 24).rotateX(Math.PI / 2), K.navy);
      cam.position.set(x, y, front - 0.002);
      head.add(cam);
    }
    const led = new Mesh(new CylinderGeometry(0.022, 0.022, 0.02, 16).rotateX(Math.PI / 2), K.cyanGlow);
    led.position.set(0, -0.26, front - 0.002);
    head.add(led);

    // navy face gasket at the back
    const gasket = new Mesh(new RoundedBoxGeometry(1.6, 0.84, 0.22, 6, 0.1), K.navy);
    gasket.position.z = -D / 2 - 0.02;
    head.add(gasket);

    // blue fabric strap: a flattened torus segment wrapping round the back of the head
    const RS = 0.9, zc = -0.32, sz = 1.22;
    const arc = Math.PI + 0.62;
    const strapGeo = new TorusGeometry(RS, 0.075, 16, 96, arc)
      .rotateX(Math.PI / 2)            // ring in the x/z plane: (cos a, 0, sin a)
      .rotateY(-(Math.PI - 0.31)); // start the arc just in front of the side attachment
    const strap = new Mesh(strapGeo, K.blue);
    strap.scale.set(1, 2.4, sz);
    strap.position.set(0, -0.02, zc);
    head.add(strap);
    // rear adjuster pad
    const pad = new Mesh(new RoundedBoxGeometry(0.62, 0.46, 0.14, 5, 0.06), K.navy);
    pad.position.set(0, -0.02, zc - RS * sz - 0.02);
    head.add(pad);
    const padLed = new Mesh(new RoundedBoxGeometry(0.3, 0.035, 0.02, 2, 0.012), K.cyanGlow);
    padLed.position.set(0, -0.02, zc - RS * sz - 0.095);
    head.add(padLed);
    // side hinges where the strap meets the visor
    for (const sx of [-1, 1]) {
      const hinge = new Mesh(new RoundedBoxGeometry(0.12, 0.3, 0.3, 4, 0.05), K.whiteCool);
      hinge.position.set(sx * (W / 2 + 0.01), -0.02, -0.16);
      head.add(hinge);
      const dot = new Mesh(new SphereGeometry(0.03, 12, 10), K.cyanGlow);
      dot.position.set(sx * (W / 2 + 0.07), 0.05, -0.16);
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
