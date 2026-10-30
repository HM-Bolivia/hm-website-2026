import * as THREE from 'three';
import { config, palette } from './config.js';
import { Sky } from './objects/Sky.js';
import { Grid } from './objects/Grid.js';
import { Mountains } from './objects/Mountains.js';
import { Illimani } from './objects/Illimani.js';
import { createComposer } from './effects/postprocessing.js';
import { MouseParallax } from './controls/MouseParallax.js';

/**
 * Owns the renderer, camera, scene and animation loop.
 * With reduced motion (or config.animate = false) the scene is static, so there's no loop:
 * a frame is drawn only when something changes (load, resize, palette edits).
 * Otherwise it animates for config.stopAfter seconds, slows to a stop and then goes static too.
 *
 * Scene objects follow a tiny contract:
 *   - `object3d`              the THREE.Object3D added to the scene
 *   - `update(delta, elapsed, speed)` optional, called every frame
 *   - `dispose()`             optional, frees GPU resources
 *   - `ready`                 optional promise, resolves when async assets have loaded
 *   - `setPalette(palette)`   optional, re-reads its colors after `setPalette` below
 * To add something new to the world, create a class with that shape and
 * append it in `#createObjects`.
 */
export class NeonBackground {
  #renderer;
  #scene;
  #camera;
  #composer;
  #bloom;
  #parallax;
  #objects = [];
  #timer = new THREE.Timer();
  #speed;
  #static;
  #pendingFrame = 0;
  #runTime = 0; // seconds animated, not counting time in a background tab
  #handleResize = () => this.#onResize();

  constructor(canvas, { reducedMotion = false } = {}) {
    reducedMotion ||= !config.animate;
    this.#static = reducedMotion;
    this.#speed = reducedMotion ? 0 : config.speed;

    this.#renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.#renderer.setPixelRatio(Math.min(window.devicePixelRatio, config.maxPixelRatio));

    this.#scene = new THREE.Scene();
    this.#scene.fog = new THREE.Fog(palette.fog, config.fog.near, config.fog.far);

    const { fov, near, far, position, lookAt } = config.camera;
    this.#camera = new THREE.PerspectiveCamera(fov, 1, near, far);
    this.#camera.position.set(position.x, position.y, position.z);
    const target = new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z);
    this.#camera.lookAt(target);

    this.#createObjects();

    ({ composer: this.#composer, bloom: this.#bloom } = createComposer(this.#renderer, this.#scene, this.#camera));
    this.#parallax = reducedMotion ? null : new MouseParallax(this.#camera, target);

    window.addEventListener('resize', this.#handleResize);
    this.#onResize();
  }

  /** Resolves when every object's async assets (e.g. textures) have loaded. */
  get ready() {
    return Promise.all(this.#objects.map((obj) => obj.ready));
  }

  /**
   * Live-updates scene colors. Accepts any subset of the keys in `palette`
   * (config.js); values can be numbers (0xff2bd6) or CSS strings ('#ff2bd6').
   */
  setPalette(colors) {
    Object.assign(palette, colors);
    this.#scene.fog.color.set(palette.fog);
    for (const obj of this.#objects) obj.setPalette?.(palette);
    this.#requestRender();
  }

  /** Neon glow intensity (bloom strength), 0 = no glow. */
  get glow() {
    return this.#bloom.strength;
  }

  set glow(strength) {
    this.#bloom.strength = strength;
    this.#requestRender();
  }

  #createObjects() {
    const skyGrid = new Grid({
      ceiling: true,
      y: config.skyGrid.height,
      colorKey: 'skyGridLine',
      opacity: config.skyGrid.opacity,
      cellSize: config.skyGrid.cellSize,
    });
    this.#objects = [new Sky(), skyGrid, new Grid(), new Mountains(), new Illimani()];
    for (const obj of this.#objects) this.#scene.add(obj.object3d);
  }

  #onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.#camera.aspect = width / height;
    this.#camera.updateProjectionMatrix();
    this.#renderer.setSize(width, height, false);
    this.#composer.setSize(width, height);
    this.#requestRender();
  }

  // Static mode only: draws one frame on the next animation frame (several changes at once draw once).
  #requestRender() {
    if (!this.#static || this.#pendingFrame) return;
    this.#pendingFrame = requestAnimationFrame(() => {
      this.#pendingFrame = 0;
      this.#composer.render(0);
    });
  }

  #tick(timestamp) {
    this.#timer.update(timestamp);
    // Clamp so a backgrounded tab doesn't make everything jump on return.
    const delta = Math.min(this.#timer.getDelta(), 0.1);
    const elapsed = this.#timer.getElapsed();

    this.#runTime += delta;
    const slowdown = this.#slowdownFactor();

    for (const obj of this.#objects) obj.update?.(delta, elapsed, this.#speed * slowdown);
    // Slowing the parallax too makes the camera settle instead of stopping mid-sway.
    this.#parallax?.update(delta * slowdown);
    this.#composer.render(delta);

    if (slowdown === 0) this.#freeze();
  }

  // 1 while animating, easing to 0 over config.slowDown seconds after config.stopAfter.
  #slowdownFactor() {
    const { stopAfter, slowDown } = config;
    if (!stopAfter || this.#runTime < stopAfter) return 1;
    const t = slowDown > 0 ? Math.min((this.#runTime - stopAfter) / slowDown, 1) : 1;
    return (1 - t) ** 2; // ease-out: the speed drops quickly at first, then glides to a halt
  }

  // Ends the loop and switches to static mode, so later changes (resize, palette) still redraw.
  #freeze() {
    this.#renderer.setAnimationLoop(null);
    this.#parallax?.dispose();
    this.#parallax = null;
    this.#static = true;
  }

  start() {
    if (this.#static) {
      // Draw now, and again once textures (Illimani) have loaded.
      this.#requestRender();
      this.ready.then(() => this.#requestRender());
      return;
    }
    this.#timer.connect(document);
    this.#renderer.setAnimationLoop((t) => this.#tick(t));
  }

  stop() {
    this.#static = false;
    cancelAnimationFrame(this.#pendingFrame);
    this.#renderer.setAnimationLoop(null);
  }

  dispose() {
    this.stop();
    window.removeEventListener('resize', this.#handleResize);
    this.#timer.dispose();
    this.#parallax?.dispose();
    for (const obj of this.#objects) obj.dispose?.();
    this.#composer.dispose();
    this.#renderer.dispose();
  }
}
