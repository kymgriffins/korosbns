"use client";

import { usePageView } from "@/hooks/use-page-view";
import { TaskPageShell } from "@/app/admin/dashboard/task/_components/task-page-shell";
import { TaskTableView } from "@/app/admin/dashboard/task/_components/task-table-view";

export default function AdminTaskPage() {
  usePageView();

  return (
    <TaskPageShell>
      <TaskTableView
        heading="Tasks"
        description="Fresh responsive task table with direct CRUD and expandable notes/files."
      />
    </TaskPageShell>
  );
}
