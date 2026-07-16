import {
  Award,
  BookOpen,
  Clapperboard,
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
 * Category-first nav: few top-level entries; children expand in the sidebar.
 * Only ship items with real API-backed pages.
 */
export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Workspace",
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
        title: "Tasks",
        icon: ListTodo,
        subItems: [
          { id: "tasks", title: "Board", url: "/dashboard/task" },
          { id: "task-report", title: "Report", url: "/dashboard/task/report" },
        ],
      },
      {
        id: "cat-people",
        title: "People",
        icon: Users,
        subItems: [
          { id: "users", title: "Users", url: "/dashboard/users" },
          { id: "invitations", title: "Invitations", url: "/dashboard/invitations" },
          { id: "authors", title: "Authors", url: "/dashboard/authors" },
          { id: "profile", title: "Profile", url: "/dashboard/profile" },
        ],
      },
      {
        id: "cat-learning",
        title: "Learning",
        icon: GraduationCap,
        subItems: [
          { id: "modules", title: "Modules", url: "/dashboard/modules", icon: BookOpen },
          { id: "stories", title: "Stories", url: "/dashboard/stories" },
          { id: "knowledge", title: "Knowledge", url: "/dashboard/knowledge" },
          { id: "courses", title: "Courses", url: "/dashboard/courses" },
          { id: "media", title: "Media", url: "/dashboard/media" },
          { id: "feedback", title: "Feedback", url: "/dashboard/feedback" },
          { id: "org-gamification", title: "Gamification", url: "/dashboard/gamification", icon: Award },
        ],
      },
      {
        id: "cat-engagement",
        title: "Engagement",
        icon: MessageSquare,
        subItems: [
          { id: "engagement-hub", title: "Overview", url: "/dashboard/engagement" },
          { id: "surveys", title: "Surveys", url: "/dashboard/surveys" },
          { id: "trivia", title: "Trivia", url: "/dashboard/trivia" },
          { id: "events", title: "Events", url: "/dashboard/events" },
          { id: "forum", title: "Forum", url: "/dashboard/forum" },
        ],
      },
      {
        id: "cat-communication",
        title: "Communication",
        icon: Share2,
        subItems: [
          { id: "comm-overview", title: "Dashboard", url: "/dashboard/communication" },
          { id: "comm-messages", title: "Messages", url: "/dashboard/communication/messages" },
          { id: "comm-subscribers", title: "Subscribers", url: "/dashboard/communication/subscribers" },
          { id: "comm-notifications", title: "Notifications", url: "/dashboard/communication/notifications" },
          { id: "comm-email-hooks", title: "Email Hooks", url: "/dashboard/communication/email-hooks" },
          { id: "comm-audit-logs", title: "Audit Logs", url: "/dashboard/communication/audit-logs" },
          { id: "comm-social", title: "Social / TikTok", url: "/dashboard/social" },
        ],
      },
      {
        id: "docrepository",
        title: "Library",
        url: "/dashboard/docrepository",
        icon: FolderOpen,
      },
      {
        id: "cat-organization",
        title: "Organization",
        icon: Settings,
        subItems: [
          { id: "org-settings", title: "Settings", url: "/dashboard/settings" },
          { id: "org-partners", title: "Partners", url: "/dashboard/partners", icon: Handshake },
          { id: "org-roles", title: "Roles", url: "/dashboard/roles", icon: Shield },
          { id: "org-studio", title: "Studio", url: "/dashboard/studio", icon: Clapperboard },
          { id: "org-ke-budget", title: "KE Budget", url: "/dashboard/ke-budget", icon: PiggyBank },
          { id: "org-invoices", title: "Invoices", url: "/dashboard/invoices", icon: Receipt },
        ],
      },
      {
        id: "cat-account",
        title: "Account",
        icon: UserRound,
        subItems: [
          { id: "privacy", title: "Privacy", url: "/dashboard/privacy", icon: ShieldCheck },
          { id: "security", title: "Security", url: "/dashboard/security" },
        ],
      },
    ],
  },
];
