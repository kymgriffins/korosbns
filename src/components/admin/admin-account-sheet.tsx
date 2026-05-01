"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export type AdminProfilePayload = {
  email?: string;
  first_name?: string;
  last_name?: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: AdminProfilePayload | null;
  onProfileUpdated?: (next: AdminProfilePayload) => void;
};

function formatApiErrors(payload: Record<string, unknown>): string | null {
  if (payload?.detail && typeof payload.detail === "string") {
    return payload.detail;
  }
  const nonField = payload.non_field_errors;
  if (Array.isArray(nonField) && typeof nonField[0] === "string") {
    return nonField[0];
  }
  const msgs: string[] = [];
  for (const [, v] of Object.entries(payload)) {
    if (Array.isArray(v) && v.length && typeof v[0] === "string") {
      msgs.push(v[0]);
    } else if (typeof v === "string") {
      msgs.push(v);
    }
  }
  return msgs[0] ?? null;
}

export function AdminAccountSheet({
  open,
  onOpenChange,
  profile,
  onProfileUpdated,
}: Props) {
  const [profileTabSaving, setProfileTabSaving] = React.useState(false);
  const [passwordSaving, setPasswordSaving] = React.useState(false);
  const [firstName, setFirstName] = React.useState(profile?.first_name ?? "");
  const [lastName, setLastName] = React.useState(profile?.last_name ?? "");
  const [email, setEmail] = React.useState(profile?.email ?? "");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  React.useEffect(() => {
    if (!open || !profile) return;
    setFirstName(profile.first_name ?? "");
    setLastName(profile.last_name ?? "");
    setEmail(profile.email ?? "");
  }, [open, profile?.first_name, profile?.last_name, profile?.email, profile]);

  React.useEffect(() => {
    if (!open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [open]);

  const saveProfile = async () => {
    setProfileTabSaving(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
        }),
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(formatApiErrors(data) || "Could not save profile.");
        return;
      }
      onProfileUpdated?.(data);
      toast.success("Profile saved.");
      onOpenChange(false);
    } finally {
      setProfileTabSaving(false);
    }
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setPasswordSaving(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(formatApiErrors(data) || "Could not update password.");
        return;
      }
      toast.success("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onOpenChange(false);
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton
        className="flex h-full w-full flex-col gap-0 overflow-hidden border-l border-border/30 p-0 sm:max-w-md"
      >
        <SheetHeader className="space-y-1 border-b border-border/20 px-4 py-4 text-left">
          <SheetTitle className="text-base">Your account</SheetTitle>
          <SheetDescription className="text-xs">
            Update how you appear in the hub and rotate your credentials.
          </SheetDescription>
        </SheetHeader>
        <Tabs defaultValue="profile" className="flex min-h-0 flex-1 flex-col gap-0">
          <div className="px-4 pt-3">
            <TabsList className="grid h-9 w-full grid-cols-2 bg-muted/50 p-0.5 ring-1 ring-border/15">
              <TabsTrigger value="profile" className="text-xs">
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="text-xs">
                Password
              </TabsTrigger>
            </TabsList>
          </div>
          <Separator className="my-3 bg-border/30" />

          <ScrollArea className="min-h-[min(340px,calc(100dvh-12rem))] flex-1 px-4 pb-16">
            <TabsContent value="profile" className="mt-0 space-y-3 pb-2">
              <div className="space-y-1.5">
                <Label htmlFor="acct-first" className="text-xs">
                  First name
                </Label>
                <Input
                  id="acct-first"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="acct-last" className="text-xs">
                  Last name
                </Label>
                <Input
                  id="acct-last"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="acct-email" className="text-xs">
                  Email
                </Label>
                <Input
                  id="acct-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 text-sm"
                  autoComplete="email"
                />
              </div>
              <Button
                type="button"
                size="sm"
                className="mt-4 w-full"
                disabled={profileTabSaving}
                onClick={() => void saveProfile()}
              >
                {profileTabSaving ? "Saving…" : "Save profile"}
              </Button>
            </TabsContent>

            <TabsContent value="security" className="mt-0 space-y-3 pb-2">
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Use a strong password you don’t reuse elsewhere.
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="acct-cur-pass" className="text-xs">
                  Current password
                </Label>
                <Input
                  id="acct-cur-pass"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="h-9 text-sm"
                  autoComplete="current-password"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="acct-new-pass" className="text-xs">
                  New password
                </Label>
                <Input
                  id="acct-new-pass"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-9 text-sm"
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="acct-confirm" className="text-xs">
                  Confirm new password
                </Label>
                <Input
                  id="acct-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-9 text-sm"
                  autoComplete="new-password"
                />
              </div>
              <Button
                type="button"
                size="sm"
                className="mt-4 w-full"
                disabled={passwordSaving}
                onClick={() => void changePassword()}
              >
                {passwordSaving ? "Updating…" : "Update password"}
              </Button>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
