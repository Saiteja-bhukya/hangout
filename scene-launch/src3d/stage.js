// SCENE3D stage: one transparent WebGL canvas, the shared light rig, and object handles.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Object3D, Box3, Vector3,
  ACESFilmicToneMapping, SRGBColorSpace, PMREMGenerator, DirectionalLight, HemisphereLight,
  MathUtils,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { makeKit } from './materials.js';
import { shadowBlob } from './util.js';
import { BUILDERS, OBJECTS } from './registry.js';

export { OBJECTS };

const DEFAULT_ELEVATION = MathUtils.degToRad(17);
const DEFAULT_TARGET_Y = 0.85;
const TARGET_FILL = 0.75; // a 2-unit-tall object fills ~75% of the canvas height

function defaultCamera(fov) {
  const half = MathUtils.degToRad(fov) / 2;
  const d = (2 / TARGET_FILL / 2) / Math.tan(half);
  return {
    position: [0, DEFAULT_TARGET_Y + d * Math.sin(DEFAULT_ELEVATION), d * Math.cos(DEFAULT_ELEVATION)],
    target: [0, DEFAULT_TARGET_Y, 0],
    fov,
  };
}

/** Box of all renderable, non-shadow meshes of obj in obj's own (identity-parent) space. */
function measure(obj) {
  obj.updateMatrixWorld(true);
  const box = new Box3();
  const v = new Vector3();
  obj.traverseVisible((o) => {
    if (!o.isMesh || o.userData.isShadow || o.userData.noBounds) return;
    const pos = o.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) box.expandByPoint(v.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld));
  });
  return box;
}

