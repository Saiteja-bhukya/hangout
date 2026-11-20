// Night ground for the whole film: flat plum-black. (The grey of the "plans die" beat lives in that scene.)
export default {
  id: 'bg', start: 0, duration: 60, track: 0, z: 0,
  css: `
    #bg-base { position: absolute; inset: 0; background: #0F0A1C; }`,
  html: `    <div id="bg-base"></div>`,
  js: `
      tl.set('#bg-base', { opacity: 1 }, 0);`,
};
