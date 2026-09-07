import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { ProjectTerraEditorial } from "@/components/project/project-terra-editorial";
import { buildPageMetadata } from "@/utils/page-metadata";
import { resolveProjectId } from "@/lib/programme-project-ids";

type PageProps = {
  params: Promise<{ id: string }>;
};

function isTerraProject(id: string): boolean {
  return resolveProjectId(id) === "project-terra";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  if (isTerraProject(id)) {
    return buildPageMetadata({
      title:
        "Project TERRA: Technology, Equality, Regulatory Risk Assessment | Budget Ndio Story",
      description:
        "Project TERRA investigates how platform algorithms and data centre tax holidays systematically exclude African women workers from fiscal systems. In conjunction with House of Fiscal Wisdom.",
      path: `/bns-project/${id}`,
      type: "article",
    });
  }

  const project = studiosEvidenceData.getProjectBySlug(id);
  if (project) {
    return buildPageMetadata({
      title: `${project.title} | Budget Ndio Story`,
      description: project.briefChallenge,
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

  if (isTerraProject(id)) {
    return <ProjectTerraEditorial />;
  }

  const project = studiosEvidenceData.getProjectBySlug(id);
  if (project) {
    redirect(`/bns-studio/${project.slug}`);
  }
  redirect("/work");
}
