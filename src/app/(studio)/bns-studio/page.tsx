import React from "react";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/utils/page-metadata";
import { BNSStudioPageClient } from "@/components/studio/BNSStudioPageClient";
import { StudioServiceJsonLd } from "@/components/seo/json-ld";
import {
  getLiveBnsStudioContent,
  getLivePartnerPageSections,
} from "@/lib/cms-live-data";

export const revalidate = 60;

const FALLBACK_SEO = {
  title: "BNS Studios | Commercial Civic Media Production & Agency Nairobi",
  description:
    "Commission broadcast podcasts, 2D animations, cinema field documentaries, and strategic advocacy campaigns in Nairobi. Commercial creative craft funding grassroots civic accountability.",
  ogImage: "/og-image.jpg",
};

export async function generateMetadata(): Promise<Metadata> {
  const studio = await getLiveBnsStudioContent();
  const seo = studio.seo ?? FALLBACK_SEO;
  return buildPageMetadata({
    title: seo.title || FALLBACK_SEO.title,
    description: seo.description || FALLBACK_SEO.description,
    path: "/bns-studio",
    image: seo.ogImage || FALLBACK_SEO.ogImage,
    keywords: [
      "video production company Nairobi",
      "podcast studio Kenya",
      "documentary production Nairobi",
      "2D animation studio Kenya",
      "motion graphics agency Kenya",
      "explainer video production Nairobi",
      "civic media agency Kenya",
      "impact storytelling production house",
      "commission media production Nairobi",
      "public participation facilitation Nairobi",
      "ESG impact documentary Kenya",
      "BNS Studios",
      "Budget Ndio Story Studios",
    ],
  });
}

export default async function BNSStudioPage() {
  const [studioData, sectionsConfig] = await Promise.all([
    getLiveBnsStudioContent(),
    getLivePartnerPageSections(),
  ]);

  const seo = studioData.seo ?? FALLBACK_SEO;

  return (
    <>
      <StudioServiceJsonLd
        url="https://budgetndiostory.org/bns-studio"
        title={seo.title || FALLBACK_SEO.title}
        description={seo.description || FALLBACK_SEO.description}
      />
      <BNSStudioPageClient
        studioData={studioData}
        sectionsConfig={sectionsConfig}
      />
    </>
  );
}
