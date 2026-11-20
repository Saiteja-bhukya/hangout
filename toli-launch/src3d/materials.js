// "Premium toy" material kit shared by every hero object.
import { MeshPhysicalMaterial, MeshStandardMaterial, Color, DoubleSide } from 'three';

export const PALETTE = {
  navy: '#2A1A44',
  white: '#FFF3E2',
  cyan: '#FFB627',
  blue: '#FF3D81',
  lilac: '#20C9B5',
  ink: '#120A1F',
  gold: '#F2B93B',
};

const RIM = new Color(PALETTE.cyan);

/**
 * Adds a soft view-dependent (fresnel) rim so silhouettes always separate from the light
 * #EEF3FA ground. It is weighted towards the upper/back edges (where the cyan rim light sits)
 * so it reads as light, not as an outline.
 */
function withRim(mat, strength, color = RIM, power = 3.0) {
  if (!strength) return mat;
  mat.userData.rim = { strength, power, color };
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uRimColor = { value: color };
    shader.uniforms.uRimStrength = { value: strength };
    shader.uniforms.uRimPower = { value: power };
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 uRimColor;\nuniform float uRimStrength;\nuniform float uRimPower;')
      .replace('#include <opaque_fragment>', `
        {
          vec3 rimV = normalize( vViewPosition );
          float rimF = pow( 1.0 - clamp( dot( normal, rimV ), 0.0, 1.0 ), uRimPower );
          // favour edges facing up / sideways (view space), fade on the underside
          float rimW = 0.45 + 0.55 * clamp( normal.y * 0.7 + 0.5, 0.0, 1.0 );
          outgoingLight += uRimColor * ( uRimStrength * rimF * rimW );
        }
        #include <opaque_fragment>`);
  };
  mat.customProgramCacheKey = () => `rim-${strength}-${power}-${color.getHexString()}`;
  return mat;
}

function phys(color, o = {}) {
  const { rim = 0, ...rest } = o;
  const m = new MeshPhysicalMaterial({
    color: new Color(color),
    roughness: 0.3,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    ...rest,
  });
  return withRim(m, rim);
}

/** Builds a fresh material kit (one per object build). */
export function makeKit() {
  const K = {};
  K.navy = phys(PALETTE.navy, { roughness: 0.32, rim: 0.35 });
  K.navyDark = phys('#1B1030', { roughness: 0.25, rim: 0.3 });
  K.white = phys(PALETTE.white, { roughness: 0.3, rim: 0.22 });
  // slightly cooler white for secondary parts, gives white-on-white separation
  K.whiteCool = phys('#F1DFC6', { roughness: 0.3, rim: 0.2 });
  K.blue = phys(PALETTE.blue, { roughness: 0.28, rim: 0.3 });
  K.blueDeep = phys('#C21F5B', { roughness: 0.26, rim: 0.3 });
  K.lilac = phys(PALETTE.lilac, { roughness: 0.3, rim: 0.2 });
  // Emissive accents bypass tone mapping (dark base + emissive at 1.0) so they land on the exact
  // brand colour instead of ACES-desaturated mint; clearcoat still adds glossy glints.
  K.cyanGlow = new MeshPhysicalMaterial({
    color: new Color('#2A1A00'), emissive: new Color(PALETTE.cyan), emissiveIntensity: 1.0,
    roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1, toneMapped: false,
  });
  K.blueGlow = new MeshPhysicalMaterial({
    color: new Color('#240612'), emissive: new Color('#FF3D81'), emissiveIntensity: 1.0,
    roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1, toneMapped: false,
  });
  K.glossBlack = phys('#140A1E', { roughness: 0.12, clearcoatRoughness: 0.03, rim: 0.45 });
  K.rubber = phys('#1E1428', { roughness: 0.5, clearcoat: 0.6, clearcoatRoughness: 0.35, rim: 0.3 });
  K.chrome = new MeshPhysicalMaterial({
    color: new Color('#F3ECE4'), metalness: 1, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.05,
  });
  K.chrome.userData.envBoost = 1.25;
  K.gold = new MeshPhysicalMaterial({
    color: new Color(PALETTE.gold), metalness: 1, roughness: 0.27, clearcoat: 1, clearcoatRoughness: 0.08,
  });
  K.gold.userData.envBoost = 1.5; // richer metal: reflections pushed so gold reads warm, not khaki
  K.hole = new MeshStandardMaterial({ color: new Color('#0A0510'), roughness: 0.9, metalness: 0 });
  K.glass = new MeshPhysicalMaterial({
    color: new Color('#FFFFFF'), metalness: 0, roughness: 0.03, transmission: 0.95, thickness: 0.02,
    ior: 1.45, specularIntensity: 0.7,
  });
  K.plush = (hex) => new MeshPhysicalMaterial({
    color: new Color(hex), roughness: 0.62, metalness: 0, sheen: 0.45, sheenRoughness: 0.5,
    sheenColor: new Color(hex).lerp(new Color('#FFFFFF'), 0.25),
  });
  K.phys = phys;
  K.DoubleSide = DoubleSide;
  return K;
}
