"use client";

import { useCallback, useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/admin/data-table";
import { adminAuthorsApi, type AdminAuthor } from "@/lib/admin-api";
import { getInitials } from "@/lib/utils";

/**
 * Authors are derived from published civic modules (GET /content/authors/).
 * There is no write API — create/edit/delete UI removed (Phase 1E.6 blocker).
 */
export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<AdminAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchAuthors = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminAuthorsApi.list();
      setAuthors(res.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load authors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  const filtered = search
    ? authors.filter(
        (a) =>
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          (a.role || "").toLowerCase().includes(search.toLowerCase()) ||
          a.slug.toLowerCase().includes(search.toLowerCase()),
      )
    : authors;

  const columns: Column<AdminAuthor>[] = [
    {
      key: "name",
      header: "Name",
      cell: (a) => (
        <div className="flex items-center gap-2">
          <Avatar className="size-7">
            <AvatarImage src={a.image} alt={a.name} />
            <AvatarFallback className="text-[10px]">{getInitials(a.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{a.name}</p>
            <p className="text-xs text-muted-foreground font-mono">{a.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (a) => <span className="text-sm text-muted-foreground">{a.role || "—"}</span>,
    },
    {
      key: "bio",
      header: "Bio",
      cell: (a) => (
        <span className="text-sm text-muted-foreground line-clamp-1">{a.bio || "—"}</span>
      ),
    },
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Authors</h1>
        <p className="text-sm text-muted-foreground">
          Authors attributed on published civic modules (read-only). Write APIs are not available yet.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Authors</CardTitle>
          <CardDescription>
            Sourced from GET /api/v1/content/authors/. To change authorship, update module authors in
            Django until a CRUD API ships.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filtered}
            loading={loading}
            error={error}
            searchable
            searchValue={search}
            onSearchChange={setSearch}
            emptyMessage="No authors found on published modules."
          />
        </CardContent>
      </Card>
    </div>
  );
}
