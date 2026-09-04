"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Layers,
  ChevronRight,
  Filter,
  Wheat,
  Activity,
  Droplets,
  GraduationCap,
  Hammer,
  Ship,
  Banknote,
  Briefcase,
  Home,
  Cpu,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BetaPillar, TrackedProject } from "@/data/reports-bulletin";

interface FollowTheMoneyPipelineProps {
  betaPillars: BetaPillar[];
  projects: TrackedProject[];
}

const PILLAR_ICONS: Record<string, React.ElementType> = {
  agriculture: Wheat,
  msme: Briefcase,
  housing: Home,
  health: Activity,
  digital: Cpu,
};

export function FollowTheMoneyPipeline({ betaPillars, projects }: FollowTheMoneyPipelineProps) {
  const [selectedPillarId, setSelectedPillarId] = useState<string>("ALL");
  const [selectedCounty, setSelectedCounty] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const countiesList = useMemo(() => {
    const list = Array.from(new Set(projects.map((p) => p.county)));
    return ["ALL", ...list];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchPillar = selectedPillarId === "ALL" || p.betaPillar === selectedPillarId;
      const matchCounty = selectedCounty === "ALL" || p.county === selectedCounty;
      const matchStatus =
        selectedStatus === "ALL" ||
        (selectedStatus === "Operational" && p.status.toLowerCase().includes("operational")) ||
        (selectedStatus === "Active" &&
          (p.status.toLowerCase().includes("construction") ||
            p.status.toLowerCase().includes("civil") ||
            p.status.toLowerCase().includes("progress") ||
            p.status.toLowerCase().includes("active")));
      return matchPillar && matchCounty && matchStatus;
    });
  }, [projects, selectedPillarId, selectedCounty, selectedStatus]);

  const activePillar = betaPillars.find((p) => p.id === selectedPillarId);

  return (
    <section id="chapter-04-follow-the-money" className="space-y-10 py-6">
      {/* Chapter Title & Supporting Line */}
      <div className="space-y-2 border-b border-border/40 pb-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
            04 / FOLLOW THE MONEY
          </span>
          <span className="text-muted-foreground/40">|</span>
          <span className="font-mono text-xs text-muted-foreground">
            From Parliamentary Vote to Ward Level Implementation
          </span>
        </div>
        <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Follow the money.
        </h2>
        <p className="text-base text-muted-foreground max-w-3xl leading-relaxed">
          From allocation to project, trace how Kenya&apos;s public money is supposed to move through the
          budget execution pipeline into communities.
        </p>
      </div>

      {/* 5-Stage Visual Money Flow Pipeline Banner */}
      <div className="rounded-3xl border border-border/80 bg-linear-to-r from-card via-card/80 to-muted/20 p-6 shadow-md space-y-4">
        <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
          The 5-Stage Public Money Flow Pipeline
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="rounded-2xl border border-border/60 bg-background/60 p-3.5 space-y-1">
            <span className="text-[10px] font-mono text-primary font-bold uppercase">Stage 01</span>
            <h4 className="font-heading text-sm font-bold text-foreground">National Budget</h4>
            <p className="font-mono text-xs text-emerald-500 font-bold">KES 4.82T</p>
            <p className="text-[11px] text-muted-foreground">Appropriation Act</p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/60 p-3.5 space-y-1">
            <span className="text-[10px] font-mono text-primary font-bold uppercase">Stage 02</span>
            <h4 className="font-heading text-sm font-bold text-foreground">Ministry / County</h4>
            <p className="font-mono text-xs text-foreground font-bold">State Allocations</p>
            <p className="text-[11px] text-muted-foreground">Treasury Exchequers</p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/60 p-3.5 space-y-1">
            <span className="text-[10px] font-mono text-primary font-bold uppercase">Stage 03</span>
            <h4 className="font-heading text-sm font-bold text-foreground">BETA Pillar / Sector</h4>
            <p className="font-mono text-xs text-foreground font-bold">5 Core Pillars</p>
            <p className="text-[11px] text-muted-foreground">Vote Head Accounts</p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/60 p-3.5 space-y-1">
            <span className="text-[10px] font-mono text-primary font-bold uppercase">Stage 04</span>
            <h4 className="font-heading text-sm font-bold text-foreground">Programme Votes</h4>
            <p className="font-mono text-xs text-foreground font-bold">Tenders & Contracts</p>
            <p className="text-[11px] text-muted-foreground">Procurement Awards</p>
          </div>

          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-3.5 space-y-1">
            <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase">Stage 05</span>
            <h4 className="font-heading text-sm font-bold text-emerald-500">Verified Project</h4>
            <p className="font-mono text-xs text-foreground font-bold">{projects.length} Audited</p>
            <p className="text-[11px] text-muted-foreground">Ward Ground Delivery</p>
          </div>
        </div>
      </div>

      {/* BETA Pillars Horizontal Selection Band */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Layers className="size-3.5 text-primary" />
            BETA Bottom-Up Agenda National Pillars
          </p>
          {selectedPillarId !== "ALL" && (
            <button
              onClick={() => setSelectedPillarId("ALL")}
              className="text-xs font-mono text-primary hover:underline cursor-pointer"
            >
              Reset Pillar Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {betaPillars.map((pillar) => {
            const isSelected = selectedPillarId === pillar.id;
            const Icon = PILLAR_ICONS[pillar.id] || Layers;

            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setSelectedPillarId(isSelected ? "ALL" : pillar.id)}
                className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary/40"
                    : "border-border/60 bg-card/60 hover:border-primary/40 hover:bg-card"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Icon className={`size-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="font-mono text-[10px] font-bold text-primary">
                      KES {pillar.nationalAllocationKesBillion}B
                    </span>
                  </div>
                  <h4 className="font-heading text-sm font-bold text-foreground mt-2 leading-snug">
                    {pillar.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {pillar.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Multi-facet Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border/40">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-muted-foreground font-semibold flex items-center gap-1">
            <Filter className="size-3" /> County:
          </span>
          {countiesList.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCounty(c)}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                selectedCounty === c
                  ? "bg-primary text-primary-foreground font-bold"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-muted-foreground">
          Showing <strong>{filteredProjects.length}</strong> of {projects.length} verified projects
        </span>
      </div>

      {/* Editorial Investigation Rows (NOT identical cards) */}
      <div className="space-y-3">
        {filteredProjects.map((proj) => (
          <article
            key={proj.id}
            className="group rounded-2xl border border-border/70 bg-card/60 hover:bg-card/90 p-5 transition-all duration-200 hover:border-primary/50 shadow-xs"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Col 1: Title & Location (5 Cols) */}
              <div className="md:col-span-5 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="font-mono text-[10px] font-bold">
                    {proj.county}
                  </Badge>
                  <span className="text-[11px] font-mono font-medium text-muted-foreground flex items-center gap-1">
                    <MapPin className="size-3 text-primary" /> {proj.location}
                  </span>
                </div>
                <h4 className="font-heading text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {proj.name}
                </h4>
              </div>

              {/* Col 2: Budget & Status (3 Cols) */}
              <div className="md:col-span-3 space-y-1">
                <p className="font-heading text-base font-black text-foreground">
                  {proj.budgetFormatted}
                </p>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    proj.status.toLowerCase().includes("operational") || proj.status.toLowerCase().includes("complete")
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                  }`}
                >
                  <CheckCircle2 className="size-3" />
                  {proj.status}
                </span>
              </div>

              {/* Col 3: Narrative & Dossier Action (4 Cols) */}
              <div className="md:col-span-4 flex flex-col justify-between items-start md:items-end gap-2">
                <p className="text-xs text-muted-foreground line-clamp-2 md:text-right leading-relaxed">
                  {proj.description}
                </p>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-xs font-mono font-bold text-primary p-0 h-auto group/btn"
                >
                  <Link href={`/reports/${proj.reportSlug}`}>
                    <span>View Audit Dossier</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
