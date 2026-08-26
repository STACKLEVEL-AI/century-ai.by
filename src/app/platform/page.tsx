import {
  DeploymentModeCards,
  FeatureGridSection,
  FinalCtaBlock,
  LayerStackSection,
  PageHero,
  PreviewBoard,
} from "@/components/site/Sections";
import { createPageMetadata } from "@/lib/site";
import { commercialContent, deploymentModes, finalCtaContent } from "@/lib/site-content";

const architectureLayers = [
  {
    label: "СЛОЙ 1",
    title: "Пользователи и интерфейсы",
    text: "Рабочие пространства пользователей, прикладные интерфейсы, каналы взаимодействия и точки доступа к корпоративным ИИ-сервисам.",
  },
  {
    label: "СЛОЙ 2",
    title: "Ассистенты и многошаговые сценарии",
    text: "Пользовательские ассистенты и многоагентные сценарии, в которых роль, задача и маршрут исполнения управляются как часть платформы.",
  },
  {
    label: "СЛОЙ 3",
    title: "Workflow и сервисные модули",
    text: "Workflow, готовые сервисы обработки, контрольные точки, ручная проверка и управляемое исполнение для сложных сценариев.",
  },
  {
    label: "СЛОЙ 4",
    title: "Знания, документы, файлы и базы данных",
    text: "Корпоративные источники работают как часть рабочего контура платформы, а не как внешняя интеграция вокруг чата.",
  },
  {
    label: "СЛОЙ 5",
    title: "Управление, безопасность, метрики и администрирование",
    text: "Роли, аудит, журнал исполнения, эксплуатационные метрики, стоимость, конфигурация сервисов и административная панель.",
  },
];

const productCards = [
  {
    title: "Пользовательский контур",
    text: "Интерфейсы доступа к ассистентам, сценариям и рабочим сервисам под конкретные подразделения и роли.",
  },
  {
    title: "Рабочий слой исполнения",
    text: "Workflow и runtime, где маршрут результата строится как воспроизводимый управляемый сценарий.",
  },
  {
    title: "Сервисный каталог",
    text: "Готовые сервисы обработки, которые встраиваются в сценарии как штатные модули платформы.",
  },
  {
    title: "Контроль и управление",
    text: "Ролевые границы, контрольные проверки, журнал исполнения и контроль пригодности сценария к реальному использованию.",
  },
  {
    title: "Метрики и наблюдаемость",
    text: "Токены, стоимость, нагрузка по моделям, история использования и журнал исполнения как часть продукта.",
  },
  {
    title: "Administrative layer",
    text: "Панель управления пользователями, сценариями, сервисами, конфигурацией и масштабированием портфеля сценариев.",
  },
];

export const metadata = createPageMetadata({
  title: "Платформа и архитектура",
  description:
    "Архитектура Century как единой среды управляемого внедрения ИИ: пользователи, ассистенты, workflow, знания, сервисы, аудит и метрики.",
  path: "/platform",
});

export default function PlatformPage() {
  return (
    <>
      <PageHero
        eyebrow="Платформа"
        title="Century как единая среда управляемого внедрения ИИ"
        description="Вместо узкого RAG-лендинга Century показывает полную архитектуру корпоративной платформы: интерфейсы, ассистенты, workflow, сервисы, знания, аудит и метрики."
        badges={["Ассистенты", "Workflow", "Сервисный каталог", "Контроль доступа", "Метрики"]}
        actions={[
          {
            href: "/demo",
            label: "Запросить демо",
            variant: "primary",
            trackingLabel: "platform_demo",
          },
          {
            href: "/workflow",
            label: "Открыть Workflow",
            variant: "secondary",
            trackingLabel: "platform_workflow",
          },
        ]}
      >
        <PreviewBoard
          eyebrow="5 слоев"
          title="Архитектурная рамка"
          items={[
            "Пользователи и интерфейсы",
            "Ассистенты и многошаговые сценарии",
            "Workflow и сервисные модули",
            "Знания, документы, файлы и базы данных",
            "Безопасность, метрики и администрирование",
          ]}
          footer="Century собирает корпоративный ИИ как продуктовую систему, а не как набор точечных интеграций."
        />
      </PageHero>

      <LayerStackSection
        title="Пятислойная архитектура платформы"
        description="Каждый слой отвечает не только за генерацию ответа, но и за управляемое исполнение, доступность к сопровождению и допуск к корпоративной эксплуатации."
        layers={architectureLayers}
      />

      <FeatureGridSection
        title="Что получает заказчик как продукт"
        description="Century упакован как готовая платформа для перехода от первого сценария к портфелю корпоративных решений."
        cards={productCards}
        columns="three"
      />

      <DeploymentModeCards {...deploymentModes} />

      <FinalCtaBlock
        {...finalCtaContent}
        introTitle={commercialContent.title}
        introDescription={commercialContent.description}
        introCards={commercialContent.cards}
        introNote={commercialContent.note}
      />
    </>
  );
}
