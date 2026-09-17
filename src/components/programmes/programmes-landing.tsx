"use client";

import { FeaturedProjectsSection } from "@/components/marketing/featured-projects-section";
import { ProgrammesEcosystemFlywheel, type FlywheelContent } from "@/components/programmes/programmes-ecosystem-flywheel";
import { ProgrammesInvestorMatrix, type MatrixIntro } from "@/components/programmes/programmes-investor-matrix";
import type { MethodologyContent } from "@/components/programmes/programmes-methodology-section";
import { ProgrammesProjectsLoop } from "@/components/programmes/programmes-projects-loop";
import {
  EditorialCtaBand,
  EditorialPill,
  PillButtonGroup,
} from "@/components/ui/editorial";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import type { ProgrammeBlock } from "@/content";
import {
  HERO_SECTION_PADDING,
  SECTION_SHELL_INNER,
} from "@/layouts/section-shell";
import type {
  FeaturedProjectsContent,
  PartnerPageSectionsContent,
  ProgrammesContent,
} from "@/lib/cms-live-data";
import { civicProgrammesFromContent } from "@/lib/cms-live-data";
import { isSectionVisible } from "@/lib/partner-page-cms";
import { cn } from "@/utils";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  getHeroAspectClass,
  getHeroObjectFitClass,
} from "@/lib/design-tokens";
import { useThemePreset } from "@/hooks/use-theme-preset";
import { BrutalistProgrammesHub } from "@/components/marketing/theme-newsroom-layouts";

const PartnersMarquee = dynamic(
  () => import("@/components/marketing/partners-marquee"),
  {
    ssr: false,
    loading: () => <div className="h-32 w-full animate-pulse bg-muted" />,
  },
);

type ProgrammesLandingCms = ProgrammesContent["landing"] & {
  featuredIntro?: {
    eyebrow?: string;
    headline?: string;
    lede?: string;
    openProjectLabel?: string;
    layout?: "list" | "grid";
    columns?: 2 | 3 | 4;
    projectIds?: string[];
  };
  flywheel?: FlywheelContent;
  matrix?: MatrixIntro;
  methodology?: MethodologyContent;
  heroMedia?: {
    src?: string;
    alt?: string;
    aspect?: string;
    objectFit?: string;
  };
  heroText?: {
    headlineItalic?: boolean;
    headlineColor?: string;
    bodyColor?: string;
  };
};

export type ProgrammesLandingProps = {
  programmesData: ProgrammesContent;
  sectionsConfig?: PartnerPageSectionsContent | null;
  featuredProjects?: FeaturedProjectsContent | null;
};

/**
 * Programmes hub - civic education architecture:
 * Hero → Ecosystem Flywheel → Programme matrix → Featured Projects → CTA
 * BNS Studio is separate at /bns-studio.
 */
