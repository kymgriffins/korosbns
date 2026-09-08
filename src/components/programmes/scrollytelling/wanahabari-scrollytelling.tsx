"use client";

import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Newspaper,
  Scale,
} from "lucide-react";
import { motion } from "motion/react";
import { EditorialPill } from "@/components/ui/editorial/editorial-pill";
import { PillButtonGroup } from "@/components/ui/editorial/pill-button-group";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import {
  TelemetryHUD,
  MaskedReveal,
  MetricCounter,
  ForensicLightTable,
} from "@/components/motion";
import { ProgrammeProjectGrid } from "@/components/programmes/programme-project-grid";
import { ProgrammeChapterBridge } from "@/components/programmes/programme-chapter-bridge";

/**
 * Narrative arc: newsroom masthead — Budget Day theatre → the other 364 days → craft.
 * Distinct from Connect's feed brief and Mashinani's place essay.
 */
export function WanahabariScrollytelling() {
  return (
    <article className="min-h-screen bg-background text-foreground selection:bg-red-500/20">
      <TelemetryHUD
        activeDesk="WANAHABARI LAB"
        focusArea="YEAR-ROUND BUDGET JOURNALISM"
        badgeLabel="NEWSROOM DESK"
      />

      <header className="relative border-b border-border/40 bg-gradient-to-b from-red-500/5 via-muted/10 to-background pt-4 pb-6 md:pt-6 md:pb-8 overflow-hidden">
        <div className={SECTION_SHELL_INNER}>
          <nav aria-label="Breadcrumb" className="mb-3">
            <Link
              href="/programmes"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              <span>All programmes</span>
            </Link>
          </nav>

          <div className="space-y-4 max-w-5xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4 font-mono text-xs">
              <div className="flex items-center gap-2">
                <EditorialPill dot pulse>
                  Newsroom desk · Quarterly labs
                </EditorialPill>
                <span className="text-muted-foreground">EAST AFRICA PRESS BENCH</span>
              </div>
              <span className="text-muted-foreground">JOURNALISTS · CREATORS · SIDE BY SIDE</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.02]">
              <MaskedReveal delay={0.05}>Budget Day is theatre.</MaskedReveal>{" "}
              <MaskedReveal delay={0.15} innerClassName="text-red-500">
                The story starts the morning after.
              </MaskedReveal>
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-foreground/80 leading-relaxed max-w-3xl">
              Kenyan newsrooms still crowd June. Wanahabari Lab trains reporters and digital creators for the rest of the fiscal calendar — when Controller of Budget releases, supplementary votes, and pending bills decide what actually reaches wards.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-border/50">
              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Cadence
                </p>
                <p className="text-base font-bold text-foreground">Quarterly Labs</p>
                <p className="text-xs text-muted-foreground">Anchored to the fiscal calendar</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Bench size
                </p>
                <p className="text-base font-bold text-foreground">
                  <MetricCounter value={120} suffix="–200 / year" />
                </p>
                <p className="text-xs text-muted-foreground">Journalists and creators</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Core craft
                </p>
                <p className="text-base font-bold text-primary">Evidence reading</p>
                <p className="text-xs text-muted-foreground">OCOB · Hansard · published tables</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Output
                </p>
                <p className="text-base font-bold text-foreground">Filed drafts</p>
                <p className="text-xs text-muted-foreground">Stories + toolkit, same day</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 02 — THE LAB CURRICULUM: THREE PRACTICAL CRAFTS */}
      <section className="py-16 sm:py-24 md:py-32 border-b border-border/30 bg-muted/5">
        <div className={SECTION_SHELL_INNER}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl space-y-4 mb-12 sm:mb-16"
          >
            <EditorialPill dot pulse>
              Curriculum · Three Newsroom Crafts
            </EditorialPill>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
              What a one-day Lab actually teaches.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              No academic jargon. Three practical pillars journalists and digital creators take back to newsrooms and social feeds the same week.
            </p>
          </motion.div>

          {/* 3-Crafts Motion Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20 sm:mb-28">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 space-y-3 shadow-xs hover:border-red-500/40 transition-colors"
            >
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-red-500">
                <FileText className="size-4" />
                <span>01 · Read the Release</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground">
                Parse public finance documents fast
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Fellows practise turning Controller of Budget and Treasury tables into searchable notes — without guessing figures when cells are blank or PDFs are locked.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 space-y-3 shadow-xs hover:border-red-500/40 transition-colors"
            >
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-red-500">
                <Scale className="size-4" />
                <span>02 · Off-Cycle Money</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground">
                Pending bills and contingent claims
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                How to report obligations that sit beside headline budgets — with source discipline, statutory cross-referencing, and legal caution, not rumour.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 space-y-3 shadow-xs hover:border-red-500/40 transition-colors"
            >
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-red-500">
                <Newspaper className="size-4" />
                <span>03 · Feed & Broadcast</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground">
                Front page, broadcast, and feed
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Turning forensic evidence into headlines, packages, and bilingual social cuts that never strip the underlying document provenance.
              </p>
            </motion.div>
          </div>

          {/* 03 — FORENSIC LIGHT-TABLE */}
          <div className="pt-12 border-t border-border/40">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl space-y-4 mb-12 sm:mb-16"
            >
              <span className="font-mono text-xs font-bold text-red-500 uppercase tracking-widest">
                Light-table · How scoops are built
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground">
                Method first. Headlines second.
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Illustrative reporting workflows fellows practise in Lab — not claimed case outcomes with invented amounts.
              </p>
            </motion.div>

            <ForensicLightTable />
          </div>
        </div>
      </section>

      <ProgrammeProjectGrid
        programmeSlug="wanahabari-lab"
        eyebrow="Wanahabari Lab Outputs"
        headline="Investigative Research & Newsroom Toolkits"
        description="Forensic briefings, legal frameworks, and same-day budget reading kits co-produced with journalists and research partners."
      />

      {/* Seamless flow to next chapter */}
      <ProgrammeChapterBridge currentSlug="wanahabari-lab" />

      <footer className="border-t border-border/40 bg-muted/20 py-20 md:py-32">
        <div className={SECTION_SHELL_INNER}>
          <div className="rounded-3xl border border-border/60 bg-card p-8 sm:p-14 lg:p-20 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-8 space-y-6">
                <EditorialPill dot pulse>
                  Apply for the next Lab
                </EditorialPill>
                <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
                  Join the next Wanahabari Lab cohort.
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  Open to practising print, broadcast, and independent digital journalists and creators covering governance and public finance in Kenya.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <PillButtonGroup
                    href="/contact?intent=wanahabari-lab"
                    label="Submit Lab application"
                    variant="primary"
                    size="default"
                    className="w-full sm:w-auto justify-center"
                  />
                  <PillButtonGroup
                    href="/work?programme=wanahabari-lab"
                    label="Review Lab evidence"
                    variant="outline"
                    size="default"
                    className="hidden sm:inline-flex w-full sm:w-auto justify-center"
                  />
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-3 text-xs font-mono text-muted-foreground">
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 w-full space-y-2">
                  <p className="text-foreground font-bold text-sm">Wanahabari Lab admissions</p>
                  <p>Cohorts: quarterly intakes</p>
                  <p>Format: one-day intensive + toolkit</p>
                  <p className="text-red-500 font-semibold">Journalists and creators welcome</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
}
