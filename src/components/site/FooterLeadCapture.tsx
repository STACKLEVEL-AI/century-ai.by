"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/site/LanguageProvider";
import { CONTACT_EMAIL, TELEGRAM_HANDLE } from "@/lib/site";
import { homeCopy } from "@/lib/home-i18n";

const contactLinks = [
  {
    href: `mailto:${CONTACT_EMAIL}`,
    label: CONTACT_EMAIL,
    iconSrc: "/footer-image/icon/Mail.svg",
    iconAlt: "Email",
  },
  {
    href: `https://t.me/${TELEGRAM_HANDLE}`,
    label: "Telegram",
    iconSrc: "/footer-image/icon/telegram.svg",
    iconAlt: "Telegram",
    external: true,
  },
];

const teamMembers = [
  {
    src: "/footer-image/vitali-bw.webp",
    alt: "Vitali",
    href: "https://www.linkedin.com/in/vbakhmat/",
    objectPosition: "50% 50%",
    scale: 1.36,
    translateX: -4,
    translateY: 12,
  },
  {
    src: "/footer-image/vadim-bw.webp",
    alt: "Vadim",
    href: "https://www.linkedin.com/in/vadimohka/",
    objectPosition: "50% 30%",
    scale: 1.1,
    translateX: 3,
    translateY: -1,
  },
  {
    src: "/footer-image/egor-bw.webp",
    alt: "Egor",
    href: "https://www.linkedin.com/in/ekrychev/",
    objectPosition: "50% 50%",
    scale: 1.15,
    translateX: 0,
    translateY: 0,
  },
];

export default function FooterLeadCapture() {
  const { locale } = useLanguage();
  const copy = homeCopy[locale].footer;

  return (
    <footer
      id="contacts"
      className="site-footer site-footer--lead border-b border-[#9B9B9B80] bg-white text-black"
    >
      <section className="site-footer__surface overflow-hidden bg-white" aria-labelledby="footer-contacts-title">
        <div className="footer-lead__shell shell max-w-[1440px] px-5 py-[clamp(34px,7vw,100px)] sm:px-8 lg:px-[100px]">
          <div className="footer-lead__contacts" aria-label={copy.contacts}>
            <h2 id="footer-contacts-title" className="sr-only">{copy.contacts}</h2>
            <div className="footer-lead__team" aria-label={copy.team}>
              {teamMembers.map(({ src, alt, href, objectPosition, scale, translateX, translateY }) => (
                <a
                  key={src}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`LinkedIn: ${alt}`}
                  className="footer-team-photo-frame relative h-[clamp(64px,5vw,80px)] w-[clamp(64px,5vw,80px)] shrink-0 overflow-hidden rounded-[18px] border border-[#d3d3d8] bg-[#d8d8dc] shadow-[0_4px_10px_rgba(19,21,27,0.08)]"
                >
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(max-width: 720px) 120px, 160px"
                    className="footer-team-photo object-cover"
                    style={{
                      objectPosition,
                      transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                      transformOrigin: "center",
                      filter: "grayscale(1) contrast(0.92)",
                    }}
                  />
                  <span aria-hidden="true" className="footer-team-photo-ring" />
                </a>
              ))}
            </div>

            <div className="footer-lead__links" aria-label={copy.contacts}>
              {contactLinks.map(({ href, label, iconSrc, iconAlt, external }) => (
                <a
                  key={href}
                  href={href}
                  className="footer-lead__link"
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                >
                  <span className="footer-lead__link-icon">
                    <Image className="block" src={iconSrc} alt={iconAlt} width={20} height={20} />
                  </span>
                  <span>{label}</span>
                </a>
              ))}
            </div>

            <div className="footer-lead__brand">
              <Link href="/#hero" aria-label={copy.home}>CENTURY</Link>
              <p>{copy.tagline}</p>
            </div>
          </div>
        </div>
      </section>
      <div className="footer-copyright">
        <div className="footer-copyright__inner shell max-w-[1440px] px-5 sm:px-8 lg:px-[100px]">
          <p>&copy; 2026 Century. {locale === "ru" ? "Все права защищены." : "All rights reserved."}</p>
        </div>
      </div>
    </footer>
  );
}
