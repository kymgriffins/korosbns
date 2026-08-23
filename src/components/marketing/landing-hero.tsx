"use client";

import Link from "next/link";
import { landingContent } from "@/content";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  LandingSeeMore,
  LandingSectionCta,
} from "@/components/marketing/landing-see-more";
import { LandingTikTokPhone } from "@/components/marketing/landing-tiktok-phone";
import { SECTION_SHELL_INNER, SECTION_SHELL_PADDING } from "@/layouts/section-shell";
import { GsapHeroChoreography } from "@/motion/gsap";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";

const hero = landingContent.hero;

export default function LandingHero() {
  return (
    <section
      className={cn(SECTION_SHELL_PADDING, "border-b border-border/40 bg-background")}
      aria-labelledby="landing-hero-heading"
    >
      <div className={SECTION_SHELL_INNER}>
        <GsapHeroChoreography className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div
            data-gsap-hero-content
            className="flex flex-col gap-6 lg:col-span-6"
          >
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-primary">
              <span>Civic Media & Budget Intelligence</span>
            </div>
            <h1 id="landing-hero-heading" className={cn(T.heroTitle, "max-w-xl text-balance text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight")}>
              Follow the budget.{" "}
              <span className={cn(T.highlight, "bg-gradient-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent")}>
                Find the story.
              </span>
            </h1>
            <p className={cn(T.lead, "max-w-lg text-base sm:text-lg text-foreground/80 leading-relaxed")}>
              Kenya’s budget is a story of where public money goes, who gets heard, and what gets built. We follow the numbers before, during, and after Budget Day.
            </p>
            <LandingSectionCta className="mt-2 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="rounded-full bg-primary px-7 py-6 text-sm font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-[1.02]">
                <Link href="/reports">Follow the Budget</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full border-border/80 px-7 py-6 text-sm font-bold hover:bg-muted transition-all">
                <Link href="/budgetnews">Explore Stories</Link>
              </Button>
            </LandingSectionCta>
          </div>

          <div data-gsap-hero-media className="flex justify-center lg:col-span-6 lg:justify-end">
            <LandingTikTokPhone />
          </div>
        </GsapHeroChoreography>
      </div>
    </section>
  );
}
