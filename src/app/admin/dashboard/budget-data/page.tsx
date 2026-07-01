"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Trash2, Upload, FileJson } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/admin/data-table";
import { budgetData } from "@/data/budget";
import type { AdminBudgetRecord } from "@/lib/admin-api";

export default function AdminBudgetDataPage() {
  const [records, setRecords] = useState<AdminBudgetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await budgetData.records.fetch();
      setRecords(res.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load budget records");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".json")) { toast.error("Only JSON files are accepted"); return; }
    setUploading(true);
    try {
      await budgetData.records.upload(file);
      toast.success("Budget data uploaded");
      fetchRecords();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this budget record?")) return;
    try { await budgetData.records.delete(id); toast.success("Record deleted"); fetchRecords(); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Delete failed"); }
  };

  const columns: Column<AdminBudgetRecord>[] = [
    { key: "title", header: "Title", cell: (r) => <span className="font-medium">{r.title}</span> },
    { key: "fiscal_year", header: "Fiscal Year", cell: (r) => <Badge variant="secondary">{r.fiscal_year}</Badge> },
    { key: "status", header: "Status", cell: (r) => <Badge variant={r.status === "processed" ? "default" : "secondary"} className="capitalize">{r.status}</Badge> },
    { key: "uploaded", header: "Uploaded", cell: (r) => <span className="text-sm text-muted-foreground">{new Date(r.uploaded_at).toLocaleDateString()}</span> },
    { key: "size", header: "Size", cell: (r) => <span className="text-sm text-muted-foreground">{r.file_size ? `${(r.file_size / 1024).toFixed(1)} KB` : "—"}</span> },
    { key: "actions", header: "", className: "w-24", cell: (r) => (
      <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(r.id)} className="text-destructive hover:text-destructive"><Trash2 className="size-3.5" /></Button>
    )},
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-semibold tracking-tight">Budget Data</h1><p className="text-sm text-muted-foreground">Upload and manage budget JSON records</p></div>
        <div>
          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <Upload className="mr-1.5 size-4" />
            {uploading ? "Uploading..." : "Upload JSON"}
          </Button>
        </div>
      </div>
      <Card><CardHeader><CardTitle>Budget Records</CardTitle></CardHeader>
        <CardContent>
          <DataTable columns={columns} data={records} loading={loading} error={error} emptyMessage="No budget records uploaded yet." />
        </CardContent>
      </Card>
    </div>
  );
}
