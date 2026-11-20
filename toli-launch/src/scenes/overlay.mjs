// Finishing layer: animated film grain (~3%), a soft vignette, and the final fade to black.
const grain = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><filter id='n' x='0' y='0'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='11' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncR type='linear' slope='2.2' intercept='-0.6'/><feFuncG type='linear' slope='2.2' intercept='-0.6'/><feFuncB type='linear' slope='2.2' intercept='-0.6'/></feComponentTransfer></filter><rect width='256' height='256' filter='url(#n)'/></svg>`
)}`;
export default {
  id: 'overlay', start: 0, duration: 60, track: 2, z: 50,
  css: `
    #ov-grain { position: absolute; inset: -4px; background-image: url("${grain}"); background-size: 256px 256px; opacity: 0.035; }
    #ov-vig { position: absolute; inset: 0; background: radial-gradient(ellipse 78% 72% at 50% 48%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.28) 100%); }
    #ov-end { position: absolute; inset: 0; background: #000; opacity: 0; }`,
  html: `    <div id="ov-vig" data-layout-ignore></div>
    <div id="ov-grain" data-layout-ignore></div>
    <div id="ov-end" data-layout-ignore></div>`,
  js: `
      var g = $('ov-grain'), f = { v: 0 };
      tl.fromTo(f, { v: 0 }, { v: 1800, duration: 60, ease: 'none', onUpdate: function () {
        var n = Math.floor(f.v); g.style.backgroundPosition = ((n * 73) % 256) + 'px ' + ((n * 151) % 256) + 'px';
      } }, 0);
      tl.fromTo('#ov-end', { opacity: 0 }, { opacity: 1, duration: 0.7, ease: 'power2.in' }, 59.3);`,
};
