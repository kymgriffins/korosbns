"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ShieldCheck,
  Share2,
  Download,
  CheckCircle2,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorialPill } from "@/components/ui/editorial";
import type { ReportDossier } from "@/data/reports-bulletin";
import { ArticleShell, type LayoutArchetype } from "@/layouts/page-shells";

export interface ReportDetailViewProps {
  report: ReportDossier;
  relatedReports: ReportDossier[];
  archetype?: LayoutArchetype | string | null;
}

export function ReportDetailView({
  report,
  relatedReports,
  archetype = "sovereign",
}: ReportDetailViewProps) {
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (archetype && archetype !== "sovereign") {
    return (
      <ArticleShell
        article={{
          title: report.title,
          subtitle: report.seoDescription,
          eyebrow: report.eyebrow,
          content: report.content,
          authorName: report.author,
          publishedAt: report.publishedDate,
          readTime: `${report.readTimeMinutes} min read`,
          tags: [report.category, report.county, report.programme].filter(Boolean),
          funder: report.provenance.source,
          hostInstitution: report.provenance.analystSignoff,
          metrics: report.kpis?.map((k) => ({ label: k.label, value: `${k.value} (${k.change})` })),
        }}
        archetype={archetype}
        backHref="/reports"
        backLabel="Back to Reports"
      >
        {report.citizenTakeaway && report.citizenTakeaway.length > 0 && (
          <section className="my-8 rounded-xl border border-primary/30 bg-primary/5 p-6 space-y-3">
            <div className="flex items-center gap-2 text-primary font-mono font-bold text-xs uppercase tracking-wider">
              <FileText className="size-4 text-primary" />
              <h3>Citizen Summary &amp; Core Takeaways</h3>
            </div>
            <ul className="space-y-2 text-sm text-foreground/90 leading-relaxed">
              {report.citizenTakeaway.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {report.faqs && report.faqs.length > 0 && (
          <section className="my-8 rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="text-lg font-bold">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {report.faqs.map((faq, idx) => (
                <div key={idx} className="rounded-lg border border-border/60 p-4 space-y-2">
                  <h4 className="font-semibold text-sm">{faq.question}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </ArticleShell>
    );
  }

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const renderContentParagraphs = (content: string) => {
    const sections = content.split(/\n\n+/);
    return sections.map((sec, idx) => {
      const trimmed = sec.trim();
      if (trimmed.startsWith("### ")) {
        return (
          <h3
            key={idx}
            className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground mt-8 mb-3"
          >
            {trimmed.replace(/^###\s+/, "")}
          </h3>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <div key={idx} className="mt-10 mb-4 pb-2 border-b border-foreground/10">
            <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {trimmed.replace(/^##\s+/, "")}
            </h2>
          </div>
        );
      }
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const items = trimmed.split(/\n[-*]\s+/).filter(Boolean);
        return (
          <ul key={idx} className="my-4 space-y-2 pl-4 list-disc text-muted-foreground text-sm md:text-base leading-relaxed">
            {items.map((it, i) => (
              <li key={i}>{it.replace(/^[-*]\s+/, "")}</li>
            ))}
          </ul>
        );
      }
      if (trimmed.startsWith("1. ") || trimmed.startsWith("2. ")) {
        const items = trimmed.split(/\n\d+\.\s+/).filter(Boolean);
        return (
          <ol key={idx} className="my-4 space-y-2 pl-5 list-decimal text-muted-foreground text-sm md:text-base leading-relaxed font-mono text-xs sm:text-sm">
            {items.map((it, i) => (
              <li key={i}>{it.replace(/^\d+\.\s+/, "")}</li>
            ))}
          </ol>
        );
      }
      return (
        <p key={idx} className="my-4 text-sm md:text-base leading-relaxed text-muted-foreground">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Back Navigation & Specimen Meta Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-foreground/10 pb-4">
        <Button asChild variant="ghost" size="sm" className="gap-2 text-xs font-mono font-semibold hover:text-orange-600">
          <Link href="/reports">
            <ArrowLeft className="size-4" />
            <span>← Back to Report Bulletins</span>
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="h-8 gap-1.5 text-xs font-mono font-medium border-foreground/10 bg-card/60"
          >
            <Share2 className="size-3.5" />
            <span>{copied ? "Link Copied!" : "Share Dossier"}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="h-8 gap-1.5 text-xs font-mono font-medium border-foreground/10 bg-card/60 hidden sm:flex"
          >
            <Download className="size-3.5" />
            <span>Export Brief</span>
          </Button>
        </div>
      </div>

      {/* Editorial Specimen Masthead */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-foreground/10">
          <div className="flex flex-wrap items-center gap-2">
            <EditorialPill variant="primary" size="xs">
              {report.eyebrow}
            </EditorialPill>
            <EditorialPill variant="outline" size="xs">
              {report.programme}
            </EditorialPill>
            {report.county !== "National" && report.county !== "All 47 Counties" && (
              <EditorialPill variant="success" size="xs">
                <MapPin className="size-3 mr-1 inline" />
                {report.county}
              </EditorialPill>
            )}
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">
            SPECIMEN // FY 2026/27
          </span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
          {report.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground pt-1 border-t border-foreground/10">
          <span className="font-semibold text-foreground">{report.author}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Calendar className="size-3.5" /> Published {report.publishedDate}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" /> {report.readTimeMinutes} min read
          </span>
          <span>·</span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="size-3.5" /> Audited Intelligence
          </span>
        </div>
      </header>

      {/* Official Provenance & Hansard Verification Stamp */}
      <section className="rounded-2xl border border-foreground/10 bg-card/60 p-5 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-500" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                Official Provenance &amp; Verification Stamp
              </h2>
            </div>
            <p className="text-xs font-mono text-muted-foreground">
              <strong className="text-foreground">Source:</strong> {report.provenance.source}
            </p>
            <p className="text-xs font-mono text-muted-foreground">
              <strong className="text-foreground">Standard:</strong> {report.provenance.level} · <strong className="text-foreground">Analyst Signoff:</strong> {report.provenance.analystSignoff}
            </p>
          </div>
          {report.provenance.sourceDocumentUrl && (
            <Button asChild variant="outline" size="sm" className="h-8 gap-1 text-xs font-mono shrink-0 bg-background border-foreground/10">
              <a href={report.provenance.sourceDocumentUrl} target="_blank" rel="noopener noreferrer">
                <span>View Gazetted Document</span>
                <ExternalLink className="size-3" />
              </a>
            </Button>
          )}
        </div>
      </section>

      {/* Hairline KPI Specimen Grid */}
      {report.kpis && report.kpis.length > 0 && (
        <section className="grid grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-foreground/10 border border-foreground/10 rounded-2xl bg-card/60 sm:grid-cols-4 overflow-hidden">
          {report.kpis.map((kpi, idx) => (
            <div
              key={idx}
              className="p-4 space-y-1"
            >
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground truncate">
                {kpi.label}
              </p>
              <p className="font-heading text-xl md:text-2xl font-black text-foreground tabular-nums">
                {kpi.value}
              </p>
              <p className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                {kpi.trend === "up" && <TrendingUp className="size-3 text-emerald-500" />}
                {kpi.trend === "down" && <TrendingDown className="size-3 text-amber-500" />}
                {kpi.trend === "flat" && <Minus className="size-3 text-muted-foreground" />}
                <span>{kpi.change}</span>
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Citizen Key Takeaways Pullquote Box */}
      {report.citizenTakeaway && report.citizenTakeaway.length > 0 && (
        <section className="rounded-2xl border border-primary/30 bg-primary/5 p-6 dark:bg-primary/10 space-y-3">
          <div className="flex items-center gap-2 text-primary font-mono font-bold text-xs uppercase tracking-wider">
            <FileText className="size-4 text-primary" />
            <h2>What This Means For You (Citizen Summary)</h2>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-foreground/90 leading-relaxed">
            {report.citizenTakeaway.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Main Narrative Content */}
      <section className="pt-4 border-t border-foreground/10 prose dark:prose-invert max-w-none">
        {renderContentParagraphs(report.content)}
      </section>

      {/* Schema.org FAQ Section in Hairline Cards */}
      {report.faqs && report.faqs.length > 0 && (
        <section className="rounded-2xl border border-foreground/10 bg-card/60 p-6 md:p-8 space-y-4">
          <div className="space-y-1 pb-3 border-b border-foreground/10">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-muted text-foreground">
              Frequently Asked Questions
            </span>
            <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Questions Answered in this Dossier
            </h2>
          </div>

          <div className="space-y-2.5">
            {report.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-foreground/10 bg-card p-4 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="flex w-full cursor-pointer items-start justify-between gap-3 text-left"
                  >
                    <h3 className="font-heading text-sm md:text-base font-bold text-foreground">
                      {faq.question}
                    </h3>
                    <span className="shrink-0 text-muted-foreground mt-0.5">
                      {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-3 pt-3 border-t border-foreground/10 text-xs md:text-sm text-muted-foreground leading-relaxed animate-in fade-in-50 duration-150">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Related Reports Navigation */}
      {relatedReports && relatedReports.length > 0 && (
        <footer className="pt-8 border-t border-foreground/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                Related Verified Reports &amp; Scorecards
              </h2>
              <p className="text-xs font-mono text-muted-foreground">
                Continue following public money across national and county chapters.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="text-xs font-mono font-semibold border-foreground/10">
              <Link href="/reports">View All Bulletins</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {relatedReports.slice(0, 2).map((rel) => (
              <Link
                key={rel.slug}
                href={`/reports/${rel.slug}`}
                className="group rounded-2xl border border-foreground/10 bg-card/60 p-5 transition-all hover:border-primary/40 hover:shadow-xs space-y-2"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                  <span>{rel.eyebrow}</span>
                  <span>·</span>
                  <span>{rel.county}</span>
                </div>
                <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {rel.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {rel.citizenTakeaway[0]}
                </p>
              </Link>
            ))}
          </div>
        </footer>
      )}
    </article>
  );
}
