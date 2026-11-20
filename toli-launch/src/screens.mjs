// toli app screens for the launch film.
// screen(name) -> '<div class="app-screen app-screen--NAME">…</div>' (393×852, dark UI)
// phone(innerHtml, { id }) -> device frame (.phone is 421×880; screen sits at left 14 / top 14)
// Contract: no ids inside screens, parts tagged with data-part, no CSS transforms on
// data-part elements / .phone / .app-screen, no JS, no external URLs.

import { icon } from './icons.mjs';

export const SCREENS = ['home', 'explore', 'results', 'map', 'venue', 'packages', 'datetime', 'summary', 'ticket', 'xp', 'missions', 'rewards'];

/* ------------------------------------------------------------------ helpers */

const ic = (name, size = 24, cls = '', sw) => icon(name, { size, cls, ...(sw ? { sw } : {}) });
const part = (p) => (p ? ` data-part="${p}"` : '');

const statusBar = () => `
<div class="sc-status">
  <span class="sc-status__time">9:41</span>
  <span class="sc-status__right">
    <svg class="sc-status__sig" viewBox="0 0 18 12" width="18" height="12" aria-hidden="true"><rect x="0" y="8" width="3.2" height="4" rx="1"/><rect x="4.9" y="5.6" width="3.2" height="6.4" rx="1"/><rect x="9.8" y="3" width="3.2" height="9" rx="1"/><rect x="14.7" y="0" width="3.2" height="12" rx="1"/></svg>
    <svg class="sc-status__wifi" viewBox="0 0 16 12" width="16" height="12" aria-hidden="true"><path d="M8 2.2c2.3 0 4.4.9 6 2.3l1.2-1.3A10.4 10.4 0 0 0 8 .4 10.4 10.4 0 0 0 .8 3.2L2 4.5a8.6 8.6 0 0 1 6-2.3z"/><path d="M8 5.6c1.4 0 2.6.5 3.6 1.3l1.2-1.3A7 7 0 0 0 8 3.8a7 7 0 0 0-4.8 1.8l1.2 1.3c1-.8 2.2-1.3 3.6-1.3z"/><path d="M8 9.2c.5 0 1 .2 1.3.5L8 11.2 6.7 9.7c.3-.3.8-.5 1.3-.5z"/><path d="M8 7.2c.9 0 1.7.3 2.3.8L9.2 9.2A2 2 0 0 0 8 8.8a2 2 0 0 0-1.2.4L5.7 8c.6-.5 1.4-.8 2.3-.8z"/></svg>
    <span class="sc-batt"><span class="sc-batt__lvl"></span></span>
  </span>
</div>`;

const homeInd = () => `<div class="sc-homeind"></div>`;
const bg = (variant = '') => `<div class="sc-bg${variant ? ' sc-bg--' + variant : ''}"></div>`;

const NAV = [
  ['home', 'home'],
  ['explore', 'compass'],
  ['map', 'pin'],
  ['tickets', 'ticket'],
  ['progress', 'trophy'],
];
const nav = (active) => `
<div class="sc-navfade"></div>
<div class="sc-nav" data-part="nav">
  ${NAV.map(([key, name]) => `<span class="sc-nav__btn${key === active ? ' is-active' : ''}">${ic(name, 24, '', key === active ? 2 : 1.85)}</span>`).join('')}
</div>`;

const avatar = (l, cls = '') => `<span class="sc-av sc-av--${l.toLowerCase()}${cls ? ' ' + cls : ''}">${l}</span>`;
const crewStack = (cls = '') => `<span class="sc-avstack${cls ? ' ' + cls : ''}">${avatar('A')}${avatar('R')}${avatar('M')}</span>`;

const coin = (cls = '') => `<span class="sc-coin${cls ? ' ' + cls : ''}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.2c.6 3.9 2.2 5.6 6.2 7.8-4 2.2-5.6 3.9-6.2 7.8-.6-3.9-2.2-5.6-6.2-7.8 4-2.2 5.6-3.9 6.2-7.8z"/></svg></span>`;
const coinPill = (n = '275') => `<span class="sc-coinpill">${coin()}<b>${n}</b><span>Coins</span></span>`;

const iconBtn = (name, cls = '') => `<span class="sc-iconbtn${cls ? ' ' + cls : ''}">${ic(name, 22)}</span>`;

const chip = (label, iconName, { active = false, cls = '' } = {}) =>
  `<span class="sc-chip${active ? ' is-active' : ''}${cls ? ' ' + cls : ''}">${iconName ? ic(iconName, 18) : ''}<span>${label}</span>${active && !cls.includes('nocheck') ? ic('check', 16, 'sc-chip__check', 2.4) : ''}</span>`;

const sectionHead = (title, link = 'See all') =>
  `<div class="sc-sechead"><span class="sc-sechead__t">${title}</span>${link ? `<span class="sc-link">${link}</span>` : ''}</div>`;

