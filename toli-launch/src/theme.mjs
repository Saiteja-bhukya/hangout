// The film's secondary colour, in one place. Pick with THEME=<key> node src/build.mjs (default below).
// s = the secondary itself, s2 = its soft tint, b3 = the third background blob, grad = hero-word gradient.
export const THEMES = {
  toli: {
    label: 'toli', mode: 'toli', s: [255, 182, 39], s2: [255, 61, 129], b3: [15, 10, 28],
    grad: 'none', rim: '#FF3D81', particles: ['#FFB627', '#FF3D81', '#20C9B5', '#FFF3E2'],
  },
  sun: {
    label: 'Sun Yellow (dark)', mode: 'dark', s: [255, 210, 63], s2: [255, 226, 130], b3: [255, 231, 160],
    grad: 'linear-gradient(90deg, #FFD23F 0%, #FFD23F 100%)',
    rim: '#FFD23F', particles: ['#FFFFFF', '#2F6BFF', '#4F8BFF', '#FFD23F', '#FFE27F'],
  },
  rose: {
    label: 'Rose Pink', s: [255, 92, 158], s2: [255, 179, 209], b3: [255, 211, 230],
    grad: 'linear-gradient(90deg, #2F6BFF 0%, #7C6BFF 42%, #FF5C9E 100%)',
    rim: '#FF6FAE', particles: ['#FFFFFF', '#6FE8FA', '#36A9FF', '#2F6BFF', '#FF5C9E', '#FFB3D1'],
  },
  lime: {
    label: 'Electric Lime', s: [142, 219, 47], s2: [205, 245, 143], b3: [226, 248, 196],
    grad: 'linear-gradient(90deg, #2F6BFF 0%, #12B3DA 50%, #5DBB12 100%)',
    rim: '#9BE15D', particles: ['#FFFFFF', '#6FE8FA', '#36A9FF', '#2F6BFF', '#8EDB2F', '#CDF58F'],
  },
  gold: {
    label: 'Halo Gold', s: [244, 200, 74], s2: [255, 226, 140], b3: [255, 231, 160],
    grad: 'linear-gradient(90deg, #2F6BFF 0%, #12B3DA 100%)',
    rim: '#F4CD5A', particles: ['#FFFFFF', '#6FE8FA', '#36A9FF', '#2F6BFF', '#F4CD5A', '#FFEAA8'],
  },
};
export const THEME_KEY = process.env.THEME || 'toli';
export const THEME = THEMES[THEME_KEY];
