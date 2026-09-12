import type { Metadata } from "next";
import { buildPageMetadata } from "@/utils/page-metadata";
import { ProgrammesLanding } from "@/components/programmes/programmes-landing";
import {
  getLiveFeaturedProjects,
  getLivePartnerPageSections,
  getLiveProgrammesContent,
} from "@/lib/cms-live-data";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const programmes = await getLiveProgrammesContent();
  return buildPageMetadata({
    title: programmes.landing.seoTitle,
    description: programmes.landing.seoDescription,
    path: "/programmes",
  });
}

export default async function ProgrammesPage() {
  const [programmesData, sectionsConfig, featuredProjects] = await Promise.all([
    getLiveProgrammesContent(),
    getLivePartnerPageSections(),
    getLiveFeaturedProjects(),
  ]);

  return (
    <ProgrammesLanding
      programmesData={programmesData}
      sectionsConfig={sectionsConfig}
      featuredProjects={featuredProjects}
    />
  );
}
