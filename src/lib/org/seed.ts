import { socialLinks, footerLinks } from "@/constants/links";
import { team } from "@/constants/team";

type OrgPartner = {
  id: string;
  name: string;
  website: string;
  role: string;
};

type OrgActivity = {
  id: string;
  title: string;
  description: string;
  channels: string[];
};

type OrgPlatform = {
  name: string;
  url: string;
  type: "social" | "website" | "community";
};

type OrgImpactMetric = {
  id: string;
  label: string;
  value: string;
  note?: string;
};

type OrgProgram = {
  id: string;
  name: string;
  stage: "active" | "upcoming" | "pilot";
  focus: string;
  description: string;
};

type OrgTaskStatus = "todo" | "in_progress" | "done" | "blocked";

type OrgTaskPriority = "low" | "medium" | "high";

type OrgTask = {
  id: string;
  title: string;
  owner: string;
  due: string;
  status: OrgTaskStatus;
  priority: OrgTaskPriority;
  notes?: string;
};

type OrgMeeting = {
  id: string;
  date: string;
  title: string;
  summary: string;
  actionItems: OrgTask[];
};

type OrgSeed = {
  id: string;
  shortName: string;
  legalName: string;
  website: string;
  appUrl: string;
  locale: string;
  country: string;
  tagline: string;
  mission: string;
  overview: string;
  valueProposition: string[];
  consortium: {
    summary: string;
    partners: OrgPartner[];
  };
  activities: OrgActivity[];
  programs: OrgProgram[];
  platforms: OrgPlatform[];
  impact: OrgImpactMetric[];
  leadership: {
    advisor: typeof team;
    executive: typeof team;
    directors: typeof team;
    operations: typeof team;
  };
  references: {
    publicPages: { label: string; href: string }[];
    footerSections: typeof footerLinks;
  };
  meetings: OrgMeeting[];
  seedVersion: string;
  generatedAt: string;
};

const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Budget Ndio Story",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://budgetndiostory.org",
};

const advisor = team.filter((member) => member.role === "Board Advisor");
const executive = team.filter((member) => member.role === "Executive Director");
const directors = team.filter(
  (member) =>
    member.role.toLowerCase().includes("director") &&
    member.role !== "Board Advisor" &&
    member.role !== "Executive Director"
);
const operations = team.filter(
  (member) =>
    member.role !== "Board Advisor" &&
    member.role !== "Executive Director" &&
    !member.role.toLowerCase().includes("director")
);

