import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { buildPageMetadata } from "@/utils/page-metadata";
import { ProgrammeDetail } from "@/components/programmes/programme-detail";
import type { ProgrammeBlock } from "@/content";
import {
  civicProgrammesFromContent,
  findProgrammeInContent,
  getLivePartnerPageSections,
  getLiveProgrammeReels,
  getLiveProgrammesContent,
} from "@/lib/cms-live-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateStaticParams() {
  const programmes = await getLiveProgrammesContent();
  return civicProgrammesFromContent(programmes).map((p) => ({
    slug: String((p as { slug: string }).slug),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "studios") {
    return buildPageMetadata({
      title: "BNS Studio | Budget Ndio Story",
      description:
        "Commissioned evidence production that funds Budget Ndio Story programmes.",
      path: "/bns-studio",
    });
  }
  const programmes = await getLiveProgrammesContent();
  const programme = findProgrammeInContent(programmes, slug) as
    | ProgrammeBlock
    | undefined;
  if (!programme) {
    return buildPageMetadata({
      title: "Programmes | Budget Ndio Story",
      description: "Explore Budget Ndio Story programmes.",
      path: "/programmes",
    });
  }
  return buildPageMetadata({
    title: programme.seoTitle,
    description: programme.seoDescription,
    path: `/programmes/${programme.slug}`,
  });
}

export default async function ProgrammeSlugPage({ params }: PageProps) {
  const { slug } = await params;
  if (slug === "studios") {
    redirect("/bns-studio");
  }

  const [programmesData, sectionsConfig, reelsData] = await Promise.all([
    getLiveProgrammesContent(),
    getLivePartnerPageSections(),
    getLiveProgrammeReels(),
  ]);

  const programme = findProgrammeInContent(programmesData, slug) as
    | ProgrammeBlock
    | undefined;
  if (!programme || programme.slug === "studios") notFound();

  const civic = civicProgrammesFromContent(programmesData) as ProgrammeBlock[];

  return (
    <ProgrammeDetail
      programme={programme}
      civicProgrammes={civic}
      closing={programmesData.closing}
      sectionsConfig={sectionsConfig}
      reels={(reelsData as { reels?: unknown[] }).reels as never}
    />
  );
}
