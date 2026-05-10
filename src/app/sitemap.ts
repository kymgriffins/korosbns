import { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://app.budgetndiostory.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/learn",
    "/about",
    "/impact",
    "/media",
    "/partners",
    "/research",
    "/tasks",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/learn" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/learn" ? 0.9 : 0.7,
  }));
}
