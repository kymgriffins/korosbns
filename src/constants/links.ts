import { Routes } from "./routes";

export const NAV_LINKS = [
  {
    label: "Learn",
    href: Routes.Learn,
  },
  {
    label: "Budget Hub",
    href: Routes.BudgetHub,
  },
  {
    label: "Surveys",
    href: Routes.Surveys,
  },
  {
    label: "Events",
    href: Routes.Events,
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
    { label: "Impact", href: "/about" },
    { label: "Get Involved", href: "/about" },
  ],
  resources: [
    { label: "Budget Guides", href: Routes.Learn },
    { label: "Documents", href: Routes.Documents },
  { label: "Surveys",     href: Routes.Surveys },
  { label: "Reports",    href: Routes.Reports },
    { label: "Newsletter", href: "/" },
    { label: "Contact", href: Routes.Contact },
  ],
  company: [
    { label: "About BNS", href: "/about" },
    { label: "Team", href: "/about" },
    { label: "Careers", href: Routes.Careers },
    { label: "Media", href: "/about" },
    { label: "Partners", href: "/about" },
  ],
};

export const socialLinks = [
  { label: "X", href: "https://x.com/budgetndiostory", icon: "x" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/budget-ndio-story/",
    icon: "linkedin",
  },
  { label: "WhatsApp", href: "https://wa.me/254790631623", icon: "whatsapp" },
  {
    label: "YouTube",
    href: "https://youtube.com/@budgetndiostory",
    icon: "youtube",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@budget.ndio.story",
    icon: "tiktok",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/budgetndiostory",
    icon: "instagram",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1CPg2LgfVJ/",
    icon: "facebook",
  },
];
