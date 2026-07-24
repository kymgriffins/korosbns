"use client";

import React from "react";
import dynamic from "next/dynamic";
import LandingHero from "@/components/marketing/landing-hero";
import { ProgrammesSection } from "@/components/marketing/programmes-section";
import { HomeProofSection } from "@/components/marketing/home-proof-section";
import { HomeClosingCta } from "@/components/marketing/home-closing-cta";

const PartnersMarquee = dynamic(
  () => import("@/components/marketing/partners-marquee"),
  {
    loading: () => <div className="h-32 w-full bg-muted/40" aria-hidden />,
  }
);

const BNSStudioSection = dynamic(
  () => import("@/components/marketing/bns-studio-section").then((m) => ({ default: m.BNSStudioSection })),
  {
    loading: () => <div className="h-96 w-full bg-muted/40" aria-hidden />,
  }
);

const NewsletterPopup = dynamic(
  () => import("@/components/marketing/newsletter-popup"),
  { ssr: false }
);

/**
 * Homepage spine (Civic Studio):
 * 1. Hero — brand + claim + atmosphere
 * 2. Proof — reports / credibility
 * 3. Programmes — image-led ecosystem
 * 4. Partners — trust
 * 5. Studios + closing partner CTA
 */
export default function PremiumLandingClient() {
  return (
    <>
      <LandingHero />
      <HomeProofSection />
      <ProgrammesSection />
      <PartnersMarquee />
      <BNSStudioSection />
      <HomeClosingCta />
      <NewsletterPopup />
    </>
  );
}
