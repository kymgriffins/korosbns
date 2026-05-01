"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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
import { AdminAccountSheet } from "@/components/admin/admin-account-sheet";
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
  const [accountOpen, setAccountOpen] = useState(false);

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
      <AdminAccountSheet
        open={accountOpen}
        onOpenChange={setAccountOpen}
        profile={profile}
        onProfileUpdated={(next) => setProfile(next)}
      />
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
        onManageAccount={() => setAccountOpen(true)}
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
          <div className="grid gap-3 p-3 pt-0 sm:p-4 lg:grid-cols-[1.35fr_1fr]">
            <Card className="shadow-sm ring-1 ring-border/20">
              <CardHeader className="space-y-0 pb-3">
                <CardTitle className="text-base">At a glance</CardTitle>
                <CardDescription className="text-xs">
                  Session, organization, and how much of the hub is wired up for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl bg-muted/40 p-3 ring-1 ring-border/15">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Collections</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums">{models.length}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Registered admin models.</p>
                </div>
                <div className="rounded-xl bg-muted/40 p-3 ring-1 ring-border/15">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Organization</p>
                  <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug">
                    {membership?.organization_name ?? "—"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {membership?.role ? membership.role.replace(/_/g, " ") : "Role loading"}
                  </p>
                </div>
                <div className="rounded-xl bg-muted/40 p-3 ring-1 ring-border/15">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Access</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums">{capabilities ? "Live" : "…"}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {capabilities?.can_view_admin ? "RBAC resolved for this session." : "Fetching capabilities."}
                  </p>
                </div>
                <div className="rounded-xl bg-muted/40 p-3 ring-1 ring-border/15">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Hub models</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums">{hubStats.learn + hubStats.social + hubStats.operations}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Ops + learn + social surfaces.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm ring-1 ring-border/20">
              <CardHeader className="space-y-0 pb-2">
                <CardTitle className="text-base">Jump to workspace</CardTitle>
                <CardDescription className="text-xs">Pick where your task lives—sidebar expands the same grouping.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-1.5">
                <button
                  type="button"
                  onClick={() => activateSection("academy")}
                  className="flex w-full flex-col rounded-lg px-3 py-2 text-left ring-1 ring-border/15 transition-colors hover:bg-muted/50"
                >
                  <span className="text-sm font-medium">
                    Learn <span className="text-muted-foreground">· {hubStats.learn}</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground">Stories, trivia, docs, curriculum.</span>
                </button>
                <button
                  type="button"
                  onClick={() => activateSection("cms")}
                  className="flex w-full flex-col rounded-lg px-3 py-2 text-left ring-1 ring-border/15 transition-colors hover:bg-muted/50"
                >
                  <span className="text-sm font-medium">
                    Social &amp; media <span className="text-muted-foreground">· {hubStats.social}</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground">Campaigns, quotes, subscribers.</span>
                </button>
                <button
                  type="button"
                  onClick={() => activateSection("duty")}
                  className="flex w-full flex-col rounded-lg px-3 py-2 text-left ring-1 ring-border/15 transition-colors hover:bg-muted/50"
                >
                  <span className="text-sm font-medium">
                    Operations <span className="text-muted-foreground">· {hubStats.operations}</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground">Projects, roadmap, metrics.</span>
                </button>
                <button
                  type="button"
                  onClick={() => activateSection("org")}
                  className="flex w-full flex-col rounded-lg px-3 py-2 text-left ring-1 ring-border/15 transition-colors hover:bg-muted/50"
                >
                  <span className="text-sm font-medium">
                    Dev tools <span className="text-muted-foreground">· {hubStats.dev}</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground">Users, audit, system records.</span>
                </button>
              </CardContent>
            </Card>
          </div>
        ) : null}
        <div className="flex flex-1 flex-col gap-3 px-3 pb-4 pt-0 sm:gap-4 sm:px-4">
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
