"use client";

import { EditorialCtaBand, EditorialPill, PillButtonGroup } from "@/components/ui/editorial";
import { ProgrammesPartners } from "@/components/programmes/programmes-partners";
import { ProgrammesImpactHub } from "@/components/work-hub/programmes-impact-hub";
import { LandingSection } from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { PROGRAMMES_CLOSING, PROGRAMMES_LANDING } from "@/content";
import { GsapHeroChoreography } from "@/motion/gsap";
import { HERO_SECTION_PADDING, SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { cn } from "@/utils";

export function ProgrammesLanding() {
  return (
    <div className="w-full scroll-smooth bg-background">
      <section
        className={cn(
          HERO_SECTION_PADDING,
          "border-b border-border/30 bg-background",
        )}
      >
        <div className={SECTION_SHELL_INNER}>
          <GsapHeroChoreography className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
            <div data-gsap-hero-content className="max-w-2xl space-y-4">
              <EditorialPill>Programmes</EditorialPill>
              <h1 className={cn(T.heroTitle, "text-balance text-foreground")}>
                {PROGRAMMES_LANDING.headline}
              </h1>
            </div>
            <p
              data-gsap-hero-content
              className={cn(T.lead, "max-w-md md:pb-2 md:text-right")}
            >
              {PROGRAMMES_LANDING.body}
            </p>
          </GsapHeroChoreography>
          <div data-gsap-hero-content className="mt-8">
            <PillButtonGroup
              href={PROGRAMMES_LANDING.exploreCta.href}
              label={PROGRAMMES_LANDING.exploreCta.label}
            />
          </div>
        </div>
      </section>

      <ProgrammesImpactHub />

      <ProgrammesPartners />

      <LandingSection>
        <EditorialCtaBand
          eyebrow="Partner with BNS"
          title={PROGRAMMES_CLOSING.headline}
          description={PROGRAMMES_CLOSING.body}
          ctaHref={PROGRAMMES_CLOSING.cta.href}
          ctaLabel={PROGRAMMES_CLOSING.cta.label}
        />
      </LandingSection>
    </div>
  );
}
