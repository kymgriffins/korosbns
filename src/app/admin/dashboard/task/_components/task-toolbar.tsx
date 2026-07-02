"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Filter,
  Grid3x3,
  List,
  Kanban,
  Plus,
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { getFullUrl, useRouteBase } from "@/lib/route-base";
import type { TaskPriority, TaskStatus } from "@/types/tasks";

export type ViewMode = "board" | "tiles" | "list";

const VIEW_OPTIONS: Array<{ mode: ViewMode; label: string; icon: typeof Kanban }> = [
  { mode: "board", label: "Board", icon: Kanban },
  { mode: "tiles", label: "Tiles", icon: Grid3x3 },
  { mode: "list", label: "List", icon: List },
];

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "all_statuses", label: "All statuses" },
  { value: "draft", label: "To do" },
  { value: "audited", label: "In progress" },
  { value: "published", label: "Done" },
];

const PRIORITY_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "all_priorities", label: "All priorities" },
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

type Props = {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  query: string;
  onQueryChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (v: string) => void;
  onClearFilters: () => void;
};

export function TaskToolbar({
  viewMode,
  onViewModeChange,
  query,
  onQueryChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  onClearFilters,
}: Props) {
  const routeBase = useRouteBase();

  const activeFilters = useMemo(() => {
    const chips: Array<{ label: string; onRemove: () => void }> = [];
    if (statusFilter !== "all_statuses") {
      const label = STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? statusFilter;
      chips.push({ label: `Status: ${label}`, onRemove: () => onStatusFilterChange("all_statuses") });
    }
    if (priorityFilter !== "all_priorities") {
      const label = PRIORITY_OPTIONS.find((o) => o.value === priorityFilter)?.label ?? priorityFilter;
      chips.push({ label: `Priority: ${label}`, onRemove: () => onPriorityFilterChange("all_priorities") });
    }
    return chips;
  }, [statusFilter, priorityFilter, onStatusFilterChange, onPriorityFilterChange]);

  return (
    <div className="border-border/80 border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/70">
      <div className="flex min-h-10 items-center px-2 py-1.5 md:px-3">
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                className="h-7 w-48 rounded-md border-border bg-background pl-7 text-xs"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-foreground text-xs font-medium outline-none ring-0 hover:bg-accent/60"
                >
                  <Filter className="size-3" />
                  Status
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-36">
                {STATUS_OPTIONS.map((o) => (
                  <DropdownMenuItem
                    key={o.value}
                    onClick={() => onStatusFilterChange(o.value)}
                    className={statusFilter === o.value ? "bg-accent font-medium" : ""}
                  >
                    {o.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-foreground text-xs font-medium outline-none ring-0 hover:bg-accent/60"
                >
                  <Filter className="size-3" />
                  Priority
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-36">
                {PRIORITY_OPTIONS.map((o) => (
                  <DropdownMenuItem
                    key={o.value}
                    onClick={() => onPriorityFilterChange(o.value)}
                    className={priorityFilter === o.value ? "bg-accent font-medium" : ""}
                  >
                    {o.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {activeFilters.length > 0 && (
              <>
                {activeFilters.map((chip) => (
                  <span
                    key={chip.label}
                    className="inline-flex h-7 items-center rounded-md border border-border bg-background text-xs shadow-xs"
                  >
                    <span className="px-2 font-medium text-foreground">{chip.label}</span>
                    <span className="h-full w-px bg-border" />
                    <button
                      className="inline-flex h-full w-7 items-center justify-center rounded-r-md text-foreground/70 hover:bg-accent/70 hover:text-foreground"
                      onClick={chip.onRemove}
                      type="button"
                    >
                      <X className="size-3.5" />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={onClearFilters}
                >
                  Clear
                </button>
              </>
            )}
          </div>

          <div className="inline-flex items-center gap-1.5">
            <div className="inline-flex items-center gap-1">
              {VIEW_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.mode}
                    type="button"
                    className={`inline-flex h-6 items-center gap-1 rounded-md px-2 text-xs font-medium transition-colors ${
                      viewMode === opt.mode
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                    }`}
                    onClick={() => onViewModeChange(opt.mode)}
                  >
                    <Icon className="size-3" />
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <span className="h-5 w-px bg-border/60" />

            <Button asChild size="sm" className="h-7 gap-1 px-2.5 text-xs">
              <Link href={getFullUrl(routeBase, "/dashboard/task/new")}>
                <Plus className="size-3" />
                New task
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
