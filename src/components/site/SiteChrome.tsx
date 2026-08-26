import type { ReactNode } from "react";
import SectionNavigator from "@/components/SectionNavigator";
import SectionRevealController from "@/components/site/SectionRevealController";
import ScrollSnapController from "@/components/site/ScrollSnapController";
import StickyHeader from "@/components/site/StickyHeader";
import FooterLeadCapture from "@/components/site/FooterLeadCapture";
import LanguageProvider from "@/components/site/LanguageProvider";

type SiteChromeProps = {
  children: ReactNode;
};

export default function SiteChrome({ children }: SiteChromeProps) {
  return (
    <LanguageProvider>
      <div className="site-root">
        <div className="grid-overlay" aria-hidden="true" />
        <ScrollSnapController />
        <SectionRevealController />
        <StickyHeader />
        <SectionNavigator />
        <div className="site-root__content">{children}</div>
        <FooterLeadCapture />
      </div>
    </LanguageProvider>
  );
}
