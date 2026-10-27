// Central place to tweak the look & feel of the background scene.
// Every object reads from here, so restyling the world rarely needs code changes.

export const palette = {
  skyTop: 0x0b0d2a,
  skyHorizon: 0x0b0d2a,
  fog: 0x1d1640,
  floor: 0x090b22,
  gridLine: 0xe76a4b,
  skyGridLine: 0x0b0d2a,
  mountainFill: 0x10122e,
  mountainLine: 0xe2b346,
  sunTop: 0xffd000,
  sunBottom: 0xff4000,
};

export const config = {
  // Units per second the world scrolls toward the camera.
  speed: 2,

  camera: {
    fov: 60,
    near: 0.1,
    far: 2000,
    position: { x: 0, y: 4, z: 10 },
    lookAt: { x: 0, y: 6, z: -100 },
  },

  fog: { near: 60, far: 420 },

  grid: {
    size: 2000,
    cellSize: 3,
    lineWidth: 1.1,
    fadeDistance: 450,
  },

  skyGrid: {
    height: 60,
    cellSize: 3,
    opacity: 0.45,
  },

  sun: {
    radius: 130,
    position: { x: 0, y: 170, z: -700 },
    stripes: 14,
    stripeSpeed: 0.22,
    intensity: 0.75, // < 1 keeps the bloom from washing the colors out to white
  },

  mountains: {
    length: 300, // depth of one tile; two tiles leapfrog each other
    width: 400,
    segmentsX: 80,
    segmentsZ: 60,
    roadHalfWidth: 22, // flat area in the middle
    maxHeight: 38,
  },

  // Neon artwork from src/assets/illimani.png (regenerate with `npm run assets:illimani`).
  illimani: {
    position: { x: 36, z: -650 }, // x recenters the mountain, which sits left of center in the image
    width: 1100, // scene units; height follows the image's aspect ratio
    sink: 0.12, // fraction of the image height pushed below the floor
    brightness: 0.45, // < 1 keeps the bloom from washing the artwork out
  },

  bloom: {
    strength: 0.25,
    radius: 0.35,
    threshold: 0.25,
  },

  parallax: {
    amountX: 3,
    amountY: 1.5,
    damping: 2.5,
  },

  maxPixelRatio: 2,
};
