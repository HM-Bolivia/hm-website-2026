/**
 * Marks the section being viewed with `.is-active` (used for the terminal cursor on its title).
 * The active section is the one crossing the middle of the viewport. When none does (e.g. the gap
 * between panels), the last one stays active so the cursor doesn't flicker off.
 */
export function initActiveSection() {
  const sections = document.querySelectorAll('main > section');
  let active = null;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || entry.target === active) continue;
        active?.classList.remove('is-active');
        active = entry.target;
        active.classList.add('is-active');
      }
    },
    // A thin band in the middle of the viewport (a zero-height root behaves inconsistently).
    { rootMargin: '-49% 0px -50% 0px' },
  );

  for (const section of sections) observer.observe(section);
}
