"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { ContentLayout } from "@/layouts/DashboardShell";
import { FormStatus } from "@/components/citizen/form-status";
import { Button } from "@/components/ui/button";
import { Routes } from "@/constants/routes";
import { useAuth } from "@/contexts/auth-context";

function SignOutConfirm() {
  const { logout, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const confirmSignOut = async () => {
    setLoading(true);
    setError("");
    try {
      await logout();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign out failed.");
      setLoading(false);
    }
  };

  return (
    <ContentLayout
      title="Sign out"
      description="You will need to sign in again to access your account."
      breadcrumbs={[
        { label: "Home", href: Routes.Home },
        { label: "Dashboard", href: Routes.Learn },
        { label: "My Profile", href: Routes.Account },
        { label: "Sign out" },
      ]}
    >
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10">
          <LogOut className="size-6 text-destructive" aria-hidden />
        </div>
        <h2 className="mt-4 text-lg font-semibold">Leave so soon?</h2>
        {user?.email ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">{user.email}</span>
          </p>
        ) : null}
        <p className="mt-1 text-sm text-muted-foreground">
          You will need to sign in again to access your account.
        </p>
        <FormStatus message={error} variant="error" />
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" variant="destructive" disabled={loading} onClick={() => void confirmSignOut()}>
            {loading ? "Signing out…" : "Yes, sign out"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href={Routes.Account}>Cancel</Link>
          </Button>
        </div>
      </div>
    </ContentLayout>
  );
}

export default function SignOutPage() {
  return <SignOutConfirm />;
}
