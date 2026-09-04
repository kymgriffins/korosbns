"use client";

import React from "react";
import { ShieldCheck, Landmark, AlertTriangle, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { HubMetadata } from "@/data/reports-bulletin";

interface ReportsHeroStatementProps {
  hubMeta: HubMetadata;
}

export function ReportsHeroStatement({ hubMeta }: ReportsHeroStatementProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="relative space-y-8 pt-4 pb-10 border-b border-foreground/10">
      {/* Editorial Specimen Masthead & Metadata Line */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-foreground/10">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            {hubMeta.fiscalYear} BULLETIN
          </span>
          <span className="text-muted-foreground/30 hidden sm:inline">/</span>
          <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-muted-foreground">
            BNS INTELLIGENCE DESK · SPECIMEN AUDIT
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground border border-foreground/10 rounded-md px-2 py-0.5 bg-muted/40">
            <ShieldCheck className="size-3 text-emerald-500" />
            <span>Art. 201 Verified</span>
          </span>
          <span className="inline-flex items-center text-[11px] font-mono text-muted-foreground border border-foreground/10 rounded-md px-2 py-0.5 bg-muted/40">
            OAG / Treasury Ref
          </span>
        </div>
      </div>

      {/* Hero Headline & Lead Statement with Fig 01; Specimen Style */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-baseline gap-3">
            <span className="font-serif italic text-3xl sm:text-4xl text-primary font-normal">
              Fig 01;
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.05]">
              National Budget &amp; Audit Dossier.
            </h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-normal max-w-2xl">
            Transforming Kenya&apos;s KES 4.82 Trillion national estimates, parliamentary appropriations, and 47 county devolution accounts into auditable, line-by-line citizen intelligence.
          </p>
        </div>

        {/* Micro Specimen Summary Column */}
        <div className="lg:col-span-4 border border-foreground/10 rounded-2xl p-5 bg-card/60 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-foreground/10">
            <span className="text-muted-foreground uppercase">Fiscal Parameter</span>
            <span className="font-bold text-foreground">Specification</span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-0.5">
              <span className="text-muted-foreground">National Ceiling:</span>
              <span className="font-bold tabular-nums text-foreground">KES 4.82T</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-muted-foreground">KRA Ordinary Target:</span>
              <span className="font-bold tabular-nums text-foreground">KES 2.99T</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-muted-foreground">Debt Servicing (CFS):</span>
              <span className="font-bold tabular-nums text-amber-600 dark:text-amber-400">KES 1.20T (40.3%)</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-muted-foreground">County Allocation:</span>
              <span className="font-bold tabular-nums text-emerald-600 dark:text-emerald-400">KES 502B (10.4%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* The Inverted Editorial Fiscal Specimen Card */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-100 p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 size-80 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 size-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary animate-ping" />
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
                FY 2026/27 Approved National Ceiling · Consolidated State Accounts
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-400 border border-zinc-800 rounded px-2 py-0.5">
              Appropriation Act 2026
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 space-y-2">
              {/* Massive Typographic Number */}
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-heading text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white tabular-nums">
                  KES 4.82T
                </span>
              </div>
              <p className="text-sm font-mono text-zinc-400">
                KES 4,820,000,000,000 · Total approved parliamentary appropriation
              </p>
              <p className="text-sm text-zinc-300 max-w-xl leading-relaxed pt-2">
                Covers national executive departments, parliamentary operations, the judiciary, mandatory Consolidated Fund Services debt servicing, and county equitable transfers.
              </p>
            </div>

            {/* Inverted Specimen Metrics Grid */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-1">
                <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Landmark className="size-3 text-orange-400" /> KRA Ordinary Revenue
                </p>
                <p className="font-heading text-2xl font-bold text-white tabular-nums">KES 2.99T</p>
                <p className="text-[11px] font-mono text-emerald-400">+8.1% target growth</p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-1">
                <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="size-3" /> Debt Servicing (CFS)
                </p>
                <p className="font-heading text-2xl font-bold text-amber-400 tabular-nums">KES 1.20T</p>
                <p className="text-[11px] font-mono text-zinc-400">40.3% of tax revenue</p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-1">
                <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Building className="size-3" /> 47 Counties Share
                </p>
                <p className="font-heading text-2xl font-bold text-emerald-400 tabular-nums">KES 502B</p>
                <p className="text-[11px] font-mono text-zinc-400">10.4% equitable &amp; grants</p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-1">
                <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
                  Fiscal Deficit Gap
                </p>
                <p className="font-heading text-2xl font-bold text-white tabular-nums">KES 863B</p>
                <p className="text-[11px] font-mono text-orange-400">Borrowing requirement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative Spine Navigation Bar with Hairline Borders */}
      <nav aria-label="Report Chapters Navigation" className="pt-2">
        <div className="flex items-center overflow-x-auto pb-2 scrollbar-none gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => scrollTo("chapter-01-national-picture")}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-foreground/10 bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
          >
            <span className="text-primary font-bold">01</span>
            <span>National Picture</span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo("chapter-02-what-changed")}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-foreground/10 bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
          >
            <span className="text-primary font-bold">02</span>
            <span>What Changed</span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo("chapter-03-county-explorer")}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-foreground/10 bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
          >
            <span className="text-primary font-bold">03</span>
            <span>Counties Explorer</span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo("chapter-04-follow-the-money")}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-foreground/10 bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
          >
            <span className="text-primary font-bold">04</span>
            <span>Follow the Money</span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo("chapter-05-investigations")}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-foreground/10 bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
          >
            <span className="text-primary font-bold">05</span>
            <span>Investigations</span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo("chapter-06-ask-public-money")}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-foreground/10 bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
          >
            <span className="text-primary font-bold">06</span>
            <span>Citizen Intelligence</span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo("chapter-07-report-library")}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-foreground/10 bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
          >
            <span className="text-primary font-bold">07</span>
            <span>Report Archive</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
