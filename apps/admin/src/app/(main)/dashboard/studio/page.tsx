"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FormDialog } from "@/components/admin/form-dialog";
import {
  adminProjectApi,
  adminStudioApi,
  normalizeListResponse,
  type AdminProjectConfig,
  type AdminProjectMilestone,
  type AdminStudioBooking,
  type AdminStudioService,
} from "@/lib/admin-api";

type ServiceMode = "create" | "edit";

const emptyService = () => ({
  title: "",
  description: "",
  icon: "",
  price: "",
  order: "0",
  is_published: false,
});

const emptyMilestone = () => ({
  title: "",
  description: "",
  date: "",
  image_url: "",
  milestone_type: "milestone",
  order: "0",
  is_published: false,
});

export default function AdminStudioPage() {
  const [tab, setTab] = useState("services");
  const [services, setServices] = useState<AdminStudioService[]>([]);
  const [bookings, setBookings] = useState<AdminStudioBooking[]>([]);
  const [milestones, setMilestones] = useState<AdminProjectMilestone[]>([]);
  const [config, setConfig] = useState<AdminProjectConfig>({
    mission: "",
    vision: "",
    about_text: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [serviceDialog, setServiceDialog] = useState(false);
  const [serviceMode, setServiceMode] = useState<ServiceMode>("create");
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [milestoneDialog, setMilestoneDialog] = useState(false);
  const [milestoneMode, setMilestoneMode] = useState<ServiceMode>("create");
  const [milestoneId, setMilestoneId] = useState<string | null>(null);
  const [milestoneForm, setMilestoneForm] = useState(emptyMilestone);
  const [bookingNotes, setBookingNotes] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [svc, bkg, ms, cfg] = await Promise.all([
        adminStudioApi.listServices(),
        adminStudioApi.listBookings(),
        adminProjectApi.listMilestones(),
        adminProjectApi.getConfig(),
      ]);
      setServices(normalizeListResponse(svc).results);
      setBookings(bkg.results || []);
      setMilestones(normalizeListResponse(ms).results);
      setConfig(cfg);
      const notes: Record<string, string> = {};
      for (const b of bkg.results || []) notes[b.id] = b.notes || "";
      setBookingNotes(notes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load studio data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const saveService = async () => {
    if (!serviceForm.title.trim()) {
      toast.error("Title required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: serviceForm.title.trim(),
        description: serviceForm.description.trim(),
        icon: serviceForm.icon.trim(),
        price: serviceForm.price.trim(),
        order: Number(serviceForm.order) || 0,
        is_published: serviceForm.is_published,
      };
      if (serviceMode === "create") {
        await adminStudioApi.createService(payload);
        toast.success("Service created");
      } else if (serviceId) {
        await adminStudioApi.updateService(serviceId, payload);
        toast.success("Service updated");
      }
      setServiceDialog(false);
      fetchAll();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const saveMilestone = async () => {
    if (!milestoneForm.title.trim()) {
      toast.error("Title required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: milestoneForm.title.trim(),
        description: milestoneForm.description.trim(),
        date: milestoneForm.date || null,
        image_url: milestoneForm.image_url.trim(),
        milestone_type: milestoneForm.milestone_type,
        order: Number(milestoneForm.order) || 0,
        is_published: milestoneForm.is_published,
      };
      if (milestoneMode === "create") {
        await adminProjectApi.createMilestone(payload);
        toast.success("Milestone created");
      } else if (milestoneId) {
        await adminProjectApi.updateMilestone(milestoneId, payload);
        toast.success("Milestone updated");
      }
      setMilestoneDialog(false);
      fetchAll();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      const updated = await adminProjectApi.updateConfig(config);
      setConfig(updated);
      toast.success("Project config saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const updateBookingStatus = async (booking: AdminStudioBooking, status: string) => {
    try {
      await adminStudioApi.updateBooking(booking.id, {
        status,
        notes: bookingNotes[booking.id] ?? booking.notes,
        is_read: true,
      });
      toast.success("Booking updated");
      fetchAll();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  const serviceColumns: Column<AdminStudioService>[] = [
    {
      key: "title",
      header: "Service",
      cell: (s) => (
        <div>
          <div className="font-medium">{s.title}</div>
          <div className="text-xs text-muted-foreground">{s.price || "—"}</div>
        </div>
      ),
    },
    {
      key: "is_published",
      header: "Published",
      cell: (s) => (
        <Badge variant={s.is_published ? "default" : "secondary"}>
          {s.is_published ? "Yes" : "Draft"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (s) => (
        <div className="flex justify-end gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setServiceMode("edit");
              setServiceId(s.id);
              setServiceForm({
                title: s.title,
                description: s.description || "",
                icon: s.icon || "",
                price: s.price || "",
                order: String(s.order ?? 0),
                is_published: s.is_published,
              });
              setServiceDialog(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={async () => {
              if (!confirm(`Delete "${s.title}"?`)) return;
              try {
                await adminStudioApi.deleteService(s.id);
                toast.success("Deleted");
                fetchAll();
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Delete failed");
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const milestoneColumns: Column<AdminProjectMilestone>[] = [
    {
      key: "title",
      header: "Milestone",
      cell: (m) => (
        <div>
          <div className="font-medium">{m.title}</div>
          <div className="text-xs text-muted-foreground">{m.milestone_type}</div>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date",
      cell: (m) => <span className="text-sm text-muted-foreground">{m.date || "—"}</span>,
    },
    {
      key: "is_published",
      header: "Published",
      cell: (m) => (
        <Badge variant={m.is_published ? "default" : "secondary"}>
          {m.is_published ? "Yes" : "Draft"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (m) => (
        <div className="flex justify-end gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setMilestoneMode("edit");
              setMilestoneId(m.id);
              setMilestoneForm({
                title: m.title,
                description: m.description || "",
                date: m.date || "",
                image_url: m.image_url || "",
                milestone_type: m.milestone_type || "milestone",
                order: String(m.order ?? 0),
                is_published: m.is_published,
              });
              setMilestoneDialog(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={async () => {
              if (!confirm(`Delete "${m.title}"?`)) return;
              try {
                await adminProjectApi.deleteMilestone(m.id);
                toast.success("Deleted");
                fetchAll();
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Delete failed");
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Studio & project</h1>
        <p className="text-sm text-muted-foreground">
          Manage studio services, bookings, project milestones, and public project config.
        </p>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <DataTable
                columns={serviceColumns}
                data={services}
                loading={loading}
                onCreate={() => {
                  setServiceMode("create");
                  setServiceId(null);
                  setServiceForm(emptyService());
                  setServiceDialog(true);
                }}
                createLabel="New service"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="mt-4 space-y-3">
          {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}
          {!loading && !bookings.length ? (
            <p className="text-sm text-muted-foreground">No bookings yet.</p>
          ) : null}
          {bookings.map((b) => (
            <Card key={b.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex flex-wrap items-center gap-2 text-base">
                  {b.name}
                  <Badge variant="secondary">{b.status}</Badge>
                  {!b.is_read ? <Badge>Unread</Badge> : null}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="text-muted-foreground">
                  {b.email} · {b.service_type || "General"} ·{" "}
                  {b.created_at ? new Date(b.created_at).toLocaleString() : ""}
                </div>
                <p>{b.message || "—"}</p>
                <Textarea
                  placeholder="Internal notes"
                  value={bookingNotes[b.id] ?? ""}
                  onChange={(e) =>
                    setBookingNotes((n) => ({ ...n, [b.id]: e.target.value }))
                  }
                  rows={2}
                />
                <div className="flex flex-wrap gap-2">
                  {["contacted", "qualified", "converted", "closed"].map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant="secondary"
                      onClick={() => updateBookingStatus(b, status)}
                    >
                      Mark {status}
                    </Button>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      if (!confirm("Delete booking?")) return;
                      try {
                        await adminStudioApi.deleteBooking(b.id);
                        toast.success("Deleted");
                        fetchAll();
                      } catch (err) {
                        toast.error(err instanceof Error ? err.message : "Delete failed");
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="milestones" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <DataTable
                columns={milestoneColumns}
                data={milestones}
                loading={loading}
                onCreate={() => {
                  setMilestoneMode("create");
                  setMilestoneId(null);
                  setMilestoneForm(emptyMilestone());
                  setMilestoneDialog(true);
                }}
                createLabel="New milestone"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project config</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="space-y-1">
                <Label>Mission</Label>
                <Textarea
                  value={config.mission}
                  onChange={(e) => setConfig((c) => ({ ...c, mission: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="space-y-1">
                <Label>Vision</Label>
                <Textarea
                  value={config.vision}
                  onChange={(e) => setConfig((c) => ({ ...c, vision: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="space-y-1">
                <Label>About</Label>
                <Textarea
                  value={config.about_text}
                  onChange={(e) => setConfig((c) => ({ ...c, about_text: e.target.value }))}
                  rows={4}
                />
              </div>
              <Button onClick={saveConfig} disabled={saving} className="w-fit">
                {saving ? "Saving…" : "Save config"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <FormDialog
        open={serviceDialog}
        onOpenChange={setServiceDialog}
        title={serviceMode === "create" ? "New service" : "Edit service"}
        onSubmit={saveService}
        loading={saving}
      >
        <div className="grid gap-3">
          <div className="space-y-1">
            <Label>Title</Label>
            <Input
              value={serviceForm.title}
              onChange={(e) => setServiceForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              value={serviceForm.description}
              onChange={(e) => setServiceForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Price</Label>
              <Input
                value={serviceForm.price}
                onChange={(e) => setServiceForm((f) => ({ ...f, price: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Order</Label>
              <Input
                type="number"
                value={serviceForm.order}
                onChange={(e) => setServiceForm((f) => ({ ...f, order: e.target.value }))}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={serviceForm.is_published}
              onChange={(e) =>
                setServiceForm((f) => ({ ...f, is_published: e.target.checked }))
              }
            />
            Published
          </label>
        </div>
      </FormDialog>

      <FormDialog
        open={milestoneDialog}
        onOpenChange={setMilestoneDialog}
        title={milestoneMode === "create" ? "New milestone" : "Edit milestone"}
        onSubmit={saveMilestone}
        loading={saving}
      >
        <div className="grid gap-3">
          <div className="space-y-1">
            <Label>Title</Label>
            <Input
              value={milestoneForm.title}
              onChange={(e) => setMilestoneForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              value={milestoneForm.description}
              onChange={(e) =>
                setMilestoneForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={3}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Date</Label>
              <Input
                type="date"
                value={milestoneForm.date}
                onChange={(e) => setMilestoneForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Type</Label>
              <Input
                value={milestoneForm.milestone_type}
                onChange={(e) =>
                  setMilestoneForm((f) => ({ ...f, milestone_type: e.target.value }))
                }
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={milestoneForm.is_published}
              onChange={(e) =>
                setMilestoneForm((f) => ({ ...f, is_published: e.target.checked }))
              }
            />
            Published
          </label>
        </div>
      </FormDialog>
    </div>
  );
}
