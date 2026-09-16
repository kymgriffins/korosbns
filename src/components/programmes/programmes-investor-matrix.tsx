"use client";

import { ProgrammesMethodologySection, type MethodologyContent } from "@/components/programmes/programmes-methodology-section";
import { EditorialPill } from "@/components/ui/editorial";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { programmeHref, type ProgrammeBlock } from "@/content";
import { LandingSection } from "@/layouts/landing-section";
import { cn } from "@/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type MatrixIntro = {
  eyebrow?: string;
  headline?: string;
  lede?: string;
};

export function ProgrammesInvestorMatrix({
  programmes = [],
  studios,
  matrix,
  methodology,
}: {
  programmes?: ProgrammeBlock[];
  studios?: ProgrammeBlock | null;
  matrix?: MatrixIntro | null;
  methodology?: MethodologyContent | null;
}) {
  void studios;

  return (
    <LandingSection
      id="programmes-matrix"
      aria-labelledby="matrix-heading"
      className="border-t border-border/50"
    >
      <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-3">
          <EditorialPill variant="default">
            {matrix?.eyebrow ?? "Our programmes"}
          </EditorialPill>
          <h2 id="matrix-heading" className={T.sectionTitle}>
            {matrix?.headline ?? "Where the work happens"}
          </h2>
        </div>
        <p className={cn(T.lead, "max-w-md md:text-right")}>
          {matrix?.lede ??
            "Three distinct programmes spanning national budget tracking, county delivery, and investigative newsrooms."}
        </p>
      </div>

      <div className="space-y-12">
        {programmes.map((programme, index) => {
          const reverse = index % 2 === 1;
          const href = programmeHref(programme.slug);

          return (
            <article
              key={programme.slug}
              className="border-y border-border/50 bg-background first:border-t-0"
            >
              <div
                className={cn(
                  "grid items-stretch gap-8 lg:grid-cols-12",
                  reverse && "lg:[&>*:first-child]:order-2",
                )}
              >
                <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        {programme.eyebrow}
                      </span>
                      {programme.mandateFit ? (
                        <>
                          <span aria-hidden className="text-border">
                            |
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {programme.mandateFit}
                          </span>
                        </>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                        {programme.name}
                      </h3>
                      <p className="font-heading text-base font-medium text-foreground/90 md:text-lg">
                        {programme.headline}
                      </p>
                    </div>

                    <div className="space-y-3 bg-muted/20 p-4">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          The challenge
                        </span>
                        <p className="mt-0.5 text-sm leading-relaxed text-foreground/85">
                          {programme.investorThesis || programme.highlight}
                        </p>
                      </div>
                      <div className="pt-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          What we do
                        </span>
                        <p className="mt-0.5 text-sm leading-relaxed text-foreground/85">
                          {programme.whatWeDo || programme.body}
                        </p>
                      </div>
                    </div>
                  </div>

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
                        href={`/contact?programme=${programme.slug}`}
                        className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Contact the team →
                      </Link>
                    </div>

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

      <ProgrammesMethodologySection asSubSection content={methodology} />
    </LandingSection>
  );
}
