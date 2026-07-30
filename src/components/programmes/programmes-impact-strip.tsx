"use client";

import { MapPin, Users, FileText, TrendingUp } from "lucide-react";
import { LANDING_SECTION_SURFACE, LandingContent, LandingSection, LandingSectionHeader } from "@/layouts/landing-section";

const IMPACT_STATS = [
  {
    icon: TrendingUp,
    stat: "KES 4.8T+",
    label: "National Budget Tracked",
    description: "Live tracking of Kenya's national budget allocations and execution.",
  },
  {
    icon: MapPin,
    stat: "4 Counties",
    label: "Embedded Oversight",
    description: "Full-cycle budget scrutiny in Kakamega, Kilifi, Nakuru, and Wajir.",
  },
  {
    icon: Users,
    stat: "150+",
    label: "Journalists & Creators",
    description: "Trained in quarterly Wanahabari Labs to investigate public finance.",
  },
  {
    icon: FileText,
    stat: "250+",
    label: "Civic Reports & Stories",
    description: "Data explainers, scorecards, and investigations published for youth.",
  },
];

export function ProgrammesImpactStrip() {
  return (
    <div className={LANDING_SECTION_SURFACE}>
      <LandingSection id="impact-stats" aria-labelledby="impact-stats-heading">
        <LandingSectionHeader
          title={
            <>
              <span className="text-primary">Impact by the numbers.</span> Measurable accountability.
            </>
          }
          description="We measure success not just in downloads or events, but in verified fiscal tracking, empowered journalists, and informed citizens across Kenya."
          className="mb-10 md:mb-14"
        />
        <LandingContent>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {IMPACT_STATS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-6" />
                    </div>
                  </div>
                  <div>
                    <span className="font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                      {item.stat}
                    </span>
                    <h3 className="mt-1 text-base font-semibold text-primary">
                      {item.label}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </LandingContent>
      </LandingSection>
    </div>
  );
}
