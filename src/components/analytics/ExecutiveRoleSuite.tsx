"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Crown,
  ShieldAlert,
  UserCheck,
  Briefcase,
  PenTool,
  Users,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  ShieldCheck,
  ChevronDown,
  Layers,
  ArrowRight,
  Shield,
  Key,
} from "lucide-react";
import { GodModeApprovalBanner } from "@/components/admin/GodModeApprovalBanner";

export type RoleType = "ceo" | "admin" | "manager" | "editor" | "citizen";

export type RolePermissionInfo = {
  id: RoleType;
  title: string;
  badge: string;
  email: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  icon: React.ReactNode;
  userStory: string;
  activatedFeatures: string[];
};

export const MASTER_EXECUTIVE_EMAIL = "info@budgetndiostory.org";

export const ROLES_CATALOG: Record<RoleType, RolePermissionInfo> = {
  ceo: {
    id: "ceo",
    title: "Chief Executive Officer (CEO)",
    badge: "Executive Leadership & Master Superuser",
    email: MASTER_EXECUTIVE_EMAIL,
    colorClass: "text-amber-500",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/30",
    icon: <Crown className="size-5 text-amber-500" />,
    userStory: "As CEO (info@budgetndiostory.org), I hold all-time platform analytics, bandwidth consumption, citizen impact, and financial execution summaries to lead nationwide civic growth.",
    activatedFeatures: [
      "All-Time Bandwidth & Data Consumed Analytics (1.37 TB Served)",
      "Executive Dashboard & High-Impact Citizen Metrics",
      "County Budget Allocation & Nationwide Coverage (47 Counties)",
      "Financial Invoice & Budget Execution Summaries",
      "Board Audit & Quality Assurance PDF/CSV/JSON Report Export",
      "God Mode Master Authorization over All User CRUD Actions",
    ],
  },
  admin: {
    id: "admin",
    title: "System Administrator Role",
    badge: "Assigned to info@budgetndiostory.org",
    email: MASTER_EXECUTIVE_EMAIL,
    colorClass: "text-rose-500",
    bgClass: "bg-rose-500/10",
    borderClass: "border-rose-500/30",
    icon: <ShieldAlert className="size-5 text-rose-500" />,
    userStory: "As Administrator (info@budgetndiostory.org), I manage user accounts, assign roles, enforce DPA data retention, configure security headers, and maintain the document repository.",
    activatedFeatures: [
      "User Management & Role Assignment (`INVITE_ROLE_OPTIONS`)",
      "Security Audits, Headers & Data Protection (DPA) Config",
      "Doc Repository Upload & File System Permissions",
      "System Uptime & Latency Monitoring (99.94% SLA)",
      "System Log Inspection & Audit Trail Control",
    ],
  },
  manager: {
    id: "manager",
    title: "Operations Manager Role",
    badge: "Assigned to info@budgetndiostory.org",
    email: MASTER_EXECUTIVE_EMAIL,
    colorClass: "text-blue-500",
    bgClass: "bg-blue-500/10",
    borderClass: "border-blue-500/30",
    icon: <Briefcase className="size-5 text-blue-500" />,
    userStory: "As Operations Manager (info@budgetndiostory.org), I oversee civic learning modules, audit weekly notes, analyze survey results, and manage trivia sets and townhall events.",
    activatedFeatures: [
      "Civic Module & Chapter Workflow Transitions",
      "Weekly Cabinet Notes Review & Audit Sign-Off",
      "Public Survey Results & Aggregated Feedback",
      "Trivia Quizzes & Gamification Leaderboard Oversight",
      "Event Scheduling & Studio Booking Management",
    ],
  },
  editor: {
    id: "editor",
    title: "Content Editor Role",
    badge: "Assigned to info@budgetndiostory.org",
    email: MASTER_EXECUTIVE_EMAIL,
    colorClass: "text-purple-500",
    bgClass: "bg-purple-500/10",
    borderClass: "border-purple-500/30",
    icon: <PenTool className="size-5 text-purple-500" />,
    userStory: "As Content Editor (info@budgetndiostory.org), I draft, format, and publish budget explainers, articles, weekly notes, and TikTok video content for youth engagement.",
    activatedFeatures: [
      "Learn Hub Article & Deep Dive Authoring",
      "Weekly Cabinet Notes Draft & Section Editing",
      "TikTok & Media Embed Management",
      "Rich Text Editor & Notion Wrapper Formatting",
      "Content Tagging & Category Taxonomies",
    ],
  },
  citizen: {
    id: "citizen",
    title: "Engaged Citizen / Learner Role",
    badge: "Assigned to info@budgetndiostory.org",
    email: MASTER_EXECUTIVE_EMAIL,
    colorClass: "text-emerald-500",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/30",
    icon: <Users className="size-5 text-emerald-500" />,
    userStory: "As an Engaged Citizen (info@budgetndiostory.org), I explore county budgets, complete civic modules, attempt trivia challenges, submit feedback surveys, and track my learning badges.",
    activatedFeatures: [
      "Interactive 47-County Budget & Allocation Explorer",
      "Civic Modules & Chapter Self-Paced Learning",
      "Trivia Quizzes & Point Gamification Badges",
      "Public Survey Feedback Submission",
      "Weekly Cabinet Notes Reading & Bookmark Collection",
    ],
  },
};

type Props = {
  activeRole: RoleType;
  onRoleChange: (role: RoleType) => void;
};

