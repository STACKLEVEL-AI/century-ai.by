export const SCROLL_ANIMATION_MS = 300;

function easeInOutCubic(progress: number) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

export function animateWindowScrollTo(targetY: number, duration = SCROLL_ANIMATION_MS) {
  if (typeof window === "undefined") {
    return;
  }

  const startY = window.scrollY;
  const delta = targetY - startY;

  if (Math.abs(delta) < 2) {
    return;
  }

  const startTime = performance.now();

  const tick = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);

    window.scrollTo(0, startY + delta * eased);

    if (progress < 1) {
      window.requestAnimationFrame(tick);
    }
  };

  window.requestAnimationFrame(tick);
}

export function animateElementIntoView(element: HTMLElement, offset = 0, duration = SCROLL_ANIMATION_MS) {
  if (typeof window === "undefined") {
    return;
  }

  const absoluteTop = window.scrollY + element.getBoundingClientRect().top;
  animateWindowScrollTo(Math.max(0, absoluteTop - offset), duration);
}
