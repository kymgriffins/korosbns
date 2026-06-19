import { citizenApi } from "@/lib/api-client";

export function fetchSurveys() {
  return citizenApi.getSurveys();
}

export function fetchSurvey(id: string) {
  return citizenApi.getSurvey(id);
}

export function submitSurvey(id: string, answers: Record<string, unknown>) {
  return citizenApi.submitSurvey(id, answers);
}
