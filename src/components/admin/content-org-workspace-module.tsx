"use client";

import Dashboard from "@/components/admin-dashboard";

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

type Props = {
  activeModel: string;
  setActiveModel: (name: string) => void;
  capabilities?: AdminCapabilities | null;
  onModelsLoaded?: (models: any[]) => void;
  onProfileLoaded?: (profile: any) => void;
  membership?: {
    organization_id: string;
    organization_name: string;
    organization_slug: string;
    role: string;
    status: string;
  } | null;
};

export function ContentOrgWorkspaceModule({
  activeModel,
  setActiveModel,
  capabilities,
  onModelsLoaded,
  onProfileLoaded,
  membership,
}: Props) {
  return (
    <div>
      <Dashboard
        key={activeModel}
        activeModel={activeModel}
        setActiveModel={setActiveModel}
        onModelsLoaded={onModelsLoaded}
        onProfileLoaded={onProfileLoaded}
        capabilities={capabilities}
        membership={membership}
        compact
      />
    </div>
  );
}
