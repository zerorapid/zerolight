import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bricks.zerorapid.in";
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/docs/", "/r/", "/registry/", "/llms.txt"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
