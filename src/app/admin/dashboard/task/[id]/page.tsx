"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSidebar } from "@/components/ui/sidebar";

import { TaskForm } from "@/app/task/_components/task-form";
import { TaskExportDialog } from "@/app/task/_components/task-export-dialog";
import { usePageView } from "@/hooks/use-page-view";
import { taskApi } from "@/lib/task-api";
import { taskData } from "@/data/tasks";
import { useRouteBase, getFullUrl } from "@/lib/route-base";
import { TaskPageShell } from "@/app/admin/dashboard/task/_components/task-page-shell";
import { TaskDetailBrief } from "@/app/admin/dashboard/task/_components/task-detail-brief";
import { TaskDetailMobileChrome } from "@/app/admin/dashboard/task/_components/task-detail-mobile-chrome";
import type { Task, TaskDetail } from "@/types/tasks";

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

  if (loading) {
    return (
      <TaskPageShell className="px-2 sm:px-0">
        <Skeleton className="mb-3 h-11 w-full rounded-lg lg:hidden" />
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-10">
          <Skeleton className="order-2 h-64 w-full rounded-xl lg:order-1" />
          <Skeleton className="order-1 h-[28rem] w-full rounded-xl lg:order-2" />
        </div>
      </TaskPageShell>
    );
  }

  if (!task) {
    return (
      <TaskPageShell className="px-2 sm:px-0">
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-xl border border-dashed border-border/80 px-6 text-center">
          <p className="text-lg font-semibold text-foreground">No task with that reference</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            It may have been removed, or you may not have access. Return to the board to pick another item.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link href={backHref}>Back to board</Link>
          </Button>
        </div>
      </TaskPageShell>
    );
  }

  return (
    <TaskPageShell className="min-w-0 px-2 sm:px-0">
      <TaskDetailMobileChrome
        task={task}
        backHref={backHref}
        trailing={detail ? <TaskExportDialog task={detail} /> : undefined}
      />

      <div className="mt-3 flex flex-col gap-4 lg:mt-0 lg:grid lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        {/* Mobile-first: editor before reference panels */}
        <div className="order-1 min-w-0 lg:order-2">
          <div className="mb-4 hidden border-b border-border/60 pb-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between lg:mb-5">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Edit weekly note
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Update description, checklist, assignment, and files before publishing.
              </p>
            </div>
            {detail && <TaskExportDialog task={detail} />}
          </div>

          <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
            <TaskForm
              mode="edit"
              task={detail ?? task}
              redirectTo={backHref}
              layout="workspace"
            />
          </div>
        </div>

        <TaskDetailBrief
          className="order-2 lg:order-1"
          task={task}
          detail={detail}
          backHref={backHref}
        />
      </div>
    </TaskPageShell>
  );
}
