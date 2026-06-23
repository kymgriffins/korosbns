"use client";

import { useCallback, useEffect, useState } from "react";

import { Calendar1, Plus } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { taskApi } from "@/lib/task-api";
import type { Task } from "@/types/tasks";

export function TasksSection() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await taskApi.listAll();
      setTasks(data.slice(0, 6));
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (loading) {
    return (
      <section className="flex flex-col gap-2">
        <Skeleton className="h-7 w-20" />
        <div className="rounded-xl border bg-background shadow-xs">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 p-4">
              <Skeleton className="size-4" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl tracking-tight">Tasks</h2>
        <div className="flex items-center gap-2">
          <Select defaultValue="today">
            <SelectTrigger className="w-30">
              <SelectValue placeholder="Today" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button>
            <Plus data-icon="inline-start" />
            New Task
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-background shadow-xs">
        <div className="divide-y">
          {tasks.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">No tasks yet.</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-2 p-4">
                <Checkbox
                  checked={task.status === "published"}
                  aria-label={task.title}
                  onCheckedChange={async (checked) => {
                    try {
                      if (checked) {
                        await taskApi.publish(task.id);
                      } else {
                        await taskApi.update(task.id, { status: "draft" });
                      }
                      fetchTasks();
                    } catch {
                      toast.error("Failed to update task");
                    }
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
                      <span className="truncate text-sm">{task.title}</span>
                      {task.tag && (
                        <Badge variant="outline" className="px-3 py-1 font-normal">
                          {task.tag}
                        </Badge>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-3 text-muted-foreground text-sm">
                      {task.scheduled_time && <span>{task.scheduled_time}</span>}
                      {task.due_date && <span>{task.due_date}</span>}
                      <Calendar1 className="size-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
