import {
  Award,
  BookOpen,
  Clapperboard,
  Database,
  FlaskConical,
  FolderOpen,
  GraduationCap,
  Handshake,
  LayoutDashboard,
  ListTodo,
  type LucideIcon,
  MessageSquare,
  PiggyBank,
  Receipt,
  Settings,
  Share2,
  Shield,
  ShieldCheck,
  UserRound,
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

/**
 * Category-first minimalist nav: Core Operations (Analytics, Tasks, Communication),
 * Civic Content & Data, and Platform Governance.
 */
export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Operations",
    items: [
      {
        id: "cat-dashboard",
        title: "Dashboard",
        icon: LayoutDashboard,
        subItems: [
          { id: "admin-overview", title: "Overview", url: "/dashboard" },
          { id: "analytics", title: "Analytics", url: "/dashboard/analytics" },
        ],
      },
      {
        id: "cat-tasks",
        title: "Tasks Management",
        icon: ListTodo,
        subItems: [
          { id: "tasks", title: "Task Board", url: "/dashboard/task" },
          { id: "task-report", title: "Task Reports", url: "/dashboard/task/report" },
        ],
      },
      {
        id: "cat-communication",
        title: "Communication",
        icon: Share2,
        subItems: [
          { id: "comm-overview", title: "Command Center", url: "/dashboard/communication" },
          { id: "comm-messages", title: "Messages", url: "/dashboard/communication/messages" },
          { id: "comm-subscribers", title: "Subscribers", url: "/dashboard/communication/subscribers" },
          { id: "comm-notifications", title: "Notifications", url: "/dashboard/communication/notifications" },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "Civic Content & Data",
    items: [
      {
        id: "cat-learning",
        title: "Curriculum",
        icon: GraduationCap,
        subItems: [
          { id: "modules", title: "Modules & Lessons", url: "/dashboard/modules", icon: BookOpen },
          { id: "stories", title: "Civic Stories", url: "/dashboard/stories" },
          { id: "knowledge", title: "Knowledge Base", url: "/dashboard/knowledge" },
          { id: "media", title: "Media Assets", url: "/dashboard/media" },
        ],
      },
      {
        id: "cat-engagement",
        title: "Participation",
        icon: MessageSquare,
        subItems: [
          { id: "surveys", title: "Public Surveys", url: "/dashboard/surveys" },
          { id: "trivia", title: "Trivia & Quizzes", url: "/dashboard/trivia" },
          { id: "events", title: "Events & Townhalls", url: "/dashboard/events" },
          { id: "forum", title: "Community Forum", url: "/dashboard/forum" },
        ],
      },
      {
        id: "docrepository",
        title: "Document Library",
        url: "/dashboard/docrepository",
        icon: FolderOpen,
      },
      {
        id: "org-ke-budget",
        title: "KE Budget Engine",
        url: "/dashboard/ke-budget",
        icon: PiggyBank,
      },
      {
        id: "cms-json",
        title: "JSON Data Studio",
        url: "/dashboard/cms",
        icon: Database,
      },
    ],
  },
  {
    id: 3,
    label: "Platform & Access",
    items: [
      {
        id: "cat-people",
        title: "Access & Users",
        icon: Users,
        subItems: [
          { id: "users", title: "Citizen & Staff Users", url: "/dashboard/users" },
          { id: "invitations", title: "Invitations", url: "/dashboard/invitations" },
          { id: "roles", title: "Roles & Permissions", url: "/dashboard/roles", icon: Shield },
          { id: "profile", title: "My Profile", url: "/dashboard/profile" },
        ],
      },
      {
        id: "cat-organization",
        title: "Settings & System",
        icon: Settings,
        subItems: [
          { id: "org-settings", title: "System Settings", url: "/dashboard/settings" },
          { id: "security", title: "Security & Audits", url: "/dashboard/security", icon: ShieldCheck },
          { id: "org-partners", title: "Civic Partners", url: "/dashboard/partners", icon: Handshake },
        ],
      },
    ],
  },
];
