"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type ScrollProfile = {
  snapDurationMs: number;
  snapLockMs: number;
  intraSectionStepPx: number;
  afterContentPaddingPx: number;
  firstBlockOvershootPx: number;
  touchThresholdPx: number;
  keyStepFactor: number;
};

function easeInOutCubic(progress: number) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

function getSnapOffset() {
  if (typeof window === "undefined") {
    return 0;
  }

  if (window.innerWidth <= 480) {
    return 48;
  }

  if (window.innerWidth <= 768) {
    return 56;
  }

  if (window.innerWidth <= 1040) {
    return 64;
  }

  return 0;
}

function getScrollProfile(): ScrollProfile {
  if (typeof window === "undefined") {
    return {
      snapDurationMs: 140,
      snapLockMs: 420,
      intraSectionStepPx: 72,
      afterContentPaddingPx: 200,
      firstBlockOvershootPx: 88,
      touchThresholdPx: 8,
      keyStepFactor: 0.3,
    };
  }

  const { innerWidth, innerHeight } = window;

  if (innerWidth <= 480) {
    return {
      snapDurationMs: 220,
      snapLockMs: 520,
      intraSectionStepPx: Math.max(88, Math.round(innerHeight * 0.11)),
      afterContentPaddingPx: 140,
      firstBlockOvershootPx: 0,
      touchThresholdPx: 14,
      keyStepFactor: 0.2,
    };
  }

  if (innerWidth <= 768) {
    return {
      snapDurationMs: 200,
      snapLockMs: 500,
      intraSectionStepPx: Math.max(84, Math.round(innerHeight * 0.1)),
      afterContentPaddingPx: 160,
      firstBlockOvershootPx: 0,
      touchThresholdPx: 12,
      keyStepFactor: 0.22,
    };
  }

  if (innerWidth <= 1040) {
    return {
      snapDurationMs: 180,
      snapLockMs: 460,
      intraSectionStepPx: Math.max(80, Math.round(innerHeight * 0.09)),
      afterContentPaddingPx: 180,
      firstBlockOvershootPx: 32,
      touchThresholdPx: 10,
      keyStepFactor: 0.26,
    };
  }

  if (innerHeight <= 940) {
    return {
      snapDurationMs: 150,
      snapLockMs: 420,
      intraSectionStepPx: Math.max(76, Math.round(innerHeight * 0.085)),
      afterContentPaddingPx: 200,
      firstBlockOvershootPx: 88,
      touchThresholdPx: 8,
      keyStepFactor: 0.28,
    };
  }

  return {
    snapDurationMs: 140,
    snapLockMs: 420,
    intraSectionStepPx: 72,
    afterContentPaddingPx: 200,
    firstBlockOvershootPx: 88,
    touchThresholdPx: 8,
    keyStepFactor: 0.3,
  };
}

function getSnapTargets() {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      ".site-root__content > .hero, .site-root__content > .section, .site-root__content > main > .hero, .site-root__content > main > .section, .site-footer",
    ),
  ).filter((element) => element.offsetHeight > 0);
}

function getElementTop(element: HTMLElement) {
  return window.scrollY + element.getBoundingClientRect().top;
}

function getAlignedTop(element: HTMLElement) {
  const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  return Math.max(0, Math.min(getElementTop(element) - getSnapOffset(), maxScrollY));
}

function getCurrentIndex(targets: HTMLElement[], currentY: number) {
  const adjustedY = currentY + getSnapOffset();
  let index = 0;

  for (let candidate = 0; candidate < targets.length; candidate += 1) {
    if (getAlignedTop(targets[candidate]) <= adjustedY + 1) {
      index = candidate;
    }
  }

  return index;
}

function getAfterContentTriggerY(element: HTMLElement) {
  const { afterContentPaddingPx } = getScrollProfile();
  const sectionTop = getElementTop(element);
  const sectionBottom = sectionTop + Math.max(element.offsetHeight, element.scrollHeight);
  const trackedContent = element.querySelectorAll<HTMLElement>(
    ".section-head, .security-accordion-grid, .hook-grid, .black-accent, .black-accent-top, .black-accent-grid, .section-note-old, .section-actions-old",
  );

  if (trackedContent.length > 0) {
    const contentBottom = Math.max(
      ...Array.from(trackedContent, (node) => window.scrollY + node.getBoundingClientRect().bottom),
    );

    return Math.max(
      sectionTop + afterContentPaddingPx,
      contentBottom - window.innerHeight + afterContentPaddingPx,
    );
  }

  return Math.max(
    sectionTop + afterContentPaddingPx,
    sectionBottom - window.innerHeight + afterContentPaddingPx,
  );
}

