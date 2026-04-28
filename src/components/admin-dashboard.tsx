"use client";

import { useEffect, useMemo, useState } from "react";
import { Database, Plus, RefreshCw, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

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

interface DashboardProps {
  activeModel: string;
  setActiveModel: (name: string) => void;
  onModelsLoaded?: (models: ModelMeta[]) => void;
  onProfileLoaded?: (profile: AdminProfile) => void;
}

const Dashboard = ({ activeModel, setActiveModel, onModelsLoaded, onProfileLoaded }: DashboardProps) => {
  const [models, setModels] = useState<ModelMeta[]>([]);
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
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
      onModelsLoaded?.(list);
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
      onProfileLoaded?.(payload);
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
      setDraft("{}");
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Admin Console</h2>
          <p className="text-muted-foreground">
            Manage your organization models and data.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => void loadModels()}>
            <RefreshCw className="mr-2 size-4" />
            Sync Schema
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive font-medium">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="size-4" />
              Create {activeMeta?.verbose_name ?? "Record"}
            </CardTitle>
            <CardDescription>
              Enter the record data in JSON format.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <Textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={10}
              className="font-mono text-xs"
              placeholder="{}"
            />
            <Button 
              className="w-full" 
              onClick={() => void createRecord()} 
              disabled={saving || !activeModel}
            >
              <Save className="mr-2 size-4" />
              Create record
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Records ({items.length})</h3>
            {activeMeta && <Badge variant="secondary">{activeMeta.verbose_name}</Badge>}
          </div>
          
          {items.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-12 text-center border-dashed">
              <Database className="size-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground font-medium">No records found for this model.</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {items.map((item) => {
                const pk = String(item.id ?? item.pk ?? "");
                return (
                  <Card key={pk} className="overflow-hidden">
                    <CardHeader className="p-3 bg-muted/50 flex flex-row items-center justify-between space-y-0">
                      <Badge variant="outline" className="font-mono">ID: {pk || "unknown"}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => void deleteRecord(pk)}
                        disabled={!pk}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Textarea
                        defaultValue={JSON.stringify(item, null, 2)}
                        rows={6}
                        className="border-0 focus-visible:ring-0 rounded-none font-mono text-xs bg-transparent"
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
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
