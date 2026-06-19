import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchGamificationMe,
  postGamificationEvent,
  submitChallenge,
  fetchCertificates,
  issueCertificate,
} from "@/lib/gamification";
import { apiFetch } from "@/lib/api-client";

vi.mock("@/lib/api-client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api-client")>();
  return {
    ...actual,
    apiFetch: vi.fn().mockResolvedValue({}),
  };
});

function lastAuthFlag(): boolean | undefined {
  const lastCall = vi.mocked(apiFetch).mock.calls.at(-1);
  return (lastCall?.[1] as { auth?: boolean } | undefined)?.auth;
}

beforeEach(() => {
  vi.mocked(apiFetch).mockClear();
});

describe("gamification authenticated endpoints", () => {
  it("fetchGamificationMe uses auth:true", async () => {
    await fetchGamificationMe();
    expect(lastAuthFlag()).toBe(true);
  });

  it("postGamificationEvent uses auth:true", async () => {
    await postGamificationEvent({
      event_type: "test",
      idempotency_key: "k1",
    });
    expect(lastAuthFlag()).toBe(true);
  });

  it("submitChallenge uses auth:true", async () => {
    await submitChallenge("c1");
    expect(lastAuthFlag()).toBe(true);
  });

  it("fetchCertificates uses auth:true", async () => {
    await fetchCertificates();
    expect(lastAuthFlag()).toBe(true);
  });

  it("issueCertificate uses auth:true", async () => {
    await issueCertificate("mod-1");
    expect(lastAuthFlag()).toBe(true);
  });
});
