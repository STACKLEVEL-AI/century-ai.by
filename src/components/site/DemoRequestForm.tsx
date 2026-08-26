"use client";

import { CONTACT_EMAIL, TELEGRAM_HANDLE } from "@/lib/site";
import { Send } from "lucide-react";

type DemoRequestFormProps = {
  variant?: "default" | "stacklevel";
};

export default function DemoRequestForm({ variant = "default" }: DemoRequestFormProps) {
  const isStacklevel = variant === "stacklevel";
  const title = isStacklevel ? "Обсудить проект" : "Запросить демо";
  const description = isStacklevel
    ? "Оставьте заявку на нашем основном сайте, и мы свяжемся с вами для назначения рабочей сессии по интеграции."
    : "Оставьте заявку на нашем сайте, и мы покажем, как платформа решает задачи вашего корпоративного контура.";

  return (
    <div className={`lead-form cta-redirect-block${isStacklevel ? " lead-form--stacklevel" : ""}`}>
      <div className="cta-redirect-content">
        <h3 className="cta-redirect-title">{title}</h3>
        <p className="cta-redirect-text">{description}</p>
      </div>

      <div className="lead-form-actions cta-redirect-actions">
        <a
          href="https://stacklevel.group/ru/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-blue cta-redirect-btn"
        >
          Перейти на сайт Stacklevel Group
        </a>
        <a className="btn btn-ghost cta-redirect-ghost" href={`mailto:${CONTACT_EMAIL}`}>
          Написать на email
        </a>
        <a
          className="cta-redirect-link"
          href={`tg://resolve?domain=${TELEGRAM_HANDLE}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Send size={16} />
          Написать в Telegram
        </a>
      </div>

    </div>
  );
}
