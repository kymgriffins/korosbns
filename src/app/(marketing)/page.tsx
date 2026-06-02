import React from "react";
import { Metadata } from "next";
import { metaDescription, canonicalUrl } from "@/utils/metadata";
import Background from "@/components/global/background";
import PremiumLandingClient from "@/components/marketing/premium-landing-client";

const homeDescription = metaDescription(
  "Budget Ndio Story is a youth-led initiative in Kenya turning complex national budgets into clear narratives for democratic participation and fiscal literacy."
);

export const metadata: Metadata = {
  title: "Budget Ndio Story | Kenya Budget, Finance Bill & Fiscal Policy Explained",
  description: homeDescription,
  keywords: [
    "Budget Ndio Story",
    "youth-led civic engagement Kenya",
    "budget transparency Kenya",
    "fiscal literacy",
    "youth fiscal policy",
    "Finance Bill 2026 Kenya",
    "Appropriation Bill Kenya",
    "Kenya parliamentary budget",
    "Budget Policy Statement",
    "public participation budget Kenya",
  ],
  alternates: {
    canonical: canonicalUrl("/"),
  },
  openGraph: {
    title: "Budget Ndio Story | Kenya Budget, Finance Bill & Fiscal Policy Explained",
    description:
      "Translating Numbers into Narratives. Making Kenya's budget, Finance Bill, and parliamentary fiscal decisions understandable for every citizen.",
    url: "/",
    type: "website",
    images: ["/logo.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Budget Ndio Story",
    description:
      "A youth-led Kenyan initiative turning budgets into actionable civic knowledge about the Finance Bill, Appropriation Bill, and public finance.",
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
