import { describe, it, expect, vi, beforeEach } from "vitest";
import { parseChecklist, encodeChecklist, buildPatchBody, taskApi } from "@/lib/task-api";
import type { ChecklistItem } from "@/types/tasks";
import { apiFetch, citizenApi } from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({
  citizenApi: {
    getWeeklyNotes: vi.fn(),
    createWeeklyNote: vi.fn(),
    updateWeeklyNote: vi.fn(),
    auditWeeklyNote: vi.fn(),
    publishWeeklyNote: vi.fn(),
  },
  apiFetch: vi.fn(),
}));

describe("parseChecklist", () => {
  it("returns empty for undefined content", () => {
    const result = parseChecklist(undefined);
    expect(result.clean).toBe("");
    expect(result.checklist).toEqual([]);
  });

  it("returns empty for non-JSON content", () => {
    const result = parseChecklist("Just plain text content");
    expect(result.clean).toBe("Just plain text content");
    expect(result.checklist).toEqual([]);
  });

  it("extracts checklist from JSON content", () => {
    const content = JSON.stringify({
      __checklist__: [
        { id: "1", text: "Task one", checked: false },
        { id: "2", text: "Task two", checked: true },
      ],
      __text__: "Description text",
    });
    const result = parseChecklist(content);
    expect(result.clean).toBe("Description text");
    expect(result.checklist).toHaveLength(2);
    expect(result.checklist[0].text).toBe("Task one");
    expect(result.checklist[0].checked).toBe(false);
    expect(result.checklist[1].text).toBe("Task two");
    expect(result.checklist[1].checked).toBe(true);
  });

  it("normalizes legacy items with text-only to title", () => {
    const content = JSON.stringify({
      __checklist__: [{ id: "1", text: "Legacy item", checked: true }],
      __text__: "Body",
    });
    const result = parseChecklist(content);
    expect(result.checklist[0].title).toBe("Legacy item");
    expect(result.checklist[0].text).toBe("Legacy item");
    expect(result.checklist[0].checked).toBe(true);
    expect(result.checklist[0].status).toBe("done");
  });

  it("handles JSON without checklist key", () => {
    const content = JSON.stringify({ key: "value" });
    const result = parseChecklist(content);
    expect(result.clean).toBe(content);
    expect(result.checklist).toEqual([]);
  });
});

describe("encodeChecklist", () => {
  it("returns plain text when no checklist", () => {
    const result = encodeChecklist("Hello world");
    expect(result).toBe("Hello world");
  });

  it("returns plain text when checklist is empty", () => {
    const result = encodeChecklist("Hello", []);
    expect(result).toBe("Hello");
  });

  it("encodes text with checklist as JSON", () => {
    const items: ChecklistItem[] = [
      { id: "1", title: "Do this", text: "Do this", checked: false, status: "todo", sort_order: 0 },
    ];
    const result = encodeChecklist("Note body", items);
    const parsed = JSON.parse(result);
    expect(parsed.__text__).toBe("Note body");
    expect(parsed.__checklist__).toHaveLength(1);
    expect(parsed.__checklist__[0].text).toBe("Do this");
  });
});

describe("buildPatchBody", () => {
  it("only includes defined fields for partial updates", () => {
    expect(buildPatchBody({ status: "published" })).toEqual({ status: "published" });
    expect(buildPatchBody({ kanban_column: "building" })).toEqual({ kanban_column: "building" });
  });

  it("does not send undefined title or content on status-only patch", () => {
    const body = buildPatchBody({ status: "draft" });
    expect(body).not.toHaveProperty("title");
    expect(body).not.toHaveProperty("content");
    expect(body).not.toHaveProperty("week_label");
  });

  it("includes content when explicitly provided", () => {
    const body = buildPatchBody({ content: "Updated body" });
    expect(body.content).toBe("Updated body");
  });
});

