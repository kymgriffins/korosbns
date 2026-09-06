import React from "react";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/utils/page-metadata";
import { BNSStudioPageClient } from "@/components/studio/BNSStudioPageClient";
import { StudioServiceJsonLd } from "@/components/seo/json-ld";
import { getProgramme } from "@/constants/programmes-content";

const studios = getProgramme("studios")!;

export const metadata: Metadata = buildPageMetadata({
  title: "BNS Studios | Commercial Civic Media Production & Agency Nairobi",
  description:
    "Commission broadcast podcasts, 2D animations, cinema field documentaries, and strategic advocacy campaigns in Nairobi. Commercial creative craft funding grassroots civic accountability.",
  path: "/bns-studio",
  image: "/og-image.jpg",
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

export default function BNSStudioPage() {
  return (
    <>
      <StudioServiceJsonLd
        url="https://budgetndiostory.org/bns-studio"
        title="BNS Studios | Commercial Civic Media Production"
        description="Kenya's premier commercial civic creative agency and impact production house. Commissioning broadcast podcast series, cinema field documentaries, 2D motion graphics, and civic explainers in Kenya."
      />
      <BNSStudioPageClient />
    </>
  );
}
