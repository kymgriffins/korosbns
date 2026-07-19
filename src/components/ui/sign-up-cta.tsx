"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

type SignUpCtaProps = {
  title?: string;
  description?: string;
  feature?: string;
  /** localStorage key so dismiss persists per surface */
  dismissKey?: string;
};

const DEFAULT_TITLE = "Save your progress";
const DEFAULT_DESCRIPTION =
  "Create a free account to sync progress across devices and personalize your path. All modules stay free to read without signing in.";

export function SignUpCta({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  feature,
  dismissKey = "bns-soft-login-cta-dismissed",
}: SignUpCtaProps) {
  const { isLoggedIn, loading } = useAuth();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(window.localStorage.getItem(dismissKey) === "1");
    } catch {
      setDismissed(false);
    }
  }, [dismissKey]);

  if (loading || isLoggedIn || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(dismissKey, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      data-testid="soft-login-cta"
      className="relative rounded-xl border border-border/60 bg-muted/30 p-5"
      role="complementary"
      aria-label="Optional account prompt"
    >
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Dismiss"
      >
        <X className="size-3.5" />
      </button>
      <div className="flex flex-col items-start gap-4 pr-6 sm:flex-row sm:items-center sm:justify-between">
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
            <Link href="/auth/register">Create free account</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/auth/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
