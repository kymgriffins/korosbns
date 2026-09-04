export function budgetNewsModulePath(slug: string) {
    return `/budgetnews/${slug}`;
}

export function budgetNewsChapterPath(slug: string, chapterSlug: string) {
    return `/budgetnews/${slug}/${chapterSlug}`;
}

export const Routes = {
    Home: "/",
    
    Research: "/about",
    About: "/about",
    Work: "/work",
    Careers: "/careers",
    FAQ: "/faq",
    Contact: "/contact",
    JoinUs: "/auth/register",

    Difference: "/#difference",
    Workflow: "/#workflow",
    Capabilities: "/#capabilities",
    Integrations: "/#integrations",
    Membership: "/#membership",

    Learn: "/learn",
    LearnVideos: "/learn/videos",
    LearnArticles: "/learn/articles",
    LearnStories: "/learn/stories",
    LearnModules: "/learn/modules",
    LearnDocuments: "/learn/documents",
    Documents: "/learn/documents",
    LearnPaths: "/learn",
    LearnPath: (slug: string) => `/learn/paths/${slug}`,
    LearnForum: "/learn/forum",
    LearnAlerts: "/learn/alerts",
    LearnAuthor: (slug: string) => `/learn/authors/${slug}`,
    LearnQuests: "/learn/quests",
    LearnProfile: "/learn/profile",
    LearnDoc: (doc: string) => `/learn/${doc}`,
    LearnUnits: "/learn",
    LearnUnitEdition: (unitSlug: string, year: number | string) => `/learn/units/${unitSlug}/${year}`,
    Challenges: "/learn/quests",
    Gallery: "/about",

    Surveys: "/surveys",
    Survey: (id: string) => `/surveys/${id}`,
    Trivia: "/learn",
    TriviaSet: (id: string) => `/learn/${id}`,
    Articles: "/learn",
    Article: (slug: string) => `/learn/${slug}`,
    Knowledge: "/learn",
    KnowledgeEntry: (id: string) => `/learn/${id}`,
    BudgetHub: "/budgethub",
  Reports: "/reports",
    BudgetNews: "/budgetnews",
    BudgetNewsModule: budgetNewsModulePath,
    BudgetNewsChapter: budgetNewsChapterPath,

    Events: "/events",
    Event: (id: string) => `/events/${id}`,

    Projects: "/work",
    Programmes: "/programmes",
    Programme: (slug: string) => `/programmes/${slug}`,
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