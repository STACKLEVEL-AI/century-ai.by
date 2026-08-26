"use client";

import { useEffect } from "react";

function getRevealTargets() {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      ".site-root__content > .hero, .site-root__content > .section, .site-root__content > main > .hero, .site-root__content > main > .section, .site-footer",
    ),
  ).filter((element) => element.offsetHeight > 0);
}

export default function SectionRevealController() {
  useEffect(() => {
    const targets = getRevealTargets();
    if (targets.length === 0) {
      return;
    }

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    for (const target of targets) {
      target.classList.add("reveal");
    }

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      for (const target of targets) {
        target.classList.add("is-visible");
      }

      return;
    }

    const revealIfAlreadyVisible = () => {
      for (const target of targets) {
        if (target.getBoundingClientRect().top <= window.innerHeight * 0.88) {
          target.classList.add("is-visible");
        }
      }
    };

    revealIfAlreadyVisible();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );

    for (const target of targets) {
      if (!target.classList.contains("is-visible")) {
        observer.observe(target);
      }
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
