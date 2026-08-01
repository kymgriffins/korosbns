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

      <GsapStaggerReveal className="grid gap-5 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
        {PROGRAMMES.map((programme, idx) => {
          const isFeatured = idx === 0;
          return (
            <Link
              key={programme.slug}
              data-gsap-item
              href={programmeHref(programme.slug as ProgrammeSlug)}
              className={cn(
                "group relative block overflow-hidden transition-all duration-500 ease-out",
                "bg-gradient-to-b from-card/90 to-card/50 text-card-foreground",
                "shadow-[0_2px_14px_-2px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]",
                "hover:-translate-y-1.5 hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.04)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isFeatured
                  ? "lg:col-span-6 rounded-[2rem] aspect-[16/10] sm:aspect-[16/9]"
                  : "lg:col-span-3 rounded-3xl aspect-[3/4]"
              )}
            >
              <Image
                src={programme.visual.hero}
                alt={programme.visual.heroAlt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:rotate-[0.5deg]"
                sizes={isFeatured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

              <span className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur-md transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-90 shadow-sm">
                <Plus className="size-4" aria-hidden />
                <span className="sr-only">Open {programme.name}</span>
              </span>

              <div className="absolute inset-x-0 bottom-0 space-y-2 p-5 md:p-6">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] bg-primary/15 text-primary backdrop-blur-sm">
                  {programme.name}
                </span>
                <h3 className={cn(
                  "font-heading font-semibold leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary",
                  isFeatured ? "text-xl md:text-2xl" : "text-base md:text-lg"
                )}>
                  {PROGRAMME_CARD_BLURBS[programme.slug as ProgrammeSlug]}
                </h3>
              </div>
            </Link>
          );
        })}
      </GsapStaggerReveal>

      <LandingContent>
        <LandingSectionCta>
          <LandingSeeMore href={strip.seeMoreHref} label={strip.seeMoreLabel} />
        </LandingSectionCta>
      </LandingContent>
    </LandingSection>
  );
}
