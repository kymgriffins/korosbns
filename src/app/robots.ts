import { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://budgetndiostory.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/learn/account/", "/api/", "/auth/", "/dashboard/", "/admin/"],
      },
      {
        userAgent: "bingbot",
        allow: "/",
        disallow: ["/learn/account/", "/api/", "/auth/", "/dashboard/", "/admin/"],
        crawlDelay: 1,
      },
      {
        userAgent: "MicrosoftStartApp",
        allow: "/",
        disallow: ["/learn/account/", "/api/", "/auth/", "/dashboard/", "/admin/"],
        crawlDelay: 1,
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Google-Extended"],
        allow: "/",
        disallow: ["/learn/account/", "/api/", "/auth/", "/dashboard/", "/admin/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
