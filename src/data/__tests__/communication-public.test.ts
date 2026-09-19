import { beforeEach, describe, expect, it, vi } from "vitest";
import { citizenApi } from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({
  citizenApi: {
    submitContact: vi.fn(),
  },
}));

import { communicationData } from "@/data/communication";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("communicationData public contact", () => {
  it("submits a public message through the canonical API client", async () => {
    const payload = {
      name: "Amina",
      email: "amina@example.com",
      message: "Programme partnership inquiry",
      source: "marketing-contact",
    };
    vi.mocked(citizenApi.submitContact).mockResolvedValue({ id: "message-1" });

    await expect(communicationData.publicContact.submit(payload)).resolves.toEqual({
      id: "message-1",
    });
    expect(citizenApi.submitContact).toHaveBeenCalledWith(payload);
  });
});
