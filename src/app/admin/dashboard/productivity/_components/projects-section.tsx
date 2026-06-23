"use client";

import { useCallback, useEffect, useState } from "react";

import { ClipboardCheck, Globe, Orbit, Plus } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { taskApi } from "@/lib/task-api";

type Project = {
  id: string;
  title: string;
  status: string;
  progress: number;
  due_date?: string | null;
};

const STATUS_ICONS: Record<string, typeof Orbit> = {
  active: Orbit,
  planning: ClipboardCheck,
  completed: Globe,
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  planning: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  completed: "bg-gray-500/10 text-gray-700 dark:text-gray-300",
  on_hold: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

function formatDue(due: string | null | undefined): string {
  if (!due) return "";
  const d = new Date(due);
  const now = new Date();
  const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "Overdue";
  if (diff === 0) return "Due today";
  if (diff === 1) return "Due tomorrow";
  return `Due in ${diff} days`;
}

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await taskApi.getProjects(filter === "all" ? undefined : filter);
      setProjects(res.results ?? []);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl tracking-tight">Projects</h2>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Active" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Plus data-icon="inline-start" />
            New
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <p className="rounded-xl border p-8 text-center text-sm text-muted-foreground">No projects found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {projects.map((project) => {
            const Icon = STATUS_ICONS[project.status] ?? Orbit;
            const statusColor = STATUS_COLORS[project.status] ?? STATUS_COLORS.active;
            return (
              <Card key={project.id} className="shadow-xs">
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-muted-foreground" />
                      <span>{project.title}</span>
                    </div>
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline" className={statusColor}>{project.status}</Badge>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <Progress value={project.progress} className="h-2" />
                      <span className="shrink-0 text-sm">{project.progress}%</span>
                    </div>
                  </div>
                </CardContent>
                {project.due_date && (
                  <CardFooter className="py-2.5">
                    <span className="text-muted-foreground">{formatDue(project.due_date)}</span>
                  </CardFooter>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
