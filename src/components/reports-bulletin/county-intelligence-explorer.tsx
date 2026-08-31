"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  Building2,
  Users,
  Globe,
  FileCheck2,
  ArrowRight,
  ExternalLink,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Filter,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FocusCountyProfile, CountyAllocationRecord } from "@/data/reports-bulletin";
import { getAllCountiesAllocations } from "@/data/reports-bulletin";

interface CountyIntelligenceExplorerProps {
  focusCounties: FocusCountyProfile[];
}

// Kenya Geographic County Nodes Coordinates for Interactive SVG Map
// Standardized on 600x680 bounding coordinate space representing Kenya's 47 counties
const KENYA_MAP_COUNTY_NODES = [
  { code: 1, name: "Mombasa", x: 440, y: 560, region: "Coast" },
  { code: 2, name: "Kwale", x: 390, y: 575, region: "Coast" },
  { code: 3, name: "Kilifi", x: 440, y: 510, region: "Coast" },
  { code: 4, name: "Tana River", x: 440, y: 410, region: "Coast" },
  { code: 5, name: "Lamu", x: 500, y: 440, region: "Coast" },
  { code: 6, name: "Taita Taveta", x: 360, y: 530, region: "Coast" },
  { code: 7, name: "Garissa", x: 450, y: 320, region: "North" },
  { code: 8, name: "Wajir", x: 460, y: 200, region: "North" },
  { code: 9, name: "Mandera", x: 520, y: 110, region: "North" },
  { code: 10, name: "Marsabit", x: 340, y: 170, region: "North" },
  { code: 11, name: "Isiolo", x: 350, y: 270, region: "North" },
  { code: 12, name: "Meru", x: 330, y: 320, region: "Central" },
  { code: 13, name: "Tharaka-Nithi", x: 350, y: 345, region: "Central" },
  { code: 14, name: "Embu", x: 330, y: 365, region: "Central" },
  { code: 15, name: "Kitui", x: 380, y: 390, region: "Eastern" },
  { code: 16, name: "Machakos", x: 310, y: 410, region: "Eastern" },
  { code: 17, name: "Makueni", x: 340, y: 460, region: "Eastern" },
  { code: 18, name: "Nyandarua", x: 260, y: 345, region: "Central" },
  { code: 19, name: "Nyeri", x: 290, y: 345, region: "Central" },
  { code: 20, name: "Kirinyaga", x: 310, y: 355, region: "Central" },
  { code: 21, name: "Murang'a", x: 295, y: 375, region: "Central" },
  { code: 22, name: "Kiambu", x: 280, y: 395, region: "Central" },
  { code: 23, name: "Turkana", x: 190, y: 130, region: "Rift" },
  { code: 24, name: "West Pokot", x: 165, y: 225, region: "Rift" },
  { code: 25, name: "Samburu", x: 280, y: 235, region: "Rift" },
  { code: 26, name: "Trans Nzoia", x: 145, y: 265, region: "Rift" },
  { code: 27, name: "Uasin Gishu", x: 175, y: 285, region: "Rift" },
  { code: 28, name: "Elgeyo Marakwet", x: 195, y: 265, region: "Rift" },
  { code: 29, name: "Nandi", x: 160, y: 315, region: "Rift" },
  { code: 30, name: "Baringo", x: 225, y: 275, region: "Rift" },
  { code: 31, name: "Laikipia", x: 265, y: 305, region: "Rift" },
  { code: 32, name: "Nakuru", x: 235, y: 355, region: "Rift" },
  { code: 33, name: "Narok", x: 215, y: 445, region: "Rift" },
  { code: 34, name: "Kajiado", x: 285, y: 470, region: "Rift" },
  { code: 35, name: "Kericho", x: 165, y: 360, region: "Rift" },
  { code: 36, name: "Bomet", x: 165, y: 395, region: "Rift" },
  { code: 37, name: "Kakamega", x: 115, y: 305, region: "Western" },
  { code: 38, name: "Vihiga", x: 115, y: 330, region: "Western" },
  { code: 39, name: "Bungoma", x: 105, y: 275, region: "Western" },
  { code: 40, name: "Busia", x: 80, y: 315, region: "Western" },
  { code: 41, name: "Siaya", x: 85, y: 350, region: "Western" },
  { code: 42, name: "Kisumu", x: 120, y: 360, region: "Western" },
  { code: 43, name: "Homa Bay", x: 95, y: 395, region: "Western" },
  { code: 44, name: "Migori", x: 95, y: 435, region: "Western" },
  { code: 45, name: "Kisii", x: 125, y: 405, region: "Western" },
  { code: 46, name: "Nyamira", x: 140, y: 385, region: "Western" },
  { code: 47, name: "Nairobi", x: 280, y: 420, region: "Central" },
];

