import { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://app.budgetndiostory.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/learn/account/", "/api/", "/auth/"],
      },
      {
        userAgent: "bingbot",
        allow: "/",
        disallow: ["/learn/account/", "/api/", "/auth/"],
        crawlDelay: 1,
      },
      {
        userAgent: "MicrosoftStartApp",
        allow: "/",
        disallow: ["/learn/account/", "/api/", "/auth/"],
        crawlDelay: 1,
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        disallow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
