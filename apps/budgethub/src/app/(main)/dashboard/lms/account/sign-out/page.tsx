"use client";

import { useCallback, useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignOutPage() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = useCallback(() => {
    setSigningOut(true);
    setTimeout(() => {
      router.push("/budgethub");
    }, 1000);
  }, [router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Card className="w-full max-w-sm shadow-xs">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <LogOut className="size-5 text-destructive" />
          </div>
          <CardTitle>Sign Out</CardTitle>
          <CardDescription>Are you sure you want to sign out of your account?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="destructive" className="w-full" disabled={signingOut} onClick={handleSignOut}>
            {signingOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
            {signingOut ? "Signing out..." : "Sign Out"}
          </Button>
          <Button variant="outline" className="w-full" onClick={() => router.back()}>
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
