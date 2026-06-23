import {
  Banknote,
  BookOpen,
  Calendar,
  ChartBar,
  ChartLine,
  FileBarChart,
  FileText,
  Film,
  Fingerprint,
  Forklift,
  Gauge,
  GraduationCap,
  Kanban,
  LayoutDashboard,
  ListTodo,
  Lock,
  type LucideIcon,
  Mail,
  Medal,
  MessageSquare,
  Newspaper,
  ReceiptText,
  Server,
  ShoppingBag,
  SquareArrowUpRight,
  TrendingUp,
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
    label: "Dashboards",
    items: [
      {
        id: "default",
        title: "Default",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
      {
        id: "crm",
        title: "CRM",
        url: "/dashboard/crm",
        icon: ChartBar,
      },
      {
        id: "finance",
        title: "Finance",
        url: "/dashboard/finance",
        icon: Banknote,
      },
      {
        id: "analytics",
        title: "Analytics",
        url: "/admin/dashboard/analytics",
        icon: Gauge,
        newTab: true,
      },
      {
        id: "productivity",
        title: "Productivity",
        url: "/dashboard/productivity",
        icon: ListTodo,
      },
      {
        id: "ecommerce",
        title: "E-commerce",
        url: "/dashboard/ecommerce",
        icon: ShoppingBag,
      },
      {
        id: "academy",
        title: "Academy",
        url: "/dashboard/academy",
        icon: GraduationCap,
      },
      {
        id: "logistics",
        title: "Logistics",
        url: "/dashboard/logistics",
        icon: Forklift,
      },
      {
        id: "infrastructure",
        title: "Infrastructure",
        url: "/dashboard/infrastructure",
        icon: Server,
        badge: "new",
      },
    ],
  },
  {
    id: 2,
    label: "Pages",
    items: [
      {
        id: "email",
        title: "Email",
        url: "/dashboard/mail",
        icon: Mail,
      },
      {
        id: "chat",
        title: "Chat",
        url: "/dashboard/chat",
        icon: MessageSquare,
      },
      {
        id: "calendar",
        title: "Calendar",
        url: "/dashboard/calendar",
        icon: Calendar,
      },
      {
        id: "kanban",
        title: "Kanban",
        url: "/dashboard/kanban",
        icon: Kanban,
      },
      {
        id: "invoice",
        title: "Invoice",
        url: "/dashboard/invoice",
        icon: ReceiptText,
      },
      {
        id: "users",
        title: "Users",
        url: "/dashboard/users",
        icon: Users,
      },
      {
        id: "roles",
        title: "Roles",
        url: "/dashboard/roles",
        icon: Lock,
      },
      {
        id: "authentication",
        title: "Authentication",
        icon: Fingerprint,
        subItems: [
          { id: "auth-login", title: "Login", url: "/budgethub/auth/login" },
          { id: "auth-register", title: "Register", url: "/budgethub/auth/register" },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "Legacy",
    items: [
      {
        id: "legacy-dashboards",
        title: "Dashboards",
        subItems: [
          { id: "legacy-default", title: "Default V1", url: "/dashboard/default-v1" },
          { id: "legacy-crm", title: "CRM V1", url: "/dashboard/crm-v1" },
          { id: "legacy-finance", title: "Finance V1", url: "/dashboard/finance-v1" },
          { id: "legacy-analytics", title: "Analytics V1", url: "/dashboard/analytics-v1" },
        ],
      },
    ],
  },
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
  {
    id: 5,
    label: "Misc",
    items: [
      {
        id: "others",
        title: "Others",
        url: "/dashboard/coming-soon",
        icon: SquareArrowUpRight,
        badge: "soon",
        disabled: true,
      },
    ],
  },
];