/* Stylised gradient art (no photos). Decorative SVG + one big category icon. */
const ART_DECOR = {
  vr: `<svg class="sc-art__svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <ellipse cx="50" cy="60" rx="46" ry="10" fill="#F7B531" opacity=".22"/>
    <g stroke="#fff" stroke-opacity=".22" stroke-width=".6" fill="none">
      <path d="M50 58 0 100M50 58 20 100M50 58 40 100M50 58 60 100M50 58 80 100M50 58 100 100M50 58l50 22M50 58 0 80"/>
      <path d="M0 64h100M0 71h100M0 81h100M0 95h100"/>
    </g>
    <circle cx="82" cy="18" r="16" fill="#fff" opacity=".07"/><circle cx="14" cy="26" r="6" fill="#fff" opacity=".08"/>
  </svg>`,
  kart: `<svg class="sc-art__svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path d="M-10 80C20 60 30 92 60 70S90 30 115 40" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="16" stroke-linecap="round"/>
    <path d="M-10 80C20 60 30 92 60 70S90 30 115 40" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1" stroke-dasharray="4 4"/>
    <g fill="#fff" opacity=".2"><rect x="74" y="6" width="6" height="6"/><rect x="86" y="6" width="6" height="6"/><rect x="80" y="12" width="6" height="6"/><rect x="92" y="12" width="6" height="6"/><rect x="74" y="18" width="6" height="6"/><rect x="86" y="18" width="6" height="6"/></g>
  </svg>`,
  bowling: `<svg class="sc-art__svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path d="M30 100 44 40h12l14 60z" fill="#fff" opacity=".1"/>
    <g stroke="#fff" stroke-opacity=".18" stroke-width=".6"><path d="M36.7 100 46 40M43.3 100 48 40M50 100V40M56.7 100 52 40M63.3 100 54 40"/></g>
    <circle cx="20" cy="78" r="10" fill="#fff" opacity=".14"/><circle cx="86" cy="16" r="12" fill="#fff" opacity=".07"/>
  </svg>`,
  escape: `<svg class="sc-art__svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g fill="none" stroke="#fff"><circle cx="78" cy="78" r="30" stroke-opacity=".14" stroke-width="6"/><circle cx="78" cy="78" r="18" stroke-opacity=".2" stroke-width=".8" stroke-dasharray="2 3"/></g>
    <g stroke="#fff" stroke-opacity=".2" stroke-width="1"><path d="M10 10h18M10 16h12M10 22h16"/></g>
  </svg>`,
  cricket: `<svg class="sc-art__svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g fill="#fff" opacity=".07"><rect x="0" y="0" width="100" height="12"/><rect x="0" y="24" width="100" height="12"/><rect x="0" y="48" width="100" height="12"/><rect x="0" y="72" width="100" height="12"/></g>
    <rect x="40" y="-5" width="20" height="110" fill="#fff" opacity=".1"/>
    <path d="M38 22h24M38 78h24" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>
  </svg>`,
  water: `<svg class="sc-art__svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g fill="none" stroke="#fff" stroke-linecap="round"><path d="M-5 70c10 0 15-8 25-8s15 8 25 8 15-8 25-8 15 8 25 8 15-8 25-8" stroke-opacity=".25" stroke-width="2"/><path d="M-5 84c10 0 15-8 25-8s15 8 25 8 15-8 25-8 15 8 25 8 15-8 25-8" stroke-opacity=".18" stroke-width="2"/></g>
    <circle cx="80" cy="20" r="14" fill="#fff" opacity=".1"/>
  </svg>`,
  trampoline: `<svg class="sc-art__svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="1"><ellipse cx="50" cy="84" rx="44" ry="8"/><ellipse cx="50" cy="84" rx="30" ry="5"/></g>
    <circle cx="84" cy="16" r="10" fill="#fff" opacity=".1"/><circle cx="16" cy="30" r="4" fill="#fff" opacity=".14"/>
  </svg>`,
};
const ART_ICON = { vr: 'vr', kart: 'kart', bowling: 'bowling', escape: 'escape', cricket: 'cricket', water: 'water', trampoline: 'trampoline' };

const art = (kind, { size = 40, cls = '', inner = '' } = {}) =>
  `<span class="sc-art sc-art--${kind}${cls ? ' ' + cls : ''}">${ART_DECOR[kind]}<span class="sc-art__ic">${ic(ART_ICON[kind], size, '', 1.6)}</span>${inner}</span>`;

/* Flow-screen chrome */
const topbar = (title, { left = 'chevronLeft', right = '', step = 0 } = {}) => `
<div class="sc-topbar">
  ${iconBtn(left)}
  <span class="sc-topbar__title">${title}</span>
  ${step ? `<span class="sc-topbar__step"><b>${step}</b>/3</span>` : right ? iconBtn(right) : '<span class="sc-iconbtn sc-iconbtn--ghost"></span>'}
</div>
${step ? `<div class="sc-steps">${[1, 2, 3].map((i) => `<span class="${i <= step ? 'is-on' : ''}"></span>`).join('')}</div>` : ''}`;

const ctaBar = (leftHtml, label, { iconName = 'arrowRight', cls = '' } = {}) => `
<div class="sc-ctabar${cls ? ' ' + cls : ''}">
  ${leftHtml ? `<div class="sc-ctabar__left">${leftHtml}</div>` : ''}
  <span class="sc-btn sc-btn--cta"><span>${label}</span>${iconName ? ic(iconName, 20, '', 2.1) : ''}</span>
</div>`;

const hubHead = (active) => `
<div class="sc-hubhead">
  <div class="sc-h1">Progress</div>
  ${coinPill('275')}
</div>
<div class="sc-seg">
  ${['Level', 'Missions', 'Rewards'].map((t) => `<span class="sc-seg__i${t === active ? ' is-active' : ''}">${t}</span>`).join('')}
</div>`;

/* Deterministic QR-style matrix (25×25, version-2 layout, seeded PRNG at module load). */
const QR_PATH = (() => {
  const N = 25;
  let a = 0x5ce4e22 | 0;
  const rnd = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const reserved = (r, c) => {
    const inF = (r0, c0) => r >= r0 - 1 && r <= r0 + 7 && c >= c0 - 1 && c <= c0 + 7;
    if (inF(0, 0) || inF(0, N - 7) || inF(N - 7, 0)) return true; // finders + separators
    if (r >= 16 && r <= 20 && c >= 16 && c <= 20) return true; // alignment
    if (r >= 10 && r <= 14 && c >= 10 && c <= 14) return true; // centre logo
    return false;
  };
  let d = '';
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (reserved(r, c)) continue;
      let on;
      if (r === 6) on = c % 2 === 0;
      else if (c === 6) on = r % 2 === 0;
      else on = rnd() < 0.5;
      if (on) d += `M${c + 2} ${r + 2}h1v1h-1z`;
    }
  }
  return d;
})();
const qrSvg = () => {
  const finder = (x, y) => `<rect x="${x + 0.5}" y="${y + 0.5}" width="6" height="6" rx="1.6" fill="none" stroke="#1C0E2B" stroke-width="1"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx=".8"/>`;
  return `<svg class="sc-qr__svg" viewBox="0 0 29 29" aria-hidden="true" shape-rendering="geometricPrecision"><g fill="#1C0E2B"><path d="${QR_PATH}" shape-rendering="crispEdges"/>${finder(2, 2)}${finder(20, 2)}${finder(2, 20)}<rect x="18.5" y="18.5" width="4" height="4" rx="1" fill="none" stroke="#1C0E2B" stroke-width="1"/><rect x="20" y="20" width="1" height="1"/></g></svg>`;
};

