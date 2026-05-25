"use client";

import React from "react";
import dynamic from "next/dynamic";
import LandingHero from "@/components/marketing/landing-hero";

// Lazy-load below-the-fold sections
const CloudinaryGallery = dynamic(
  () => import("@/components/marketing/cloudinary-gallery"),
  {
    ssr: false,
    loading: () => <div className="h-screen w-full bg-black animate-pulse" />,
  }
);

const PartnersMarquee = dynamic(
  () => import("@/components/marketing/partners-marquee"),
  {
    ssr: false,
    loading: () => <div className="h-64 w-full bg-black animate-pulse" />,
  }
);

const LandingTeam = dynamic(
  () => import("@/components/marketing/landing-team"),
  {
    ssr: false,
    loading: () => <div className="h-screen w-full bg-background animate-pulse" />,
  }
);

const LearningTimeline = dynamic(
  () => import("@/components/marketing/learning-timeline"),
  {
    ssr: false,
    loading: () => <div className="h-screen w-full bg-background animate-pulse" />,
  }
);

const KenyaFinanceTimeline = dynamic(
  () => import("@/components/marketing/kenya-finance-timeline"),
  {
    ssr: false,
    loading: () => <div className="h-screen w-full bg-black animate-pulse" />,
  }
);

const GovernmentPartnerships = dynamic(
  () => import("@/components/marketing/government-partnerships"),
  {
    ssr: false,
    loading: () => <div className="h-screen w-full bg-background animate-pulse" />,
  }
);

const WhatWeDoSection = dynamic(
  () => import("@/components/marketing/what-we-do-section"),
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

const LandingFooter = dynamic(
  () => import("@/components/marketing/landing-footer"),
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

export default function PremiumLandingClient() {
  return (
    <>
      {/* PHASE 1: Visual Transformation */}
      <LandingHero />
      <CloudinaryGallery />
      <PartnersMarquee />
      
      {/* PHASE 2: Human Layer */}
      <LandingTeam />
      
      {/* PHASE 3: Credibility Architecture */}
      <LearningTimeline />
      <KenyaFinanceTimeline />
      <GovernmentPartnerships />
      <WhatWeDoSection />
      
      {/* Existing Components */}
      <AlertsSimulator />
      <LandingFooter />
      
      {/* Popups */}
      <SurveyPopup />
      <NewsletterPopup />
    </>
  );
}
