"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, Calendar, Clock, MapPin, ArrowRight, FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EditorialPill, PillButtonGroup } from "@/components/ui/editorial";
import type { ReportDossier } from "@/data/reports-bulletin";

interface ReportLibraryArchiveProps {
  reports: ReportDossier[];
}

const SECTOR_OPTIONS = ["All", "National Budget", "County Budgets", "Debt & Deficit", "Education", "Blue Economy"];
const PROGRAMME_OPTIONS = ["All", "BNS Connect", "BNS Mashinani", "Wanahabari Lab", "BNS Studios"];

export function ReportLibraryArchive({ reports }: ReportLibraryArchiveProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [selectedProgramme, setSelectedProgramme] = useState("All");
  const [selectedCounty, setSelectedCounty] = useState("All");

  const countiesList = useMemo(() => {
    const list = Array.from(new Set(reports.map((r) => r.county)));
    return ["All", ...list];
  }, [reports]);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        searchQuery === "" ||
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.seoDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.county.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSector =
        selectedSector === "All" ||
        report.category === selectedSector ||
        report.eyebrow.toLowerCase().includes(selectedSector.toLowerCase());

      const matchesProgramme =
        selectedProgramme === "All" || report.programme === selectedProgramme;

      const matchesCounty =
        selectedCounty === "All" || report.county === selectedCounty;

      return matchesSearch && matchesSector && matchesProgramme && matchesCounty;
    });
  }, [reports, searchQuery, selectedSector, selectedProgramme, selectedCounty]);

  return (
    <section id="chapter-07-report-library" className="space-y-10 py-6">
      {/* Chapter Title Specimen Lockup */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-foreground/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-serif italic text-2xl text-primary font-normal">
              Fig 07;
            </span>
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
              PERMANENT AUDIT ARCHIVE
            </span>
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Reports &amp; investigations library.
          </h2>
        </div>
        <span className="text-xs font-mono text-muted-foreground border border-foreground/10 rounded-md px-2.5 py-1 bg-muted/30 self-start sm:self-auto">
          {reports.length} Verified Dossiers Archived
        </span>
      </div>

      {/* Filter Controls Bar with Hairline Borders */}
      <div className="rounded-2xl border border-foreground/10 bg-card/60 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by title, keyword, or county..."
              className="h-10 pl-10 text-xs sm:text-sm rounded-xl bg-background/80 border-foreground/10"
            />
          </div>

          {/* Sector Filter Badges */}
          <div className="md:col-span-7 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono font-semibold text-muted-foreground flex items-center gap-1 mr-1">
              <Filter className="size-3" /> Sector:
            </span>
            {SECTOR_OPTIONS.map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setSelectedSector(sec)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                  selectedSector === sec
                    ? "bg-primary text-primary-foreground font-bold"
                    : "bg-muted/40 text-muted-foreground hover:text-foreground border border-foreground/5"
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filter Row: Programme & County */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-foreground/10 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground">Programme:</span>
            {PROGRAMME_OPTIONS.map((prog) => (
              <button
                key={prog}
                type="button"
                onClick={() => setSelectedProgramme(prog)}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  selectedProgramme === prog
                    ? "bg-foreground text-background font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {prog}
              </button>
            ))}
          </div>

          <span className="text-muted-foreground">
            Showing <strong>{filteredReports.length}</strong> of {reports.length} report dossiers
          </span>
        </div>
      </div>

      {/* Specimen Catalogue Index */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-foreground/20 p-12 text-center space-y-3">
            <FileText className="mx-auto size-10 text-muted-foreground/30" />
            <h4 className="text-base font-bold text-foreground">No reports match your active filter</h4>
            <p className="text-xs text-muted-foreground">
              Try adjusting your search terms or clearing active filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedSector("All");
                setSelectedProgramme("All");
                setSelectedCounty("All");
              }}
              className="mt-2 text-xs font-mono"
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-foreground/10 rounded-2xl border border-foreground/10 bg-card/60 overflow-hidden shadow-xs">
            {filteredReports.map((report, idx) => (
              <article
                key={report.slug}
                className="group p-6 sm:p-7 hover:bg-card/90 transition-all duration-200"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Left: Specimen Metadata & Dominant Title (8 Cols) */}
                  <div className="lg:col-span-8 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-muted-foreground">
                        CATALOG #{String(idx + 1).padStart(2, "0")}
                      </span>
                      <EditorialPill variant="primary" size="xs">
                        {report.eyebrow}
                      </EditorialPill>
                      <EditorialPill variant="outline" size="xs">
                        {report.programme}
                      </EditorialPill>
                      {report.county !== "National" && (
                        <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <MapPin className="size-3" /> {report.county}
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                      <Link href={`/reports/${report.slug}`}>{report.title}</Link>
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {report.citizenTakeaway[0] || report.seoDescription}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5" /> {report.publishedDate}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5" /> {report.readTimeMinutes} min read
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-foreground font-medium">
                        <ShieldCheck className="size-3.5 text-emerald-500" /> {report.provenance.analystSignoff}
                      </span>
                    </div>
                  </div>

                  {/* Right: Key KPI & Read Action Link (4 Cols) */}
                  <div className="lg:col-span-4 flex flex-col justify-between items-start lg:items-end gap-4 border-t lg:border-t-0 lg:border-l border-foreground/10 pt-4 lg:pt-0 lg:pl-6">
                    {report.kpis && report.kpis.length > 0 && (
                      <div className="w-full lg:text-right space-y-0.5 bg-muted/30 lg:bg-transparent rounded-xl p-3 lg:p-0">
                        <p className="text-[10px] font-mono text-muted-foreground uppercase">
                          {report.kpis[0].label}
                        </p>
                        <p className="font-heading text-lg font-black text-foreground tabular-nums">
                          {report.kpis[0].value}
                        </p>
                        <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                          {report.kpis[0].change}
                        </p>
                      </div>
                    )}

                    <PillButtonGroup
                      href={`/reports/${report.slug}`}
                      label="Open Dossier"
                      variant="primary"
                      size="sm"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
