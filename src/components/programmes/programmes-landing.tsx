"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { EditorialCtaBand, EditorialPill, PillButtonGroup } from "@/components/ui/editorial";
import { ProgrammeScorecard } from "@/components/programmes/programme-scorecard";
import { ProgrammesProjectsLoop } from "@/components/programmes/programmes-projects-loop";
import { FeaturedProjectsSection } from "@/components/marketing/featured-projects-section";
import {
  LandingSection,
} from "@/layouts/landing-section";
import {
  HERO_SECTION_PADDING,
  SECTION_SHELL_INNER,
} from "@/layouts/section-shell";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  CIVIC_PROGRAMMES,
  PROGRAMMES_CLOSING,
  PROGRAMMES_LANDING,
} from "@/content";
import { isSectionVisible } from "@/lib/partner-page-cms";
import { cn } from "@/utils";

const PartnersMarquee = dynamic(
  () => import("@/components/marketing/partners-marquee"),
  {
    ssr: false,
    loading: () => <div className="h-32 w-full animate-pulse bg-muted" />,
  },
);

/**
 * Programmes hub — partner spine matching `/`:
 * Hero → three programmes → partners → (projects muted) → CTA
 * BNS Studio is separate at /bns-studio.
 */
export function ProgrammesLanding() {
  const landing = PROGRAMMES_LANDING;

  return (
    <div className="w-full min-h-dvh bg-background overflow-x-clip text-foreground">
      {isSectionVisible("programmes", "hero") ? (
        <section
          className={cn(HERO_SECTION_PADDING, "border-b border-border/50 bg-background")}
          aria-labelledby="programmes-hero-heading"
        >
          <div className={SECTION_SHELL_INNER}>
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="flex flex-col items-start gap-4 lg:col-span-5">
                <EditorialPill dot pulse variant="default">
                  Three programmes · evidence via BNS Studio
                </EditorialPill>
                <h1
                  id="programmes-hero-heading"
                  className={cn(T.heroTitle, "text-balance text-foreground")}
                >
                  {landing.headline}
                </h1>
                <p className={cn(T.lead, "max-w-md text-foreground/75")}>
                  {landing.body}
                </p>
                {landing.subhead ? (
                  <p className={cn(T.caption, "max-w-xl text-muted-foreground")}>
                    {landing.subhead}
                  </p>
                ) : null}
                <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row sm:items-center">
                  <PillButtonGroup
                    href="#programmes-map"
                    label={landing.exploreCta?.label ?? "Explore Programmes"}
                    variant="primary"
                    className="w-full justify-center sm:w-auto"
                  />
                  <PillButtonGroup
                    href="/bns-studio"
                    label="BNS Studio"
                    variant="outline"
                    className="w-full justify-center sm:w-auto"
                  />
                </div>
              </div>

              <figure className="space-y-2.5 lg:col-span-7">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted md:aspect-[16/10]">
                  <Image
                    src={CIVIC_PROGRAMMES[0]?.visual.hero ?? "/logo.svg"}
                    alt={CIVIC_PROGRAMMES[0]?.visual.heroAlt ?? "Budget Ndio Story programmes"}
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>
                <figcaption className={cn(T.caption, "text-muted-foreground")}>
                  {CIVIC_PROGRAMMES[0]?.visual.heroAlt ?? "Budget Ndio Story programmes"}
                </figcaption>
              </figure>
            </div>
          </div>
        </section>
      ) : null}

      {isSectionVisible("programmes", "programmesMap") ? (
        <LandingSection
          id="programmes-map"
          aria-labelledby="programmes-map-heading"
          className="border-t border-border/50"
        >
          <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 id="programmes-map-heading" className={T.sectionTitle}>
                The three programmes
              </h2>
            </div>
            <p className={cn(T.lead, "max-w-sm md:text-right")}>
              Connect, Mashinani, and Wanahabari — one recognizable format. Production and commissions live in BNS Studio.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {CIVIC_PROGRAMMES.map((programme, index) => (
              <ProgrammeScorecard
                key={programme.slug}
                programme={programme}
                compact
                priority={index < 2}
              />
            ))}
          </div>
        </LandingSection>
      ) : null}

      {isSectionVisible("programmes", "featuredProjects") ? (
        <FeaturedProjectsSection
          headline="Featured projects across the programmes"
          lede="Published YouTube evidence — illicit financial flows, CABRI digital PFM, and Project TERRA — with thumbnails and titles refreshed from the source URLs."
        />
      ) : null}

      {isSectionVisible("programmes", "partners") ? <PartnersMarquee /> : null}

      {isSectionVisible("programmes", "projectsLoop") ? (
        <ProgrammesProjectsLoop />
      ) : null}

      {isSectionVisible("programmes", "cta") ? (
        <EditorialCtaBand
          eyebrow="Next step"
          title={PROGRAMMES_CLOSING.headline}
          description={PROGRAMMES_CLOSING.body}
          ctaHref={PROGRAMMES_CLOSING.cta.href}
          ctaLabel={PROGRAMMES_CLOSING.cta.label}
          images={CIVIC_PROGRAMMES.slice(0, 2).map((p) => ({
            src: p.visual.hero,
            alt: p.visual.heroAlt,
          }))}
        />
      ) : null}
    </div>
  );
}
