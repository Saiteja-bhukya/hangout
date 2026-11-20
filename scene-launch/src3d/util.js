// Shared deterministic helpers for the SCENE 3D hero objects.
// Nothing in here may depend on wall-clock time or unseeded randomness.
import {
  Shape, Path, Vector3, Quaternion, Mesh, PlaneGeometry, MeshBasicMaterial,
  CanvasTexture, SRGBColorSpace, CylinderGeometry, LinearFilter,
} from 'three';

export function mulberry32(seed) {
  let a = seed | 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const TAU = Math.PI * 2;
export const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const lerp = (a, b, t) => a + (b - a) * t;
/** normalised, clamped progress of t through [a, b] */
export const seg = (t, a, b) => clamp01((t - a) / (b - a));
export const smooth = (x) => x * x * (3 - 2 * x);
export const easeOut = (x) => 1 - Math.pow(1 - x, 3);
export const easeIn = (x) => x * x * x;
export const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const easeOutBack = (x) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

export function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

export function canvasTexture(canvas, { srgb = true, repeatWrap = false } = {}) {
  const t = new CanvasTexture(canvas);
  if (srgb) t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  if (repeatWrap) { t.wrapS = 1000; } // RepeatWrapping
  t.needsUpdate = true;
  return t;
}

/** Rounded rectangle as a THREE.Shape (or Path when asPath) centred on 0,0. */
export function roundedRect(w, h, r, asPath = false) {
  const s = asPath ? new Path() : new Shape();
  const x = -w / 2, y = -h / 2;
  r = Math.min(r, w / 2, h / 2);
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

const UP = new Vector3(0, 1, 0);
/** Cylinder mesh spanning point a -> b. */
export function rod(a, b, radius, material, radial = 16, radius2) {
  const A = new Vector3(...a), B = new Vector3(...b);
  const dir = new Vector3().subVectors(B, A);
  const len = dir.length();
  const m = new Mesh(new CylinderGeometry(radius2 ?? radius, radius, len, radial, 1), material);
  m.position.copy(A).addScaledVector(dir, 0.5);
  m.quaternion.copy(new Quaternion().setFromUnitVectors(UP, dir.normalize()));
  return m;
}

// ---------------------------------------------------------------- shadows
let _shadowTex = null;
function shadowTexture() {
  if (_shadowTex) return _shadowTex;
  const S = 256;
  const c = makeCanvas(S, S);
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  // smooth gaussian-ish falloff
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    const a = Math.exp(-t * t * 4.2) * (1 - t * t * t * t);
    grad.addColorStop(t, `rgba(255,255,255,${a.toFixed(4)})`);
  }
  g.fillStyle = grad;
  g.fillRect(0, 0, S, S);
  const tex = new CanvasTexture(c);
  tex.minFilter = LinearFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  _shadowTex = tex;
  return tex;
}

const SHADOW_GEOM = new PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
/**
 * A soft elliptical blob lying on y = 0 (navy tinted so it sits nicely on the light brand ground).
 * w/d are the full width/depth of the blob. baseOpacity is multiplied by handle.setShadow().
 */
export function shadowBlob(w, d, baseOpacity = 0.5) {
  const mat = new MeshBasicMaterial({
    color: 0x0b1a2e, map: shadowTexture(), transparent: true, depthWrite: false,
    toneMapped: false, opacity: baseOpacity,
  });
  const m = new Mesh(SHADOW_GEOM, mat);
  m.scale.set(w, 1, d);
  m.renderOrder = -10;
  m.userData.isShadow = true;
  m.userData.baseOpacity = baseOpacity;
  m.userData.dynOpacity = 1; // per-frame factor objects may set
  return m;
}
