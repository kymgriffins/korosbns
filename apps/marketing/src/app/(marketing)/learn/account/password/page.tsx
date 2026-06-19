"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ContentLayout } from "@/layouts/DashboardShell";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { useChangePassword } from "@/hooks/use-auth-actions";
import { Routes } from "@/constants/routes";

export default function PasswordChangePage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const changePasswordMutation = useChangePassword();

  const hasMinLength = newPassword.length >= 10;
  const hasNumber = /\d/.test(newPassword);
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_-]/.test(newPassword);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!hasMinLength || !hasNumber || !hasUppercase || !hasLowercase || !hasSpecialChar) {
      toast.error("Password does not meet security requirements.");
      return;
    }
    setLoading(true);
    try {
      await changePasswordMutation.mutateAsync({ currentPassword, newPassword });
      toast.success("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      router.push(Routes.Account);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentLayout
        title="Change Password"
        description="Update your account password."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Account", href: Routes.Account },
          { label: "Change Password" },
        ]}
      >
        <div className="max-w-md space-y-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="p-3 bg-muted/30 border border-border/60 rounded-xl space-y-1.5 text-xs">
              <p className="font-semibold text-muted-foreground mb-1">Password requirements:</p>
              <div className="flex items-center gap-2">
                <div className={`size-4 rounded-full flex items-center justify-center text-[10px] ${hasMinLength ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                  <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span className={hasMinLength ? 'text-emerald-500' : 'text-muted-foreground'}>At least 10 characters</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`size-4 rounded-full flex items-center justify-center text-[10px] ${hasNumber ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                  <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span className={hasNumber ? 'text-emerald-500' : 'text-muted-foreground'}>At least one number</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`size-4 rounded-full flex items-center justify-center text-[10px] ${hasUppercase ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                  <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span className={hasUppercase ? 'text-emerald-500' : 'text-muted-foreground'}>At least one uppercase letter</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`size-4 rounded-full flex items-center justify-center text-[10px] ${hasLowercase ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                  <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span className={hasLowercase ? 'text-emerald-500' : 'text-muted-foreground'}>At least one lowercase letter</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`size-4 rounded-full flex items-center justify-center text-[10px] ${hasSpecialChar ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                  <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span className={hasSpecialChar ? 'text-emerald-500' : 'text-muted-foreground'}>At least one special character</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Changing password..." : "Change Password"}
            </Button>
          </form>
        </div>
      </ContentLayout>
  );
}
