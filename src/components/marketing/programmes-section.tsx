"use client";

import Link from "next/link";
import Image from "next/image";
import {
  LandingContent,
  LandingSection,
} from "@/layouts/landing-section";
import {
  LandingSeeMore,
  LandingSectionCta,
} from "@/components/marketing/landing-see-more";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  PROGRAMMES,
  PROGRAMME_CARD_BLURBS,
  programmeHref,
  landingContent,
  type ProgrammeSlug,
} from "@/content";
import { GsapReveal, GsapStaggerReveal } from "@/motion/gsap";
import { cn } from "@/utils";
import { Plus } from "lucide-react";

const strip = landingContent.programmesStrip;

export function ProgrammesSection() {
  return (
    <LandingSection id="programmes" aria-labelledby="home-programmes-heading">
      <GsapReveal className="mb-8 max-w-2xl md:mb-10">
        <h2 id="home-programmes-heading" className={T.sectionTitle}>
          {strip.title}
        </h2>
        <p className={cn(T.lead, "mt-3 max-w-xl text-base text-foreground/75")}>
          {strip.description}
        </p>
      </GsapReveal>

      <GsapStaggerReveal className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {PROGRAMMES.map((programme) => (
          <Link
            key={programme.slug}
            data-gsap-item
            href={programmeHref(programme.slug as ProgrammeSlug)}
            className={cn(
              "group relative block overflow-hidden rounded-3xl transition-all duration-500 ease-out",
              "aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] xl:aspect-[3/4]",
              "bg-gradient-to-b from-card/90 to-card/50 text-card-foreground",
              "shadow-[0_2px_14px_-2px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]",
              "hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.18),0_6px_16px_rgba(0,0,0,0.06)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-border/40 hover:border-primary/50"
            )}
          >
            <Image
              src={programme.visual.hero}
              alt={programme.visual.heroAlt}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-108 group-hover:rotate-[0.5deg]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

            <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-background/80 text-foreground/80 backdrop-blur-md border border-border/40">
                {programme.eyebrow}
              </span>
              <span className="flex size-9 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur-md transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-90 shadow-sm border border-border/40">
                <Plus className="size-4" aria-hidden />
                <span className="sr-only">Open {programme.name}</span>
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 space-y-2 p-5 md:p-6">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.16em] bg-primary/20 text-primary backdrop-blur-sm border border-primary/30">
                {programme.name}
              </span>
              <h3 className="font-heading text-sm md:text-base font-bold leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary line-clamp-3">
                {PROGRAMME_CARD_BLURBS[programme.slug as ProgrammeSlug]}
              </h3>
            </div>
          </Link>
        ))}
      </GsapStaggerReveal>

      <LandingContent>
        <LandingSectionCta>
          <LandingSeeMore href={strip.seeMoreHref} label={strip.seeMoreLabel} />
        </LandingSectionCta>
      </LandingContent>
    </LandingSection>
  );
}
