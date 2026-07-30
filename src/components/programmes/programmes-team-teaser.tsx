"use client";

import Link from "next/link";
import { ArrowRight, Users, CheckCircle2 } from "lucide-react";
import { LandingContent, LandingSection, LandingSectionHeader } from "@/layouts/landing-section";
import { Button } from "@/components/ui/button";

const TEAM_HIGHLIGHTS = [
  "Non-partisan researchers & data analysts tracking public finance",
  "Award-winning investigative journalists & storytelling mentors",
  "Civic tech innovators building open budget tracking tools",
  "Embedded county facilitators in Kakamega, Kilifi, Nakuru & Wajir",
];

export function ProgrammesTeamTeaser() {
  return (
    <LandingSection id="who-we-are" aria-labelledby="who-we-are-heading">
      <LandingContent>
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card/80 to-background p-8 md:p-12 lg:p-14">
          <div className="pointer-events-none absolute -left-16 -top-16 size-72 rounded-full bg-primary/10 blur-[100px]" />

          <div className="grid gap-8 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
                <Users className="size-3.5" />
                <span>Credibility & E-E-A-T</span>
              </span>
              <h2 id="who-we-are-heading" className="text-2xl font-bold tracking-tight text-foreground md:text-4xl">
                Driven by Researchers, Journalists & Tech Innovators
              </h2>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                Civic accountability projects live and die on credibility. Budget Ndio Story is built by a multi-disciplinary Kenyan team dedicated to independence, data accuracy, and accessible storytelling.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {TEAM_HIGHLIGHTS.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs font-medium text-foreground/90">
                    <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button asChild variant="outline" className="rounded-full gap-2">
                  <Link href="/about">
                    Meet the Team & Our Mission
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-cardbox/40 p-6 backdrop-blur-sm">
                <div className="rounded-xl bg-primary/10 p-4 border border-primary/20">
                  <h3 className="text-sm font-semibold text-primary">Editorial Independence</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    We maintain strict non-partisan integrity across all budget analysis and story production.
                  </p>
                </div>
                <div className="rounded-xl bg-muted/60 p-4 border border-border/50">
                  <h3 className="text-sm font-semibold text-foreground">Verified Open Data</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    All trackers and scorecards link directly to official Controller of Budget & National Treasury records.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LandingContent>
    </LandingSection>
  );
}
