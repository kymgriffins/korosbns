import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSendEmail = vi.fn();
const originalFetch = globalThis.fetch;

vi.mock("@/lib/services/email-sender", () => ({
  sendEmail: (...args: unknown[]) => mockSendEmail(...args),
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "http://localhost:8000");
  vi.stubEnv("EMAIL_HOOK_API_KEY", "");
  globalThis.fetch = vi.fn();
});

function mockFetchResponse(data: unknown, ok = true) {
  return Promise.resolve({
    ok,
    json: () => Promise.resolve(data),
  });
}

const MOCK_HOOK = {
  id: "hook-1",
  recipient: "user@test.com",
  subject: "Welcome",
  body_html: "<h1>Hi</h1>",
  body_text: "Hi",
  from_email: "noreply@test.com",
  source: "auth",
  metadata: {},
  status: "pending",
  created_at: "2026-06-12T00:00:00Z",
};

describe("fetchPendingHooks", () => {
  it("returns hooks when fetch succeeds", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      mockFetchResponse([MOCK_HOOK]),
    );

    const { fetchPendingHooks } = await import(
      "@/lib/services/email-hook-service"
    );
    const result = await fetchPendingHooks(5);

    expect(result).toEqual([MOCK_HOOK]);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/email-hooks/pending/?limit=5"),
      expect.objectContaining({ headers: {} }),
    );
  });

  it("returns empty array when fetch fails", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      mockFetchResponse(null, false),
    );

    const { fetchPendingHooks } = await import(
      "@/lib/services/email-hook-service"
    );
    const result = await fetchPendingHooks();

    expect(result).toEqual([]);
  });

  it("includes auth header when API key is set", async () => {
    vi.stubEnv("EMAIL_HOOK_API_KEY", "test-key-123");
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      mockFetchResponse([]),
    );

    const { fetchPendingHooks } = await import(
      "@/lib/services/email-hook-service"
    );
    await fetchPendingHooks();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: { "X-Email-Hook-Key": "test-key-123" },
      }),
    );
  });

  it("defaults to limit 10", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      mockFetchResponse([]),
    );

    const { fetchPendingHooks } = await import(
      "@/lib/services/email-hook-service"
    );
    await fetchPendingHooks();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("limit=10"),
      expect.any(Object),
    );
  });
});

describe("claimHook", () => {
  it("returns true on successful claim", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      mockFetchResponse({ status: "claimed" }),
    );

    const { claimHook } = await import("@/lib/services/email-hook-service");
    const result = await claimHook("hook-1");

    expect(result).toBe(true);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/email-hooks/hook-1/claim/"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ claimed_by: "nextjs-citizen-app" }),
      }),
    );
  });

  it("returns false when claim fails", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      mockFetchResponse({ error: "already claimed" }, false),
    );

    const { claimHook } = await import("@/lib/services/email-hook-service");
    const result = await claimHook("hook-1");

    expect(result).toBe(false);
  });
});

describe("markSent", () => {
  it("returns true on successful mark", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      mockFetchResponse({ status: "sent" }),
    );

    const { markSent } = await import("@/lib/services/email-hook-service");
    const result = await markSent("hook-1");

    expect(result).toBe(true);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/email-hooks/hook-1/sent/"),
      expect.objectContaining({ method: "POST" }),
    );
  });
});

describe("markFailed", () => {
  it("returns true on successful mark with error message", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      mockFetchResponse({ status: "failed" }),
    );

    const { markFailed } = await import(
      "@/lib/services/email-hook-service"
    );
    const result = await markFailed("hook-1", "SMTP rejected");

    expect(result).toBe(true);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/email-hooks/hook-1/failed/"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ error_message: "SMTP rejected" }),
      }),
    );
  });

  it("defaults error message when not provided", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      mockFetchResponse({ status: "failed" }),
    );

    const { markFailed } = await import(
      "@/lib/services/email-hook-service"
    );
    const result = await markFailed("hook-1");

    expect(result).toBe(true);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify({ error_message: "Unknown error" }),
      }),
    );
  });
});

