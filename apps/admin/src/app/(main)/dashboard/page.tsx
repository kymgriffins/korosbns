"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  FileText,
  GraduationCap,
  MessageSquare,
  Notebook,
  Users,
  Video,
  File,
  Building2,
  Landmark,
  PenSquare,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  adminUsersApi,
  adminContentApi,
  adminModulesApi,
  adminForumApi,
} from "@/lib/admin-api";

type DashboardStats = {
  totalUsers: number;
  totalContent: number;
  totalModules: number;
  activeForumThreads: number;
  contentByType: Record<string, number>;
};

function StatCard({
  title,
  value,
  icon: Icon,
  href,
  loading,
}: {
  title: string;
  value: number;
  icon: any;
  href: string;
  loading?: boolean;
}) {
  return (
    <Link href={href} className="block">
      <Card className="transition-colors hover:bg-muted/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{value.toLocaleString()}</div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

const contentTypes = [
  { id: "articles", label: "Articles", icon: FileText, color: "text-blue-500" },
  { id: "videos", label: "Videos", icon: Video, color: "text-red-500" },
  { id: "stories", label: "Stories", icon: BookOpen, color: "text-green-500" },
  { id: "documents", label: "Documents", icon: File, color: "text-amber-500" },
];

const quickLinks = [
  { title: "Users", href: "/dashboard/users/crud", icon: Users, description: "Manage users and permissions" },
  { title: "Roles", href: "/dashboard/roles/crud", icon: Building2, description: "Manage roles and permissions" },
  { title: "Content", href: "/dashboard/content", icon: FileText, description: "Manage articles, videos, stories" },
  { title: "Modules", href: "/dashboard/modules", icon: GraduationCap, description: "Manage civic modules" },
  { title: "Authors", href: "/dashboard/authors", icon: PenSquare, description: "Manage content authors" },
  { title: "Budget Data", href: "/dashboard/budget-data", icon: Landmark, description: "Upload and manage budget records" },
  { title: "Forum", href: "/dashboard/forum", icon: MessageSquare, description: "Moderate forum threads" },
  { title: "Notes", href: "/dashboard/notes", icon: Notebook, description: "Manage weekly notes and audits" },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalContent: 0,
    totalModules: 0,
    activeForumThreads: 0,
    contentByType: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, modulesRes, forumRes] = await Promise.allSettled([
          adminUsersApi.list({ page: 1 }),
          adminModulesApi.list({ page: 1 }),
          adminForumApi.listThreads({ page: 1 }),
        ]);

        let totalContent = 0;
        const contentByType: Record<string, number> = {};

        const contentResults = await Promise.allSettled(
          contentTypes.map((ct) =>
            adminContentApi.list(ct.id, { page: 1 }).then((res) => ({ type: ct.id, count: res.count }))
          )
        );
        for (const result of contentResults) {
          if (result.status === "fulfilled") {
            contentByType[result.value.type] = result.value.count;
            totalContent += result.value.count;
          }
        }

        setStats({
          totalUsers: usersRes.status === "fulfilled" ? usersRes.value.count : 0,
          totalContent,
          totalModules: modulesRes.status === "fulfilled" ? modulesRes.value.count : 0,
          activeForumThreads: forumRes.status === "fulfilled" ? forumRes.value.count : 0,
          contentByType,
        });
      } catch {
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl tracking-tight">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Overview of your platform statistics and management tools.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          href="/dashboard/users/crud"
          loading={loading}
        />
        <StatCard
          title="Total Content"
          value={stats.totalContent}
          icon={FileText}
          href="/dashboard/content"
          loading={loading}
        />
        <StatCard
          title="Total Modules"
          value={stats.totalModules}
          icon={GraduationCap}
          href="/dashboard/modules"
          loading={loading}
        />
        <StatCard
          title="Active Forum Threads"
          value={stats.activeForumThreads}
          icon={MessageSquare}
          href="/dashboard/forum"
          loading={loading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content Breakdown</CardTitle>
            <CardDescription>Content items by type</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {contentTypes.map((ct) => (
                  <div key={ct.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ct.icon className={`size-4 ${ct.color}`} />
                      <span className="text-sm">{ct.label}</span>
                    </div>
                    <Badge variant="outline" className="font-mono">
                      {stats.contentByType[ct.id] ?? 0}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Links</CardTitle>
            <CardDescription>Navigate to management sections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-lg border border-border/50 p-3 text-sm transition-colors hover:bg-muted/50"
                >
                  <link.icon className="size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{link.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{link.description}</div>
                  </div>
                  <ChevronRight className="size-3 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
