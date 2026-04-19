export const Routes = {
    Home: "/",
    
    Difference: "/#difference",
    Workflow: "/#workflow",
    Capabilities: "/#capabilities",
    Integrations: "/#integrations",
    Membership: "/#membership",

    Dashboard: "/dashboard",
    Learn: "/learn",
    LearnDoc: (doc: string) => `/learn/${doc}`,
} as const;