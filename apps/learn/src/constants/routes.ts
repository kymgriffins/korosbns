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

    Learn: "/",
    LearnVideos: "/videos",
    LearnArticles: "/articles",
    LearnStories: "/stories",
    LearnDocuments: "/documents",
    Documents: "/documents",
    LearnPaths: "/",
    LearnPath: (slug: string) => `/paths/${slug}`,
    LearnForum: "/forum",
    LearnAuthor: (slug: string) => `/authors/${slug}`,
    LearnQuests: "/quests",
    LearnProfile: "/profile",
    LearnDoc: (doc: string) => `/${doc}`,
    LearnUnits: "/",
    LearnUnitEdition: (unitSlug: string, year: number | string) => `/units/${unitSlug}/${year}`,
    Challenges: "/quests",
    Gallery: "/about",

    Surveys: "/surveys",
    Survey: (id: string) => `/surveys/${id}`,
    Trivia: "/",
    TriviaSet: (id: string) => `/${id}`,
    Articles: "/",
    Article: (slug: string) => `/${slug}`,
    Knowledge: "/",
    KnowledgeEntry: (id: string) => `/${id}`,
    BudgetNews: "/budgetnews",
    BudgetNewsModule: budgetNewsModulePath,
    BudgetNewsChapter: budgetNewsChapterPath,

    Events: "/events",
    Event: (id: string) => `/events/${id}`,

    Login: "/auth/login",
    Register: "/auth/register",
    Verify: "/auth/verify",
    Reset: "/auth/reset",
    Invite: "/auth/register",
    Account: "/account",
    AccountPassword: "/account/password",
    AccountNotifications: "/account/notifications",
    AccountSignOut: "/account/sign-out",
} as const;