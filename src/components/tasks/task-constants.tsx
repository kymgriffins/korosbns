import { format } from "date-fns";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2, Circle, CircleDot } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { TaskStatus } from "@/types/tasks";

export function safeFormat(date: string | Date | undefined | null, fmt: string, fallback = ""): string {
  if (!date) return fallback;
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return fallback;
    return format(d, fmt);
  } catch {
    return fallback;
  }
}

export const STATUS_STYLES: Record<string, { bg: string; label: string }> = {
  draft: { bg: "bg-amber-500/10 text-amber-600 border-amber-500/30", label: "Draft" },
  audited: { bg: "bg-blue-500/10 text-blue-600 border-blue-500/30", label: "In Progress" },
  published: { bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30", label: "Published" },
};

export const STATUS_STYLES_CARD: Record<string, { bg: string; text: string }> = {
  draft: { bg: "#f59e0b", text: "#f59e0b" },
  audited: { bg: "#3b82f6", text: "#3b82f6" },
  published: { bg: "#10b981", text: "#10b981" },
};

export const COLUMNS: TaskStatus[] = ["draft", "audited", "published"];

export const COLUMN_META: Record<TaskStatus, { title: string; icon: LucideIcon; color: string }> = {
  draft: { title: "Undone", icon: Circle, color: "border-t-amber-500" },
  audited: { title: "In Progress", icon: CircleDot, color: "border-t-blue-500" },
  published: { title: "Done", icon: CheckCircle2, color: "border-t-emerald-500" },
};

export function ColumnSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-28 w-full rounded-xl" />
      ))}
    </div>
  );
}