describe("processHook", () => {
  it("claims, sends, and marks as sent on success", async () => {
    vi.mocked(globalThis.fetch)
      .mockResolvedValueOnce(mockFetchResponse({ status: "claimed" }))
      .mockResolvedValueOnce(mockFetchResponse({ status: "sent" }));
    mockSendEmail.mockResolvedValueOnce(undefined);

    const { processHook } = await import(
      "@/lib/services/email-hook-service"
    );
    await processHook(MOCK_HOOK);

    expect(mockSendEmail).toHaveBeenCalledWith({
      to: "user@test.com",
      subject: "Welcome",
      html: "<h1>Hi</h1>",
      text: "Hi",
      from: "noreply@test.com",
    });
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  it("does not send email if claim fails", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      mockFetchResponse({ error: "conflict" }, false),
    );

    const { processHook } = await import(
      "@/lib/services/email-hook-service"
    );
    await processHook(MOCK_HOOK);

    expect(mockSendEmail).not.toHaveBeenCalled();
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it("marks as failed if sending throws", async () => {
    vi.mocked(globalThis.fetch)
      .mockResolvedValueOnce(mockFetchResponse({ status: "claimed" }))
      .mockResolvedValueOnce(mockFetchResponse({ status: "failed" }));
    mockSendEmail.mockRejectedValueOnce(new Error("Connection timeout"));

    const { processHook } = await import(
      "@/lib/services/email-hook-service"
    );
    await processHook(MOCK_HOOK);

    expect(globalThis.fetch).toHaveBeenLastCalledWith(
      expect.stringContaining("/api/v1/email-hooks/hook-1/failed/"),
      expect.objectContaining({
        body: JSON.stringify({ error_message: "Connection timeout" }),
      }),
    );
  });

  it("marks failed with Unknown error if non-Error thrown", async () => {
    vi.mocked(globalThis.fetch)
      .mockResolvedValueOnce(mockFetchResponse({ status: "claimed" }))
      .mockResolvedValueOnce(mockFetchResponse({ status: "failed" }));
    mockSendEmail.mockRejectedValueOnce("string error");

    const { processHook } = await import(
      "@/lib/services/email-hook-service"
    );
    await processHook(MOCK_HOOK);

    expect(globalThis.fetch).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify({ error_message: "Unknown error" }),
      }),
    );
  });
});

describe("pollAndProcess", () => {
  it("fetches pending hooks and processes each one", async () => {
    const hooks = [
      { ...MOCK_HOOK, id: "hook-1", recipient: "a@test.com" },
      { ...MOCK_HOOK, id: "hook-2", recipient: "b@test.com" },
    ];

    vi.mocked(globalThis.fetch)
      .mockResolvedValueOnce(mockFetchResponse(hooks))
      .mockResolvedValueOnce(mockFetchResponse({ status: "claimed" }))
      .mockResolvedValueOnce(mockFetchResponse({ status: "sent" }))
      .mockResolvedValueOnce(mockFetchResponse({ status: "claimed" }))
      .mockResolvedValueOnce(mockFetchResponse({ status: "sent" }));
    mockSendEmail.mockResolvedValue(undefined);

    const { pollAndProcess } = await import(
      "@/lib/services/email-hook-service"
    );
    const count = await pollAndProcess();

    expect(count).toBe(2);
    expect(mockSendEmail).toHaveBeenCalledTimes(2);
  });

  it("returns 0 when no pending hooks", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      mockFetchResponse([]),
    );

    const { pollAndProcess } = await import(
      "@/lib/services/email-hook-service"
    );
    const count = await pollAndProcess();

    expect(count).toBe(0);
    expect(mockSendEmail).not.toHaveBeenCalled();
  });
});

afterAll(() => {
  globalThis.fetch = originalFetch;
});
