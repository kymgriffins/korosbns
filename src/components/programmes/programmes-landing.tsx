"use client";

import Link from "next/link";
import Image from "next/image";
import { EditorialCtaBand, EditorialImageCard, EditorialPill } from "@/components/ui/editorial";
import { LandingSection } from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  PROGRAMMES,
  PROGRAMMES_CLOSING,
  PROGRAMMES_LANDING,
  PROGRAMME_CARD_BLURBS,
  programmeHref,
  type ProgrammeSlug,
} from "@/content";
import { GsapHeroChoreography, GsapReveal } from "@/motion/gsap";
import { SECTION_SHELL_INNER, SECTION_SHELL_PADDING } from "@/layouts/section-shell";
import { cn } from "@/utils";

const FEATURED_SLUG: ProgrammeSlug = "connect";

export function ProgrammesLanding() {
  const featured = PROGRAMMES.find((p) => p.slug === FEATURED_SLUG) ?? PROGRAMMES[0];
  const gridProgrammes = PROGRAMMES.filter((p) => p.slug !== featured.slug);

  return (
    <div className="w-full scroll-smooth bg-background">
      {/* Journal-style hero */}
      <section
        className={cn(
          SECTION_SHELL_PADDING,
          "border-b border-border/30 bg-background pt-24 md:pt-28",
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
              className={cn(T.lead, "max-w-sm md:pb-2 md:text-right")}
            >
              {PROGRAMMES_LANDING.body}
            </p>
          </GsapHeroChoreography>
        </div>
      </section>

      {/* Featured programme */}
      <section className={cn(SECTION_SHELL_PADDING, "bg-background")}>
        <div className={SECTION_SHELL_INNER}>
          <GsapReveal>
            <Link
              href={programmeHref(featured.slug)}
              className="group relative block aspect-[16/10] overflow-hidden rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:aspect-[21/9]"
            >
              <Image
                src={featured.visual.hero}
                alt={featured.visual.heroAlt}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                sizes="100vw"
              />
              <div className="editorial-image-card-overlay">
                <p className="mb-1 text-xs font-medium text-white/70">{featured.name}</p>
                <h2 className="font-heading text-2xl font-bold text-white md:text-3xl lg:text-4xl">
                  {featured.headline}
                </h2>
              </div>
            </Link>
          </GsapReveal>
        </div>
      </section>

      {/* Programme grid */}
      <section
        id="programmes"
        className={cn(SECTION_SHELL_PADDING, "border-t border-border/30 bg-background")}
        aria-labelledby="programmes-grid-heading"
      >
        <div className={SECTION_SHELL_INNER}>
          <h2 id="programmes-grid-heading" className="sr-only">
            All programmes
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {gridProgrammes.map((programme, index) => (
              <GsapReveal key={programme.slug}>
                <EditorialImageCard
                  href={programmeHref(programme.slug)}
                  imageSrc={programme.visual.hero}
                  imageAlt={programme.visual.heroAlt}
                  title={PROGRAMME_CARD_BLURBS[programme.slug]}
                  meta={programme.name}
                  priority={index < 2}
                  aspectClassName="aspect-[4/5] sm:aspect-[3/4]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </GsapReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Partner advert CTA */}
      <LandingSection>
        <EditorialCtaBand
          eyebrow="Partner with us"
          title={PROGRAMMES_CLOSING.headline}
          description={PROGRAMMES_CLOSING.body}
          ctaHref={PROGRAMMES_CLOSING.cta.href}
          ctaLabel={PROGRAMMES_CLOSING.cta.label}
          images={PROGRAMMES.slice(1, 3).map((p) => ({
            src: p.visual.hero,
            alt: p.visual.heroAlt,
          }))}
        />
      </LandingSection>
    </div>
  );
}
