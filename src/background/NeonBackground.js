import * as THREE from 'three';
import { config, palette } from './config.js';
import { Sky } from './objects/Sky.js';
import { Stars } from './objects/Stars.js';
import { Sun } from './objects/Sun.js';
import { Grid } from './objects/Grid.js';
import { Mountains } from './objects/Mountains.js';
import { createComposer } from './effects/postprocessing.js';
import { MouseParallax } from './controls/MouseParallax.js';

/**
 * Owns the renderer, camera, scene and animation loop.
 *
 * Scene objects follow a tiny contract:
 *   - `object3d`              the THREE.Object3D added to the scene
 *   - `update(delta, elapsed, speed)` optional, called every frame
 *   - `dispose()`             optional, frees GPU resources
 * To add something new to the world, create a class with that shape and
 * append it in `#createObjects`.
 */
export class NeonBackground {
  #renderer;
  #scene;
  #camera;
  #composer;
  #parallax;
  #objects = [];
  #timer = new THREE.Timer();
  #speed;
  #handleResize = () => this.#onResize();

  constructor(canvas, { reducedMotion = false } = {}) {
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

    this.#composer = createComposer(this.#renderer, this.#scene, this.#camera);
    this.#parallax = reducedMotion ? null : new MouseParallax(this.#camera, target);

    window.addEventListener('resize', this.#handleResize);
    this.#onResize();
  }

  #createObjects() {
    this.#objects = [new Sky(), new Stars(), new Sun(), new Grid(), new Mountains()];
    for (const obj of this.#objects) this.#scene.add(obj.object3d);
  }

  #onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.#camera.aspect = width / height;
    this.#camera.updateProjectionMatrix();
    this.#renderer.setSize(width, height, false);
    this.#composer.setSize(width, height);
  }

  #tick(timestamp) {
    this.#timer.update(timestamp);
    // Clamp so a backgrounded tab doesn't make everything jump on return.
    const delta = Math.min(this.#timer.getDelta(), 0.1);
    const elapsed = this.#timer.getElapsed();

    for (const obj of this.#objects) obj.update?.(delta, elapsed, this.#speed);
    this.#parallax?.update(delta);
    this.#composer.render(delta);
  }

  start() {
    this.#timer.connect(document);
    this.#renderer.setAnimationLoop((t) => this.#tick(t));
  }

  stop() {
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
