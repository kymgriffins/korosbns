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
 * Scrubbed media + staggered content — reduced-motion sees static layout.
 */
export function ProgrammePartnerCta({ className }: { className?: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reduced) return;

      const media = root.querySelector("[data-partner-media]");
      const items = root.querySelectorAll("[data-partner-content] > *");

      if (media) {
        gsap.fromTo(
          media,
          { scale: 1.14, yPercent: -4 },
          {
            scale: 1,
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          },
        );
      }

      if (items.length) {
        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: root,
              start: "top 78%",
              once: true,
            },
          },
        );
      }
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={rootRef}
      aria-labelledby="partner-cta-heading"
      className={cn(
        "relative isolate overflow-hidden border-y border-border/40",
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
        <div className="absolute inset-0 bg-background/92" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/55" />
      </div>

      <div
        className={cn(
          SECTION_SHELL_INNER,
          "flex min-h-[min(52svh,28rem)] flex-col justify-center py-16 md:min-h-[min(48svh,32rem)] md:py-24",
        )}
      >
        <div
          data-partner-content
          className="flex max-w-2xl flex-col gap-5 md:gap-6"
        >
          <p className="font-heading text-sm font-semibold text-foreground">
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
                "inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
