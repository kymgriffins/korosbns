"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileSpreadsheet,
  Sparkles,
} from "lucide-react";

type TransformationTab = "problem" | "transformation" | "solution";

export function TransformationStage() {
  const [activeTab, setActiveTab] = useState<TransformationTab>("transformation");

  return (
    <div className="relative my-10 py-8 border-y border-border/50">
      {/* Top Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="inline-flex size-2 rounded-full bg-primary animate-pulse" />
          <span className="font-bold uppercase tracking-wider text-primary">
            Interception Engine
          </span>
          <span className="text-muted-foreground">· Fiscal Compression v2.4</span>
        </div>

        {/* Narrative Flow Navigation */}
        <div className="inline-flex rounded-full bg-muted/70 p-1 border border-border/50 text-xs font-mono font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("problem")}
            className={`rounded-full px-3.5 py-1.5 transition-all ${
              activeTab === "problem"
                ? "bg-destructive text-white shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            01 · The 400-Page PDF
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("transformation")}
            className={`rounded-full px-3.5 py-1.5 transition-all ${
              activeTab === "transformation"
                ? "bg-primary text-white shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            02 · The BNS Distillation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("solution")}
            className={`rounded-full px-3.5 py-1.5 transition-all ${
              activeTab === "solution"
                ? "bg-emerald-600 text-white shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            03 · 60s Citizen Power
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          {activeTab === "problem" && (
            <motion.div
              key="problem"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1 text-xs font-mono font-bold text-destructive">
                  <AlertTriangle className="size-3.5" />
                  <span>The Bureaucratic Smoke Screen</span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-black text-foreground leading-tight">
                  Where public money disappears into legalistic fog.
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  The National Treasury publishes the Budget Policy Statement as an unsearchable 400-page scanned PDF. Complex line-item codes hide multi-billion shilling reallocations behind terminology like &ldquo;MTEF Ceiling Rationalization&rdquo;.
                </p>
                <div className="space-y-2 pt-2 text-xs font-mono text-muted-foreground">
                  <div className="flex items-center justify-between border-b border-border/40 py-1.5">
                    <span>Average Document Length</span>
                    <span className="font-bold text-foreground">412 Pages</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border/40 py-1.5">
                    <span>Target Citizen Readership</span>
                    <span className="font-bold text-destructive">&lt; 0.04% of Taxpayers</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span>Public Scrutiny Window</span>
                    <span className="font-bold text-foreground">14 Days before Vote</span>
                  </div>
                </div>
              </div>

              {/* Simulated Dense Opaque Document (Open Editorial Memo) */}
              <div className="lg:col-span-7 lg:border-l lg:border-border/40 lg:pl-8 space-y-3 font-mono text-xs text-foreground/80 select-none">
                <div className="flex items-center justify-between border-b border-destructive/20 pb-2 text-[11px] text-destructive font-bold">
                  <span className="flex items-center gap-1.5">
                    <FileSpreadsheet className="size-4" />
                    VOTE 1021: CONSOLIDATED FUND SERVICES
                  </span>
                  <span>CONFIDENTIAL ESTIMATE</span>
                </div>
                <div className="border-l-2 border-destructive/70 pl-4 py-1 space-y-1.5 text-[11px] leading-relaxed">
                  <p className="line-through opacity-70">Sub-Program 042: External Debt Amortization (Semi-Concessional)</p>
                  <p className="font-semibold text-foreground">Ceiling Adjustment Factor: +14.28% over Medium-Term Envelope</p>
                  <p className="text-muted-foreground truncate">
                    Head 88219/001: Bilateral FX Hedge Reserves · KSh 148,291,000,000 [Unappropriated Contingency Balance]
                  </p>
                  <p className="truncate opacity-70">
                    Head 88219/004: Recurrent Subsidy Counterpart Line · Re-routed under Clause 28(b) Appropriation Act
                  </p>
                  <p className="text-destructive font-bold">
                    [CRITICAL DISCREPANCY: Healthcare allocation reduced by KSh 12.4B to service short-term Treasury Bills]
                  </p>
                </div>
                <div className="pt-2 border-t border-border/30 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Page 284 of 412</span>
                  <span className="text-destructive font-bold">Result: 0 Citizen Resistance</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "transformation" && (
            <motion.div
              key="transformation"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-mono font-bold text-primary">
                  <Sparkles className="size-3.5" />
                  <span>The BNS Dissection Engine</span>
                </div>
                <h3 className="font-heading text-2xl sm:text-4xl font-black text-foreground leading-tight">
                  Collapsing 400 pages into 3 verified fiscal signals.
                </h3>
                <p className="text-sm sm:text-base text-foreground/80 leading-relaxed font-medium">
                  Within 4 hours of the Treasury release, our civic data desk scripts ingest the PDF tables, run automated OCR discrepancy checks, and correlate line items against actual ministry health, education, and debt obligations.
                </p>

                {/* Flat Metric Highlights (No Card Boxes) */}
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border/40 font-mono">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-primary">Ingestion Time</p>
                    <p className="text-2xl font-black text-foreground">4 Hours</p>
                    <p className="text-xs text-muted-foreground">From release to verified ledger</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Accuracy Rate</p>
                    <p className="text-2xl font-black text-foreground">100%</p>
                    <p className="text-xs text-muted-foreground">Verified against Hansard</p>
                  </div>
                </div>
              </div>

              {/* Transformation Pipeline (Open Flow, No Boxed Shadows) */}
              <div className="lg:col-span-6 lg:border-l lg:border-border/40 lg:pl-8 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono border-b border-border/40 pb-2">
                  <span className="font-bold text-primary uppercase tracking-wider">TRANSFORMATION PIPELINE</span>
                  <span className="text-muted-foreground">STATUS: ACTIVE</span>
                </div>

                {/* Flow Steps with clean accent borders */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 py-2.5 px-3 border-l-2 border-destructive/60 bg-destructive/5 font-mono text-xs">
                    <FileText className="size-4 text-destructive shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-foreground truncate">Raw Treasury PDF (400+ Pages)</p>
                      <p className="text-[11px] text-muted-foreground">OCR parsed &amp; table schema normalized</p>
                    </div>
                    <ArrowRight className="size-3.5 text-muted-foreground shrink-0" />
                  </div>

                  <div className="flex items-center gap-3 py-2.5 px-3 border-l-2 border-primary bg-primary/5 font-mono text-xs">
                    <Sparkles className="size-4 text-primary shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-primary truncate">BNS Discrepancy Scraper</p>
                      <p className="text-[11px] text-foreground/80">Extracts debt service vs social sector cuts</p>
                    </div>
                    <ArrowRight className="size-3.5 text-primary shrink-0" />
                  </div>

                  <div className="flex items-center gap-3 py-2.5 px-3 border-l-2 border-emerald-500 bg-emerald-500/5 font-mono text-xs">
                    <Smartphone className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-foreground truncate">60s Mobile Cards &amp; Reels</p>
                      <p className="text-[11px] text-muted-foreground">Syndicated to 1.4M+ youth on TikTok &amp; Reels</p>
                    </div>
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "solution" && (
            <motion.div
              key="solution"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-3.5" />
                  <span>The 60-Second Citizen Result</span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-black text-foreground leading-tight">
                  Demystified, actionable, and ready for public participation.
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Instead of drowning in numbers, citizens swipe through bilingual cards on their phones that directly explain how fuel prices, tax rates, and medicine budgets are impacted—with a single button to submit a formal objection to Parliament.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("problem")}
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase tracking-wider hover:underline"
                  >
                    <span>Replay Transformation</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* 3 Citizen Signal Highlights (Open 3-Column Editorial Strip) */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:border-l lg:border-border/40 lg:pl-8">
                <div className="border-t-2 border-border/60 pt-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-primary">CARD 01</span>
                    <span className="text-muted-foreground">#FuelVAT</span>
                  </div>
                  <p className="font-heading text-base font-bold text-foreground leading-snug">
                    Where the 16% Fuel Tax actually goes
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    68% of collected fuel levy was diverted away from road repair into sovereign debt repayment.
                  </p>
                  <div className="pt-1 text-[10px] font-mono text-primary font-bold">
                    640K Views · 14K Shares
                  </div>
                </div>

                <div className="border-t-2 border-primary pt-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-primary">CARD 02</span>
                    <span className="text-muted-foreground">#HealthCut</span>
                  </div>
                  <p className="font-heading text-base font-bold text-foreground leading-snug">
                    Dispensary Medicine Cut in Your County
                  </p>
                  <p className="text-xs text-foreground/80 leading-relaxed font-medium">
                    KSh 3.4B slashed from rural health centers while travel per diems increased by 22%.
                  </p>
                  <div className="pt-1 text-[10px] font-mono text-primary font-bold">
                    520K Views · 8.2K Objections
                  </div>
                </div>

                <div className="border-t-2 border-emerald-500 pt-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">CARD 03</span>
                    <span className="text-muted-foreground">#Memorandum</span>
                  </div>
                  <p className="font-heading text-base font-bold text-foreground leading-snug">
                    Citizen Submission to Parliament
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Over 3,200 verified youth voices packaged into an 80-page formal petition delivered to National Assembly.
                  </p>
                  <div className="pt-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    Formally Table in Hansard
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
