"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import Wrapper from "@/components/global/wrapper";
import { Protected } from "@/components/citizen/protected";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Routes } from "@/constants/routes";
import { useAuth } from "@/contexts/auth-context";
import { citizenApi } from "@/lib/api-client";

function AccountForm() {
  const { user, logout, refreshUser } = useAuth();
  const [form, setForm] = useState({
    display_name: "",
    bio: "",
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      display_name: user.display_name || "",
      bio: user.bio || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
    });
  }, [user]);
  const [bookmarks, setBookmarks] = useState<Record<string, unknown>[]>([]);
  const [saving, setSaving] = useState(false);

  const loadBookmarks = () => {
    void citizenApi
      .getBookmarks()
      .then((d) => setBookmarks(d.results || []))
      .catch(() => setBookmarks([]));
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await citizenApi.patchMe(form);
      await refreshUser();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Wrapper className="py-16">
      <div className="max-w-xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your account</h1>
          <Button type="button" variant="outline" onClick={() => void logout()}>
            Sign out
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{user?.email}</p>

        <form onSubmit={save} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display_name">Display name</Label>
            <Input
              id="display_name"
              value={form.display_name}
              onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="first_name">First name</Label>
              <Input
                id="first_name"
                value={form.first_name}
                onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last name</Label>
              <Input
                id="last_name"
                value={form.last_name}
                onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save profile"}
          </Button>
        </form>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Bookmarks</h2>
            <Button type="button" variant="ghost" size="sm" onClick={loadBookmarks}>
              Refresh
            </Button>
          </div>
          {bookmarks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No bookmarks yet. Save content from articles when signed in with membership.
            </p>
          ) : (
            <ul className="text-sm space-y-2">
              {bookmarks.map((b, i) => (
                <li key={i} className="border-b border-border pb-2">
                  {String(b.content_type || "content")} · {String(b.content_id || "")}
                </li>
              ))}
            </ul>
          )}
        </div>

        <Link href={Routes.AccountNotifications} className="text-primary text-sm hover:underline">
          Notification history →
        </Link>
      </div>
    </Wrapper>
  );
}

export default function AccountPage() {
  return (
    <Protected>
      <AccountForm />
    </Protected>
  );
}
