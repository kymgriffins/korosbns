"use client";

import { EditorialPill, PillButtonGroup } from "@/components/ui/editorial";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { getProgramme } from "@/content";
import { GsapHeroChoreography } from "@/motion/gsap";
import { HERO_SECTION_PADDING, SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { cn } from "@/utils";

const studios = getProgramme("studios")!;

export function StudioHero() {
  return (
    <section
      className={cn(
        HERO_SECTION_PADDING,
        "border-b border-border/30 bg-background",
      )}
    >
      <div className={SECTION_SHELL_INNER}>
        <GsapHeroChoreography className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
          <div data-gsap-hero-content className="max-w-2xl space-y-4">
            <EditorialPill>BNS Studios</EditorialPill>
            <h1 className={cn(T.heroTitle, "text-balance text-foreground")}>
              {studios.headline}
            </h1>
          </div>
          <p
            data-gsap-hero-content
            className={cn(T.lead, "max-w-md md:pb-2 md:text-right")}
          >
            {studios.body}
          </p>
        </GsapHeroChoreography>
        <div data-gsap-hero-content className="mt-8">
          <PillButtonGroup href="#projects" label="Explore commissioned work" />
        </div>
      </div>
    </section>
  );
}
