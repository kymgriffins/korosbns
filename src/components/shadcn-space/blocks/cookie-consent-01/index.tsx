"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/utils";

const CONSENT_KEY = "bns_cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY) || sessionStorage.getItem(CONSENT_KEY);
      if (!stored) {
        setDismissed(false);
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Fallback if storage access is restricted
    }
  }, []);

  const dismiss = (accepted: boolean) => {
    setVisible(false);
    setDismissed(true);
    try {
      localStorage.setItem(CONSENT_KEY, accepted ? "accepted" : "declined");
    } catch {
      try {
        sessionStorage.setItem(CONSENT_KEY, accepted ? "accepted" : "declined");
      } catch {
        // no-op
      }
    }
    if (accepted) {
      toast.success("Cookie preferences saved.");
    }
  };

  if (dismissed) return null;

  return (
    <aside
      aria-label="Cookie Consent Banner"
      className={cn(
        "fixed bottom-4 inset-x-4 sm:left-auto sm:right-6 sm:max-w-lg z-50 transition-all duration-500 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
      )}
    >
      <div className="rounded-2xl border border-border/80 bg-background/95 backdrop-blur-md shadow-2xl p-5 sm:p-6 text-foreground">
        <div className="flex items-start gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Cookie className="h-4 w-4" />
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              This website uses cookies to improve your experience and analyze site usage. See our{" "}
              <Link
                href="/privacy"
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/terms"
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
              >
                Terms & Conditions
              </Link>{" "}
              to learn more.
            </p>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs font-semibold px-4 h-8 border-border/70 hover:bg-muted"
                onClick={() => dismiss(false)}
              >
                Decline
              </Button>
              <Button
                size="sm"
                className="rounded-full text-xs font-semibold px-4 h-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                onClick={() => dismiss(true)}
              >
                Accept Cookies
              </Button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => dismiss(false)}
            aria-label="Close cookie banner"
            className="text-muted-foreground hover:text-foreground rounded-lg p-1 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default CookieConsent;