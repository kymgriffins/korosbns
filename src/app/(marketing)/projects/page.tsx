import type { Metadata } from "next";
import { buildPageMetadata } from "@/utils/page-metadata";
import { BNSProjectClient } from "@/components/project/BNSProjectClient";
import { getLivePartnerPageSections } from "@/lib/cms-live-data";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Flagship Projects & Research Initiatives | Budget Ndio Story",
  description:
    "Explore our flagship initiatives including Project TERRA with House of Fiscal Wisdom, Budget Literacy, County Tracking, and Public Participation Hubs.",
  path: "/projects",
  keywords: [
    "Project TERRA",
    "House of Fiscal Wisdom",
    "Budget Ndio Story projects",
    "Kenya civic initiatives",
    "budget literacy Kenya",
    "public participation Kenya",
  ],
});

export default async function ProjectsPage() {
  const sectionsConfig = await getLivePartnerPageSections();
  const pages = sectionsConfig?.pages as Record<string, any> | undefined;
  const archetype = pages?.projectIndex?.layoutArchetype || pages?.work?.layoutArchetype || pages?.projects?.layoutArchetype || "sovereign";
  return <BNSProjectClient archetype={archetype} />;
}
