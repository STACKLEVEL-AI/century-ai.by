"use client";

import Image from "next/image";
import { useState, type KeyboardEvent } from "react";
import { useLanguage } from "@/components/site/LanguageProvider";
import { useReveal } from "@/hooks/useReveal";
import { homeCopy } from "@/lib/home-i18n";

export default function SecurityFeatureBlock() {
  const { locale } = useLanguage();
  const copy = homeCopy[locale].security;
  const { ref, className } = useReveal();
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const backCopy = locale === "ru"
    ? [
        { label: "Варианты развертывания", text: "On-premise, VPC или частное облако: выбираем схему, которая соответствует требованиям ИБ и эксплуатации." },
        { label: "Работа с данными", text: "Запросы, модели и результаты обрабатываются внутри контура. Политики доступа применяются до обращения к данным." },
        { label: "Подключение", text: "Интегрируем Century с внутренними сервисами через API, очереди и защищенные коннекторы без копирования критичных данных." },
        { label: "Контроль", text: "Логи, роли, политики и следы действий доступны для проверки, расследований и регулярного аудита." },
      ]
    : [
        { label: "Deployment options", text: "On-premise, VPC or private cloud: choose the architecture that matches security and operations requirements." },
        { label: "Data handling", text: "Requests, models and results stay inside the environment, with access policies enforced before any data is used." },
        { label: "Integration", text: "Connect Century to internal services through APIs, queues and secure connectors without duplicating critical data." },
        { label: "Control", text: "Logs, roles, policies and action trails are ready for investigations, recurring audits and compliance reviews." },
      ];
  const flipHint = locale === "ru" ? "Перевернуть карточку" : "Flip card";

  const toggleFeature = (index: number) => {
    setFlippedIndex((current) => (current === index ? null : index));
  };

  const handleFeatureKeyDown = (event: KeyboardEvent<HTMLElement>, index: number) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleFeature(index);
  };

  return (
    <section
      id="security"
      ref={ref}
      data-landing-section
      className={`security-slide ${className}`}
      aria-labelledby="security-slide-title"
    >
      <div className="security-slide__shell">
        <div className="security-slide__panel">
          <header>
            <h2 id="security-slide-title">{copy.title}</h2>
            <p>
              <strong>Century</strong> {copy.descriptionPrefix} {copy.descriptionSuffix}
            </p>
          </header>

          <div className="security-slide__features">
            {copy.features.map((feature, index) => (
              <article
                key={feature.title}
                className={flippedIndex === index ? "is-flipped" : ""}
                role="button"
                tabIndex={0}
                aria-pressed={flippedIndex === index}
                aria-label={`${feature.title}. ${flipHint}`}
                onClick={() => toggleFeature(index)}
                onKeyDown={(event) => handleFeatureKeyDown(event, index)}
              >
                <div className="security-slide__feature-card">
                  <div className="security-slide__feature-front">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                  <div className="security-slide__feature-back" aria-hidden={flippedIndex !== index}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{backCopy[index].label}</h3>
                    <p>{backCopy[index].text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="security-slide__partner">
          <Image src="/hoster-icon.svg" alt="hoster.by" width={150} height={48} />
          <div>
            <h3>{copy.partnerTitle}</h3>
            <p>{copy.partnerDescription}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
