"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSidebar } from "@/components/ui/sidebar";

import { TaskForm } from "@/app/task/_components/task-form";
import { TaskExportDialog } from "@/app/task/_components/task-export-dialog";
import { usePageView } from "@/hooks/use-page-view";
import { taskApi } from "@/lib/task-api";
import { taskData } from "@/data/tasks";
import { useRouteBase, getFullUrl } from "@/lib/route-base";
import { TaskPageShell } from "@/app/admin/dashboard/task/_components/task-page-shell";
import { TaskDetailBrief } from "@/app/admin/dashboard/task/_components/task-detail-brief";
import { TaskPlayfulChecklist } from "@/app/admin/dashboard/task/_components/task-playful-checklist";
import type { ChecklistItem, Task, TaskDetail } from "@/types/tasks";

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  usePageView();
  const { id } = use(params);
  const { setOpen: setSidebarOpen } = useSidebar();
  const routeBase = useRouteBase();
  const backHref = getFullUrl(routeBase, "/dashboard/task");
  const [task, setTask] = useState<Task | null>(null);
  const [detail, setDetail] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSidebarOpen(false);
    return () => setSidebarOpen(true);
  }, [setSidebarOpen]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [t, d] = await Promise.all([
          taskApi.listAll().then((tasks) => tasks.find((x) => x.id === id)),
          taskData.tasks.fetchById(id),
        ]);
        if (!cancelled) {
          if (t) setTask(t);
          setDetail(d);
        }
      } catch {
        if (!cancelled) toast.error("Could not load this task. Try again from the board.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  function handleChecklistChange(items: ChecklistItem[]) {
    setDetail((prev) =>
      prev
        ? {
            ...prev,
            checklist: items,
            progress:
              items.length > 0
                ? Math.round(
                    (items.filter((i) => i.checked || i.status === "done").length / items.length) *
                      100,
                  )
                : prev.progress,
          }
        : prev,
    );
    setTask((prev) =>
      prev
        ? {
            ...prev,
            checklist: items,
            progress:
              items.length > 0
                ? Math.round(
                    (items.filter((i) => i.checked || i.status === "done").length / items.length) *
                      100,
                  )
                : prev.progress,
          }
        : prev,
    );
  }

  if (loading) {
    return (
      <TaskPageShell>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)]">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
          <Skeleton className="h-[28rem] w-full rounded-xl" />
        </div>
      </TaskPageShell>
    );
  }

  if (!task) {
    return (
      <TaskPageShell>
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-xl border border-dashed border-border/80 px-6 text-center">
          <p className="text-lg font-semibold text-foreground">No task with that reference</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            It may have been removed, or you may not have access. Return to the board to pick another
            item.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link href={backHref}>Back to board</Link>
          </Button>
        </div>
      </TaskPageShell>
    );
  }

  return (
    <TaskPageShell>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
        <div className="flex min-w-0 flex-col gap-8">
          <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 pb-5">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                {task.week_label}
              </p>
              <h1 className="mt-2 text-balance font-heading text-2xl font-bold tracking-tight md:text-3xl">
                {task.title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Work the checklist first — then refine description, schedule, and files below.
              </p>
            </div>
            {detail ? <TaskExportDialog task={detail} /> : null}
          </header>

          <TaskPlayfulChecklist
            taskId={id}
            initialItems={detail?.checklist ?? task.checklist ?? []}
            onItemsChange={handleChecklistChange}
          />

          <Accordion type="multiple" defaultValue={["details"]} className="rounded-xl border border-border/70 bg-card px-4">
            <AccordionItem value="details" className="border-border/50">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                Task details &amp; publishing
              </AccordionTrigger>
              <AccordionContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  Update description, assignment, schedule, and attachments. Checklist edits above
                  save live.
                </p>
                <div className="rounded-lg border border-border/60 bg-background px-4 py-1 md:px-5">
                  <TaskForm mode="edit" task={detail ?? task} redirectTo={backHref} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <TaskDetailBrief task={task} detail={detail} backHref={backHref} />
      </div>
    </TaskPageShell>
  );
}
