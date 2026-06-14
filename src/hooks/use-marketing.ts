import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { buildApiUrl, resolveAppUrl } from "@/lib/api-url";
import type { ApiListResponse } from "@/types/api";
import type { Campaign } from "@/lib/campaign/types";

type ForexResponse = { usd_kes: number };
type OpenExchangeResponse = { rates: Record<string, number> };
type ArticleResponse = ApiListResponse<Record<string, unknown>>;
type CampaignsResponse = { success: boolean; data: Campaign[] };
type CohortImage = { src: string; alt: string; width: number; height: number };
type CohortImagesResponse = { images: CohortImage[] };
type YouTubeVideosResponse = { videos: Record<string, unknown>[] };

export function useArticlesMarquee(): UseQueryResult<ArticleResponse, Error> {
  return useQuery({
    queryKey: ["articles-marquee"],
    queryFn: async () => {
      const response = await fetch(buildApiUrl("/content/articles/"), {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Failed to fetch articles");
      return response.json() as Promise<ArticleResponse>;
    },
  });
}

export function useForexRate(): UseQueryResult<ForexResponse, Error> {
  return useQuery({
    queryKey: ["forex-usd-kes"],
    queryFn: async () => {
      const response = await fetch(resolveAppUrl("/api/forex/usd-kes/"), {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Failed to fetch forex rate");
      return response.json() as Promise<ForexResponse>;
    },
  });
}

export function useOpenExchangeRate(): UseQueryResult<OpenExchangeResponse, Error> {
  return useQuery({
    queryKey: ["open-exchange-rate"],
    queryFn: async () => {
      const response = await fetch("https://open.er-api.com/v6/latest/USD");
      if (!response.ok) throw new Error("Failed to fetch exchange rate");
      return response.json() as Promise<OpenExchangeResponse>;
    },
    staleTime: 1000 * 60 * 60,
  });
}

export function useCohortImages(): UseQueryResult<CohortImagesResponse, Error> {
  return useQuery({
    queryKey: ["cohort-images"],
    queryFn: async () => {
      const res = await fetch("/api/images/cohort");
      if (!res.ok) throw new Error("Failed to fetch cohort images");
      return res.json() as Promise<CohortImagesResponse>;
    },
  });
}

export function useCampaigns(): UseQueryResult<CampaignsResponse, Error> {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const res = await fetch("/api/campaigns");
      if (!res.ok) throw new Error("Failed to fetch campaigns");
      return res.json() as Promise<CampaignsResponse>;
    },
  });
}

export function useYouTubeVideos(): UseQueryResult<YouTubeVideosResponse, Error> {
  return useQuery({
    queryKey: ["youtube-videos"],
    queryFn: async () => {
      const response = await fetch(resolveAppUrl("/api/youtube"));
      if (!response.ok) throw new Error("Failed to fetch YouTube videos");
      return response.json() as Promise<YouTubeVideosResponse>;
    },
  });
}

export function useSubmitContact(): UseQueryResult<null, Error> {
  return useQuery({
    queryKey: ["submit-contact"],
    queryFn: async () => null,
    enabled: false,
  });
}