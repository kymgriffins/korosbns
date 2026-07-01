import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SurveyListItemApi, SurveyDetailApi } from "@/lib/api-client";
import { surveyData } from "@/data/surveys";

export function useSurveys() {
  return useQuery({
    queryKey: ["surveys"],
    queryFn: () => surveyData.fetch() as Promise<SurveyListItemApi[]>,
  });
}

export function useSurvey(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["survey", id],
    queryFn: () => surveyData.fetchById(id as string) as Promise<SurveyDetailApi>,
    enabled: !!id && enabled,
  });
}

export function useSubmitSurvey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, answers }: { id: string; answers: Record<string, unknown> }) =>
      surveyData.submit(id, answers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
    },
  });
}
