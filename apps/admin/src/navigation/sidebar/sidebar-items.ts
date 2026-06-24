import {
  FileBarChart,
  Gauge,
  LayoutDashboard,
  ListTodo,
  type LucideIcon,
  ShieldCheck,
  Lock,
  User,
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

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboard",
    items: [
      {
        id: "admin-overview",
        title: "Overview",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        id: "analytics",
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: Gauge,
      },
    ],
  },
  {
    id: 2,
    label: "Task Management",
    items: [
      {
        id: "task-overview",
        title: "Overview",
        url: "/dashboard/task-overview",
        icon: LayoutDashboard,
      },
      {
        id: "tasks",
        title: "Board",
        url: "/dashboard/task",
        icon: ListTodo,
      },
      {
        id: "task-report",
        title: "Report",
        url: "/dashboard/task/report",
        icon: FileBarChart,
      },
    ],
  },
  {
    id: 3,
    label: "Settings",
    items: [
      {
        id: "profile",
        title: "Profile",
        url: "/dashboard/profile",
        icon: User,
      },
      {
        id: "privacy",
        title: "Privacy",
        url: "/dashboard/privacy",
        icon: ShieldCheck,
      },
      {
        id: "security",
        title: "Security",
        url: "/dashboard/security",
        icon: Lock,
      },
    ],
  },
];
