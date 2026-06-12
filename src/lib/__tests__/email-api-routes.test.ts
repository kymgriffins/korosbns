import { describe, it, expect, vi, beforeEach } from "vitest";

const mockPollAndProcess = vi.fn();
const mockSendEmail = vi.fn();

vi.mock("@/lib/services/email-hook-service", () => ({
  pollAndProcess: (...args: unknown[]) => mockPollAndProcess(...args),
}));

vi.mock("@/lib/services/email-sender", () => ({
  sendEmail: (...args: unknown[]) => mockSendEmail(...args),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/email-hooks/notify", () => {
  it("returns ok:true when poll succeeds", async () => {
    mockPollAndProcess.mockResolvedValueOnce(3);

    const { POST } = await import("@/app/api/email-hooks/notify/route");
    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ ok: true });
    expect(mockPollAndProcess).toHaveBeenCalledOnce();
  });

  it("returns 500 when poll throws", async () => {
    mockPollAndProcess.mockRejectedValueOnce(new Error("DB error"));

    const { POST } = await import("@/app/api/email-hooks/notify/route");
    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "DB error" });
  });

  it("returns 500 with Unknown error for non-Error throws", async () => {
    mockPollAndProcess.mockRejectedValueOnce("string error");

    const { POST } = await import("@/app/api/email-hooks/notify/route");
    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Unknown error" });
  });
});

describe("POST /api/email/send", () => {
  it("sends email with valid payload", async () => {
    mockSendEmail.mockResolvedValueOnce(undefined);

    const { POST } = await import("@/app/api/email/send/route");
    const req = new Request("http://localhost:3000/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "user@test.com",
        subject: "Test",
        html: "<h1>Hi</h1>",
        text: "Hi",
      }),
    });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ status: "sent" });
    expect(mockSendEmail).toHaveBeenCalledWith({
      to: "user@test.com",
      subject: "Test",
      html: "<h1>Hi</h1>",
      text: "Hi",
      from: undefined,
    });
  });

  it("returns 400 when to is missing", async () => {
    const { POST } = await import("@/app/api/email/send/route");
    const req = new Request("http://localhost:3000/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: "Test", text: "Hi" }),
    });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Missing required fields");
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("returns 400 when subject is missing", async () => {
    const { POST } = await import("@/app/api/email/send/route");
    const req = new Request("http://localhost:3000/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: "user@test.com", text: "Hi" }),
    });
    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it("returns 400 when both html and text are missing", async () => {
    const { POST } = await import("@/app/api/email/send/route");
    const req = new Request("http://localhost:3000/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: "user@test.com", subject: "Test" }),
    });
    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it("returns 500 when sendEmail throws", async () => {
    mockSendEmail.mockRejectedValueOnce(new Error("SMTP unavailable"));

    const { POST } = await import("@/app/api/email/send/route");
    const req = new Request("http://localhost:3000/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "user@test.com",
        subject: "Test",
        text: "Body",
      }),
    });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("SMTP unavailable");
  });
});
