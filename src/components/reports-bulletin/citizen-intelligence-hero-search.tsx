"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, HelpCircle, ArrowRight, X, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { IndexedBudgetQuestion } from "@/data/reports-bulletin";

interface CitizenIntelligenceHeroSearchProps {
  questions: IndexedBudgetQuestion[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedProgramme: string;
  onProgrammeChange: (prog: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const POPULAR_INVESTIGATIVE_QUERIES = [
  "KES 4.82T National Budget",
  "Debt Servicing KES 1.2T",
  "Kakamega Hospital Budget",
  "Kilifi Blue Economy",
  "Nakuru CAIPs & OSR",
  "Wajir Equalisation Fund",
  "Junior Secondary Capitation",
  "CRA 3rd Basis Formula",
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

export function CitizenIntelligenceHeroSearch({
  questions,
  selectedCategory,
  onCategoryChange,
  selectedProgramme,
  onProgrammeChange,
  searchQuery,
  onSearchChange,
}: CitizenIntelligenceHeroSearchProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="chapter-06-ask-public-money" className="space-y-10 py-6">
      {/* Chapter Title */}
      <div className="space-y-2 border-b border-border/40 pb-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
            06 / CITIZEN INTELLIGENCE
          </span>
          <span className="text-muted-foreground/40">|</span>
          <span className="font-mono text-xs text-muted-foreground">
            Instant Research Engine & Verified Answers
          </span>
        </div>
        <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Ask Kenya&apos;s public money anything.
        </h2>
        <p className="text-base text-muted-foreground max-w-3xl leading-relaxed">
          Search across verified National Treasury BPS estimates, Controller of Budget reports,
          CRA allocation schedules, and BNS Mashinani field investigations.
        </p>
      </div>

      {/* Hero Interaction Box */}
      <div className="rounded-3xl border border-primary/20 bg-linear-to-b from-primary/5 via-card to-card/90 p-6 sm:p-10 shadow-lg space-y-6">
        {/* Large Search Input */}
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-6 text-muted-foreground" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Where did Nairobi's development budget go? / How much is debt servicing?"
            className="h-16 pl-14 pr-12 text-base sm:text-lg rounded-2xl border-primary/40 bg-background/90 shadow-inner focus-visible:ring-primary/40"
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 size-9 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>

        {/* Suggested Queries Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-bold text-muted-foreground uppercase">Popular Queries:</span>
          {POPULAR_INVESTIGATIVE_QUERIES.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => onSearchChange(term)}
              className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-mono text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary cursor-pointer"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Category & Programme Filter Controls */}
        <div className="flex flex-col gap-4 pt-4 border-t border-border/50 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Topic Category
            </span>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onCategoryChange(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground font-bold"
                      : "border border-border/60 bg-background/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Programme Stream
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PROGRAMMES.map((prog) => (
                <button
                  key={prog}
                  type="button"
                  onClick={() => onProgrammeChange(prog)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    selectedProgramme === prog
                      ? "bg-secondary text-foreground font-bold"
                      : "border border-border/60 bg-background/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {prog}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resolved Answers Accordion */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>
              Showing <strong>{questions.length}</strong> resolved citizen questions
            </span>
            {(selectedCategory !== "All" || selectedProgramme !== "All" || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  onCategoryChange("All");
                  onProgrammeChange("All");
                  onSearchChange("");
                }}
                className="text-primary hover:underline font-bold cursor-pointer"
              >
                Reset Search Filters
              </button>
            )}
          </div>

          {questions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center space-y-2">
              <HelpCircle className="mx-auto size-8 text-muted-foreground/40" />
              <h4 className="text-base font-bold text-foreground">No matching question found</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Try searching with different terms like &ldquo;debt&rdquo;, &ldquo;Kakamega&rdquo;, or &ldquo;UHC&rdquo;.
              </p>
            </div>
          ) : (
            questions.map((item) => {
              const isExpanded = expandedId === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border/70 bg-card/80 p-5 transition-colors hover:border-primary/40"
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
                    className="flex cursor-pointer items-start justify-between gap-4 text-left"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant="outline" className="font-mono text-[10px] font-bold border-primary/30 text-primary">
                          {item.category}
                        </Badge>
                        <Badge variant="secondary" className="font-mono text-[10px]">
                          {item.programme}
                        </Badge>
                        {item.county !== "National" && item.county !== "All 47 Counties" && (
                          <span className="font-mono text-[10px] text-emerald-500 font-semibold px-2 py-0.5 rounded bg-emerald-500/10">
                            {item.county}
                          </span>
                        )}
                      </div>
                      <h4 className="font-heading text-base sm:text-lg font-bold text-foreground">
                        {item.question}
                      </h4>
                    </div>

                    <Button variant="ghost" size="icon-sm" className="shrink-0 text-muted-foreground mt-1">
                      {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </Button>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-border/40 text-sm leading-relaxed text-muted-foreground animate-in fade-in-50 duration-200 space-y-3">
                      <p>{item.answer}</p>
                      {item.relatedSlug && (
                        <div className="flex items-center justify-end pt-2">
                          <Button asChild variant="link" size="sm" className="gap-1.5 text-xs font-mono font-bold text-primary p-0 h-auto">
                            <Link href={`/reports/${item.relatedSlug}`}>
                              <span>Read Related Audited Dossier</span>
                              <ArrowRight className="size-3.5" />
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
    </section>
  );
}
