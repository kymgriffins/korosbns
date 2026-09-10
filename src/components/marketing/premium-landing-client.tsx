"use client";

import React from "react";
import dynamic from "next/dynamic";
import PartnerLandingHero from "@/components/marketing/partner-landing-hero";
import { EditorialCtaBand } from "@/components/ui/editorial";
import { CIVIC_PROGRAMMES } from "@/content";
import { isSectionVisible } from "@/lib/partner-page-cms";
import { SHOW_NEWSLETTER_POPUP } from "@/lib/marketing-chrome";

/** Below-fold: defer so hero stills paint first. */
const PartnerProgrammeExplainSections = dynamic(
  () =>
    import("@/components/marketing/partner-programme-explain").then((m) => ({
      default: m.PartnerProgrammeExplainSections,
    })),
  { loading: () => <div className="min-h-[40vh] w-full bg-background" aria-hidden /> },
);

/**
 * Seed JSON renders immediately; YouTube refresh runs in useEffect and must
 * never block first paint.
 */
const FeaturedProjectsSection = dynamic(
  () =>
    import("@/components/marketing/featured-projects-section").then((m) => ({
      default: m.FeaturedProjectsSection,
    })),
  { loading: () => <div className="min-h-[50vh] w-full bg-background" aria-hidden /> },
);

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
 * Partner homepage spine:
 * Hero reel → 3 programme stories → featured YouTube projects → CTA
 * Learner capture (newsletter popup) muted via SHOW_NEWSLETTER_POPUP.
 */
export default function PremiumLandingClient() {
  return (
    <>
      {isSectionVisible("home", "hero") ? <PartnerLandingHero /> : null}
      {isSectionVisible("home", "programmeExplains") ? (
        <PartnerProgrammeExplainSections />
      ) : null}
      {isSectionVisible("home", "featuredProjects") ? (
        <FeaturedProjectsSection />
      ) : null}
      {isSectionVisible("home", "partners") ? <PartnersMarquee /> : null}
      {isSectionVisible("home", "cta") ? (
        <EditorialCtaBand
          eyebrow="Partnership"
          title="Three programmes. One accountability system."
          description="Co-fund national budget intelligence, county delivery verification, or newsroom scrutiny — with production captured through BNS Studio."
          ctaHref="/contact?intent=partner"
          ctaLabel="Discuss a partnership"
          secondaryHref="/programmes"
          secondaryLabel="View programmes"
          images={CIVIC_PROGRAMMES.slice(0, 2).map((p) => ({
            src: p.visual.hero,
            alt: p.visual.heroAlt,
          }))}
        />
      ) : null}
      {SHOW_NEWSLETTER_POPUP ? <NewsletterPopup /> : null}
    </>
  );
}
