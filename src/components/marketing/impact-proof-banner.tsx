"use client";

import React from "react";
import { GsapReveal, GsapStaggerReveal } from "@/motion/gsap";
import { ShieldCheck, Users, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/utils";

const IMPACT_STATS = [
  {
    number: "47",
    label: "Counties Monitored",
    description: "Tracking local revenue, development spending, and county assembly allocations across Kenya.",
    icon: ShieldCheck,
    accent: "text-emerald-500",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    number: "1.2M+",
    label: "Citizens Reached",
    description: "Empowering youth across TikTok, podcasts, community halls, and campus budget chapters.",
    icon: Users,
    accent: "text-blue-500",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    number: "100+",
    label: "Budget Briefs Decoded",
    description: "Translating parliamentary estimates, finance bills, and county fiscal papers into plain stories.",
    icon: FileText,
    accent: "text-amber-500",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    number: "55 / 100",
    label: "Open Budget Survey Score",
    description: "Kenya's transparency score is below the 61 threshold needed for informed public debate.",
    icon: AlertCircle,
    accent: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    highlight: true,
  },
];

export function ImpactProofBanner() {
  return (
    <section className="relative w-full border-y border-border/40 bg-card/60 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <GsapReveal className="mb-10 flex flex-col items-center text-center">
          <span className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Civic Evidence & Accountability
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Why Public Budget Literacy Matters Now
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Kenya’s budget exceeds KSh 4.2 Trillion annually, yet less than 1 in 4 citizens know where their tax money is allocated. Here is the reality we are transforming on the ground.
          </p>
        </GsapReveal>

        <GsapStaggerReveal className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {IMPACT_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                data-gsap-item
                className={cn(
                  "relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300",
                  "bg-background/80 shadow-sm hover:-translate-y-1 hover:shadow-md",
                  stat.highlight ? "border-amber-500/30 bg-amber-500/[0.02]" : "border-border/60"
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={cn("inline-flex size-10 items-center justify-center rounded-xl border", stat.bg)}>
                      <Icon className={cn("size-5", stat.accent)} />
                    </span>
                    {stat.highlight && (
                      <span className="rounded-full bg-red-500/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-400">
                        Urgent Need
                      </span>
                    )}
                  </div>
                  <div className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    {stat.number}
                  </div>
                  <h3 className="mt-1 text-sm font-semibold text-foreground/90">{stat.label}</h3>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{stat.description}</p>
              </div>
            );
          })}
        </GsapStaggerReveal>
      </div>
    </section>
  );
}

export default ImpactProofBanner;
