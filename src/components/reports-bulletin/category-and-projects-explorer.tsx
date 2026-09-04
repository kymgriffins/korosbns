"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Wheat,
  Activity,
  Droplets,
  GraduationCap,
  Hammer,
  Ship,
  Banknote,
  Briefcase,
  Layers,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BetaPillar, TrackedProject } from "@/data/reports-bulletin";

interface CategoryAndProjectsExplorerProps {
  betaPillars: BetaPillar[];
  projects: TrackedProject[];
  activeSector: string;
  onSectorChange: (sector: string) => void;
}

const SECTOR_CATEGORIES = [
  { id: "All", label: "All Sectors & Projects", icon: Layers },
  { id: "Agriculture", label: "Agriculture & Food (BETA)", icon: Wheat },
  { id: "Water", label: "Water & Climate Resilience", icon: Droplets },
  { id: "Health", label: "Health & Medical (UHC/SHA)", icon: Activity },
  { id: "Education", label: "Education & Capitation", icon: GraduationCap },
  { id: "Infrastructure", label: "Roads & Infrastructure", icon: Hammer },
  { id: "Blue Economy", label: "Blue Economy & Fisheries", icon: Ship },
  { id: "Debt", label: "Debt & Devolution Transfers", icon: Banknote },
];

export function CategoryAndProjectsExplorer({
  betaPillars,
  projects,
  activeSector,
  onSectorChange,
}: CategoryAndProjectsExplorerProps) {
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (selectedPillar) {
        return p.betaPillar === selectedPillar;
      }
      if (activeSector === "All") return true;
      return (
        p.sector.toLowerCase().includes(activeSector.toLowerCase()) ||
        p.name.toLowerCase().includes(activeSector.toLowerCase())
      );
    });
  }, [projects, activeSector, selectedPillar]);

  return (
    <section className="my-10 space-y-8" id="projects-and-sectors">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between border-b border-border/50 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex size-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              BETA Bottom-Up Agenda & Sector Directory
            </span>
          </div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl mt-1">
            Sector Categories & Tracked Projects
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Explore national budget votes and county execution across <strong>Agriculture</strong>, <strong>Water</strong>, <strong>Healthcare (SHA)</strong>, and <strong>Affordable Housing</strong>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-semibold px-3 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
            {filteredProjects.length} Verified Projects
          </Badge>
        </div>
      </div>

      {/* 5 BETA Bottom-Up Agenda Pillar Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Layers className="size-3.5 text-primary" />
            Core National BETA Pillars (FY 2026/27)
          </p>
          {selectedPillar && (
            <button
              onClick={() => setSelectedPillar(null)}
              className="text-xs font-medium text-primary hover:underline"
            >
              Clear Pillar Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {betaPillars.map((pillar) => {
            const isSelected = selectedPillar === pillar.id;
            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    setSelectedPillar(null);
                  } else {
                    setSelectedPillar(pillar.id);
                    onSectorChange("All");
                  }
                }}
                className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-300 ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/30"
                    : "border-border/60 bg-card/60 hover:border-primary/40 hover:bg-card/90"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      KES {pillar.nationalAllocationKesBillion}B Vote
                    </span>
                    {isSelected && (
                      <span className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading text-sm font-bold text-foreground mt-1 leading-snug">
                    {pillar.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {pillar.tagline}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground font-medium">
                  <span>{pillar.keyCounties.join(", ")}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sector Category Nav Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {SECTOR_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeSector === cat.id && !selectedPillar;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedPillar(null);
                onSectorChange(cat.id);
              }}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border/70 bg-card/60 text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-foreground">
            Audited Flagship & County Projects
          </h3>
          <span className="text-xs text-muted-foreground">
            Showing {filteredProjects.length} of {projects.length} tracked projects
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="secondary" className="text-[10px] font-bold">
                    {proj.county}
                  </Badge>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                    {proj.status}
                  </span>
                </div>

                <h4 className="font-heading text-base font-bold text-foreground mt-2 group-hover:text-primary transition-colors leading-snug">
                  {proj.name}
                </h4>

                <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <MapPin className="size-3 shrink-0 text-primary" /> {proj.location}
                </p>

                <div className="mt-3 rounded-xl bg-muted/40 p-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Budget Allocation:</span>
                    <span className="font-heading font-extrabold text-foreground">{proj.budgetFormatted}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-muted-foreground font-medium">Sector:</span>
                    <span className="text-foreground font-semibold truncate max-w-[160px]">{proj.sector}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-3 line-clamp-3 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/40">
                <Button asChild variant="ghost" size="sm" className="w-full justify-between group/btn text-xs font-semibold">
                  <Link href={`/reports/${proj.reportSlug}`}>
                    <span>View County Report</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
