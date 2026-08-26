"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { useLanguage } from "@/components/site/LanguageProvider";
import { homeCopy } from "@/lib/home-i18n";

function TypedPhrase({
  text,
  active,
  characterDelay,
  className,
}: {
  text: string;
  active: boolean;
  characterDelay: number;
  className?: string;
}) {
  let characterIndex = 0;
  const characterCount = Array.from(text.replaceAll(" ", "")).length;

  return (
    <span
      className={`cases-intro-slide__phrase${active ? " is-typing" : ""}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      {text.split(" ").map((word, wordIndex) => (
        <Fragment key={`${word}-${wordIndex}`}>
          <span className="cases-intro-slide__word">
            {Array.from(word).map((character) => {
              const index = characterIndex;
              characterIndex += 1;

              return (
                <span
                  key={`${character}-${index}`}
                  className="cases-intro-slide__char"
                  style={
                    {
                      "--char-index": index,
                      "--char-reverse-index": characterCount - index - 1,
                      "--char-delay": `${characterDelay}ms`,
                    } as CSSProperties
                  }
                >
                  {character}
                </span>
              );
            })}
          </span>
        </Fragment>
      ))}
    </span>
  );
}

function getStage(progress: number) {
  if (progress >= 0.66) return 3;
  if (progress >= 0.4) return 2;
  if (progress >= 0.02) return 1;
  return 0;
}

export default function CasesIntroSection() {
  const { locale } = useLanguage();
  const copy = homeCopy[locale].casesIntro;
  const sectionRef = useRef<HTMLElement | null>(null);
  const mobileSequenceStartedRef = useRef(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const mobileTimers: number[] = [];

    const clearMobileTimers = () => {
      mobileTimers.forEach((timer) => window.clearTimeout(timer));
      mobileTimers.length = 0;
    };

    const setNextStage = (nextStage: number) => {
      setStage((current) => (current === nextStage ? current : nextStage));
    };

    const updateStage = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const travel = Math.max(section.offsetHeight - viewportHeight, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      if (window.innerWidth <= 640 && !reduceMotion) {
        const hasEnteredViewport = rect.top <= viewportHeight * 0.72 && rect.bottom >= viewportHeight * 0.28;

        if (!hasEnteredViewport) {
          if (mobileSequenceStartedRef.current) {
            clearMobileTimers();
            mobileSequenceStartedRef.current = false;
            setNextStage(0);
          }

          return;
        }

        if (!mobileSequenceStartedRef.current) {
          mobileSequenceStartedRef.current = true;
          setNextStage(0);
          mobileTimers.push(window.setTimeout(() => setNextStage(1), 80));
          mobileTimers.push(window.setTimeout(() => setNextStage(2), 600));
          mobileTimers.push(window.setTimeout(() => setNextStage(3), 1360));
        }

        return;
      }

      const nextStage = reduceMotion ? 3 : getStage(progress);

      setNextStage(nextStage);
    };

    const queueUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateStage);
    };

    queueUpdate();
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);
    window.visualViewport?.addEventListener("resize", queueUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      clearMobileTimers();
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
      window.visualViewport?.removeEventListener("resize", queueUpdate);
    };
  }, []);

  return (
    <section
      id="cases-intro"
      ref={sectionRef}
      data-landing-section
      data-nav-section="cases"
      data-slide-scroll-section
      className="cases-intro-slide hero-grid w-full bg-white"
    >
      <div className="cases-intro-slide__sticky">
        <div className="cases-intro-slide__shell mx-auto flex min-h-[100svh] w-full max-w-[1440px] flex-col px-5 pb-10 pt-16 sm:px-8 sm:pt-24 lg:px-[100px] lg:pb-[100px] lg:pt-[100px]">
          <div
            className={`cases-intro-slide__eyebrow${stage >= 1 ? " is-visible" : ""} flex items-center gap-3 text-[14px] font-medium uppercase leading-none tracking-[0] text-[#868686]`}
          >
            <span className="h-[10px] w-[10px] shrink-0 bg-[#240CFF]" />
            <span>{copy.eyebrow}</span>
          </div>

          <div className="flex flex-1 items-center justify-center py-14 sm:py-16 lg:-mt-14 lg:py-0">
            <div className="w-full text-center">
              <h2
                className="cases-intro-slide__title text-[clamp(54px,12vw,160px)] font-bold leading-[0.9] tracking-[0] text-black"
                aria-label={`${copy.titleOne} ${copy.titleTwo}`}
                data-locale={locale}
              >
                <TypedPhrase
                  className="cases-intro-slide__line"
                  text={copy.titleOne}
                  active={stage >= 1}
                  characterDelay={52}
                />
                {locale === "en" ? <span aria-hidden="true"> </span> : null}
                <TypedPhrase
                  className="cases-intro-slide__line text-[#240CFF]"
                  text={copy.titleTwo}
                  active={stage >= 2}
                  characterDelay={58}
                />
              </h2>

              <p
                className="cases-intro-slide__description mx-auto mt-9 max-w-[850px] text-[20px] font-normal leading-[1.2] tracking-[0] text-[#868686] sm:mt-12 sm:text-[22px] lg:mt-[81px] lg:text-[26px]"
                aria-label={copy.description}
              >
                <TypedPhrase
                  text={copy.description}
                  active={stage >= 3}
                  characterDelay={14}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
