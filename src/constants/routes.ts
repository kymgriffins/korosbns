export const Routes = {
    Home: "/",
    
    Research: "/research",
    FAQ: "/faq",
    Contact: "/contact",

    Difference: "/#difference",
    Workflow: "/#workflow",
    Capabilities: "/#capabilities",
    Integrations: "/#integrations",
    Membership: "/#membership",

    Dashboard: "/dashboard",
    Learn: "/learn",
    LearnDoc: (doc: string) => `/learn/${doc}`,
    Challenges: "/challenges",
} as const;