export default function ScrollSnapController() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/" && document.querySelector(".century-home-page")) {
      return;
    }

    let animationFrame = 0;
    let isAnimating = false;
    let lockUntil = 0;
    let touchStartY = 0;

    const isLocked = () => performance.now() < lockUntil || isAnimating;

    const stopAnimation = () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
      isAnimating = false;
    };

    const animateScrollTo = (targetY: number) => {
      const { snapDurationMs, snapLockMs } = getScrollProfile();
      stopAnimation();

      const startY = window.scrollY;
      const delta = targetY - startY;

      if (Math.abs(delta) <= 2) {
        lockUntil = performance.now() + snapLockMs;
        return;
      }

      isAnimating = true;
      lockUntil = performance.now() + snapLockMs;
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / snapDurationMs, 1);
        const eased = easeInOutCubic(progress);

        window.scrollTo(0, startY + delta * eased);

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(tick);
          return;
        }

        animationFrame = 0;
        isAnimating = false;
      };

      animationFrame = window.requestAnimationFrame(tick);
    };

    const stepInsideSection = (element: HTMLElement, delta: number) => {
      const { intraSectionStepPx } = getScrollProfile();
      const currentY = window.scrollY;
      const sectionTop = getAlignedTop(element);
      const triggerY = getAfterContentTriggerY(element);
      const step = Math.max(intraSectionStepPx, Math.abs(delta));

      if (delta > 0) {
        window.scrollTo(0, Math.min(triggerY, currentY + step));
        return true;
      }

      if (currentY > sectionTop + 1) {
        window.scrollTo(0, Math.max(sectionTop, currentY - step));
        return true;
      }

      return false;
    };

    const handleDirectionalScroll = (delta: number) => {
      if (Math.abs(delta) < 2 || isLocked()) {
        return;
      }

      const targets = getSnapTargets();
      if (targets.length === 0) {
        return;
      }

      const currentY = window.scrollY;
      const currentIndex = getCurrentIndex(targets, currentY);
      const currentTarget = targets[currentIndex];

      if (delta > 0) {
        const nextTarget = targets[currentIndex + 1];

        if (!nextTarget) {
          return;
        }

        const triggerY = getAfterContentTriggerY(currentTarget);

        if (currentY < triggerY - 1) {
          stepInsideSection(currentTarget, delta);
          return;
        }

        animateScrollTo(getAlignedTop(nextTarget));
        return;
      }

      if (currentIndex === 0) {
        const { firstBlockOvershootPx } = getScrollProfile();
        animateScrollTo(Math.max(0, getAlignedTop(currentTarget) - firstBlockOvershootPx));
        return;
      }

      if (stepInsideSection(currentTarget, delta)) {
        return;
      }

      const previousTarget = targets[currentIndex - 1];
      if (!previousTarget) {
        return;
      }

      animateScrollTo(getAlignedTop(previousTarget));
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      handleDirectionalScroll(event.deltaY);
    };

    const handleKeydown = (event: KeyboardEvent) => {
      const { keyStepFactor } = getScrollProfile();
      const forwardKeys = new Set(["ArrowDown", "PageDown", " "]);
      const backwardKeys = new Set(["ArrowUp", "PageUp"]);

      if (forwardKeys.has(event.key)) {
        event.preventDefault();
        handleDirectionalScroll(window.innerHeight * keyStepFactor);
        return;
      }

      if (backwardKeys.has(event.key)) {
        event.preventDefault();
        handleDirectionalScroll(-window.innerHeight * keyStepFactor);
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const { touchThresholdPx } = getScrollProfile();
      const currentTouchY = event.touches[0]?.clientY ?? touchStartY;
      const delta = touchStartY - currentTouchY;

      if (Math.abs(delta) < touchThresholdPx) {
        return;
      }

      event.preventDefault();
      handleDirectionalScroll(delta);
      touchStartY = currentTouchY;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      stopAnimation();
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [pathname]);

  return null;
}
