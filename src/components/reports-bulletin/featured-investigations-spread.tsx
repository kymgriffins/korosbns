"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorialPill, PillButtonGroup } from "@/components/ui/editorial";
import type { ReportDossier } from "@/data/reports-bulletin";

interface FeaturedInvestigationsSpreadProps {
  reports: ReportDossier[];
}

export function FeaturedInvestigationsSpread({ reports }: FeaturedInvestigationsSpreadProps) {
  // Select the primary flagship report (e.g. National Budget breakdown or Debt crisis)
  const leadReport = reports.find((r) => r.slug === "national-budget-2026-2027-breakdown") || reports[0];
  // Select two prominent secondary investigations
  const secondaryReports = reports
    .filter((r) => r.slug !== leadReport?.slug)
    .slice(0, 2);

  if (!leadReport) return null;

  return (
    <section id="chapter-05-investigations" className="space-y-10 py-6">
      {/* Chapter Title Specimen Lockup */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-foreground/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-serif italic text-2xl text-primary font-normal">
              Fig 04;
            </span>
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
              INVESTIGATIVE AUDIT DOSSIERS
            </span>
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Audited investigative reports.
          </h2>
        </div>
        <span className="text-xs font-mono text-muted-foreground border border-foreground/10 rounded-md px-2.5 py-1 bg-muted/30 self-start sm:self-auto">
          BNS Connect &amp; Wanahabari Desk
        </span>
      </div>

      {/* Asymmetric Editorial Spread: 1 Large Lead + 2 Stacked Secondary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEAD INVESTIGATION (7 Cols) */}
        <article className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-foreground/10 bg-card/70 p-7 sm:p-9 shadow-sm relative overflow-hidden group hover:border-primary/40 transition-colors">
          <div className="space-y-6">
            {/* Category Eyebrow & Specimen Pill Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-foreground/10">
              <div className="flex items-center gap-2">
                <EditorialPill variant="primary" size="xs">
                  {leadReport.eyebrow}
                </EditorialPill>
                <EditorialPill variant="outline" size="xs">
                  {leadReport.programme}
                </EditorialPill>
              </div>
              <span className="font-mono text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="size-3.5" /> {leadReport.readTimeMinutes} min read
              </span>
            </div>

            {/* Headline */}
            <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-foreground group-hover:text-primary transition-colors leading-[1.15]">
              <Link href={`/reports/${leadReport.slug}`}>{leadReport.title}</Link>
            </h3>

            {/* Lead Narrative Summary */}
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {leadReport.seoDescription}
            </p>

            {/* Primary Citizen Takeaway Pull Quote Box */}
            {leadReport.citizenTakeaway.length > 0 && (
              <div className="border-l-2 border-primary bg-primary/5 p-4 rounded-r-xl">
                <p className="text-sm font-medium text-foreground italic leading-relaxed">
                  &ldquo;{leadReport.citizenTakeaway[0]}&rdquo;
                </p>
              </div>
            )}

            {/* Lead KPIs Strip in Hairline Grid */}
            {leadReport.kpis && leadReport.kpis.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {leadReport.kpis.map((kpi, idx) => (
                  <div key={idx} className="rounded-lg border border-foreground/10 bg-muted/20 p-3 space-y-0.5">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase truncate">
                      {kpi.label}
                    </p>
                    <p className="font-heading text-base font-bold text-foreground tabular-nums">
                      {kpi.value}
                    </p>
                    <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">{kpi.change}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Byline & Read Action */}
          <div className="mt-8 pt-5 border-t border-foreground/10 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5 text-xs text-muted-foreground font-mono">
              <p className="text-foreground font-semibold flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-500" /> {leadReport.provenance.analystSignoff}
              </p>
              <p className="text-[11px]">{leadReport.publishedDate} · {leadReport.provenance.level}</p>
            </div>

            <PillButtonGroup
              href={`/reports/${leadReport.slug}`}
              label="Read Full Dossier"
              variant="primary"
              size="sm"
            />
          </div>
        </article>

        {/* TWO STACKED SECONDARY INVESTIGATIONS (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          {secondaryReports.map((report, idx) => (
            <article
              key={report.slug}
              className="flex-1 flex flex-col justify-between rounded-2xl border border-foreground/10 bg-card/60 hover:bg-card p-6 shadow-sm transition-all duration-200 hover:border-primary/40 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-foreground/10">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-muted-foreground">
                      DOSSIER #0{idx + 2}
                    </span>
                    <EditorialPill variant="muted" size="xs">
                      {report.eyebrow}
                    </EditorialPill>
                    {report.county !== "National" && (
                      <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <MapPin className="size-3" /> {report.county}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {report.readTimeMinutes} min
                  </span>
                </div>

                <h4 className="font-heading text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  <Link href={`/reports/${report.slug}`}>{report.title}</Link>
                </h4>

                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {report.citizenTakeaway[0] || report.seoDescription}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-foreground/10 flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground">{report.publishedDate}</span>
                <Link
                  href={`/reports/${report.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <span>Read Report</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
