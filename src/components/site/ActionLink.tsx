"use client";

import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "text";
  className?: string;
  trackingLabel?: string;
  trackingContext?: string;
  ariaLabel?: string;
  target?: string;
  rel?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackCtaClick(label: string, context?: string, href?: string) {
  if (typeof window === "undefined") {
    return;
  }

  const payload = {
    event: "century_cta",
    label,
    context,
    href,
    path: window.location.pathname,
  };

  window.dataLayer?.push(payload);
  window.gtag?.("event", "century_cta", payload);
  window.dispatchEvent(new CustomEvent("century:cta", { detail: payload }));
}

function getClassName(variant: ActionLinkProps["variant"], className?: string) {
  return ["action-link", variant ? `action-link--${variant}` : "", className]
    .filter(Boolean)
    .join(" ");
}

function isExternal(href: string) {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("tg://")
  );
}

export function ActionLink({
  href,
  children,
  variant = "primary",
  className,
  trackingLabel,
  trackingContext,
  ariaLabel,
  target,
  rel,
  onClick,
}: ActionLinkProps) {
  const classes = getClassName(variant, className);

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (trackingLabel) {
      trackCtaClick(trackingLabel, trackingContext, href);
    }
    onClick?.(event);
  };

  if (isExternal(href)) {
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        target={target}
        rel={rel}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} aria-label={ariaLabel} onClick={handleClick}>
      {children}
    </Link>
  );
}
