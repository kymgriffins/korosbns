import { describe, it, expect, vi } from "vitest";

const mockRedirect = vi.fn();
vi.mock("next/navigation", () => ({
  redirect: (url: string) => mockRedirect(url),
}));

import LearnModulesListPage from "../page";

describe("LearnModulesListPage", () => {
  it("redirects to /learn", () => {
    LearnModulesListPage();
    expect(mockRedirect).toHaveBeenCalledWith("/learn");
  });
});
