import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

const mockRedirect = vi.fn();
vi.mock("next/navigation", () => ({
  redirect: (url: string) => mockRedirect(url),
}));

import TeamPage from "../page";

describe("TeamPage", () => {
  it("redirects to /about", () => {
    TeamPage();
    expect(mockRedirect).toHaveBeenCalledWith("/about");
  });
});
