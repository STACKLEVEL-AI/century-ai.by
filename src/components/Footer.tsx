"use client";

import Image from "next/image";
import { Mail, Phone, Globe, Send, Youtube } from "lucide-react";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_RAW, TELEGRAM_HANDLE } from "@/lib/site";
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <section>
        <div className="shell footer-grid">
          <article className="footer-brand">
            <a
              href="#home"
              className="footer-logo"
              aria-label="Century by Stacklevel Group"
            >
              <span className="footer-line">
                <Image
                  className="footer-stacklevel"
                  src="/assets/sl.png"
                  alt="Stacklevel Group logo"
                  width={277}
                  height={23}
                />
              </span>
            </a>
            Контуры внедрения ИИ для промышленной эксплуатации в корпорациях.
          </article>

          <article className="footer-col">
            <p className="footer-title">Контакты</p>
            <div className="footer-contacts">
              <a href="mailto:v.bakhmat@stacklevel.group" className="contact-link" rel="noopener noreferrer">
                <Mail size={16} />
                <span>
                  <strong>Email:</strong> {CONTACT_EMAIL}
                </span>
              </a>

              <a href={`tel:${CONTACT_PHONE_RAW}`} className="contact-link">
                <Phone size={16} />
                <span>
                  <strong>Телефон:</strong> {CONTACT_PHONE}
                </span>
              </a>

              <a
                href="https://stacklevel.group"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                <Globe size={16} />
                <span>Перейти на сайт Stacklevel Group</span>
              </a>

              <a
                href={`tg://resolve?domain=${TELEGRAM_HANDLE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                <Send size={16} />
                <span>Написать в Telegram</span>
              </a>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="contact-link"
                rel="noopener noreferrer"
              >
                <Mail size={16} />
                <span>Написать на email</span>
              </a>

              <a
                href="https://www.youtube.com/@STACKLEVELGROUP"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                <Youtube size={16} />
                <span>Youtube</span>
              </a>
            </div>
          </article>

          <article className="footer-col">
            <p className="footer-title">QR-код</p>
            <div className="footer-qr">
              <Image
                src="/assets/qr-code.png"
                alt="QR code for Century contact"
                width={120}
                height={120}
                className="qr-image"
              />
            </div>
          </article>
        </div>

        <div className="footer-big-century">
          <Image
            src="/assets/CENTURY_White_H.png"
            alt="Century brand mark"
            width={0}
            height={0}
            className="century-image"
          />
        </div>

        <div className="shell footer-bottom">
          <p>
            &copy; {year} Century by{' '}
            <a
              href="https://stacklevel.group/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stacklevel Group
            </a>
            .
          </p>
        </div>
      </section>
    </footer>
  );
}
