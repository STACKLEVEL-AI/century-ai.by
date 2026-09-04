import type { Metadata } from "next";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = (configuredSiteUrl || "https://century-ai.by").replace(/\/$/, "");
export const REGION = "BY";
export const HTML_LANG = "ru-BY";
export const OG_LOCALE = "ru_BY";
export const ALTERNATE_SITE_URL = "https://century-ai.ru";
export const SITE_NAME = "Century";
export const SITE_TAGLINE = "Платформа управляемого внедрения корпоративного ИИ";
export const COMPANY_NAME = "Stacklevel Group";
export const CONTACT_EMAIL = "v.bakhmat@stacklevel.group";
export const CONTACT_PHONE = "+375 (29) 668-21-27";
export const CONTACT_PHONE_RAW = "+375296682127";
export const TELEGRAM_HANDLE = "vitalibakhmat";
export const OG_IMAGE_PATH = "/og/century-ai-preview.png";

export type NavItem = {
  href: string;
  label: string;
  sectionId?: string;
};

export const siteNavigation: NavItem[] = [
  { href: "/#platform", label: "Платформа", sectionId: "platform" },
  { href: "/#cases", label: "Кейсы", sectionId: "cases" },
  { href: "/#modes", label: "Режимы", sectionId: "modes" },
  { href: "/#security", label: "Безопасность", sectionId: "security" },
];

export const footerProductLinks = [
  { href: "/platform", label: "Платформа" },
  { href: "/workflow", label: "Workflow" },
  { href: "/services", label: "Сервисы" },
  { href: "/assistants", label: "Ассистенты" },
  { href: "/observability", label: "Метрики" },
];

export const footerMaterialLinks = [
  { href: "/cases", label: "Кейсы" },
  { href: "/security", label: "Безопасность" },
  { href: "/pricing", label: "Стоимость" },
];

const COMMON_KEYWORDS = [
  "century ai",
  "платформа корпоративного ии",
  "корпоративная платформа ии",
  "enterprise ai platform",
  "on-prem ai",
  "air-gapped ai",
  "workflow orchestration",
  "метрики и наблюдаемость ии",
  "многоагентные системы",
  "корпоративные ассистенты",
  "workflow для llm",
  "журнал исполнения ai",
];

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function canonicalPath(path: string) {
  if (path === "/") {
    return path;
  }

  return path.endsWith("/") ? path : `${path}/`;
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
}: MetadataInput): Metadata {
  const normalizedPath = canonicalPath(path);
  const fullTitle = normalizedPath === "/" ? title : `${title} | ${SITE_NAME}`;
  const url = absoluteUrl(normalizedPath);

  return {
    title: fullTitle,
    description,
    keywords: [...COMMON_KEYWORDS, ...keywords],
    alternates: {
      canonical: normalizedPath,
      languages: {
        "ru-BY": absoluteUrl(normalizedPath),
        "ru-RU": `${ALTERNATE_SITE_URL}${normalizedPath}`,
      },
    },
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
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: OG_LOCALE,
      images: [
        {
          url: absoluteUrl(OG_IMAGE_PATH),
          width: 1200,
          height: 630,
          alt: fullTitle,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteUrl(OG_IMAGE_PATH)],
    },
  };
}
