import {
  NarrativeBand,
  PageHero,
  PreviewBoard,
  SecurityGovernanceAccordion,
} from "@/components/site/Sections";
import { SITE_URL, absoluteUrl, createPageMetadata } from "@/lib/site";
import { securityFaqs } from "@/lib/site-content";

const securityBlocks = [
  {
    title: "Ролевые границы",
    text: "Каждый сценарий строится вокруг корпоративной модели доступа и ролевых ограничений пользователя.",
  },
  {
    title: "Ответы с учетом доступа",
    text: "Ответ, цитаты и маршрут построения результата учитывают разрешенный пользователю контур знаний, документов и данных.",
  },
  {
    title: "Журнал исполнения",
    text: "Century сохраняет ключевые события запроса, сценария, источников, промежуточных шагов и финального результата.",
  },
  {
    title: "Проверяемость результата",
    text: "Ответ связан с источником, маршрутом исполнения и контекстом обработки, поэтому пригоден к последующей проверке.",
  },
  {
    title: "Контролируемый выпуск",
    text: "Для критичных сценариев можно встроить контрольные точки и ручную проверку перед выпуском результата.",
  },
  {
    title: "Готовность к сопровождению",
    text: "Команда эксплуатации получает логи, метрики, проблемные зоны исполнения и инструменты для разбора поведения системы.",
  },
];

export const metadata = createPageMetadata({
  title: "Безопасность и управление",
  description:
    "Безопасность Century: ролевые границы, аудит, журнал исполнения, проверяемость результата и контролируемый выпуск для промышленной эксплуатации.",
  path: "/security",
});

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/security/#faq`,
  url: absoluteUrl("/security/"),
  inLanguage: "ru-RU",
  mainEntity: securityFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function SecurityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <PageHero
        eyebrow="Безопасность"
        title="Безопасность, аудит и допуск к промышленной эксплуатации"
        description="Century спроектирован для корпоративного контура, где важны права доступа, проверяемость результата, журнал исполнения и управляемый выпуск сценариев в рабочую среду."
        badges={["Ролевые границы", "Аудит и журнал исполнения", "Контролируемый выпуск", "Готовность к сопровождению"]}
        actions={[
          {
            href: "/demo",
            label: "Запросить демо",
            variant: "primary",
            trackingLabel: "security_demo",
          },
          {
            href: "/platform",
            label: "Открыть платформу",
            variant: "secondary",
            trackingLabel: "security_platform",
          },
        ]}
      >
        <PreviewBoard
          eyebrow="Контроль"
          title="Контур контроля"
          items={[
            "Ролевые границы",
            "Ответы с учетом доступа",
            "Журнал исполнения",
            "Проверяемость результата",
            "Контролируемый выпуск",
            "Готовность к сопровождению",
          ]}
          footer="Century проектируется так, чтобы AI-процесс был пригоден к проверке и сопровождению."
        />
      </PageHero>

      <SecurityGovernanceAccordion
        snapBehavior="after-content"
        title="Безопасность и контроль по умолчанию"
        description="Безопасность в Century встроена в продукт. Права доступа, источники данных, журнал исполнения, контрольные точки и метрики работают внутри платформы, поэтому сценарии можно не только запускать, но и проверять, сопровождать и постепенно выводить в промышленную эксплуатацию."
        cards={securityBlocks}
        faqs={securityFaqs}
      />

      <NarrativeBand
        title="Безопасность — часть продукта, а не внешний слой"
        description="В Century права доступа, аудит, контрольные шаги и наблюдаемость встроены в саму платформу. Это позволяет запускать AI-сценарии в корпоративном контуре осознанно и с контролем на каждом этапе."
      />
    </>
  );
}
