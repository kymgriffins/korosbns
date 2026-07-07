export const LmsRoutes = {
  home: "/learn",
  catalogue: "/learn/catalogue",
  progress: "/learn/progress",
  achievements: "/learn/achievements",
  profile: "/learn/profile",
  search: "/learn/search",
  course: (courseSlug: string) => `/learn/courses/${courseSlug}`,
  module: (courseSlug: string, moduleSlug: string) =>
    `/learn/courses/${courseSlug}/modules/${moduleSlug}`,
  lesson: (courseSlug: string, moduleSlug: string, lessonSlug: string) =>
    `/learn/courses/${courseSlug}/modules/${moduleSlug}/lessons/${lessonSlug}`,
} as const;
