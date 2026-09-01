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

const faqCategories = [
  { id: "all", label: "All Questions", icon: HelpCircle, count: 10 },
  { id: "basics", label: "Budget Basics", icon: FileText, count: 3 },
  { id: "eta", label: "BETA Agenda", icon: TrendingUp, count: 1 },
  { id: "debt", label: "Debt & Borrowing", icon: Wallet, count: 2 },
  { id: "counties", label: "Counties", icon: Building2, count: 1 },
  { id: "risks", label: "Fiscal Risks", icon: AlertTriangle, count: 2 },
];

const faqItems = [
  {
    q: "What is the Budget Policy Statement (BPS)?",
    a: "The BPS is a yearly government document that sets out Kenya's spending priorities. It's like a preview of the national budget - showing where money will come from and where it'll go.",
    category: "basics",
  },
  {
    q: "When is the BPS released?",
    a: "By law (PFM Act), the BPS must be submitted to Parliament by February 15th every year. The final budget comes later on April 30th.",
    category: "basics",
  },
  {
    q: "What's the difference between BPS and the national budget?",
    a: "Think of BPS as the blueprint or trailer, and the national budget as the full movie. BPS sets the priorities and direction, while the budget is the actual detailed spending plan.",
    category: "basics",
  },
  {
    q: "What is BETA?",
    a: "BETA = Bottom-Up Economic Transformation Agenda. It's Kenya's plan to grow the economy by focusing on agriculture, small businesses, healthcare, housing, and digital transformation.",
    category: "eta",
  },
  {
    q: "Why does Kenya borrow so much?",
    a: "Kenya spends more than it collects in taxes (fiscal deficit). The gap is filled through borrowing - both from foreign sources and domestic (like treasury bonds). This helps fund development but also increases debt costs.",
    category: "debt",
  },
  {
    q: "What is the fiscal deficit?",
    a: "When government spending exceeds revenue, that's a fiscal deficit. Kenya's FY2026/27 deficit is KES 1,146.2 billion (5.5% of GDP) — up from KES 933.3 billion in FY2025/26 — financed through borrowing.",
    category: "debt",
  },
  {
    q: "How much goes to county governments?",
    a: "In FY2026/27, Parliament approved KES 428 billion equitable share to counties (KES 415B in FY2025/26). Total county allocation is KES 502 billion including conditional grants. This funds local services like roads, health, water, and markets in all 47 counties.",
    category: "counties",
  },
  {
    q: "What are the main fiscal risks?",
    a: "The BPS warns about: rising debt payments, state corporations needing bailouts, economic slowdowns, climate change (droughts/floods), and increased county demands.",
    category: "risks",
  },
  {
    q: "How does the budget affect me?",
    a: "Every shilling in the budget affects public services you use: roads, schools, hospitals, security, and more. Understanding the budget helps you hold leaders accountable.",
    category: "basics",
  },
  {
    q: "Are there climate risks in the budget?",
    a: "Yes! The BPS identifies climate change as a major fiscal risk. Droughts can reduce agricultural output and hydroelectric power, while floods can damage infrastructure. These affect tax revenue and increase emergency spending.",
    category: "risks",
  },
];

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
        eyebrow="Budget literacy"
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
                  const Icon = cat.icon;
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
              <h2 className={T.sectionTitle}>Still have questions?</h2>
              <p className={cn(T.lead, "mx-auto mt-3 max-w-md text-sm text-foreground/75")}>
                Dive deeper with free civic modules on Kenya&apos;s budget cycle.
              </p>
              <Button asChild size="lg" className={cn(T.btnPrimary, "mt-6 rounded-full px-8")}>
                <Link href="/learn">
                  Start learning
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
