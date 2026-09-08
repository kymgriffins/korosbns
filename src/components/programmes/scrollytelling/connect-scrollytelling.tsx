"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { EditorialPill } from "@/components/ui/editorial/editorial-pill";
import { PillButtonGroup } from "@/components/ui/editorial/pill-button-group";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import {
  TelemetryHUD,
  MaskedReveal,
  MetricCounter,
  TransformationStage,
} from "@/components/motion";
import { ProgrammeProjectGrid } from "@/components/programmes/programme-project-grid";
import { ProgrammeChapterBridge } from "@/components/programmes/programme-chapter-bridge";

/**
 * Narrative arc: feed brief — short cadence, PDF → phone → Parliament.
 * Distinct from Mashinani's place essay and Wanahabari's newsroom scene.
 */
export function ConnectScrollytelling() {
  return (
    <article className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <TelemetryHUD
        activeDesk="BNS CONNECT"
        focusArea="NATIONAL TREASURY & PARLIAMENT"
        badgeLabel="NATIONAL DESK"
      />

      <header className="relative border-b border-border/40 bg-gradient-to-b from-primary/5 via-muted/10 to-background pt-4 pb-6 md:pt-6 md:pb-8 overflow-hidden">
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
            <div className="flex flex-wrap items-center gap-2">
              <EditorialPill dot pulse>
                National desk · Youth distribution
              </EditorialPill>
              <EditorialPill variant="outline">
                From Treasury tables to the feed
              </EditorialPill>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.03]">
              <MaskedReveal delay={0.05}>The budget lands as a PDF.</MaskedReveal>{" "}
              <MaskedReveal delay={0.15} innerClassName="text-primary">
                We put it back on the phone.
              </MaskedReveal>
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-foreground/80 leading-relaxed max-w-3xl">
              When the National Treasury publishes a dense Budget Policy Statement, public attention usually dies in the download folder. BNS Connect turns verified budget lines into explainers, debt meters, and youth memorandums built for mobile screens.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-border/50">
              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Scale we watch
                </p>
                <p className="text-lg sm:text-xl font-black text-primary tracking-tight">
                  <MetricCounter value={4.8} prefix="KSh " suffix="T" decimals={1} />
                </p>
                <p className="text-xs text-muted-foreground">FY2026/27 national budget (Treasury)</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Who we write for
                </p>
                <p className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                  Under 35
                </p>
                <p className="text-xs text-muted-foreground">Youth-first formats nationwide</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Flagship format
                </p>
                <p className="text-lg sm:text-xl font-black text-primary tracking-tight">
                  Mobile explainers
                </p>
                <p className="text-xs text-muted-foreground">English · Kiswahili · Sheng</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Standard
                </p>
                <p className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                  Article 201
                </p>
                <p className="text-xs text-muted-foreground">Openness in public finance</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 02 — TRANSFORMATION STAGE: THE BNS DISTILLATION */}
      <section className="py-16 sm:py-24 md:py-32 border-b border-border/30">
        <div className={SECTION_SHELL_INNER}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl space-y-4 mb-12 sm:mb-16"
          >
            <EditorialPill dot pulse>
              Methodology · PDF to Mobile Feed
            </EditorialPill>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
              Secrecy doesn&apos;t need a locked vault. A 400-page PDF will do.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              We ingest raw exchequer tables within four hours of release, verify line items against Hansard, and deliver three actionable signals direct to your phone.
            </p>
          </motion.div>

          <TransformationStage />
        </div>
      </section>

      {/* Connect Desk Flagship Projects Grid (Grouped by Content Type) */}
      <ProgrammeProjectGrid
        programmeSlug="connect"
        eyebrow="Connect Flagship Outputs"
        headline="National Budget Explainers & Series"
        description="Verified video explainers, animated breakdowns, and short-form fiscal series published by the BNS Connect desk."
      />

      {/* Seamless flow to next chapter */}
      <ProgrammeChapterBridge currentSlug="connect" />

      <footer className="border-t border-border/40 bg-muted/10 py-16 md:py-24">
        <div className={SECTION_SHELL_INNER}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-6">
              <EditorialPill dot pulse>
                Join the desk
              </EditorialPill>
              <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
                Become a Budget Tracker — or bring your campus circle with you.
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl font-medium">
                Whether you organise a regional budget reading club or produce fiscal explainers, Connect offers vetted datasets, visual toolkits, and pathways into parliamentary briefings.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <PillButtonGroup
                  href="/contact?intent=budget-tracker"
                  label="Apply as a Budget Tracker"
                  variant="primary"
                  size="default"
                  className="w-full sm:w-auto justify-center"
                />
                <PillButtonGroup
                  href="/work?programme=connect"
                  label="View Connect evidence"
                  variant="outline"
                  size="default"
                  className="hidden sm:inline-flex w-full sm:w-auto justify-center"
                />
              </div>
            </div>

            <div className="lg:col-span-4 border-l border-border/60 pl-6 space-y-2.5 text-xs font-mono text-muted-foreground">
              <p className="text-foreground font-bold text-sm">BNS Connect</p>
              <p>Inquiries: connect@budgetndiostory.org</p>
              <p>Weekly dispatch: Thursday 16:00 EAT</p>
              <p className="text-primary font-semibold">Open civic data standard</p>
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
}
