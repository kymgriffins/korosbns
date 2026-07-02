import { citizenApi, apiFetch } from "@/lib/api-client";
import type { ApiListResponse } from "@/types/api";
import type {
  WeeklyNoteApi, WeeklyNoteDetailApi, WeeklyNoteCreateApi,
  TaskAttachmentApi, ChecklistItemApi, ChecklistItemAttachmentApi,
} from "@/types/notes";
import type {
  Task, TaskDetail, TaskCreatePayload, TaskUpdatePayload,
  AssignableUser, AssignableTeam, ChecklistItem, TaskPriority, TaskTag, KanbanColumn,
  TaskAttachment,
} from "@/types/tasks";
import { autoHue } from "@/types/tasks";

function mapChecklistItemApi(item: ChecklistItemApi): ChecklistItem {
  const title = item.title || item.text;
  return {
    id: item.id,
    title,
    text: item.text || title,
    checked: item.is_completed || item.status === "done",
    status: item.status,
    description_text: item.description_text,
    description_json: item.description_json,
    assignee: item.assignee ?? null,
    assignee_name: item.assignee_name,
    due_date: item.due_date,
    priority: item.priority as TaskPriority | undefined,
    progress: item.progress,
    sort_order: item.sort_order,
    attachment_count: item.attachment_count,
    attachments: item.attachments?.map((a) => ({
      id: a.id,
      url: a.url ?? "",
      file_name: a.file_name,
      file_size: a.file_size,
      content_type: a.content_type,
      is_image: a.is_image,
      uploaded_by_name: a.uploaded_by_name,
      created_at: a.created_at,
    })),
  };
}

function buildChecklistPayload(data: Partial<ChecklistItem>): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  const title = data.title ?? data.text;
  if (title !== undefined) {
    body.title = title;
    body.text = title;
  }
  if (data.description_text !== undefined) body.description_text = data.description_text;
  if (data.description_json !== undefined) body.description_json = data.description_json;
  if (data.status !== undefined) body.status = data.status;
  if (data.checked !== undefined) body.is_completed = data.checked;
  if (data.assignee !== undefined) body.assignee = data.assignee;
  if (data.due_date !== undefined) body.due_date = data.due_date;
  if (data.priority !== undefined) body.priority = data.priority;
  if (data.progress !== undefined) body.progress = data.progress;
  if (data.sort_order !== undefined) body.sort_order = data.sort_order;
  return body;
}

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
  const base = mapNoteToTask(detail);
  const checklistItems = detail.checklist_items?.map(mapChecklistItemApi);
  return {
    ...base,
    content: base.content ?? "",
    notes: detail.notes,
    sections: detail.sections,
    audit_trails: detail.audit_trails,
    checklist_items: detail.checklist_items,
    checklist: checklistItems ?? base.checklist,
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

/** Only sends fields present on the payload — safe for PATCH (status moves, kanban column, etc.). */
export function buildPatchBody(payload: TaskUpdatePayload): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (payload.week_label !== undefined) body.week_label = payload.week_label;
  if (payload.title !== undefined) body.title = payload.title;
  if (payload.notes !== undefined) body.notes = payload.notes;
  if (payload.status !== undefined) body.status = payload.status;
  if (payload.due_date !== undefined) body.due_date = payload.due_date;
  if (payload.assignee !== undefined) body.assignee = payload.assignee;
  if (payload.assigned_team !== undefined) {
    body.assigned_team = payload.assigned_team;
    body.hue = autoHue(payload.assigned_team) ?? null;
  }
  if (payload.progress !== undefined) body.progress = payload.progress;
  if (payload.due_label !== undefined) body.due_label = payload.due_label;
  if (payload.priority !== undefined) body.priority = payload.priority;
  if (payload.tag !== undefined) body.tag = payload.tag;
  if (payload.scheduled_time !== undefined) body.scheduled_time = payload.scheduled_time;
  if (payload.kanban_column !== undefined) body.kanban_column = payload.kanban_column;
  if (payload.content !== undefined || payload.checklist !== undefined) {
    body.content = encodeChecklist(payload.content ?? "", payload.checklist);
  }
  return body;
}

export function parseChecklist(content?: string): { clean: string; checklist: ChecklistItem[] } {
  if (!content) return { clean: "", checklist: [] };
  try {
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === "object" && "__checklist__" in parsed) {
      const rawItems = (parsed.__checklist__ as Array<Partial<ChecklistItem>>) ?? [];
      return {
        clean: parsed.__text__ ?? "",
        checklist: rawItems.map(normalizeEmbeddedChecklistItem),
      };
    }
  } catch {
    // not JSON, treat as plain text
  }
  return { clean: content, checklist: [] };
}

