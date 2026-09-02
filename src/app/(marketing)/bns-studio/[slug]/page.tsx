import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/utils/page-metadata";
import { StudioProjectDetail } from "@/components/studio/StudioProjectDetail";
import { studiosEvidenceData } from "@/data/studios-evidence";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return studiosEvidenceData.getAllProjects().map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = studiosEvidenceData.getProjectBySlug(slug);
  if (!project) {
    return buildPageMetadata({
      title: "Project | BNS Studios",
      description: "BNS Studios commissioned work.",
      path: "/bns-studio",
    });
  }
  return buildPageMetadata({
    title: `${project.title} | BNS Studios`,
    description: project.briefChallenge,
    path: `/bns-studio/${project.slug}`,
  });
}

export default async function StudioProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = studiosEvidenceData.getProjectBySlug(slug);
  if (!project) notFound();
  return <StudioProjectDetail project={project} />;
}
