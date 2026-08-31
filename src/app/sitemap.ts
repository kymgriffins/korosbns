import { MetadataRoute } from "next";
import { citizenApi } from "@/lib/api-client";
import { learningData } from "@/data/learning";
import { team } from "@/data/org";
import { slugifyName } from "@/lib/team";
import { canonicalUrl } from "@/utils/metadata";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    { path: "", priority: 1.0, frequency: "weekly" as const },
    { path: "/about", priority: 0.8, frequency: "monthly" as const },
    { path: "/faq", priority: 0.7, frequency: "monthly" as const },
    { path: "/contact", priority: 0.5, frequency: "monthly" as const },
    { path: "/privacy", priority: 0.3, frequency: "yearly" as const },
    { path: "/terms", priority: 0.3, frequency: "yearly" as const },
    { path: "/learn", priority: 0.9, frequency: "weekly" as const },
    { path: "/reports", priority: 0.9, frequency: "weekly" as const },
    { path: "/budgetnews", priority: 0.9, frequency: "weekly" as const },
    { path: "/learn/articles", priority: 0.7, frequency: "weekly" as const },
    { path: "/learn/stories", priority: 0.7, frequency: "weekly" as const },
    { path: "/learn/videos", priority: 0.7, frequency: "weekly" as const },
    { path: "/learn/documents", priority: 0.7, frequency: "weekly" as const },
    { path: "/events", priority: 0.8, frequency: "weekly" as const },
    { path: "/surveys", priority: 0.6, frequency: "weekly" as const },
    { path: "/insights", priority: 0.8, frequency: "weekly" as const },
    { path: "/programmes", priority: 0.9, frequency: "monthly" as const },
    { path: "/programmes/connect", priority: 0.8, frequency: "monthly" as const },
    { path: "/programmes/mashinani", priority: 0.8, frequency: "monthly" as const },
    { path: "/programmes/wanahabari-lab", priority: 0.8, frequency: "monthly" as const },
    { path: "/bns-project", priority: 0.6, frequency: "monthly" as const },
    { path: "/bns-studio", priority: 0.7, frequency: "monthly" as const },
    { path: "/analytics", priority: 0.6, frequency: "weekly" as const },
    { path: "/security", priority: 0.5, frequency: "monthly" as const },
    { path: "/weekly-notes", priority: 0.7, frequency: "weekly" as const },
    { path: "/weekly-notes/manage", priority: 0.3, frequency: "monthly" as const },
    { path: "/weekly-notes/audit", priority: 0.3, frequency: "monthly" as const },
    { path: "/security", priority: 0.4, frequency: "yearly" as const },
    { path: "/analytics", priority: 0.5, frequency: "weekly" as const },
    { path: "/bns-project", priority: 0.6, frequency: "monthly" as const },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: canonicalUrl(route.path),
    lastModified: new Date(),
    changeFrequency: route.frequency,
    priority: route.priority,
  }));

  // Add static team profile pages from constants
  try {
    team.forEach((member) => {
      sitemapEntries.push({
        url: canonicalUrl(`/team/${slugifyName(member.name)}`),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    });
  } catch (err) {
    console.error("Sitemap: Failed to load team paths", err);
  }

  // Add dynamic articles from CMS
  try {
    const articlesRes = await citizenApi.getArticles();
    if (articlesRes && Array.isArray(articlesRes.results)) {
      articlesRes.results.forEach((article: any) => {
        if (article.slug) {
          sitemapEntries.push({
            url: canonicalUrl(`/learn/${article.slug}`),
            lastModified: article.published_at ? new Date(article.published_at) : new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }
      });
    }
  } catch (err) {
    console.error("Sitemap: Failed to fetch articles from API", err);
  }

  // Add dynamic stories from CMS
  try {
    const storiesRes = await citizenApi.getStories();
    if (storiesRes && Array.isArray(storiesRes.results)) {
      storiesRes.results.forEach((story: any) => {
        const slug = story.slug || story.id;
        if (slug) {
          sitemapEntries.push({
            url: canonicalUrl(`/learn/${slug}`),
            lastModified: story.published_at ? new Date(story.published_at) : new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }
      });
    }
  } catch (err) {
    console.error("Sitemap: Failed to fetch stories from API", err);
  }

  // Civic learning modules (API only — never invent placeholder slugs)
  try {
    const modules = await learningData.modules.fetch();
    for (const mod of modules) {
      if (!mod?.slug) continue;
      sitemapEntries.push({
        url: canonicalUrl(`/learn/modules/${mod.slug}`),
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.85,
      });
    }
  } catch (err) {
    console.error("Sitemap: Failed to fetch civic modules from API", err);
  }

  // Verified Report Dossiers (P0 SEO - National Budget & Focus Counties)
  try {
    const { getAllReports } = await import("@/data/reports-bulletin");
    const reports = getAllReports();
    reports.forEach((report) => {
      if (report.slug) {
        sitemapEntries.push({
          url: canonicalUrl(`/reports/${report.slug}`),
          lastModified: report.updatedDate ? new Date(report.updatedDate) : new Date(),
          changeFrequency: "weekly",
          priority: 0.9,
        });
      }
    });
  } catch (err) {
    console.error("Sitemap: Failed to load report dossiers", err);
  }

  return sitemapEntries;
}

