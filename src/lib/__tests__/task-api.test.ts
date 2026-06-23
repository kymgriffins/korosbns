import { describe, it, expect, vi, beforeEach } from "vitest";
import { parseChecklist, encodeChecklist, taskApi } from "@/lib/task-api";
import { citizenApi } from "@/lib/api-client";

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
    const items = [
      { id: "1", text: "Do this", checked: false },
    ];
    const result = encodeChecklist("Note body", items);
    const parsed = JSON.parse(result);
    expect(parsed.__text__).toBe("Note body");
    expect(parsed.__checklist__).toHaveLength(1);
    expect(parsed.__checklist__[0].text).toBe("Do this");
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
      { id: "1", text: "Step one", checked: false },
      { id: "2", text: "Step two", checked: true },
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
    expect(task.checklist![0].text).toBe("Step one");
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
      assignee: "assignee-1",
      assigned_team: "team-1",
    });

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
