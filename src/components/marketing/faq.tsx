"use client";

import { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  ArrowRight,
  FileText,
  Building2,
  TrendingUp,
  AlertTriangle,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MarketingPageBody,
  MarketingPageHero,
  MarketingPageShell,
} from "@/components/marketing/marketing-page-frame";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { GsapReveal, GsapStaggerReveal } from "@/motion/gsap";
import { cn } from "@/utils";
import { faqContent } from "@/content";

const faqIconMap: Record<string, React.ComponentType<{ className?: string }>> = { HelpCircle, FileText, TrendingUp, Wallet, Building2, AlertTriangle };

const faqCategories = faqContent.categories;
const faqItems = faqContent.items;

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredItems =
    activeCategory === "all"
      ? faqItems
      : faqItems.filter((item) => item.category === activeCategory);

  return (
    <MarketingPageShell>
      <MarketingPageHero
        eyebrow={faqContent.hero.eyebrow}
        title={
          <>
            Frequently asked <span className={T.highlight}>questions</span>
          </>
        }
        description={`${filteredItems.length} question${filteredItems.length === 1 ? "" : "s"} about Kenya's budget cycle, borrowing, and counties.`}
      />

      <MarketingPageBody>
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
          <aside className="lg:w-64 lg:shrink-0">
            <div className="lg:sticky lg:top-24 space-y-2">
              <p className={cn(T.caption, "mb-3 hidden text-muted-foreground lg:block")}>
                Categories
              </p>
              <div className="hidden space-y-1 lg:block">
                {faqCategories.map((cat) => {
                  const Icon = faqIconMap[cat.icon as string] || HelpCircle;
                  const active = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setOpenFaq(null);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-full px-3.5 py-2.5 text-left text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                      <span className="flex-1">{cat.label}</span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold",
                          active ? "bg-primary-foreground/20" : "bg-muted",
                        )}
                      >
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="lg:hidden">
                <select
                  value={activeCategory}
                  onChange={(e) => {
                    setActiveCategory(e.target.value);
                    setOpenFaq(null);
                  }}
                  className="h-11 w-full rounded-full border border-border/60 bg-card px-4 text-sm"
                >
                  {faqCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          <div className="min-w-0 flex-1 space-y-4">
            <GsapStaggerReveal className="space-y-3">
              {filteredItems.map((item, idx) => {
                const open = openFaq === idx;
                return (
                  <article
                    key={item.q}
                    data-gsap-item
                    className="overflow-hidden rounded-2xl border border-border/60 bg-card"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : idx)}
                      className="flex w-full items-center justify-between gap-3 p-5 text-left transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle className="size-5 shrink-0 text-primary" />
                        <span className="text-sm font-semibold sm:text-base">{item.q}</span>
                      </div>
                      <ChevronDown
                        className={cn(
                          "size-5 shrink-0 text-muted-foreground transition-transform",
                          open && "rotate-180",
                        )}
                      />
                    </button>
                    {open ? (
                      <p className="border-t border-border/40 px-5 pb-5 pl-14 text-sm leading-relaxed text-muted-foreground">
                        {item.a}
                      </p>
                    ) : null}
                  </article>
                );
              })}
            </GsapStaggerReveal>

            <GsapReveal className="rounded-3xl border border-border/60 bg-card p-8 text-center sm:p-10">
              <h2 className={T.sectionTitle}>{faqContent.hero.ctaHeading}</h2>
              <p className={cn(T.lead, "mx-auto mt-3 max-w-md text-sm text-foreground/75")}>
                {faqContent.hero.ctaDescription}
              </p>
              <Button asChild size="lg" className={cn(T.btnPrimary, "mt-6 rounded-full px-8")}>
                <Link href={faqContent.hero.ctaHref}>
                  {faqContent.hero.ctaLabel}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </GsapReveal>
          </div>
        </div>
      </MarketingPageBody>
    </MarketingPageShell>
  );
}
