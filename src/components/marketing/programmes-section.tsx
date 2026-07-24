"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LandingContent,
  LandingSection,
  LandingSectionEyebrow,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  PROGRAMMES,
  PROGRAMMES_LANDING,
  PROGRAMME_CARD_BLURBS,
  programmeHref,
} from "@/constants/programmes-content";
import { cn } from "@/utils";

/** Homepage programmes strip — youth/public tone. */
export function ProgrammesSection() {
  return (
    <LandingSection id="programmes" spacing="default" aria-labelledby="home-programmes-heading">
      <LandingSectionEyebrow>Our programmes</LandingSectionEyebrow>
      <LandingSectionHeader
        title={<span id="home-programmes-heading">{PROGRAMMES_LANDING.headline}</span>}
        description={PROGRAMMES_LANDING.body}
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PROGRAMMES.map((programme) => (
          <Link
            key={programme.slug}
            href={programmeHref(programme.slug)}
            className="group flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {programme.name}
            </p>
            <p className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
              {PROGRAMME_CARD_BLURBS[programme.slug]}
            </p>
          </Link>
        ))}
      </div>
      <LandingContent className="mt-8">
        <Button asChild size="lg" className={cn(T.btnPrimary, "gap-2")}>
          <Link href="/programmes">
            Explore our programmes
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </LandingContent>
    </LandingSection>
  );
}
