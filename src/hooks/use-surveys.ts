import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { citizenApi } from "@/lib/api-client";
import type { SurveyListItemApi, SurveyDetailApi } from "@/lib/api-client";

export function useSurveys() {
  return useQuery({
    queryKey: ["surveys"],
    queryFn: async () => {
      const data = await citizenApi.getSurveys();
      return (data.results ?? []) as SurveyListItemApi[];
    },
  });
}

export function useSurvey(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["survey", id],
    queryFn: () => citizenApi.getSurvey(id as string) as Promise<SurveyDetailApi>,
    enabled: !!id && enabled,
  });
}

export function useSubmitSurvey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, answers }: { id: string; answers: Record<string, unknown> }) =>
      citizenApi.submitSurvey(id, answers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
    },
  });
}
