import { citizenApi, apiFetch } from "@/lib/api-client";
import type { WeeklyNoteApi, WeeklyNoteDetailApi } from "@/types/notes";
import type { Task, TaskDetail, TaskCreatePayload, TaskUpdatePayload } from "@/types/tasks";

function mapNoteToTask(note: WeeklyNoteApi): Task {
  return {
    id: note.id,
    week_label: note.week_label,
    title: note.title,
    content: note.content,
    status: note.status as Task["status"],
    author_name: note.author_name,
    created_at: note.created_at,
    updated_at: note.updated_at,
    due_date: note.due_date,
    assignee: note.assignee,
    assignee_name: note.assignee_name,
    assigned_team: note.assigned_team,
    team_name: note.team_name,
    hue: note.hue,
    due_label: note.due_label,
    section_count: note.section_count,
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
  body.content = payload.content;
  if (payload.status) body.status = payload.status;
  if (payload.due_date !== undefined) body.due_date = payload.due_date;
  if (payload.assignee !== undefined) body.assignee = payload.assignee;
  if (payload.assignee_name !== undefined) body.assignee_name = payload.assignee_name;
  if (payload.assigned_team !== undefined) body.assigned_team = payload.assigned_team;
  if (payload.hue !== undefined) body.hue = payload.hue;
  if (payload.due_label !== undefined) body.due_label = payload.due_label;
  return body;
}

export const taskApi = {
  list: async (): Promise<Task[]> => {
    const notes = await citizenApi.getWeeklyNotes();
    return notes.map(mapNoteToTask);
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
};
