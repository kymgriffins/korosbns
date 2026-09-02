"use client";

import Link from "next/link";
import { landingContent } from "@/content";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { PillButtonGroup } from "@/components/ui/editorial";
import { LandingTikTokPhone } from "@/components/marketing/landing-tiktok-phone";
import { SECTION_SHELL_INNER, SECTION_SHELL_PADDING } from "@/layouts/section-shell";
import { GsapHeroChoreography } from "@/motion/gsap";
import { cn } from "@/utils";

const hero = landingContent.hero;

export default function LandingHero() {
  return (
    <section
      className={cn(SECTION_SHELL_PADDING, "border-b border-border/30 bg-background")}
      aria-labelledby="landing-hero-heading"
    >
      <div className={SECTION_SHELL_INNER}>
        <GsapHeroChoreography className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div
            data-gsap-hero-content
            className="flex flex-col gap-5 lg:col-span-6"
          >
            <span className="font-heading text-sm font-semibold text-foreground">
              {hero.brand}
            </span>
            <h1 id="landing-hero-heading" className={cn(T.heroTitle, "max-w-xl text-balance")}>
              {hero.headlineBefore}{" "}
              <span className={T.highlight}>{hero.headlineHighlight}</span>
            </h1>
            <p className={cn(T.lead, "max-w-xl")}>{hero.body}</p>
            <div className="mt-2 md:mt-4">
              <PillButtonGroup href="/programmes" label="Explore Programmes" />
            </div>
          </div>

          <div data-gsap-hero-media className="flex justify-center lg:col-span-6 lg:justify-end">
            <LandingTikTokPhone />
          </div>
        </GsapHeroChoreography>
      </div>
    </section>
  );
}
