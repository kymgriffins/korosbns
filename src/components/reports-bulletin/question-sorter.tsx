"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Sparkles, HelpCircle, ArrowRight, X, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { IndexedBudgetQuestion } from "@/data/reports-bulletin";

interface QuestionSorterProps {
  questions: IndexedBudgetQuestion[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedProgramme: string;
  onProgrammeChange: (prog: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const POPULAR_SEARCHES = [
  "KES 4.82T National Budget",
  "Debt Servicing KES 1.2T",
  "Kakamega Budget 2026",
  "Kilifi Blue Economy",
  "Nakuru CAIPs",
  "Wajir Equalisation Fund",
  "CRA 3rd Basis Formula",
  "Education & TSC Salaries",
];

const CATEGORIES = [
  "All",
  "National Budget",
  "County Budgets",
  "Debt & Deficit",
  "Sector Allocations",
  "Devolution & Revenue Sharing",
];

const PROGRAMMES = ["All", "BNS Connect", "BNS Mashinani", "Wanahabari Lab", "BNS Studios"];

export function QuestionSorter({
  questions,
  selectedCategory,
  onCategoryChange,
  selectedProgramme,
  onProgrammeChange,
  searchQuery,
  onSearchChange,
}: QuestionSorterProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="rounded-3xl border border-primary/20 bg-linear-to-b from-primary/5 via-card to-background p-6 md:p-8 shadow-xs">
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
          <Sparkles className="size-4 animate-spin-slow" />
          <span>National Budget Question Sorter & Search Engine</span>
        </div>
        <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Ask Any Question on Kenya's Public Money
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Instant answers sourced directly from audited National Treasury BPS estimates, Controller of Budget reports, CRA allocation schedules, and BNS Mashinani field investigations.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative mt-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by topic, county, programme or query (e.g. 'How is Kakamega spending its budget?')..."
          className="h-13 pl-12 pr-10 text-base rounded-2xl border-primary/30 bg-background/90 shadow-inner focus-visible:ring-primary/40"
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onSearchChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      {/* Quick Suggestion Pills */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold text-muted-foreground">Popular:</span>
        {POPULAR_SEARCHES.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => onSearchChange(term)}
            className="rounded-full bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
          >
            {term}
          </button>
        ))}
      </div>

      {/* Filter Chips Bar */}
      <div className="mt-6 flex flex-col gap-3 pt-4 border-t border-border/50 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Category
          </span>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                type="button"
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(cat)}
                className="h-7 text-xs rounded-lg px-3"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Programme Filter
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PROGRAMMES.map((prog) => (
              <Button
                key={prog}
                type="button"
                variant={selectedProgramme === prog ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onProgrammeChange(prog)}
                className="h-7 text-xs rounded-lg px-3"
              >
                {prog}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Results / Answers Accordion */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing <strong>{questions.length}</strong> resolved citizen questions</span>
          {(selectedCategory !== "All" || selectedProgramme !== "All" || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                onCategoryChange("All");
                onProgrammeChange("All");
                onSearchChange("");
              }}
              className="text-primary hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {questions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <HelpCircle className="mx-auto size-8 text-muted-foreground/50" />
            <h3 className="mt-2 text-sm font-semibold text-foreground">No matching questions found</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Try adjusting your search query or removing active filters.
            </p>
          </div>
        ) : (
          questions.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-border/70 bg-card p-4 transition-colors hover:border-primary/40"
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleExpand(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleExpand(item.id);
                    }
                  }}
                  className="flex cursor-pointer items-start justify-between gap-3 text-left"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="outline" className="text-[10px] font-bold px-2 py-0 border-primary/30 text-primary">
                        {item.category}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0">
                        {item.programme}
                      </Badge>
                      {item.county !== "National" && item.county !== "All 47 Counties" && (
                        <Badge variant="secondary" className="text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 px-2 py-0">
                          {item.county}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-heading text-sm md:text-base font-bold text-foreground">
                      {item.question}
                    </h3>
                  </div>
                  <Button variant="ghost" size="icon-sm" className="shrink-0 text-muted-foreground">
                    {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </Button>
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-border/40 text-xs md:text-sm leading-relaxed text-muted-foreground animate-in fade-in-50 duration-200">
                    <p>{item.answer}</p>
                    {item.relatedSlug && (
                      <div className="mt-3 flex items-center justify-end">
                        <Button asChild size="sm" variant="link" className="gap-1 text-xs font-bold text-primary p-0 h-auto">
                          <Link href={`/reports/${item.relatedSlug}`}>
                            <span>Read Full Verified Report Dossier</span>
                            <ArrowRight className="size-3" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
