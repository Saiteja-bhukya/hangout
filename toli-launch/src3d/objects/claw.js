// 5. Claw machine. action: claw descends (0-0.4), closes on a plush (0.4-0.55), lifts it (0.55-1).
import {
  Group, Mesh, BoxGeometry, CylinderGeometry, SphereGeometry, TorusGeometry, TubeGeometry,
  QuadraticBezierCurve3, CubicBezierCurve3, Vector3, ConeGeometry,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { rod, seg, easeInOut, lerp, TAU } from '../util.js';

const PLUSH_COLORS = ['#FF3D81', '#FFB627', '#20C9B5', '#FF8FB8', '#FFD36E', '#7FE7D9', '#E62E6E', '#FF9F1C'];

function plushToy(K, r, color, earStyle) {
  const g = new Group();
  const m = K.plush(color);
  const body = new Mesh(new SphereGeometry(r, 32, 24), m);
  body.scale.y = 0.94;
  g.add(body);
  for (const sx of [-1, 1]) {
    const ear = new Mesh(new SphereGeometry(r * (earStyle ? 0.3 : 0.36), 16, 12), m);
    if (earStyle) ear.scale.set(0.8, 1.6, 0.7);
    ear.position.set(sx * r * 0.6, r * 0.78, 0);
    g.add(ear);
    const eye = new Mesh(new SphereGeometry(r * 0.09, 10, 8), K.navyDark);
    eye.position.set(sx * r * 0.32, r * 0.18, r * 0.92);
    g.add(eye);
  }
  return g;
}

export default {
  heroRotY: 0.48,
  build(K) {
    const model = new Group();
    const W = 1.0, D = 0.9, BASE_H = 0.8, GLASS_H = 0.94, TOP_H = 0.28;
    const GY0 = BASE_H, GY1 = BASE_H + GLASS_H;

    // ---------- base cabinet
    const base = new Mesh(new RoundedBoxGeometry(W, BASE_H, D, 4, 0.06), K.navy);
    base.position.y = BASE_H / 2;
    model.add(base);
    // control ledge
    const ledge = new Mesh(new RoundedBoxGeometry(W * 0.98, 0.09, 0.28, 3, 0.035), K.white);
    ledge.position.set(0, BASE_H - 0.07, D / 2 + 0.1);
    ledge.rotation.x = 0.16;
    model.add(ledge);
    const ledgeTopY = BASE_H - 0.07 + 0.045;
    // joystick
    const joy = new Group();
    joy.position.set(-0.24, ledgeTopY, D / 2 + 0.11);
    joy.rotation.x = 0.16;
    joy.add(new Mesh(new CylinderGeometry(0.075, 0.085, 0.025, 28), K.navyDark));
    const stick = new Group();
    stick.add(rod([0, 0, 0], [0, 0.17, 0], 0.016, K.chrome));
    const knob = new Mesh(new SphereGeometry(0.058, 24, 18), K.blue);
    knob.position.y = 0.19;
    stick.add(knob);
    stick.rotation.z = -0.18;
    joy.add(stick);
    model.add(joy);
    // glowing button
    const btn = new Group();
    btn.position.set(0.2, ledgeTopY, D / 2 + 0.11);
    btn.rotation.x = 0.16;
    btn.add(new Mesh(new CylinderGeometry(0.085, 0.09, 0.02, 32), K.white));
    const cap = new Mesh(new CylinderGeometry(0.062, 0.066, 0.045, 32), K.cyanGlow);
    cap.position.y = 0.025;
    btn.add(cap);
    model.add(btn);
    // prize door with cyan frame + coin slot
    const door = new Mesh(new RoundedBoxGeometry(0.36, 0.26, 0.03, 3, 0.03), K.glossBlack);
    door.position.set(0.16, 0.3, D / 2 + 0.005);
    model.add(door);
    const doorFrame = new Mesh(new RoundedBoxGeometry(0.4, 0.3, 0.02, 3, 0.04), K.cyanGlow);
    doorFrame.position.set(0.16, 0.3, D / 2 - 0.002);
    model.add(doorFrame);
    const slot = new Mesh(new RoundedBoxGeometry(0.05, 0.16, 0.025, 2, 0.015), K.cyanGlow);
    slot.position.set(-0.26, 0.42, D / 2 + 0.004);
    model.add(slot);
    const slotPlate = new Mesh(new RoundedBoxGeometry(0.13, 0.26, 0.02, 3, 0.03), K.white);
    slotPlate.position.set(-0.26, 0.42, D / 2 - 0.004);
    model.add(slotPlate);

    // ---------- glass box: corner posts, glass, floor
    const PX = W / 2 - 0.035, PZ = D / 2 - 0.035;
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const post = new Mesh(new RoundedBoxGeometry(0.07, GLASS_H + 0.02, 0.07, 3, 0.025), K.white);
      post.position.set(sx * PX, GY0 + GLASS_H / 2, sz * PZ);
      model.add(post);
    }
    const glassT = 0.012;
    const front = new Mesh(new BoxGeometry(W - 0.07, GLASS_H, glassT), K.glass);
    front.position.set(0, GY0 + GLASS_H / 2, PZ);
    const back = front.clone(); back.position.z = -PZ;
    const left = new Mesh(new BoxGeometry(glassT, GLASS_H, D - 0.07), K.glass);
    left.position.set(-PX, GY0 + GLASS_H / 2, 0);
    const right = left.clone(); right.position.x = PX;
    model.add(front, back, left, right);
    const floor = new Mesh(new BoxGeometry(W - 0.06, 0.02, D - 0.06), K.navyDark);
    floor.position.y = GY0 + 0.01;
    model.add(floor);
    // prize chute (front-right corner inside)
    const chute = new Mesh(new RoundedBoxGeometry(0.26, 0.2, 0.26, 3, 0.03), K.whiteCool);
    chute.position.set(0.33, GY0 + 0.1, 0.29);
    model.add(chute);
    const chuteRim = new Mesh(new TorusGeometry(0.095, 0.014, 8, 40).rotateX(Math.PI / 2), K.cyanGlow);
    chuteRim.position.set(0.33, GY0 + 0.205, 0.29);
    model.add(chuteRim);

    // ---------- canopy with glowing marquee
    const top = new Mesh(new RoundedBoxGeometry(W + 0.04, TOP_H, D + 0.04, 4, 0.07), K.white);
    top.position.y = GY1 + TOP_H / 2;
    model.add(top);
    const marquee = new Mesh(new RoundedBoxGeometry(0.78, 0.13, 0.03, 3, 0.04), K.cyanGlow);
    marquee.position.set(0, GY1 + TOP_H / 2, (D + 0.04) / 2 + 0.002);
    model.add(marquee);
    const trim = new Mesh(new RoundedBoxGeometry(W + 0.06, 0.03, D + 0.06, 2, 0.012), K.blue);
    trim.position.y = GY1 + 0.005;
    model.add(trim);
    const trim2 = trim.clone();
    trim2.position.y = GY0 - 0.005;
    model.add(trim2);

    // ---------- plush pile
    const plushes = [];
    const PL = [
      [-0.27, 0.14, -0.22], [0.02, 0.13, -0.26], [0.29, 0.135, -0.2], [-0.3, 0.13, 0.12],
      [-0.06, 0.125, 0.18], [0.08, 0.13, -0.02], [-0.16, 0.12, -0.06], [0.3, 0.12, -0.0],
    ];
    PL.forEach(([x, r, z], i) => {
      const p = plushToy(K, r, PLUSH_COLORS[i], i % 3 === 1);
      const stackY = (i === 6) ? 0.07 : 0;
      p.position.set(x, GY0 + 0.02 + r * 0.94 + stackY, z);
      p.rotation.y = (i % 2 ? -0.3 : 0.25) + (x * 0.6);
      p.rotation.z = i === 6 ? 0.2 : 0;
      model.add(p);
      plushes.push(p);
    });
    const target = plushes[5]; // the one the claw grabs
    const targetRest = target.position.clone();
    target.rotation.y = 0;

    // ---------- gantry + claw
    const clawX = targetRest.x, clawZ = targetRest.z;
    const railY = GY1 - 0.05;
    for (const sx of [-1, 1]) {
      const rail = new Mesh(new BoxGeometry(0.03, 0.03, D - 0.1), K.navyDark);
      rail.position.set(sx * (PX - 0.04), railY, 0);
      model.add(rail);
    }
    const bridge = new Mesh(new BoxGeometry(W - 0.12, 0.03, 0.045), K.navyDark);
    bridge.position.set(0, railY, clawZ);
    model.add(bridge);
    const carriage = new Mesh(new RoundedBoxGeometry(0.12, 0.06, 0.1, 2, 0.02), K.blue);
    carriage.position.set(clawX, railY - 0.03, clawZ);
    model.add(carriage);

    const claw = new Group();
    model.add(claw);
    const cable = new Mesh(new CylinderGeometry(0.006, 0.006, 1, 8), K.navyDark);
    model.add(cable);
    const hub = new Mesh(new CylinderGeometry(0.07, 0.09, 0.12, 32), K.chrome);
    hub.position.y = 0.06;
    claw.add(hub);
    const hubTop = new Mesh(new ConeGeometry(0.07, 0.07, 32), K.chrome);
    hubTop.position.y = 0.155;
    claw.add(hubTop);
    const collar = new Mesh(new TorusGeometry(0.085, 0.014, 10, 40).rotateX(Math.PI / 2), K.cyanGlow);
    collar.position.y = 0.075;
    claw.add(collar);
    const prongCurve = new CubicBezierCurve3(
      new Vector3(0, 0, 0), new Vector3(0.17, -0.04, 0), new Vector3(0.22, -0.22, 0), new Vector3(0.08, -0.34, 0));
    const prongGeo = new TubeGeometry(prongCurve, 32, 0.019, 12, false);
    const prongs = [];
    for (let i = 0; i < 3; i++) {
      const arm = new Group();
      arm.rotation.y = (i / 3) * TAU + 0.5;
      const hinge = new Group();
      hinge.position.x = 0.06;
      hinge.add(new Mesh(prongGeo, K.chrome));
      const tip = new Mesh(new SphereGeometry(0.027, 14, 10), K.chrome);
      tip.position.set(0.08, -0.34, 0);
      hinge.add(tip);
      arm.add(hinge);
      claw.add(arm);
      prongs.push(hinge);
    }

    const HUB_TOP_Y = railY - 0.24, HUB_LOW_Y = targetRest.y + 0.22;
    function update(t) {
      const down = easeInOut(seg(t, 0, 0.4));
      const close = easeInOut(seg(t, 0.4, 0.55));
      const up = easeInOut(seg(t, 0.58, 0.95));
      const y = lerp(lerp(HUB_TOP_Y, HUB_LOW_Y, down), HUB_TOP_Y + 0.02, up);
      const sway = 0.03 * Math.sin(Math.PI * seg(t, 0.55, 1.0)) * (1 - up * 0.5);
      claw.position.set(clawX + sway * 0.4, y, clawZ);
      claw.rotation.z = sway;
      const open = 0.2, shut = -0.2;
      for (const h of prongs) h.rotation.z = lerp(open, shut, close);
      // cable from carriage to hub
      const cTop = railY - 0.04, cBot = y + 0.18;
      cable.scale.y = Math.max(0.001, cTop - cBot);
      cable.position.set(clawX, (cTop + cBot) / 2, clawZ);
      // grabbed plush follows the claw once closed
      if (t > 0.55) {
        target.position.set(claw.position.x, y + (targetRest.y - HUB_LOW_Y), clawZ);
        target.rotation.z = sway * 1.5;
      } else {
        target.position.copy(targetRest);
        target.rotation.z = 0;
      }
    }
    update(0);

    return {
      model, update, refActions: [0, 1],
      footprint: { scale: 1.0, wide: 0.34, core: 0.42 },
    };
  },
};
