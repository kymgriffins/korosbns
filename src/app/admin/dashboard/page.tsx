"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconBook2,
  IconClipboardList,
  IconGauge,
  IconNews,
  IconUserShield,
} from "@tabler/icons-react";
import React, { useEffect, useMemo, useState } from "react";
import { WorkflowPanel } from "@/components/admin/workflow-panel";
import { useRouter } from "next/navigation";

type HubSection = "dashboard" | "duty" | "academy" | "cms" | "org";
type AdminCapabilities = {
  can_view_admin: boolean;
  can_create_records: boolean;
  can_edit_records: boolean;
  can_delete_records: boolean;
  can_manage_users: boolean;
  can_manage_memberships: boolean;
  can_manage_quotes: boolean;
  can_publish_content: boolean;
};
type AdminMembership = {
  organization_id: string;
  organization_name: string;
  organization_slug: string;
  role: string;
  status: string;
};

const SECTION_DEFAULT_MODEL: Record<HubSection, string[]> = {
  dashboard: [],
  duty: ["activity", "project", "impactmetric", "roadmapitem"],
  academy: ["trivia", "story", "deepdivearticle", "knowledgeentry", "document", "docfolder"],
  cms: ["campaign", "teamquote", "subscriber", "partner", "program"],
  org: ["organization", "teammember", "organizationmember", "user", "auditlog", "changelog", "versioninfo", "gamificationprofile", "pointevent"],
};

const MODEL_TO_SECTION: Record<string, HubSection> = Object.entries(SECTION_DEFAULT_MODEL).reduce(
  (acc, [section, modelNames]) => {
    modelNames.forEach((modelName) => {
      acc[modelName] = section as HubSection;
    });
    return acc;
  },
  {} as Record<string, HubSection>
);

const SECTION_TITLES: Record<HubSection, string> = {
  dashboard: "Dashboard",
  duty: "Operations",
  academy: "Learn Hub",
  cms: "Social & Media",
  org: "Developer Tools",
};

