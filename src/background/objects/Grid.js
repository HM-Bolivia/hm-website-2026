import * as THREE from 'three';
import { config, palette } from '../config.js';

/**
 * Infinite neon grid plane. The plane never moves; the grid lines are drawn in
 * the fragment shader and offset over time, so there is nothing to recycle.
 *
 * Used for both the floor (opaque) and the sky (`ceiling: true`), which is
 * flipped to face down and blended over the sky so the sun shows through.
 */
export class Grid {
  constructor({
    y = 0,
    ceiling = false,
    color = palette.gridLine,
    opacity = 1,
    cellSize = config.grid.cellSize,
    lineWidth = config.grid.lineWidth,
    fadeDistance = config.grid.fadeDistance,
  } = {}) {
    this.cellSize = cellSize;

    const geometry = new THREE.PlaneGeometry(config.grid.size, config.grid.size);
    geometry.rotateX(ceiling ? Math.PI / 2 : -Math.PI / 2);

    this.material = new THREE.ShaderMaterial({
      transparent: ceiling,
      depthWrite: !ceiling,
      defines: ceiling ? { CEILING: '' } : {},
      uniforms: {
        uOffset: { value: 0 },
        uCellSize: { value: cellSize },
        uLineWidth: { value: lineWidth },
        uFadeDistance: { value: fadeDistance },
        uOpacity: { value: opacity },
        uFloor: { value: new THREE.Color(palette.floor) },
        uLine: { value: new THREE.Color(color) },
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
        uniform float uOpacity;
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

          #ifdef CEILING
            // Lines only, blended over the sky.
            float alpha = line * fade * uOpacity;
            if (alpha < 0.005) discard;
            gl_FragColor = vec4(uLine * 1.6, alpha);
          #else
            vec3 color = mix(uFloor, uLine * 1.6, line * fade);
            color = mix(uFog, color, fade);
            gl_FragColor = vec4(color, 1.0);
          #endif
        }
      `,
    });

    this.object3d = new THREE.Mesh(geometry, this.material);
    this.object3d.position.y = y;
  }

  update(delta, elapsed, speed) {
    // Wrap to keep the float small; one cell of travel looks identical.
    const offset = this.material.uniforms.uOffset;
    offset.value = (offset.value + speed * delta) % this.cellSize;
  }

  dispose() {
    this.object3d.geometry.dispose();
    this.material.dispose();
  }
}
