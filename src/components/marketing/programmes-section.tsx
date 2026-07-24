"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LandingContent,
  LandingSection,
} from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  PROGRAMMES,
  PROGRAMME_CARD_BLURBS,
  programmeHref,
} from "@/constants/programmes-content";
import { cn } from "@/utils";

/** Homepage programmes — tall image cards (Mason “top places” rhythm), BNS colors. */
export function ProgrammesSection() {
  return (
    <LandingSection id="programmes" spacing="default" aria-labelledby="home-programmes-heading">
      <div className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h2 id="home-programmes-heading" className={T.sectionTitle}>
            Our programmes
          </h2>
          <p className={cn(T.lead, "mt-3 max-w-xl text-base text-foreground/75")}>
            National tracking, county depth, newsroom capacity, and commissioned storytelling.
          </p>
        </div>
        <Button asChild variant="outline" className="w-fit gap-2 rounded-full">
          <Link href="/programmes">
            See more
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {PROGRAMMES.map((programme) => (
          <Link
            key={programme.slug}
            href={programmeHref(programme.slug)}
            className="group relative block aspect-[3/4] overflow-hidden rounded-[1.5rem] border border-border/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Image
              src={programme.visual.hero}
              alt={programme.visual.heroAlt}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />

            <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full border border-border/40 bg-background/85 text-foreground backdrop-blur-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Plus className="size-4" aria-hidden />
              <span className="sr-only">Open {programme.name}</span>
            </span>

            <div className="absolute inset-x-0 bottom-0 space-y-1 p-4 md:p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/80">
                {programme.name}
              </p>
              <p className="font-heading text-base font-semibold leading-snug tracking-tight text-foreground md:text-lg">
                {PROGRAMME_CARD_BLURBS[programme.slug]}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <LandingContent className="mt-8 md:mt-10">
        <Button asChild size="lg" className={cn(T.btnPrimary, "gap-2 rounded-full")}>
          <Link href="/programmes">
            Explore our programmes
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </LandingContent>
    </LandingSection>
  );
}
