"use client";

import React, { type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Bookmark,
  ShieldCheck,
  FileText,
  Building2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import { EditorialPill } from "@/components/ui/editorial";
import { type LayoutArchetype, resolveLayoutArchetype } from "./types";

export interface ArticleData {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  content?: string;
  authorName?: string;
  authorRole?: string;
  publishedAt?: string;
  readTime?: string;
  coverImage?: string;
  tags?: string[];
  funder?: string;
  hostInstitution?: string;
  citations?: Array<{ label: string; url: string }>;
  metrics?: Array<{ label: string; value: string }>;
}

export interface ArticleShellProps {
  article: ArticleData;
  archetype?: LayoutArchetype | string | null;
  backHref?: string;
  backLabel?: string;
  children?: ReactNode;
}

export function ArticleShell({
  article,
  archetype = "sovereign",
  backHref = "/stories",
  backLabel = "Back to Stories",
  children,
}: ArticleShellProps) {
  const config = resolveLayoutArchetype(archetype);

  // 1. EDITORIAL BROADSIDE ARCHETYPE
  if (config.id === "editorial") {
    return (
      <article className="w-full bg-background text-foreground min-h-screen py-10 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Editorial Back Link */}
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3" /> {backLabel}
          </Link>

          {/* Broadside Header */}
          <header className="space-y-4 border-b border-border/80 pb-8">
            {article.eyebrow ? (
              <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
                {article.eyebrow}
              </span>
            ) : null}

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground leading-[1.15]">
              {article.title}
            </h1>

            {article.subtitle ? (
              <p className="text-lg md:text-xl font-serif italic text-muted-foreground leading-relaxed">
                {article.subtitle}
              </p>
            ) : null}

            {/* Byline & Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/40 text-xs text-muted-foreground font-mono">
              <div className="flex items-center gap-4">
                {article.authorName ? (
                  <span className="text-foreground font-semibold">By {article.authorName}</span>
                ) : null}
                {article.publishedAt ? <span>• {article.publishedAt}</span> : null}
                {article.readTime ? <span>• {article.readTime} read</span> : null}
              </div>
              {article.funder ? (
                <span className="text-[11px] italic font-serif">
                  Supported by: {article.funder}
                </span>
              ) : null}
            </div>
          </header>

          {/* 2-Column Asymmetric Editorial Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Reading Column (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {article.coverImage ? (
                <figure className="space-y-2 rounded-xs overflow-hidden border border-border/60">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full aspect-[16/9] object-cover"
                  />
                </figure>
              ) : null}

              <div className="prose prose-neutral dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed font-serif">
                {(article.content || "").split("\n\n").map((para, idx) => (
                  <p key={idx} className={idx === 0 ? "first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2" : ""}>
                    {para}
                  </p>
                ))}
              </div>

              {children}
            </div>

            {/* Sidebar Archival & Citation Column (4 cols) */}
            <aside className="lg:col-span-4 space-y-6 border-l border-border/50 pl-6 hidden lg:block">
              {article.hostInstitution ? (
                <div className="space-y-1.5 text-xs">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                    HOST INSTITUTION
                  </span>
                  <p className="font-semibold text-foreground">{article.hostInstitution}</p>
                </div>
              ) : null}

              {article.metrics && article.metrics.length > 0 ? (
                <div className="space-y-3 pt-4 border-t border-border/40">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                    AUDITED METRICS
                  </span>
                  <div className="space-y-2">
                    {article.metrics.map((m, i) => (
                      <div key={i} className="flex justify-between items-baseline border-b border-border/30 pb-1 text-xs">
                        <span className="text-muted-foreground">{m.label}</span>
                        <span className="font-mono font-bold text-foreground">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {article.citations && article.citations.length > 0 ? (
                <div className="space-y-2 pt-4 border-t border-border/40">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                    REFERENCES & CITATIONS
                  </span>
                  <ul className="space-y-1.5 text-xs">
                    {article.citations.map((c, i) => (
                      <li key={i}>
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          {c.label} <ExternalLink className="size-2.5" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </article>
    );
  }

  // 2. CINEMATIC THEATRE ARCHETYPE
  if (config.id === "cinematic") {
    return (
      <article className="w-full bg-[#04060a] text-slate-100 min-h-screen pb-24">
        {/* Full-bleed Widescreen Media Hero */}
        <div className="relative w-full h-[55vh] md:h-[65vh] flex items-end p-6 md:p-16 overflow-hidden border-b border-sky-500/20">
          {article.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.coverImage}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-t from-[#04060a] via-slate-900/60 to-transparent" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#04060a] via-black/40 to-transparent z-10" />

          <div className="relative z-20 max-w-4xl space-y-4">
            <Link
              href={backHref}
              className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
            >
              <ArrowLeft className="size-3" /> {backLabel}
            </Link>

            {article.eyebrow ? (
              <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                {article.eyebrow}
              </div>
            ) : null}

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {article.title}
            </h1>

            {article.subtitle ? (
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                {article.subtitle}
              </p>
            ) : null}
          </div>
        </div>

        {/* Centered Ambient Reading Stream */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 space-y-8">
          <div className="prose prose-invert max-w-none text-slate-200 text-lg leading-relaxed">
            {(article.content || "").split("\n\n").map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {children}
        </div>
      </article>
    );
  }

  // 3. BRUTALIST WATCHDOG ARCHETYPE
  if (config.id === "brutalist") {
    return (
      <article className="w-full bg-[#fffdf5] dark:bg-black text-black dark:text-white min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider hover:underline"
          >
            ← {backLabel}
          </Link>

          {/* Stark Brutalist Header Box */}
          <div className="border-4 border-current p-6 sm:p-10 space-y-4 bg-card shadow-[6px_6px_0px_0px_currentColor]">
            <div className="flex items-center justify-between font-mono text-xs font-bold border-b-2 border-current pb-2">
              <span>REPORT CODE // {article.eyebrow || "BNS-AUDIT"}</span>
              <span>{article.publishedAt || "FY2026"}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-mono font-black uppercase tracking-tight">
              {article.title}
            </h1>

            {article.subtitle ? (
              <p className="font-mono text-sm sm:text-base font-semibold">
                {article.subtitle}
              </p>
            ) : null}
          </div>

          {/* Brutalist Content Spread */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 border-2 border-current p-6 bg-card space-y-6">
              <div className="prose dark:prose-invert max-w-none font-mono text-sm leading-relaxed space-y-4">
                {(article.content || "").split("\n\n").map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
              {children}
            </div>

            <div className="lg:col-span-4 border-2 border-current p-4 bg-muted/20 space-y-4 font-mono text-xs">
              <div className="border-b-2 border-current pb-1 font-bold uppercase">
                AUDIT METADATA
              </div>
              <div>AUTHOR: {article.authorName || "ANONYMOUS AUDITOR"}</div>
              <div>STATUS: VERIFIED OPEN DATA</div>
              {article.metrics?.map((m, idx) => (
                <div key={idx} className="border-t border-current/40 pt-1 flex justify-between">
                  <span>{m.label}:</span>
                  <span className="font-bold">{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
    );
  }

  // 3b. ARK SHELTER ARCHETYPE — airy minimalist reading
  if (config.id === "ark") {
    return (
      <article className="w-full min-h-screen bg-background text-foreground py-16 md:py-24">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-12 space-y-14">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.06em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3" /> {backLabel}
          </Link>

          <header className="max-w-3xl space-y-6 border-b border-border pb-12">
            <h1 className="text-4xl font-bold leading-[1.08] tracking-[-0.03em] md:text-5xl lg:text-6xl">
              {article.title}
            </h1>
            {article.subtitle ? (
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {article.subtitle}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs tracking-[0.04em] text-muted-foreground">
              {article.authorName ? <span>{article.authorName}</span> : null}
              {article.publishedAt ? <span>{article.publishedAt}</span> : null}
              {article.readTime ? <span>{article.readTime} read</span> : null}
            </div>
          </header>

          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
            <div className="space-y-10 lg:col-span-8">
              {article.coverImage ? (
                <figure className="relative aspect-[16/10] overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="h-full w-full object-cover"
                  />
                </figure>
              ) : null}
              <div className="prose prose-neutral dark:prose-invert max-w-none text-base leading-[1.8] md:text-[1.05rem]">
                {(article.content || "").split("\n\n").map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
              {children}
            </div>

            <aside className="hidden space-y-8 border-l border-border pl-8 lg:col-span-4 lg:block">
              {article.hostInstitution ? (
                <div className="space-y-2">
                  <p className="text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
                    Institution
                  </p>
                  <p className="text-sm font-medium leading-snug">{article.hostInstitution}</p>
                </div>
              ) : null}
              {article.metrics && article.metrics.length > 0 ? (
                <div className="space-y-4 border-t border-border pt-8">
                  <p className="text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
                    Figures
                  </p>
                  {article.metrics.map((m, i) => (
                    <div key={i} className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-2 text-sm">
                      <span className="text-muted-foreground">{m.label}</span>
                      <span className="font-semibold tabular-nums">{m.value}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </article>
    );
  }

  // 4. SOVEREIGN CIVIC ARCHETYPE (Default)
  return (
    <article className="w-full bg-background text-foreground min-h-screen py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="size-3.5" /> {backLabel}
        </Link>

        {/* Sovereign Header Card */}
        <header className="space-y-4">
          {article.eyebrow ? (
            <EditorialPill variant="default">{article.eyebrow}</EditorialPill>
          ) : null}

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            {article.title}
          </h1>

          {article.subtitle ? (
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {article.subtitle}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border/60">
            {article.authorName ? (
              <span className="font-semibold text-foreground">
                By {article.authorName} {article.authorRole ? `(${article.authorRole})` : ""}
              </span>
            ) : null}
            {article.publishedAt ? <span>• {article.publishedAt}</span> : null}
            {article.readTime ? <span>• {article.readTime} read</span> : null}
          </div>
        </header>

        {/* Cover Media */}
        {article.coverImage ? (
          <div className="rounded-2xl overflow-hidden border border-border/80 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full aspect-[16/9] object-cover"
            />
          </div>
        ) : null}

        {/* Sovereign Body */}
        <div className="prose prose-neutral dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed space-y-6">
          {(article.content || "").split("\n\n").map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {children}
      </div>
    </article>
  );
}
