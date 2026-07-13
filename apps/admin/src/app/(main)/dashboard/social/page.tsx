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
  adminTikTokApi,
  normalizeListResponse,
  type AdminTikTokVideo,
} from "@/lib/admin-api";

type Mode = "create" | "edit";

const emptyForm = () => ({
  caption: "",
  tiktok_url: "",
  video_url: "",
  cover_image_url: "",
  embed_html: "",
  display_order: "0",
  is_active: true,
  is_featured: false,
});

export default function AdminSocialPage() {
  const [videos, setVideos] = useState<AdminTikTokVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminTikTokApi.list();
      setVideos(normalizeListResponse(res).results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load TikTok videos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const openCreate = () => {
    setMode("create");
    setEditId(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (video: AdminTikTokVideo) => {
    setMode("edit");
    setEditId(video.id);
    setForm({
      caption: video.caption || "",
      tiktok_url: video.tiktok_url || "",
      video_url: video.video_url || "",
      cover_image_url: video.cover_image_url || "",
      embed_html: video.embed_html || "",
      display_order: String(video.display_order ?? 0),
      is_active: video.is_active,
      is_featured: video.is_featured,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        caption: form.caption.trim(),
        tiktok_url: form.tiktok_url.trim(),
        video_url: form.video_url.trim(),
        cover_image_url: form.cover_image_url.trim(),
        embed_html: form.embed_html.trim(),
        display_order: Number(form.display_order) || 0,
        is_active: form.is_active,
        is_featured: form.is_featured,
      };
      if (mode === "create") {
        await adminTikTokApi.create(payload);
        toast.success("TikTok video added");
      } else if (editId) {
        await adminTikTokApi.update(editId, payload);
        toast.success("TikTok video updated");
      }
      setDialogOpen(false);
      fetchVideos();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (video: AdminTikTokVideo) => {
    if (!confirm("Delete this TikTok video?")) return;
    try {
      await adminTikTokApi.delete(video.id);
      toast.success("Deleted");
      fetchVideos();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const columns: Column<AdminTikTokVideo>[] = [
    {
      key: "caption",
      header: "Caption",
      cell: (v) => (
        <div className="max-w-md">
          <div className="line-clamp-2 text-sm">{v.caption || "(no caption)"}</div>
          {v.tiktok_url ? (
            <a
              href={v.tiktok_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-primary underline"
            >
              Open on TikTok
            </a>
          ) : null}
        </div>
      ),
    },
    {
      key: "flags",
      header: "Flags",
      cell: (v) => (
        <div className="flex gap-1">
          <Badge variant={v.is_featured ? "default" : "secondary"}>
            {v.is_featured ? "Featured" : "Standard"}
          </Badge>
          <Badge variant={v.is_active ? "default" : "secondary"}>
            {v.is_active ? "Active" : "Off"}
          </Badge>
        </div>
      ),
    },
    {
      key: "display_order",
      header: "Order",
      cell: (v) => <span className="text-sm">{v.display_order}</span>,
    },
    {
      key: "actions",
      header: "",
      cell: (v) => (
        <div className="flex justify-end gap-1">
          <Button size="icon" variant="ghost" onClick={() => openEdit(v)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => handleDelete(v)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Social media</h1>
        <p className="text-sm text-muted-foreground">
          Manage TikTok videos shown on the public social hub.
        </p>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">TikTok videos</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={videos}
            loading={loading}
            searchPlaceholder="Search captions…"
            onCreate={openCreate}
            createLabel="Add video"
          />
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={mode === "create" ? "Add TikTok video" : "Edit TikTok video"}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <div className="grid gap-3">
          <div className="space-y-1">
            <Label>Caption</Label>
            <Textarea
              value={form.caption}
              onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
              rows={2}
            />
          </div>
          <div className="space-y-1">
            <Label>TikTok URL</Label>
            <Input
              value={form.tiktok_url}
              onChange={(e) => setForm((f) => ({ ...f, tiktok_url: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Video URL</Label>
            <Input
              value={form.video_url}
              onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Cover image URL</Label>
            <Input
              value={form.cover_image_url}
              onChange={(e) => setForm((f) => ({ ...f, cover_image_url: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Embed HTML</Label>
            <Textarea
              value={form.embed_html}
              onChange={(e) => setForm((f) => ({ ...f, embed_html: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="space-y-1">
            <Label>Display order</Label>
            <Input
              type="number"
              value={form.display_order}
              onChange={(e) => setForm((f) => ({ ...f, display_order: e.target.value }))}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
            />
            Active
          </label>
        </div>
      </FormDialog>
    </div>
  );
}
