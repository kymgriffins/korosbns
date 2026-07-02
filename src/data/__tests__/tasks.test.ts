import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Task, TaskDetail } from "@/data/tasks";
import type { AdminNote } from "@/lib/admin-api";
import type { TaskCreatePayload } from "@/types/tasks";

vi.mock("@/lib/task-api", () => ({
  taskApi: {
    listAll: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    publish: vi.fn(),
    getAssignableUsers: vi.fn(),
    getWeeklyReport: vi.fn(),
  },
}));

vi.mock("@/lib/admin-api", () => ({
  adminNotesApi: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    publish: vi.fn(),
    audit: vi.fn(),
  },
}));

import { taskApi } from "@/lib/task-api";
import { adminNotesApi } from "@/lib/admin-api";
import { taskData } from "@/data/tasks";

const MOCK_TASK: Task = {
  id: "task-1",
  week_label: "Week 1",
  title: "Test task",
  status: "draft",
  author_name: "Alice",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
  priority: "medium",
};

const MOCK_DETAIL: TaskDetail = {
  ...MOCK_TASK,
  content: "Details",
  sections: [],
  audit_trails: [],
  checklist_items: [],
  attachments: [],
};

const MOCK_NOTE: AdminNote = {
  id: "note-1",
  title: "Test note",
  content: "Content",
  author_name: "Bob",
  status: "draft",
  is_public: false,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

beforeEach(() => {
  vi.clearAllMocks();
  taskData.tasks.set([]);
});

describe("taskData.tasks", () => {
  it("fetch returns tasks from API", async () => {
    vi.mocked(taskApi.listAll).mockResolvedValue([MOCK_TASK]);
    const result = await taskData.tasks.fetch();
    expect(taskApi.listAll).toHaveBeenCalled();
    expect(result).toEqual([MOCK_TASK]);
  });

  it("fetch returns cached tasks on API error", async () => {
    taskData.tasks.set([MOCK_TASK]);
    vi.mocked(taskApi.listAll).mockRejectedValue(new Error("fail"));
    const result = await taskData.tasks.fetch();
    expect(result).toEqual([MOCK_TASK]);
  });

  it("fetchById returns task detail from API", async () => {
    vi.mocked(taskApi.get).mockResolvedValue(MOCK_DETAIL);
    const result = await taskData.tasks.fetchById("task-1");
    expect(taskApi.get).toHaveBeenCalledWith("task-1");
    expect(result).toEqual(MOCK_DETAIL);
  });

  it("fetchById falls back to local cache on API error", async () => {
    vi.mocked(taskApi.get).mockRejectedValue(new Error("fail"));
    taskData.tasks.set([MOCK_TASK]);
    const result = await taskData.tasks.fetchById("task-1");
    expect(result.id).toBe("task-1");
  });

  it("create sends payload and returns new task", async () => {
    const payload: TaskCreatePayload = { week_label: "W1", title: "New task", content: "Details" };
    vi.mocked(taskApi.create).mockResolvedValue(MOCK_TASK);
    const result = await taskData.tasks.create(payload);
    expect(taskApi.create).toHaveBeenCalledWith(payload);
    expect(result?.title).toBe("Test task");
  });

  it("create rejects on API error", async () => {
    const payload: TaskCreatePayload = { week_label: "W1", title: "Offline task", content: "" };
    vi.mocked(taskApi.create).mockRejectedValue(new Error("fail"));
    await expect(taskData.tasks.create(payload)).rejects.toThrow("fail");
  });

  it("update sends payload and returns updated task", async () => {
    vi.mocked(taskApi.update).mockResolvedValue({ ...MOCK_TASK, title: "Updated" } as Task);
    const result = await taskData.tasks.update("task-1", { title: "Updated" });
    expect(taskApi.update).toHaveBeenCalledWith("task-1", { title: "Updated" });
    expect(result?.title).toBe("Updated");
  });

  it("update rejects on API error", async () => {
    taskData.tasks.set([MOCK_TASK]);
    vi.mocked(taskApi.update).mockRejectedValue(new Error("fail"));
    await expect(taskData.tasks.update("task-1", { title: "Local update" })).rejects.toThrow("fail");
  });

  it("delete calls API and returns true", async () => {
    vi.mocked(taskApi.delete).mockResolvedValue(undefined);
    const result = await taskData.tasks.delete("task-1");
    expect(taskApi.delete).toHaveBeenCalledWith("task-1");
    expect(result).toBe(true);
  });

  it("delete rejects on API error", async () => {
    taskData.tasks.set([MOCK_TASK]);
    vi.mocked(taskApi.delete).mockRejectedValue(new Error("fail"));
    await expect(taskData.tasks.delete("task-1")).rejects.toThrow("fail");
  });

  it("publish calls API and returns published task", async () => {
    vi.mocked(taskApi.publish).mockResolvedValue({ ...MOCK_TASK, status: "published" } as Task);
    const result = await taskData.tasks.publish("task-1");
    expect(taskApi.publish).toHaveBeenCalledWith("task-1", false, "");
  });

  it("publish rejects on API error", async () => {
    taskData.tasks.set([MOCK_TASK]);
    vi.mocked(taskApi.publish).mockRejectedValue(new Error("fail"));
    await expect(taskData.tasks.publish("task-1")).rejects.toThrow("fail");
  });
});

describe("taskData.users", () => {
  it("fetchAssignable returns users from API", async () => {
    const users = [{ id: "u1", email: "alice@test.com", first_name: "Alice", last_name: "", role: "editor" }];
    vi.mocked(taskApi.getAssignableUsers).mockResolvedValue(users);
    const result = await taskData.users.fetchAssignable();
    expect(taskApi.getAssignableUsers).toHaveBeenCalled();
    expect(result).toEqual(users);
  });

  it("fetchAssignable falls back to empty array on API error", async () => {
    vi.mocked(taskApi.getAssignableUsers).mockRejectedValue(new Error("fail"));
    const result = await taskData.users.fetchAssignable();
    expect(result).toEqual([]);
  });
});

describe("taskData.report", () => {
  it("fetch returns weekly report from API", async () => {
    const report = { total: 5, by_status: {}, by_team: {}, by_assignee: {}, avg_progress: 0.5, period: "current" };
    vi.mocked(taskApi.getWeeklyReport).mockResolvedValue(report);
    const result = await taskData.report.fetch("w1");
    expect(taskApi.getWeeklyReport).toHaveBeenCalledWith("w1");
    expect(result.total).toBe(5);
  });

  it("fetch falls back to local count on API error", async () => {
    vi.mocked(taskApi.getWeeklyReport).mockRejectedValue(new Error("fail"));
    const result = await taskData.report.fetch();
    expect(result.total).toBeGreaterThanOrEqual(0);
    expect(result.period).toBe("current");
  });
});

describe("taskData.notes", () => {
  it("fetch returns notes from API", async () => {
    vi.mocked(adminNotesApi.list).mockResolvedValue({ count: 1, results: [MOCK_NOTE] });
    const result = await taskData.notes.fetch();
    expect(adminNotesApi.list).toHaveBeenCalled();
    expect(result.results).toHaveLength(1);
  });

  it("fetch falls back to empty on API error", async () => {
    vi.mocked(adminNotesApi.list).mockRejectedValue(new Error("fail"));
    const result = await taskData.notes.fetch();
    expect(result.results).toEqual([]);
  });

  it("create sends payload and returns new note", async () => {
    vi.mocked(adminNotesApi.create).mockResolvedValue(MOCK_NOTE);
    const result = await taskData.notes.create({ title: "New note" });
    expect(adminNotesApi.create).toHaveBeenCalledWith({ title: "New note" });
    expect(result?.title).toBe("Test note");
  });

  it("create falls back to local note on API error", async () => {
    vi.mocked(adminNotesApi.create).mockRejectedValue(new Error("fail"));
    const result = await taskData.notes.create({ title: "Offline note" });
    expect(result?.id).toContain("new-");
  });

  it("update calls API and returns", async () => {
    vi.mocked(adminNotesApi.update).mockResolvedValue(MOCK_NOTE);
    const result = await taskData.notes.update("note-1", { title: "Updated" });
    expect(adminNotesApi.update).toHaveBeenCalledWith("note-1", { title: "Updated" });
  });

  it("delete calls API and returns true", async () => {
    vi.mocked(adminNotesApi.delete).mockResolvedValue(undefined);
    const result = await taskData.notes.delete("note-1");
    expect(adminNotesApi.delete).toHaveBeenCalledWith("note-1");
    expect(result).toBe(true);
  });

  it("publish calls API and returns", async () => {
    vi.mocked(adminNotesApi.publish).mockResolvedValue(MOCK_NOTE);
    const result = await taskData.notes.publish("note-1");
    expect(adminNotesApi.publish).toHaveBeenCalledWith("note-1");
  });

  it("audit calls API with id and notes", async () => {
    vi.mocked(adminNotesApi.audit).mockResolvedValue(MOCK_NOTE);
    const result = await taskData.notes.audit("note-1", "Audit trail");
    expect(adminNotesApi.audit).toHaveBeenCalledWith("note-1", "Audit trail");
  });
});
