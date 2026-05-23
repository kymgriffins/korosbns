"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AuthShell } from "@/layouts/AuthShell";
import { Button } from "@/ui/button";
import { Routes } from "@/constants/routes";
import { citizenApi } from "@/lib/api-client";
import { useAuth } from "@/contexts/auth-context";

function InviteContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { isLoggedIn } = useAuth();
  const [status, setStatus] = useState<"loading" | "ok" | "register" | "error">("loading");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setDetail("Missing invitation token.");
      return;
    }
    void citizenApi
      .acceptInvitation(token)
      .then((res) => {
        if (res.status === "requires_registration") {
          setStatus("register");
          setDetail("Create an account, verify your email, then open this link again.");
        } else {
          setStatus("ok");
          setDetail(res.detail || "Invitation accepted.");
          toast.success("Welcome to the organization!");
        }
      })
      .catch((err) => {
        setStatus("error");
        setDetail(err instanceof Error ? err.message : "Could not accept invitation.");
      });
  }, [token, isLoggedIn]);

  return (
    <AuthShell title="Organization invitation">
      <p className="text-center text-sm text-muted-foreground">{detail}</p>
      {status === "register" && (
        <Button asChild className="w-full mt-4">
          <Link href={`${Routes.Register}?invite=${token}`}>Create account</Link>
        </Button>
      )}
      {status === "ok" && (
        <Button asChild className="w-full mt-4">
          <Link href={Routes.Account}>Go to account</Link>
        </Button>
      )}
      {status === "error" && (
        <Button asChild variant="outline" className="w-full mt-4">
          <Link href={Routes.Home}>Home</Link>
        </Button>
      )}
      {status === "loading" && (
        <p className="text-center text-sm mt-4 text-muted-foreground">Processing…</p>
      )}
    </AuthShell>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={<AuthShell title="Invitation">Loading…</AuthShell>}>
      <InviteContent />
    </Suspense>
  );
}
