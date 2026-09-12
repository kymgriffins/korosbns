import featuredFallback from "@/data/fallbacks/featured-projects.json";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { ProjectTerraEditorial } from "@/components/project/project-terra-editorial";
import { ProjectEditorialView, type ProjectEditorialData } from "@/components/project/project-editorial-view";
import { buildPageMetadata } from "@/utils/page-metadata";
import { resolveProjectId } from "@/lib/programme-project-ids";
import { headlessCmsApi } from "@/lib/headless-cms";

type PageProps = {
  params: Promise<{ id: string }>;
};

import { getLiveFeaturedProjects } from "@/lib/cms-live-data";
import civicModulesFallback from "@/data/fallbacks/civic-modules.json";

function isTerraProject(id: string): boolean {
  return resolveProjectId(id) === "project-terra";
}

async function findCmsProject(idOrSlug: string): Promise<ProjectEditorialData | null> {
  const norm = idOrSlug.toLowerCase().trim();
  let results: any[] = [];
  try {
    const live = await getLiveFeaturedProjects();
    const liveResults = (live as any)?.results || (live as any)?.projects;
    if (Array.isArray(liveResults) && liveResults.length > 0) {
      results = liveResults;
    } else {
      results = (featuredFallback.results || []) as any[];
    }
  } catch {
    results = (featuredFallback.results || []) as any[];
  }

  let found = results.find((p) => {
    const pId = (p.id || "").toLowerCase();
    const pSlug = (p.slug || "").toLowerCase();
    const pHref = (p.href || "").toLowerCase();
    return (
      pId === norm ||
      pSlug === norm ||
      pHref.endsWith(`/${norm}`) ||
      resolveProjectId(pId) === resolveProjectId(norm)
    );
  });

  if (!found) {
    try {
      const civicModules = (civicModulesFallback.results || []) as any[];
      const mod = civicModules.find(
        (m) =>
          (m.id || "").toLowerCase() === norm ||
          (m.slug || "").toLowerCase() === norm,
      );
      if (mod) {
        const firstStep = mod.steps?.[0] || {};
        found = {
          id: mod.id,
          slug: mod.slug || mod.id,
          title: mod.title,
          subtitle: mod.badgeName || mod.badge,
          prose: mod.description,
          wysiwygProse: firstStep.text || mod.description,
          authorName: mod.credits || "Budget Ndio Story Editorial & Research Team",
          programmeSlug: mod.id === "county-budget" ? "mashinani" : "connect",
          programmeLabel: mod.id === "county-budget" ? "BNS Mashinani" : "BNS Connect",
          url: firstStep.youtube_url || "",
          videoId: firstStep.youtube_url
            ? firstStep.youtube_url.match(/v=([\w-]{11})/)?.[1] || ""
            : "",
          thumbnail: mod.image_url || firstStep.image_urls?.[0] || "/images/hall/129A4248.jpg",
          publishedAt: "2026-02-15T00:00:00Z",
          channelHandle: "@budgetndiostory",
          isProject: true,
          useYoutubeThumbnail: false,
          hostInstitution: "House of Fiscal Wisdom",
          funder: "Supported by Consortium Partners",
        };
      }
    } catch {}
  }

  return found || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await findCmsProject(id);

  if (project) {
    return buildPageMetadata({
      title: `${project.title} | Budget Ndio Story`,
      description: project.prose || "Civic evidence and policy investigation from Budget Ndio Story.",
      path: `/bns-project/${id}`,
      type: "article",
    });
  }

  if (isTerraProject(id)) {
    return buildPageMetadata({
      title: "Project TERRA: Technology, Equality, Regulatory Risk Assessment | Budget Ndio Story",
      description:
        "Project TERRA investigates how platform algorithms and data centre tax holidays systematically exclude African women workers from fiscal systems.",
      path: `/bns-project/${id}`,
      type: "article",
    });
  }

  const studioProject = studiosEvidenceData.getProjectBySlug(id);
  if (studioProject) {
    return buildPageMetadata({
      title: `${studioProject.title} | Budget Ndio Story`,
      description: studioProject.briefChallenge,
      path: `/bns-project/${id}`,
    });
  }

  return buildPageMetadata({
    title: "Project | Budget Ndio Story",
    description: "Civic projects and investigations from Budget Ndio Story.",
    path: `/bns-project/${id}`,
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const cmsProject = await findCmsProject(id);

  if (isTerraProject(id)) {
    return <ProjectTerraEditorial project={cmsProject || undefined} />;
  }

  if (cmsProject) {
    return <ProjectEditorialView project={cmsProject} />;
  }

  const studioProject = studiosEvidenceData.getProjectBySlug(id);
  if (studioProject) {
    redirect(`/bns-studio/${studioProject.slug}`);
  }

  redirect("/bns-project");
}
