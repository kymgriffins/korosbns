"use client";

import React from "react";
import dynamic from "next/dynamic";
import LandingHero from "@/components/marketing/landing-hero";

const LandingYoutube = dynamic(
  () => import("@/components/marketing/landing-youtube"),
  {
    ssr: false,
    loading: () => <div className="h-64 w-full animate-pulse bg-muted" />,
  },
);

const ProgrammesSection = dynamic(
  () =>
    import("@/components/marketing/programmes-section").then((m) => ({
      default: m.ProgrammesSection,
    })),
  {
    ssr: false,
    loading: () => <div className="h-96 w-full animate-pulse bg-muted" />,
  },
);

const PartnersMarquee = dynamic(
  () => import("@/components/marketing/partners-marquee"),
  {
    ssr: false,
    loading: () => <div className="h-32 w-full animate-pulse bg-muted" />,
  },
);

const LandingTeam = dynamic(
  () => import("@/components/marketing/landing-team"),
  {
    ssr: false,
    loading: () => <div className="h-96 w-full animate-pulse bg-background" />,
  },
);

const TimelineSection = dynamic(
  () => import("@/components/shadcn-space/blocks/timeline-01"),
  {
    ssr: false,
    loading: () => <div className="h-96 w-full animate-pulse bg-muted" />,
  },
);

const BNSStudioSection = dynamic(
  () =>
    import("@/components/marketing/bns-studio-section").then((m) => ({
      default: m.BNSStudioSection,
    })),
  {
    ssr: false,
    loading: () => <div className="h-96 w-full animate-pulse bg-muted" />,
  },
);

const SocialsSection = dynamic(
  () => import("@/components/marketing/socials-section"),
  {
    ssr: false,
    loading: () => <div className="h-64 w-full animate-pulse bg-muted" />,
  },
);

const TestimonialsSection = dynamic(
  () => import("@/components/shadcn-space/blocks/testimonial-01/testimonial"),
  {
    ssr: false,
    loading: () => <div className="h-96 w-full animate-pulse bg-muted" />,
  },
);

const NewsletterPopup = dynamic(
  () => import("@/components/marketing/newsletter-popup"),
  { ssr: false },
);

/**
 * Homepage spine:
 * Hero (TikTok) → Story → Programmes → Partners → Team → Timeline →
 * Testimonials → Studios (single) → Socials
 * (Field gallery temporarily hidden)
 */
export default function PremiumLandingClient() {
  return (
    <>
      <LandingHero />
      <LandingYoutube />
      <ProgrammesSection />
      <PartnersMarquee />
      <LandingTeam />
      <TimelineSection />
      <TestimonialsSection />
      <BNSStudioSection />
      <SocialsSection />
      <NewsletterPopup />
    </>
  );
}