export function ExecutiveRoleSuite({ activeRole, onRoleChange }: Props) {
  const currentRole = ROLES_CATALOG[activeRole];
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [exportedFormat, setExportedFormat] = useState<string | null>(null);

  const handleExport = (format: "csv" | "json" | "pdf") => {
    setExportedFormat(format.toUpperCase());
    const dataStr = JSON.stringify(
      {
        masterAccount: MASTER_EXECUTIVE_EMAIL,
        activeRolePersona: currentRole.id,
        roleTitle: currentRole.title,
        timestamp: new Date().toISOString(),
        assignedRoles: ["ceo", "admin", "manager", "editor", "citizen"],
        godModeStatus: "ACTIVATED",
        activatedFeatures: currentRole.activatedFeatures,
      },
      null,
      2,
    );

    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bns_qa_master_role_report_${currentRole.id}.${format}`;
    a.click();
    URL.revokeObjectURL(url);

    setTimeout(() => setExportedFormat(null), 3000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-md p-6 space-y-6">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/10 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* CEO Executive Access Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-border/60 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
            <Crown className="size-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                God Mode Approver: All Roles Assigned
              </span>
              <span className="text-xs text-muted-foreground">
                Master Email: <code className="text-foreground font-bold px-1.5 py-0.5 rounded bg-muted">{MASTER_EXECUTIVE_EMAIL}</code>
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-heading text-foreground mt-0.5">
              God Mode Authorization & Role Control Suite
            </h2>
          </div>
        </div>

        {/* Role Switcher Button */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-muted/60 transition-all font-semibold text-xs text-foreground shadow-xs"
          >
            <div className={`p-1 rounded-md ${currentRole.bgClass}`}>{currentRole.icon}</div>
            <div className="text-left">
              <div className="text-[10px] text-muted-foreground font-normal uppercase tracking-wider">
                Assigned Role Persona
              </div>
              <div className="text-xs font-bold text-foreground">{currentRole.title}</div>
            </div>
            <ChevronDown className="size-4 text-muted-foreground ml-2" />
          </button>

          {/* Role Selection Dropdown Menu */}
          <AnimatePresence>
            {showRoleMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-card shadow-2xl p-2 z-50 space-y-1"
              >
                <div className="px-3 py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/40">
                  Switch Active Role Persona ({MASTER_EXECUTIVE_EMAIL})
                </div>
                {(Object.keys(ROLES_CATALOG) as RoleType[]).map((rKey) => {
                  const roleItem = ROLES_CATALOG[rKey];
                  const isSelected = activeRole === rKey;
                  return (
                    <button
                      key={rKey}
                      onClick={() => {
                        onRoleChange(rKey);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${
                        isSelected
                          ? "bg-primary/10 border border-primary/20 text-foreground font-semibold"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`p-1.5 rounded-lg ${roleItem.bgClass}`}>{roleItem.icon}</div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate text-foreground">{roleItem.title}</div>
                          <div className="text-[10px] text-muted-foreground truncate">{MASTER_EXECUTIVE_EMAIL}</div>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="size-4 text-primary shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Role Details & User Story Activation Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Left Column: User Story & Credentials */}
        <div className="lg:col-span-1 space-y-4">
          <div className={`p-4 rounded-xl border ${currentRole.borderClass} ${currentRole.bgClass} space-y-2`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${currentRole.colorClass}`}>{currentRole.badge}</span>
              <UserCheck className={`size-4 ${currentRole.colorClass}`} />
            </div>
            <div className="text-base font-bold text-foreground">{currentRole.title}</div>
            <div className="text-xs text-muted-foreground font-mono flex items-center gap-1.5">
              <Key className="size-3 text-primary" />
              <span>{MASTER_EXECUTIVE_EMAIL}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-muted/30 space-y-2">
            <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-primary" />
              <span>User Story & Authorization Scope</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed italic">"{currentRole.userStory}"</p>
          </div>

          {/* Report Export Button */}
          <div className="p-4 rounded-xl border border-border/60 bg-card space-y-3">
            <div className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Master Role Audit Export</span>
              <Download className="size-3.5 text-primary" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleExport("csv")}
                className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-muted/40 hover:bg-muted text-xs font-bold text-foreground transition-colors"
              >
                <FileSpreadsheet className="size-3 text-emerald-500" />
                <span>CSV</span>
              </button>
              <button
                onClick={() => handleExport("json")}
                className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-muted/40 hover:bg-muted text-xs font-bold text-foreground transition-colors"
              >
                <FileText className="size-3 text-blue-500" />
                <span>JSON</span>
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-muted/40 hover:bg-muted text-xs font-bold text-foreground transition-colors"
              >
                <Download className="size-3 text-amber-500" />
                <span>PDF</span>
              </button>
            </div>
            {exportedFormat && (
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 text-center animate-fade-in">
                ✓ Master Role Report Exported ({exportedFormat})
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Activated Functionalities List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Layers className="size-4 text-primary" />
              <span>Assigned Functionalities for {currentRole.title}</span>
            </h3>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="size-3.5" />
              <span>God Mode Approver: {MASTER_EXECUTIVE_EMAIL}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentRole.activatedFeatures.map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl border border-border/50 bg-card hover:bg-muted/40 transition-colors"
              >
                <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="size-4" />
                </div>
                <div className="text-xs font-medium text-foreground leading-snug">{feature}</div>
              </div>
            ))}
          </div>

          {/* Quick Access Link to Admin Suite */}
          <div className="pt-2 flex justify-end">
            <a
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors shadow-xs"
            >
              <span>Access Admin Suite with Master Account</span>
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Embedded God Mode Approval & Denial Queue */}
      <div className="pt-4 border-t border-border/60">
        <GodModeApprovalBanner currentEmail={MASTER_EXECUTIVE_EMAIL} />
      </div>
    </div>
  );
}