export function createStage(canvas, opts = {}) {
  const width = opts.width ?? (canvas.width || 1000);
  const height = opts.height ?? (canvas.height || 1000);
  const pixelRatio = opts.pixelRatio ?? 1;
  const fov = opts.fov ?? 30;
  const exposure = opts.exposure ?? 1.0;

  const renderer = new WebGLRenderer({
    canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(width, height, false);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = exposure;
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.shadowMap.enabled = false;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.95;
  pmrem.dispose();

  const camera = new PerspectiveCamera(fov, width / height, 0.05, 200);
  scene.add(camera);

  // ---- light rig, camera-relative so the look is identical from any camera move.
  // (camera space: +x right, +y up, -z into the scene; the aim point sits 6 units ahead)
  const aim = new Object3D();
  aim.position.set(0, 0, -6);
  camera.add(aim);
  function dirLight(color, intensity, offset) {
    const l = new DirectionalLight(color, intensity);
    l.position.set(offset[0], offset[1], -6 + offset[2]);
    l.target = aim;
    camera.add(l);
    return l;
  }
  const lights = {
    key: dirLight(0xffffff, 2.3, [-3.5, 4.5, 4.0]),          // soft key, upper-left front
    fill: dirLight(0xe4ecff, 0.55, [4.5, 0.5, 3.0]),         // cool low fill, right
    rim: dirLight(0x36d6f2, 4.2, [3.0, 2.6, -5.0]),          // cyan rim, behind right
    rim2: dirLight(0x36d6f2, 2.4, [-3.6, 1.2, -4.5]),        // cyan rim, behind left
  };
  const hemi = new HemisphereLight(0xf4f8ff, 0x7d8cab, 0.35);
  scene.add(hemi);
  lights.hemi = hemi;

  const cam = defaultCamera(fov);
  const camState = { position: cam.position.slice(), target: cam.target.slice(), fov };
  function applyCamera() {
    camera.fov = camState.fov;
    camera.aspect = (renderer.domElement.width || width) / (renderer.domElement.height || height);
    camera.position.set(...camState.position);
    camera.up.set(0, 1, 0);
    camera.lookAt(new Vector3(...camState.target));
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld(true);
  }
  applyCamera();

  const handles = [];

  function add(name) {
    const B = BUILDERS[name];
    if (!B) throw new Error(`SCENE3D: unknown object "${name}". Known: ${OBJECTS.join(', ')}`);
    const K = makeKit();
    const built = B.build(K);
    const model = built.model;
    const update = built.update || (() => {});

    // ---- normalisation: largest bbox axis -> 2 units, centred on x/z, resting on y = 0
    const refActions = built.refActions || [0];
    const box = new Box3();
    for (const a of refActions) { update(a); box.union(measure(model)); }
    let minY = box.min.y;
    if (built.groundActions) {
      for (const a of built.groundActions) { update(a); minY = Math.min(minY, measure(model).min.y); }
    }
    const size = box.getSize(new Vector3());
    const s = 2 / Math.max(size.x, size.y, size.z);
    const cx = (box.min.x + box.max.x) / 2, cz = (box.min.z + box.max.z) / 2;
    const cy = (minY + box.max.y) / 2;
    const hh = (cy - minY) * s; // pivot height (centre of the box) above the floor

    const outer = new Group();
    outer.name = `scene3d-${name}`;
    const yaw = new Group();
    const tilt = new Group();
    const norm = new Group();
    norm.scale.setScalar(s);
    norm.position.set(-cx * s, -cy * s, -cz * s);
    tilt.position.y = hh;
    norm.add(model);
    tilt.add(norm);
    yaw.add(tilt);
    outer.add(yaw);

    // ---- contact shadows
    const shadows = [];
    if (!built.ownShadows) {
      const fw = size.x * s, fd = size.z * s;
      const fp = built.footprint || {};
      const sx = fp.scale ?? 1.25;
      const wide = shadowBlob(fw * sx * 1.25, fd * sx * 1.25, fp.wide ?? 0.32);
      const core = shadowBlob(fw * sx * 0.85, fd * sx * 0.85, fp.core ?? 0.38);
      for (const b of [wide, core]) {
        b.position.set(((fp.x ?? cx) - cx) * s, 0.002, ((fp.z ?? cz) - cz) * s);
        yaw.add(b); shadows.push(b);
      }
    }
    for (const c of built.contacts || []) {
      const b = shadowBlob(c.w * s, (c.d ?? c.w) * s, c.o ?? 0.55);
      b.position.set((c.x - cx) * s, 0.003, (c.z - cz) * s);
      yaw.add(b); shadows.push(b);
    }
    model.traverse((o) => { if (o.userData.isShadow) shadows.push(o); });

    scene.add(outer);

    const state = { visible: true, x: 0, y: 0, z: 0, scale: 1, rotX: 0, rotY: 0, rotZ: 0, action: 0 };
    let shadowOpacity = 1;
    const heroRotY = built.heroRotY ?? B.heroRotY ?? 0;

    function applyShadow() {
      for (const b of shadows) {
        b.material.opacity = b.userData.baseOpacity * (b.userData.dynOpacity ?? 1) * shadowOpacity;
        b.visible = b.material.opacity > 0.001;
      }
    }
    function apply() {
      outer.visible = !!state.visible;
      outer.position.set(state.x, state.y, state.z);
      outer.scale.setScalar(state.scale);
      yaw.rotation.set(0, heroRotY + state.rotY, 0);
      tilt.rotation.set(state.rotX, 0, state.rotZ);
      update(Math.min(1, Math.max(0, state.action)));
      applyShadow();
    }

    const handle = {
      name,
      group: outer,
      model,
      heroRotY,
      /** normalised size (units) of the object at its reference pose */
      size: { x: size.x * s, y: (box.max.y - minY) * s, z: size.z * s },
      set(p = {}) {
        for (const k of Object.keys(p)) if (k in state && p[k] !== undefined) state[k] = p[k];
        apply();
        return handle;
      },
      get() { return { ...state }; },
      setShadow(o) {
        shadowOpacity = Math.max(0, Math.min(1, Number(o) || 0));
        applyShadow();
        return handle;
      },
    };
    apply();
    handles.push(handle);
    return handle;
  }

  function remove(handle) {
    const i = handles.indexOf(handle);
    if (i >= 0) handles.splice(i, 1);
    scene.remove(handle.group);
  }

  function setCamera(p = {}) {
    if (p.position) camState.position = [p.position[0], p.position[1], p.position[2]];
    if (p.target) camState.target = [p.target[0], p.target[1], p.target[2]];
    if (p.fov) camState.fov = p.fov;
    applyCamera();
  }

  /**
   * Convenience (extension): aim the camera so the given handles (default: all visible)
   * fill `fill` of the frame, viewed from `elevation`/`azimuth` (radians).
   */
  function frame(list, o = {}) {
    const items = (list ? (Array.isArray(list) ? list : [list]) : handles).filter((h) => h.group.visible);
    const fill = o.fill ?? 0.75;
    const elev = o.elevation ?? DEFAULT_ELEVATION;
    const azim = o.azimuth ?? 0;
    if (o.fov) camState.fov = o.fov;
    scene.updateMatrixWorld(true);
    const pts = [];
    const v = new Vector3();
    for (const h of items) {
      h.group.updateMatrixWorld(true);
      h.group.traverseVisible((m) => {
        if (!m.isMesh || m.userData.isShadow) return;
        const pos = m.geometry.attributes.position;
        const step = Math.max(1, Math.floor(pos.count / 4000));
        for (let i = 0; i < pos.count; i += step) pts.push(v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld).clone());
      });
    }
    if (!pts.length) return;
    const box = new Box3().setFromPoints(pts);
    const target = box.getCenter(new Vector3());
    const dir = new Vector3(Math.sin(azim) * Math.cos(elev), Math.sin(elev), Math.cos(azim) * Math.cos(elev));
    let dist = box.getSize(new Vector3()).length() * 1.6;
    const ndc = new Vector3();
    for (let iter = 0; iter < 8; iter++) {
      camState.position = target.clone().addScaledVector(dir, dist).toArray();
      camState.target = target.toArray();
      applyCamera();
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (const p of pts) {
        ndc.copy(p).project(camera);
        x0 = Math.min(x0, ndc.x); x1 = Math.max(x1, ndc.x);
        y0 = Math.min(y0, ndc.y); y1 = Math.max(y1, ndc.y);
      }
      const k = Math.max((x1 - x0) / 2, (y1 - y0) / 2) / fill;
      // re-centre: shift the target in camera space by the NDC centre offset
      const halfV = Math.tan(MathUtils.degToRad(camera.fov) / 2) * dist;
      const halfH = halfV * camera.aspect;
      const right = new Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
      const up = new Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
      target.addScaledVector(right, ((x0 + x1) / 2) * halfH).addScaledVector(up, ((y0 + y1) / 2) * halfV);
      dist *= k;
    }
    camState.position = target.clone().addScaledVector(dir, dist).toArray();
    camState.target = target.toArray();
    applyCamera();
    return { position: camState.position.slice(), target: camState.target.slice(), fov: camState.fov };
  }

  function setSize(w, h) {
    renderer.setSize(w, h, false);
    applyCamera();
  }

  function render() {
    applyCamera();
    renderer.render(scene, camera);
  }

  return {
    renderer, scene, camera, lights,
    add, remove, setCamera, frame, setSize, render,
    getCamera: () => ({ position: camState.position.slice(), target: camState.target.slice(), fov: camState.fov }),
    handles,
  };
}
