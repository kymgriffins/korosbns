"use client";

import React from "react";
import dynamic from "next/dynamic";
import PartnerLandingHero from "@/components/marketing/partner-landing-hero";
import { PartnerProgrammeExplainSections } from "@/components/marketing/partner-programme-explain";
import { EditorialCtaBand } from "@/components/ui/editorial";
import { LandingSection } from "@/layouts/landing-section";
import { CIVIC_PROGRAMMES } from "@/content";
import { isSectionVisible } from "@/lib/partner-page-cms";

const PartnersMarquee = dynamic(
  () => import("@/components/marketing/partners-marquee"),
  {
    ssr: false,
    loading: () => <div className="h-32 w-full animate-pulse bg-muted" />,
  },
);

const NewsletterPopup = dynamic(
  () => import("@/components/marketing/newsletter-popup"),
  { ssr: false },
);

/**
 * Partner homepage spine (≤5 blocks):
 * Hero (project reel) → 3 programme explains → partners → CTA
 * TikTok / youth education composers remain in repo but are not rendered.
 */
export default function PremiumLandingClient() {
  return (
    <>
      {isSectionVisible("home", "hero") ? <PartnerLandingHero /> : null}
      {isSectionVisible("home", "programmeExplains") ? (
        <PartnerProgrammeExplainSections />
      ) : null}
      {isSectionVisible("home", "partners") ? <PartnersMarquee /> : null}
      {isSectionVisible("home", "cta") ? (
        <LandingSection>
          <EditorialCtaBand
            eyebrow="Next step"
            title="Three programmes. One evidence system."
            description="Partner on national tracking, county embeds, or newsroom capacity — with production captured through BNS Studio."
            ctaHref="/contact?intent=partner"
            ctaLabel="Partner with BNS"
            secondaryHref="/programmes"
            secondaryLabel="Explore Programmes"
            images={CIVIC_PROGRAMMES.slice(0, 2).map((p) => ({
              src: p.visual.hero,
              alt: p.visual.heroAlt,
            }))}
          />
        </LandingSection>
      ) : null}
      <NewsletterPopup />
    </>
  );
}
