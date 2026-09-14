import type { Metadata } from "next";
import { buildPageMetadata } from "@/utils/page-metadata";
import { BNSProjectClient } from "@/components/project/BNSProjectClient";

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

export default function ProjectsPage() {
  return <BNSProjectClient />;
}
