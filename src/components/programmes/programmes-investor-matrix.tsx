"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield } from "lucide-react";
import { LandingSection } from "@/layouts/landing-section";
import { EditorialPill } from "@/components/ui/editorial";
import { ProgrammesMethodologySection } from "@/components/programmes/programmes-methodology-section";
import { CIVIC_PROGRAMMES, getProgramme, programmeHref } from "@/content";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { cn } from "@/utils";

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
          Three distinct, non-overlapping interventions spanning national macro-policy, county delivery, and investigative newsrooms.
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
                        Bet {number}
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
                          The Problem (Why):
                        </span>
                        <p className="mt-0.5 text-sm leading-relaxed text-foreground/85">
                          {programme.investorThesis || programme.highlight}
                        </p>
                      </div>
                      <div className="pt-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          The Intervention (What):
                        </span>
                        <p className="mt-0.5 text-sm leading-relaxed text-foreground/85">
                          {programme.whatWeDo || programme.body}
                        </p>
                      </div>
                    </div>

                    {/* Deliverables Partners Can Fund & Cite */}
                    {programme.deliverables && programme.deliverables.length > 0 ? (
                      <div className="space-y-2.5 pt-1">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Outputs Partners Fund & Cite:
                        </h4>
                        <ul className="space-y-2">
                          {programme.deliverables.map((item) => (
                            <li
                              key={item.title}
                              className="flex items-start gap-2.5 text-sm"
                            >
                              <CheckCircle2
                                className="mt-0.5 size-4 shrink-0 text-primary"
                                aria-hidden="true"
                              />
                              <div>
                                <span className="font-semibold text-foreground">
                                  {item.title}:
                                </span>{" "}
                                <span className="text-foreground/75">
                                  {item.description}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>

                  {/* Actions & Metrics */}
                  <div className="mt-8 flex flex-col gap-4 border-t border-border/40 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={href}
                        className="inline-flex items-center text-sm font-semibold text-foreground transition-colors hover:text-primary"
                      >
                        Read programme dossier
                        <ArrowRight className="ml-1 size-4" aria-hidden="true" />
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
      {studios ? (
        <div className="mt-12 border border-border/60 bg-muted/20 p-6 sm:p-10">
          <div className="grid items-start gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              <div className="flex items-center gap-2">
                <Shield className="size-4 text-primary" aria-hidden="true" />
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  The Sustainable Engine
                </span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground">
                {studios.name}: {studios.headline}
              </h3>
              <p className="text-sm leading-relaxed text-foreground/80 md:text-base">
                {studios.whatWeDo || studios.body}
              </p>
              <div className="pt-2">
                <Link
                  href="/bns-studio"
                  className="inline-flex items-center text-sm font-semibold text-foreground transition-colors hover:text-primary"
                >
                  Commission BNS Studios & view reel
                  <ArrowRight className="ml-1 size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-center border-t border-border/40 pt-6 lg:col-span-4 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Dual-Impact Model
              </p>
              <p className="mt-2 font-heading text-3xl font-bold text-foreground">
                2× Impact
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                High-craft production for your mandate + commercial surplus directly cross-subsidizes independent public finance scrutiny.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </LandingSection>
  );
}
