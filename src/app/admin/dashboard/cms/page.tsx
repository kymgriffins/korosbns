"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Layers, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminHeadlessCmsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/cms");
  }, [router]);

  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
        <Layers className="size-6" />
      </div>
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-foreground">
          CMS Studio Has Moved to /cms
        </h1>
        <p className="text-xs text-muted-foreground max-w-sm">
          The Content Management Studio is now a dedicated, standalone panel at <code className="font-bold text-foreground">/cms</code>. Redirecting you now...
        </p>
      </div>
      <Button asChild className="gap-2 text-xs font-bold mt-2">
        <Link href="/cms">
          <span>Go to /cms Now</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </Button>
    </div>
  );
}
