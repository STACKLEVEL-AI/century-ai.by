"use client";

import { useEffect } from "react";

export default function HomeScrollController() {
  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    if (!window.location.hash) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  return null;
}
