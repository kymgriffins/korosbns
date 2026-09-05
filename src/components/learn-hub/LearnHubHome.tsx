"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  FileText,
  Layers,
  Play,
  PlaySquare,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { EditorialPill, PillButtonGroup } from "@/components/ui/editorial";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { cn } from "@/utils";

export function LearnHubHome() {
  return (
    <div className="w-full bg-background text-foreground min-h-[calc(100dvh-4rem)] flex flex-col justify-between selection:bg-primary/20">
      {/* ========================================================================= */}
      {/* 01 — BRUTALIST HERO & CONSTITUTIONAL MANDATE                             */}
      {/* ========================================================================= */}
      <section className="pt-8 pb-6 md:pt-12 md:pb-8 border-b border-border/40">
        <div className={SECTION_SHELL_INNER}>
          <div className="flex flex-col items-start gap-4 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <EditorialPill dot pulse variant="default">
                Article 201 Sovereign Standard
              </EditorialPill>
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                0 Paywalls · Public Finance Intelligence
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.04]">
              Demystify Kenya’s KES 4.82T budget. <br />
              <span className="text-primary">Master the public shilling.</span>
            </h1>

            <p className="text-base sm:text-lg text-foreground/80 leading-relaxed max-w-3xl">
              Public money should never move in the dark. We translate complex Treasury releases, debt amortizations, and county allocations into forensic civic literacy across three disciplined media formats.
            </p>

            {/* Structured Action Launchers */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <PillButtonGroup
                href="/learn/modules/budget-policy-statement"
                label="Start Structured Curriculum"
                variant="primary"
                className="text-xs"
              />
              <PillButtonGroup
                href="/learn/stories"
                label="Watch 60s Reels"
                variant="outline"
                className="text-xs"
              />
              <Link
                href="/learn/documents"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border/60 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
              >
                <FileText className="size-3.5 text-primary" />
                <span>Document Vault</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02 — THE 3 PILLARS: WHAT CITIZENS WILL UNDERSTAND                         */}
      {/* ========================================================================= */}
      <section className="py-6 md:py-8 border-b border-border/40 bg-muted/5">
        <div className={SECTION_SHELL_INNER}>
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Curriculum Core // What You Will Master
            </span>
            <span className="font-mono text-[11px] text-primary font-bold">
              3 Disciplines
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="space-y-2 border-l-2 border-primary pl-4">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-primary uppercase tracking-wider">
                <span>01 / Flow of Funds</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground leading-snug">
                Exchequer to Ward Dispensary
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Track how national revenue moves from KRA through the Consolidated Fund into KES 420B+ county allocations and grassroots facilities.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="space-y-2 border-l-2 border-amber-500 pl-4">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-500 uppercase tracking-wider">
                <span>02 / Forensic Audits</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground leading-snug">
                Ghost Projects & Pending Bills
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Spot unvoted expenditures, inflated contractor completion certificates, and debt interest lines before social services are defunded.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="space-y-2 border-l-2 border-emerald-500 pl-4">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-500 uppercase tracking-wider">
                <span>03 / Sovereign Power</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground leading-snug">
                February Over June
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Intervene during the Budget Policy Statement (BPS) and CFSP ceiling hearings in February, before spending is frozen in law.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03 — MEDIA & FORMAT ACCESS (IMAGE-PAIRED, ZERO CARD BLOAT)                */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 03 — MEDIA & FORMAT ACCESS (OPEN VIEWPORT, ZERO CONFINED CARDS)            */}
      {/* ========================================================================= */}
      <section className="py-10 md:py-16">
        <div className={SECTION_SHELL_INNER}>
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border/40 pb-4">
            <div>
              <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest block mb-1">
                Learning Pathways // 0 Paywalls
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Choose How You Master The Budget
              </h2>
            </div>
            <Link
              href="/learn/modules"
              className="text-xs font-mono font-bold text-muted-foreground hover:text-foreground uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
            >
              <span>Explore All Formats</span>
              <ArrowUpRight className="size-3 text-primary" />
            </Link>
          </div>

          {/* Pathway 1: Structured Masterclass (Open Editorial Flow) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-6 border-b border-border/30">
            {/* Visual Media Frame — unconfined, bold, with interactive play anchor */}
            <div className="lg:col-span-6 lg:order-2">
              <Link
                href="/learn/modules/budget-policy-statement"
                className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-border/60 bg-zinc-950 block shadow-md hover:shadow-xl transition-all duration-300"
              >
                <Image
                  src="https://i.ytimg.com/vi/Ed9lP0-komE/hqdefault.jpg"
                  alt="Before Budget Day: The Budget Policy Statement Masterclass"
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20 pointer-events-none" />

                <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
                  <span className="rounded-full bg-primary px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-white shadow-xs">
                    Format 01
                  </span>
                  <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 font-mono text-[10px] font-semibold text-white/90 border border-white/10">
                    3-Part Series
                  </span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="size-14 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 group-active:scale-95">
                    <Play className="size-6 fill-current ml-0.5" />
                  </span>
                </div>

                <div className="absolute bottom-3 inset-x-3 text-white pointer-events-none">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                    Featured Masterclass
                  </span>
                  <p className="text-sm font-bold leading-tight line-clamp-1 group-hover:text-primary-foreground">
                    Before Budget Day: The Complete BPS Guide (Parts 1–3)
                  </p>
                </div>
              </Link>
            </div>

            {/* Content & Action — Breathing in whitespace */}
            <div className="lg:col-span-6 lg:order-1 space-y-4">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-primary">
                  <Layers className="size-3.5" />
                  <span>Structured Masterclass · 15 Min Fast-Track</span>
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-tight">
                  Before Budget Day: The Budget Policy Statement (BPS)
                </h3>
                <p className="text-sm font-bold text-foreground/90 leading-snug">
                  95% of Kenya&apos;s national budget is decided before the June briefcase photo-op.
                </p>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                By June, taxes are already signed into law. The real decisions happen in February under Section 25 of the PFM Act. Learn how to audit the KSh 4 Trillion national spending envelope, spot cuts to public clinics, and submit a formal public participation memorandum before line items freeze.
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono text-muted-foreground pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5 text-primary" />
                  <span>~15 Mins Reading</span>
                </span>
                <span>·</span>
                <span>3 Sequential Videos</span>
                <span>·</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Free &amp; Open</span>
              </div>

              <div className="pt-2">
                <Link
                  href="/learn/modules/budget-policy-statement"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-xs font-mono font-bold uppercase tracking-wider hover:bg-primary/90 transition-all shadow-sm group"
                >
                  <span>Start Module — Free</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Pathway 2: 60-Second Civic Stories (Open Editorial Flow) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-8">
            {/* Visual Media Frame — unconfined, bold */}
            <div className="lg:col-span-6">
              <Link
                href="/learn/stories"
                className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-border/60 bg-zinc-950 block shadow-md hover:shadow-xl transition-all duration-300"
              >
                <Image
                  src="/images/reels/reel-01-poster.jpg"
                  alt="Kenya Owes Over 12 Trillion with Calvina Praise"
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20 pointer-events-none" />

                <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
                  <span className="rounded-full bg-rose-600 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-white shadow-xs">
                    Format 02
                  </span>
                  <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 font-mono text-[10px] font-semibold text-white/90 border border-white/10">
                    60s Snap-Scroll
                  </span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="size-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 group-active:scale-95">
                    <Play className="size-6 fill-current ml-0.5 text-black" />
                  </span>
                </div>

                <div className="absolute bottom-3 inset-x-3 text-white pointer-events-none">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">
                    Active Story Feed
                  </span>
                  <p className="text-sm font-bold leading-tight line-clamp-1">
                    Calvina Praise &amp; Nelly Maina · Kenya Owes Over 12T
                  </p>
                </div>
              </Link>
            </div>

            {/* Content & Action — Breathing in whitespace */}
            <div className="lg:col-span-6 space-y-4">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-rose-500">
                  <PlaySquare className="size-3.5" />
                  <span>60-Second Civic Stories &amp; Mobile Reels</span>
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-tight">
                  Vertical Stories &amp; Grassroots Audits
                </h3>
                <p className="text-sm font-bold text-foreground/90 leading-snug">
                  Auditing county dispensary funds and sovereign debt in under 60 seconds.
                </p>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Watch Calvina Praise break down the KES 12 Trillion national debt under Article 201, and follow Nelly Maina auditing KSh 420B in county equitable share down to ward-level health clinics. Fast, verified, and built for uninterrupted mobile swipe.
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono text-muted-foreground pt-1">
                <span>📱 9:16 Vertical Canvas</span>
                <span>·</span>
                <span>⏱️ 60s Fast Feed</span>
                <span>·</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">4 Active Reels</span>
              </div>

              <div className="pt-2">
                <Link
                  href="/learn/stories"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-rose-700 transition-all shadow-sm group"
                >
                  <span>Open Reels Feed</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04 — FOOTER TICKER & CONSTITUTIONAL CREDENTIALS                           */}
      {/* ========================================================================= */}
      <footer className="py-4 border-t border-border/40 bg-muted/10 text-xs font-mono text-muted-foreground">
        <div className={SECTION_SHELL_INNER}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-foreground">Budget Ndio Story</span>
              <span>·</span>
              <span>Published under Article 201 Constitution of Kenya</span>
              <span>·</span>
              <span className="text-primary font-bold">100% Free &amp; Open</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold text-foreground">
              <Link href="/learn/modules" className="hover:text-primary transition-colors">
                Modules
              </Link>
              <Link href="/learn/stories" className="hover:text-primary transition-colors">
                Reels
              </Link>
              <Link href="/learn/documents" className="hover:text-primary transition-colors">
                Documents
              </Link>
              <Link href="/learn/forum" className="hover:text-primary transition-colors">
                Forum
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
