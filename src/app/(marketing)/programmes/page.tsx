import type { Metadata } from "next";
import { buildPageMetadata } from "@/utils/page-metadata";
import { MagazineProgrammesHub } from "@/components/magazine/magazine-programmes-hub";
import {
  getLiveFeaturedProjects,
  getLiveProgrammesContent,
} from "@/lib/cms-live-data";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const programmes = await getLiveProgrammesContent();
  return buildPageMetadata({
    title: `${programmes.landing.seoTitle} | Programmes Portfolio`,
    description: programmes.landing.seoDescription,
    path: "/programmes",
  });
}

export default async function ProgrammesPage() {
  const [programmesData, featuredProjects] = await Promise.all([
    getLiveProgrammesContent(),
    getLiveFeaturedProjects(),
  ]);

  return (
    <MagazineProgrammesHub
      programmesData={programmesData}
      featuredProjects={featuredProjects}
    />
  );
}
