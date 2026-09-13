"use client";

import React from "react";
import dynamic from "next/dynamic";
import PartnerLandingHero from "@/components/marketing/partner-landing-hero";
import { PartnerLandingThesis } from "@/components/marketing/partner-landing-thesis";
import { EditorialCtaBand } from "@/components/ui/editorial";
import { CIVIC_PROGRAMMES } from "@/content";
import { PARTNER_LANDING_CTA } from "@/content/partner-landing";
import { SHOW_NEWSLETTER_POPUP } from "@/lib/marketing-chrome";
import type {
  LandingContent,
  PartnerPageSectionsContent,
  FeaturedProjectsContent,
} from "@/lib/cms-live-data";

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

export interface PremiumLandingClientProps {
  landingData?: Partial<LandingContent>;
  sectionsConfig?: Partial<PartnerPageSectionsContent>;
  featuredProjects?: Partial<FeaturedProjectsContent>;
}

/**
 * Partner homepage spine (RF-shaped, BNS-honest):
 * Dynamic section ordering loaded from CMS (`partner-page-sections.json`).
 * Every text, button, and image is completely configurable via Headless Page Studio.
 */
export default function PremiumLandingClient({
  landingData,
  sectionsConfig,
  featuredProjects,
}: PremiumLandingClientProps = {}) {
  const activeCta = {
    eyebrow: landingData?.partnerCta?.eyebrow ?? PARTNER_LANDING_CTA.eyebrow,
    title: landingData?.partnerCta?.title ?? PARTNER_LANDING_CTA.title,
    description: landingData?.partnerCta?.description ?? PARTNER_LANDING_CTA.description,
    ctaLabel: landingData?.partnerCta?.ctaLabel ?? PARTNER_LANDING_CTA.ctaLabel,
    ctaHref: landingData?.partnerCta?.ctaHref ?? PARTNER_LANDING_CTA.ctaHref,
    ctaVariant: (landingData?.partnerCta as { ctaVariant?: string })?.ctaVariant ?? "primary",
    secondaryLabel: landingData?.partnerCta?.secondaryLabel ?? PARTNER_LANDING_CTA.secondaryLabel,
    secondaryHref: landingData?.partnerCta?.secondaryHref ?? PARTNER_LANDING_CTA.secondaryHref,
    secondaryVariant: (landingData?.partnerCta as { secondaryVariant?: string })?.secondaryVariant ?? "outline",
    buttonAlign: (landingData?.partnerCta as { buttonAlign?: string })?.buttonAlign ?? "right",
    theme: (landingData?.partnerCta as { theme?: string })?.theme ?? "muted",
    hidePrimaryButton: (landingData?.partnerCta as { hidePrimaryButton?: boolean })?.hidePrimaryButton ?? PARTNER_LANDING_CTA.hidePrimaryButton,
    hideSecondaryButton: (landingData?.partnerCta as { hideSecondaryButton?: boolean })?.hideSecondaryButton ?? PARTNER_LANDING_CTA.hideSecondaryButton,
  };

  const homeSections = sectionsConfig?.pages?.home?.sections || [
    { id: "hero", visible: true },
    { id: "whoHow", visible: true },
    { id: "programmeExplains", visible: true },
    { id: "featuredProjects", visible: true },
    { id: "partners", visible: false },
    { id: "cta", visible: true },
  ];

  return (
    <>
      {homeSections.map((sec) => {
        // Live CMS section visibility only - do not double-gate with static bundle.
        if (sec.visible === false) return null;

        switch (sec.id) {
          case "hero":
            return (
              <PartnerLandingHero
                key={sec.id}
                heroNarrative={landingData?.heroNarrative}
                stills={landingData?.heroReelStills as never}
                programmeLines={(landingData as { heroProgrammeLines?: unknown })?.heroProgrammeLines as never}
                primaryCta={{
                  label: activeCta.ctaLabel,
                  href: activeCta.ctaHref || "/contact?intent=partner",
                }}
                secondaryCta={{
                  label: activeCta.secondaryLabel,
                  href: activeCta.secondaryHref || "/programmes",
                }}
                heroCta={(landingData as { heroCta?: unknown })?.heroCta as never}
                heroColors={(landingData as { heroColors?: unknown })?.heroColors as never}
                fontFamily={(landingData as { fontFamily?: unknown })?.fontFamily as string}
              />
            );
          case "whoHow":
            return (
              <PartnerLandingThesis
                key={sec.id}
                thesis={landingData?.thesis}
              />
            );
          case "programmeExplains":
            return (
              <PartnerProgrammeExplainSections
                key={sec.id}
                explains={landingData?.programmeExplains as never}
              />
            );
          case "featuredProjects":
            return (
              <FeaturedProjectsSection
                key={sec.id}
                eyebrow={landingData?.featuredIntro?.eyebrow}
                headline={landingData?.featuredIntro?.headline}
                lede={landingData?.featuredIntro?.lede}
                openProjectLabel={
                  (landingData?.featuredIntro as { openProjectLabel?: string } | undefined)
                    ?.openProjectLabel
                }
                initialProjects={((featuredProjects as { results?: unknown[] })?.results || (featuredProjects as { projects?: unknown[] })?.projects) as never}
              />
            );
          case "partners":
            return (
              <PartnersMarquee
                key={sec.id}
                eyebrow={(landingData as { partnersEyebrow?: string })?.partnersEyebrow || "BNS Partners"}
              />
            );
          case "cta":
            return (
              <EditorialCtaBand
                key={sec.id}
                eyebrow={activeCta.eyebrow}
                title={activeCta.title}
                description={activeCta.description}
                ctaHref={activeCta.hidePrimaryButton ? undefined : (activeCta.ctaHref || "/contact?intent=partner")}
                ctaLabel={activeCta.ctaLabel}
                ctaVariant={activeCta.ctaVariant as never}
                secondaryHref={activeCta.hideSecondaryButton ? undefined : (activeCta.secondaryHref || "/programmes")}
                secondaryLabel={activeCta.secondaryLabel}
                secondaryVariant={activeCta.secondaryVariant as never}
                buttonAlign={activeCta.buttonAlign as never}
                theme={
                  ((sec as { theme?: "default" | "contrast" | "card" | "muted" }).theme ||
                    activeCta.theme) as "default" | "contrast" | "card" | "muted" | undefined
                }
                images={CIVIC_PROGRAMMES.slice(0, 2).map((p) => ({
                  src: p.visual.hero,
                  alt: p.visual.heroAlt,
                }))}
              />
            );
          default:
            return null;
        }
      })}
      {SHOW_NEWSLETTER_POPUP ? <NewsletterPopup /> : null}
    </>
  );
}