/* ------------------------------------------------------------------ screens */

const S = {};

S.home = () => `
${bg()}
${statusBar()}
<div class="sc-body">
  <div class="sc-homehead" data-part="greeting">
    <div class="sc-homehead__txt">
      <div class="sc-eyebrow">${ic('pin', 15)}<span>Hyderabad</span></div>
      <div class="sc-h1 sc-h1--xl">Hi Asha</div>
      <div class="sc-sub">Where's the crew headed?</div>
    </div>
    <div class="sc-homehead__act">
      ${coinPill('275')}
      <span class="sc-iconbtn sc-iconbtn--dot">${ic('bell', 22)}</span>
    </div>
  </div>

  <div class="sc-search" data-part="search">
    ${ic('search', 20)}
    <span class="sc-search__ph">Search venues, activities…</span>
    <span class="sc-search__btn">${ic('sliders', 20)}</span>
  </div>

  <div class="sc-chips sc-chips--wrap" data-part="chips">
    ${chip('Go-karting', 'kart')}${chip('Bowling', 'bowling')}${chip('VR', 'vr')}${chip('Trampoline', 'trampoline')}
    ${chip('Escape rooms', 'escape')}${chip('Box cricket', 'cricket')}${chip('Water parks', 'water')}${chip('More', 'more', { cls: 'sc-chip--more' })}
  </div>

  <div class="sc-card sc-level" data-part="level-card">
    <div class="sc-level__badge"><span class="sc-level__lbl">LVL</span><span class="sc-level__n">9</span></div>
    <div class="sc-level__main">
      <div class="sc-level__row">
        <span class="sc-level__t">Level 9</span>
        <span class="sc-level__xp"><b>3,230</b> / 3,330 XP</span>
      </div>
      <div class="sc-xptrack"><span class="sc-xpfill" data-part="xp-bar" style="width:81%"></span></div>
      <div class="sc-level__foot"><span>100 XP to <b>Level 10 · The Regular</b></span>${ic('chevronRight', 18, 'sc-row__chev')}</div>
    </div>
  </div>

  ${sectionHead('Trending near you')}
  <div class="sc-carousel" data-part="trending">
    <div class="sc-tcard">
      ${art('vr', { size: 56, cls: 'sc-tcard__art', inner: `<span class="sc-tag">${ic('vr', 14)}VR</span><span class="sc-fav">${ic('heart', 18)}</span>` })}
      <div class="sc-tcard__body">
        <div class="sc-tcard__row"><span class="sc-tcard__name">Holodeck VR</span><span class="sc-price"><small>from</small> ₹249</span></div>
        <div class="sc-meta">${ic('pin', 15)}Madhapur · 6.2 km</div>
      </div>
    </div>
    <div class="sc-tcard">
      ${art('kart', { size: 56, cls: 'sc-tcard__art', inner: `<span class="sc-tag">${ic('kart', 14)}Go-karting</span><span class="sc-fav">${ic('heart', 18)}</span>` })}
      <div class="sc-tcard__body">
        <div class="sc-tcard__row"><span class="sc-tcard__name">Lapline Karting</span><span class="sc-price"><small>from</small> ₹549</span></div>
        <div class="sc-meta">${ic('pin', 15)}Gachibowli · 9.6 km</div>
      </div>
    </div>
  </div>
</div>
${nav('home')}
${homeInd()}`;

S.explore = () => `
${bg()}
${statusBar()}
<div class="sc-body">
  <div class="sc-pagehead">
    <div class="sc-h1">Plan an outing</div>
    <span class="sc-link sc-link--muted">Reset</span>
  </div>

  <div class="sc-card sc-plan" data-part="what">
    <div class="sc-plan__label"><span class="sc-plan__k">What</span><span class="sc-plan__hint">Pick a mood or two</span></div>
    <div class="sc-chips sc-chips--wrap sc-chips--tight">
      ${chip('Competitive', 'trophy', { active: true, cls: 'sc-chip--sm' })}${chip('Immersive', 'vr', { active: true, cls: 'sc-chip--sm' })}${chip('Adrenaline', 'zap', { cls: 'sc-chip--sm' })}
      ${chip('Chill', 'coffee', { cls: 'sc-chip--sm' })}${chip('Creative', 'workshop', { cls: 'sc-chip--sm' })}
    </div>
  </div>

  <div class="sc-card sc-plan" data-part="when">
    <div class="sc-plan__label"><span class="sc-plan__k">When</span><span class="sc-plan__hint">This weekend</span></div>
    <div class="sc-plan__val">
      <span class="sc-plan__ic">${ic('calendar', 22)}</span>
      <span class="sc-plan__vt"><b>Sun 22 Nov · Evening</b><small>5 pm – 9 pm</small></span>
      ${ic('chevronRight', 20, 'sc-plan__chev')}
    </div>
    <div class="sc-seg sc-seg--sm">
      <span class="sc-seg__i">${ic('sun', 16)}Afternoon</span><span class="sc-seg__i is-active">${ic('sunset', 16)}Evening</span><span class="sc-seg__i">${ic('moon', 16)}Night</span>
    </div>
  </div>

  <div class="sc-card sc-plan" data-part="who">
    <div class="sc-plan__label"><span class="sc-plan__k">Who</span><span class="sc-plan__hint"><b>3 players</b></span></div>
    <div class="sc-crew">
      <span class="sc-crew__p">${avatar('A', 'sc-av--xl')}<small>You</small></span>
      <span class="sc-crew__p">${avatar('R', 'sc-av--xl')}<small>Rohan</small></span>
      <span class="sc-crew__p">${avatar('M', 'sc-av--xl')}<small>Meera</small></span>
      <span class="sc-crew__p"><span class="sc-av sc-av--xl sc-av--add">${ic('plus', 20)}</span><small>Invite</small></span>
    </div>
  </div>

  <div class="sc-explore-foot">
    <div class="sc-hint">${ic('sparkles', 16)}<span>5 venues match your plan</span></div>
    <span class="sc-btn sc-btn--block" data-part="cta"><span>Show venues</span>${ic('arrowRight', 20, '', 2.1)}</span>
  </div>
</div>
${nav('explore')}
${homeInd()}`;

