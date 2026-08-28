"use client";

import { useLanguage } from "@/components/site/LanguageProvider";
import { homeCopy } from "@/lib/home-i18n";
import { useRef, useState } from "react";

const sceneStartTimes = [0, 3, 8, 13, 18] as const;
const videoRevealDelay = 0.5;

export default function HeroSection() {
  const { locale } = useLanguage();
  const copy = homeCopy[locale].hero;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeScene, setActiveScene] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const fallbackPoster = "/hero-video/hero-fallback.png";
  const industries =
    locale === "ru"
      ? ["Финансы", "Агробизнес", "Металлургия", "Логистика", "Космос"]
      : ["Finance", "Agribusiness", "Metallurgy", "Logistics", "Space"];

  const updateActiveScene = () => {
    const currentTime = videoRef.current?.currentTime ?? 0;
    let nextScene = 0;

    sceneStartTimes.forEach((startTime, index) => {
      if (currentTime >= startTime) {
        nextScene = index;
      }
    });

    setActiveScene((previousScene) =>
      previousScene === nextScene ? previousScene : nextScene,
    );

    if (currentTime >= videoRevealDelay) {
      setVideoReady(true);
    }
  };

  const handleVideoPlaying = () => {
    if ((videoRef.current?.currentTime ?? 0) >= videoRevealDelay) {
      setVideoReady(true);
    }
  };

  return (
    <section
      id="hero"
      className="century-home-hero"
      aria-label={`${copy.lineOne} ${copy.lineTwo}`}
    >
      <h1 className="sr-only">
        {locale === "ru"
          ? "Century — платформа корпоративного ИИ для бизнеса"
          : "Century — enterprise AI platform for business"}
      </h1>
      <div
        className="century-home-hero__placeholder"
        style={{ backgroundImage: `url(${fallbackPoster})` }}
        aria-hidden="true"
      />

      <video
        ref={videoRef}
        className={`century-home-hero__video${videoReady ? " is-ready" : ""}`}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={fallbackPoster}
        aria-label={`${copy.lineOne} ${copy.lineTwo}`}
        onTimeUpdate={updateActiveScene}
        onLoadedMetadata={updateActiveScene}
        onSeeked={updateActiveScene}
        onPlaying={handleVideoPlaying}
        onError={() => setVideoReady(false)}
      >
        <source src="/hero-video/century-main-visual.mp4" type="video/mp4" />
      </video>

      <div
        className="century-home-hero__overlay"
        aria-hidden="true"
      >
        <p className="century-home-hero__title">
          <span>{copy.lineOne}</span>
          <span>{copy.lineTwo}</span>
        </p>
        <div className="century-home-hero__industries">
          <span key={activeScene} className="century-home-hero__industry">
            {industries[activeScene]}
          </span>
        </div>
      </div>
    </section>
  );
}
