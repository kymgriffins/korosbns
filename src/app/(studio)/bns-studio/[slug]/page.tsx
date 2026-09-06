import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/utils/page-metadata";
import { StudioProjectViewer } from "@/components/studio/theatre/studio-project-viewer";
import { StudioProjectJsonLd } from "@/components/seo/json-ld";
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
      title: "Case Study | BNS Studios",
      description: "BNS Studios commissioned commercial and civic productions.",
      path: "/bns-studio",
    });
  }

  const posterImage = project.media.posterUrl
    ? project.media.posterUrl.startsWith("http")
      ? project.media.posterUrl
      : project.media.posterUrl
    : "/og-image.jpg";

  return buildPageMetadata({
    title: `${project.title} | BNS Studios Case Study & Production`,
    description: `${project.briefChallenge} Commissioned for ${project.organization.name} by BNS Studios.`,
    path: `/bns-studio/${project.slug}`,
    image: posterImage,
    keywords: [
      project.title,
      project.contentType,
      project.organization.name,
      "BNS Studios case study",
      "commissioned civic production Kenya",
      "video production Nairobi",
      ...project.tags,
    ],
  });
}

export default async function StudioProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = studiosEvidenceData.getProjectBySlug(slug);
  if (!project) notFound();

  const imageUrl = project.media.posterUrl
    ? project.media.posterUrl.startsWith("http")
      ? project.media.posterUrl
      : `https://budgetndiostory.org${project.media.posterUrl}`
    : undefined;

  return (
    <>
      <StudioProjectJsonLd
        title={project.title}
        description={project.description || project.briefChallenge}
        slug={project.slug}
        contentType={project.contentType}
        clientName={project.organization.name}
        datePublished={project.date}
        imageUrl={imageUrl}
        videoUrl={project.media.videoUrl}
        audioUrl={project.media.audioUrl}
        tags={project.tags}
      />
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center text-sm text-[var(--studio-theatre-muted)]">
            Loading production…
          </div>
        }
      >
        <StudioProjectViewer project={project} />
      </Suspense>
    </>
  );
}
