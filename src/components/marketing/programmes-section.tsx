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
              "group relative block overflow-hidden rounded-2xl md:rounded-3xl transition-all duration-500 ease-out",
              "aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4]",
              "bg-neutral-950 text-white",
              "border border-border/50 hover:border-primary/60",
              "shadow-sm hover:-translate-y-2 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/40",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            {/* Crisp Background Photo */}
            <Image
              src={programme.visual.hero}
              alt={programme.visual.heroAlt}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />

            {/* Cinematic Scrim - No Milky Wash in Light Mode */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-300 group-hover:opacity-95" />

            {/* Top Right Subtle Action Icon */}
            <div className="absolute top-4 right-4 flex items-center justify-end pointer-events-none">
              <span className="flex size-8 items-center justify-center rounded-full bg-black/40 text-white/90 backdrop-blur-md border border-white/15 transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110 shadow-sm">
                <Plus className="size-4 transition-transform duration-300 group-hover:rotate-45" aria-hidden />
                <span className="sr-only">Open {programme.name}</span>
              </span>
            </div>

            {/* Clean, Premium Bottom Typography */}
            <div className="absolute inset-x-0 bottom-0 space-y-1.5 p-5 md:p-6 text-left">
              <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                {programme.name}
              </p>
              <h3 className="font-heading text-base md:text-lg font-bold leading-snug tracking-tight text-white transition-colors duration-300 group-hover:text-primary-foreground line-clamp-3">
                {PROGRAMME_CARD_BLURBS[programme.slug as ProgrammeSlug]}
              </h3>
              <p className="text-xs text-neutral-300/80 font-medium line-clamp-1 pt-0.5">
                {programme.eyebrow}
              </p>
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
