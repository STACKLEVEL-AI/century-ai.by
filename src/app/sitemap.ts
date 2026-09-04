import type { MetadataRoute } from "next";
import { SITE_URL, canonicalPath } from "@/lib/site";

export const dynamic = "force-static";
const routes = [
  { path: "/", priority: 1 },
  { path: "/platform", priority: 0.9 },
  { path: "/workflow", priority: 0.9 },
  { path: "/services", priority: 0.88 },
  { path: "/assistants", priority: 0.88 },
  { path: "/security", priority: 0.88 },
  { path: "/observability", priority: 0.88 },
  { path: "/cases", priority: 0.84 },
  { path: "/pricing", priority: 0.82 },
  { path: "/demo", priority: 0.82 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: absoluteUrl(canonicalPath(route.path)),
    changeFrequency: "weekly",
    priority: route.priority,
  }));
}

function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}
