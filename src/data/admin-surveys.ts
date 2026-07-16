import { adminSurveysApi } from "@/lib/admin-api";
import type {
  AdminSurvey,
  AdminSurveyDetail,
  AdminSurveyQuestion,
  AdminSurveyResults,
} from "@/lib/admin-api";
import type { ApiListResponse } from "@/types/api";
import { withFallback } from "@/data/adapter";

export type { AdminSurvey, AdminSurveyDetail, AdminSurveyQuestion, AdminSurveyResults };

let _surveys: AdminSurvey[] = [];

export const adminSurveysData = {
  get: () => _surveys,
  set: (items: AdminSurvey[]) => { _surveys = items; },
  fetch: (params?: { search?: string; status?: string }) =>
    withFallback(
      "admin-surveys",
      () => adminSurveysApi.list(params).then((r) => {
        const results = r.results ?? [];
        _surveys = results;
        return results;
      }),
      () => _surveys,
    ),
  fetchById: (id: string) =>
    withFallback(
      "admin-surveys",
      () => adminSurveysApi.get(id),
      () => _surveys.find((s) => s.id === id) ?? null,
    ),
  create: (data: { title: string; description?: string; starts_at?: string; ends_at?: string; allow_anonymous?: boolean }) =>
    withFallback(
      "admin-surveys",
      () => adminSurveysApi.create(data).then((r) => {
        _surveys.unshift({
          id: r.id,
          title: r.title,
          description: r.description,
          status: r.status,
          allow_anonymous: r.allow_anonymous,
          created_at: r.created_at,
          updated_at: r.updated_at,
        });
        return r;
      }),
      () => {
        const s: AdminSurvey = {
          id: `new-${Date.now()}`,
          title: data.title,
          description: data.description ?? "",
          status: "draft",
          allow_anonymous: data.allow_anonymous ?? false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        _surveys.unshift(s);
        return s;
      },
    ),
  update: (id: string, data: { title?: string; description?: string; status?: string }) =>
    withFallback(
      "admin-surveys",
      () => adminSurveysApi.update(id, data).then((r) => {
        const idx = _surveys.findIndex((s) => s.id === id);
        if (idx !== -1) _surveys[idx] = { ..._surveys[idx], ...r, id };
        return r;
      }),
      () => {
        const idx = _surveys.findIndex((s) => s.id === id);
        if (idx !== -1) _surveys[idx] = { ..._surveys[idx], ...data };
        return _surveys[idx] ?? null;
      },
    ),
  delete: (id: string) =>
    withFallback(
      "admin-surveys",
      () => adminSurveysApi.delete(id).then(() => {
        _surveys = _surveys.filter((s) => s.id !== id);
      }),
      () => { _surveys = _surveys.filter((s) => s.id !== id); },
    ),
  transition: (id: string, statusValue: string) =>
    withFallback(
      "admin-surveys",
      () => adminSurveysApi.transition(id, statusValue),
      () => null,
    ),
  questions: {
    create: (surveyId: string, data: { text: string; question_type: string; choices?: string[]; is_required?: boolean }) =>
      withFallback(
        "admin-surveys",
        () => adminSurveysApi.createQuestion(surveyId, data),
        () => null,
      ),
    update: (surveyId: string, questionId: string, data: { text?: string; choices?: string[]; is_required?: boolean }) =>
      withFallback(
        "admin-surveys",
        () => adminSurveysApi.updateQuestion(surveyId, questionId, data),
        () => null,
      ),
    delete: (surveyId: string, questionId: string) =>
      withFallback(
        "admin-surveys",
        () => adminSurveysApi.deleteQuestion(surveyId, questionId),
        () => {},
      ),
  },
  results: (id: string) =>
    withFallback(
      "admin-surveys",
      () => adminSurveysApi.results(id),
      () => ({ total_responses: 0, questions: [] } as AdminSurveyResults),
    ),
};
