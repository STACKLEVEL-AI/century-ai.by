import AiModesSection from "@/components/century-home/AiModesSection";
import CasesIntroSection from "@/components/century-home/CasesIntroSection";
import CenturySection from "@/components/century-home/CenturySection";
import HeroSection from "@/components/century-home/HeroSection";
import HomeScrollController from "@/components/century-home/HomeScrollController";
import SecurityFeatureBlock from "@/components/century-home/SecurityFeatureBlock";
import SecuritySection from "@/components/century-home/SecuritySection";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Century — платформа управляемого внедрения корпоративного ИИ",
  description:
    "Century показывает корпоративный ИИ как единую платформу: ассистенты, многошаговые сценарии, workflow, сервисный каталог, аудит и метрики в закрытом контуре.",
  path: "/",
});

export default function Home() {
  return (
    <main className="century-home-page min-h-screen bg-white text-[var(--color-ink)]">
      <HomeScrollController />
      <HeroSection />
      <SecuritySection />
      <CasesIntroSection />
      <CenturySection />
      <AiModesSection />
      <SecurityFeatureBlock />
    </main>
  );
}
