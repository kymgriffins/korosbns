"use client";

import React from "react";
import Image from "next/image";
import { cloudinaryUrl, landingContent } from "@/content";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  LandingContent,
  LandingSection,
} from "@/layouts/landing-section";
import {
  LandingSeeMore,
  LandingSectionCta,
} from "@/components/marketing/landing-see-more";
import { GsapReveal, GsapStaggerReveal } from "@/motion/gsap";
import { cn } from "@/utils";

const intro = landingContent.storyIntro;

export default function LandingYoutube() {
  return (
    <LandingSection>
      <div className="mb-8 grid items-center gap-8 md:mb-10 md:grid-cols-12 md:gap-10">
        <GsapReveal className="flex flex-col gap-4 md:col-span-5">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Prologue · Where It Starts
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Before Budget Day
          </h2>
          <p className="text-sm font-semibold text-foreground/90 sm:text-base leading-snug">
            The numbers arrive long before the speech.
          </p>
          <p className={cn(T.lead, "max-w-md text-xs sm:text-sm text-foreground/75 leading-relaxed")}>
            We track what happens before, during, and after — from backroom parliamentary estimates to county hearing halls, bringing you inside the real story of Kenya&apos;s money.
          </p>
          <LandingSectionCta className="mt-0 md:mt-2">
            <LandingSeeMore href="/budgetnews" label="Watch the series" />
          </LandingSectionCta>
        </GsapReveal>
        <GsapStaggerReveal className="grid grid-cols-2 gap-3 md:col-span-7 md:gap-4">
          {intro.images.map((image) => (
            <div
              key={image.src}
              data-gsap-item
              className="relative aspect-[5/4] overflow-hidden rounded-[1.25rem] border border-border/50 md:rounded-[1.5rem]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 30vw"
              />
            </div>
          ))}
        </GsapStaggerReveal>
      </div>

      <GsapReveal y={24}>
        <LandingContent>
          <p className="mb-4 font-heading text-sm font-semibold text-foreground">
            {intro.seriesLabelBefore}{" "}
            <span className={T.highlight}>{intro.seriesHighlight}</span>{" "}
            {intro.seriesLabelAfter}
          </p>
          <div className="relative aspect-video overflow-hidden rounded-[1.5rem] border border-border/50 bg-muted md:rounded-[2rem]">
            <iframe
              src={cloudinaryUrl("youtubeEmbed")}
              title={intro.youtubeTitle}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </LandingContent>
      </GsapReveal>
    </LandingSection>
  );
}
