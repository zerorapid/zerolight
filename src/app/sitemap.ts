import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ui.zerorapid.in";
  const routes = [
    "",
    "/dashboard",
    "/studio",
    "/docs/atoms",
    "/docs/molecules",
    "/docs/organisms",
    "/docs/templates",
    "/docs/pages",
  ];
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === "" || route === "/dashboard" ? "weekly" : "monthly",
    priority: route === "" || route === "/dashboard" ? 1 : 0.8,
  }));
}
