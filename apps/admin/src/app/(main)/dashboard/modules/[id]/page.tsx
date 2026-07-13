"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { ModuleBuilder } from "@/components/admin/module-builder/module-builder";

function BuilderInner() {
  const params = useParams<{ id: string }>();
  const id = typeof params.id === "string" ? params.id : "new";
  return <ModuleBuilder moduleId={id} />;
}

export default function ModuleBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-2 py-12 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading…
        </div>
      }
    >
      <BuilderInner />
    </Suspense>
  );
}
