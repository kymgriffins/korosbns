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

/** Distinct bridge voice per programme — prose, not pill dumps. */
const CHAPTER_FLOW: Record<ProgrammeSlug, NextChapterMeta> = {
  connect: {
    nextSlug: "mashinani",
    chapterNumber: "Next · Mashinani",
    leadEyebrow: "From the national feed to four counties",
    hookHeadline: "Kakamega. Kilifi. Nakuru. Wajir. Stay long enough to matter.",
    narrativeBridge:
      "National tables only tell half the story. Mashinani embeds in four counties for the full budget cycle — matching gazette lines to boreholes, maternity wings, and feeder roads people can walk to.",
    tagline: "County desk · Full-cycle embeds · Public scorecards",
  },
  mashinani: {
    nextSlug: "wanahabari-lab",
    chapterNumber: "Next · Wanahabari Lab",
    leadEyebrow: "When communities need a newsroom that stays",
    hookHeadline: "Budget Day is theatre. The story starts the morning after.",
    narrativeBridge:
      "Field findings need journalists who can still read an audit table in August. Wanahabari Lab trains reporters and creators side by side for the eleven months after the briefcase leaves Parliament.",
    tagline: "Newsroom desk · Quarterly labs · Filed drafts",
  },
  "wanahabari-lab": {
    nextSlug: "studios",
    chapterNumber: "Next · Studios",
    leadEyebrow: "Craft that keeps the civic work solvent",
    hookHeadline: "High-craft media. A civic surplus attached.",
    narrativeBridge:
      "Watchdogs fade when funding calendars flip. BNS Studios sells podcasts, documentaries, and town halls — and routes a portion of surplus into Connect, Mashinani, and the Lab.",
    tagline: "Production desk · Client craft · Civic surplus",
  },
  studios: {
    nextSlug: "connect",
    chapterNumber: "Next · Connect",
    leadEyebrow: "Back to the national feed",
    hookHeadline: "The budget lands as a PDF. We put it back on the phone.",
    narrativeBridge:
      "Return to the national desk: youth Budget Trackers translating published Treasury releases into explainers, dashboards, and citizen briefs that still cite the source table.",
    tagline: "National desk · Mobile explainers · Provenance first",
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
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-border/40 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Layers className="size-3.5 text-primary" />
            <span className="font-bold text-foreground uppercase tracking-widest">
              Four programmes
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {PROGRAMMES.map((p, idx) => {
              const isActive = p.slug === currentSlug;
              return (
                <Link
                  key={p.id ?? p.slug}
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

        <div className="mt-12 py-8 sm:py-12 border-t border-border/60">
          <div className="max-w-4xl space-y-6">
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                {chapter.chapterNumber}
              </span>
              <span className="text-muted-foreground uppercase tracking-wider">
                Continue the arc
              </span>
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
