import * as THREE from 'three';
import { config } from '../config.js';

/** Eases the camera a little toward the pointer while keeping it aimed at `target`. */
export class MouseParallax {
  #camera;
  #target;
  #base;
  #pointer = new THREE.Vector2();
  #onPointerMove = (event) => {
    this.#pointer.set((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1);
  };

  constructor(camera, target) {
    this.#camera = camera;
    this.#target = target;
    this.#base = camera.position.clone();
    window.addEventListener('pointermove', this.#onPointerMove, { passive: true });
  }

  update(delta) {
    const { amountX, amountY, damping } = config.parallax;
    const cam = this.#camera.position;
    const t = 1 - Math.exp(-damping * delta);

    cam.x += (this.#base.x + this.#pointer.x * amountX - cam.x) * t;
    cam.y += (this.#base.y - this.#pointer.y * amountY - cam.y) * t;
    this.#camera.lookAt(this.#target);
  }

  dispose() {
    window.removeEventListener('pointermove', this.#onPointerMove);
  }
}
