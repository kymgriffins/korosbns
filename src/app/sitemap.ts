import { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://app.budgetndiostory.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1.0, frequency: "weekly" as const },
    { path: "/about", priority: 0.8, frequency: "monthly" as const },
    { path: "/faq", priority: 0.7, frequency: "monthly" as const },
    { path: "/contact", priority: 0.5, frequency: "monthly" as const },
    { path: "/privacy", priority: 0.3, frequency: "yearly" as const },
    { path: "/terms", priority: 0.3, frequency: "yearly" as const },
    { path: "/learn", priority: 0.9, frequency: "weekly" as const },
    { path: "/learn/articles", priority: 0.7, frequency: "weekly" as const },
    { path: "/learn/stories", priority: 0.7, frequency: "weekly" as const },
    { path: "/learn/videos", priority: 0.7, frequency: "weekly" as const },
    { path: "/learn/documents", priority: 0.7, frequency: "weekly" as const },
    { path: "/learn/quests", priority: 0.6, frequency: "weekly" as const },
    { path: "/learn/profile", priority: 0.3, frequency: "monthly" as const },
    { path: "/events", priority: 0.8, frequency: "weekly" as const },
    { path: "/surveys", priority: 0.6, frequency: "weekly" as const },
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.frequency,
    priority: route.priority,
  }));
}
