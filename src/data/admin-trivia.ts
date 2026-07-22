import { adminTriviaApi } from "@/lib/admin-api";
import type { AdminTrivia, AdminTriviaDetail, AdminTriviaQuestion, AdminTriviaAttemptsPage, AdminTriviaAttemptDetail } from "@/lib/admin-api";
import { withFallback } from "@/data/adapter";

export type { AdminTrivia, AdminTriviaDetail, AdminTriviaQuestion, AdminTriviaAttemptsPage, AdminTriviaAttemptDetail };

let _trivia: AdminTrivia[] = [];

export const adminTriviaData = {
  get: () => _trivia,
  set: (items: AdminTrivia[]) => { _trivia = items; },
  fetch: (params?: { search?: string; status?: string; civic_module_id?: string }) =>
    withFallback(
      "admin-trivia",
      () => adminTriviaApi.list(params).then((r) => {
        const results = r.results ?? [];
        _trivia = results;
        return results;
      }),
      () => _trivia,
    ),
  fetchById: (id: string) =>
    withFallback(
      "admin-trivia",
      () => adminTriviaApi.get(id),
      () => _trivia.find((t) => t.id === id) ?? null,
    ),
  create: (data: { title: string; source_content_type?: string; points?: number; expiry_hours?: number }) =>
    withFallback(
      "admin-trivia",
      () => adminTriviaApi.create(data).then((r) => {
        _trivia.unshift({
          id: r.id,
          title: r.title,
          source_content_type: r.source_content_type,
          source_content_id: r.source_content_id,
          status: r.status,
          points: r.points,
          expiry_hours: r.expiry_hours,
          created_at: r.created_at,
          updated_at: r.updated_at,
        });
        return r;
      }),
      () => {
        const t: AdminTrivia = {
          id: `new-${Date.now()}`,
          title: data.title,
          source_content_type: data.source_content_type ?? "",
          source_content_id: "",
          status: "draft",
          points: data.points ?? 10,
          expiry_hours: data.expiry_hours ?? 72,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        _trivia.unshift(t);
        return t;
      },
    ),
  update: (id: string, data: { title?: string; points?: number; expiry_hours?: number }) =>
    withFallback(
      "admin-trivia",
      () => adminTriviaApi.update(id, data),
      () => {
        const idx = _trivia.findIndex((t) => t.id === id);
        if (idx !== -1) _trivia[idx] = { ..._trivia[idx], ...data };
        return _trivia[idx] ?? null;
      },
    ),
  delete: (id: string) =>
    withFallback(
      "admin-trivia",
      () => adminTriviaApi.delete(id).then(() => {
        _trivia = _trivia.filter((t) => t.id !== id);
      }),
      () => { _trivia = _trivia.filter((t) => t.id !== id); },
    ),
  publish: (id: string) =>
    withFallback(
      "admin-trivia",
      () => adminTriviaApi.publish(id),
      () => {
        const idx = _trivia.findIndex((t) => t.id === id);
        if (idx !== -1) _trivia[idx] = { ..._trivia[idx], status: "published" };
        return _trivia[idx] ?? null;
      },
    ),
  questions: {
    create: (triviaId: string, data: { question_text: string; options: string[]; correct_index?: number; explanation?: string }) =>
      withFallback(
        "admin-trivia",
        () => adminTriviaApi.createQuestion(triviaId, data),
        () => null,
      ),
    update: (triviaId: string, questionId: string, data: { question_text?: string; options?: string[]; correct_index?: number; explanation?: string }) =>
      withFallback(
        "admin-trivia",
        () => adminTriviaApi.updateQuestion(triviaId, questionId, data),
        () => null,
      ),
    delete: (triviaId: string, questionId: string) =>
      withFallback(
        "admin-trivia",
        () => adminTriviaApi.deleteQuestion(triviaId, questionId),
        () => {},
      ),
  },
  attempts: {
    list: (triviaId: string, page?: number) =>
      withFallback(
        "admin-trivia",
        () => adminTriviaApi.listAttempts(triviaId, page),
        () => ({ count: 0, page: 1, page_size: 20, results: [] }),
      ),
    get: (triviaId: string, attemptId: string) =>
      withFallback(
        "admin-trivia",
        () => adminTriviaApi.getAttempt(triviaId, attemptId),
        () => null,
      ),
  },
};
