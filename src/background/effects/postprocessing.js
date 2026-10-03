import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { config } from '../config.js';

/** Render → bloom (the neon glow) → output (tone mapping / color space). */
export function createComposer(renderer, scene, camera) {
  const composer = new EffectComposer(renderer);
  const { strength, radius, threshold } = config.bloom;

  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(256, 256), strength, radius, threshold));
  composer.addPass(new OutputPass());

  return composer;
}
