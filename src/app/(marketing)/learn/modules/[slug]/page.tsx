"use client";

import { Suspense } from "react";
import { StudioPage } from "@/features/learn/components/studio-page";
import { ModuleDetailView } from "@/components/learn/module-detail-view";
import { LearnStudioLoading } from "@/features/learn/views/learn-studio-states";

export default function ModuleDetailPage() {
  return (
    <StudioPage width="default" className="!py-4 md:!py-6">
      <Suspense fallback={<LearnStudioLoading />}>
        <ModuleDetailView />
      </Suspense>
    </StudioPage>
  );
}
