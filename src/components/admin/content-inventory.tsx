"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileText,
  HelpCircle,
  LayoutDashboard,
  ListTree,
  Loader2,
  Search,
  X,
} from "lucide-react";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Skeleton } from "@/ui/skeleton";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { SectionHeader, SectionShell } from "@/layouts/section-shell";
import { cn } from "@/utils";
import {
  generateInventory,
  inventorySummary,
  type InventoryGroup,
  type InventoryItem,
  type InventoryCategory,
  type InventoryStatus,
} from "@/data/site-content-inventory";
import { getVideos } from "@/data/videos";

const STATUS_META: Record<InventoryStatus, { label: string; icon: typeof CheckCircle2; color: string }> = {
  configured: {
    label: "Configured",
    icon: CheckCircle2,
    color: "text-emerald-500",
  },
  partial: {
    label: "Partial",
    icon: AlertTriangle,
    color: "text-amber-500",
  },
  missing: {
    label: "Missing",
    icon: HelpCircle,
    color: "text-red-400",
  },
};

const CATEGORY_LABELS: Record<InventoryCategory, string> = {
  branding: "Branding & Identity",
  leadership: "Leadership & Team",
  social: "Social Platforms",
  impact: "Impact Metrics",
  videos: "Video Content",
  modules: "Learning Modules",
  gamification: "Gamification",
  events: "Events",
  partners: "Partners",
  pages: "Navigation & Pages",
};

function StatusIcon({ status }: { status: InventoryStatus }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return <Icon className={cn("size-4 shrink-0", meta.color)} />;
}

function InventoryCard({ item }: { item: InventoryItem }) {
  const [expanded, setExpanded] = useState(false);
  const meta = STATUS_META[item.status];

  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-200 cursor-pointer",
        item.status === "missing"
          ? "border-red-200/50 bg-red-50/30 dark:border-red-900/30 dark:bg-red-950/10"
          : item.status === "partial"
            ? "border-amber-200/50 bg-amber-50/30 dark:border-amber-900/30 dark:bg-amber-950/10"
            : "border-border/60 bg-card hover:shadow-xs",
      )}
      onClick={() => setExpanded((p) => !p)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setExpanded((p) => !p); }}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start gap-3 p-3.5">
        <StatusIcon status={item.status} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{item.label}</span>
            <Badge
              variant="secondary"
              className={cn(
                "text-[9px] font-medium px-1.5 py-0 rounded-full",
                item.status === "configured" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                item.status === "partial" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                item.status === "missing" && "bg-red-500/10 text-red-600 dark:text-red-400",
              )}
            >
              {meta.label}
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">{item.description}</p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[10px] text-muted-foreground">
            {item.details && (
              <span className="truncate max-w-[250px]">{item.details}</span>
            )}
            {item.count !== undefined && (
              <span className="font-medium">{item.count} item{item.count !== 1 ? "s" : ""}</span>
            )}
            {item.source && (
              <span className="font-mono text-[9px]">{item.source}</span>
            )}
          </div>

          {item.items && item.items.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {item.items.slice(0, expanded ? undefined : 3).map((name, i) => (
                <span
                  key={i}
                  className="text-[9px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground"
                >
                  {name}
                </span>
              ))}
              {!expanded && item.items.length > 3 && (
                <span className="text-[9px] text-muted-foreground">
                  +{item.items.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
        {expanded ? (
          <ChevronDown className="size-3.5 shrink-0 text-muted-foreground mt-0.5" />
        ) : (
          <ChevronRight className="size-3.5 shrink-0 text-muted-foreground mt-0.5" />
        )}
      </div>
    </div>
  );
}

function SummaryCards({
  summary,
}: {
  summary: { total: number; configured: number; partial: number; missing: number };
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Total Items</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{summary.total}</p>
        </CardContent>
      </Card>
      <Card className="border-emerald-200/50 dark:border-emerald-900/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Configured
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {summary.configured}
          </p>
        </CardContent>
      </Card>
      <Card className="border-amber-200/50 dark:border-amber-900/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-amber-600 dark:text-amber-400">
            Partial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {summary.partial}
          </p>
        </CardContent>
      </Card>
      <Card className="border-red-200/50 dark:border-red-900/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-red-500 dark:text-red-400">
            Missing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-500 dark:text-red-400">
            {summary.missing}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function ContentInventory() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InventoryStatus | "">("");
  const [categoryFilter, setCategoryFilter] = useState<InventoryCategory | "">("");

  const groups = useMemo(() => {
    const videoCount = getVideos().length;
    return generateInventory(videoCount);
  }, []);

  const summary = useMemo(() => inventorySummary(groups), [groups]);

  const filtered = useMemo(() => {
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (search) {
            const q = search.toLowerCase();
            if (
              !item.label.toLowerCase().includes(q) &&
              !item.description.toLowerCase().includes(q) &&
              !(item.details ?? "").toLowerCase().includes(q)
            ) {
              return false;
            }
          }
          if (statusFilter && item.status !== statusFilter) return false;
          if (categoryFilter && item.category !== categoryFilter) return false;
          return true;
        }),
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, search, statusFilter, categoryFilter]);

  return (
    <SectionShell className="min-h-screen">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="space-y-8"
      >
        <SectionHeader
          eyebrow="Site Inventory"
          title={
            <>
              Content <span className="font-heading italic text-primary">Inventory</span>
            </>
          }
          description="Pre-generated task list of all content configured across JSON data sources. This is a headless inventory — edit the data files to update."
        />

        <SummaryCards summary={summary} />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search inventory..."
              className="w-full pl-8 rounded-lg bg-background text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSearch(""); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <Select value={statusFilter || "__all__"} onValueChange={(v) => setStatusFilter(v === "__all__" ? "" : (v as InventoryStatus))}>
            <SelectTrigger className="w-36 rounded-lg bg-background text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Statuses</SelectItem>
              <SelectItem value="configured">Configured</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="missing">Missing</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter || "__all__"} onValueChange={(v) => setCategoryFilter(v === "__all__" ? "" : (v as InventoryCategory))}>
            <SelectTrigger className="w-44 rounded-lg bg-background text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Categories</SelectItem>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          {filtered.map((group) => (
            <div key={group.category}>
              <div className="flex items-center gap-2 mb-3">
                <LayoutDashboard className="size-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">{group.label}</h2>
                <Badge variant="secondary" className="text-[10px] font-medium rounded-full px-2">
                  {group.items.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <InventoryCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
              <ListTree className="size-10 opacity-40" />
              <p className="text-sm">No inventory items match your filters</p>
              <Button variant="outline" size="xs" onClick={() => { setSearch(""); setStatusFilter(""); setCategoryFilter(""); }}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </SectionShell>
  );
}
