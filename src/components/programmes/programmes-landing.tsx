"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingSection } from "@/layouts/landing-section";
import {
  LandingSeeMore,
  LandingSectionCta,
} from "@/components/marketing/landing-see-more";
import { ProgrammePartnerCta } from "@/components/programmes/programme-partner-cta";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  PROGRAMMES,
  PROGRAMMES_LANDING,
  PROGRAMME_CARD_BLURBS,
  programmeHref,
} from "@/content";
import {
  GsapHeroChoreography,
  gsap,
  registerGsap,
  useGSAP,
  usePrefersReducedMotion,
} from "@/motion/gsap";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { cn } from "@/utils";

registerGsap();

export function ProgrammesLanding() {
  const [featured, ...rest] = PROGRAMMES;
  const listRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = listRef.current;
      if (!root || reduced) return;

      const articles = root.querySelectorAll("[data-programme-row]");
      gsap.fromTo(
        articles,
        { autoAlpha: 0, y: 56 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.16,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 82%",
            once: true,
          },
        },
      );
    },
    { scope: listRef, dependencies: [reduced] },
  );

  return (
    <div className="w-full bg-background">
      <GsapHeroChoreography className="relative min-h-[62svh] overflow-hidden border-b border-border/40 md:min-h-[72svh]">
        <div data-gsap-hero-media className="absolute inset-0">
          <Image
            src={featured.visual.hero}
            alt={featured.visual.heroAlt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/50 to-transparent" />
        </div>

        <div
          data-gsap-hero-content
          className={cn(
            SECTION_SHELL_INNER,
            "relative z-10 flex min-h-[62svh] flex-col justify-end gap-5 pb-12 pt-28 md:min-h-[72svh] md:pb-16",
          )}
        >
          <p className="font-heading text-sm font-semibold text-foreground">Programmes</p>
          <h1 className={cn(T.heroTitle, "max-w-3xl text-balance")}>
            {PROGRAMMES_LANDING.headline}
          </h1>
          <p className={cn(T.lead, "max-w-2xl text-base text-foreground/80 md:text-lg")}>
            {PROGRAMMES_LANDING.body}
          </p>
          <div>
            <LandingSeeMore
              href={PROGRAMMES_LANDING.exploreCta.href}
              label={PROGRAMMES_LANDING.exploreCta.label}
            />
          </div>
        </div>
      </GsapHeroChoreography>

      <LandingSection id="programmes" aria-labelledby="programmes-grid-heading">
        <div className="mb-8 max-w-2xl md:mb-10">
          <h2 id="programmes-grid-heading" className={T.sectionTitle}>
            Four programmes. One civic ecosystem.
          </h2>
        </div>

        <Link
          href={programmeHref(featured.slug)}
          className="group relative aspect-[16/9] min-h-[14rem] overflow-hidden rounded-2xl border border-border/50 md:min-h-[20rem]"
        >
          <Image
            src={featured.visual.hero}
            alt={featured.visual.heroAlt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 space-y-2 p-5 md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/80">
              {featured.name}
            </p>
            <p className="max-w-md font-heading text-xl font-bold tracking-tight text-foreground md:text-2xl">
              {PROGRAMME_CARD_BLURBS[featured.slug]}
            </p>
          </div>
        </Link>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-b border-border/40 pb-10 md:mt-10 md:pb-12">
          <p className="max-w-xl text-sm leading-relaxed text-foreground/70 md:text-base">
            {featured.body.slice(0, 200)}…
          </p>
          <LandingSeeMore
            href={programmeHref(featured.slug)}
            label={`Explore ${featured.name}`}
          />
        </div>

        <div ref={listRef} className="mt-12 flex flex-col gap-12 md:mt-14 md:gap-16">
          {rest.map((programme, index) => {
            const imageLeft = index % 2 === 0;
            return (
              <article
                key={programme.slug}
                id={programme.slug}
                data-programme-row
                className="grid items-center gap-5 md:grid-cols-12 md:gap-8"
              >
                <Link
                  href={programmeHref(programme.slug)}
                  className={cn(
                    "group relative aspect-[16/10] overflow-hidden rounded-2xl border border-border/50 md:col-span-5",
                    !imageLeft && "md:order-2",
                  )}
                >
                  <Image
                    src={programme.visual.hero}
                    alt={programme.visual.heroAlt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </Link>

                <div
                  className={cn(
                    "flex flex-col gap-3 md:col-span-7",
                    !imageLeft && "md:order-1",
                  )}
                >
                  <p className="text-sm font-medium text-muted-foreground">{programme.eyebrow}</p>
                  <p className="font-heading text-sm font-semibold text-foreground">{programme.name}</p>
                  <h2 className="font-heading text-2xl font-bold tracking-tight text-balance text-foreground md:text-3xl">
                    {programme.headline}
                  </h2>
                  <p className="max-w-[60ch] text-sm leading-relaxed text-foreground/70 md:text-base">
                    {PROGRAMME_CARD_BLURBS[programme.slug]}
                  </p>
                  <p className="max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
                    {programme.body.slice(0, 180)}…
                  </p>
                  <LandingSectionCta className="mt-1 md:mt-2">
                    <Button asChild variant="outline" className={cn(T.btnPrimary, "gap-2")}>
                      <Link href={programmeHref(programme.slug)}>
                        Explore {programme.name}
                        <ArrowRight className="size-4" aria-hidden />
                      </Link>
                    </Button>
                  </LandingSectionCta>
                </div>
              </article>
            );
          })}
        </div>
      </LandingSection>

      <ProgrammePartnerCta />
    </div>
  );
}