export const ORG_SEED: OrgSeed = {
  id: "bns-kenya",
  shortName: "BNS",
  legalName: env.appName,
  website: env.siteUrl,
  appUrl: env.appUrl,
  locale: "en-KE",
  country: "Kenya",
  tagline:
    "A youth-led initiative translating public budgets into accessible, actionable civic knowledge.",
  mission:
    "Make national and county budgets understandable and relevant to young people so they can engage in fiscal processes and demand accountability.",
  overview:
    "Budget Ndio Story is a Kenya-wide youth-led consortium that turns public finance information into explainers, videos, and actionable tools for civic participation.",
  valueProposition: [
    "Simplifies technical fiscal documents into relatable stories.",
    "Builds youth chapter capacity for budget monitoring and organizing.",
    "Connects creators, journalists, experts, and communities around evidence-based accountability.",
    "Links budget choices to everyday realities: jobs, healthcare, education, housing, and cost of living.",
  ],
  consortium: {
    summary:
      "BNS is led by The Continental Pot, Colour Twist Media, and Sen Media & Events to expand youth fiscal literacy and participation across Kenya.",
    partners: [
      {
        id: "sen-media-events",
        name: "Sen Media & Events",
        website: "https://senmedia-events.co.ke/",
        role: "Media production, events, and civic storytelling support",
      },
      {
        id: "continental-pot",
        name: "The Continental Pot",
        website: "https://continentalpot.africa/",
        role: "Consortium leadership and public interest strategy",
      },
      {
        id: "colour-twist-media",
        name: "Colour Twist Media",
        website: "https://colortwistmedia.com/",
        role: "Creative production and youth-facing media execution",
      },
    ],
  },
  activities: [
    {
      id: "simplify-budgets",
      title: "Simplifying Budgets",
      description:
        "Breaks complex budget information into short-form, accessible formats including Reels, TikTok videos, explainers, and podcasts.",
      channels: ["TikTok", "YouTube", "Instagram", "Podcast"],
    },
    {
      id: "youth-chapters-training",
      title: "Youth Chapters and Training",
      description:
        "Builds youth chapters and trains budget organizers across communities and campuses to track allocations and understand fiscal processes.",
      channels: ["Campus sessions", "Community workshops", "Learning modules"],
    },
    {
      id: "community-monitoring",
      title: "Community Monitoring",
      description:
        "Supports accountability snapshots that compare public promises with delivery outcomes and local evidence.",
      channels: ["County scorecards", "Public dialogues", "Community trackers"],
    },
    {
      id: "journalist-expert-engagement",
      title: "Journalist and Expert Engagement",
      description:
        "Strengthens public discourse through media training and verification support for youth creators, journalists, and domain experts.",
      channels: ["Newsrooms", "Verification hub", "Policy roundtables"],
    },
  ],
  programs: [
    {
      id: "project-terra",
      name: "Project TERRA",
      stage: "active",
      focus: "Fiscal governance in the digital economy",
      description:
        "Explores equity and power in taxation and public spending as digital systems reshape governance and service delivery.",
    },
    {
      id: "budget-verification-hub",
      name: "Budget Verification Hub",
      stage: "upcoming",
      focus: "Evidence-backed public reporting",
      description:
        "Provides a support layer for validating fiscal claims and improving the quality of youth-led and media coverage.",
    },
    {
      id: "youth-budget-chapters",
      name: "Youth Budget Chapters",
      stage: "active",
      focus: "Civic organizing and local accountability",
      description:
        "Scales chapter-based civic action in campuses and communities for budget literacy and accountability monitoring.",
    },
  ],
  platforms: socialLinks.map((link) => ({
    name: link.label,
    url: link.href,
    type: "social" as const,
  })),
  impact: [
    { id: "reach", label: "Youth reached", value: "20k+", note: "From about page impact block" },
    { id: "views", label: "Content views", value: "1.2M+", note: "From about page impact block" },
    { id: "coverage", label: "Counties covered", value: "47", note: "Kenya county-wide coverage" },
    { id: "experience", label: "Years of work", value: "5+", note: "From about page impact block" },
  ],
  leadership: {
    advisor,
    executive,
    directors,
    operations,
  },
  references: {
    publicPages: [
      { label: "About", href: "/about" },
      { label: "Partners", href: "/partners" },
      { label: "Media", href: "/media" },
      { label: "Impact", href: "/impact" },
      { label: "Research", href: "/research" },
    ],
    footerSections: footerLinks,
  },
  meetings: [
    {
      id: "bns-leadership-2026-04-27",
      date: "2026-04-27",
      title: "BNS Leadership Meeting",
      summary:
        "Website updates got strong feedback but need external UX review. Partnership engagements are accelerating and require a tighter content and media framework.",
      actionItems: [
        {
          id: "task-engage-ui-expert",
          title: "Engage independent expert for professional UI/UX opinion",
          owner: "Budget Ndio Story",
          due: "2026-05-02",
          status: "todo",
          priority: "high",
        },
        {
          id: "task-share-strategy-docs",
          title: "Share strategic plan and context docs with Koros for website updates",
          owner: "Budget Ndio Story",
          due: "2026-04-28",
          status: "in_progress",
          priority: "high",
        },
        {
          id: "task-share-light-logo",
          title: "Share lighter version of logo file with Koros",
          owner: "Shem Ojunga",
          due: "2026-04-28",
          status: "todo",
          priority: "high",
        },
        {
          id: "task-fix-site-bugs",
          title: "Fix outstanding website bugs and update team",
          owner: "Koros",
          due: "2026-05-03",
          status: "in_progress",
          priority: "high",
        },
        {
          id: "task-share-short-videos",
          title: "Share short video assets via Google link with Koros",
          owner: "James Maingi",
          due: "2026-04-28",
          status: "todo",
          priority: "high",
        },
        {
          id: "task-share-youtube-integration",
          title: "Share easier YouTube integration methods with Koros",
          owner: "Budget Ndio Story",
          due: "2026-04-29",
          status: "todo",
          priority: "medium",
        },
        {
          id: "task-confirm-event-date",
          title: "Confirm law school student availability for May 15 event postponement",
          owner: "James Maingi",
          due: "2026-04-29",
          status: "todo",
          priority: "high",
        },
        {
          id: "task-design-survey-poster",
          title: "Finalize research survey poster for Wednesday launch",
          owner: "James Maingi",
          due: "2026-04-28",
          status: "todo",
          priority: "high",
        },
        {
          id: "task-prepare-tor",
          title: "Prepare partnership ToR for MPyana and Elizabeth engagement",
          owner: "James Maingi",
          due: "2026-04-30",
          status: "todo",
          priority: "medium",
        },
        {
          id: "task-prepare-yan-strategy",
          title: "Coordinate with Liz on strategy for Yan conversation (May 6-8)",
          owner: "James Maingi",
          due: "2026-05-05",
          status: "todo",
          priority: "medium",
        },
        {
          id: "task-email-aku",
          title: "Email AKU requesting podcast production date change from Thursday to Tuesday",
          owner: "Budget Ndio Story",
          due: "2026-04-28",
          status: "todo",
          priority: "high",
        },
        {
          id: "task-call-cra",
          title: "Call CRA contact and confirm Tuesday podcast schedule",
          owner: "James Maingi",
          due: "2026-04-28",
          status: "todo",
          priority: "high",
        },
        {
          id: "task-visit-alt-studio",
          title: "Visit alternative podcast studio and assess production setup",
          owner: "James Maingi",
          due: "2026-05-01",
          status: "todo",
          priority: "high",
        },
        {
          id: "task-reflect-team-strategy",
          title: "Reflect on team inclusion strategy and role clarity",
          owner: "Shem Ojunga",
          due: "2026-05-02",
          status: "todo",
          priority: "medium",
          notes: "Balance equipment constraints with team utilization.",
        },
        {
          id: "task-post-meeting-notes",
          title: "Post notes for last week and this week in group chat",
          owner: "Budget Ndio Story",
          due: "2026-04-28",
          status: "todo",
          priority: "medium",
        },
      ],
    },
  ],
  seedVersion: "1.0.0",
  generatedAt: new Date().toISOString(),
};

export type {
  OrgSeed,
  OrgPartner,
  OrgActivity,
  OrgPlatform,
  OrgImpactMetric,
  OrgProgram,
  OrgTask,
  OrgTaskPriority,
  OrgTaskStatus,
  OrgMeeting,
};

