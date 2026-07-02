export type AdminSidebarSection = {
  title: string;
  url?: string;
  icon?: string;
  items?: { title: string; url: string; icon?: string; badge?: string }[];
};

const DEFAULT_SIDEBAR: AdminSidebarSection[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/admin/dashboard", icon: "layout-dashboard" },
      { title: "Analytics", url: "/admin/dashboard/analytics", icon: "chart-bar" },
      { title: "Content Inventory", url: "/admin/dashboard/content-inventory", icon: "list-tree" },
    ],
  },
  {
    title: "Content",
    items: [
      { title: "All Content", url: "/admin/dashboard/content", icon: "file-text" },
      { title: "Modules", url: "/admin/dashboard/modules", icon: "book-open" },
      { title: "Forum", url: "/admin/dashboard/forum", icon: "messages-square" },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Users", url: "/admin/dashboard/users", icon: "users" },
      { title: "Roles", url: "/admin/dashboard/roles", icon: "shield" },
      { title: "Authors", url: "/admin/dashboard/authors", icon: "pen" },
    ],
  },
  {
    title: "Tasks",
    items: [
      { title: "Task Board", url: "/admin/dashboard/task", icon: "list-checks" },
      { title: "Task Overview", url: "/admin/dashboard/task-overview", icon: "chart-no-axes-combined" },
      { title: "Kanban", url: "/admin/dashboard/kanban", icon: "columns-3" },
      { title: "Notes", url: "/admin/dashboard/notes", icon: "notepad-text" },
    ],
  },
  {
    title: "Communication",
    items: [
      { title: "Email", url: "/admin/dashboard/mail", icon: "mail" },
      { title: "Live Chat", url: "/admin/dashboard/chat", icon: "message-square" },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Budget Data", url: "/admin/dashboard/budget-data", icon: "landmark" },
      { title: "Calendar", url: "/admin/dashboard/calendar", icon: "calendar" },
      { title: "Security", url: "/admin/dashboard/security", icon: "lock" },
      { title: "Privacy", url: "/admin/dashboard/privacy", icon: "eye" },
    ],
  },
];

let _sidebar: AdminSidebarSection[] = [...DEFAULT_SIDEBAR];

export const adminMetaData = {
  sidebar: {
    get: () => _sidebar,
    set: (items: AdminSidebarSection[]) => { _sidebar = items; },
  },
};
