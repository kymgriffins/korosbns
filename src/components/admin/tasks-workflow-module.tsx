"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  assigned_to?: string | null;
};

type Props = {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
};

export function TasksWorkflowModule({ canCreate, canEdit, canDelete }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/workflows/tasks", { cache: "no-store" });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload?.message ?? payload?.error ?? "Failed to load tasks");
      setTasks(payload?.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const createTask = async () => {
    if (!title.trim()) return;
    setError("");
    try {
      const res = await fetch("/api/admin/workflows/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category: "backend",
          priority: "medium",
          status: "pending",
          is_public: false,
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload?.message ?? payload?.error ?? "Failed to create task");
      setTitle("");
      setTasks((prev) => [payload, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    }
  };

  const updateTask = async (taskId: string, patch: Partial<Task>) => {
    setError("");
    try {
      const res = await fetch(`/api/admin/workflows/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload?.message ?? payload?.error ?? "Update failed");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const deleteTask = async (taskId: string) => {
    setError("");
    try {
      const res = await fetch(`/api/admin/workflows/tasks/${taskId}`, { method: "DELETE" });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.message ?? payload?.error ?? "Delete failed");
      }
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks Operations</CardTitle>
        <CardDescription>Create, prioritize and update organization tasks.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{tasks.length} tasks</p>
          <Button variant="outline" onClick={() => void load()} disabled={loading}>Refresh</Button>
        </div>
        <div className="flex gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New task title..."
            disabled={!canCreate}
          />
          <Button onClick={() => void createTask()} disabled={!canCreate || !title.trim()}>
            Create
          </Button>
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <div className="space-y-2">
          {tasks.map((task) => (
          <div key={task.id} className="grid grid-cols-1 gap-2 rounded border p-3 md:grid-cols-5">
            <p className="font-medium md:col-span-2">{task.title}</p>
              <Select
                value={task.status}
                disabled={!canEdit}
                onValueChange={(value) => void updateTask(task.id, { status: value })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">pending</SelectItem>
                  <SelectItem value="in_progress">in_progress</SelectItem>
                  <SelectItem value="completed">completed</SelectItem>
                  <SelectItem value="delayed">delayed</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={task.priority}
                disabled={!canEdit}
                onValueChange={(value) => void updateTask(task.id, { priority: value })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">low</SelectItem>
                  <SelectItem value="medium">medium</SelectItem>
                  <SelectItem value="high">high</SelectItem>
                  <SelectItem value="critical">critical</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="destructive"
                disabled={!canDelete}
                onClick={() => void deleteTask(task.id)}
              >
                Delete
              </Button>
            </div>
          ))}
          {!tasks.length && !loading ? <p className="text-sm text-muted-foreground">No tasks found.</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}
