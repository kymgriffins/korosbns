"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { LandingSeeMore } from "@/components/marketing/landing-see-more";
import { ProgrammesEcosystemBar } from "@/components/programmes/programmes-ecosystem-bar";
import { ProgrammesTeamTeaser } from "@/components/programmes/programmes-team-teaser";
import { ProgrammesLatestContent } from "@/components/programmes/programmes-latest-content";
import { ProgrammesFaq } from "@/components/programmes/programmes-faq";
import { ProgrammesContactSection } from "@/components/programmes/programmes-contact-section";
import {
  LANDING_SECTION_SURFACE,
  LandingContent,
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  PROGRAMMES,
  PROGRAMMES_LANDING,
  PROGRAMME_CARD_BLURBS,
  programmeHref,
  type ProgrammeBlock,
  type ProgrammeSlug,
} from "@/content";
import { GsapHeroChoreography, GsapReveal } from "@/motion/gsap";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { cn } from "@/utils";

type ProgrammeCardProps = {
  programme: ProgrammeBlock;
  index: number;
};

function ProgrammeCard({ programme, index }: ProgrammeCardProps) {
  const alignEnd = index % 2 === 1;
  const blurb = PROGRAMME_CARD_BLURBS[programme.slug as ProgrammeSlug];

  return (
    <GsapReveal className="group grid gap-8 md:grid-cols-2 md:items-center md:gap-12 lg:gap-16">
      <div
        data-card-media
        className={cn(
          "relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-border/50 md:aspect-[3/2]",
          "transition-shadow duration-500 group-hover:shadow-xl",
          alignEnd && "md:order-2",
        )}
      >
        <Image
          src={programme.visual.hero}
          alt={programme.visual.heroAlt}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={index === 0}
        />
      </div>

      <div data-card-content className={cn(alignEnd && "md:order-1")}>
        <p className="font-heading text-sm font-semibold text-primary">
          {programme.name}
        </p>
        <h2 className={cn(T.sectionTitle, "mt-2 text-balance")}>
          {programme.headline}
        </h2>
        <p className={cn(T.lead, "mt-3 max-w-lg text-foreground/75")}>
          {blurb}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={programmeHref(programme.slug)}
            className={cn(
              T.btnPrimary,
              "inline-flex h-11 items-center gap-2 rounded-[10px] bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            Explore {programme.name}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </GsapReveal>
  );
}

export function ProgrammesLanding() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Budget Ndio Story",
    alternateName: "BNS",
    url: "https://budgetndiostory.org/programmes",
    logo: "https://budgetndiostory.org/logo.svg",
    description: "Kenya's leading youth civic initiative tracking national and county public spending, training journalists, and producing impact media.",
    sameAs: [
      "https://youtube.com/@budgetndiostory",
      "https://www.linkedin.com/company/budget-ndio-story/",
      "https://www.tiktok.com/@budget.ndio.story",
    ],
  };

  return (
    <div className="w-full bg-background scroll-smooth">
      {/* Organization Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Mobile-first Hero without background image */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-muted/40 via-background to-background py-16 md:py-24 lg:py-28">
        {/* Subtle ambient accent glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-72 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
        
        <div className={cn(SECTION_SHELL_INNER, "relative z-10")}>
          <GsapHeroChoreography className="max-w-3xl">
            <span data-gsap-hero-content className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-4">
              Our Initiatives & Impact Ecosystem
            </span>
            <h1 data-gsap-hero-content className={cn(T.heroTitle, "max-w-3xl text-balance text-foreground")}>
              {PROGRAMMES_LANDING.headline}
            </h1>
            <p data-gsap-hero-content className={cn(T.lead, "mt-4 max-w-2xl text-base text-muted-foreground md:text-lg")}>
              {PROGRAMMES_LANDING.body}
            </p>
            <div data-gsap-hero-content className="mt-6">
              <LandingSeeMore
                href={PROGRAMMES_LANDING.exploreCta.href}
                label={PROGRAMMES_LANDING.exploreCta.label}
              />
            </div>
          </GsapHeroChoreography>
        </div>
      </section>

      {/* 1. Ecosystem Pipeline Diagram (TRACK -> LOCALISE -> TRAIN -> PRODUCE) */}
      <ProgrammesEcosystemBar />

      {/* 2. Core Four Programmes Section */}
      <LandingSection
        id="programmes"
        aria-labelledby="programmes-heading"
      >
        <LandingSectionHeader
          title={
            <>
              <span className="text-primary">Four programmes.</span> One civic ecosystem.
            </>
          }
          description="From national oversight to county scrutiny, journalist training to impact storytelling — every programme is a lever for a more accountable Kenya."
          className="mb-12 md:mb-16"
        />
        <LandingContent>
          <div className="space-y-16 md:space-y-24 lg:space-y-28">
            {PROGRAMMES.map((programme, index) => (
              <ProgrammeCard
                key={programme.slug}
                programme={programme}
                index={index}
              />
            ))}
          </div>
        </LandingContent>
      </LandingSection>

      {/* 5. Team & Leadership Teaser */}
      <ProgrammesTeamTeaser />

      {/* 6. Latest Stories & Reports Preview */}
      <ProgrammesLatestContent />

      {/* 7. FAQ Block + FAQ Schema */}
      <ProgrammesFaq />

      {/* 8. Dedicated Contact & Newsletter Section */}
      <ProgrammesContactSection />
    </div>
  );
}
