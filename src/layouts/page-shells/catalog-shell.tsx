"use client";

import React, { type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Play, ExternalLink, Calendar, Tag } from "lucide-react";
import { cn } from "@/utils";
import { EditorialPill } from "@/components/ui/editorial";
import { type LayoutArchetype, resolveLayoutArchetype } from "./types";

export interface CatalogItem {
  id: string;
  title: string;
  description?: string;
  category?: string;
  tag?: string;
  date?: string;
  href: string;
  metrics?: Array<{ label: string; value: string }>;
}

export interface CatalogShellProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  items: CatalogItem[];
  archetype?: LayoutArchetype | string | null;
  children?: ReactNode;
}

export function CatalogShell({
  title,
  subtitle,
  eyebrow = "PROJECTS & EVIDENCE",
  items,
  archetype = "sovereign",
  children,
}: CatalogShellProps) {
  const config = resolveLayoutArchetype(archetype);

  // 1. EDITORIAL CHRONOLOGICAL DOSSIER
  if (config.id === "editorial") {
    return (
      <div className="w-full bg-background text-foreground min-h-screen py-10 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <header className="space-y-3 border-b border-border/80 pb-6">
            <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
              {eyebrow}
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground">
              {title}
            </h1>
            {subtitle ? <p className="text-base text-muted-foreground font-serif italic">{subtitle}</p> : null}
          </header>

          {children}

          <div className="divide-y divide-border/60 border-y border-border/60">
            {items.map((item) => (
              <div key={item.id} className="py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <span>{item.date || "2026"}</span>
                    {item.category ? <span>• {item.category}</span> : null}
                  </div>
                  <Link href={item.href} className="text-lg font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </Link>
                  {item.description ? (
                    <p className="text-xs text-muted-foreground max-w-2xl">{item.description}</p>
                  ) : null}
                </div>
                <Link href={item.href} className="shrink-0 text-xs font-semibold text-primary inline-flex items-center gap-1 group-hover:underline">
                  View Dossier <ArrowRight className="size-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. BRUTALIST WIREFRAME LEDGER
  if (config.id === "brutalist") {
    return (
      <div className="w-full bg-[#fffdf5] dark:bg-black text-black dark:text-white min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="border-4 border-current p-6 bg-card shadow-[6px_6px_0px_0px_currentColor] space-y-2">
            <span className="font-mono text-xs font-bold uppercase">{eyebrow}</span>
            <h1 className="text-3xl sm:text-5xl font-mono font-black uppercase">{title}</h1>
            {subtitle ? <p className="font-mono text-sm">{subtitle}</p> : null}
          </div>

          {children}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item, idx) => (
              <div key={item.id} className="border-2 border-current p-5 bg-card space-y-3 shadow-[4px_4px_0px_0px_currentColor]">
                <div className="flex justify-between font-mono text-xs font-bold border-b-2 border-current pb-1">
                  <span>INDEX // {item.tag || `[0${idx + 1}]`}</span>
                  <span>{item.date || "FY2026"}</span>
                </div>
                <h3 className="font-mono text-base font-bold uppercase">{item.title}</h3>
                {item.description ? <p className="font-mono text-xs text-muted-foreground">{item.description}</p> : null}
                <Link href={item.href} className="inline-block font-mono text-xs font-bold text-primary hover:underline pt-2">
                  [ACCESS FILE →]
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. CINEMATIC & SOVEREIGN CIVIC ARCHETYPES
  return (
    <div className="w-full bg-background text-foreground min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <header className="max-w-3xl space-y-4">
          <EditorialPill variant="default">{eyebrow}</EditorialPill>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle ? <p className="text-lg text-muted-foreground leading-relaxed">{subtitle}</p> : null}
        </header>

        {children}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border/80 bg-card p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md hover:border-primary/50 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                    {item.category || item.tag || "OUTPUT"}
                  </span>
                  {item.date ? <span className="text-[11px] text-muted-foreground">{item.date}</span> : null}
                </div>

                <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                {item.description ? <p className="text-xs text-muted-foreground leading-relaxed sm:text-sm">{item.description}</p> : null}
              </div>

              <Link
                href={item.href}
                className="inline-flex items-center text-xs font-semibold text-primary hover:underline pt-2"
              >
                Explore Project <ArrowRight className="ml-1 size-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
