"use client";

import React from "react";
import dynamic from "next/dynamic";
import PartnerLandingHero from "@/components/marketing/partner-landing-hero";
import { PartnerLandingThesis } from "@/components/marketing/partner-landing-thesis";
import { EditorialCtaBand } from "@/components/ui/editorial";
import { CIVIC_PROGRAMMES } from "@/content";
import { PARTNER_LANDING_CTA } from "@/content/partner-landing";
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
 * Partner homepage spine (RF-shaped, BNS-honest):
 * Hero reel → thesis/who-how → 3 numbered bets → featured evidence → CTA
 * Learner capture (newsletter popup) muted via SHOW_NEWSLETTER_POPUP.
 */
export default function PremiumLandingClient() {
  return (
    <>
      {isSectionVisible("home", "hero") ? <PartnerLandingHero /> : null}
      {isSectionVisible("home", "whoHow") ? <PartnerLandingThesis /> : null}
      {isSectionVisible("home", "programmeExplains") ? (
        <PartnerProgrammeExplainSections />
      ) : null}
      {isSectionVisible("home", "featuredProjects") ? (
        <FeaturedProjectsSection />
      ) : null}
      {isSectionVisible("home", "partners") ? <PartnersMarquee /> : null}
      {isSectionVisible("home", "cta") ? (
        <EditorialCtaBand
          eyebrow={PARTNER_LANDING_CTA.eyebrow}
          title={PARTNER_LANDING_CTA.title}
          description={PARTNER_LANDING_CTA.description}
          ctaHref={PARTNER_LANDING_CTA.hidePrimaryButton ? undefined : (PARTNER_LANDING_CTA.ctaHref || "/contact?intent=partner")}
          ctaLabel={PARTNER_LANDING_CTA.ctaLabel}
          secondaryHref={PARTNER_LANDING_CTA.hideSecondaryButton ? undefined : (PARTNER_LANDING_CTA.secondaryHref || "/programmes")}
          secondaryLabel={PARTNER_LANDING_CTA.secondaryLabel}
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
