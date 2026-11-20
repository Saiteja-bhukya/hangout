// Finishing layer over everything: animated film grain (~3%), a soft vignette, and the final fade to white.
const grain = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><filter id='n' x='0' y='0'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='11' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncR type='linear' slope='2.2' intercept='-0.6'/><feFuncG type='linear' slope='2.2' intercept='-0.6'/><feFuncB type='linear' slope='2.2' intercept='-0.6'/></feComponentTransfer></filter><rect width='256' height='256' filter='url(#n)'/></svg>`
)}`;

export default {
  id: 'overlay', start: 0, duration: 60, track: 2, z: 50,
  css: `
    #ov-grain { position: absolute; inset: -4px; background-image: url("${grain}"); background-size: 256px 256px; opacity: 0.03; }
    #ov-vig { position: absolute; inset: 0; background: radial-gradient(ellipse 75% 70% at 50% 48%, rgba(11,26,46,0) 58%, rgba(11,26,46,0.07) 82%, rgba(11,26,46,0.13) 100%); }
    #ov-white { position: absolute; inset: 0; background: #fff; opacity: 0; }`,
  html: `    <div id="ov-vig" data-layout-ignore></div>
    <div id="ov-grain" data-layout-ignore></div>
    <div id="ov-white" data-layout-ignore></div>`,
  js: `
      // grain: jump the tile to a new offset every frame (a pure function of the frame number)
      var g = $('ov-grain'), f = { v: 0 };
      tl.fromTo(f, { v: 0 }, { v: 1800, duration: 60, ease: 'none', onUpdate: function () {
        var n = Math.floor(f.v);
        g.style.backgroundPosition = ((n * 73) % 256) + 'px ' + ((n * 151) % 256) + 'px';
      } }, 0);
      // the white silence (11.35–12.5) stays clean: no vignette on it
      tl.fromTo('#ov-vig', { opacity: 1 }, { opacity: 0, duration: 0.04, ease: 'none' }, 11.33);
      tl.to('#ov-vig', { opacity: 1, duration: 0.4, ease: 'power2.out' }, 12.5);
      // fade to white at the very end
      tl.fromTo('#ov-white', { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.in' }, 59.2);`,
};
