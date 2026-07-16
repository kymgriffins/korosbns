import { adminCoursesApi } from "@/lib/admin-api";
import type { AdminCourseListItem, AdminCourseDetail, AdminCourseWrite } from "@/lib/admin-api";
import { withFallback } from "@/data/adapter";

export type { AdminCourseListItem, AdminCourseDetail };

let _courses: AdminCourseListItem[] = [];

export const adminCoursesData = {
  get: () => _courses,
  set: (items: AdminCourseListItem[]) => { _courses = items; },
  fetch: () =>
    withFallback(
      "admin-courses",
      () => adminCoursesApi.list().then((r) => {
        const results = r.results ?? [];
        _courses = results;
        return results;
      }),
      () => _courses,
    ),
  fetchById: (id: string) =>
    withFallback(
      "admin-courses",
      () => adminCoursesApi.get(id),
      () => null,
    ),
  create: (data: AdminCourseWrite) =>
    withFallback(
      "admin-courses",
      () => adminCoursesApi.create(data),
      () => ({
        id: `new-${Date.now()}`,
        module_code: data.module_code ?? "",
        title: data.title,
        slug: data.slug ?? `untitled-${Date.now()}`,
        state: "draft",
        lesson_count: 0,
      }),
    ),
  update: (id: string, data: Partial<AdminCourseWrite>) =>
    withFallback(
      "admin-courses",
      () => adminCoursesApi.update(id, data as AdminCourseWrite),
      () => null,
    ),
};
