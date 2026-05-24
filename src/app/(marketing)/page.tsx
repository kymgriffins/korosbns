import React from "react";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { metaDescription } from "@/utils/metadata";
import Background from "@/components/global/background";
import Hero from "@/components/marketing/hero";

// Lazy-load below-the-fold animation components to protect initial FCP/LCP times
const FramerStickyScroll = dynamic(
  () => import("@/components/marketing/framer-sticky-scroll"),
  {
    ssr: false,
    loading: () => <div className="h-screen w-full bg-black animate-pulse" />,
  }
);

const HorizontalCycleSlider = dynamic(
  () => import("@/components/marketing/horizontal-cycle-slider"),
  {
    ssr: false,
    loading: () => <div className="h-screen w-full bg-black animate-pulse" />,
  }
);

const AlertsSimulator = dynamic(
  () => import("@/components/marketing/alerts-simulator"),
  {
    ssr: false,
    loading: () => <div className="h-[600px] w-full bg-black animate-pulse" />,
  }
);

const ArticlesPromoMarquee = dynamic(
  () => import("@/components/marketing/articles-promo-marquee"),
  { ssr: false }
);

const Cta = dynamic(
  () => import("@/components/marketing/cta"),
  { ssr: false }
);

const SurveyPopup = dynamic(
  () => import("@/components/marketing/survey-popup"),
  { ssr: false }
);

const NewsletterPopup = dynamic(
  () => import("@/components/marketing/newsletter-popup"),
  { ssr: false }
);

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
    <div className="w-full min-h-dvh pt-6 lg:pt-8 bg-black overflow-x-hidden">
      <Background />
      <Hero />
      <ArticlesPromoMarquee />
      <FramerStickyScroll />
      <HorizontalCycleSlider />
      <AlertsSimulator />
      <Cta />
      <SurveyPopup />
      <NewsletterPopup />
    </div>
  );
}
