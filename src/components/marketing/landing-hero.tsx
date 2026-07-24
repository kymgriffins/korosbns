"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { landingContent, cloudinaryUrl } from "@/content";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { SECTION_SHELL_INNER } from "@/layouts/landing-section";
import { GsapHeroChoreography } from "@/motion/gsap";
import { cn } from "@/utils";

const hero = landingContent.hero;

export default function LandingHero() {
  return (
    <section
      className="relative w-full overflow-hidden border-b border-border/40 bg-background text-foreground"
      aria-labelledby="landing-hero-heading"
    >
      <div className={cn(SECTION_SHELL_INNER, "pb-10 pt-4 md:pb-14 md:pt-6")}>
        <GsapHeroChoreography className="relative min-h-[70svh] overflow-hidden rounded-[1.75rem] border border-border/50 md:min-h-[78svh] md:rounded-[2rem]">
          <div data-gsap-hero-media className="absolute inset-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              onError={(e) => {
                console.warn("Hero video failed to load:", e);
              }}
              className="absolute inset-0 size-full object-cover"
            >
              <source src={cloudinaryUrl("heroLandingVideoMp4")} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/25 to-transparent" />
          </div>

          <div
            data-gsap-hero-content
            className="relative z-10 flex min-h-[70svh] flex-col justify-end gap-6 p-6 md:min-h-[78svh] md:p-10 lg:p-14"
          >
            <span className="font-heading text-sm font-semibold text-foreground">
              {hero.brand}
            </span>
            <h1 id="landing-hero-heading" className={cn(T.heroTitle, "max-w-2xl text-foreground")}>
              {hero.headlineBefore}{" "}
              <span className={T.highlight}>{hero.headlineHighlight}</span>
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-foreground/80 md:text-base">
              {hero.body}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" variant="white" className={cn(T.btnHero, "rounded-full")}>
                <Link href={hero.primaryCta.href}>
                  {hero.primaryCta.label}
                  <ArrowRight className="size-5" aria-hidden />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-foreground/20 bg-background/70 backdrop-blur-sm"
              >
                <Link href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
              </Button>
            </div>
          </div>
        </GsapHeroChoreography>
      </div>
    </section>
  );
}
