import type { Task, TaskDetail, TaskCreatePayload, TaskUpdatePayload, AssignableUser, WeeklyReportData } from "@/types/tasks";
import type { WeeklyNoteApi } from "@/types/notes";
import { taskApi } from "@/lib/task-api";
import { withFallback } from "@/data/adapter";
import bnsConfig from "@/constants/bnsConfig.json";

export type { Task, TaskDetail, TaskCreatePayload, TaskUpdatePayload, AssignableUser };

const config = bnsConfig as {
  meetings?: {
    actionItems?: {
      id: string;
      title: string;
      owner: string;
      due: string;
      status: string;
      priority: string;
    }[];
  }[];
};

const DEFAULT_TASKS: Task[] = (config.meetings ?? [])
  .flatMap((m) => (m.actionItems ?? []).map((a, i) => {
    const t: Task = {
      id: a.id ?? `default-task-${i}`,
      week_label: "Backlog",
      title: a.title,
      status: a.status === "in_progress" ? "audited" : "draft" as Task["status"],
      author_name: a.owner,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      due_date: a.due,
      assignee: a.owner,
      priority: (a.priority === "high" || a.priority === "medium" ? a.priority : "medium") as Task["priority"],
    };
    return t;
  }));

let _tasks: Task[] = [...DEFAULT_TASKS];

export const taskData = {
  tasks: {
    get: () => _tasks,
    set: (items: Task[]) => { _tasks = items; },
    fetch: () =>
      withFallback(
        "tasks",
        () => taskApi.listAll(),
        () => _tasks,
      ),
    fetchById: (id: string) =>
      withFallback(
        "tasks",
        () => taskApi.get(id),
        () => _tasks.find((t) => t.id === id) ?? null,
      ),
    create: (payload: TaskCreatePayload) =>
      withFallback(
        "tasks",
        () => taskApi.create(payload),
        () => {
          const t: Task = {
            id: `new-${Date.now()}`,
            status: payload.status ?? "draft",
            author_name: "Local",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...payload,
          } as Task;
          _tasks.push(t);
          return t;
        },
      ),
    update: (id: string, payload: TaskUpdatePayload) =>
      withFallback(
        "tasks",
        () => taskApi.update(id, payload),
        () => {
          const idx = _tasks.findIndex((t) => t.id === id);
          if (idx >= 0) {
            _tasks[idx] = { ..._tasks[idx], ...payload, updated_at: new Date().toISOString() } as Task;
            return _tasks[idx];
          }
          return null as unknown as Task;
        },
      ),
    delete: (id: string) =>
      withFallback(
        "tasks",
        () => taskApi.delete(id).then(() => true),
        () => {
          _tasks = _tasks.filter((t) => t.id !== id);
          return true;
        },
      ),
    publish: (id: string, bypassChecklist = false, bypassComment = "") =>
      withFallback(
        "tasks",
        () => taskApi.publish(id, bypassChecklist, bypassComment),
        () => {
          const idx = _tasks.findIndex((t) => t.id === id);
          if (idx >= 0) {
            _tasks[idx] = { ..._tasks[idx], status: "published", updated_at: new Date().toISOString() };
            return _tasks[idx];
          }
          return null as unknown as Task;
        },
      ),
  },
  users: {
    fetchAssignable: () =>
      withFallback(
        "tasks",
        () => taskApi.getAssignableUsers(),
        () => [],
      ),
  },
  report: {
    fetch: (week?: string) =>
      withFallback(
        "tasks",
        () => taskApi.getWeeklyReport(week),
        () => ({
          total: _tasks.length,
          by_status: {},
          by_team: {},
          by_assignee: {},
          avg_progress: 0,
          period: week ?? "current",
        }),
      ),
  },
};
