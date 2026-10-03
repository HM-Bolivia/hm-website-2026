import * as THREE from 'three';
import { config, palette } from '../config.js';

const TAU = Math.PI * 2;

/**
 * Low-poly wireframe mountains flanking a flat road.
 * Two identical tiles leapfrog each other; the height function is periodic
 * along the tile's length so the seam between them is invisible.
 */
export class Mountains {
  constructor() {
    const { length, width, segmentsX, segmentsZ } = config.mountains;
    this.geometry = new THREE.PlaneGeometry(width, length, segmentsX, segmentsZ);
    this.geometry.rotateX(-Math.PI / 2);
    this.#displace();

    this.fillMaterial = new THREE.MeshBasicMaterial({
      color: palette.mountainFill,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    this.lineMaterial = new THREE.MeshBasicMaterial({
      color: palette.mountainLine,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });

    this.object3d = new THREE.Group();
    // Sink slightly so the flat road part hides under the grid instead of z-fighting with it.
    this.object3d.position.y = -0.1;
    this.tiles = [0, 1].map((i) => {
      const tile = new THREE.Group();
      tile.add(new THREE.Mesh(this.geometry, this.fillMaterial));
      tile.add(new THREE.Mesh(this.geometry, this.lineMaterial));
      tile.position.z = -length / 2 - i * length;
      this.object3d.add(tile);
      return tile;
    });
  }

  #displace() {
    const { length, roadHalfWidth, maxHeight } = config.mountains;
    const pos = this.geometry.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const ax = Math.abs(x);

      // 0 on the road, ramps up beyond it, keeps growing toward the edges.
      const mask = THREE.MathUtils.smoothstep(ax, roadHalfWidth, roadHalfWidth + 25);
      const growth = 0.4 + Math.min((ax - roadHalfWidth) / 120, 1) * 0.6;

      // Integer multiples of TAU / length keep the shape periodic along z.
      const k = TAU / length;
      const n =
        0.5 * Math.abs(Math.sin(x * 0.045 + 1.3) * Math.cos(z * k * 2 + x * 0.02)) +
        0.3 * Math.abs(Math.sin(x * 0.11 + z * k * 5)) +
        0.2 * Math.abs(Math.cos(x * 0.23 - z * k * 9 + 0.7));

      pos.setY(i, mask * growth * n * maxHeight);
    }

    pos.needsUpdate = true;
    this.geometry.computeBoundingSphere();
  }

  update(delta, elapsed, speed) {
    const { length } = config.mountains;
    const cameraZ = config.camera.position.z;
    for (const tile of this.tiles) {
      tile.position.z += speed * delta;
      // Once a tile is fully behind the camera, send it to the back of the line.
      if (tile.position.z - length / 2 > cameraZ) tile.position.z -= length * this.tiles.length;
    }
  }

  dispose() {
    this.geometry.dispose();
    this.fillMaterial.dispose();
    this.lineMaterial.dispose();
  }
}
