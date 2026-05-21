"use client";

import { useState } from "react";
import Link from "next/link";
import { ContentLayout } from "@/components/citizen/content-layout";
import { FormStatus } from "@/components/citizen/form-status";
import { Protected } from "@/components/citizen/protected";
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
        { label: "Account", href: Routes.Account },
        { label: "Sign out" },
      ]}
    >
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8">
        <p className="text-sm text-muted-foreground">
          End your session for{" "}
          <span className="font-medium text-foreground">{user?.email || "this account"}</span>?
        </p>
        <FormStatus message={error} variant="error" />
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
  return (
    <Protected>
      <SignOutConfirm />
    </Protected>
  );
}
