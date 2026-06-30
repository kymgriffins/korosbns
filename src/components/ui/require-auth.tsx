"use client";

import { Lock, ShieldX } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

interface RequireAuthProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  roles?: string[];
}

export function RequireAuth({ children, fallback, roles }: RequireAuthProps) {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    if (fallback) return <>{fallback}</>;
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader className="items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Lock className="size-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-lg">Authentication Required</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            Please sign in to access this feature.
          </p>
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (roles && user?.role?.slug && !roles.includes(user.role.slug)) {
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader className="items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <ShieldX className="size-6 text-destructive" />
          </div>
          <CardTitle className="text-lg">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            You do not have the required permissions to access this feature.
          </p>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
