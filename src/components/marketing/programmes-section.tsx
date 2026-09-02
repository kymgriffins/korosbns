"use client";

import { PillButtonGroup } from "@/components/ui/editorial";
import { ProgrammeScorecard } from "@/components/programmes/programme-scorecard";
import {
  LandingContent,
  LandingSection,
} from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { PROGRAMMES, landingContent } from "@/content";
import { GsapReveal, GsapStaggerReveal } from "@/motion/gsap";
import { cn } from "@/utils";

const strip = landingContent.programmesStrip;

export function ProgrammesSection() {
  return (
    <LandingSection id="programmes" aria-labelledby="home-programmes-heading">
      <GsapReveal className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 id="home-programmes-heading" className={T.sectionTitle}>
            {strip.title}
          </h2>
        </div>
        <p className={cn(T.lead, "max-w-sm md:text-right")}>{strip.description}</p>
      </GsapReveal>

      <GsapStaggerReveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {PROGRAMMES.map((programme, index) => (
          <div key={programme.slug} data-gsap-item>
            <ProgrammeScorecard programme={programme} compact priority={index < 2} />
          </div>
        ))}
      </GsapStaggerReveal>

      <LandingContent>
        <div className="mt-10 flex justify-center md:mt-12">
          <PillButtonGroup href="/programmes" label="Explore Programmes" />
        </div>
      </LandingContent>
    </LandingSection>
  );
}
