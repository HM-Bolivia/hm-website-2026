# Hackmeeting 2026

Single-page site with an animated neon 80s (synthwave) background built with [three.js](https://threejs.org) and [Vite](https://vite.dev).

## Getting started

```sh
npm install
npm run dev      # local dev server with hot reload
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## Project structure

```
index.html                  page markup (placeholder content)
src/
  main.js                   entry point: loads styles, starts the background
  styles/main.css           page styles (colors as CSS variables in :root)
  background/
    config.js               palette + every tunable number (speed, bloom, sizes…)
    NeonBackground.js       renderer, camera, scene, animation loop, resize
    objects/                one file per thing in the world
      Sky.js                gradient sky dome
      Sun.js                striped retro sun (shader)
      Grid.js               infinite scrolling neon grid (shader), used for floor and sky
      Mountains.js          wireframe mountains, two leapfrogging tiles
      Illimani.js           Illimani massif fixed on the horizon, in front of the sun
    effects/postprocessing.js   bloom glow
    controls/MouseParallax.js   camera sway that follows the pointer
```

### Tweaking the look

Most visual changes only need `src/background/config.js`: colors (`palette`), scroll `speed`, `bloom` strength, sun size and position, mountain height, and so on.

### Adding something to the world

Create a class in `src/background/objects/` that exposes:

- `object3d`: the `THREE.Object3D` to add to the scene
- `update(delta, elapsed, speed)`: optional, called every frame
- `dispose()`: optional, frees GPU resources

Then add it to the list in `NeonBackground#createObjects`.

### Accessibility and fallbacks

- If the user has `prefers-reduced-motion` set, the world stays still and mouse parallax is off.
- If WebGL isn't available, the canvas is removed and a CSS gradient shows instead.
