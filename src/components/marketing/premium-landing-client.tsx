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

const ImpactProofBanner = dynamic(
  () => import("@/components/marketing/impact-proof-banner"),
  {
    ssr: false,
    loading: () => <div className="h-48 w-full animate-pulse bg-muted" />,
  },
);

const DocumentaryMethodPillars = dynamic(
  () => import("@/components/marketing/documentary-method-pillars"),
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

const BudgetDecoderPreview = dynamic(
  () => import("@/components/marketing/budget-decoder-preview"),
  {
    ssr: false,
    loading: () => <div className="h-96 w-full animate-pulse bg-slate-950" />,
  },
);

const TestimonialsSection = dynamic(
  () => import("@/components/shadcn-space/blocks/testimonial-01/testimonial"),
  {
    ssr: false,
    loading: () => <div className="h-96 w-full animate-pulse bg-muted" />,
  },
);

const LandingTeam = dynamic(
  () => import("@/components/marketing/landing-team"),
  {
    ssr: false,
    loading: () => <div className="h-96 w-full animate-pulse bg-background" />,
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

const MovementTicker = dynamic(
  () => import("@/components/marketing/movement-ticker"),
  { ssr: false },
);

const SocialsSection = dynamic(
  () => import("@/components/marketing/socials-section"),
  {
    ssr: false,
    loading: () => <div className="h-64 w-full animate-pulse bg-muted" />,
  },
);

const NewsletterPopup = dynamic(
  () => import("@/components/marketing/newsletter-popup"),
  { ssr: false },
);

/**
 * 9-Chapter Documentary Spine:
 * 01. Hook (Hero)
 * 02. Moment (Editorial Prologue Before Budget Day)
 * 03. Impact Proof (Verified stats + OBS context)
 * 04. Method (STORY · TRACK · PARTICIPATE)
 * 05. Partners (Coalition)
 * 06. Intelligence (The Budget Decoded — Dark Engine)
 * 07. Public Voices (What Kenyans Are Saying)
 * 08. People (Investigators & Strategists)
 * 09. Field & Movement (Studios, Ticker, Socials, Community)
 */
export default function PremiumLandingClient() {
  return (
    <>
      <LandingHero />
      <LandingYoutube />
      <ImpactProofBanner />
      <DocumentaryMethodPillars />
      <PartnersMarquee />
      <BudgetDecoderPreview />
      <TestimonialsSection />
      <LandingTeam />
      <BNSStudioSection />
      <MovementTicker />
      <SocialsSection />
      <NewsletterPopup />
    </>
  );
}
