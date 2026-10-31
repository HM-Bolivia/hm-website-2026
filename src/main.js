import './styles/main.css';
import { NeonBackground } from './background/NeonBackground.js';
import { initIntro } from './intro.js';
import { initActiveSection } from './active-section.js';

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

// Blinking cursor on the title of the section being viewed.
initActiveSection();

// Palette editor for choosing colors: only loaded with ?palette (or a shared ?p=… link).
const params = new URLSearchParams(location.search);
if (params.has('palette') || params.has('p')) {
  import('./palette-playground/PalettePlayground.js').then(({ mountPalettePlayground }) =>
    mountPalettePlayground(background),
  );
}
