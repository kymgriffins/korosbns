"use client";

import React from "react";
import dynamic from "next/dynamic";
import GustoHero from "@/components/marketing/gusto-hero";

// Lazy-load below-the-fold sections
const GustoCloudinaryGallery = dynamic(
  () => import("@/components/marketing/gusto-cloudinary-gallery"),
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

const GustoTeamSection = dynamic(
  () => import("@/components/marketing/gusto-team-section"),
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

const GustoFooter = dynamic(
  () => import("@/components/marketing/gusto-footer"),
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
      <GustoHero />
      <GustoCloudinaryGallery />
      <PartnersMarquee />
      
      {/* PHASE 2: Human Layer */}
      <GustoTeamSection />
      
      {/* PHASE 3: Credibility Architecture */}
      <LearningTimeline />
      <GovernmentPartnerships />
      <WhatWeDoSection />
      
      {/* Existing Components */}
      <AlertsSimulator />
      <GustoFooter />
      
      {/* Popups */}
      <SurveyPopup />
      <NewsletterPopup />
    </>
  );
}
