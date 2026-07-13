"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Teachable } from "@/components/admin/teaching/teachable";
import { useRouteBase, getFullUrl } from "@/lib/route-base";
import { adminModulesApi, type AdminModule } from "@/lib/admin-api";

export default function AdminModulesPage() {
  const router = useRouter();
  const routeBase = useRouteBase();
  const [modules, setModules] = useState<AdminModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchModules = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminModulesApi.list({ search: search || undefined });
      setModules(res.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load modules");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const openBuilder = (id: string, step?: string) => {
    const base = getFullUrl(routeBase, `/dashboard/modules/${id}`);
    router.push(step ? `${base}?step=${step}` : base);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this module and its chapters? Citizens will lose access on the Learning Hub.")) return;
    try {
      await adminModulesApi.delete(id);
      toast.success("Module deleted");
      fetchModules();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const columns: Column<AdminModule>[] = [
    { key: "title", header: "Title", cell: (m) => <span className="font-medium">{m.title}</span> },
    { key: "slug", header: "Slug", cell: (m) => <span className="text-sm text-muted-foreground">{m.slug}</span> },
    {
      key: "status",
      header: "Status",
      cell: (m) => (
        <Badge variant={m.status === "published" ? "default" : "secondary"} className="capitalize text-[10px]">
          {m.status}
        </Badge>
      ),
    },
    {
      key: "chapters",
      header: "Chapters",
      cell: (m) => <span className="tabular-nums text-muted-foreground">{m.chapter_count ?? 0}</span>,
    },
    {
      key: "updated",
      header: "Updated",
      cell: (m) => (
        <span className="text-sm text-muted-foreground">{new Date(m.updated_at).toLocaleDateString()}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-36",
      cell: (m) => (
        <div className="flex items-center gap-1">
          <Teachable tipId="open-builder" title="Open builder" body="Resume the guided setup for this module.">
            <Button variant="ghost" size="icon-sm" title="Open builder" onClick={() => openBuilder(m.id)}>
              <Wand2 className="size-3.5" />
            </Button>
          </Teachable>
          <Button variant="ghost" size="icon-sm" title="Edit details" onClick={() => openBuilder(m.id, "overview")}>
            <Pencil className="size-3.5" />
          </Button>
          <Teachable
            tipId="delete-module"
            title="Delete"
            body="Removes the module and chapters from admin. Confirm before using."
          >
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => handleDelete(m.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </Teachable>
        </div>
      ),
    },
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Learning modules</h1>
          <p className="text-sm text-muted-foreground">
            Civic modules for the public Learning Hub. Open the builder to add chapters, videos, and trivia.
          </p>
        </div>
        <Teachable
          tipId="new-module"
          title="New module"
          body="Opens the builder. Only title and slug are required to create — other steps are optional."
        >
          <Button asChild size="sm">
            <Link href={getFullUrl(routeBase, "/dashboard/modules/new")}>New module</Link>
          </Button>
        </Teachable>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All modules</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={modules}
            loading={loading}
            error={error}
            searchable
            searchValue={search}
            onSearchChange={setSearch}
            onCreate={() => router.push(getFullUrl(routeBase, "/dashboard/modules/new"))}
            createLabel="New module"
          />
        </CardContent>
      </Card>
    </div>
  );
}
