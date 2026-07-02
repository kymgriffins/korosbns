import type {
  NoteSectionApi, NoteAuditTrailApi,
  TaskAttachmentApi, ChecklistItemApi, ChecklistItemAttachmentApi,
} from "@/types/notes";

export type TaskStatus = "draft" | "audited" | "published";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type TaskTag =
  | "feature"
  | "bug"
  | "improvement"
  | "research"
  | "documentation"
  | "design"
  | "testing"
  | "devops"
  | "meeting"
  | "review";

export type KanbanColumn = "ideas" | "planned" | "building" | "qa" | "shipped";

export type ChecklistItemStatus = "todo" | "in_progress" | "blocked" | "done";

export type ChecklistItem = {
  id: string;
  title: string;
  text: string;
  checked: boolean;
  status?: ChecklistItemStatus;
  description_text?: string;
  description_json?: Record<string, unknown>;
  assignee?: string | null;
  assignee_name?: string | null;
  due_date?: string | null;
  priority?: TaskPriority;
  progress?: number;
  sort_order?: number;
  attachment_count?: number;
  attachments?: ChecklistItemAttachment[];
};

export type ChecklistItemAttachment = {
  id: string;
  url: string;
  file_name: string;
  file_size: number;
  content_type: string;
  is_image: boolean;
  uploaded_by_name?: string;
  created_at: string;
};

export type TaskAttachment = {
  id: string;
  url: string;
  file_name: string;
  file_size: number;
  content_type: string;
  is_image: boolean;
  uploaded_by_name?: string;
  created_at: string;
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
  priority?: TaskPriority;
  tag?: TaskTag;
  scheduled_time?: string | null;
  kanban_column?: KanbanColumn;
  owner_name?: string;
  owner_tone?: string;
};

export type TaskDetail = Task & {
  content: string;
  notes?: string;
  sections: NoteSectionApi[];
  audit_trails: NoteAuditTrailApi[];
  checklist_items?: ChecklistItemApi[];
  attachments?: TaskAttachment[];
  author_team?: string | null;
  team?: string | null;
  assignee_email?: string | null;
  assignee_avatar?: string | null;
};

export type TaskCreatePayload = {
  week_label: string;
  title: string;
  content: string;
  notes?: string;
  status?: TaskStatus;
  due_date?: string | null;
  assignee?: string | null;
  assigned_team?: string | null;
  progress?: number;
  checklist?: ChecklistItem[];
  due_label?: string | null;
  hue?: string | null;
  priority?: TaskPriority;
  tag?: TaskTag;
  scheduled_time?: string | null;
  kanban_column?: KanbanColumn;
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
  team?: {
    slug: string;
    name: string;
    color: string;
  } | null;
};

export type AssignableTeam = {
  id: string;
  name: string;
  slug?: string;
  color?: string;
};

const TEAM_OPTIONS = ["MEDIA", "ICT", "MANAGERIAL"] as const;
export type AssignedTeam = (typeof TEAM_OPTIONS)[number];
export { TEAM_OPTIONS };

export type WeeklyReportData = {
  total: number;
  by_status: Record<string, number>;
  by_team: Record<string, { name: string; color: string; count: number }>;
  by_assignee: Record<string, number>;
  avg_progress: number;
  period: string;
};

const TEAM_HUES: Record<string, string> = {
  MEDIA: "#3b82f6",
  ICT: "#10b981",
  MANAGERIAL: "#8b5cf6",
};

export const PRIORITY_ORDER: TaskPriority[] = ["urgent", "high", "medium", "low"];

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const TAG_LABELS: Record<TaskTag, string> = {
  feature: "Feature",
  bug: "Bug",
  improvement: "Improvement",
  research: "Research",
  documentation: "Documentation",
  design: "Design",
  testing: "Testing",
  devops: "DevOps",
  meeting: "Meeting",
  review: "Review",
};

export function autoHue(team?: string | null): string | undefined {
  if (team && TEAM_HUES[team]) return TEAM_HUES[team];
  return undefined;
}
