// Phone frame + app screens come from src/screens.mjs (the app-screen module).
// Until it exists, a plain fallback frame keeps the build working.
let mod = null;
try { mod = await import('./screens.mjs'); } catch { mod = null; }

const fallbackPhone = (inner, { id } = {}) =>
  `<div class="phone"${id ? ` id="${id}"` : ''} style="position:relative;width:421px;height:880px;border-radius:60px;background:#0D1624;padding:14px;box-shadow:0 40px 80px rgba(20,40,90,.35)"><div style="width:393px;height:852px;border-radius:44px;overflow:hidden">${inner}</div></div>`;
const fallbackScreen = (n) => `<div class="app-screen app-screen--${n}" style="width:393px;height:852px;background:#080D16;color:#EAF2FF;font:600 20px Inter;padding:80px 24px">${n}</div>`;

export const phone = mod?.phone ?? fallbackPhone;
export const screen = mod?.screen ?? fallbackScreen;
export const HAS_SCREENS = !!mod;
// outer phone size and the screen's offset inside it (CSS px, unscaled)
export const PHONE = { w: 421, h: 880, sx: 14, sy: 14, sw: 393, sh: 852 };
