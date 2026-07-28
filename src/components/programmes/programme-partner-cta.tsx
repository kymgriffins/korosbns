"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { PROGRAMMES, PROGRAMMES_CLOSING } from "@/content";
import {
  gsap,
  registerGsap,
  useGSAP,
  usePrefersReducedMotion,
} from "@/motion/gsap";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { cn } from "@/utils";

registerGsap();

const partnerVisual = PROGRAMMES.find((p) => p.slug === "studios")?.visual.hero
  ?? PROGRAMMES[0]?.visual.hero;

/**
 * Shared Partner CTA for /programmes and programme detail.
 * Scenic closing beat: pin+scrub on desktop, light parallax on mobile.
 * Reduced-motion sees a static, readable layout.
 */
export function ProgrammePartnerCta({ className }: { className?: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reduced) return;

      const media = root.querySelector<HTMLElement>("[data-partner-media]");
      const items = root.querySelectorAll<HTMLElement>("[data-partner-content] > *");

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=90%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });

        if (media) {
          tl.fromTo(
            media,
            { scale: 1.16, yPercent: -5 },
            { scale: 1, yPercent: 0 },
            0,
          );
        }

        if (items.length) {
          tl.fromTo(
            items,
            { autoAlpha: 0, y: 44 },
            { autoAlpha: 1, y: 0, stagger: 0.07 },
            0.15,
          );
        }
      });

      mm.add("(max-width: 767px)", () => {
        if (media) {
          gsap.fromTo(
            media,
            { scale: 1.1, yPercent: -3 },
            {
              scale: 1,
              yPercent: 0,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.55,
              },
            },
          );
        }

        if (items.length) {
          gsap.fromTo(
            items,
            { autoAlpha: 0, y: 32 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.09,
              ease: "power3.out",
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
      aria-labelledby="partner-cta-heading"
      className={cn(
        "relative isolate flex min-h-[100svh] items-center overflow-hidden border-y border-border/40",
        className,
      )}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        {partnerVisual ? (
          <div data-partner-media className="absolute inset-0 will-change-transform">
            <Image
              src={partnerVisual}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
      </div>

      <div
        className={cn(
          SECTION_SHELL_INNER,
          "relative z-10 flex w-full flex-col justify-center py-16 md:py-20",
        )}
      >
        <div
          data-partner-content
          className="flex max-w-2xl flex-col gap-5 md:gap-6"
        >
          <p className="font-heading text-sm font-semibold text-primary">
            Next step
          </p>
          <h2
            id="partner-cta-heading"
            className={cn(T.sectionTitle, "text-balance")}
          >
            {PROGRAMMES_CLOSING.headline}
          </h2>
          <p className={cn(T.lead, "max-w-xl text-base text-foreground/75 md:text-lg")}>
            {PROGRAMMES_CLOSING.body}
          </p>
          <div>
            <Link
              href={PROGRAMMES_CLOSING.cta.href}
              className={cn(
                T.btnPrimary,
                "inline-flex h-11 items-center gap-2 rounded-[10px] bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              {PROGRAMMES_CLOSING.cta.label}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
