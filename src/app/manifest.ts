import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Century — платформа корпоративного ИИ",
    short_name: "Century",
    description: "Платформа управляемого внедрения корпоративного ИИ.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0b1020",
    lang: "ru-BY",
    icons: [
      {
        src: "/favicon.png",
        sizes: "447x460",
        type: "image/png",
      },
    ],
  };
}
