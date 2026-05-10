"use client";

import Dashboard from "@/components/admin-dashboard";
import { UsersMembershipsModule } from "@/components/admin/users-memberships-module";
import { TasksWorkflowModule } from "@/components/admin/tasks-workflow-module";
import { AuditLogModule } from "@/components/admin/audit-log-module";
import { ContentOrgWorkspaceModule } from "@/components/admin/content-org-workspace-module";
import { AutomationModule } from "@/components/admin/automation-module";

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

type Props = {
  activeModel: string;
  setActiveModel: (name: string) => void;
  onModelsLoaded?: (models: any[]) => void;
  onProfileLoaded?: (profile: any) => void;
  capabilities?: AdminCapabilities | null;
  membership?: AdminMembership | null;
};

export function WorkflowPanel({
  activeModel,
  setActiveModel,
  onModelsLoaded,
  onProfileLoaded,
  capabilities,
  membership,
}: Props) {
  const contentModels = new Set(["story", "deepdivearticle", "trivia", "document", "knowledgeentry", "teamquote"]);
  const orgModels = new Set(["project", "campaign", "program", "partner", "activity", "impactmetric", "organization"]);

  if (activeModel === "user" || activeModel === "organizationmember") {
    return (
      <UsersMembershipsModule
        canManageUsers={Boolean(capabilities?.can_manage_users)}
        canManageMemberships={Boolean(capabilities?.can_manage_memberships)}
      />
    );
  }

  if (activeModel === "roadmapitem") {
    return (
      <TasksWorkflowModule
        canCreate={Boolean(capabilities?.can_create_records)}
        canEdit={Boolean(capabilities?.can_edit_records)}
        canDelete={Boolean(capabilities?.can_delete_records)}
      />
    );
  }

  if (activeModel === "auditlog") {
    return <AuditLogModule orgId={membership?.organization_id} />;
  }

  if (activeModel === "subscriber") {
    return <AutomationModule />;
  }

  if (contentModels.has(activeModel) || orgModels.has(activeModel)) {
    return (
      <ContentOrgWorkspaceModule
        activeModel={activeModel}
        setActiveModel={setActiveModel}
        onModelsLoaded={onModelsLoaded}
        onProfileLoaded={onProfileLoaded}
        capabilities={capabilities}
        membership={membership}
      />
    );
  }

  return (
    <Dashboard
      key={activeModel}
      activeModel={activeModel}
      setActiveModel={setActiveModel}
      onModelsLoaded={onModelsLoaded}
      onProfileLoaded={onProfileLoaded}
      capabilities={capabilities}
      membership={membership}
    />
  );
}
