// SCENE app icon set — 24px line icons, stroke 1.85, round caps/joins, currentColor.
// One consistent set for UI + activity categories. No ids, no external refs.

const UI = {
  home: '<path d="M3.5 10.4 12 3.6l8.5 6.8"/><path d="M5.6 8.9V19a1.6 1.6 0 0 0 1.6 1.6h3v-5.1a1.8 1.8 0 0 1 3.6 0v5.1h3a1.6 1.6 0 0 0 1.6-1.6V8.9"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.7 8.3-2.2 5.2-5.2 2.2 2.2-5.2z"/>',
  pin: '<path d="M12 21.2s-6.9-5.7-6.9-11.5a6.9 6.9 0 0 1 13.8 0c0 5.8-6.9 11.5-6.9 11.5z"/><circle cx="12" cy="9.7" r="2.6"/>',
  ticket: '<path d="M4.6 5.6h14.8A1.6 1.6 0 0 1 21 7.2v2.4a2.4 2.4 0 0 0 0 4.8v2.4a1.6 1.6 0 0 1-1.6 1.6H4.6A1.6 1.6 0 0 1 3 16.8v-2.4a2.4 2.4 0 0 0 0-4.8V7.2a1.6 1.6 0 0 1 1.6-1.6z"/><path d="M14.6 5.8v1.8M14.6 11.1v1.8M14.6 16.4v1.8"/>',
  trophy: '<path d="M7.6 4h8.8v5.6a4.4 4.4 0 0 1-8.8 0z"/><path d="M7.6 6.2H5a.9.9 0 0 0-.9.9 3.6 3.6 0 0 0 3.6 3.6M16.4 6.2H19a.9.9 0 0 1 .9.9 3.6 3.6 0 0 1-3.6 3.6"/><path d="M12 14v3.4M8.4 20.4h7.2M9.6 20.4c0-1.7 1-3 2.4-3s2.4 1.3 2.4 3"/>',
  user: '<circle cx="12" cy="8.2" r="3.9"/><path d="M4.6 20.6a7.4 7.4 0 0 1 14.8 0"/>',
  users: '<circle cx="9.2" cy="8.4" r="3.5"/><path d="M2.8 20a6.4 6.4 0 0 1 12.8 0"/><path d="M15.6 5.1a3.5 3.5 0 0 1 0 6.6M17.8 14.2a6.4 6.4 0 0 1 3.4 5.8"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m20 20-4.4-4.4"/>',
  sliders: '<path d="M4 7.5h9.5M18.5 7.5H20M4 16.5h2.5M11.5 16.5H20"/><circle cx="16" cy="7.5" r="2.4"/><circle cx="9" cy="16.5" r="2.4"/>',
  bell: '<path d="M6.2 16.4V11a5.8 5.8 0 0 1 11.6 0v5.4l1.6 2.1H4.6z"/><path d="M10 20.8a2.1 2.1 0 0 0 4 0"/>',
  chevronLeft: '<path d="m14.8 5.5-6.5 6.5 6.5 6.5"/>',
  chevronRight: '<path d="m9.2 5.5 6.5 6.5-6.5 6.5"/>',
  chevronDown: '<path d="m6 9.2 6 6 6-6"/>',
  arrowRight: '<path d="M4.8 12h14.2M13.4 6.2 19.2 12l-5.8 5.8"/>',
  heart: '<path d="M12 20.2s-7.6-4.6-7.6-10.3A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.6 2.6c0 5.7-7.6 10.3-7.6 10.3z"/>',
  share: '<path d="M12 3.6v11.2M7.4 8 12 3.6 16.6 8"/><path d="M5.6 12.6v6a1.8 1.8 0 0 0 1.8 1.8h9.2a1.8 1.8 0 0 0 1.8-1.8v-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7.2V12l3.2 2"/>',
  calendar: '<rect x="3.6" y="5" width="16.8" height="15.6" rx="3.2"/><path d="M3.6 10h16.8M8.2 3v3.6M15.8 3v3.6"/>',
  check: '<path d="m5.2 12.6 4.4 4.4 9.2-9.6"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8.2 12.3 2.6 2.6 5-5.2"/>',
  plus: '<path d="M12 5.2v13.6M5.2 12h13.6"/>',
  minus: '<path d="M5.2 12h13.6"/>',
  close: '<path d="m6.4 6.4 11.2 11.2M17.6 6.4 6.4 17.6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.2M12 7.9v.1"/>',
  shield: '<path d="M12 3.3 4.8 6.1v5.3c0 4.6 3 8 7.2 9.4 4.2-1.4 7.2-4.8 7.2-9.4V6.1z"/><path d="m8.9 12.1 2.2 2.2 4-4.1"/>',
  navigate: '<path d="M20.4 3.6 3.6 10.4l7.1 2.9 2.9 7.1z"/>',
  route: '<circle cx="6" cy="18" r="2.4"/><circle cx="18" cy="6" r="2.4"/><path d="M8.4 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.6"/>',
  phone: '<rect x="6.4" y="2.8" width="11.2" height="18.4" rx="2.8"/><path d="M10.6 18h2.8"/>',
  offline: '<rect x="6.4" y="2.8" width="11.2" height="18.4" rx="2.8"/><path d="m9.6 11.6 1.8 1.8 3.2-3.4"/>',
  zap: '<path d="M13.2 2.8 4.8 13.4h6.6l-1 7.8 8.8-10.8h-6.6z"/>',
  gift: '<rect x="3.6" y="8" width="16.8" height="4.2" rx="1.2"/><path d="M5.2 12.2v7a1.4 1.4 0 0 0 1.4 1.4h10.8a1.4 1.4 0 0 0 1.4-1.4v-7M12 8v12.6"/><path d="M12 8S10.6 3.6 8.2 3.6a2.2 2.2 0 0 0 0 4.4zM12 8s1.4-4.4 3.8-4.4a2.2 2.2 0 0 1 0 4.4z"/>',
  flag: '<path d="M5.4 21V4.2"/><path d="M5.4 4.6h11.4l-2.2 4.2 2.2 4.2H5.4"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
  sparkle: '<path d="M12 3.2c.7 4.6 2.7 6.8 7.6 8.8-4.9 2-6.9 4.2-7.6 8.8-.7-4.6-2.7-6.8-7.6-8.8 4.9-2 6.9-4.2 7.6-8.8z"/>',
  sparkles: '<path d="M10 4.2c.6 3.7 2.2 5.4 6 6.9-3.8 1.5-5.4 3.2-6 6.9-.6-3.7-2.2-5.4-6-6.9 3.8-1.5 5.4-3.2 6-6.9z"/><path d="M18.4 3.2v3.6M16.6 5h3.6M18.6 16.6v3.2M17 18.2h3.2"/>',
  crosshair: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.4"/><path d="M12 2.4v2.6M12 19v2.6M2.4 12H5M19 12h2.6"/>',
  layers: '<path d="m12 3.6 8.6 4.6L12 12.8 3.4 8.2z"/><path d="m3.4 12.4 8.6 4.6 8.6-4.6M3.4 16.4l8.6 4.6 8.6-4.6"/>',
  sunset: '<path d="M3 17.6h18M6.2 14a5.8 5.8 0 0 1 11.6 0"/><path d="M12 3.6v3.2M4.6 7.4l1.6 1.6M19.4 7.4 17.8 9M8.6 21h6.8"/>',
  moon: '<path d="M19.6 14.6A8 8 0 0 1 9.4 4.4a8 8 0 1 0 10.2 10.2z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.8v2.2M12 19v2.2M2.8 12H5M19 12h2.2M5.5 5.5l1.6 1.6M16.9 16.9l1.6 1.6M5.5 18.5l1.6-1.6M16.9 7.1l1.6-1.6"/>',
  list: '<path d="M9 6.5h11M9 12h11M9 17.5h11"/><path d="M4.4 6.5h.2M4.4 12h.2M4.4 17.5h.2"/>',
  map: '<path d="M9 4.6 3.6 6.6v13l5.4-2 6 2 5.4-2v-13l-5.4 2z"/><path d="M9 4.6v13M15 6.6v13"/>',
  lock: '<rect x="5" y="10.4" width="14" height="10.2" rx="2.6"/><path d="M8.2 10.4V8a3.8 3.8 0 0 1 7.6 0v2.4"/><path d="M12 14.4v2.2"/>',
  eye: '<path d="M2.6 12S6 5.6 12 5.6 21.4 12 21.4 12 18 18.4 12 18.4 2.6 12 2.6 12z"/><circle cx="12" cy="12" r="2.8"/>',
  card: '<rect x="3" y="5.6" width="18" height="12.8" rx="2.8"/><path d="M3 10h18M6.8 14.6h3.4"/>',
  edit: '<path d="M4.4 19.6h3.8L19 8.8a2.7 2.7 0 0 0-3.8-3.8L4.4 15.8z"/><path d="m13.8 6.4 3.8 3.8"/>',
  parking: '<rect x="3.6" y="3.6" width="16.8" height="16.8" rx="4"/><path d="M9.6 16.8V7.4h3a2.9 2.9 0 0 1 0 5.8h-3"/>',
  coffee: '<path d="M4.2 9h12.4v4.8a5 5 0 0 1-5 5H9.2a5 5 0 0 1-5-5z"/><path d="M16.6 10.4h1.4a2.5 2.5 0 0 1 0 5h-1.6M8 3.4v2.6M12 3.4v2.6"/>',
  tree: '<path d="M12 21v-4.2"/><path d="M12 3.2 6 11.6h3L5.6 16.8h12.8L15 11.6h3z"/>',
  timer: '<circle cx="12" cy="13.4" r="7.6"/><path d="M12 9.6v3.8l2.4 1.6M9.6 2.6h4.8"/>',
  qr: '<rect x="3.6" y="3.6" width="6.4" height="6.4" rx="1.4"/><rect x="14" y="3.6" width="6.4" height="6.4" rx="1.4"/><rect x="3.6" y="14" width="6.4" height="6.4" rx="1.4"/><path d="M14 14h2.6v2.6H14zM18.4 18.4h2M14 20.4h.1M20.4 14v.1"/>',
  stamp: '<path d="M8.6 3.6h6.8l-1 7h-4.8z"/><path d="M4.4 14.2a2 2 0 0 1 2-2h11.2a2 2 0 0 1 2 2v2.2H4.4zM6 20.4h12"/>',
  locker: '<rect x="4.4" y="3.2" width="15.2" height="17.6" rx="2.4"/><path d="M12 3.2v17.6M8.6 8.6v2M15.4 8.6v2"/>',
};

