"use client";

import { useEffect, useMemo, useState } from "react";
import { Database, Plus, RefreshCw, Trash2, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import Icons from "../global/icons";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "../ui/sidebar";

type ModelField = {
  name: string;
  type: string;
  required: boolean;
  read_only: boolean;
};

type ModelMeta = {
  name: string;
  verbose_name: string;
  fields: ModelField[];
};

type AdminProfile = {
  email?: string;
  first_name?: string;
  last_name?: string;
};

const Dashboard = () => {
  const [models, setModels] = useState<ModelMeta[]>([]);
  const [activeModel, setActiveModel] = useState<string>("");
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [draft, setDraft] = useState<string>("{}");
  const [error, setError] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const loadModels = async () => {
    try {
      setError("");
      const response = await fetch("/api/admin/models", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to load models");
      }
      const payload = (await response.json()) as { models?: ModelMeta[] };
      const list = payload.models ?? [];
      setModels(list);
      if (!activeModel && list.length) {
        setActiveModel(list[0].name);
      }
    } catch {
      setError("Could not load model list from API.");
    }
  };

  const loadItems = async (modelName: string) => {
    if (!modelName) return;
    try {
      setError("");
      const response = await fetch(`/api/admin/models/${modelName}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load records");
      const payload = (await response.json()) as { items?: Record<string, unknown>[] };
      setItems(payload.items ?? []);
    } catch {
      setError("Could not load model records.");
    }
  };

  const loadProfile = async () => {
    try {
      const response = await fetch("/api/auth/profile", { cache: "no-store" });
      if (!response.ok) return;
      const payload = (await response.json()) as AdminProfile;
      setProfile(payload);
    } catch {
      // no-op
    }
  };

  useEffect(() => {
    void loadModels();
    void loadProfile();
  }, []);

  useEffect(() => {
    if (activeModel) {
      void loadItems(activeModel);
    }
  }, [activeModel]);

  const activeMeta = useMemo(
    () => models.find((model) => model.name === activeModel),
    [models, activeModel]
  );

  const createRecord = async () => {
    if (!activeModel) return;
    setSaving(true);
    setError("");

    try {
      const payload = JSON.parse(draft) as Record<string, unknown>;
      const response = await fetch(`/api/admin/models/${activeModel}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error((result as { message?: string })?.message ?? "Create failed.");
      await loadItems(activeModel);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed.");
    } finally {
      setSaving(false);
    }
  };

  const updateRecord = async (pk: string, payload: Record<string, unknown>) => {
    if (!activeModel) return;
    const response = await fetch(`/api/admin/models/${activeModel}/${pk}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error((result as { message?: string })?.message ?? "Update failed");
    await loadItems(activeModel);
  };

  const deleteRecord = async (pk: string) => {
    if (!activeModel) return;
    const response = await fetch(`/api/admin/models/${activeModel}/${pk}`, { method: "DELETE" });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error((result as { message?: string })?.message ?? "Delete failed");
    await loadItems(activeModel);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <Icons.wordmark className="h-5 w-auto text-white" />
          </div>
          <Badge variant="outline" className="mx-2 border-primary/40 text-primary">
            Django Models
          </Badge>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {models.map((model) => (
              <SidebarMenuItem key={model.name}>
                <SidebarMenuButton
                  isActive={activeModel === model.name}
                  onClick={() => setActiveModel(model.name)}
                >
                  <Database className="size-4" />
                  <span>{model.verbose_name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="bg-[#090B10] text-white">
        <header className="border-b border-white/10 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-base font-semibold">Admin CRUD Console</h1>
              {activeMeta ? <Badge variant="secondary">{activeMeta.name}</Badge> : null}
            </div>
            <div className="flex items-center gap-2">
              {profile?.email ? <Badge variant="secondary">{profile.email}</Badge> : null}
              <Button variant="outline" size="sm" onClick={() => void loadModels()}>
                <RefreshCw className="mr-2 size-4" />
                Refresh
              </Button>
              <Button variant="destructive" size="sm" onClick={() => void logout()}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="space-y-4 p-4">
          {error ? <p className="text-sm text-red-300">{error}</p> : null}

          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="size-4" />
                Create {activeMeta?.verbose_name ?? "Record"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={7}
                className="border-white/20 bg-black/30 font-mono text-xs text-white"
              />
              <Button onClick={() => void createRecord()} disabled={saving || !activeModel}>
                <Save className="mr-2 size-4" />
                Create record
              </Button>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle>Records ({items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item) => {
                const pk = String(item.id ?? item.pk ?? "");
                return (
                  <div key={pk} className="rounded-lg border border-white/10 bg-black/20 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <Badge variant="outline">ID: {pk || "unknown"}</Badge>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => void deleteRecord(pk)}
                        disabled={!pk}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </Button>
                    </div>
                    <Textarea
                      defaultValue={JSON.stringify(item, null, 2)}
                      rows={8}
                      className="border-white/20 bg-black/40 font-mono text-xs text-white"
                      onBlur={(event) => {
                        try {
                          const parsed = JSON.parse(event.target.value) as Record<string, unknown>;
                          if (pk) {
                            void updateRecord(pk, parsed);
                          }
                        } catch {
                          setError("Invalid JSON in record editor.");
                        }
                      }}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Dashboard;