const VENUES = [
  { key: 'card', name: 'Ten Pin Theory', cat: 'Bowling', area: 'Jubilee Hills', km: '4.9', price: '299', art: 'bowling', open: 'Till 11 pm' },
  { key: 'card-holodeck', name: 'Holodeck VR', cat: 'VR', area: 'Madhapur', km: '6.2', price: '249', art: 'vr', open: 'Till 10 pm', sel: true },
  { key: 'card', name: 'Last Over Box Cricket', cat: 'Box cricket', area: 'Hitech City', km: '7.3', price: '179', art: 'cricket', open: 'Till midnight' },
  { key: 'card', name: 'Cipher Vault Escapes', cat: 'Escape room', area: 'Kondapur', km: '9.1', price: '449', art: 'escape', open: 'Till 10 pm' },
  { key: 'card', name: 'Lapline Karting', cat: 'Go-karting', area: 'Gachibowli', km: '9.6', price: '549', art: 'kart', open: 'Till 10 pm' },
];

S.results = () => `
${bg()}
${statusBar()}
<div class="sc-body">
  <div class="sc-resbar">
    ${iconBtn('chevronLeft')}
    <span class="sc-respill">${ic('calendar', 16)}<span>Sun 22 Nov · Evening · 3 players</span></span>
    ${iconBtn('map')}
  </div>
  <div class="sc-restitle">
    <div class="sc-h1">5 venues for your crew</div>
  </div>
  <div class="sc-chips sc-chips--row">
    ${chip('Competitive', 'trophy', { active: true, cls: 'sc-chip--sm sc-chip--nocheck' })}${chip('Immersive', 'vr', { active: true, cls: 'sc-chip--sm sc-chip--nocheck' })}<span class="sc-chip sc-chip--sm sc-chip--ghost"><span>Nearest</span>${ic('chevronDown', 16)}</span>
  </div>
  <div class="sc-vlist">
    ${VENUES.map((v) => `
    <div class="sc-card sc-vcard${v.sel ? ' is-selected' : ''}" data-part="${v.key}">
      ${art(v.art, { size: 34, cls: 'sc-vcard__art' })}
      <div class="sc-vcard__main">
        ${v.sel ? `<span class="sc-badge">${ic('sparkles', 13)}Matches your plan</span>` : `<span class="sc-vcard__cat">${v.cat}</span>`}
        <div class="sc-vcard__name">${v.name}</div>
        <div class="sc-meta">${ic('pin', 15)}${v.area} · ${v.km} km</div>
      </div>
      <div class="sc-vcard__price"><small>from</small><b>₹${v.price}</b><small>/player</small></div>
    </div>`).join('')}
  </div>
</div>
${nav('explore')}
${homeInd()}`;

