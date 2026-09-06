import type { Metadata } from "next";
import { buildPageMetadata } from "@/utils/page-metadata";
import { StudioFeaturedWorkPage } from "@/components/studio/theatre/studio-featured-work-page";
import { StudioCollectionJsonLd } from "@/components/seo/json-ld";
import { studiosEvidenceData } from "@/data/studios-evidence";

export const metadata: Metadata = buildPageMetadata({
  title: "Commercial Portfolio & Commissioned Productions | BNS Studios",
  description:
    "Explore verified documentaries, bilingual podcast series, 2D explainers, and civic barazas commissioned by governments, development partners, and civil society across Kenya.",
  path: "/bns-studio/work",
  image: "/og-image.jpg",
  keywords: [
    "BNS Studios portfolio",
    "commissioned documentaries Kenya",
    "explainer videos Nairobi",
    "podcast production portfolio Kenya",
    "2D animation case studies Kenya",
    "civic campaign productions Nairobi",
    "donor impact video production",
    "commercial civic media evidence",
  ],
});

export default function StudioWorkPage() {
  const projects = studiosEvidenceData.getAllProjects().map((p) => ({
    title: p.title,
    slug: p.slug,
    description: p.briefChallenge,
    imageUrl: p.media.posterUrl ? `https://budgetndiostory.org${p.media.posterUrl}` : undefined,
  }));

  return (
    <>
      <StudioCollectionJsonLd
        title="BNS Studios Commercial Production Portfolio"
        description="Verified case studies and media productions engineered for civic impact and commissioned by institutions across Kenya."
        url="https://budgetndiostory.org/bns-studio/work"
        projects={projects}
      />
      <StudioFeaturedWorkPage />
    </>
  );
}
