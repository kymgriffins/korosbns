"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, TrendingUp, ShieldCheck, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FocusCountyProfile } from "@/data/reports-bulletin";

export function CountyFocusCards({ counties }: { counties: FocusCountyProfile[] }) {
  return (
    <section className="my-10 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              BNS Mashinani Embedded Field Hubs
            </span>
          </div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Focus Counties Fiscal Scorecards
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Sustained, full-cycle budget monitoring across Kakamega, Kilifi, Nakuru, and Wajir. Verified by our on-the-ground civic tracking network.
          </p>
        </div>
        <Badge variant="outline" className="h-7 w-fit gap-1 text-xs font-semibold px-3 border-primary/30 text-primary">
          <ShieldCheck className="size-3.5" /> 100% Ground Verified
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {counties.map((county) => (
          <div
            key={county.slug}
            className="group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card/80 p-5 shadow-xs backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-black text-primary">
                    {String(county.code).padStart(3, "0")}
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {county.name}
                    </h3>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" /> {county.capital}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                >
                  {county.executionRatePct}% Absorbed
                </Badge>
              </div>

              <div className="mt-4 rounded-xl bg-muted/40 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Equitable Allocation
                </p>
                <p className="font-heading text-xl font-extrabold text-foreground">
                  {county.allocationFormatted}
                </p>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Health: <strong>{county.healthSharePct}%</strong></span>
                  <span>Infra: <strong>{county.infrastructurePct}%</strong></span>
                  <span>Agric: <strong>{county.agricultureSharePct}%</strong></span>
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Flagship Field Projects
                </p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {county.keyProjects.slice(0, 2).map((proj, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 line-clamp-1">
                      <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500 mt-0.5" />
                      <span>{proj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-border/40">
              <Button asChild variant="ghost" size="sm" className="w-full justify-between group/btn text-xs font-semibold">
                <Link href={`/reports/${county.reportSlug}`}>
                  <span>Explore Full Scorecard</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
