"use client";

import { use } from "react";

import { usePageView } from "@/hooks/use-page-view";
import { TaskPageShell } from "@/app/admin/dashboard/task/_components/task-page-shell";
import { TaskTableView } from "@/app/admin/dashboard/task/_components/task-table-view";

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  usePageView();
  const { id } = use(params);

  return (
    <TaskPageShell>
      <TaskTableView
        heading="Task Details"
        description="Focused view for a single task with notes/files toggles and direct CRUD."
        singleTaskId={id}
      />
    </TaskPageShell>
  );
}
