import type { NoteSectionApi, NoteAuditTrailApi } from "@/types/notes";

export type TaskStatus = "draft" | "audited" | "published";

export type Task = {
  id: string;
  week_label: string;
  title: string;
  content?: string;
  status: TaskStatus;
  author_name: string;
  created_at: string;
  updated_at: string;
  due_date?: string | null;
  assignee?: string | null;
  assignee_name?: string | null;
  assigned_team?: string | null;
  team_name?: string | null;
  hue?: string;
  due_label?: string;
  section_count?: number;
};

export type TaskDetail = Task & {
  content: string;
  sections: NoteSectionApi[];
  audit_trails: NoteAuditTrailApi[];
  author_team?: string | null;
  team?: string | null;
  assignee_email?: string | null;
  assignee_avatar?: string | null;
};

export type TaskCreatePayload = {
  week_label: string;
  title: string;
  content: string;
  status?: TaskStatus;
  due_date?: string | null;
  assignee?: string | null;
  assignee_name?: string | null;
  assigned_team?: string | null;
  hue?: string | null;
  due_label?: string | null;
};

export type TaskUpdatePayload = Partial<TaskCreatePayload>;

export type TaskColumn = {
  id: TaskStatus;
  title: string;
  items: Task[];
};
