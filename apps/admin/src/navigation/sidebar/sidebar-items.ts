import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  ClipboardList,
  FileBarChart,
  FolderOpen,
  Forward,
  Gauge,
  GraduationCap,
  Handshake,
  Image,
  Inbox,
  LayoutDashboard,
  Library,
  ListTodo,
  Lock,
  type LucideIcon,
  MailPlus,
  MessageSquare,
  MessageSquareQuote,
  Newspaper,
  Pen,
  Phone,
  Receipt,
  ScrollText,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  Trophy,
  UserRound,
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

/**
 * Only ship nav items with real API-backed pages.
 * StudioKit demos and HTML-only surfaces stay out until wired.
 */
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
        id: "invitations",
        title: "Invitations",
        url: "/dashboard/invitations",
        icon: MailPlus,
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
        icon: UserRound,
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
      {
        id: "stories",
        title: "Stories",
        url: "/dashboard/stories",
        icon: Newspaper,
      },
      {
        id: "knowledge",
        title: "Knowledge",
        url: "/dashboard/knowledge",
        icon: Library,
      },
      {
        id: "courses",
        title: "Courses",
        url: "/dashboard/courses",
        icon: GraduationCap,
      },
      {
        id: "media",
        title: "Media",
        url: "/dashboard/media",
        icon: Image,
      },
      {
        id: "feedback",
        title: "Feedback",
        url: "/dashboard/feedback",
        icon: MessageSquareQuote,
      },
    ],
  },
  {
    id: 5,
    label: "Engagement",
    items: [
      {
        id: "engagement-hub",
        title: "Overview",
        url: "/dashboard/engagement",
        icon: LayoutDashboard,
      },
      {
        id: "surveys",
        title: "Surveys",
        url: "/dashboard/surveys",
        icon: ClipboardList,
      },
      {
        id: "trivia",
        title: "Trivia",
        url: "/dashboard/trivia",
        icon: Trophy,
      },
      {
        id: "forum",
        title: "Forum",
        url: "/dashboard/forum",
        icon: MessageSquare,
      },
    ],
  },
  {
    id: 6,
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
        id: "comm-subscribers",
        title: "Subscribers",
        url: "/dashboard/communication/subscribers",
        icon: Users,
      },
      {
        id: "comm-notifications",
        title: "Notifications",
        url: "/dashboard/communication/notifications",
        icon: Bell,
      },
      {
        id: "comm-audit-logs",
        title: "Audit Logs",
        url: "/dashboard/communication/audit-logs",
        icon: ScrollText,
      },
    ],
  },
  {
    id: 7,
    label: "Library",
    items: [
      {
        id: "docrepository",
        title: "Doc repository",
        url: "/dashboard/docrepository",
        icon: FolderOpen,
      },
    ],
  },
  {
    id: 8,
    label: "Organization",
    items: [
      {
        id: "org-settings",
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
      },
      {
        id: "org-partners",
        title: "Partners",
        url: "/dashboard/partners",
        icon: Handshake,
      },
      {
        id: "org-roles",
        title: "Roles",
        url: "/dashboard/roles",
        icon: Shield,
      },
      {
        id: "org-gamification",
        title: "Gamification",
        url: "/dashboard/gamification",
        icon: Award,
      },
      {
        id: "org-invoices",
        title: "Invoices",
        url: "/dashboard/invoices",
        icon: Receipt,
      },
    ],
  },
  {
    id: 9,
    label: "Account",
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
