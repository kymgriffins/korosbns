"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Zap } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FormDialog } from "@/components/admin/form-dialog";
import {
  adminGamificationApi,
  type AdminBadge,
  type AdminGamificationRule,
} from "@/lib/admin-api";

type Mode = "create" | "edit";

const emptyBadge = () => ({
  name: "",
  slug: "",
  description: "",
  icon: "",
  points_required: "0",
  condition_type: "points",
  condition_value: "0",
  tier: "none",
  family: "",
  is_active: true,
});

export default function AdminGamificationPage() {
  const [rules, setRules] = useState<AdminGamificationRule[]>([]);
  const [badges, setBadges] = useState<AdminBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingRules, setSavingRules] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [savingBadge, setSavingBadge] = useState(false);
  const [form, setForm] = useState(emptyBadge);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    const settled = await Promise.allSettled([
      adminGamificationApi.listRules(),
      adminGamificationApi.listBadges(),
    ]);
    const failures: string[] = [];
    if (settled[0].status === "fulfilled") setRules(settled[0].value.results ?? []);
    else failures.push("rules");
    if (settled[1].status === "fulfilled") setBadges(settled[1].value.results ?? []);
    else failures.push("badges");
    if (failures.length) setError(`Could not load: ${failures.join(", ")}`);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const updateRuleLocal = (eventType: string, patch: Partial<AdminGamificationRule>) => {
    setRules((prev) => prev.map((r) => (r.event_type === eventType ? { ...r, ...patch } : r)));
  };

  const handleSaveRules = async () => {
    setSavingRules(true);
    try {
      await adminGamificationApi.saveRules(
        rules.map((r) => ({
          event_type: r.event_type,
          points: Number(r.points) || 0,
          is_active: r.is_active,
          description: r.description,
        })),
      );
      toast.success("Rules saved");
      fetchAll();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save rules");
    } finally {
      setSavingRules(false);
    }
  };

  const handleSeed = async () => {
    try {
      const res = await adminGamificationApi.seedRules();
      toast.success(res.detail || `Seeded ${res.created} rules`);
      fetchAll();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Seed failed");
    }
  };

  const openCreateBadge = () => {
    setMode("create");
    setEditId(null);
    setForm(emptyBadge());
    setDialogOpen(true);
  };

  const openEditBadge = (b: AdminBadge) => {
    setMode("edit");
    setEditId(b.id);
    setForm({
      name: b.name,
      slug: b.slug,
      description: b.description || "",
      icon: b.icon || "",
      points_required: String(b.points_required ?? 0),
      condition_type: b.condition_type || "points",
      condition_value: String(b.condition_value ?? 0),
      tier: b.tier || "none",
      family: b.family || "",
      is_active: b.is_active,
    });
    setDialogOpen(true);
  };

  const handleBadgeSubmit = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error("Name and slug are required");
      return;
    }
    setSavingBadge(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        icon: form.icon.trim(),
        points_required: Number(form.points_required) || 0,
        condition_type: form.condition_type,
        condition_value: Number(form.condition_value) || 0,
        tier: form.tier,
        family: form.family.trim(),
        is_active: form.is_active,
      };
      if (mode === "create") {
        await adminGamificationApi.createBadge(payload);
        toast.success("Badge created");
      } else if (editId) {
        await adminGamificationApi.updateBadge(editId, payload);
        toast.success("Badge updated");
      }
      setDialogOpen(false);
      fetchAll();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Badge save failed");
    } finally {
      setSavingBadge(false);
    }
  };

  const handleDeactivateBadge = async (b: AdminBadge) => {
    if (!confirm(`Deactivate badge "${b.name}"?`)) return;
    try {
      await adminGamificationApi.deactivateBadge(b.id);
      toast.success("Badge deactivated");
      fetchAll();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Deactivate failed");
    }
  };

  const badgeColumns: Column<AdminBadge>[] = [
    {
      key: "name",
      header: "Badge",
      cell: (b) => (
        <div className="flex items-center gap-2">
          <span className="text-lg">{b.icon || "🏅"}</span>
          <div>
            <p className="font-medium">{b.name}</p>
            <p className="text-xs text-muted-foreground">{b.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "condition",
      header: "Condition",
      cell: (b) => (
        <span className="text-sm text-muted-foreground">
          {b.condition_type} ≥ {b.condition_value}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (b) => (
        <Badge variant={b.is_active ? "default" : "secondary"} className="text-[10px]">
          {b.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-36",
      cell: (b) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => openEditBadge(b)}>
            <Pencil className="size-3.5" />
          </Button>
          {b.is_active && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-destructive hover:text-destructive"
              onClick={() => handleDeactivateBadge(b)}
            >
              Deactivate
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Gamification</h1>
        <p className="text-sm text-muted-foreground">
          Configure point rules and badges for the learner experience.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <Zap className="size-4" />
            Point rules
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSeed}>
              Seed defaults
            </Button>
            <Button size="sm" onClick={handleSaveRules} disabled={savingRules || loading}>
              Save rules
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            rules.map((rule) => (
              <div
                key={rule.event_type}
                className="grid gap-3 rounded-lg border p-3 md:grid-cols-[1.4fr_100px_80px]"
              >
                <div>
                  <p className="font-medium">{rule.label}</p>
                  <p className="text-xs text-muted-foreground">{rule.hint || rule.event_type}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Points</Label>
                  <Input
                    type="number"
                    min={0}
                    value={rule.points}
                    onChange={(e) =>
                      updateRuleLocal(rule.event_type, { points: Number(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="flex items-end justify-between gap-2 pb-1">
                  <Label className="text-xs">Active</Label>
                  <Switch
                    checked={rule.is_active}
                    onCheckedChange={(v) => updateRuleLocal(rule.event_type, { is_active: v })}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={badgeColumns}
            data={badges}
            loading={loading}
            emptyMessage="No badges yet."
            onCreate={openCreateBadge}
            createLabel="Add badge"
            onRefresh={fetchAll}
          />
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={mode === "create" ? "Create badge" : "Edit badge"}
        onSubmit={handleBadgeSubmit}
        loading={savingBadge}
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Icon</Label>
            <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Family</Label>
            <Input value={form.family} onChange={(e) => setForm({ ...form, family: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Condition type</Label>
            <Select
              value={form.condition_type}
              onValueChange={(v) => setForm({ ...form, condition_type: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="points">Points</SelectItem>
                <SelectItem value="streak_days">Streak days</SelectItem>
                <SelectItem value="content_count">Content count</SelectItem>
                <SelectItem value="courses_completed">Courses completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Condition value</Label>
            <Input
              type="number"
              min={0}
              value={form.condition_value}
              onChange={(e) => setForm({ ...form, condition_value: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Points required</Label>
            <Input
              type="number"
              min={0}
              value={form.points_required}
              onChange={(e) => setForm({ ...form, points_required: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Tier</Label>
            <Select value={form.tier} onValueChange={(v) => setForm({ ...form, tier: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Label>Active</Label>
          <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
        </div>
      </FormDialog>
    </div>
  );
}
