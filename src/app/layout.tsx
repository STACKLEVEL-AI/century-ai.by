import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import SiteChrome from "@/components/site/SiteChrome";
import {
  COMPANY_NAME,
  CONTACT_EMAIL,
  CONTACT_PHONE_RAW,
  HTML_LANG,
  OG_LOCALE,
  OG_IMAGE_PATH,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  TELEGRAM_HANDLE,
  absoluteUrl,
} from "@/lib/site";
import "./globals.css";

const lato = localFont({
  src: [
    {
      path: "./fonts/Lato-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Lato-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Lato-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Lato-Semibold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Lato-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Lato-Heavy.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/Lato-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Century — платформа управляемого внедрения корпоративного ИИ",
  description:
    "Century — платформа управляемого внедрения корпоративного ИИ: ассистенты, многошаговые сценарии, workflow, сервисный каталог, аудит и метрики в on-prem, air-gapped или hybrid-контуре.",
  applicationName: SITE_NAME,
  keywords: [
    "century ai",
    "платформа корпоративного ии",
    "enterprise ai platform",
    "on-prem ai",
    "air-gapped ai",
    "workflow orchestration",
    "метрики и наблюдаемость ии",
  ],
  authors: [{ name: COMPANY_NAME, url: "https://stacklevel.group" }],
  creator: COMPANY_NAME,
  publisher: COMPANY_NAME,
  category: "enterprise ai",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: ["/favicon.png"],
    apple: [{ url: "/favicon.png" }],
  },
  openGraph: {
    title: "Century — платформа управляемого внедрения корпоративного ИИ",
    description:
      "Платформа управляемого внедрения корпоративного ИИ: workflow, готовые сервисы, ассистенты, журнал исполнения и эксплуатационные метрики.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: OG_LOCALE,
    type: "website",
    images: [
      {
        url: absoluteUrl(OG_IMAGE_PATH),
        width: 1200,
        height: 630,
        alt: "Century — платформа управляемого внедрения корпоративного ИИ",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Century — платформа управляемого внедрения корпоративного ИИ",
    description:
      "Workflow, сервисный каталог, ассистенты, аудит и метрики для корпоративного AI-контура.",
    images: [absoluteUrl(OG_IMAGE_PATH)],
  },
  verification: {
    google: "pBlkUcnfTMSv0TeXGTpljTtBNWriJn5rCg3CwrzZZkc",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1020",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: COMPANY_NAME,
      url: "https://stacklevel.group",
      email: CONTACT_EMAIL,
      telephone: CONTACT_PHONE_RAW,
      sameAs: ["https://stacklevel.group/", `https://t.me/${TELEGRAM_HANDLE}`],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: CONTACT_EMAIL,
        telephone: CONTACT_PHONE_RAW,
        availableLanguage: ["ru"],
        url: absoluteUrl("/demo/"),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: absoluteUrl("/"),
      name: SITE_NAME,
      inLanguage: HTML_LANG,
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      mainEntity: {
        "@id": `${SITE_URL}/#software-application`,
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software-application`,
      name: SITE_NAME,
      description:
        "Платформа управляемого внедрения ИИ: ассистенты, workflow, готовые сервисы, аудит, метрики и управляемое исполнение.",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Enterprise AI platform",
      operatingSystem: "Web, on-premises infrastructure",
      provider: {
        "@id": `${SITE_URL}/#organization`,
      },
      slogan: SITE_TAGLINE,
      url: absoluteUrl("/"),
      image: absoluteUrl(OG_IMAGE_PATH),
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/#main-pages`,
      name: "Основные разделы Century",
      itemListElement: [
        ["Платформа", "/platform/"],
        ["Workflow", "/workflow/"],
        ["Сервисы", "/services/"],
        ["Ассистенты", "/assistants/"],
        ["Безопасность", "/security/"],
        ["Метрики и наблюдаемость", "/observability/"],
        ["Кейсы", "/cases/"],
        ["Стоимость и запуск", "/pricing/"],
        ["Запросить демо", "/demo/"],
      ].map(([name, path], position) => ({
        "@type": "ListItem",
        position: position + 1,
        name,
        url: absoluteUrl(path),
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={HTML_LANG} className={lato.variable}>
      <body>
        <SiteChrome>{children}</SiteChrome>
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=111762786', 'ym');

            ym(111762786, 'init', {ssr:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
          `}
        </Script>
        <noscript>
          <div>
            {/* The tracking fallback must remain a plain image for browsers without JavaScript. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://mc.yandex.ru/watch/111762786" style={{ position: "absolute", left: "-9999px" }} alt="" />
          </div>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
