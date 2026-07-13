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

const LandingTikTokVideo = dynamic(
  () => import("@/components/marketing/landing-tiktok-video"),
  {
    ssr: false,
    loading: () => <div className="h-[640px] w-full bg-muted animate-pulse" />,
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

const TimelineSection = dynamic(
  () => import("@/components/shadcn-space/blocks/timeline-01"),
  {
    ssr: false,
    loading: () => <div className="h-screen w-full bg-muted animate-pulse" />,
  }
);

const BNSStudioSection = dynamic(
  () => import("@/components/marketing/bns-studio-section").then((m) => ({ default: m.BNSStudioSection })),
  {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-muted animate-pulse" />,
  }
);

const SocialsSection = dynamic(
  () => import("@/components/marketing/socials-section"),
  {
    ssr: false,
    loading: () => <div className="h-64 w-full bg-muted animate-pulse" />,
  }
);

const ServicesSection = dynamic(
  () => import("@/components/shadcn-space/blocks/services-02/services"),
  {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-muted animate-pulse" />,
  }
);

const TestimonialsSection = dynamic(
  () => import("@/components/shadcn-space/blocks/testimonial-01/testimonial"),
  {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-muted animate-pulse" />,
  }
);

const NewsletterPopup = dynamic(
  () => import("@/components/marketing/newsletter-popup"),
  { ssr: false }
);

import { bnsServices } from "@/data/bns-services";

/** Temporarily hidden while sticky services desktop behavior is fixed. */
const SHOW_SERVICES_SECTION = false;

export default function PremiumLandingClient() {
  return (
    <>
      <LandingHero />
      <LandingTikTokVideo />
      <LandingYoutube />
      <PartnersMarquee />
      <LandingTeam />
      <TimelineSection />
      {SHOW_SERVICES_SECTION ? <ServicesSection data={bnsServices} /> : null}
      <TestimonialsSection />
      <CloudinaryGallery />
      <BNSStudioSection />
      <SocialsSection />
      <NewsletterPopup />
    </>
  );
}
