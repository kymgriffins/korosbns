import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

vi.mock("@/data/marketing", () => ({
  marketingData: {
    articlesMarquee: { fetch: vi.fn() },
    campaigns: { fetch: vi.fn() },
  },
}));

import { marketingData } from "@/data/marketing";
import { useArticlesMarquee, useCampaigns } from "@/hooks/use-marketing";

function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useArticlesMarquee", () => {
  it("calls marketingData.articlesMarquee.fetch and returns wrapped results", async () => {
    const mockResults = [{ id: "1", title: "Article 1" }];
    vi.mocked(marketingData.articlesMarquee.fetch).mockResolvedValue(mockResults as any);

    const { result } = renderHook(() => useArticlesMarquee(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(marketingData.articlesMarquee.fetch).toHaveBeenCalled();
    expect(result.current.data).toEqual({ results: mockResults });
  });
});

describe("useCampaigns", () => {
  it("calls marketingData.campaigns.fetch and returns wrapped data", async () => {
    const mockCampaignData = [{ id: "1", name: "Campaign 1" }];
    vi.mocked(marketingData.campaigns.fetch).mockResolvedValue(mockCampaignData as any);

    const { result } = renderHook(() => useCampaigns(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(marketingData.campaigns.fetch).toHaveBeenCalled();
    expect(result.current.data).toEqual({ success: true, data: mockCampaignData });
  });
});
