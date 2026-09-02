"use client";

import Link from "next/link";
import Image from "next/image";
import {
  LandingContent,
  LandingSection,
} from "@/layouts/landing-section";
import { PillButtonGroup } from "@/components/ui/editorial";
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

const strip = landingContent.programmesStrip;

export function ProgrammesSection() {
  return (
    <LandingSection id="programmes" aria-labelledby="home-programmes-heading">
      <GsapReveal className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 id="home-programmes-heading" className={T.sectionTitle}>
            {strip.title}
          </h2>
        </div>
        <p className={cn(T.lead, "max-w-sm md:text-right")}>{strip.description}</p>
      </GsapReveal>

      <GsapStaggerReveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {PROGRAMMES.map((programme) => (
          <Link
            key={programme.slug}
            data-gsap-item
            href={programmeHref(programme.slug as ProgrammeSlug)}
            className={cn(
              "group relative block overflow-hidden rounded-3xl",
              "aspect-[3/4] sm:aspect-[4/5]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <Image
              src={programme.visual.hero}
              alt={programme.visual.heroAlt}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="editorial-image-card-overlay">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-white/80">
                {programme.name}
              </p>
              <h3 className="font-heading text-base font-bold leading-snug text-white md:text-lg line-clamp-3">
                {PROGRAMME_CARD_BLURBS[programme.slug as ProgrammeSlug]}
              </h3>
            </div>
          </Link>
        ))}
      </GsapStaggerReveal>

      <LandingContent>
        <div className="mt-10 flex justify-center md:mt-12">
          <PillButtonGroup href="/programmes" label="Explore Programmes" />
        </div>
      </LandingContent>
    </LandingSection>
  );
}
