"use client";

import { useState } from "react";
import { Copy, Loader2, RefreshCw, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminMediaApi, adminYouTubeSyncApi, type AdminMediaUploadResult, type YouTubeSyncResult } from "@/lib/admin-api";

export default function MediaAdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [lastUpload, setLastUpload] = useState<AdminMediaUploadResult | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<YouTubeSyncResult | null>(null);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Choose an image file first");
      return;
    }
    setUploading(true);
    try {
      const res = await adminMediaApi.upload(file, altText.trim() || undefined);
      setLastUpload(res);
      toast.success("Uploaded");
      setFile(null);
      setAltText("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await adminYouTubeSyncApi.sync();
      setLastSync(res);
      toast.success(res.status ? `YouTube sync: ${res.status}` : "YouTube sync finished");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "YouTube sync failed (requires org admin/manager)");
    } finally {
      setSyncing(false);
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied");
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Media</h1>
        <p className="text-sm text-muted-foreground">
          Upload images for content bodies and trigger YouTube channel sync.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Image upload</CardTitle>
            <CardDescription>POST /api/v1/content/admin/media/upload/ (multipart)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="media-file">File</Label>
              <Input
                id="media-file"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alt-text">Alt text (optional)</Label>
              <Input
                id="alt-text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe the image"
              />
            </div>
            <Button onClick={handleUpload} disabled={uploading || !file}>
              {uploading ? (
                <Loader2 className="mr-1.5 size-4 animate-spin" />
              ) : (
                <Upload className="mr-1.5 size-4" />
              )}
              Upload
            </Button>

            {lastUpload ? (
              <div className="rounded-md border p-3 space-y-2 text-sm">
                <p className="font-medium">Last upload</p>
                {lastUpload.location || lastUpload.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={lastUpload.location || lastUpload.url}
                    alt={altText || "Uploaded"}
                    className="max-h-40 rounded object-contain bg-muted"
                  />
                ) : null}
                <div className="flex items-start gap-2">
                  <code className="flex-1 break-all text-xs text-muted-foreground">
                    {lastUpload.location || lastUpload.url}
                  </code>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => copyUrl(lastUpload.location || lastUpload.url)}
                  >
                    <Copy className="size-3.5" />
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>YouTube sync</CardTitle>
            <CardDescription>
              POST /api/v1/content/sync/youtube/ — requires org admin or manager.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleSync} disabled={syncing} variant="outline">
              {syncing ? (
                <Loader2 className="mr-1.5 size-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-1.5 size-4" />
              )}
              Sync from RSS
            </Button>
            {lastSync ? (
              <pre className="rounded-md border bg-muted/40 p-3 text-xs overflow-x-auto">
                {JSON.stringify(lastSync, null, 2)}
              </pre>
            ) : (
              <p className="text-sm text-muted-foreground">
                Runs the channel RSS import (created / updated / skipped counts returned by the API).
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