export function ProgrammesLanding({
  programmesData,
  sectionsConfig,
  featuredProjects,
}: ProgrammesLandingProps) {
  const themePreset = useThemePreset();
  const landing = programmesData.landing as ProgrammesLandingCms;
  const closing = programmesData.closing;
  const civic = civicProgrammesFromContent(programmesData) as ProgrammeBlock[];
  const featuredIntro = landing.featuredIntro;
  const heroMedia = landing.heroMedia;
  const heroText = landing.heroText;
  const heroSrc =
    heroMedia?.src || civic[0]?.visual.hero || "/logo.svg";
  const heroAlt =
    heroMedia?.alt ||
    civic[0]?.visual.heroAlt ||
    "Budget Ndio Story programmes";
  const heroAspect = getHeroAspectClass(heroMedia?.aspect || "16/10");
  const heroFit = getHeroObjectFitClass(heroMedia?.objectFit || "cover");

  const show = (sectionId: string) =>
    isSectionVisible("programmes", sectionId, sectionsConfig);

  if (themePreset === "brutalist") {
    return (
      <BrutalistProgrammesHub
        programmes={civic}
        landing={landing}
        featuredProjects={featuredProjects ?? undefined}
        closing={closing}
      />
    );
  }

  return (
    <div className="w-full min-h-dvh bg-background overflow-x-clip text-foreground">
      {show("hero") ? (
        <section
          className={cn(
            HERO_SECTION_PADDING,
            "border-b border-border/50 bg-background",
          )}
          aria-labelledby="programmes-hero-heading"
        >
          <div className={SECTION_SHELL_INNER}>
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="flex flex-col items-start gap-4 lg:col-span-5">
                <EditorialPill variant="default">
                  Programmes ·
                </EditorialPill>
                <h1
                  id="programmes-hero-heading"
                  className={cn(
                    T.heroTitle,
                    "text-balance",
                    heroText?.headlineItalic && "italic",
                    !heroText?.headlineColor && "text-foreground",
                    heroText?.headlineColor === "primary" && "text-primary",
                    heroText?.headlineColor === "muted" && "text-muted-foreground",
                  )}
                >
                  {landing.headline}
                </h1>
                <p
                  className={cn(
                    T.lead,
                    "max-w-md",
                    !heroText?.bodyColor && "text-foreground/75",
                    heroText?.bodyColor === "muted" && "text-muted-foreground",
                    heroText?.bodyColor === "primary" && "text-primary",
                  )}
                >
                  {landing.body}
                </p>
                {landing.subhead ? (
                  <p
                    className={cn(T.caption, "max-w-xl text-muted-foreground")}
                  >
                    {landing.subhead}
                  </p>
                ) : null}
                <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row sm:items-center">
                  {!(landing.exploreCta as { hidden?: boolean })?.hidden && (
                    <PillButtonGroup
                      href={landing.exploreCta?.href ?? "#programmes-matrix"}
                      label={landing.exploreCta?.label ?? "Explore Programmes"}
                      variant="primary"
                      className="w-full justify-center sm:w-auto"
                    />
                  )}
                  {!(landing as { partnerCta?: { hidden?: boolean } }).partnerCta?.hidden && (
                    <PillButtonGroup
                      href={(landing as { partnerCta?: { label: string; href: string } }).partnerCta?.href ?? "/contact?intent=partner"}
                      label={(landing as { partnerCta?: { label: string; href: string } }).partnerCta?.label ?? "Discuss Partnership"}
                      variant="outline"
                      className="w-full justify-center sm:w-auto"
                    />
                  )}
                </div>
              </div>

              <figure className="space-y-2.5 lg:col-span-7">
                <div
                  className={cn(
                    "relative w-full overflow-hidden rounded-none bg-muted",
                    heroAspect,
                  )}
                >
                  <Image
                    src={heroSrc}
                    alt={heroAlt}
                    fill
                    priority
                    className={heroFit}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>
                <figcaption className={cn(T.caption, "text-muted-foreground")}>
                  {heroAlt}
                </figcaption>
              </figure>
            </div>
          </div>
        </section>
      ) : null}

      {show("flywheel") ? (
        <ProgrammesEcosystemFlywheel content={landing.flywheel} />
      ) : null}

      {show("programmesMap") ? (
        <ProgrammesInvestorMatrix
          programmes={civic}
          studios={
            programmesData.items.find(
              (p) => (p as { slug?: string }).slug === "studios",
            ) as ProgrammeBlock | undefined
          }
          matrix={landing.matrix}
          methodology={landing.methodology}
        />
      ) : null}

      {show("featuredProjects") ? (
        <FeaturedProjectsSection
          eyebrow={featuredIntro?.eyebrow}
          headline={featuredIntro?.headline}
          lede={featuredIntro?.lede}
          openProjectLabel={featuredIntro?.openProjectLabel}
          layout={featuredIntro?.layout === "list" ? "list" : "grid"}
          columns={(featuredIntro?.columns as 2 | 3 | 4) || 3}
          projectIds={featuredIntro?.projectIds}
          initialProjects={
            ((featuredProjects as { results?: unknown[] })?.results ||
              (featuredProjects as { projects?: unknown[] })?.projects) as never
          }
        />
      ) : null}

      {show("partners") ? <PartnersMarquee /> : null}

      {show("projectsLoop") ? <ProgrammesProjectsLoop /> : null}

      {show("cta") ? (
        <EditorialCtaBand
          eyebrow="Next step"
          title={closing.headline}
          description={closing.body}
          ctaHref={closing.cta.href}
          ctaLabel={closing.cta.label}
          images={civic.slice(0, 2).map((p) => ({
            src: p.visual.hero,
            alt: p.visual.heroAlt,
          }))}
        />
      ) : null}
    </div>
  );
}
