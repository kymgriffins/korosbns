"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LandingContent,
  LandingSection,
} from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  PROGRAMMES,
  PROGRAMMES_CLOSING,
  PROGRAMMES_LANDING,
  PROGRAMME_CARD_BLURBS,
  programmeHref,
} from "@/content";
import { GsapHeroChoreography, GsapReveal, GsapStaggerReveal } from "@/motion/gsap";
import { cn } from "@/utils";

export function ProgrammesLanding() {
  const [featured, ...rest] = PROGRAMMES;

  return (
    <div className="w-full bg-background">
      <GsapHeroChoreography className="relative min-h-[70svh] overflow-hidden border-b border-border/40 md:min-h-[85svh]">
        <div data-gsap-hero-media className="absolute inset-0">
          <Image
            src={featured.visual.hero}
            alt={featured.visual.heroAlt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/50 to-transparent" />
        </div>

        <div
          data-gsap-hero-content
          className="relative z-10 mx-auto flex min-h-[70svh] max-w-[1400px] flex-col justify-end gap-5 px-6 pb-14 pt-28 md:min-h-[85svh] md:px-16 md:pb-20"
        >
          <p className="font-heading text-sm font-semibold text-foreground">Programmes</p>
          <h1 className={cn(T.heroTitle, "max-w-3xl")}>{PROGRAMMES_LANDING.headline}</h1>
          <p className={cn(T.lead, "max-w-2xl text-base text-foreground/80 md:text-lg")}>
            {PROGRAMMES_LANDING.body}
          </p>
          <div>
            <Button asChild size="lg" className={cn(T.btnPrimary, "gap-2")}>
              <a href={PROGRAMMES_LANDING.exploreCta.href}>
                {PROGRAMMES_LANDING.exploreCta.label}
                <ArrowRight className="size-4" aria-hidden />
              </a>
            </Button>
          </div>
        </div>
      </GsapHeroChoreography>

      <LandingSection id="programmes" spacing="loose" aria-labelledby="programmes-grid-heading">
        <GsapReveal className="mb-10 max-w-2xl md:mb-14">
          <h2 id="programmes-grid-heading" className={T.sectionTitle}>
            Four programmes. One civic ecosystem.
          </h2>
        </GsapReveal>

        <GsapStaggerReveal className="grid gap-4 md:grid-cols-12 md:gap-5">
          <Link
            data-gsap-item
            href={programmeHref(featured.slug)}
            className="group relative min-h-[22rem] overflow-hidden rounded-2xl border border-border/50 md:col-span-7 md:min-h-[32rem]"
          >
            <Image
              src={featured.visual.hero}
              alt={featured.visual.heroAlt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 58vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 space-y-2 p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/80">
                {featured.name}
              </p>
              <p className="max-w-md font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {PROGRAMME_CARD_BLURBS[featured.slug]}
              </p>
            </div>
          </Link>

          <div data-gsap-item className="grid gap-4 md:col-span-5 md:grid-rows-3">
            {featured.visual.gallery.map((shot) => (
              <div
                key={shot.src}
                className="relative min-h-[7.5rem] overflow-hidden rounded-2xl border border-border/50 md:min-h-0"
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            ))}
          </div>
        </GsapStaggerReveal>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-10 md:mt-8 md:pb-14">
          <p className="max-w-xl text-sm leading-relaxed text-foreground/70 md:text-base">
            {featured.body.slice(0, 200)}…
          </p>
          <Button asChild className="gap-2">
            <Link href={programmeHref(featured.slug)}>
              Explore {featured.name}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>

        <div className="mt-10 flex flex-col gap-12 md:mt-16 md:gap-20">
          {rest.map((programme, index) => {
            const imageLeft = index % 2 === 0;
            return (
              <GsapReveal
                key={programme.slug}
                as="article"
                id={programme.slug}
                className="grid items-center gap-6 md:grid-cols-12 md:gap-10"
              >
                  <Link
                    href={programmeHref(programme.slug)}
                    className={cn(
                      "group relative min-h-[18rem] overflow-hidden rounded-2xl border border-border/50 md:col-span-6 md:min-h-[26rem]",
                      !imageLeft && "md:order-2",
                    )}
                  >
                    <Image
                      src={programme.visual.hero}
                      alt={programme.visual.heroAlt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-80" />
                  </Link>

                  <div
                    className={cn(
                      "flex flex-col gap-4 md:col-span-6",
                      !imageLeft && "md:order-1",
                    )}
                  >
                    <p className="text-sm font-medium text-muted-foreground">{programme.eyebrow}</p>
                    <p className="font-heading text-sm font-semibold text-foreground">{programme.name}</p>
                    <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                      {programme.headline}
                    </h2>
                    <p className="text-sm leading-relaxed text-foreground/70 md:text-base">
                      {PROGRAMME_CARD_BLURBS[programme.slug]}
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                      {programme.body.slice(0, 220)}…
                    </p>
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      {programme.visual.gallery.map((shot) => (
                        <div
                          key={shot.src}
                          className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/40"
                        >
                          <Image
                            src={shot.src}
                            alt={shot.alt}
                            fill
                            className="object-cover"
                            sizes="120px"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="pt-2">
                      <Button asChild variant="outline" className="gap-2">
                        <Link href={programmeHref(programme.slug)}>
                          Explore {programme.name}
                          <ArrowRight className="size-4" aria-hidden />
                        </Link>
                      </Button>
                    </div>
                  </div>
              </GsapReveal>
            );
          })}
        </div>
      </LandingSection>

      <LandingSection spacing="default" className="bg-muted/30" aria-labelledby="partner-cta-heading">
        <LandingContent className="flex max-w-3xl flex-col gap-5">
          <h2 id="partner-cta-heading" className={cn(T.sectionTitle, "text-balance")}>
            {PROGRAMMES_CLOSING.headline}
          </h2>
          <p className={cn(T.lead, "max-w-2xl text-base text-foreground/75")}>{PROGRAMMES_CLOSING.body}</p>
          <div>
            <Button asChild size="lg" className={cn(T.btnPrimary, "gap-2")}>
              <Link href={PROGRAMMES_CLOSING.cta.href}>
                {PROGRAMMES_CLOSING.cta.label}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </LandingContent>
      </LandingSection>
    </div>
  );
}
