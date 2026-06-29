import type { SurveyListItemApi, SurveyDetailApi } from "@/lib/api-client";
import { citizenApi } from "@/lib/api-client";
import { withFallback } from "@/data/adapter";

export type { SurveyListItemApi, SurveyDetailApi };

const DEFAULT_SURVEYS: SurveyListItemApi[] = [];

let _surveys: SurveyListItemApi[] = [...DEFAULT_SURVEYS];

export const surveyData = {
  get: () => _surveys,
  set: (items: SurveyListItemApi[]) => { _surveys = items; },
  fetch: () =>
    withFallback(
      "surveys",
      () => citizenApi.getSurveys(),
      () => ({ results: _surveys }),
    ).then((r) => r.results ?? []),
  fetchById: (id: string) =>
    withFallback(
      "surveys",
      () => citizenApi.getSurvey(id),
      () => null as unknown as SurveyDetailApi,
    ),
  submit: (id: string, answers: Record<string, unknown>) =>
    citizenApi.submitSurvey(id, answers),
};
