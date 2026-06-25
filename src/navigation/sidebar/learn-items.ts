import {
  BookOpen, FileText, Home, LayoutDashboard, Medal, MessageSquare,
  TrendingUp, User, Users, Video, type LucideIcon,
} from "lucide-react";

export type NavBadge = "new" | "soon";

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const learnSidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Browse",
    items: [
      { id: "home", title: "Dashboard", url: "/learn", icon: LayoutDashboard },
      { id: "modules", title: "Modules", url: "/learn/modules", icon: BookOpen },
      { id: "videos", title: "Videos", url: "/learn/videos", icon: Video },
      { id: "articles", title: "Articles", url: "/learn/articles", icon: FileText },
      { id: "stories", title: "Stories", url: "/learn/stories", icon: BookOpen },
      { id: "documents", title: "Documents", url: "/learn/documents", icon: FileText },
    ],
  },
  {
    id: 2,
    label: "Community",
    items: [
      { id: "forum", title: "Forum", url: "/learn/forum", icon: MessageSquare },
      { id: "authors", title: "Authors", url: "/learn/authors", icon: Users },
      { id: "profile", title: "Profile", url: "/learn/profile", icon: User },
    ],
  },
  {
    id: 3,
    label: "Insights",
    items: [
      { id: "analytics", title: "Analytics", url: "/learn/analytics", icon: TrendingUp },
      { id: "quests", title: "Quests", url: "/learn/quests", icon: Medal },
    ],
  },
];
