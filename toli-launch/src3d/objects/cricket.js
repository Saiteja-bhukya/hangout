// 8. Box cricket: bat + white ball with blue seams.
// The bat swings about the hands in the model x/y plane (face leads towards +x).
// action: 0 = backlift with the ball incoming, 0.45 = contact, 1 = follow-through, ball flying away.
import {
  Group, Mesh, Shape, ExtrudeGeometry, SphereGeometry, CylinderGeometry, TorusGeometry, Vector3,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { makeCanvas, canvasTexture, shadowBlob, seg, easeOut, lerp, TAU, clamp01 } from '../util.js';
import { PALETTE } from '../materials.js';

function ballTexture() {
  const W = 1024, H = 512;
  const c = makeCanvas(W, H);
  const g = c.getContext('2d');
  g.fillStyle = '#FFF3E2';
  g.fillRect(0, 0, W, H);
  // seam band along the equator (v = 0.5) + two rows of stitches
  g.fillStyle = '#F0DFC6';
  g.fillRect(0, H / 2 - 14, W, 28);
  g.fillStyle = PALETTE.blue;
  g.fillRect(0, H / 2 - 4, W, 8);
  g.strokeStyle = '#FF3D81';
  g.lineWidth = 5; g.lineCap = 'round';
  for (let i = 0; i < 96; i++) {
    const x = (i + 0.5) * (W / 96);
    for (const sgn of [-1, 1]) {
      g.beginPath();
      g.moveTo(x - 4, H / 2 + sgn * 9);
      g.lineTo(x + 4, H / 2 + sgn * 22);
      g.stroke();
    }
  }
  return canvasTexture(c);
}

function bladeGeometry(hw, len) {
  const s = new Shape();
  const hh = 0.05;
  s.moveTo(-hh, 0.02);
  s.quadraticCurveTo(-hw * 0.95, -0.02, -hw, -0.13);
  s.lineTo(-hw, -len + 0.08);
  s.quadraticCurveTo(-hw, -len, -hw + 0.08, -len);
  s.lineTo(hw - 0.08, -len);
  s.quadraticCurveTo(hw, -len, hw, -len + 0.08);
  s.lineTo(hw, -0.13);
  s.quadraticCurveTo(hw * 0.95, -0.02, hh, 0.02);
  s.lineTo(-hh, 0.02);
  const depth = 0.07;
  const g = new ExtrudeGeometry(s, {
    depth, bevelEnabled: true, bevelThickness: 0.022, bevelSize: 0.022, bevelSegments: 4, curveSegments: 16,
  });
  g.translate(0, 0, -depth / 2);
  g.rotateY(Math.PI / 2); // width -> z, thickness -> x
  return g;
}

export default {
  heroRotY: -0.3,
  build(K) {
    const model = new Group();
    const HY = 1.8;              // hands height
    const HAND = 0.32;           // hands sit this far up the handle from the shoulder
    const BLEN = 1.36, HW = 0.155;
    const FACE_X = 0.035 + 0.022;

    const swing = new Group();
    swing.position.set(0, HY, 0);
    model.add(swing);
    const bat = new Group();
    bat.position.y = -HAND;
    // roll the blade about its long axis so the face opens towards the camera in the hero view
    const ROLL = -0.7;
    bat.rotation.y = ROLL;
    swing.add(bat);

    bat.add(new Mesh(bladeGeometry(HW, BLEN), K.white));
    // back spine (hump)
    const spine = new Mesh(new SphereGeometry(1, 32, 24), K.white);
    spine.scale.set(0.055, 0.48, 0.09);
    spine.position.set(-0.035, -0.86, 0);
    bat.add(spine);
    // face graphics: navy chevron sticker with a cyan inner chevron (classic bat-face livery)
    const chevron = (wHalf, h, thick) => {
      const sh = new Shape();
      sh.moveTo(-wHalf, 0); sh.lineTo(0, -h); sh.lineTo(wHalf, 0);
      sh.lineTo(wHalf, -thick); sh.lineTo(0, -h - thick); sh.lineTo(-wHalf, -thick); sh.lineTo(-wHalf, 0);
      const g = new ExtrudeGeometry(sh, { depth: 0.006, bevelEnabled: false });
      g.rotateY(Math.PI / 2); // shape x -> -z (across the blade), extrude -> +x (off the face)
      return g;
    };
    const chevA = new Mesh(chevron(0.125, 0.11, 0.075), K.navy);
    chevA.position.set(FACE_X - 0.001, -0.2, 0);
    bat.add(chevA);
    const chevB = new Mesh(chevron(0.105, 0.09, 0.03), K.cyanGlow);
    chevB.position.set(FACE_X + 0.001, -0.33, 0);
    bat.add(chevB);
    const toeStripe = new Mesh(new RoundedBoxGeometry(0.008, 0.03, 0.26, 2, 0.003), K.cyanGlow);
    toeStripe.position.set(FACE_X + 0.002, -BLEN + 0.12, 0);
    bat.add(toeStripe);
    // edge accent on both sides of the blade
    for (const sz of [-1, 1]) {
      const edge = new Mesh(new RoundedBoxGeometry(0.03, 0.9, 0.012, 2, 0.005), K.blue);
      edge.position.set(0, -0.75, sz * (HW + 0.021));
      bat.add(edge);
    }

    // handle with blue rubber grip and knob
    const handle = new Mesh(new CylinderGeometry(0.04, 0.045, 0.6, 24), K.navy);
    handle.position.y = 0.27;
    bat.add(handle);
    const grip = new Mesh(new CylinderGeometry(0.052, 0.054, 0.46, 32), K.blue);
    grip.position.y = 0.31;
    bat.add(grip);
    for (let i = 0; i < 6; i++) {
      const ring = new Mesh(new TorusGeometry(0.053, 0.007, 8, 32).rotateX(Math.PI / 2), K.blueDeep);
      ring.position.y = 0.11 + i * 0.075;
      bat.add(ring);
    }
    const knob = new Mesh(new SphereGeometry(0.058, 24, 16), K.navy);
    knob.scale.y = 0.7;
    knob.position.y = 0.575;
    bat.add(knob);

    // ball
    const BR = 0.14;
    const ballMat = K.phys('#ffffff', { map: ballTexture(), roughness: 0.3, rim: 0.2 });
    const ballSpin = new Group();
    const ball = new Mesh(new SphereGeometry(BR, 48, 32), ballMat);
    ball.rotation.x = 0.5;
    ballSpin.add(ball);
    const seam = new Mesh(new TorusGeometry(BR * 1.0, 0.0065, 8, 96), K.phys(PALETTE.blue, { roughness: 0.3 }));
    seam.rotation.x = 0.5 + Math.PI / 2;
    ballSpin.add(seam);
    model.add(ballSpin);

    // contact geometry
    const SWEET = 1.26; // hands -> sweet spot
    const faceN = new Vector3(Math.cos(ROLL), 0, -Math.sin(ROLL));
    const C = new Vector3(0, HY - SWEET, 0).addScaledVector(faceN, BR + FACE_X + 0.01);
    const IN = new Vector3(0.95, 0.24, 0.45), OUT = new Vector3(1.05, 0.3, 0.95); // low drive out towards the camera, clear of the follow-through
    const TH0 = -1.15, TH1 = 1.25;

    // ground shadows
    const batSh = shadowBlob(1, 1, 0.42);
    const ballSh = shadowBlob(1, 1, 0.5);
    model.add(batSh, ballSh);

    const toe = new Vector3(), top = new Vector3();
    function update(t) {
      let th;
      if (t <= 0.45) { const u = seg(t, 0, 0.45); th = lerp(TH0, 0, u * u); }
      else th = lerp(0, TH1, easeOut(seg(t, 0.45, 1)));
      swing.rotation.z = th;

      let p;
      if (t <= 0.45) p = C.clone().addScaledVector(IN, 1 - t / 0.45);
      else { const u = seg(t, 0.45, 1); p = C.clone().addScaledVector(OUT, u * (1.15 - 0.15 * u)); }
      ballSpin.position.copy(p);
      ballSpin.rotation.set(0, 0, -t * TAU * 1.5);

      // shadow of the bat: segment hands-top -> toe projected on the floor
      const L = HAND + BLEN + 0.02;
      toe.set(Math.sin(th) * (L - HAND), HY - Math.cos(th) * (L - HAND), 0);
      top.set(-Math.sin(th) * (0.6 - HAND + 0.3), HY + Math.cos(th) * 0.3, 0);
      const mx = (toe.x + top.x) / 2;
      const len = Math.abs(toe.x - top.x) + 0.35;
      const lowY = Math.min(toe.y, top.y);
      batSh.position.set(mx * 0.85 + toe.x * 0.15, 0.002, 0);
      batSh.scale.set(len, 1, 0.42);
      batSh.userData.dynOpacity = clamp01(1.15 - lowY * 1.1);
      ballSh.position.set(p.x, 0.003, p.z);
      ballSh.scale.set(BR * 3.4, 1, BR * 3.0);
      ballSh.userData.dynOpacity = clamp01(1.1 - p.y * 0.9);
    }
    update(0.36);

    // normalise over most of the swing so the default camera keeps the bat in frame
    return { model, update, ownShadows: true, refActions: [0.12, 0.36, 0.62], floorY: 0 };
  },
};
