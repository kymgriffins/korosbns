"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { PlayfulTodolist } from "@/components/animate-ui/components/community/playful-todolist";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { taskApi } from "@/lib/task-api";
import { isChecklistItemDone, mergeChecklistOrder } from "@/app/task/_components/checklist-utils";
import type { ChecklistItem } from "@/types/tasks";
import { cn } from "@/utils";

type Props = {
  taskId: string;
  initialItems?: ChecklistItem[];
  onItemsChange?: (items: ChecklistItem[]) => void;
  className?: string;
};

function genId() {
  return `local-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Live checklist for a task detail page — playful toggle UI with API persistence.
 * This is the primary work surface: checking items off is the job of the page.
 */
export function TaskPlayfulChecklist({
  taskId,
  initialItems = [],
  onItemsChange,
  className,
}: Props) {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const sync = useCallback(
    (next: ChecklistItem[]) => {
      const ordered = mergeChecklistOrder(next);
      setItems(ordered);
      onItemsChange?.(ordered);
    },
    [onItemsChange],
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    taskApi
      .listChecklistItems(taskId)
      .then((apiItems) => {
        if (cancelled) return;
        if (apiItems.length > 0) sync(apiItems);
        else if (initialItems.length > 0) sync(initialItems);
      })
      .catch(() => {
        if (!cancelled && initialItems.length > 0) sync(initialItems);
        else if (!cancelled) toast.error("Could not load checklist");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const doneCount = useMemo(
    () => items.filter((i) => isChecklistItemDone(i)).length,
    [items],
  );
  const pct = items.length > 0 ? Math.round((doneCount / items.length) * 100) : 0;

  const playfulItems = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        label: item.title || item.text || "Untitled item",
        checked: isChecklistItemDone(item),
        hint:
          item.assignee_name || item.status
            ? [item.assignee_name, item.status && item.status !== "todo" ? item.status.replace(/_/g, " ") : null]
                .filter(Boolean)
                .join(" · ")
            : undefined,
      })),
    [items],
  );

  async function handleToggle(id: string, checked: boolean) {
    const patch = { checked, status: checked ? ("done" as const) : ("todo" as const) };
    const prev = items;
    sync(
      items.map((i) =>
        i.id === id
          ? {
              ...i,
              ...patch,
              text: i.text || i.title,
              title: i.title || i.text,
            }
          : i,
      ),
    );
    setBusyId(id);
    try {
      if (!id.startsWith("local-")) {
        const updated = await taskApi.updateChecklistItem(taskId, id, patch);
        sync(prev.map((i) => (i.id === id ? { ...i, ...updated, ...patch } : i)));
      }
    } catch {
      sync(prev);
      toast.error("Could not update checklist item");
    } finally {
      setBusyId(null);
    }
  }

  async function handleAdd() {
    const draft: ChecklistItem = {
      id: genId(),
      title: "New checklist item",
      text: "New checklist item",
      checked: false,
      status: "todo",
      progress: 0,
      priority: "medium",
      attachments: [],
    };
    sync([draft, ...items]);
    setBusyId(draft.id);
    try {
      const created = await taskApi.addChecklistItem(taskId, draft);
      sync([created, ...items.filter((i) => i.id !== draft.id)]);
      toast.success("Checklist item added");
    } catch {
      sync(items);
      toast.error("Could not add checklist item");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <div
        className={cn(
          "flex min-h-40 items-center justify-center rounded-2xl border border-border/60 bg-muted/30",
          className,
        )}
      >
        <Loader2 className="size-5 animate-spin text-muted-foreground" aria-label="Loading checklist" />
      </div>
    );
  }

  return (
    <section className={cn("flex flex-col gap-4", className)} aria-labelledby="task-checklist-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 id="task-checklist-heading" className="text-base font-semibold tracking-tight">
              Checklist
            </h2>
            <Badge variant="secondary" className="tabular-nums">
              {doneCount}/{items.length}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Tick items as you finish them — this is the live work queue for the week.
          </p>
        </div>
        {items.length > 0 ? (
          <div className="min-w-[8rem] flex-1 sm:max-w-[12rem]">
            <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
              <span>Progress</span>
              <span className="tabular-nums">{pct}%</span>
            </div>
            <Progress value={pct} className="h-1.5" />
          </div>
        ) : null}
      </div>

      <PlayfulTodolist
        items={playfulItems}
        onToggle={handleToggle}
        onAdd={handleAdd}
        disabled={busyId !== null}
        addLabel="Add item"
      />
    </section>
  );
}
