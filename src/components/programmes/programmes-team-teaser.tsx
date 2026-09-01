"use client";

import { ShieldCheck } from "lucide-react";
import { PillButtonGroup } from "@/components/ui/editorial";
import { LandingContent, LandingSection } from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { cn } from "@/utils";

export function ProgrammesTeamTeaser() {
  return (
    <LandingSection id="who-we-are" aria-labelledby="who-we-are-heading">
      <LandingContent>
        <div className="editorial-surface flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-2">
            <span className={T.eyebrow}>Credibility</span>
            <h2 id="who-we-are-heading" className={cn(T.sectionTitle, "text-xl md:text-2xl")}>
              Researchers, journalists, and civic technologists
            </h2>
            <p className={cn(T.lead)}>
              Independent analysis, verified Treasury and CoB sources, and storytelling built for
              young Kenyans.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5 shrink-0 text-foreground" />
              Non-partisan · open data
            </div>
            <PillButtonGroup href="/about" label="Meet the team" />
          </div>
        </div>
      </LandingContent>
    </LandingSection>
  );
}
