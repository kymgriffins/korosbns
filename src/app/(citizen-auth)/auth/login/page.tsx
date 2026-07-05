"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AuthShell } from "@/layouts/AuthShell";
import { GuestOnly } from "@/components/citizen/guest-only";
import { Routes } from "@/constants/routes";
import { sanitizeRedirectPath } from "@/lib/auth-policy";
import { CitizenLoginForm } from "@/features/auth/citizen-login-form";

function LoginPageInner() {
  const searchParams = useSearchParams();
  const next = sanitizeRedirectPath(searchParams.get("next"), Routes.Learn);

  return (
    <GuestOnly redirectTo={next}>
      <AuthShell title="Sign in" description="Use your verified Budget Ndio Story account.">
        <CitizenLoginForm next={next} />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href={Routes.Reset} className="text-primary hover:underline">
            Forgot password?
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          No account?{" "}
          <Link href={Routes.Register} className="text-primary hover:underline">
            Create one
          </Link>
        </p>
      </AuthShell>
    </GuestOnly>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthShell title="Sign in">Loading…</AuthShell>}>
      <LoginPageInner />
    </Suspense>
  );
}
