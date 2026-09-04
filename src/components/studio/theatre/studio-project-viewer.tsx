"use client";

import { useEffect, useState } from "react";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { resolveCmsProject } from "@/data/studio-cms";
import { AgencyCaseStudyTemplate } from "@/components/studio/theatre/agency-case-study-template";

type Props = {
  project: StudioProjectEvidence;
};

/**
 * Renders each project as a comprehensive, multi-section Purpose-grade
 * Creative Agency Studio Case Study.
 */
export function StudioProjectViewer({ project }: Props) {
  // Merge CMS draft overlays on the client (localStorage previews).
  const [live, setLive] = useState(project);
  useEffect(() => {
    setLive(resolveCmsProject(project.slug) ?? project);
  }, [project]);

  return <AgencyCaseStudyTemplate project={live} />;
}
