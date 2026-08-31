"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Users,
  Globe,
  Building2,
  FileCheck2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FocusCountyProfile } from "@/data/reports-bulletin";

export function CountyFocusCards({ counties }: { counties: FocusCountyProfile[] }) {
  return (
    <section className="my-10 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between border-b border-border/50 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              BNS Mashinani Embedded Field Hubs
            </span>
          </div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl mt-1">
            Focus Counties Fiscal Scorecards & Portals
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Sustained budget tracking across Kakamega, Kilifi, Nakuru, and Wajir. Official county government websites, budget portals, and verified field audits.
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
              {/* Header with County Code Badge & Absoption */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-xs font-black text-primary border border-primary/20">
                    {String(county.code).padStart(3, "0")}
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {county.name} County
                    </h3>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3 text-primary" /> {county.capital}
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

              {/* Governor & Demographics Strip */}
              <div className="mt-3 pt-2.5 border-t border-border/40 space-y-1">
                <p className="text-[11px] text-foreground font-semibold flex items-center gap-1 truncate">
                  <Building2 className="size-3 text-muted-foreground shrink-0" />
                  <span className="truncate">{county.governor}</span>
                </p>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="size-3" /> {county.population}
                  </span>
                  <span>{county.subCountiesCount} Sub-counties</span>
                </div>
              </div>

              {/* Allocation Box */}
              <div className="mt-3 rounded-xl bg-muted/40 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Equitable Allocation (FY26/27)
                </p>
                <p className="font-heading text-xl font-extrabold text-foreground mt-0.5">
                  {county.allocationFormatted}
                </p>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground font-medium">
                  <span>Health: <strong className="text-foreground">{county.healthSharePct}%</strong></span>
                  <span>Infra: <strong className="text-foreground">{county.infrastructurePct}%</strong></span>
                  <span>Agric: <strong className="text-foreground">{county.agricultureSharePct}%</strong></span>
                </div>
              </div>

              {/* Official Links */}
              <div className="mt-3 flex items-center gap-2">
                <a
                  href={county.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-border/60 bg-background/50 px-2 py-1.5 text-[11px] font-medium text-foreground hover:bg-muted hover:text-primary transition-colors"
                >
                  <Globe className="size-3 text-primary" />
                  <span>County Web</span>
                  <ExternalLink className="size-2.5 opacity-60" />
                </a>
                <a
                  href={county.budgetPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-border/60 bg-background/50 px-2 py-1.5 text-[11px] font-medium text-foreground hover:bg-muted hover:text-primary transition-colors"
                >
                  <FileCheck2 className="size-3 text-emerald-500" />
                  <span>Budget Portal</span>
                  <ExternalLink className="size-2.5 opacity-60" />
                </a>
              </div>

              {/* Flagship Projects */}
              <div className="mt-3 space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Key Tracked Projects
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
