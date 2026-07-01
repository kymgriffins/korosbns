import type { Task, TaskDetail, TaskCreatePayload, TaskUpdatePayload, AssignableUser, WeeklyReportData, TaskAttachment, TaskTag } from "@/types/tasks";
import type { WeeklyNoteApi, ChecklistItemApi } from "@/types/notes";
import { adminNotesApi } from "@/lib/admin-api";
import type { AdminNote } from "@/lib/admin-api";
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

const FALLBACK_TASKS: Task[] = [
  {
    id: "demo-1", week_label: "This Week", title: "Review budget allocations", status: "draft",
    author_name: "System", created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    priority: "high", content: "Cross-check county budget allocations against submitted proposals.",
  },
  {
    id: "demo-2", week_label: "This Week", title: "Publish civic education module", status: "audited",
    author_name: "System", created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    priority: "medium", content: "Final review and publish the new module on county budgeting.",
  },
  {
    id: "demo-3", week_label: "This Week", title: "Update community feedback form", status: "published",
    author_name: "System", created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    priority: "low", content: "Incorporate citizen suggestions from the last town hall.",
  },
];

let _tasks: Task[] = [...DEFAULT_TASKS];

export const taskData = {
  tasks: {
    get: () => _tasks,
    set: (items: Task[]) => { _tasks = items; },
    fetch: () =>
      withFallback(
        "tasks",
        () => taskApi.listAll(),
        () => (_tasks.length > 0 ? _tasks : FALLBACK_TASKS),
      ),
    fetchById: (id: string) =>
      withFallback(
        "tasks",
        () => taskApi.get(id),
        () => {
          const found = _tasks.find((t) => t.id === id);
          if (!found) return null as unknown as TaskDetail;
          const detail: TaskDetail = {
            ...found,
            content: found.content ?? "",
            sections: [],
            audit_trails: [],
            checklist_items: [],
            attachments: [],
          };
          return detail;
        },
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
    audit: (id: string, action: string, comment: string) =>
      withFallback(
        "tasks",
        () => taskApi.audit(id, action, comment),
        () => {
          const idx = _tasks.findIndex((t) => t.id === id);
          if (idx >= 0) {
            _tasks[idx] = { ..._tasks[idx], updated_at: new Date().toISOString() };
            return _tasks[idx];
          }
          return null as unknown as Task;
        },
      ),
    addChecklistItem: (id: string, text: string) =>
      withFallback(
        "tasks",
        () => taskApi.addChecklistItem(id, text),
        () => ({
          id: `new-cl-${Date.now()}`,
          text,
          is_completed: false,
          sort_order: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as ChecklistItemApi),
      ),
    updateChecklistItem: (id: string, itemId: string, data: Partial<Pick<ChecklistItemApi, "text" | "is_completed" | "sort_order">>) =>
      withFallback(
        "tasks",
        () => taskApi.updateChecklistItem(id, itemId, data),
        () => ({
          id: itemId,
          text: data.text ?? "",
          is_completed: data.is_completed ?? false,
          sort_order: data.sort_order ?? 0,
          created_at: "",
          updated_at: new Date().toISOString(),
        } as ChecklistItemApi),
      ),
    deleteChecklistItem: (id: string, itemId: string) =>
      withFallback(
        "tasks",
        () => taskApi.deleteChecklistItem(id, itemId).then(() => true),
        () => true,
      ),
    uploadAttachment: (id: string, file: File) =>
      withFallback(
        "tasks",
        () => taskApi.uploadAttachment(id, file),
        () => {
          const fallback: TaskAttachment = {
            id: `att-${Date.now()}`,
            url: URL.createObjectURL(file),
            file_name: file.name,
            file_size: file.size,
            content_type: file.type,
            is_image: file.type.startsWith("image/"),
            created_at: new Date().toISOString(),
          };
          return fallback;
        },
      ),
    deleteAttachment: (id: string, attachmentId: string) =>
      withFallback(
        "tasks",
        () => taskApi.deleteAttachment(id, attachmentId).then(() => true),
        () => true,
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
  teams: {
    fetch: () =>
      withFallback(
        "tasks",
        () => taskApi.getTeams(),
        () => ["MEDIA", "ICT", "MANAGERIAL"],
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
  notes: {
    fetch: (params?: { page?: number; search?: string; status?: string }) =>
      withFallback(
        "tasks",
        () => adminNotesApi.list(params),
        () => ({ count: 0, results: [] as AdminNote[] }),
      ),
    create: (data: Partial<AdminNote>) =>
      withFallback(
        "tasks",
        () => adminNotesApi.create(data),
        () => {
          const n: AdminNote = {
            id: `new-${Date.now()}`,
            title: data.title ?? "Untitled",
            content: data.content ?? "",
            author_name: "Local",
            status: "draft",
            is_public: data.is_public ?? false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          return n;
        },
      ),
    update: (id: string, data: Partial<AdminNote>) =>
      withFallback(
        "tasks",
        () => adminNotesApi.update(id, data),
        () => null as unknown as AdminNote,
      ),
    delete: (id: string) =>
      withFallback(
        "tasks",
        () => adminNotesApi.delete(id).then(() => true),
        () => true,
      ),
    publish: (id: string) =>
      withFallback(
        "tasks",
        () => adminNotesApi.publish(id),
        () => null as unknown as AdminNote,
      ),
    audit: (id: string, notes: string) =>
      withFallback(
        "tasks",
        () => adminNotesApi.audit(id, notes),
        () => null as unknown as AdminNote,
      ),
  },
};
