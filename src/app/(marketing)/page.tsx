import React from "react";
import { Metadata } from "next";
import { metaDescription, canonicalUrl } from "@/utils/metadata";
import Background from "@/components/global/background";
import PremiumLandingClient from "@/components/marketing/premium-landing-client";

const homeDescription = metaDescription(
  "Budget Ndio Story is a youth-led initiative in Kenya turning complex national budgets into clear narratives for democratic participation and fiscal literacy. FY2026/27 budget breakdown: Education KES 781.4B, Health KES 175.5B, Infrastructure KES 230B, Agriculture KES 106.8B — all verified from official National Treasury and Parliament data."
);

export const metadata: Metadata = {
  title: "Budget Ndio Story | Kenya FY2026/27 Budget Breakdown & Allocations by Sector",
  description: homeDescription,
  keywords: [
    "Kenya budget 2026/27",
    "FY2026/27 Kenya budget allocations",
    "Kenya education budget 781 billion",
    "Kenya health budget 175 billion",
    "Kenya infrastructure budget 230 billion",
    "Budget Ndio Story",
    "youth-led civic engagement Kenya",
    "budget transparency Kenya",
    "fiscal literacy",
    "Finance Bill 2026 Kenya",
    "Appropriation Bill Kenya",
    "Budget Policy Statement 2026",
    "public participation budget Kenya",
    "Kenya national budget sector allocation",
    "KES 4.82 trillion budget Kenya",
    "John Mbadi budget 2026/27",
    "BETA agenda budget allocation",
  ],
  alternates: {
    canonical: canonicalUrl("/"),
  },
  openGraph: {
    title: "Budget Ndio Story | Kenya FY2026/27 Budget — KES 4.82 Trillion Sector Breakdown",
    description:
      "Complete Kenya FY2026/27 budget tracker: Education KES 781.4B, Health KES 175.5B, Security KES 308.6B, Infrastructure KES 230B, Agriculture KES 106.8B, Housing KES 135.8B. Verified from National Treasury and Parliament. Translating Numbers into Narratives.",
    url: "/",
    type: "website",
    images: ["/logo.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Budget Ndio Story | FY2026/27 Kenya Budget Breakdown",
    description:
      "KES 4.82 trillion budget breakdown: Education KES 781.4B, Health KES 175.5B, Infrastructure KES 230B, Agriculture KES 106.8B, Housing KES 135.8B, Security KES 308.6B. Verified from official National Treasury and Parliament data.",
    images: ["/logo.svg"],
  },
};

export default function HomePage() {
  return (
    <div className="w-full min-h-dvh bg-background overflow-x-hidden">
      <Background />
      <PremiumLandingClient />
    </div>
  );
}
