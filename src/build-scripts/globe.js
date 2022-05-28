import createGlobe from "cobe";

let rotation = 1.35;
let canvas = document.getElementById("cobe");

const globe = createGlobe(canvas, {
  devicePixelRatio: 2,
  width: 720 * 2,
  height: 720 * 2,
  phi: 0,
  theta: -0.1,
  dark: 1,
  diffuse: 1.2,
  scale: 1,
  mapSamples: 16000,
  mapBrightness: 6,
  baseColor: [0.08203125, 0.17578125, 0.21484375],
  markerColor: [0.97254902, 0.98823529, 0.98823529],
  glowColor: [0.08203125, 0.17578125, 0.21484375],
  offset: [0, 0],
  markers: [
    // latitude longitude
    { location: [19.075983, 72.877655], size: 0.05 },
    { location: [1.290270, 103.851959], size: 0.05 },
    { location: [37.4627100, 118.4916500], size: 0.05 }
  ],
  onRender: (state) => {
    // Called on every animation frame.
    // `state` will be an empty object, return updated params.
    state.phi = rotation;
    rotation += 0.005;
  }
});

// `globe` will be a Phenomenon (https://github.com/vaneenige/phenomenon) instance.
// To pause requestAnimationFrame:
// `globe.toggle()`
// To remove the instance:
// `globe.destroy()`
// ...