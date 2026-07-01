"use client";

import Link from "next/link";
import { Button } from "@/ui/button";
import { useAuth } from "@/contexts/auth-context";

type SignUpCtaProps = {
  title?: string;
  description?: string;
  feature?: string;
};

export function SignUpCta({
  title = "Create an account",
  description = "Track your progress, save quizzes, and unlock more content.",
  feature,
}: SignUpCtaProps) {
  const { isLoggedIn, loading } = useAuth();

  if (loading || isLoggedIn) return null;

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-800 dark:bg-blue-950/20">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {feature ? (
              <>
                <span className="font-medium text-foreground">{feature}</span> — {description}
              </>
            ) : (
              description
            )}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button asChild variant="default" size="sm">
            <Link href="/auth/register">Sign up free</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/auth/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
