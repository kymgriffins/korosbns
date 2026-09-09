"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  HelpCircle,
  Compass,
  FileText,
  GraduationCap,
  BarChart3,
  Film,
  Users,
  MessageCircle,
  Mail,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  X,
  Sparkles,
  BookOpen,
} from "lucide-react";
import {
  HELP_TOPICS,
  HELP_FAQS,
  HelpTopicId,
  HelpFaqItem,
} from "@/data/help-faq-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EditorialPill } from "@/components/ui/editorial/editorial-pill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils";

const topicIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Compass,
  FileText,
  GraduationCap,
  BarChart3,
  Film,
  Users,
};

export default function HelpCenterClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<HelpTopicId | "all">("all");

  // Topic item counts
  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = { all: HELP_FAQS.length };
    for (const item of HELP_FAQS) {
      counts[item.topicId] = (counts[item.topicId] || 0) + 1;
    }
    return counts;
  }, []);

  // Filtered FAQ items
  const filteredFaqs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return HELP_FAQS.filter((item) => {
      if (selectedTopic !== "all" && item.topicId !== selectedTopic) {
        return false;
      }
      if (q) {
        const inQuestion = item.question.toLowerCase().includes(q);
        const inAnswer = item.answer.toLowerCase().includes(q);
        const inTags = item.tags.some((t) => t.toLowerCase().includes(q));
        return inQuestion || inAnswer || inTags;
      }
      return true;
    });
  }, [searchQuery, selectedTopic]);

  const quickTags = [
    { label: "BNS Mashinani", query: "mashinani" },
    { label: "Wanahabari Lab", query: "wanahabari" },
    { label: "BPS Calendar", query: "bps" },
    { label: "Equitable Share", query: "equitable share" },
    { label: "Learn Hub", query: "learn hub" },
    { label: "Data Sources", query: "data sources" },
  ];

  return (
    <div className="w-full">
      {/* Help Center Hero */}
      <section className="relative overflow-hidden border-b border-border/40 bg-linear-to-b from-muted/50 via-background to-background pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24">
        {/* Subtle background glow */}
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-3/4 max-w-4xl rounded-full bg-primary/10 blur-3xl pointer-events-none"
          aria-hidden
        />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="flex items-center justify-center gap-2">
            <EditorialPill variant="primary" size="xs" dot>
              HELP & ADVISORY DESK
            </EditorialPill>
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
              help.budgetndiostory.org
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.05]">
            How can we help you <span className="text-primary italic">today</span>?
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Search answers on BNS Programmes, Kenya&apos;s budget cycles, county scorecards, Learn Hub
            modules, and media commissions.
          </p>

          {/* Search Box */}
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4 size-5 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions, programmes, budget terms, or guides..."
                className="h-14 w-full rounded-2xl border-border/80 bg-card pl-12 pr-10 text-base shadow-sm focus-visible:ring-2 focus-visible:ring-primary/40 placeholder:text-muted-foreground/70"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 p-1 rounded-full text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Quick Search Suggestions */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground/70 flex items-center gap-1">
                <Sparkles className="size-3 text-primary" /> Popular searches:
              </span>
              {quickTags.map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => {
                    setSearchQuery(tag.query);
                    setSelectedTopic("all");
                  }}
                  className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-card transition-colors cursor-pointer"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Topic Navigation Cards (Help Center Vibe) */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-black text-foreground">
                Browse by Topic
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Select a domain to filter frequently asked questions and verified guides.
              </p>
            </div>
            {selectedTopic !== "all" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTopic("all")}
                className="text-xs text-primary gap-1"
              >
                <X className="size-3.5" />
                Reset topic
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {HELP_TOPICS.map((topic) => {
              const Icon = topicIconMap[topic.iconName] || HelpCircle;
              const isSelected = selectedTopic === topic.id;
              const count = topicCounts[topic.id] || 0;

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => {
                    setSelectedTopic(isSelected ? "all" : topic.id);
                  }}
                  className={cn(
                    "group relative flex flex-col text-left rounded-3xl border p-6 transition-all duration-200 cursor-pointer",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/20"
                      : "border-border/70 bg-card/60 hover:border-primary/40 hover:bg-card hover:shadow-xs"
                  )}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div
                      className={cn(
                        "size-11 rounded-2xl flex items-center justify-center transition-colors",
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      )}
                    >
                      <Icon className="size-5" />
                    </div>
                    <span
                      className={cn(
                        "text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full",
                        isSelected
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {count} articles
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {topic.title}
                  </h3>

                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {topic.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
                    <span>{isSelected ? "Active topic" : "View questions"}</span>
                    <ArrowRight
                      className={cn(
                        "size-3.5 transition-transform duration-200",
                        isSelected ? "translate-x-1" : "group-hover:translate-x-1"
                      )}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQs Accordion Area */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                {selectedTopic === "all"
                  ? "All Frequently Asked Questions"
                  : HELP_TOPICS.find((t) => t.id === selectedTopic)?.title}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Showing <strong className="text-foreground">{filteredFaqs.length}</strong> verified answers
                {searchQuery && <span> matching &quot;{searchQuery}&quot;</span>}
              </p>
            </div>

            {/* Topic Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedTopic("all")}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer",
                  selectedTopic === "all"
                    ? "bg-primary text-primary-foreground font-bold shadow-xs"
                    : "border border-border/70 bg-card text-muted-foreground hover:text-foreground"
                )}
              >
                All ({HELP_FAQS.length})
              </button>
              {HELP_TOPICS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTopic(t.id)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer",
                    selectedTopic === t.id
                      ? "bg-primary text-primary-foreground font-bold shadow-xs"
                      : "border border-border/70 bg-card text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.title}
                </button>
              ))}
            </div>
          </div>

          {filteredFaqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-3">
              {filteredFaqs.map((faq) => {
                const topic = HELP_TOPICS.find((t) => t.id === faq.topicId);

                return (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="rounded-2xl border border-border/70 bg-card/60 px-5 sm:px-6 transition-all data-[state=open]:bg-card data-[state=open]:border-primary/40 data-[state=open]:shadow-xs"
                  >
                    <AccordionTrigger className="text-left text-sm sm:text-base font-bold text-foreground hover:no-underline py-5">
                      <div className="flex items-start gap-3.5 pr-4 text-left">
                        <HelpCircle className="size-4 shrink-0 text-primary mt-1" />
                        <span className="leading-snug">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-xs sm:text-sm leading-relaxed text-muted-foreground pl-7 pb-6 pr-2 space-y-4">
                      <p className="text-foreground/90">{faq.answer}</p>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40 text-xs">
                        <div className="flex items-center gap-2">
                          <EditorialPill variant="muted" size="xs">
                            {topic?.title}
                          </EditorialPill>
                          {faq.programmeSlug && (
                            <span className="text-[10px] font-mono text-primary font-bold uppercase">
                              Pillar: {faq.programmeSlug}
                            </span>
                          )}
                        </div>

                        {faq.actionLink && (
                          <Link
                            href={faq.actionLink.href}
                            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                          >
                            <span>{faq.actionLink.label}</span>
                            <ArrowRight className="size-3" />
                          </Link>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            <div className="rounded-3xl border border-dashed border-border/80 bg-card/40 p-12 text-center max-w-lg mx-auto">
              <HelpCircle className="size-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-heading text-lg font-bold text-foreground">No matching answers found</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                We couldn&apos;t find an answer matching &quot;{searchQuery}&quot;. Try another term or contact our desk directly.
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <Button
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTopic("all");
                  }}
                  className="rounded-full text-xs font-semibold px-4"
                >
                  Clear search
                </Button>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  Contact Desk <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Dedicated Direct Assistance & Contact Band */}
        <div className="mt-16 rounded-3xl border border-border/70 bg-linear-to-br from-card via-card to-primary/5 p-8 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2">
                <EditorialPill variant="primary" size="xs" dot>
                  DIRECT CITIZEN ASSISTANCE
                </EditorialPill>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-black text-foreground">
                Still have an unanswered question?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Whether you need specialized county financial datasets, want to propose a Wanahabari
                investigation, or wish to commission BNS Studios, our desks are ready to assist.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="https://wa.me/254790631623"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-border/80 bg-background/80 p-4 hover:border-primary/50 hover:bg-card transition-all"
              >
                <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <MessageCircle className="size-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground">WhatsApp Desk</p>
                  <p className="text-[11px] text-muted-foreground">+254 790 631 623</p>
                </div>
              </a>

              <Link
                href="/contact"
                className="flex items-center gap-3 rounded-2xl border border-border/80 bg-background/80 p-4 hover:border-primary/50 hover:bg-card transition-all"
              >
                <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Mail className="size-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground">Email Inquiries</p>
                  <p className="text-[11px] text-muted-foreground">hello@budgetndiostory.org</p>
                </div>
              </Link>

              <Link
                href="/glossary"
                className="flex items-center gap-3 rounded-2xl border border-border/80 bg-background/80 p-4 hover:border-primary/50 hover:bg-card transition-all sm:col-span-2"
              >
                <div className="size-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                  <BookOpen className="size-4" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-xs font-bold text-foreground">Budget Glossary</p>
                  <p className="text-[11px] text-muted-foreground">
                    Looking for a specific term? Explore our 35+ verified definitions
                  </p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