function normalizeEmbeddedChecklistItem(raw: Partial<ChecklistItem>): ChecklistItem {
  const text = raw.text ?? "";
  const title = raw.title || text;
  const checked = Boolean(raw.checked) || raw.status === "done";
  return {
    id: raw.id ?? "",
    title,
    text: text || title,
    checked,
    status: raw.status ?? (checked ? "done" : "todo"),
    description_text: raw.description_text,
    description_json: raw.description_json,
    assignee: raw.assignee ?? null,
    assignee_name: raw.assignee_name,
    due_date: raw.due_date ?? null,
    priority: raw.priority,
    progress: raw.progress,
    sort_order: raw.sort_order,
    attachment_count: raw.attachment_count,
    attachments: raw.attachments,
  };
}

export function encodeChecklist(text: string, checklist?: ChecklistItem[]): string {
  if (!checklist || checklist.length === 0) return text;
  const normalized = checklist.map((item) => {
    const title = item.title || item.text;
    return { ...item, title, text: item.text || title };
  });
  return JSON.stringify({ __checklist__: normalized, __text__: text });
}

export const taskApi = {
  list: async (): Promise<Task[]> => {
    const notes = await citizenApi.getWeeklyNotes();
    return notes.map(mapNoteToTask);
  },

  listAll: async (): Promise<Task[]> => {
    const res = await apiFetch<WeeklyNoteApi[] | ApiListResponse<WeeklyNoteApi>>("/notes/", { auth: true });
    const arr = Array.isArray(res) ? res : (res.results ?? []);
    return arr.map(mapNoteToTask);
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
    const body = buildPatchBody(payload);
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

  getTeams: async (): Promise<AssignableTeam[]> => {
    try {
      const res = await apiFetch<{ results: AssignableTeam[] }>("/teams/", { auth: true });
      if (Array.isArray(res.results)) {
        return res.results;
      }
    } catch {
      // fallback below
    }
    return [
      { id: "media", name: "MEDIA", slug: "media", color: "#3b82f6" },
      { id: "ict", name: "ICT", slug: "ict", color: "#10b981" },
      { id: "managerial", name: "MANAGERIAL", slug: "managerial", color: "#8b5cf6" },
    ];
  },

  getProjects: async (status?: string) => {
    const params = status ? `?status=${encodeURIComponent(status)}` : "";
    return apiFetch<ApiListResponse<{ id: string; title: string; status: string; progress: number; due_date?: string | null }>>(
      `/projects/${params}`,
      { auth: true },
    );
  },

  createProject: async (data: Record<string, unknown> | FormData) => {
    return apiFetch<{ id: string }>("/projects/", {
      method: "POST",
      auth: true,
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  updateProject: async (id: string, data: Record<string, unknown> | FormData) => {
    return apiFetch<{ id: string }>(`/projects/${id}/`, {
      method: "PATCH",
      auth: true,
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  deleteProject: async (id: string) => {
    return apiFetch<void>(`/projects/${id}/`, {
      method: "DELETE",
      auth: true,
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

  listChecklistItems: async (taskId: string): Promise<ChecklistItem[]> => {
    const res = await apiFetch<ChecklistItemApi[]>(`/notes/${taskId}/checklist-items/`, { auth: true });
    return (res ?? []).map(mapChecklistItemApi);
  },

  addChecklistItem: async (taskId: string, data: Partial<ChecklistItem>): Promise<ChecklistItem> => {
    const res = await apiFetch<ChecklistItemApi>(`/notes/${taskId}/add_checklist_item/`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(buildChecklistPayload(data)),
    });
    return mapChecklistItemApi(res);
  },

  updateChecklistItem: async (
    taskId: string,
    itemId: string,
    data: Partial<ChecklistItem>,
  ): Promise<ChecklistItem> => {
    const res = await apiFetch<ChecklistItemApi>(`/notes/${taskId}/checklist-items/${itemId}/`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(buildChecklistPayload(data)),
    });
    return mapChecklistItemApi(res);
  },

  deleteChecklistItem: async (taskId: string, itemId: string): Promise<void> => {
    await apiFetch<void>(`/notes/${taskId}/checklist-items/${itemId}/`, {
      method: "DELETE",
      auth: true,
    });
  },

  reorderChecklistItems: async (taskId: string, itemIds: string[]): Promise<ChecklistItem[]> => {
    const res = await apiFetch<ChecklistItemApi[]>(`/notes/${taskId}/reorder_checklist/`, {
      method: "POST",
      auth: true,
      body: JSON.stringify({ item_ids: itemIds }),
    });
    return (res ?? []).map(mapChecklistItemApi);
  },

  uploadChecklistAttachment: async (taskId: string, itemId: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return apiFetch<ChecklistItemAttachmentApi>(
      `/notes/${taskId}/checklist-items/${itemId}/attachments/`,
      { method: "POST", auth: true, body: form },
    );
  },

  deleteChecklistAttachment: async (taskId: string, itemId: string, attachmentId: string) => {
    await apiFetch<void>(
      `/notes/${taskId}/checklist-items/${itemId}/attachments/${attachmentId}/`,
      { method: "DELETE", auth: true },
    );
  },
};
