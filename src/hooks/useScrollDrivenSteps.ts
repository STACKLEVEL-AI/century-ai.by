"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useScrollDrivenSteps(stepCount: number) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || stepCount < 2) return;

    let frame = 0;

    const updateActiveStep = () => {
      frame = 0;

      const rect = section.getBoundingClientRect();
      const viewportHeight = Math.max(1, window.visualViewport?.height ?? window.innerHeight);

      if (rect.top >= viewportHeight || rect.bottom <= 0) return;

      const nextIndex = Math.max(
        0,
        Math.min(stepCount - 1, Math.round(-rect.top / viewportHeight)),
      );

      const previousIndex = activeIndexRef.current;

      if (nextIndex === previousIndex) return;

      activeIndexRef.current = nextIndex;
      setDirection(nextIndex > previousIndex ? "forward" : "backward");
      setActiveIndex(nextIndex);
    };

    const queueUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveStep);
    };

    queueUpdate();
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);
    window.visualViewport?.addEventListener("resize", queueUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
      window.visualViewport?.removeEventListener("resize", queueUpdate);
    };
  }, [stepCount]);

  const scrollToStep = useCallback(
    (index: number) => {
      const section = sectionRef.current;
      if (!section) return;

      const nextIndex = Math.max(0, Math.min(stepCount - 1, index));
      const sectionTop = window.scrollY + section.getBoundingClientRect().top;
      const previousIndex = activeIndexRef.current;

      activeIndexRef.current = nextIndex;
      if (nextIndex !== previousIndex) {
        setDirection(nextIndex > previousIndex ? "forward" : "backward");
      }
      setActiveIndex(nextIndex);
      window.scrollTo({
        top: sectionTop + (window.visualViewport?.height ?? window.innerHeight) * nextIndex,
        // Smooth programmatic scrolling can be cancelled by CSS scroll-snap.
        behavior: "auto",
      });
    },
    [stepCount],
  );

  return { activeIndex, direction, scrollToStep, sectionRef };
}
