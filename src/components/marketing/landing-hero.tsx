"use client";

import Link from "next/link";
import { landingContent } from "@/content";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { PillButtonGroup } from "@/components/ui/editorial";
import { LandingHeroTicker } from "@/components/marketing/landing-hero-ticker";
import { LandingTikTokPhone } from "@/components/marketing/landing-tiktok-phone";
import { HERO_SECTION_PADDING, SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { GsapHeroChoreography } from "@/motion/gsap";
import { cn } from "@/utils";

const hero = landingContent.hero;

export default function LandingHero() {
  return (
    <section
      className={cn(HERO_SECTION_PADDING, "border-b border-border/30 bg-background overflow-hidden")}
      aria-labelledby="landing-hero-heading"
    >
      <div className={cn(SECTION_SHELL_INNER, "w-full min-w-0 max-w-full")}>
        <GsapHeroChoreography className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10 w-full min-w-0 max-w-full">
          <div
            data-gsap-hero-content
            className="flex flex-col items-start gap-4 lg:col-span-6 lg:gap-5 lg:pt-2 w-full min-w-0 max-w-full overflow-hidden"
          >
            {/* Live Civic News & Ad Stream - decluttered, full-width, single pill */}
            <LandingHeroTicker />

            <h1 id="landing-hero-heading" className={cn(T.heroTitle, "max-w-xl text-balance")}>
              {hero.headlineBefore}{" "}
              <span className={T.highlight}>{hero.headlineHighlight}</span>
            </h1>

            <p className={cn(T.lead, "max-w-xl")}>{hero.body}</p>

            {/* Exactly 1 Primary CTA Button on mobile; secondary available on sm+ */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full sm:w-auto">
              <PillButtonGroup
                href={hero.primaryCta.href}
                label={hero.primaryCta.label}
                variant="primary"
                className="w-full sm:w-auto justify-center"
              />
              <PillButtonGroup
                href={hero.secondaryCta.href}
                label={hero.secondaryCta.label}
                variant="outline"
                className="hidden sm:inline-flex w-full sm:w-auto justify-center"
              />
            </div>
          </div>

          <div
            data-gsap-hero-media
            className="flex justify-center lg:col-span-6 lg:justify-end lg:pt-0"
          >
            <LandingTikTokPhone />
          </div>
        </GsapHeroChoreography>
      </div>
    </section>
  );
}
