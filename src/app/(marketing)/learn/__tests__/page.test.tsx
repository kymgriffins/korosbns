import { describe, it, expect, vi } from "vitest";

const mockRedirect = vi.fn();
vi.mock("next/navigation", () => ({
  redirect: (url: string) => mockRedirect(url),
}));

import LearnPage from "../page";

describe("LearnPage", () => {
  it("redirects users to /projects cleanly", async () => {
    await LearnPage({});
    expect(mockRedirect).toHaveBeenCalledWith("/projects");
  });

  it("redirects to /projects even if legacy tab parameter is passed", async () => {
    await LearnPage({ searchParams: Promise.resolve({ tab: "old" }) });
    expect(mockRedirect).toHaveBeenCalledWith("/projects");
  });
});
