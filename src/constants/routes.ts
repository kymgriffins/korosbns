export const Routes = {
    Home: "/",
    
    Research: "/research",
    Careers: "/careers",
    FAQ: "/faq",
    Contact: "/contact",
    JoinUs: "/careers",

    Difference: "/#difference",
    Workflow: "/#workflow",
    Capabilities: "/#capabilities",
    Integrations: "/#integrations",
    Membership: "/#membership",

    Learn: "/learn",
    LearnDoc: (doc: string) => `/learn/${doc}`,
    Challenges: "/challenges",
    Gallery: "/gallery",

    Surveys: "/surveys",
    Survey: (id: string) => `/surveys/${id}`,
    Trivia: "/trivia",
    TriviaSet: (id: string) => `/trivia/${id}`,
    Articles: "/articles",
    Article: (slug: string) => `/articles/${slug}`,
    Knowledge: "/knowledge",
    KnowledgeEntry: (id: string) => `/knowledge/${id}`,
    Events: "/events",
    Event: (id: string) => `/events/${id}`,

    Login: "/auth/login",
    Register: "/auth/register",
    Verify: "/auth/verify",
    Reset: "/auth/reset",
    Invite: "/invite",
    Account: "/account",
    AccountNotifications: "/account/notifications",
} as const;