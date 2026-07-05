import { z } from "zod";

export const taskStatusSchema = z.enum(["draft", "audited", "published"]);
export const taskPrioritySchema = z.enum(["low", "medium", "high", "urgent"]);
export const taskTagSchema = z.enum([
  "feature", "bug", "improvement", "research", "documentation",
  "design", "testing", "devops", "meeting", "review",
]);

export const taskCreateSchema = z.object({
  week_label: z.string().min(1, "Week label is required"),
  title: z.string().trim().min(1, "Title is required"),
  content: z.string().optional().default(""),
  notes: z.string().optional(),
  status: taskStatusSchema.optional().default("draft"),
  due_date: z.string().nullable().optional(),
  assignee: z.string().nullable().optional(),
  assigned_team: z.string().nullable().optional(),
  progress: z.number().min(0).max(100).optional().default(0),
  due_label: z.string().nullable().optional(),
  priority: taskPrioritySchema.optional().default("medium"),
  tag: taskTagSchema.optional(),
});

export type TaskCreateFormValues = z.infer<typeof taskCreateSchema>;

export const TASK_FIELD_LABELS: Record<string, string> = {
  week_label: "Week Label",
  title: "Title",
  content: "Description",
  notes: "Meeting Notes",
  status: "Status",
  due_date: "Due Date",
  assignee: "Assignee",
  assigned_team: "Assigned Team",
  progress: "Progress",
  due_label: "Due Label",
  checklist: "Checklist",
};
