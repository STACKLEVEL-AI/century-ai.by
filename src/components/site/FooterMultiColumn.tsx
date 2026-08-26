import Link from "next/link";
import { ArrowUpRight, Globe, Mail, Phone, Send } from "lucide-react";
import {
  COMPANY_NAME,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_RAW,
  TELEGRAM_HANDLE,
  footerMaterialLinks,
  footerProductLinks,
  siteNavigation,
} from "@/lib/site";

const footerQuickActions = [
  {
    href: `mailto:${CONTACT_EMAIL}`,
    label: "Написать",
    value: CONTACT_EMAIL,
    icon: Mail,
  },
  {
    href: `tel:${CONTACT_PHONE_RAW}`,
    label: "Позвонить",
    value: CONTACT_PHONE,
    icon: Phone,
  },
];

const footerContactLinks = [
  {
    href: `mailto:${CONTACT_EMAIL}`,
    eyebrow: "Email",
    value: CONTACT_EMAIL,
    icon: Mail,
  },
  {
    href: `tel:${CONTACT_PHONE_RAW}`,
    eyebrow: "Телефон",
    value: CONTACT_PHONE,
    icon: Phone,
  },
  {
    href: `https://t.me/${TELEGRAM_HANDLE}`,
    eyebrow: "Telegram",
    value: `@${TELEGRAM_HANDLE}`,
    icon: Send,
    external: true,
  },
  {
    href: "https://stacklevel.group/",
    eyebrow: "Stacklevel Group",
    value: "stacklevel.group",
    icon: Globe,
    external: true,
  },
];

const footerBadges = ["On-prem", "Air-gapped", "Workflow orchestration", "Security by design"];
const footerMediaSlots = ["01", "02", "03"];

export default function FooterMultiColumn() {
  const year = new Date().getFullYear();

  return (
    <footer id="contacts" className="site-footer">
      <section className="footer-refresh">
        <div className="shell footer-refresh__shell">
          <div className="footer-refresh__mast">
            <article className="footer-refresh__intro">
              <Link href="/#hero" className="footer-refresh__mark" aria-label="Century home">
                CENTURY
              </Link>
              <p className="footer-refresh__kicker">Платформа, workflow и команда внедрения</p>
              <h2 className="footer-refresh__title">
                Внедряем корпоративный ИИ в контуре, который выдерживает реальную
                эксплуатацию.
              </h2>
              <p className="footer-refresh__lead">
                Century соединяет платформу, оркестрацию сценариев и команду запуска для
                on-prem и air-gapped сред.
              </p>

              <div className="footer-refresh__actions">
                {footerQuickActions.map(({ href, icon: Icon, label, value }) => (
                  <a key={href} href={href} className="footer-refresh__action">
                    <span className="footer-refresh__action-icon">
                      <Icon size={18} />
                    </span>
                    <span className="footer-refresh__action-copy">
                      <span className="footer-refresh__action-label">{label}</span>
                      <span className="footer-refresh__action-value">{value}</span>
                    </span>
                  </a>
                ))}
              </div>

              <div className="footer-refresh__badges" aria-label="Century capabilities">
                {footerBadges.map((badge) => (
                  <span key={badge} className="footer-refresh__badge">
                    {badge}
                  </span>
                ))}
              </div>
            </article>

            <div className="footer-refresh__media" aria-hidden="true">
              {footerMediaSlots.map((slot, index) => (
                <div
                  key={slot}
                  className={`footer-refresh__slot${index === 0 ? " footer-refresh__slot--tall" : ""}`}
                >
                  <span>{slot}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="footer-refresh__columns">
            <nav className="footer-refresh__column" aria-label="Основные разделы">
              <p className="footer-refresh__column-title">Разделы</p>
              <div className="footer-refresh__link-list">
                {siteNavigation.map((item) => (
                  <Link key={item.href} href={item.href} className="footer-refresh__nav-link">
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            <nav className="footer-refresh__column" aria-label="Продукт Century">
              <p className="footer-refresh__column-title">Продукт</p>
              <div className="footer-refresh__link-list">
                {footerProductLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="footer-refresh__nav-link">
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            <nav className="footer-refresh__column" aria-label="Материалы Century">
              <p className="footer-refresh__column-title">Материалы</p>
              <div className="footer-refresh__link-list">
                {footerMaterialLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="footer-refresh__nav-link">
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            <article
              className="footer-refresh__column footer-refresh__column--contact"
              aria-label="Контакты Century"
            >
              <p className="footer-refresh__column-title">Контакты</p>
              <div className="footer-refresh__contact-list">
                {footerContactLinks.map(({ href, eyebrow, value, icon: Icon, external }) => (
                  <a
                    key={href}
                    href={href}
                    className="footer-refresh__contact-card"
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                  >
                    <span className="footer-refresh__contact-icon">
                      <Icon size={18} />
                    </span>
                    <span className="footer-refresh__contact-copy">
                      <span className="footer-refresh__contact-eyebrow">{eyebrow}</span>
                      <span className="footer-refresh__contact-value">{value}</span>
                    </span>
                    <ArrowUpRight size={16} className="footer-refresh__contact-arrow" />
                  </a>
                ))}
              </div>
            </article>
          </div>

          <div className="footer-refresh__bottom">
            <p>
              &copy; {year} Century by{" "}
              <a href="https://stacklevel.group/" target="_blank" rel="noopener noreferrer">
                {COMPANY_NAME}
              </a>
              .
            </p>

            <div className="footer-refresh__bottom-meta" aria-label="Century profile">
              <span>On-prem AI</span>
              <span>Workflow orchestration</span>
              <span>Security by design</span>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
