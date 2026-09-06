import type { Metadata } from "next";
import { buildPageMetadata } from "@/utils/page-metadata";
import { StudioFeaturedWorkPage } from "@/components/studio/theatre/studio-featured-work-page";
import { StudioCollectionJsonLd } from "@/components/seo/json-ld";
import { StudioThemeProvider } from "@/contexts/studio-theme-context";
import { studiosEvidenceData } from "@/data/studios-evidence";

export const metadata: Metadata = buildPageMetadata({
  title: "Featured Work & Commercial Evidence | Budget Ndio Story",
  description:
    "Explore forensic investigations, commissioned media, county scorecards, and viral explainers produced across our 4 operational programmes: BNS Connect, BNS Mashinani, Wanahabari Lab, and BNS Studios.",
  path: "/work",
  image: "/og-image.jpg",
  keywords: [
    "commercial civic media Kenya",
    "BNS Studios case studies",
    "budget accountability investigations",
    "county scorecards Kenya",
    "explainer videos Nairobi",
    "documentary productions Kenya",
    "podcast series Nairobi",
  ],
});

export default function UnifiedWorkPage() {
  const projects = studiosEvidenceData.getAllProjects().map((p) => ({
    title: p.title,
    slug: p.slug,
    description: p.briefChallenge,
    imageUrl: p.media.posterUrl ? `https://budgetndiostory.org${p.media.posterUrl}` : undefined,
  }));

  return (
    <StudioThemeProvider>
      <StudioCollectionJsonLd
        title="Featured Work & Evidence — Budget Ndio Story"
        description="Forensic investigations, commissioned media, county scorecards, and viral explainers across Kenya."
        url="https://budgetndiostory.org/work"
        projects={projects}
      />
      <StudioFeaturedWorkPage />
    </StudioThemeProvider>
  );
}
