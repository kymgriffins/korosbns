"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { LandingSeeMore } from "@/components/marketing/landing-see-more";
import { ProgrammePartnerCta } from "@/components/programmes/programme-partner-cta";
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
  gsap,
  registerGsap,
  useGSAP,
  usePrefersReducedMotion,
} from "@/motion/gsap";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { cn } from "@/utils";

registerGsap();

type ScenicStageProps = {
  programme: ProgrammeBlock;
  index: number;
};

/**
 * One programme = one scenic viewport.
 * Desktop: pin + scrub (parallax media, copy reveal, CTA settle).
 * Mobile: light parallax + once-reveal — no heavy pinning.
 * Reduced motion: static, fully readable layout.
 */
function ProgrammeScenicStage({ programme, index }: ScenicStageProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const alignEnd = index % 2 === 1;
  const blurb = PROGRAMME_CARD_BLURBS[programme.slug as ProgrammeSlug];

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reduced) return;

      const media = root.querySelector<HTMLElement>("[data-scenic-media]");
      const copy = root.querySelectorAll<HTMLElement>("[data-scenic-copy] > *");
      const cta = root.querySelector<HTMLElement>("[data-scenic-cta]");

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "power4.out" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=120%",
            pin: true,
            scrub: 0.5,
          },
        });

        if (media) {
          tl.fromTo(
            media,
            { scale: 1.08, yPercent: -4, filter: "brightness(0.7)" },
            { scale: 1, yPercent: 0, filter: "brightness(1)" },
            0,
          );
        }

        if (copy.length) {
          tl.fromTo(
            copy,
            { autoAlpha: 0, y: 48, filter: "blur(4px)" },
            { autoAlpha: 1, y: 0, filter: "blur(0px)", stagger: 0.08 },
            0.08,
          );
        }

        if (cta) {
          tl.fromTo(
            cta,
            { autoAlpha: 0, y: 24, filter: "blur(2px)" },
            { autoAlpha: 1, y: 0, filter: "blur(0px)" },
            0.35,
          );
        }
      });

      mm.add("(max-width: 767px)", () => {
        if (media) {
          gsap.fromTo(
            media,
            { scale: 1.06, yPercent: -2, filter: "brightness(0.8)" },
            {
              scale: 1,
              yPercent: 0,
              filter: "brightness(1)",
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.4,
              },
            },
          );
        }

        const mobileTargets = [...copy, ...(cta ? [cta] : [])];
        if (mobileTargets.length) {
          gsap.fromTo(
            mobileTargets,
            { autoAlpha: 0, y: 28, filter: "blur(3px)" },
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.65,
              stagger: 0.08,
              ease: "power4.out",
              scrollTrigger: {
                trigger: root,
                start: "top 78%",
                once: true,
              },
            },
          );
        }
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={rootRef}
      id={programme.slug}
      aria-labelledby={`${programme.slug}-scenic-heading`}
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden rounded-[1.5rem] border border-border/30 md:items-center"
    >
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div
          data-scenic-media
          className="absolute inset-0 will-change-transform"
        >
          <Image
            src={programme.visual.hero}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority={index === 0}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-background/15 to-transparent" />
        <div
          className={cn(
            "absolute inset-0",
            alignEnd
              ? "bg-gradient-to-l from-background/60 via-background/20 to-transparent"
              : "bg-gradient-to-r from-background/60 via-background/20 to-transparent",
          )}
        />
      </div>

      <div
        className={cn(
          SECTION_SHELL_INNER,
          "relative z-10 flex w-full flex-col gap-6 py-16 md:gap-8 md:py-20",
          alignEnd ? "md:items-end md:text-right" : "md:items-start",
        )}
      >
        <div
          data-scenic-copy
          className={cn(
            "flex max-w-xl flex-col gap-4 md:gap-5",
            alignEnd && "md:items-end",
          )}
        >
          <p className="font-heading text-sm font-semibold text-primary">
            {programme.name}
          </p>
          <h2
            id={`${programme.slug}-scenic-heading`}
            className={cn(
              T.heroTitle,
              "max-w-[16ch] text-balance text-foreground",
            )}
          >
            {programme.headline}
          </h2>
          <p className="max-w-[40ch] text-base leading-relaxed text-foreground/80 md:text-lg">
            {blurb}
          </p>
        </div>

        <div data-scenic-cta>
          <Link
            href={programmeHref(programme.slug)}
            className={cn(
              T.btnPrimary,
              "inline-flex h-11 items-center gap-2 rounded-[10px] bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            Explore {programme.name}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ProgrammesLanding() {
  const bridgeRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = bridgeRef.current;
      if (!root || reduced) return;

      const items = root.querySelectorAll("[data-bridge-content] > *");
      if (!items.length) return;

      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            once: true,
          },
        },
      );
    },
    { scope: bridgeRef, dependencies: [reduced] },
  );

  return (
    <div className="w-full bg-background">
      <GsapHeroChoreography className="relative min-h-[100svh] overflow-hidden border-b border-border/40">
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
            "relative z-10 flex min-h-[100svh] flex-col justify-end gap-8 pb-14 pt-28 md:pb-20",
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

      <section
        ref={bridgeRef}
        id="programmes"
        aria-labelledby="programmes-bridge-heading"
        className="border-b border-border/40 bg-background"
      >
        <div
          className={cn(
            SECTION_SHELL_INNER,
            "flex min-h-[min(42svh,22rem)] flex-col justify-center py-14 md:min-h-[min(36svh,20rem)] md:py-16",
          )}
        >
          <div data-bridge-content className="max-w-2xl">
            <h2
              id="programmes-bridge-heading"
              className={cn(T.sectionTitle, "text-balance")}
            >
              <span className="text-primary">Four programmes.</span> One civic ecosystem.
            </h2>
            <p className="mt-3 text-base text-foreground/70 md:text-lg">
              From national oversight to county scrutiny, journalist training to impact storytelling — every programme is a lever for a more accountable Kenya.
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-6 px-4 py-6 md:space-y-8 md:px-8 md:py-10">
        {PROGRAMMES.map((programme, index) => (
          <ProgrammeScenicStage
            key={programme.slug}
            programme={programme}
            index={index}
          />
        ))}
      </div>

      <ProgrammePartnerCta />
    </div>
  );
}
