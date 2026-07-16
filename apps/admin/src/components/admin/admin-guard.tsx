"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { ADMIN_ROLES } from "@/constants/rbac";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace(`/auth/login?next=${encodeURIComponent("/dashboard")}`);
    }
  }, [loading, isLoggedIn, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !user) return null;

  const roleSlug = user.role?.slug;
  if (!roleSlug || !ADMIN_ROLES.has(roleSlug)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <Card className="mx-auto max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="size-6 text-destructive" />
            </div>
            <CardTitle className="text-lg">Access Restricted</CardTitle>
            <CardDescription className="text-sm">
              This area is limited to administrators and team managers.
              {roleSlug === "citizen" && " Citizen accounts do not have admin access."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button onClick={() => router.push("/dashboard")} variant="outline">
              Go to Dashboard
            </Button>
            <Button onClick={() => router.push("/auth/login")} variant="ghost" size="sm">
              Sign in with a different account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
