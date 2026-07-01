"use client";

import { usePageView } from "@/hooks/use-page-view";
import { TaskForm } from "@/app/task/_components/task-form";
import { AdminTaskBreadcrumbs } from "@/components/admin/admin-task-breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ListTodo, Sparkles } from "lucide-react";

export default function NewTaskPage() {
  usePageView();
  return (
    <div className="@container/main mx-auto max-w-3xl space-y-6">
      <AdminTaskBreadcrumbs segments={["new"]} />
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/40 bg-muted/10">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <ListTodo className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Create Task</CardTitle>
              <CardDescription>
                Add a new task to the board with checklist, assignee, and priority settings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <TaskForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
