"use client";

import { usePageView } from "@/hooks/use-page-view";
import { TaskForm } from "@/app/task/_components/task-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ListTodo } from "lucide-react";
import { useRouteBase, getFullUrl } from "@/lib/route-base";
import { TaskPageShell } from "@/app/admin/dashboard/task/_components/task-page-shell";

export default function NewTaskPage() {
  usePageView();
  const routeBase = useRouteBase();
  return (
    <TaskPageShell>
      <Card className="w-full border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-muted/10 shrink-0">
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
          <TaskForm mode="create" redirectTo={getFullUrl(routeBase, "/dashboard/task")} />
        </CardContent>
      </Card>
    </TaskPageShell>
  );
}