/* Map: pins are inside the map layer so they move with it. Tip coordinates (x,y). */
const PINS = [
  { x: 82, y: 236, p: '449' },
  { x: 116, y: 330, p: '179' },
  { x: 62, y: 488, p: '549' },
  { x: 350, y: 470, p: '299' },
];
const SEL_PIN = { x: 212, y: 392 };
const seeded = (seed) => {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
// minor street grid (deterministic), drawn rotated under the arterials
const { MAP_MINOR, MAP_LANES } = (() => {
  const r = seeded(0x22b0b);
  let minor = '', lanes = '';
  for (let y = -320; y < 1180; y += 40 + Math.round(r() * 26)) minor += `M-320 ${y}H720`;
  for (let x = -320; x < 720; x += 46 + Math.round(r() * 30)) minor += `M${x} -320V1180`;
  for (let i = 0; i < 70; i++) {
    const x = -200 + Math.round(r() * 800), y = -200 + Math.round(r() * 1250), len = 30 + Math.round(r() * 50);
    lanes += r() < 0.5 ? `M${x} ${y}h${len}` : `M${x} ${y}v${len}`;
  }
  return { MAP_MINOR: minor, MAP_LANES: lanes };
})();

S.map = () => `
<div class="sc-map" data-part="map">
  <svg class="sc-map__svg" viewBox="0 0 393 852" width="393" height="852" aria-hidden="true">
    <rect width="393" height="852" fill="#160C23"/>
    <path d="${MAP_MINOR}" fill="none" stroke="#1F1130" stroke-width="2.2" transform="rotate(-14 196 426)"/>
    <path d="${MAP_LANES}" fill="none" stroke="#1B0E2A" stroke-width="1.2" transform="rotate(-14 196 426)"/>
    <path d="M14 600c26-22 74-20 92 4s6 56-30 60-72-8-70-34 2-20 8-30z" fill="#251D0C"/>
    <path d="M300 150c30-6 60 8 70 30s-6 44-34 44-48-14-50-38 0-32 14-36z" fill="#251D0C"/>
    <path d="M262 424c24-16 52-4 58 26 5 26 22 44 12 76-9 30-40 30-54 8-13-20-4-40-18-62-12-20-14-38 2-48z" fill="#25133A" stroke="#F7B531" stroke-opacity=".22" stroke-width="1.2"/>
    <path d="M270 440c18-10 38-2 42 20 4 22 16 40 8 64" fill="none" stroke="#F7B531" stroke-opacity=".10" stroke-width="1"/>
    <g fill="none" stroke="#26153A" stroke-linecap="round">
      <path d="M-10 150 410 196" stroke-width="6"/><path d="M-10 372c100-24 200 10 420-14" stroke-width="6"/>
      <path d="M44 -10 74 880" stroke-width="6"/><path d="M336 -10c-14 220 22 420-6 890" stroke-width="6"/>
      <path d="M-10 520 410 560" stroke-width="6"/><path d="M240 -10l22 300" stroke-width="5"/>
      <path d="M-10 716 410 690" stroke-width="6"/><path d="M128 400l-30 480" stroke-width="5"/><path d="M226 560 236 880" stroke-width="5"/>
    </g>
    <g fill="none" stroke-linecap="round">
      <path d="M-20 262C90 232 170 252 240 212S360 122 420 112" stroke="#311C4A" stroke-width="11"/>
      <path d="M120 -20C136 200 106 420 150 620S192 800 182 880" stroke="#311C4A" stroke-width="11"/>
      <path d="M-20 650C100 610 220 570 300 478S380 332 420 302" stroke="#311C4A" stroke-width="11"/>
      <path d="M-20 262C90 232 170 252 240 212S360 122 420 112M120 -20C136 200 106 420 150 620S192 800 182 880M-20 650C100 610 220 570 300 478S380 332 420 302" stroke="#662A3E" stroke-width="1" stroke-dasharray="6 7"/>
    </g>
    <path d="M288 600C280 556 264 520 252 478S226 420 214 402" fill="none" stroke="#F7B531" stroke-opacity=".25" stroke-width="10" stroke-linecap="round"/>
    <path d="M288 600C280 556 264 520 252 478S226 420 214 402" fill="none" stroke="#F7B531" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="1 7"/>
    <g font-family="Rajdhani" font-weight="600" font-size="11" letter-spacing="2.2" fill="#824D5F">
      <text x="22" y="180">KONDAPUR</text><text x="142" y="236">HITECH CITY</text><text x="176" y="326">MADHAPUR</text>
      <text x="14" y="430">GACHIBOWLI</text><text x="256" y="410">JUBILEE HILLS</text>
    </g>
  </svg>
  <span class="sc-me" style="left:288px;top:600px"><span class="sc-me__halo"></span><span class="sc-me__dot"></span></span>
  ${PINS.map((p) => `<span class="sc-pin" style="left:${p.x - 31}px;top:${p.y - 38}px">₹${p.p}</span>`).join('')}
  <span class="sc-pin sc-pin--sel" data-part="pin-249" style="left:${SEL_PIN.x - 42}px;top:${SEL_PIN.y - 50}px">${ic('vr', 18)}₹249</span>
</div>
<div class="sc-mapscrim"></div>
${statusBar()}
<div class="sc-maptop">
  <div class="sc-search sc-search--map">
    ${ic('search', 20)}
    <span class="sc-search__ph sc-search__ph--val">Sun 22 Nov · Evening · 3 players</span>
    <span class="sc-search__btn">${ic('sliders', 20)}</span>
  </div>
  <div class="sc-chips sc-chips--row">
    ${chip('Competitive', 'trophy', { active: true, cls: 'sc-chip--sm sc-chip--nocheck' })}${chip('Immersive', 'vr', { active: true, cls: 'sc-chip--sm sc-chip--nocheck' })}<span class="sc-chip sc-chip--sm sc-chip--glass">${ic('list', 16)}<span>List</span></span>
  </div>
</div>
<div class="sc-mapctl">
  <span class="sc-iconbtn sc-iconbtn--glass">${ic('crosshair', 22)}</span>
  <span class="sc-iconbtn sc-iconbtn--glass">${ic('layers', 22)}</span>
</div>
<div class="sc-card sc-minicard" data-part="mini-card">
  ${art('vr', { size: 34, cls: 'sc-minicard__art' })}
  <div class="sc-minicard__main">
    <div class="sc-minicard__name">Holodeck VR</div>
    <div class="sc-meta">${ic('vr', 15)}VR · Madhapur · 6.2 km</div>
    <div class="sc-minicard__price"><small>from</small> <b>₹249</b> <small>/player</small></div>
  </div>
  <span class="sc-roundbtn">${ic('arrowRight', 22, '', 2.1)}</span>
</div>
${nav('map')}
${homeInd()}`;

S.venue = () => `
${bg()}
<div class="sc-hero" data-part="hero">
  <div class="sc-hero__stage"></div>
  <div class="sc-hero__grid"></div>
  <div class="sc-hero__floor"></div>
  <div class="sc-hero__ring sc-hero__ring--1"></div>
  <div class="sc-hero__ring sc-hero__ring--2"></div>
  <div class="sc-hero__img" data-part="hero-img" style="background-image:url('assets/renders/vr-hero.png')"></div>
  <div class="sc-hero__fade"></div>
</div>
${statusBar()}
<div class="sc-herobar">
  ${iconBtn('chevronLeft', 'sc-iconbtn--glass')}
  <span class="sc-herobar__r">${iconBtn('heart', 'sc-iconbtn--glass')}${iconBtn('share', 'sc-iconbtn--glass')}</span>
</div>
<div class="sc-body sc-body--venue">
  <div class="sc-vtitle" data-part="title">
    <div class="sc-h1 sc-h1--xl">Holodeck VR</div>
    <div class="sc-sub">Free-roam VR arena for crews of 2–6</div>
  </div>
  <div class="sc-chips sc-chips--row" data-part="chips">
    ${chip('VR', 'vr', { cls: 'sc-chip--sm sc-chip--accent' })}${chip('Madhapur', 'pin', { cls: 'sc-chip--sm' })}${chip('6.2 km', 'navigate', { cls: 'sc-chip--sm' })}${chip('45 min', 'clock', { cls: 'sc-chip--sm' })}
  </div>
  <div class="sc-card sc-incl" data-part="included">
    <div class="sc-card__t">What's included</div>
    <div class="sc-incl__grid">
      <span class="sc-incl__i"><span class="sc-tile">${ic('timer', 20)}</span><span>45-min free-roam session</span></span>
      <span class="sc-incl__i"><span class="sc-tile">${ic('vr', 20)}</span><span>Pick 2 VR worlds</span></span>
      <span class="sc-incl__i"><span class="sc-tile">${ic('sparkle', 20)}</span><span>Sanitised headsets</span></span>
      <span class="sc-incl__i"><span class="sc-tile">${ic('trophy', 20)}</span><span>Crew scoreboard</span></span>
    </div>
  </div>
  <div class="sc-card sc-rows" data-part="rules">
    <div class="sc-row" data-part="rules-row"><span class="sc-tile">${ic('shield', 20)}</span><span class="sc-row__t"><b>Rules</b><small>Set by venue · ages 10+, closed shoes</small></span>${ic('chevronRight', 18, 'sc-row__chev')}</div>
    <div class="sc-row"><span class="sc-tile">${ic('route', 20)}</span><span class="sc-row__t"><b>Getting there</b><small>Madhapur · 6.2 km · parking on site</small></span>${ic('chevronRight', 18, 'sc-row__chev')}</div>
    <div class="sc-row"><span class="sc-tile">${ic('offline', 20)}</span><span class="sc-row__t"><b>Offline ticket</b><small>Your QR works without internet</small></span>${ic('chevronRight', 18, 'sc-row__chev')}</div>
  </div>
</div>
${ctaBar(`<small>from</small><span class="sc-ctabar__price"><b>₹249</b><small>/player</small></span>`, 'Choose package')}
${homeInd()}`;

S.packages = () => `
${bg()}
${statusBar()}
${topbar('Choose a package', { step: 1 })}
<div class="sc-body sc-body--flow">
  <div class="sc-vstrip">
    ${art('vr', { size: 24, cls: 'sc-vstrip__art' })}
    <span class="sc-vstrip__t"><b>Holodeck VR</b><small>VR · Madhapur · 6.2 km</small></span>
  </div>

  <div class="sc-label">Packages</div>
  <div class="sc-card sc-pkg" data-part="pkg-solo">
    <span class="sc-radio"></span>
    <span class="sc-pkg__t"><b>Solo</b><small>1 player · 45-min session</small></span>
    <span class="sc-pkg__p"><b>₹249</b></span>
  </div>
  <div class="sc-card sc-pkg is-selected" data-part="pkg-crew">
    <span class="sc-radio is-on">${ic('check', 14, '', 2.6)}</span>
    <span class="sc-pkg__t"><b>Crew of 3</b><small>3 × ₹249 · 45-min session</small></span>
    <span class="sc-pkg__p"><b>₹747</b></span>
    <div class="sc-pkg__foot">${crewStack('sc-avstack--sm')}<span>You, Rohan &amp; Meera</span><span class="sc-pkg__tag">${ic('ticket', 16)}3 tickets</span></div>
  </div>
  <div class="sc-card sc-pkg" data-part="pkg-offpeak">
    <span class="sc-radio"></span>
    <span class="sc-pkg__t"><b>Off-peak</b><small>Mon–Thu before 4 pm · per player</small></span>
    <span class="sc-pkg__p"><b>₹199</b></span>
  </div>

  <div class="sc-label">Add a perk</div>
  <div class="sc-card sc-perk" data-part="perk">
    <span class="sc-tile sc-tile--gold">${coin('sc-coin--lg')}</span>
    <span class="sc-pkg__t"><b>+5 minutes · 250 Coins</b><small>Extra VR time, paid with Coins</small></span>
    <span class="sc-addbtn">${ic('plus', 20, '', 2.4)}</span>
  </div>
</div>
${ctaBar(`<small>Crew of 3</small><b>₹747</b>`, 'Continue')}
${homeInd()}`;

const DATES = [['Fri', '20', 'Today'], ['Sat', '21'], ['Sun', '22'], ['Mon', '23'], ['Tue', '24'], ['Wed', '25']];
const SLOTS = [['5:00', '6 left'], ['6:00', '4 left', true], ['7:00', '8 left'], ['8:00', '8 left']];

S.datetime = () => `
${bg()}
${statusBar()}
${topbar('Date, time &amp; crew', { step: 2 })}
<div class="sc-body sc-body--flow">
  <div class="sc-monthrow"><b>November 2026</b><span class="sc-monthrow__nav">${ic('chevronLeft', 18)}${ic('chevronRight', 18)}</span></div>
  <div class="sc-dates" data-part="dates">
    ${DATES.map(([d, n, t]) => `<span class="sc-date${n === '22' ? ' is-selected' : ''}${t ? ' is-today' : ''}"${n === '22' ? ' data-part="date-sun22"' : ''}><small>${t || d}</small><b>${n}</b>${n === '22' ? '<i class="sc-date__dot"></i>' : ''}</span>`).join('')}
  </div>

  <div class="sc-label sc-label--row"><span>${ic('sun', 16)}Afternoon</span><span class="sc-label__r">Sun, 22 Nov</span></div>
  <div class="sc-slots sc-slots--dim">
    <span class="sc-slot is-full"><b>1:00<small> pm</small></b><small>Full</small></span><span class="sc-slot"><b>2:00<small> pm</small></b><small>2 left</small></span><span class="sc-slot is-full"><b>3:00<small> pm</small></b><small>Full</small></span><span class="sc-slot"><b>4:00<small> pm</small></b><small>5 left</small></span>
  </div>
  <div class="sc-label sc-label--row"><span>${ic('sunset', 16)}Evening</span><span class="sc-label__r sc-label__r--muted">After 5 pm</span></div>
  <div class="sc-slots" data-part="slots">
    ${SLOTS.map(([t, l, s]) => `<span class="sc-slot${s ? ' is-selected' : ''}"${s ? ' data-part="slot-6pm"' : ''}><b>${t}<small> pm</small></b><small>${l}</small></span>`).join('')}
  </div>

  <div class="sc-card sc-players" data-part="players">
    <div class="sc-players__top">
      <span class="sc-pkg__t"><b>Players</b><small>Book once for the crew</small></span>
      <span class="sc-stepper"><span class="sc-stepper__b">${ic('minus', 18, '', 2.2)}</span><b>3</b><span class="sc-stepper__b is-on">${ic('plus', 18, '', 2.2)}</span></span>
    </div>
    <div class="sc-crew sc-crew--row">
      <span class="sc-crew__p">${avatar('A', 'sc-av--lg')}<small>You</small></span>
      <span class="sc-crew__p">${avatar('R', 'sc-av--lg')}<small>Rohan</small></span>
      <span class="sc-crew__p">${avatar('M', 'sc-av--lg')}<small>Meera</small></span>
      <span class="sc-crew__p sc-crew__p--add"><span class="sc-av sc-av--lg sc-av--add">${ic('plus', 18)}</span><small>Invite</small></span>
    </div>
  </div>
</div>
${ctaBar(`<small>Sun 22 Nov · 6:00 pm</small><b>₹747</b><small class="sc-ctabar__sub2">3 players</small>`, 'Continue')}
${homeInd()}`;

S.summary = () => `
${bg()}
${statusBar()}
${topbar('Summary', { step: 3 })}
<div class="sc-body sc-body--flow">
  <div class="sc-card sc-recap">
    <div class="sc-recap__top">
      ${art('vr', { size: 28, cls: 'sc-recap__art' })}
      <span class="sc-vstrip__t"><b>Holodeck VR</b><small>Crew of 3 · 45-min session</small></span>
    </div>
    <div class="sc-recap__rows">
      <span>${ic('calendar', 18)}Sun, 22 Nov · 6:00 pm</span>
      <span>${ic('pin', 18)}Madhapur · 6.2 km</span>
      <span>${ic('users', 18)}3 players · You, Rohan, Meera</span>
    </div>
  </div>

  <div class="sc-card sc-lines" data-part="lines">
    <div class="sc-line"><span>Crew of 3 <small>(3 × ₹249)</small></span><b>₹747</b></div>
    <div class="sc-line sc-line--coins" data-part="coins-line"><span>${coin()}Coins used <small>(270)</small></span><b>−₹27</b></div>
    <div class="sc-line sc-line--total" data-part="total"><span>Total</span><b>₹720</b></div>
  </div>

  <div class="sc-card sc-earn" data-part="earn">
    <span class="sc-tile sc-tile--xp">${ic('zap', 22)}</span>
    <div class="sc-earn__main">
      <div class="sc-earn__t">You will earn</div>
      <div class="sc-earn__xp"><span><b>+60 XP</b> first visit</span><span><b>+40 XP</b> on check-in</span></div>
    </div>
  </div>

  <div class="sc-card sc-row sc-row--pay"><span class="sc-tile">${ic('card', 20)}</span><span class="sc-row__t"><b>Pay with UPI</b><small>Asha · one payment for the crew</small></span><span class="sc-link">Change</span></div>
</div>
${ctaBar('', 'Pay ₹720', { iconName: 'lock', cls: 'sc-ctabar--full' })}
${homeInd()}`;

S.ticket = () => `
${bg('ticket')}
${statusBar()}
<div class="sc-topbar">
  ${iconBtn('close')}
  <span class="sc-topbar__title">Your ticket</span>
  ${iconBtn('share')}
</div>
<div class="sc-body sc-body--flow sc-body--ticket">
  <div class="sc-confirmed" data-part="confirmed">
    <span class="sc-confirmed__ic">${ic('check', 26, '', 2.6)}</span>
    <span class="sc-confirmed__t"><b>Booking confirmed</b><small>Rohan and Meera have their tickets</small></span>
  </div>

  <div class="sc-ticket" data-part="ticket">
   <div class="sc-ticket__card">
    <div class="sc-ticket__top">
      <div class="sc-ticket__head">
        ${art('vr', { size: 26, cls: 'sc-ticket__art' })}
        <span class="sc-vstrip__t"><b>Holodeck VR</b><small>Crew of 3 · Madhapur</small></span>
      </div>
      <div class="sc-ticket__grid">
        <span><small>Date</small><b>Sun, 22 Nov</b></span>
        <span><small>Time</small><b>6:00 pm</b></span>
        <span><small>Players</small><b class="sc-ticket__pl">3 ${crewStack('sc-avstack--xs')}</b></span>
      </div>
    </div>
    <div class="sc-ticket__perf"></div>
    <div class="sc-ticket__bottom">
      <div class="sc-qr" data-part="qr">${qrSvg()}<span class="sc-qr__logo"><span>t</span></span></div>
      <div class="sc-ticket__show"><b>Show at the counter</b><small>Booking ID · HV8-22N-603</small></div>
      <div class="sc-ticket__xp">${ic('zap', 16, '', 2)}<span><b>+40 XP</b> when you check in</span></div>
    </div>
   </div>
  </div>
  <div class="sc-offline">${ic('offline', 16)}<span>Works offline · saved in Tickets</span></div>
</div>
<div class="sc-ctabar sc-ctabar--two">
  <span class="sc-btn sc-btn--ghost">${ic('navigate', 18, '', 2)}<span>Directions</span></span>
  <span class="sc-btn sc-btn--cta">${ic('users', 18, '', 2)}<span>Share with crew</span></span>
</div>
${homeInd()}`;

const RING = { r: 94, frac: 0.825 };
const CIRC = +(2 * Math.PI * RING.r).toFixed(2);
const OFFSET = +(CIRC * (1 - RING.frac)).toFixed(2);

S.xp = () => `
${bg()}
${statusBar()}
<div class="sc-body">
  ${hubHead('Level')}
  <div class="sc-ring" data-part="ring">
    <svg class="sc-ring__svg" viewBox="0 0 220 220" width="220" height="220" aria-hidden="true">
      <circle cx="110" cy="110" r="${RING.r}" fill="none" stroke="rgba(191, 143, 159,0.14)" stroke-width="14"/>
      <circle cx="110" cy="110" r="${RING.r + 13}" fill="none" stroke="rgba(191, 143, 159,0.10)" stroke-width="1" stroke-dasharray="1.5 6"/>
      <g transform="rotate(-90 110 110)">
        <circle class="sc-ring__arc" data-part="ring-arc" data-circ="${CIRC}" cx="110" cy="110" r="${RING.r}" fill="none" stroke="#F7B531" stroke-width="14" stroke-linecap="round" stroke-dasharray="${CIRC}" stroke-dashoffset="${OFFSET}"/>
      </g>
    </svg>
    <div class="sc-ring__c">
      <span class="sc-ring__lbl">Level</span>
      <span class="sc-ring__n" data-part="level-num">9</span>
      <span class="sc-ring__xp"><b data-part="xp-num">3,330</b> XP</span>
    </div>
  </div>
  <div class="sc-card sc-next">
    <span class="sc-tile sc-tile--gold">${ic('trophy', 22)}</span>
    <span class="sc-row__t"><b>Next: Level 10 · The Regular</b><small>Unlocks at 3,330 XP</small></span>
  </div>
  ${sectionHead('Ways to earn', '')}
  <div class="sc-card sc-rows sc-earnlist" data-part="earn-list">
    <div class="sc-row"><span class="sc-tile">${ic('compass', 20)}</span><span class="sc-row__t"><b>Visit a new venue</b><small>First visit, any category</small></span><span class="sc-xp">+60 XP</span></div>
    <div class="sc-row"><span class="sc-tile">${ic('qr', 20)}</span><span class="sc-row__t"><b>Check in at the counter</b><small>Scan your ticket QR</small></span><span class="sc-xp">+40 XP</span></div>
    <div class="sc-row"><span class="sc-tile">${ic('users', 20)}</span><span class="sc-row__t"><b>Plan with your crew</b><small>Book for 3 or more</small></span><span class="sc-xp">+20 XP</span></div>
  </div>
</div>
${nav('progress')}
${homeInd()}`;

S.missions = () => `
${bg()}
${statusBar()}
<div class="sc-body">
  ${hubHead('Missions')}
  <div class="sc-card sc-feat" data-part="featured">
    <div class="sc-feat__top">
      <span class="sc-feat__lbl">${ic('flag', 15)}Featured mission</span>
      <span class="sc-xp sc-xp--pill">+60 XP</span>
    </div>
    <div class="sc-feat__t">Visit a new venue</div>
    <div class="sc-sub">Collect 3 stamps this month</div>
    <div class="sc-stamps" data-part="stamps">
      <span class="sc-stamp is-done" data-part="stamp-1"><span class="sc-stamp__c">${ic('kart', 28)}<i>${ic('check', 12, '', 3)}</i></span><small>Karting</small><em>2 Nov</em></span>
      <span class="sc-stamp__link is-done"></span>
      <span class="sc-stamp is-done" data-part="stamp-2"><span class="sc-stamp__c">${ic('bowling', 28)}<i>${ic('check', 12, '', 3)}</i></span><small>Bowling</small><em>15 Nov</em></span>
      <span class="sc-stamp__link"></span>
      <span class="sc-stamp is-next" data-part="stamp-3"><span class="sc-stamp__c">${ic('vr', 28)}</span><small>VR</small><em>Sun 22</em></span>
    </div>
    <div class="sc-feat__foot"><span><b>2 of 3</b> stamps</span><span class="sc-muted">${ic('clock', 15)}Ends 30 Nov</span></div>
  </div>

  ${sectionHead('This week', 'All missions')}
  <div class="sc-card sc-rows">
    <div class="sc-row sc-row--mission"><span class="sc-tile">${ic('users', 20)}</span><span class="sc-row__t"><b>Crew night</b><small>Book for 3+ friends · 0 of 1</small><span class="sc-minibar"><i style="width:0%"></i></span></span><span class="sc-xp">+80 XP</span></div>
    <div class="sc-row sc-row--mission"><span class="sc-tile">${ic('sparkles', 20)}</span><span class="sc-row__t"><b>Try a new category</b><small>1 of 2 done</small><span class="sc-minibar"><i style="width:50%"></i></span></span><span class="sc-xp">+50 XP</span></div>
  </div>
</div>
${nav('progress')}
${homeInd()}`;

S.rewards = () => `
${bg()}
${statusBar()}
<div class="sc-body">
  ${hubHead('Rewards')}
  <div class="sc-card sc-balance" data-part="balance">
    <div class="sc-balance__l">
      <span class="sc-label sc-label--gold">Your Coins</span>
      <span class="sc-balance__n">${coin('sc-coin--xl')}<b data-part="balance-num">275</b><small>Coins</small></span>
      <span class="sc-muted">Earned on every outing</span>
    </div>
    <span class="sc-balance__art">${ic('gift', 30)}</span>
  </div>

  <div class="sc-card sc-perkcard is-selected" data-part="perk-vr">
    <div class="sc-perkcard__top">
      ${art('vr', { size: 26, cls: 'sc-perkcard__art' })}
      <span class="sc-row__t"><b>VR +5 minutes</b><small>Holodeck VR · any session</small></span>
      <span class="sc-cost">${coin()}<b>250</b></span>
    </div>
    <div class="sc-code" data-part="code"><span class="sc-code__v">SC-••••-••••</span><span class="sc-code__r">${ic('eye', 16)}Reveal at venue</span></div>
    <div class="sc-perkcard__foot"><span>Balance after</span><span class="sc-perkcard__bal">275 ${ic('arrowRight', 14, '', 2.2)} <b>25 Coins</b></span></div>
  </div>

  ${sectionHead('More perks', 'See all')}
  <div class="sc-perkgrid">
    <div class="sc-card sc-perkmini">
      <span class="sc-tile">${ic('bowling', 20)}</span>
      <b>Free shoe rental</b><small>Bowling</small>
      <span class="sc-cost sc-cost--sm">${coin()}<b>120</b></span>
    </div>
    <div class="sc-card sc-perkmini is-locked">
      <span class="sc-tile">${ic('kart', 20)}</span>
      <b>Extra lap</b><small>Go-karting</small>
      <span class="sc-cost sc-cost--sm">${coin()}<b>300</b></span>
    </div>
  </div>
</div>
${nav('progress')}
${homeInd()}`;

/* ------------------------------------------------------------------ exports */

export function screen(name) {
  const fn = S[name];
  if (!fn) throw new Error(`screens.mjs: unknown screen "${name}"`);
  return `<div class="app-screen app-screen--${name}">${fn()}</div>`;
}

/**
 * phone(innerHtml, { id }) — device frame.
 * Outer .phone box: 421×880 CSS px (side buttons protrude 3px beyond left/right edges).
 * Screen: 393×852 at left 14px / top 14px, 44px corner radius, overflow hidden.
 */
export function phone(innerHtml, { id } = {}) {
  return `<div class="phone"${id ? ` id="${id}"` : ''}>
  <span class="phone__btn phone__btn--action"></span><span class="phone__btn phone__btn--volup"></span><span class="phone__btn phone__btn--voldn"></span><span class="phone__btn phone__btn--power"></span>
  <div class="phone__bezel"></div>
  <div class="phone__screen">${innerHtml}</div>
  <div class="phone__island"><span class="phone__lens"></span></div>
  <div class="phone__glare"></div>
</div>`;
}
