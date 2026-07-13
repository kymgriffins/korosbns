"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { ModuleBuilder } from "@/components/admin/module-builder/module-builder";

export default function NewModulePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-2 py-12 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading…
        </div>
      }
    >
      <ModuleBuilder moduleId="new" />
    </Suspense>
  );
}
