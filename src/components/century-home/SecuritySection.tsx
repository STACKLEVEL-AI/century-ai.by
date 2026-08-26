"use client";

import { useState, type CSSProperties, type KeyboardEvent } from "react";
import { PlatformLayerArtwork, PlatformLayerIcon } from "@/components/century-home/PlatformVisuals";
import { useLanguage } from "@/components/site/LanguageProvider";
import { useScrollDrivenSteps } from "@/hooks/useScrollDrivenSteps";
import { homeCopy } from "@/lib/home-i18n";

const layerSteps = ["01", "02", "03", "04", "05"] as const;
const layerOffsets = [
  "0px",
  "clamp(34px, 5.44vw, 68px)",
  "clamp(68px, 10.88vw, 136px)",
  "clamp(102px, 17.76vw, 222px)",
  "clamp(136px, 23.52vw, 294px)",
] as const;

export default function SecuritySection() {
  const { locale } = useLanguage();
  const copy = homeCopy[locale].platform;
  const { activeIndex, direction, scrollToStep, sectionRef } = useScrollDrivenSteps(layerSteps.length);
  const activeLayer = copy.layers[activeIndex];
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isPreviewing = hoveredIndex !== null && hoveredIndex !== activeIndex;

  const selectLayer = (index: number) => {
    setHoveredIndex(null);
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
    const nextIndex = (index + direction + layerSteps.length) % layerSteps.length;
    selectLayer(nextIndex);
    window.requestAnimationFrame(() => {
      document.getElementById(`platform-layer-tab-${layerSteps[nextIndex]}`)?.focus();
    });
  };

  return (
    <section
      id="platform"
      ref={sectionRef}
      data-landing-section
      data-slide-scroll-section
      className={`platform-architecture hero-grid is-moving-${direction}${isPreviewing ? " is-previewing" : ""}`}
      aria-labelledby="platform-architecture-title"
    >
      <div className="platform-architecture__sticky">
        <div className="platform-architecture__shell">
          <header className="platform-architecture__header">
            <h2 id="platform-architecture-title">
              {copy.titleOne}
              <br />
              {copy.titleTwo}
            </h2>
          </header>

          <div className="platform-architecture__content">
            <div
              className="platform-architecture__tabs"
              role="tablist"
              aria-label={copy.tabsLabel}
            >
              {copy.layers.map((layer, index) => {
                const step = layerSteps[index];
                const isActive = index === activeIndex;

                return (
                  <button
                    key={step}
                    id={`platform-layer-tab-${step}`}
                    type="button"
                    role="tab"
                    aria-label={`${copy.layerLabel} ${step}: ${layer.title}`}
                    aria-selected={isActive}
                    aria-controls="platform-layer-panel"
                    tabIndex={isActive ? 0 : -1}
                    className={`platform-layer-tab${isActive ? " is-active" : ""}${hoveredIndex === index ? " is-hovered" : ""}`}
                    onClick={() => selectLayer(index)}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                    onPointerEnter={() => setHoveredIndex(index)}
                    onPointerLeave={() => setHoveredIndex(null)}
                    onFocus={() => setHoveredIndex(index)}
                    onBlur={() => setHoveredIndex(null)}
                  >
                    <span className="platform-layer-tab__icon" aria-hidden="true">
                      <PlatformLayerIcon index={index} />
                    </span>
                    <span className="platform-layer-tab__copy">
                      <span className="platform-layer-tab__step">
                        {copy.layerLabel} {step}
                      </span>
                      <strong>{layer.title}</strong>
                      <span>{layer.description}</span>
                    </span>
                    <span className="platform-layer-tab__node" aria-hidden="true" />
                  </button>
                );
              })}
            </div>

            <div
              id="platform-layer-panel"
              className="platform-architecture__visual"
              role="tabpanel"
              aria-live="polite"
              aria-labelledby={`platform-layer-tab-${layerSteps[activeIndex]}`}
            >
              <div className="platform-layer-stack">
                {copy.layers.map((layer, index) => {
                  const step = layerSteps[index];
                  return (
                    <button
                      key={step}
                      type="button"
                      aria-label={`${copy.showLayer} ${step}: ${layer.title}`}
                      aria-pressed={index === activeIndex}
                      tabIndex={index === activeIndex ? 0 : -1}
                      className={`platform-layer-card${index === activeIndex ? " is-current-slot" : ""}`}
                      style={
                        {
                          "--layer-index": index,
                          "--layer-offset": layerOffsets[index],
                        } as CSSProperties
                      }
                      onClick={() => selectLayer(index)}
                    >
                      <PlatformLayerArtwork index={index} locale={locale} />
                    </button>
                  );
                })}

                <div
                  key={activeIndex}
                  className="platform-layer-card platform-layer-card--active"
                  style={
                    {
                      "--active-slot-offset": layerOffsets[activeIndex],
                    } as CSSProperties
                  }
                  aria-hidden="true"
                >
                  {activeIndex > 0 ? <span className="platform-layer-glass" /> : null}
                  <PlatformLayerArtwork index={activeIndex} locale={locale} variant="active" />
                </div>
              </div>

              <div className="platform-architecture__counter" aria-hidden="true">
                <span>{layerSteps[activeIndex]}</span>
                <span>/ {String(layerSteps.length).padStart(2, "0")}</span>
              </div>

              <p className="sr-only">
                {copy.activeLayer}: {activeLayer.title}. {activeLayer.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="platform-architecture__rail" aria-hidden="true">
        {layerSteps.map((step) => (
          <div key={step} className="platform-architecture__step" />
        ))}
      </div>
    </section>
  );
}
