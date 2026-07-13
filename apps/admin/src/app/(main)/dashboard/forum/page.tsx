"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FormDialog } from "@/components/admin/form-dialog";
import { adminForumApi, type AdminForumThread } from "@/lib/admin-api";

export default function AdminForumPage() {
  const [threads, setThreads] = useState<AdminForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");

  const fetchThreads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminForumApi.listThreads({ page });
      const results = res.results ?? [];
      setThreads(results);
      setTotalPages(Math.max(1, Math.ceil((res.count ?? results.length) / 25)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load threads");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return threads;
    return threads.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.author_name || "").toLowerCase().includes(q) ||
        (t.civic_module || "").toLowerCase().includes(q),
    );
  }, [threads, search]);

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      await adminForumApi.createThread({ title: title.trim() });
      toast.success("Thread created");
      setDialogOpen(false);
      setTitle("");
      fetchThreads();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSoftDelete = async (thread: AdminForumThread) => {
    if (!confirm(`Soft-delete thread "${thread.title}"?`)) return;
    try {
      await adminForumApi.softDeleteThread(thread.id);
      toast.success("Thread deleted");
      fetchThreads();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const columns: Column<AdminForumThread>[] = [
    {
      key: "title",
      header: "Thread",
      cell: (t) => (
        <Link href={`/dashboard/forum/${t.id}`} className="flex items-center gap-2 hover:underline">
          <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
          <span className="font-medium line-clamp-1">{t.title}</span>
        </Link>
      ),
    },
    {
      key: "author",
      header: "Author",
      cell: (t) => <span className="text-sm text-muted-foreground">{t.author_name}</span>,
    },
    {
      key: "posts",
      header: "Posts",
      cell: (t) => (
        <Badge variant="secondary" className="tabular-nums">
          {t.posts_count}
        </Badge>
      ),
    },
    {
      key: "module",
      header: "Module",
      cell: (t) => (
        <span className="text-sm text-muted-foreground">{t.civic_module || "General"}</span>
      ),
    },
    {
      key: "created",
      header: "Created",
      cell: (t) => (
        <span className="text-sm text-muted-foreground">
          {new Date(t.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-16",
      cell: (t) => (
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:text-destructive"
          onClick={() => handleSoftDelete(t)}
        >
          <Trash2 className="size-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Forum</h1>
          <p className="text-sm text-muted-foreground">
            Browse and moderate discussion threads (soft-delete via JSON API).
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setTitle("");
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-1.5 size-4" />
          New thread
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Threads</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filtered}
            loading={loading}
            error={error}
            searchable
            searchValue={search}
            onSearchChange={(v) => {
              setSearch(v);
            }}
            searchPlaceholder="Filter by title, author, module…"
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            emptyMessage="No forum threads yet."
          />
        </CardContent>
      </Card>

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Create Thread"
        onSubmit={handleCreate}
        loading={saving}
        submitLabel="Create"
      >
        <div className="space-y-2">
          <Label htmlFor="thread-title">Title</Label>
          <Input
            id="thread-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Discussion topic"
          />
        </div>
      </FormDialog>
    </div>
  );
}
