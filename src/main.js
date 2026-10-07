import './styles/main.css';
import { NeonBackground } from './background/NeonBackground.js';
import { initIntro } from './intro.js';

const canvas = document.querySelector('#bg');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let background;
try {
  background = new NeonBackground(canvas, { reducedMotion });
  background.start();

  if (import.meta.hot) import.meta.hot.dispose(() => background.dispose());
} catch (err) {
  // No WebGL: the CSS gradient on <body> remains as a fallback.
  console.warn('Neon background disabled:', err);
  canvas.remove();
}

// Show Illimani on its own first, then slide the content in (no background → no wait).
initIntro(background?.ready);
