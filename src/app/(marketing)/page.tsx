import React from "react";
import { Metadata } from "next";
import { metaDescription, canonicalUrl } from "@/utils/metadata";
import Background from "@/components/global/background";
import PremiumLandingClient from "@/components/marketing/premium-landing-client";
import { PROGRAMMES_LANDING } from "@/constants/programmes-content";

const homeDescription = metaDescription(PROGRAMMES_LANDING.seoDescription);

export const metadata: Metadata = {
  title: PROGRAMMES_LANDING.seoTitle,
  description: homeDescription,
  keywords: [
    "Budget Ndio Story",
    "Kenya budget tracking",
    "BNS Connect",
    "BNS Mashinani",
    "Wanahabari Lab",
    "BNS Studios",
    "Kenya youth budget",
    "county budget accountability Kenya",
    "fiscal literacy Kenya",
    "public accountability Kenya",
    "KSh 4.8 trillion budget",
  ],
  alternates: {
    canonical: canonicalUrl("/"),
  },
  openGraph: {
    title: PROGRAMMES_LANDING.seoTitle,
    description: homeDescription,
    url: "/",
    type: "website",
    images: ["/logo.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: PROGRAMMES_LANDING.seoTitle,
    description: homeDescription,
    images: ["/logo.svg"],
  },
};

import {
  getLiveLandingData,
  getLivePartnerPageSections,
  getLiveFeaturedProjects,
} from "@/lib/cms-live-data";

export const revalidate = 60;

export default async function HomePage() {
  const [landingData, sectionsConfig, featuredProjects] = await Promise.all([
    getLiveLandingData(),
    getLivePartnerPageSections(),
    getLiveFeaturedProjects(),
  ]);

  return (
    <div className="w-full min-h-dvh bg-background overflow-x-clip">
      <Background />
      <PremiumLandingClient
        landingData={landingData}
        sectionsConfig={sectionsConfig}
        featuredProjects={featuredProjects}
      />
    </div>
  );
}