const REGION_FILTERS = [
  { id: "ALL", label: "All 47 Counties" },
  { id: "FOCUS", label: "BNS Focus Hubs" },
  { id: "Rift", label: "Rift Valley" },
  { id: "Western", label: "Western & Nyanza" },
  { id: "Central", label: "Central & Nairobi" },
  { id: "Coast", label: "Coast" },
  { id: "North", label: "Northern Arid" },
];

export function CountyIntelligenceExplorer({ focusCounties }: CountyIntelligenceExplorerProps) {
  const allCounties = useMemo(() => getAllCountiesAllocations(), []);
  const [selectedCode, setSelectedCode] = useState<number>(37); // Default Kakamega
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [hoveredCode, setHoveredCode] = useState<number | null>(null);
  const [sortField, setSortField] = useState<"allocation" | "execution" | "name">("allocation");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Lookups
  const selectedCountyRecord = useMemo(() => {
    return allCounties.find((c) => c.code === selectedCode) || allCounties[0];
  }, [allCounties, selectedCode]);

  const selectedFocusProfile = useMemo(() => {
    return focusCounties.find((fc) => fc.code === selectedCode);
  }, [focusCounties, selectedCode]);

  const filteredCounties = useMemo(() => {
    return allCounties.filter((c) => {
      const matchSearch =
        !searchFilter ||
        c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        c.capital.toLowerCase().includes(searchFilter.toLowerCase()) ||
        String(c.code).includes(searchFilter);

      const mapNode = KENYA_MAP_COUNTY_NODES.find((m) => m.code === c.code);
      const isFocus = focusCounties.some((fc) => fc.code === c.code);

      if (selectedRegion === "FOCUS") return matchSearch && isFocus;
      if (selectedRegion !== "ALL" && mapNode) {
        return matchSearch && mapNode.region === selectedRegion;
      }
      return matchSearch;
    });
  }, [allCounties, searchFilter, selectedRegion, focusCounties]);

  const sortedCounties = useMemo(() => {
    return [...filteredCounties].sort((a, b) => {
      if (sortField === "allocation") {
        return sortAsc
          ? a.allocationKesMillion - b.allocationKesMillion
          : b.allocationKesMillion - a.allocationKesMillion;
      }
      if (sortField === "execution") {
        return sortAsc
          ? a.executionRatePct - b.executionRatePct
          : b.executionRatePct - a.executionRatePct;
      }
      return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });
  }, [filteredCounties, sortField, sortAsc]);

  const handleSort = (field: "allocation" | "execution" | "name") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <section id="chapter-03-county-explorer" className="space-y-10 py-6">
      {/* Chapter Title */}
      <div className="space-y-2 border-b border-border/40 pb-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
            03 / COUNTIES
          </span>
          <span className="text-muted-foreground/40">|</span>
          <span className="font-mono text-xs text-muted-foreground">
            47 Devolved Governments · Devolution Transfers & Field Audits
          </span>
        </div>
        <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          County Intelligence Explorer.
        </h2>
        <p className="text-base text-muted-foreground max-w-3xl leading-relaxed">
          Interactive devolution tracker connecting KES 502 Billion in national transfers to county allocations,
          execution rates, sector priorities, and BNS Mashinani ground audits.
        </p>
      </div>

      {/* Region Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {REGION_FILTERS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setSelectedRegion(r.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all shrink-0 cursor-pointer ${
              selectedRegion === r.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-border/60 bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/40"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Main Asymmetric Explorer: Left Dossier vs Right Interactive Kenya Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: Selected County Intelligence Dossier (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl border border-border/80 bg-card/90 p-6 sm:p-8 shadow-md space-y-6">
            {/* Header with County Code Badge & Status */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-base font-mono font-black text-primary border border-primary/20">
                  {String(selectedCountyRecord.code).padStart(3, "0")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
                      {selectedCountyRecord.name} County
                    </h3>
                    {selectedFocusProfile && (
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-mono">
                        BNS Focus Hub
                      </Badge>
                    )}
                  </div>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <MapPin className="size-3.5 text-primary" /> Capital: <strong>{selectedCountyRecord.capital}</strong>
                    {selectedFocusProfile && (
                      <>
                        <span>·</span>
                        <span>Pop: {selectedFocusProfile.population}</span>
                        <span>·</span>
                        <span>{selectedFocusProfile.subCountiesCount} Sub-counties</span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              <Badge
                variant="outline"
                className="text-xs font-mono font-bold bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 px-3 py-1"
              >
                {selectedCountyRecord.executionRatePct}% Absorbed
              </Badge>
            </div>

            {/* Dominant County Allocation Figure */}
            <div className="rounded-2xl bg-muted/40 p-5 space-y-1">
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Equitable Revenue Allocation (FY 2026/27)
              </p>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
                  KES {(selectedCountyRecord.allocationKesMillion / 1000).toFixed(2)} Billion
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  ({selectedCountyRecord.allocationKesMillion.toLocaleString()}M)
                </span>
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                Distributed under the CRA 3rd Basis Formula (Population 18%, Health 17%, Agriculture 10%, Poverty 14%, Land 8%).
              </p>
            </div>

            {/* Sector Spending Breakdown */}
            <div className="space-y-3">
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Sector Allocation Distribution
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                <div className="border border-border/60 bg-background/50 rounded-xl p-3">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase">Health</p>
                  <p className="font-heading text-lg font-bold text-foreground mt-0.5">
                    {selectedCountyRecord.healthSharePct}%
                  </p>
                </div>
                <div className="border border-border/60 bg-background/50 rounded-xl p-3">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase">Infrastructure</p>
                  <p className="font-heading text-lg font-bold text-foreground mt-0.5">
                    {selectedCountyRecord.infrastructurePct}%
                  </p>
                </div>
                <div className="border border-border/60 bg-background/50 rounded-xl p-3">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase">Education</p>
                  <p className="font-heading text-lg font-bold text-foreground mt-0.5">
                    {selectedCountyRecord.educationSharePct}%
                  </p>
                </div>
                <div className="border border-border/60 bg-background/50 rounded-xl p-3">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase">Agriculture</p>
                  <p className="font-heading text-lg font-bold text-foreground mt-0.5">
                    {selectedFocusProfile?.agricultureSharePct ?? "18.5"}%
                  </p>
                </div>
              </div>
            </div>

            {/* If Focus County: Governor, OSR, Pending Bills & Projects */}
            {selectedFocusProfile && (
              <div className="space-y-4 pt-2 border-t border-border/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-mono text-muted-foreground uppercase text-[10px]">County Executive Lead</span>
                    <p className="font-semibold text-foreground mt-0.5">{selectedFocusProfile.governor}</p>
                    <p className="text-muted-foreground text-[11px] mt-0.5">{selectedFocusProfile.headquarters}</p>
                  </div>
                  <div>
                    <span className="font-mono text-muted-foreground uppercase text-[10px]">OSR Target vs Liabilities</span>
                    <p className="font-semibold text-foreground mt-0.5">
                      Target: KES {selectedFocusProfile.osrTargetKesMillion}M
                    </p>
                    <p className="text-amber-500 font-mono text-[11px] mt-0.5">
                      Pending Bills: KES {selectedFocusProfile.pendingBillsKesMillion}M
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Verified Key Tracked Projects
                  </span>
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    {selectedFocusProfile.keyProjects.map((p, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-foreground/90">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button asChild size="sm" className="gap-2 text-xs font-bold bg-primary text-primary-foreground">
                    <Link href={`/reports/${selectedFocusProfile.reportSlug}`}>
                      <span>Read Full {selectedFocusProfile.name} Dossier</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>

                  <a
                    href={selectedFocusProfile.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/70 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <Globe className="size-3.5 text-primary" />
                    <span>Official Portal</span>
                    <ExternalLink className="size-2.5 opacity-60" />
                  </a>

                  <a
                    href={selectedFocusProfile.budgetPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/70 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <FileCheck2 className="size-3.5 text-emerald-500" />
                    <span>Treasury Budget Docs</span>
                    <ExternalLink className="size-2.5 opacity-60" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Interactive Kenya Map (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl border border-border/80 bg-card/70 p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="size-4 text-primary" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                  Kenya Geographic Map Selector
                </span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">Click node to inspect</span>
            </div>

            {/* Interactive SVG Kenya Visual Map */}
            <div className="relative w-full aspect-[6/7] rounded-2xl bg-zinc-950/80 border border-border/60 overflow-hidden flex items-center justify-center p-2">
              <svg
                viewBox="0 0 600 680"
                className="w-full h-full select-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Stylized Kenya Territorial Outline Contour */}
                <path
                  d="M 120 180 Q 200 80 340 100 T 540 100 Q 560 220 520 340 T 470 470 Q 450 580 430 630 T 360 590 Q 280 540 220 500 T 80 430 Q 70 330 90 260 Z"
                  fill="rgba(30, 41, 59, 0.3)"
                  stroke="rgba(148, 163, 184, 0.2)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Lake Victoria Indicative Water Basin */}
                <path
                  d="M 60 360 Q 80 340 100 370 T 90 440 Q 60 420 60 360 Z"
                  fill="rgba(56, 189, 248, 0.15)"
                  stroke="rgba(56, 189, 248, 0.4)"
                  strokeWidth="1.5"
                />
                <text x="65" y="405" fill="rgba(56, 189, 248, 0.6)" fontSize="9" fontFamily="monospace">
                  L. Victoria
                </text>

                {/* Indian Ocean Indicative Line */}
                <path
                  d="M 450 520 Q 530 560 550 640"
                  stroke="rgba(56, 189, 248, 0.4)"
                  strokeWidth="2"
                  fill="none"
                />
                <text x="490" y="610" fill="rgba(56, 189, 248, 0.6)" fontSize="9" fontFamily="monospace">
                  Indian Ocean
                </text>

                {/* Interactive County Nodes */}
                {KENYA_MAP_COUNTY_NODES.map((node) => {
                  const isSelected = selectedCode === node.code;
                  const isHovered = hoveredCode === node.code;
                  const isFocus = focusCounties.some((fc) => fc.code === node.code);

                  return (
                    <g
                      key={node.code}
                      onClick={() => setSelectedCode(node.code)}
                      onMouseEnter={() => setHoveredCode(node.code)}
                      onMouseLeave={() => setHoveredCode(null)}
                      className="cursor-pointer transition-all duration-200"
                    >
                      {/* Selection Ring */}
                      {isSelected && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="14"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          className="animate-ping opacity-75"
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isSelected ? 10 : isFocus ? 8 : isHovered ? 7 : 5}
                        fill={
                          isSelected
                            ? "#3b82f6"
                            : isFocus
                            ? "#10b981"
                            : isHovered
                            ? "#94a3b8"
                            : "rgba(148, 163, 184, 0.5)"
                        }
                        stroke={isSelected ? "#ffffff" : isFocus ? "#059669" : "rgba(0,0,0,0.5)"}
                        strokeWidth={isSelected ? 2 : 1}
                      />

                      {/* Label for Focus Counties or Selected */}
                      {(isSelected || isFocus || isHovered) && (
                        <text
                          x={node.x + 12}
                          y={node.y + 4}
                          fill={isSelected ? "#ffffff" : isFocus ? "#34d399" : "#cbd5e1"}
                          fontSize={isSelected ? "12" : "10"}
                          fontWeight={isSelected || isFocus ? "bold" : "normal"}
                          fontFamily="sans-serif"
                          className="pointer-events-none drop-shadow-md"
                        >
                          {node.name}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Map Legend */}
              <div className="absolute bottom-3 left-3 bg-zinc-900/90 backdrop-blur-md rounded-lg p-2 border border-border/40 text-[10px] font-mono space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span>BNS Mashinani Hubs</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-400">
                  <span className="size-2 rounded-full bg-blue-500" />
                  <span>Active Selection</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="size-2 rounded-full bg-slate-400" />
                  <span>47 Counties</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ranked 47 Counties Data Table (Searchable & Sortable) */}
      <div className="rounded-3xl border border-border/70 bg-card/60 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-heading text-xl font-bold text-foreground">
              47 County Allocations & Performance Matrix
            </h3>
            <p className="text-xs text-muted-foreground">
              Ranked allocation schedule under CRA 3rd Basis Formula (FY 2026/27).
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by county name..."
              className="h-8 pl-9 text-xs rounded-xl bg-background/80"
            />
          </div>
        </div>

        {/* The Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground uppercase text-[10px]">
                <th className="py-2.5 px-3">Code</th>
                <th
                  className="py-2.5 px-3 cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("name")}
                >
                  <span className="inline-flex items-center gap-1">
                    County Name <ArrowUpDown className="size-3" />
                  </span>
                </th>
                <th className="py-2.5 px-3">Capital</th>
                <th
                  className="py-2.5 px-3 cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("allocation")}
                >
                  <span className="inline-flex items-center gap-1">
                    Equitable Allocation <ArrowUpDown className="size-3" />
                  </span>
                </th>
                <th
                  className="py-2.5 px-3 cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("execution")}
                >
                  <span className="inline-flex items-center gap-1">
                    Absorption % <ArrowUpDown className="size-3" />
                  </span>
                </th>
                <th className="py-2.5 px-3">Health %</th>
                <th className="py-2.5 px-3">Infra %</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {sortedCounties.map((c) => {
                const isSelected = selectedCode === c.code;
                const focusItem = focusCounties.find((fc) => fc.code === c.code);

                return (
                  <tr
                    key={c.code}
                    onClick={() => setSelectedCode(c.code)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 text-foreground font-semibold"
                        : "hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold">{String(c.code).padStart(3, "0")}</td>
                    <td className="py-2.5 px-3 text-foreground font-semibold flex items-center gap-1.5">
                      <span>{c.name}</span>
                      {focusItem && (
                        <span className="size-1.5 rounded-full bg-emerald-500" title="BNS Focus Hub" />
                      )}
                    </td>
                    <td className="py-2.5 px-3">{c.capital}</td>
                    <td className="py-2.5 px-3 text-foreground font-bold">
                      KES {(c.allocationKesMillion / 1000).toFixed(2)}B
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          c.executionRatePct >= 90
                            ? "bg-emerald-500/10 text-emerald-500"
                            : c.executionRatePct >= 85
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-amber-500/10 text-amber-500"
                        }`}
                      >
                        {c.executionRatePct}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3">{c.healthSharePct}%</td>
                    <td className="py-2.5 px-3">{c.infrastructurePct}%</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCode(c.code);
                        }}
                        className="text-primary hover:underline font-bold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
