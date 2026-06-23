"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Lock, LogOut, Mail, Save, User } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { citizenApi } from "@/lib/api-client";
import type { UserProfileApi } from "@/lib/api-client";

export default function AccountPage() {
  const [userProfile, setUserProfile] = useState<UserProfileApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const me = await citizenApi.getMe(); setUserProfile(me); } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const displayName = userProfile?.display_name || userProfile?.first_name || "User";
  const avatarUrl = userProfile?.avatar_url || userProfile?.avatar;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Account Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile, password, and account preferences</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Card><CardHeader><Skeleton className="h-5 w-32" /></CardHeader><CardContent className="space-y-3"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></CardContent></Card>
        </div>
      ) : (
        <>
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-sm">Profile Information</CardTitle>
              <CardDescription>Update your display name and public profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="size-16 border-2 border-muted">
                  <AvatarImage src={avatarUrl ?? undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5">
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">Change Avatar</Button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input id="displayName" defaultValue={displayName} placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={userProfile?.email ?? ""} placeholder="your@email.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input id="headline" defaultValue={userProfile?.headline ?? ""} placeholder="e.g. Lifelong Learner" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" defaultValue={userProfile?.bio ?? ""} placeholder="Tell us about yourself..." rows={3} />
              </div>
              <Button disabled={saving}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle className="text-sm">Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/budgethub/dashboard/lms/account/password"><Lock className="size-4" /> Change Password</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle className="text-sm">Sign Out</CardTitle>
                <CardDescription>Sign out of your account on this device</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" size="sm" asChild>
                  <Link href="/budgethub/dashboard/lms/account/sign-out"><LogOut className="size-4" /> Sign Out</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
