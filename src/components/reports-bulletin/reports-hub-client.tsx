"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
  FileText,
  MapPin,
  Sparkles,
  TrendingUp,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getFocusCounties,
  getAllReports,
  getIndexedQuestions,
  REPORTS_BULLETIN_DATA,
  searchBudgetQuestions,
} from "@/data/reports-bulletin";
import { CountyFocusCards } from "./county-focus-cards";
import { QuestionSorter } from "./question-sorter";

export function ReportsHubClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProgramme, setSelectedProgramme] = useState("All");
  const [selectedCounty, setSelectedCounty] = useState("All");

  const focusCounties = useMemo(() => getFocusCounties(), []);
  const allReports = useMemo(() => getAllReports(), []);
  const allQuestions = useMemo(() => getIndexedQuestions(), []);
  const hubMeta = REPORTS_BULLETIN_DATA.hubMeta;

  const { matchingQuestions, matchingReports } = useMemo(() => {
    return searchBudgetQuestions(
      searchQuery,
      selectedCategory,
      selectedCounty,
      selectedProgramme,
    );
  }, [searchQuery, selectedCategory, selectedCounty, selectedProgramme]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Hero Header & National Budget Macro Strip */}
      <section className="space-y-6 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <Badge variant="default" className="text-xs font-bold uppercase tracking-wider">
            Reports Bulletin {hubMeta.fiscalYear}
          </Badge>
          <Badge variant="outline" className="gap-1 text-xs font-semibold border-primary/30 text-primary">
            <ShieldCheck className="size-3.5" /> BNS Mashinani & Connect
          </Badge>
        </div>

        <div className="space-y-3">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
            Kenya National Budget <br className="hidden sm:inline" />
            <span className="bg-linear-to-r from-primary via-emerald-600 to-primary bg-clip-text text-transparent">
              Reports & Citizen Intelligence
            </span>
          </h1>
          <p className="max-w-3xl text-sm sm:text-base md:text-lg text-muted-foreground">
            Authoritative, verified analysis of Kenya's <strong>KES 4.82 Trillion</strong> national budget and 47 county devolution allocations. Embedded field investigations in <strong>Kakamega</strong>, <strong>Kilifi</strong>, <strong>Nakuru</strong>, and <strong>Wajir</strong> by BNS Mashinani.
          </p>
        </div>

        {/* Macro KPI Bar */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-2">
          <div className="rounded-2xl border border-border/70 bg-card p-4 text-left shadow-xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground truncate">
              National Budget
            </p>
            <p className="font-heading text-xl md:text-2xl font-extrabold text-foreground">
              KES 4.82T
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Approved FY 2026/27</p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-4 text-left shadow-xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground truncate">
              KRA Ordinary Revenue
            </p>
            <p className="font-heading text-xl md:text-2xl font-extrabold text-foreground">
              KES 2.99T
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Tax receipts target</p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-4 text-left shadow-xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground truncate">
              Debt Servicing (CFS)
            </p>
            <p className="font-heading text-xl md:text-2xl font-extrabold text-amber-600 dark:text-amber-400">
              KES 1.20T
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">40% of tax revenue</p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-4 text-left shadow-xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground truncate">
              Devolution Transfers
            </p>
            <p className="font-heading text-xl md:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              KES 502B
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">47 County equitable share</p>
          </div>
        </div>
      </section>

      {/* Focus Counties Spotlight (BNS Mashinani) */}
      <CountyFocusCards counties={focusCounties} />

      {/* Interactive Question Sorter Search Engine */}
      <QuestionSorter
        questions={matchingQuestions}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedProgramme={selectedProgramme}
        onProgrammeChange={setSelectedProgramme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Verified Report Dossiers Grid (The Blog / Bulletin Way) */}
      <section className="space-y-6 pt-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between border-b border-border/50 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider border-primary/30 text-primary">
                The Bulletin Desk
              </Badge>
            </div>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl mt-1">
              Verified Report Dossiers & Investigative Analyses
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Each report is an orchestrated, multi-step audited dossier connecting national policy to citizen ward impact.
            </p>
          </div>
          <span className="text-xs text-muted-foreground font-semibold">
            Showing <strong>{matchingReports.length}</strong> of {allReports.length} dossiers
          </span>
        </div>

        {matchingReports.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-12 text-center">
            <FileText className="mx-auto size-10 text-muted-foreground/40" />
            <h3 className="mt-3 text-base font-bold text-foreground">No reports match your filter</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Try searching with different keywords or resetting filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {matchingReports.map((report) => (
              <article
                key={report.slug}
                className="group relative flex flex-col justify-between rounded-3xl border border-border/70 bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="text-[10px] font-bold uppercase tracking-wider">
                        {report.eyebrow}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] font-semibold">
                        {report.programme}
                      </Badge>
                    </div>
                    {report.county !== "National" && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <MapPin className="size-3" /> {report.county}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                      <Link href={`/reports/${report.slug}`}>{report.title}</Link>
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {report.citizenTakeaway[0]}
                    </p>
                  </div>

                  {/* KPI Highlights in Card */}
                  {report.kpis && report.kpis.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted/40 p-3 text-left">
                      {report.kpis.slice(0, 2).map((kpi, kIdx) => (
                        <div key={kIdx}>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground truncate">
                            {kpi.label}
                          </p>
                          <p className="font-heading text-sm font-bold text-foreground">
                            {kpi.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5" /> {report.publishedDate}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" /> {report.readTimeMinutes} min
                    </span>
                  </div>

                  <Button asChild variant="ghost" size="sm" className="gap-1 text-xs font-bold text-primary p-0 h-auto group/link">
                    <Link href={`/reports/${report.slug}`}>
                      <span>Read Dossier</span>
                      <ArrowRight className="size-3.5 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
