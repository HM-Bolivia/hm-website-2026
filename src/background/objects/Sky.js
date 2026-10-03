import * as THREE from 'three';
import { palette } from '../config.js';

/** Large inverted sphere with a vertical gradient from horizon glow to deep night. */
export class Sky {
  constructor() {
    const geometry = new THREE.SphereGeometry(1500, 32, 16);
    const material = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uTop: { value: new THREE.Color(palette.skyTop) },
        uHorizon: { value: new THREE.Color(palette.skyHorizon) },
      },
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uTop;
        uniform vec3 uHorizon;
        varying vec3 vDir;
        void main() {
          float h = clamp(vDir.y, 0.0, 1.0);
          gl_FragColor = vec4(mix(uHorizon, uTop, pow(h, 0.45)), 1.0);
        }
      `,
    });

    this.object3d = new THREE.Mesh(geometry, material);
    this.object3d.renderOrder = -2;
  }

  dispose() {
    this.object3d.geometry.dispose();
    this.object3d.material.dispose();
  }
}
