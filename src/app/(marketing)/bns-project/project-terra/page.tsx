import type { Metadata } from "next";
import { buildPageMetadata } from "@/utils/page-metadata";
import { ProjectTerraEditorial } from "@/components/project/project-terra-editorial";

export const metadata: Metadata = buildPageMetadata({
  title:
    "Project TERRA: Technology, Equality, Regulatory Risk Assessment | Budget Ndio Story & House of Fiscal Wisdom",
  description:
    "Project TERRA investigates how platform algorithms, rating heuristics, and data centre tax holidays systematically exclude African women workers from fiscal systems. Led by Dr. Lyla Latif at House of Fiscal Wisdom, supported by Luminate.",
  path: "/bns-project/project-terra",
  keywords: [
    "Project TERRA",
    "House of Fiscal Wisdom",
    "Dr Lyla Latif",
    "Luminate",
    "algorithmic gender bias",
    "data centre fiscal impact",
    "tax justice Africa",
  ],
  type: "article",
});

export default function ProjectTerraAliasPage() {
  return <ProjectTerraEditorial />;
}
