// Longest we wait for the background assets before playing the intro anyway (slow connections).
const MAX_WAIT_MS = 3000;

/**
 * Intro: the page loads with only the background visible (Illimani on the horizon),
 * then the content slides up from the bottom.
 *
 * - An inline script in index.html adds `intro` to <html> before first paint,
 *   which keeps the content off-screen (see `.intro` in main.css).
 * - Once `ready` resolves (Illimani has loaded), `intro-play` starts the CSS
 *   animation; its delay is how long Illimani is shown on its own.
 * - When the animation ends, both classes are removed.
 */
export function initIntro(ready = Promise.resolve()) {
  const root = document.documentElement;
  if (!root.classList.contains('intro')) return;

  const page = document.querySelector('.page');
  page.addEventListener(
    'animationend',
    () => {
      // Drop the classes so the page can scroll and no transform stays on the content.
      root.classList.remove('intro', 'intro-play');
      history.scrollRestoration = 'auto';
    },
    { once: true },
  );

  const timeout = new Promise((resolve) => setTimeout(resolve, MAX_WAIT_MS));
  Promise.race([ready, timeout]).then(() => root.classList.add('intro-play'));
}
