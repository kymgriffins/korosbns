"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Banknote,
  Building2,
  FileText,
  Landmark,
  PieChart,
  Search,
  Shield,
  SlidersHorizontal,
  Target,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { REPORTS, getCategoryLabel, type ReportCategory } from "@/lib/reports-hub";

const ICON_MAP: Record<string, React.ElementType> = {
  Landmark,
  Building2,
  Shield,
  Target,
  Banknote,
  PieChart,
};

const CATEGORIES: ReportCategory[] = ["national", "county", "defense", "development", "revenue", "sector"];

export default function ReportsHubPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | "all">("all");

  const filtered = useMemo(() => {
    return REPORTS.filter((r) => {
      if (selectedCategory !== "all" && r.category !== selectedCategory) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!r.title.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [search, selectedCategory]);

  const hasActiveFilters = search || selectedCategory !== "all";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
              <Landmark className="size-4.5 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold tracking-tight md:text-lg">Reports Hub</h1>
              <p className="truncate text-[10px] text-muted-foreground hidden sm:block">
                Browse, search, and explore Kenya budget reports
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border bg-background pl-9 pr-8 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="size-3.5 text-muted-foreground shrink-0" />
            <button
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-all",
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              )}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-all",
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                )}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        {hasActiveFilters && (
          <p className="text-xs text-muted-foreground mb-4">
            {filtered.length} {filtered.length === 1 ? "report" : "reports"} found
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
              <Search className="size-8 text-muted-foreground/40" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold">No reports found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search or filter to find what you&apos;re looking for
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => { setSearch(""); setSelectedCategory("all"); }}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((report) => {
              const Icon = ICON_MAP[report.icon] || FileText;
              return (
                <Link key={report.slug} href={`/budgethub/reports/${report.slug}`} className="group block">
                  <Card className={cn(
                    "border-border/60 shadow-sm h-full transition-all duration-300",
                    "hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5",
                  )}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                          <Icon className="size-5 text-primary" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-medium">
                            {getCategoryLabel(report.category)}
                          </Badge>
                          {report.featured && (
                            <Badge variant="default" className="text-[9px] px-1.5 py-0 font-medium bg-amber-500/10 text-amber-600 hover:bg-amber-500/20">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-sm mt-3 group-hover:text-primary transition-colors">
                        {report.title}
                      </CardTitle>
                      <CardDescription className="text-xs leading-relaxed">
                        {report.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-1 text-[10px] text-primary/60 group-hover:text-primary transition-colors">
                        <span>View report</span>
                        <span className="text-primary/40 group-hover:translate-x-0.5 transition-transform">→</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
