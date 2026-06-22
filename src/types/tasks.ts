import type { NoteSectionApi, NoteAuditTrailApi } from "@/types/notes";

export type TaskStatus = "draft" | "audited" | "published";

export type ChecklistItem = {
  id: string;
  text: string;
  checked: boolean;
};

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
  assigned_team?: string | null;
  team_name?: string | null;
  hue?: string;
  due_label?: string;
  section_count?: number;
  progress?: number;
  checklist?: ChecklistItem[];
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
  assigned_team?: string | null;
  progress?: number;
  checklist?: ChecklistItem[];
  due_label?: string | null;
  hue?: string | null;
};

export type TaskUpdatePayload = Partial<TaskCreatePayload>;

export type TaskColumn = {
  id: TaskStatus;
  title: string;
  items: Task[];
};

export type AssignableUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  role: string;
  team?: string | null;
};

const TEAM_OPTIONS = ["MEDIA", "ICT", "MANAGERIAL"] as const;
export type AssignedTeam = (typeof TEAM_OPTIONS)[number];
export { TEAM_OPTIONS };

export const TEAM_HUES: Record<string, string> = {
  MEDIA: "#3b82f6",
  ICT: "#10b981",
  MANAGERIAL: "#8b5cf6",
};

export function autoHue(team?: string | null): string | undefined {
  if (team && TEAM_HUES[team]) return TEAM_HUES[team];
  return undefined;
}
