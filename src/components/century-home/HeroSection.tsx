"use client";

import { useLanguage } from "@/components/site/LanguageProvider";
import { homeCopy } from "@/lib/home-i18n";
import { useRef, useState, type CSSProperties } from "react";

const sceneStartTimes = [0, 3, 8, 13, 18] as const;
const videoRevealDelay = 0.5;

const overlayStyle = {
  position: "absolute",
  zIndex: 1,
  inset: 0,
  pointerEvents: "none",
} as const;

const titleStyle = {
  position: "absolute",
  bottom: "clamp(46px, 8vh, 88px)",
  left: "clamp(24px, 6.8vw, 112px)",
  display: "grid",
  color: "#fff",
  fontSize: "clamp(2.15rem, 5vw, 5.5rem)",
  fontWeight: 400,
  lineHeight: 0.9,
  textTransform: "uppercase",
  textShadow: "0 3px 24px rgba(0, 0, 0, 0.38)",
} as CSSProperties;

const industriesStyle = {
  position: "absolute",
  top: "clamp(108px, 18vh, 190px)",
  right: "clamp(24px, 6.8vw, 112px)",
  display: "block",
  color: "rgba(255, 255, 255, 0.96)",
  fontSize: "clamp(0.95rem, 2.6vw, 2.7rem)",
  fontWeight: 400,
  lineHeight: 0.94,
  textAlign: "right",
  textTransform: "uppercase",
  textShadow: "0 3px 24px rgba(0, 0, 0, 0.38)",
} as CSSProperties;

export default function HeroSection() {
  const { locale } = useLanguage();
  const copy = homeCopy[locale].hero;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeScene, setActiveScene] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const poster = locale === "ru" ? "/hero-video/hero-ru-poster.jpg" : "/hero-video/hero-en-poster.jpg";
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
        style={{ backgroundImage: `url(${poster})` }}
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
        poster={poster}
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
        className={`century-home-hero__overlay${videoReady ? " is-ready" : ""}`}
        style={overlayStyle}
        aria-hidden="true"
      >
        <p className="century-home-hero__title" style={titleStyle}>
          <span>{copy.lineOne}</span>
          <span>{copy.lineTwo}</span>
        </p>
        <div className="century-home-hero__industries" style={industriesStyle}>
          <span key={activeScene} className="century-home-hero__industry">
            {industries[activeScene]}
          </span>
        </div>
      </div>
    </section>
  );
}
