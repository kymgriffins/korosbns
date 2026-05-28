import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { CivicModule, ProgressRow } from "@/types/learn";
import type { ApiListResponse } from "@/types/api";

export function useCivicModules() {
  return useQuery({
    queryKey: ["civic-modules"],
    queryFn: () => apiFetch<ApiListResponse<CivicModule>>("/civic-modules/"),
    staleTime: 1000 * 60 * 60,
  });
}

export function useCivicModule(slug: string) {
  return useQuery({
    queryKey: ["civic-module", slug],
    queryFn: () => apiFetch<CivicModule>(`/civic-modules/${slug}/`),
    staleTime: 1000 * 60 * 60,
  });
}

export function useProgress() {
  return useQuery({
    queryKey: ["progress"],
    queryFn: () => apiFetch<{ progress: ProgressRow[] }>("/learn/profile/"),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCompleteChapter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chapterId: string) =>
      apiFetch<{ detail: string; module_completed: boolean; certificate_id?: string | null }>(
        `/civic-chapters/${chapterId}/complete/`,
        { method: "POST" },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["civic-modules"] });
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });
}

export function useMarkProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      content_type: string;
      content_id: string;
      progress_percent?: number;
    }) =>
      apiFetch("/learn/progress/", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });
}
