import {
  BarChart3,
  FileBarChart,
  Forward,
  Gauge,
  Inbox,
  LayoutDashboard,
  ListTodo,
  Lock,
  type LucideIcon,
  Mail,
  MessageSquare,
  Pen,
  Phone,
  Send,
  ShieldCheck,
  BookOpen,
  User,
  Users,
  Waypoints,
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
    label: "Management",
    items: [
      {
        id: "users",
        title: "Users",
        url: "/dashboard/users",
        icon: Users,
      },
      {
        id: "authors",
        title: "Authors",
        url: "/dashboard/authors",
        icon: Pen,
      },
      {
        id: "profile",
        title: "Profile",
        url: "/dashboard/profile",
        icon: User,
      },
    ],
  },
  {
    id: 4,
    label: "Content",
    items: [
      {
        id: "modules",
        title: "Modules",
        url: "/dashboard/modules",
        icon: BookOpen,
      },
    ],
  },
  {
    id: 5,
    label: "Communication",
    items: [
      {
        id: "comm-overview",
        title: "Dashboard",
        url: "/dashboard/communication",
        icon: BarChart3,
      },
      {
        id: "comm-campaigns",
        title: "Campaigns",
        url: "/dashboard/communication/campaigns",
        icon: Send,
      },
      {
        id: "comm-inbox",
        title: "Inbox",
        url: "/dashboard/communication/inbox",
        icon: Inbox,
      },
      {
        id: "comm-outbox",
        title: "Outbox",
        url: "/dashboard/communication/outbox",
        icon: Forward,
      },
      {
        id: "comm-contacts",
        title: "Contact Messages",
        url: "/dashboard/communication/contact-messages",
        icon: Phone,
      },
      {
        id: "comm-email-hooks",
        title: "Email Hooks",
        url: "/dashboard/communication/email-hooks",
        icon: Waypoints,
      },
      {
        id: "mail",
        title: "Email",
        url: "/dashboard/mail",
        icon: Mail,
      },
      {
        id: "chat",
        title: "Live Chat",
        url: "/dashboard/chat",
        icon: MessageSquare,
      },
    ],
  },
  {
    id: 6,
    label: "Settings",
    items: [
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
