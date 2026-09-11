"use client";

import { ProgrammesMethodologySection } from "@/components/programmes/programmes-methodology-section";
import { EditorialPill } from "@/components/ui/editorial";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { CIVIC_PROGRAMMES, getProgramme, programmeHref } from "@/content";
import { LandingSection } from "@/layouts/landing-section";
import { cn } from "@/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ProgrammesInvestorMatrix() {
  const studios = getProgramme("studios");

  return (
    <LandingSection
      id="programmes-matrix"
      aria-labelledby="matrix-heading"
      className="border-t border-border/50"
    >
      <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-3">
          <EditorialPill dot pulse variant="default">
            The Three Big Bets
          </EditorialPill>
          <h2 id="matrix-heading" className={T.sectionTitle}>
            Where partners invest
          </h2>
        </div>
        <p className={cn(T.lead, "max-w-md md:text-right")}>
          Three distinct, non-overlapping interventions spanning national
          macro-policy, county delivery, and investigative newsrooms.
        </p>
      </div>

      {/* The 3 Civic Big Bets */}
      <div className="space-y-12">
        {CIVIC_PROGRAMMES.map((programme, index) => {
          const number = `0${index + 1}`;
          const reverse = index % 2 === 1;
          const href = programmeHref(programme.slug);

          return (
            <article
              key={programme.slug}
              className="border border-border/60 bg-background transition-colors hover:border-primary/40"
            >
              <div
                className={cn(
                  "grid items-stretch gap-8 lg:grid-cols-12",
                  reverse && "lg:[&>*:first-child]:order-2",
                )}
              >
                {/* Left Column / Text Dossier */}
                <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
                  <div className="space-y-6">
                    {/* Header: Number & Mandate */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">
                        {number}
                      </span>
                      <span aria-hidden className="text-border">
                        ·
                      </span>
                      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        {programme.eyebrow}
                      </span>
                      {programme.mandateFit ? (
                        <>
                          <span aria-hidden className="text-border">
                            ·
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {programme.mandateFit}
                          </span>
                        </>
                      ) : null}
                    </div>

                    {/* Headline */}
                    <div className="space-y-2">
                      <h3 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                        {programme.name}
                      </h3>
                      <p className="font-heading text-base font-medium text-foreground/90 md:text-lg">
                        {programme.headline}
                      </p>
                    </div>

                    {/* Why & What (Minimalist scannable lines) */}
                    <div className="space-y-3 rounded-none border-l-2 border-primary/60 bg-muted/20 p-4">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          The Conundrum:
                        </span>
                        <p className="mt-0.5 text-sm leading-relaxed text-foreground/85">
                          {programme.investorThesis || programme.highlight}
                        </p>
                      </div>
                      <div className="pt-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          The Intervention :
                        </span>
                        <p className="mt-0.5 text-sm leading-relaxed text-foreground/85">
                          {programme.whatWeDo || programme.body}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Metrics */}
                  <div className="mt-8 flex flex-col gap-4 border-t border-border/40 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={href}
                        className="inline-flex items-center text-sm font-semibold text-foreground transition-colors hover:text-primary"
                      >
                        Read programme dossier
                        <ArrowRight
                          className="ml-1 size-4"
                          aria-hidden="true"
                        />
                      </Link>
                      <span aria-hidden className="text-border">
                        |
                      </span>
                      <Link
                        href={`/contact?intent=partner&programme=${programme.slug}`}
                        className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Discuss co-funding →
                      </Link>
                    </div>

                    {/* Scale metric */}
                    {programme.stats && programme.stats[0] ? (
                      <div className="flex items-baseline gap-2">
                        <span className="font-heading text-xl font-bold tracking-tight text-foreground md:text-2xl">
                          {programme.stats[0].value}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {programme.stats[0].label}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Right Column / High-Craft Evidence Still */}
                <figure className="relative min-h-[280px] w-full overflow-hidden bg-muted lg:col-span-5 lg:min-h-full">
                  <Image
                    src={programme.visual.hero}
                    alt={programme.visual.heroAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-center"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-background/85 px-4 py-2 text-xs text-muted-foreground backdrop-blur-xs">
                    {programme.visual.heroAlt}
                  </figcaption>
                </figure>
              </div>
            </article>
          );
        })}
      </div>

      {/* The 4-Stage Verification Methodology */}
      <ProgrammesMethodologySection asSubSection />

      {/* The Engine: BNS Studio */}
    </LandingSection>
  );
}
