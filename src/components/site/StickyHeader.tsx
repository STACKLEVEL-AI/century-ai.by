"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { useLanguage } from "@/components/site/LanguageProvider";
import { homeCopy, type Locale } from "@/lib/home-i18n";
import { siteNavigation } from "@/lib/site";

const LANDING_SCROLL_RESTORE_KEY = "century:landing-scroll-y";

function isCasesSliderActive() {
  const slider = document.getElementById("cases");

  if (!slider) {
    return false;
  }

  const { top, bottom } = slider.getBoundingClientRect();
  return top <= 0 && bottom >= window.innerHeight;
}

export default function StickyHeader() {
  const pathname = usePathname();
  const { locale, setLocale } = useLanguage();
  const copy = homeCopy[locale].navigation;
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isOverHero, setIsOverHero] = useState(pathname === "/");
  const [activeSection, setActiveSection] = useState("");
  const lastScrollY = useRef(0);
  const downScrollAccum = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => {
      const next = !prev;

      if (next) {
        setHidden(false);
      }

      return next;
    });
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const centerLandingTarget = useCallback((target: HTMLElement) => {
    const headerHeightRaw = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--landing-header-height");
    const headerHeight = Number.parseFloat(headerHeightRaw) || 0;
    const visibleViewportHeight = Math.max(window.innerHeight - headerHeight, 0);
    const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const targetRect = target.getBoundingClientRect();
    const targetStart = window.scrollY + targetRect.top;
    const targetCenter = window.scrollY + targetRect.top + targetRect.height / 2;
    const viewportCenter = headerHeight + visibleViewportHeight / 2;
    const requestedTop = target.hasAttribute("data-slide-scroll-section")
      ? targetStart
      : targetCenter - viewportCenter;
    const targetTop = Math.max(0, Math.min(requestedTop, maxScrollY));

    window.scrollTo({ top: targetTop, behavior: "auto" });
  }, []);

  const handleLandingAnchorClick = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
      closeMenu();

      if (pathname !== "/") {
        return;
      }

      const [, targetId] = href.split("#");

      if (!targetId) {
        return;
      }

      const target = document.getElementById(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();
      setHidden(false);
      setActiveSection(targetId);
      window.dispatchEvent(
        new CustomEvent("century:anchor-navigation-start", {
          detail: { targetId },
        }),
      );

      const nextUrl = `${window.location.pathname}#${targetId}`;

      if (window.location.pathname + window.location.hash !== nextUrl) {
        window.history.pushState(null, "", nextUrl);
      }

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          centerLandingTarget(target);
        });
      });
    },
    [centerLandingTarget, closeMenu, pathname],
  );

  useEffect(() => {
    const updateCasesSliderLock = () => {
      const sliderIsActive = isCasesSliderActive();
      document.documentElement.classList.toggle("century-slider-active", sliderIsActive);

      return sliderIsActive;
    };

    const onScroll = () => {
      if (pathname !== "/") {
        setIsOverHero(false);
        return;
      }

      if (updateCasesSliderLock()) {
        setHidden(true);
        return;
      }

      if (menuOpen) {
        return;
      }

      const current = window.scrollY;
      const hero = document.getElementById("hero");

      if (hero) {
        const heroBottom = hero.getBoundingClientRect().bottom;
        const headerBottom = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
        const nextIsOverHero = heroBottom > headerBottom;

        setIsOverHero((previous) => previous !== nextIsOverHero ? nextIsOverHero : previous);

        if (heroBottom > 0) {
          downScrollAccum.current = 0;
          setHidden(false);
          lastScrollY.current = current;
          return;
        }
      }

      const delta = current - lastScrollY.current;

      if (delta > 0) {
        downScrollAccum.current += delta;

        if (downScrollAccum.current >= 40 && current > 80) {
          setHidden(true);
        }
      } else {
        downScrollAccum.current = 0;
      }

      lastScrollY.current = current;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.documentElement.classList.remove("century-slider-active");
    };
  }, [menuOpen, pathname]);

  useEffect(() => {
    const onMouseMove = (event: globalThis.MouseEvent) => {
      if (
        !window.matchMedia("(hover: hover)").matches ||
        document.documentElement.classList.contains("century-slider-active")
      ) {
        return;
      }

      if (event.clientY < 80) {
        setHidden(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  const handleHeaderMouseLeave = useCallback(() => {
    if (
      menuOpen ||
      !window.matchMedia("(hover: hover)").matches ||
      document.documentElement.classList.contains("century-slider-active")
    ) {
      return;
    }

    const hero = document.getElementById("hero");

    if (!hero || hero.getBoundingClientRect().bottom <= 0) {
      setHidden(true);
    }
  }, [menuOpen]);

  const handleLocaleChange = useCallback(
    (nextLocale: Locale) => {
      setLocale(nextLocale);
      closeMenu();
    },
    [closeMenu, setLocale],
  );

  useEffect(() => {
    if (!menuOpen || typeof window === "undefined" || window.innerWidth > 1040) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const getSectionKey = (section: HTMLElement) => section.dataset.navSection || section.id;
    const shouldPreserveReloadScroll = () => {
      const navigationEntry = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;

      const isRestoreNavigation =
        navigationEntry?.type === "reload" || navigationEntry?.type === "back_forward";

      return isRestoreNavigation && sessionStorage.getItem(LANDING_SCROLL_RESTORE_KEY) !== null;
    };

    const centerTargetFromHash = () => {
      if (shouldPreserveReloadScroll()) {
        return;
      }

      const hash = window.location.hash.replace(/^#/, "");

      if (!hash) {
        return;
      }

      const target = document.getElementById(hash);

      if (!target) {
        return;
      }

      window.dispatchEvent(
        new CustomEvent("century:anchor-navigation-start", {
          detail: { targetId: hash },
        }),
      );

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          centerLandingTarget(target);
        });
      });
    };

    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-landing-section]"));

    if (sections.length === 0 || !("IntersectionObserver" in window)) {
      centerTargetFromHash();
      window.addEventListener("hashchange", centerTargetFromHash);

      return () => {
        window.removeEventListener("hashchange", centerTargetFromHash);
      };
    }

    if (window.location.hash) {
      centerTargetFromHash();
    }

    const visibility = new Map<string, number>();
    sections.forEach((section) => {
      visibility.set(section.id, 0);
    });

    const setActiveFromHash = () => {
      const hash = window.location.hash.replace(/^#/, "");

      if (hash) {
        const target = document.getElementById(hash);
        setActiveSection(target ? getSectionKey(target) : hash);
      }
    };

    const updateActiveSection = () => {
      let nextSection = "";
      let maxRatio = 0;

      sections.forEach((section) => {
        const ratio = visibility.get(section.id) ?? 0;

        if (ratio > maxRatio) {
          maxRatio = ratio;
          nextSection = getSectionKey(section);
        }
      });

      if (!nextSection && window.scrollY >= 24) {
        nextSection = sections[0] ? getSectionKey(sections[0]) : "";
      }

      setActiveSection(nextSection);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibility.set(
            (entry.target as HTMLElement).id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        });

        updateActiveSection();
      },
      {
        threshold: [0.16, 0.3, 0.5, 0.72],
        rootMargin: "-18% 0px -56% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));
    setActiveFromHash();
    window.addEventListener("hashchange", setActiveFromHash);
    window.addEventListener("hashchange", centerTargetFromHash);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", setActiveFromHash);
      window.removeEventListener("hashchange", centerTargetFromHash);
    };
  }, [centerLandingTarget, pathname]);

  return (
    <>
      <header
        className={`site-header palantir-header${isOverHero ? " is-over-hero" : ""}${hidden ? " is-hidden" : ""}${menuOpen ? " menu-open" : ""}`}
        onMouseLeave={handleHeaderMouseLeave}
      >
        <div className="header-main mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-[100px]">
          <Link
            href="/#hero"
            className="logo h-[42px] w-[170px]"
            aria-label="Century"
            onClick={(event) => handleLandingAnchorClick(event, "/#hero")}
          >
            <span className="logo-century w-full">CENTURY</span>
          </Link>

          <button
            className={`burger-btn${menuOpen ? " is-active" : ""}`}
            type="button"
            onClick={toggleMenu}
            aria-label={
              menuOpen
                ? copy.closeMenu
                : copy.openMenu
            }
            aria-expanded={menuOpen}
          >
            <span className="burger-line" />
            <span className="burger-line" />
            <span className="burger-line" />
          </button>

          <nav
            className={`main-nav${menuOpen ? " is-open" : ""}`}
            aria-label={copy.aria}
          >
            {siteNavigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`main-nav__link${pathname === "/" && activeSection === item.sectionId ? " is-active" : ""}`}
                onClick={(event) => handleLandingAnchorClick(event, item.href)}
              >
                <span className="main-nav__index">{String(index + 1).padStart(2, "0")}</span>
                <span className="main-nav__label">{copy.items[index]}</span>
              </Link>
            ))}

            <div className="language-switch" role="group" aria-label="Language / Язык">
              {(["ru", "en"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={locale === option}
                  className={locale === option ? "is-active" : ""}
                  onClick={() => handleLocaleChange(option)}
                >
                  {option.toUpperCase()}
                </button>
              ))}
            </div>

          </nav>
        </div>
      </header>

    </>
  );
}
