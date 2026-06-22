import { citizenApi, apiFetch } from "@/lib/api-client";
import type { WeeklyNoteApi, WeeklyNoteCreateApi } from "@/types/notes";
import type { Task, TaskCreatePayload, TaskUpdatePayload } from "@/types/tasks";

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
  };
}

export const taskApi = {
  list: async (): Promise<Task[]> => {
    const res = await citizenApi.getMyNotes();
    return res.results.map(mapNoteToTask);
  },

  getPublic: async (): Promise<Task[]> => {
    const res = await citizenApi.getWeeklyNotes();
    return res.results.map(mapNoteToTask);
  },

  get: async (id: string): Promise<Task> => {
    const notes = await citizenApi.getMyNotes();
    const note = notes.results.find((n) => n.id === id);
    if (!note) throw new Error("Task not found");
    return mapNoteToTask(note);
  },

  create: async (payload: TaskCreatePayload): Promise<Task> => {
    const body: WeeklyNoteCreateApi = {
      week_label: payload.week_label,
      title: payload.title,
      content: payload.content,
    };
    const note = await citizenApi.createWeeklyNote(body);
    return mapNoteToTask(note);
  },

  update: async (id: string, payload: TaskUpdatePayload): Promise<Task> => {
    const body: Partial<WeeklyNoteCreateApi> = {};
    if (payload.week_label !== undefined) body.week_label = payload.week_label;
    if (payload.title !== undefined) body.title = payload.title;
    if (payload.content !== undefined) body.content = payload.content;
    const note = await citizenApi.updateWeeklyNote(id, body);
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
