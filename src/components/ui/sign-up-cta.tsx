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
      className="relative rounded-3xl border border-border/50 bg-muted/25 p-6 sm:p-7"
      role="complementary"
      aria-label="Optional account prompt"
    >
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Dismiss"
      >
        <X className="size-3.5" />
      </button>
      <div className="flex flex-col items-start gap-5 pr-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <h3 className="text-[15px] font-semibold tracking-tight">{title}</h3>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
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
          <Button asChild variant="default" size="sm" className="h-9 rounded-full px-4 text-xs font-semibold">
            <Link href="/auth/register">Create free account</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-9 rounded-full px-4 text-xs font-semibold">
            <Link href="/auth/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
