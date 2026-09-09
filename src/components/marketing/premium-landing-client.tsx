"use client";

import React from "react";
import dynamic from "next/dynamic";
import LandingHero from "@/components/marketing/landing-hero";
import { EditorialCtaBand } from "@/components/ui/editorial";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { PROGRAMMES } from "@/content";

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
 * Homepage spine:
 * Hero (TikTok) → Story → Programmes → Partners → Team → Timeline →
 * Testimonials → Socials
 * (Field gallery temporarily hidden; studio evidence lives at /bns-studio)
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
      <SocialsSection />
      <section className="pt-2 pb-14 sm:pb-20 lg:pb-24">
        <div className={SECTION_SHELL_INNER}>
          <EditorialCtaBand
            eyebrow="Start now"
            title="Four programmes built for civic impact."
            description="Track national spending, follow county budgets, train journalists, and commission evidence-based storytelling."
            ctaHref="/programmes"
            ctaLabel="Explore Programmes"
            images={PROGRAMMES.slice(0, 2).map((p) => ({
              src: p.visual.hero,
              alt: p.visual.heroAlt,
            }))}
          />
        </div>
      </section>
      <NewsletterPopup />
    </>
  );
}
