"use client";

import { TaskForm } from "@/app/task/_components/task-form";

export default function NewTaskPage() {
  return (
    <div className="@container/main mx-auto max-w-2xl">
      <TaskForm mode="create" />
    </div>
  );
}
