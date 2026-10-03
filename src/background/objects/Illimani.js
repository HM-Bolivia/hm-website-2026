import * as THREE from 'three';
import { config } from '../config.js';
import illimaniUrl from '../../assets/illimani.png';

/**
 * Neon Illimani artwork standing on the horizon in front of the sun.
 * The PNG is generated from assets-src/illimani.jpeg by scripts/prepare-illimani-image.sh.
 */
export class Illimani {
  constructor() {
    const { width, position, sink, brightness } = config.illimani;

    this.material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(brightness, brightness, brightness),
      transparent: true,
      depthWrite: false,
      fog: false,
    });

    this.texture = new THREE.TextureLoader().load(illimaniUrl, (texture) => {
      // Size the plane from the image's aspect ratio once it has loaded.
      const height = width * (texture.image.height / texture.image.width);
      this.object3d.scale.set(width, height, 1);
      // Push the bottom edge of the artwork slightly below the floor so it sits on the horizon.
      this.object3d.position.y = height / 2 - height * sink;
      this.object3d.visible = true;
    });
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.material.map = this.texture;

    this.object3d = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.material);
    this.object3d.position.set(position.x, 0, position.z);
    this.object3d.visible = false;
  }

  dispose() {
    this.object3d.geometry.dispose();
    this.material.dispose();
    this.texture.dispose();
  }
}
