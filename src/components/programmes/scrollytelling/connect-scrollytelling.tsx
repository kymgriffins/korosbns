"use client";

import {
  MaskedReveal,
  MetricCounter,
  ParallaxWrapper,
  TelemetryHUD,
  TextRevealOnScroll,
  TransformationStage,
} from "@/components/motion";
import { ProgrammeProjectGrid } from "@/components/programmes/programme-project-grid";
import { EditorialPill } from "@/components/ui/editorial/editorial-pill";
import { PillButtonGroup } from "@/components/ui/editorial/pill-button-group";
import { BNS_COMMUNITY_IMAGES } from "@/constants/bns-media-images";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.03]">
              <MaskedReveal delay={0.05}>
                The budget lands as a PDF.
              </MaskedReveal>{" "}
              <MaskedReveal delay={0.15} innerClassName="text-primary">
                We put it back on the phone.
              </MaskedReveal>
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-foreground/80 leading-relaxed max-w-3xl">
              When the National Treasury publishes a dense Budget Policy
              Statement, public attention usually dies in the download folder.
              BNS Connect turns verified budget lines into explainers, debt
              meters, and youth memorandums built for mobile screens.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-border/50">
              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Scale we watch
                </p>
                <p className="text-lg sm:text-xl font-black text-primary tracking-tight">
                  <MetricCounter
                    value={4.8}
                    prefix="KSh "
                    suffix="T"
                    decimals={1}
                  />
                </p>
                <p className="text-xs text-muted-foreground">
                  FY2026/27 national budget (Treasury)
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Who we write for
                </p>
                <p className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                  Under 35
                </p>
                <p className="text-xs text-muted-foreground">
                  Youth-first formats nationwide
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Flagship format
                </p>
                <p className="text-lg sm:text-xl font-black text-primary tracking-tight">
                  Mobile explainers
                </p>
                <p className="text-xs text-muted-foreground">
                  English · Kiswahili · Sheng
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Standard
                </p>
                <p className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                  Article 201
                </p>
                <p className="text-xs text-muted-foreground">
                  Openness in public finance
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="py-10 sm:py-14 md:py-18 border-b border-border/30">
        <div className={SECTION_SHELL_INNER}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-2">
                <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
                  Opening · The download folder problem
                </span>
                <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground leading-tight">
                  Secrecy no longer needs a locked vault. A four-hundred-page
                  PDF will do.
                </h2>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed text-foreground/80 space-y-6">
                <p className="first-letter:float-left first-letter:mr-3 first-letter:font-heading first-letter:text-6xl first-letter:font-black first-letter:text-primary">
                  Every June, Parliament debates a national budget that crosses
                  into the trillions of shillings. The documents that explain
                  where that money is meant to go — Budget Estimates, the
                  Medium-Term Debt Strategy, the Finance Bill — arrive dense,
                  technical, and easy to abandon after page twelve.
                </p>
                <p>
                  A generation that lives on mobile feeds will not wait for a
                  seminar to decode a PAYE deduction. Connect meets them where
                  attention already is: short verified explainers, live
                  trackers, and an annual Youth Budget Survey that keeps
                  pressure on after the Budget Day headlines fade.
                </p>
              </div>

              <blockquote className="border-l-2 border-primary pl-6 py-2 my-8 space-y-3 bg-muted/20 rounded-r-2xl pr-6">
                <TextRevealOnScroll
                  as="p"
                  text="When you understand the debt repayment schedule, you stop looking at broken roads as bad luck and start asking which line item moved."
                  className="font-heading text-xl font-medium italic text-foreground md:text-2xl leading-relaxed"
                />
                <footer className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                  — Youth Tracker voice, Nairobi hub
                </footer>
              </blockquote>
            </div>

            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <ParallaxWrapper speed={-0.3}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border/60 shadow-2xl bg-muted group">
                  <Image
                    src={BNS_COMMUNITY_IMAGES.cohortA}
                    alt="Kenyan youth tracker examining national budget lines on mobile"
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-primary font-bold">
                      Tracker assembly
                    </span>
                    <p className="text-sm font-semibold leading-snug">
                      Fellows cross-checking published Treasury tables against
                      ministry disbursement claims.
                    </p>
                  </div>
                </div>
              </ParallaxWrapper>
            </div>
          </div>

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
                Whether you organise a regional budget reading club or produce
                fiscal explainers, Connect offers vetted datasets, visual
                toolkits, and pathways into parliamentary briefings.
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
              <p>Inquiries: info@budgetndiostory.org</p>
              <p>Weekly dispatch: Thursday 16:00 EAT</p>
              <p className="text-primary font-semibold">
                Open civic data standard
              </p>
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
}
