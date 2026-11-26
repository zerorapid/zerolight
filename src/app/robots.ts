import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bricks.zerorapid.in";
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
