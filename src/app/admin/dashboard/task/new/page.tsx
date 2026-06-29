"use client";

import { usePageView } from "@/hooks/use-page-view";
import { TaskForm } from "@/app/task/_components/task-form";

export default function NewTaskPage() {
  usePageView();
  return (
    <div className="@container/main mx-auto max-w-2xl">
      <TaskForm mode="create" />
    </div>
  );
}