describe("taskApi.create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a note with title and content", async () => {
    vi.mocked(citizenApi.createWeeklyNote).mockResolvedValue({
      id: "note-1",
      title: "Test Task",
      week_label: "W26-2026",
      content: "Test content",
      status: "draft",
      author_name: "User",
      created_at: "2026-06-22T00:00:00Z",
      updated_at: "2026-06-22T00:00:00Z",
    });

    const task = await taskApi.create({
      title: "Test Task",
      week_label: "W26-2026",
      content: "Test content",
    });

    expect(task.title).toBe("Test Task");
    expect(task.content).toBe("Test content");
    expect(citizenApi.createWeeklyNote).toHaveBeenCalledOnce();
  });

  it("creates a note with checklist items", async () => {
    const checklist = [
      { id: "1", title: "Step one", text: "Step one", checked: false },
      { id: "2", title: "Step two", text: "Step two", checked: true },
    ];

    vi.mocked(citizenApi.createWeeklyNote).mockImplementation(
      async (data: any) => {
        const parsed = parseChecklist(data?.content);
        return {
          id: "note-2",
          title: "Checklist Task",
          week_label: "W26-2026",
          content: data?.content ?? "",
          status: "draft",
          author_name: "User",
          created_at: "2026-06-22T00:00:00Z",
          updated_at: "2026-06-22T00:00:00Z",
          progress: 50,
        };
      },
    );

    const task = await taskApi.create({
      title: "Checklist Task",
      week_label: "W26-2026",
      content: "Description",
      checklist,
    });

    const body = vi.mocked(citizenApi.createWeeklyNote).mock.calls[0][0] as any;
    expect(body.content).toContain("__checklist__");
    expect(JSON.parse(body.content).__checklist__).toHaveLength(2);

    expect(task.checklist).toBeDefined();
    expect(task.checklist).toHaveLength(2);
    expect(task.checklist![0].title).toBe("Step one");
    expect(task.checklist![1].checked).toBe(true);
    expect(task.progress).toBe(50);
  });

  it("passes assignee and team fields", async () => {
    vi.mocked(citizenApi.createWeeklyNote).mockResolvedValue({
      id: "note-3",
      title: "Assigned Task",
      week_label: "W26-2026",
      content: "",
      status: "draft",
      author_name: "User",
      assignee: "assignee-1",
      assigned_team: "team-1",
      created_at: "2026-06-22T00:00:00Z",
      updated_at: "2026-06-22T00:00:00Z",
    });

    const task = await taskApi.create({
      title: "Assigned Task",
      week_label: "W26-2026",
      content: "",
      assignee: "2e4f6e08-04d9-4d85-b78e-bd2c3dc87fd5",
      assigned_team: "f07134ab-cce5-48e6-8b28-e92d4394c6ba",
    });

    const body = vi.mocked(citizenApi.createWeeklyNote).mock.calls[0][0] as any;
    expect(body.assignee).toBe("2e4f6e08-04d9-4d85-b78e-bd2c3dc87fd5");
    expect(body.assigned_team).toBe("f07134ab-cce5-48e6-8b28-e92d4394c6ba");
    expect(task.assignee).toBe("assignee-1");
    expect(task.assigned_team).toBe("team-1");
  });

  it("creates a note with due_date and due_label", async () => {
    vi.mocked(citizenApi.createWeeklyNote).mockResolvedValue({
      id: "note-4",
      title: "Due Task",
      week_label: "W26-2026",
      content: "",
      status: "draft",
      author_name: "User",
      due_date: "2026-07-01",
      due_label: "Next week",
      created_at: "2026-06-22T00:00:00Z",
      updated_at: "2026-06-22T00:00:00Z",
    });

    const task = await taskApi.create({
      title: "Due Task",
      week_label: "W26-2026",
      content: "",
      due_date: "2026-07-01",
      due_label: "Next week",
    });

    expect(task.due_date).toBe("2026-07-01");
    expect(task.due_label).toBe("Next week");
  });
});

describe("taskApi.getTeams", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns team IDs from API response", async () => {
    vi.mocked(apiFetch).mockResolvedValue({
      results: [
        { id: "team-uuid-1", name: "MEDIA", slug: "media", color: "#3b82f6" },
      ],
    } as any);
    const teams = await taskApi.getTeams();
    expect(teams).toEqual([{ id: "team-uuid-1", name: "MEDIA", slug: "media", color: "#3b82f6" }]);
  });
});
