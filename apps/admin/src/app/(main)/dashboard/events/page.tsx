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
import { DataTable, type Column } from "@/components/admin/data-table";
import { FormDialog } from "@/components/admin/form-dialog";
import {
  adminEventsApi,
  normalizeListResponse,
  type AdminEvent,
  type AdminEventGallery,
} from "@/lib/admin-api";

type Mode = "create" | "edit";

const emptyForm = () => ({
  title: "",
  summary: "",
  description: "",
  image_url: "",
  location_url: "",
  physical_location: "",
  starts_at: "",
  ends_at: "",
  is_active: true,
  gallery_url: "",
  gallery_label: "",
});

export default function AdminEventsPage() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [galleries, setGalleries] = useState<AdminEventGallery[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminEventsApi.list();
      setEvents(normalizeListResponse(res).results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const openCreate = () => {
    setMode("create");
    setEditId(null);
    setGalleries([]);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (event: AdminEvent) => {
    setMode("edit");
    setEditId(event.id);
    setGalleries(event.galleries || []);
    setForm({
      title: event.title,
      summary: event.summary || "",
      description: event.description || "",
      image_url: event.image_url || "",
      location_url: event.location_url || "",
      physical_location: event.physical_location || "",
      starts_at: event.starts_at ? event.starts_at.slice(0, 16) : "",
      ends_at: event.ends_at ? event.ends_at.slice(0, 16) : "",
      is_active: event.is_active,
      gallery_url: "",
      gallery_label: "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.starts_at) {
      toast.error("Title and start time are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        summary: form.summary.trim(),
        description: form.description.trim(),
        image_url: form.image_url.trim(),
        location_url: form.location_url.trim(),
        physical_location: form.physical_location.trim(),
        starts_at: new Date(form.starts_at).toISOString(),
        ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
        is_active: form.is_active,
      };
      if (mode === "create") {
        await adminEventsApi.create(payload);
        toast.success("Event created");
        setDialogOpen(false);
      } else if (editId) {
        await adminEventsApi.update(editId, payload);
        toast.success("Event updated");
      }
      fetchEvents();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (event: AdminEvent) => {
    if (!confirm(`Delete event "${event.title}"?`)) return;
    try {
      await adminEventsApi.delete(event.id);
      toast.success("Event deleted");
      fetchEvents();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const addGallery = async () => {
    if (!editId || !form.gallery_url.trim()) {
      toast.error("Gallery URL required");
      return;
    }
    try {
      const link = await adminEventsApi.addGallery(editId, {
        url: form.gallery_url.trim(),
        label: form.gallery_label.trim(),
      });
      setGalleries((prev) => [...prev, link]);
      setForm((f) => ({ ...f, gallery_url: "", gallery_label: "" }));
      toast.success("Gallery link added");
      fetchEvents();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add gallery");
    }
  };

  const removeGallery = async (link: AdminEventGallery) => {
    if (!editId) return;
    try {
      await adminEventsApi.deleteGallery(editId, link.id);
      setGalleries((prev) => prev.filter((g) => g.id !== link.id));
      toast.success("Gallery link removed");
      fetchEvents();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove gallery");
    }
  };

  const columns: Column<AdminEvent>[] = [
    {
      key: "title",
      header: "Event",
      cell: (e) => (
        <div>
          <div className="font-medium">{e.title}</div>
          <div className="text-xs text-muted-foreground line-clamp-1">{e.summary}</div>
        </div>
      ),
    },
    {
      key: "starts_at",
      header: "Starts",
      cell: (e) => (
        <span className="text-sm text-muted-foreground">
          {new Date(e.starts_at).toLocaleString()}
        </span>
      ),
    },
    {
      key: "galleries",
      header: "Galleries",
      cell: (e) => <Badge variant="secondary">{e.galleries?.length ?? 0}</Badge>,
    },
    {
      key: "is_active",
      header: "Status",
      cell: (e) => (
        <Badge variant={e.is_active ? "default" : "secondary"}>
          {e.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (e) => (
        <div className="flex justify-end gap-1">
          <Button size="icon" variant="ghost" onClick={() => openEdit(e)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => handleDelete(e)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Events</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage public events and gallery links.
        </p>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All events</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={events}
            loading={loading}
            searchPlaceholder="Search events…"
            onCreate={openCreate}
            createLabel="New event"
          />
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={mode === "create" ? "Create event" : "Edit event"}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <div className="grid gap-3">
          <div className="space-y-1">
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Summary</Label>
            <Input
              value={form.summary}
              onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Starts</Label>
              <Input
                type="datetime-local"
                value={form.starts_at}
                onChange={(e) => setForm((f) => ({ ...f, starts_at: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Ends</Label>
              <Input
                type="datetime-local"
                value={form.ends_at}
                onChange={(e) => setForm((f) => ({ ...f, ends_at: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Image URL</Label>
            <Input
              value={form.image_url}
              onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Location URL</Label>
            <Input
              value={form.location_url}
              onChange={(e) => setForm((f) => ({ ...f, location_url: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Physical location</Label>
            <Input
              value={form.physical_location}
              onChange={(e) => setForm((f) => ({ ...f, physical_location: e.target.value }))}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
            />
            Active
          </label>

          {mode === "edit" && editId ? (
            <div className="space-y-2 border-t pt-3">
              <Label>Gallery links</Label>
              <ul className="space-y-1 text-sm">
                {galleries.map((g) => (
                  <li key={g.id} className="flex items-center justify-between gap-2">
                    <a href={g.url} className="truncate text-primary underline" target="_blank" rel="noreferrer">
                      {g.label || g.url}
                    </a>
                    <Button size="sm" variant="ghost" onClick={() => removeGallery(g)}>
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
              <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <Input
                  placeholder="Gallery URL"
                  value={form.gallery_url}
                  onChange={(e) => setForm((f) => ({ ...f, gallery_url: e.target.value }))}
                />
                <Input
                  placeholder="Label"
                  value={form.gallery_label}
                  onChange={(e) => setForm((f) => ({ ...f, gallery_label: e.target.value }))}
                />
                <Button type="button" variant="secondary" onClick={addGallery}>
                  Add
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </FormDialog>
    </div>
  );
}
