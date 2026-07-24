"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LandingContent,
  LandingSection,
  LandingSectionEyebrow,
} from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import type { ProgrammeBlock } from "@/constants/programmes-content";
import { PROGRAMMES_CLOSING } from "@/constants/programmes-content";
import { cn } from "@/utils";

export function ProgrammeDetail({ programme }: { programme: ProgrammeBlock }) {
  return (
    <div className="w-full bg-background">
      <LandingSection spacing="default" animateOnMount className="border-t-0">
        <LandingContent className="flex max-w-3xl flex-col gap-6">
          <Link
            href="/programmes"
            className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-4" aria-hidden />
            All programmes
          </Link>
          <LandingSectionEyebrow>{programme.eyebrow}</LandingSectionEyebrow>
          <p className="text-sm font-semibold text-foreground">{programme.name}</p>
          <h1 className={cn(T.heroTitle, "max-w-3xl text-balance")}>{programme.headline}</h1>
          <p className={cn(T.lead, "max-w-2xl")}>{programme.body}</p>
          {programme.formats ? (
            <p className="text-sm font-medium text-foreground">{programme.formats}</p>
          ) : null}
          {programme.highlight ? (
            <p className="rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-sm font-medium leading-relaxed text-foreground">
              {programme.highlight}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg" className={cn(T.btnPrimary, "gap-2")}>
              <Link href={programme.cta.href}>
                {programme.cta.label}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/programmes">View all programmes</Link>
            </Button>
          </div>
        </LandingContent>
      </LandingSection>

      <LandingSection spacing="default" className="bg-muted/30">
        <LandingContent className="flex max-w-2xl flex-col gap-4">
          <h2 className={cn(T.sectionTitle)}>{PROGRAMMES_CLOSING.headline}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{PROGRAMMES_CLOSING.body}</p>
          <Button asChild variant="outline" className="w-fit gap-2">
            <Link href={PROGRAMMES_CLOSING.cta.href}>
              {PROGRAMMES_CLOSING.cta.label}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </LandingContent>
      </LandingSection>
    </div>
  );
}
