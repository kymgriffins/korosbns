import { citizenApi, apiFetch } from "@/lib/api-client";
import type { ApiListResponse } from "@/types/api";
import type {
  WeeklyNoteApi, WeeklyNoteDetailApi, WeeklyNoteCreateApi,
  TaskAttachmentApi, ChecklistItemApi,
} from "@/types/notes";
import type {
  Task, TaskDetail, TaskCreatePayload, TaskUpdatePayload,
  AssignableUser, ChecklistItem, TaskPriority, TaskTag, KanbanColumn,
  TaskAttachment,
} from "@/types/tasks";
import { autoHue } from "@/types/tasks";

function mapNoteToTask(note: WeeklyNoteApi): Task {
  const parsed = parseChecklist(note.content);
  return {
    id: note.id,
    week_label: note.week_label,
    title: note.title,
    content: parsed.clean,
    status: note.status as Task["status"],
    author_name: note.author_name,
    created_at: note.created_at,
    updated_at: note.updated_at,
    due_date: note.due_date,
    assignee: note.assignee,
    assigned_team: note.assigned_team,
    team_name: note.team_name,
    hue: note.hue ?? autoHue(note.assigned_team),
    due_label: note.due_label,
    section_count: note.section_count,
    progress: note.progress,
    checklist: parsed.checklist,
    priority: note.priority as TaskPriority | undefined,
    tag: note.tag as TaskTag | undefined,
    scheduled_time: note.scheduled_time,
    kanban_column: note.kanban_column as KanbanColumn | undefined,
    owner_name: note.owner_name,
    owner_tone: note.owner_tone,
  };
}

function mapAttachment(a: TaskAttachmentApi): TaskAttachment {
  return {
    id: a.id,
    url: a.url ?? "",
    file_name: a.file_name,
    file_size: a.file_size,
    content_type: a.content_type,
    is_image: a.is_image,
    uploaded_by_name: a.uploaded_by_name,
    created_at: a.created_at,
  };
}

function mapDetailToTask(detail: WeeklyNoteDetailApi): TaskDetail {
  return {
    ...mapNoteToTask(detail),
    content: detail.content,
    notes: detail.notes,
    sections: detail.sections,
    audit_trails: detail.audit_trails,
    checklist_items: detail.checklist_items,
    attachments: detail.attachments?.map(mapAttachment),
    author_team: detail.author_team,
    team: detail.team,
    assignee_email: detail.assignee_email,
    assignee_avatar: detail.assignee_avatar,
  };
}

function buildBody(payload: TaskCreatePayload): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  body.week_label = payload.week_label;
  body.title = payload.title;
  body.content = encodeChecklist(payload.content, payload.checklist);
  if (payload.notes !== undefined) body.notes = payload.notes;
  if (payload.status) body.status = payload.status;
  if (payload.due_date !== undefined) body.due_date = payload.due_date;
  if (payload.assignee !== undefined) body.assignee = payload.assignee;
  if (payload.assigned_team !== undefined) body.assigned_team = payload.assigned_team;
  if (payload.progress !== undefined) body.progress = payload.progress;
  if (payload.due_label !== undefined) body.due_label = payload.due_label;
  if (payload.priority !== undefined) body.priority = payload.priority;
  if (payload.tag !== undefined) body.tag = payload.tag;
  if (payload.scheduled_time !== undefined) body.scheduled_time = payload.scheduled_time;
  if (payload.kanban_column !== undefined) body.kanban_column = payload.kanban_column;
  body.hue = autoHue(payload.assigned_team) ?? null;
  return body;
}

export function parseChecklist(content?: string): { clean: string; checklist: ChecklistItem[] } {
  if (!content) return { clean: "", checklist: [] };
  try {
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === "object" && "__checklist__" in parsed) {
      return {
        clean: parsed.__text__ ?? "",
        checklist: (parsed.__checklist__ as ChecklistItem[]) ?? [],
      };
    }
  } catch {
    // not JSON, treat as plain text
  }
  return { clean: content, checklist: [] };
}

