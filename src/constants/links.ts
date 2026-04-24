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
        label: "Contact",
        href: Routes.Contact,
    },
] as const;

export const footerLinks = {
    product: [
        { label: "Stories", href: Routes.Learn },
        { label: "Explainers", href: Routes.Capabilities },
        { label: "Impact", href: "/impact" },
        { label: "Get Involved", href: Routes.Membership }
    ],
    resources: [
        { label: "Budget Guides", href: Routes.Learn },
        { label: "Newsletter", href: "#newsletter" },
        { label: "Contact", href: Routes.Contact }
    ],
    company: [
        { label: "About BNS", href: "/about" },
        { label: "Team", href: "/about" },
        { label: "Media", href: "/media" },
        { label: "Partners", href: "/partners" }
    ]
};

export const socialLinks = [
    { label: "X", href: "https://x.com/budgetndiostory", icon: "x" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/budgetndiostory", icon: "linkedin" },
    { label: "WhatsApp", href: "https://wa.me/254700000000", icon: "whatsapp" },
    { label: "YouTube", href: "https://youtube.com/@budgetndiostory", icon: "youtube" },
    { label: "TikTok", href: "https://tiktok.com/@budgetndiostory", icon: "tiktok" },
    { label: "Instagram", href: "https://instagram.com/budgetndiostory", icon: "instagram" }
];
