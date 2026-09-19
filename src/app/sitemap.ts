import { MetadataRoute } from "next";

import { studiosEvidenceData } from "@/data/studios-evidence";
import { team } from "@/data/org";
import { slugifyName } from "@/lib/team";
import { canonicalUrl } from "@/utils/metadata";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    { path: "", priority: 1.0, frequency: "weekly" as const },
    { path: "/bns-studio", priority: 1.0, frequency: "weekly" as const },
    { path: "/bns-studio/about", priority: 0.85, frequency: "monthly" as const },
    { path: "/programmes", priority: 0.9, frequency: "monthly" as const },
    { path: "/programmes/connect", priority: 0.85, frequency: "monthly" as const },
    { path: "/programmes/mashinani", priority: 0.85, frequency: "monthly" as const },
    { path: "/programmes/wanahabari-lab", priority: 0.85, frequency: "monthly" as const },
    { path: "/programmes/studios", priority: 0.85, frequency: "monthly" as const },
    { path: "/projects", priority: 0.9, frequency: "weekly" as const },
    { path: "/about", priority: 0.85, frequency: "monthly" as const },
    { path: "/reports", priority: 0.9, frequency: "weekly" as const },
    { path: "/budgetnews", priority: 0.9, frequency: "weekly" as const },
    { path: "/events", priority: 0.8, frequency: "weekly" as const },
    { path: "/surveys", priority: 0.6, frequency: "weekly" as const },
    { path: "/faq", priority: 0.7, frequency: "monthly" as const },
    { path: "/help", priority: 0.8, frequency: "weekly" as const },
    { path: "/glossary", priority: 0.8, frequency: "weekly" as const },
    { path: "/contact", priority: 0.6, frequency: "monthly" as const },
    { path: "/privacy", priority: 0.3, frequency: "yearly" as const },
    { path: "/terms", priority: 0.3, frequency: "yearly" as const },
    { path: "/analytics", priority: 0.6, frequency: "weekly" as const },
    { path: "/security", priority: 0.5, frequency: "monthly" as const },
    { path: "/weekly-notes", priority: 0.7, frequency: "weekly" as const },
    { path: "/weekly-notes/manage", priority: 0.3, frequency: "monthly" as const },
    { path: "/weekly-notes/audit", priority: 0.3, frequency: "monthly" as const },
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

  // BNS Studios format corridors (P0 Commercial Discovery)
  const STUDIO_FORMATS = [
    "Podcast & Audio",
    "Animations",
    "Explainer Videos",
    "Research Spotlights",
    "Documentaries",
    "Social Media Series",
    "Town Hall Design & Facilitation",
    "Community Listening Sessions",
  ];

  STUDIO_FORMATS.forEach((format) => {
    sitemapEntries.push({
      url: canonicalUrl(`/bns-studio?format=${encodeURIComponent(format)}`),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  // BNS Studios project dossiers (P0 Commercial Case Studies)
  try {
    studiosEvidenceData.getAllProjects().forEach((project) => {
      sitemapEntries.push({
        url: canonicalUrl(`/bns-studio/${project.slug}`),
        lastModified: project.date ? new Date(project.date) : new Date(),
        changeFrequency: "weekly",
        priority: 0.85,
      });
    });
  } catch (err) {
    console.error("Sitemap: Failed to load studio project paths", err);
  }

  // Featured + studios-evidence projects under canonical /projects/[id]
  try {
    const { projectsData } = await import("@/data/projects");
    for (const project of projectsData.get()) {
      sitemapEntries.push({
        url: canonicalUrl(`/projects/${project.slug || project.id}`),
        lastModified: project.publishedAt
          ? new Date(project.publishedAt)
          : project.date
            ? new Date(project.date)
            : new Date(),
        changeFrequency: "weekly",
        priority: project.featured ? 0.9 : 0.8,
      });
    }
  } catch (err) {
    console.error("Sitemap: Failed to load canonical project paths", err);
  }

  return sitemapEntries;
}