const CAT = {
  // steering wheel (go-karting)
  kart: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.4"/><path d="M3.4 10.6c2.8.6 4.7.6 6.3.6M20.6 10.6c-2.8.6-4.7.6-6.3.6M12 14.4v6.4"/>',
  // bowling pin
  bowling: '<path d="M12 2.8c1.5 0 2.3 1.1 2.3 2.6 0 1.3-.9 2.1-.9 3.2 0 1.6 3.2 3.4 3.2 7.1 0 2.4-.8 4.3-1.7 5.5H9.1c-.9-1.2-1.7-3.1-1.7-5.5 0-3.7 3.2-5.5 3.2-7.1 0-1.1-.9-1.9-.9-3.2 0-1.5.8-2.6 2.3-2.6z"/><path d="M10.5 9.9h3"/>',
  // VR headset
  vr: '<path d="M4.4 7.8h15.2a1.9 1.9 0 0 1 1.9 1.9v4.6a2.6 2.6 0 0 1-2.6 2.6h-3.1a2 2 0 0 1-1.7-1l-.6-1.1a1.7 1.7 0 0 0-3 0l-.6 1.1a2 2 0 0 1-1.7 1H5.1a2.6 2.6 0 0 1-2.6-2.6V9.7a1.9 1.9 0 0 1 1.9-1.9z"/><path d="M7.2 7.8 8.4 5h7.2l1.2 2.8"/>',
  // trampoline + bounce arrow
  trampoline: '<ellipse cx="12" cy="13.6" rx="9" ry="2.8"/><path d="M5 15.8 4 20.4M19 15.8l1 4.6M12 16.4v4"/><path d="M12 3.2v6.2M9.4 5.8 12 3.2l2.6 2.6"/>',
  // escape room key
  escape: '<circle cx="7.6" cy="15.6" r="4"/><path d="m10.4 12.8 9.2-9.2M16.4 6.8l2.6 2.6M13.8 9.4l2 2"/>',
  // cricket bat + ball
  cricket: '<path d="m4.1 17.3 8.7-8.7 2.6 2.6-8.7 8.7a1.3 1.3 0 0 1-1.8 0l-.8-.8a1.3 1.3 0 0 1 0-1.8z"/><path d="m14.1 9.9 5.7-5.7"/><circle cx="18.2" cy="17.4" r="2.4"/>',
  // water wave
  water: '<path d="M2.6 8.6c1.9 0 2.8-1.8 4.7-1.8s2.8 1.8 4.7 1.8 2.8-1.8 4.7-1.8 2.8 1.8 4.7 1.8"/><path d="M2.6 13.4c1.9 0 2.8-1.8 4.7-1.8s2.8 1.8 4.7 1.8 2.8-1.8 4.7-1.8 2.8 1.8 4.7 1.8"/><path d="M2.6 18.2c1.9 0 2.8-1.8 4.7-1.8s2.8 1.8 4.7 1.8 2.8-1.8 4.7-1.8 2.8 1.8 4.7 1.8"/>',
  // snowflake
  snow: '<path d="M12 2.6v18.8M3.9 7.3l16.2 9.4M3.9 16.7l16.2-9.4"/><path d="M9.6 4.2 12 6l2.4-1.8M9.6 19.8 12 18l2.4 1.8M4.4 10.8l2.8-.9-.4-3M19.6 13.2l-2.8.9.4 3M4.4 13.2l2.8.9-.4 3M19.6 10.8l-2.8-.9.4-3"/>',
  // karaoke mic
  karaoke: '<rect x="9" y="2.8" width="6" height="11" rx="3"/><path d="M5.6 11a6.4 6.4 0 0 0 12.8 0M12 17.4v3.8M8.8 21.2h6.4"/>',
  // board-game dice
  boardgame: '<rect x="3.8" y="3.8" width="16.4" height="16.4" rx="3.8"/><circle cx="8.6" cy="8.6" r="1.15" fill="currentColor" stroke="none"/><circle cx="15.4" cy="8.6" r="1.15" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.15" fill="currentColor" stroke="none"/><circle cx="8.6" cy="15.4" r="1.15" fill="currentColor" stroke="none"/><circle cx="15.4" cy="15.4" r="1.15" fill="currentColor" stroke="none"/>',
  // workshop palette
  workshop: '<path d="M12 3a9 9 0 0 0 0 18c1.2 0 1.9-.8 1.9-1.8 0-1.3-1-1.7-1-2.7 0-1 .8-1.7 1.8-1.7h2.4A3.9 3.9 0 0 0 21 10.9C21 6.5 17 3 12 3z"/><circle cx="7.6" cy="11.6" r="1.15" fill="currentColor" stroke="none"/><circle cx="9.6" cy="7.6" r="1.15" fill="currentColor" stroke="none"/><circle cx="14.2" cy="7.2" r="1.15" fill="currentColor" stroke="none"/>',
  // football
  football: '<circle cx="12" cy="12" r="9"/><path d="m12 7.6 4 2.9-1.5 4.7h-5L8 10.5z"/><path d="M12 3v4.6M16 10.5l4.4-1.4M14.5 15.2l2.7 3.8M9.5 15.2l-2.7 3.8M8 10.5 3.6 9.1"/>',
  // "more" grid
  more: '<rect x="4" y="4" width="6.6" height="6.6" rx="2"/><rect x="13.4" y="4" width="6.6" height="6.6" rx="2"/><rect x="4" y="13.4" width="6.6" height="6.6" rx="2"/><rect x="13.4" y="13.4" width="6.6" height="6.6" rx="2"/>',
};

export const ICONS = { ...UI, ...CAT };
export const ICON_NAMES = Object.keys(ICONS);
export const CATEGORY_ICONS = Object.keys(CAT);

/**
 * icon(name, { size = 24, cls = '', sw = 1.85 }) -> inline <svg> string.
 * Colour comes from CSS `color` (stroke="currentColor").
 */
export function icon(name, { size = 24, cls = '', sw = 1.85 } = {}) {
  const body = ICONS[name];
  if (!body) throw new Error(`icons.mjs: unknown icon "${name}"`);
  return `<svg class="sc-ic${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}
