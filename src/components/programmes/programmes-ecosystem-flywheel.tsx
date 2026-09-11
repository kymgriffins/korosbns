"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, Building2, Newspaper, Video } from "lucide-react";
import { LandingSection } from "@/layouts/landing-section";
import { EditorialPill } from "@/components/ui/editorial";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { cn } from "@/utils";

const FLYWHEEL_NODES = [
  {
    step: "01",
    name: "BNS Connect",
    eyebrow: "National Intelligence",
    icon: BarChart3,
    href: "/programmes/connect",
    role: "Ingests & tracks",
    description: "Follows Kenya's KSh 4.8T national budget and debt flow from Treasury to line ministries.",
    feedsTo: "Feeds verified allocation baselines into county teams and newsrooms",
  },
  {
    step: "02",
    name: "BNS Mashinani",
    eyebrow: "County Ground Truth",
    icon: Building2,
    href: "/programmes/mashinani",
    role: "Verifies on site",
    description: "Embedded full-cycle in Kakamega, Kilifi, Nakuru, and Wajir to check whether money built real facilities.",
    feedsTo: "Feeds ground truth and delivery scorecards into investigative reporters",
  },
  {
    step: "03",
    name: "Wanahabari Lab",
    eyebrow: "Newsroom Scrutiny",
    icon: Newspaper,
    href: "/programmes/wanahabari-lab",
    role: "Investigates & reports",
    description: "Trains 120–200 journalists and creators to report budget stories during the 11 months after Budget Day.",
    feedsTo: "Feeds public demand and investigations into civic town halls and oversight bodies",
  },
  {
    step: "04",
    name: "BNS Studio",
    eyebrow: "Production & Surplus",
    icon: Video,
    href: "/bns-studio",
    role: "Documents & sustains",
    description: "Produces cinema-grade films and facilitated town halls; commercial surplus funds the civic watchdog.",
    feedsTo: "Feeds commercial surplus back into Connect, Mashinani, and Wanahabari",
  },
];

export function ProgrammesEcosystemFlywheel() {
  return (
    <LandingSection
      id="ecosystem-flywheel"
      aria-labelledby="flywheel-heading"
      className="border-t border-border/50 bg-muted/20"
    >
      <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-3">
          <EditorialPill dot pulse variant="default">
            The Closed-Loop Ecosystem
          </EditorialPill>
          <h2 id="flywheel-heading" className={T.sectionTitle}>
            How the programmes connect
          </h2>
        </div>
        <p className={cn(T.lead, "max-w-md md:text-right")}>
          One continuous accountability engine: national data informs local scrutiny, newsrooms broadcast the findings, and high-craft production funds the next cycle.
        </p>
      </div>

      {/* 4-Node Connected Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FLYWHEEL_NODES.map((node, index) => {
          const Icon = node.icon;
          const isLast = index === FLYWHEEL_NODES.length - 1;

          return (
            <div
              key={node.step}
              className="relative flex flex-col justify-between border border-border/60 bg-background p-6 transition-all hover:border-primary/50"
            >
              {/* Header: Step + Icon */}
              <div>
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground">
                    {node.step}
                  </span>
                  <div className="flex size-8 items-center justify-center bg-muted/50 text-foreground">
                    <Icon className="size-4 text-primary" aria-hidden="true" />
                  </div>
                </div>

                {/* Core Title */}
                <div className="mt-4 space-y-1">
                  <p className={cn(T.eyebrow, "text-muted-foreground")}>{node.eyebrow}</p>
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    {node.name}
                  </h3>
                </div>

                {/* Minimalist Summary */}
                <p className="mt-3 text-sm leading-relaxed text-foreground/75">
                  {node.description}
                </p>
              </div>

              {/* Connector Whisper & Link */}
              <div className="mt-6 border-t border-border/40 pt-4">
                <p className="text-xs font-medium text-primary/90">
                  <span className="font-semibold text-muted-foreground">Output:</span>{" "}
                  {node.feedsTo}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <Link
                    href={node.href}
                    className="inline-flex items-center text-xs font-medium text-foreground transition-colors hover:text-primary"
                  >
                    Explore bet
                    <ArrowRight className="ml-1 size-3" aria-hidden="true" />
                  </Link>
                  {isLast ? (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Surplus cycle ↺
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </LandingSection>
  );
}
