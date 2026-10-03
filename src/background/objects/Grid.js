import * as THREE from 'three';
import { config, palette } from '../config.js';

/**
 * Infinite neon floor. The plane never moves; the grid lines are drawn in the
 * fragment shader and offset over time, so there is nothing to recycle.
 */
export class Grid {
  constructor() {
    const { size, cellSize, lineWidth, fadeDistance } = config.grid;
    const geometry = new THREE.PlaneGeometry(size, size);
    geometry.rotateX(-Math.PI / 2);

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uOffset: { value: 0 },
        uCellSize: { value: cellSize },
        uLineWidth: { value: lineWidth },
        uFadeDistance: { value: fadeDistance },
        uFloor: { value: new THREE.Color(palette.floor) },
        uLine: { value: new THREE.Color(palette.gridLine) },
        uFog: { value: new THREE.Color(palette.fog) },
      },
      vertexShader: /* glsl */ `
        varying vec3 vWorld;
        void main() {
          vec4 world = modelMatrix * vec4(position, 1.0);
          vWorld = world.xyz;
          gl_Position = projectionMatrix * viewMatrix * world;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uOffset;
        uniform float uCellSize;
        uniform float uLineWidth;
        uniform float uFadeDistance;
        uniform vec3 uFloor;
        uniform vec3 uLine;
        uniform vec3 uFog;
        varying vec3 vWorld;

        void main() {
          vec2 coord = vec2(vWorld.x, vWorld.z - uOffset) / uCellSize;
          vec2 g = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
          float line = 1.0 - min(min(g.x, g.y) / uLineWidth, 1.0);

          float dist = length(vWorld.xz - cameraPosition.xz);
          float fade = smoothstep(uFadeDistance, 0.0, dist);

          vec3 color = mix(uFloor, uLine * 1.6, line * fade);
          color = mix(uFog, color, fade);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    this.object3d = new THREE.Mesh(geometry, this.material);
  }

  update(delta, elapsed, speed) {
    // Wrap to keep the float small; one cell of travel looks identical.
    const cell = config.grid.cellSize;
    this.material.uniforms.uOffset.value = (this.material.uniforms.uOffset.value + speed * delta) % cell;
  }

  dispose() {
    this.object3d.geometry.dispose();
    this.material.dispose();
  }
}
