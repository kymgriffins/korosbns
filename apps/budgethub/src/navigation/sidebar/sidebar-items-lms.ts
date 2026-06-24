import {
  BookOpen,
  ChartLine,
  FileBarChart,
  FileText,
  type LucideIcon,
  LayoutDashboard,
  Medal,
  MessageSquare,
  TrendingUp,
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
    id: 4,
    label: "LMS",
    items: [
      {
        id: "lms-overview",
        title: "Overview",
        url: "/dashboard/lms",
        icon: LayoutDashboard,
      },
      {
        id: "lms-courses",
        title: "Courses",
        url: "/dashboard/lms/courses",
        icon: BookOpen,
      },
      {
        id: "lms-analytics",
        title: "Analytics",
        url: "/admin/dashboard/analytics",
        icon: ChartLine,
        newTab: true,
      },
      {
        id: "lms-progress",
        title: "Progress",
        icon: TrendingUp,
        subItems: [
          { id: "lms-progress-overview", title: "Progress", url: "/dashboard/lms/progress", icon: TrendingUp },
          { id: "lms-certificates", title: "Certificates", url: "/dashboard/lms/certificates", icon: Medal },
        ],
      },
      {
        id: "lms-documents",
        title: "Documents",
        url: "/dashboard/lms/documents",
        icon: FileText,
      },
      {
        id: "lms-forum",
        title: "Forum",
        url: "/dashboard/lms/forum",
        icon: MessageSquare,
      },
      {
        id: "lms-reports",
        title: "Reports",
        url: "/budgethub/reports",
        icon: FileBarChart,
        badge: "new",
      },
    ],
  },
];
