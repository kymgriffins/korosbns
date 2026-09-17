"use client";

import React, { type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Users,
  Compass,
  FileSearch,
  Building2,
  Play,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import { EditorialPill } from "@/components/ui/editorial";
import { type LayoutArchetype, resolveLayoutArchetype } from "./types";

export interface ProgrammeData {
  slug: string;
  title: string;
  eyebrow?: string;
  headline?: string;
  description?: string;
  pillars?: Array<{ title: string; description: string; tag?: string }>;
  deliverables?: Array<{ title: string; detail: string }>;
  reels?: Array<{ title: string; url: string; poster?: string }>;
  stats?: Array<{ label: string; value: string }>;
}

export interface ProgrammeShellProps {
  programme: ProgrammeData;
  archetype?: LayoutArchetype | string | null;
  children?: ReactNode;
}

export function ProgrammeShell({
  programme,
  archetype = "sovereign",
  children,
}: ProgrammeShellProps) {
  const config = resolveLayoutArchetype(archetype);

  // 1. CINEMATIC THEATRE ARCHETYPE
  if (config.id === "cinematic") {
    return (
      <div className="w-full bg-[#04060a] text-slate-100 min-h-screen pb-24">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 pt-12 space-y-16">
          <header className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              {programme.eyebrow || "BNS PROGRAMME"}
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
              {programme.headline || programme.title}
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              {programme.description}
            </p>
          </header>

          {/* Cinematic Reels Spotlight */}
          {programme.reels && programme.reels.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold">
                EVIDENCE REELS & FIELD DISPATCHES
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {programme.reels.map((reel, idx) => (
                  <div
                    key={idx}
                    className="group rounded-2xl overflow-hidden border border-sky-500/30 bg-black/60 backdrop-blur-xl p-4 space-y-3 hover:border-sky-400 transition-all"
                  >
                    <div className="aspect-video rounded-xl bg-slate-900 flex items-center justify-center relative overflow-hidden">
                      <Play className="size-10 text-sky-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <h4 className="font-bold text-white text-sm">{reel.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {children}
        </div>
      </div>
    );
  }

  // 2. BRUTALIST WATCHDOG ARCHETYPE
  if (config.id === "brutalist") {
    return (
      <div className="w-full bg-[#fffdf5] dark:bg-black text-black dark:text-white min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="border-4 border-current p-8 bg-card shadow-[6px_6px_0px_0px_currentColor] space-y-4">
            <div className="flex justify-between font-mono text-xs font-bold border-b-2 border-current pb-2">
              <span>DESK ID // {programme.slug.toUpperCase()}</span>
              <span>STATUS // ACTIVE COALITION</span>
            </div>
            <h1 className="text-3xl sm:text-6xl font-mono font-black uppercase">
              {programme.headline || programme.title}
            </h1>
            <p className="font-mono text-base">{programme.description}</p>
          </div>

          {programme.pillars && programme.pillars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {programme.pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="border-2 border-current p-6 bg-card space-y-3 shadow-[4px_4px_0px_0px_currentColor]"
                >
                  <span className="font-mono text-xs font-bold uppercase">{pillar.tag || `[0${idx + 1}]`}</span>
                  <h3 className="font-mono text-lg font-bold uppercase">{pillar.title}</h3>
                  <p className="font-mono text-xs leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>
          ) : null}

          {children}
        </div>
      </div>
    );
  }

  // 3. EDITORIAL & SOVEREIGN CIVIC ARCHETYPES
  return (
    <div className="w-full bg-background text-foreground min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <header className="max-w-3xl space-y-5">
          {programme.eyebrow ? (
            <EditorialPill variant="default">{programme.eyebrow}</EditorialPill>
          ) : null}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
            {programme.headline || programme.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {programme.description}
          </p>
        </header>

        {/* Movement Pillars */}
        {programme.pillars && programme.pillars.length > 0 ? (
          <div className="space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
              PROGRAMME TENETS
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {programme.pillars.map((p, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border/70 bg-card p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="space-y-2">
                    <span className="font-mono text-xs font-bold text-primary">{p.tag || `0${i + 1}`}</span>
                    <h3 className="text-xl font-bold text-foreground">{p.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {children}
      </div>
    </div>
  );
}
