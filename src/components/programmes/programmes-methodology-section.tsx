"use client";

import { CheckCircle, FileText, Landmark, Search, Users } from "lucide-react";
import { LandingSection } from "@/layouts/landing-section";
import { EditorialPill } from "@/components/ui/editorial";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { cn } from "@/utils";

const METHODOLOGY_STEPS = [
  {
    step: "01",
    title: "Ingest & Trace",
    subtitle: "PFM Act & Constitution (Art. 201–207)",
    icon: Landmark,
    description:
      "We track statutory releases against the budget calendar — Budget Policy Statements (BPS), County Fiscal Strategy Papers (CFSP), and Appropriation Bills.",
    highlight: "No speculative commentary; anchored in official government gazettes.",
  },
  {
    step: "02",
    title: "Triangulate & Verify",
    subtitle: "Controller of Budget & OAG Records",
    icon: Search,
    description:
      "Every Treasury and county allocation is cross-verified against actual Controller of Budget (CoB) exchequer withdrawals and Auditor-General audit findings.",
    highlight: "Zero published claims without primary documentation backing.",
  },
  {
    step: "03",
    title: "Frame & Publish",
    subtitle: "Feed-Ready Dashboards & Newsroom Packs",
    icon: FileText,
    description:
      "We translate complex public finance spreadsheets into actionable scorecards, interactive dashboards, and investigative media toolkits.",
    highlight: "Published in English, Kiswahili, and Sheng for maximum civic reach.",
  },
  {
    step: "04",
    title: "Convene & Hold Pressure",
    subtitle: "Multi-Camera Town Halls & Briefings",
    icon: Users,
    description:
      "We convene facilitated citizen-official forums and provide embargoed briefings to newsroom editors ahead of critical fiscal votes.",
    highlight: "Turning verified evidence into structured, non-partisan public dialogue.",
  },
];

export function ProgrammesMethodologySection({
  asSubSection = false,
}: {
  asSubSection?: boolean;
}) {
  const content = (
    <>
      <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-3">
          <EditorialPill dot pulse variant="default">
            Methodology & Standards
          </EditorialPill>
          <h2 id="methodology-heading" className={T.sectionTitle}>
            How we work
          </h2>
        </div>
        <p className={cn(T.lead, "max-w-md md:text-right")}>
          A rigorous 4-stage verification lifecycle ensuring every data point partners cite is non-partisan, legal-grade, and grounded in official public records.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {METHODOLOGY_STEPS.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.step}
              className="flex flex-col justify-between border border-border/60 bg-background p-6"
            >
              <div>
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <span className="font-mono text-sm font-bold text-primary">
                    Stage {item.step}
                  </span>
                  <div className="flex size-8 items-center justify-center bg-muted/40">
                    <Icon className="size-4 text-foreground/80" aria-hidden="true" />
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs font-medium text-muted-foreground">
                    {item.subtitle}
                  </p>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-foreground/75">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 border-t border-border/40 pt-4">
                <div className="flex items-start gap-2">
                  <CheckCircle
                    className="mt-0.5 size-3.5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <p className="text-xs text-muted-foreground">{item.highlight}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  if (asSubSection) {
    return (
      <div id="how-we-work" aria-labelledby="methodology-heading" className="border-t border-border/50 pt-12">
        {content}
      </div>
    );
  }

  return (
    <LandingSection
      id="how-we-work"
      aria-labelledby="methodology-heading"
      className="border-t border-border/50"
    >
      {content}
    </LandingSection>
  );
}
