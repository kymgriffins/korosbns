export function budgetNewsModulePath(slug: string) {
    return `/budgetnews/${slug}`;
}

export function budgetNewsChapterPath(slug: string, chapterSlug: string) {
    return `/budgetnews/${slug}/${chapterSlug}`;
}

export const Routes = {
    Home: "/",
    
    Research: "/about",
    Careers: "/about",
    FAQ: "/faq",
    Contact: "/contact",
    JoinUs: "/auth/register",

    Difference: "/#difference",
    Workflow: "/#workflow",
    Capabilities: "/#capabilities",
    Integrations: "/#integrations",
    Membership: "/#membership",

    Learn: "/learn",
    LearnCatalogue: "/learn/catalogue",
    LearnProgress: "/learn/progress",
    LearnAchievements: "/learn/achievements",
    LearnSearch: "/learn/search",
    LearnCourse: (slug: string) => `/learn/courses/${slug}`,
    LearnModule: (courseSlug: string, moduleSlug: string) =>
        `/learn/courses/${courseSlug}/modules/${moduleSlug}`,
    LearnLesson: (courseSlug: string, moduleSlug: string, lessonSlug: string) =>
        `/learn/courses/${courseSlug}/modules/${moduleSlug}/lessons/${lessonSlug}`,
    LearnProfile: "/learn/profile",
    Gallery: "/about",

    Surveys: "/surveys",
    Survey: (id: string) => `/surveys/${id}`,
    Trivia: "/learn",
    TriviaSet: (id: string) => `/learn/courses/${id}`,
    Articles: "/learn/catalogue",
    Article: (slug: string) => `/learn/courses/${slug}`,
    Knowledge: "/learn",
    KnowledgeEntry: (id: string) => `/learn/courses/${id}`,
    BudgetHub: "/budgethub",
  Reports: "/reports",
    BudgetNews: "/budgetnews",
    BudgetNewsModule: budgetNewsModulePath,
    BudgetNewsChapter: budgetNewsChapterPath,

    Events: "/events",
    Event: (id: string) => `/events/${id}`,

    Projects: "/bns-project",
    BNSStudio: "/bns-studio",

    Login: "/auth/login",
    Register: "/auth/register",
    Verify: "/auth/verify",
    Reset: "/auth/reset",
    Invite: "/auth/register",
    Account: "/learn/account",
    AccountPassword: "/learn/account/password",
    AccountNotifications: "/learn/account/notifications",
    AccountSignOut: "/learn/account/sign-out",
} as const;