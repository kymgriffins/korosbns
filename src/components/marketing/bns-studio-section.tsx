"use client";

import Image from "next/image";
import { BNS_STUDIO_LANDING_SHOWCASE } from "@/constants/bns-studio-content";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { landingContent } from "@/content";
import {
  LandingSeeMore,
  LandingSectionCta,
} from "@/components/marketing/landing-see-more";
import {
  LandingContent,
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import { GsapReveal } from "@/motion/gsap";
import { cn } from "@/utils";

/** Single Studios fold on the homepage — one story, one CTA. */
export function BNSStudioSection() {
  const strip = landingContent.studioStrip;
  const featured = BNS_STUDIO_LANDING_SHOWCASE[0];

  return (
    <LandingSection className="overflow-hidden">
      <LandingSectionHeader
        title={
          <>
            {strip.titleBefore}{" "}
            <span className={T.highlight}>{strip.titleHighlight}</span>
          </>
        }
        description={strip.description}
      />

      <LandingContent>
        <div className="grid items-center gap-8 md:grid-cols-12 md:gap-10">
          <GsapReveal className="md:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/50 md:rounded-[1.5rem]">
              <Image
                src={featured.image}
                alt={`${featured.name} — BNS Studios production`}
                fill
                className="object-cover object-[center_top]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </GsapReveal>

          <GsapReveal y={24} className="flex flex-col gap-5 md:col-span-6">
            <p className={cn(T.body, "max-w-xl")}>{strip.highlight}</p>
            <LandingSectionCta className="mt-0 md:mt-2">
              <LandingSeeMore
                href={strip.seeMoreHref}
                label={strip.seeMoreLabel}
              />
            </LandingSectionCta>
          </GsapReveal>
        </div>
      </LandingContent>
    </LandingSection>
  );
}
