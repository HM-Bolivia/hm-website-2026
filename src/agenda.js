/**
 * Small fix for the pretalx agenda widget (<pretalx-schedule>) in its phone (list) layout.
 *
 * Picking a day in the tabs scrolls the page to that day, but the widget's target ignores the sticky
 * site header and its own sticky day tabs, so the first talk ends up hidden behind them. Once the widget's
 * scroll ends, nudge the page so the day's heading sits just under the tabs. The desktop grid already lands
 * in the right place and is left alone.
 *
 * Relies on the widget's internal class names (it renders in an open shadow root); if they change, this
 * simply does nothing.
 */
export function initAgenda() {
  const widget = document.querySelector('pretalx-schedule');
  if (!widget) return;

  widget.addEventListener('click', (event) => {
    const tab = event.composedPath().find((el) => el.classList?.contains('bunt-tab-header-item'));
    const root = widget.shadowRoot;
    if (!tab || !root?.querySelector('.list-schedule')) return;

    const index = [...tab.parentElement.children].indexOf(tab);
    afterScroll(() => {
      const day = root.querySelectorAll('.day')[index];
      const tabs = root.querySelector('.days-wrapper');
      if (!day || !tabs) return;
      const gap = 8;
      const delta = day.getBoundingClientRect().top - tabs.getBoundingClientRect().bottom - gap;
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
