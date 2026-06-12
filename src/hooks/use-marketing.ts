import { useQuery } from "@tanstack/react-query";
import { buildApiUrl, resolveAppUrl } from "@/lib/api-url";

export function useArticlesMarquee() {
  return useQuery({
    queryKey: ["articles-marquee"],
    queryFn: async () => {
      const response = await fetch(buildApiUrl("/content/articles/"), {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Failed to fetch articles");
      return (await response.json()) as any;
    },
  });
}

export function useForexRate() {
  return useQuery({
    queryKey: ["forex-usd-kes"],
    queryFn: async () => {
      const response = await fetch(resolveAppUrl("/api/forex/usd-kes/"), {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Failed to fetch forex rate");
      return (await response.json()) as any;
    },
  });
}

export function useOpenExchangeRate() {
  return useQuery({
    queryKey: ["open-exchange-rate"],
    queryFn: async () => {
      const response = await fetch("https://open.er-api.com/v6/latest/USD");
      if (!response.ok) throw new Error("Failed to fetch exchange rate");
      return (await response.json()) as any;
    },
    staleTime: 1000 * 60 * 60,
  });
}

export function useCohortImages() {
  return useQuery({
    queryKey: ["cohort-images"],
    queryFn: async () => {
      const res = await fetch("/api/images/cohort");
      if (!res.ok) throw new Error("Failed to fetch cohort images");
      return (await res.json()) as any;
    },
  });
}

export function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const res = await fetch("/api/campaigns");
      if (!res.ok) throw new Error("Failed to fetch campaigns");
      return (await res.json()) as any;
    },
  });
}

export function useYouTubeVideos() {
  return useQuery({
    queryKey: ["youtube-videos"],
    queryFn: async () => {
      const response = await fetch(resolveAppUrl("/api/youtube"));
      if (!response.ok) throw new Error("Failed to fetch YouTube videos");
      return (await response.json()) as any;
    },
  });
}

export function useSubmitContact() {
  return useQuery({
    queryKey: ["submit-contact"],
    queryFn: async () => null as any,
    enabled: false,
  });
}
