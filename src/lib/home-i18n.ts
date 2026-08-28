export type Locale = "ru" | "en";

export const homeCopy = {
  ru: {
    navigation: {
      items: ["Платформа", "Кейсы", "Режимы", "Безопасность"],
      contact: "Связаться",
      openMenu: "Открыть меню",
      closeMenu: "Закрыть меню",
      aria: "Основная навигация",
    },
    hero: {
      lineOne: "Бизнес",
      lineTwo: "будущего",
    },
    platform: {
      eyebrow: "Архитектура платформы · интерактив",
      titleOne: "Единая точка входа",
      titleTwo: "для ИИ в компании",
      hint: "Выберите слой — строка или плита",
      tabsLabel: "Слои архитектуры Century",
      layerLabel: "Слой",
      showLayer: "Показать слой",
      activeLayer: "Активный слой",
      layers: [
        {
          title: "Потребители ИИ",
          description: "Отделы · Системы · Цифровые продукты",
        },
        {
          title: "Century — точка входа",
          description: "Чат · Конструктор · API",
        },
        {
          title: "Гарантии",
          description: "Безопасность · Данные · Комплаенс · Масштаб",
        },
        {
          title: "Фундамент платформы",
          description: "Модели · Данные · Инфраструктура",
        },
        {
          title: "Защищенный контур",
          description: "On-prem · VPC · Частное облако",
        },
      ],
    },
    casesIntro: {
      eyebrow: "CENTURY / ПЛАТФОРМА",
      titleOne: "ИИ, который",
      titleTwo: "работает",
      description:
        "Пять реальных кейсов, где платформа превращает модели в результат для бизнеса",
    },
    cases: {
      tabsLabel: "Кейсы Century",
      effectsLabel: "Ключевые эффекты",
      imageAlt: "Интерфейс Century",
      slides: [
        {
          title: "Сквозная аналитика",
          lead: "Сводим данные о клиентах из всех источников в один прозрачный профиль.",
          body: "Как общаются, как платят, что пишут в поддержку, как ведут себя в цифровом пространстве: все в одном профиле. Бизнес видит, где узкие места в воронке, что оптимизировать и какое решение принять на данных.",
          tags: ["ROI ПО КАНАЛАМ", "ТОЧКИ ОТТОКА", "РЕШЕНИЕ ПО БЮДЖЕТУ"],
        },
        {
          title: "Разговорный ИИ",
          lead: "Клиенты и сотрудники получают ответ без очереди и ожидания.",
          body: "ИИ принимает обращения круглосуточно, отвечает на типовые вопросы, оформляет заявки и передает сложные кейсы человеку. Поддержка перестает заниматься рутиной и подключается там, где нужен специалист.",
          tags: ["ПЕРВАЯ ЛИНИЯ 24/7", "УМНАЯ ЭСКАЛАЦИЯ", "АВТОЗАКРЫТИЕ ОБРАЩЕНИЙ"],
        },
        {
          title: "Память компании",
          lead: "Спрашиваете своими словами — получаете точный ответ со ссылкой на документ.",
          body: "Регламенты, инструкции, договоры и переписка доступны в одном поиске. Новый сотрудник входит в курс за дни, а не за месяцы, и экспертиза не уходит из компании вместе с людьми.",
          tags: ["ОТВЕТ СО ССЫЛКОЙ", "ОНБОРДИНГ ЗА ДНИ", "ЕДИНЫЙ ИСТОЧНИК ПРАВДЫ"],
        },
        {
          title: "Общение с данными",
          lead: "Вопрос на обычном языке превращаем в точный ответ и готовый дашборд.",
          body: "Оценка звонка, сводка возражений, данные CRM и следующий шаг по клиенту приходят в чат цифрой и дашбордом. Руководитель видит скоринг сделок, прогнозы и риск оттока.",
          tags: ["СКОРИНГ СДЕЛОК", "ПРОГНОЗЫ ДЛЯ CEO", "РИСК ОТТОКА И LTV"],
        },
        {
          title: "ИИ под контролем",
          lead: "Каждый запрос виден: кто, какая модель, сколько токенов и денег.",
          body: "Логирование обращений, доступ по ролям, защита от утечек и prompt injection, работа on-premise. Вы управляете тем, что ИИ может делать, и проходите аудит без сюрпризов.",
          tags: ["ДОСТУП ПО РОЛЯМ", "ON-PREMISE", "СТОИМОСТЬ ПО ЗАПРОСУ"],
        },
      ],
    },
    modes: {
      title: "Пять режимов работы с ИИ",
      description: "Выберите режим: посмотрите, как он устроен и что дает бизнесу.",
      tabsLabel: "Режимы работы с ИИ",
      items: [
        {
          title: "Chat",
          badge: "до 90% рутинных задач",
          description:
            "Внутрикорпоративный чат, где каждый сотрудник работает со своим ИИ-ассистентом. Доступ к документам и базам знаний без риска утечек за периметр компании.",
        },
        {
          title: "Agentic Automation Workflow",
          badge: "сквозная автоматизация",
          description:
            "ИИ-агенты выполняют многошаговые задачи: планируют, принимают решения и действуют в ваших системах под контролем человека.",
        },
        {
          title: "Robotic Process Automation",
          badge: "роботизация операций",
          description:
            "Программные роботы переносят данные, заполняют формы и сверяют записи по четким правилам — без изменения текущих систем.",
        },
        {
          title: "Text-to-SQL",
          badge: "процессы под ИИ",
          description:
            "Запрос на обычном языке превращается в SQL, выборку и объяснимый ответ — без очереди к аналитикам и ручной сборки отчета.",
        },
        {
          title: "Human-only",
          badge: "зона ответственности человека",
          description:
            "Там, где важны суждение, эмпатия и личная ответственность, решение остается за человеком, а ИИ забирает рутину.",
        },
      ],
    },
    security: {
      title: "Безопасность",
      descriptionPrefix: "становится частью вашей ИТ-среды — без выноса",
      descriptionSuffix: "критичных процессов за пределы контролируемого контура.",
      features: [
        { title: "Размещение", description: "Изолированный экземпляр на ваших серверах" },
        {
          title: "Локальная обработка",
          description: "AI-модели, запросы и результаты остаются внутри вашего контура.",
        },
        {
          title: "Интеграция с системами",
          description: "Подключение к внутренним базам и корпоративным сервисам.",
        },
        {
          title: "Аудит, логи и соответствие",
          description: "Соответствие требованиям национального регулятора.",
        },
      ],
      partnerTitle: "Стратегический инфраструктурный партнер",
      partnerDescription:
        "Крупнейший локальный облачный провайдер. Платформа и инфраструктура в одном пакете.",
    },
    footer: {
      contacts: "Контакты Century",
      team: "Команда Century",
      home: "Главная Century",
      tagline: "Корпоративная ИИ-платформа будущего",
    },
  },
  en: {
    navigation: {
      items: ["Platform", "Use cases", "Modes", "Security"],
      contact: "Contact us",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      aria: "Main navigation",
    },
    hero: {
      lineOne: "Business",
      lineTwo: "of tomorrow",
    },
    platform: {
      eyebrow: "Platform architecture · interactive",
      titleOne: "One entry point",
      titleTwo: "for enterprise AI",
      hint: "Choose a layer — row or plate",
      tabsLabel: "Century architecture layers",
      layerLabel: "Layer",
      showLayer: "Show layer",
      activeLayer: "Active layer",
      layers: [
        { title: "AI consumers", description: "Teams · Systems · Digital products" },
        { title: "Century — entry point", description: "Chat · Builder · API" },
        { title: "Guardrails", description: "Security · Data · Compliance · Scale" },
        { title: "Platform foundation", description: "Models · Data · Infrastructure" },
        { title: "Protected environment", description: "On-prem · VPC · Private cloud" },
      ],
    },
    casesIntro: {
      eyebrow: "CENTURY / PLATFORM",
      titleOne: "AI that",
      titleTwo: "delivers",
      description: "Five real use cases where the platform turns models into business outcomes",
    },
    cases: {
      tabsLabel: "Century use cases",
      effectsLabel: "Key outcomes",
      imageAlt: "Century interface",
      slides: [
        {
          title: "Unified analytics",
          lead: "We bring customer data from every source into one transparent profile.",
          body: "Conversations, payments, support requests and digital behavior come together in one profile. The business can see funnel bottlenecks, identify what to optimize and make decisions based on data.",
          tags: ["ROI BY CHANNEL", "CHURN POINTS", "BUDGET DECISIONS"],
        },
        {
          title: "Conversational AI",
          lead: "Customers and employees get answers without queues or waiting.",
          body: "AI handles requests around the clock, answers common questions, creates tickets and escalates complex cases to a person. Support teams leave routine work behind and step in where expertise matters.",
          tags: ["24/7 FIRST LINE", "SMART ESCALATION", "AUTO-RESOLUTION"],
        },
        {
          title: "Company memory",
          lead: "Ask in your own words and get an exact answer linked to the source document.",
          body: "Policies, instructions, contracts and correspondence are available through one search. New hires get up to speed in days instead of months, while expertise stays inside the company.",
          tags: ["SOURCE-LINKED ANSWERS", "ONBOARDING IN DAYS", "SINGLE SOURCE OF TRUTH"],
        },
        {
          title: "Talk to your data",
          lead: "A plain-language question becomes an exact answer and a ready dashboard.",
          body: "Call scores, objection summaries, CRM data and next-best actions arrive in chat as numbers and dashboards. Leaders see deal scoring, forecasts and churn risk.",
          tags: ["DEAL SCORING", "EXECUTIVE FORECASTS", "CHURN RISK & LTV"],
        },
        {
          title: "AI under control",
          lead: "Every request is visible: who asked, which model ran, and what it cost.",
          body: "Request logging, role-based access, leakage and prompt-injection protection, and on-premise deployment keep AI governed. You control what it can do and pass audits without surprises.",
          tags: ["ROLE-BASED ACCESS", "ON-PREMISE", "COST PER REQUEST"],
        },
      ],
    },
    modes: {
      title: "Five ways to work with AI",
      description: "Choose a mode to see how it works and what it delivers for the business.",
      tabsLabel: "AI operating modes",
      items: [
        {
          title: "Chat",
          badge: "up to 90% of routine tasks",
          description:
            "An internal chat where every employee works with an AI assistant. Documents and knowledge bases remain accessible without leaking outside the company perimeter.",
        },
        {
          title: "Agentic Automation Workflow",
          badge: "end-to-end automation",
          description:
            "AI agents complete multi-step tasks: they plan, make decisions and act in your systems under human supervision.",
        },
        {
          title: "Robotic Process Automation",
          badge: "operations automation",
          description:
            "Software robots move data, complete forms and reconcile records using clear rules, without replacing existing systems.",
        },
        {
          title: "Text-to-SQL",
          badge: "AI-powered processes",
          description:
            "A plain-language request becomes SQL, a dataset and an explainable answer without analyst queues or manual reporting.",
        },
        {
          title: "Human-only",
          badge: "human responsibility zone",
          description:
            "Where judgment, empathy and personal responsibility matter, the decision stays with a person while AI handles the routine.",
        },
      ],
    },
    security: {
      title: "Security",
      descriptionPrefix: "becomes part of your IT environment — without moving",
      descriptionSuffix: "critical processes outside the controlled perimeter.",
      features: [
        { title: "Deployment", description: "An isolated instance on your infrastructure" },
        {
          title: "Local processing",
          description: "AI models, requests and results stay inside your environment.",
        },
        {
          title: "System integration",
          description: "Connections to internal databases and enterprise services.",
        },
        {
          title: "Audit, logs and compliance",
          description: "Compliance with national regulatory requirements.",
        },
      ],
      partnerTitle: "Strategic infrastructure partner",
      partnerDescription:
        "The leading local cloud provider. Platform and infrastructure in one package.",
    },
    footer: {
      contacts: "Century contacts",
      team: "Century team",
      home: "Century home",
      tagline: "The enterprise AI platform for tomorrow",
    },
  },
} as const;
