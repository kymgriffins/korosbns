import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { projectsData, type CanonicalProject } from "@/data/projects";
import { ProjectTerraEditorial } from "@/components/project/project-terra-editorial";
import { ProjectEditorialView, type ProjectEditorialData } from "@/components/project/project-editorial-view";
import { buildPageMetadata } from "@/utils/page-metadata";
import { resolveProjectId } from "@/lib/programme-project-ids";

type PageProps = {
  params: Promise<{ id: string }>;
};

function isTerraProject(id: string): boolean {
  return resolveProjectId(id) === "project-terra";
}

function findCanonicalProject(idOrSlug: string): ProjectEditorialData | null {
  const norm = idOrSlug.toLowerCase().trim();
  const canonical = projectsData.getById(norm);
  if (!canonical) return null;

  return {
    id: canonical.id,
    slug: canonical.slug,
    title: canonical.title,
    subtitle: canonical.subtitle,
    prose: canonical.description,
    wysiwygProse: canonical.wysiwygProse || canonical.description,
    authorName: canonical.authorName,
    programmeSlug: canonical.programmeSlug,
    programmeLabel: canonical.programmeLabel,
    url: canonical.videoUrl || (canonical.videoId ? `https://www.youtube.com/watch?v=${canonical.videoId}` : ""),
    videoId: canonical.videoId,
    thumbnail: canonical.thumbnail,
    useYoutubeThumbnail: canonical.mediaType === "youtube",
    publishedAt: canonical.publishedAt || canonical.date,
    channelHandle: canonical.channelHandle,
    funder: "Supported by Consortium Partners",
    hostInstitution: "House of Fiscal Wisdom",
    // Pass media fields to editorial view
    mediaType: canonical.mediaType,
    reelUrl: canonical.reelUrl,
    audioUrl: canonical.audioUrl,
    gallery: canonical.gallery,
    mediaCaption: canonical.mediaCaption,
    hideCaptions: canonical.hideCaptions,
  } as ProjectEditorialData & {
    mediaType: string;
    reelUrl?: string;
    audioUrl?: string;
    gallery?: Array<{ url: string; caption?: string; alt?: string }>;
    mediaCaption?: string;
    hideCaptions?: boolean;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = findCanonicalProject(id);

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

  return buildPageMetadata({
    title: "Project | Budget Ndio Story",
    description: "Civic projects and investigations from Budget Ndio Story.",
    path: `/bns-project/${id}`,
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const canonicalProject = findCanonicalProject(id);

  if (isTerraProject(id)) {
    return <ProjectTerraEditorial project={canonicalProject || undefined} />;
  }

  if (canonicalProject) {
    return <ProjectEditorialView project={canonicalProject} />;
  }

  redirect("/bns-project");
}
