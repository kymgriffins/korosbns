import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchTranscript, getTranscript } from "@/data/transcripts";

beforeEach(() => {
  vi.restoreAllMocks();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ text: "from network", start: 0, duration: 1 }],
    }),
  );
});

describe("transcripts (JSON-only)", () => {
  it("fetchTranscript returns seeded cues and never calls network fetch for known videos", async () => {
    const entries = await fetchTranscript("Ed9lP0-komE");
    expect(fetch).not.toHaveBeenCalled();
    expect(entries?.length).toBeGreaterThan(0);
    expect(entries?.[0]?.text).toMatch(/Budget|BPS|Before/i);
  });

  it("getTranscript returns JSON cues without network", () => {
    const entries = getTranscript("A_EXLueEMlk");
    expect(fetch).not.toHaveBeenCalled();
    expect(entries?.length).toBeGreaterThan(0);
  });

  it("fetchTranscript returns null for unknown id without network", async () => {
    const entries = await fetchTranscript("unknown-video-id");
    expect(fetch).not.toHaveBeenCalled();
    expect(entries).toBeNull();
  });
});
