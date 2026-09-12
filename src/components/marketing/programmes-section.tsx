"use client";

import { PillButtonGroup } from "@/components/ui/editorial";
import { ProgrammeScorecard } from "@/components/programmes/programme-scorecard";
import {
  LandingContent,
  LandingSection,
} from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  CIVIC_PROGRAMMES,
  cloudinaryUrl,
  landingContent,
} from "@/content";
import { cn } from "@/utils";

const strip = landingContent.programmesStrip;
const featured = landingContent.storyIntro;

export function ProgrammesSection() {
  return (
    <LandingSection id="programmes" aria-labelledby="home-programmes-heading">
      <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 id="home-programmes-heading" className={T.sectionTitle}>
            {strip.title}
          </h2>
        </div>
        <p className={cn(T.lead, "max-w-sm md:text-right")}>{strip.description}</p>
      </div>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        {CIVIC_PROGRAMMES.map((programme, index) => (
          <ProgrammeScorecard
            key={programme.slug}
            programme={programme}
            compact
            priority={index < 2}
          />
        ))}
      </div>

      {/* Featured programme evidence - Latif / House of Fiscal Wisdom (replaces Budget Mtaani series) */}
      <LandingContent className="mt-12 md:mt-14">
        <p className={cn(T.eyebrow, "mb-2 text-muted-foreground")}>
          Featured project
        </p>
        <p className="mb-4 font-heading text-sm font-semibold text-foreground md:text-base">
          {featured.seriesLabelBefore}{" "}
          <span className={T.highlight}>{featured.seriesHighlight}</span>{" "}
          {featured.seriesLabelAfter}
        </p>
        <p className={cn(T.caption, "mb-4 max-w-2xl text-muted-foreground")}>
          {featured.body}
        </p>
        <div className="relative aspect-video overflow-hidden bg-muted">
          <iframe
            src={cloudinaryUrl("youtubeEmbed")}
            title={featured.youtubeTitle}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </LandingContent>

      <LandingContent>
        <div className="mt-10 flex justify-center md:mt-12">
          <PillButtonGroup href="/programmes" label="Explore Programmes" />
        </div>
      </LandingContent>
    </LandingSection>
  );
}
