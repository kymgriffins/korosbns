"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  FileSearch,
  Radio,
  Smartphone,
  Film,
} from "lucide-react";
import { EditorialCtaBand, PillButtonGroup } from "@/components/ui/editorial";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { ProgrammesProjectsLoop } from "@/components/programmes/programmes-projects-loop";
import {
  TelemetryHUD,
  MaskedReveal,
  MetricCounter,
} from "@/components/motion";

const OPERATIONAL_DESKS = [
  {
    id: "connect",
    number: "01",
    name: "BNS Connect",
    eyebrow: "National Desk · Youth Distribution",
    headline: "The budget lands as a PDF. We put it back on the phone.",
    claim: "Translating 400-page Treasury PDFs, debt schedules, and tax bills into 60-second verified mobile explainers for young taxpayers.",
    metricValue: "KSh 4.8T",
    metricLabel: "National budget tracked",
    href: "/programmes/connect",
    accentBorder: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
    accentPill: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    accentNumber: "text-emerald-500",
    icon: Smartphone,
  },
  {
    id: "mashinani",
    number: "02",
    name: "BNS Mashinani",
    eyebrow: "County Desk · Full-Cycle Embed",
    headline: "Kakamega. Kilifi. Nakuru. Wajir. Stay long enough to matter.",
    claim: "Embedded presence across focus counties, cross-referencing published gazette budgets against actual physical contractor work.",
    metricValue: "4 Counties",
    metricLabel: "Devolved oversight hubs",
    href: "/programmes/mashinani",
    accentBorder: "hover:border-amber-500/50 hover:shadow-amber-500/10",
    accentPill: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    accentNumber: "text-amber-500",
    icon: Radio,
  },
  {
    id: "wanahabari-lab",
    number: "03",
    name: "Wanahabari Lab",
    eyebrow: "Newsroom Desk · Investigative Bench",
    headline: "Budget Day is theatre. The story starts the morning after.",
    claim: "Equipping reporters and digital creators to investigate Controller of Budget releases, procurement audits, and pending bills for the other 364 days.",
    metricValue: "120+ Reporters",
    metricLabel: "Trained in quarterly cohorts",
    href: "/programmes/wanahabari-lab",
    accentBorder: "hover:border-rose-500/50 hover:shadow-rose-500/10",
    accentPill: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    accentNumber: "text-rose-500",
    icon: FileSearch,
  },
  {
    id: "studios",
    number: "04",
    name: "BNS Studios",
    eyebrow: "Production Desk · Creative Craft",
    headline: "High-craft media. A civic surplus attached.",
    claim: "Commercial production agency delivering documentaries, podcasts, and broadcasts—reinvesting operating surplus to fund citizen watchdog scorecards.",
    metricValue: "Dual Impact",
    metricLabel: "Craft that sustains civic work",
    href: "/programmes/studios",
    accentBorder: "hover:border-primary/50 hover:shadow-primary/10",
    accentPill: "bg-primary/10 text-primary border-primary/20",
    accentNumber: "text-primary",
    icon: Film,
  },
];

