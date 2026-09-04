"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertTriangle, ShieldCheck, ArrowRight, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function NationalPictureSpread() {
  return (
    <div className="space-y-20 py-6">
      {/* CHAPTER 01 — NATIONAL PICTURE SPECIMEN */}
      <section id="chapter-01-national-picture" className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-foreground/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-serif italic text-2xl text-primary font-normal">
                Fig 02;
              </span>
              <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
                NATIONAL APPROPRIATIONS MATRIX
              </span>
            </div>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Where is Kenya&apos;s money going?
            </h2>
          </div>
          <span className="text-xs font-mono text-muted-foreground border border-foreground/10 rounded-md px-2.5 py-1 bg-muted/30 self-start sm:self-auto">
            100% = KES 4,820,000,000,000
          </span>
        </div>

        {/* Major Budget Signals Spread (Hairline Grid Matrix) */}
        <div className="grid grid-cols-1 divide-y sm:divide-y-0 sm:divide-x divide-foreground/10 border border-foreground/10 rounded-2xl bg-card/60 sm:grid-cols-2 lg:grid-cols-4 overflow-hidden">
          <div className="p-6 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground uppercase font-semibold">Total Approved</span>
              <span className="font-bold text-foreground">100%</span>
            </div>
            <p className="font-heading text-3xl sm:text-4xl font-black text-foreground tabular-nums">
              KES 4.82T
            </p>
            <p className="text-xs text-muted-foreground">
              Parliamentary appropriation baseline
            </p>
          </div>

          <div className="p-6 space-y-2 bg-amber-500/5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-amber-600 dark:text-amber-400 uppercase font-semibold">Debt Servicing (CFS)</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">24.9%</span>
            </div>
            <p className="font-heading text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
              KES 1.20T
            </p>
            <p className="text-xs text-muted-foreground">
              Direct charge on Consolidated Fund
            </p>
          </div>

          <div className="p-6 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground uppercase font-semibold">National Ministries</span>
              <span className="font-bold text-foreground">64.7%</span>
            </div>
            <p className="font-heading text-3xl sm:text-4xl font-black text-foreground tabular-nums">
              KES 3.12T
            </p>
            <p className="text-xs text-muted-foreground">
              Recurrent &amp; capital development
            </p>
          </div>

          <div className="p-6 space-y-2 bg-emerald-500/5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-600 dark:text-emerald-400 uppercase font-semibold">47 Counties</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">10.4%</span>
            </div>
            <p className="font-heading text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
              KES 502B
            </p>
            <p className="text-xs text-muted-foreground">
              Equitable share + conditional grants
            </p>
          </div>
        </div>

        {/* Proportional Visual Flow Ribbon with Hairline Table */}
        <div className="space-y-4 rounded-2xl border border-foreground/10 bg-card/40 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="font-bold text-foreground uppercase">
              Proportional Distribution Strip (FY 2026/27)
            </span>
            <span className="text-muted-foreground">Ref: National Treasury Budget Policy Statement</span>
          </div>

          {/* Visual Stacked Bar */}
          <div className="h-5 w-full overflow-hidden rounded-md flex gap-1 bg-muted/40 p-0.5 border border-foreground/10">
            <div
              className="h-full bg-blue-600 rounded-xs flex items-center justify-center text-[10px] font-mono font-bold text-white transition-all hover:opacity-90"
              style={{ width: "64.7%" }}
              title="National Ministries & State Depts: 64.7% (KES 3.12T)"
            >
              <span className="hidden sm:inline">Ministries & Recurrent 64.7%</span>
              <span className="sm:hidden">64.7%</span>
            </div>
            <div
              className="h-full bg-amber-500 rounded-xs flex items-center justify-center text-[10px] font-mono font-bold text-zinc-950 transition-all hover:opacity-90"
              style={{ width: "24.9%" }}
              title="Public Debt Servicing (CFS): 24.9% (KES 1.20T)"
            >
              <span className="hidden sm:inline">Debt 24.9%</span>
              <span className="sm:hidden">24.9%</span>
            </div>
            <div
              className="h-full bg-emerald-500 rounded-xs flex items-center justify-center text-[10px] font-mono font-bold text-zinc-950 transition-all hover:opacity-90"
              style={{ width: "10.4%" }}
              title="47 Devolved Counties: 10.4% (KES 502B)"
            >
              <span>10.4%</span>
            </div>
          </div>

          {/* Hairline Grid Specimen Table */}
          <div className="border border-foreground/10 rounded-xl overflow-hidden mt-4 text-xs font-mono">
            <div className="grid grid-cols-12 bg-muted/40 p-3 font-semibold border-b border-foreground/10 text-muted-foreground">
              <div className="col-span-6 sm:col-span-5">Appropriation Vote</div>
              <div className="col-span-3 sm:col-span-3 text-right">KES Amount</div>
              <div className="col-span-3 sm:col-span-2 text-right">Share (%)</div>
              <div className="hidden sm:block sm:col-span-2 text-right">Statutory Ref</div>
            </div>
            <div className="grid grid-cols-12 p-3 border-b border-foreground/10 items-center">
              <div className="col-span-6 sm:col-span-5 flex items-center gap-2">
                <span className="size-2 rounded-full bg-blue-600" />
                <span className="font-medium text-foreground">National Executive, State Depts &amp; Judiciary</span>
              </div>
              <div className="col-span-3 sm:col-span-3 text-right font-bold tabular-nums">KES 3,118.0 B</div>
              <div className="col-span-3 sm:col-span-2 text-right tabular-nums text-muted-foreground">64.7%</div>
              <div className="hidden sm:block sm:col-span-2 text-right text-muted-foreground text-[11px]">Vote 01 - 52</div>
            </div>
            <div className="grid grid-cols-12 p-3 border-b border-foreground/10 items-center bg-amber-500/5">
              <div className="col-span-6 sm:col-span-5 flex items-center gap-2">
                <span className="size-2 rounded-full bg-amber-500" />
                <span className="font-medium text-foreground">Consolidated Fund Services (Debt Repayment)</span>
              </div>
              <div className="col-span-3 sm:col-span-3 text-right font-bold tabular-nums text-amber-600 dark:text-amber-400">KES 1,200.0 B</div>
              <div className="col-span-3 sm:col-span-2 text-right tabular-nums font-bold text-amber-600 dark:text-amber-400">24.9%</div>
              <div className="hidden sm:block sm:col-span-2 text-right text-muted-foreground text-[11px]">CFS Art. 206</div>
            </div>
            <div className="grid grid-cols-12 p-3 items-center bg-emerald-500/5">
              <div className="col-span-6 sm:col-span-5 flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span className="font-medium text-foreground">47 Devolved County Governments (CARA)</span>
              </div>
              <div className="col-span-3 sm:col-span-3 text-right font-bold tabular-nums text-emerald-600 dark:text-emerald-400">KES 502.0 B</div>
              <div className="col-span-3 sm:col-span-2 text-right tabular-nums text-muted-foreground">10.4%</div>
              <div className="hidden sm:block sm:col-span-2 text-right text-muted-foreground text-[11px]">CARA 2026</div>
            </div>
          </div>
        </div>

        {/* Three Financing Pillars Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="border border-foreground/10 rounded-xl p-5 bg-card/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase text-foreground">Ordinary Tax Revenue</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">61.9%</span>
            </div>
            <p className="font-heading text-2xl font-bold text-foreground tabular-nums">KES 2,985.7 B</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Collected by KRA primarily via PAYE Income Tax, Value Added Tax (VAT 16%), and Customs duties.
            </p>
          </div>

          <div className="border border-foreground/10 rounded-xl p-5 bg-card/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase text-foreground">Appropriations-in-Aid</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">13.4%</span>
            </div>
            <p className="font-heading text-2xl font-bold text-foreground tabular-nums">KES 644.8 B</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Generated internally by state corporations, public universities, regulators, and court fees.
            </p>
          </div>

          <div className="border border-amber-500/30 rounded-xl p-5 bg-amber-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase text-amber-600 dark:text-amber-400">Fiscal Deficit Borrowing</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">23.8%</span>
            </div>
            <p className="font-heading text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">KES 1,146.2 B</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Funded through KES 1,030.1B in domestic treasury bills/bonds and KES 116.2B in external concessional loans.
            </p>
          </div>
        </div>
      </section>

      {/* CHAPTER 02 — WHAT CHANGED */}
      <section id="chapter-02-what-changed" className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-foreground/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-serif italic text-2xl text-primary font-normal">
                Fig 03;
              </span>
              <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
                YEAR-ON-YEAR STRUCTURAL SHIFTS
              </span>
            </div>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              This year&apos;s budget in context.
            </h2>
          </div>
          <span className="text-xs font-mono text-muted-foreground border border-foreground/10 rounded-md px-2.5 py-1 bg-muted/30 self-start sm:self-auto">
            FY 2025/26 vs FY 2026/27
          </span>
        </div>

        {/* Visual Comparisons with Hairline Cards & Trend Deltas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Metric 1: Public Debt Servicing */}
          <div className="rounded-2xl border border-foreground/10 bg-card/50 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-mono uppercase text-muted-foreground">CFS Public Debt Servicing</p>
                <h3 className="font-heading text-2xl font-bold text-foreground mt-0.5 tabular-nums">KES 1.20 Trillion</h3>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1 font-mono text-xs font-bold">
                <ArrowUpRight className="size-3.5" /> +14.2% YoY
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>FY 2025/26: KES 1.05T</span>
                <span className="text-amber-500 font-bold">FY 2026/27: KES 1.20T</span>
              </div>
              <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden flex">
                <div className="h-full bg-amber-500/40 w-[70%]" />
                <div className="h-full bg-amber-500 w-[30%]" />
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Consumes <strong className="text-foreground">40.3% of ordinary tax revenue</strong>. The single fastest-growing line item in Kenya&apos;s budget.
            </p>
          </div>

          {/* Metric 2: KRA Tax Revenue Target */}
          <div className="rounded-2xl border border-foreground/10 bg-card/50 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-mono uppercase text-muted-foreground">KRA Ordinary Revenue Target</p>
                <h3 className="font-heading text-2xl font-bold text-foreground mt-0.5 tabular-nums">KES 2.99 Trillion</h3>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-mono text-xs font-bold">
                <ArrowUpRight className="size-3.5" /> +8.1% YoY
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>FY 2025/26: KES 2.76T</span>
                <span className="text-emerald-500 font-bold">FY 2026/27: KES 2.99T</span>
              </div>
              <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500/40 w-[75%]" />
                <div className="h-full bg-emerald-500 w-[25%]" />
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Requires <strong className="text-foreground">KES 248.8 Billion monthly collection</strong> to hit target, driven by electronic invoicing.
            </p>
          </div>

          {/* Metric 3: Development Budget Share */}
          <div className="rounded-2xl border border-foreground/10 bg-card/50 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-mono uppercase text-muted-foreground">National Development Allocation</p>
                <h3 className="font-heading text-2xl font-bold text-foreground mt-0.5 tabular-nums">KES 752.4 Billion</h3>
              </div>
              <span className="px-2.5 py-1 rounded-md border border-red-500/30 bg-red-500/10 text-red-500 flex items-center gap-1 font-mono text-xs font-bold">
                <ArrowDownRight className="size-3.5" /> -4.8% Compression
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>FY 2025/26: 18.2% of budget</span>
                <span className="text-red-400 font-bold">FY 2026/27: 15.6% of budget</span>
              </div>
              <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden flex">
                <div className="h-full bg-blue-500 w-[84%]" />
                <div className="h-full bg-red-500/40 w-[16%]" />
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Development spending squeezed by debt obligations; ring-fenced prioritised funds focused on housing and water.
            </p>
          </div>

          {/* Metric 4: County Equitable Share */}
          <div className="rounded-2xl border border-foreground/10 bg-card/50 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-mono uppercase text-muted-foreground">County Equitable Revenue Share</p>
                <h3 className="font-heading text-2xl font-bold text-foreground mt-0.5 tabular-nums">KES 428.0 Billion</h3>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-mono text-xs font-bold">
                <ArrowUpRight className="size-3.5" /> +4.6% YoY
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>FY 2025/26: KES 409B</span>
                <span className="text-emerald-500 font-bold">FY 2026/27: KES 428B</span>
              </div>
              <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500/40 w-[80%]" />
                <div className="h-full bg-emerald-500 w-[20%]" />
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Distributed across all 47 counties using CRA 3rd Basis Formula; supplemented by KES 74B in conditional grants.
            </p>
          </div>
        </div>

        {/* Editorial Narrative Takeaway Pullquote Box */}
        <div className="rounded-2xl border border-foreground/10 bg-zinc-950 text-zinc-100 p-8 relative overflow-hidden shadow-xl">
          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                Core Citizen Audit Takeaway
              </span>
            </div>
            <p className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-snug">
              &ldquo;Debt servicing now consumes KES 40.30 of every KES 100 collected in ordinary taxes — exceeding all 47 counties&apos; combined development allocations by 2.4×.&rdquo;
            </p>
            <p className="text-xs font-mono text-zinc-400">
              Audited by Budget Ndio Story Fiscal Intelligence Desk from National Treasury Budget Statement &amp; CRA Allocations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
