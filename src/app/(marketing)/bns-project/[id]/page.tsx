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

function isTerraProject(id: string): boolean {
  return resolveProjectId(id) === "project-terra";
}

function findCmsProject(idOrSlug: string): ProjectEditorialData | null {
  const norm = idOrSlug.toLowerCase().trim();
  let results: any[] = [];
  try {
    const cmsData = headlessCmsApi.getCollectionData("featured-projects") as { results?: any[] };
    if (Array.isArray(cmsData?.results) && cmsData.results.length > 0) {
      results = cmsData.results;
    } else {
      results = (featuredFallback.results || []) as any[];
    }
  } catch {
    results = (featuredFallback.results || []) as any[];
  }

  const found = results.find((p) => {
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

  return found || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = findCmsProject(id);

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
  const cmsProject = findCmsProject(id);

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