export function encodeChecklist(text: string, checklist?: ChecklistItem[]): string {
  if (!checklist || checklist.length === 0) return text;
  return JSON.stringify({ __checklist__: checklist, __text__: text });
}

export const taskApi = {
  list: async (): Promise<Task[]> => {
    const notes = await citizenApi.getWeeklyNotes();
    return notes.map(mapNoteToTask);
  },

  listAll: async (): Promise<Task[]> => {
    const [publicNotes, authNotes] = await Promise.allSettled([
      citizenApi.getWeeklyNotes(),
      apiFetch<WeeklyNoteApi[]>("/notes/", { auth: true }),
    ]);
    const map = new Map<string, Task>();
    if (publicNotes.status === "fulfilled") {
      const notes = Array.isArray(publicNotes.value) ? publicNotes.value : ((publicNotes.value as ApiListResponse<WeeklyNoteApi>).results ?? []);
      notes.forEach((n) => map.set(n.id, mapNoteToTask(n)));
    }
    if (authNotes.status === "fulfilled") {
      const arr = Array.isArray(authNotes.value) ? authNotes.value : ((authNotes.value as ApiListResponse<WeeklyNoteApi>).results ?? []);
      arr.forEach((n: WeeklyNoteApi) => map.set(n.id, mapNoteToTask(n)));
    }
    return Array.from(map.values());
  },

  get: async (id: string): Promise<TaskDetail> => {
    const res = await apiFetch<WeeklyNoteDetailApi>(`/notes/${id}/`, { auth: true });
    return mapDetailToTask(res);
  },

  create: async (payload: TaskCreatePayload): Promise<Task> => {
    const body = buildBody(payload);
    const note = await citizenApi.createWeeklyNote(body as WeeklyNoteCreateApi);
    return mapNoteToTask(note);
  },

  update: async (id: string, payload: TaskUpdatePayload): Promise<Task> => {
    const body = buildBody(payload as TaskCreatePayload);
    const note = await apiFetch<WeeklyNoteApi>(`/notes/${id}/`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(body),
    });
    return mapNoteToTask(note);
  },

  delete: async (id: string): Promise<void> => {
    await apiFetch<void>(`/notes/${id}/`, { method: "DELETE", auth: true });
  },

  audit: async (id: string, action: string, comment: string): Promise<Task> => {
    const note = await citizenApi.auditWeeklyNote(id, action, comment);
    return mapNoteToTask(note);
  },

  publish: async (id: string, bypassChecklist = false, bypassComment = ""): Promise<Task> => {
    const note = await citizenApi.publishWeeklyNote(id, bypassChecklist, bypassComment);
    return mapNoteToTask(note);
  },

  unpublish: async (id: string): Promise<Task> => {
    return taskApi.update(id, { status: "draft", title: undefined });
  },

  getAssignableUsers: async (): Promise<AssignableUser[]> => {
    const res = await apiFetch<AssignableUser[]>("/notes/assignable_users/", { auth: true });
    if (Array.isArray(res)) return res;
    if (Array.isArray((res as any).results)) return (res as any).results;
    return [];
  },

  getWeeklyReport: async (week?: string): Promise<{
    total: number;
    by_status: Record<string, number>;
    by_team: Record<string, { name: string; color: string; count: number }>;
    by_assignee: Record<string, number>;
    avg_progress: number;
    period: string;
  }> => {
    const params = week ? `?week=${encodeURIComponent(week)}` : "";
    return apiFetch(`/notes/weekly_report/${params}`, { auth: true });
  },

  getTeams: async (): Promise<string[]> => {
    try {
      const res = await apiFetch<{ results: { name: string }[] }>("/teams/", { auth: true });
      if (Array.isArray(res.results)) {
        return res.results.map((t) => t.name);
      }
    } catch {
      // fallback below
    }
    return ["MEDIA", "ICT", "MANAGERIAL"];
  },

  getProjects: async (status?: string) => {
    const params = status ? `?status=${encodeURIComponent(status)}` : "";
    return apiFetch<ApiListResponse<{ id: string; title: string; status: string; progress: number; due_date?: string | null }>>(
      `/projects/${params}`,
      { auth: true },
    );
  },

  createProject: async (data: Record<string, unknown>) => {
    return apiFetch<{ id: string }>("/projects/", {
      method: "POST",
      auth: true,
      body: JSON.stringify(data),
    });
  },

  getCalendarEvents: async (month?: string) => {
    const params = month ? `?month=${encodeURIComponent(month)}` : "";
    return apiFetch<ApiListResponse<{ id: string; title: string; date: string; start_time?: string; end_time?: string; color: string }>>(
      `/calendar/${params}`,
      { auth: true },
    );
  },

  createCalendarEvent: async (data: Record<string, unknown>) => {
    return apiFetch<{ id: string }>("/calendar/", {
      method: "POST",
      auth: true,
      body: JSON.stringify(data),
    });
  },

  getGoals: async (week?: string) => {
    const params = week ? `?week=${encodeURIComponent(week)}` : "";
    return apiFetch<ApiListResponse<{ id: string; title: string; status: string; target_date?: string | null }>>(
      `/goals/${params}`,
      { auth: true },
    );
  },

  getGoalSummary: async (week?: string) => {
    const params = week ? `?week=${encodeURIComponent(week)}` : "";
    return apiFetch<{ total: number; completed: number; in_progress: number; not_started: number; completion_rate: number }>(
      `/goals/summary/${params}`,
      { auth: true },
    );
  },

  createGoal: async (data: Record<string, unknown>) => {
    return apiFetch<{ id: string }>("/goals/", {
      method: "POST",
      auth: true,
      body: JSON.stringify(data),
    });
  },

  startFocusSession: async (taskId?: string, durationMinutes = 90) => {
    return apiFetch<{ id: string; started_at: string }>("/focus-sessions/start/", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ task: taskId, duration_minutes: durationMinutes }),
    });
  },

  stopFocusSession: async (id: string) => {
    return apiFetch<{ id: string; completed: boolean; ended_at: string }>(`/focus-sessions/${id}/stop/`, {
      method: "POST",
      auth: true,
    });
  },

  getActiveFocusSession: async () => {
    return apiFetch<{ active: boolean; id?: string; duration_minutes?: number; started_at?: string }>(
      "/focus-sessions/active/",
      { auth: true },
    );
  },

  // ── Attachments ──────────────────────────────────────────

  uploadAttachment: async (taskId: string, file: File): Promise<TaskAttachment> => {
    const form = new FormData();
    form.append("file", file);
    const res = await apiFetch<TaskAttachmentApi>(`/notes/${taskId}/attachments/`, {
      method: "POST",
      auth: true,
      body: form,
    });
    return mapAttachment(res);
  },

  getAttachments: async (taskId: string): Promise<TaskAttachment[]> => {
    const res = await apiFetch<TaskAttachmentApi[]>(`/notes/${taskId}/attachment_list/`, { auth: true });
    return (res ?? []).map(mapAttachment);
  },

  deleteAttachment: async (taskId: string, attachmentId: string): Promise<void> => {
    await apiFetch<void>(`/notes/${taskId}/attachments/${attachmentId}/`, {
      method: "DELETE",
      auth: true,
    });
  },

  // ── Checklist Items ─────────────────────────────────────

  addChecklistItem: async (taskId: string, text: string): Promise<ChecklistItemApi> => {
    return apiFetch<ChecklistItemApi>(`/notes/${taskId}/add_checklist_item/`, {
      method: "POST",
      auth: true,
      body: JSON.stringify({ text }),
    });
  },

  updateChecklistItem: async (taskId: string, itemId: string, data: Partial<Pick<ChecklistItemApi, "text" | "is_completed" | "sort_order">>): Promise<ChecklistItemApi> => {
    return apiFetch<ChecklistItemApi>(`/notes/${taskId}/checklist/${itemId}/`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(data),
    });
  },

  deleteChecklistItem: async (taskId: string, itemId: string): Promise<void> => {
    await apiFetch<void>(`/notes/${taskId}/checklist/${itemId}/`, {
      method: "DELETE",
      auth: true,
    });
  },
};