const AdminDashboardPage = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<HubSection>("dashboard");
  const [activeModel, setActiveModel] = useState<string>("");
  const [models, setModels] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [capabilities, setCapabilities] = useState<AdminCapabilities | null>(null);
  const [membership, setMembership] = useState<AdminMembership | null>(null);

  const activateSection = (section: HubSection) => {
    setActiveSection(section);

    if (section === "dashboard") {
      setActiveModel("");
      return;
    }

    const preferred = SECTION_DEFAULT_MODEL[section];
    const available = preferred.find((name) => models.some((model) => model.name === name));
    if (available) {
      setActiveModel(available);
    }
  };

  useEffect(() => {
    const loadSidebarData = async () => {
      try {
        const [modelsRes, profileRes, contextRes] = await Promise.all([
          fetch("/api/admin/models", { cache: "no-store" }),
          fetch("/api/auth/profile", { cache: "no-store" }),
          fetch("/api/auth/admin-context", { cache: "no-store" }),
        ]);

        if (modelsRes.status === 401 || profileRes.status === 401 || contextRes.status === 401) {
          router.replace("/admin/login");
          return;
        }

        if (modelsRes.ok) {
          const modelsPayload = await modelsRes.json();
          const modelList = modelsPayload.models ?? [];
          setModels(modelList);
          setActiveModel((prev: string) => {
            if (prev) {
              return prev;
            }
            if (activeSection === "dashboard") {
              return "";
            }
            const nextModel = modelList[0]?.name || "";
            const mappedSection = MODEL_TO_SECTION[nextModel];
            if (mappedSection) {
              setActiveSection(mappedSection);
            }
            return nextModel;
          });
        }

        if (profileRes.ok) {
          const profilePayload = await profileRes.json();
          setProfile(profilePayload);
        }
        if (contextRes.ok) {
          const contextPayload = await contextRes.json();
          setCapabilities(contextPayload?.capabilities ?? null);
          setMembership(contextPayload?.membership ?? null);
        }
      } catch {
        // Sidebar can still render defaults when fetch fails.
      }
    };

    void loadSidebarData();
  }, [activeSection, router]);

  const availableModelNames = useMemo(() => new Set(models.map((model) => model.name)), [models]);
  const hubStats = useMemo(
    () => ({
      operations: SECTION_DEFAULT_MODEL.duty.filter((name) => availableModelNames.has(name)).length,
      learn: SECTION_DEFAULT_MODEL.academy.filter((name) => availableModelNames.has(name)).length,
      social: SECTION_DEFAULT_MODEL.cms.filter((name) => availableModelNames.has(name)).length,
      dev: SECTION_DEFAULT_MODEL.org.filter((name) => availableModelNames.has(name)).length,
    }),
    [availableModelNames]
  );

  const navMainItems = [
    {
      title: "Dashboard",
      url: "#",
      icon: IconGauge,
      onClick: () => activateSection("dashboard"),
      isActive: activeSection === "dashboard",
    },
    {
      title: "Operations",
      url: "#",
      icon: IconClipboardList,
      onClick: () => activateSection("duty"),
      isActive: activeSection === "duty",
    },
    {
      title: "Learn Hub",
      url: "#",
      icon: IconBook2,
      onClick: () => activateSection("academy"),
      isActive: activeSection === "academy",
    },
    {
      title: "Social & Media",
      url: "#",
      icon: IconNews,
      onClick: () => activateSection("cms"),
      isActive: activeSection === "cms",
    },
    {
      title: "Dev Tools",
      url: "#",
      icon: IconUserShield,
      onClick: () => activateSection("org"),
      isActive: activeSection === "org",
    },
  ];

  const activeModelName = useMemo(() => {
    return models.find((model) => model.name === activeModel)?.verbose_name ?? activeModel;
  }, [activeModel, models]);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 64)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        navMainItems={navMainItems}
        orgItems={[]}
        governanceItems={[]}
        models={models}
        activeModel={activeModel}
        onModelSelect={(name) => {
          setActiveModel(name);
          const mappedSection = MODEL_TO_SECTION[name];
          if (mappedSection) {
            setActiveSection(mappedSection);
          }
        }}
        user={
          profile
            ? {
                name:
                  `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "Admin",
                email: profile.email,
              }
            : undefined
        }
      />
      <SidebarInset>
        <SiteHeader
          title={SECTION_TITLES[activeSection]}
          subtitle={
            activeSection === "dashboard"
              ? "See org analytics and jump into the right workspace quickly."
              : `Managing ${activeModelName || "items"} in ${SECTION_TITLES[activeSection]}.`
          }
          orgLabel={membership?.organization_name}
          roleLabel={membership?.role ? `Role: ${membership.role}` : undefined}
        />
        {activeSection === "dashboard" ? (
          <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr] p-4 pt-0">
            <Card className="border-border/40 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Organization Analytics</CardTitle>
                <CardDescription>
                  High-level visibility so admins can decide what to do next.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-border/50 bg-muted p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Available data areas</p>
                  <p className="mt-2 text-3xl font-semibold">{models.length}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Data collections currently available in your admin system.</p>
                </div>
                <div className="rounded-3xl border border-border/50 bg-muted p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Organization</p>
                  <p className="mt-2 text-3xl font-semibold">{membership?.organization_name ?? "Unknown"}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{membership?.role ? `Role: ${membership.role}` : "Role information not loaded yet."}</p>
                </div>
                <div className="rounded-3xl border border-border/50 bg-muted p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Admin access</p>
                  <p className="mt-2 text-3xl font-semibold">{capabilities ? "Configured" : "Loading"}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {capabilities
                      ? `${capabilities.can_view_admin ? "You can access admin features." : "Limited access mode."}`
                      : "Permissions are being loaded."}
                  </p>
                </div>
                <div className="rounded-3xl border border-border/50 bg-muted p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Hub coverage</p>
                  <p className="mt-2 text-3xl font-semibold">{hubStats.learn + hubStats.social + hubStats.operations}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Models mapped into operations, learning, and social workspaces.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/40 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Workspace Hubs</CardTitle>
                <CardDescription>
                  Choose the hub that matches your task to avoid navigation confusion.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-2xl border border-border/50 p-3">
                  <p className="font-medium">Learn Hub ({hubStats.learn})</p>
                  <p className="text-sm text-muted-foreground">Trivia, stories, articles, and learning content.</p>
                  <Button size="sm" className="mt-2" onClick={() => activateSection("academy")}>Open Learn Hub</Button>
                </div>
                <div className="rounded-2xl border border-border/50 p-3">
                  <p className="font-medium">Social &amp; Media ({hubStats.social})</p>
                  <p className="text-sm text-muted-foreground">Campaigns, quotes, subscribers, and social-facing updates.</p>
                  <Button size="sm" variant="outline" className="mt-2" onClick={() => activateSection("cms")}>Open Social Hub</Button>
                </div>
                <div className="rounded-2xl border border-border/50 p-3">
                  <p className="font-medium">Operations ({hubStats.operations})</p>
                  <p className="text-sm text-muted-foreground">Projects, activities, roadmaps, and impact metrics.</p>
                  <Button size="sm" variant="outline" className="mt-2" onClick={() => activateSection("duty")}>Open Operations</Button>
                </div>
                <div className="rounded-2xl border border-border/50 p-3">
                  <p className="font-medium">Developer Tools ({hubStats.dev})</p>
                  <p className="text-sm text-muted-foreground">Audit logs, setup, and technical diagnostics for developers.</p>
                  <Button size="sm" variant="ghost" className="mt-2" onClick={() => activateSection("org")}>Open Dev Tools</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <WorkflowPanel
            activeModel={activeModel}
            setActiveModel={setActiveModel}
            onModelsLoaded={setModels}
            onProfileLoaded={setProfile}
            capabilities={capabilities}
            membership={membership}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminDashboardPage;
