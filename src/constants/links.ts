import { Routes } from "./routes";

export const NAV_LINKS = [
    {
        label: "Stories",
        href: "#workflow",
    },
    {
        label: "Impact",
        href: "#integrations",
    },
    {
        label: "Leadership",
        href: "#voices",
    },
] as const;

export const footerLinks = {
    product: [
        { label: "Stories", href: "#" },
        { label: "Explainers", href: "#capabilities" },
        { label: "Impact", href: "#difference" },
        { label: "Get Involved", href: "#membership" }
    ],
    resources: [
        { label: "Budget Guides", href: "#" },
        { label: "Reports", href: "#" },
        { label: "Newsletter", href: "#" },
        { label: "Contact", href: "#" }
    ],
    company: [
        { label: "About BNS", href: "#" },
        { label: "Team", href: "#" },
        { label: "Media", href: "#" },
        { label: "Partners", href: "#" }
    ]
};

export const socialLinks = [
    { label: "X", href: "https://x.com/budgetndiostory", icon: "x" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/budgetndiostory", icon: "linkedin" }
];
