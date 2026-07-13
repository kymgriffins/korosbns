/**
 * Admin teaching catalog — one entry per /admin surface.
 * Copy is written for first-time operators: what the page is for, and what key controls do.
 */

export type TeachingActionTip = {
  id: string;
  label: string;
  body: string;
};

export type TeachingPageGuide = {
  /** Stable id for dismiss persistence */
  id: string;
  /** Match against path after /dashboard (e.g. "" | "modules" | "modules/new") */
  match: string | RegExp;
  title: string;
  /** One sentence: purpose of the page */
  purpose: string;
  /** Short “how to succeed” bullets */
  howTo: string[];
  /** What primary controls do */
  actions: TeachingActionTip[];
};

export const ADMIN_TEACHING_PAGES: TeachingPageGuide[] = [
  {
    id: "overview",
    match: /^$/,
    title: "Dashboard overview",
    purpose: "See org health at a glance — activity, content, and shortcuts into deeper tools.",
    howTo: [
      "Scan cards for anything stale or empty before diving into a section.",
      "Use Analytics when you need trends, not just today’s snapshot.",
    ],
    actions: [
      { id: "open-analytics", label: "Analytics", body: "Opens trend charts and module engagement metrics." },
      { id: "quick-links", label: "Quick links", body: "Jump to incomplete work (tasks, modules, messages)." },
    ],
  },
  {
    id: "analytics",
    match: "analytics",
    title: "Analytics",
    purpose: "Measure reach and learning engagement so you know what to improve next.",
    howTo: ["Filter by range before exporting or sharing.", "Compare modules, not vanity totals."],
    actions: [
      { id: "date-range", label: "Date range", body: "Narrows every chart and table to the selected window." },
      { id: "export", label: "Export / actions", body: "Download or share the current analytics view." },
    ],
  },
  {
    id: "task",
    match: /^task$/,
    title: "Task board",
    purpose: "Plan and track internal work notes for the team — not citizen learning content.",
    howTo: ["Create a task, assign status, then open it for checklist and attachments."],
    actions: [
      { id: "new-task", label: "New task", body: "Starts a blank weekly note / task with title and body." },
      { id: "report", label: "Report", body: "Summarizes completed work for the period." },
    ],
  },
  {
    id: "task-report",
    match: "task/report",
    title: "Task report",
    purpose: "Generate a shareable summary of task progress for leadership.",
    howTo: ["Refresh after updating board items so the report reflects latest status."],
    actions: [
      { id: "download", label: "Download / print", body: "Exports the report as markdown or printable PDF." },
    ],
  },
  {
    id: "users",
    match: "users",
    title: "Users",
    purpose: "See who has access, change roles, verify accounts, and deactivate when needed.",
    howTo: [
      "Invite new people from Invitations — this list edits existing members.",
      "Prefer role change over creating duplicate accounts.",
    ],
    actions: [
      { id: "edit-user", label: "Edit / actions", body: "Change role, verify, or deactivate the selected user." },
      { id: "invite-link", label: "Invitations", body: "Send a new invite when someone is not on the list yet." },
    ],
  },
  {
    id: "invitations",
    match: "invitations",
    title: "Invitations",
    purpose: "Invite teammates by email and revoke unused invites.",
    howTo: ["Send invite → they accept → they appear under Users."],
    actions: [
      { id: "create-invite", label: "Create invite", body: "Emails an invite link with the chosen role." },
      { id: "revoke", label: "Revoke", body: "Invalidates an unused invite so it cannot be accepted." },
    ],
  },
  {
    id: "authors",
    match: "authors",
    title: "Authors",
    purpose: "Review bylines that appear on published learning and stories (mostly derived from content).",
    howTo: ["Publish modules/stories with author attribution to populate this list."],
    actions: [{ id: "view-author", label: "Open author", body: "Inspect profile details linked from content." }],
  },
  {
    id: "profile",
    match: "profile",
    title: "Your profile",
    purpose: "Update your display name, avatar, and contact details used across admin.",
    howTo: ["Save after each section — avatar upload is separate from text fields."],
    actions: [
      { id: "save-profile", label: "Save", body: "Persists profile fields to the API." },
      { id: "avatar", label: "Avatar", body: "Uploads a new profile image." },
    ],
  },
  {
    id: "modules",
    match: /^modules$/,
    title: "Learning modules",
    purpose: "Catalogue of civic learning modules shown in the public Learning Hub.",
    howTo: [
      "Use New module to open the guided builder (steps are optional).",
      "Open the wand icon to resume setup (chapters, YouTube, trivia, publish).",
    ],
    actions: [
      {
        id: "new-module",
        label: "New module",
        body: "Starts the builder. Only title + slug are required to create; everything else can wait.",
      },
      {
        id: "open-builder",
        label: "Open builder",
        body: "Continues the non-strict wizard for that module.",
      },
      {
        id: "delete-module",
        label: "Delete",
        body: "Soft-removes the module and its chapters. Irreversible from this UI.",
      },
    ],
  },
  {
    id: "modules-new",
    match: "modules/new",
    title: "Create a module",
    purpose: "Name the module and create it — then you can jump to any builder step.",
    howTo: [
      "Title auto-fills slug; edit slug only if the Learning Hub URL must differ.",
      "After create, steps are skippable — incomplete sections show as Todo, not blockers.",
    ],
    actions: [
      {
        id: "create-continue",
        label: "Create & continue",
        body: "Saves overview and moves you to Chapters. You can still skip ahead later.",
      },
    ],
  },
  {
    id: "modules-builder",
    match: /^modules\/(?!new$)[^/]+$/,
    title: "Module builder",
    purpose: "Assemble a Learning Hub module: details, chapters, videos, trivia, then publish.",
    howTo: [
      "Use the step strip to jump freely — nothing forces you to finish in order.",
      "Green checks are guidance. Publish when content is ready for citizens.",
      "Chapters without articles stay incomplete until you link at least one.",
    ],
    actions: [
      {
        id: "stepper",
        label: "Step strip",
        body: "Jump between Overview, Chapters, YouTube, Trivia, and Publish without losing work.",
      },
      {
        id: "add-chapter",
        label: "Add chapter",
        body: "Creates a learner “step”. Reorder with the arrows; delete removes it.",
      },
      {
        id: "link-article",
        label: "Link article",
        body: "Creates a draft article and attaches it to the selected chapter.",
      },
      {
        id: "add-youtube",
        label: "Add YouTube URL",
        body: "Attaches a video to a chapter. Optional — skip if text-only.",
      },
      {
        id: "add-question",
        label: "Add question",
        body: "Creates the module assessment on first question, then appends more.",
      },
      {
        id: "workflow",
        label: "Workflow buttons",
        body: "Move draft → review → published (or archive) using allowed transitions.",
      },
    ],
  },
  {
    id: "stories",
    match: "stories",
    title: "Stories",
    purpose: "Publish narrative stories for the citizen site (separate from learning modules).",
    howTo: ["Draft → review → publish. Prefer archive over hard delete."],
    actions: [
      { id: "create-story", label: "Create / edit", body: "Opens the story editor and workflow controls." },
    ],
  },
  {
    id: "knowledge",
    match: "knowledge",
    title: "Knowledge",
    purpose: "Maintain knowledge-base entries citizens can browse.",
    howTo: ["Keep titles searchable; publish only when body is complete."],
    actions: [{ id: "create-kb", label: "Create / edit", body: "CRUD + transition for knowledge entries." }],
  },
  {
    id: "courses",
    match: "courses",
    title: "Courses",
    purpose: "Legacy course records — prefer civic Modules for new Learning Hub content.",
    howTo: ["Use Modules for new curricula; courses remain for older content."],
    actions: [{ id: "edit-course", label: "Edit course", body: "Updates course metadata (publish may require Django)." }],
  },
  {
    id: "media",
    match: "media",
    title: "Media",
    purpose: "Upload assets and sync YouTube so chapters can reuse videos.",
    howTo: ["Sync YouTube before attaching videos in the module builder."],
    actions: [
      { id: "upload", label: "Upload", body: "Stores a media file for reuse in content." },
      { id: "youtube-sync", label: "YouTube sync", body: "Pulls channel videos into the admin library." },
    ],
  },
  {
    id: "feedback",
    match: "feedback",
    title: "Feedback",
    purpose: "Read citizen ratings and comments on modules, chapters, and articles.",
    howTo: ["Filter by content type to triage what needs a content fix."],
    actions: [{ id: "filter", label: "Filters", body: "Narrow feedback by module, chapter, or status." }],
  },
  {
    id: "engagement",
    match: /^engagement$/,
    title: "Engagement hub",
    purpose: "Overview of surveys, trivia, events, and forum activity in one place.",
    howTo: ["Use this as a launchpad; deep work happens in each child page."],
    actions: [{ id: "open-child", label: "Section links", body: "Opens Surveys, Trivia, Events, or Forum." }],
  },
  {
    id: "surveys",
    match: /^surveys/,
    title: "Surveys",
    purpose: "Build surveys, publish them, and inspect results.",
    howTo: ["Add questions while draft; publish when ready to collect responses."],
    actions: [
      { id: "create-survey", label: "Create survey", body: "Starts a survey with title and settings." },
      { id: "results", label: "Results", body: "Opens aggregated responses for that survey." },
    ],
  },
  {
    id: "trivia",
    match: /^trivia/,
    title: "Trivia",
    purpose: "Standalone trivia quizzes (also embeddable from the module builder).",
    howTo: ["Link source content when the quiz belongs to a module or article."],
    actions: [
      { id: "create-trivia", label: "Create trivia", body: "Creates a quiz shell and question list." },
      { id: "attempts", label: "Attempts", body: "Inspect how citizens scored." },
    ],
  },
  {
    id: "events",
    match: "events",
    title: "Events",
    purpose: "Manage public events and optional galleries.",
    howTo: ["Publish dates clearly; attach galleries after the event exists."],
    actions: [{ id: "create-event", label: "Create / edit", body: "CRUD for events and gallery media." }],
  },
  {
    id: "forum",
    match: /^forum/,
    title: "Forum",
    purpose: "Moderate community threads and soft-delete harmful posts.",
    howTo: ["Open a thread to review posts; soft-delete instead of hard wipe."],
    actions: [
      { id: "open-thread", label: "Open thread", body: "Shows posts and moderation actions." },
      { id: "soft-delete", label: "Soft delete", body: "Hides content without destroying audit history." },
    ],
  },
  {
    id: "communication",
    match: /^communication$/,
    title: "Communication dashboard",
    purpose: "See campaign, inbox, and subscriber health before sending.",
    howTo: ["Check Outbox failures before launching a new campaign."],
    actions: [{ id: "open-campaigns", label: "Campaigns", body: "Build and schedule email campaigns." }],
  },
  {
    id: "campaigns",
    match: "communication/campaigns",
    title: "Campaigns",
    purpose: "Compose, preview, schedule, and send newsletters.",
    howTo: ["Preview → schedule or send. Confirm subscribers first."],
    actions: [
      { id: "create-campaign", label: "Create", body: "Starts a campaign draft." },
      { id: "send", label: "Send / schedule", body: "Queues delivery; watch Outbox for failures." },
    ],
  },
  {
    id: "inbox",
    match: "communication/inbox",
    title: "Inbox",
    purpose: "Read inbound messages and mark them handled.",
    howTo: ["Mark read after you action the item so the badge stays accurate."],
    actions: [{ id: "mark-read", label: "Mark read", body: "Clears unread state for that message." }],
  },
  {
    id: "outbox",
    match: "communication/outbox",
    title: "Outbox",
    purpose: "Track outbound email delivery and retry failures.",
    howTo: ["Retry failed dispatches after fixing template or recipient issues."],
    actions: [{ id: "retry", label: "Retry / dispatch", body: "Re-queues a failed send." }],
  },
  {
    id: "contact-messages",
    match: "communication/contact-messages",
    title: "Contact messages",
    purpose: "Respond to form submissions from the public site.",
    howTo: ["Reply from here when possible so history stays in one place."],
    actions: [
      { id: "reply", label: "Reply", body: "Sends a response to the contact." },
      { id: "delete", label: "Delete", body: "Removes the message after it is handled." },
    ],
  },
  {
    id: "email-hooks",
    match: "communication/email-hooks",
    title: "Email hooks",
    purpose: "Inspect automated email triggers and resend when needed.",
    howTo: ["Resend only after confirming the recipient still needs the message."],
    actions: [{ id: "resend", label: "Resend", body: "Fires the hook again for that event." }],
  },
  {
    id: "subscribers",
    match: "communication/subscribers",
    title: "Subscribers",
    purpose: "View newsletter subscribers (list is read-focused).",
    howTo: ["Use campaigns to message this list; manage opt-outs carefully."],
    actions: [{ id: "search", label: "Search", body: "Find a subscriber by email or name." }],
  },
  {
    id: "notifications",
    match: "communication/notifications",
    title: "Notifications",
    purpose: "Configure notification rules and review history.",
    howTo: ["Toggle rules off when a channel is noisy."],
    actions: [{ id: "toggle-rule", label: "Toggle rule", body: "Enables or disables an automated notification." }],
  },
  {
    id: "audit-logs",
    match: "communication/audit-logs",
    title: "Audit logs",
    purpose: "Trace who changed what — useful for support and compliance.",
    howTo: ["Filter by actor or time when investigating an incident."],
    actions: [{ id: "filter-logs", label: "Filters", body: "Narrow the audit trail." }],
  },
  {
    id: "social",
    match: "social",
    title: "Social / TikTok",
    purpose: "Manage TikTok (and social) content tied to campaigns.",
    howTo: ["Keep drafts until captions and assets are approved."],
    actions: [{ id: "create-social", label: "Create / edit", body: "CRUD for social video entries." }],
  },
  {
    id: "docrepository",
    match: "docrepository",
    title: "Document repository",
    purpose: "Upload files, folders, and links the team and citizens may need.",
    howTo: ["Prefer folders for FY / sector packs; use links for external Drive files."],
    actions: [
      { id: "upload", label: "Upload", body: "Adds a file to the repository." },
      { id: "folder", label: "New folder", body: "Groups related documents." },
    ],
  },
  {
    id: "settings",
    match: "settings",
    title: "Organization settings",
    purpose: "Org-wide configuration that affects branding and defaults.",
    howTo: ["Change carefully — settings apply to all admins and often the public site."],
    actions: [{ id: "save-settings", label: "Save", body: "Persists org config." }],
  },
  {
    id: "partners",
    match: "partners",
    title: "Partners",
    purpose: "Maintain partner organizations shown on the site.",
    howTo: ["Deactivate instead of deleting when a partnership pauses."],
    actions: [{ id: "edit-partner", label: "Create / edit", body: "Updates partner profile and active flag." }],
  },
  {
    id: "roles",
    match: "roles",
    title: "Roles",
    purpose: "Define permission sets assigned to users.",
    howTo: ["System roles are protected — duplicate before experimenting."],
    actions: [{ id: "edit-role", label: "Edit role", body: "Adjust permissions for a role." }],
  },
  {
    id: "gamification",
    match: "gamification",
    title: "Gamification",
    purpose: "Tune points rules and badges for learning engagement.",
    howTo: ["Seed defaults first if the list is empty, then adjust."],
    actions: [
      { id: "seed-rules", label: "Seed rules", body: "Loads recommended baseline rules." },
      { id: "badges", label: "Badges", body: "Create or deactivate badges." },
    ],
  },
  {
    id: "studio",
    match: "studio",
    title: "Studio",
    purpose: "Manage studio services, bookings, and project milestones.",
    howTo: ["Confirm bookings, then update milestones as work progresses."],
    actions: [{ id: "bookings", label: "Bookings / services", body: "CRUD for studio offerings and requests." }],
  },
  {
    id: "ke-budget",
    match: "ke-budget",
    title: "KE Budget",
    purpose: "Work with fiscal years and allocations for Kenya budget analysis.",
    howTo: ["Select a fiscal year before editing allocations."],
    actions: [{ id: "save-allocations", label: "Save allocations", body: "Writes allocation rows for the FY." }],
  },
  {
    id: "invoices",
    match: "invoices",
    title: "Invoices",
    purpose: "Create and track invoices for studio or org billing.",
    howTo: ["Keep status updated so finance reports stay accurate."],
    actions: [{ id: "create-invoice", label: "Create / edit", body: "Invoice CRUD." }],
  },
  {
    id: "privacy",
    match: "privacy",
    title: "Privacy",
    purpose: "Review privacy configuration shown to your org.",
    howTo: ["Contact leadership if values need to change — some fields are read-only here."],
    actions: [{ id: "view-privacy", label: "View config", body: "Displays current privacy settings." }],
  },
  {
    id: "security",
    match: "security",
    title: "Security",
    purpose: "Account security — password change and session-related info.",
    howTo: ["Use a unique password; change it after any shared-device use."],
    actions: [{ id: "change-password", label: "Change password", body: "Updates your login password." }],
  },
];

export function resolveTeachingGuide(localDashboardPath: string): TeachingPageGuide | null {
  const path = localDashboardPath.replace(/^\/+|\/+$/g, "");
  // Prefer longer / more specific matches (regex and string)
  const scored = ADMIN_TEACHING_PAGES.map((guide) => {
    if (typeof guide.match === "string") {
      const ok = path === guide.match || path.startsWith(`${guide.match}/`);
      return { guide, score: ok ? guide.match.length : -1 };
    }
    const ok = guide.match.test(path);
    return { guide, score: ok ? 1000 + path.length : -1 };
  }).filter((x) => x.score >= 0);

  if (!scored.length) return null;
  scored.sort((a, b) => b.score - a.score);
  return scored[0].guide;
}
