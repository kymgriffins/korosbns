"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Scale,
  Building2,
  TrendingUp,
  ShieldCheck,
  FileText,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  X,
  ArrowRight,
} from "lucide-react";
import {
  BUDGET_GLOSSARY,
  GLOSSARY_CATEGORIES,
  GlossaryCategory,
  GlossaryEntry,
} from "@/data/budget-glossary";
import { EditorialPill } from "@/components/ui/editorial/editorial-pill";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import { Input } from "@/components/ui/input";

const categoryIconMap: Record<GlossaryCategory, React.ComponentType<{ className?: string }>> = {
  national: FileText,
  county: Building2,
  "debt-fiscal": TrendingUp,
  oversight: ShieldCheck,
  legal: Scale,
};

const categoryBadgeVariant: Record<GlossaryCategory, "default" | "primary" | "muted" | "outline"> = {
  national: "primary",
  county: "default",
  "debt-fiscal": "muted",
  oversight: "outline",
  legal: "default",
};

export default function BudgetGlossaryClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory | "all">("all");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [expandedSlugs, setExpandedSlugs] = useState<Set<string>>(new Set());

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: BUDGET_GLOSSARY.length };
    for (const entry of BUDGET_GLOSSARY) {
      counts[entry.category] = (counts[entry.category] || 0) + 1;
    }
    return counts;
  }, []);

  // Available letters in the glossary
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    for (const item of BUDGET_GLOSSARY) {
      const first = item.term.charAt(0).toUpperCase();
      if (/[A-Z]/.test(first)) {
        letters.add(first);
      }
    }
    return Array.from(letters).sort();
  }, []);

  // Filtered glossary entries
  const filteredEntries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return BUDGET_GLOSSARY.filter((item) => {
      // Category filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      // Letter filter
      if (selectedLetter && !item.term.toUpperCase().startsWith(selectedLetter)) {
        return false;
      }
      // Text search
      if (q) {
        const inTerm = item.term.toLowerCase().includes(q);
        const inShort = item.shortDefinition.toLowerCase().includes(q);
        const inFull = item.fullExplanation.toLowerCase().includes(q);
        const inLegal = item.legalBasis?.toLowerCase().includes(q) ?? false;
        const inSwahili = item.swahiliContext?.toLowerCase().includes(q) ?? false;
        return inTerm || inShort || inFull || inLegal || inSwahili;
      }
      return true;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [searchQuery, selectedCategory, selectedLetter]);

  const toggleExpand = (slug: string) => {
    setExpandedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedLetter(null);
  };

  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "all" || selectedLetter !== null;

  return (
    <div className="w-full">
      {/* Editorial Hero */}
      <section className="relative overflow-hidden border-b border-border/40 bg-linear-to-b from-muted/40 via-background to-background pt-20 pb-12 sm:pt-24 sm:pb-16 lg:pt-28 lg:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <EditorialPill variant="primary" size="xs" dot>
                CIVIC FISCAL VOCABULARY
              </EditorialPill>
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                Article 201 · CoK 2010
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.05]">
              Kenya Budget <span className="text-primary italic">Glossary</span>.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Jargon-free, legally grounded explanations for the public finance, devolution, and
              budgetary terms that shape Kenya&apos;s economy and county allocations.
            </p>
          </div>

          {/* Search Box */}
          <div className="mt-8 max-w-2xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4 size-5 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (selectedLetter) setSelectedLetter(null);
                }}
                placeholder="Search terms, e.g. BPS, Equitable Share, Fiscal Deficit, Article 201..."
                className="h-12 w-full rounded-2xl border-border/80 bg-card/80 pl-11 pr-10 text-sm shadow-xs focus-visible:ring-2 focus-visible:ring-primary/40 backdrop-blur-xs placeholder:text-muted-foreground/70"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 p-1 rounded-full text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 flex flex-wrap items-center gap-6 pt-6 border-t border-border/30 text-xs text-muted-foreground font-mono">
            <div className="flex items-center gap-2">
              <BookOpen className="size-4 text-primary" />
              <span>
                <strong className="text-foreground font-bold">{BUDGET_GLOSSARY.length}</strong> Verified Terms
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="size-4 text-primary" />
              <span>PFM Act 2012 & Constitution 2010 Grounded</span>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="size-4 text-primary" />
              <span>
                Need contextual help? Visit{" "}
                <Link href="/help" className="text-primary hover:underline font-semibold">
                  Help Center
                </Link>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Category Tabs (Hidden on mobile to avoid horizontal scroll) */}
        <div className="hidden sm:flex items-center gap-2 flex-wrap pb-4">
          {GLOSSARY_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  if (selectedLetter) setSelectedLetter(null);
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all outline-hidden cursor-pointer",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs font-bold"
                    : "border border-border/60 bg-card hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                )}
              >
                <span>{cat.label}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full",
                    isSelected ? "bg-black/20 text-white font-bold" : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Alphabet Navigation Strip (Hidden on mobile to avoid horizontal scroll) */}
        <div className="hidden sm:flex mt-4 items-center gap-1.5 flex-wrap pb-2 border-b border-border/30 text-xs font-mono">
          <button
            type="button"
            onClick={() => setSelectedLetter(null)}
            className={cn(
              "px-2.5 py-1 rounded-md transition-colors cursor-pointer",
              selectedLetter === null
                ? "bg-foreground text-background font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((char) => {
            const isAvailable = availableLetters.includes(char);
            const isSelected = selectedLetter === char;
            return (
              <button
                key={char}
                type="button"
                disabled={!isAvailable}
                onClick={() => setSelectedLetter(isSelected ? null : char)}
                className={cn(
                  "size-7 rounded-md flex items-center justify-center transition-colors cursor-pointer",
                  isSelected
                    ? "bg-primary text-primary-foreground font-bold shadow-xs"
                    : isAvailable
                    ? "text-foreground hover:bg-muted font-medium"
                    : "text-muted-foreground/30 cursor-not-allowed"
                )}
              >
                {char}
              </button>
            );
          })}
        </div>

        {/* Results Counter & Clear Action */}
        <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
          <p>
            Showing <strong className="text-foreground">{filteredEntries.length}</strong> of{" "}
            {BUDGET_GLOSSARY.length} terms
            {selectedCategory !== "all" && (
              <span>
                {" "}in category &quot;
                {GLOSSARY_CATEGORIES.find((c) => c.id === selectedCategory)?.label}
                &quot;
              </span>
            )}
            {selectedLetter && <span> starting with &quot;{selectedLetter}&quot;</span>}
            {searchQuery && <span> matching &quot;{searchQuery}&quot;</span>}
          </p>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 text-xs text-primary hover:text-primary/80 gap-1"
            >
              <X className="size-3.5" />
              Reset filters
            </Button>
          )}
        </div>

        {/* Term Cards Grid */}
        {filteredEntries.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {filteredEntries.map((item) => {
              const Icon = categoryIconMap[item.category] || FileText;
              const isExpanded = expandedSlugs.has(item.slug);

              return (
                <article
                  key={item.slug}
                  id={item.slug}
                  className={cn(
                    "group relative flex flex-col rounded-2xl border border-border/70 bg-card/60 p-5 sm:p-6 transition-all duration-200 hover:border-primary/40 hover:bg-card hover:shadow-sm",
                    isExpanded && "border-primary/50 bg-card shadow-xs"
                  )}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <EditorialPill
                          variant={categoryBadgeVariant[item.category]}
                          size="xs"
                        >
                          {GLOSSARY_CATEGORIES.find((c) => c.id === item.category)?.label}
                        </EditorialPill>
                        {item.swahiliContext && (
                          <span className="text-[10px] font-mono text-muted-foreground italic">
                            ({item.swahiliContext})
                          </span>
                        )}
                      </div>
                      <h2 className="font-heading text-lg sm:text-xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {item.term}
                      </h2>
                    </div>

                    <div className="size-8 shrink-0 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                      <Icon className="size-4" />
                    </div>
                  </div>

                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {item.shortDefinition}
                  </p>

                  {/* Expandable In-Depth Explanation */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-border/40 space-y-3 text-xs leading-relaxed text-muted-foreground">
                      <p className="text-foreground/90 font-sans sm:text-sm">
                        {item.fullExplanation}
                      </p>
                      {item.legalBasis && (
                        <div className="flex items-center gap-1.5 rounded-lg bg-muted/40 p-2.5 text-xs text-muted-foreground font-mono">
                          <Scale className="size-3.5 text-primary shrink-0" />
                          <span>
                            <strong>Legal Authority:</strong> {item.legalBasis}
                          </span>
                        </div>
                      )}
                      {item.relatedSlugs && item.relatedSlugs.length > 0 && (
                        <div className="pt-1 flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                            Related terms:
                          </span>
                          {item.relatedSlugs.map((rSlug) => {
                            const related = BUDGET_GLOSSARY.find((b) => b.slug === rSlug);
                            if (!related) return null;
                            return (
                              <button
                                key={rSlug}
                                type="button"
                                onClick={() => {
                                  setSearchQuery(related.term);
                                  setSelectedCategory("all");
                                  setSelectedLetter(null);
                                }}
                                className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                              >
                                {related.term}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.slug)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                    >
                      <span>{isExpanded ? "Collapse note" : "Read full context"}</span>
                      <ChevronDown
                        className={cn("size-3.5 transition-transform duration-200", isExpanded && "rotate-180")}
                      />
                    </button>

                    {item.legalBasis && !isExpanded && (
                      <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[180px]">
                        {item.legalBasis}
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-12 rounded-3xl border border-dashed border-border/80 bg-card/40 p-12 text-center max-w-lg mx-auto">
            <HelpCircle className="size-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-heading text-lg font-bold text-foreground">No matching terms found</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Try searching with another keyword or reset active filters to view all budget definitions.
            </p>
            <Button
              size="sm"
              onClick={clearFilters}
              className="mt-5 rounded-full text-xs font-semibold px-5"
            >
              Show all terms
            </Button>
          </div>
        )}

        {/* Civic Educational Link Band */}
        <div className="mt-16 rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card to-muted/20 p-8 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-2">
              <EditorialPill variant="muted" size="xs">
                CONTINUOUS CIVIC MASTERY
              </EditorialPill>
              <h3 className="font-heading text-xl sm:text-2xl font-black text-foreground">
                Want to see these budget concepts in action?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Explore our interactive Learn Hub for animated breakdowns of Kenya&apos;s budget cycle, or read verified
                reports detailing actual county spending versus development allocations.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <Link
                href="/learn"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
              >
                <span>Start Learning on Learn Hub</span>
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/help"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-xs font-bold text-foreground hover:bg-muted transition-colors"
              >
                <span>Visit Help & FAQ Desk</span>
                <ExternalLink className="size-3.5 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
