import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { projectsData } from "@/data/projects";
import { MagazineProjectDossier } from "@/components/project/magazine-project-dossier";
import type { ProjectEditorialData } from "@/components/project/project-editorial-view";
import { buildPageMetadata } from "@/utils/page-metadata";
import { resolveProjectId } from "@/lib/programme-project-ids";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ id: string }>;
};

function isTerraProject(id: string): boolean {
  return resolveProjectId(id) === "project-terra";
}

function findCanonicalProject(idOrSlug: string): ProjectEditorialData | null {
  const resolved = resolveProjectId(idOrSlug);
  const canonical = projectsData.getById(resolved);
  if (!canonical) return null;

  const body = canonical.wysiwygProse || canonical.prose || canonical.description;

  return {
    id: canonical.id,
    slug: canonical.slug,
    title: canonical.title,
    subtitle: canonical.subtitle,
    prose: canonical.prose || canonical.description,
    wysiwygProse: body,
    authorName: canonical.authorName,
    programmeSlug: canonical.programmeSlug,
    programmeLabel: canonical.programmeLabel,
    url: canonical.videoUrl || (canonical.videoId ? `https://www.youtube.com/watch?v=${canonical.videoId}` : ""),
    videoId: canonical.videoId,
    thumbnail: canonical.thumbnail,
    useYoutubeThumbnail: canonical.mediaType === "youtube",
    publishedAt: canonical.publishedAt || canonical.date,
    channelHandle: canonical.channelHandle,
    funder: "Public Wealth Investigative Consortium",
    hostInstitution: "House of Fiscal Wisdom",
    mediaType: canonical.mediaType,
    reelUrl: canonical.reelUrl,
    audioUrl: canonical.audioUrl,
    gallery: canonical.gallery,
    mediaCaption: canonical.mediaCaption,
    hideCaptions: canonical.hideCaptions,
  } as ProjectEditorialData;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = findCanonicalProject(id);

  if (project) {
    return buildPageMetadata({
      title: `${project.title} | Investigation Dossier`,
      description: project.prose || "Civic evidence and public wealth investigation from Budget Ndio Story.",
      path: `/bns-project/${id}`,
      type: "article",
    });
  }

  if (isTerraProject(id)) {
    return buildPageMetadata({
      title: "Project TERRA: Technology, Equality, Regulatory Risk Assessment | Investigation Dossier",
      description:
        "Project TERRA investigates how platform algorithms and data centre tax holidays systematically exclude African women workers from fiscal systems.",
      path: `/bns-project/${id}`,
      type: "article",
    });
  }

  return buildPageMetadata({
    title: "Investigation File | Budget Ndio Story",
    description: "Civic projects and investigations from Budget Ndio Story.",
    path: `/bns-project/${id}`,
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const canonicalProject = findCanonicalProject(id);

  if (canonicalProject) {
    return <MagazineProjectDossier project={canonicalProject} />;
  }

  if (isTerraProject(id)) {
    const terraFallback: ProjectEditorialData = {
      id: "project-terra",
      slug: "project-terra",
      title: "Project TERRA: Technology, Equality, Regulatory Risk Assessment",
      subtitle: "Investigating platform algorithms, data centre tax holidays, and public revenue loss.",
      prose: "A six-month investigative audit cross-referencing county expenditure reports with ground photography, contractor filings, and citizen testimony.",
      authorName: "BNS Investigations Desk",
      programmeSlug: "mashinani",
      programmeLabel: "Ground Forensics",
      publishedAt: "September 2026",
      thumbnail: "/images/towwnhallmay/129A3912.jpg",
      funder: "Public Wealth Investigative Consortium",
      hostInstitution: "House of Fiscal Wisdom",
    };
    return <MagazineProjectDossier project={terraFallback} />;
  }

  redirect("/programmes");
}
