"use client";

import React from "react";
import dynamic from "next/dynamic";
import LandingHero from "@/components/marketing/landing-hero";
import { EditorialCtaBand } from "@/components/ui/editorial";
import { LandingSection } from "@/layouts/landing-section";
import { CIVIC_PROGRAMMES } from "@/content";
import { isSectionVisible } from "@/lib/partner-page-cms";

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

const TestimonialsSection = dynamic(
  () => import("@/components/shadcn-space/blocks/testimonial-01/testimonial"),
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

const NewsletterPopup = dynamic(
  () => import("@/components/marketing/newsletter-popup"),
  { ssr: false },
);

/**
 * Homepage spine driven by `partner-page-sections.json` (≤5 visible blocks).
 * Flip section.visible in CMS — do not delete composers.
 */
export default function PremiumLandingClient() {
  return (
    <>
      {isSectionVisible("home", "hero") ? <LandingHero /> : null}
      {isSectionVisible("home", "storyNearYou") ? <LandingYoutube /> : null}
      {isSectionVisible("home", "programmes") ? <ProgrammesSection /> : null}
      {isSectionVisible("home", "partners") ? <PartnersMarquee /> : null}
      {isSectionVisible("home", "team") ? <LandingTeam /> : null}
      {isSectionVisible("home", "budgetCycle") ? <TimelineSection /> : null}
      {isSectionVisible("home", "testimonials") ? <TestimonialsSection /> : null}
      {isSectionVisible("home", "socials") ? <SocialsSection /> : null}
      {isSectionVisible("home", "cta") ? (
        <LandingSection>
          <EditorialCtaBand
            eyebrow="Start now"
          title="Three programmes built for partner impact."
          description="Track national spending, follow county budgets, and train newsrooms — with production captured through BNS Studio."
          ctaHref="/programmes"
          ctaLabel="Explore Programmes"
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
