export const Routes = {
    Home: "/",

    Research: "/research",
    Careers: "/careers",
    FAQ: "/faq",
    Contact: "/contact",
    JoinUs: "/careers",
    About: "/about",
    Partners: "/partners",
    Impact: "/impact",
    Surveys: "/surveys",

    Donate: "/donate",
    JoinNetwork: "/join",
    Volunteer: "/volunteer",

    /** Story-first explainers live on the learn hub */
    Capabilities: "/learn",
    /** Primary intake for coalition volunteers & collaborators */
    Membership: "/careers",

    Dashboard: "/admin/dashboard",
    Learn: "/learn",
    LearnDoc: (doc: string) => `/learn/${doc}`,
    Challenges: "/challenges",
    Gallery: "/gallery",
    Team: "/team",
} as const;