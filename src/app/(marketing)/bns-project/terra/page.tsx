import type { Metadata } from "next";
import { buildPageMetadata } from "@/utils/page-metadata";
import { ProjectTerraEditorial } from "@/components/project/project-terra-editorial";
import featuredFallback from "@/data/fallbacks/featured-projects.json";

function getTerraProject() {
  const match = (featuredFallback.results || []).find((p) => p.id === "project-terra");
  return match;
}

export async function generateMetadata(): Promise<Metadata> {
  const terra = getTerraProject();
  const title = terra?.title || "Project TERRA: Technology, Equality, Regulatory Risk Assessment | Budget Ndio Story";
  const description = terra?.prose || "Project TERRA investigates how platform algorithms and data centre tax holidays systematically exclude African women workers from fiscal systems.";

  return buildPageMetadata({
    title: `${title} | Budget Ndio Story`,
    description,
    path: "/bns-project/terra",
    type: "article",
  });
}

export default function ProjectTerraPage() {
  const terra = getTerraProject();
  return <ProjectTerraEditorial project={terra} />;
}
