// The film's secondary colour, in one place. Pick with THEME=<key> node src/build.mjs (default below).
// s = the secondary itself, s2 = its soft tint, b3 = the third background blob, grad = hero-word gradient.
export const THEMES = {
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
    label: 'Halo Gold', s: [244, 205, 90], s2: [255, 234, 168], b3: [255, 240, 199],
    grad: 'linear-gradient(90deg, #2F6BFF 0%, #12B3DA 100%)',
    rim: '#F4CD5A', particles: ['#FFFFFF', '#6FE8FA', '#36A9FF', '#2F6BFF', '#F4CD5A', '#FFEAA8'],
  },
};
export const THEME_KEY = process.env.THEME || 'rose';
export const THEME = THEMES[THEME_KEY];
