import React from "react";
import { Metadata } from "next";
import { metaDescription } from "@/utils/metadata";
import Background from "@/components/global/background";
import PremiumLandingClient from "@/components/marketing/premium-landing-client";

const homeDescription = metaDescription(
  "Budget Ndio Story is a youth-led initiative in Kenya turning complex national budgets into clear narratives for democratic participation and fiscal literacy."
);

export const metadata: Metadata = {
  title: "Budget Ndio Story | Bridging Youth Energy & Fiscal Policy",
  description: homeDescription,
  keywords: [
    "Budget Ndio Story",
    "youth-led civic engagement Kenya",
    "budget transparency Kenya",
    "fiscal literacy",
    "youth fiscal policy",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Budget Ndio Story | Bridging Youth Energy & Fiscal Policy",
    description:
      "Translating Numbers into Narratives. Meeting youth where they are through investigative series, podcasts, and digital explainers.",
    url: "/",
    type: "website",
    images: ["/logo.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Budget Ndio Story",
    description:
      "A youth-led Kenyan initiative turning budgets into actionable civic knowledge.",
    images: ["/logo.svg"],
  },
};

export default function HomePage() {
  return (
    <div className="w-full min-h-dvh pt-6 lg:pt-8 bg-background overflow-x-hidden">
      <Background />
      <PremiumLandingClient />
    </div>
  );
}
