"use client";

import { useCallback, useRef, useState } from "react";
import { ArrowLeft, KeyRound, Loader2, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "sonner";
import { citizenApi } from "@/lib/api-client";
import { usePageView } from "@/hooks/use-page-view";

export default function PasswordPage() {
  usePageView();
  const [saving, setSaving] = useState(false);
  const currentRef = useRef<HTMLInputElement>(null);
  const newRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const handleUpdate = useCallback(async () => {
    const current = currentRef.current?.value ?? "";
    const newPass = newRef.current?.value ?? "";
    const confirm = confirmRef.current?.value ?? "";

    if (!current || !newPass || !confirm) {
      toast.error("All password fields are required");
      return;
    }

    if (newPass !== confirm) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPass.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setSaving(true);
    try {
      await citizenApi.changePassword(current, newPass);
      toast.success("Password updated successfully");
      if (currentRef.current) currentRef.current.value = "";
      if (newRef.current) newRef.current.value = "";
      if (confirmRef.current) confirmRef.current.value = "";
    } catch {
      toast.error("Failed to update password");
    } finally {
      setSaving(false);
    }
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/budgethub/dashboard/lms/account"><ArrowLeft className="size-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Change Password</h1>
          <p className="text-sm text-muted-foreground">Update your account password</p>
        </div>
      </div>

      <Card className="mx-auto w-full max-w-md shadow-xs">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="size-5 text-primary" />
          </div>
          <CardTitle>Password</CardTitle>
          <CardDescription>Choose a strong, unique password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <PasswordInput id="currentPassword" ref={currentRef} placeholder="Enter current password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <PasswordInput id="newPassword" ref={newRef} placeholder="Enter new password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <PasswordInput id="confirmPassword" ref={confirmRef} placeholder="Re-enter new password" />
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 shrink-0 text-emerald-500" />
            <span>Use at least 8 characters with a mix of letters, numbers, and symbols</span>
          </div>
          <Button className="w-full" disabled={saving} onClick={handleUpdate}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
            Update Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
