import * as THREE from 'three';
import { config, palette } from '../config.js';

/** The classic synthwave sun: vertical gradient with scrolling horizontal cutouts. */
export class Sun {
  constructor() {
    const { radius, position, stripes, intensity } = config.sun;
    const geometry = new THREE.PlaneGeometry(radius * 2, radius * 2);

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uTop: { value: new THREE.Color(palette.sunTop) },
        uBottom: { value: new THREE.Color(palette.sunBottom) },
        uStripes: { value: stripes },
        uIntensity: { value: intensity },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uTop;
        uniform vec3 uBottom;
        uniform float uStripes;
        uniform float uIntensity;
        varying vec2 vUv;

        void main() {
          vec2 p = vUv - 0.5;
          float d = length(p);
          float edge = fwidth(d);
          float disc = 1.0 - smoothstep(0.5 - edge, 0.5, d);

          // Stripes only on the lower part; they get thicker toward the bottom.
          float band = fract(vUv.y * uStripes + uTime);
          float cutStrength = smoothstep(0.55, 0.0, vUv.y) * 0.75;
          float cut = step(band, cutStrength);

          float alpha = disc * (1.0 - cut);
          if (alpha < 0.01) discard;

          vec3 color = mix(uBottom, uTop, smoothstep(0.45, 1.0, vUv.y));
          gl_FragColor = vec4(color * uIntensity, alpha);
        }
      `,
    });

    this.object3d = new THREE.Mesh(geometry, this.material);
    this.object3d.position.set(position.x, position.y, position.z);
  }

  update(delta, elapsed) {
    this.material.uniforms.uTime.value = elapsed * config.sun.stripeSpeed;
  }

  dispose() {
    this.object3d.geometry.dispose();
    this.material.dispose();
  }
}
