/**
 * Keeps --header-height equal to the sticky header's real height. The CSS default (4rem) is only right on
 * wide screens; on phones the nav wraps under the logo and the header grows. Anchor links
 * (scroll-padding-top) and the pretalx agenda's sticky day tabs (--pretalx-sticky-top-offset) need the real
 * value, or what they scroll to ends up hidden behind the header.
 */
export function initHeaderHeight() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const root = document.documentElement;
  new ResizeObserver(() => {
    root.style.setProperty('--header-height', `${header.offsetHeight}px`);
  }).observe(header);
}
