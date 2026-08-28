"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/site/LanguageProvider";
import { useScrollDrivenSteps } from "@/hooks/useScrollDrivenSteps";
import { homeCopy } from "@/lib/home-i18n";

const slideMedia = [
  { src: "/slider-image/video/cases-01.mp4" },
  { src: "/slider-image/video/cases-02.mp4" },
  { src: "/slider-image/video/cases-03.mp4" },
  { src: "/slider-image/video/cursorful-video-1784576147761.mp4" },
  { src: "/slider-image/video/cases-05.mp4" },
] as const;

function CaseVideoPreview({
  src,
  label,
  isActive,
}: {
  src: string;
  label: string;
  isActive: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasLoadedFrame, setHasLoadedFrame] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;

    const frame = window.requestAnimationFrame(() => setHasLoadedFrame(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isActive) {
      video.pause();
      if (video.readyState > 0) video.currentTime = 0;
      return;
    }

    video.currentTime = 0;
    void video.play().catch(() => {
      // Muted inline playback is supported in modern browsers, but controls
      // remain available if a browser still blocks programmatic playback.
    });

    return () => video.pause();
  }, [isActive]);

  return (
    <>
      <span className="century-cases__video-placeholder" aria-hidden="true">
        century
      </span>
      <video
        ref={videoRef}
        className={`century-cases__video${hasLoadedFrame ? " is-loaded" : ""}`}
        loop
        muted
        playsInline
        src={isActive ? src : undefined}
        preload={isActive ? "metadata" : "none"}
        onLoadedData={() => setHasLoadedFrame(true)}
        aria-label={label}
      />
    </>
  );
}

function Stepper({
  activeIndex,
  label,
  onStepClick,
}: {
  activeIndex: number;
  label: string;
  onStepClick: (index: number) => void;
}) {
  const progress = (activeIndex / (slideMedia.length - 1)) * 100;

  return (
    <div className="century-cases__stepper" role="tablist" aria-label={label}>
      <span className="century-cases__stepper-line" aria-hidden="true" />
      <span
        className="century-cases__stepper-progress"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />
      {slideMedia.map((_, index) => {
        const step = String(index + 1).padStart(2, "0");
        const isActive = index === activeIndex;
        const isComplete = index <= activeIndex;

        return (
          <button
            key={step}
            id={`case-tab-${step}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls="case-slide-panel"
            tabIndex={isActive ? 0 : -1}
            className={`century-cases__step${isComplete ? " is-complete" : ""}${isActive ? " is-active" : ""}`}
            onClick={() => onStepClick(index)}
          >
            {step}
          </button>
        );
      })}
    </div>
  );
}

export default function CenturySection() {
  const { locale } = useLanguage();
  const copy = homeCopy[locale].cases;
  const { activeIndex, direction, scrollToStep, sectionRef } = useScrollDrivenSteps(slideMedia.length);
  const [playerIndex, setPlayerIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const selectCase = (index: number) => {
    scrollToStep(index);
  };
  const playerCopy = locale === "ru"
    ? { close: "Закрыть видео", open: "Открыть видео", hint: "Нажмите Esc, чтобы закрыть" }
    : { close: "Close video", open: "Open video", hint: "Press Esc to close" };

  useEffect(() => {
    if (playerIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPlayerIndex(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [playerIndex]);

  return (
    <section
      id="cases"
      ref={sectionRef}
      data-landing-section
      data-nav-section="cases"
      data-slide-scroll-section
      className={`century-cases hero-grid is-moving-${direction}`}
      aria-labelledby={`case-slide-title-${activeIndex + 1}`}
    >
      <div className="century-cases__sticky">
        <div className="century-cases__shell">
          <Stepper activeIndex={activeIndex} label={copy.tabsLabel} onStepClick={selectCase} />

          <div className="century-cases__slides" aria-live="polite">
            {copy.slides.map((slide, index) => {
              const step = String(index + 1).padStart(2, "0");
              const isActive = index === activeIndex;

              return (
                <article
                  key={`${locale}-${step}`}
                  id={isActive ? "case-slide-panel" : undefined}
                  className={`century-cases__slide${isActive ? " is-active" : ""}`}
                  role="tabpanel"
                  aria-hidden={!isActive}
                  aria-labelledby={`case-tab-${step}`}
                >
                  <div className="century-cases__copy">
                    <h2 id={`case-slide-title-${index + 1}`}>{slide.title}</h2>
                    <p className="century-cases__lead">{slide.lead}</p>
                    <div id={`case-details-${step}`} className="century-cases__footer">
                      <p className="century-cases__body">{slide.body}</p>
                    </div>

                    <div className="century-cases__tags" aria-label={copy.effectsLabel}>
                      {slide.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  <button
                    className="century-cases__media"
                    type="button"
                    onClick={() => setPlayerIndex(index)}
                    aria-label={`${playerCopy.open}: ${slide.title}`}
                    aria-haspopup="dialog"
                  >
                    <CaseVideoPreview
                      src={slideMedia[index].src}
                      label={`${copy.imageAlt}: ${slide.title}`}
                      isActive={isActive}
                    />
                    <span className="century-cases__play" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M9 6.75v10.5L17.25 12 9 6.75Z" fill="currentColor" />
                      </svg>
                    </span>
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {playerIndex !== null && (
        <div
          className="century-video-player"
          role="dialog"
          aria-modal="true"
          aria-label={`${copy.imageAlt}: ${copy.slides[playerIndex].title}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPlayerIndex(null);
            }
          }}
        >
          <div className="century-video-player__frame">
            <video
              key={slideMedia[playerIndex].src}
              className="century-video-player__video"
              autoPlay
              controls
              playsInline
              preload="metadata"
            >
              <source src={slideMedia[playerIndex].src} type="video/mp4" />
            </video>
            <button
              ref={closeButtonRef}
              className="century-video-player__close"
              type="button"
              onClick={() => setPlayerIndex(null)}
              aria-label={playerCopy.close}
            >
              <span aria-hidden="true">×</span>
              <span>{playerCopy.close}</span>
            </button>
            <p className="century-video-player__hint">{playerCopy.hint}</p>
          </div>
        </div>
      )}

      <div className="century-cases__rail" aria-hidden="true">
        {slideMedia.map((_, index) => (
          <div key={index} className="century-cases__snap-step" />
        ))}
      </div>
    </section>
  );
}
