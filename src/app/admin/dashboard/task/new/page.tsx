"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useAuth } from "@/contexts/auth-context";
import { taskApi } from "@/lib/task-api";
import type { TaskCreatePayload, AssignableUser } from "@/types/tasks";

export default function NewTaskPage() {
  const router = useRouter();
  const { isLoggedIn, user: authUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [assignableUsers, setAssignableUsers] = useState<AssignableUser[]>([]);
  const [form, setForm] = useState({
    week_label: format(new Date(), "'W'w-yyyy"),
    title: "",
    content: "",
    assignee: "",
    assigned_team: "",
    due_date: "",
    due_label: "",
    progress: "",
  });

  useEffect(() => {
    if (!isLoggedIn) return;
    taskApi.getAssignableUsers().then(setAssignableUsers).catch(() => {});
  }, [isLoggedIn]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    taskApi
      .create({
        week_label: form.week_label,
        title: form.title,
        content: form.content || "",
        assignee: form.assignee || undefined,
        assigned_team: form.assigned_team || undefined,
        due_date: form.due_date || undefined,
        due_label: form.due_label || undefined,
        progress: form.progress ? Number(form.progress) : undefined,
      })
      .then(() => {
        toast.success("Task created");
        router.push("/dashboard/task");
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Failed to create task");
      })
      .finally(() => setSaving(false));
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center p-6">
        <Card className="w-full text-center">
          <CardContent className="py-12">
            <h2 className="mb-2 text-lg font-semibold">Authentication Required</h2>
            <p className="mb-6 text-sm text-muted-foreground">Sign in to create tasks.</p>
            <Button asChild>
              <a href={`/budgethub/auth/login?next=/dashboard/task/new`}>Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">New Task</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard/task")}>
          Cancel
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Task title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Description</Label>
              <Textarea
                id="content"
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="Describe the task..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="week_label">Week Label</Label>
                <Input
                  id="week_label"
                  value={form.week_label}
                  onChange={(e) => setForm((f) => ({ ...f, week_label: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={form.due_date}
                  onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Select
                  value={form.assignee}
                  onValueChange={(v) => setForm((f) => ({ ...f, assignee: v }))}
                >
                  <SelectTrigger id="assignee">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignableUsers.map((u) => (
                      <SelectItem key={u.id} value={u.email || u.id}>
                        {[u.first_name, u.last_name].filter(Boolean).join(" ") || u.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assigned_team">Team</Label>
                <Input
                  id="assigned_team"
                  value={form.assigned_team}
                  onChange={(e) => setForm((f) => ({ ...f, assigned_team: e.target.value }))}
                  placeholder="e.g., MEDIA, ICT"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="due_label">Due Label</Label>
                <Input
                  id="due_label"
                  value={form.due_label}
                  onChange={(e) => setForm((f) => ({ ...f, due_label: e.target.value }))}
                  placeholder="e.g., This week"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="progress">Progress</Label>
                <Input
                  id="progress"
                  value={form.progress}
                  onChange={(e) => setForm((f) => ({ ...f, progress: e.target.value }))}
                  placeholder="e.g., 50%"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" type="button" onClick={() => router.push("/dashboard/task")}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
                {saving ? "Creating…" : "Create Task"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
