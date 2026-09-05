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
      <section className="py-8 md:py-10 flex-1 flex flex-col justify-center">
        <div className={SECTION_SHELL_INNER}>
          <div className="mb-6 flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Format Access // Choose Your Learning Pathway
            </span>
            <Link
              href="/learn/modules"
              className="text-xs font-mono font-bold text-primary uppercase hover:underline inline-flex items-center gap-1"
            >
              <span>Explore All Formats</span>
              <ArrowUpRight className="size-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Format 1: Structured Masterclass Module (Paired with video masterclass thumbnail) */}
            <div className="lg:col-span-7 rounded-2xl border border-border/60 bg-card p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:border-primary/50 transition-colors">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-mono font-bold text-primary">
                    <Layers className="size-3.5" />
                    <span>Structured Curriculum · Format 01</span>
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    3-Part Video Series
                  </span>
                </div>

                {/* Masterclass Video Thumbnail Frame */}
                <Link
                  href="/learn/modules/budget-policy-statement"
                  className="group relative aspect-video w-full overflow-hidden rounded-xl border border-border/60 bg-black block"
                >
                  <Image
                    src="https://i.ytimg.com/vi/Ed9lP0-komE/hqdefault.jpg"
                    alt="Before Budget Day: The Budget Policy Statement Masterclass"
                    fill
                    priority
                    className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="size-12 rounded-full bg-primary text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="size-5 fill-current pl-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                      Featured Masterclass
                    </span>
                    <p className="text-sm font-bold leading-tight line-clamp-1">
                      Before Budget Day: The Complete BPS Guide (Parts 1–3)
                    </p>
                  </div>
                </Link>

                <div className="space-y-1.5">
                  <h3 className="font-heading text-xl font-bold text-foreground leading-snug">
                    Before Budget Day: The Budget Policy Statement (BPS)
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Watch the 3-part video series and read the companion guide on PFM Act Section 25, macroeconomic growth targets, sector ceilings, and formal public memorandum drafting.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-border/40 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <Clock className="size-3.5" />
                  <span>15 mins reading · 3 sequential videos</span>
                </div>
                <Link
                  href="/learn/modules/budget-policy-statement"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-mono font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-2xs"
                >
                  <span>Start Module</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>

            {/* Format 2: 60-Second Civic Stories & Reels (Paired with real video frame) */}
            <div className="lg:col-span-5 rounded-2xl border border-border/60 bg-card p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:border-rose-500/50 transition-colors">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-mono font-bold text-rose-500">
                    <PlaySquare className="size-3.5" />
                    <span>Vertical Stories · Format 02</span>
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    60s Mobile Feed
                  </span>
                </div>

                {/* 9:16 Video Poster Card */}
                <Link
                  href="/learn/stories"
                  className="group relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-xl border border-border/60 bg-black block"
                >
                  <Image
                    src="/images/reels/reel-01-poster.jpg"
                    alt="Kenya Owes Over 12 Trillion with Calvina Praise"
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="rounded-full bg-rose-600 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-white">
                      Debt &amp; Counties
                    </span>
                    <span className="font-mono text-[10px] text-white/80 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-xs">
                      Calvina &amp; Nelly
                    </span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="size-12 rounded-full bg-white text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="size-5 fill-current pl-0.5 text-black" />
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5 pointer-events-none">
                    <p className="text-[11px] font-mono text-amber-400 font-semibold">
                      Calvina Praise &amp; Nelly Maina
                    </p>
                    <p className="text-sm font-bold leading-tight line-clamp-1">
                      Kenya Owes Over 12T · County Socials Feed
                    </p>
                  </div>
                </Link>

                <div className="space-y-1.5">
                  <h3 className="font-heading text-xl font-bold text-foreground leading-snug">
                    60-Second Civic Stories &amp; TikTok Reels
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Watch Calvina Praise on the national debt and Nelly Maina on county dispensary audits. Snap-scroll video format verified against Article 201.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-border/40 flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-xs text-muted-foreground">
                  4 Interactive Reels Active
                </span>
                <Link
                  href="/learn/stories"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-rose-700 transition-colors shadow-2xs"
                >
                  <span>Open Reels Feed</span>
                  <ArrowRight className="size-3.5" />
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
