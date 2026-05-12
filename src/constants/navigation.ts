import { Routes } from "./routes";

export type MenuNavItem = { label: string; href: string };
export type MenuNavSection = { id: string; title: string; items: MenuNavItem[] };

/** Primary grouped navigation — single source for cinematic menu & audits */
export const MAIN_MENU_SECTIONS: MenuNavSection[] = [
  {
    id: "discover",
    title: "Discover",
    items: [
      { label: "Learning hub", href: Routes.Learn },
      { label: "Research", href: Routes.Research },
      { label: "Gallery", href: Routes.Gallery },
    ],
  },
  {
    id: "participate",
    title: "Participate",
    items: [
      { label: "Challenges", href: Routes.Challenges },
      { label: "Surveys", href: Routes.Surveys },
    ],
  },
  {
    id: "organization",
    title: "Organization",
    items: [
      { label: "About", href: Routes.About },
      { label: "Team", href: Routes.Team },
      { label: "Careers", href: Routes.Careers },
      { label: "Impact", href: Routes.Impact },
      { label: "Partners", href: Routes.Partners },
    ],
  },
  {
    id: "connect",
    title: "Connect",
    items: [
      { label: "FAQ", href: Routes.FAQ },
      { label: "Contact", href: Routes.Contact },
    ],
  },
];
