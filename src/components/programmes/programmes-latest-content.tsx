"use client";

import Link from "next/link";
import { ArrowUpRight, FileText, Newspaper, BookOpen } from "lucide-react";
import { LANDING_SECTION_SURFACE, LandingContent, LandingSection, LandingSectionHeader } from "@/layouts/landing-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const LATEST_ITEMS = [
  {
    category: "Report",
    title: "FY2026/27 Kenya National Budget Brief & Analysis",
    description: "Comprehensive breakdown of key revenue targets, debt servicing costs, and sector allocations.",
    href: "/reports",
    icon: FileText,
    date: "July 2026",
  },
  {
    category: "County Scrutiny",
    title: "County Budget Scorecard: Kakamega, Kilifi, Nakuru & Wajir",
    description: "BNS Mashinani's quarterly scorecard tracking revenue vs development execution across four counties.",
    href: "/reports",
    icon: Newspaper,
    date: "Quarter 2 2026",
  },
  {
    category: "Civic Explainer",
    title: "Where Does Kenya's KES 4.8 Trillion Go?",
    description: "Snackable explainer for youth breaking down county equitable shares, recurrent vs development spending.",
    href: "/learn",
    icon: BookOpen,
    date: "Active Guide",
  },
];

export function ProgrammesLatestContent() {
  return (
    <div className={LANDING_SECTION_SURFACE}>
      <LandingSection id="latest-content" aria-labelledby="latest-content-heading">
        <LandingSectionHeader
          title={
            <>
              <span className="text-primary">Latest from BNS.</span> Fresh data & publications.
            </>
          }
          description="Explore our latest budget scorecards, policy briefs, and civic explainers produced by BNS Connect, Mashinani, and Wanahabari Lab."
          className="mb-10 md:mb-14"
        />
        <LandingContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {LATEST_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-xs">
                        <Icon className="mr-1 size-3" />
                        {item.category}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground font-medium">{item.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/40">
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:underline"
                    >
                      Read publication
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" className="rounded-full gap-2">
              <Link href="/reports">
                View All BNS Reports & Scorecards
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        </LandingContent>
      </LandingSection>
    </div>
  );
}
