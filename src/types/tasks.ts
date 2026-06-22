export type TaskStatus = "draft" | "audited" | "published";

export type Task = {
  id: string;
  week_label: string;
  title: string;
  content: string;
  status: TaskStatus;
  author_name: string;
  created_at: string;
  updated_at: string;
};

export type TaskCreatePayload = {
  week_label: string;
  title: string;
  content: string;
};

export type TaskUpdatePayload = Partial<TaskCreatePayload>;

export type TaskColumn = {
  id: TaskStatus;
  title: string;
  items: Task[];
};
