import React from "react";
import type { Metadata } from "next";
import { metaDescription, canonicalUrl } from "@/utils/metadata";
import { MagazineFrontPage } from "@/components/marketing/magazine-front-page";
import { PROGRAMMES_LANDING } from "@/constants/programmes-content";
import {
  getLiveLandingData,
  getLiveFeaturedProjects,
} from "@/lib/cms-live-data";

const homeDescription = metaDescription(PROGRAMMES_LANDING.seoDescription);

export const metadata: Metadata = {
  title: `${PROGRAMMES_LANDING.seoTitle} | Magazine of Kenya's Public Wealth`,
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

export const revalidate = 60;

export default async function HomePage() {
  const [landingData, featuredProjects] = await Promise.all([
    getLiveLandingData(),
    getLiveFeaturedProjects(),
  ]);

  return (
    <MagazineFrontPage
      landingData={landingData}
      featuredProjects={featuredProjects}
    />
  );
}