export function ProgrammesLanding() {
  return (
    <article className="prog-page min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* 00 — PERSISTENT SOVEREIGN MARQUEE TELEMETRY HUD */}
      <TelemetryHUD
        activeDesk="FOUR OPERATIONAL DESKS"
        focusArea="NATIONAL TO DEVOLVED GRASSROOTS"
        badgeLabel="SOVEREIGN STANDARD"
      />

      {/* 01 — MASTER SOVEREIGN HERO: UNIFIED HEADLINE & IMPACT LEDGER */}
      <header className="relative overflow-hidden pt-6 pb-8 md:pt-10 md:pb-12 border-b border-border/30">
        <div className={SECTION_SHELL_INNER}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column (7 cols): Editorial Headline & Mission */}
            <div className="lg:col-span-7 space-y-4 min-w-0">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.04]">
                <MaskedReveal delay={0.05}>Follow the public shilling</MaskedReveal>{" "}
                <MaskedReveal delay={0.15}>from Treasury to the</MaskedReveal>{" "}
                <MaskedReveal delay={0.25} innerClassName="text-primary">
                  grassroots.
                </MaskedReveal>
              </h1>

              <p className="text-base sm:text-lg font-normal text-foreground/80 leading-relaxed max-w-2xl">
                Kenya’s national budget crosses KSh 4.82 Trillion. Budget Ndio Story deploys 4 specialized, non-replicated operational desks to audit allocations, mobilize digital youth, ground rural barazas, and produce cinematic media.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 w-full sm:w-auto">
                <PillButtonGroup
                  href="/work"
                  label="Explore Evidence Archive"
                  variant="primary"
                  size="default"
                  className="w-full sm:w-auto justify-center"
                />
                <PillButtonGroup
                  href="#desks-matrix"
                  label="Explore The 4 Desks"
                  variant="outline"
                  size="default"
                  className="hidden sm:inline-flex w-full sm:w-auto justify-center"
                />
              </div>
            </div>

            {/* Right Column (5 cols): Integrated Sovereign Audit Ledger */}
            <div className="lg:col-span-5 w-full">
              <div className="rounded-2xl border border-border/60 bg-muted/25 dark:bg-zinc-900/40 p-5 sm:p-6 backdrop-blur-xs shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-4 font-mono text-[11px]">
                  <span className="font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Sovereign Audit Ledger
                  </span>
                  <span className="text-muted-foreground uppercase tracking-wider text-[10px]">
                    Live Verification
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1">
                    <p className="text-2xl sm:text-3xl font-black text-primary tracking-tighter">
                      <MetricCounter value={4.82} prefix="KSh " suffix="T" decimals={2} />
                    </p>
                    <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                      National Budget
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      Treasury to ministry line audits
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-2xl sm:text-3xl font-black text-foreground tracking-tighter flex items-center">
                      <span>04</span>
                      <span className="text-primary ml-1 text-xl font-bold">Counties</span>
                    </p>
                    <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Grassroots Hubs
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      Kilifi, Nakuru, Wajir, Kakamega
                    </p>
                  </div>

                  <div className="space-y-1 pt-3 border-t border-border/30">
                    <p className="text-2xl sm:text-3xl font-black text-primary tracking-tighter">
                      <MetricCounter value={120} suffix="+" />
                    </p>
                    <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Reporters Trained
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      Forensic newsroom cohorts
                    </p>
                  </div>

                  <div className="space-y-1 pt-3 border-t border-border/30">
                    <p className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                      Article 201
                    </p>
                    <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Constitutional Mandate
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      Openness in public finance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 02 — THE 4-DESK COMMAND MATRIX: HIGH INFORMATION DENSITY, GENEROUS WHITE SPACE */}
      <section id="desks-matrix" className="py-20 sm:py-28 lg:py-32 border-b border-border/40 relative bg-muted/10">
        <div className={SECTION_SHELL_INNER}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl space-y-4 mb-16"
          >
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-primary">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              <span>Operational Architecture</span>
              <span className="h-px w-8 bg-primary/40" />
              <span className="text-muted-foreground">Four Dedicated Desks</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-[1.05]">
              Four altitudes of scrutiny. One public shilling.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              From national parliamentary ceilings to rural village barazas, each desk deploys specialized methodology, rigorous document verification, and formats built for citizen action.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {OPERATIONAL_DESKS.map((desk, idx) => {
              const Icon = desk.icon;
              return (
                <motion.div
                  key={desk.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Link
                    href={desk.href}
                    className={`group relative flex flex-col justify-between h-full rounded-3xl border border-border/60 bg-card p-8 sm:p-10 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 backdrop-blur-xs ${desk.accentBorder}`}
                  >
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className={`font-mono text-xs font-black tracking-widest uppercase px-2.5 py-1 rounded-full border ${desk.accentPill}`}>
                            Desk {desk.number}
                          </span>
                          <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider">
                            {desk.eyebrow}
                          </span>
                        </div>
                        <Icon className="size-5 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-heading text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-snug group-hover:text-primary transition-colors">
                          {desk.headline}
                        </h3>
                        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
                          {desk.claim}
                        </p>
                      </div>
                    </div>

                    <div className="pt-8 mt-6 border-t border-border/40 flex items-center justify-between">
                      <div>
                        <p className="text-lg font-black text-foreground tracking-tight">
                          {desk.metricValue}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {desk.metricLabel}
                        </p>
                      </div>

                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary group-hover:translate-x-1 transition-transform">
                        <span>Enter Desk</span>
                        <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05 — FLAGSHIP EVIDENCE STREAM: ENDLESS REEL OF CROSS-DESK PRODUCTIONS       */}
      {/* ========================================================================= */}
      <ProgrammesProjectsLoop />

      {/* 06 — AIRY EDITORIAL CTA BAND */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className={SECTION_SHELL_INNER}>
          <EditorialCtaBand
            eyebrow="The Sovereign Standard"
            title="Follow the public shilling. Reclaim civic power."
            description="Join over 1.4 million Kenyans auditing national debt, tracking county disbursements, and enforcing Article 201."
            ctaHref="/work"
            ctaLabel="Explore All Evidence"
            secondaryHref="/contact"
            secondaryLabel="Direct Partnership"
            motionBackground={true}
          />
        </div>
      </section>
    </article>
  );
}

