/**
 * Adjustments to the pretalx agenda widget (<pretalx-schedule>). It renders in an open shadow root that
 * page CSS can't reach (only its --pretalx-* variables cross it), so these work from JS. They rely on the
 * widget's internal class names; if those change, they simply do nothing.
 *
 * 1. The day tabs and the track names (grid layout) scroll with the page instead of sticking under the
 *    header.
 * 2. Picking a day scrolls the page to it, but the widget's target ignores the sticky site header, so the
 *    start of the day ends up behind it. Once the widget's scroll ends, nudge the page so the day sits just
 *    under the header. Each day is a `.day` heading in the list (phone) layout and a `.c-grid-schedule`
 *    block in the grid layout, in the same order as the tabs.
 */
const unstick = `
  .days-wrapper,
  .c-grid-schedule .grid > .room { position: static !important; }
`;

export function initAgenda() {
  const widget = document.querySelector('pretalx-schedule');
  if (!widget) return;

  // The widget's script loads async; once the element is defined it has been upgraded and has its shadow
  // root. adoptedStyleSheets apply after the widget's own <style> tags; !important just to be safe.
  customElements.whenDefined('pretalx-schedule').then(() => {
    const root = widget.shadowRoot;
    if (!root) return;
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(unstick);
    root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
  });

  widget.addEventListener('click', (event) => {
    const tab = event.composedPath().find((el) => el.classList?.contains('bunt-tab-header-item'));
    const root = widget.shadowRoot;
    if (!tab || !root) return;

    const index = [...tab.parentElement.children].indexOf(tab);
    afterScroll(() => {
      const list = root.querySelector('.list-schedule');
      const day = root.querySelectorAll(list ? '.day' : '.c-grid-schedule')[index];
      const header = document.querySelector('.site-header');
      if (!day || !header) return;
      const gap = 8;
      const delta = day.getBoundingClientRect().top - header.getBoundingClientRect().bottom - gap;
      if (Math.abs(delta) > 2) window.scrollBy({ top: delta, behavior: 'smooth' });
    });
  });
}

// Runs `fn` once the widget's smooth scroll has finished: when the scroll position has held still for a
// few frames. (`scrollend` isn't reliable here: a scroll that was already ending fires it too early, some
// browsers lack it, and nothing fires when there was nothing to scroll.) Gives up after 2 s.
function afterScroll(fn) {
  const started = performance.now();
  let last = window.scrollY;
  let still = 0;
  const check = () => {
    const y = window.scrollY;
    still = y === last ? still + 1 : 0;
    last = y;
    if (still >= 8) fn();
    else if (performance.now() - started < 2000) requestAnimationFrame(check);
  };
  // Give the widget a moment to start its scroll, so we don't mistake "not started yet" for "finished".
  setTimeout(() => requestAnimationFrame(check), 150);
}
