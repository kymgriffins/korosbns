import { Routes } from "./routes";

export const NAV_LINKS = [
    {
        label: "Learn",
        href: Routes.Learn,
    },
    {
        label: "FAQ",
        href: Routes.FAQ,
    },
    {
        label: "Challenges",
        href: Routes.Challenges,
    },
    {
        label: "Contact",
        href: Routes.Contact,
    },
] as const;

export const footerLinks = {
    product: [
        { label: "Stories", href: Routes.Learn },
        { label: "Explainers", href: Routes.Capabilities },
        { label: "Impact", href: "/impact" },
        { label: "Challenges", href: Routes.Challenges },
        { label: "Get Involved", href: Routes.Membership }
    ],
    resources: [
        { label: "Budget Guides", href: Routes.Learn },
        { label: "Task Tracker", href: Routes.Tasks },
        { label: "Newsletter", href: "#newsletter" },
        { label: "Contact", href: Routes.Contact }
    ],
    company: [
        { label: "About BNS", href: "/about" },
        { label: "Team", href: "/about" },
        { label: "Careers", href: Routes.Careers },
        { label: "Media", href: "/media" },
        { label: "Partners", href: "/partners" }
    ]
};

export const socialLinks = [
    { label: "X", href: "https://x.com/budgetndiostory", icon: "x" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/budget-ndio-story/", icon: "linkedin" },
    { label: "WhatsApp", href: "https://wa.me/254790631623", icon: "whatsapp" },
    { label: "YouTube", href: "https://youtube.com/@budgetndiostory", icon: "youtube" },
    { label: "TikTok", href: "https://www.tiktok.com/@budget.ndio.story", icon: "tiktok" },
    { label: "Instagram", href: "https://instagram.com/budgetndiostory", icon: "instagram" }
];
