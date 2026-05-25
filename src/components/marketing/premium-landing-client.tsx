"use client";

import React from "react";
import dynamic from "next/dynamic";
import LandingHero from "@/components/marketing/landing-hero";

const CloudinaryGallery = dynamic(
  () => import("@/components/marketing/cloudinary-gallery"),
  {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-muted animate-pulse" />,
  }
);

const LandingYoutube = dynamic(
  () => import("@/components/marketing/landing-youtube"),
  {
    ssr: false,
    loading: () => <div className="h-64 w-full bg-muted animate-pulse" />,
  }
);

const PartnersMarquee = dynamic(
  () => import("@/components/marketing/partners-marquee"),
  {
    ssr: false,
    loading: () => <div className="h-32 w-full bg-muted animate-pulse" />,
  }
);

const LandingTeam = dynamic(
  () => import("@/components/marketing/landing-team"),
  {
    ssr: false,
    loading: () => <div className="h-screen w-full bg-background animate-pulse" />,
  }
);

const KenyaFinanceTimeline = dynamic(
  () => import("@/components/marketing/kenya-finance-timeline"),
  {
    ssr: false,
    loading: () => <div className="h-screen w-full bg-muted animate-pulse" />,
  }
);

const GovernmentPartnerships = dynamic(
  () => import("@/components/marketing/government-partnerships"),
  {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-background animate-pulse" />,
  }
);

const WhatWeDoSection = dynamic(
  () => import("@/components/marketing/what-we-do-section"),
  {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-background animate-pulse" />,
  }
);

const AlertsSimulator = dynamic(
  () => import("@/components/marketing/alerts-simulator"),
  {
    ssr: false,
    loading: () => <div className="h-[600px] w-full bg-muted animate-pulse" />,
  }
);

const SurveyPopup = dynamic(
  () => import("@/components/marketing/survey-popup"),
  { ssr: false }
);

const NewsletterPopup = dynamic(
  () => import("@/components/marketing/newsletter-popup"),
  { ssr: false }
);

import { TeamMember } from "@/lib/team";

export default function PremiumLandingClient({ teamData }: { teamData?: TeamMember[] }) {
  return (
    <>
      <LandingHero />
      <CloudinaryGallery />
      <LandingYoutube />
      <PartnersMarquee />
      <LandingTeam teamData={teamData} />
      <KenyaFinanceTimeline />
      <GovernmentPartnerships />
      <WhatWeDoSection />
      <AlertsSimulator />
      <SurveyPopup />
      <NewsletterPopup />
    </>
  );
}
