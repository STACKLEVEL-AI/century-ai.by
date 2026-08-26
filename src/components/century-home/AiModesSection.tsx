"use client";

import Image from "next/image";
import { type KeyboardEvent } from "react";
import { useLanguage } from "@/components/site/LanguageProvider";
import { useScrollDrivenSteps } from "@/hooks/useScrollDrivenSteps";
import { homeCopy } from "@/lib/home-i18n";

const modeImages = [
  "/ai-mode-section-image/schema-1.svg",
  "/ai-mode-section-image/schema-2.svg",
  "/ai-mode-section-image/schema-3.svg",
  "/ai-mode-section-image/schema-4.svg",
  "/ai-mode-section-image/schema-5.svg",
] as const;

export default function AiModesSection() {
  const { locale } = useLanguage();
  const copy = homeCopy[locale].modes;
  const { activeIndex, direction, scrollToStep, sectionRef } = useScrollDrivenSteps(copy.items.length);
  const activeMode = copy.items[activeIndex];

  const selectMode = (index: number) => {
    scrollToStep(index);
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const direction =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;

    if (!direction) return;

    event.preventDefault();
    const nextIndex = (index + direction + copy.items.length) % copy.items.length;
    selectMode(nextIndex);
    window.requestAnimationFrame(() => {
      document.getElementById(`mode-tab-${String(nextIndex + 1).padStart(2, "0")}`)?.focus();
    });
  };

  return (
    <section
      id="modes"
      ref={sectionRef}
      data-landing-section
      data-slide-scroll-section
      className={`ai-modes-slide hero-grid is-moving-${direction}`}
      aria-labelledby="ai-modes-title"
    >
      <div className="ai-modes-slide__sticky">
        <div className="ai-modes-slide__shell">
          <header className="ai-modes-slide__header">
            <h2 id="ai-modes-title">{copy.title}</h2>
            <p>{copy.description}</p>
          </header>

          <div className="ai-modes-slide__layout">
            <div className="ai-modes-slide__tabs" role="tablist" aria-label={copy.tabsLabel}>
              {copy.items.map((mode, index) => {
                const step = String(index + 1).padStart(2, "0");
                const isActive = index === activeIndex;

                return (
                  <button
                    key={step}
                    id={`mode-tab-${step}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="mode-panel"
                    tabIndex={isActive ? 0 : -1}
                    className={isActive ? "is-active" : ""}
                    onClick={() => selectMode(index)}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                  >
                    <span>{step}</span>
                    <strong>{mode.title}</strong>
                  </button>
                );
              })}
            </div>

            <div className="ai-modes-slide__active-mode" aria-hidden="true">
              <span>{String(activeIndex + 1).padStart(2, "0")}</span>
              <strong>{activeMode.title}</strong>
            </div>

            <article
              key={`${locale}-${activeIndex}`}
              id="mode-panel"
              className="ai-modes-slide__card"
              role="tabpanel"
              aria-live="polite"
              aria-labelledby={`mode-tab-${String(activeIndex + 1).padStart(2, "0")}`}
            >
              <div className="ai-modes-slide__visual">
                <Image
                  src={modeImages[activeIndex]}
                  alt=""
                  aria-hidden="true"
                  width={350}
                  height={216}
                  priority={activeIndex === 0}
                />
              </div>

              <div className="ai-modes-slide__card-copy">
                <div className="ai-modes-slide__card-title">
                  <span>{String(activeIndex + 1).padStart(2, "0")}</span>
                  <h3>{activeMode.title}</h3>
                </div>
                <span className="ai-modes-slide__badge">{activeMode.badge}</span>
                <p>{activeMode.description}</p>
              </div>
            </article>
          </div>
        </div>
      </div>
      <div className="ai-modes-slide__rail" aria-hidden="true">
        {copy.items.map((mode) => (
          <div key={mode.title} className="ai-modes-slide__step" />
        ))}
      </div>
    </section>
  );
}
