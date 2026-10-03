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
  snowLine: 0xd6ecff,
  snowFill: 0x221c44,
  sunTop: 0xffd23f,
  sunBottom: 0xff1f7a,
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
    position: { x: 0, y: 125, z: -700 },
    stripes: 14,
    stripeSpeed: 0.12,
  },

  mountains: {
    length: 300, // depth of one tile; two tiles leapfrog each other
    width: 400,
    segmentsX: 80,
    segmentsZ: 60,
    roadHalfWidth: 22, // flat area in the middle
    maxHeight: 38,
  },

  illimani: {
    position: { x: 20, z: -600 },
    width: 1100,
    depth: 220,
    height: 115,
    segmentsX: 80,
    segmentsZ: 14,
    snowLine: 0.55, // fraction of the peak height where snow starts
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
