import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ui.zerorapid.in";
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/dashboard", "/studio", "/docs/", "/r/", "/registry/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
