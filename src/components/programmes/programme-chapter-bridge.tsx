"use client";

import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import {
  PROGRAMMES,
  programmeHref,
  type ProgrammeSlug,
} from "@/content";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";

interface NextChapterMeta {
  nextSlug: ProgrammeSlug;
  chapterNumber: string;
  leadEyebrow: string;
  hookHeadline: string;
  narrativeBridge: string;
  tagline: string;
}

const CHAPTER_FLOW: Record<ProgrammeSlug, NextChapterMeta> = {
  connect: {
    nextSlug: "mashinani",
    chapterNumber: "CHAPTER 02",
    leadEyebrow: "Devolving to the 47 Counties",
    hookHeadline: "Taking budget tracking from Nairobi boardrooms to the village baraza.",
    narrativeBridge: "Scrutinizing national debt schedules in Nairobi is only half the battle. Discover how our embedded field fellows empower rural ward residents in Kilifi, Nakuru, and Wajir to cross-check county gazette lines against physical water pumps and maternity wings.",
    tagline: "47 Counties · Tree-Shade Barazas · Waterproof Scorecards",
  },
  mashinani: {
    nextSlug: "wanahabari-lab",
    chapterNumber: "CHAPTER 03",
    leadEyebrow: "The Forensic Newsroom Desk",
    hookHeadline: "Training reporters to follow the public shilling for the other 364 days.",
    narrativeBridge: "When local communities uncover tender irregularities, they need fearless journalism to hold county executives accountable. Discover how Wanahabari Lab equips newsrooms with forensic accounting and encrypted leak channels.",
    tagline: "120+ Journalist Fellows · Leaks Desk · EACC Recovery Inquiries",
  },
  "wanahabari-lab": {
    nextSlug: "studios",
    chapterNumber: "CHAPTER 04",
    leadEyebrow: "The Sovereign Revenue Engine",
    hookHeadline: "Commercial craft bankrolling grassroots citizen audits.",
    narrativeBridge: "Watchdog organizations collapse when 12-month foreign grants pivot. Discover how BNS Studios sells broadcast-grade 4K films, 2D animations, and town hall broadcasts to fund citizen scorecards with zero aid dependency.",
    tagline: "100% Commercial Surplus Reinvested · 21:9 Anamorphic Cinema · Broadcast Audio",
  },
  studios: {
    nextSlug: "connect",
    chapterNumber: "CHAPTER 01",
    leadEyebrow: "The Digital Mobilization Hub",
    hookHeadline: "Translating 400-page accounting sheets into 60-second mobile power.",
    narrativeBridge: "Return to the digital engine: see how commercial revenue powers viral video explainers, TikTok carousels, and formal legislative submissions reaching 1.4 million first-time voters.",
    tagline: "Macro Treasury Ledger · Sheng Explainers · 70% Youth Scrutiny",
  },
};

export function ProgrammeChapterBridge({
  currentSlug,
}: {
  currentSlug: ProgrammeSlug;
}) {
  const chapter = CHAPTER_FLOW[currentSlug];
  const nextProgramme = PROGRAMMES.find((p) => p.slug === chapter.nextSlug);

  if (!nextProgramme) return null;

  return (
    <section className="relative overflow-hidden border-t border-border/50 bg-gradient-to-b from-background via-muted/20 to-background py-16 sm:py-24">
      <div className={SECTION_SHELL_INNER}>
        {/* Desk Quick-Switch Navigation Strip (No generic boxes) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-border/40 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Layers className="size-3.5 text-primary" />
            <span className="font-bold text-foreground uppercase tracking-widest">
              The 4 Operational Desks
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {PROGRAMMES.map((p, idx) => {
              const isActive = p.slug === currentSlug;
              return (
                <Link
                  key={p.slug}
                  href={programmeHref(p.slug)}
                  className={`rounded-full px-3.5 py-1.5 transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-primary text-white font-bold shadow-xs"
                      : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <span className="text-[10px] opacity-70">0{idx + 1}</span>
                  <span>{p.name.replace("BNS ", "")}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Next Chapter Narrative Portal */}
        <div className="mt-12 py-8 sm:py-12 border-t border-border/60">
          <div className="max-w-4xl space-y-6">
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                {chapter.chapterNumber}
              </span>
              <span className="text-muted-foreground uppercase tracking-wider">NEXT OPERATIONAL DESK</span>
              <span className="text-foreground/40">·</span>
              <span className="text-muted-foreground">{chapter.leadEyebrow}</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-black text-foreground leading-[1.08] tracking-tight">
              {chapter.hookHeadline}
            </h2>

            <p className="text-base sm:text-lg text-foreground/80 leading-relaxed font-medium">
              {chapter.narrativeBridge}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href={programmeHref(nextProgramme.slug)}
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-8 py-4 text-sm font-bold text-white shadow-lg hover:bg-primary/90 transition-all group"
              >
                <span>Enter {nextProgramme.name}</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <span className="text-xs font-mono text-muted-foreground">
                {chapter.tagline}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
