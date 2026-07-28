"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { LandingSeeMore } from "@/components/marketing/landing-see-more";
import { ProgrammePartnerCta } from "@/components/programmes/programme-partner-cta";
import {
  LANDING_SECTION_SURFACE,
  LandingContent,
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  PROGRAMMES,
  PROGRAMMES_LANDING,
  PROGRAMME_CARD_BLURBS,
  programmeHref,
  type ProgrammeBlock,
  type ProgrammeSlug,
} from "@/content";
import {
  GsapHeroChoreography,
  GsapReveal,
  gsap,
  registerGsap,
  useGSAP,
  usePrefersReducedMotion,
} from "@/motion/gsap";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { cn } from "@/utils";

registerGsap();

type ProgrammeCardProps = {
  programme: ProgrammeBlock;
  index: number;
};

function ProgrammeCard({ programme, index }: ProgrammeCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const alignEnd = index % 2 === 1;
  const blurb = PROGRAMME_CARD_BLURBS[programme.slug as ProgrammeSlug];

  useGSAP(
    () => {
      if (reduced) return;
      const root = rootRef.current;
      if (!root) return;

      const media = root.querySelector<HTMLElement>("[data-card-media]");
      const content = root.querySelectorAll<HTMLElement>("[data-card-content] > *");

      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        scrollTrigger: { trigger: root, start: "top 85%", once: true },
      });

      if (media) {
        tl.fromTo(
          media,
          { scale: 1.04, autoAlpha: 0.9, filter: "brightness(0.85)" },
          { scale: 1, autoAlpha: 1, filter: "brightness(1)", duration: 1 },
          0,
        );
      }

      if (content.length) {
        tl.fromTo(
          content,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.6 },
          0.2,
        );
      }
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <div
      ref={rootRef}
      className="group grid gap-8 md:grid-cols-2 md:items-center md:gap-12 lg:gap-16"
    >
      <div
        data-card-media
        className={cn(
          "relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-border/50 md:aspect-[3/2]",
          "transition-shadow duration-500 group-hover:shadow-xl",
          alignEnd && "md:order-2",
        )}
      >
        <Image
          src={programme.visual.hero}
          alt={programme.visual.heroAlt}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={index === 0}
        />
      </div>

      <div data-card-content className={cn(alignEnd && "md:order-1")}>
        <p className="font-heading text-sm font-semibold text-primary">
          {programme.name}
        </p>
        <h2 className={cn(T.sectionTitle, "mt-2 text-balance")}>
          {programme.headline}
        </h2>
        <p className={cn(T.lead, "mt-3 max-w-lg text-foreground/75")}>
          {blurb}
        </p>
        <div className="mt-6">
          <Link
            href={programmeHref(programme.slug)}
            className={cn(
              T.btnPrimary,
              "inline-flex h-11 items-center gap-2 rounded-[10px] bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            Explore {programme.name}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ProgrammesLanding() {
  return (
    <div className="w-full bg-background">
      <GsapHeroChoreography className="relative min-h-[90svh] overflow-hidden border-b border-border/40">
        <div data-gsap-hero-media className="absolute inset-0">
          <Image
            src={PROGRAMMES[0].visual.hero}
            alt={PROGRAMMES[0].visual.heroAlt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-background/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/20 to-transparent" />
        </div>

        <div
          data-gsap-hero-content
          className={cn(
            SECTION_SHELL_INNER,
            "relative z-10 flex min-h-[90svh] flex-col justify-end pb-14 pt-28 md:pb-20",
          )}
        >
          <div className="max-w-3xl">
            <p className="font-heading text-sm font-semibold text-primary">
              Programmes
            </p>
            <h1 className={cn(T.heroTitle, "max-w-3xl text-balance")}>
              {PROGRAMMES_LANDING.headline}
            </h1>
            <p
              className={cn(
                T.lead,
                "mt-4 max-w-2xl text-base text-foreground/80 md:text-lg",
              )}
            >
              {PROGRAMMES_LANDING.body}
            </p>
            <div className="mt-6">
              <LandingSeeMore
                href={PROGRAMMES_LANDING.exploreCta.href}
                label={PROGRAMMES_LANDING.exploreCta.label}
              />
            </div>
          </div>
        </div>
      </GsapHeroChoreography>

      <LandingSection
        id="programmes"
        aria-labelledby="programmes-heading"
      >
        <LandingSectionHeader
          title={
            <>
              <span className="text-primary">Four programmes.</span> One civic ecosystem.
            </>
          }
          description="From national oversight to county scrutiny, journalist training to impact storytelling — every programme is a lever for a more accountable Kenya."
          className="mb-12 md:mb-16"
        />
        <LandingContent>
          <GsapReveal>
            <div className="space-y-16 md:space-y-24 lg:space-y-28">
              {PROGRAMMES.map((programme, index) => (
                <ProgrammeCard
                  key={programme.slug}
                  programme={programme}
                  index={index}
                />
              ))}
            </div>
          </GsapReveal>
        </LandingContent>
      </LandingSection>

      <div className={LANDING_SECTION_SURFACE}>
        <ProgrammePartnerCta />
      </div>
    </div>
  );
}
