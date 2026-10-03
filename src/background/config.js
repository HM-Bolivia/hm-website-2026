// Central place to tweak the look & feel of the background scene.
// Every object reads from here, so restyling the world rarely needs code changes.

export const palette = {
  skyTop: 0x05010f,
  skyHorizon: 0x3a0a4a,
  fog: 0x1a0626,
  floor: 0x07020f,
  gridLine: 0xff2bd6,
  skyGridLine: 0xb04dff,
  mountainFill: 0x0a0418,
  mountainLine: 0x00f0ff,
  sunTop: 0xffd000,
  sunBottom: 0xff4000,
};

export const config = {
  // Units per second the world scrolls toward the camera.
  speed: 7,

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
    stripeSpeed: 0.12,
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
    position: { x: 0, z: -650 },
    width: 750, // scene units; height follows the image's aspect ratio
    sink: 0.12, // fraction of the image height pushed below the floor
    brightness: 0.45, // < 1 tames the bloom on the hot pinks
  },

  bloom: {
    strength: 0.55,
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
