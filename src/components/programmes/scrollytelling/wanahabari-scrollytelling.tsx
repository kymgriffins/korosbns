"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  FileText,
  Newspaper,
  Terminal,
  Scale,
} from "lucide-react";
import { EditorialPill } from "@/components/ui/editorial/editorial-pill";
import { PillButtonGroup } from "@/components/ui/editorial/pill-button-group";
import { BNS_MEDIA_IMAGES } from "@/constants/bns-media-images";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import {
  TelemetryHUD,
  MaskedReveal,
  ParallaxWrapper,
  MetricCounter,
  ForensicLightTable,
} from "@/components/motion";

export function WanahabariScrollytelling() {
  return (
    <article className="min-h-screen bg-background text-foreground selection:bg-red-500/20">
      {/* 00 — LOCOMOTIVE-GRADE TECHNICAL TELEMETRY HUD */}
      <TelemetryHUD
        activeDesk="DESK 03: WANAHABARI LAB"
        focusArea="364-DAY BUDGET JOURNALISM & LEAKS"
        badgeLabel="INVESTIGATIVE BENCH"
      />

      {/* 01 — NEWSPAPER EDITORIAL MASTHEAD HERO */}
      <header className="relative border-b border-border/40 bg-gradient-to-b from-red-500/5 via-muted/10 to-background pt-4 pb-6 md:pt-6 md:pb-8 overflow-hidden">
        <div className={SECTION_SHELL_INNER}>
          {/* Breadcrumb back to programmes */}
          <nav aria-label="Breadcrumb" className="mb-3">
            <Link
              href="/programmes"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              <span>All Operational Desks</span>
            </Link>
          </nav>

          <div className="space-y-4 max-w-5xl">
            {/* Masthead Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4 font-mono text-xs">
              <div className="flex items-center gap-2">
                <EditorialPill dot pulse>
                  Desk 03 · The Investigative Media Arm
                </EditorialPill>
                <span className="text-muted-foreground">EAST AFRICA PRESS DISPATCH</span>
              </div>
              <span className="text-muted-foreground">QUARTERLY COHORTS · 120+ REPORTERS</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.02]">
              <MaskedReveal delay={0.05}>Training reporters to follow the</MaskedReveal>{" "}
              <MaskedReveal delay={0.15}>public shilling for the</MaskedReveal>{" "}
              <MaskedReveal delay={0.25} innerClassName="text-red-500">
                other 364 days.
              </MaskedReveal>
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-foreground/80 leading-relaxed max-w-3xl">
              Kenyan newsrooms allocate 90% of their fiscal coverage to Budget Day in June. Once the Minister packs his briefcase, reporting drops to zero while billions are quietly spent. Wanahabari Lab equips investigative reporters to investigate public funds year-round.
            </p>

            {/* Editorial Overview Strip with Numbers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-border/50">
              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Operational Altitude
                </p>
                <p className="text-base font-bold text-foreground">
                  Investigative Newsrooms
                </p>
                <p className="text-xs text-muted-foreground">National & Regional Press</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Alumni Network
                </p>
                <p className="text-base font-bold text-foreground">
                  <MetricCounter value={120} suffix="+ Fellows" />
                </p>
                <p className="text-xs text-muted-foreground">Daily Nation, Standard, BBC</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Core Method
                </p>
                <p className="text-base font-bold text-primary">
                  Data Scraping & Leaks
                </p>
                <p className="text-xs text-muted-foreground">OCOB Reports & Hansard Audits</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Media Standard
                </p>
                <p className="text-base font-bold text-foreground">
                  Continuous Oversight
                </p>
                <p className="text-xs text-muted-foreground">364-Day Budget Journalism</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 02 — THE NARRATIVE ARC: CHAPTER 01 — THE 1-DAY SPECTACLE */}
      <section className="py-10 sm:py-14 md:py-18 border-b border-border/30">
        <div className={SECTION_SHELL_INNER}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-2">
                <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
                  Chapter 01 · The Media Failure
                </span>
                <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground leading-tight">
                  The budget speech is theatre. The real story begins the morning after.
                </h2>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed text-foreground/80 space-y-6">
                <p className="first-letter:float-left first-letter:mr-3 first-letter:font-heading first-letter:text-6xl first-letter:font-black first-letter:text-primary">
                  Every June, television anchors wear red ties, newspapers print commemorative glossy inserts, and camera crews follow the Cabinet Secretary walking into Parliament holding a leather briefcase. For 24 hours, the nation is obsessed with tax changes.
                </p>
                <p>
                  By July 1st, coverage drops off a cliff. The actual disbursements—the quarterly releases by the Controller of Budget, supplementary budgets passed late at night, and pending bill settlements—happen in complete media darkness. Newsrooms lack the dedicated data desks to parse thousands of spreadsheet rows.
                </p>
              </div>

              {/* Fellow Voice Pull */}
              <blockquote className="border-l-2 border-primary pl-6 py-2 my-8 space-y-3 bg-muted/20 rounded-r-2xl pr-6">
                <p className="font-heading text-xl font-medium italic text-foreground md:text-2xl leading-relaxed">
                  &ldquo;The budget story doesn&rsquo;t end on Budget Day. That is just when the spending begins. Journalists must be in the room for the other 364 days.&rdquo;
                </p>
                <footer className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                  — David Otieno, Investigative Editor & Wanahabari Fellow
                </footer>
              </blockquote>
            </div>

            {/* Right Column: Parallax Editorial Journalist Portrait */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <ParallaxWrapper speed={-0.3}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border/60 shadow-2xl bg-muted group">
                  <Image
                    src={BNS_MEDIA_IMAGES.productionA}
                    alt="Investigative journalism fellow on set examining county spending leaks"
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-primary font-bold">
                      Wanahabari Newsroom Fellowship
                    </span>
                    <p className="text-sm font-semibold leading-snug">
                      Training investigative reporters to cross-reference Treasury exchequer tables with auditor reports.
                    </p>
                  </div>
                </div>
              </ParallaxWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — CHAPTER 02: THE FORENSIC CURRICULUM */}
      <section className="py-24 md:py-36 border-b border-border/30 bg-muted/10">
        <div className={SECTION_SHELL_INNER}>
          <div className="max-w-3xl space-y-4 mb-16">
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
              Chapter 02 · The Forensic Curriculum
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground">
              Three investigative pillars newsrooms never teach.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Our 12-week fellowship takes practicing reporters out of daily press scrums and gives them technical forensic skills to break national stories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Pillar 01 */}
            <div className="space-y-4 border-t-2 border-primary pt-6">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-primary">
                <Terminal className="size-4" />
                <span>Pillar 01 · Data Scraping & Parsing</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground">
                Automated OCOB & Treasury Ingestion
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Reporters learn to write Python and Excel scripts that automatically convert locked PDF tables from the Office of the Controller of Budget into structured searchable databases within seconds.
              </p>
            </div>

            {/* Pillar 02 */}
            <div className="space-y-4 border-t-2 border-primary pt-6">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-primary">
                <FileText className="size-4" />
                <span>Pillar 02 · Off-Budget Verification</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground">
                Pending Bills & Contingent Liabilities
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Investigating off-balance-sheet debt, letters of comfort, and stalled contractor claims that government ministries hide outside the approved parliamentary ceiling.
              </p>
            </div>

            {/* Pillar 03 */}
            <div className="space-y-4 border-t-2 border-primary pt-6">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-primary">
                <Newspaper className="size-4" />
                <span>Pillar 03 · Front-Page Story Packaging</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground">
                Multi-Platform Syndicate Delivery
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Transforming complex forensic datasets into front-page headlines, broadcast TV packages, podcast series, and bilingual social feeds that compel official parliamentary inquests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — CHAPTER 03: INVESTIGATIVE CASE DOSSIERS */}
      <section className="py-24 md:py-36 border-b border-border/30">
        <div className={SECTION_SHELL_INNER}>
          <div className="max-w-3xl space-y-4 mb-16">
            <span className="font-mono text-xs font-bold text-red-500 uppercase tracking-widest">
              Chapter 03 · Investigative Case Studies
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground">
              What our investigative alumni uncovered.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Real forensic investigations published by Wanahabari Lab fellows that exposed fiscal diversion and forced parliamentary corrections.
            </p>
          </div>

          {/* Interactive Forensic Newsroom Light-Table */}
          <ForensicLightTable />
        </div>
      </section>

      {/* 05 — CALL TO ACTION */}
      <footer className="border-t border-border/40 bg-muted/20 py-20 md:py-32">
        <div className={SECTION_SHELL_INNER}>
          <div className="rounded-3xl border border-border/60 bg-card p-8 sm:p-14 lg:p-20 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-8 space-y-6">
                <EditorialPill dot pulse>
                  Apply For Fellowship
                </EditorialPill>
                <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
                  Join the next Wanahabari Lab investigative cohort.
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  Open to practicing print, broadcast, and independent digital journalists in Kenya, Uganda, and Tanzania. Full bursaries provided for newsroom fellows covering public expenditure.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <PillButtonGroup
                    href="/contact?intent=wanahabari-lab"
                    label="Submit Fellowship Application"
                    variant="primary"
                    size="default"
                    className="w-full sm:w-auto justify-center"
                  />
                  <PillButtonGroup
                    href="/work?programme=wanahabari-lab"
                    label="Review Lab Alumni Scoops"
                    variant="outline"
                    size="default"
                    className="hidden sm:inline-flex w-full sm:w-auto justify-center"
                  />
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-3 text-xs font-mono text-muted-foreground">
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 w-full space-y-2">
                  <p className="text-foreground font-bold text-sm">Wanahabari Lab Admissions</p>
                  <p>Cohorts: March · July · October</p>
                  <p>Capacity: 30 Fellows per Intake</p>
                  <p className="text-red-500 font-semibold">Fully Sponsored by BNS Foundation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
}
