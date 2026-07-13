"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminForumApi, type AdminForumThreadDetail } from "@/lib/admin-api";

export default function AdminForumThreadDetailPage() {
  const params = useParams();
  const threadId = String(params.id ?? "");

  const [thread, setThread] = useState<AdminForumThreadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reply, setReply] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchThread = useCallback(async () => {
    if (!threadId) return;
    setLoading(true);
    setError("");
    try {
      const data = await adminForumApi.getThread(threadId);
      setThread(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load thread");
      setThread(null);
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    fetchThread();
  }, [fetchThread]);

  const handleReply = async () => {
    if (!reply.trim()) {
      toast.error("Reply content is required");
      return;
    }
    setSaving(true);
    try {
      await adminForumApi.createPost(threadId, reply.trim());
      toast.success("Reply posted");
      setReply("");
      fetchThread();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to post reply");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading thread…
      </div>
    );
  }

  if (error || !thread) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/forum">
            <ArrowLeft className="mr-1.5 size-4" />
            Back to forum
          </Link>
        </Button>
        <p className="text-sm text-destructive">{error || "Thread not found."}</p>
      </div>
    );
  }

  const posts = thread.posts ?? [];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="space-y-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/forum">
            <ArrowLeft className="mr-1.5 size-4" />
            Back to forum
          </Link>
        </Button>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">{thread.title}</h1>
            <p className="text-sm text-muted-foreground">
              Started by {thread.author_name} · {new Date(thread.created_at).toLocaleString()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{posts.length} posts</Badge>
            <Badge variant="outline">{thread.civic_module || "General"}</Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Soft-delete / post moderation is HTML-only on the Django portal
          (`/dashboard/community/` conversations). No JSON delete API yet — writes for moderation are
          skipped here.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="size-4" />
            Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No posts in this thread yet.</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="rounded-lg border p-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-medium">{post.author_name}</span>
                  <span className="text-muted-foreground">
                    {new Date(post.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{post.content}</p>
                {post.upvotes > 0 && (
                  <Badge variant="secondary" className="tabular-nums">
                    {post.upvotes} upvotes
                  </Badge>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reply</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="forum-reply">Content</Label>
            <Textarea
              id="forum-reply"
              rows={4}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write a reply…"
            />
          </div>
          <Button onClick={handleReply} disabled={saving}>
            {saving && <Loader2 className="mr-1.5 size-4 animate-spin" />}
            Post reply
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
