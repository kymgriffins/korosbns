"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil } from "lucide-react";
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
import { adminPartnersApi, type AdminPartner } from "@/lib/admin-api";

type Mode = "create" | "edit";

const emptyForm = () => ({
  name: "",
  logo_url: "",
  website_url: "",
  tier: "supporter",
  description: "",
  display_order: "0",
  is_active: true,
  is_consortium: false,
});

export default function PartnersPage() {
  const [partners, setPartners] = useState<AdminPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchPartners = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminPartnersApi.list();
      setPartners(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load partners");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const openCreate = () => {
    setMode("create");
    setEditId(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (p: AdminPartner) => {
    setMode("edit");
    setEditId(p.id);
    setForm({
      name: p.name,
      logo_url: p.logo_url || "",
      website_url: p.website_url || "",
      tier: p.tier || "supporter",
      description: p.description || "",
      display_order: String(p.display_order ?? 0),
      is_active: p.is_active,
      is_consortium: p.is_consortium,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Partner name is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        logo_url: form.logo_url.trim(),
        website_url: form.website_url.trim(),
        tier: form.tier,
        description: form.description.trim(),
        display_order: Number(form.display_order) || 0,
        is_active: form.is_active,
        is_consortium: form.is_consortium,
      };
      if (mode === "create") {
        await adminPartnersApi.create(payload);
        toast.success("Partner created");
      } else if (editId) {
        await adminPartnersApi.update(editId, payload);
        toast.success("Partner updated");
      }
      setDialogOpen(false);
      fetchPartners();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (p: AdminPartner) => {
    if (!confirm(`Deactivate partner "${p.name}"? (Hard delete is not available via JSON API yet.)`)) return;
    try {
      await adminPartnersApi.update(p.id, { is_active: false });
      toast.success("Partner deactivated");
      fetchPartners();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to deactivate partner");
    }
  };

  const filtered = search
    ? partners.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : partners;

  const columns: Column<AdminPartner>[] = [
    {
      key: "name",
      header: "Partner",
      cell: (p) => (
        <div className="flex items-center gap-2">
          {p.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.logo_url} alt="" className="h-6 max-w-[50px] object-contain" />
          ) : null}
          <span className="font-medium">{p.name}</span>
        </div>
      ),
    },
    {
      key: "tier",
      header: "Tier",
      cell: (p) => (
        <Badge variant="secondary" className="text-[10px] capitalize">
          {p.tier}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (p) => (
        <Badge variant={p.is_active ? "default" : "secondary"} className="text-[10px]">
          {p.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "order",
      header: "Order",
      cell: (p) => <span className="tabular-nums text-muted-foreground">{p.display_order}</span>,
    },
    {
      key: "actions",
      header: "",
      className: "w-28",
      cell: (p) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => openEdit(p)}>
            <Pencil className="size-3.5" />
          </Button>
          {p.is_active && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-destructive hover:text-destructive"
              onClick={() => handleDeactivate(p)}
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
        <h1 className="text-2xl font-semibold tracking-tight">Partners</h1>
        <p className="text-sm text-muted-foreground">Manage corporate and consortium partners</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Partners</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filtered}
            loading={loading}
            error={error}
            emptyMessage="No partners registered yet."
            searchable
            searchPlaceholder="Search partners..."
            searchValue={search}
            onSearchChange={setSearch}
            onCreate={openCreate}
            createLabel="Add Partner"
            onRefresh={fetchPartners}
          />
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={mode === "create" ? "Add Partner" : "Edit Partner"}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <div className="space-y-2">
          <Label htmlFor="partner_name">Name</Label>
          <Input
            id="partner_name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="partner_logo">Logo URL</Label>
          <Input
            id="partner_logo"
            type="url"
            value={form.logo_url}
            onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="partner_web">Website URL</Label>
          <Input
            id="partner_web"
            type="url"
            value={form.website_url}
            onChange={(e) => setForm({ ...form, website_url: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Tier</Label>
            <Select value={form.tier} onValueChange={(v) => setForm({ ...form, tier: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sponsor">Sponsor</SelectItem>
                <SelectItem value="partner">Partner</SelectItem>
                <SelectItem value="supporter">Supporter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="partner_order">Display order</Label>
            <Input
              id="partner_order"
              type="number"
              min={0}
              value={form.display_order}
              onChange={(e) => setForm({ ...form, display_order: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="partner_desc">Description</Label>
          <Textarea
            id="partner_desc"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Active</Label>
          <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
        </div>
        <div className="flex items-center justify-between">
          <Label>Consortium founder</Label>
          <Switch
            checked={form.is_consortium}
            onCheckedChange={(v) => setForm({ ...form, is_consortium: v })}
          />
        </div>
      </FormDialog>
    </div>
  );
}
