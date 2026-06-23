import { citizenApi, apiFetch } from "@/lib/api-client";
import type { ApiListResponse } from "@/types/api";
import type { WeeklyNoteApi, WeeklyNoteDetailApi } from "@/types/notes";
import type {
  Task, TaskDetail, TaskCreatePayload, TaskUpdatePayload,
  AssignableUser, ChecklistItem,
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
    progress: (note as any).progress,
    checklist: parsed.checklist,
  };
}

function mapDetailToTask(detail: WeeklyNoteDetailApi): TaskDetail {
  return {
    ...mapNoteToTask(detail),
    content: detail.content,
    sections: detail.sections,
    audit_trails: detail.audit_trails,
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
  if (payload.status) body.status = payload.status;
  if (payload.due_date !== undefined) body.due_date = payload.due_date;
  if (payload.assignee !== undefined) body.assignee = payload.assignee;
  if (payload.assigned_team !== undefined) body.assigned_team = payload.assigned_team;
  if (payload.progress !== undefined) body.progress = payload.progress;
  if (payload.due_label !== undefined) body.due_label = payload.due_label;
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
      publicNotes.value.forEach((n) => map.set(n.id, mapNoteToTask(n)));
    }
    if (authNotes.status === "fulfilled") {
      const arr = Array.isArray(authNotes.value) ? authNotes.value : (authNotes.value as any).results ?? [];
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
    const note = await citizenApi.createWeeklyNote(body as any);
    return mapNoteToTask(note);
  },

  update: async (id: string, payload: TaskUpdatePayload): Promise<Task> => {
    const body = buildBody(payload as TaskCreatePayload);
    const note = await citizenApi.updateWeeklyNote(id, body as any);
    return mapNoteToTask(note);
  },

  delete: async (id: string): Promise<void> => {
    await apiFetch<void>(`/notes/${id}/`, { method: "DELETE", auth: true });
  },

  audit: async (id: string, action: string, comment: string): Promise<Task> => {
    const note = await citizenApi.auditWeeklyNote(id, action, comment);
    return mapNoteToTask(note);
  },

  publish: async (id: string): Promise<Task> => {
    const note = await citizenApi.publishWeeklyNote(id);
    return mapNoteToTask(note);
  },

  unpublish: async (id: string): Promise<Task> => {
    return taskApi.update(id, { status: "draft", title: undefined });
  },

  getAssignableUsers: async (): Promise<AssignableUser[]> => {
    const res = await apiFetch<ApiListResponse<AssignableUser>>("/users/", { auth: true });
    if (!Array.isArray(res.results)) return [];
    return res.results.filter(
      (u) => u.role !== "citizen" && u.role !== "Citizen",
    );
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
};
