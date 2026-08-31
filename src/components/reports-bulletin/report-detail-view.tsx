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
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ReportDossier } from "@/data/reports-bulletin";

export function ReportDetailView({
  report,
  relatedReports,
}: {
  report: ReportDossier;
  relatedReports: ReportDossier[];
}) {
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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
            className="font-heading text-xl font-bold tracking-tight text-foreground mt-8 mb-3"
          >
            {trimmed.replace(/^###\s+/, "")}
          </h3>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h2
            key={idx}
            className="font-heading text-2xl font-bold tracking-tight text-foreground mt-10 mb-4 pb-2 border-b border-border/50"
          >
            {trimmed.replace(/^##\s+/, "")}
          </h2>
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
          <ol key={idx} className="my-4 space-y-2 pl-5 list-decimal text-muted-foreground text-sm md:text-base leading-relaxed">
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
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Navigation & Meta Strip */}
      <div className="flex items-center justify-between gap-4 border-b border-border/40 pb-4">
        <Button asChild variant="ghost" size="sm" className="gap-2 text-xs font-semibold">
          <Link href="/reports">
            <ArrowLeft className="size-4" />
            <span>Back to Reports Bulletin</span>
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="h-8 gap-1.5 text-xs font-medium"
          >
            <Share2 className="size-3.5" />
            <span>{copied ? "Link Copied!" : "Share"}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="h-8 gap-1.5 text-xs font-medium hidden sm:flex"
          >
            <Download className="size-3.5" />
            <span>Export Brief</span>
          </Button>
        </div>
      </div>

      {/* Hero Header */}
      <header className="mt-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default" className="text-xs font-bold uppercase tracking-wider">
            {report.eyebrow}
          </Badge>
          <Badge variant="outline" className="text-xs font-semibold border-primary/30 text-primary">
            {report.programme}
          </Badge>
          {report.county !== "National" && report.county !== "All 47 Counties" && (
            <Badge variant="secondary" className="gap-1 text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              <MapPin className="size-3" />
              <span>{report.county}</span>
            </Badge>
          )}
        </div>

        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
          {report.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
          <span className="font-medium text-foreground">{report.author}</span>
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
            <ShieldCheck className="size-3.5" /> Audited Provenance
          </span>
        </div>
      </header>

      {/* Official Provenance Box */}
      <section className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
                Official Provenance & Verification Stamp
              </h2>
            </div>
            <p className="text-xs font-medium text-foreground">
              <strong>Source:</strong> {report.provenance.source}
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>Verification Standard:</strong> {report.provenance.level} · <strong>Sign-off:</strong> {report.provenance.analystSignoff}
            </p>
          </div>
          {report.provenance.sourceDocumentUrl && (
            <Button asChild variant="outline" size="sm" className="h-8 gap-1 text-xs shrink-0 bg-background">
              <a href={report.provenance.sourceDocumentUrl} target="_blank" rel="noopener noreferrer">
                <span>View Source</span>
                <ExternalLink className="size-3" />
              </a>
            </Button>
          )}
        </div>
      </section>

      {/* KPI Stats Grid */}
      {report.kpis && report.kpis.length > 0 && (
        <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {report.kpis.map((kpi, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border/70 bg-card p-4 shadow-xs"
            >
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                {kpi.label}
              </p>
              <p className="mt-1 font-heading text-xl md:text-2xl font-extrabold text-foreground">
                {kpi.value}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                {kpi.trend === "up" && <TrendingUp className="size-3 text-emerald-500" />}
                {kpi.trend === "down" && <TrendingDown className="size-3 text-amber-500" />}
                {kpi.trend === "flat" && <Minus className="size-3 text-muted-foreground" />}
                <span>{kpi.change}</span>
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Citizen Key Takeaways Box */}
      {report.citizenTakeaway && report.citizenTakeaway.length > 0 && (
        <section className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 dark:bg-emerald-950/20">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm uppercase tracking-wider">
            <Sparkles className="size-4" />
            <h2>What This Means for You (Citizen Summary)</h2>
          </div>
          <ul className="mt-3 space-y-2 text-xs md:text-sm text-foreground/90 leading-relaxed">
            {report.citizenTakeaway.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Main Narrative Article Content */}
      <section className="mt-10 pt-6 border-t border-border/50 prose dark:prose-invert max-w-none">
        {renderContentParagraphs(report.content)}
      </section>

      {/* Schema.org FAQ Section */}
      {report.faqs && report.faqs.length > 0 && (
        <section className="mt-12 rounded-3xl border border-border/80 bg-muted/20 p-6 md:p-8">
          <div className="space-y-1">
            <Badge variant="outline" className="text-xs font-bold uppercase tracking-wider border-primary/30 text-primary">
              Frequently Asked Questions
            </Badge>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Questions Answered in this Report
            </h2>
          </div>

          <div className="mt-6 space-y-3">
            {report.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-border/70 bg-card p-4 transition-colors"
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
                    <div className="mt-3 pt-3 border-t border-border/40 text-xs md:text-sm text-muted-foreground leading-relaxed animate-in fade-in-50 duration-150">
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
        <footer className="mt-14 pt-8 border-t border-border/50 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                Related Verified Reports & Scorecards
              </h2>
              <p className="text-xs text-muted-foreground">
                Continue following public money across national and county chapters.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="text-xs font-semibold">
              <Link href="/reports">View All Bulletins</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {relatedReports.slice(0, 2).map((rel) => (
              <Link
                key={rel.slug}
                href={`/reports/${rel.slug}`}
                className="group rounded-2xl border border-border/60 bg-card p-4 transition-all hover:border-primary/50 hover:shadow-xs"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  <span>{rel.eyebrow}</span>
                  <span>·</span>
                  <span>{rel.county}</span>
                </div>
                <h3 className="mt-1 font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {rel.title}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
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
