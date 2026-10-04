/**
 * Unified smooth scrolling utility for Bakkiyam Silk Saree Shop.
 * Handles both Lenis virtual scroll and standard browser smooth scroll
 * with responsive header offset for desktop and mobile screens.
 */
export function smoothScrollTo(target: string | HTMLElement, customOffset?: number): void {
  const isMobile = window.innerWidth <= 768;
  const headerOffset = customOffset !== undefined ? customOffset : (isMobile ? -65 : -75);

  const lenis = (window as any).__lenis;

  // Handle Home / Top
  if (
    target === 'home' ||
    target === '#home' ||
    target === '/#home' ||
    target === '' ||
    target === '#top'
  ) {
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(0, { duration: 1.1, immediate: false });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return;
  }

  // Resolve target element
  let el: HTMLElement | null = null;
  if (typeof target === 'string') {
    const cleanId = target.replace(/^(\/#|#)/, '');
    el = document.getElementById(cleanId);
    if (!el && cleanId === 'saree-types') {
      el = document.getElementById('collections');
    }
  } else {
    el = target;
  }

  if (!el) {
    console.warn(`[smoothScrollTo] Target element not found for:`, target);
    return;
  }

  // Scroll with Lenis if available
  if (lenis && typeof lenis.scrollTo === 'function') {
    lenis.scrollTo(el, { offset: headerOffset, duration: 1.1, immediate: false });
  } else {
    // Native fallback
    const targetTop = el.getBoundingClientRect().top + window.scrollY + headerOffset;
    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth',
    });
  }
}
