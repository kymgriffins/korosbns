"use client";

import React from "react";
import { Search, MapPin, GraduationCap, Video, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import { LandingContent, LandingSection, LandingSectionHeader } from "@/layouts/landing-section";

const ECOSYSTEM_STAGES = [
  {
    step: "1. TRACK",
    title: "BNS Connect",
    eyebrow: "National Scope",
    description: "Tracks Kenya's KSh 4.8T national budget from Treasury allocations to social feeds.",
    icon: Search,
    colorClass: "text-blue-500",
    bgClass: "bg-blue-500/10",
    borderClass: "border-blue-500/30",
    tag: "National Feed",
  },
  {
    step: "2. LOCALISE",
    title: "BNS Mashinani",
    eyebrow: "Deep Scrutiny",
    description: "Embedded full-cycle budget oversight in Kakamega, Kilifi, Nakuru & Wajir — a replicable model for the other 43 counties.",
    icon: MapPin,
    colorClass: "text-emerald-500",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/30",
    tag: "Replicable Model",
  },
  {
    step: "3. TRAIN",
    title: "Wanahabari Lab",
    eyebrow: "Media Capacity",
    description: "Quarterly intensive training equipping 120–200 mainstream journalists & creators annually.",
    icon: GraduationCap,
    colorClass: "text-purple-500",
    bgClass: "bg-purple-500/10",
    borderClass: "border-purple-500/30",
    tag: "Media Cohorts",
  },
  {
    step: "4. PRODUCE & REINVEST",
    title: "BNS Studios",
    eyebrow: "Commercial Engine",
    description: "Commissioned podcasts, documentaries & campaigns for governments, ESG partners & CSOs. Commercial profits permanently fund BNS civic work.",
    icon: Video,
    colorClass: "text-amber-500",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/30",
    tag: "Double Impact",
  },
];

export function ProgrammesEcosystemBar() {
  return (
    <LandingSection id="ecosystem" aria-labelledby="ecosystem-heading" className="bg-muted/30 py-12 border-y border-border/50">
      <LandingSectionHeader
        title={
          <>
            <span className="text-primary">Four programmes.</span> One sustainable civic ecosystem.
          </>
        }
        description="BNS connects national data tracking, embedded county scrutiny, media capacity building, and self-funding impact media into an integrated civic intelligence loop."
        className="mb-10 md:mb-14"
      />
      <LandingContent>
        {/* Pipeline Architecture Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ECOSYSTEM_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <div
                key={idx}
                className={`relative flex flex-col justify-between p-6 rounded-2xl border ${stage.borderClass} bg-card hover:bg-card/90 transition-all shadow-xs group`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      {stage.step}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stage.bgClass} ${stage.colorClass}`}>
                      {stage.tag}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className={`p-2.5 rounded-xl ${stage.bgClass} ${stage.colorClass}`}>
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold font-heading text-foreground">{stage.title}</h3>
                      <p className="text-[11px] font-medium text-muted-foreground">{stage.eyebrow}</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                    {stage.description}
                  </p>
                </div>

                {idx < 3 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                    <div className="p-1 rounded-full bg-background border border-border text-muted-foreground">
                      <ArrowRight className="size-3.5" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sustainability & Revenue Loop Callout */}
        <div className="mt-8 p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-card to-emerald-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
              <RefreshCw className="size-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Double-Impact Revenue Architecture</h4>
              <p className="text-xs text-muted-foreground">
                Client commissions from governments, ESG partners, and CSOs generate commercial revenue for BNS Studios — a proportion of profit permanently funds BNS Foundation's civic mission.
              </p>
            </div>
          </div>
          <a
            href="/bns-studio#booking"
            className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 text-amber-950 hover:bg-amber-400 transition-colors shrink-0"
          >
            Commission BNS Studios
          </a>
        </div>
      </LandingContent>
    </LandingSection>
  );
}
