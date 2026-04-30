export const Routes = {
    Home: "/",
    
    Research: "/research",
    Careers: "/careers",
    Tasks: "/tasks",
    FAQ: "/faq",
    Contact: "/contact",
    JoinUs: "/careers",

    Difference: "/#difference",
    Workflow: "/#workflow",
    Capabilities: "/#capabilities",
    Integrations: "/#integrations",
    Membership: "/#membership",

    Dashboard: "/admin/dashboard",
    Learn: "/learn",
    LearnDoc: (doc: string) => `/learn/${doc}`,
    Challenges: "/challenges",
} as const;