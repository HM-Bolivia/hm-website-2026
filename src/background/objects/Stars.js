import * as THREE from 'three';
import { config, palette } from '../config.js';

/** Random points scattered over the upper hemisphere, slowly rotating. */
export class Stars {
  constructor() {
    const { count, radius, size } = config.stars;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.95); // upper hemisphere only
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi);
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: palette.stars,
      size,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.85,
      fog: false,
      depthWrite: false,
    });

    this.object3d = new THREE.Points(geometry, material);
    this.object3d.renderOrder = -1;
  }

  update(delta) {
    this.object3d.rotation.y += delta * 0.004;
  }

  dispose() {
    this.object3d.geometry.dispose();
    this.object3d.material.dispose();
  }
}
