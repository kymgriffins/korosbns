/**
 * Learning Hub teaching catalog — citizen-facing copy for /learn.
 */

import type { TeachingActionTip, TeachingPageGuide } from "./teaching-catalog";

export type { TeachingActionTip, TeachingPageGuide };

export const LEARN_TEACHING_PAGES: TeachingPageGuide[] = [
  {
    id: "learn-home",
    match: /^$/,
    title: "Your learning dashboard",
    purpose: "See what to continue, pick a module, and track your progress on Kenya’s budget story.",
    howTo: [
      "Start or resume a module from the cards below.",
      "Use the sidebar to jump to Documents, Forum, or your Profile.",
    ],
    actions: [
      {
        id: "continue-module",
        label: "Continue / Start",
        body: "Opens a module so you can pick up where you left off or begin a new path.",
      },
      {
        id: "open-modules",
        label: "Modules",
        body: "Browse the full catalogue of civic learning modules.",
      },
    ],
  },
  {
    id: "learn-modules",
    match: /^modules$/,
    title: "Learning modules",
    purpose: "Browse civic modules — each one teaches a piece of Kenya’s public finance story.",
    howTo: [
      "Filter by All, In progress, or Completed.",
      "Open a module to walk through its chapters (steps), videos, and quizzes.",
    ],
    actions: [
      {
        id: "filter-tabs",
        label: "Filters",
        body: "Show all modules, only ones you started, or ones you finished.",
      },
      {
        id: "open-module",
        label: "Open module",
        body: "Enter the module detail page to learn chapter by chapter.",
      },
      {
        id: "search-modules",
        label: "Search",
        body: "Find a module by title or topic.",
      },
    ],
  },
  {
    id: "learn-module-detail",
    match: /^modules\/[^/]+$/,
    title: "Inside a module",
    purpose: "Work through chapters in order — read, watch, and take quizzes when they appear.",
    howTo: [
      "Complete a chapter to unlock progress on your dashboard.",
      "Trivia (if present) checks what you learned — try it when you feel ready.",
    ],
    actions: [
      {
        id: "chapter-step",
        label: "Chapter / step",
        body: "Opens reading, video, or activity for that part of the module.",
      },
      {
        id: "mark-progress",
        label: "Progress",
        body: "Your completions save so you can continue later on any device when signed in.",
      },
    ],
  },
  {
    id: "learn-documents",
    match: "documents",
    title: "Documents",
    purpose: "Find budget papers, commentaries, and tracked files tied to your learning.",
    howTo: ["Use tabs to switch between all docs, tracked items, and commentaries."],
    actions: [
      {
        id: "doc-tabs",
        label: "Document tabs",
        body: "Filter the library so you only see what you need.",
      },
      {
        id: "open-doc",
        label: "Open document",
        body: "View or download the selected file.",
      },
    ],
  },
  {
    id: "learn-forum",
    match: "forum",
    title: "Forum",
    purpose: "Discuss budget topics with other citizens and ask questions.",
    howTo: ["Read threads first; reply when you have something to add. Be respectful."],
    actions: [
      {
        id: "open-thread",
        label: "Open thread",
        body: "Shows posts and replies in that conversation.",
      },
      {
        id: "new-post",
        label: "Post / reply",
        body: "Share your view or answer someone else’s question.",
      },
    ],
  },
  {
    id: "learn-profile",
    match: "profile",
    title: "Your profile",
    purpose: "See your progress, badges, and how you appear to others in the hub.",
    howTo: ["Update your display name and preferences so learning feels personal."],
    actions: [
      {
        id: "edit-profile",
        label: "Edit profile",
        body: "Change name, county, or learning preferences.",
      },
      {
        id: "view-badges",
        label: "Badges / stats",
        body: "Shows what you have earned from modules and quizzes.",
      },
    ],
  },
  {
    id: "learn-alerts",
    match: "alerts",
    title: "Alerts",
    purpose: "Catch important updates about your learning and civic content.",
    howTo: ["Clear or open alerts so nothing important sits unread."],
    actions: [
      {
        id: "open-alert",
        label: "Open alert",
        body: "Takes you to the related module, document, or message.",
      },
    ],
  },
  {
    id: "learn-videos",
    match: "videos",
    title: "Videos",
    purpose: "Watch explainers about the budget, finance bill, and civic processes.",
    howTo: ["Pick a video that matches a module you are studying for better retention."],
    actions: [
      {
        id: "play-video",
        label: "Play",
        body: "Opens the selected video for watching.",
      },
    ],
  },
  {
    id: "learn-articles",
    match: "articles",
    title: "Articles",
    purpose: "Read deeper explainers that complement the modules.",
    howTo: ["Save or revisit articles that answer questions from a module chapter."],
    actions: [
      {
        id: "open-article",
        label: "Open article",
        body: "Reads the full article page.",
      },
    ],
  },
  {
    id: "learn-stories",
    match: "stories",
    title: "Stories",
    purpose: "Human stories that make public finance feel real and local.",
    howTo: ["Use stories when you want context, not just numbers."],
    actions: [
      {
        id: "open-story",
        label: "Open story",
        body: "Opens the full narrative.",
      },
    ],
  },
  {
    id: "learn-quests",
    match: "quests",
    title: "Quests",
    purpose: "Short challenges that earn progress and keep learning playful.",
    howTo: ["Complete a quest after finishing related module chapters."],
    actions: [
      {
        id: "start-quest",
        label: "Start quest",
        body: "Begins the challenge and tracks completion.",
      },
    ],
  },
  {
    id: "learn-account",
    match: /^account/,
    title: "Account settings",
    purpose: "Manage password, notifications, and sign-out for your Learning Hub account.",
    howTo: ["Change password on a trusted device; review notification choices."],
    actions: [
      {
        id: "save-account",
        label: "Save",
        body: "Stores your account preference changes.",
      },
      {
        id: "sign-out",
        label: "Sign out",
        body: "Ends your session on this device.",
      },
    ],
  },
];

export function resolveLearnTeachingGuide(localLearnPath: string): TeachingPageGuide | null {
  const path = localLearnPath.replace(/^\/+|\/+$/g, "");
  const scored = LEARN_TEACHING_PAGES.map((guide) => {
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
