import * as THREE from 'three';
import { config, palette } from '../config.js';

// Ridge profile as seen from La Paz: [u along ridge (-1..1), relative height, spread].
// Pico Norte on the left, Pico del Indio (central) and the highest, Pico Sur, on the right.
const PEAKS = [
  [-0.45, 0.9, 0.1], // Pico Norte
  [-0.28, 0.82, 0.08],
  [-0.08, 0.93, 0.09], // Pico del Indio
  [0.1, 0.86, 0.07],
  [0.28, 1.0, 0.11], // Pico Sur
  [0.5, 0.78, 0.09],
];

/** Deterministic pseudo-random in [0, 1) so the facets look the same on every load. */
function hash(x, z) {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function ridgeHeight(u) {
  // Long high crest with steep flanks at both ends; summits rise a little above it.
  const crest = 0.6 * (1 - THREE.MathUtils.smoothstep(Math.abs(u), 0.45, 0.95));
  let h = Math.max(crest, 0.25 * (1 - u * u));
  for (const [center, height, spread] of PEAKS) {
    const d = (u - center) / spread;
    h = Math.max(h, height * Math.exp(-d * d));
  }
  return h * (1 - THREE.MathUtils.smoothstep(Math.abs(u), 0.85, 1));
}

/**
 * Illimani, fixed on the horizon in front of the sun. Same look as the side
 * mountains (dark fill + neon wireframe) with a snow cap colored per vertex.
 */
export class Illimani {
  constructor() {
    const { width, depth, height, segmentsX, segmentsZ, snowLine, position } = config.illimani;

    this.geometry = new THREE.PlaneGeometry(width, depth, segmentsX, segmentsZ);
    this.geometry.rotateX(-Math.PI / 2);

    const pos = this.geometry.attributes.position;
    const lineColors = new Float32Array(pos.count * 3);
    const fillColors = new Float32Array(pos.count * 3);
    const rock = new THREE.Color(palette.mountainLine);
    const snow = new THREE.Color(palette.snowLine);
    const rockFill = new THREE.Color(palette.mountainFill);
    const snowFill = new THREE.Color(palette.snowFill);
    const tmp = new THREE.Color();

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const u = x / (width / 2);
      const v = z / (depth / 2);

      const crossSection = Math.pow(Math.max(0, 1 - v * v), 0.8);
      const jitter = 1 + (hash(x, z) - 0.5) * 0.15; // low-poly facets
      const h = ridgeHeight(u) * crossSection * jitter;
      pos.setY(i, h * height);

      // Soft transition from rock to snow above the snow line.
      const snowAmount = THREE.MathUtils.smoothstep(h, snowLine - 0.05, snowLine + 0.1);
      tmp.lerpColors(rock, snow, snowAmount).toArray(lineColors, i * 3);
      tmp.lerpColors(rockFill, snowFill, snowAmount).toArray(fillColors, i * 3);
    }

    pos.needsUpdate = true;
    this.geometry.computeBoundingSphere();

    // Fill and lines need different colors, so they get separate geometries sharing positions.
    this.fillGeometry = this.geometry.clone();
    this.fillGeometry.setAttribute('color', new THREE.BufferAttribute(fillColors, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    // fog: false — it sits beyond the fog range but should stay crisp.
    this.fillMaterial = new THREE.MeshBasicMaterial({
      vertexColors: true,
      fog: false,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    this.lineMaterial = new THREE.MeshBasicMaterial({
      vertexColors: true,
      wireframe: true,
      fog: false,
      transparent: true,
      opacity: 0.75,
    });

    this.object3d = new THREE.Group();
    this.object3d.add(new THREE.Mesh(this.fillGeometry, this.fillMaterial));
    this.object3d.add(new THREE.Mesh(this.geometry, this.lineMaterial));
    this.object3d.position.set(position.x, 0, position.z);
  }

  dispose() {
    this.geometry.dispose();
    this.fillGeometry.dispose();
    this.fillMaterial.dispose();
    this.lineMaterial.dispose();
  }
}
