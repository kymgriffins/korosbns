import {
  Building2,
  FileBarChart,
  FileText,
  Gauge,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  ListTodo,
  MessageSquare,
  Notebook,
  PenSquare,
  type LucideIcon,
  Users,
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
    id: 4,
    label: "Management",
    items: [
      {
        id: "users-crud",
        title: "Users",
        url: "/dashboard/users/crud",
        icon: Users,
      },
      {
        id: "roles-crud",
        title: "Roles",
        url: "/dashboard/roles/crud",
        icon: Building2,
      },
      {
        id: "content",
        title: "Content",
        url: "/dashboard/content",
        icon: FileText,
      },
      {
        id: "modules",
        title: "Modules",
        url: "/dashboard/modules",
        icon: GraduationCap,
      },
      {
        id: "authors",
        title: "Authors",
        url: "/dashboard/authors",
        icon: PenSquare,
      },
      {
        id: "budget-data",
        title: "Budget Data",
        url: "/dashboard/budget-data",
        icon: Landmark,
      },
      {
        id: "forum",
        title: "Forum",
        url: "/dashboard/forum",
        icon: MessageSquare,
      },
      {
        id: "notes",
        title: "Notes",
        url: "/dashboard/notes",
        icon: Notebook,
      },
    ],
  },
];
